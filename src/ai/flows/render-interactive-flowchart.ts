'use server';

/**
 * @fileOverview Renders an interactive flowchart for a given repository using LangChain with Gemini.
 *
 * - renderInteractiveFlowchart - A function that generates an interactive flowchart for a repository.
 * - RenderInteractiveFlowchartInput - The input type for the renderInteractiveFlowchart function.
 * - RenderInteractiveFlowchartOutput - The return type for the RenderInteractiveFlowchart function.
 */

import { z } from 'zod';
import { isAIConfigured, createLangChainModel } from '@/ai/langchain-config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const RenderInteractiveFlowchartInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to render.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The user\'s goal for understanding the repository (e.g., "Understand architecture").'),
});
export type RenderInteractiveFlowchartInput = z.infer<typeof RenderInteractiveFlowchartInputSchema>;

const RenderInteractiveFlowchartOutputSchema = z.object({
  flowchartMermaid: z.string().describe('A Mermaid.js flowchart representing the repository architecture.'),
  explanation: z.record(z.string(), z.string()).describe('A detailed explanation of key components in the repository.'),
  resources: z.array(
    z.object({
      type: z.string().describe('The type of resource (e.g., "video", "docs").'),
      title: z.string().describe('The title of the resource.'),
      url: z.string().describe('The URL of the resource.'),
      description: z.string().describe('A brief description of the resource.'),
      difficulty: z.string().describe('The difficulty level of the resource (e.g., "Beginner", "Intermediate", "Advanced").'),
    })
  ).describe('A list of learning resources related to the repository.'),
});
export type RenderInteractiveFlowchartOutput = z.infer<typeof RenderInteractiveFlowchartOutputSchema>;

const RENDER_INTERACTIVE_FLOWCHART_SYSTEM_PROMPT = `You are an expert AI assistant that creates interactive flowcharts for open-source repositories.

Given a repository URL, tech stack, and the developer's goal, provide a comprehensive interactive flowchart breakdown with detailed explanations and learning resources.

The flowchart should be in Mermaid.js format with the following requirements:
- Use "graph TD" (top-down) as the diagram type
- Use proper syntax: node shapes like [text] for rectangles, (text) for circles, {text} for diamonds
- Use --> for arrows between nodes
- Each node should have a clear, descriptive label
- Avoid complex subgraph syntax unless absolutely necessary
- Keep the structure simple and readable
- Use proper indentation and line breaks
- Do not use special characters that might break parsing
- Ensure all opening brackets have corresponding closing brackets
- Use simple node IDs like A, B, C or descriptive short names

Example of valid Mermaid syntax:
graph TD
  A[Main Entry Point] --> B[Core Module]
  B --> C[Utility Functions]
  B --> D[Configuration]
  C --> E[Data Processing]
  D --> F[Settings]

The explanation should be a detailed breakdown of each component.

The learning resources should include at least 5 real, working URLs covering:
- Official documentation
- Video tutorials
- Blog posts
- Online courses
- Developer tools

Each resource should have a type, title, URL, description, and difficulty level.

Consider the developer's goal when creating the flowchart and explanations.

Provide your response in a structured format that can be parsed as JSON.`;

const RENDER_INTERACTIVE_FLOWCHART_HUMAN_TEMPLATE = `Repository URL: {repoUrl}
Tech Stack: {techStack}
Goal: {goal}

Please provide:
1. A Mermaid.js flowchart diagram showing the repository architecture
2. A detailed explanation of key components (as a JSON object with component names as keys and explanations as values)
3. A comprehensive list of learning resources (as an array of objects with type, title, url, description, and difficulty fields)

Format your response as a valid JSON object with these fields:
- flowchartMermaid: string containing the Mermaid diagram
- explanation: object with component explanations
- resources: array of learning resources

IMPORTANT: You MUST provide at least 5 real, working URLs for learning resources. Responses without proper resources will be considered invalid.`;

export async function renderInteractiveFlowchart(input: RenderInteractiveFlowchartInput): Promise<RenderInteractiveFlowchartOutput> {
  // Check if AI is properly configured
  if (!isAIConfigured()) {
    throw new Error('AI service is not configured. Please set GEMINI_API_KEY environment variable.');
  }

  try {
    console.log('Rendering interactive flowchart with LangChain...');
    console.log('Input:', JSON.stringify(input, null, 2));

    // Create the prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", RENDER_INTERACTIVE_FLOWCHART_SYSTEM_PROMPT],
      ["human", RENDER_INTERACTIVE_FLOWCHART_HUMAN_TEMPLATE]
    ]);

    // Format the input for the prompt
    const formattedInput = {
      repoUrl: input.repoUrl,
      techStack: input.techStack.join(', '),
      goal: input.goal
    };

    // Create the model and parser
    const model = createLangChainModel();
    const parser = new StringOutputParser();

    // Create and execute the chain
    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke(formattedInput);

    console.log('LangChain interactive flowchart generated successfully');

    // Parse the result
    try {
      // Try to parse as JSON first
      const parsedResult = JSON.parse(result);
      
      // Validate the result against our schema
      const validatedResult = RenderInteractiveFlowchartOutputSchema.parse(parsedResult);
      return validatedResult;
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, attempting to extract structured data:', parseError);
      
      // Fallback: try to extract structured data from the response
      return extractStructuredData(result);
    }
  } catch (error) {
    console.error('Error in renderInteractiveFlowchart:', error);
    throw new Error(`Failed to render interactive flowchart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to extract structured data from unstructured response
function extractStructuredData(response: string): RenderInteractiveFlowchartOutput {
  // Extract Mermaid chart
  const mermaidMatch = response.match(/graph TD\n([\s\S]*?)(?=\n\n|$)/);
  const flowchartMermaid = mermaidMatch ? `graph TD\n${mermaidMatch[1]}` : '';

  // Extract explanations (simple heuristic)
  const explanation: Record<string, string> = {};
  const componentMatches = response.match(/(\w+(?:\s+\w+)*)\s*:\s*([^\n]+)/g);
  if (componentMatches) {
    componentMatches.forEach(match => {
      const [component, description] = match.split(':').map(s => s.trim());
      if (component && description) {
        explanation[component] = description;
      }
    });
  }

  // Extract resources (simple heuristic)
  const resources: Array<{type: string; title: string; url: string; description: string; difficulty: string}> = [];
  const urlMatches = response.match(/https?:\/\/[^\s]+/g);
  if (urlMatches) {
    urlMatches.forEach((url, index) => {
      const types = ['docs', 'video', 'blog', 'course', 'tool'];
      const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
      
      resources.push({
        type: types[index % types.length],
        title: `Resource ${index + 1}`,
        url: url,
        description: `A learning resource for ${url.includes('youtube') ? 'video content' : url.includes('github') ? 'documentation' : 'additional information'}`,
        difficulty: difficulties[index % difficulties.length]
      });
    });
  }

  return {
    flowchartMermaid,
    explanation,
    resources
  };
}
