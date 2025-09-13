// src/ai/flows/render-interactive-flowchart.ts
'use server';

/**
 * @fileOverview Generates an interactive flowchart explanation of a given repository using Gemini API and Mermaid.js.
 *
 * - renderInteractiveFlowchart - A function that takes a repository URL and returns a Mermaid.js flowchart and explanation.
 * - RenderInteractiveFlowchartInput - The input type for the renderInteractiveFlowchart function.
 * - RenderInteractiveFlowchartOutput - The return type for the renderInteractiveFlowchart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RenderInteractiveFlowchartInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to explain.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
});
export type RenderInteractiveFlowchartInput = z.infer<typeof RenderInteractiveFlowchartInputSchema>;

const RenderInteractiveFlowchartOutputSchema = z.object({
  flowchartMermaid: z.string().describe('The Mermaid.js flowchart diagram.'),
  explanation: z
    .array(
      z.object({
        component: z.string().describe('The name of the component from the flowchart.'),
        description: z.string().describe('A detailed explanation of this component.'),
      })
    )
    .describe('Explanation of the different components in the flowchart.'),
  resources: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      url: z.string(),
    })
  ).describe('A list of relevant learning resources.'),
});
export type RenderInteractiveFlowchartOutput = z.infer<typeof RenderInteractiveFlowchartOutputSchema>;

export async function renderInteractiveFlowchart(input: RenderInteractiveFlowchartInput): Promise<RenderInteractiveFlowchartOutput> {
  return renderInteractiveFlowchartFlow(input);
}

const renderInteractiveFlowchartPrompt = ai.definePrompt({
  name: 'renderInteractiveFlowchartPrompt',
  input: {schema: RenderInteractiveFlowchartInputSchema},
  output: {schema: RenderInteractiveFlowchartOutputSchema},
  prompt: `You are an AI expert in explaining open-source repositories using flowcharts. Given the following repository URL, tech stack, and learning goal, generate a Mermaid.js flowchart diagram and explanation of the repository's architecture.

Repository URL: {{{repoUrl}}}
Tech Stack: {{#each techStack}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Learning Goal: {{{goal}}}

Ensure the flowchart and explanation are tailored to the specified tech stack and learning goal.

Output the flowchart as a Mermaid.js diagram with the following requirements:
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

For the explanation, provide an array of objects, where each object contains a "component" name from the flowchart and a "description" explaining it.
Also include a list of relevant learning resources (videos, documentation, tutorials) related to the repository's tech stack.

Example output:
{
  "flowchartMermaid": "graph TD\n    A[App Start] --> B[Auth]\n    B --> C[API]\n    C --> D[Database]",
  "explanation": [
    { "component": "Auth", "description": "Handles user login with Firebase Auth." },
    { "component": "API", "description": "Logic handled in app/api/... using Route Handlers." },
    { "component": "Database", "description": "Stores application data and user information." }
  ],
  "resources": [
    { "type": "video", "title": "Next.js Auth", "url": "..." },
    { "type": "docs", "title": "Firebase Basics", "url": "..." }
  ]
}
`,
});

const renderInteractiveFlowchartFlow = ai.defineFlow(
  {
    name: 'renderInteractiveFlowchartFlow',
    inputSchema: RenderInteractiveFlowchartInputSchema,
    outputSchema: RenderInteractiveFlowchartOutputSchema,
  },
  async input => {
    const {output} = await renderInteractiveFlowchartPrompt(input);
    return output!;
  }
);
