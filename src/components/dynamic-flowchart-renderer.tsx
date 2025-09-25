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
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  Code,
  Network
} from 'lucide-react';
import type { Repository } from '@/lib/types';

interface FlowchartNode {
  id: string;
  label: string;
  type: 'entry' | 'component' | 'service' | 'database' | 'external' | 'config' | 'api' | 'hook' | 'util' | 'test';
  x: number;
  y: number;
  width: number;
  height: number;
  layer: number;
  filePath?: string;
  complexity: number;
  importance: number;
  metadata: {
    linesOfCode: number;
    language: string;
    patterns: string[];
    dependencies: string[];
    dependents: string[];
    isEntry?: boolean;
    isAsync?: boolean;
    hasErrorHandling?: boolean;
  };
}

interface FlowchartConnection {
  from: string;
  to: string;
  type: 'import' | 'export' | 'call' | 'dependency' | 'inheritance';
  strength: number;
}

interface FlowchartLayers {
  entry: { y: number; height: number };
  presentation: { y: number; height: number };
  business: { y: number; height: number };
  data: { y: number; height: number };
  infrastructure: { y: number; height: number };
}

interface FlowchartMetrics {
  totalNodes: number;
  totalConnections: number;
  averageComplexity: number;
  coupling: number;
  cohesion: number;
}

