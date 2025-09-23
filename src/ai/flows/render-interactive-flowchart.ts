// src/ai/flows/render-interactive-flowchart.ts
'use server';

/**
 * @fileOverview Generates an interactive flowchart explanation of a given repository using Gemini API and Mermaid.js.
 *
 * - renderInteractiveFlowchart - A function that takes a repository URL and returns a Mermaid.js flowchart and explanation.
 * - RenderInteractiveFlowchartInput - The input type for the renderInteractiveFlowchart function.
 * - RenderInteractiveFlowchartOutput - The return type for the renderInteractiveFlowchart function.
 */

import {ai, isAIConfigured} from '@/ai/genkit';
import {z} from 'genkit';

const RenderInteractiveFlowchartInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to explain.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
});
export type RenderInteractiveFlowchartInput = z.infer<typeof RenderInteractiveFlowchartInputSchema>;

const RenderInteractiveFlowchartOutputSchema = z.object({
  flowchartMermaid: z.string().describe('The Mermaid.js flowchart diagram with VSCode extension-level detail.'),
  explanation: z
    .array(
      z.object({
        component: z.string().describe('The name of the component from the flowchart.'),
        description: z.string().describe('A detailed explanation of this component with VSCode extension-level depth.'),
        metadata: z.object({
          // File information
          filePath: z.string().optional().describe('The exact file path where this component is located.'),
          startLine: z.number().optional().describe('The starting line number of the component.'),
          endLine: z.number().optional().describe('The ending line number of the component.'),
          fileSize: z.number().optional().describe('File size in bytes.'),
          language: z.string().optional().describe('Programming language used.'),
          
          // Code metrics
          linesOfCode: z.number().optional().describe('Number of lines of code.'),
          cyclomaticComplexity: z.number().optional().describe('Cyclomatic complexity score.'),
          maintainabilityIndex: z.number().optional().describe('Maintainability index score.'),
          
          // Dependencies
          imports: z.array(z.string()).optional().describe('Import statements used.'),
          exports: z.array(z.string()).optional().describe('Export statements provided.'),
          externalDeps: z.array(z.string()).optional().describe('External dependencies.'),
          
          // Testing
          testCoverage: z.number().optional().describe('Test coverage percentage.'),
          testFiles: z.array(z.string()).optional().describe('Related test files.'),
          
          // Performance
          executionTime: z.string().optional().describe('Execution time estimate.'),
          memoryUsage: z.string().optional().describe('Memory usage patterns.'),
          
          // Security
          vulnerabilities: z.number().optional().describe('Number of known vulnerabilities.'),
          securityScore: z.number().optional().describe('Security score out of 100.'),
          
          // Documentation
          hasDocs: z.boolean().optional().describe('Whether documentation exists.'),
          docCoverage: z.number().optional().describe('Documentation coverage percentage.'),
          
          // Status
          status: z.enum(['active', 'stable', 'deprecated', 'experimental']).optional().describe('Development status.'),
          
          // Additional metadata
          designPatterns: z.array(z.string()).optional().describe('Design patterns used.'),
          performanceOptimizations: z.array(z.string()).optional().describe('Performance optimizations applied.'),
          securityMeasures: z.array(z.string()).optional().describe('Security measures implemented.'),
        }).optional().describe('Comprehensive metadata about the component.'),
      })
    )
    .describe('Detailed explanation of components with VSCode extension-level metadata.'),
  resources: z.array(
    z.object({
      type: z.enum(['docs', 'video', 'blog', 'tool', 'repo', 'course']),
      title: z.string(),
      url: z.string(),
      description: z.string().optional().describe('Brief description of the resource.'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('Difficulty level.'),
    })
  ).describe('Comprehensive learning resources with categorization and difficulty levels.'),
  architectureInsights: z.object({
    designPatterns: z.array(z.string()).optional().describe('Design patterns identified in the architecture.'),
    dataFlow: z.string().optional().describe('Description of how data flows through the system.'),
    errorHandling: z.string().optional().describe('Error handling strategies implemented.'),
    scalability: z.string().optional().describe('Scalability considerations and approaches.'),
    performance: z.string().optional().describe('Performance characteristics and optimizations.'),
    security: z.string().optional().describe('Security measures and best practices.'),
    integrations: z.array(z.string()).optional().describe('External integrations and APIs.'),
    deployment: z.string().optional().describe('Deployment strategy and CI/CD pipeline.'),
  }).optional().describe('High-level architecture insights and patterns.'),
});
export type RenderInteractiveFlowchartOutput = z.infer<typeof RenderInteractiveFlowchartOutputSchema>;

export async function renderInteractiveFlowchart(input: RenderInteractiveFlowchartInput): Promise<RenderInteractiveFlowchartOutput> {
  // Debug environment variables
  console.log('=== AI Flow Debug ===');
  console.log('GEMINI_API_KEY in flow:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Check if AI is properly configured
  const configured = isAIConfigured();
  console.log('isAIConfigured() result:', configured);
  
  if (!configured) {
    console.error('AI service is not configured. GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set but invalid' : 'Not set');
    throw new Error('AI service is not configured. Please set GEMINI_API_KEY environment variable.');
  }
  
  console.log('AI is configured, proceeding with flow execution...');
  return renderInteractiveFlowchartFlow(input);
}

const renderInteractiveFlowchartPrompt = ai.definePrompt({
  name: 'renderInteractiveFlowchartPrompt',
  input: {schema: RenderInteractiveFlowchartInputSchema},
  output: {schema: RenderInteractiveFlowchartOutputSchema},
  prompt: `You are an AI expert in explaining open-source repositories with VSCode extension-level depth analysis. Given the following repository URL, tech stack, and learning goal, generate a comprehensive Mermaid.js flowchart diagram and detailed explanation of the repository's architecture.

Repository URL: {{{repoUrl}}}
Tech Stack: {{#each techStack}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Learning Goal: {{{goal}}}

Ensure the flowchart and explanation are tailored to the specified tech stack and learning goal.

## VSCode Extension-Level Analysis Requirements:

### 1. Flowchart Structure (Mermaid.js)
Output the flowchart as a Mermaid.js diagram with these advanced requirements:
- Use "graph TD" (top-down) as the diagram type
- Use comprehensive node shapes and types:
  * [text] for components
  * (text) for modules/hooks
  * {text} for databases/APIs
  * >text] for entry points
  * [[text]] for utilities
  * [(text)] for external services
  * [/text/] for configuration files
  * [\text\] for test files
- Use --> for arrows between nodes with descriptive labels when helpful
- Each node should have a clear, descriptive label indicating its purpose
- Organize nodes in logical architectural layers (entry → components → services → data)
- Use proper indentation and line breaks
- Avoid complex subgraph syntax unless absolutely necessary
- Use simple but descriptive node IDs (e.g., AppEntry, AuthService, UserAPI, PostgreSQL)
- Include error handling and edge case flows
- Show both happy path and alternative flows

### 2. Enhanced Node Metadata
For each component in the explanation, provide comprehensive metadata:
- **File Information**: Exact file path, line numbers, file size, language
- **Code Metrics**: Lines of code, cyclomatic complexity, maintainability index
- **Dependencies**: Import statements, external dependencies, internal dependencies
- **Testing**: Test coverage percentage, related test files, testing framework used
- **Performance**: Execution time estimates, memory usage patterns, bottlenecks
- **Security**: Authentication methods, data validation, encryption, security best practices
- **Documentation**: JSDoc coverage, README references, inline documentation quality
- **Status**: Active development, stable, deprecated, or experimental

### 3. Advanced Architecture Insights
Provide detailed explanations that include:
- **Design Patterns**: MVC, MVVM, Repository, Observer, Singleton, etc.
- **Data Flow**: How data moves through the system, state management strategy
- **Error Handling**: Try-catch blocks, error boundaries, logging strategies
- **Scalability**: Horizontal/vertical scaling considerations, load balancing
- **Performance Optimizations**: Caching strategies, lazy loading, code splitting
- **Security Measures**: Input validation, authentication, authorization, CORS
- **Integration Points**: Third-party services, APIs, databases, external systems
- **Deployment Strategy**: CI/CD pipeline, containerization, environment management

### 4. Learning Resources (MANDATORY - Must include at least 5 real resources)

**CRITICAL REQUIREMENT:** You MUST include a comprehensive "resources" array in your response with at least 5 REAL, WORKING URLs. This is not optional.

**REQUIRED RESOURCE FORMAT:**
Each resource must have these fields:
- type: one of 'docs', 'video', 'blog', 'course', 'tool', 'repo'
- title: specific, descriptive title
- url: real, working URL (must be accessible)
- description: brief description of what the resource covers
- difficulty: one of 'beginner', 'intermediate', 'advanced'

**RESOURCE REQUIREMENTS:**
- **MINIMUM 5 RESOURCES** - You must include at least 5 resources
- **REAL URLs ONLY** - No placeholder URLs like "example.com" or "youtube.com/watch?v=..."
- **SPECIFIC LINKS** - Provide exact, clickable URLs that work today
- **TECH STACK SPECIFIC** - Focus on resources for: {{#each techStack}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- **CURRENT YEAR** - Prioritize resources from 2023-2024
- **REPUTABLE SOURCES** - Use official docs, well-known blogs, popular YouTube channels

**MANDATORY RESOURCE CATEGORIES TO INCLUDE:**
1. **Official Documentation** (at least 1): Direct links to official docs for each technology
2. **Video Tutorials** (at least 1): Specific YouTube videos from channels like freeCodeCamp, Traversy Media, The Net Ninja, Fireship
3. **Blog Posts** (at least 1): Articles from Medium, Dev.to, MDN Web Docs, or official blogs
4. **Interactive Courses** (at least 1): Links to freeCodeCamp, Codecademy, Coursera, or similar
5. **Tools/Extensions** (at least 1): VSCode extensions, CLI tools, or developer utilities

**EXAMPLE REAL RESOURCES (for reference - find actual ones for the tech stack):**
- React docs: "https://react.dev/learn"
- YouTube: "https://www.youtube.com/watch?v=w7ejDZ8SWv8"
- Blog: "https://dev.to/username/react-best-practices-2024"
- Course: "https://www.freecodecamp.org/learn/"
- Tool: "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode"

**WARNING:** If you do not include the "resources" array with at least 5 real URLs, your response will be considered invalid.

Example output structure:
{
  "flowchartMermaid": "graph TD\n    AppEntry[App Entry Point] --> AuthService[Auth Service]\n    AuthService --> UserAPI[User API]\n    UserAPI --> PostgreSQL[(PostgreSQL)]\n    AuthService --> JWTUtil[[JWT Utility]]\n    UserAPI --> Cache[Redis Cache]",
  "explanation": [
    {
      "component": "Auth Service",
      "description": "Handles user authentication and authorization using JWT tokens. Implements OAuth2 integration, password hashing with bcrypt, and session management. Located at src/services/auth.ts with 245 lines of code. Cyclomatic complexity: 8. Maintainability index: 72. Test coverage: 89%. Uses passport.js for authentication strategies.",
      "metadata": {
        "filePath": "src/services/auth.ts",
        "startLine": 1,
        "endLine": 245,
        "linesOfCode": 245,
        "cyclomaticComplexity": 8,
        "maintainabilityIndex": 72,
        "imports": ["passport", "bcrypt", "jsonwebtoken"],
        "testCoverage": 89,
        "testFiles": ["src/tests/auth.test.ts"],
        "performance": "Fast execution with <50ms response time",
        "security": "Uses bcrypt for password hashing, JWT with 1h expiry",
        "status": "active"
      }
    }
  ],
  "resources": [
    { "type": "docs", "title": "Passport.js Authentication", "url": "http://passportjs.org/" },
    { "type": "video", "title": "JWT Authentication Explained", "url": "https://youtube.com/watch?v=..." },
    { "type": "tool", "title": "VSCode REST Client", "url": "https://marketplace.visualstudio.com/..." }
  ]
}`,
});

const renderInteractiveFlowchartFlow = ai.defineFlow(
  {
    name: 'renderInteractiveFlowchartFlow',
    inputSchema: RenderInteractiveFlowchartInputSchema,
    outputSchema: RenderInteractiveFlowchartOutputSchema,
  },
  async input => {
    console.log('Executing AI flow with input:', input);
    try {
      const {output} = await renderInteractiveFlowchartPrompt(input);
      console.log('AI flow output received:', output);
      
      if (!output) {
        throw new Error('AI flow returned no output');
      }
      
      return output;
    } catch (error) {
      console.error('AI flow execution failed:', error);
      throw new Error(`AI flow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);
