import { ArchitectureAnalysis, ArchitectureNode, ArchitectureEdge } from './architecture-analyzer';

export interface FlowchartNode {
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

export interface FlowchartConnection {
  from: string;
  to: string;
  type: 'import' | 'export' | 'call' | 'dependency' | 'inheritance';
  strength: number;
  path?: { x: number; y: number }[];
}

export interface DynamicFlowchart {
  nodes: FlowchartNode[];
  connections: FlowchartConnection[];
  layers: {
    entry: { y: number; height: number };
    presentation: { y: number; height: number };
    business: { y: number; height: number };
    data: { y: number; height: number };
    infrastructure: { y: number; height: number };
  };
  metrics: {
    totalNodes: number;
    totalConnections: number;
    averageComplexity: number;
    coupling: number;
    cohesion: number;
  };
}

export class DynamicFlowchartGenerator {
  private nodeWidth = 180;
  private nodeHeight = 80;
  private layerSpacing = 150;
  private nodeSpacing = 20;
  private margin = 50;

  generateFlowchart(analysis: ArchitectureAnalysis): DynamicFlowchart {
    const nodes = this.generateNodes(analysis);
    const connections = this.generateConnections(analysis);
    const layers = this.calculateLayerPositions();
    const metrics = this.calculateFlowchartMetrics(analysis);

    return {
      nodes,
      connections,
      layers,
      metrics
    };
  }

  private generateNodes(analysis: ArchitectureAnalysis): FlowchartNode[] {
    const nodes: FlowchartNode[] = [];
    const layerGroups = this.groupNodesByLayer(analysis);
    
    // Calculate positions for each layer
    let currentY = this.margin;
    
    Object.entries(layerGroups).forEach(([layerType, layerNodes]) => {
      const layerHeight = this.calculateLayerHeight(layerNodes.length);
      
      layerNodes.forEach((node, index) => {
        const flowchartNode: FlowchartNode = {
          id: node.id,
          label: node.name,
          type: this.mapNodeType(node.type),
          x: this.calculateNodeXPosition(index, layerNodes.length),
          y: currentY + (index * (this.nodeHeight + this.nodeSpacing)),
          width: this.nodeWidth,
          height: this.nodeHeight,
          layer: this.getLayerIndex(layerType),
          filePath: node.filePath,
          complexity: node.complexity,
          importance: this.calculateImportance(node, analysis),
          metadata: {
            linesOfCode: node.linesOfCode,
            language: node.language,
            patterns: node.metadata.patterns,
            dependencies: node.dependencies,
            dependents: node.dependents,
            isEntry: node.metadata.isEntry,
            isAsync: node.metadata.isAsync,
            hasErrorHandling: node.metadata.hasErrorHandling
          }
        };
        
        nodes.push(flowchartNode);
      });
      
      currentY += layerHeight + this.layerSpacing;
    });

    return nodes;
  }

  private groupNodesByLayer(analysis: ArchitectureAnalysis): { [layer: string]: ArchitectureNode[] } {
    const groups: { [layer: string]: ArchitectureNode[] } = {
      entry: [],
      presentation: [],
      business: [],
      data: [],
      infrastructure: []
    };

    analysis.nodes.forEach(node => {
      const layer = this.determineNodeLayer(node, analysis);
      groups[layer].push(node);
    });

    return groups;
  }

  private determineNodeLayer(node: ArchitectureNode, analysis: ArchitectureAnalysis): string {
    // Check if node is explicitly in a layer
    if (analysis.layers.entry.includes(node.id)) return 'entry';
    if (analysis.layers.presentation.includes(node.id)) return 'presentation';
    if (analysis.layers.business.includes(node.id)) return 'business';
    if (analysis.layers.data.includes(node.id)) return 'data';
    if (analysis.layers.infrastructure.includes(node.id)) return 'infrastructure';

    // Infer layer based on node type and path
    if (node.metadata.isEntry) return 'entry';
    if (node.type === 'component') return 'presentation';
    if (node.type === 'service' || node.type === 'api') return 'business';
    if (node.type === 'database') return 'data';
    if (node.type === 'config' || node.type === 'utility') return 'infrastructure';

    // Default to business layer
    return 'business';
  }

