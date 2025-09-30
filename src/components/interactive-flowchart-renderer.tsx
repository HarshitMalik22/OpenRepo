"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Maximize, 
  ExternalLink, 
  FileText, 
  GitBranch, 
  Settings, 
  Database, 
  Globe, 
  Cpu,
  X,
  BarChart3,
  CheckCircle,
  Copy,
  Github,
  Search,
  Sparkles,
  Layers,
  Target,
  Share2,
  MessageSquare,
  Brain
} from 'lucide-react';
import type { Repository } from '@/lib/types';

interface FlowchartNode {
  id: string;
  label: string;
  type: 'entry' | 'component' | 'module' | 'service' | 'database' | 'external' | 'config' | 'api' | 'hook' | 'util' | 'test';
  filePath?: string;
  startLine?: number;
  endLine?: number;
  fileSize?: number;
  language?: string;
  linesOfCode?: number;
  cyclomaticComplexity?: number;
  maintainabilityIndex?: number;
  imports?: string[];
  exports?: string[];
  externalDeps?: string[];
  testCoverage?: number;
  testFiles?: string[];
  executionTime?: string;
  memoryUsage?: string;
  vulnerabilities?: number;
  securityScore?: number;
  hasDocs?: boolean;
  docCoverage?: number;
  status?: 'active' | 'stable' | 'deprecated' | 'experimental';
  designPatterns?: string[];
  performanceOptimizations?: string[];
  securityMeasures?: string[];
  complexity: number;
  importance: number;
  dependencies: string[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  isSelected?: boolean;
  isHighlighted?: boolean;
  [key: string]: any;
}

interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
}

interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

interface InteractiveFlowchartProps {
  chart: string;
  repository: Repository;
  onNodeClick?: (node: FlowchartNode) => void;
  theme?: 'light' | 'dark' | 'auto';
}

