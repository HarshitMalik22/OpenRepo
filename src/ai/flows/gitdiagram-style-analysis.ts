'use server';

/**
 * @fileOverview GitDiagram-style repository analysis with 3-step AI process.
 * - gitdiagramStyleAnalysis - A function that performs deep repository analysis using real AI.
 * - GitdiagramStyleAnalysisInput - The input type for the gitdiagramStyleAnalysis function.
 */

import { z } from 'zod';
import { extractOwnerAndRepo } from '@/lib/utils';
import { isAIConfigured, createLangChainModel } from '@/ai/langchain-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getGitHubHeaders } from "@/lib/github-headers";

const GitdiagramStyleAnalysisInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to analyze.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
});
export type GitdiagramStyleAnalysisInput = z.infer<typeof GitdiagramStyleAnalysisInputSchema>;

const GitdiagramStyleAnalysisOutputSchema = z.object({
  mermaidChart: z.string().describe('The generated mermaid chart.'),
  explanation: z.string().describe('Detailed explanation of the system architecture.'),
  componentMapping: z.string().describe('Mapping of components to files/directories.'),
  summary: z.string().describe('A brief summary of the repository structure.'),
});
export type GitdiagramStyleAnalysisOutput = z.infer<typeof GitdiagramStyleAnalysisOutputSchema>;

// Helper function to fetch repository structure
async function fetchRepositoryStructure(owner: string, repo: string) {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenSauce-AI';
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const contents = await response.json();
    return contents.filter((item: any) => item.type === 'dir' || item.type === 'file');
  } catch (error) {
    console.error('Error fetching repository structure:', error);
    return [];
  }
}

// Helper function to fetch README content
async function fetchRepositoryReadme(owner: string, repo: string) {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenSauce-AI';
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers
    });
    
    if (!response.ok) {
      return '';
    }
    
    const data = await response.json();
    
    // Add authorization to README download request if needed
    const readmeHeaders = getGitHubHeaders();
    
    const readmeResponse = await fetch(data.download_url, {
      headers: readmeHeaders
    });
    return await readmeResponse.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    return '';
  }
}

// Helper function to get complete file tree matching GitDiagram's exact approach
async function getCompleteFileTree(owner: string, repo: string): Promise<string> {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenSauce-AI';
    
    // First get default branch
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers
    });
    
    if (!repoResponse.ok) {
      return '';
    }
    
    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch || 'main';
    
    // Try to get file tree using git/trees API (GitDiagram's approach)
    const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
      headers
    });
    
    if (!treeResponse.ok) {
      // Fallback to common branch names
      for (const branch of ['main', 'master']) {
        const fallbackResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
          headers
        });
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          if (data.tree) {
            return filterAndFormatFileTree(data.tree);
          }
        }
      }
      return '';
    }
    
    const data = await treeResponse.json();
    if (data.tree) {
      return filterAndFormatFileTree(data.tree);
    }
    
    return '';
  } catch (error) {
    console.error('Error fetching file tree:', error);
    return '';
  }
}

// File filtering function matching GitDiagram's exact logic
function shouldIncludeFile(path: string): boolean {
  const excludedPatterns = [
    // Dependencies
    'node_modules/',
    'vendor/',
    'venv/',
    // Compiled files
    '.min.',
    '.pyc',
    '.pyo',
    '.pyd',
    '.so',
    '.dll',
    '.class',
    // Asset files
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.ico',
    '.svg',
    '.ttf',
    '.woff',
    '.webp',
    // Cache and temporary files
    '__pycache__/',
    '.cache/',
    '.tmp/',
    // Lock files and logs
    'yarn.lock',
    'poetry.lock',
    '*.log',
    // Configuration files
    '.vscode/',
    '.idea/',
  ];

  return !excludedPatterns.some(pattern => path.toLowerCase().includes(pattern));
}

function filterAndFormatFileTree(tree: any[]): string {
  const paths = tree
    .filter(item => item.type === 'blob' && shouldIncludeFile(item.path))
    .map(item => item.path);
  
  return paths.join('\n');
}

