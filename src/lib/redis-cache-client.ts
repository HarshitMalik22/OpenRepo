// Client-safe Redis cache wrapper
// This file provides safe access to Redis functionality for client components

export const CacheKeys = {
  repositories: {
    popular: 'repos:popular',
    byLanguage: (lang: string) => `repos:language:${lang}`,
    byTopic: (topic: string) => `repos:topic:${topic}`,
    filter: 'repos:filter',
    goodFirstIssues: (params: string) => `repos:good-first-issues:${params}`,
    repoIssueCount: (fullName: string) => `repos:${fullName}:issues:good-first`,
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
const ONE_DAY = 24 * 60 * 60;  // 1 day in seconds
export const CacheTTL = {
  // Repository data (30 days max)
  popularRepos: 30 * ONE_DAY,     // 30 days
  reposByLanguage: 7 * ONE_DAY,   // 1 week
  reposByTopic: 7 * ONE_DAY,      // 1 week
  goodFirstIssues: 3600,          // 1 hour
  
  // Recommendations (7 days max)
  userRecommendations: 7 * ONE_DAY,   // 1 week
  enhancedRecommendations: 3 * ONE_DAY, // 3 days
  mlRecommendations: 7 * ONE_DAY,     // 1 week
  
  // Community data (1 day max)
  communityStats: ONE_DAY,       // 1 day
  liveStats: 3600,               // 1 hour
  
  // GitHub API (1 day max)
  rateLimit: 3600,               // 1 hour
  apiCache: 12 * 3600,           // 12 hours
  
  // Filter results (1 day max)
  filterResults: ONE_DAY         // 1 day
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
