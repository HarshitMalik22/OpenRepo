'use server';

/**
 * @fileOverview Generates a simple mermaid diagram based on basic repository structure.
 * - simpleArchitectureAnalysis - A function that creates a basic architectural overview.
 * - SimpleArchitectureAnalysisInput - The input type for the simpleArchitectureAnalysis function.
 * - SimpleArchitectureAnalysisOutput - The return type for the simpleArchitectureAnalysis function.
 */

import { z } from 'zod';
import { extractOwnerAndRepo } from '@/lib/utils';

const SimpleArchitectureAnalysisInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to analyze.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
});
export type SimpleArchitectureAnalysisInput = z.infer<typeof SimpleArchitectureAnalysisInputSchema>;

const SimpleArchitectureAnalysisOutputSchema = z.object({
  mermaidChart: z.string().describe('The generated mermaid chart.'),
  summary: z.string().describe('A brief summary of the repository structure.'),
});
export type SimpleArchitectureAnalysisOutput = z.infer<typeof SimpleArchitectureAnalysisOutputSchema>;

const getFallbackMermaidChart = () => {
  return `graph TD
    A[Repository Analysis] --> B[Architecture Overview]
    B --> C[Component Structure]
    C --> D[Data Flow]
    D --> E[Dependencies]
    
    classDef default fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    class A,B,C,D,E default`;
};

export async function simpleArchitectureAnalysis(input: SimpleArchitectureAnalysisInput): Promise<SimpleArchitectureAnalysisOutput> {
  const { repoUrl, techStack, goal } = input;
  const repoInfo = extractOwnerAndRepo(repoUrl);
  
  if (!repoInfo) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      summary: 'Unable to parse repository URL'
    };
  }
  
  const { owner, repo } = repoInfo;

  // Fetch actual repository structure from GitHub API
  const structure = await fetchRepositoryStructure(owner, repo);
  
  if (structure.length === 0) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      summary: 'Unable to fetch repository structure'
    };
  }
  
  // Group items by type and importance
  const directories = structure.filter((item: any) => item.type === 'dir');
  const files = structure.filter((item: any) => item.type === 'file');

  // Generate a mermaid chart based on actual repository structure
  const generateMermaidChart = () => {
    
    // Important directories to highlight
    const importantDirs = ['src', 'components', 'lib', 'utils', 'app', 'pages', 'api', 'hooks', 'services', 'types'];
    const importantFiles = ['package.json', 'README.md', 'tsconfig.json', 'next.config.js', 'tailwind.config.js'];
    
    let chart = `graph TD
    A[${repo}] --> B[Source Directories]
    A --> C[Configuration Files]
    A --> D[Documentation]
    
    B --> E[Source Code]`;
    
    // Add important directories
    directories.slice(0, 8).forEach((dir: any, index: number) => {
      const letter = String.fromCharCode(70 + index); // F, G, H, I, etc.
      const isImportant = importantDirs.includes(dir.name.toLowerCase());
      chart += `\n    E --> ${letter}[${dir.name}]`;
      
      if (isImportant && dir.name.toLowerCase() === 'src') {
        // Add subdirectories for src
        chart += `\n    ${letter} --> ${letter}1[components]`;
        chart += `\n    ${letter} --> ${letter}2[lib]`;
        chart += `\n    ${letter} --> ${letter}3[app]`;
      }
    });
    
    // Add important files
    const configFiles = files.filter((file: any) => 
      importantFiles.some(important => file.name.toLowerCase().includes(important.toLowerCase().replace('.json', '').replace('.js', '').replace('.md', '')))
    );
    
    configFiles.slice(0, 4).forEach((file: any, index: number) => {
      const letter = String.fromCharCode(80 + index); // P, Q, R, S
      chart += `\n    C --> ${letter}[${file.name}]`;
    });
    
    // Add documentation
    const readmeFile = files.find((file: any) => file.name.toLowerCase() === 'readme.md');
    if (readmeFile) {
      chart += `\n    D --> T[README.md]`;
    }
    
    // Add styling
    chart += `\n    \n    classDef primary fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef secondary fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef config fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef docs fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef important fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    \n    class A primary
    class B,C,D secondary
    class C config
    class D docs`;
    
    // Highlight important directories
    directories.slice(0, 8).forEach((dir: any, index: number) => {
      const letter = String.fromCharCode(70 + index);
      if (importantDirs.includes(dir.name.toLowerCase())) {
        chart += `\n    class ${letter} important`;
      }
    });
    
    return chart;
  };

  const primaryLanguage = techStack[0] || 'Unknown';
  
  // Generate the mermaid chart and summary
  const mermaidChart = generateMermaidChart();
  const summary = `${repo} is a ${primaryLanguage} repository with ${directories.length} directories and ${files.length} files. Built with ${techStack.join(', ')}.`;

  return {
    mermaidChart,
    summary
  };

// Helper function to fetch repository structure
async function fetchRepositoryStructure(owner: string, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenSauce-AI'
      }
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
}
