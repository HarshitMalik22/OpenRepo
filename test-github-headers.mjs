// Test script to verify GitHub headers functionality
import { getGitHubHeaders, getGitHubHeadersForContext, isServerSide } from './src/lib/github-headers.js';

console.log('Testing GitHub headers functionality...');

// Test server-side headers
console.log('\n1. Testing server-side headers:');
try {
  const serverHeaders = getGitHubHeaders();
  console.log('Server headers:', JSON.stringify(serverHeaders, null, 2));
  console.log('✅ Server headers generated successfully');
} catch (error) {
  console.log('❌ Server headers failed:', error.message);
}

// Test context-aware headers
console.log('\n2. Testing context-aware headers:');
try {
  const contextHeaders = getGitHubHeadersForContext();
  console.log('Context headers:', JSON.stringify(contextHeaders, null, 2));
  console.log('✅ Context headers generated successfully');
} catch (error) {
  console.log('❌ Context headers failed:', error.message);
}

// Test server-side detection
console.log('\n3. Testing server-side detection:');
try {
  const isServer = isServerSide();
  console.log('Is server side:', isServer);
  console.log('✅ Server-side detection works');
} catch (error) {
  console.log('❌ Server-side detection failed:', error.message);
}

console.log('\nTest completed.');
