import { getRepositoryStructure } from './src/lib/github';

async function debugRepoStructure() {
  console.log('Debugging repository structure...');
  
  try {
    // Test with deeper depth to see if we can find the missing files
    const structure = await getRepositoryStructure('AbanteAI', 'repo-visualizer', '', 4);
    
    console.log(`Found ${structure.length} top-level items:`);
    
    // Look for src directory specifically
    const srcDir = structure.find(item => item.name === 'src');
    if (srcDir && srcDir.children) {
      console.log(`\nsrc directory has ${srcDir.children.length} children:`);
      srcDir.children.forEach(child => {
        console.log(`- ${child.name} (${child.type})`);
        if (child.type === 'dir' && child.children) {
          console.log(`  Children: ${child.children.length}`);
          child.children.forEach(grandchild => {
            console.log(`  - ${grandchild.name} (${grandchild.type})${grandchild.relevant !== undefined ? ` relevant: ${grandchild.relevant}` : ''}`);
          });
        }
      });
      
      // Look for repo_visualizer directory specifically
      const repoVisualizerDir = srcDir.children.find(child => child.name === 'repo_visualizer');
      if (repoVisualizerDir) {
        console.log(`\nrepo_visualizer directory:`);
        console.log(`- Name: ${repoVisualizerDir.name}`);
        console.log(`- Type: ${repoVisualizerDir.type}`);
        console.log(`- Path: ${repoVisualizerDir.path}`);
        if (repoVisualizerDir.children) {
          console.log(`- Children: ${repoVisualizerDir.children.length}`);
          repoVisualizerDir.children.forEach(child => {
            console.log(`  - ${child.name} (${child.type})${child.relevant !== undefined ? ` relevant: ${child.relevant}` : ''}`);
          });
        } else {
          console.log(`- Children: null or empty`);
        }
      } else {
        console.log(`\nrepo_visualizer directory not found in src!`);
      }
    } else {
      console.log(`\nsrc directory not found or has no children!`);
    }
    
    // Print all files with .py extension to see what Python files we're finding
    console.log(`\nAll Python files found:`);
    const findPythonFiles = (items: any[], path = '') => {
      items.forEach(item => {
        if (item.type === 'file' && item.name.endsWith('.py')) {
          console.log(`- ${item.path} (relevant: ${item.relevant})`);
        } else if (item.type === 'dir' && item.children) {
          findPythonFiles(item.children, item.path);
        }
      });
    };
    findPythonFiles(structure);
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugRepoStructure();
