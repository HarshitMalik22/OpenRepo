// Cache to avoid hitting the API rate limit during development
let repoCache: Repository[] | null = null;
let repoDetailCache = new Map<string, Repository>();
let communityStatsCache: any = null;

// Cache update locks
const cacheLocks = {
  popularRepos: false,
  communityStats: false
};

// Request queue and rate limiting
const requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second base delay

// Process the request queue with rate limiting
async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  try {
    while (requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      
      // Wait if needed to respect rate limits
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }
      
      const request = requestQueue.shift();
      if (request) {
        lastRequestTime = Date.now();
        await request();
      }
    }
  } finally {
    isProcessingQueue = false;
  }
}

// Add a request to the queue and process it
function enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    requestQueue.push(execute);
    processQueue();
  });
}

// Calculate delay with exponential backoff and jitter
function calculateBackoff(retryCount: number): number {
  const backoff = Math.min(BASE_DELAY * Math.pow(2, retryCount), 30000); // Max 30s delay
  const jitter = Math.floor(Math.random() * 1000); // Add up to 1s jitter
  return backoff + jitter;
}

// Make a rate-limited request to GitHub API
async function makeGitHubRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const contextHeaders = getGitHubHeadersForContext();
  const headers = {
    ...contextHeaders,
    'Accept': 'application/vnd.github.v3+json',
    ...options.headers,
  };

  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 403) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        const resetTime = rateLimitReset ? parseInt(rateLimitReset, 10) * 1000 : 0;
        const now = Date.now();
        const waitTime = Math.max(resetTime - now, 0) + 1000; // Add 1s buffer
        
        if (retryCount < MAX_RETRIES - 1) {
          console.warn(`Rate limit hit. Waiting ${Math.ceil(waitTime / 1000)} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }
        
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'GitHub API request failed');
      }
      
      return await response.json();
      
    } catch (error) {
      if (retryCount >= MAX_RETRIES - 1) {
        console.error(`GitHub API request failed after ${MAX_RETRIES} attempts:`, error);
        throw error;
      }
      
      const delay = calculateBackoff(retryCount);
      console.warn(`Request failed, retrying in ${delay}ms... (${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
  }
  
  throw new Error('Failed to complete GitHub API request');
}

import { getGitHubHeaders, getGitHubHeadersForContext } from './github-headers';
import { redisCache, CacheKeys, CacheTTL, getCachedData } from './redis-cache';
import type { Repository, UserPreferences, RepositoryFilters, CommunityStats } from './types';
import { CompetitionLevel, ActivityLevel, AIDomain, ContributionDifficultyLevel } from './types';

// Only log configuration status on server side
if (typeof window === 'undefined') {
  import('./github-config').then(({ logGitHubConfigStatus }) => {
    logGitHubConfigStatus().catch(console.error);
  });
}

/**
 * Fetches a list of popular repositories from the GitHub API with optimized performance
 * and rate limiting
 */
interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions?: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
  temp_clone_token?: string;
  allow_squash_merge?: boolean;
  allow_merge_commit?: boolean;
  allow_rebase_merge?: boolean;
  allow_auto_merge?: boolean;
  delete_branch_on_merge?: boolean;
  allow_update_branch?: boolean;
  use_squash_pr_title_as_default?: boolean;
  squash_merge_commit_message?: string;
  squash_merge_commit_title?: string;
  merge_commit_message?: string;
  merge_commit_title?: string;
  network_count?: number;
  subscribers_count?: number;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

/**
 * Fetches the count of good first issues for a repository
 * @param owner Repository owner
 * @param repo Repository name
 * @returns Count of open issues with "good first issue" label
 */
export async function getGoodFirstIssueCount(owner: string, repo: string): Promise<number> {
  try {
    const fullName = `${owner}/${repo}`;
    
    // Check Redis cache first (only on server-side)
    if (typeof window === 'undefined') {
      try {
        const { redisCache: serverRedisCache, CacheKeys: ServerCacheKeys } = await import('./redis-cache');
        const cacheKey = ServerCacheKeys.repositories.repoIssueCount(fullName);
        const cached = await serverRedisCache.get<number>(cacheKey);
        if (cached !== null) {
          return cached;
        }
      } catch (cacheError) {
        console.error('Redis cache error (continuing without cache):', cacheError);
      }
    }
    
    // Fetch from GitHub API
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=good first issue&state=open&per_page=1`;
    const response = await makeGitHubRequest<any>(url);
    
    // GitHub returns the total count in the Link header, but for simplicity we'll make another call
    // to get the total count using the search API
    const searchUrl = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+label:"good first issue"+state:open&per_page=1`;
    const searchResponse = await makeGitHubRequest<{ total_count: number }>(searchUrl);
    const count = searchResponse.total_count || 0;
    
    // Cache the result for 1 hour (only on server-side)
    if (typeof window === 'undefined') {
      try {
        const { redisCache: serverRedisCache, CacheKeys: ServerCacheKeys, CacheTTL } = await import('./redis-cache');
        const cacheKey = ServerCacheKeys.repositories.repoIssueCount(fullName);
        await serverRedisCache.set(cacheKey, count, CacheTTL.goodFirstIssues);
      } catch (cacheError) {
        console.error('Redis cache error (continuing without cache):', cacheError);
      }
    }
    
    return count;
  } catch (error) {
    console.error(`Error fetching good first issue count for ${owner}/${repo}:`, error);
    return 0;
  }
}

/**
 * Enriches repositories with good first issue counts
 * @param repositories Array of repositories to enrich
 * @returns Enriched repositories with good_first_issues_count
 */
export async function enrichRepositoriesWithIssueData(repositories: Repository[]): Promise<Repository[]> {
  // Limit concurrent requests to 5 at a time
  const BATCH_SIZE = 5;
  const enriched: Repository[] = [];
  
  for (let i = 0; i < repositories.length; i += BATCH_SIZE) {
    const batch = repositories.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (repo) => {
        const [owner, repoName] = repo.full_name.split('/');
        if (!owner || !repoName) return repo;
        
        const count = await getGoodFirstIssueCount(owner, repoName);
        return {
          ...repo,
          good_first_issues_count: count
        };
      })
    );
    
    // Add successful results to enriched array
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        enriched.push(result.value);
      }
    });
  }
  
  return enriched;
}

