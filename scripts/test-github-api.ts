import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function testGitHubAPI() {
  console.log('--- Testing GitHub API ---');
  
  if (!GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN is not set in environment variables.');
  } else {
    console.log('✅ GITHUB_TOKEN is present.');
    // Mask token for security
    console.log(`🔑 Token: ${GITHUB_TOKEN.substring(0, 4)}...${GITHUB_TOKEN.substring(GITHUB_TOKEN.length - 4)}`);
  }

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OpenSauce-Test-Script'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    // 1. Check Rate Limit
    console.log('\n1️⃣  Checking Rate Limit...');
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', { headers });
    
    if (!rateLimitResponse.ok) {
        console.error(`❌ Rate limit check failed: ${rateLimitResponse.status} ${rateLimitResponse.statusText}`);
        const text = await rateLimitResponse.text();
        console.error(`Response: ${text}`);
    } else {
        const rateLimitData = await rateLimitResponse.json();
        console.log('✅ Rate limit check successful.');
        console.log('   Core Limit:', rateLimitData.resources.core.limit);
        console.log('   Core Remaining:', rateLimitData.resources.core.remaining);
        console.log('   Reset Time:', new Date(rateLimitData.resources.core.reset * 1000).toLocaleString());
        
        if (rateLimitData.resources.search) {
             console.log('   Search Limit:', rateLimitData.resources.search.limit);
             console.log('   Search Remaining:', rateLimitData.resources.search.remaining);
             console.log('   Search Reset Time:', new Date(rateLimitData.resources.search.reset * 1000).toLocaleString());
        }
    }

    // 2. Test Search Query (simulating getPopularRepos)
    console.log('\n2️⃣  Testing Search Query (getPopularRepos simulation)...');
    const query = 'stars:>1000 sort:stars-desc';
    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=1`;
    
    console.log(`   URL: ${searchUrl}`);
    const searchResponse = await fetch(searchUrl, { headers });

    if (!searchResponse.ok) {
        console.error(`❌ Search request failed: ${searchResponse.status} ${searchResponse.statusText}`);
        const text = await searchResponse.text();
        console.error(`Response: ${text}`);
        
        if (searchResponse.status === 403) {
            console.error('   This indicates a rate limit or permission issue.');
        } else if (searchResponse.status === 401) {
            console.error('   This indicates an invalid token.');
        }
    } else {
        const searchData = await searchResponse.json();
        console.log('✅ Search request successful.');
        console.log(`   Total Count: ${searchData.total_count}`);
        if (searchData.items && searchData.items.length > 0) {
            console.log(`   First Repo: ${searchData.items[0].full_name}`);
        } else {
            console.warn('   ⚠️  No items returned.');
        }
    }

  } catch (error) {
    console.error('❌ An error occurred during the test:', error);
  }
}

testGitHubAPI();