// GitDiagram-style 3-step AI analysis prompts - EXACT copies from GitDiagram
const SYSTEM_FIRST_PROMPT = `You are tasked with explaining to a principal software engineer how to draw the best and most accurate system design diagram / architecture of a given project. This explanation should be tailored to the specific project's purpose and structure. To accomplish this, you will be provided with two key pieces of information:

1. The complete and entire file tree of the project including all directory and file names, which will be enclosed in <file_tree> tags in the users message.

2. The README file of the project, which will be enclosed in <readme> tags in the users message.

Analyze these components carefully, as they will provide crucial information about the project's structure and purpose. Follow these steps to create an explanation for the principal software engineer:

1. Identify the project type and purpose:
   - Examine the file structure and README to determine if the project is a full-stack application, an open-source tool, a compiler, or another type of software imaginable.
   - Look for key indicators in the README, such as project description, features, or use cases.

2. Analyze the file structure:
   - Pay attention to top-level directories and their names (e.g., "frontend", "backend", "src", "lib", "tests").
   - Identify patterns in the directory structure that might indicate architectural choices (e.g., MVC pattern, microservices).
   - Note any configuration files, build scripts, or deployment-related files.

3. Examine the README for additional insights:
   - Look for sections describing the architecture, dependencies, or technical stack.
   - Check for any diagrams or explanations of the system's components.

4. Based on your analysis, explain how to create a system design diagram that accurately represents the project's architecture. Include the following points:

   a. Identify the main components of the system (e.g., frontend, backend, database, external services).
   b. Determine the relationships and interactions between these components.
   c. Highlight any important architectural patterns or design principles used in the project.
   d. Include relevant technologies, frameworks, or libraries that play a significant role in the system's architecture.

5. Provide guidelines for tailoring the diagram to the specific project type:
   - For a full-stack application, emphasize the separation between frontend and backend, database interactions, and any API layers.
   - For an open-source tool, focus on the core functionality, extensibility points, and how it integrates with other systems.
   - For a compiler or language-related project, highlight the different stages of compilation or interpretation, and any intermediate representations.

6. Instruct the principal software engineer to include the following elements in the diagram:
   - Clear labels for each component
   - Directional arrows to show data flow or dependencies
   - Color coding or shapes to distinguish between different types of components

7. NOTE: Emphasize the importance of being very detailed and capturing the essential architectural elements. Don't overthink it too much, simply separating the project into as many components as possible is best.

Present your explanation and instructions within <explanation> tags, ensuring that you tailor your advice to the specific project based on the provided file tree and README content.`;

const SYSTEM_SECOND_PROMPT = `You are tasked with mapping key components of a system design to their corresponding files and directories in a project's file structure. You will be provided with a detailed explanation of the system design/architecture and a file tree of the project.

First, carefully read the system design explanation which will be enclosed in <explanation> tags in the users message.

Then, examine the file tree of the project which will be enclosed in <file_tree> tags in the users message.

Your task is to analyze the system design explanation and identify key components, modules, or services mentioned. Then, try your best to map these components to what you believe could be their corresponding directories and files in the provided file tree.

Guidelines:
1. Focus on major components described in the system design.
2. Look for directories and files that clearly correspond to these components.
3. Include both directories and specific files when relevant.
4. If a component doesn't have a clear corresponding file or directory, simply dont include it in the map.

Now, provide your final answer in the following format:

<component_mapping>
1. [Component Name]: [File/Directory Path]
2. [Component Name]: [File/Directory Path]
[Continue for all identified components]
</component_mapping>

Remember to be as specific as possible in your mappings, only use what is given to you from the file tree, and to strictly follow the components mentioned in the explanation.`;

