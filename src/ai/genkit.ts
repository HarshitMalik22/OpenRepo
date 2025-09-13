import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';

// Load environment variables with multiple fallbacks
config();
// Also try to load from .env.local if it exists
config({ path: '.env.local' });

// Debug environment variables
console.log('=== Genkit Configuration Debug ===');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is not set. AI functionality will be limited.');
  console.error('Available env keys:', Object.keys(process.env).filter(key => key.includes('API') || key.includes('GEMINI')));
} else {
  console.log('✅ GEMINI_API_KEY is configured');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY,
  })],
  model: 'googleai/gemini-1.5-flash', // Try with 1.5-flash instead of 2.5-flash
});

// Export a function to check if AI is properly configured
export function isAIConfigured(): boolean {
  const configured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;
  console.log('isAIConfigured() check:', configured, 'Key length:', process.env.GEMINI_API_KEY?.length || 0);
  return configured;
}