// Helper function to map GitHub API response to our Repository type
// Helper to calculate competition level based on stars and forks
function calculateCompetitionLevel(stars: number, forks: number): CompetitionLevel {
  const score = stars + (forks * 2);
  if (score > 10000) return CompetitionLevel.VERY_HIGH;
  if (score > 5000) return CompetitionLevel.HIGH;
  if (score > 1000) return CompetitionLevel.MEDIUM;
  if (score > 200) return CompetitionLevel.LOW;
  return CompetitionLevel.VERY_LOW;
}

// Helper to calculate contribution difficulty
function calculateDifficulty(hasGoodFirstIssues: boolean, openIssues: number): ContributionDifficultyLevel {
  if (hasGoodFirstIssues) return ContributionDifficultyLevel.BEGINNER;
  if (openIssues > 50) return ContributionDifficultyLevel.INTERMEDIATE;
  if (openIssues > 10) return ContributionDifficultyLevel.ADVANCED;
  return ContributionDifficultyLevel.EXPERT;
}

function mapGitHubRepoToRepository(repo: GitHubRepository, goodFirstIssuesCount?: number): Repository {
  const competitionLevel = calculateCompetitionLevel(repo.stargazers_count || 0, repo.forks_count || 0);
  const difficulty = calculateDifficulty((goodFirstIssuesCount || 0) > 0, repo.open_issues_count || 0);

  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    owner: {
      login: repo.owner?.login || '',
      avatar_url: repo.owner?.avatar_url || '',
      html_url: repo.owner?.html_url || `https://github.com/${repo.owner?.login || ''}`
    },
    html_url: repo.html_url,
    description: repo.description || null,
    stargazers_count: repo.stargazers_count || 0,
    watchers_count: repo.watchers_count || 0,
    forks_count: repo.forks_count || 0,
    open_issues_count: repo.open_issues_count || 0,
    language: repo.language || null,
    topics: repo.topics || [],
    created_at: repo.created_at || new Date().toISOString(),
    updated_at: repo.updated_at || new Date().toISOString(),
    pushed_at: repo.pushed_at || null,
    default_branch: repo.default_branch || 'main',
    archived: repo.archived || false,
    disabled: repo.disabled || false,
    has_issues: repo.has_issues !== undefined ? repo.has_issues : true,
    has_projects: repo.has_projects !== undefined ? repo.has_projects : true,
    has_wiki: repo.has_wiki !== undefined ? repo.has_wiki : true,
    has_pages: repo.has_pages || false,
    has_downloads: repo.has_downloads !== undefined ? repo.has_downloads : true,
    license: repo.license ? {
      key: repo.license.key || '',
      name: repo.license.name || '',
      spdx_id: repo.license.spdx_id || '',
      url: repo.license.url || ''
    } : undefined,
    // Calculated fields
    competition_level: competitionLevel,
    activity_level: ActivityLevel.MEDIUM, 
    ai_domain: AIDomain.OTHER,
    contribution_difficulty: difficulty,
    last_analyzed: new Date().toISOString(),
    contributor_count: 0,
    recent_commits: 0,
    issue_response_rate: 0,
    documentation_score: 0,
    // Backward compatibility
    login: repo.owner?.login,
    avatar_url: repo.owner?.avatar_url,
    // Good first issues count
    good_first_issues_count: goodFirstIssuesCount
  };
}

