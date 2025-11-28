import { NextRequest, NextResponse } from 'next/server';
import { isAIConfigured } from '@/ai/langchain-config';

interface ModifyRequest {
  username: string;
  repo: string;
  currentDiagram: string;
  instructions: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ModifyRequest;
    const { username, repo, currentDiagram, instructions } = body;

    if (!username || !repo || !currentDiagram || !instructions) {
      return NextResponse.json(
        { error: 'Username, repository, current diagram, and instructions are required' },
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

    // Generate modified diagram using AI
    const diagramResult = await modifyDiagramWithAI(
      username,
      repo,
      currentDiagram,
      instructions
    );

    return NextResponse.json({
      diagram: diagramResult.diagram,
      explanation: diagramResult.explanation
    });

  } catch (error) {
    console.error('Error modifying diagram:', error);
    return NextResponse.json(
      { error: 'Failed to modify diagram. Please try again later.' },
      { status: 500 }
    );
  }
}

async function modifyDiagramWithAI(
  username: string,
  repo: string,
  currentDiagram: string,
  instructions: string
): Promise<{ diagram: string; explanation: string }> {
  // Import AI functions dynamically to avoid server-side issues
  const { createLangChainModel } = await import('@/ai/langchain-config');
  const { ChatPromptTemplate } = await import('@langchain/core/prompts');
  const { StringOutputParser } = await import('@langchain/core/output_parsers');

  const model = createLangChainModel();
  const parser = new StringOutputParser();

  const systemPrompt = `You are an expert software architect that modifies Mermaid.js diagrams based on user instructions.

Current diagram for repository ${username}/${repo}:
<current_diagram>
${currentDiagram}
</current_diagram>

User instructions for modification:
<instructions>
${instructions}
</instructions>

Requirements:
1. Maintain the same "graph TD" (top-down) format
2. Keep the overall structure and hierarchy similar unless the instructions specifically request major changes
3. Apply the requested modifications while preserving the diagram's readability and accuracy
4. Use proper node shapes: [text] for rectangles, (text) for circles, {text} for diamonds
5. Use --> for arrows between nodes
6. Ensure all connections and relationships remain logical
7. Keep the structure clean and readable

Generate ONLY the modified Mermaid.js diagram code without any additional explanation or markdown formatting.`;

  const humanPrompt = "Modify the Mermaid.js diagram according to the user's instructions.";

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ]);

  const chain = prompt.pipe(model).pipe(parser);
  const diagram = await chain.invoke({});

  // Generate explanation of changes
  const explanationPrompt = `Explain the modifications made to the diagram for repository ${username}/${repo} based on these instructions: "${instructions}"

Focus on:
1. What specific changes were made to the diagram
2. How these changes improve or alter the architectural representation
3. Any new components or relationships that were added
4. The reasoning behind the modifications

Keep the explanation concise (1-2 paragraphs) and informative.`;

  const explanationChain = ChatPromptTemplate.fromMessages([
    ["system", "You are an expert software architect who explains diagram modifications clearly and concisely."],
    ["human", explanationPrompt],
  ]).pipe(model).pipe(parser);
  
  const explanation = await explanationChain.invoke({});

  return {
    diagram: diagram.trim(),
    explanation: explanation.trim()
  };
}
