/**
 * @fileOverview Modular utilities for Mermaid diagram processing
 * 
 * This module provides clean, focused functions for:
 * - Cleaning Mermaid code (removing markdown, normalizing)
 * - Ensuring valid graph declarations
 * - Conservative repair of broken patterns
 * - Basic syntax validation
 * - Processing click events
 * 
 * Key principle: Only fix what's clearly broken, preserve valid syntax.
 */

export interface MermaidValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Lightweight cleanup of Mermaid code
 * - Removes markdown code fences
 * - Normalizes line endings
 * - Removes zero-width characters
 * - Preserves all valid Mermaid syntax
 */
export function cleanMermaidCode(code: string): string {
  if (!code) return '';
  
  let cleaned = code.trim();
  
  // Remove markdown code fences
  cleaned = cleaned.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
  
  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Remove zero-width characters that can break parsing
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // Unescape literal newlines (AI sometimes outputs \n as text)
  cleaned = cleaned.split('\\n').join('\n');
  
  return cleaned.trim();
}

/**
 * Ensures a valid graph/flowchart declaration exists
 * Preserves leading comments and adds declaration if missing
 */
export function ensureGraphDeclaration(code: string): string {
  if (!code) return 'flowchart TD';
  
  const lines = code.split('\n');
  const commentLines: string[] = [];
  const contentLines: string[] = [];
  let foundDeclaration = false;
  let foundContent = false;
  
  // Separate comments from content
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('%%') && !foundContent) {
      commentLines.push(line);
    } else if (trimmed && !foundContent) {
      foundContent = true;
      // Check if this line is a graph declaration
      if (/^(graph|flowchart)\s+[A-Z]+/.test(trimmed)) {
        foundDeclaration = true;
        contentLines.push(line);
      } else {
        contentLines.push(line);
      }
    } else if (foundContent) {
      contentLines.push(line);
    }
  }
  
  // If no declaration found, add one
  if (!foundDeclaration) {
    return [...commentLines, 'flowchart TD', ...contentLines].join('\n');
  }
  
  return code;
}

/**
 * Fixes unquoted node labels that contain special characters
 * Mermaid requires quotes around labels with special chars like (), :, ,, etc.
 * 
 * Example: A3[CLI (crawl)] → A3["CLI (crawl)"]
 */
function fixUnquotedLabels(code: string): string {
  if (!code) return '';
  
  // Special characters that require quoting in Mermaid labels
  const specialChars = /[()|,;:&<>]/;
  
  // Process line by line to avoid false matches in complex structures
  const lines = code.split('\n');
  const fixedLines: string[] = [];
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('%%') || !line.trim()) {
      fixedLines.push(line);
      continue;
    }
    
    // Skip classDef, style, click, and other directive lines
    if (/^\s*(classDef|style|click|linkStyle|direction|class)\s/.test(line)) {
      fixedLines.push(line);
      continue;
    }
    
    // Skip relationship lines (they have --> or similar)
    if (line.includes('-->') || line.includes('-.->') || line.includes('==>')) {
      fixedLines.push(line);
      continue;
    }
    
    // Match node definitions: NodeID[Label] where Label might contain special chars
    // Pattern: word characters, optional whitespace, [, content, ]
    // We want to match: A3[CLI (crawl)] but not A3["Already Quoted"]
    const nodePattern = /(\w+)\s*\[([^\]]+)\]/g;
    
    let fixedLine = line;
    fixedLine = fixedLine.replace(nodePattern, (match, nodeId, labelContent) => {
      // Skip if already quoted (starts and ends with quotes)
      const trimmedLabel = labelContent.trim();
      if ((trimmedLabel.startsWith('"') && trimmedLabel.endsWith('"')) ||
          (trimmedLabel.startsWith("'") && trimmedLabel.endsWith("'"))) {
        return match;
      }
      
      // Check if label contains special characters that need quoting
      if (specialChars.test(labelContent)) {
        // Escape any existing quotes in the label
        const escapedLabel = labelContent.replace(/"/g, '&quot;').trim();
        return `${nodeId}["${escapedLabel}"]`;
      }
      
      // No special characters, keep as-is
      return match;
    });
    
    fixedLines.push(fixedLine);
  }
  
  return fixedLines.join('\n');
}

/**
 * Conservative repair of clearly broken patterns
 * Only fixes obvious issues, doesn't modify valid syntax
 */