const SYSTEM_THIRD_PROMPT = `You are a principal software engineer tasked with creating a system design diagram using Mermaid.js based on a detailed explanation. Your goal is to accurately represent the architecture and design of the project as described in the explanation.

The detailed explanation of the design will be enclosed in <explanation> tags in the users message.

Also, sourced from the explanation, as a bonus, a few of the identified components have been mapped to their paths in the project file tree, whether it is a directory or file which will be enclosed in <component_mapping> tags in the users message.

To create the Mermaid.js diagram:

1. Carefully read and analyze the provided design explanation.
2. Identify the main components, services, and their relationships within the system.
3. Determine the appropriate Mermaid.js diagram type to use (e.g., flowchart, sequence diagram, class diagram, architecture, etc.) based on the nature of the system described.
4. Create the Mermaid.js code to represent the design, ensuring that:
   a. All major components are included
   b. Relationships between components are clearly shown
   c. The diagram accurately reflects the architecture described in the explanation
   d. The layout is logical and easy to understand

Guidelines for diagram components and relationships:
- Use appropriate shapes for different types of components (e.g., rectangles for services, cylinders for databases, etc.)
- Use clear and concise labels for each component
- Show the direction of data flow or dependencies using arrows
- Group related components together if applicable
- Include any important notes or annotations mentioned in the explanation
- Just follow the explanation. It will have everything you need.

IMPORTANT!!: Please orient and draw the diagram as vertically as possible. You must avoid long horizontal lists of nodes and sections!

CRITICAL - COLOR APPLICATION INSTRUCTIONS:
You MUST apply the appropriate color classes to ALL nodes in your diagram. Here's how to apply colors:
- Frontend components (React, Vue, Angular, HTML, CSS, UI components): Use :::frontend
- Backend components (API servers, business logic, controllers): Use :::backend  
- Database components (PostgreSQL, MongoDB, MySQL, data stores): Use :::database
- API endpoints/routes: Use :::api
- Services/Microservices: Use :::service
- External/Third-party services: Use :::external
- Core libraries/modules: Use :::core
- Utility/helper functions: Use :::util
- Configuration files: Use :::config
- Test files/modules: Use :::test

Example: 
- FrontendComponent["Frontend Component"]:::frontend
- BackendService["Backend Service"]:::backend
- Database[(Database)]:::database

At the end of your diagram, add class statements to apply styles:
class FrontendComponent1,FrontendComponent2 frontend
class BackendService1,BackendService2 backend
etc.

You must include click events for components of the diagram that have been specified in the provided <component_mapping>:
- Do not try to include the full url. This will be processed by another program afterwards. All you need to do is include the path.
- For example:
  - This is a correct click event: \`click Example "app/example.js"\`
  - This is an incorrect click event: \`click Example "https://github.com/username/repo/blob/main/app/example.js"\`
- Do this for as many components as specified in the component mapping, include directories and files.
  - If you believe the component contains files and is a directory, include the directory path.
  - If you believe the component references a specific file, include the file path.
- Make sure to include the full path to the directory or file exactly as specified in the component mapping.
- It is very important that you do this for as many files as possible. The more the better.

- IMPORTANT: THESE PATHS ARE FOR CLICK EVENTS ONLY, these paths should not be included in the diagram's node's names. Only for the click events. Paths should not be seen by the user.

Your output should be valid Mermaid.js code that can be rendered into a diagram.

Do not include init declarations. This is handled externally. Just return the diagram code.

Your response must strictly be just the Mermaid.js code, without any additional text or explanations.
No code fence or markdown ticks needed, simply return the Mermaid.js code.

Ensure that your diagram adheres strictly to the given explanation, without adding or omitting any significant components or relationships. 

For general direction, the provided example below is how you should structure your code:

\`\`\`mermaid
flowchart TD 
    %% or graph TD, your choice

    %% Global entities
    A("Entity A"):::external
    %% more...

    %% Subgraphs and modules
    subgraph "Layer A"
        A1("Module A"):::example
        %% more modules...
        %% inner subgraphs if needed...
    end

    %% more subgraphs, modules, etc...

    %% Connections
    A -->|"relationship"| B
    %% and a lot more...

    %% Click Events
    click A1 "example/example.js"
    %% and a lot more...

    %% Styles - IMPORTANT: Add these colors to make the diagram visually appealing!
    classDef frontend fill:#90EE90,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#ADD8E6,stroke:#333,stroke-width:2px,color:#000
    classDef database fill:#F0E68C,stroke:#333,stroke-width:2px,color:#000
    classDef api fill:#FFB6C1,stroke:#333,stroke-width:2px,color:#000
    classDef service fill:#DDA0DD,stroke:#333,stroke-width:2px,color:#000
    classDef external fill:#FFA07A,stroke:#333,stroke-width:2px,color:#000
    classDef core fill:#98FB98,stroke:#333,stroke-width:2px,color:#000
    classDef util fill:#F0E68C,stroke:#333,stroke-width:2px,color:#000
    classDef config fill:#D3D3D3,stroke:#333,stroke-width:2px,color:#000
    classDef test fill:#FFFFE0,stroke:#333,stroke-width:2px,color:#000
    
    %% Apply styles to nodes based on their type
    %% Example: class Node1,Node2,Node3 frontend
    %% Make sure to apply appropriate classes to your nodes!
\`\`\`

EXTREMELY Important notes on syntax!!! (PAY ATTENTION TO THIS):
- Make sure to add colour to the diagram!!! This is extremely critical.
- In Mermaid.js syntax, we cannot include special characters for nodes without being inside quotes! For example: \`EX[/api/process (Backend)]:::api\` and \`API -->|calls Process()| Backend\` are two examples of syntax errors. They should be \`EX["/api/process (Backend)"]:::api\` and \`API -->|"calls Process()"| Backend\` respectively. Notice the quotes. This is extremely important. Make sure to include quotes for any string that contains special characters.
- In Mermaid.js syntax, you cannot apply a class style directly within a subgraph declaration. For example: \`subgraph "Frontend Layer":::frontend\` is a syntax error. However, you can apply them to nodes within the subgraph. For example: \`Example["Example Node"]:::frontend\` is valid, and \`class Example1,Example2 frontend\` is valid.
- In Mermaid.js syntax, there cannot be spaces in the relationship label names. For example: \`A -->| "example relationship" | B\` is a syntax error. It should be \`A -->|"example relationship"| B\` 
- In Mermaid.js syntax, you cannot give subgraphs an alias like nodes. For example: \`subgraph A "Layer A"\` is a syntax error. It should be \`subgraph "Layer A"\` 
`;

