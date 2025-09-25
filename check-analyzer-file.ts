import { getRepositoryStructure } from './src/lib/github';

async function checkAnalyzerFile() {
  console.log('Checking if analyzer.py file exists...');
  
  try {
    const structure = await getRepositoryStructure('AbanteAI', 'repo-visualizer', '', 4);
    
    // Look for src/repo_visualizer directory specifically
    const srcDir = structure.find(item => item.name === 'src');
    if (srcDir && srcDir.children) {
      const repoVisualizerDir = srcDir.children.find(child => child.name === 'repo_visualizer');
      if (repoVisualizerDir && repoVisualizerDir.children) {
        console.log('Files in src/repo_visualizer/:');
        repoVisualizerDir.children.forEach(child => {
          console.log(`- ${child.name} (${child.type})`);
        });
        
        const analyzerFile = repoVisualizerDir.children.find(child => child.name === 'analyzer.py');
        if (analyzerFile) {
          console.log('\n✅ analyzer.py file exists!');
          console.log(`Path: ${analyzerFile.path}`);
          console.log(`Relevant: ${analyzerFile.relevant}`);
        } else {
          console.log('\n❌ analyzer.py file does not exist!');
        }
      }
    }
    
  } catch (error) {
    console.error('Check failed:', error);
  }
}

checkAnalyzerFile();
