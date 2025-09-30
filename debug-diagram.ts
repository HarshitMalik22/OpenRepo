import { gitdiagramStyleAnalysis } from './src/ai/flows/gitdiagram-style-analysis';
import { getGitHubHeaders } from './src/lib/github-headers';

async function debugDiagram() {
  try {
    // Check GitHub headers
    const headers = getGitHubHeaders();
    console.log('GitHub headers:', headers);
    
    const result = await gitdiagramStyleAnalysis({
      repoUrl: 'https://github.com/octocat/Hello-World',
      techStack: ['JavaScript'],
      goal: 'Analyze architecture'
    });

    console.log('=== FULL DIAGRAM OUTPUT ===');
    console.log(result.mermaidChart);
    console.log('=== END DIAGRAM ===');
    console.log('Analysis type:', result.summary);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugDiagram();