export async function gitdiagramStyleAnalysis(input: GitdiagramStyleAnalysisInput): Promise<GitdiagramStyleAnalysisOutput> {
  const { repoUrl, techStack, goal } = input;
  
  // Validation checks (matching GitDiagram's approach)
  if (goal.length > 1000) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Instructions exceed maximum length of 1000 characters',
      componentMapping: '',
      summary: 'Instructions too long'
    };
  }
  
  const repoInfo = extractOwnerAndRepo(repoUrl);
  
  if (!repoInfo) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Unable to parse repository URL',
      componentMapping: '',
      summary: 'Unable to parse repository URL'
    };
  }
  
  const { owner, repo } = repoInfo;
  
  // Block example repos (matching GitDiagram's approach)
  const blockedRepos = ['fastapi', 'streamlit', 'flask', 'api-analytics', 'monkeytype'];
  if (blockedRepos.includes(repo.toLowerCase())) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Example repositories cannot be analyzed',
      componentMapping: '',
      summary: 'Example repository blocked'
    };
  }

  // Check if AI is configured
  if (!isAIConfigured()) {
    console.warn('AI not configured, falling back to basic analysis');
    return fallbackAnalysis(owner, repo, techStack);
  }

  try {
    console.log('Starting GitDiagram-style AI analysis...');
    
    // Step 1: Fetch comprehensive repository data
    console.log('Step 1: Fetching repository data...');
    const [structure, readme, completeFileTree] = await Promise.all([
      fetchRepositoryStructure(owner, repo),
      fetchRepositoryReadme(owner, repo),
      getCompleteFileTree(owner, repo)
    ]);

    if (structure.length === 0) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: 'Unable to fetch repository structure',
        componentMapping: '',
        summary: 'Unable to fetch repository structure'
      };
    }

    // Create the LangChain model
    const model = createLangChainModel();
    const parser = new StringOutputParser();

    // Token count check
    const combinedContent = `${completeFileTree}\n${readme}`;
    const tokenCount = estimateTokenCount(combinedContent);
    
    if (tokenCount > 195000) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: `Repository is too large (>195k tokens) for analysis. AI model max context length is 200k tokens. Current size: ${tokenCount} tokens.`,
        componentMapping: '',
        summary: 'Repository too large for analysis'
      };
    }

    // Step 2: Generate detailed system explanation using AI
    console.log('Step 2: Generating system explanation with AI...');
    const firstPrompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_FIRST_PROMPT],
      ['user', `<file_tree>
${completeFileTree.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</file_tree>

<readme>
${readme.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</readme>`]
    ]);

    const firstChain = firstPrompt.pipe(model).pipe(parser);
    const explanation = await firstChain.invoke({});

    // Step 3: Map components to files/directories using AI
    console.log('Step 3: Mapping components to files with AI...');
    const secondPrompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_SECOND_PROMPT],
      ['user', `<explanation>
${explanation.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</explanation>

<file_tree>
${completeFileTree.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</file_tree>`]
    ]);

    const secondChain = secondPrompt.pipe(model).pipe(parser);
    const componentMapping = await secondChain.invoke({});

    // Step 4: Generate detailed Mermaid diagram using AI
    console.log('Step 4: Generating Mermaid diagram with AI...');
    const thirdPrompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_THIRD_PROMPT],
      ['user', `<explanation>
${explanation.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</explanation>

<component_mapping>
${componentMapping.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</component_mapping>

Repository: ${repo}
Owner: ${owner}
GitHub URL: https://github.com/${owner}/${repo}`]
    ]);

    const thirdChain = thirdPrompt.pipe(model).pipe(parser);
    let mermaidChart = await thirdChain.invoke({});
    
    // Check for BAD_INSTRUCTIONS (GitDiagram's approach)
    if (mermaidChart.includes('BAD_INSTRUCTIONS')) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: 'Invalid or unclear instructions provided',
        componentMapping: '',
        summary: 'Invalid instructions'
      };
    }
    
    // Process mermaid code to remove markdown markers (GitDiagram's approach)
    mermaidChart = mermaidChart.replace(/```mermaid/g, '').replace(/```/g, '');
    
    // Process click events to include full GitHub URLs (GitDiagram's approach)
    mermaidChart = processClickEvents(mermaidChart, owner, repo);

    const primaryLanguage = techStack[0] || 'Unknown';
    const directories = structure.filter((item: any) => item.type === 'dir');
    const files = structure.filter((item: any) => item.type === 'file');

    const summary = `${repo} is a ${primaryLanguage} repository with ${directories.length} directories and ${files.length} files. AI-generated architectural analysis completed.`;

    return {
      mermaidChart,
      explanation,
      componentMapping,
      summary
    };
  } catch (error) {
    console.error('Error in GitDiagram-style AI analysis:', error);
    return fallbackAnalysis(owner, repo, techStack);
  }
}