export interface PopularReposResponse {
  repositories: Repository[];
  totalCount: number;
}

interface GetPopularReposOptions {
  page?: number;
  perPage?: number;
  language?: string;
  q?: string;
  enrichWithIssues?: boolean;
}

export async function getPopularRepos(options: boolean | GetPopularReposOptions = true): Promise<PopularReposResponse> {
  const { page = 1, perPage = 30, language, q, enrichWithIssues = false } = typeof options === 'object' ? options : {};
  
  // Generate a unique cache key based on options
  const cacheKey = `repos:popular:${JSON.stringify({ page, perPage, language, q, enrichWithIssues })}`;
  
  // Use getCachedData to handle caching automatically
  return getCachedData<PopularReposResponse>(
    cacheKey,
    async () => {
      let response: GitHubSearchResponse | null = null;

      try {
        // Define search query for popular repositories
        let query = q || 'stars:>1000 sort:stars-desc';
        
        // Append language filter if provided and not already in query
        if (language && !query.includes('language:')) {
          query += ` language:${language}`;
        }
        const maxPages = 2; // Reduced number of pages to fetch
        const allRepos: Repository[] = [];
        const seenRepos = new Set<number>();
        
        // Set up request headers
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json',
        };
        
        // Add authorization if token exists
        if (process.env.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }
        
        // Fetch repositories from GitHub API
        for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
          try {
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.append('q', query);
            url.searchParams.append('sort', 'stars');
            url.searchParams.append('order', 'desc');
            url.searchParams.append('per_page', perPage.toString());
            url.searchParams.append('page', currentPage.toString());
            
            console.log(`Fetching page ${currentPage} from GitHub API: ${url.toString()}`);
            
            const fetchResponse = await fetch(url.toString(), { headers });
            const responseData = await fetchResponse.json() as GitHubSearchResponse;
            
            // Update the response variable for potential error handling
            response = responseData;

            // Check for rate limiting and other errors in the response data
            if ('message' in responseData && responseData.message) {
              const errorMessage = typeof responseData.message === 'string' 
                ? responseData.message 
                : 'Unknown GitHub API error';
                
              console.error('GitHub API error:', errorMessage);
              
              if (errorMessage.includes('API rate limit exceeded')) {
                console.warn('GitHub API rate limit exceeded');
                throw new Error('GitHub API rate limit exceeded');
              }
              
              throw new Error(`GitHub API error: ${errorMessage}`);
            }

            if (!('items' in response) || !Array.isArray(response.items)) {
              console.error('Invalid GitHub API response format:', response);
              throw new Error('Invalid response format from GitHub API');
            }
            
            // Process repositories from this page
            for (const repo of response.items) {
              if (!seenRepos.has(repo.id)) {
                seenRepos.add(repo.id);
                allRepos.push(mapGitHubRepoToRepository(repo));
              }
            }

            // If we got fewer results than requested, we've reached the end
            if (response.items.length < perPage) {
              break;
            }

            // Add a small delay between requests to avoid hitting rate limits
            if (page < maxPages) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            // Continue to next page even if one page fails
          }
        }
        
        // Enrich with good first issue counts if requested
        let finalRepos = allRepos;
        if (enrichWithIssues && allRepos.length > 0) {
          try {
            console.log('Enriching repositories with good first issue counts...');
            finalRepos = await enrichRepositoriesWithIssueData(allRepos);
          } catch (enrichError) {
            console.error('Failed to enrich repositories with issue data:', enrichError);
            // Continue with unenriched data
          }
        }
        
        const result = {
          repositories: finalRepos,
          totalCount: response?.total_count || finalRepos.length
        };
        
        return result;
      } catch (error) {
        console.error('Failed to fetch popular repositories:', error);
        throw error;
      }
    },
    CacheTTL.popularRepos // Cache for 1 hour
  );
}

