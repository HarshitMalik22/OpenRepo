'use server';

/**
 * @fileOverview Generates a truly dynamic flowchart based on real repository code analysis using LangChain for AI enhancement.
 * 
 * - dynamicArchitectureAnalysis - A function that performs real code analysis and generates accurate flowcharts.
 * - DynamicArchitectureAnalysisInput - The input type for the dynamicArchitectureAnalysis function.
 * - DynamicArchitectureAnalysisOutput - The return type for the dynamicArchitectureAnalysis function.
 */

import { z } from 'zod';
import { ArchitectureAnalyzer } from '@/lib/architecture-analyzer';
import { DynamicFlowchartGenerator } from '@/lib/dynamic-flowchart-generator';
import { extractOwnerAndRepo } from '@/lib/utils';
import { isAIConfigured, createLangChainModel, RepositoryAnalysisOutputSchema } from '@/ai/langchain-config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { REPOSITORY_ANALYSIS_SYSTEM_PROMPT, REPOSITORY_ANALYSIS_HUMAN_TEMPLATE, formatArchitectureData } from '@/ai/prompts/repository-analysis-prompt';

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
      path: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
    })),
    layers: z.record(z.object({
      y: z.number(),
      height: z.number(),
      layerIndex: z.number(),
      label: z.string(),
      color: z.string(),
      borderColor: z.string(),
      backgroundColor: z.string(),
    })),
    metrics: z.object({
      averageComplexity: z.number(),
      coupling: z.number(),
      cohesion: z.number(),
    }).optional(),
  }),
  mermaidChart: z.string().optional(),
  architectureInsights: z.object({
    summary: z.string(),
    keyComponents: z.array(z.string()),
    designPatterns: z.array(z.string()),
    dataFlow: z.string(),
    scalability: z.string(),
    performance: z.string(),
    security: z.string(),
    complexityAnalysis: z.object({
      average: z.number(),
      high: z.number(),
      medium: z.number(),
      low: z.number(),
      distribution: z.record(z.number()),
      refactoringSuggestions: z.array(z.string()).optional(),
      highComplexityComponents: z.array(z.object({
        name: z.string(),
        complexity: z.number(),
        filePath: z.string(),
      })).optional(),
    }).optional(),
    // AI-Enhanced fields
    comprehensiveExplanation: z.string().optional().describe('AI-generated comprehensive explanation of what this repository is and how it works'),
    architecturalOverview: z.string().optional().describe('AI-generated high-level architectural overview'),
    detailedDataFlow: z.string().optional().describe('AI-generated detailed data flow explanation'),
    keyPatterns: z.array(z.string()).optional().describe('AI-identified key architectural patterns'),
    technicalInsights: z.array(z.string()).optional().describe('AI-generated technical insights'),
    complexityAssessment: z.string().optional().describe('AI-generated complexity assessment'),
    recommendations: z.array(z.string()).optional().describe('AI-generated recommendations for improvement'),
    useCases: z.array(z.string()).optional().describe('AI-identified common use cases'),
    enhancedIntegrations: z.array(z.string()).optional().describe('AI-identified external integrations'),
  }),
  analysisSummary: z.string(),
});
export type DynamicArchitectureAnalysisOutput = z.infer<typeof DynamicArchitectureAnalysisOutputSchema>;

