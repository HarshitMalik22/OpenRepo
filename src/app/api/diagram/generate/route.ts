import { NextRequest, NextResponse } from 'next/server';
import { getGitHubHeaders } from '@/lib/github-headers';
import { isAIConfigured } from '@/ai/langchain-config';

interface GenerateRequest {
  username: string;
  repo: string;
  instructions?: string;
  github_pat?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateRequest;
    const { username, repo, instructions = '', github_pat } = body;

    if (!username || !repo) {
      return NextResponse.json(
        { error: 'Username and repository are required' },
        { status: 400 }
      );
    }

    // Check if AI is configured
    if (!isAIConfigured()) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Get GitHub repository data
    const githubHeaders = getGitHubHeaders();
    if (github_pat) {
      githubHeaders['Authorization'] = `token ${github_pat}`;
    }
    const repoUrl = `https://api.github.com/repos/${username}/${repo}`;
    
    const [repoResponse, contentsResponse, readmeResponse] = await Promise.all([
      fetch(repoUrl, { headers: githubHeaders }),
      fetch(`${repoUrl}/contents`, { headers: githubHeaders }),
      fetch(`${repoUrl}/readme`, { headers: githubHeaders })
    ]);

    if (!repoResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch repository: ${repoResponse.statusText}` },
        { status: 404 }
      );
    }

    const repoData = await repoResponse.json();
    const contentsData = contentsResponse.ok ? await contentsResponse.json() : [];
    const readmeData = readmeResponse.ok ? await readmeResponse.json() : null;

    // Generate file tree
    const fileTree = await generateFileTree(contentsData, username, repo, githubHeaders);
    
    // Get README content
    let readmeContent = '';
    if (readmeData) {
      const readmeDownloadResponse = await fetch(readmeData.download_url, { headers: githubHeaders });
      if (readmeDownloadResponse.ok) {
        readmeContent = await readmeDownloadResponse.text();
      }
    }

    // Generate diagram using AI
    const diagramResult = await generateDiagramWithAI(
      username,
      repo,
      fileTree,
      readmeContent,
      instructions,
      repoData.default_branch || 'main'
    );

    return NextResponse.json({
      diagram: diagramResult.diagram,
      explanation: diagramResult.explanation,
      repository: {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        default_branch: repoData.default_branch || 'main'
      }
    });

  } catch (error) {
    console.error('Error generating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to generate diagram. Please try again later.' },
      { status: 500 }
    );
  }
}

async function generateFileTree(contents: any[], username: string, repo: string, headers: HeadersInit): Promise<string> {
  let fileTree = '';

  for (const item of contents) {
    if (item.type === 'dir') {
      // Recursively get directory contents
      const dirResponse = await fetch(item.url, { headers });
      if (dirResponse.ok) {
        const dirContents = await dirResponse.json();
        fileTree += `${item.path}/\n`;
        fileTree += await generateFileTree(dirContents, username, repo, headers);
      }
    } else {
      fileTree += `${item.path}\n`;
    }
  }

  return fileTree;
}

async function generateDiagramWithAI(
  username: string,
  repo: string,
  fileTree: string,
  readmeContent: string,
  instructions: string,
  defaultBranch: string
): Promise<{ diagram: string; explanation: string }> {
  // Import AI functions dynamically to avoid server-side issues
  const { createLangChainModel } = await import('@/ai/langchain-config');
  const { ChatPromptTemplate } = await import('@langchain/core/prompts');
  const { StringOutputParser } = await import('@langchain/core/output_parsers');

  const model = createLangChainModel();
  const parser = new StringOutputParser();

  const systemPrompt = `You are an expert software architect that creates detailed Mermaid.js diagrams for repositories.

Based on the provided file tree and README content, generate a comprehensive system architecture diagram in Mermaid.js format.

Requirements:
1. Use "graph TD" (top-down) as the diagram type
2. Create a hierarchical structure showing the main components and their relationships
3. Use proper node shapes: [text] for rectangles, (text) for circles, {text} for diamonds
4. Use --> for arrows between nodes
5. Group related components using subgraph syntax when appropriate
6. Include meaningful labels that describe the purpose of each component
7. Show data flow and dependencies between components
8. Keep the structure clean and readable

The diagram should represent the actual architecture of the repository based on its structure and purpose.

Repository: ${username}/${repo}
Default Branch: ${defaultBranch}
Additional Instructions: ${instructions}

File Tree:
<file_tree>
${fileTree}
</file_tree>

README Content:
<readme>
${readmeContent}
</readme>

Generate ONLY the Mermaid.js diagram code without any additional explanation or markdown formatting.`;

  const humanPrompt = "Generate the Mermaid.js diagram for this repository architecture.";

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ]);

  const chain = prompt.pipe(model).pipe(parser);
  const diagram = await chain.invoke({});

  // Generate explanation
  const explanationPrompt = `Provide a brief explanation of the generated diagram for the repository ${username}/${repo}. Focus on:
1. The main architectural components
2. Key relationships and data flow
3. Important patterns or design decisions
4. Technologies or frameworks used

Keep the explanation concise (2-3 paragraphs) and informative.`;

  const explanationChain = ChatPromptTemplate.fromMessages([
    ["system", "You are an expert software architect who explains repository architectures clearly and concisely."],
    ["human", explanationPrompt],
  ]).pipe(model).pipe(parser);
  
  const explanation = await explanationChain.invoke({});

  return {
    diagram: diagram.trim(),
    explanation: explanation.trim()
  };
}