// Fallback analysis when AI is not available or fails
async function fallbackAnalysis(owner: string, repo: string, techStack: string[]): Promise<GitdiagramStyleAnalysisOutput> {
  console.log('Using fallback analysis...');
  
  try {
    const [structure, readme] = await Promise.all([
      fetchRepositoryStructure(owner, repo),
      fetchRepositoryReadme(owner, repo)
    ]);

    if (structure.length === 0) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: 'Unable to fetch repository structure',
        componentMapping: '',
        summary: 'Unable to fetch repository structure'
      };
    }

    // Generate basic explanation
    const projectType = identifyProjectType(structure, techStack);
    const directories = structure.filter((item: any) => item.type === 'dir');
    const files = structure.filter((item: any) => item.type === 'file');

    const explanation = `This ${repo} project is a ${projectType} application built with ${techStack.join(', ')}. 

The repository contains ${directories.length} directories and ${files.length} files. Key directories include: ${directories.slice(0, 5).map((d: any) => d.name).join(', ')}.

${readme ? `Project purpose: ${readme.substring(0, 200)}...` : 'No README available.'}`;

    // Generate basic component mapping
    const componentMapping = `<component_mapping>
1. Main Repository: ${repo}/
2. Source Code: src/
3. Components: components/
4. Configuration: package.json
5. Documentation: README.md
</component_mapping>`;

    // Generate basic mermaid chart
    const mermaidChart = `graph TD
    A["${repo}"] --> B["Source Code"]
    A --> C["Configuration"]
    A --> D["Documentation"]
    
    B --> E["Components"]
    B --> F["Utilities"]
    B --> G["API"]
    
    C --> H["Package.json"]
    C --> I["Build Config"]
    
    D --> J["README"]
    
    classDef primary fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef secondary fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef config fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef docs fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    
    class A primary
    class B,C secondary
    class C config
    class D docs
    
    click A "https://github.com/${owner}/${repo}" _blank
    click J "https://github.com/${owner}/${repo}/blob/main/README.md" _blank
    click H "https://github.com/${owner}/${repo}/blob/main/package.json" _blank`;

    const summary = `${repo} is a ${techStack[0] || 'Unknown'} repository with ${directories.length} directories and ${files.length} files. Basic analysis completed (AI not available).`;

    return {
      mermaidChart,
      explanation,
      componentMapping,
      summary
    };
  } catch (error) {
    console.error('Error in fallback analysis:', error);
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Analysis failed due to an error',
      componentMapping: '',
      summary: 'Analysis failed'
    };
  }
}

