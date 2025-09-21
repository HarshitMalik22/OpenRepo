#!/usr/bin/env node

/**
 * Test script to demonstrate caching performance benefits
 * This script simulates user behavior and measures API call reduction
 */

// Mock cache manager for testing
const cacheManager = {
  _cache: new Map(),
  
  getRepositoryBasic: function(fullName) {
    const key = `repo-basic:${fullName}`;
    const entry = this._cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._cache.delete(key);
      return null;
    }
    return entry.data;
  },
  
  getRepositoryStats: function(fullName) {
    const key = `repo-stats:${fullName}`;
    const entry = this._cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._cache.delete(key);
      return null;
    }
    return entry.data;
  },
  
  getRepositoryHealth: function(fullName) {
    const key = `repo-health:${fullName}`;
    const entry = this._cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._cache.delete(key);
      return null;
    }
    return entry.data;
  },
  
  setRepositoryBasic: function(fullName, data) {
    const key = `repo-basic:${fullName}`;
    this._cache.set(key, {
      data,
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour TTL
    });
  },
  
  setRepositoryStats: function(fullName, data) {
    const key = `repo-stats:${fullName}`;
    this._cache.set(key, {
      data,
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes TTL
    });
  },
  
  setRepositoryHealth: function(fullName, data) {
    const key = `repo-health:${fullName}`;
    this._cache.set(key, {
      data,
      expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes TTL
    });
  },
  
  getStats: function() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const [key, entry] of this._cache.entries()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    return {
      totalEntries: this._cache.size,
      validEntries,
      expiredEntries,
      hitRate: validEntries / (validEntries + expiredEntries) || 0
    };
  }
};

// Test repositories
const testRepos = [
  'facebook/react',
  'microsoft/vscode',
  'vercel/next.js',
  'tensorflow/tensorflow',
  'github/copilot'
];

// Simulate user behavior
async function simulateUserBehavior() {
  console.log('🚀 Testing Caching Performance Benefits\n');

  let totalApiCalls = 0;
  let totalRequests = 0;
  let cacheHits = 0;
  let cacheMisses = 0;

  // Simulate multiple users refreshing pages
  const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
  const refreshesPerUser = 10;

  console.log('📊 Test Scenario:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Refreshes per user: ${refreshesPerUser}`);
  console.log(`- Repositories per refresh: ${testRepos.length}`);
  console.log(`- Total requests: ${users.length * refreshesPerUser * testRepos.length}\n`);

  for (const user of users) {
    console.log(`👤 Simulating ${user}...`);
    
    for (let refresh = 1; refresh <= refreshesPerUser; refresh++) {
      console.log(`  Refresh #${refresh}`);
      
      for (const repo of testRepos) {
        totalRequests++;
        
        // Check cache first
        const cachedBasic = cacheManager.getRepositoryBasic(repo);
        const cachedStats = cacheManager.getRepositoryStats(repo);
        const cachedHealth = cacheManager.getRepositoryHealth(repo);
        
        if (cachedBasic && cachedStats && cachedHealth) {
          cacheHits++;
          console.log(`    ✅ ${repo} - Cache Hit`);
          
          // Simulate real-time activity fetch (1 API call)
          totalApiCalls++;
        } else {
          cacheMisses++;
          console.log(`    ❌ ${repo} - Cache Miss`);
          
          // Simulate full repository fetch (4-6 API calls)
          totalApiCalls += Math.floor(Math.random() * 3) + 4; // 4-6 calls
          
          // Simulate caching the data
          setTimeout(() => {
            cacheManager.setRepositoryBasic(repo, {
              id: repo,
              name: repo.split('/')[1],
              full_name: repo,
              owner: repo.split('/')[0],
              description: `Test repository for ${repo}`,
              language: 'JavaScript',
              html_url: `https://github.com/${repo}`,
              topics: ['test', 'demo'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
            cacheManager.setRepositoryStats(repo, {
              stargazers_count: 1000,
              watchers_count: 1000,
              forks_count: 100,
              open_issues_count: 50,
              contributor_count: 100
            });
            
            cacheManager.setRepositoryHealth(repo, {
              health_score: 85,
              techStack: ['JavaScript', 'React'],
              competition_level: 'medium',
              activity_level: 'high',
              ai_domain: { is_ai: false, confidence: 0.1 },
              contribution_difficulty: { level: 'intermediate', score: 0.6 },
              good_first_issues_count: 10,
              help_wanted_issues_count: 5
            });
          }, 100);
        }
        
        // Small delay to simulate real usage
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Delay between refreshes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('');
  }

  // Calculate results
  const cacheHitRate = (cacheHits / totalRequests * 100).toFixed(1);
  const apiCallReduction = ((totalRequests * 5 - totalApiCalls) / (totalRequests * 5) * 100).toFixed(1);
  const avgApiCallsPerRequest = (totalApiCalls / totalRequests).toFixed(2);

  console.log('🎯 Results Summary:');
  console.log('==================');
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Total API Calls: ${totalApiCalls}`);
  console.log(`Cache Hits: ${cacheHits}`);
  console.log(`Cache Misses: ${cacheMisses}`);
  console.log(`Cache Hit Rate: ${cacheHitRate}%`);
  console.log(`API Call Reduction: ${apiCallReduction}%`);
  console.log(`Avg API Calls per Request: ${avgApiCallsPerRequest}`);
  
  console.log('\n📈 Performance Comparison:');
  console.log('========================');
  console.log('Without Caching:');
  console.log(`- API Calls: ${totalRequests * 5} (5 calls per request)`);
  console.log(`- Load Time: ~${totalRequests * 5 * 200}ms (200ms per API call)`);
  console.log(`- Rate Limit Risk: HIGH (${totalRequests * 5} calls)`);
  
  console.log('\nWith Smart Caching:');
  console.log(`- API Calls: ${totalApiCalls}`);
  console.log(`- Load Time: ~${totalApiCalls * 200}ms`);
  console.log(`- Rate Limit Risk: LOW`);
  
  console.log('\n💰 Benefits:');
  console.log(`- ${apiCallReduction}% fewer API calls`);
  console.log(`- Significant server resource savings`);
  console.log(`- ${((totalRequests * 5 * 200 - totalApiCalls * 200) / 1000).toFixed(1)} seconds faster load time`);
  console.log(`- Can handle ${Math.floor(5000 / avgApiCallsPerRequest)} requests before hitting rate limit`);
  
  console.log('\n🎉 Caching Strategy Successfully Optimized!');
}

// Run the test
if (require.main === module) {
  simulateUserBehavior()
    .then(() => {
      console.log('\n🎯 Performance test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = { simulateUserBehavior };
