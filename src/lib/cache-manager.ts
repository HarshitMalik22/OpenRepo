/**
 * Enhanced Smart Cache Manager for GitHub API Data
 * Implements multi-layer caching: Memory → Redis → Database
 * Maintains all GitHub-specific intelligence while adding persistence and distribution
 */

import { Redis } from '@upstash/redis';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  // Different TTLs for different data types (same as your current config)
  repositoryBasic: number;     // Basic repo info (name, owner, description) - 1 hour
  repositoryStats: number;     // Stars, forks, issues count - 5 minutes
  repositoryActivity: number;  // Commits, PRs, recent activity - 2 minutes
  repositoryIssues: number;    // Issues list - 10 minutes
  repositoryHealth: number;    // Health score and metrics - 30 minutes
  searchResults: number;       // Search results - 15 minutes
}

interface CacheStats {
  memoryHits: number;
  memoryMisses: number;
  redisHits: number;
  redisMisses: number;
  totalRequests: number;
}

class EnhancedCacheManager {
  // Memory cache (your current system)
  private memoryCache = new Map<string, CacheEntry<any>>();
  
  // Redis cache (new persistent layer)
  private redis: Redis | null = null;
  
  // Configuration (same as your current config)
  private config: CacheConfig = {
    repositoryBasic: 60 * 60 * 1000,     // 1 hour
    repositoryStats: 5 * 60 * 1000,      // 5 minutes
    repositoryActivity: 2 * 60 * 1000,   // 2 minutes
    repositoryIssues: 10 * 60 * 1000,    // 10 minutes
    repositoryHealth: 30 * 60 * 1000,    // 30 minutes
    searchResults: 15 * 60 * 1000,       // 15 minutes
  };

  // Cache statistics
  private stats: CacheStats = {
    memoryHits: 0,
    memoryMisses: 0,
    redisHits: 0,
    redisMisses: 0,
    totalRequests: 0,
  };

  // Memory cache configuration
  private readonly MEMORY_CACHE_SIZE = parseInt(process.env.CACHE_MEMORY_SIZE || '100', 10);
  private readonly CACHE_PREFIX = process.env.CACHE_PREFIX || 'opensauce:';

