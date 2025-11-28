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

export interface LayerInfo {
  y: number;
  height: number;
  layerIndex: number;
  label: string;
  color: string;
  borderColor: string;
  backgroundColor: string;
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
    entry: LayerInfo;
    presentation: LayerInfo;
    business: LayerInfo;
    data: LayerInfo;
    infrastructure: LayerInfo;
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
    let connections = this.generateConnections(analysis);
    
    // Optimize connection paths with smart routing
    connections = this.optimizeConnectionPaths(connections, nodes);
    
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
    const layerPositions = this.calculateLayerPositions();
    
    // Build dependency graph for hierarchical layout
    const dependencyGraph = this.buildDependencyGraph(analysis);
    const nodeHierarchy = this.calculateNodeHierarchy(analysis, dependencyGraph);
    
    // Position nodes using hierarchical layout
    Object.entries(layerGroups).forEach(([layerType, layerNodes]) => {
      const layerInfo = layerPositions[layerType as keyof typeof layerPositions];
      if (!layerInfo || layerNodes.length === 0) return;
      
      // Sort nodes by hierarchy level and importance
      const sortedNodes = this.sortNodesByHierarchy(layerNodes, nodeHierarchy);
      
      // Apply hierarchical layout within layer
      const positionedNodes = this.applyHierarchicalLayout(
        sortedNodes, 
        layerInfo, 
        nodeHierarchy,
        analysis
      );
      
      nodes.push(...positionedNodes);
    });

