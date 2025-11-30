'use server';

/**
 * @fileOverview GitDiagram-style repository analysis with 3-step AI process.
 * - gitdiagramStyleAnalysis - A function that performs deep repository analysis using real AI.
 * - GitdiagramStyleAnalysisInput - The input type for the gitdiagramStyleAnalysis function.
 */

import { z } from 'zod';
import { extractOwnerAndRepo } from '@/lib/utils';
import { isAIConfigured, createLangChainModel } from '@/ai/langchain-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getGitHubHeaders } from "@/lib/github-headers";

const GitdiagramStyleAnalysisInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the repository to analyze.'),
  techStack: z.array(z.string()).describe('The tech stack used in the repository.'),
  goal: z.string().describe('The learning goal of the user.'),
});
export type GitdiagramStyleAnalysisInput = z.infer<typeof GitdiagramStyleAnalysisInputSchema>;

const GitdiagramStyleAnalysisOutputSchema = z.object({
  mermaidChart: z.string().describe('The generated mermaid chart.'),
  explanation: z.string().describe('Detailed explanation of the system architecture.'),
  componentMapping: z.string().describe('Mapping of components to files/directories.'),
  summary: z.string().describe('A brief summary of the repository structure.'),
});
export type GitdiagramStyleAnalysisOutput = z.infer<typeof GitdiagramStyleAnalysisOutputSchema>;

const MERMAID_KEYWORDS = [
  'graph',
  'flowchart',
  'sequenceDiagram',
  'classDiagram',
  'stateDiagram',
  'erDiagram',
  'journey',
  'gantt',
  'pie',
  'gitgraph'
];

const MAX_FILE_TREE_LINES = 1500;
const MAX_FILE_TREE_CHARS = 120000;
const MAX_SUMMARY_ENTRIES = 25;
const AI_STEP_TIMEOUT_MS = 120000;

type ComponentNode = {
  id: string;
  label: string;
  path?: string;
  className: string;
};

function stripXmlTagContent(content: string, tag: string): string {
  if (!content) return '';
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = content.match(regex);
  if (match) {
    return match[1].trim();
  }
  return content.trim();
}

function ensureWrappedWithTag(content: string, tag: string): string {
  if (!content) {
    return `<${tag}></${tag}>`;
  }
  const trimmed = content.trim();
  if (trimmed.startsWith(`<${tag}`) && trimmed.endsWith(`</${tag}>`)) {
    return trimmed;
  }
  return `<${tag}>\n${trimmed}\n</${tag}>`;
}

function removeMermaidCodeFences(diagram: string): string {
  if (!diagram) return '';
  return diagram.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
}

function removeCodeFences(content: string): string {
  if (!content) return '';
  // Remove ```xml, ```markdown, ``` etc. and the closing ```
  return content.replace(/```[\w-]*\n/g, '').replace(/```/g, '').trim();
}

