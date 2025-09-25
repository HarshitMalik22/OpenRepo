'use server';

/**
 * @fileOverview Generates a truly dynamic flowchart based on real repository code analysis instead of AI guessing.
 * 
 * - dynamicArchitectureAnalysis - A function that performs real code analysis and generates accurate flowcharts.
 * - DynamicArchitectureAnalysisInput - The input type for the dynamicArchitectureAnalysis function.
 * - DynamicArchitectureAnalysisOutput - The return type for the dynamicArchitectureAnalysis function.
 */

import {ai, isAIConfigured} from '@/ai/genkit';
import {z} from 'genkit';
import { ArchitectureAnalyzer } from '@/lib/architecture-analyzer';
import { DynamicFlowchartGenerator } from '@/lib/dynamic-flowchart-generator';
import { extractOwnerAndRepo } from '@/lib/utils';

const DynamicArchitectureAnalysisInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to analyze.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
  includeMetrics: z.boolean().optional().default(true).describe('Whether to include detailed code metrics.'),
  optimizeLayout: z.boolean().optional().default(true).describe('Whether to optimize the flowchart layout.'),
});
export type DynamicArchitectureAnalysisInput = z.infer<typeof DynamicArchitectureAnalysisInputSchema>;

const DynamicArchitectureAnalysisOutputSchema = z.object({
  flowchartData: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['entry', 'component', 'service', 'database', 'external', 'config', 'api', 'hook', 'util', 'test']),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      layer: z.number(),
      filePath: z.string().optional(),
      complexity: z.number(),
      importance: z.number(),
      metadata: z.object({
        linesOfCode: z.number(),
        language: z.string(),
        patterns: z.array(z.string()),
        dependencies: z.array(z.string()),
        dependents: z.array(z.string()),
        isEntry: z.boolean().optional(),
        isAsync: z.boolean().optional(),
        hasErrorHandling: z.boolean().optional(),
      }),
    })),
    connections: z.array(z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum(['import', 'export', 'call', 'dependency', 'inheritance']),
      strength: z.number(),
    })),
    layers: z.object({
      entry: z.object({ y: z.number(), height: z.number() }),
      presentation: z.object({ y: z.number(), height: z.number() }),
      business: z.object({ y: z.number(), height: z.number() }),
      data: z.object({ y: z.number(), height: z.number() }),
      infrastructure: z.object({ y: z.number(), height: z.number() }),
    }),
    metrics: z.object({
      totalNodes: z.number(),
      totalConnections: z.number(),
      averageComplexity: z.number(),
      coupling: z.number(),
      cohesion: z.number(),
    }),
  }),
  architectureInsights: z.object({
    designPatterns: z.array(z.string()).describe('Design patterns identified in the architecture.'),
    dataFlow: z.string().describe('Description of how data flows through the system.'),
    errorHandling: z.string().describe('Error handling strategies implemented.'),
    scalability: z.string().describe('Scalability considerations and approaches.'),
    performance: z.string().describe('Performance characteristics and optimizations.'),
    security: z.string().describe('Security measures and best practices.'),
    integrations: z.array(z.string()).describe('External integrations and APIs.'),
    deployment: z.string().describe('Deployment strategy and CI/CD pipeline.'),
    complexityAnalysis: z.object({
      highComplexityComponents: z.array(z.object({
        name: z.string(),
        complexity: z.number(),
        filePath: z.string(),
        reasons: z.array(z.string()),
      })),
      refactoringSuggestions: z.array(z.object({
        component: z.string(),
        suggestion: z.string(),
        priority: z.enum(['low', 'medium', 'high']),
      })),
    }),
  }),
  mermaidChart: z.string().describe('Mermaid.js representation of the flowchart for fallback rendering.'),
  analysisSummary: z.string().describe('Summary of the architecture analysis findings.'),
});
export type DynamicArchitectureAnalysisOutput = z.infer<typeof DynamicArchitectureAnalysisOutputSchema>;

export async function dynamicArchitectureAnalysis(input: DynamicArchitectureAnalysisInput): Promise<DynamicArchitectureAnalysisOutput> {
  console.log('Starting dynamic architecture analysis...');
  
  // Check if AI is configured for insights generation
  const aiConfigured = isAIConfigured();
  if (!aiConfigured) {
    console.warn('AI not configured, proceeding with code analysis only');
  }
  
  return dynamicArchitectureAnalysisFlow(input);
}

