import { prisma } from './prisma';
import { redisCache, CacheKeys, CacheTTL } from './redis-cache';

export interface CachedDiagram {
  id: string;
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
  generatedAt: Date;
  expiresAt?: Date;
  version: string;
  isPublic: boolean;
  accessCount: number;
  lastAccessedAt?: Date;
}

export interface DiagramCacheResult {
  found: boolean;
  data?: CachedDiagram;
  fromCache: 'redis' | 'database' | 'none';
}

class DiagramCacheService {
  private readonly REDIS_KEY_PREFIX = 'diagram:';
  private readonly CACHE_TTL = CacheTTL.popularRepos; // 1 hour

  /**
   * Get cached diagram for a repository
   * Checks Redis first, then database
   */
  async getCachedDiagram(repoFullName: string): Promise<DiagramCacheResult> {
    try {
      // Try Redis first (fastest)
      const redisKey = `${this.REDIS_KEY_PREFIX}${repoFullName}`;
      const cachedFromRedis = await redisCache.get<CachedDiagram>(redisKey);
      
      if (cachedFromRedis) {
        // Update access stats asynchronously
        this.updateAccessStats(repoFullName).catch(console.error);
        return {
          found: true,
          data: cachedFromRedis,
          fromCache: 'redis'
        };
      }

      // Try database
      const cachedFromDb = await prisma.repositoryDiagramCache.findUnique({
        where: { repoFullName }
      });

      if (cachedFromDb) {
        // Check if cache is still valid
        if (this.isCacheValid(cachedFromDb)) {
          const diagramData: CachedDiagram = {
            id: cachedFromDb.id,
            repoFullName: cachedFromDb.repoFullName,
            repoUrl: cachedFromDb.repoUrl,
            owner: cachedFromDb.owner,
            name: cachedFromDb.name,
            diagramMermaid: cachedFromDb.diagramMermaid,
            explanation: cachedFromDb.explanation,
            architectureInsights: cachedFromDb.architectureInsights,
            analysisSummary: cachedFromDb.analysisSummary,
            repositoryStructure: cachedFromDb.repositoryStructure,
            lastCommitSha: cachedFromDb.lastCommitSha,
            generatedAt: cachedFromDb.generatedAt,
            expiresAt: cachedFromDb.expiresAt,
            version: cachedFromDb.version,
            isPublic: cachedFromDb.isPublic,
            accessCount: cachedFromDb.accessCount,
            lastAccessedAt: cachedFromDb.lastAccessedAt
          };

          // Store in Redis for future requests
          await redisCache.set(redisKey, diagramData, this.CACHE_TTL);

          // Update access stats asynchronously
          this.updateAccessStats(repoFullName).catch(console.error);

          return {
            found: true,
            data: diagramData,
            fromCache: 'database'
          };
        } else {
          // Cache expired, delete it
          await this.deleteCachedDiagram(repoFullName);
        }
      }

      return { found: false, fromCache: 'none' };
    } catch (error) {
      console.error('Error getting cached diagram:', error);
      return { found: false, fromCache: 'none' };
    }
  }

  /**
   * Cache a newly generated diagram
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
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

      // Store in database
      const cachedDiagram = await prisma.repositoryDiagramCache.upsert({
        where: { repoFullName: data.repoFullName },
        update: {
          diagramMermaid: data.diagramMermaid,
          explanation: data.explanation,
          architectureInsights: data.architectureInsights,
          analysisSummary: data.analysisSummary,
          repositoryStructure: data.repositoryStructure,
          lastCommitSha: data.lastCommitSha,
          generatedAt: now,
          expiresAt,
          version: '1.0',
          updatedAt: now
        },
        create: {
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
          expiresAt,
          version: '1.0',
          isPublic: true
        }
      });

      const diagramData: CachedDiagram = {
        id: cachedDiagram.id,
        repoFullName: cachedDiagram.repoFullName,
        repoUrl: cachedDiagram.repoUrl,
        owner: cachedDiagram.owner,
        name: cachedDiagram.name,
        diagramMermaid: cachedDiagram.diagramMermaid,
        explanation: cachedDiagram.explanation,
        architectureInsights: cachedDiagram.architectureInsights,
        analysisSummary: cachedDiagram.analysisSummary,
        repositoryStructure: cachedDiagram.repositoryStructure,
        lastCommitSha: cachedDiagram.lastCommitSha,
        generatedAt: cachedDiagram.generatedAt,
        expiresAt: cachedDiagram.expiresAt,
        version: cachedDiagram.version,
        isPublic: cachedDiagram.isPublic,
        accessCount: cachedDiagram.accessCount,
        lastAccessedAt: cachedDiagram.lastAccessedAt
      };

      // Store in Redis
      const redisKey = `${this.REDIS_KEY_PREFIX}${data.repoFullName}`;
      await redisCache.set(redisKey, diagramData, this.CACHE_TTL);

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

      // Delete from database
      await prisma.repositoryDiagramCache.delete({
        where: { repoFullName }
      });
    } catch (error) {
      console.error('Error deleting cached diagram:', error);
    }
  }

  /**
   * Check if repository has been updated since cache was generated
   */
  async isRepositoryUpdated(repoFullName: string, currentCommitSha: string): Promise<boolean> {
    try {
      const cached = await prisma.repositoryDiagramCache.findUnique({
        where: { repoFullName }
      });

      if (!cached || !cached.lastCommitSha) {
        return false;
      }

      return cached.lastCommitSha !== currentCommitSha;
    } catch (error) {
      console.error('Error checking repository update status:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalCached: number;
    totalAccesses: number;
    averageAccessCount: number;
    recentlyAccessed: number;
  }> {
    try {
      const stats = await prisma.repositoryDiagramCache.aggregate({
        _count: { id: true },
        _sum: { accessCount: true },
        _avg: { accessCount: true }
      });

      const recentlyAccessed = await prisma.repositoryDiagramCache.count({
        where: {
          lastAccessedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      return {
        totalCached: stats._count.id || 0,
        totalAccesses: stats._sum.accessCount || 0,
        averageAccessCount: stats._avg.accessCount || 0,
        recentlyAccessed
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalCached: 0,
        totalAccesses: 0,
        averageAccessCount: 0,
        recentlyAccessed: 0
      };
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<number> {
    try {
      const now = new Date();
      const result = await prisma.repositoryDiagramCache.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      });

      // Clear corresponding Redis entries
      const expiredDiagrams = await prisma.repositoryDiagramCache.findMany({
        where: {
          expiresAt: {
            lt: now
          }
        },
        select: { repoFullName: true }
      });

      for (const diagram of expiredDiagrams) {
        const redisKey = `${this.REDIS_KEY_PREFIX}${diagram.repoFullName}`;
        await redisCache.del(redisKey);
      }

      return result.count;
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      return 0;
    }
  }

  /**
   * Update access statistics asynchronously
   */
  private async updateAccessStats(repoFullName: string): Promise<void> {
    try {
      await prisma.repositoryDiagramCache.update({
        where: { repoFullName },
        data: {
          accessCount: {
            increment: 1
          },
          lastAccessedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating access stats:', error);
    }
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(cached: any): boolean {
    if (cached.expiresAt && new Date() > cached.expiresAt) {
      return false;
    }
    return true;
  }
}

export const diagramCache = new DiagramCacheService();
