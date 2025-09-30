'use server';

/**
 * @fileOverview Explains a given repository using LangChain with Gemini, providing a flowchart-style breakdown.
 *
 * - explainRepository - A function that initiates the repository explanation process.
 * - ExplainRepositoryInput - The input type for the explainRepository function.
 * - ExplainRepositoryOutput - The return type for the ExplainRepository function.
 */

import { z } from 'zod';
import { isAIConfigured, createLangChainModel } from '@/ai/langchain-config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const ExplainRepositoryInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to explain.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The user\'s goal for understanding the repository (e.g., "Understand architecture").'),
});
export type ExplainRepositoryInput = z.infer<typeof ExplainRepositoryInputSchema>;

const ExplainRepositoryOutputSchema = z.object({
  flowchartMermaid: z.string().describe('A Mermaid.js flowchart representing the repository architecture.'),
  explanation: z.record(z.string(), z.string()).describe('A detailed explanation of key components in the repository.'),
  resources: z.array(
    z.object({
      type: z.string().describe('The type of resource (e.g., "video", "docs").'),
      title: z.string().describe('The title of the resource.'),
      url: z.string().describe('The URL of the resource.'),
    })
  ).describe('A list of learning resources related to the repository.'),
});
export type ExplainRepositoryOutput = z.infer<typeof ExplainRepositoryOutputSchema>;

const EXPLAIN_REPOSITORY_SYSTEM_PROMPT = `You are an expert AI assistant that explains open-source repositories to developers.

Given a repository URL, tech stack, and the developer's goal, provide a flowchart-style breakdown and explanation of the repository's architecture and key components.

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

Consider the developer's goal when explaining the repository.

Provide your response in a structured format that can be parsed as JSON.`;

const EXPLAIN_REPOSITORY_HUMAN_TEMPLATE = `Repository URL: {repoUrl}
Tech Stack: {techStack}
Goal: {goal}

Please provide:
1. A Mermaid.js flowchart diagram showing the repository architecture
2. A detailed explanation of key components (as a JSON object with component names as keys and explanations as values)
3. A list of relevant learning resources (as an array of objects with type, title, and url fields)

Format your response as a valid JSON object with these fields:
- flowchartMermaid: string containing the Mermaid diagram
- explanation: object with component explanations
- resources: array of learning resources`;

export async function explainRepository(input: ExplainRepositoryInput): Promise<ExplainRepositoryOutput> {
  // Check if AI is properly configured
  if (!isAIConfigured()) {
    throw new Error('AI service is not configured. Please set GEMINI_API_KEY environment variable.');
  }

  try {
    console.log('Explaining repository with LangChain...');
    console.log('Input:', JSON.stringify(input, null, 2));

    // Create the prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", EXPLAIN_REPOSITORY_SYSTEM_PROMPT],
      ["human", EXPLAIN_REPOSITORY_HUMAN_TEMPLATE]
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

    console.log('LangChain explanation generated successfully');

    // Parse the result
    try {
      // Try to parse as JSON first
      const parsedResult = JSON.parse(result);
      
      // Validate the result against our schema
      const validatedResult = ExplainRepositoryOutputSchema.parse(parsedResult);
      return validatedResult;
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, attempting to extract structured data:', parseError);
      
      // Fallback: try to extract structured data from the response
      return extractStructuredData(result);
    }
  } catch (error) {
    console.error('Error in explainRepository:', error);
    throw new Error(`Failed to explain repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to extract structured data from unstructured response
function extractStructuredData(response: string): ExplainRepositoryOutput {
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
  const resources: Array<{type: string; title: string; url: string}> = [];
  const urlMatches = response.match(/https?:\/\/[^\s]+/g);
  if (urlMatches) {
    urlMatches.forEach((url, index) => {
      resources.push({
        type: index === 0 ? 'docs' : index === 1 ? 'video' : 'blog',
        title: `Resource ${index + 1}`,
        url: url
      });
    });
  }

  return {
    flowchartMermaid,
    explanation,
    resources
  };
}
