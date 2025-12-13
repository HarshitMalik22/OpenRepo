'use server';

/**
 * @fileOverview GitDiagram-style repository analysis with Hyrbid 2-Step AI process.
 * - gitdiagramStyleAnalysis - A function that performs deep repository analysis using real AI.
 * - GitdiagramStyleAnalysisInput - The input type for the gitdiagramStyleAnalysis function.
 */

import { z } from 'zod';
import { extractOwnerAndRepo } from '@/lib/utils';
import { isAIConfigured, createLangChainModel } from '@/ai/langchain-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { getGitHubHeaders } from "@/lib/github-headers";

const GitdiagramStyleAnalysisInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to analyze.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
});
export type GitdiagramStyleAnalysisInput = z.infer<typeof GitdiagramStyleAnalysisInputSchema>;

export type GitdiagramStyleAnalysisOutput = {
  mermaidChart: string;
  explanation: string;
  componentMapping: string;
  summary: string;
};

const MERMAID_KEYWORDS = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 
  'erDiagram', 'journey', 'gantt', 'pie', 'gitgraph'
];

const MAX_FILE_TREE_LINES = 300;
const MAX_FILE_TREE_CHARS = 12000;
const MAX_SUMMARY_ENTRIES = 15;
const AI_STEP_TIMEOUT_MS = 120000;

// Step 1 Output Schema (Explanation + Mapping only)
const AnalysisAndMappingSchema = z.object({
  explanation: z.string().describe("Detailed architectural explanation of the system, including project identity, core components, data flow, key patterns, and technology stack. (Markdown)"),
  componentMapping: z.string().describe("Component mapping list where key components are mapped to their file/directory paths. Format: '1. [Name]: [Path]'"),
});

// Step 1 Prompt: Analysis & Mapping
const ANALYSIS_AND_MAPPING_PROMPT = `You are a principal software architect tasked with analyzing a codebase to assist in creating a system design diagram.
Your goal is to generate two specific artifacts:
1. A detailed system explanation.
2. A mapping of components to files.

You will be provided with:
1. The complete file tree of the project (<file_tree>).
   - NOTE: This tree is "Smart Compressed". Deeply nested or repetitive files are summarized.
2. The README file (<readme>).

### INSTRUCTIONS FOR ARTIFACT 1: EXPLANATION
Analyze the inputs to understand the project's purpose, structure, and implementation.
- **Project Identity**: Briefly identify what the project is.
- **Core Components**: Identify and describe major building blocks (e.g., "The 'auth' service handles JWT...").
- **Data Flow**: Explain how data moves (Frontend -> API -> DB).
- **Key Patterns**: Mention architectural patterns (MVC, Microservices).
- **Technology Stack**: Mention key tech (Redis, gRPC, Next.js).
- **BE SPECIFIC**: Use actual file paths and component names from the tree.

### INSTRUCTIONS FOR ARTIFACT 2: COMPONENT MAPPING
Map key components mentioned in your explanation to their specific files or directories.
- Format: "1. [Component Name]: [File/Directory Path]"
- Create a list of top 10-15 most critical components.
- Use EXACT paths from the file tree. Focus on major components.
- If a component doesn't have a clear file/directory, omit it.

### RESPONSE FORMAT
You must output a VALID JSON object matching this schema:
{{
  "explanation": "string (markdown)",
  "componentMapping": "string (list)"
}}

{format_instructions}
`;

