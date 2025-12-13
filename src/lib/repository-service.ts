import { redisCache, CacheKeys, CacheTTL } from '@/lib/redis-cache';
import { Repository } from '@/lib/types';
import { getPopularRepos as fetchPopularReposFromGitHub, getGitHubRepoDetails } from '@/lib/github';
import prisma from '@/lib/prisma';

// Re-export types needed by consumers
export type { Repository };

const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Service to handle repository data access with Hybrid Persistence
 * Strategy: Redis (L1) -> Prisma/DB (L2) -> GitHub API (Source)
 */
export class RepositoryService {
  
  /**
   * Get popular repositories
   * Tries Redis -> DB -> GitHub
   */
  static async getPopularRepositories(options: { 
    page?: number, 
    perPage?: number, 
    language?: string,
    q?: string 
  } = {}): Promise<{ repositories: Repository[], totalCount: number }> {
    const { page = 1, perPage = 30, language, q } = options;
    
    // 1. Try Redis Cache
    // Create a unique cache key for the query options
    // For simple popular pages (page 1, no filters), keep the standard key
    // For filtered/paginated queries, use a specific key with shorter TTL
    const isStandardQuery = !language && !q && page === 1;
    const cacheKey = isStandardQuery 
      ? CacheKeys.repositories.popular 
      : `repos:query:${JSON.stringify(options)}`;
    
    // Attempt cache read
    try {
      const cached = await redisCache.get<{ repositories: Repository[], totalCount: number } | Repository[]>(cacheKey);
      if (cached) {
        // Handle legacy format (array only) vs new format (object with totalCount)
        const result = Array.isArray(cached) 
          ? { repositories: cached, totalCount: cached.length }
          : cached;
          
        console.log(`RepositoryService: L1 Cache Hit (Redis) for ${isStandardQuery ? 'standard' : 'filtered'} query`);
        return result;
      }
    } catch (e) {
      console.error('Redis error:', e);
    }

    // 2. Fetch from GitHub (Source of Truth for "Popular")
    console.log('RepositoryService: Fetching from GitHub');
    const result = await fetchPopularReposFromGitHub(options);
    
    // 3. Store in DB (Async - Fire and Forget)
    this.saveRepositoriesToDb(result.repositories).catch(err => 
      console.error('Failed to save repos to DB:', err)
    );

    // 4. Update Redis Cache
    // Different TTL for standard vs filtered queries
    // Standard: longer cache (CacheTTL.popularRepos)
    // Filtered: shorter cache (e.g. 10 minutes) to allow for quicker updates
    const ttl = isStandardQuery ? CacheTTL.popularRepos : 600; // 10 minutes
    
    redisCache.set(cacheKey, result, ttl).catch(err =>
      console.error('Failed to update Redis cache:', err)
    );
    
    return result;
  }

  /**
   * Get a single repository by owner/name
   */
  static async getRepository(owner: string, name: string): Promise<Repository | null> {
    const fullName = `${owner}/${name}`;
    
    // 1. Try Redis
    const cacheKey = `repo:${fullName}`;
    try {
      const cached = await redisCache.get<Repository>(cacheKey);
      if (cached) return cached;
    } catch (e) { console.error(e); }

    // 2. Try Prisma (L2 Cache)
    try {
      const dbRepo = await prisma.repositories.findFirst({
        where: { full_name: fullName }
      });

      if (dbRepo) {
        const repo = dbRepo.data as unknown as Repository;
        
        // Check staleness
        const lastAnalyzed = dbRepo.last_analyzed ? new Date(dbRepo.last_analyzed).getTime() : 0;
        const isStale = (Date.now() - lastAnalyzed) > STALE_THRESHOLD_MS;

        if (isStale) {
          console.log(`RepositoryService: DB entry stale for ${fullName}, refreshing in background`);
          // Trigger background refresh
          this.refreshRepository(fullName).catch(console.error);
        } else {
          console.log(`RepositoryService: L2 Cache Hit (Prisma) for ${fullName}`);
          // Populate Redis
          await redisCache.set(cacheKey, repo, CacheTTL.popularRepos);
          return repo;
        }
        
        // Return stale data immediately if we found it (Stale-While-Revalidate)
        return repo;
      }
    } catch (dbError) {
      console.warn('RepositoryService: Prisma read failed (continuing to GitHub):', dbError);
    }

    // 3. Fetch from GitHub
    console.log(`RepositoryService: Fetching ${fullName} from GitHub`);
    try {
      const repo = await getGitHubRepoDetails(fullName);
      
      // Save to DB & Redis
      await this.saveRepositoriesToDb([repo]);
      await redisCache.set(cacheKey, repo, CacheTTL.popularRepos);
      
      return repo;
    } catch (error) {
      console.error(`Failed to fetch ${fullName}`, error);
      return null;
    }
  }

  /**
   * Save repositories to DB via Prisma
   */
  private static async saveRepositoriesToDb(repos: Repository[]) {
    if (repos.length === 0) return;
    
    try {
      console.log(`RepositoryService: Saving ${repos.length} repos to DB...`);
      
      for (const repo of repos) {
        await prisma.repositories.upsert({
          where: { id: BigInt(repo.id) },
          update: {
            full_name: repo.full_name,
            data: repo as unknown as any, // Cast to any for Json compatibility
            last_analyzed: new Date()
          },
          create: {
            id: BigInt(repo.id),
            full_name: repo.full_name,
            data: repo as unknown as any,
            last_analyzed: new Date()
          }
        });
      }

      console.log(`RepositoryService: Saved ${repos.length} repos to DB`);
    } catch (dbError) {
      console.warn('RepositoryService: Failed to save to DB:', dbError);
    }
  }

  /**
   * Refresh a single repository from GitHub and update DB
   */
  private static async refreshRepository(fullName: string) {
    try {
      const repo = await getGitHubRepoDetails(fullName);
      await this.saveRepositoriesToDb([repo]);
      
      // Update Redis too
      const cacheKey = `repo:${fullName}`;
      await redisCache.set(cacheKey, repo, CacheTTL.popularRepos);
    } catch (error) {
      console.error(`Failed to refresh repo ${fullName}`, error);
    }
  }
}
