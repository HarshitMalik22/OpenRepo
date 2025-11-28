import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { getRepositoryStructure } from './github';

export interface ArchitectureNode {
  id: string;
  name: string;
  type: 'component' | 'service' | 'utility' | 'api' | 'database' | 'config' | 'hook' | 'module' | 'test';
  filePath: string;
  startLine: number;
  endLine: number;
  language: string;
  linesOfCode: number;
  complexity: number;
  imports: string[];
  exports: string[];
  dependencies: string[];
  dependents: string[];
  metadata: {
    isEntry?: boolean;
    isAsync?: boolean;
    hasErrorHandling?: boolean;
    hasTests?: boolean;
    framework?: string;
    patterns: string[];
  };
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  type: 'import' | 'export' | 'call' | 'dependency' | 'inheritance';
  strength: number;
}

export interface ArchitectureAnalysis {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  layers: {
    entry: string[];
    presentation: string[];
    business: string[];
    data: string[];
    infrastructure: string[];
  };
  metrics: {
    totalFiles: number;
    totalLines: number;
    averageComplexity: number;
    coupling: number;
    cohesion: number;
  };
}

export class ArchitectureAnalyzer {
  private nodes: Map<string, ArchitectureNode> = new Map();
  private edges: ArchitectureEdge[] = [];
  private fileContents: Map<string, string> = new Map();

