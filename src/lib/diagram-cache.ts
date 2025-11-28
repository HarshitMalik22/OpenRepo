import { redisCache } from './redis-cache';

export interface CachedDiagram {
  repoFullName: string;
  repoUrl: string;
  owner: string;
  name: string;
  diagramMermaid: string;
  explanation: any;
  architectureInsights?: any;
  analysisSummary?: any;
  repositoryStructure?: any;
  lastCommitSha?: string;
  generatedAt: string | Date;
  version: string;
}

export interface DiagramCacheResult {
  found: boolean;
  data?: CachedDiagram;
  fromCache: 'redis' | 'none';
}

class DiagramCacheService {
  private readonly REDIS_KEY_PREFIX = 'diagram:';
  private readonly COMMIT_SHA_PREFIX = 'diagram:commit:';
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  /**
   * Get cached diagram for a repository (Redis-only)
   */
  async getCachedDiagram(repoFullName: string): Promise<DiagramCacheResult> {
    try {
      const redisKey = `${this.REDIS_KEY_PREFIX}${repoFullName}`;
      const cachedFromRedis = await redisCache.get<CachedDiagram>(redisKey);
      
      if (cachedFromRedis) {
        return {
          found: true,
          data: cachedFromRedis,
          fromCache: 'redis'
        };
      }

      return { found: false, fromCache: 'none' };
    } catch (error) {
      console.error('Error getting cached diagram:', error);
      return { found: false, fromCache: 'none' };
    }
  }

  /**
   * Cache a newly generated diagram (Redis-only)
   */
  async cacheDiagram(data: {
    repoFullName: string;
    repoUrl: string;
    owner: string;
    name: string;
    diagramMermaid: string;
    explanation: any;
    architectureInsights?: any;
    analysisSummary?: any;
    repositoryStructure?: any;
    lastCommitSha?: string;
  }): Promise<CachedDiagram> {
    try {
      const now = new Date();

      const diagramData: CachedDiagram = {
        repoFullName: data.repoFullName,
        repoUrl: data.repoUrl,
        owner: data.owner,
        name: data.name,
        diagramMermaid: data.diagramMermaid,
        explanation: data.explanation,
        architectureInsights: data.architectureInsights,
        analysisSummary: data.analysisSummary,
        repositoryStructure: data.repositoryStructure,
        lastCommitSha: data.lastCommitSha,
        generatedAt: now,
        version: '1.0'
      };

      // Store in Redis with TTL
      const redisKey = `${this.REDIS_KEY_PREFIX}${data.repoFullName}`;
      await redisCache.set(redisKey, diagramData, this.CACHE_TTL);

      // Store commit SHA separately for update checking
      if (data.lastCommitSha) {
        const commitKey = `${this.COMMIT_SHA_PREFIX}${data.repoFullName}`;
        await redisCache.set(commitKey, data.lastCommitSha, this.CACHE_TTL);
      }

      return diagramData;
    } catch (error) {
      console.error('Error caching diagram:', error);
      throw error;
    }
  }

  /**
   * Delete cached diagram (for cache invalidation)
   */
  async deleteCachedDiagram(repoFullName: string): Promise<void> {
    try {
      // Delete from Redis
      const redisKey = `${this.REDIS_KEY_PREFIX}${repoFullName}`;
      await redisCache.del(redisKey);

      // Delete commit SHA
      const commitKey = `${this.COMMIT_SHA_PREFIX}${repoFullName}`;
      await redisCache.del(commitKey);
    } catch (error) {
      console.error('Error deleting cached diagram:', error);
    }
  }

  /**
   * Check if repository has been updated since cache was generated
   */
  async isRepositoryUpdated(repoFullName: string, currentCommitSha: string): Promise<boolean> {
    try {
      const commitKey = `${this.COMMIT_SHA_PREFIX}${repoFullName}`;
      const cachedCommitSha = await redisCache.get<string>(commitKey);

      if (!cachedCommitSha) {
        return false;
      }

      return cachedCommitSha !== currentCommitSha;
    } catch (error) {
      console.error('Error checking repository update status:', error);
      return false;
    }
  }

  /**
   * Get cache statistics (simplified for Redis-only)
   */
  async getCacheStats(): Promise<{
    totalCached: number;
    totalAccesses: number;
    averageAccessCount: number;
    recentlyAccessed: number;
  }> {
    // Redis doesn't easily provide aggregate stats without scanning all keys
    // Return placeholder stats since we're Redis-only now
    return {
      totalCached: 0,
      totalAccesses: 0,
      averageAccessCount: 0,
      recentlyAccessed: 0
    };
  }

  /**
   * Clear expired cache entries (Redis handles expiration via TTL automatically)
   */
  async clearExpiredCache(): Promise<number> {
    // Redis automatically expires keys based on TTL, so this is a no-op
    // But we can return 0 to indicate no manual cleanup needed
    return 0;
  }
}

export const diagramCache = new DiagramCacheService();