// Step 2 Prompt: Mermaid Generation (Raw Text)
const MERMAID_GENERATION_PROMPT = `You are a principal software engineer tasked with creating a system design diagram using Mermaid.js based on a detailed explanation.
Your goal is to accurately represent the architecture and design of the project as described in the explanation.

### INPUTS
The detailed explanation and component mapping will be provided below.

### INSTRUCTIONS
Create the Mermaid.js code to represent the design, ensuring that:
1. All major components are included.
2. Relationships between components are clearly shown.
3. The diagram accurately reflects the architecture described.
4. The layout is logical (Top-Down).

### DIAGRAM GUIDELINES
- **Layout**: Top-Down (TD). Use subgraphs to group related components.
- **Styling**: You MUST apply class styles to specific nodes using \`:::styleName\`.
  - \`:::frontend\` (UI, React, Next.js)
  - \`:::backend\` (API, Server, Controllers)
  - \`:::database\` (SQL, Mongo, Redis)
  - \`:::api\` (Routes, Endpoints)
  - \`:::service\` (Business Logic)
  - \`:::external\` (3rd-party APIS)
  - \`:::config\` (Config files)
- **Click Events**: You must include click events for components specified in the component mapping:
  - Format: \`click NodeName "path/to/file"\`
  - Do NOT use full URLs, just the path provided in the mapping.
  - THIS IS CRITICAL for interactivity.

### SYNTAX RULES (CRITICAL)
- **Quotes**: You must use quotes for labels: \`Node["Label"]\`.
- **Spaces**: No spaces in arrow labels (e.g. \`A -->|"label"| B\`).
- **Subgraphs**: No classes on subgraphs directly. Apply to nodes inside.
- **Output**: Return ONLY valid Mermaid code. No markdown fences.

Example Structure:
\`\`\`mermaid
flowchart TD
    A["Entity A"]:::external
    subgraph "Layer A"
        A1["Module A"]:::backend
    end
    A -->|"calls"| A1
    click A1 "src/module_a"
    classDef backend fill:#f9f,stroke:#333;
\`\`\`
`;

export async function gitdiagramStyleAnalysis(input: GitdiagramStyleAnalysisInput): Promise<GitdiagramStyleAnalysisOutput> {
  const { repoUrl, techStack, goal } = input;
  
  // Validation checks...
  if (goal.length > 1000) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Instructions exceed maximum length of 1000 characters',
      componentMapping: '',
      summary: 'Instructions too long'
    };
  }
  
  const repoInfo = extractOwnerAndRepo(repoUrl);
  if (!repoInfo) {
    return { mermaidChart: getFallbackMermaidChart(), explanation: 'Unable to parse repository URL', componentMapping: '', summary: 'Invalid URL' };
  }
  const { owner, repo } = repoInfo;

  // Block example repos
  const blockedRepos = ['fastapi', 'streamlit', 'flask', 'api-analytics', 'monkeytype'];
  if (blockedRepos.includes(repo.toLowerCase())) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Example repositories cannot be analyzed',
      componentMapping: '',
      summary: 'Example repository blocked'
    };
  }

  try {
    if (!isAIConfigured()) {
      return fallbackAnalysis(owner, repo, techStack, 'AI configuration missing');
    }

    // Phase 1: Fetch repository data
    console.log('\nPhase 1: Fetching repository data...');
    const [structure, readme, completeFileTree] = await Promise.all([
      fetchRepositoryStructure(owner, repo),
      fetchRepositoryReadme(owner, repo),
      getCompleteFileTree(owner, repo)
    ]);

    if (!completeFileTree) {
      return fallbackAnalysis(owner, repo, techStack, 'Failed to fetch complete repository file tree');
    }

    const { promptTree: promptFileTree } = prepareFileTreeForPrompt(completeFileTree);
    const model = createLangChainModel();

    // --- STEP 1: ANALYSIS & MAPPING ---
    console.log('Phase 2 [Step 1/2]: Generating Analysis & Mapping...');
    const step1Parser = StructuredOutputParser.fromZodSchema(AnalysisAndMappingSchema);
    const step1Prompt = ChatPromptTemplate.fromMessages([
      ['system', ANALYSIS_AND_MAPPING_PROMPT],
      ['user', `<file_tree>\n{file_tree}\n</file_tree>\n\n<readme>\n{readme}\n</readme>`]
    ]);

    const step1Chain = step1Prompt.pipe(model).pipe(step1Parser);
    const step1Result = await withTimeout(step1Chain.invoke({
      file_tree: promptFileTree,
      readme: readme,
      format_instructions: step1Parser.getFormatInstructions()
    }), AI_STEP_TIMEOUT_MS * 2, 'Step 1 Analysis timed out');

    // @ts-ignore - OutputParser type inference mismatch (known issue)
    const { explanation, componentMapping } = step1Result as { explanation: string; componentMapping: string };
    console.log('✅ Analysis complete.');

    // --- STEP 2: MERMAID VISUALIZATION ---
    console.log('Phase 2 [Step 2/2]: Generating Mermaid Diagram...');
    // We use StringOutputParser for Step 2 to get RAW text (robustness)
    const step2Parser = new StringOutputParser();
    const step2Prompt = ChatPromptTemplate.fromMessages([
      ['system', MERMAID_GENERATION_PROMPT],
      ['user', `<explanation>\n{explanation}\n</explanation>\n\n<component_mapping>\n{componentMapping}\n</component_mapping>`]
    ]);

    const step2Chain = step2Prompt.pipe(model).pipe(step2Parser);
    let mermaidCode = await withTimeout(step2Chain.invoke({
      explanation: explanation,
      componentMapping: componentMapping
    }), AI_STEP_TIMEOUT_MS, 'Step 2 Diagram Generation timed out');

    console.log('✅ Diagram generated.');

    // Post-Processing
    mermaidCode = sanitizeMermaidDiagram(mermaidCode);
    if (mermaidCode.length < 10 || (!mermaidCode.includes('graph') && !mermaidCode.includes('flowchart'))) {
       console.warn('⚠️ Mermaid output did not look valid');
       mermaidCode = getFallbackMermaidChart(repo);
    }
    mermaidCode = processClickEvents(mermaidCode, owner, repo);

    const directories = structure.filter((item: any) => item.type === 'dir');
    const summary = `${repo} is a ${techStack[0] || 'Unknown'} repository with ${directories.length} directories. AI-generated analysis (Hybrid 2-Step).`;

    return {
      mermaidChart: mermaidCode,
      explanation,
      componentMapping,
      summary
    };

  } catch (error) {
    if (error instanceof Error && error.message.includes('timed out')) {
      return { mermaidChart: getFallbackMermaidChart(), explanation: 'Analysis timed out.', componentMapping: '', summary: 'Timed out' };
    }
    console.error('Error in GitDiagram-style AI analysis:', error);
    return fallbackAnalysis(owner, repo, techStack, error instanceof Error ? error.message : 'Unknown error');
  }
}