  constructor() {
    // Initialize Redis (only if credentials are available)
    if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_URL,
        token: process.env.UPSTASH_REDIS_TOKEN,
      });
    } else {
      console.warn('Redis credentials not found. Running in memory-only mode.');
    }
  }

  // Generate cache key with prefix (enhanced from your current version)
  private generateKey(prefix: string, identifier: string, context?: string): string {
    const parts = [this.CACHE_PREFIX, prefix, identifier];
    if (context) parts.push(context);
    return parts.join(':');
  }

  // Check if cache entry is valid (same as your current logic)
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Clean expired memory cache entries
  private cleanMemoryCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Ensure memory cache doesn't exceed size limit
  private evictOldestIfNeeded(): void {
    if (this.memoryCache.size >= this.MEMORY_CACHE_SIZE) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }
  }

  // Core get method with multi-layer strategy
  async get<T>(key: string): Promise<T | null> {
    this.stats.totalRequests++;
    
    // Clean expired entries first
    this.cleanMemoryCache();

    // Try memory cache first (fastest)
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValid(memoryEntry)) {
      this.stats.memoryHits++;
      return memoryEntry.data;
    }
    this.stats.memoryMisses++;

    // Try Redis cache (persistent layer)
    if (this.redis) {
      try {
        const redisResult = await this.redis!.get(key);
        if (redisResult && typeof redisResult === 'string') {
          const parsed = JSON.parse(redisResult);
          
          // Store in memory cache for next time
          this.evictOldestIfNeeded();
          this.memoryCache.set(key, {
            data: parsed,
            timestamp: Date.now(),
            ttl: this.config.repositoryBasic, // Default TTL
          });
          
          this.stats.redisHits++;
          return parsed;
        }
      } catch (error) {
        console.error('Redis get error:', error);
      }
    }
    this.stats.redisMisses++;

    return null;
  }

  // Core set method with multi-layer strategy
  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    // Store in memory cache
    this.evictOldestIfNeeded();
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Store in Redis cache
    if (this.redis) {
      try {
        await this.redis.setex(key, Math.ceil(ttl / 1000), JSON.stringify(data));
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }
  }

  // Delete from both cache layers
  async delete(key: string): Promise<void> {
    // Remove from memory cache
    this.memoryCache.delete(key);
    
    // Remove from Redis cache
    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch (error) {
        console.error('Redis delete error:', error);
      }
    }
  }

  // Clear cache by pattern
  async clearPattern(pattern: string): Promise<void> {
    const fullPattern = this.CACHE_PREFIX + pattern;
    
    // Clear memory cache entries matching pattern
    for (const key of this.memoryCache.keys()) {
      if (key.includes(fullPattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear Redis keys matching pattern
    if (this.redis) {
      try {
        const keys = await this.redis.keys(fullPattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } catch (error) {
        console.error('Redis clear pattern error:', error);
      }
    }
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Reset statistics
  resetStats(): void {
    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      redisHits: 0,
      redisMisses: 0,
      totalRequests: 0,
    };
  }

  // === YOUR EXISTING GITHUB-SPECIFIC METHODS (enhanced to be async) ===

  async getRepositoryBasic(fullName: string) {
    return this.get(this.generateKey('repo-basic', fullName));
  }

  async setRepositoryBasic(fullName: string, data: any) {
    await this.set(this.generateKey('repo-basic', fullName), data, this.config.repositoryBasic);
  }

  async getRepositoryStats(fullName: string) {
    return this.get(this.generateKey('repo-stats', fullName));
  }

  async setRepositoryStats(fullName: string, data: any) {
    await this.set(this.generateKey('repo-stats', fullName), data, this.config.repositoryStats);
  }

  async getRepositoryActivity(fullName: string) {
    return this.get(this.generateKey('repo-activity', fullName));
  }

  async setRepositoryActivity(fullName: string, data: any) {
    await this.set(this.generateKey('repo-activity', fullName), data, this.config.repositoryActivity);
  }

  async getRepositoryIssues(fullName: string, labels?: string) {
    const context = labels || 'all';
    return this.get(this.generateKey('repo-issues', fullName, context));
  }

  async setRepositoryIssues(fullName: string, data: any, labels?: string) {
    const context = labels || 'all';
    await this.set(this.generateKey('repo-issues', fullName, context), data, this.config.repositoryIssues);
  }

  async getRepositoryHealth(fullName: string) {
    return this.get(this.generateKey('repo-health', fullName));
  }

  async setRepositoryHealth(fullName: string, data: any) {
    await this.set(this.generateKey('repo-health', fullName), data, this.config.repositoryHealth);
  }

  async getSearchResults(query: string) {
    return this.get(this.generateKey('search', query));
  }

  async setSearchResults(query: string, data: any) {
    await this.set(this.generateKey('search', query), data, this.config.searchResults);
  }

  // === NEW UTILITY METHODS ===

  // Invalidate all repository-related cache
  async invalidateRepositoryCache(fullName?: string) {
    if (fullName) {
      // Invalidate specific repository
      await this.delete(this.generateKey('repo-basic', fullName));
      await this.delete(this.generateKey('repo-stats', fullName));
      await this.delete(this.generateKey('repo-activity', fullName));
      await this.delete(this.generateKey('repo-health', fullName));
      await this.clearPattern(`repo-issues:${fullName}`);
    } else {
      // Invalidate all repositories
      await this.clearPattern('repo-basic:');
      await this.clearPattern('repo-stats:');
      await this.clearPattern('repo-activity:');
      await this.clearPattern('repo-health:');
      await this.clearPattern('repo-issues:');
    }
  }

  // Get cache performance metrics
  getPerformanceMetrics() {
    const { memoryHits, memoryMisses, redisHits, redisMisses, totalRequests } = this.stats;
    
    return {
      totalRequests,
      memoryHitRate: totalRequests > 0 ? (memoryHits / totalRequests) * 100 : 0,
      redisHitRate: totalRequests > 0 ? (redisHits / totalRequests) * 100 : 0,
      overallHitRate: totalRequests > 0 ? ((memoryHits + redisHits) / totalRequests) * 100 : 0,
      memoryCacheSize: this.memoryCache.size,
      memoryCacheCapacity: this.MEMORY_CACHE_SIZE,
      memoryUtilization: (this.memoryCache.size / this.MEMORY_CACHE_SIZE) * 100,
    };
  }
}

// Export singleton instance (same as your current export)
export const cacheManager = new EnhancedCacheManager();

// Export types for TypeScript (same as your current export)
export type { CacheConfig, CacheStats };