  async analyzeRepository(owner: string, repo: string, maxDepth: number = 3): Promise<ArchitectureAnalysis> {
    console.log(`Starting architecture analysis for ${owner}/${repo} with max depth ${maxDepth}`);
    
    // Get repository structure
    const structure = await getRepositoryStructure(owner, repo, '', maxDepth);
    
    // Parse all relevant files
    await this.parseRepositoryFiles(structure);
    
    // Build dependency graph
    this.buildDependencyGraph();
    
    // Calculate architecture layers
    const layers = this.calculateLayers();
    
    // Calculate metrics
    const metrics = this.calculateMetrics();
    
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      layers,
      metrics
    };
  }

  private async parseRepositoryFiles(structure: any[], path: string = ''): Promise<void> {
    console.log(`Parsing repository structure with ${structure.length} items at path: ${path}`);
    
    for (const item of structure) {
      if (item.type === 'dir') {
        if (item.children && item.children.length > 0) {
          console.log(`Processing directory: ${item.name} with ${item.children.length} children`);
          await this.parseRepositoryFiles(item.children, item.path);
        } else {
          console.log(`Skipping empty directory: ${item.name}`);
        }
      } else if (item.type === 'file') {
        // Use the relevant flag from the file structure, fallback to local check if not available
        const isRelevant = item.relevant !== undefined ? item.relevant : this.isRelevantFile(item.name);
        
        if (isRelevant) {
          console.log(`Processing relevant file: ${item.name} (size: ${item.size || 'unknown'})`);
          await this.parseFile(item);
        } else {
          console.log(`Skipping item: ${item.name} (type: ${item.type}, relevant: ${isRelevant})`);
        }
      } else {
        console.log(`Skipping item: ${item.name} (type: ${item.type})`);
      }
    }
  }

  private isRelevantFile(filename: string): boolean {
    const relevantExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rs', '.json', '.html', '.css', '.scss'];
    const irrelevantPatterns = [
      'node_modules', '.git', 'dist', 'build', 'coverage', 
      '.min.', '.bundle.', 'vendor/',
      'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
    ];
    
    // Always include important configuration files
    const importantFiles = [
      'package.json', 'tsconfig.json', 'jest.config.js', 'webpack.config.js',
      'vite.config.js', 'next.config.js', 'nuxt.config.js', 'tailwind.config.js'
    ];
    
    // Include if it has a relevant extension OR is an important file
    return (relevantExtensions.some(ext => filename.endsWith(ext)) ||
            importantFiles.some(important => filename === important)) &&
           !irrelevantPatterns.some(pattern => filename.includes(pattern));
  }

  private async parseFile(file: any): Promise<void> {
    console.log(`Parsing file: ${file.path}, content length: ${file.content ? file.content.length : 0}, size: ${file.size}`);
    
    if (!file.content || file.size > 100000) { // Skip large files
      console.log(`Skipping file ${file.path}: no content or too large (${file.size} bytes)`);
      return;
    }

    try {
      const content = file.content;
      this.fileContents.set(file.path, content);

      const node = this.createNodeFromFile(file, content);
      if (node) {
        console.log(`Created node: ${node.id} (${node.name})`);
        this.nodes.set(node.id, node);
        this.extractDependencies(content, node);
      } else {
        console.log(`Failed to create node for file: ${file.path}`);
      }
    } catch (error) {
      console.warn(`Failed to parse file ${file.path}:`, error);
    }
  }

  private createNodeFromFile(file: any, content: string): ArchitectureNode | null {
    const lines = content.split('\n');
    const language = this.detectLanguage(file.name);
    
    // Basic node creation
    const node: ArchitectureNode = {
      id: this.generateNodeId(file.path),
      name: this.extractComponentName(file.name, file.path),
      type: this.inferComponentType(file.path, content),
      filePath: file.path,
      startLine: 1,
      endLine: lines.length,
      language,
      linesOfCode: this.countLinesOfCode(content),
      complexity: this.calculateComplexity(content, language),
      imports: [],
      exports: [],
      dependencies: [],
      dependents: [],
      metadata: {
        patterns: this.detectPatterns(content, language)
      }
    };

    // Language-specific parsing
    console.log(`File: ${file.name}, Language: ${language}`);
    if (language === 'typescript' || language === 'javascript') {
      console.log(`Parsing JavaScript/TypeScript content for ${file.name}`);
      this.parseJavaScriptContent(content, node);
    } else if (language === 'python') {
      console.log(`Parsing Python content for ${file.name}`);
      this.parsePythonContent(content, node);
    } else {
      console.log(`No specific parser for language: ${language}`);
    }

    return node;
  }

  private detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'go': 'go',
      'rs': 'rust'
    };
    return languageMap[ext || ''] || 'unknown';
  }

  private extractComponentName(filename: string, path: string): string {
    // Remove extension and path to get clean component name
    const name = filename.split('.')[0];
    const pathParts = path.split('/');
    const parentDir = pathParts[pathParts.length - 2];
    
    // Use parent directory context for better naming
    if (parentDir && !['src', 'lib', 'components', 'utils'].includes(parentDir)) {
      return `${parentDir}/${name}`;
    }
    
    return name;
  }

  private inferComponentType(path: string, content: string): ArchitectureNode['type'] {
    const pathLower = path.toLowerCase();
    
    // Path-based inference
    if (pathLower.includes('component') || pathLower.includes('.jsx') || pathLower.includes('.tsx')) {
      return 'component';
    }
    if (pathLower.includes('service') || pathLower.includes('api')) {
      return 'service';
    }
    if (pathLower.includes('util') || pathLower.includes('helper')) {
      return 'utility';
    }
    if (pathLower.includes('config') || pathLower.includes('setting')) {
      return 'config';
    }
    if (pathLower.includes('hook') && (pathLower.includes('.ts') || pathLower.includes('.js'))) {
      return 'hook';
    }
    if (pathLower.includes('test') || pathLower.includes('spec')) {
      return 'test';
    }
    if (pathLower.includes('database') || pathLower.includes('db') || pathLower.includes('model')) {
      return 'database';
    }
    
    // Content-based inference
    if (content.includes('export default') || content.includes('ReactDOM.render')) {
      return 'component';
    }
    if (content.includes('export function') || content.includes('module.exports')) {
      return 'service';
    }
    
    return 'module';
  }

  private countLinesOfCode(content: string): number {
    const lines = content.split('\n');
    return lines.filter(line => 
      line.trim() !== '' && !line.trim().startsWith('//') && !line.trim().startsWith('*')
    ).length;
  }

  private calculateComplexity(content: string, language: string): number {
    let complexity = 1; // Base complexity
    
    // Count decision points
    const decisionPatterns = [
      /\bif\b/g, /\belse if\b/g, /\belse\b/g,
      /\bfor\b/g, /\bwhile\b/g, /\bdo\b/g,
      /\bswitch\b/g, /\bcase\b/g,
      /\btry\b/g, /\bcatch\b/g,
      /\?\s*[^:]*\s*:/g, // ternary operator
      /\b&&\b/g, /\b\|\|\b/g // logical operators
    ];
    
    decisionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    // Language-specific complexity factors
    if (language === 'typescript' || language === 'javascript') {
      // Count async/await, promises, callbacks
      const asyncPatterns = [/async/g, /await/g, /Promise/g, /=>\s*{/g];
      asyncPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) complexity += matches.length * 0.5;
      });
    }
    
    return Math.round(complexity);
  }

  private parseJavaScriptContent(content: string, node: ArchitectureNode): void {
    console.log(`Parsing JavaScript content for ${node.name}, content length: ${content.length}`);
    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      });

      // Store imports in a temporary array to avoid closure issues
      const imports: string[] = [];

      traverse(ast, {
        ImportDeclaration(path) {
          const source = path.node.source.value;
          console.log(`Found import: ${source}`);
          // Capture both external and local imports
          imports.push(source);
        },
        ExportNamedDeclaration(path) {
          if (path.node.declaration) {
            if (path.node.declaration.type === 'FunctionDeclaration') {
              node.exports.push(path.node.declaration.id?.name || 'anonymous');
            } else if (path.node.declaration.type === 'VariableDeclaration') {
              path.node.declaration.declarations.forEach((decl: any) => {
                if (decl.id.type === 'Identifier') {
                  node.exports.push(decl.id.name);
                }
              });
            }
          }
        },
        ExportDefaultDeclaration(path) {
          node.exports.push('default');
          node.metadata.isEntry = true;
        },
        FunctionDeclaration(path) {
          if (path.node.async) {
            node.metadata.isAsync = true;
          }
        },
        TryStatement(path) {
          node.metadata.hasErrorHandling = true;
        }
      });

      // Copy the captured imports to the node
      node.imports.push(...imports);
      console.log(`Total imports found for ${node.name}: ${imports.length}`);
    } catch (error) {
      // Fallback to regex-based parsing for syntax errors
      this.parseJavaScriptWithRegex(content, node);
    }
  }

  private parseJavaScriptWithRegex(content: string, node: ArchitectureNode): void {
    console.log(`Using regex fallback for ${node.name}`);
    // Import statements
    const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
    console.log(`Regex import matches: ${importMatches ? importMatches.length : 0}`);
    if (importMatches) {
      importMatches.forEach(match => {
        const sourceMatch = match.match(/from\s+['"]([^'"]+)['"]/);
        if (sourceMatch) {
          console.log(`Found regex import: ${sourceMatch[1]}`);
          node.imports.push(sourceMatch[1]);
        }
      });
    }

    // Export statements
    const exportMatches = content.match(/export\s+(?:default\s+)?(?:function|const|let|var|class)\s+(\w+)/g);
    if (exportMatches) {
      exportMatches.forEach(match => {
        const nameMatch = match.match(/(?:function|const|let|var|class)\s+(\w+)/);
        if (nameMatch) {
          node.exports.push(nameMatch[1]);
        }
      });
    }

    // Async functions
    node.metadata.isAsync = content.includes('async ');
    node.metadata.hasErrorHandling = content.includes('try') && content.includes('catch');
  }

  private parsePythonContent(content: string, node: ArchitectureNode): void {
    console.log(`Parsing Python content for ${node.name}`);
    // Import statements
    const importMatches = content.match(/^(?:from\s+(\S+)\s+)?import\s+(.+)$/gm);
    console.log(`Python import matches: ${importMatches ? importMatches.length : 0}`);
    if (importMatches) {
      importMatches.forEach(match => {
        const parts = match.match(/from\s+(\S+)\s+import\s+(.+)|import\s+(.+)/);
        if (parts) {
          const module = parts[1] || parts[3];
          if (module) {
            console.log(`Found Python import: ${module}`);
            node.imports.push(module);
          }
        }
      });
    }

    // Function definitions
    const funcMatches = content.match(/^def\s+(\w+)\s*\(/gm);
    if (funcMatches) {
      funcMatches.forEach(match => {
        const nameMatch = match.match(/def\s+(\w+)/);
        if (nameMatch) {
          node.exports.push(nameMatch[1]);
        }
      });
    }

    // Class definitions
    const classMatches = content.match(/^class\s+(\w+)/gm);
    if (classMatches) {
      classMatches.forEach(match => {
        const nameMatch = match.match(/class\s+(\w+)/);
        if (nameMatch) {
          node.exports.push(nameMatch[1]);
        }
      });
    }

    node.metadata.isAsync = content.includes('async def');
    node.metadata.hasErrorHandling = content.includes('try:') && content.includes('except:');
  }

  private detectPatterns(content: string, language: string): string[] {
    const patterns: string[] = [];
    
    // Design patterns
    if (content.includes('class') && content.includes('extends')) {
      patterns.push('inheritance');
    }
    if (content.includes('singleton') || content.includes('getInstance')) {
      patterns.push('singleton');
    }
    if (content.includes('observer') || content.includes('subscribe') || content.includes('emit')) {
      patterns.push('observer');
    }
    if (content.includes('factory') || content.includes('create')) {
      patterns.push('factory');
    }
    
    // Architecture patterns
    if (content.includes('middleware') || content.includes('use(')) {
      patterns.push('middleware');
    }
    if (content.includes('router') || content.includes('route')) {
      patterns.push('routing');
    }
    if (content.includes('controller') || content.includes('Controller')) {
      patterns.push('mvc');
    }
    
    // Async patterns
    if (content.includes('Promise') || content.includes('async') || content.includes('await')) {
      patterns.push('async');
    }
    if (content.includes('callback') || content.includes('=>')) {
      patterns.push('callback');
    }
    
    return patterns;
  }

  private extractDependencies(content: string, node: ArchitectureNode): void {
    // Extract dependencies from imports and require statements
    node.imports.forEach(imp => {
      const dependencyId = this.generateNodeIdFromImport(imp, node.filePath);
      if (dependencyId) {
        node.dependencies.push(dependencyId);
      }
    });
  }

  private generateNodeId(path: string): string {
    return path.replace(/[^a-zA-Z0-9]/g, '_');
  }

  private generateNodeIdFromImport(importPath: string, currentPath: string): string | null {
    // Convert import paths to node IDs
    if (importPath.startsWith('.')) {
      // Local import - resolve relative path
      const currentDir = currentPath.split('/').slice(0, -1).join('/');
      let resolvedPath = `${currentDir}/${importPath.replace(/^\.\//, '')}`;
      
      // Remove file extensions and normalize path
      resolvedPath = resolvedPath.replace(/\.(ts|tsx|js|jsx|py)$/, '');
      
      return this.generateNodeId(resolvedPath);
    } else if (importPath.startsWith('/')) {
      // Absolute import - remove extensions
      const cleanPath = importPath.replace(/\.(ts|tsx|js|jsx|py)$/, '');
      return this.generateNodeId(cleanPath);
    } else {
      // Check if this might be a local module without relative path
      // For Python: check if import matches any of our node names
      const importParts = importPath.split('.');
      
      // Try to find matching nodes by checking if any node ID contains the import path
      for (const [nodeId, node] of this.nodes) {
        // For Python imports like 'repo_visualizer.analyzer'
        if (importPath.includes('.') && node.language === 'python') {
          const nodePathParts = node.filePath.replace(/\.py$/, '').split('/');
          const importPathParts = importPath.split('.');
          
          // Check if the import path matches the end of the node path
          // For example: 'repo_visualizer.analyzer' should match 'src/repo_visualizer/analyzer'
          if (importPathParts.length <= nodePathParts.length) {
            const startIndex = nodePathParts.length - importPathParts.length;
            const isMatch = importPathParts.every((part, index) => {
              return nodePathParts[startIndex + index] === part;
            });
            
            if (isMatch) {
              return nodeId;
            }
          }
          
          // Also check if the import path matches any consecutive parts in the node path
          // This handles cases where the import might be a submodule
          for (let i = 0; i <= nodePathParts.length - importPathParts.length; i++) {
            const isMatch = importPathParts.every((part, index) => {
              return nodePathParts[i + index] === part;
            });
            
            if (isMatch) {
              return nodeId;
            }
          }
        }
      }
      
      // For JavaScript/TypeScript: check if it's a bare import that might be local
      if (!importPath.includes('.') && !importPath.includes('/')) {
        // This might be a local module, check if any node matches
        for (const [nodeId, node] of this.nodes) {
          const nodeName = node.filePath.split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '');
          if (nodeName === importPath) {
            return nodeId;
          }
        }
      }
      
      // External dependency - return as-is for external node reference
      return `external_${importPath.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
  }

  private buildDependencyGraph(): void {
    // Build edges based on dependencies
    this.nodes.forEach((node, nodeId) => {
      node.dependencies.forEach(dependencyId => {
        if (this.nodes.has(dependencyId)) {
          this.edges.push({
            from: nodeId,
            to: dependencyId,
            type: 'import',
            strength: 1
          });
        }
      });
    });
  }
  private calculateLayers() {
    const layers = {
      entry: [] as string[],
      presentation: [] as string[],
      business: [] as string[],
      data: [] as string[],
      infrastructure: [] as string[]
    };

    this.nodes.forEach(node => {
      if (node.metadata.isEntry || node.filePath.includes('index') || node.filePath.includes('main')) {
        layers.entry.push(node.id);
      } else if (node.type === 'component' || node.filePath.includes('component') || node.filePath.includes('view')) {
        layers.presentation.push(node.id);
      } else if (node.type === 'service' || node.type === 'api' || node.filePath.includes('service')) {
        layers.business.push(node.id);
      } else if (node.type === 'database' || node.filePath.includes('model') || node.filePath.includes('data')) {
        layers.data.push(node.id);
      } else if (node.type === 'config' || node.type === 'utility' || node.filePath.includes('config')) {
        layers.infrastructure.push(node.id);
      } else {
        layers.business.push(node.id); // Default to business layer
      }
    });

    return layers;
  }

  private calculateMetrics() {
    const nodes = Array.from(this.nodes.values());
    const totalFiles = nodes.length;
    const totalLines = nodes.reduce((sum, node) => sum + node.linesOfCode, 0);
    
    // Handle division by zero for empty analysis
    const averageComplexity = totalFiles > 0 
      ? nodes.reduce((sum, node) => sum + node.complexity, 0) / totalFiles 
      : 0;
    
    // Calculate coupling (average number of dependencies per node)
    const totalDependencies = nodes.reduce((sum, node) => sum + node.dependencies.length, 0);
    const coupling = totalFiles > 0 ? totalDependencies / totalFiles : 0;
    
    // Calculate cohesion (simplified - ratio of internal to external dependencies)
    const internalDependencies = this.edges.filter(edge => 
      !edge.from.startsWith('external_') && !edge.to.startsWith('external_')
    ).length;
    const cohesion = this.edges.length > 0 ? internalDependencies / this.edges.length : 0;

    return {
      totalFiles,
      totalLines,
      averageComplexity: Math.round(averageComplexity * 100) / 100,
      coupling: Math.round(coupling * 100) / 100,
      cohesion: Math.round(cohesion * 100) / 100
    };
  }
}
