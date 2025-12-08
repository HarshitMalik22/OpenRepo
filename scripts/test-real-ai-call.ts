
const { createLangChainModel } = require('../src/ai/langchain-config.ts');
const { StringOutputParser } = require("@langchain/core/output_parsers");

// Mock environment variables since we are running outside Next.js
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function testRealCall() {
  console.log('Testing real AI call with LangChain...');
  
  if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is missing in env');
      process.exit(1);
  }
  console.log('Key available (length):', process.env.GEMINI_API_KEY.length);

  try {
    const model = createLangChainModel();
    const parser = new StringOutputParser();
    const chain = model.pipe(parser);
    
    console.log('Invoking model with "Say hello"...');
    const response = await chain.invoke("Say hello in one word.");
    console.log('✅ Response received:', response);
  } catch (error) {
    console.error('❌ AI Call Failed:', error);
  }
}

testRealCall();