  private mapNodeType(type: string): FlowchartNode['type'] {
    const typeMap: { [key: string]: FlowchartNode['type'] } = {
      'component': 'component',
      'service': 'service',
      'utility': 'util',
      'api': 'api',
      'database': 'database',
      'config': 'config',
      'hook': 'hook',
      'module': 'service',
      'test': 'test'
    };
    
    return typeMap[type] || 'service';
  }

  private getLayerIndex(layerType: string): number {
    const layerIndices: { [key: string]: number } = {
      'entry': 0,
      'presentation': 1,
      'business': 2,
      'data': 3,
      'infrastructure': 4
    };
    
    return layerIndices[layerType] || 2;
  }

  private calculateLayerHeight(nodeCount: number): number {
    return nodeCount * (this.nodeHeight + this.nodeSpacing) - this.nodeSpacing;
  }

  private calculateNodeXPosition(index: number, totalNodes: number): number {
    const totalWidth = totalNodes * (this.nodeWidth + this.nodeSpacing) - this.nodeSpacing;
    // Use a reasonable default width for server-side rendering (1200px typical desktop)
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const startX = (viewportWidth - totalWidth) / 2;
    return startX + index * (this.nodeWidth + this.nodeSpacing);
  }

  private calculateImportance(node: ArchitectureNode, analysis: ArchitectureAnalysis): number {
    let importance = 1; // Base importance

    // Entry points are most important
    if (node.metadata.isEntry) importance += 3;

    // High dependency count = more important
    importance += node.dependents.length * 0.5;

    // High complexity = more important
    importance += node.complexity * 0.1;

    // Key patterns increase importance
    if (node.metadata.patterns.includes('singleton')) importance += 1;
    if (node.metadata.patterns.includes('observer')) importance += 1;
    if (node.metadata.patterns.includes('mvc')) importance += 1;

    // Large files are more important
    if (node.linesOfCode > 200) importance += 0.5;
    if (node.linesOfCode > 500) importance += 0.5;

    return Math.min(importance, 5); // Cap at 5
  }

  private generateConnections(analysis: ArchitectureAnalysis): FlowchartConnection[] {
    const connections: FlowchartConnection[] = [];
    
    analysis.edges.forEach(edge => {
      const connection: FlowchartConnection = {
        from: edge.from,
        to: edge.to,
        type: edge.type,
        strength: edge.strength
      };
      
      connections.push(connection);
    });

    return connections;
  }

  private calculateLayerPositions() {
    return {
      entry: { y: this.margin, height: 120 },
      presentation: { y: this.margin + 170, height: 200 },
      business: { y: this.margin + 370, height: 250 },
      data: { y: this.margin + 620, height: 150 },
      infrastructure: { y: this.margin + 770, height: 180 }
    };
  }

  private calculateFlowchartMetrics(analysis: ArchitectureAnalysis) {
    return {
      totalNodes: analysis.nodes.length,
      totalConnections: analysis.edges.length,
      averageComplexity: analysis.metrics.averageComplexity,
      coupling: analysis.metrics.coupling,
      cohesion: analysis.metrics.cohesion
    };
  }

  // Advanced layout optimization
  optimizeLayout(flowchart: DynamicFlowchart): DynamicFlowchart {
    // Reduce node overlap
    const optimizedNodes = this.reduceOverlap(flowchart.nodes);
    
    // Optimize connection paths
    const optimizedConnections = this.optimizeConnectionPaths(flowchart.connections, optimizedNodes);
    
    return {
      ...flowchart,
      nodes: optimizedNodes,
      connections: optimizedConnections
    };
  }

