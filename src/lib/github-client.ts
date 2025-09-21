import type { Repository } from './types';

// Client-side version of getPopularRepos that uses API endpoint
export async function getPopularReposClient(): Promise<Repository[]> {
  try {
    const response = await fetch('/api/repositories/popular', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache to get fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch repositories');
    }

    return data.repositories || [];
  } catch (error) {
    console.error('Error fetching popular repositories from client:', error);
    // Return empty array as fallback
    return [];
  }
}

// Client-side version of getRecommendedRepos
export async function getRecommendedReposClient(preferences: any): Promise<Repository[]> {
  try {
    const response = await fetch('/api/repositories/recommended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch recommended repositories');
    }

    return data.repositories || [];
  } catch (error) {
    console.error('Error fetching recommended repositories from client:', error);
    return [];
  }
}

// Client-side version of getEnhancedRecommendedRepos
export async function getEnhancedRecommendedReposClient(preferences: any, userId?: string): Promise<Repository[]> {
  try {
    const response = await fetch('/api/repositories/enhanced-recommended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences, userId }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch enhanced recommended repositories');
    }

    return data.repositories || [];
  } catch (error) {
    console.error('Error fetching enhanced recommended repositories from client:', error);
    return [];
  }
}

// Client-side version of getCommunityStats
export async function getCommunityStatsClient() {
  try {
    const response = await fetch('/api/community/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch community stats');
    }

    return data.stats || {};
  } catch (error) {
    console.error('Error fetching community stats from client:', error);
    return {};
  }
}