// Utility to enforce a timeout on async operations
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Fallback analysis when AI is not available or fails
async function fallbackAnalysis(owner: string, repo: string, techStack: string[], fallbackReason?: string): Promise<GitdiagramStyleAnalysisOutput> {
  console.log('Using fallback analysis...');
  
  try {
    const [structure, readme] = await Promise.all([
      fetchRepositoryStructure(owner, repo),
      fetchRepositoryReadme(owner, repo)
    ]);

    if (structure.length === 0) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: 'Unable to fetch repository structure',
        componentMapping: '',
        summary: 'Unable to fetch repository structure'
      };
    }

    // Generate basic explanation
    const projectType = identifyProjectType(structure, techStack);
    const directories = structure.filter((item: any) => item.type === 'dir');
    const files = structure.filter((item: any) => item.type === 'file');

    const explanation = `This ${repo} project is a ${projectType} application built with ${techStack.join(', ')}. 

The repository contains ${directories.length} directories and ${files.length} files. Key directories include: ${directories.slice(0, 5).map((d: any) => d.name).join(', ')}.

${readme ? `Project purpose: ${readme.substring(0, 200)}...` : 'No README available.'}`;

    // Generate basic component mapping
    const componentMapping = `<component_mapping>
1. Main Repository: ${repo}/
2. Source Code: src/
3. Components: components/
4. Configuration: package.json
5. Documentation: README.md
</component_mapping>`;

    // Generate basic mermaid chart
    const mermaidChart = `graph TD
    A["${repo}"] --> B["Source Code"]
    A --> C["Configuration"]
    A --> D["Documentation"]
    
    B --> E["Components"]
    B --> F["Utilities"]
    B --> G["API"]
    
    C --> H["Package.json"]
    C --> I["Build Config"]
    
    D --> J["README"]
    
    classDef primary fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef secondary fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef config fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef docs fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    
    class A primary
    class B,C secondary
    class C config
    class D docs
    
    click A "https://github.com/${owner}/${repo}" _blank
    click J "https://github.com/${owner}/${repo}/blob/main/README.md" _blank
    click H "https://github.com/${owner}/${repo}/blob/main/package.json" _blank`;

    const summary = `${repo} is a ${techStack[0] || 'Unknown'} repository with ${directories.length} directories and ${files.length} files. Basic analysis completed. ${fallbackReason ? `(Note: ${fallbackReason})` : '(AI not available)'}`;

    return {
      mermaidChart,
      explanation,
      componentMapping,
      summary
    };
  } catch (error) {
    console.error('Error in fallback analysis:', error);
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Analysis failed due to an error',
      componentMapping: '',
      summary: 'Analysis failed'
    };
  }
}