function sanitizeMermaidDiagram(diagram: string): string {
  if (!diagram) return '';
  
  // Apply structural formatting FIRST to handle single-line diagrams
  // This ensures that regexes relying on newlines (like subgraph sanitization) work correctly
  let sanitized = formatMermaidCode(diagram);

  // Fix incorrect class syntax (:: instead of :::)
  // Matches pattern like: Node["Label"]::className or Node::className
  // We look for :: followed by a class name, ensuring it's not part of a URL (http://) or C++ style scope
  sanitized = sanitized.replace(/([\])])\s*::\s*([a-zA-Z0-9_-]+)/g, '$1:::$2');
  sanitized = sanitized.replace(/(\w+)\s*::\s*([a-zA-Z0-9_-]+)/g, (match, p1, p2) => {
    if (p1 === 'http' || p1 === 'https') return match;
    return `${p1}:::${p2}`;
  });

  // Remove invalid class syntax from arrow connections (e.g., A --> B:::class)
  sanitized = sanitized.replace(/(-->|---|\-\.\->|\-\.-)\s*([a-zA-Z0-9_]+):::[a-zA-Z0-9_]+/g, '$1 $2');

  // Normalize improperly closed input/output shapes
  sanitized = sanitized.replace(/\[\/\"([^\"]+)\"\/?\]/g, '[\"$1\"]');
  sanitized = sanitized.replace(/\[\"([^\"]+)\"\/\]/g, '[\"$1\"]');

  // Ensure standard bracket nodes don't accidentally drop their closing bracket
  sanitized = sanitized.replace(/\[([^\[\]]+)\n/g, (_, label) => `[${label.trim()}]\n`);

  // Remove stray carriage returns
  sanitized = sanitized.replace(/\r/g, '');

  // Ensure subgraph declarations end on their own line
  sanitized = sanitized.replace(/end(\S)/g, 'end\n$1');
  
  // Replace 'endsubgraph' with 'end' (common AI hallucination)
  sanitized = sanitized.replace(/endsubgraph/g, 'end');

  // Replace literal '\n' sequences inside labels with HTML line breaks
  sanitized = sanitized.replace(/\\n/g, '<br/>');

  // Helper regex part for matching content that might be quoted with nested delimiters
  const getContentPattern = (delimiter: string) => `(?:[^${delimiter}]|"(?:[^"\\\\]|\\\\.)*")*`;
  const safeQuote = (content: string) => {
    let inner = content.trim();
    const isQuoted = inner.startsWith('"') && inner.endsWith('"');
    if (isQuoted) {
      inner = inner.substring(1, inner.length - 1);
    }
    inner = inner.replace(/"/g, "'");
    return `"${inner}"`;
  };

  // Shape sanitization (Cylinder, Subroutine, etc.)
  sanitized = sanitized.replace(new RegExp(`\\[\\((${getContentPattern('\\)')})\\)\\]`, 'g'), (_, c) => `[(${safeQuote(c)})]`);
  sanitized = sanitized.replace(new RegExp(`\\[\\[(${getContentPattern('\\]')})\\]\\]`, 'g'), (_, c) => `[[${safeQuote(c)}]]`);
  sanitized = sanitized.replace(new RegExp(`\\[\\/(${getContentPattern('\\/')})\\/\\]`, 'g'), (_, c) => `[/${safeQuote(c)}/]`);
  sanitized = sanitized.replace(new RegExp(`\\[\\\\(${getContentPattern('\\\\')})\\\\\\]`, 'g'), (_, c) => `[\\${safeQuote(c)}\\]`);
  sanitized = sanitized.replace(new RegExp(`\\(\\(([^)]+)\\)\\)`, 'g'), (_, c) => `((${safeQuote(c)}))`);
  sanitized = sanitized.replace(new RegExp(`\\{\\{(${getContentPattern('\\}')})\\}\\}`, 'g'), (_, c) => `{{${safeQuote(c)}}}`);
  sanitized = sanitized.replace(new RegExp(`(?<![\\[\\(])\\((${getContentPattern('\\)')})\\)`, 'g'), (match, c) => `(${safeQuote(c)})`);
  sanitized = sanitized.replace(new RegExp(`(?<!\\[)\\[(${getContentPattern('\\]')})\\]`, 'g'), (_, c) => `[${safeQuote(c)}]`);

  // Apply structural formatting AGAIN
  sanitized = formatMermaidCode(sanitized);

  console.log('--- MERMAID SANITIZATION DEBUG ---');
  console.log('Raw:', diagram.substring(0, 200) + '...');
  console.log('Sanitized:', sanitized.substring(0, 200) + '...');
  console.log('----------------------------------');

  return sanitized;
}

function formatMermaidCode(code: string): string {
  if (!code) return '';
  
  let formatted = code;

  // 1. Ensure newlines before top-level keywords
  // We use a more specific replacement to avoid eating existing newlines and ensure separation
  const keywords = ['subgraph', 'click', 'classDef', 'class', 'style', 'linkStyle'];
  keywords.forEach(kw => {
    // Replace (whitespace)keyword(whitespace) with \nkeyword 
    formatted = formatted.replace(new RegExp(`\\s+${kw}\\s+`, 'g'), `\n${kw} `);
  });

  // Handle 'end' separately to ensure it has a newline AFTER it as well, 
  // because 'end' is often followed by another block start on the same line in minified output
  formatted = formatted.replace(/\s+end\s+/g, '\nend\n');

  // 2. Ensure newline after subgraph title
  // Simplified regex: just look for subgraph "..." or subgraph Word
  // We don't try to be too smart about nested quotes here because we pre-processed them.
  formatted = formatted.replace(/(subgraph\s+(?:"[^"]*"|[^\s]+))\s+/g, '$1\n');

  // 3. Handle class assignments (:::className)
  // Fix: Remove :::className from subgraph declarations (e.g. subgraph "Name":::style)
  // Also clean up subgraph names that might contain brackets or extra quotes
  formatted = formatted.replace(/subgraph\s+([^\n]+)/g, (match, content) => {
    // Aggressively remove class styling (:::style)
    let cleaned = content.replace(/\s*:::[^\s\])]+/, '');
    
    // If it looks like 'Client["Label"]' or 'Client[Label]', extract just 'Client'
    // We want to simplify it to just a clean ID to avoid parsing errors
    if (cleaned.includes('[') || cleaned.includes('(')) {
        // Try to extract a clean ID before the bracket
        const idMatch = cleaned.match(/^["']?([a-zA-Z0-9_-]+)["']?\s*[\(\[]/);
        if (idMatch) {
            return `subgraph ${idMatch[1]}`;
        }
        // Fallback: if we can't find a clean ID, just strip special chars and quote it
        // This handles cases like 'subgraph "My Label"' -> 'subgraph "My Label"'
        // But converts 'subgraph "My Label"[...]' -> 'subgraph "My Label"'
        const labelMatch = cleaned.match(/^["']?([^"'\(\[]+)["']?/);
        if (labelMatch) {
             return `subgraph "${labelMatch[1].trim()}"`;
        }
        return `subgraph "${cleaned.replace(/["\[\]()]/g, '').trim()}"`;
    }
    return `subgraph ${cleaned.trim()}`;
  });
  
  // Ensure newline after class assignment
  formatted = formatted.replace(/(:::[a-zA-Z0-9_-]+)\s+(?![-=.])/g, '$1\n');

  // 4. Ensure graph/flowchart is on its own line
  formatted = formatted.replace(/^\s*(graph|flowchart)\s+([A-Z]+)([\s\S]*)/, '$1 $2\n$3');
  
  // 5. Split sequential connections (e.g. A-->B C-->D)
  formatted = formatted.replace(/([^\s"]+)\s+(?=[^\s"]+\s+(?:-->|---|==>|-\.->))/g, '$1\n');

  // 6. Clean up multiple newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  return formatted.trim();
}

const RESERVED_KEYWORDS = new Set(['graph', 'flowchart', 'subgraph', 'classDef', 'class', 'click', 'style', 'linkStyle']);

function extractNodeIds(diagram: string): Set<string> {
  const nodeIds = new Set<string>();
  const nodePattern = /^\s*([A-Za-z][\w-]*)\s*(?:\(|\[|\{)/gm;
  let match: RegExpExecArray | null;

  while ((match = nodePattern.exec(diagram)) !== null) {
    const id = match[1];
    if (!RESERVED_KEYWORDS.has(id)) {
      nodeIds.add(id);
    }
  }

  return nodeIds;
}

function ensureUniqueSubgraphNames(diagram: string): string {
  const nodeIds = extractNodeIds(diagram);
  const usedSubgraphs = new Set<string>();

  const lines = diagram.split('\n');
  const updatedLines = lines.map((line) => {
    const match = line.match(/^(\s*subgraph\s+)(?:"([^"]+)"|([^\s\[]+))(.*)$/);
    if (!match) return line;

    const [, prefix, quotedName, plainName, suffix] = match;
    const originalName = (quotedName ?? plainName ?? '').trim();
    if (!originalName) return line;

    const isIdentifier = /^[A-Za-z][\w-]*$/.test(originalName);
    let finalName = originalName;

    if (isIdentifier) {
      let counter = 1;
      while (nodeIds.has(finalName) || usedSubgraphs.has(finalName)) {
        finalName = `${originalName}_group${counter}`;
        counter += 1;
      }
    }

    usedSubgraphs.add(finalName);

    const renderedName = quotedName !== undefined || /\s/.test(originalName)
      ? `"${finalName}"`
      : finalName;

    return `${prefix}${renderedName}${suffix}`;
  });

  return updatedLines.join('\n');
}

function looksLikeMermaidDiagram(diagram: string): boolean {
  if (!diagram) return false;
  const trimmed = diagram.trim();
  if (!trimmed) return false;
  const firstContentLine = trimmed.split('\n').find(line => line.trim().length > 0)?.trim() || '';
  if (MERMAID_KEYWORDS.some(keyword => firstContentLine.startsWith(keyword))) {
    return true;
  }
  return /-->|:::|subgraph/i.test(trimmed);
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
  const lines = fileTree.split('\n');
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
  ].join('\n');

  return { promptTree: truncatedTree, truncated };
}

function parseComponentMapping(mappingText: string): ComponentNode[] {
  if (!mappingText) return [];
  const normalized = stripXmlTagContent(mappingText, 'component_mapping');
  const lines = normalized
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const nodes: ComponentNode[] = [];
  const seenLabels = new Set<string>();

  for (const line of lines) {
    const withoutBullet = line
      .replace(/^\d+[\.\)]\s*/, '')
      .replace(/^[-*•]\s*/, '')
      .trim();

    if (!withoutBullet) continue;

    let componentName = withoutBullet;
    let componentPath = '';

    if (withoutBullet.includes(':')) {
      const [namePart, ...rest] = withoutBullet.split(':');
      componentName = namePart.trim();
      componentPath = rest.join(':').trim();
    } else if (withoutBullet.includes('->')) {
      const [namePart, ...rest] = withoutBullet.split('->');
      componentName = namePart.trim();
      componentPath = rest.join('->').trim();
    } else if (withoutBullet.includes('-')) {
      const [namePart, ...rest] = withoutBullet.split('-');
      componentName = namePart.trim();
      componentPath = rest.join('-').trim();
    }

    if (!componentName || seenLabels.has(componentName.toLowerCase())) continue;
    seenLabels.add(componentName.toLowerCase());

    nodes.push({
      id: `C${nodes.length + 1}`,
      label: componentName,
      path: componentPath || undefined,
      className: inferMermaidClass(componentName, componentPath)
    });

    if (nodes.length >= 12) break; // keep diagrams readable
  }

  return nodes;
}

function generateDiagramFromComponentMapping(mappingText: string, repoName: string): string | null {
  const nodes = parseComponentMapping(mappingText);
  if (nodes.length === 0) return null;

  const lines: string[] = [];
  lines.push('flowchart TD');
  lines.push(`    subgraph "${repoName} Components"`);
  nodes.forEach(node => {
    lines.push(`        ${node.id}["${node.label}"]:::${node.className}`);
  });
  lines.push('    end');

  for (let i = 0; i < nodes.length - 1; i++) {
    lines.push(`    ${nodes[i].id} --> ${nodes[i + 1].id}`);
  }

  lines.push('');
  lines.push('    %% Click events will be expanded to GitHub URLs downstream');
  nodes
    .filter(node => node.path)
    .forEach(node => lines.push(`    click ${node.id} "${node.path}"`));

  lines.push('');
  lines.push('    %% Class definitions');
  lines.push('    classDef frontend fill:#90EE90,stroke:#2f855a,stroke-width:2px,color:#1f2937');
  lines.push('    classDef backend fill:#93C5FD,stroke:#1d4ed8,stroke-width:2px,color:#1f2937');
  lines.push('    classDef database fill:#FDE68A,stroke:#ca8a04,stroke-width:2px,color:#1f2937');
  lines.push('    classDef api fill:#FBCFE8,stroke:#be185d,stroke-width:2px,color:#1f2937');
  lines.push('    classDef service fill:#E9D5FF,stroke:#7c3aed,stroke-width:2px,color:#1f2937');
  lines.push('    classDef external fill:#FECACA,stroke:#b91c1c,stroke-width:2px,color:#1f2937');
  lines.push('    classDef core fill:#E5E7EB,stroke:#4b5563,stroke-width:2px,color:#1f2937');
  lines.push('    classDef util fill:#C7D2FE,stroke:#4338ca,stroke-width:2px,color:#1f2937');
  lines.push('    classDef config fill:#F3F4F6,stroke:#4b5563,stroke-width:2px,color:#111827');

  const classAssignments: Record<string, string[]> = {};
  nodes.forEach(node => {
    if (!classAssignments[node.className]) {
      classAssignments[node.className] = [];
    }
    classAssignments[node.className].push(node.id);
  });

  Object.entries(classAssignments).forEach(([className, ids]) => {
    if (ids.length > 0) {
      lines.push(`    class ${ids.join(',')} ${className}`);
    }
  });

  return lines.join('\n');
}

// Helper function to fetch repository structure
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
    
    // Check if response is HTML (error page)
    if (response.headers.get('content-type')?.includes('text/html') || responseText.trim().startsWith('<!DOCTYPE')) {
      console.error('Received HTML error page instead of JSON response');
      return [];
    }
    
    if (!response.ok) {
      console.error(`GitHub API error (${response.status}):`, responseText);
      return [];
    }
    
    const contents = JSON.parse(responseText);
    console.log(`Fetched ${contents.length} items from repository structure`);
    return Array.isArray(contents) ? contents.filter((item: any) => item.type === 'dir' || item.type === 'file') : [];
  } catch (error) {
    console.error('Error in fetchRepositoryStructure:', error);
    return [];
  }
}

// Helper function to fetch README content
async function fetchRepositoryReadme(owner: string, repo: string) {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenRepo-AI';
    headers['Accept'] = 'application/vnd.github.v3+json';
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers
    });
    
    const responseText = await response.text();
    
    // Check if response is HTML (error page)
    if (response.headers.get('content-type')?.includes('text/html') || responseText.trim().startsWith('<!DOCTYPE')) {
      console.error('Received HTML error page instead of JSON response when fetching README');
      return '';
    }
    
    if (!response.ok) {
      console.error(`GitHub API error (${response.status}) when fetching README:`, responseText);
      return '';
    }
    
    const data = JSON.parse(responseText);
    
    if (!data.download_url) {
      console.error('No download_url in README response');
      return '';
    }
    
    // Add authorization to README download request if needed
    const readmeHeaders = getGitHubHeaders();
    const readmeResponse = await fetch(data.download_url, {
      headers: readmeHeaders
    });
    
    if (!readmeResponse.ok) {
      console.error(`Error downloading README content: ${readmeResponse.status}`);
      return '';
    }
    
    return await readmeResponse.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    return '';
  }
}

// Helper function to get complete file tree matching GitDiagram's exact approach
async function getCompleteFileTree(owner: string, repo: string): Promise<string> {
  try {
    const headers = getGitHubHeaders();
    headers['User-Agent'] = 'OpenRepo-AI';
    
    console.log(`\nFetching repository info for ${owner}/${repo}...`);
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResponse = await fetch(repoUrl, { headers });
    
    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      console.error(`❌ Failed to fetch repo info (${repoResponse.status}):`, errorText);
      return '';
    }
    
    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch || 'main';
    
    // Try to get file tree using git/trees API (GitDiagram's approach)
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    console.log(`Fetching file tree from: ${treeUrl}`);
    const treeResponse = await fetch(treeUrl, { headers });
    
    if (!treeResponse.ok) {
      const errorText = await treeResponse.text();
      console.error(`❌ Failed to fetch file tree (${treeResponse.status}):`, errorText);
      
      // Try with 'main' as fallback
      console.log(`Trying fallback with 'main' branch...`);
      const fallbackUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
      const fallbackResponse = await fetch(fallbackUrl, { headers });
      
      if (!fallbackResponse.ok) {
        const fallbackError = await fallbackResponse.text();
        console.error(`❌ Fallback branch also failed (${fallbackResponse.status}):`, fallbackError);
        return '';
      }
      
      console.log(`✅ Successfully fetched file tree using fallback branch`);
      const data = await fallbackResponse.json();
      return filterAndFormatFileTree(data.tree);
    }
    
    const data = await treeResponse.json();
    if (data.tree) {
      console.log(`✅ Successfully fetched file tree with ${data.tree.length} items`);
      const filteredTree = filterAndFormatFileTree(data.tree);
      console.log(`Filtered tree contains ${filteredTree.split('\n').filter(Boolean).length} files`);
      return filteredTree;
    }
    
    console.warn('No tree data found in GitHub API response');
    return '';
  } catch (error) {
    console.error('Error fetching file tree:', error);
    return '';
  }
}

// File filtering function matching GitDiagram's exact logic
function shouldIncludeFile(path: string): boolean {
  const excludedPatterns = [
    // Dependencies
    'node_modules/',
    'vendor/',
    'venv/',
    // Compiled files
    '.min.',
    '.pyc',
    '.pyo',
    '.pyd',
    '.so',
    '.dll',
    '.class',
    // Asset files
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.ico',
    '.svg',
    '.ttf',
    '.woff',
    '.webp',
    // Cache and temporary files
    '__pycache__/',
    '.cache/',
    '.tmp/',
    // Lock files and logs
    'yarn.lock',
    'poetry.lock',
    '*.log',
    // Configuration files
    '.vscode/',
    '.idea/',
  ];

  return !excludedPatterns.some(pattern => path.toLowerCase().includes(pattern));
}

function filterAndFormatFileTree(tree: any[]): string {
  const paths = tree
    .filter(item => item.type === 'blob' && shouldIncludeFile(item.path))
    .map(item => item.path);
  
  return paths.join('\n');
}

// GitDiagram-style 3-step AI analysis prompts - EXACT copies from GitDiagram
const SYSTEM_FIRST_PROMPT = `You are an expert software architect tasked with analyzing a codebase and describing its system architecture. Your goal is to provide a comprehensive, specific, and technical explanation of how the system works, which will be used to generate a system design diagram.

You will be provided with:
1. The complete file tree of the project (<file_tree> tags).
2. The README file of the project (<readme> tags).

Analyze these inputs to understand the project's purpose, structure, and implementation details.

Your output must be a detailed architectural description enclosed in <explanation> tags.

Follow these guidelines for your explanation:

1.  **Project Identity**: Briefly identify what the project is (e.g., "A Next.js e-commerce platform using Supabase," "A Rust-based CLI tool for file manipulation").

2.  **Core Components**: Identify and describe the major building blocks. Do not just list folders; explain what they *do*.
    *   Example: "The 'auth' service handles JWT issuance and user verification using Passport.js."
    *   Example: "The 'engine' module contains the core game loop and physics calculations."

3.  **Data Flow & Interactions**: Explain how data moves through the system.
    *   How does the frontend communicate with the backend?
    *   How do services interact with the database?
    *   Are there message queues, events, or background jobs?

4.  **Key Patterns**: Mention architectural patterns used (e.g., MVC, Clean Architecture, Microservices, Event-Driven).

5.  **Technology Stack**: Briefly mention key technologies if they define the architecture (e.g., "Uses Redis for caching," "Relies on gRPC for inter-service communication").

**CRITICAL INSTRUCTIONS:**
*   **BE SPECIFIC**: Do not give generic advice like "The system has a frontend and backend." Instead, say "The Next.js frontend in 'src/app' consumes the Express API in 'src/api' via REST endpoints."
*   **DESCRIBE, DON'T INSTRUCT**: Do NOT write "You should draw a box for..." or "The diagram should include...". Write "The system consists of..." or "The API Gateway routes requests to...".
*   **FOCUS ON THE ACTUAL CODE**: Base your explanation *strictly* on the provided file tree and README. Do not hallucinate components that aren't there.

Present your analysis within <explanation> tags.`;

const SYSTEM_SECOND_PROMPT = `You are tasked with mapping key components of a system design to their corresponding files and directories in a project's file structure. You will be provided with a detailed explanation of the system design/architecture and a file tree of the project.

First, carefully read the system design explanation which will be enclosed in <explanation> tags in the users message.

Then, examine the file tree of the project which will be enclosed in <file_tree> tags in the users message.

Your task is to analyze the system design explanation and identify key components, modules, or services mentioned. Then, try your best to map these components to what you believe could be their corresponding directories and files in the provided file tree.

Guidelines:
1. Focus on major components described in the system design.
2. Look for directories and files that clearly correspond to these components.
3. Include both directories and specific files when relevant.
4. If a component doesn't have a clear corresponding file or directory, simply dont include it in the map.

Now, provide your final answer in the following format:

<component_mapping>
1. [Component Name]: [File/Directory Path]
2. [Component Name]: [File/Directory Path]
[Continue for all identified components]
</component_mapping>

Remember to be as specific as possible in your mappings, only use what is given to you from the file tree, and to strictly follow the components mentioned in the explanation.`;

const SYSTEM_THIRD_PROMPT = `You are a principal software engineer tasked with creating a system design diagram using Mermaid.js based on a detailed explanation. Your goal is to accurately represent the architecture and design of the project as described in the explanation.

The detailed explanation of the design will be enclosed in <explanation> tags in the users message.

Also, sourced from the explanation, as a bonus, a few of the identified components have been mapped to their paths in the project file tree, whether it is a directory or file which will be enclosed in <component_mapping> tags in the users message.

To create the Mermaid.js diagram:

1. Carefully read and analyze the provided design explanation.
2. Identify the main components, services, and their relationships within the system.
3. Determine the appropriate Mermaid.js diagram type to use (e.g., flowchart, sequence diagram, class diagram, architecture, etc.) based on the nature of the system described.
4. Create the Mermaid.js code to represent the design, ensuring that:
   a. All major components are included
   b. Relationships between components are clearly shown
   c. The diagram accurately reflects the architecture described in the explanation
   d. The layout is logical and easy to understand

Guidelines for diagram components and relationships:
- Use appropriate shapes for different types of components (e.g., rectangles for services, cylinders for databases, etc.)
- Use clear and concise labels for each component
- Show the direction of data flow or dependencies using arrows
- Group related components together if applicable
- Include any important notes or annotations mentioned in the explanation
- Just follow the explanation. It will have everything you need.

IMPORTANT!!: Please orient and draw the diagram as vertically as possible. You must avoid long horizontal lists of nodes and sections!

CRITICAL - LAYOUT INSTRUCTIONS:
- You MUST use 'flowchart TD' (Top-Down) to ensure a vertical orientation.
- Enforce a "Tree-like" structure. The diagram should look like a hierarchy, not a flat list.
- Use subgraphs to group related components (e.g., "Services", "Database", "Frontend") but keep the overall flow vertical.
- Limit the number of nodes per row/rank to a maximum of 3. Force a new row if there are more.
- Avoid "fan-out" patterns where one node connects to many others in a single horizontal line. Use intermediate nodes or subgraphs to break this up.
- Keep connections clean. Avoid excessive cross-linking that makes the diagram look like a "spiderweb". Focus on the main data flow.

CRITICAL - COLOR APPLICATION INSTRUCTIONS:
You MUST apply the appropriate color classes to ALL nodes in your diagram. Here's how to apply colors:
- Frontend components (React, Vue, Angular, HTML, CSS, UI components): Use :::frontend
- Backend components (API servers, business logic, controllers): Use :::backend  
- Database components (PostgreSQL, MongoDB, MySQL, data stores): Use :::database
- API endpoints/routes: Use :::api
- Services/Microservices: Use :::service
- External/Third-party services: Use :::external
- Core libraries/modules: Use :::core
- Utility/helper functions: Use :::util
- Configuration files: Use :::config
- Test files/modules: Use :::test

Example: 
- FrontendComponent["Frontend Component"]:::frontend
- BackendService["Backend Service"]:::backend
- Database[(Database)]:::database

At the end of your diagram, DO NOT add bulk class statements (e.g. \`class A,B,C style\`). Instead, you MUST apply the class directly to the node definition using \`:::style\`.
    
    Example:
    - Correct: \`FrontendComponent["Frontend Component"]:::frontend\`
    - Incorrect: \`class FrontendComponent frontend\`

You must include click events for components of the diagram that have been specified in the provided <component_mapping>:
- Do not try to include the full url. This will be processed by another program afterwards. All you need to do is include the path.
- For example:
  - This is a correct click event: \`click Example "app/example.js"\`
  - This is an incorrect click event: \`click Example "https://github.com/username/repo/blob/main/app/example.js"\`
- Do this for as many components as specified in the component mapping, include directories and files.
  - If you believe the component contains files and is a directory, include the directory path.
  - If you believe the component references a specific file, include the file path.
- Make sure to include the full path to the directory or file exactly as specified in the component mapping.
- It is very important that you do this for as many files as possible. The more the better.

- IMPORTANT: THESE PATHS ARE FOR CLICK EVENTS ONLY, these paths should not be included in the diagram's node's names. Only for the click events. Paths should not be seen by the user.

Your output should be valid Mermaid.js code that can be rendered into a diagram.

Do not include init declarations. This is handled externally. Just return the diagram code.

Your response must strictly be just the Mermaid.js code, without any additional text or explanations.
No code fence or markdown ticks needed, simply return the Mermaid.js code.

Ensure that your diagram adheres strictly to the given explanation, without adding or omitting any significant components or relationships. 

For general direction, the provided example below is how you should structure your code:

\`\`\`mermaid
flowchart TD 
    %% or graph TD, your choice

    %% Global entities
    A("Entity A"):::external
    %% more...

    %% Subgraphs and modules
    subgraph "Layer A"
        direction TB
        A1("Module A"):::example
        A2("Module B"):::example
        A1 --> A2
    end

    %% more subgraphs, modules, etc...

    %% Connections
    A -->|"relationship"| B
    %% and a lot more...

    %% Click Events
    click A1 "example/example.js"
    %% and a lot more...

    %% Styles - IMPORTANT: Add these colors to make the diagram visually appealing!
    classDef frontend fill:#90EE90,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#ADD8E6,stroke:#333,stroke-width:2px,color:#000
    classDef database fill:#F0E68C,stroke:#333,stroke-width:2px,color:#000
    classDef api fill:#FFB6C1,stroke:#333,stroke-width:2px,color:#000
    classDef service fill:#DDA0DD,stroke:#333,stroke-width:2px,color:#000
    classDef external fill:#FFA07A,stroke:#333,stroke-width:2px,color:#000
    classDef core fill:#98FB98,stroke:#333,stroke-width:2px,color:#000
    classDef util fill:#F0E68C,stroke:#333,stroke-width:2px,color:#000
    classDef config fill:#D3D3D3,stroke:#333,stroke-width:2px,color:#000
    classDef test fill:#FFFFE0,stroke:#333,stroke-width:2px,color:#000
    
    %% Apply styles to nodes based on their type
    %% Example: Node1["Label"]:::frontend
    %% Make sure to apply appropriate classes to your nodes inline!
\`\`\`

EXTREMELY Important notes on syntax!!! (PAY ATTENTION TO THIS):
- Make sure to add colour to the diagram!!! This is extremely critical.
- In Mermaid.js syntax, we cannot include special characters for nodes without being inside quotes! For example: \`EX[/api/process (Backend)]:::api\` and \`API -->|calls Process()| Backend\` are two examples of syntax errors. They should be \`EX["/api/process (Backend)"]:::api\` and \`API -->|"calls Process()"| Backend\` respectively. Notice the quotes. This is extremely important. Make sure to include quotes for any string that contains special characters.
- In Mermaid.js syntax, you cannot apply a class style directly within a subgraph declaration. For example: \`subgraph "Frontend Layer":::frontend\` is a syntax error. However, you can apply them to nodes within the subgraph. For example: \`Example["Example Node"]:::frontend\` is valid. DO NOT use \`class Example1,Example2 frontend\`.
- In Mermaid.js syntax, there cannot be spaces in the relationship label names. For example: \`A -->| "example relationship" | B\` is a syntax error. It should be \`A -->|"example relationship"| B\` 
- In Mermaid.js syntax, you cannot give subgraphs an alias like nodes. For example: \`subgraph A "Layer A"\` is a syntax error. It should be \`subgraph "Layer A"\`. NEVER use brackets in subgraph definitions like \`subgraph Id["Label"]\`. Just use \`subgraph "Label"\` or \`subgraph Id\`. 
`;

export async function gitdiagramStyleAnalysis(input: GitdiagramStyleAnalysisInput): Promise<GitdiagramStyleAnalysisOutput> {
  const { repoUrl, techStack, goal } = input;
  
  // Validation checks (matching GitDiagram's approach)
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
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Unable to parse repository URL',
      componentMapping: '',
      summary: 'Unable to parse repository URL'
    };
  }
  
  const { owner, repo } = repoInfo;
  
  // Block example repos (matching GitDiagram's approach)
  const blockedRepos = ['fastapi', 'streamlit', 'flask', 'api-analytics', 'monkeytype'];
  if (blockedRepos.includes(repo.toLowerCase())) {
    return {
      mermaidChart: getFallbackMermaidChart(),
      explanation: 'Example repositories cannot be analyzed',
      componentMapping: '',
      summary: 'Example repository blocked'
    };
  }

  // Debug: Check environment variables
  console.log('🔍 Environment Variables Check:');
  console.log('GEMINI_API_KEY exists:', Boolean(process.env.GEMINI_API_KEY));
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
  try {
    const { owner, repo } = extractOwnerAndRepo(repoUrl) || {};
    if (!owner || !repo) {
      throw new Error('Invalid GitHub repository URL');
    }

    console.log(`\n=== Starting GitDiagram-style AI analysis for ${owner}/${repo} ===`);
    
    // Debug: Check environment variables
    console.log('🔍 Environment Variables Check:');
    console.log('GEMINI_API_KEY exists:', Boolean(process.env.GEMINI_API_KEY));
    console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
    console.log('UPSTASH_REDIS_URL exists:', Boolean(process.env.UPSTASH_REDIS_URL));
    console.log('DATABASE_URL exists:', Boolean(process.env.DATABASE_URL));
    console.log('GITHUB_TOKEN exists:', Boolean(process.env.GITHUB_TOKEN));

    // Check if AI is configured
    if (!isAIConfigured()) {
      console.warn('❌ AI not configured, falling back to basic analysis');
      return fallbackAnalysis(owner, repo, techStack);
    } else {
      console.log('✅ AI is configured, proceeding with analysis');
    }

    // Step 1: Fetch repository data in parallel
    console.log('\nStep 1: Fetching repository data...');
    const [structure, readme, completeFileTree] = await Promise.all([
      fetchRepositoryStructure(owner, repo),
      fetchRepositoryReadme(owner, repo),
      getCompleteFileTree(owner, repo)
    ]);

    console.log(`\nRepository data fetched:`);
    console.log(`- Structure items: ${structure?.length || 0}`);
    console.log(`- README length: ${readme?.length || 0} chars`);
    console.log(`- File tree length: ${completeFileTree?.length || 0} chars`);

    // If we couldn't get the complete file tree, fall back to basic analysis
    if (!completeFileTree) {
      console.warn('❌ Could not get complete file tree, falling back to basic analysis');
      return fallbackAnalysis(owner, repo, techStack);
    }

    // Create the LangChain model
    const model = createLangChainModel();
    const parser = new StringOutputParser();

    // Token count check
    const { promptTree: promptFileTree, truncated: fileTreeTruncated } = prepareFileTreeForPrompt(completeFileTree);
    if (fileTreeTruncated) {
      console.log(`✂️ File tree truncated for AI prompt: ${completeFileTree.split('\n').length} -> ${promptFileTree.split('\n').length} lines`);
    }
    console.log(`- Prompt file tree length: ${promptFileTree.length} chars`);

    const combinedContent = `${promptFileTree}\n${readme}`;
    const tokenCount = estimateTokenCount(combinedContent);
    
    if (tokenCount > 195000) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: `Repository is too large (>195k tokens) for analysis. AI model max context length is 200k tokens. Current size: ${tokenCount} tokens.`,
        componentMapping: '',
        summary: 'Repository too large for analysis'
      };
    }

    // Step 2: Generate detailed system explanation using AI
    console.log('Step 2: Generating system explanation with AI...');
    const firstPrompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_FIRST_PROMPT],
      ['user', `<file_tree>
${promptFileTree.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</file_tree>

<readme>
${readme.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</readme>`]
    ]);

    const firstChain = firstPrompt.pipe(model).pipe(parser);
    const explanationRaw = await withTimeout(firstChain.invoke({}), AI_STEP_TIMEOUT_MS, 'Step 2 (explanation) timed out');
    
    // Clean up explanation: remove code fences and ensure proper tagging
    const explanationCleaned = removeCodeFences(explanationRaw);
    const explanationWrapped = ensureWrappedWithTag(explanationCleaned, 'explanation');
    const explanationContent = stripXmlTagContent(explanationWrapped, 'explanation');

    // Step 3: Map components to files/directories using AI
    console.log('Step 3: Mapping components to files with AI...');
    const secondPrompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_SECOND_PROMPT],
      ['user', `<explanation>
${explanationContent.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</explanation>

<file_tree>
${promptFileTree.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</file_tree>`]
    ]);

    const secondChain = secondPrompt.pipe(model).pipe(parser);
    const componentMappingRaw = await withTimeout(secondChain.invoke({}), AI_STEP_TIMEOUT_MS, 'Step 3 (component mapping) timed out');
    const componentMappingCleaned = removeCodeFences(componentMappingRaw);
    const componentMappingWrapped = ensureWrappedWithTag(componentMappingCleaned, 'component_mapping');
    const componentMappingContent = stripXmlTagContent(componentMappingWrapped, 'component_mapping');

    // Step 4: Generate detailed Mermaid diagram using AI
    console.log('Step 4: Generating Mermaid diagram with AI...');
    const thirdPrompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_THIRD_PROMPT],
      ['user', `<explanation>
${explanationContent.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</explanation>

<component_mapping>
${componentMappingContent.replace(/\{/g, '{{').replace(/\}/g, '}}')}
</component_mapping>

Repository: ${repo}
Owner: ${owner}
GitHub URL: https://github.com/${owner}/${repo}`]
    ]);

    const thirdChain = thirdPrompt.pipe(model).pipe(parser);
    let mermaidChart = await withTimeout(thirdChain.invoke({}), AI_STEP_TIMEOUT_MS, 'Step 4 (mermaid generation) timed out');
    
    // Check for BAD_INSTRUCTIONS (GitDiagram's approach)
    if (mermaidChart.includes('BAD_INSTRUCTIONS')) {
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: 'Invalid or unclear instructions provided',
        componentMapping: '',
        summary: 'Invalid instructions'
      };
    }
    
    // Process mermaid code to remove markdown markers and fix common syntax issues
    mermaidChart = ensureUniqueSubgraphNames(
      sanitizeMermaidDiagram(removeMermaidCodeFences(mermaidChart))
    );

    if (!looksLikeMermaidDiagram(mermaidChart)) {
      console.warn('⚠️ Mermaid output did not look valid; generating diagram from component mapping instead.');
      const derivedChart = generateDiagramFromComponentMapping(componentMappingContent, repo) || getFallbackMermaidChart(repo);
      mermaidChart = derivedChart;
    }
    
    // Process click events to include full GitHub URLs (GitDiagram's approach)
    mermaidChart = processClickEvents(mermaidChart, owner, repo);

    const primaryLanguage = techStack[0] || 'Unknown';
    const directories = structure.filter((item: any) => item.type === 'dir');
    const files = structure.filter((item: any) => item.type === 'file');

    const summary = `${repo} is a ${primaryLanguage} repository with ${directories.length} directories and ${files.length} files. AI-generated architectural analysis completed.`;

    return {
      mermaidChart,
      explanation: explanationContent,
      componentMapping: componentMappingContent,
      summary
    };
  } catch (error) {
    console.error('Error in GitDiagram-style AI analysis:', error);
    
    // Check if this was a timeout error
    if (error instanceof Error && error.message.includes('timed out')) {
      console.warn('AI analysis timed out, using fallback analysis');
      return {
        mermaidChart: getFallbackMermaidChart(),
        explanation: 'The AI analysis took too long to complete. Showing a simplified diagram instead.',
        componentMapping: '',
        summary: `Analysis timed out - ${error.message}`
      };
    }
    
    // For other errors, use the fallback analysis
    return fallbackAnalysis(owner, repo, techStack);
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
async function fallbackAnalysis(owner: string, repo: string, techStack: string[]): Promise<GitdiagramStyleAnalysisOutput> {
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

    const summary = `${repo} is a ${techStack[0] || 'Unknown'} repository with ${directories.length} directories and ${files.length} files. Basic analysis completed (AI not available).`;

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
  // Simple token estimation: ~4 characters per token on average
  // This is a rough estimate similar to what GitDiagram uses
  return Math.ceil(text.length / 4);
}

function processClickEvents(diagram: string, owner: string, repo: string): string {
  /**
   * Process click events in Mermaid diagram to include full GitHub URLs.
   * Detects if path is file or directory and uses appropriate URL format.
   * Matches GitDiagram's exact approach.
   */
  
  const clickPattern = /click (\S+)\s+["']([^"']+)['"]/g;
  
  return diagram.replace(clickPattern, (match: string, component: string, path: string) => {
    // Determine if path is likely a file (has extension) or directory
    const fileName = path.split("/").pop() || "";
    const isFile = fileName.includes(".");
    
    // Construct GitHub URL (using 'main' as default branch like GitDiagram)
    const baseUrl = `https://github.com/${owner}/${repo}`;
    const pathType = isFile ? "blob" : "tree";
    const fullUrl = `${baseUrl}/${pathType}/main/${path}`;
    
    // Return the full click event with the new URL
    return `click ${component} "${fullUrl}"`;
  });
}

// Enhanced fallback Mermaid chart with more detailed architecture visualization
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
