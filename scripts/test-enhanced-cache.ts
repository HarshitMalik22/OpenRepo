import { cacheManager } from '../src/lib/cache-manager';

async function testEnhancedCache() {
  console.log('🧪 Testing Enhanced Cache Manager...\n');

  // Test 1: Basic set/get
  console.log('1. Testing basic set/get operations...');
  await cacheManager.set('test-key', { message: 'Hello World!' }, 60000);
  const result = await cacheManager.get('test-key');
  console.log('✅ Basic test result:', result);

  // Test 2: GitHub-specific methods
  console.log('\n2. Testing GitHub-specific methods...');
  const testRepo = {
    fullName: 'test/repo',
    name: 'repo',
    description: 'Test repository',
    stargazersCount: 100,
  };
  
  await cacheManager.setRepositoryBasic('test/repo', testRepo);
  const repoResult = await cacheManager.getRepositoryBasic('test/repo');
  console.log('✅ GitHub-specific test result:', repoResult);

  // Test 3: Cache statistics
  console.log('\n3. Testing cache statistics...');
  const stats = cacheManager.getStats();
  console.log('✅ Cache stats:', stats);

  // Test 4: Performance metrics
  console.log('\n4. Testing performance metrics...');
  const metrics = cacheManager.getPerformanceMetrics();
  console.log('✅ Performance metrics:', metrics);

  // Test 5: Cache invalidation
  console.log('\n5. Testing cache invalidation...');
  await cacheManager.invalidateRepositoryCache('test/repo');
  const afterInvalidation = await cacheManager.getRepositoryBasic('test/repo');
  console.log('✅ After invalidation:', afterInvalidation);

  console.log('\n🎉 All tests completed!');
}

testEnhancedCache().catch(console.error);