const dynamicArchitectureAnalysisFlow = ai.defineFlow(
  {
    name: 'dynamicArchitectureAnalysisFlow',
    inputSchema: DynamicArchitectureAnalysisInputSchema,
    outputSchema: DynamicArchitectureAnalysisOutputSchema,
  },
  async input => {
    try {
      console.log('Starting dynamic architecture analysis flow...');
      console.log('Input:', JSON.stringify(input, null, 2));
      
      console.log('Extracting repository info...');
      const repoInfo = extractOwnerAndRepo(input.repoUrl);
      if (!repoInfo) {
        throw new Error('Invalid repository URL format');
      }
      
      console.log(`Analyzing repository: ${repoInfo.owner}/${repoInfo.repo}`);
      
      // Step 1: Perform real code analysis
      console.log('Step 1: Performing real code analysis...');
      try {
        const analyzer = new ArchitectureAnalyzer();
        const architectureAnalysis = await analyzer.analyzeRepository(repoInfo.owner, repoInfo.repo, 4); // Increased depth to 4 to reach nested directories
        
        console.log(`Analysis complete: ${architectureAnalysis.nodes.length} nodes, ${architectureAnalysis.edges.length} edges`);
        
        // Step 2: Generate dynamic flowchart
        console.log('Step 2: Generating dynamic flowchart...');
        const flowchartGenerator = new DynamicFlowchartGenerator();
        let flowchartData = flowchartGenerator.generateFlowchart(architectureAnalysis);
        
        if (input.optimizeLayout) {
          console.log('Optimizing flowchart layout...');
          flowchartData = flowchartGenerator.optimizeLayout(flowchartData);
        }
        
        // Step 3: Generate architecture insights
        console.log('Step 3: Generating architecture insights...');
        const architectureInsights = await generateArchitectureInsights(architectureAnalysis, input, isAIConfigured());
        
        // Step 4: Generate Mermaid chart for fallback
        console.log('Step 4: Generating Mermaid chart...');
        const mermaidChart = flowchartGenerator.exportToMermaid(flowchartData);
        
        // Step 5: Generate analysis summary
        console.log('Step 5: Generating analysis summary...');
        const analysisSummary = generateAnalysisSummary(architectureAnalysis, flowchartData);
        
        console.log('Dynamic architecture analysis completed successfully!');
        
        return {
          flowchartData,
          architectureInsights,
          mermaidChart,
          analysisSummary
        };
      } catch (analysisError) {
        console.error('Error during architecture analysis:', analysisError);
        
        // Generate specific error messages based on the error type
        let errorMessage = 'Repository analysis failed.';
        let errorDetails = '';
        
        if (analysisError instanceof Error) {
          if (analysisError.message.includes('rate limit exceeded')) {
            errorMessage = 'Repository analysis failed due to GitHub API rate limits.';
            errorDetails = analysisError.message;
          } else if (analysisError.message.includes('not found or is private')) {
            errorMessage = 'Repository analysis failed: Repository not found or is private.';
            errorDetails = 'Please check the repository URL and ensure it is a public repository.';
          } else if (analysisError.message.includes('authentication failed')) {
            errorMessage = 'Repository analysis failed: GitHub authentication failed.';
            errorDetails = 'Please check your GITHUB_TOKEN environment variable.';
          } else {
            errorDetails = analysisError.message;
          }
        }
        
        // Return fallback data with specific error information
        console.log('Returning fallback data due to analysis error...');
        return {
          flowchartData: {
            nodes: [],
            connections: [],
            layers: {
              entry: { y: 0, height: 100 },
              presentation: { y: 100, height: 100 },
              business: { y: 200, height: 100 },
              data: { y: 300, height: 100 },
              infrastructure: { y: 400, height: 100 }
            },
            metrics: {
              totalNodes: 0,
              totalConnections: 0,
              averageComplexity: 0,
              coupling: 0,
              cohesion: 0
            }
          },
          architectureInsights: {
            designPatterns: [],
            dataFlow: `Analysis failed - unable to determine data flow`,
            errorHandling: `Analysis failed - unable to determine error handling`,
            scalability: `Analysis failed - unable to determine scalability`,
            performance: `Analysis failed - unable to determine performance`,
            security: `Analysis failed - unable to determine security`,
            integrations: [],
            deployment: `Analysis failed - unable to determine deployment`,
            complexityAnalysis: {
              highComplexityComponents: [],
              refactoringSuggestions: []
            }
          },
          mermaidChart: `graph TD\n    A[Analysis Failed] --> B[${errorMessage}]\n    B --> C[${errorDetails || 'Unknown error'}]`,
          analysisSummary: `${errorMessage} ${errorDetails}`
        };
      }
    } catch (error) {
      console.error('Dynamic architecture analysis failed:', error);
      throw new Error(`Dynamic architecture analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

async function generateArchitectureInsights(analysis: any, input: DynamicArchitectureAnalysisInput, aiConfigured: boolean) {
  // Extract patterns from analysis
  const allPatterns = new Set<string>();
  const externalDependencies = new Set<string>();
  const errorHandlingCount = { has: 0, total: 0 };
  const asyncComponents = [];
  const highComplexityComponents = [];
  
  analysis.nodes.forEach((node: any) => {
    // Collect patterns
    node.metadata.patterns.forEach((pattern: string) => allPatterns.add(pattern));
    
    // Collect external dependencies
    node.imports.forEach((imp: string) => {
      if (!imp.startsWith('.') && !imp.startsWith('/')) {
        externalDependencies.add(imp);
      }
    });
    
    // Analyze error handling
    errorHandlingCount.total++;
    if (node.metadata.hasErrorHandling) {
      errorHandlingCount.has++;
    }
    
    // Collect async components
    if (node.metadata.isAsync) {
      asyncComponents.push(node.name);
    }
    
    // Collect high complexity components
    if (node.complexity > 10) {
      highComplexityComponents.push({
        name: node.name,
        complexity: node.complexity,
        filePath: node.filePath,
        reasons: generateComplexityReasons(node)
      });
    }
  });
  
  // Generate insights
  const insights = {
    designPatterns: Array.from(allPatterns),
    dataFlow: generateDataFlowDescription(analysis),
    errorHandling: generateErrorHandlingDescription(errorHandlingCount),
    scalability: generateScalabilityDescription(analysis, externalDependencies),
    performance: generatePerformanceDescription(analysis),
    security: generateSecurityDescription(analysis),
    integrations: Array.from(externalDependencies),
    deployment: generateDeploymentDescription(analysis),
    complexityAnalysis: {
      highComplexityComponents: highComplexityComponents.slice(0, 10), // Top 10
      refactoringSuggestions: generateRefactoringSuggestions(highComplexityComponents)
    }
  };
  
  // If AI is configured, enhance insights with AI analysis
  if (aiConfigured) {
    try {
      const enhancedInsights = await enhanceInsightsWithAI(insights, analysis, input);
      return enhancedInsights;
    } catch (error) {
      console.warn('AI enhancement failed, using basic insights:', error);
      return insights;
    }
  }
  
  return insights;
}

function generateComplexityReasons(node: any): string[] {
  const reasons = [];
  
  if (node.linesOfCode > 200) reasons.push('Large file size');
  if (node.dependencies.length > 10) reasons.push('High dependency count');
  if (node.dependents.length > 5) reasons.push('High coupling');
  if (node.metadata.patterns.includes('async')) reasons.push('Async complexity');
  if (!node.metadata.hasErrorHandling) reasons.push('Missing error handling');
  
  return reasons;
}

function generateRefactoringSuggestions(highComplexityComponents: any[]): any[] {
  const suggestions = [];
  
  highComplexityComponents.forEach(component => {
    if (component.complexity > 20) {
      suggestions.push({
        component: component.name,
        suggestion: 'Consider breaking down into smaller, focused components',
        priority: 'high' as const
      });
    } else if (component.complexity > 15) {
      suggestions.push({
        component: component.name,
        suggestion: 'Extract utility functions and reduce complexity',
        priority: 'medium' as const
      });
    } else {
      suggestions.push({
        component: component.name,
        suggestion: 'Review and simplify logic where possible',
        priority: 'low' as const
      });
    }
  });
  
  return suggestions.slice(0, 15); // Top 15 suggestions
}

function generateDataFlowDescription(analysis: any): string {
  const entryPoints = analysis.layers.entry.length;
  const dataLayer = analysis.layers.data.length;
  const businessLayer = analysis.layers.business.length;
  
  if (entryPoints === 0) return 'No clear entry points identified';
  
  let description = `Data flows from ${entryPoints} entry point(s) through `;
  
  if (businessLayer > 0) {
    description += `${businessLayer} business logic component(s)`;
  }
  
  if (dataLayer > 0) {
    description += ` to ${dataLayer} data layer component(s)`;
  }
  
  const avgCoupling = analysis.metrics.coupling;
  if (avgCoupling > 3) {
    description += '. High coupling detected between layers';
  } else if (avgCoupling < 1.5) {
    description += '. Well-separated layers with low coupling';
  }
  
  return description + '.';
}

function generateErrorHandlingDescription(errorHandling: any): string {
  const percentage = (errorHandling.has / errorHandling.total) * 100;
  
  if (percentage >= 70) {
    return `Strong error handling implemented in ${Math.round(percentage)}% of components`;
  } else if (percentage >= 40) {
    return `Moderate error handling in ${Math.round(percentage)}% of components, room for improvement`;
  } else {
    return `Limited error handling in only ${Math.round(percentage)}% of components, significant improvement needed`;
  }
}

function generateScalabilityDescription(analysis: any, externalDependencies: Set<string>): string {
  const totalNodes = analysis.nodes.length;
  const avgComplexity = analysis.metrics.averageComplexity;
  const coupling = analysis.metrics.coupling;
  
  let description = '';
  
  if (totalNodes > 50) {
    description += 'Large codebase with ';
  } else if (totalNodes > 20) {
    description += 'Medium-sized codebase with ';
  } else {
    description += 'Small codebase with ';
  }
  
  if (avgComplexity < 5) {
    description += 'low complexity components, good for scalability';
  } else if (avgComplexity < 10) {
    description += 'moderate complexity, acceptable scalability';
  } else {
    description += 'high complexity components, may impact scalability';
  }
  
  if (externalDependencies.size > 20) {
    description += '. High number of external dependencies may affect scalability';
  }
  
  return description + '.';
}

function generatePerformanceDescription(analysis: any): string {
  const avgComplexity = analysis.metrics.averageComplexity;
  const totalLines = analysis.metrics.totalLines;
  const asyncCount = analysis.nodes.filter((n: any) => n.metadata.isAsync).length;
  
  let description = '';
  
  if (avgComplexity < 5) {
    description += 'Good performance characteristics with low complexity';
  } else if (avgComplexity < 10) {
    description += 'Moderate performance profile';
  } else {
    description += 'Potential performance concerns due to high complexity';
  }
  
  if (asyncCount > 0) {
    description += `. ${asyncCount} async component(s) identified for non-blocking operations`;
  }
  
  if (totalLines > 10000) {
    description += '. Large codebase may benefit from code splitting';
  }
  
  return description + '.';
}

function generateSecurityDescription(analysis: any): string {
  const errorHandlingCount = analysis.nodes.filter((n: any) => n.metadata.hasErrorHandling).length;
  const totalNodes = analysis.nodes.length;
  const errorHandlingPercentage = (errorHandlingCount / totalNodes) * 100;
  
  let description = '';
  
  if (errorHandlingPercentage >= 70) {
    description += 'Good security practices with comprehensive error handling';
  } else if (errorHandlingPercentage >= 40) {
    description += 'Basic security measures in place';
  } else {
    description += 'Limited security measures, significant improvements needed';
  }
  
  // Check for common security patterns
  const hasAuth = analysis.nodes.some((n: any) => 
    n.filePath.toLowerCase().includes('auth') || 
    n.filePath.toLowerCase().includes('security')
  );
  
  if (hasAuth) {
    description += '. Authentication/authorization components detected';
  }
  
  return description + '.';
}

function generateDeploymentDescription(analysis: any): string {
  const hasConfig = analysis.layers.infrastructure.some((nodeId: string) => {
    const node = analysis.nodes.find((n: any) => n.id === nodeId);
    return node && (node.filePath.includes('config') || node.filePath.includes('deploy'));
  });
  
  if (hasConfig) {
    return 'Configuration files detected, suggesting structured deployment approach';
  } else {
    return 'Limited deployment configuration detected, may need setup';
  }
}

function generateAnalysisSummary(analysis: any, flowchartData: any): string {
  const { nodes, edges, metrics } = analysis;
  const { totalFiles, totalLines, averageComplexity, coupling, cohesion } = metrics;
  
  // Handle empty analysis results
  if (nodes.length === 0) {
    return 'Architecture analysis complete: No analyzable files found in repository. This may be due to:\n• Repository not found or is private\n• No supported file types (.ts, .js, .py, .java, .go, .rs)\n• Repository access restrictions';
  }
  
  const activeLayers = Object.keys(analysis.layers).filter(key => analysis.layers[key].length > 0).length;
  const highImportanceComponents = flowchartData.nodes.filter((n: any) => n.importance >= 4).length;
  const componentsWithErrorHandling = nodes.filter((n: any) => n.metadata.hasErrorHandling).length;
  
  return `Architecture analysis complete: 
• ${nodes.length} components analyzed across ${activeLayers} layers
• ${edges.length} dependencies identified with ${coupling.toFixed(2)} average coupling
• ${totalFiles} files processed with ${totalLines} lines of code
• Average complexity: ${averageComplexity.toFixed(2)} with ${cohesion.toFixed(2)} cohesion score
• ${highImportanceComponents} high-importance components identified
• ${componentsWithErrorHandling} components with error handling
• Generated ${flowchartData.connections.length} flowchart connections with optimized layout`;
}

async function enhanceInsightsWithAI(insights: any, analysis: any, input: DynamicArchitectureAnalysisInput): Promise<any> {
  // This would use AI to enhance the insights, but for now we'll return the basic insights
  // In a real implementation, this would call the AI service with the analysis data
  return insights;
}