export async function dynamicArchitectureAnalysis(input: DynamicArchitectureAnalysisInput): Promise<DynamicArchitectureAnalysisOutput> {
  console.log('Starting dynamic architecture analysis with LangChain...');
  console.log('Input:', JSON.stringify(input, null, 2));
  
  try {
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
      
      // Step 2: Generate flowchart
      console.log('Step 2: Generating flowchart...');
      const flowchartGenerator = new DynamicFlowchartGenerator();
      const flowchartData = flowchartGenerator.generateFlowchart(architectureAnalysis);
      
      console.log('Flowchart generated successfully');
      
      // Step 3: Generate basic insights
      console.log('Step 3: Generating basic insights...');
      const basicInsights = generateBasicInsights(architectureAnalysis, flowchartData, input);
      
      // Step 4: Enhance with AI if configured
      console.log('Step 4: Enhancing insights with AI...');
      const enhancedInsights = await enhanceInsightsWithAI(basicInsights, architectureAnalysis, input);
      
      // Step 5: Generate analysis summary
      console.log('Step 5: Generating analysis summary...');
      const analysisSummary = generateAnalysisSummary(architectureAnalysis, flowchartData, enhancedInsights);
      
      console.log('Step 6: Generating Mermaid chart...');
      const mermaidChart = generateMermaidChart(flowchartData);
      
      console.log('Dynamic architecture analysis completed successfully');
      
      return {
        flowchartData,
        mermaidChart,
        architectureInsights: enhancedInsights,
        analysisSummary
      };
      
    } catch (analysisError) {
      console.error('Error during code analysis:', analysisError);
      throw new Error(`Failed to analyze repository: ${analysisError instanceof Error ? analysisError.message : 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('Error in dynamic architecture analysis:', error);
    throw error;
  }
}

function generateBasicInsights(analysis: any, flowchartData: any, input: DynamicArchitectureAnalysisInput) {
  const nodes = analysis.nodes || [];
  const edges = analysis.edges || [];
  const layers = analysis.layers || {};
  
  // Calculate basic metrics
  const totalFiles = analysis.totalFiles || 0;
  const totalLines = analysis.totalLinesOfCode || 0;
  const averageComplexity = analysis.averageComplexity || 0;
  const coupling = analysis.coupling || 0;
  const cohesion = analysis.cohesion || 0;
  
  // Count components by layer
  const activeLayers = Object.keys(layers).filter(key => layers[key] && layers[key].components && layers[key].components.length > 0).length;
  const highImportanceComponents = nodes.filter((node: any) => node.importance > 7).length;
  const componentsWithErrorHandling = nodes.filter((node: any) => node.metadata?.hasErrorHandling).length;
  
  // Generate key components list
  const keyComponents = nodes
    .filter((node: any) => node.importance > 6)
    .slice(0, 10)
    .map((node: any) => `${node.name} (${node.metadata?.language || 'Unknown'})`);
  
  // Extract design patterns
  const designPatterns = Array.from(analysis.designPatterns || []).slice(0, 8);
  
  // Calculate complexity distribution
  const complexityDistribution = nodes.reduce((acc: any, node: any) => {
    const complexity = node.complexity || 0;
    if (complexity > 7) acc.high = (acc.high || 0) + 1;
    else if (complexity > 4) acc.medium = (acc.medium || 0) + 1;
    else acc.low = (acc.low || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
  
  // Generate refactoring suggestions
  const refactoringSuggestions = [
    'Consider breaking down high-complexity components into smaller, focused units',
    'Implement proper error handling patterns across all components',
    'Add input validation and sanitization for user-facing components',
    'Consider implementing caching strategies for frequently accessed data',
    'Add comprehensive logging and monitoring for production debugging'
  ];
  
  // Get high complexity components
  const highComplexityComponents = nodes
    .filter((node: any) => node.complexity > 7)
    .slice(0, 5)
    .map((node: any) => ({
      name: node.name,
      complexity: node.complexity,
      filePath: node.filePath || 'Unknown'
    }));
  
  return {
    summary: `Repository analysis complete with ${nodes.length} components across ${activeLayers} layers. ${highImportanceComponents} high-importance components identified.`,
    keyComponents,
    designPatterns,
    dataFlow: `Data flows through ${edges.length} connections with ${coupling.toFixed(2)} average coupling.`,
    scalability: `Architecture supports ${activeLayers} distinct layers with ${cohesion.toFixed(2)} cohesion score.`,
    performance: `Average complexity: ${averageComplexity.toFixed(2)} with ${componentsWithErrorHandling} components implementing error handling.`,
    security: `Security analysis based on ${totalFiles} files and ${totalLines} lines of code.`,
    complexityAnalysis: {
      average: averageComplexity,
      high: complexityDistribution.high,
      medium: complexityDistribution.medium,
      low: complexityDistribution.low,
      distribution: complexityDistribution,
      refactoringSuggestions,
      highComplexityComponents
    }
  };
}

async function enhanceInsightsWithAI(insights: any, analysis: any, input: DynamicArchitectureAnalysisInput): Promise<any> {
  console.log('enhanceInsightsWithAI called with AI configured:', isAIConfigured());
  
  if (!isAIConfigured()) {
    console.log('AI not configured, returning basic insights');
    return insights;
  }

  try {
    console.log('Enhancing insights with AI...');
    
    // Prepare comprehensive data for AI analysis
    const repoInfo = extractOwnerAndRepo(input.repoUrl);
    const architectureData = {
      repository: {
        name: repoInfo?.repo || 'Unknown',
        owner: repoInfo?.owner || 'Unknown',
        url: input.repoUrl,
        techStack: input.techStack || [],
        goal: input.goal || 'Analyze repository architecture'
      },
      structure: {
        totalNodes: analysis.nodes?.length || 0,
        totalEdges: analysis.edges?.length || 0,
        totalFiles: analysis.totalFiles || 0,
        totalLinesOfCode: analysis.totalLinesOfCode || 0,
        languages: Array.from(analysis.languages || []) as string[],
        frameworks: Array.from(analysis.frameworks || []) as string[]
      },
      architecture: {
        layers: {
          frontend: analysis.layers?.frontend?.components?.length || 0,
          api: analysis.layers?.apiLayer?.components?.length || 0,
          services: analysis.layers?.services?.components?.length || 0,
          data: analysis.layers?.dataLayer?.components?.length || 0,
          utils: analysis.layers?.utils?.components?.length || 0,
          config: analysis.layers?.config?.components?.length || 0
        },
        patterns: Array.from(analysis.designPatterns || []) as string[],
        complexity: {
          average: analysis.averageComplexity || 0,
          highComplexityComponents: analysis.nodes
            ?.filter((node: any) => node.complexity > 7)
            ?.map((node: any) => ({
              name: node.name,
              complexity: node.complexity,
              filePath: node.filePath
            })) || []
        },
        connections: {
          imports: analysis.edges?.filter((edge: any) => edge.type === 'import')?.length || 0,
          calls: analysis.edges?.filter((edge: any) => edge.type === 'call')?.length || 0,
          dependencies: analysis.edges?.filter((edge: any) => edge.type === 'dependency')?.length || 0
        }
      },
      currentInsights: insights
    };

    // Create LangChain prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", REPOSITORY_ANALYSIS_SYSTEM_PROMPT],
      ["human", REPOSITORY_ANALYSIS_HUMAN_TEMPLATE]
    ]);

    // Format the data for the prompt
    const formattedData = formatArchitectureData(architectureData);
    
    // Create the model
    const model = createLangChainModel();
    
    // Create the parser
    const parser = new StringOutputParser();
    
    // Generate the chain
    const chain = prompt.pipe(model).pipe(parser);
    
    // Invoke the chain
    console.log('Invoking LangChain chain...');
    const aiResponse = await chain.invoke(formattedData);
    
    console.log('AI-enhanced insights generated successfully');
    
    // For now, we'll parse the response manually. In a production system, you'd want to use
    // a more sophisticated parser or structured output.
    try {
      // Try to extract structured data from the AI response
      const enhancedInsights = {
        ...insights,
        comprehensiveExplanation: extractSection(aiResponse, 'Comprehensive Explanation') || '',
        architecturalOverview: extractSection(aiResponse, 'Architectural Overview') || '',
        detailedDataFlow: extractSection(aiResponse, 'Data Flow') || '',
        keyPatterns: extractList(aiResponse, 'Key Patterns') || [],
        technicalInsights: extractList(aiResponse, 'Technical Insights') || [],
        complexityAssessment: extractSection(aiResponse, 'Complexity Assessment') || '',
        recommendations: extractList(aiResponse, 'Recommendations') || [],
        useCases: extractList(aiResponse, 'Use Cases') || [],
        enhancedIntegrations: extractList(aiResponse, 'Integrations') || []
      };
      
      return enhancedInsights;
    } catch (parseError) {
      console.warn('Failed to parse AI response, using fallback:', parseError);
      // Fallback: use the raw response as comprehensive explanation
      return {
        ...insights,
        comprehensiveExplanation: aiResponse,
        architecturalOverview: '',
        detailedDataFlow: '',
        keyPatterns: [],
        technicalInsights: [],
        complexityAssessment: '',
        recommendations: [],
        useCases: [],
        enhancedIntegrations: []
      };
    }
    
  } catch (error) {
    console.error('Error enhancing insights with AI:', error);
    // Return original insights if AI enhancement fails
    return insights;
  }
}

// Helper functions to parse AI response
function extractSection(text: string, sectionName: string): string | null {
  const patterns = [
    new RegExp(`##?\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=##?\\s*|$)`, 'i'),
    new RegExp(`\\*\\*${sectionName}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\*\\*|$)`, 'i'),
    new RegExp(`${sectionName}:\\s*\\n([\\s\\S]*?)(?=\\w+:|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function extractList(text: string, sectionName: string): string[] | null {
  const section = extractSection(text, sectionName);
  if (!section) return null;
  
  // Extract list items
  const listItems = section.match(/^[-*•]\s+(.+)$/gm) || section.match(/^\d+\.\s+(.+)$/gm);
  if (listItems) {
    return listItems.map(item => item.replace(/^[-*•]\s+|^\d+\.\s+/, '').trim());
  }
  
  // If no list items found, split by newlines and filter
  const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  return lines.length > 0 ? lines : null;
}

function generateAnalysisSummary(analysis: any, flowchartData: any, insights: any): string {
  const nodes = analysis.nodes || [];
  const edges = analysis.edges || [];
  const layers = analysis.layers || {};
  
  const activeLayers = Object.keys(layers).filter(key => layers[key] && layers[key].components && layers[key].components.length > 0).length;
  const highImportanceComponents = nodes.filter((node: any) => node.importance > 7).length;
  const componentsWithErrorHandling = nodes.filter((node: any) => node.metadata?.hasErrorHandling).length;
  const coupling = analysis.coupling || 0;
  const cohesion = analysis.cohesion || 0;
  const averageComplexity = analysis.averageComplexity || 0;
  const totalFiles = analysis.totalFiles || 0;
  const totalLines = analysis.totalLinesOfCode || 0;
  
  return `Repository analysis completed successfully. 
• ${nodes.length} components analyzed across ${activeLayers} layers
• ${edges.length} dependencies identified with ${coupling.toFixed(2)} average coupling
• ${totalFiles} files processed with ${totalLines} lines of code
• Average complexity: ${averageComplexity.toFixed(2)} with ${cohesion.toFixed(2)} cohesion score
• ${highImportanceComponents} high-importance components identified
• ${componentsWithErrorHandling} components with error handling
• Generated ${flowchartData.connections.length} flowchart connections with optimized layout`;
}

function generateMermaidChart(flowchartData: any): string {
  if (!flowchartData || !flowchartData.nodes || flowchartData.nodes.length === 0) {
    return `graph TD
    A[No Flowchart Data Available] --> B[Please Generate Analysis First]
    B --> C[Repository Analysis Will Appear Here]`;
  }
  
  const nodes = flowchartData.nodes;
  const connections = flowchartData.connections || [];
  
  // Group nodes by layer for better visualization
  const layers: { [key: number]: any[] } = {};
  nodes.forEach((node: any) => {
    const layer = node.layer || 0;
    if (!layers[layer]) layers[layer] = [];
    layers[layer].push(node);
  });
  
  let mermaid = 'graph TD\n';
  
  // Add nodes with layer-based styling
  Object.keys(layers).forEach(layerKey => {
    const layerNum = parseInt(layerKey);
    const layerNodes = layers[layerNum];
    
    layerNodes.forEach((node: any) => {
      const nodeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
      const nodeLabel = node.label.replace(/"/g, '\\"');
      const nodeType = node.type || 'component';
      
      // Add node with type-specific styling
      mermaid += `    ${nodeId}["${nodeLabel}"]:::${nodeType}\n`;
    });
  });
  
  // Add connections
  connections.forEach((connection: any) => {
    const fromId = connection.from.replace(/[^a-zA-Z0-9]/g, '_');
    const toId = connection.to.replace(/[^a-zA-Z0-9]/g, '_');
    const connectionType = connection.type || 'dependency';
    
    mermaid += `    ${fromId} -->|${connectionType}| ${toId}\n`;
  });
  
  // Add style definitions
  mermaid += '\n    classDef entry fill:#e1f5fe,stroke:#01579b,stroke-width:2px\n';
  mermaid += '    classDef component fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px\n';
  mermaid += '    classDef service fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px\n';
  mermaid += '    classDef database fill:#ffebee,stroke:#c62828,stroke-width:2px\n';
  mermaid += '    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px\n';
  mermaid += '    classDef config fill:#fafafa,stroke:#424242,stroke-width:2px\n';
  mermaid += '    classDef api fill:#e0f2f1,stroke:#00695c,stroke-width:2px\n';
  mermaid += '    classDef hook fill:#fce4ec,stroke:#880e4f,stroke-width:2px\n';
  mermaid += '    classDef util fill:#f1f8e9,stroke:#33691e,stroke-width:2px\n';
  mermaid += '    classDef test fill:#fff8e1,stroke:#f57f17,stroke-width:2px\n';
  
  // Apply classes to nodes
  Object.keys(layers).forEach(layerKey => {
    const layerNodes = layers[parseInt(layerKey)];
    layerNodes.forEach((node: any) => {
      const nodeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
      const nodeType = node.type || 'component';
      mermaid += `    class ${nodeId} ${nodeType}\n`;
    });
  });
  
  return mermaid;
}