function identifyProjectType(structure: any[], techStack: string[]): string {
  const hasNextjs = structure.some((item: any) => 
    item.type === 'file' && item.name.toLowerCase().includes('next.config')
  );
  const hasReact = techStack.includes('React') || techStack.includes('Next.js');
  const hasBackend = structure.some((item: any) => 
    item.type === 'dir' && ['backend', 'server', 'api'].includes(item.name.toLowerCase())
  );
  
  if (hasNextjs) return 'Next.js Full-Stack';
  if (hasReact && hasBackend) return 'React Full-Stack';
  if (hasReact) return 'React Frontend';
  if (hasBackend) return 'Backend API';
  return 'General Purpose';
}

function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

function processClickEvents(diagram: string, owner: string, repo: string): string {
  const clickPattern = /click (\S+)\s+["']([^"']+)['"]/g;
  
  return diagram.replace(clickPattern, (match: string, component: string, path: string) => {
    const fileName = path.split("/").pop() || "";
    const isFile = fileName.includes(".");
    
    const baseUrl = `https://github.com/${owner}/${repo}`;
    const pathType = isFile ? "blob" : "tree";
    const fullUrl = `${baseUrl}/${pathType}/main/${path}`;
    
    return `click ${component} "${fullUrl}"`;
  });
}

const getFallbackMermaidChart = (repoName: string = 'Repository') => {
  const timestamp = new Date().toLocaleString();
  
  return `%%{init: {'theme': 'base', 'themeVariables': {
    'primaryColor': '#7e57c2',
    'primaryTextColor': '#2d3748',
    'primaryBorderColor': '#9f7aea',
    'lineColor': '#a0aec0',
    'secondaryColor': '#4299e1',
    'tertiaryColor': '#f6ad55',
    'quaternaryColor': '#68d391',
    'background': '#ffffff',
    'nodeTextColor': '#2d3748',
    'nodeBorder': '2px',
    'nodeBorderRadius': '8px',
    'nodeFontSize': '14px',
    'edgeLabelBackground': '#f7fafc',
    'edgeLabelColor': '#4a5568',
  }}}%%
%% Generated at: ${timestamp}
flowchart TD
    %% Define node styles
    classDef core fill:#4F46E5,stroke:#4338CA,stroke-width:2px,color:white,font-weight:bold,rounded:true
    classDef backend fill:#3B82F6,stroke:#2563EB,stroke-width:2px,color:white,rounded:true
    classDef frontend fill:#10B981,stroke:#059669,stroke-width:2px,color:white,rounded:true
    classDef database fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:white,rounded:true
    classDef external fill:#EF4444,stroke:#DC2626,stroke-width:2px,color:white,rounded:true
    classDef api fill:#DB2777,stroke:#9D174D,stroke-width:2px,color:white,rounded:true
    
    %% Main Nodes
    A["${repoName} Analysis"]
    B["Backend Services"]
    C["Frontend Components"]
    D["Data Storage"]
    E["External Services"]
    F["API Layer"]
    
    %% Apply styles to main nodes
    class A core
    class B backend
    class C frontend
    class D database
    class E external
    class F api
    
    %% Subgraphs for better organization
    subgraph Architecture_Overview["Architecture Overview"]
        direction TB
        B <--> F
        C <--> F
        F <--> D
    end
    
    %% Main Connections
    A --> B & C
    B --> D
    C --> E
    
    %% Detailed Components
    B1["API Server"]
    B2["Authentication"]
    B3["Business Logic"]
    
    C1["UI Components"]
    C2["State Management"]
    C3["Routing"]
    
    D1["Database"]
    D2["Cache"]
    D3["File Storage"]
    
    E1["Third-party APIs"]
    E2["Authentication Provider"]
    
    %% Apply styles to components
    class B1,B2,B3 backend
    class C1,C2,C3 frontend
    class D1,D2,D3 database
    class E1,E2 external
    
    %% Connect sub-components
    B --> B1 & B2 & B3
    C --> C1 & C2 & C3
    D --> D1 & D2 & D3
    E --> E1 & E2
    click B1 "#" _blank
    click B2 "#" _blank
    click C1 "#" _blank
    
    %% Enhanced Styling
    classDef core fill:#4F46E5,stroke:#4338CA,stroke-width:2px,color:white,font-weight:bold,rounded:true
    classDef backend fill:#3B82F6,stroke:#2563EB,stroke-width:2px,color:white,rounded:true
    classDef frontend fill:#10B981,stroke:#059669,stroke-width:2px,color:white,rounded:true
    classDef database fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:white,rounded:true
    classDef external fill:#EF4444,stroke:#DC2626,stroke-width:2px,color:white,rounded:true
    classDef api fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:white,rounded:true
    
    %% Apply styles
    class A core
    class B,B1,B2,B3 backend
    class C,C1,C2,C3 frontend
    class D,D1,D2,D3 database
    class E,E1,E2 external
    class F api
    
    %% Add some visual separation
    style A stroke-dasharray: 5 5
    style "Architecture Overview" fill:none,stroke:#888,stroke-dasharray: 2 2`;
};

// --- Helper Functions Restored ---

function sanitizeMermaidDiagram(diagram: string): string {
  if (!diagram) return '';
  
  // 1. Basic cleanup: Remove markdown syntax
  let clean = diagram.replace(/```mermaid/gi, '').replace(/```/g, '').trim();

  // 2. Unescape Literal Newlines and standard escapes
  // The AI often outputs literal "\n" characters instead of real newlines.
  clean = clean.split('\\n').join('\n');

  // 3. Normalize Line Endings
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 4. Force keywords to their own lines (Tokenization)
  // This solves "jammed" lines like: node1[A]direction TDnode2[B]
  // We use specific lookaheads/lookbehinds or known structure to be safe.
  
  // 4a. Handle 'direction' (e.g., direction TB, direction LR)
  clean = clean.replace(/(direction\s+(?:TB|TD|BT|RL|LR))/g, '\n$1\n');

  // 4b. Handle 'subgraph' (space required after)
  clean = clean.replace(/(\S)(subgraph\s+)/g, '$1\n$2');
  
  // 4c. Handle 'end' (must be its own word)
  clean = clean.replace(/(\s|;)\b(end)\b(\s|;|$)/g, '\n$2\n');

  // 4d. Handle 'classDef', 'style', 'click' (usually start of line, but force it)
  clean = clean.replace(/(\S)(classDef\s+)/g, '$1\n$2');
  clean = clean.replace(/(\S)(style\s+)/g, '$1\n$2');
  clean = clean.replace(/(\S)(click\s+)/g, '$1\n$2');

  // 4e. Ensure graph header is clean
  clean = clean.replace(/^(graph|flowchart)\s+([A-Z]+)(.*)/, '$1 $2\n$3');

  // 5. Line-by-Line Processing (Robust)
  const lines = clean.split('\n');
  const processedLines: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // A. Pass through known directives/keywords immediately
    // Expanded list to be safe
    if (/^(classDef|style|click|linkStyle|direction|%%|subgraph|end)/.test(line)) {
        processedLines.push(line);
        continue;
    }
    
    // B. Pass through graph declaration
    if (/^(graph|flowchart)\s/.test(line)) {
        processedLines.push(line);
        continue;
    }

    // C. Handle Node Definitions: ID[Label] or ID("Label") etc.
    // Goal: Enforce quotes around labels to prevent syntax errors.
    // Matches: ID + (Open) + Content + (Close) at START of line.
    // We strictly ignore if it looks like a relationship (-->)
    if (!line.includes('-->') && !line.includes('-.->') && !line.includes('==>')) {
        const nodeMatch = line.match(/^([a-zA-Z0-9_]+)(\[|\(|\{)(.*)(\]|\)|\})$/);
        if (nodeMatch) {
            const [, id, open, content, close] = nodeMatch;
            let safeContent = content;
            
            // Remove existing outer quotes if present
            if (safeContent.startsWith('"') && safeContent.endsWith('"')) {
                safeContent = safeContent.slice(1, -1);
            }
            
            // Escape quotes inside
            safeContent = safeContent.replace(/"/g, "'");
            
            processedLines.push(`${id}${open}"${safeContent}"${close}`);
            continue;
        }
    }
    
    // D. Default: Pass through everything else check for broken lines or just push
    processedLines.push(line);
  }

  return processedLines.join('\n');
}

function inferMermaidClass(name: string, path?: string): string {
  const haystack = `${name} ${path || ''}`.toLowerCase();
  if (/(db|database|datasource|schema|postgres|mongo|prisma|storage)/.test(haystack)) return 'database';
  if (/frontend|ui|client|view|component|page|react|next/.test(haystack)) return 'frontend';
  if (/(api|endpoint|route|router)/.test(haystack)) return 'api';
  if (/(service|worker|processor|queue)/.test(haystack)) return 'service';
  if (/(backend|server|controller|logic)/.test(haystack)) return 'backend';
  if (/(external|third|github|stripe|supabase|aws|gcp)/.test(haystack)) return 'external';
  if (/(config|settings|env|environment)/.test(haystack)) return 'config';
  if (/(util|helper|hook|shared)/.test(haystack)) return 'util';
  return 'core';
}

function summarizeTopLevelCounts(lines: string[]): string[] {
  const counts: Record<string, number> = {};
  lines.forEach((path) => {
    if (!path) return;
    const segment = path.split('/')[0] || 'root';
    counts[segment] = (counts[segment] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_SUMMARY_ENTRIES)
    .map(([dir, count]) => `- ${dir}/ (${count} files)`);
}

function prepareFileTreeForPrompt(fileTree: string) {
  const lines = fileTree.split('\\n');
  const initialLength = lines.length;
  let truncated = false;

  if (initialLength <= MAX_FILE_TREE_LINES && fileTree.length <= MAX_FILE_TREE_CHARS) {
    return { promptTree: fileTree, truncated };
  }

  truncated = true;
  const sliceCount = Math.min(MAX_FILE_TREE_LINES, initialLength);
  const keptLines = lines.slice(0, sliceCount);
  const omitted = Math.max(0, initialLength - sliceCount);
  const summary = summarizeTopLevelCounts(lines.slice(sliceCount));

  const truncatedTree = [
    ...keptLines,
    '',
    `# ... truncated ${omitted} additional files to keep prompt under limits`,
    '# Top-level summary of truncated sections:',
    ...summary
  ].join('\\n');

  return { promptTree: truncatedTree, truncated };
}

async function fetchRepositoryStructure(owner: string, repo: string) {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenRepo-AI';
    headers['Accept'] = 'application/vnd.github.v3+json';
    
    console.log(`Fetching repository structure for ${owner}/${repo}`);
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers
    });
    
    const responseText = await response.text();
    if (response.headers.get('content-type')?.includes('text/html') || responseText.trim().startsWith('<!DOCTYPE')) {
      console.error('Received HTML error page instead of JSON response');
      return [];
    }
    if (!response.ok) {
      console.error(`GitHub API error (${response.status}):`, responseText);
      return [];
    }
    const contents = JSON.parse(responseText);
    return Array.isArray(contents) ? contents.filter((item: any) => item.type === 'dir' || item.type === 'file') : [];
  } catch (error) {
    console.error('Error in fetchRepositoryStructure:', error);
    return [];
  }
}

