import { ArchitectureAnalyzer } from './src/lib/architecture-analyzer';
import { getRepositoryStructure } from './src/lib/github';

async function testRepositoryAnalyzerFix() {
  console.log('Testing repository analyzer fix...');
  
  try {
    // Test with a simple repository that should have multiple relevant files
    const analyzer = new ArchitectureAnalyzer();
    
    // First test the repository structure fetching
    console.log('\n=== Testing Repository Structure Fetching ===');
    const structure = await getRepositoryStructure('AbanteAI', 'repo-visualizer', '', 4);
    
    console.log(`Found ${structure.length} top-level items:`);
    structure.forEach(item => {
      console.log(`- ${item.name} (${item.type})`);
      if (item.type === 'dir') {
        if (item.children && item.children.length > 0) {
          console.log(`  Children: ${item.children.length}`);
          item.children.slice(0, 5).forEach(child => {
            console.log(`    - ${child.name} (${child.type})${child.relevant !== undefined ? ` relevant: ${child.relevant}` : ''}`);
          });
          if (item.children.length > 5) {
            console.log(`    ... and ${item.children.length - 5} more`);
          }
        } else {
          console.log(`  No children found or children array is empty`);
        }
      }
    });
    
    // Now test the architecture analysis
    console.log('\n=== Testing Architecture Analysis ===');
    const analysis = await analyzer.analyzeRepository('AbanteAI', 'repo-visualizer', 4);
    
    console.log(`\nAnalysis Results:`);
    console.log(`- Total nodes: ${analysis.nodes.length}`);
    console.log(`- Total edges: ${analysis.edges.length}`);
    console.log(`- Total files processed: ${analysis.metrics.totalFiles}`);
    console.log(`- Total lines of code: ${analysis.metrics.totalLines}`);
    
    if (analysis.nodes.length > 0) {
      console.log(`\nFirst few nodes:`);
      analysis.nodes.slice(0, 5).forEach(node => {
        console.log(`- ${node.name} (${node.type}) - ${node.language} - ${node.linesOfCode} LOC`);
        console.log(`  Imports: [${node.imports.join(', ')}]`);
        console.log(`  Dependencies: [${node.dependencies.join(', ')}]`);
      });
      if (analysis.nodes.length > 5) {
        console.log(`... and ${analysis.nodes.length - 5} more nodes`);
      }
    }

    console.log('\nAll edges:');
    if (analysis.edges.length === 0) {
      console.log('No edges found!');
    } else {
      analysis.edges.forEach(edge => {
        console.log(`- ${edge.from} -> ${edge.to} (${edge.type})`);
      });
    }
    
    // Check if we found more than just setup.py
    if (analysis.nodes.length > 1) {
      console.log('\n✅ SUCCESS: Repository analyzer is now finding multiple files!');
      console.log(`Previously only found 1 node, now found ${analysis.nodes.length} nodes.`);
    } else {
      console.log('\n❌ ISSUE: Repository analyzer still only finding 1 node.');
      console.log('The fix may not be working correctly.');
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testRepositoryAnalyzerFix();
