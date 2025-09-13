// Test Mermaid parsing logic
function parseMermaidChart(mermaidCode) {
  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  try {
    const lines = mermaidCode.split('\n').filter(line => line.trim());
    console.log('Parsing Mermaid lines:', lines);
    
    // First pass: collect all nodes
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip flowchart declaration and subgraph lines
      if (trimmed.startsWith('flowchart') || trimmed.startsWith('subgraph') || trimmed.startsWith('end')) {
        continue;
      }
      
      // Parse various node formats:
      // A[Text] - rectangle
      // B((Text)) - circle
      // C{Text} - diamond
      // D[Text] - rectangle
      // E>Text] - asymmetric
      // A:::class - styled node
      const nodePatterns = [
        /([A-Za-z0-9_]+)\[([^\]]+)\](?:::\w+)?/g,      // A[Text]
        /([A-Za-z0-9_]+)\(\(([^\)]+)\)\)(?:::\w+)?/g, // B((Text))
        /([A-Za-z0-9_]+)\{([^\}]+)\}(?:::\w+)?/g,     // C{Text}
        /([A-Za-z0-9_]+)>([^\]]+)\](?:::\w+)?/g,      // D>Text]
        /([A-Za-z0-9_]+)\[([^\]]+)\]$/g,               // Simple format
      ];
      
      for (const pattern of nodePatterns) {
        const matches = line.matchAll(pattern);
        for (const match of matches) {
          const [, id, label] = match;
          if (!nodeMap.has(id)) {
            const node = {
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
    
    // Second pass: collect all edges
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Parse various edge formats:
      // A --> B
      // A -- text --> B
      // A -.-> B
      // A ==> B
      // A -- B
      const edgePatterns = [
        /^\s*([A-Za-z0-9_]+)\s*-->\s*([A-Za-z0-9_]+)/,      // A --> B
        /^\s*([A-Za-z0-9_]+)\s*-\.->\s*([A-Za-z0-9_]+)/,   // A -.-> B
        /^\s*([A-Za-z0-9_]+)\s*==>\s*([A-Za-z0-9_]+)/,     // A ==> B
        /^\s*([A-Za-z0-9_]+)\s*--\s*([A-Za-z0-9_]+)/,      // A -- B
      ];
      
      for (const pattern of edgePatterns) {
        const edgeMatch = line.match(pattern); // Use original line, not trimmed
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
}

function getNodeFromLabel(label) {
  const lower = label.toLowerCase();
  if (lower.includes('auth') || lower.includes('login')) return 'service';
  if (lower.includes('database') || lower.includes('db') || lower.includes('storage')) return 'database';
  if (lower.includes('api') || lower.includes('service')) return 'service';
  if (lower.includes('config') || lower.includes('setting')) return 'config';
  if (lower.includes('external') || lower.includes('third')) return 'external';
  if (lower.includes('module')) return 'module';
  return 'component';
}

function layoutNodes(nodes, edges) {
  if (nodes.length === 0) return;

  // Simple hierarchical layout
  const levels = new Map();
  const nodesInLevel = new Map();
  
  // Find root nodes (nodes with no incoming edges)
  const hasIncomingEdge = new Set();
  edges.forEach(edge => {
    hasIncomingEdge.add(edge.to);
  });
  
  const rootNodes = nodes.filter(node => !hasIncomingEdge.has(node.id));
  
  // If no clear root nodes, use the first node as root
  if (rootNodes.length === 0 && nodes.length > 0) {
    rootNodes.push(nodes[0]);
  }
  
  // Assign levels using BFS
  const queue = rootNodes.map(node => ({ node, level: 0 }));
  const visited = new Set();
  
  while (queue.length > 0) {
    const { node, level } = queue.shift();
    
    if (visited.has(node.id)) continue;
    visited.add(node.id);
    
    levels.set(node.id, level);
    if (!nodesInLevel.has(level)) {
      nodesInLevel.set(level, []);
    }
    nodesInLevel.get(level).push(node);
    
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
  
  nodesInLevel.forEach((nodesInThisLevel, level) => {
    const totalWidth = nodesInThisLevel.length * nodeWidth + (nodesInThisLevel.length - 1) * nodeSpacing;
    const startX = (800 - totalWidth) / 2; // Center horizontally
    
    nodesInThisLevel.forEach((node, index) => {
      node.x = startX + index * (nodeWidth + nodeSpacing) + nodeWidth / 2;
      node.y = 100 + level * levelHeight;
    });
  });
  
  // Position any remaining nodes that weren't reached in BFS
  nodes.forEach(node => {
    if (!levels.has(node.id)) {
      node.x = Math.random() * 600 + 100;
      node.y = Math.random() * 400 + 100;
    }
  });
}

// Test with sample Mermaid code
const testMermaidCode = `
flowchart TD
    A[Client] --> B[Load Balancer]
    B --> C[Server01]
    B --> D[Server02]
    C --> E[Database]
    D --> E[Database]
    A --> F[CDN]
    F --> G[Cache]
`;

console.log('Testing with sample Mermaid code:');
console.log('Input:', testMermaidCode);
const result = parseMermaidChart(testMermaidCode);
console.log('Result:', result);
