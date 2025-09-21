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

  const layoutNodes = (nodes: FlowchartNode[], edges: FlowchartEdge[]) => {
    if (nodes.length === 0) return;

    console.log('Layout nodes called with:', { nodes: nodes.length, edges: edges.length });

    // Simple hierarchical layout
    const levels = new Map<string, number>();
    const nodesInLevel = new Map<number, FlowchartNode[]>();
    
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
    
    // Assign levels using BFS
    const queue: { node: FlowchartNode; level: number }[] = rootNodes.map(node => ({ node, level: 0 }));
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      
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
          queue.push({ node: targetNode, level: level + 1 });
        }
      });
    }
    
    // Position nodes
    const levelHeight = 150;
    const nodeWidth = 140;
    const nodeSpacing = 20;
    const canvasWidth = 800; // Default canvas width
    
    nodesInLevel.forEach((nodesInThisLevel, level) => {
      const totalWidth = nodesInThisLevel.length * nodeWidth + (nodesInThisLevel.length - 1) * nodeSpacing;
      const startX = (canvasWidth - totalWidth) / 2; // Center horizontally
      
      nodesInThisLevel.forEach((node, index) => {
        node.x = startX + index * (nodeWidth + nodeSpacing) + nodeWidth / 2;
        node.y = 100 + level * levelHeight;
        console.log(`Positioned node ${node.id} at (${node.x}, ${node.y})`);
      });
    });
    
    // Position any remaining nodes that weren't reached in BFS
    nodes.forEach(node => {
      if (!levels.has(node.id)) {
        node.x = Math.random() * (canvasWidth - 200) + 100;
        node.y = Math.random() * 400 + 100;
        console.log(`Positioned unconnected node ${node.id} at (${node.x}, ${node.y})`);
      }
    });
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
    
    // Draw edges (only for visible nodes)
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    flowchartData.edges.forEach(edge => {
      const fromNode = filteredNodes.find(n => n.id === edge.from);
      const toNode = filteredNodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode && fromNode.x && fromNode.y && toNode.x && toNode.y) {
        // Highlight edges connected to highlighted nodes
        const isHighlighted = highlightedNodes.includes(edge.from) || highlightedNodes.includes(edge.to);
        
        ctx.strokeStyle = isHighlighted ? '#fbbf24' : '#6b7280';
        ctx.lineWidth = isHighlighted ? 3 : 2;
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(toNode.x, toNode.y);
        ctx.lineTo(
          toNode.x - arrowLength * Math.cos(angle - Math.PI / 6),
          toNode.y - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toNode.x, toNode.y);
        ctx.lineTo(
          toNode.x - arrowLength * Math.cos(angle + Math.PI / 6),
          toNode.y - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      if (!node.x || !node.y) return;

      const isSelected = selectedNode?.id === node.id;
      const isHighlighted = highlightedNodes.includes(node.id);
      const color = getNodeColor(node.type);

      // Node shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Node background
      ctx.fillStyle = isHighlighted ? '#fbbf24' : color;
      ctx.strokeStyle = isSelected ? '#ffffff' : (isHighlighted ? '#f59e0b' : color);
      ctx.lineWidth = isSelected ? 3 : (isHighlighted ? 3 : 2);

      const nodeWidth = 120;
      const nodeHeight = 60;
      const radius = 8;

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.roundRect(node.x - nodeWidth/2, node.y - nodeHeight/2, nodeWidth, nodeHeight, radius);
      ctx.fill();
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';

      // Node text
      ctx.fillStyle = isHighlighted ? '#000000' : '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text if too long
      const maxWidth = nodeWidth - 20;
      const words = node.label.split(' ');
      let line = '';
      let y = node.y - 10;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, node.x, y);
          line = words[i] + ' ';
          y += 16;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, node.x, y);
    });

    ctx.restore();
  }, [flowchartData, scale, offset, selectedNode, getFilteredNodes, highlightedNodes]);

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

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Find clicked node
    const clickedNode = flowchartData.nodes.find(node => {
      if (!node.x || !node.y) return false;
      const nodeWidth = 120;
      const nodeHeight = 60;
      return (
        x >= node.x - nodeWidth/2 &&
        x <= node.x + nodeWidth/2 &&
        y >= node.y - nodeHeight/2 &&
        y <= node.y + nodeHeight/2
      );
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
              >
                <Layers className="w-4 h-4 mr-2" />
                Architecture Overview
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                onClick={() => setViewMode('detailed')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Detailed View
              </Button>
              <Button
                variant={viewMode === 'focused' ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                onClick={() => setViewMode('focused')}
              >
                <Target className="w-4 h-4 mr-2" />
                Focused Analysis
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-3">Filters</h3>
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