async function fetchRepositoryReadme(owner: string, repo: string) {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenRepo-AI';
    headers['Accept'] = 'application/vnd.github.v3+json';
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers
    });
    
    const responseText = await response.text();
    if (!response.ok) return '';
    const data = JSON.parse(responseText);
    if (!data.download_url) return '';
    
    const readmeHeaders = getGitHubHeaders();
    const readmeResponse = await fetch(data.download_url, { headers: readmeHeaders });
    return await readmeResponse.text();
  } catch (error) {
    return '';
  }
}

async function getCompleteFileTree(owner: string, repo: string): Promise<string> {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenRepo-AI';
    
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResponse = await fetch(repoUrl, { headers });
    if (!repoResponse.ok) return '';
    
    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch || 'main';
    
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    const treeResponse = await fetch(treeUrl, { headers });
    
    if (!treeResponse.ok) {
        const fallbackUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
        const fallbackResponse = await fetch(fallbackUrl, { headers });
        if (!fallbackResponse.ok) return '';
        const data = await fallbackResponse.json();
        return smartCompressTree(data.tree);
    }
    
    const data = await treeResponse.json();
    if (data.tree) return smartCompressTree(data.tree);
    return '';
  } catch (error) {
    return '';
  }
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children: TreeNode[];
  fileCount: number;
}

