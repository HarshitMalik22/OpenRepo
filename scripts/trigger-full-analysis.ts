
const { gitdiagramStyleAnalysis } = require('../src/ai/flows/gitdiagram-style-analysis.ts');

// Mock environment variables since we are running outside Next.js
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function runAnalysis() {
  console.log('🤖 Triggering Manual AI Analysis...');
  
  // Use the user's own repo which we know exists
  const repoUrl = 'https://github.com/HarshitMalik22/OpenRepo'; 
  const techStack = ['TypeScript', 'Next.js'];
  const goal = 'Verify AI analysis generation';

  try {
    const result = await gitdiagramStyleAnalysis({
      repoUrl,
      techStack,
      goal
    });
    
    console.log('\n✅ Analysis Result Summary:');
    console.log(result.summary);
    
    if (result.mermaidChart && !result.summary.includes('Basic analysis completed')) {
        console.log('🎉 SUCCESS: Full AI Analysis Generated!');
        console.log('Preview Chart:', result.mermaidChart.substring(0, 100));
    } else {
        console.log('⚠️ FALLBACK USED: The analysis ran but fell back to basic mode.');
        if (result.summary.includes('Quota')) {
             console.log('REASON: Quota Exceeded confirmed.');
        }
    }
    
  } catch (error) {
    console.error('❌ FATAL ERROR:', error);
  }
}

runAnalysis();
