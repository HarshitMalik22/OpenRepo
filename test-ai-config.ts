import { getLangChainConfig, isAIConfigured } from './src/ai/langchain-config';

console.log('=== Testing AI Configuration ===');

const config = getLangChainConfig();
console.log('Config:', {
  apiKeyLength: config.apiKey?.length || 0,
  modelName: config.modelName,
  temperature: config.temperature,
  maxOutputTokens: config.maxOutputTokens
});

const isConfigured = isAIConfigured();
console.log('isAIConfigured():', isConfigured);

if (isConfigured) {
  console.log('✅ AI is properly configured');
} else {
  console.log('❌ AI is not configured - will use fallback');
}