export default function InteractiveFlowchartRenderer({ 
  chart, 
  repository, 
  onNodeClick,
  theme = 'dark' 
}: InteractiveFlowchartProps) {
  console.log('InteractiveFlowchartRenderer received chart:', chart, typeof chart);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [flowchartData, setFlowchartData] = useState<FlowchartData>({ nodes: [], edges: [] });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<string[]>([]);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'architecture' | 'detailed' | 'focused'>('architecture');
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  // Filter and search nodes
  const getFilteredNodes = useCallback(() => {
    return flowchartData.nodes.filter(node => {
      const matchesSearch = searchTerm === '' || 
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.filePath && node.filePath.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterType === 'all' || node.type === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [flowchartData.nodes, searchTerm, filterType]);

  // Get unique node types for filter dropdown
  const getNodeTypes = useCallback(() => {
    const types = new Set(flowchartData.nodes.map(node => node.type));
    return Array.from(types).sort();
  }, [flowchartData.nodes]);

  // Highlight related nodes
  const highlightRelatedNodes = useCallback((nodeId: string) => {
    const related = new Set<string>();
    related.add(nodeId);
    
    // Find connected nodes
    flowchartData.edges.forEach(edge => {
      if (edge.from === nodeId) related.add(edge.to);
      if (edge.to === nodeId) related.add(edge.from);
    });
    
    setHighlightedNodes(Array.from(related));
  }, [flowchartData.edges]);

  // Clear highlights
  const clearHighlights = useCallback(() => {
    setHighlightedNodes([]);
  }, []);

  // Natural language search with advanced query parsing
  const handleNaturalLanguageSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setNaturalLanguageQuery(query);
    
    // Add to query history
    setQueryHistory(prev => [query, ...prev.slice(0, 9)]);
    
    // Parse the query and determine the search type
    const lowerQuery = query.toLowerCase();
    let searchType: 'filter' | 'highlight' | 'focus' | 'path' | 'cluster' = 'filter';
    let targetNodes: FlowchartNode[] = [];
    let visualizationMode = 'default';
    
    // Advanced query parsing
    if (lowerQuery.includes('show me') || lowerQuery.includes('display')) {
      if (lowerQuery.includes('entry point') || lowerQuery.includes('main')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'entry' || 
          node.label.toLowerCase().includes('main') ||
          node.label.toLowerCase().includes('index') ||
          node.label.toLowerCase().includes('app')
        );
        visualizationMode = 'focused';
      } else if (lowerQuery.includes('api') || lowerQuery.includes('endpoint')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'api' ||
          node.label.toLowerCase().includes('api') ||
          node.label.toLowerCase().includes('endpoint') ||
          node.label.toLowerCase().includes('route')
        );
        visualizationMode = 'focused';
      } else if (lowerQuery.includes('database') || lowerQuery.includes('db')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'database' ||
          node.label.toLowerCase().includes('database') ||
          node.label.toLowerCase().includes('db') ||
          node.label.toLowerCase().includes('sql')
        );
        visualizationMode = 'cluster';
      } else if (lowerQuery.includes('test') || lowerQuery.includes('coverage')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'test' ||
          node.label.toLowerCase().includes('test') ||
          node.label.toLowerCase().includes('spec')
        );
        visualizationMode = 'focused';
      } else if (lowerQuery.includes('config') || lowerQuery.includes('setting')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'config' ||
          node.label.toLowerCase().includes('config') ||
          node.label.toLowerCase().includes('setting')
        );
        visualizationMode = 'cluster';
      } else if (lowerQuery.includes('service') || lowerQuery.includes('microservice')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'service' ||
          node.label.toLowerCase().includes('service')
        );
        visualizationMode = 'cluster';
      } else if (lowerQuery.includes('external') || lowerQuery.includes('dependency')) {
        searchType = 'filter';
        targetNodes = flowchartData.nodes.filter(node => 
          node.type === 'external' ||
          node.dependencies && node.dependencies.length > 0
        );
        visualizationMode = 'cluster';
      }
    } else if (lowerQuery.includes('path') || lowerQuery.includes('flow') || lowerQuery.includes('trace')) {
      searchType = 'path';
      // Find path between nodes (simplified implementation)
      const startNode = flowchartData.nodes.find(node => 
        node.type === 'entry' || node.label.toLowerCase().includes('main')
      );
      if (startNode) {
        targetNodes = [startNode];
        // Add connected nodes
        const connectedNodes = flowchartData.edges
          .filter(edge => edge.from === startNode.id)
          .map(edge => flowchartData.nodes.find(n => n.id === edge.to))
          .filter(Boolean) as FlowchartNode[];
        targetNodes.push(...connectedNodes);
      }
      visualizationMode = 'path';
    } else if (lowerQuery.includes('complex') || lowerQuery.includes('important')) {
      searchType = 'highlight';
      targetNodes = flowchartData.nodes.filter(node => 
        (node.complexity || 0) > 7 || (node.importance || 0) > 7
      );
      visualizationMode = 'highlight';
    } else {
      // Default keyword search
      searchType = 'filter';
      targetNodes = flowchartData.nodes.filter(node => {
        return node.label.toLowerCase().includes(lowerQuery) ||
               (node.filePath && node.filePath.toLowerCase().includes(lowerQuery)) ||
               node.type.toLowerCase().includes(lowerQuery) ||
               (node.dependencies && node.dependencies.some(dep => dep.toLowerCase().includes(lowerQuery)));
      });
      visualizationMode = 'focused';
    }
    
    // Simulate AI processing with realistic delay
    setTimeout(() => {
      // Apply the visualization based on search type
      if (searchType === 'filter') {
        // Filter to show only relevant nodes
        setFilteredNodes(targetNodes.map(node => node.id));
        setHighlightedNodes([]);
      } else if (searchType === 'highlight') {
        // Highlight relevant nodes while keeping all visible
        setHighlightedNodes(targetNodes.map(node => node.id));
        setFilteredNodes([]);
      } else if (searchType === 'path') {
        // Show path visualization
        setHighlightedNodes(targetNodes.map(node => node.id));
        setFilteredNodes([]);
      } else if (searchType === 'cluster') {
        // Group related nodes
        setHighlightedNodes(targetNodes.map(node => node.id));
        setFilteredNodes([]);
      }
      
      // Set the appropriate view mode
      setViewMode(visualizationMode as any);
      
      // Generate search result summary
      const summary = {
        query,
        resultCount: targetNodes.length,
        searchType,
        visualizationMode,
        timestamp: new Date().toISOString()
      };
      
      // Store search result for potential future use
      console.log('Search result:', summary);
      
      setIsSearching(false);
    }, 1500); // Longer delay to simulate AI processing
  }, [flowchartData.nodes, flowchartData.edges]);

  // Generate intelligent smart suggestions
  const generateSuggestions = useCallback(() => {
    const nodeTypes = Array.from(new Set(flowchartData.nodes.map(node => node.type)));
    const suggestions: string[] = [];
    
    // Analyze codebase structure for intelligent suggestions
    const hasAPI = flowchartData.nodes.some(node => 
      node.type === 'api' || node.label.toLowerCase().includes('api')
    );
    const hasDatabase = flowchartData.nodes.some(node => 
      node.type === 'database' || node.label.toLowerCase().includes('db')
    );
    const hasTests = flowchartData.nodes.some(node => 
      node.type === 'test' || node.label.toLowerCase().includes('test')
    );
    const hasAuth = flowchartData.nodes.some(node => 
      node.label.toLowerCase().includes('auth') || node.label.toLowerCase().includes('login')
    );
    const hasConfig = flowchartData.nodes.some(node => 
      node.type === 'config' || node.label.toLowerCase().includes('config')
    );
    
    // Core architecture suggestions
    if (hasAPI) {
      suggestions.push('Display all API endpoints');
      suggestions.push('Show API documentation');
    }
    if (hasDatabase) {
      suggestions.push('Find database connections');
      suggestions.push('Show data models');
    }
    if (hasTests) {
      suggestions.push('Display test coverage');
      suggestions.push('Find untested components');
    }
    if (hasAuth) {
      suggestions.push('Show authentication flow');
      suggestions.push('Display security components');
    }
    if (hasConfig) {
      suggestions.push('Display configuration files');
      suggestions.push('Show environment settings');
    }
    
    // Always include these fundamental suggestions
    suggestions.push('Show me the main entry points');
    suggestions.push('Find external dependencies');
    suggestions.push('Show service architecture');
    suggestions.push('Display complex components');
    suggestions.push('Show critical paths');
    
    // Context-aware suggestions based on selected node
    if (selectedNode) {
      const nodeType = selectedNode.type.toLowerCase();
      const nodeName = selectedNode.label.toLowerCase();
      
      // Node-specific suggestions
      if (nodeType === 'api' || nodeName.includes('api')) {
        suggestions.push(`Show API consumers for ${selectedNode.label}`);
        suggestions.push(`Find API dependencies of ${selectedNode.label}`);
      } else if (nodeType === 'database' || nodeName.includes('db')) {
        suggestions.push(`Show tables used by ${selectedNode.label}`);
        suggestions.push(`Find queries in ${selectedNode.label}`);
      } else if (nodeType === 'test' || nodeName.includes('test')) {
        suggestions.push(`Show what ${selectedNode.label} tests`);
        suggestions.push(`Find test coverage for ${selectedNode.label}`);
      } else {
        suggestions.push(`Show dependencies of ${selectedNode.label}`);
        suggestions.push(`Find components using ${selectedNode.label}`);
        suggestions.push(`Show test files for ${selectedNode.label}`);
      }
      
      // Flow-based suggestions
      suggestions.push(`Trace execution flow from ${selectedNode.label}`);
      suggestions.push(`Show impact analysis for ${selectedNode.label}`);
    }
    
    // Query history-based suggestions
    if (queryHistory.length > 0) {
      const recentQuery = queryHistory[0];
      if (!suggestions.includes(recentQuery)) {
        suggestions.push(`Repeat: ${recentQuery}`);
      }
    }
    
    // Advanced analysis suggestions
    suggestions.push('Find circular dependencies');
    suggestions.push('Show performance bottlenecks');
    suggestions.push('Display security vulnerabilities');
    suggestions.push('Show refactoring opportunities');
    
    // Remove duplicates and limit to 8 suggestions
    const uniqueSuggestions = Array.from(new Set(suggestions));
    setSuggestions(uniqueSuggestions.slice(0, 8));
  }, [flowchartData.nodes, selectedNode, queryHistory]);

  // Generate comprehensive LLM prompt with intelligent context gathering
  const generateLLMPrompt = useCallback(() => {
    // Gather comprehensive context
    const context = {
      repository: {
        name: repository.name,
        description: repository.description,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        url: repository.html_url
      },
      currentView: {
        mode: viewMode,
        visibleNodes: getFilteredNodes().length,
        totalNodes: flowchartData.nodes.length,
        totalEdges: flowchartData.edges.length,
        highlightedNodes: highlightedNodes.length,
        filteredNodes: getFilteredNodes().length
      },
      selectedNode: selectedNode ? {
        id: selectedNode.id,
        label: selectedNode.label,
        type: selectedNode.type,
        filePath: selectedNode.filePath,
        linesOfCode: selectedNode.linesOfCode,
        complexity: selectedNode.complexity,
        importance: selectedNode.importance,
        dependencies: selectedNode.dependencies,
        testCoverage: selectedNode.testCoverage,
        cyclomaticComplexity: selectedNode.cyclomaticComplexity,
        maintainabilityIndex: selectedNode.maintainabilityIndex
      } : null,
      architecture: {
        nodeTypes: Array.from(new Set(flowchartData.nodes.map(node => node.type))),
        avgComplexity: flowchartData.nodes.reduce((sum, node) => sum + (node.complexity || 0), 0) / flowchartData.nodes.length,
        avgImportance: flowchartData.nodes.reduce((sum, node) => sum + (node.importance || 0), 0) / flowchartData.nodes.length,
        totalFiles: flowchartData.nodes.filter(node => node.filePath).length,
        testFiles: flowchartData.nodes.filter(node => node.type === 'test' || node.label.toLowerCase().includes('test')).length,
        apiEndpoints: flowchartData.nodes.filter(node => node.type === 'api' || node.label.toLowerCase().includes('api')).length,
        databaseConnections: flowchartData.nodes.filter(node => node.type === 'database' || node.label.toLowerCase().includes('db')).length
      },
      recentActivity: {
        queryHistory: queryHistory.slice(0, 3),
        lastSearch: naturalLanguageQuery || 'No recent search'
      }
    };
    
    // Generate intelligent prompt based on context
    let prompt = `# Codebase Analysis Request\n\n## Repository Context\n`;
    prompt += `**Name:** ${context.repository.name}\n`;
    prompt += `**Description:** ${context.repository.description || 'No description provided'}\n`;
    prompt += `**Language:** ${context.repository.language || 'Unknown'}\n`;
    prompt += `**Stars:** ${context.repository.stars || 0} | **Forks:** ${context.repository.forks || 0}\n`;
    prompt += `**URL:** ${context.repository.url || 'N/A'}\n\n`;
    
    prompt += `## Current View\n`;
    prompt += `**View Mode:** ${context.currentView.mode}\n`;
    prompt += `**Visible Nodes:** ${context.currentView.visibleNodes} of ${context.currentView.totalNodes}\n`;
    prompt += `**Total Edges:** ${context.currentView.totalEdges}\n`;
    prompt += `**Highlighted Nodes:** ${context.currentView.highlightedNodes}\n`;
    prompt += `**Filtered Nodes:** ${context.currentView.filteredNodes}\n\n`;
    
    if (context.selectedNode) {
      prompt += `## Selected Node Analysis\n`;
      prompt += `**Node:** ${context.selectedNode.label} (${context.selectedNode.type})\n`;
      prompt += `**File:** ${context.selectedNode.filePath || 'N/A'}\n`;
      prompt += `**Lines of Code:** ${context.selectedNode.linesOfCode || 'N/A'}\n`;
      prompt += `**Complexity:** ${context.selectedNode.complexity || 'N/A'}/10\n`;
      prompt += `**Importance:** ${context.selectedNode.importance || 'N/A'}/10\n`;
      prompt += `**Test Coverage:** ${context.selectedNode.testCoverage || 'N/A'}%\n`;
      prompt += `**Cyclomatic Complexity:** ${context.selectedNode.cyclomaticComplexity || 'N/A'}\n`;
      prompt += `**Maintainability Index:** ${context.selectedNode.maintainabilityIndex || 'N/A'}\n`;
      if (context.selectedNode.dependencies && context.selectedNode.dependencies.length > 0) {
        prompt += `**Dependencies:** ${context.selectedNode.dependencies.join(', ')}\n`;
      }
      prompt += `\n`;
    }
    
    prompt += `## Architecture Overview\n`;
    prompt += `**Node Types:** ${context.architecture.nodeTypes.join(', ')}\n`;
    prompt += `**Average Complexity:** ${context.architecture.avgComplexity.toFixed(1)}/10\n`;
    prompt += `**Average Importance:** ${context.architecture.avgImportance.toFixed(1)}/10\n`;
    prompt += `**Total Files:** ${context.architecture.totalFiles}\n`;
    prompt += `**Test Files:** ${context.architecture.testFiles}\n`;
    prompt += `**API Endpoints:** ${context.architecture.apiEndpoints}\n`;
    prompt += `**Database Connections:** ${context.architecture.databaseConnections}\n\n`;
    
    if (context.recentActivity.queryHistory.length > 0) {
      prompt += `## Recent Activity\n`;
      prompt += `**Recent Searches:** ${context.recentActivity.queryHistory.join(' → ')}\n`;
      prompt += `**Last Search:** ${context.recentActivity.lastSearch}\n\n`;
    }
    
    prompt += `## Analysis Request\n`;
    prompt += `Based on the codebase context and current view provided above, please provide:\n\n`;
    prompt += `1. **Architecture Overview**: Brief summary of the codebase structure and patterns\n`;
    prompt += `2. **Key Insights**: Important observations about the design, complexity, or potential issues\n`;
    prompt += `3. **Recommendations**: Suggestions for improvements, refactoring, or best practices\n`;
    prompt += `4. **Risk Assessment**: Identify potential risks, technical debt, or maintenance challenges\n`;
    prompt += `5. **Next Steps**: Actionable recommendations for further analysis or development\n\n`;
    
    if (context.selectedNode) {
      prompt += `### Focus on Selected Node\n`;
      prompt += `Please provide specific analysis for the selected node \"${context.selectedNode.label}\" including:\n`;
      prompt += `- Role and responsibilities in the architecture\n`;
      prompt += `- Potential improvements or refactoring opportunities\n`;
      prompt += `- Dependencies and impact analysis\n`;
      prompt += `- Testing and quality considerations\n\n`;
    }
    
    prompt += `Please provide your analysis in a structured, actionable format that can help improve understanding and guide development decisions.`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(prompt);
    
    // Show feedback
    console.log('Comprehensive LLM prompt copied to clipboard');
    console.log('Prompt length:', prompt.length, 'characters');
  }, [repository, selectedNode, viewMode, getFilteredNodes, flowchartData, highlightedNodes, queryHistory, naturalLanguageQuery]);

  // Enhanced node click handler
  const handleNodeClick = useCallback((node: FlowchartNode) => {
    setSelectedNode(node);
    highlightRelatedNodes(node.id);
    
    // Enhanced code navigation
    if (node.filePath) {
      console.log(`Opening file: ${node.filePath}:${node.startLine || 1}`);
      
      // In a real VSCode extension, this would open the file
      if (typeof window !== 'undefined') {
        // Show notification for demo
        console.log(`Would open: ${node.filePath}${node.startLine ? `:${node.startLine}` : ''}`);
        
        // You could integrate with VSCode extension API here
        // vscode.workspace.openTextDocument(node.filePath)
        //   .then(doc => vscode.window.showTextDocument(doc, { selection: new vscode.Range(node.startLine - 1, 0, node.startLine - 1, 0) }));
      }
    }
    
    onNodeClick?.(node);
  }, [highlightRelatedNodes, onNodeClick]);

  // Enhanced export diagram functionality with multiple formats
  const exportDiagram = useCallback(() => {
    if (canvasRef.current) {
      // Create export options modal or use browser's native download
      const format = 'png'; // Could be extended to support SVG, PDF, etc.
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `${repository.name}-flowchart-${timestamp}.${format}`;
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
      }
      
      // Log export activity
      console.log(`Diagram exported as ${format}: ${fileName}`);
      
      // In a real implementation, you could:
      // 1. Show a toast notification
      // 2. Track export analytics
      // 3. Support multiple formats (SVG, PDF, JSON)
      // 4. Include metadata in the export
    }
  }, [repository.name]);

  // Enhanced share diagram functionality with multiple sharing options
  const shareDiagram = useCallback(async () => {
    if (canvasRef.current) {
      try {
        // Generate shareable content
        const imageData = canvasRef.current.toDataURL('image/png');
        const timestamp = new Date().toISOString();
        
        // Create shareable data object
        const shareableData = {
          repository: repository.name,
          timestamp,
          imageData,
          metadata: {
            totalNodes: flowchartData.nodes.length,
            totalEdges: flowchartData.edges.length,
            viewMode,
            selectedNode: selectedNode?.label || null,
            query: naturalLanguageQuery || null
          }
        };
        
        // Try to use Web Share API if available
        if (navigator.share) {
          try {
            // Convert image data to blob for sharing
            const response = await fetch(imageData);
            const blob = await response.blob();
            const file = new File([blob], `${repository.name}-flowchart.png`, { type: 'image/png' });
            
            await navigator.share({
              title: `${repository.name} Flowchart`,
              text: `Check out this interactive flowchart for ${repository.name}`,
              files: [file]
            });
            
            console.log('Diagram shared successfully via Web Share API');
            return;
          } catch (shareError) {
            console.log('Web Share API failed, falling back to clipboard');
          }
        }
        
        // Fallback: Copy image data to clipboard
        await navigator.clipboard.writeText(imageData);
        console.log('Diagram image copied to clipboard for sharing');
        
        // Additional sharing options could include:
        // 1. Generate a shareable URL (requires backend)
        // 2. Create a JSON export with metadata
        // 3. Integrate with social media platforms
        // 4. Email sharing functionality
        
        // For demonstration, also copy metadata as JSON
        const metadataJson = JSON.stringify(shareableData.metadata, null, 2);
        console.log('Shareable metadata:', metadataJson);
        
      } catch (error) {
        console.error('Error sharing diagram:', error);
        // Show error notification in real implementation
      }
    }
  }, [repository.name, flowchartData, viewMode, selectedNode, naturalLanguageQuery]);
  const parseMermaidChart = useCallback((mermaidCode: string): FlowchartData => {
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];
    const nodeMap = new Map<string, FlowchartNode>();

    try {
      const lines = mermaidCode.split('\n').filter(line => line.trim());
      console.log('Parsing Mermaid lines:', lines);
      
      // First pass: collect all nodes with improved pattern matching
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip flowchart declaration and subgraph lines
        if (trimmed.startsWith('flowchart') || trimmed.startsWith('subgraph') || trimmed.startsWith('end') || trimmed.startsWith('classDef')) {
          continue;
        }
        
        // Parse advanced node formats with shape detection:
        // [text] - rectangle (component)
        // (text) - circle (module/hook)
        // {text} - diamond (database/API)
        // >text] - asymmetric (entry point)
        // [[text]] - cylinder (utility)
        // [(text)] - rectangle with rounded sides (external service)
        // [/text/] - parallelogram (configuration)
        // [\text\] - parallelogram alt (test)
        const nodePatterns = [
          /([A-Za-z0-9_]+)\[([^\]]+)\](?:::\w+)?/g,      // [text] - component
          /([A-Za-z0-9_]+)\(\(([^\)]+)\)\)(?:::\w+)?/g, // ((text)) - module/hook
          /([A-Za-z0-9_]+)\{([^\}]+)\}(?:::\w+)?/g,     // {text} - database/API
          /([A-Za-z0-9_]+)>([^\]]+)\](?:::\w+)?/g,      // >text] - entry point
          /([A-Za-z0-9_]+)\[\[([^\]]+)\]\](?:::\w+)?/g, // [[text]] - utility
          /([A-Za-z0-9_]+)\[\(([^\)]+)\)\](?:::\w+)?/g, // [(text)] - external service
          /([A-Za-z0-9_]+)\[\/([^\]]+)\/\](?:::\w+)?/g, // [/text/] - configuration
          /([A-Za-z0-9_]+)\[\\([^\]]+)\\\](?:::\w+)?/g, // [\text\] - test
          // Also handle simple node definitions
          /([A-Za-z0-9_]+)\[([^\]]+)\]/g,                // Simple [text]
          /([A-Za-z0-9_]+)\(([^\)]+)\)/g,                // Simple (text)
        ];
        
        for (const pattern of nodePatterns) {
          const matches = line.matchAll(pattern);
          for (const match of matches) {
            const [, id, label] = match;
            if (!nodeMap.has(id)) {
              const node: FlowchartNode = {
                id,
                label,
                type: getNodeFromLabel(label),
                complexity: Math.floor(Math.random() * 10) + 1,
                importance: Math.floor(Math.random() * 10) + 1,
                dependencies: [],
                x: 0, // Will be calculated in layout phase
                y: 0
              };
              nodes.push(node);
              nodeMap.set(id, node);
              console.log('Found node:', node);
            }
          }
        }
      }
      
      // Second pass: collect all edges with improved pattern matching
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Parse various edge formats:
        // A --> B
        // A -- text --> B
        // A -.-> B
        // A ==> B
        // A -- B
        // A->B (compact format)
        const edgePatterns = [
          /^\s*([A-Za-z0-9_]+)\s*-->\s*([A-Za-z0-9_]+)/,      // A --> B
          /^\s*([A-Za-z0-9_]+)\s*-\.->\s*([A-Za-z0-9_]+)/,   // A -.-> B
          /^\s*([A-Za-z0-9_]+)\s*==>\s*([A-Za-z0-9_]+)/,     // A ==> B
          /^\s*([A-Za-z0-9_]+)\s*--\s*([A-Za-z0-9_]+)/,      // A -- B
          /^\s*([A-Za-z0-9_]+)->([A-Za-z0-9_]+)/,             // A->B (compact)
          /^\s*([A-Za-z0-9_]+)\s*--\s*[^-]+-->\s*([A-Za-z0-9_]+)/, // A -- text --> B
        ];
        
        for (const pattern of edgePatterns) {
          const edgeMatch = line.match(pattern);
          if (edgeMatch) {
            const [, from, to] = edgeMatch;
            if (nodeMap.has(from) && nodeMap.has(to)) {
              edges.push({ from, to });
              console.log('Found edge:', from, '->', to);
              
              // Add dependency
              const fromNode = nodeMap.get(from);
              const toNode = nodeMap.get(to);
              if (fromNode && toNode) {
                fromNode.dependencies.push(to);
              }
            } else {
              console.warn('Edge references non-existent node:', from, '->', to);
            }
            break;
          }
        }
      }
      
      // Layout nodes in a hierarchical manner
      layoutNodes(nodes, edges);
      
    } catch (error) {
      console.error('Error parsing mermaid chart:', error);
    }

    console.log('Final parsed data:', { nodes, edges });
    return { nodes, edges };
  }, []);

  const getNodeFromLabel = (label: string): FlowchartNode['type'] => {
    // Enhanced type detection based on label content and context
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('entry') || lowerLabel.includes('start') || lowerLabel.includes('main') || lowerLabel.includes('app')) {
      return 'entry';
    }
    if (lowerLabel.includes('auth') || lowerLabel.includes('login') || lowerLabel.includes('user')) {
      return 'service';
    }
    if (lowerLabel.includes('database') || lowerLabel.includes('db') || lowerLabel.includes('sql') || lowerLabel.includes('mongo')) {
      return 'database';
    }
    if (lowerLabel.includes('api') || lowerLabel.includes('endpoint') || lowerLabel.includes('rest') || lowerLabel.includes('graphql')) {
      return 'api';
    }
    if (lowerLabel.includes('hook') || lowerLabel.includes('use')) {
      return 'hook';
    }
    if (lowerLabel.includes('util') || lowerLabel.includes('helper') || lowerLabel.includes('common')) {
      return 'util';
    }
    if (lowerLabel.includes('test') || lowerLabel.includes('spec')) {
      return 'test';
    }
    if (lowerLabel.includes('config') || lowerLabel.includes('env') || lowerLabel.includes('settings')) {
      return 'config';
    }
    if (lowerLabel.includes('module') || lowerLabel.includes('lib')) {
      return 'module';
    }
    if (lowerLabel.includes('external') || lowerLabel.includes('third') || lowerLabel.includes('github') || lowerLabel.includes('aws')) {
      return 'external';
    }
    
    return 'component'; // Default type
  };

  // Helper function to calculate optimal edge path with minimal crossings
  const calculateOptimalEdgePath = (fromNode: FlowchartNode, toNode: FlowchartNode, allNodes: FlowchartNode[], allEdges: FlowchartEdge[]) => {
    interface Point {
      x: number;
      y: number;
    }
    
    interface EdgePath {
      start: Point;
      end: Point;
      controlPoints: Point[];
    }
    
    if (!fromNode.x || !fromNode.y || !toNode.x || !toNode.y) {
      return {
        start: { x: fromNode.x || 0, y: fromNode.y || 0 },
        end: { x: toNode.x || 0, y: toNode.y || 0 },
        controlPoints: []
      };
    }
    
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate start and end points at node boundaries
    const fromRadius = Math.max((fromNode.width || 80) / 2, (fromNode.height || 40) / 2);
    const toRadius = Math.max((toNode.width || 80) / 2, (toNode.height || 40) / 2);
    
    const angle = Math.atan2(dy, dx);
    const startX = fromNode.x + Math.cos(angle) * fromRadius;
    const startY = fromNode.y + Math.sin(angle) * fromRadius;
    const endX = toNode.x - Math.cos(angle) * toRadius;
    const endY = toNode.y - Math.sin(angle) * toRadius;
    
    // Check if this edge might cross other nodes
    const mightCross = allNodes.some(node => {
      if (node.id === fromNode.id || node.id === toNode.id) return false;
      if (!node.x || !node.y || !node.width || !node.height) return false;
      
      // Simple line-rectangle intersection check
      return lineIntersectsRect(
        startX, startY, endX, endY,
        node.x - node.width / 2, node.y - node.height / 2,
        node.width, node.height
      );
    });
    
    if (!mightCross || distance < 200) {
      // Simple curved path for short distances or no crossings
      const controlOffset = Math.min(distance * 0.3, 60);
      const controlX = (startX + endX) / 2 + dy / distance * controlOffset;
      const controlY = (startY + endY) / 2 - dx / distance * controlOffset;
      
      return {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        controlPoints: [{ x: controlX, y: controlY }]
      };
    } else {
      // Complex path with two control points to avoid crossings
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      // Create control points that route around potential obstacles
      const offset1 = Math.min(distance * 0.25, 80);
      const offset2 = Math.min(distance * 0.25, 80);
      
      const control1X = midX + dy / distance * offset1;
      const control1Y = midY - dx / distance * offset1;
      const control2X = midX - dy / distance * offset2;
      const control2Y = midY + dx / distance * offset2;
      
      return {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        controlPoints: [
          { x: control1X, y: control1Y },
          { x: control2X, y: control2Y }
        ]
      };
    }
  };
  
  // Helper function to check line-rectangle intersection
  const lineIntersectsRect = (x1: number, y1: number, x2: number, y2: number, rectX: number, rectY: number, rectWidth: number, rectHeight: number): boolean => {
    // Check if line endpoints are inside rectangle
    if ((x1 >= rectX && x1 <= rectX + rectWidth && y1 >= rectY && y1 <= rectY + rectHeight) ||
        (x2 >= rectX && x2 <= rectX + rectWidth && y2 >= rectY && y2 <= rectY + rectHeight)) {
      return true;
    }
    
    // Check line intersection with rectangle edges
    return lineIntersectsLine(x1, y1, x2, y2, rectX, rectY, rectX + rectWidth, rectY) ||
           lineIntersectsLine(x1, y1, x2, y2, rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight) ||
           lineIntersectsLine(x1, y1, x2, y2, rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight) ||
           lineIntersectsLine(x1, y1, x2, y2, rectX, rectY + rectHeight, rectX, rectY);
  };
  
  // Helper function to check line-line intersection
  const lineIntersectsLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 1e-10) return false;
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  };

  // Helper function to check if two nodes are overlapping
  const isNodesOverlapping = (nodeA: FlowchartNode, nodeB: FlowchartNode): boolean => {
    if (!nodeA.x || !nodeA.y || !nodeB.x || !nodeB.y) return false;
    if (!nodeA.width || !nodeA.height || !nodeB.width || !nodeB.height) return false;
    
    const nodeALeft = nodeA.x - nodeA.width / 2;
    const nodeARight = nodeA.x + nodeA.width / 2;
    const nodeATop = nodeA.y - nodeA.height / 2;
    const nodeABottom = nodeA.y + nodeA.height / 2;
    
    const nodeBLeft = nodeB.x - nodeB.width / 2;
    const nodeBRight = nodeB.x + nodeB.width / 2;
    const nodeBTop = nodeB.y - nodeB.height / 2;
    const nodeBBottom = nodeB.y + nodeB.height / 2;
    
    return !(nodeARight < nodeBLeft || 
             nodeALeft > nodeBRight || 
             nodeABottom < nodeBTop || 
             nodeATop > nodeBBottom);
  };

  const layoutNodes = (nodes: FlowchartNode[], edges: FlowchartEdge[]) => {
    if (nodes.length === 0) return;

    console.log('Layout nodes called with:', { nodes: nodes.length, edges: edges.length });

    // Enhanced hierarchical layout with proper tree structure
    const levels = new Map<string, number>();
    const nodesInLevel = new Map<number, FlowchartNode[]>();
    const childrenMap = new Map<string, FlowchartNode[]>();
    
    // Build adjacency list for children relationships
    nodes.forEach(node => {
      childrenMap.set(node.id, []);
    });
    
    edges.forEach(edge => {
      const children = childrenMap.get(edge.from) || [];
      const targetNode = nodes.find(n => n.id === edge.to);
      if (targetNode) {
        children.push(targetNode);
      }
      childrenMap.set(edge.from, children);
    });
    
    // Find root nodes (nodes with no incoming edges)
    const hasIncomingEdge = new Set<string>();
    edges.forEach(edge => {
      hasIncomingEdge.add(edge.to);
    });
    
    let rootNodes = nodes.filter(node => !hasIncomingEdge.has(node.id));
    
    // If no clear root nodes, use nodes with specific types as roots
    if (rootNodes.length === 0) {
      rootNodes = nodes.filter(node => 
        node.type === 'entry' || 
        node.label.toLowerCase().includes('main') ||
        node.label.toLowerCase().includes('app') ||
        node.label.toLowerCase().includes('index')
      );
    }
    
    // If still no root nodes, use the first node as root
    if (rootNodes.length === 0 && nodes.length > 0) {
      rootNodes.push(nodes[0]);
    }
    
    console.log('Root nodes found:', rootNodes.map(n => n.id));
    
    // Assign levels using BFS with improved tree structure
    const queue: { node: FlowchartNode; level: number; parentX?: number }[] = rootNodes.map(node => ({ node, level: 0 }));
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { node, level, parentX } = queue.shift()!;
      
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      
      levels.set(node.id, level);
      if (!nodesInLevel.has(level)) {
        nodesInLevel.set(level, []);
      }
      nodesInLevel.get(level)!.push(node);
      
      // Find all outgoing edges from this node
      const outgoingEdges = edges.filter(edge => edge.from === node.id);
      outgoingEdges.forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.to);
        if (targetNode && !visited.has(targetNode.id)) {
          queue.push({ node: targetNode, level: level + 1, parentX: node.x });
        }
      });
    }
    
    // Calculate layout parameters
    const levelHeight = 180;
    const nodeWidth = 160;
    const nodeHeight = 60;
    const nodeSpacing = 40;
    const levelSpacing = 80;
    
    // Find the maximum number of nodes in any level for canvas sizing
    const maxNodesInLevel = Math.max(...Array.from(nodesInLevel.values()).map(levelNodes => levelNodes.length));
    const maxLevel = Math.max(...Array.from(nodesInLevel.keys()));
    
    // Calculate required canvas dimensions
    const requiredCanvasWidth = Math.max(800, maxNodesInLevel * (nodeWidth + nodeSpacing) + nodeSpacing);
    const requiredCanvasHeight = Math.max(600, (maxLevel + 1) * (levelHeight + levelSpacing) + 100);
    
    // Position nodes with improved tree layout and collision detection
    nodesInLevel.forEach((nodesInThisLevel, level) => {
      const totalWidth = nodesInThisLevel.length * nodeWidth + (nodesInThisLevel.length - 1) * nodeSpacing;
      const startX = (requiredCanvasWidth - totalWidth) / 2; // Center horizontally
      
      // Initial positioning
      nodesInThisLevel.forEach((node, index) => {
        node.x = startX + index * (nodeWidth + nodeSpacing) + nodeWidth / 2;
        node.y = 80 + level * (levelHeight + levelSpacing);
        node.width = nodeWidth;
        node.height = nodeHeight;
      });
      
      // Apply collision detection and adjustment within the same level
      for (let i = 0; i < nodesInThisLevel.length; i++) {
        const nodeA = nodesInThisLevel[i];
        for (let j = i + 1; j < nodesInThisLevel.length; j++) {
          const nodeB = nodesInThisLevel[j];
          
          if (isNodesOverlapping(nodeA, nodeB)) {
            // Move nodeB to the right to avoid overlap
            const overlapX = (nodeA.width! + nodeB.width!) / 2 + nodeSpacing - Math.abs(nodeA.x - nodeB.x);
            if (overlapX > 0) {
              nodeB.x += overlapX;
            }
          }
        }
      }
      
      // Log final positions
      nodesInThisLevel.forEach((node) => {
        console.log(`Positioned node ${node.id} at (${node.x}, ${node.y})`);
      });
    });
    
    // Apply collision detection between levels
    const allLevels = Array.from(nodesInLevel.keys()).sort((a, b) => a - b);
    for (let i = 0; i < allLevels.length - 1; i++) {
      const currentLevel = allLevels[i];
      const nextLevel = allLevels[i + 1];
      const currentNodes = nodesInLevel.get(currentLevel) || [];
      const nextNodes = nodesInLevel.get(nextLevel) || [];
      
      // Check for overlaps between current level and next level
      for (const currentNode of currentNodes) {
        for (const nextNode of nextNodes) {
          if (isNodesOverlapping(currentNode, nextNode)) {
            // Move next level down to avoid overlap
            const overlapY = (currentNode.height! + nextNode.height!) / 2 + levelSpacing - Math.abs(currentNode.y - nextNode.y);
            if (overlapY > 0) {
              // Move all nodes in next level and below down
              for (let level = nextLevel; level <= maxLevel; level++) {
                const levelNodes = nodesInLevel.get(level) || [];
                levelNodes.forEach(node => {
                  node.y += overlapY;
                });
              }
            }
          }
        }
      }
    }
    
    // Position any remaining nodes that weren't reached in BFS
    nodes.forEach(node => {
      if (!levels.has(node.id)) {
        node.x = Math.random() * (requiredCanvasWidth - 200) + 100;
        node.y = Math.random() * (requiredCanvasHeight - 200) + 100;
        node.width = nodeWidth;
        node.height = nodeHeight;
        console.log(`Positioned unconnected node ${node.id} at (${node.x}, ${node.y})`);
      }
    });
    
    // Calculate actual bounds after positioning
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      if (node.x && node.y && node.width && node.height) {
        minX = Math.min(minX, node.x - node.width / 2);
        maxX = Math.max(maxX, node.x + node.width / 2);
        minY = Math.min(minY, node.y - node.height / 2);
        maxY = Math.max(maxY, node.y + node.height / 2);
      }
    });
    
    // Add padding around the bounds
    const padding = 100;
    const actualWidth = maxX - minX + padding * 2;
    const actualHeight = maxY - minY + padding * 2;
    
    // Update canvas size with actual bounds
    const canvas = canvasRef.current;
    if (canvas) {
      const finalWidth = Math.max(requiredCanvasWidth, actualWidth);
      const finalHeight = Math.max(requiredCanvasHeight, actualHeight);
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      // Center all nodes within the canvas
      const centerX = finalWidth / 2;
      const centerY = finalHeight / 2;
      const currentCenterX = (minX + maxX) / 2;
      const currentCenterY = (minY + maxY) / 2;
      
      const offsetX = centerX - currentCenterX;
      const offsetY = centerY - currentCenterY;
      
      nodes.forEach(node => {
        if (node.x && node.y) {
          node.x += offsetX;
          node.y += offsetY;
        }
      });
      
      console.log(`Canvas resized to: ${finalWidth}x${finalHeight}`);
      console.log(`Nodes centered with offset: (${offsetX}, ${offsetY})`);
    }
  };

  const getNodeColor = (type: FlowchartNode['type']) => {
    const colors: Record<FlowchartNode['type'], string> = {
      entry: '#10b981',     // emerald
      component: '#3b82f6', // blue
      module: '#8b5cf6',    // purple
      service: '#f59e0b',   // amber
      database: '#ef4444',  // red
      external: '#6b7280',  // gray
      config: '#06b6d4',    // cyan
      api: '#ec4899',       // pink
      hook: '#14b8a6',      // teal
      util: '#f97316',      // orange
      test: '#84cc16'       // lime
    };
    return colors[type] || colors.component;
  };

  const getNodeIcon = (type: FlowchartNode['type']) => {
    const icons: Record<FlowchartNode['type'], JSX.Element> = {
      entry: <Cpu className="w-4 h-4" />,
      component: <FileText className="w-4 h-4" />,
      module: <GitBranch className="w-4 h-4" />,
      service: <Settings className="w-4 h-4" />,
      database: <Database className="w-4 h-4" />,
      external: <Globe className="w-4 h-4" />,
      config: <Settings className="w-4 h-4" />,
      api: <ExternalLink className="w-4 h-4" />,
      hook: <GitBranch className="w-4 h-4" />,
      util: <FileText className="w-4 h-4" />,
      test: <FileText className="w-4 h-4" />
    };
    return icons[type] || icons.component;
  };

  // Enhanced shape drawing functions for proper flowchart appearance
  const drawRectangle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number = 8) => {
    ctx.beginPath();
    ctx.roundRect(x - width/2, y - height/2, width, height, radius);
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - height/2); // Top
    ctx.lineTo(x + width/2, y); // Right
    ctx.lineTo(x, y + height/2); // Bottom
    ctx.lineTo(x - width/2, y); // Left
    ctx.closePath();
  };

  const drawCylinder = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const radius = width / 2;
    const ellipseHeight = height * 0.15;
    
    // Top ellipse
    ctx.beginPath();
    ctx.ellipse(x, y - height/2 + ellipseHeight/2, radius, ellipseHeight/2, 0, 0, 2 * Math.PI);
    
    // Left side
    ctx.lineTo(x - radius, y + height/2 - ellipseHeight/2);
    
    // Bottom ellipse (back half)
    ctx.ellipse(x, y + height/2 - ellipseHeight/2, radius, ellipseHeight/2, 0, Math.PI, 2 * Math.PI, true);
    
    // Right side
    ctx.lineTo(x + radius, y - height/2 + ellipseHeight/2);
    
    // Top ellipse (front half)
    ctx.ellipse(x, y - height/2 + ellipseHeight/2, radius, ellipseHeight/2, 0, 0, Math.PI);
    
    // Draw the visible bottom ellipse
    ctx.moveTo(x - radius, y + height/2 - ellipseHeight/2);
    ctx.ellipse(x, y + height/2 - ellipseHeight/2, radius, ellipseHeight/2, 0, 0, Math.PI);
  };

  const drawParallelogram = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, skew: number = 15) => {
    ctx.beginPath();
    ctx.moveTo(x - width/2 + skew, y - height/2); // Top left
    ctx.lineTo(x + width/2 + skew, y - height/2); // Top right
    ctx.lineTo(x + width/2 - skew, y + height/2); // Bottom right
    ctx.lineTo(x - width/2 - skew, y + height/2); // Bottom left
    ctx.closePath();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const radius = Math.min(width, height) / 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
  };

  const drawRoundedSidesRectangle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number = 20) => {
    ctx.beginPath();
    ctx.moveTo(x - width/2 + radius, y - height/2); // Top left start
    ctx.lineTo(x + width/2 - radius, y - height/2); // Top right start
    ctx.quadraticCurveTo(x + width/2, y - height/2, x + width/2, y - height/2 + radius); // Top right curve
    ctx.lineTo(x + width/2, y + height/2 - radius); // Bottom right start
    ctx.quadraticCurveTo(x + width/2, y + height/2, x + width/2 - radius, y + height/2); // Bottom right curve
    ctx.lineTo(x - width/2 + radius, y + height/2); // Bottom left start
    ctx.quadraticCurveTo(x - width/2, y + height/2, x - width/2, y + height/2 - radius); // Bottom left curve
    ctx.lineTo(x - width/2, y - height/2 + radius); // Top left start
    ctx.quadraticCurveTo(x - width/2, y - height/2, x - width/2 + radius, y - height/2); // Top left curve
    ctx.closePath();
  };

  const drawNodeShape = (ctx: CanvasRenderingContext2D, node: FlowchartNode, x: number, y: number, width: number, height: number) => {
    switch (node.type) {
      case 'entry':
        // Terminal/Start shape - rounded rectangle with more rounded corners
        drawRectangle(ctx, x, y, width, height, Math.min(width, height) * 0.3);
        break;
      case 'component':
        // Process shape - standard rectangle
        drawRectangle(ctx, x, y, width, height, 8);
        break;
      case 'module':
        // Predefined process - rectangle with double sides
        drawRoundedSidesRectangle(ctx, x, y, width, height, 12);
        break;
      case 'service':
        // Service - hexagon shape
        drawHexagon(ctx, x, y, width, height);
        break;
      case 'database':
        // Data storage - cylinder shape
        drawCylinder(ctx, x, y, width, height);
        break;
      case 'external':
        // External entity - parallelogram
        drawParallelogram(ctx, x, y, width, height, 20);
        break;
      case 'config':
        // Configuration - parallelogram (input/output)
        drawParallelogram(ctx, x, y, width, height, 15);
        break;
      case 'api':
        // API endpoint - diamond (decision-like)
        drawDiamond(ctx, x, y, width, height);
        break;
      case 'hook':
        // Hook - circle
        drawCircle(ctx, x, y, Math.min(width, height) / 2);
        break;
      case 'util':
        // Utility - standard rectangle
        drawRectangle(ctx, x, y, width, height, 6);
        break;
      case 'test':
        // Test - inverted parallelogram
        drawParallelogram(ctx, x, y, width, height, -15);
        break;
      default:
        // Default to rectangle
        drawRectangle(ctx, x, y, width, height, 8);
        break;
    }
  };

  const getNodeTextPosition = (node: FlowchartNode, x: number, y: number, width: number, height: number) => {
    switch (node.type) {
      case 'database':
        // For cylinder, center text in the middle
        return { x, y };
      case 'hook':
        // For circle, center text
        return { x, y };
      case 'api':
        // For diamond, center text
        return { x, y };
      default:
        // For most shapes, center text
        return { x, y };
    }
  };

  const getNodeTextBounds = (node: FlowchartNode, width: number, height: number) => {
    switch (node.type) {
      case 'database':
        // Cylinder has less usable width due to curves
        return { width: width * 0.8, height: height * 0.6 };
      case 'hook':
        // Circle has less usable space
        return { width: width * 0.7, height: height * 0.7 };
      case 'api':
        // Diamond has less usable space
        return { width: width * 0.7, height: height * 0.7 };
      case 'external':
      case 'config':
      case 'test':
        // Parallelograms have slightly less space
        return { width: width * 0.85, height: height * 0.8 };
      default:
        // Rectangles and hexagons use full space
        return { width: width * 0.9, height: height * 0.8 };
    }
  };

  // Initialize flowchart data with better error handling
  useEffect(() => {
    console.log('InteractiveFlowchartRenderer received chart:', chart);
    if (!chart || chart.trim() === '') {
      console.error('Empty or invalid chart data received');
      return;
    }
    
    try {
      const data = parseMermaidChart(chart);
      console.log('Parsed flowchart data:', data);
      
      if (data.nodes.length === 0) {
        console.error('No nodes found in parsed chart data');
        return;
      }
      
      setFlowchartData(data);
    } catch (error) {
      console.error('Error initializing flowchart:', error);
    }
  }, [chart, parseMermaidChart]);

  // Canvas rendering with improved error handling
  const drawFlowchart = useCallback(() => {
    console.log('drawFlowchart called');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('No canvas context found');
      return;
    }

    console.log('Canvas dimensions:', canvas.width, canvas.height);
    console.log('Flowchart data:', flowchartData);

    // Check if we have valid data
    if (!flowchartData.nodes || flowchartData.nodes.length === 0) {
      console.log('No nodes to render');
      return;
    }

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const filteredNodes = getFilteredNodes();
    
    if (filteredNodes.length === 0) {
      console.log('No filtered nodes to render');
      ctx.restore();
      return;
    }
    
    // Apply view mode specific filtering and styling
    let nodesToRender = filteredNodes;
    let edgesToRender = flowchartData.edges;
    
    if (viewMode === 'focused') {
      // Focused mode: Only show selected node and its direct connections
      if (selectedNode) {
        const connectedNodeIds = new Set<string>();
        connectedNodeIds.add(selectedNode.id);
        
        // Find directly connected nodes
        flowchartData.edges.forEach(edge => {
          if (edge.from === selectedNode.id) {
            connectedNodeIds.add(edge.to);
          } else if (edge.to === selectedNode.id) {
            connectedNodeIds.add(edge.from);
          }
        });
        
        nodesToRender = filteredNodes.filter(node => connectedNodeIds.has(node.id));
        edgesToRender = flowchartData.edges.filter(edge => 
          connectedNodeIds.has(edge.from) && connectedNodeIds.has(edge.to)
        );
      }
    } else if (viewMode === 'detailed') {
      // Detailed mode: Show all nodes but with enhanced information
      nodesToRender = filteredNodes;
      edgesToRender = flowchartData.edges;
    } else {
      // Architecture mode: Show high-level overview (simplified)
      nodesToRender = filteredNodes.filter(node => 
        ['entry', 'component', 'service', 'database', 'api'].includes(node.type)
      );
      edgesToRender = flowchartData.edges.filter(edge => {
        const fromNode = nodesToRender.find(n => n.id === edge.from);
        const toNode = nodesToRender.find(n => n.id === edge.to);
        return fromNode && toNode;
      });
    }
    
    // Draw edges with improved curved lines and arrowheads
    edgesToRender.forEach(edge => {
      const fromNode = nodesToRender.find(n => n.id === edge.from);
      const toNode = nodesToRender.find(n => n.id === edge.to);
      
      if (fromNode && toNode && fromNode.x && fromNode.y && toNode.x && toNode.y) {
        // Highlight edges connected to highlighted nodes
        const isHighlighted = highlightedNodes.includes(edge.from) || highlightedNodes.includes(edge.to);
        const isSelected = selectedNode && (edge.from === selectedNode.id || edge.to === selectedNode.id);
        
        // Calculate intelligent edge routing to minimize crossings
        const edgePath = calculateOptimalEdgePath(fromNode, toNode, nodesToRender, edgesToRender);
        
        // Enhanced view mode specific edge styling with gradients
        let strokeColor, lineWidth;
        if (viewMode === 'focused') {
          strokeColor = isSelected ? '#f59e0b' : '#3b82f6';
          lineWidth = isSelected ? 4 : 3;
        } else if (viewMode === 'detailed') {
          strokeColor = isHighlighted ? '#f59e0b' : '#6b7280';
          lineWidth = isHighlighted ? 3 : 2;
        } else {
          // Architecture mode
          strokeColor = isHighlighted ? '#f59e0b' : '#9ca3af';
          lineWidth = isHighlighted ? 3 : 1;
        }
        
        // Create gradient for edge line
        const edgeGradient = ctx.createLinearGradient(
          edgePath.start.x, edgePath.start.y,
          edgePath.end.x, edgePath.end.y
        );
        edgeGradient.addColorStop(0, strokeColor);
        edgeGradient.addColorStop(0.5, isSelected || isHighlighted ? '#fbbf24' : strokeColor);
        edgeGradient.addColorStop(1, strokeColor);
        
        ctx.strokeStyle = edgeGradient;
        ctx.lineWidth = lineWidth;
        
        // Add shadow for selected/highlighted edges
        if (isSelected || isHighlighted) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
        }
        
        // Draw edge with optimal path and anti-aliasing
        ctx.beginPath();
        ctx.moveTo(edgePath.start.x, edgePath.start.y);
        
        // Enable anti-aliasing for smoother lines
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        if (edgePath.controlPoints.length === 1) {
          // Simple quadratic curve
          ctx.quadraticCurveTo(
            edgePath.controlPoints[0].x, 
            edgePath.controlPoints[0].y,
            edgePath.end.x, 
            edgePath.end.y
          );
        } else if (edgePath.controlPoints.length === 2) {
          // Bezier curve with two control points
          ctx.bezierCurveTo(
            edgePath.controlPoints[0].x, 
            edgePath.controlPoints[0].y,
            edgePath.controlPoints[1].x, 
            edgePath.controlPoints[1].y,
            edgePath.end.x, 
            edgePath.end.y
          );
        } else {
          // Straight line as fallback
          ctx.lineTo(edgePath.end.x, edgePath.end.y);
        }
        
        ctx.stroke();

        // Draw enhanced arrowhead with better styling
        const lastControlPoint = edgePath.controlPoints[edgePath.controlPoints.length - 1];
        const angle = Math.atan2(
          edgePath.end.y - (lastControlPoint ? lastControlPoint.y : edgePath.start.y),
          edgePath.end.x - (lastControlPoint ? lastControlPoint.x : edgePath.start.x)
        );
        
        // Dynamic arrow sizing based on view mode and selection
        const baseArrowLength = viewMode === 'architecture' ? 10 : 14;
        const baseArrowWidth = viewMode === 'architecture' ? 6 : 10;
        const arrowLength = isSelected ? baseArrowLength * 1.3 : baseArrowLength;
        const arrowWidth = isSelected ? baseArrowWidth * 1.3 : baseArrowWidth;
        
        // Arrow position is already calculated in edgePath.end
        const arrowX = edgePath.end.x;
        const arrowY = edgePath.end.y;
        
        ctx.save();
        
        // Add shadow for selected arrows
        if (isSelected) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
        }
        
        // Draw filled arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        
        // Fill with gradient for better visual appeal
        const arrowGradient = ctx.createLinearGradient(
          arrowX, arrowY,
          arrowX - arrowLength * Math.cos(angle),
          arrowY - arrowLength * Math.sin(angle)
        );
        arrowGradient.addColorStop(0, strokeColor);
        arrowGradient.addColorStop(1, isSelected ? '#f59e0b' : '#60a5fa');
        
        ctx.fillStyle = arrowGradient;
        ctx.fill();
        
        // Add subtle stroke for definition
        ctx.strokeStyle = isSelected ? '#d97706' : '#3b82f6';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        // Add edge label if present
        if (edge.label) {
          ctx.save();
          ctx.font = '11px sans-serif';
          ctx.fillStyle = '#374151';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Position label at the middle of the curve
          let labelX, labelY;
          if (edgePath.controlPoints.length > 0) {
            // Use the first control point for simple curves
            labelX = edgePath.controlPoints[0].x;
            labelY = edgePath.controlPoints[0].y;
          } else {
            // Use midpoint for straight lines
            labelX = (edgePath.start.x + edgePath.end.x) / 2;
            labelY = (edgePath.start.y + edgePath.end.y) / 2;
          }
          
          // Add background for better readability
          const textWidth = ctx.measureText(edge.label).width;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(labelX - textWidth / 2 - 4, labelY - 8, textWidth + 8, 16);
          
          ctx.fillStyle = '#374151';
          ctx.fillText(edge.label, labelX, labelY);
          ctx.restore();
        }
      }
    });

    // Draw nodes (view mode specific styling)
    nodesToRender.forEach(node => {
      if (!node.x || !node.y) return;

      const isSelected = selectedNode?.id === node.id;
      const isHighlighted = highlightedNodes.includes(node.id);
      const color = getNodeColor(node.type);
      
      // View mode specific node sizing and styling
      let nodeWidth, nodeHeight, fontSize;
      if (viewMode === 'focused') {
        nodeWidth = isSelected ? 160 : 140;
        nodeHeight = isSelected ? 80 : 70;
        fontSize = isSelected ? 14 : 12;
      } else if (viewMode === 'detailed') {
        nodeWidth = 130;
        nodeHeight = 65;
        fontSize = 12;
      } else {
        // Architecture mode
        nodeWidth = 110;
        nodeHeight = 55;
        fontSize = 11;
      }

      // Enhanced node shadow with state-specific effects
      if (isSelected) {
        // Pulsing glow effect for selected nodes
        const pulseIntensity = 0.3 + 0.2 * Math.sin(Date.now() * 0.003);
        ctx.shadowColor = `rgba(251, 191, 36, ${pulseIntensity})`;
        ctx.shadowBlur = 20 + pulseIntensity * 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else if (isHighlighted) {
        // Softer glow for highlighted nodes
        ctx.shadowColor = 'rgba(96, 165, 250, 0.4)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      } else {
        // Standard shadow for normal nodes
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = viewMode === 'focused' ? 12 : 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Node background with enhanced view mode specific styling
      if (viewMode === 'focused') {
        if (isSelected) {
          // Gradient fill for selected nodes
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, Math.max(nodeWidth, nodeHeight) / 2
          );
          gradient.addColorStop(0, '#fde047');
          gradient.addColorStop(1, '#fbbf24');
          ctx.fillStyle = gradient;
        } else if (isHighlighted) {
          // Gradient fill for highlighted nodes
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, Math.max(nodeWidth, nodeHeight) / 2
          );
          gradient.addColorStop(0, '#93c5fd');
          gradient.addColorStop(1, '#60a5fa');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = color;
        }
        
        ctx.strokeStyle = isSelected ? '#ffffff' : (isHighlighted ? '#3b82f6' : color);
        ctx.lineWidth = isSelected ? 4 : (isHighlighted ? 3 : 2);
      } else if (viewMode === 'detailed') {
        if (isHighlighted) {
          // Subtle gradient for highlighted nodes
          const gradient = ctx.createLinearGradient(
            node.x - nodeWidth/2, node.y - nodeHeight/2,
            node.x + nodeWidth/2, node.y + nodeHeight/2
          );
          gradient.addColorStop(0, '#fde047');
          gradient.addColorStop(1, '#fbbf24');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = color;
        }
        
        ctx.strokeStyle = isSelected ? '#ffffff' : (isHighlighted ? '#f59e0b' : color);
        ctx.lineWidth = isSelected ? 3 : (isHighlighted ? 3 : 2);
      } else {
        // Architecture mode
        ctx.fillStyle = isHighlighted ? '#fbbf24' : color;
        ctx.strokeStyle = isSelected ? '#ffffff' : (isHighlighted ? '#f59e0b' : color);
        ctx.lineWidth = isSelected ? 3 : (isHighlighted ? 2 : 1);
      }
      // Draw proper flowchart shape based on node type
      drawNodeShape(ctx, node, node.x, node.y, nodeWidth, nodeHeight);
      ctx.fill();
      ctx.stroke();

      // Add selection ring for selected nodes
      if (isSelected) {
        ctx.save();
        ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Draw selection ring slightly larger than the node
        const ringPadding = 8;
        drawNodeShape(ctx, node, node.x, node.y, nodeWidth + ringPadding * 2, nodeHeight + ringPadding * 2);
        ctx.stroke();
        
        ctx.restore();
      }

      // Reset shadow
      ctx.shadowColor = 'transparent';

      // Enhanced node text with view mode specific styling
      if (isSelected) {
        // Text shadow for selected nodes
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = '#000000';
      } else if (isHighlighted) {
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      
      // Enhanced font styling
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text stroke for better readability on colored backgrounds
      if (isSelected || isHighlighted) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      }
      
      // View mode specific text content
      let displayText = node.label;
      if (viewMode === 'focused' && isSelected) {
        // Show more detailed info for selected node in focused mode
        if (node.type !== 'entry') {
          displayText = `${node.label}\n(${node.type})`;
        }
      } else if (viewMode === 'architecture') {
        // Simplified labels for architecture mode
        displayText = node.label.length > 15 ? node.label.substring(0, 12) + '...' : node.label;
      }
      
      // Get text position and bounds based on node shape
      const textPosition = getNodeTextPosition(node, node.x, node.y, nodeWidth, nodeHeight);
      const textBounds = getNodeTextBounds(node, nodeWidth, nodeHeight);
      const maxWidth = textBounds.width;
      
      // Wrap text if too long
      const lines = displayText.split('\n');
      
      lines.forEach((line, lineIndex) => {
        const words = line.split(' ');
        let textLine = '';
        let y = textPosition.y - (lines.length - 1) * 8 + lineIndex * 16;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = textLine + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            // Draw stroke first for selected/highlighted nodes
            if (isSelected || isHighlighted) {
              ctx.strokeText(textLine, textPosition.x, y);
            }
            ctx.fillText(textLine, textPosition.x, y);
            textLine = words[i] + ' ';
            y += 16;
          } else {
            textLine = testLine;
          }
        }
        // Draw stroke first for selected/highlighted nodes
        if (isSelected || isHighlighted) {
          ctx.strokeText(textLine, textPosition.x, y);
        }
        ctx.fillText(textLine, textPosition.x, y);
      });
    });

    ctx.restore();
  }, [flowchartData, scale, offset, selectedNode, getFilteredNodes, highlightedNodes, viewMode]);

  useEffect(() => {
    drawFlowchart();
  }, [drawFlowchart]);

  // Handle canvas resize with improved initialization
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        console.log('Resizing canvas to container:', container.clientWidth, container.clientHeight);
        
        // Set canvas dimensions
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Ensure minimum dimensions
        if (canvas.width < 400) canvas.width = 400;
        if (canvas.height < 300) canvas.height = 300;
        
        console.log('Final canvas dimensions:', canvas.width, canvas.height);
        
        // Redraw after resize
        setTimeout(() => {
          drawFlowchart();
        }, 100); // Small delay to ensure canvas is ready
      }
    };

    // Initial resize
    resizeCanvas();
    
    // Add resize listener with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [drawFlowchart]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    setOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Remove preventDefault to avoid passive event listener warning
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, scale * delta));
    setScale(newScale);
  };

  // Shape-aware click detection functions
  const isPointInRectangle = (px: number, py: number, x: number, y: number, width: number, height: number, radius: number = 8) => {
    // Simple rectangular bounds check for performance
    if (px < x - width/2 || px > x + width/2 || py < y - height/2 || py > y + height/2) {
      return false;
    }
    
    // For rounded rectangles, check distance from corners
    if (radius > 0) {
      const corners = [
        { x: x - width/2 + radius, y: y - height/2 + radius },
        { x: x + width/2 - radius, y: y - height/2 + radius },
        { x: x - width/2 + radius, y: y + height/2 - radius },
        { x: x + width/2 - radius, y: y + height/2 - radius }
      ];
      
      for (const corner of corners) {
        const dist = Math.sqrt((px - corner.x) ** 2 + (py - corner.y) ** 2);
        if (dist > radius) {
          // Point is in the corner area but outside the rounded corner
          const inCornerArea = 
            (px < x - width/2 + radius && py < y - height/2 + radius) ||
            (px > x + width/2 - radius && py < y - height/2 + radius) ||
            (px < x - width/2 + radius && py > y + height/2 - radius) ||
            (px > x + width/2 - radius && py > y + height/2 - radius);
          
          if (inCornerArea) {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  const isPointInDiamond = (px: number, py: number, x: number, y: number, width: number, height: number) => {
    // Transform point to diamond coordinate system
    const dx = (px - x) / (width / 2);
    const dy = (py - y) / (height / 2);
    
    // Check if point is inside diamond using Manhattan distance
    return Math.abs(dx) + Math.abs(dy) <= 1;
  };

  const isPointInCylinder = (px: number, py: number, x: number, y: number, width: number, height: number) => {
    // Check if point is within the main rectangular body
    if (px < x - width/2 || px > x + width/2 || py < y - height/2 || py > y + height/2) {
      return false;
    }
    
    // For simplicity, treat cylinder as rectangle for click detection
    // Could be enhanced with elliptical top/bottom detection if needed
    return true;
  };

  const isPointInParallelogram = (px: number, py: number, x: number, y: number, width: number, height: number, skew: number = 15) => {
    // Transform point to parallelogram coordinate system
    const relX = px - x;
    const relY = py - y;
    
    // Check if point is inside parallelogram using edge equations
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Calculate the four edges
    const topEdge = relY <= -halfHeight + (skew / halfWidth) * (relX + skew);
    const bottomEdge = relY >= halfHeight - (skew / halfWidth) * (relX - skew);
    const leftEdge = relX >= -halfWidth + (skew / halfHeight) * (relY + skew);
    const rightEdge = relX <= halfWidth - (skew / halfHeight) * (relY - skew);
    
    return topEdge && bottomEdge && leftEdge && rightEdge;
  };

  const isPointInCircle = (px: number, py: number, x: number, y: number, radius: number) => {
    const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
    return distance <= radius;
  };

  const isPointInHexagon = (px: number, py: number, x: number, y: number, width: number, height: number) => {
    const radius = Math.min(width, height) / 2;
    const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
    
    // Quick distance check
    if (distance > radius) {
      return false;
    }
    
    // Check if point is within hexagon using angle-based approach
    const angle = Math.atan2(py - y, px - x);
    const normalizedAngle = ((angle + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const sector = Math.floor(normalizedAngle / (Math.PI / 3));
    const sectorAngle = normalizedAngle - sector * (Math.PI / 3);
    
    // Distance to hexagon edge at this angle
    const maxDistance = radius * Math.cos(Math.PI / 6) / Math.cos(sectorAngle - Math.PI / 6);
    
    return distance <= maxDistance;
  };

  const isPointInNodeShape = (px: number, py: number, node: FlowchartNode, width: number, height: number) => {
    switch (node.type) {
      case 'entry':
        // Terminal/Start shape - rounded rectangle with more rounded corners
        return isPointInRectangle(px, py, node.x, node.y, width, height, Math.min(width, height) * 0.3);
      case 'component':
        // Process shape - standard rectangle
        return isPointInRectangle(px, py, node.x, node.y, width, height, 8);
      case 'module':
        // Predefined process - rectangle with double sides
        return isPointInRectangle(px, py, node.x, node.y, width, height, 12);
      case 'service':
        // Service - hexagon shape
        return isPointInHexagon(px, py, node.x, node.y, width, height);
      case 'database':
        // Data storage - cylinder shape
        return isPointInCylinder(px, py, node.x, node.y, width, height);
      case 'external':
        // External entity - parallelogram
        return isPointInParallelogram(px, py, node.x, node.y, width, height, 20);
      case 'config':
        // Configuration - parallelogram (input/output)
        return isPointInParallelogram(px, py, node.x, node.y, width, height, 15);
      case 'api':
        // API endpoint - diamond (decision-like)
        return isPointInDiamond(px, py, node.x, node.y, width, height);
      case 'hook':
        // Hook - circle
        return isPointInCircle(px, py, node.x, node.y, Math.min(width, height) / 2);
      case 'util':
        // Utility - standard rectangle
        return isPointInRectangle(px, py, node.x, node.y, width, height, 6);
      case 'test':
        // Test - inverted parallelogram
        return isPointInParallelogram(px, py, node.x, node.y, width, height, -15);
      default:
        // Default to rectangle
        return isPointInRectangle(px, py, node.x, node.y, width, height, 8);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Find clicked node using shape-aware detection
    const clickedNode = flowchartData.nodes.find(node => {
      if (!node.x || !node.y) return false;
      
      // Use view mode specific sizing
      let nodeWidth, nodeHeight;
      if (viewMode === 'focused') {
        nodeWidth = selectedNode?.id === node.id ? 160 : 140;
        nodeHeight = selectedNode?.id === node.id ? 80 : 70;
      } else if (viewMode === 'detailed') {
        nodeWidth = 130;
        nodeHeight = 65;
      } else {
        // Architecture mode
        nodeWidth = 110;
        nodeHeight = 55;
      }
      
      return isPointInNodeShape(x, y, node, nodeWidth, nodeHeight);
    });

    if (clickedNode) {
      handleNodeClick(clickedNode);
    } else {
      setSelectedNode(null);
      clearHighlights();
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(3, prev * 1.2));
  const handleZoomOut = () => setScale(prev => Math.max(0.1, prev / 1.2));
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleExport = async (format: 'png' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `${repository.name}-flowchart.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Initialize suggestions on mount
  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">{repository.name}</h1>
            </div>
            <Badge variant="outline">Interactive Flowchart</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={generateLLMPrompt}>
              <Brain className="w-4 h-4 mr-2" />
              Create LLM Prompt
            </Button>
            <Button variant="outline" size="sm" onClick={exportDiagram}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={shareDiagram}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Natural Language Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ask anything about your codebase..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={naturalLanguageQuery}
              onChange={(e) => setNaturalLanguageQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNaturalLanguageSearch(naturalLanguageQuery);
                }
              }}
            />
            {naturalLanguageQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setNaturalLanguageQuery('')}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {/* Smart Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    setNaturalLanguageQuery(suggestion);
                    handleNaturalLanguageSearch(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r flex flex-col">
          {/* View Mode Selector */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-3">View Mode</h3>
            <div className="flex flex-col gap-2">
              <Button
                variant={viewMode === 'architecture' ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                onClick={() => setViewMode('architecture')}
                title="Show high-level architecture overview with main components only"
              >
                <Layers className="w-4 h-4 mr-2" />
                Architecture Overview
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                onClick={() => setViewMode('detailed')}
                title="Show detailed view with all components and enhanced information"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Detailed View
              </Button>
              <Button
                variant={viewMode === 'focused' ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                onClick={() => setViewMode('focused')}
                title="Focus on selected component and its direct connections only"
                disabled={!selectedNode}
              >
                <Target className="w-4 h-4 mr-2" />
                Focused Analysis
                {!selectedNode && <span className="ml-auto text-xs text-muted-foreground">(Select a node)</span>}
              </Button>
            </div>
            
            {/* View mode description */}
            <div className="mt-3 p-2 bg-muted rounded text-xs">
              {viewMode === 'architecture' && (
                <p>🏗️ High-level overview showing main architectural components</p>
              )}
              {viewMode === 'detailed' && (
                <p>🔍 Detailed view with all components and enhanced information</p>
              )}
              {viewMode === 'focused' && (
                <p>🎯 {selectedNode ? `Focused on ${selectedNode.label} and its connections` : 'Select a node to focus analysis'}</p>
              )}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="p-4 border-b">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Search Nodes</label>
                <input
                  type="text"
                  placeholder="Search by name or path..."
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Node Type</label>
                <select
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  aria-label="Filter by node type"
                >
                  <option value="all">All Types</option>
                  {getNodeTypes().map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHighlights}
                className="w-full"
              >
                Clear Highlights
              </Button>
            </div>
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-sm font-medium mb-3">Recent Queries</h3>
              <div className="space-y-2">
                {queryHistory.map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => {
                      setNaturalLanguageQuery(query);
                      handleNaturalLanguageSearch(query);
                    }}
                  >
                    <span className="text-xs truncate">{query}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    {/* Canvas Area */}
    <div className="flex-1 flex flex-col">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset View
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {getFilteredNodes().length} of {flowchartData.nodes.length} nodes
          </span>
          {highlightedNodes.length > 0 && (
            <Badge variant="secondary">
              {highlightedNodes.length} highlighted
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative bg-gradient-to-br from-background to-muted/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onClick={handleCanvasClick}
        />
        
        {/* Loading Overlay */}
        {isSearching && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Analyzing your query...</p>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Node Details Panel */}
    {selectedNode && (
      <div className="w-96 bg-card border-l flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getNodeIcon(selectedNode?.type || 'component')}
            {selectedNode?.label || 'Unknown'}
            <Badge variant="outline" className="capitalize">{selectedNode?.type || 'Unknown'}</Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedNode(null)}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Complexity</h4>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedNode?.complexity && selectedNode.complexity > 7 ? 'bg-red-500' :
                      selectedNode?.complexity && selectedNode.complexity > 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(selectedNode?.complexity || 0) * 10}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{selectedNode?.complexity || 0}/10</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Importance</h4>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedNode?.importance && selectedNode.importance > 7 ? 'bg-red-500' :
                      selectedNode?.importance && selectedNode.importance > 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(selectedNode?.importance || 0) * 10}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{selectedNode?.importance || 0}/10</span>
              </div>
            </div>
          </div>

          {/* File Information */}
          {selectedNode?.filePath && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">File Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Path:</span>
                  <span className="font-mono text-xs">{selectedNode?.filePath || 'N/A'}</span>
                </div>
                {selectedNode?.startLine && selectedNode?.endLine && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lines:</span>
                    <span>{selectedNode.startLine}-{selectedNode.endLine}</span>
                  </div>
                )}
                {selectedNode?.linesOfCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">LoC:</span>
                    <span>{selectedNode.linesOfCode}</span>
                  </div>
                )}
                {selectedNode?.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <Badge variant="outline">{selectedNode.language}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Metrics */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Code Metrics</h4>
            <div className="space-y-2 text-sm">
              {selectedNode?.cyclomaticComplexity && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cyclomatic Complexity:</span>
                  <Badge variant={selectedNode.cyclomaticComplexity > 10 ? 'destructive' : selectedNode.cyclomaticComplexity > 5 ? 'default' : 'secondary'}>
                    {selectedNode.cyclomaticComplexity}
                  </Badge>
                </div>
              )}
              {selectedNode?.maintainabilityIndex && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Maintainability:</span>
                  <Badge variant={selectedNode.maintainabilityIndex > 85 ? 'default' : selectedNode.maintainabilityIndex > 65 ? 'secondary' : 'destructive'}>
                    {selectedNode.maintainabilityIndex}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Dependencies */}
          {selectedNode?.dependencies && selectedNode.dependencies.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Dependencies</h4>
              <div className="flex flex-wrap gap-1">
                {selectedNode.dependencies.slice(0, 8).map((dep, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {dep}
                  </Badge>
                ))}
                {(selectedNode.dependencies.length || 0) > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{(selectedNode.dependencies.length || 0) - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Testing Info */}
          {selectedNode?.testCoverage !== undefined && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Testing</h4>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (selectedNode?.testCoverage || 0) > 80 ? 'bg-green-500' : 
                      (selectedNode?.testCoverage || 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedNode?.testCoverage || 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{selectedNode?.testCoverage || 0}%</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            {selectedNode?.filePath && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  alert(`Would open: ${selectedNode.filePath}${selectedNode?.startLine ? `:${selectedNode.startLine}` : ''}`);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Open in Editor
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                const nodeInfo = `${selectedNode?.label || 'Unknown'}\nType: ${selectedNode?.type || 'Unknown'}\n${selectedNode?.filePath ? `File: ${selectedNode.filePath}` : ''}\nComplexity: ${selectedNode?.complexity || 0}/10\nImportance: ${selectedNode?.importance || 0}/10`;
                navigator.clipboard.writeText(nodeInfo);
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Info
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => window.open(repository?.html_url || '#', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              View Repository
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
