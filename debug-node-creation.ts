import { ArchitectureAnalyzer } from './src/lib/architecture-analyzer';

async function debugNodeCreation() {
  console.log('Debugging node creation...');
  
  try {
    const analyzer = new ArchitectureAnalyzer();
    
    // Let's just run the analysis and then inspect the nodes
    const result = await analyzer.analyzeRepository('AbanteAI', 'repo-visualizer');
    
    console.log(`\n=== All created nodes ===`);
    const nodes = analyzer['nodes'];
    nodes.forEach((node, nodeId) => {
      console.log(`- ${nodeId}: ${node.filePath} (${node.language})`);
    });
    
    console.log(`\n=== Looking for src/repo_visualizer files ===`);
    const repoVisualizerFiles = Array.from(nodes.values()).filter(node => 
      node.filePath.includes('repo_visualizer')
    );
    
    if (repoVisualizerFiles.length > 0) {
      console.log(`Found ${repoVisualizerFiles.length} repo_visualizer files:`);
      repoVisualizerFiles.forEach(node => {
        console.log(`- ${node.filePath} (${node.language})`);
      });
    } else {
      console.log('No repo_visualizer files found in nodes!');
    }
    
    console.log(`\n=== Looking for any src/ files ===`);
    const srcFiles = Array.from(nodes.values()).filter(node => 
      node.filePath.startsWith('src/')
    );
    
    if (srcFiles.length > 0) {
      console.log(`Found ${srcFiles.length} src/ files:`);
      srcFiles.forEach(node => {
        console.log(`- ${node.filePath} (${node.language})`);
      });
    } else {
      console.log('No src/ files found in nodes!');
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugNodeCreation();
