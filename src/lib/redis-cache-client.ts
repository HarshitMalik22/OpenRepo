// Client-safe Redis cache wrapper
// This file provides safe access to Redis functionality for client components

export const CacheKeys = {
  repositories: {
    popular: 'repos:popular',
    byLanguage: (lang: string) => `repos:language:${lang}`,
    byTopic: (topic: string) => `repos:topic:${topic}`,
    filter: 'repos:filter',
  },
  recommendations: {
    userPreferences: (hash: string) => `rec:user:${hash}`,
    enhanced: (hash: string) => `rec:enhanced:${hash}`,
    ml: (userId: string) => `rec:ml:${userId}`,
  },
  community: {
    stats: 'community:stats',
    liveStats: 'community:live:stats',
  },
  github: {
    rateLimit: 'github:rate_limit',
    apiCache: (endpoint: string) => `github:api:${endpoint}`,
  },
};

// TTL configurations (in seconds)
export const CacheTTL = {
  // Repository data
  popularRepos: 3600,        // 1 hour
  reposByLanguage: 1800,     // 30 minutes
  reposByTopic: 1800,        // 30 minutes
  
  // Recommendations
  userRecommendations: 1800, // 30 minutes
  enhancedRecommendations: 900, // 15 minutes
  mlRecommendations: 3600,   // 1 hour
  
  // Community data
  communityStats: 300,       // 5 minutes
  liveStats: 60,             // 1 minute
  
  // GitHub API
  rateLimit: 60,             // 1 minute
  apiCache: 900,             // 15 minutes
  
  // Filter results
  filterResults: 300,        // 5 minutes
};

// Client-safe cache interface (no actual Redis operations)
export class ClientRedisCache {
  // Get cached data - always returns null on client side
  async get<T>(key: string): Promise<T | null> {
    // Client side - no cache access
    return null;
  }

  // Set cached data - no-op on client side
  async set<T>(key: string, data: T, ttl: number = CacheTTL.popularRepos): Promise<void> {
    // Client side - no-op
    return;
  }

  // Delete cached data - no-op on client side
  async del(key: string): Promise<number> {
    // Client side - no-op
    return 0;
  }

  // Check if key exists - always returns 0 on client side
  async exists(key: string): Promise<number> {
    // Client side - no-op
    return 0;
  }

  // Get cache statistics
  async getStats(): Promise<{
    connected: boolean;
    keyCount: number;
    memoryUsage?: string;
  }> {
    // Client side - return disconnected stats
    return {
      connected: false,
      keyCount: 0
    };
  }
}

// Export client-safe instance
export const redisCache = new ClientRedisCache();