interface ArchitectureInsights {
  designPatterns: string[];
  dataFlow: string;
  errorHandling: string;
  scalability: string;
  performance: string;
  security: string;
  integrations: string[];
  deployment: string;
  complexityAnalysis: {
    highComplexityComponents: Array<{
      name: string;
      complexity: number;
      filePath: string;
      reasons: string[];
    }>;
    refactoringSuggestions: Array<{
      component: string;
      suggestion: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  };
}

interface DynamicFlowchartData {
  nodes: FlowchartNode[];
  connections: FlowchartConnection[];
  layers: FlowchartLayers;
  metrics: FlowchartMetrics;
}

interface DynamicFlowchartRendererProps {
  flowchartData: DynamicFlowchartData;
  architectureInsights: ArchitectureInsights;
  analysisSummary: string;
  repository: Repository;
  onNodeClick?: (node: FlowchartNode) => void;
  theme?: 'light' | 'dark' | 'auto';
}

export default function DynamicFlowchartRenderer({ 
  flowchartData, 
  architectureInsights,
  analysisSummary,
  repository, 
  onNodeClick,
  theme = 'dark' 
}: DynamicFlowchartRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'architecture' | 'complexity' | 'dependencies'>('architecture');
  const [showInsights, setShowInsights] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  // Color scheme for different node types
  const getNodeColor = useCallback((type: FlowchartNode['type'], importance: number) => {
    const colors = {
      entry: '#10b981',    // Green
      component: '#3b82f6', // Blue
      service: '#8b5cf6',   // Purple
      database: '#ef4444',  // Red
      external: '#f59e0b',  // Amber
      config: '#6b7280',    // Gray
      api: '#06b6d4',      // Cyan
      hook: '#ec4899',     // Pink
      util: '#84cc16',     // Lime
      test: '#f97316'      // Orange
    };
    
    const baseColor = colors[type] || '#6b7280';
    
    // Adjust opacity based on importance
    const opacity = 0.3 + (importance / 5) * 0.7;
    
    return baseColor;
  }, []);

  // Get layer label
  const getLayerLabel = useCallback((layerIndex: number) => {
    const labels = ['Entry Points', 'Presentation Layer', 'Business Logic', 'Data Layer', 'Infrastructure'];
    return labels[layerIndex] || 'Unknown Layer';
  }, []);

  // Filter nodes based on search and filter
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
    flowchartData.connections.forEach(connection => {
      if (connection.from === nodeId) related.add(connection.to);
      if (connection.to === nodeId) related.add(connection.from);
    });
    
    setHighlightedNodes(Array.from(related));
  }, [flowchartData.connections]);

  // Clear highlights
  const clearHighlights = useCallback(() => {
    setHighlightedNodes([]);
  }, []);

  // Draw different node shapes
  const drawNodeShape = (ctx: CanvasRenderingContext2D, node: FlowchartNode) => {
    const { x, y, width, height, type } = node;
    
    switch (type) {
      case 'entry':
        // Arrow shape for entry points
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y);
        ctx.lineTo(x + width, y + height / 2);
        ctx.lineTo(x + width * 0.2, y + height);
        ctx.lineTo(x, y + height / 2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'database':
        // Cylinder shape for databases
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + 10, width / 2, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(x, y + 10, width, height - 20);
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + height - 10, width / 2, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'external':
        // Diamond shape for external services
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height / 2);
        ctx.lineTo(x + width / 2, y + height);
        ctx.lineTo(x, y + height / 2);
        ctx.closePath();
        ctx.fill();
        break;
        
      default:
        // Rectangle for most nodes
        ctx.fillRect(x, y, width, height);
        break;
    }
  };

  // Get connection color based on type
  const getConnectionColor = (type: string) => {
    const colors = {
      import: '#3b82f6',
      export: '#10b981',
      call: '#8b5cf6',
      dependency: '#f59e0b',
      inheritance: '#ef4444'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  // Get connection dash pattern
  const getConnectionDash = (type: string) => {
    switch (type) {
      case 'call': return [5, 5];
      case 'dependency': return [10, 5];
      default: return [];
    }
  };

  // Draw flowchart on canvas
  const drawFlowchart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    
    // Draw layer backgrounds
    if (flowchartData.layers) {
      Object.entries(flowchartData.layers).forEach(([layerName, layerInfo], index) => {
        ctx.fillStyle = theme === 'dark' ? 'rgba(31, 41, 55, 0.3)' : 'rgba(229, 231, 235, 0.3)';
        ctx.fillRect(0, layerInfo.y, canvas.width / scale, layerInfo.height);
        
        // Draw layer label
        ctx.fillStyle = theme === 'dark' ? '#9ca3af' : '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.fillText(getLayerLabel(layerInfo.layerIndex || index), 10, layerInfo.y + 20);
      });
    }
    
    // Draw connections
    if (flowchartData.connections && flowchartData.nodes) {
      flowchartData.connections.forEach(connection => {
        const fromNode = flowchartData.nodes.find(n => n.id === connection.from);
        const toNode = flowchartData.nodes.find(n => n.id === connection.to);
        
        if (fromNode && toNode) {
          const fromX = fromNode.x + fromNode.width / 2;
          const fromY = fromNode.y + fromNode.height / 2;
          const toX = toNode.x + toNode.width / 2;
          const toY = toNode.y + toNode.height / 2;
        
        // Set connection style based on type
        ctx.strokeStyle = getConnectionColor(connection.type);
        ctx.lineWidth = Math.max(1, connection.strength);
        ctx.setLineDash(getConnectionDash(connection.type));
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        
        // Draw curved connection for inter-layer connections
        if (Math.abs(fromNode.layer - toNode.layer) > 0) {
          const midX = (fromX + toX) / 2;
          const midY = (fromY + toY) / 2;
          ctx.quadraticCurveTo(midX, fromY, midX, midY);
          ctx.quadraticCurveTo(midX, toY, toX, toY);
        } else {
          ctx.lineTo(toX, toY);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    }
    
    // Draw nodes
    getFilteredNodes().forEach(node => {
      const isHighlighted = highlightedNodes.includes(node.id);
      const isSelected = selectedNode?.id === node.id;
      
      // Node shadow
      if (isSelected || isHighlighted) {
        ctx.shadowColor = getNodeColor(node.type, node.importance);
        ctx.shadowBlur = 10;
      }
      
      // Node background
      ctx.fillStyle = getNodeColor(node.type, node.importance);
      ctx.globalAlpha = isHighlighted ? 1 : 0.8;
      
      // Draw node shape based on type
      drawNodeShape(ctx, node);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      
      // Node border
      ctx.strokeStyle = isSelected ? '#ffffff' : (theme === 'dark' ? '#374151' : '#d1d5db');
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.stroke();
      
      // Node label
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#1f2937';
      ctx.font = `${node.importance >= 4 ? 'bold ' : ''}12px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Truncate label if too long
      const maxLabelLength = 20;
      const label = node.label.length > maxLabelLength 
        ? node.label.substring(0, maxLabelLength) + '...' 
        : node.label;
      
      ctx.fillText(label, node.x + node.width / 2, node.y + node.height / 2 - 8);
      
      // Show complexity indicator
      if (viewMode === 'complexity') {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = node.complexity > 10 ? '#ef4444' : (node.complexity > 5 ? '#f59e0b' : '#10b981');
        ctx.fillText(`C: ${node.complexity}`, node.x + node.width / 2, node.y + node.height / 2 + 8);
      }
      
      // Show dependency count
      if (viewMode === 'dependencies') {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`D: ${node.metadata.dependencies.length}`, node.x + node.width / 2, node.y + node.height / 2 + 8);
      }
    });
    
    ctx.restore();
  }, [flowchartData, scale, offset, selectedNode, highlightedNodes, searchTerm, filterType, viewMode, theme, getNodeColor, getLayerLabel, getFilteredNodes]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - offset.x) / scale;
    const y = (event.clientY - rect.top - offset.y) / scale;
    
    // Find clicked node
    const clickedNode = getFilteredNodes().find(node => 
      x >= node.x && x <= node.x + node.width &&
      y >= node.y && y <= node.y + node.height
    );
    
    if (clickedNode) {
      setSelectedNode(clickedNode);
      highlightRelatedNodes(clickedNode.id);
      onNodeClick?.(clickedNode);
    } else {
      setSelectedNode(null);
      clearHighlights();
    }
  }, [offset, scale, getFilteredNodes, highlightRelatedNodes, clearHighlights, onNodeClick]);

  // Handle mouse drag
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  }, [offset]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    setOffset({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle zoom
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, 0.3));
  }, []);

  const handleZoomReset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Handle fullscreen
  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Export as image
  const exportAsImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${repository.name}-architecture.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, [repository.name]);

  // Copy analysis summary
  const copyAnalysisSummary = useCallback(() => {
    navigator.clipboard.writeText(analysisSummary);
  }, [analysisSummary]);

  // Resize canvas when container size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawFlowchart();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFlowchart]);

  // Redraw when data changes
  useEffect(() => {
    drawFlowchart();
  }, [flowchartData, scale, offset, selectedNode, highlightedNodes, searchTerm, filterType, viewMode, theme, drawFlowchart]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomIn}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomOut}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomReset}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Target className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleFullscreen}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Maximize className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={exportAsImage}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {getNodeTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'architecture' ? 'default' : 'secondary'}
            onClick={() => setViewMode('architecture')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'complexity' ? 'default' : 'secondary'}
            onClick={() => setViewMode('complexity')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'dependencies' ? 'default' : 'secondary'}
            onClick={() => setViewMode('dependencies')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Network className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowInsights(!showInsights)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Brain className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowMetrics(!showMetrics)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="absolute bottom-4 left-4 z-10 w-80 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor(selectedNode.type, selectedNode.importance) }}
              />
              {selectedNode.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white text-xs space-y-2">
            <div className="flex justify-between">
              <span>Type:</span>
              <Badge variant="secondary" className="text-xs">
                {selectedNode.type}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Complexity:</span>
              <Badge 
                variant={selectedNode.complexity > 10 ? 'destructive' : selectedNode.complexity > 5 ? 'default' : 'secondary'}
                className="text-xs"
              >
                {selectedNode.complexity}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Importance:</span>
              <Badge variant="outline" className="text-xs">
                {selectedNode.importance}/5
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Lines of Code:</span>
              <span>{selectedNode.metadata.linesOfCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Language:</span>
              <span>{selectedNode.metadata.language}</span>
            </div>
            {selectedNode.filePath && (
              <div className="text-xs opacity-75">
                Path: {selectedNode.filePath}
              </div>
            )}
            {selectedNode.metadata.patterns.length > 0 && (
              <div>
                <div className="font-medium mb-1">Patterns:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.metadata.patterns.map((pattern, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Architecture Insights Panel */}
      {showInsights && (
        <Card className="absolute bottom-4 right-4 z-10 w-96 bg-white/10 backdrop-blur-md border-white/20 max-h-96 overflow-y-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Architecture Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white text-xs space-y-3">
            <div>
              <div className="font-medium mb-1">Design Patterns:</div>
              <div className="flex flex-wrap gap-1">
                {architectureInsights.designPatterns.map((pattern, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Data Flow:</div>
              <div className="text-xs opacity-90">{architectureInsights.dataFlow}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Error Handling:</div>
              <div className="text-xs opacity-90">{architectureInsights.errorHandling}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Scalability:</div>
              <div className="text-xs opacity-90">{architectureInsights.scalability}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Performance:</div>
              <div className="text-xs opacity-90">{architectureInsights.performance}</div>
            </div>
            
            {architectureInsights.complexityAnalysis.highComplexityComponents.length > 0 && (
              <div>
                <div className="font-medium mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  High Complexity Components:
                </div>
                <div className="space-y-1">
                  {architectureInsights.complexityAnalysis.highComplexityComponents.slice(0, 3).map((component, index) => (
                    <div key={index} className="text-xs opacity-90">
                      • {component.name} (Complexity: {component.complexity})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metrics Panel */}
      {showMetrics && (
        <Card className="absolute top-20 left-4 z-10 w-64 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Architecture Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white text-xs space-y-2">
            <div className="flex justify-between">
              <span>Total Components:</span>
              <span>{flowchartData.metrics.totalNodes}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Connections:</span>
              <span>{flowchartData.metrics.totalConnections}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Complexity:</span>
              <span>{flowchartData.metrics.averageComplexity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Coupling:</span>
              <span>{flowchartData.metrics.coupling.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cohesion:</span>
              <span>{flowchartData.metrics.cohesion.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Summary */}
      {analysisSummary && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-3">
              <div className="text-white text-xs flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                <span className="opacity-90">{analysisSummary}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAnalysisSummary}
                  className="h-6 w-6 p-0 hover:bg-white/20"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-20 right-4 z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xs">Legend</CardTitle>
          </CardHeader>
          <CardContent className="text-white text-xs space-y-1">
            {Object.entries({
              entry: 'Entry Points',
              component: 'Components',
              service: 'Services',
              database: 'Database',
              external: 'External'
            }).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getNodeColor(type as FlowchartNode['type'], 3) }}
                />
                <span>{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
