import type { Repository } from './types';

// Helper function to create hash from preferences for caching
export async function createPreferencesHash(preferences: any): Promise<string> {
  const crypto = await import('crypto');
  const dataString = JSON.stringify({
    techStack: preferences.techStack?.sort() || [],
    experienceLevel: preferences.experienceLevel || '',
    goal: preferences.goal || ''
  });
  return crypto.createHash('md5').update(dataString).digest('hex').substring(0, 8);
}

// Client-side version of getPopularRepos that uses API endpoint
export async function getPopularReposClient(): Promise<Repository[]> {
  try {
    const response = await fetch('/api/repositories/popular', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache for 1 hour
      next: { revalidate: 3600 } // Next.js ISR - revalidate every hour
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
    // Create cache key based on preferences
    const preferencesHash = await createPreferencesHash(preferences);
    const response = await fetch('/api/repositories/recommended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Preferences-Hash': preferencesHash,
      },
      body: JSON.stringify({ preferences }),
      cache: 'force-cache', // Cache for 30 minutes
      next: { revalidate: 1800 } // Revalidate every 30 minutes
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
    // Create cache key based on preferences and user
    const preferencesHash = await createPreferencesHash(preferences);
    const userHash = userId ? `_${userId.slice(-8)}` : '';
    const response = await fetch('/api/repositories/enhanced-recommended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Preferences-Hash': `${preferencesHash}${userHash}`,
      },
      body: JSON.stringify({ preferences, userId }),
      cache: 'force-cache', // Cache for 15 minutes
      next: { revalidate: 900 } // Revalidate every 15 minutes
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
      cache: 'force-cache', // Cache for 5 minutes
      next: { revalidate: 300 } // Revalidate every 5 minutes
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

// Client-side version of getFilteredRepos
export async function getFilteredReposClient(filters: any): Promise<Repository[]> {
  try {
    const response = await fetch('/api/repositories/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filters }),
      cache: 'no-store', // Don't cache filtered results
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch filtered repositories');
    }

    return data.repositories || [];
  } catch (error) {
    console.error('Error fetching filtered repositories from client:', error);
    return [];
  }
}

// Client-side version of getTestimonials
export async function getTestimonialsClient(): Promise<any[]> {
  try {
    const response = await fetch('/api/testimonials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache for 1 hour
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch testimonials');
    }

    return data.testimonials || [];
  } catch (error) {
    console.error('Error fetching testimonials from client:', error);
    return [];
  }
}