// Get personalized recommendations based on user preferences (stub - functionality removed)
export async function getRecommendedRepos(preferences: UserPreferences, limit: number = 10): Promise<Repository[]> {
  const { repositories } = await getPopularRepos();
  return repositories.slice(0, limit);
}

// Get enhanced personalized recommendations with ML-based scoring (stub - functionality removed)
export async function getEnhancedRecommendedRepos(
  preferences: UserPreferences, 
  userId?: string, 
  limit: number = 10
): Promise<Repository[]> {
  const { repositories } = await getPopularRepos();
  return repositories.slice(0, limit);
}

// Track user interaction for learning (stub - functionality removed)
export function trackUserInteraction(
  userId: string, 
  repoId: string, 
  action: 'view' | 'like' | 'dislike' | 'contribute' | 'analyze', 
  score?: number
): void {
  // Functionality removed - no-op
}

// Get recommendation explanations (stub - functionality removed)
export function getRecommendationExplanation(repo: Repository): string[] {
  return ['Recommended based on general popularity'];
}

// Update user preferences (stub - functionality removed)
export function updateUserPreferences(userId: string, preferences: UserPreferences): void {
  // Functionality removed - no-op
}

// Get user statistics (stub - functionality removed)
export function getUserStats(userId: string) {
  return null;
}

// Client-side cache for filtered results
const filterCache = new Map<string, { repositories: Repository[]; timestamp: number }>();
const FILTER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Generate cache key from filters
function getFilterCacheKey(filters: RepositoryFilters): string {
  return JSON.stringify(filters);
}

// Check if cache is valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < FILTER_CACHE_TTL;
}