export function repairMermaidCode(code: string): string {
  if (!code) return '';
  
  let repaired = code;
  
  // First, fix unquoted labels with special characters
  repaired = fixUnquotedLabels(repaired);
  
  const lines = repaired.split('\n');
  const repairedLines: string[] = [];
  
  // Map of truncated keywords to full keywords
  const truncatedKeywords: Record<string, string> = {
    'assDef': 'classDef',
    'lassDef': 'classDef',
    'ubgraph': 'subgraph',
    'owchart': 'flowchart',
    'raph': 'graph',
    'lass': 'class',
    'tyle': 'style',
    'lick': 'click',
  };
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('%%')) {
      repairedLines.push(line);
      continue;
    }
    
    // Fix truncated keywords at line start
    let wasRepaired = false;
    for (const [truncated, full] of Object.entries(truncatedKeywords)) {
      if (trimmed.startsWith(truncated + ' ') || trimmed === truncated) {
        const restOfLine = trimmed.substring(truncated.length);
        repairedLines.push(line.replace(trimmed, full + restOfLine));
        wasRepaired = true;
        break;
      }
    }
    
    if (wasRepaired) continue;
    
    // Fix incomplete classDef statements (missing semicolon)
    if (trimmed.startsWith('classDef') && !trimmed.endsWith(';')) {
      // Only add semicolon if it looks like a complete statement
      if (trimmed.includes('fill:') || trimmed.includes('stroke:')) {
        repairedLines.push(line.replace(trimmed, trimmed + ';'));
        continue;
      }
    }
    
    // Skip clearly broken fragments (very short lines that aren't keywords)
    if (trimmed.length < 3 && !/^(%%|end|graph|flowchart)$/.test(trimmed)) {
      continue;
    }
    
    // Keep the line as-is
    repairedLines.push(line);
  }
  
  return repairedLines.join('\n').trim();
}

/**
 * Basic structural validation of Mermaid syntax
 * Returns validation result with any errors found
 */
export function validateMermaidSyntax(code: string): MermaidValidationResult {
  const errors: string[] = [];
  
  if (!code || code.trim().length < 10) {
    errors.push('Diagram code is too short or empty');
    return { valid: false, errors };
  }
  
  const lines = code.split('\n');
  
  // Check for graph/flowchart declaration
  const hasDeclaration = lines.some(line => {
    const trimmed = line.trim();
    return /^(graph|flowchart)\s+[A-Z]+/.test(trimmed) && !trimmed.startsWith('%%');
  });
  
  if (!hasDeclaration) {
    errors.push('No valid graph/flowchart declaration found');
  }
  
  // Basic bracket matching (simple check, not perfect)
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  
  if (openBrackets !== closeBrackets) {
    errors.push(`Unmatched square brackets: ${openBrackets} open, ${closeBrackets} close`);
  }
  
  if (openParens !== closeParens) {
    errors.push(`Unmatched parentheses: ${openParens} open, ${closeParens} close`);
  }
  
  // Check for truncated keywords that weren't repaired
  const truncatedPatterns = ['assDef', 'lassDef', 'ubgraph', 'owchart', 'raph'];
  const hasTruncatedKeywords = lines.some(line => {
    const trimmed = line.trim();
    return truncatedPatterns.some(pattern => 
      trimmed.startsWith(pattern + ' ') && trimmed.length < 50
    );
  });
  
  if (hasTruncatedKeywords) {
    errors.push('Truncated keywords detected that could not be repaired');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Process click events in Mermaid diagram
 * Converts relative paths to full GitHub URLs
 */
export function processClickEvents(
  diagram: string,
  owner: string,
  repo: string
): string {
  const clickPattern = /click\s+(\S+)\s+["']([^"']+)['"]/g;
  
  return diagram.replace(clickPattern, (match: string, component: string, path: string) => {
    // Skip if already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return match;
    }
    
    const fileName = path.split('/').pop() || '';
    const isFile = fileName.includes('.');
    
    const baseUrl = `https://github.com/${owner}/${repo}`;
    const pathType = isFile ? 'blob' : 'tree';
    const fullUrl = `${baseUrl}/${pathType}/main/${path}`;
    
    return `click ${component} "${fullUrl}"`;
  });
}

/**
 * Complete Mermaid processing pipeline
 * Applies all cleaning, repair, and validation steps in order
 */
export function processMermaidDiagram(
  code: string,
  owner?: string,
  repo?: string
): {
  processed: string;
  validation: MermaidValidationResult;
} {
  let processed = cleanMermaidCode(code);
  processed = ensureGraphDeclaration(processed);
  processed = repairMermaidCode(processed);
  
  if (owner && repo) {
    processed = processClickEvents(processed, owner, repo);
  }
  
  const validation = validateMermaidSyntax(processed);
  
  return {
    processed,
    validation
  };
}
