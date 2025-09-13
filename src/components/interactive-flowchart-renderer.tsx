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
  Database,
  Cpu,
  Globe,
  Settings
} from 'lucide-react';
import type { Repository } from '@/lib/types';

interface FlowchartNode {
  id: string;
  label: string;
  type: 'entry' | 'component' | 'module' | 'service' | 'database' | 'external' | 'config';
  filePath?: string;
  complexity: number; // 1-10
  importance: number; // 1-10
  dependencies: string[];
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
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

  // Parse mermaid chart into structured data
  const parseMermaidChart = useCallback((mermaidCode: string): FlowchartData => {
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];
    const nodeMap = new Map<string, FlowchartNode>();

    try {
      const lines = mermaidCode.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Parse nodes: A[Component] or B((Module))
        const nodeMatch = trimmed.match(/^([A-Za-z0-9]+)\[([^\]]+)\]/) || 
                         trimmed.match(/^([A-Za-z0-9]+)\(\(([^\)]+)\)\)/) ||
                         trimmed.match(/^([A-Za-z0-9]+)\{([^\}]+)\}/);
        
        if (nodeMatch) {
          const [, id, label] = nodeMatch;
          const node: FlowchartNode = {
            id,
            label,
            type: getNodeFromLabel(label),
            complexity: Math.floor(Math.random() * 10) + 1,
            importance: Math.floor(Math.random() * 10) + 1,
            dependencies: [],
            x: Math.random() * 600 + 100,
            y: Math.random() * 400 + 100
          };
          nodes.push(node);
          nodeMap.set(id, node);
        }
        
        // Parse edges: A --> B
        const edgeMatch = trimmed.match(/^([A-Za-z0-9]+)\s*-->\s*([A-Za-z0-9]+)/);
        if (edgeMatch) {
          const [, from, to] = edgeMatch;
          edges.push({ from, to });
          
          // Add dependency
          const fromNode = nodeMap.get(from);
          const toNode = nodeMap.get(to);
          if (fromNode && toNode) {
            fromNode.dependencies.push(to);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing mermaid chart:', error);
    }

    return { nodes, edges };
  }, []);

  const getNodeFromLabel = (label: string): FlowchartNode['type'] => {
    const lower = label.toLowerCase();
    if (lower.includes('auth') || lower.includes('login')) return 'service';
    if (lower.includes('database') || lower.includes('db') || lower.includes('storage')) return 'database';
    if (lower.includes('api') || lower.includes('service')) return 'service';
    if (lower.includes('config') || lower.includes('setting')) return 'config';
    if (lower.includes('external') || lower.includes('third')) return 'external';
    if (lower.includes('module')) return 'module';
    return 'component';
  };

  const getNodeColor = (type: FlowchartNode['type']): string => {
    const colors = {
      entry: '#10b981',     // green
      component: '#3b82f6', // blue
      module: '#8b5cf6',    // purple
      service: '#f59e0b',   // amber
      database: '#ef4444',  // red
      external: '#6b7280',  // gray
      config: '#06b6d4'     // cyan
    };
    return colors[type] || colors.component;
  };

  const getNodeIcon = (type: FlowchartNode['type']) => {
    const icons = {
      entry: <Cpu className="w-4 h-4" />,
      component: <FileText className="w-4 h-4" />,
      module: <GitBranch className="w-4 h-4" />,
      service: <Settings className="w-4 h-4" />,
      database: <Database className="w-4 h-4" />,
      external: <Globe className="w-4 h-4" />,
      config: <Settings className="w-4 h-4" />
    };
    return icons[type] || icons.component;
  };

  // Initialize flowchart data
  useEffect(() => {
    const data = parseMermaidChart(chart);
    setFlowchartData(data);
  }, [chart, parseMermaidChart]);

  // Canvas rendering
  const drawFlowchart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw edges
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    flowchartData.edges.forEach(edge => {
      const fromNode = flowchartData.nodes.find(n => n.id === edge.from);
      const toNode = flowchartData.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode && fromNode.x && fromNode.y && toNode.x && toNode.y) {
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
    flowchartData.nodes.forEach(node => {
      if (!node.x || !node.y) return;

      const isSelected = selectedNode?.id === node.id;
      const color = getNodeColor(node.type);

      // Node shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Node background
      ctx.fillStyle = color;
      ctx.strokeStyle = isSelected ? '#ffffff' : color;
      ctx.lineWidth = isSelected ? 3 : 2;

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
      ctx.fillStyle = '#ffffff';
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
  }, [flowchartData, scale, offset, selectedNode]);

  useEffect(() => {
    drawFlowchart();
  }, [drawFlowchart]);

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawFlowchart();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
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
    e.preventDefault();
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
      setSelectedNode(clickedNode);
      onNodeClick?.(clickedNode);
    } else {
      setSelectedNode(null);
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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
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
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('png')}>
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden bg-background"
        style={{ height: '600px' }}
      >
        <canvas
          ref={canvasRef}
          className="cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
        />

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
          Scroll to zoom • Drag to pan • Click nodes for details
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNodeIcon(selectedNode.type)}
              {selectedNode.label}
              <Badge variant="outline">{selectedNode.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Complexity</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${selectedNode.complexity * 10}%` }}
                    />
                  </div>
                  <span className="text-sm">{selectedNode.complexity}/10</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Importance</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${selectedNode.importance * 10}%` }}
                    />
                  </div>
                  <span className="text-sm">{selectedNode.importance}/10</span>
                </div>
              </div>
            </div>

            {selectedNode.dependencies.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.dependencies.map(dep => (
                    <Badge key={dep} variant="secondary" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(repository.html_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Repository
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
