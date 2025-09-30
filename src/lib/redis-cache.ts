import Redis from 'ioredis';

// Ensure this module is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('Redis cache can only be used on the server side');
}

let redisClient: Redis | null = null;

// Initialize Redis connection
function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;
  
    if (!redisUrl || !redisToken) {
      console.warn('⚠️  UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN not found in environment variables');
      return {
        get: async () => null,
        set: async () => true,
        del: async () => true,
        exists: async () => 0,
        expire: async () => true,
        keys: async () => [],
        flushall: async () => 'OK',
        quit: async () => 'OK'
      } as unknown as Redis;
    }

    // Format the Redis URL for Upstash - use the original URL format with auth in options
    console.log('🔗 Connecting to Redis with URL:', redisUrl);
  
    const redisOptions = {
      host: redisUrl!.replace('https://', '').split(':')[0],
      port: 6379, // Upstash Redis typically uses port 6379
      username: 'default',
      password: redisToken,
      tls: {}, // Enable TLS for secure connection
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 15000,
      commandTimeout: 5000,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 1000, 10000);
        console.log(`🔄 Redis retry attempt ${times}, delay: ${delay}ms`);
        return delay;
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'ENOTSOCK';
        if (err.message.includes(targetError)) {
          console.log('🔄 Reconnecting due to ENOTSOCK error');
          return true;
        }
        return false;
      }
    };
    
    redisClient = new Redis(redisOptions);

    // Handle Redis connection events
    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });
  }

  return redisClient!;
}

// Cache key generators
export const CacheKeys = {
  repositories: {
    popular: 'repos:popular',
    byLanguage: (lang: string) => `repos:language:${lang}`,
    byTopic: (topic: string) => `repos:topic:${topic}`,
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
};

// Cache operations
export class RedisCache {
  private client: Redis;

  constructor() {
    this.client = getRedisClient();
  }

  // Get cached data
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      console.error(`❌ Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  // Set cached data with TTL
  async set<T>(key: string, data: T, ttl: number = CacheTTL.popularRepos): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      await this.client.set(key, serialized, 'EX', ttl);
    } catch (error: unknown) {
      console.error(`❌ Redis SET error for key ${key}:`, error);
    }
  }

  // Delete cached data
  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error: unknown) {
      console.error(`❌ Redis DEL error for key ${key}:`, error);
      return 0;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<number> {
    try {
      return await this.client.exists(key);
    } catch (error: unknown) {
      console.error(`❌ Redis EXISTS error for key ${key}:`, error);
      return 0;
    }
  }

  // Set expiration on existing key
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      return await this.client.expire(key, ttl) === 1;
    } catch (error: unknown) {
      console.error(`❌ Redis EXPIRE error for key ${key}:`, error);
      return false;
    }
  }

  // Get multiple keys by pattern
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error: unknown) {
      console.error(`❌ Redis KEYS error for pattern ${pattern}:`, error);
      return [];
    }
  }

  // Clear all cache (use carefully)
  async flushall(): Promise<void> {
    try {
      await this.client.flushall();
      console.log('🧹 Redis cache cleared');
    } catch (error: unknown) {
      console.error('❌ Redis FLUSHALL error:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    connected: boolean;
    keyCount: number;
    memoryUsage?: string;
  }> {
    try {
      const connected = this.client.status === 'ready';
      const keyCount = await this.client.dbsize();
      const memoryUsage = connected ? await this.client.info('memory') : undefined;
      
      return {
        connected,
        keyCount,
        memoryUsage: memoryUsage?.split('\n').find((line: string) => line.startsWith('used_memory:'))?.split(':')[1]?.trim()
      };
    } catch (error: unknown) {
      console.error('❌ Redis stats error:', error);
      return {
        connected: false,
        keyCount: 0
      };
    }
  }

  // Close Redis connection
  async quit(): Promise<void> {
    try {
      if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        console.log('🔌 Redis connection closed');
      }
    } catch (error: unknown) {
      console.error('❌ Redis quit error:', error);
    }
  }
}

// Export singleton instance
export const redisCache = new RedisCache();

// Helper functions for common caching patterns
export async function getCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl: number = CacheTTL.popularRepos
): Promise<T> {
  // Try to get from cache first
  const cached = await redisCache.get<T>(key);
  if (cached) {
    console.log(`🎯 Cache hit for key: ${key}`);
    return cached;
  }

  // Cache miss - fetch fresh data
  console.log(`🔄 Cache miss for key: ${key}, fetching fresh data`);
  const freshData = await fetchFunction();
  
  // Store in cache
  await redisCache.set(key, freshData, ttl);
  
  return freshData;
}

// Helper for cache invalidation patterns
export async function invalidatePattern(pattern: string): Promise<number> {
  try {
    const keys = await redisCache.keys(pattern);
    if (keys.length === 0) return 0;
    
    const deleted = await redisClient?.del(...keys) || 0;
    console.log(`🗑️  Invalidated ${deleted} keys matching pattern: ${pattern}`);
    return deleted;
  } catch (error: unknown) {
    console.error(`❌ Cache invalidation error for pattern ${pattern}:`, error);
    return 0;
  }
}

// Graceful shutdown handler
if (typeof window === 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing Redis connection...');
    await redisCache.quit();
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, closing Redis connection...');
    await redisCache.quit();
  });
}
