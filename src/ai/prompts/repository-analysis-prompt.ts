export const REPOSITORY_ANALYSIS_SYSTEM_PROMPT = `You are an expert software architect and code analyst. Your task is to analyze a repository's architecture and provide comprehensive insights about its structure, patterns, and functionality.

Given the repository data below, provide a detailed analysis covering:

1. **Comprehensive Explanation**: What this repository does, its main purpose, and how it works
2. **Architectural Overview**: High-level architecture, main components, and their relationships
3. **Data Flow**: How data moves through the system, key endpoints, and data transformations
4. **Key Patterns**: Important architectural patterns, design principles, and coding conventions
5. **Technical Insights**: Notable technical decisions, framework choices, and implementation details
6. **Complexity Assessment**: Overall complexity, potential pain points, and maintenance considerations
7. **Recommendations**: Suggestions for improvement, refactoring opportunities, and best practices
8. **Use Cases**: Common scenarios where this repository would be used
9. **Integrations**: External services, APIs, and dependencies

Focus on providing actionable, specific insights that would help developers understand and work with this codebase effectively.`;

export const REPOSITORY_ANALYSIS_HUMAN_TEMPLATE = `Analyze the following repository architecture data:

## Repository Information
- **Name**: {repositoryName}
- **Owner**: {repositoryOwner}
- **URL**: {repositoryUrl}
- **Tech Stack**: {techStack}
- **Goal**: {goal}

## Structure Overview
- **Total Components**: {totalNodes}
- **Total Dependencies**: {totalEdges}
- **Total Files**: {totalFiles}
- **Lines of Code**: {totalLinesOfCode}
- **Languages**: {languages}
- **Frameworks**: {frameworks}

## Architecture Layers
- **Frontend Components**: {frontendCount}
- **API Components**: {apiCount}
- **Service Components**: {servicesCount}
- **Data Layer Components**: {dataCount}
- **Utility Components**: {utilsCount}
- **Config Components**: {configCount}

## Design Patterns
{designPatterns}

## Complexity Analysis
- **Average Complexity**: {averageComplexity}
- **High Complexity Components**: {highComplexityComponents}

## Connection Types
- **Import Dependencies**: {importCount}
- **Function Calls**: {callCount}
- **Other Dependencies**: {dependencyCount}

## Current Insights
{currentInsights}

Please provide a comprehensive analysis following the structure outlined in the system prompt. Focus on practical insights that would help developers understand this codebase and make informed decisions about maintenance, extension, or refactoring.`;

export const formatArchitectureData = (data: any) => {
  return {
    repositoryName: data.repository?.name || 'Unknown',
    repositoryOwner: data.repository?.owner || 'Unknown',
    repositoryUrl: data.repository?.url || '',
    techStack: data.repository?.techStack?.join(', ') || 'Not specified',
    goal: data.repository?.goal || 'Analyze repository architecture',
    
    totalNodes: data.structure?.totalNodes || 0,
    totalEdges: data.structure?.totalEdges || 0,
    totalFiles: data.structure?.totalFiles || 0,
    totalLinesOfCode: data.structure?.totalLinesOfCode || 0,
    languages: data.structure?.languages?.join(', ') || 'Not specified',
    frameworks: data.structure?.frameworks?.join(', ') || 'Not specified',
    
    frontendCount: data.architecture?.layers?.frontend || 0,
    apiCount: data.architecture?.layers?.api || 0,
    servicesCount: data.architecture?.layers?.services || 0,
    dataCount: data.architecture?.layers?.data || 0,
    utilsCount: data.architecture?.layers?.utils || 0,
    configCount: data.architecture?.layers?.config || 0,
    
    designPatterns: data.architecture?.patterns?.length > 0 
      ? data.architecture.patterns.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')
      : 'No specific design patterns identified',
    
    averageComplexity: data.architecture?.complexity?.average || 0,
    highComplexityComponents: data.architecture?.complexity?.highComplexityComponents?.length > 0
      ? data.architecture.complexity.highComplexityComponents
          .map((comp: any) => `- ${comp.name} (complexity: ${comp.complexity})`)
          .join('\n')
      : 'No high complexity components identified',
    
    importCount: data.architecture?.connections?.imports || 0,
    callCount: data.architecture?.connections?.calls || 0,
    dependencyCount: data.architecture?.connections?.dependencies || 0,
    
    currentInsights: data.currentInsights 
      ? JSON.stringify(data.currentInsights, null, 2)
      : 'No current insights available'
  };
};