function buildTreeStructure(paths: any[]): TreeNode {
  const root: TreeNode = { name: 'root', path: '', type: 'dir', children: [], fileCount: 0 };
  for (const item of paths) {
    if (!shouldIncludeFile(item.path)) continue;
    const parts = item.path.split('/');
    let currentNode = root;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1 && item.type === 'blob';
        const currentPath = parts.slice(0, i + 1).join('/');
        let child = currentNode.children.find(c => c.name === part);
        if (!child) {
            child = { name: part, path: currentPath, type: isFile ? 'file' : 'dir', children: [], fileCount: 0 };
            currentNode.children.push(child);
        }
        if (!isFile) currentNode = child;
    }
  }
  return root;
}

function computeFileCounts(node: TreeNode): number {
    if (node.type === 'file') {
        node.fileCount = 1;
        return 1;
    }
    let sum = 0;
    for (const child of node.children) sum += computeFileCounts(child);
    node.fileCount = sum;
    return sum;
}

function shouldIncludeFile(path: string): boolean {
  if (['package.json', 'Dockerfile', 'docker-compose.yml', 'next.config.js', 'tsconfig.json'].includes(path.split('/').pop() || '')) return true;
  const excludedPatterns = ['node_modules/', 'vendor/', 'dist/', 'build/', '.git/', 'icons/', 'images/', 'assets/', 'test/', 'tests/', '.github/', '.vscode/'];
  return !excludedPatterns.some(pattern => path.includes(pattern));
}