  private reduceOverlap(nodes: FlowchartNode[]): FlowchartNode[] {
    const optimizedNodes = [...nodes];
    const maxIterations = 100;
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasOverlap = false;
      
      for (let i = 0; i < optimizedNodes.length; i++) {
        for (let j = i + 1; j < optimizedNodes.length; j++) {
          const node1 = optimizedNodes[i];
          const node2 = optimizedNodes[j];
          
          if (this.nodesOverlap(node1, node2)) {
            hasOverlap = true;
            this.separateNodes(node1, node2);
          }
        }
      }
      
      if (!hasOverlap) break;
    }
    
    return optimizedNodes;
  }

  private nodesOverlap(node1: FlowchartNode, node2: FlowchartNode): boolean {
    return !(node1.x + node1.width < node2.x || 
             node2.x + node2.width < node1.x || 
             node1.y + node1.height < node2.y || 
             node2.y + node2.height < node1.y);
  }

  private separateNodes(node1: FlowchartNode, node2: FlowchartNode): void {
    const centerX1 = node1.x + node1.width / 2;
    const centerY1 = node1.y + node1.height / 2;
    const centerX2 = node2.x + node2.width / 2;
    const centerY2 = node2.y + node2.height / 2;
    
    const dx = centerX2 - centerX1;
    const dy = centerY2 - centerY1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const minDistance = (node1.width + node2.width) / 2 + this.nodeSpacing;
      const separation = (minDistance - distance) / 2;
      
      const separationX = (dx / distance) * separation;
      const separationY = (dy / distance) * separation;
      
      node1.x -= separationX;
      node1.y -= separationY;
      node2.x += separationX;
      node2.y += separationY;
    }
  }

  private optimizeConnectionPaths(connections: FlowchartConnection[], nodes: FlowchartNode[]): FlowchartConnection[] {
    return connections.map(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        // Create simple curved path
        const path = this.createCurvedPath(fromNode, toNode);
        return { ...connection, path };
      }
      
      return connection;
    });
  }

  private createCurvedPath(fromNode: FlowchartNode, toNode: FlowchartNode): { x: number; y: number }[] {
    const fromX = fromNode.x + fromNode.width / 2;
    const fromY = fromNode.y + fromNode.height / 2;
    const toX = toNode.x + toNode.width / 2;
    const toY = toNode.y + toNode.height / 2;
    
    // Create a simple curved path with control points
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    // Add curve based on layer difference
    const layerDiff = toNode.layer - fromNode.layer;
    const curveOffset = layerDiff * 30;
    
    return [
      { x: fromX, y: fromY },
      { x: midX + curveOffset, y: midY },
      { x: toX, y: toY }
    ];
  }

  // Export utilities
  exportToMermaid(flowchart: DynamicFlowchart): string {
    let mermaid = 'graph TD\n';
    
    // Add nodes
    flowchart.nodes.forEach(node => {
      const nodeShape = this.getNodeShape(node.type);
      const label = node.label.replace(/"/g, '&quot;');
      mermaid += `  ${node.id}${nodeShape}"${label}"\n`;
    });
    
    // Add connections
    flowchart.connections.forEach(connection => {
      const arrowStyle = this.getArrowStyle(connection.type);
      mermaid += `  ${connection.from} ${arrowStyle} ${connection.to}\n`;
    });
    
    return mermaid;
  }

  private getNodeShape(type: FlowchartNode['type']): string {
    const shapes: { [key: string]: string } = {
      'entry': '>]',
      'component': '[',
      'service': '[',
      'database': '{',
      'external': '[(',
      'config': '[/]',
      'api': '[',
      'hook': '(',
      'util': '[[',
      'test': '[\\]'
    };
    
    return shapes[type] || '[';
  }

  private getArrowStyle(type: string): string {
    const styles: { [key: string]: string } = {
      'import': '-->',
      'export': '-->',
      'call': '-.->',
      'dependency': '==>',
      'inheritance': '-->'
    };
    
    return styles[type] || '-->';
  }

  exportToJSON(flowchart: DynamicFlowchart): string {
    return JSON.stringify(flowchart, null, 2);
  }
}