function identifyProjectType(structure: any[], techStack: string[]): string {
  const hasNextjs = structure.some((item: any) => 
    item.type === 'file' && item.name.toLowerCase().includes('next.config')
  );
  const hasReact = techStack.includes('React') || techStack.includes('Next.js');
  const hasBackend = structure.some((item: any) => 
    item.type === 'dir' && ['backend', 'server', 'api'].includes(item.name.toLowerCase())
  );
  
  if (hasNextjs) return 'Next.js Full-Stack';
  if (hasReact && hasBackend) return 'React Full-Stack';
  if (hasReact) return 'React Frontend';
  if (hasBackend) return 'Backend API';
  return 'General Purpose';
}

function estimateTokenCount(text: string): number {
  // Simple token estimation: ~4 characters per token on average
  // This is a rough estimate similar to what GitDiagram uses
  return Math.ceil(text.length / 4);
}

function processClickEvents(diagram: string, owner: string, repo: string): string {
  /**
   * Process click events in Mermaid diagram to include full GitHub URLs.
   * Detects if path is file or directory and uses appropriate URL format.
   * Matches GitDiagram's exact approach.
   */
  
  const clickPattern = /click (\S+)\s+["']([^"']+)['"]/g;
  
  return diagram.replace(clickPattern, (match: string, component: string, path: string) => {
    // Determine if path is likely a file (has extension) or directory
    const fileName = path.split("/").pop() || "";
    const isFile = fileName.includes(".");
    
    // Construct GitHub URL (using 'main' as default branch like GitDiagram)
    const baseUrl = `https://github.com/${owner}/${repo}`;
    const pathType = isFile ? "blob" : "tree";
    const fullUrl = `${baseUrl}/${pathType}/main/${path}`;
    
    // Return the full click event with the new URL
    return `click ${component} "${fullUrl}"`;
  });
}

const getFallbackMermaidChart = () => {
  return `flowchart TD
    A["Repository Analysis"]:::core
    B["Architecture Overview"]:::backend
    C["Component Structure"]:::frontend
    D["Data Flow"]:::service
    E["Dependencies"]:::external
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    %% Styles
    classDef core fill:#98FB98,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#ADD8E6,stroke:#333,stroke-width:2px,color:#000
    classDef frontend fill:#90EE90,stroke:#333,stroke-width:2px,color:#000
    classDef service fill:#DDA0DD,stroke:#333,stroke-width:2px,color:#000
    classDef external fill:#FFA07A,stroke:#333,stroke-width:2px,color:#000
    
    class A core
    class B backend
    class C frontend
    class D service
    class E external`;
};
