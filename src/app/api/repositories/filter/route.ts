import { NextRequest, NextResponse } from 'next/server';
import { getPopularRepos } from '@/lib/github';
import { filterRepositories } from '@/lib/recommendation-engine';
import { redisCache, CacheKeys, CacheTTL } from '@/lib/redis-cache-client';
import type { RepositoryFilters } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const filters: RepositoryFilters = await request.json();
    
    // Create cache key based on filters
    const filterCacheKey = `${CacheKeys.repositories.filter}:${JSON.stringify(filters)}`;
    
    // Check cache first for better performance with 1k+ users
    try {
      const cachedResults = await redisCache.get(filterCacheKey);
      if (cachedResults) {
        console.log('🚀 [FILTER API] Returning cached results');
        return NextResponse.json(cachedResults);
      }
    } catch (cacheError) {
      console.warn('Cache miss, proceeding with normal filtering:', cacheError);
    }
    
    console.log('🔍 [FILTER API] Received filters:', filters);
    
    // Get repositories (this will handle caching and rate limits gracefully)
    console.log('📦 [FILTER API] Fetching repositories...');
    const repositories = await getPopularRepos(true);
    console.log(`📊 [FILTER API] Fetched ${repositories.length} repositories`);
    
    // Log sample repositories for debugging
    if (repositories.length > 0) {
      console.log('📋 [FILTER API] Sample repositories:');
      repositories.slice(0, 3).forEach((repo, i) => {
        console.log(`  ${i + 1}. ${repo.name} (${repo.language}) - ${repo.topics.slice(0, 5).join(', ')}`);
      });
    }
    
    // Apply filters with improved logic
    console.log('🎯 [FILTER API] Applying filters...');
    const filteredRepositories = filterRepositories(repositories, filters);
    
    const result = {
      success: true,
      repositories: filteredRepositories,
      total: filteredRepositories.length,
      originalTotal: repositories.length
    };
    
    // Cache the results for 5 minutes to improve performance with 1k+ users
    try {
      await redisCache.set(filterCacheKey, result, CacheTTL.filterResults);
      console.log('💾 [FILTER API] Results cached for 5 minutes');
    } catch (cacheError) {
      console.warn('Failed to cache results:', cacheError);
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error filtering repositories:', error);
    
    // Return graceful fallback - try to get some repositories without filters
    try {
      const fallbackRepos = await getPopularRepos(true);
      return NextResponse.json({
        success: true,
        repositories: fallbackRepos.slice(0, 20), // Limit fallback results
        total: fallbackRepos.length,
        originalTotal: fallbackRepos.length,
        isFallback: true,
        error: 'Filtering failed, showing unfiltered results'
      });
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch repositories',
        repositories: [],
        total: 0,
        originalTotal: 0
      }, { status: 500 });
    }
  }
}