function generateSmartTreeString(node: TreeNode, depth: number = 0): string {
    const indent = '  '.repeat(depth);
    if (node.name === 'root') return node.children.map(c => generateSmartTreeString(c, depth)).join('\\n');
    
    const noiseDirs = ['components', 'utils', 'hooks', 'styles', 'types', 'lib'];
    const isNoiseDir = noiseDirs.includes(node.name.toLowerCase());
    const isArchitecturalFile = ['layout.tsx', 'page.tsx', 'route.ts', 'App.tsx'].includes(node.name);
    
    if (node.type === 'dir') {
        const childFiles = node.children.filter(c => c.type === 'file');
        const childDirs = node.children.filter(c => c.type === 'dir');
        
        const shouldCollapseFiles = (childFiles.length > 5 && isNoiseDir) || (childFiles.length > 20);
        
        let output = `${indent}${node.name}/`;
        if (shouldCollapseFiles) {
            output += ` [Contains ${childFiles.length} files]`;
            for (const dir of childDirs) output += '\\n' + generateSmartTreeString(dir, depth + 1);
            return output;
        }
    }
    
    if (depth > 4 && !isArchitecturalFile && node.type === 'file') return '';
    if (node.type === 'file') {
         if (node.name.match(/\\.(png|jpg|gif|svg)$/)) return '';
         return `${indent}${node.name}`;
    }
    
    let lines = [`${indent}${node.name}/`];
    for (const child of node.children) {
        const childStr = generateSmartTreeString(child, depth + 1);
        if (childStr) lines.push(childStr);
    }
    return lines.join('\\n');
}

function smartCompressTree(tree: any[]): string {
    const root = buildTreeStructure(tree);
    computeFileCounts(root);
    return generateSmartTreeString(root, 0);
}
