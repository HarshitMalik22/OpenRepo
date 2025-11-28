import { createClient } from '@/lib/supabase/server';
import { redisCache, CacheKeys, CacheTTL } from '@/lib/redis-cache';
import { Repository } from '@/lib/types';
import { getPopularRepos as fetchPopularReposFromGitHub, getGitHubRepoDetails } from '@/lib/github';
import { Database } from '@/lib/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

// Re-export types needed by consumers
export type { Repository };

const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Service to handle repository data access with Hybrid Persistence
 * Strategy: Redis (L1) -> Supabase (L2) -> GitHub API (Source)
 */
export class RepositoryService {
  
  /**
   * Get popular repositories
   * Tries Redis -> Supabase -> GitHub
   */
  static async getPopularRepositories(options: { 
    page?: number, 
    perPage?: number, 
    language?: string,
    q?: string 
  } = {}): Promise<{ repositories: Repository[], totalCount: number }> {
    const { page = 1, perPage = 30, language, q } = options;
    
    // 1. Try Redis Cache
    const cacheKey = CacheKeys.repositories.popular; // Note: This key might need to be more specific based on options
    // For simplicity in this iteration, we'll stick to the main popular list if no filters
    // Ideally we should have granular cache keys
    
    if (!language && !q && page === 1) {
      try {
        const cached = await redisCache.get<Repository[]>(cacheKey);
        if (cached) {
          console.log('RepositoryService: L1 Cache Hit (Redis)');
          return { repositories: cached, totalCount: cached.length }; // Approx count
        }
      } catch (e) {
        console.error('Redis error:', e);
      }
    }

    // 2. Try Supabase (L2 Cache)
    // We can query Supabase for repositories. 
    // However, "popular" is a dynamic ranking from GitHub. 
    // If we are just listing *our* stored repos, we can query DB.
    // But to get the *actual* current popular repos from GitHub, we usually need to hit the API 
    // if we want fresh ranking.
    // 
    // Hybrid approach: If we have a "popular" tag or similar in DB we could use it.
    // For now, let's fall back to GitHub for the *list* but use DB for *details* if needed.
    // 
    // Actually, to fully utilize Supabase, we should store the "popular" list results there too?
    // Or just store the individual repos.
    //
    // Let's stick to the plan: fetch from GitHub, then store in DB.
    
    console.log('RepositoryService: Fetching from GitHub');
    const result = await fetchPopularReposFromGitHub(options);
    
    // 3. Store in Supabase (Async - Fire and Forget)
    this.saveRepositoriesToSupabase(result.repositories).catch(err => 
      console.error('Failed to save repos to Supabase:', err)
    );

    // 4. Update Redis Cache (if no filters)
    if (!language && !q && page === 1) {
      redisCache.set(cacheKey, result.repositories, CacheTTL.popularRepos).catch(err =>
        console.error('Failed to update Redis cache:', err)
      );
    }
    
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

    // 2. Try Supabase
    try {
      const supabase = (await createClient()) as SupabaseClient<Database>;
      const { data: dbRepo, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('full_name', fullName)
        .single();

      if (dbRepo && !error) {
        const repo = dbRepo.data as unknown as Repository;
        
        // Check staleness
        const lastAnalyzed = new Date(dbRepo.last_analyzed || 0).getTime();
        const isStale = (Date.now() - lastAnalyzed) > STALE_THRESHOLD_MS;

        if (isStale) {
          console.log(`RepositoryService: DB entry stale for ${fullName}, refreshing in background`);
          // Trigger background refresh
          this.refreshRepository(fullName).catch(console.error);
        } else {
          console.log(`RepositoryService: L2 Cache Hit (Supabase) for ${fullName}`);
          // Populate Redis
          await redisCache.set(cacheKey, repo, CacheTTL.popularRepos);
          return repo;
        }
        
        // Return stale data immediately if we found it (Stale-While-Revalidate)
        return repo;
      }
    } catch (dbError) {
      console.warn('RepositoryService: Supabase read failed (continuing to GitHub):', dbError);
    }

    // 3. Fetch from GitHub
    console.log(`RepositoryService: Fetching ${fullName} from GitHub`);
    try {
      const repo = await getGitHubRepoDetails(fullName);
      
      // Save to DB & Redis
      await this.saveRepositoriesToSupabase([repo]);
      await redisCache.set(cacheKey, repo, CacheTTL.popularRepos);
      
      return repo;
    } catch (error) {
      console.error(`Failed to fetch ${fullName}`, error);
      return null;
    }
  }

  /**
   * Save repositories to Supabase
   */
  private static async saveRepositoriesToSupabase(repos: Repository[]) {
    if (repos.length === 0) return;
    
    try {
      const supabase = (await createClient()) as SupabaseClient<Database>;
      
      const upsertData = repos.map(repo => ({
        id: repo.id,
        full_name: repo.full_name,
        data: repo as unknown as any, // Cast to any for Json compatibility
        last_analyzed: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('repositories')
        .upsert(upsertData, { onConflict: 'id' });

      if (error) {
        console.warn(`RepositoryService: Supabase upsert failed: ${error.message}`);
      } else {
        console.log(`RepositoryService: Saved ${repos.length} repos to Supabase`);
      }
    } catch (dbError) {
      console.warn('RepositoryService: Failed to save to Supabase (check credentials):', dbError);
    }
  }

  /**
   * Refresh a single repository from GitHub and update DB
   */
  private static async refreshRepository(fullName: string) {
    try {
      const repo = await getGitHubRepoDetails(fullName);
      await this.saveRepositoriesToSupabase([repo]);
      
      // Update Redis too
      const cacheKey = `repo:${fullName}`;
      await redisCache.set(cacheKey, repo, CacheTTL.popularRepos);
    } catch (error) {
      console.error(`Failed to refresh repo ${fullName}`, error);
    }
  }
}