// Get filtered repositories based on filters with client-side caching
export async function getFilteredRepos(filters: RepositoryFilters): Promise<Repository[]> {
  const cacheKey = getFilterCacheKey(filters);
  
  // Check cache first
  const cached = filterCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    console.log('Using cached filtered results');
    return cached.repositories;
  }
  
  try {
    const response = await fetch('/api/repositories/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const repositories = data.repositories || [];
    
    // Cache the results
    filterCache.set(cacheKey, {
      repositories,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries
    if (filterCache.size > 20) {
      const now = Date.now();
      for (const [key, value] of filterCache.entries()) {
        if (!isCacheValid(value.timestamp)) {
          filterCache.delete(key);
        }
      }
    }
    
    if (data.isFallback) {
      console.warn('Using fallback results due to filtering error:', data.error);
    }
    
    return repositories;
  } catch (error) {
    console.error('Error filtering repositories:', error);
    
    // Fallback: try to get unfiltered repositories
    try {
      const { repositories } = await getPopularRepos(true);
      return repositories.slice(0, 20); // Limit to avoid overwhelming the UI
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
}

/**
 * Fetches community statistics for a repository
 * @param owner Repository owner
 * @param repo Repository name
 * @returns Community statistics including health, contributors, and activity
 */
/**
 * Get detailed information about a GitHub repository
 * @param repoFullName Full repository name in format 'owner/repo'
 * @returns Repository details
 */
export async function getGitHubRepoDetails(repoFullName: string): Promise<Repository> {
  try {
    const [owner, repo] = repoFullName.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repository name format. Expected "owner/repo"');
    }

    // Check cache first
    const cacheKey = `repo:${owner}:${repo}`;
    const cachedRepo = repoDetailCache.get(cacheKey);
    if (cachedRepo) {
      return cachedRepo;
    }

    // Fetch from GitHub API
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const repoData = await makeGitHubRequest<GitHubRepository>(url);

    // Transform to our Repository type
    const repository: Repository = {
      id: repoData.id,
      name: repoData.name,
      full_name: repoData.full_name,
      owner: {
        login: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url,
        html_url: repoData.owner.html_url,
      },
      html_url: repoData.html_url,
      description: repoData.description,
      stargazers_count: repoData.stargazers_count,
      watchers_count: repoData.watchers_count,
      forks_count: repoData.forks_count,
      open_issues_count: repoData.open_issues_count,
      language: repoData.language,
      topics: repoData.topics || [],
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      default_branch: repoData.default_branch,
      archived: repoData.archived,
      disabled: repoData.disabled,
      has_issues: repoData.has_issues,
      has_projects: repoData.has_projects,
      has_wiki: repoData.has_wiki,
      has_pages: repoData.has_pages,
      has_downloads: repoData.has_downloads,
      license: repoData.license ? {
        key: repoData.license.key,
        name: repoData.license.name,
        spdx_id: repoData.license.spdx_id,
        url: repoData.license.url || ''
      } : undefined,
      // Set default values for additional fields
      competition_level: CompetitionLevel.LOW,
      activity_level: ActivityLevel.MEDIUM,
      ai_domain: AIDomain.OTHER,
      contribution_difficulty: ContributionDifficultyLevel.INTERMEDIATE,
      last_analyzed: new Date().toISOString(),
      contributor_count: 0,
      recent_commits: 0,
      issue_response_rate: 0,
      documentation_score: 0,
    };

    // Cache the result
    repoDetailCache.set(cacheKey, repository);
    return repository;
  } catch (error) {
    console.error('Error fetching GitHub repository details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch repository details: ${errorMessage}`);
  }
}

/**
 * Get community statistics for a repository
 * @param owner Repository owner
 * @param repo Repository name
 * @returns Community statistics
 */
export async function getCommunityStats(owner?: string, repo?: string): Promise<CommunityStats> {
  // If no owner/repo provided, return default/empty stats
  if (!owner || !repo) {
    return {
      totalQueries: 0,
      totalUsers: 0,
      activeRepositories: 0,
      successfulContributions: 0,
      averageSatisfaction: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    // In a real implementation, this would fetch actual community stats
    // For now, we'll return mock data
    return {
      totalQueries: 0, // Would be the total number of queries/views
      totalUsers: 0,   // Would be the number of unique users
      activeRepositories: 0, // Would be the number of active repositories
      successfulContributions: 0, // Would be the number of successful contributions
      averageSatisfaction: 0, // Would be the average satisfaction score (0-5)
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching community stats:', error);
    // Return default stats on error
    return {
      totalQueries: 0,
      totalUsers: 0,
      activeRepositories: 0,
      successfulContributions: 0,
      averageSatisfaction: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Repository structure interface for architecture analysis
 */
interface RepositoryStructureItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  children?: RepositoryStructureItem[];
  relevant?: boolean;
}

/**
 * Fetches repository structure from GitHub API
 * @param owner Repository owner
 * @param repo Repository name  
 * @param path Path within the repository (empty for root)
 * @param maxDepth Maximum depth to traverse
 * @returns Repository structure tree
 */
export async function getRepositoryStructure(
  owner: string, 
  repo: string, 
  path: string = '', 
  maxDepth: number = 3
): Promise<RepositoryStructureItem[]> {
  try {
    const url = path 
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      : `https://api.github.com/repos/${owner}/${repo}/contents`;
    
    const response = await makeGitHubRequest<any[]>(url);
    const items: RepositoryStructureItem[] = [];
    
    for (const item of response) {
      const structureItem: RepositoryStructureItem = {
        name: item.name,
        path: item.path,
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size,
        relevant: undefined // Will be determined by the analyzer
      };
      
      // Recursively fetch subdirectories if we haven't reached max depth
      if (item.type === 'dir' && maxDepth > 0) {
        try {
          structureItem.children = await getRepositoryStructure(owner, repo, item.path, maxDepth - 1);
        } catch (error) {
          console.warn(`Failed to fetch contents of ${item.path}:`, error);
          structureItem.children = [];
        }
      }
      
      items.push(structureItem);
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching repository structure for ${owner}/${repo}/${path}:`, error);
    throw error;
  }
}