    return nodes;
  }

  // Advanced layout methods
  private buildDependencyGraph(analysis: ArchitectureAnalysis): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();
    
    // Initialize graph with all nodes
    analysis.nodes.forEach(node => {
      graph.set(node.id, new Set());
    });
    
    // Add dependencies
    analysis.edges.forEach(edge => {
      if (edge.type === 'import' || edge.type === 'dependency') {
        const dependencies = graph.get(edge.from) || new Set();
        dependencies.add(edge.to);
        graph.set(edge.from, dependencies);
      }
    });
    
    return graph;
  }

  private calculateNodeHierarchy(analysis: ArchitectureAnalysis, dependencyGraph: Map<string, Set<string>>): Map<string, number> {
    const hierarchy = new Map<string, number>();
    const visited = new Set<string>();
    
    // Calculate hierarchy levels using topological sort
    const calculateLevel = (nodeId: string): number => {
      if (visited.has(nodeId)) return hierarchy.get(nodeId) || 0;
      visited.add(nodeId);
      
      const dependencies = dependencyGraph.get(nodeId) || new Set();
      let maxDependencyLevel = 0;
      
      dependencies.forEach(depId => {
        const depLevel = calculateLevel(depId);
        maxDependencyLevel = Math.max(maxDependencyLevel, depLevel);
      });
      
      const level = maxDependencyLevel + 1;
      hierarchy.set(nodeId, level);
      return level;
    };
    
    // Calculate levels for all nodes
    analysis.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        calculateLevel(node.id);
      }
    });
    
    return hierarchy;
  }

  private sortNodesByHierarchy(nodes: ArchitectureNode[], nodeHierarchy: Map<string, number>): ArchitectureNode[] {
    return nodes.sort((a, b) => {
      // Sort by hierarchy level first
      const levelA = nodeHierarchy.get(a.id) || 0;
      const levelB = nodeHierarchy.get(b.id) || 0;
      
      if (levelA !== levelB) return levelA - levelB;
      
      // Then sort by importance
      const importanceA = this.calculateImportance(a, { nodes: nodes, edges: [], layers: { entry: [], presentation: [], business: [], data: [], infrastructure: [] }, metrics: { totalFiles: 0, totalLines: 0, averageComplexity: 0, coupling: 0, cohesion: 0 } });
      const importanceB = this.calculateImportance(b, { nodes: nodes, edges: [], layers: { entry: [], presentation: [], business: [], data: [], infrastructure: [] }, metrics: { totalFiles: 0, totalLines: 0, averageComplexity: 0, coupling: 0, cohesion: 0 } });
      
      if (importanceA !== importanceB) return importanceB - importanceA;
      
      // Finally sort by name
      return a.name.localeCompare(b.name);
    });
  }

  private applyHierarchicalLayout(
    nodes: ArchitectureNode[], 
    layerInfo: { y: number; height: number }, 
    nodeHierarchy: Map<string, number>,
    analysis: ArchitectureAnalysis
  ): FlowchartNode[] {
    const flowchartNodes: FlowchartNode[] = [];
    
    // Group nodes by hierarchy level
    const levelGroups = new Map<number, ArchitectureNode[]>();
    nodes.forEach(node => {
      const level = nodeHierarchy.get(node.id) || 0;
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)!.push(node);
    });
    
    // Position each level group
    let currentY = layerInfo.y + 20;
    const maxLevels = Math.max(...levelGroups.keys());
    const levelHeight = (layerInfo.height - 40) / (maxLevels + 1);
    
    Array.from(levelGroups.keys()).sort((a, b) => a - b).forEach(level => {
      const levelNodes = levelGroups.get(level)!;
      const levelY = currentY;
      
      // Position nodes within this level
      const positionedInLevel = this.positionNodesInLevel(levelNodes, levelY, analysis);
      flowchartNodes.push(...positionedInLevel);
      
      currentY += levelHeight;
    });
    
    return flowchartNodes;
  }

  private positionNodesInLevel(nodes: ArchitectureNode[], levelY: number, analysis: ArchitectureAnalysis): FlowchartNode[] {
    const flowchartNodes: FlowchartNode[] = [];
    
    if (nodes.length === 1) {
      // Single node - center it
      const node = nodes[0];
      flowchartNodes.push(this.createFlowchartNode(node, 500 - this.nodeWidth / 2, levelY, analysis));
    } else {
      // Multiple nodes - distribute them evenly
      const totalWidth = nodes.length * this.nodeWidth + (nodes.length - 1) * this.nodeSpacing;
      const startX = (1000 - totalWidth) / 2;
      
      nodes.forEach((node, index) => {
        const x = startX + index * (this.nodeWidth + this.nodeSpacing);
        flowchartNodes.push(this.createFlowchartNode(node, x, levelY, analysis));
      });
    }
    
    return flowchartNodes;
  }

  private createFlowchartNode(node: ArchitectureNode, x: number, y: number, analysis: ArchitectureAnalysis): FlowchartNode {
    return {
      id: node.id,
      label: node.name,
      type: this.mapNodeType(node.type),
      x: Math.max(x, this.margin), // Ensure positive X
      y: Math.max(y, this.margin), // Ensure positive Y
      width: this.nodeWidth,
      height: this.nodeHeight,
      layer: this.determineNodeLayer(node, analysis) === 'entry' ? 0 :
             this.determineNodeLayer(node, analysis) === 'presentation' ? 1 :
             this.determineNodeLayer(node, analysis) === 'business' ? 2 :
             this.determineNodeLayer(node, analysis) === 'data' ? 3 : 4,
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
    
    // Check if it's a frontend file based on path
    if (node.filePath && (
      node.filePath.includes('frontend') || 
      node.filePath.includes('src/') ||
      node.filePath.includes('.tsx') ||
      node.filePath.includes('.jsx') ||
      node.filePath.includes('.html') ||
      node.filePath.includes('.css')
    )) {
      return 'presentation';
    }
    
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
    // The actual positioning will be adjusted by the frontend renderer based on canvas size
    const viewportWidth = 1200;
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

  private optimizeConnectionPaths(connections: FlowchartConnection[], nodes: FlowchartNode[]): FlowchartConnection[] {
    return connections.map(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        // Create smart curved path with routing
        const path = this.createSmartConnectionPath(fromNode, toNode, connection.type);
        return { ...connection, path };
      }
      
      return connection;
    });
  }

  private createSmartConnectionPath(fromNode: FlowchartNode, toNode: FlowchartNode, connectionType: string): { x: number; y: number }[] {
    const fromCenterX = fromNode.x + fromNode.width / 2;
    const fromCenterY = fromNode.y + fromNode.height / 2;
    const toCenterX = toNode.x + toNode.width / 2;
    const toCenterY = toNode.y + toNode.height / 2;
    
    // Calculate connection points on node edges
    const fromPoint = this.getConnectionPoint(fromNode, toNode);
    const toPoint = this.getConnectionPoint(toNode, fromNode);
    
    // Create path based on connection type and node positions
    if (connectionType === 'inheritance') {
      // Inheritance - use tree-like structure
      return this.createTreePath(fromPoint, toPoint);
    } else if (Math.abs(fromNode.layer - toNode.layer) > 1) {
      // Cross-layer connections - use stepped path
      return this.createSteppedPath(fromPoint, toPoint, fromNode.layer, toNode.layer);
    } else {
      // Same layer or adjacent layer - use smooth curve
      return this.createSmoothCurve(fromPoint, toPoint);
    }
  }

  private getConnectionPoint(fromNode: FlowchartNode, toNode: FlowchartNode): { x: number; y: number } {
    const fromCenterX = fromNode.x + fromNode.width / 2;
    const fromCenterY = fromNode.y + fromNode.height / 2;
    const toCenterX = toNode.x + toNode.width / 2;
    const toCenterY = toNode.y + toNode.height / 2;
    
    // Calculate direction vector
    const dx = toCenterX - fromCenterX;
    const dy = toCenterY - fromCenterY;
    
    // Determine which edge of the fromNode to connect from
    const angle = Math.atan2(dy, dx);
    const absAngle = Math.abs(angle);
    
    // Connect from appropriate edge based on angle
    if (absAngle < Math.PI / 4 || absAngle > 7 * Math.PI / 4) {
      // Right edge
      return { x: fromNode.x + fromNode.width, y: fromCenterY };
    } else if (absAngle < 3 * Math.PI / 4) {
      // Bottom edge
      return { x: fromCenterX, y: fromNode.y + fromNode.height };
    } else {
      // Left edge
      return { x: fromNode.x, y: fromCenterY };
    }
  }

  private createTreePath(fromPoint: { x: number; y: number }, toPoint: { x: number; y: number }): { x: number; y: number }[] {
    // Create tree-like path for inheritance
    const midY = (fromPoint.y + toPoint.y) / 2;
    
    return [
      { x: fromPoint.x, y: fromPoint.y },
      { x: fromPoint.x, y: midY },
      { x: toPoint.x, y: midY },
      { x: toPoint.x, y: toPoint.y }
    ];
  }

  private createSteppedPath(
    fromPoint: { x: number; y: number }, 
    toPoint: { x: number; y: number },
    fromLayer: number,
    toLayer: number
  ): { x: number; y: number }[] {
    // Create stepped path for cross-layer connections
    const midX = (fromPoint.x + toPoint.x) / 2;
    const midY = (fromPoint.y + toPoint.y) / 2;
    
    // Add intermediate points to create clear routing
    const step1Y = fromPoint.y + (toPoint.y - fromPoint.y) * 0.3;
    const step2Y = fromPoint.y + (toPoint.y - fromPoint.y) * 0.7;
    
    return [
      { x: fromPoint.x, y: fromPoint.y },
      { x: midX, y: step1Y },
      { x: midX, y: step2Y },
      { x: toPoint.x, y: toPoint.y }
    ];
  }

  private createSmoothCurve(fromPoint: { x: number; y: number }, toPoint: { x: number; y: number }): { x: number; y: number }[] {
    // Create smooth bezier curve for same-layer connections
    const midX = (fromPoint.x + toPoint.x) / 2;
    const midY = (fromPoint.y + toPoint.y) / 2;
    
    // Add curvature based on distance
    const distance = Math.sqrt(
      Math.pow(toPoint.x - fromPoint.x, 2) + 
      Math.pow(toPoint.y - fromPoint.y, 2)
    );
    const curvature = Math.min(distance * 0.2, 50);
    
    // Create control points for bezier curve
    const controlOffset = fromPoint.y < toPoint.y ? curvature : -curvature;
    
    return [
      { x: fromPoint.x, y: fromPoint.y },
      { x: midX, y: midY + controlOffset },
      { x: toPoint.x, y: toPoint.y }
    ];
  }

  private calculateLayerPositions() {
    // Ensure all layers start with positive Y coordinates
    const baseMargin = Math.max(this.margin, 30); // Minimum 30px margin
    return {
      entry: { 
        y: baseMargin, 
        height: 120, 
        layerIndex: 0,
        label: 'Entry Points',
        color: '#10B981',
        borderColor: '#059669',
        backgroundColor: '#ECFDF5'
      },
      presentation: { 
        y: baseMargin + 170, 
        height: 200, 
        layerIndex: 1,
        label: 'Presentation Layer',
        color: '#3B82F6',
        borderColor: '#1D4ED8',
        backgroundColor: '#EFF6FF'
      },
      business: { 
        y: baseMargin + 370, 
        height: 250, 
        layerIndex: 2,
        label: 'Business Logic',
        color: '#8B5CF6',
        borderColor: '#6D28D9',
        backgroundColor: '#F3E8FF'
      },
      data: { 
        y: baseMargin + 620, 
        height: 150, 
        layerIndex: 3,
        label: 'Data Layer',
        color: '#F59E0B',
        borderColor: '#D97706',
        backgroundColor: '#FEF3C7'
      },
      infrastructure: { 
        y: baseMargin + 770, 
        height: 180, 
        layerIndex: 4,
        label: 'Infrastructure',
        color: '#EF4444',
        borderColor: '#DC2626',
        backgroundColor: '#FEF2F2'
      }
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
