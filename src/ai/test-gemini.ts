import dotenv from 'dotenv';
import path from 'path';
import { createLangChainModel } from './langchain-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });

console.log('Environment variables loaded from:', envPath);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('Testing Gemini AI configuration...');
    
    // Create the model
    const model = createLangChainModel();
    const parser = new StringOutputParser();
    
    // Simple test prompt
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are a helpful AI assistant.'],
      ['user', 'Hello! Please respond with "AI is working" if you can read this.']
    ]);
    
    console.log('Sending test request to Gemini...');
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({});
    
    console.log('Gemini response:', response);
    console.log('✅ Gemini AI is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ Error testing Gemini AI:', error);
    return false;
  }
}

// Run the test
testGemini().then(success => {
  process.exit(success ? 0 : 1);
});
