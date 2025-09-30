import { gitdiagramStyleAnalysis } from './src/ai/flows/gitdiagram-style-analysis';

async function testAIDiagramWithKey() {
  console.log('Testing AI diagram generation with API key...');
  
  try {
    // Test with a simple repository
    const testRepo = {
      repoUrl: 'https://github.com/facebook/react',
      techStack: ['JavaScript'],
      goal: 'Analyze repository architecture and generate interactive flowchart'
    };
    
    console.log('Testing with repository:', testRepo.repoUrl);
    
    const result = await gitdiagramStyleAnalysis(testRepo);
    
    console.log('=== AI Analysis Result ===');
    console.log('Mermaid Chart:', result.mermaidChart ? 'Generated' : 'Not generated');
    console.log('Chart length:', result.mermaidChart?.length || 0);
    console.log('Explanation:', result.explanation ? 'Generated' : 'Not generated');
    console.log('Explanation length:', result.explanation?.length || 0);
    console.log('Component Mapping:', result.componentMapping ? 'Generated' : 'Not generated');
    console.log('Summary:', result.summary);
    
    if (result.mermaidChart) {
      console.log('\n=== Sample Mermaid Chart ===');
      console.log(result.mermaidChart.substring(0, 500) + '...');
      
      // Check if it's AI-generated or fallback
      const isFallback = result.summary.includes('AI not available') || 
                        result.summary.includes('Basic analysis completed');
      
      console.log('\n=== Analysis Type ===');
      console.log('Analysis type:', isFallback ? 'Fallback' : 'AI-powered');
      
      if (!isFallback) {
        console.log('✅ AI-powered diagram generation successful!');
      } else {
        console.log('⚠️  Fallback analysis used (AI may not be working)');
      }
    }
    
  } catch (error) {
    console.error('Error testing AI diagram generation:', error);
  }
}

testAIDiagramWithKey();
