 'use server';
/**
 * @fileOverview Explains a given repository using Gemini, providing a flowchart-style breakdown.
 *
 * - explainRepository - A function that initiates the repository explanation process.
 * - ExplainRepositoryInput - The input type for the explainRepository function.
 * - ExplainRepositoryOutput - The return type for the ExplainRepository function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRepositoryInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to explain.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The user\u0027s goal for understanding the repository (e.g., \u0022Understand architecture\u0022).'),
});
export type ExplainRepositoryInput = z.infer<typeof ExplainRepositoryInputSchema>;

const ExplainRepositoryOutputSchema = z.object({
  flowchartMermaid: z.string().describe('A Mermaid.js flowchart representing the repository architecture.'),
  explanation: z.record(z.string(), z.string()).describe('A detailed explanation of key components in the repository.'),
  resources: z.array(
    z.object({
      type: z.string().describe('The type of resource (e.g., \u0022video\u0022, \u0022docs\u0022).'),
      title: z.string().describe('The title of the resource.'),
      url: z.string().describe('The URL of the resource.'),
    })
  ).describe('A list of learning resources related to the repository.'),
});
export type ExplainRepositoryOutput = z.infer<typeof ExplainRepositoryOutputSchema>;

export async function explainRepository(input: ExplainRepositoryInput): Promise<ExplainRepositoryOutput> {
  return explainRepositoryFlow(input);
}

const explainRepositoryPrompt = ai.definePrompt({
  name: 'explainRepositoryPrompt',
  input: {schema: ExplainRepositoryInputSchema},
  output: {schema: ExplainRepositoryOutputSchema},
  prompt: `You are an expert AI assistant that explains open-source repositories to developers.

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

  Repo URL: {{{repoUrl}}}
  Tech Stack: {{#each techStack}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Goal: {{{goal}}}

  The response should be in JSON format.
  Ensure that the "flowchartMermaid" field contains a valid Mermaid.js flowchart diagram that follows the syntax rules above, and the "explanation" field contains a JSON object with keys being components and values being explanations, and the "resources" field contains an array of relevant learning resources.
  `,
});

const explainRepositoryFlow = ai.defineFlow(
  {
    name: 'explainRepositoryFlow',
    inputSchema: ExplainRepositoryInputSchema,
    outputSchema: ExplainRepositoryOutputSchema,
  },
  async input => {
    const {output} = await explainRepositoryPrompt(input);
    return output!;
  }
);
