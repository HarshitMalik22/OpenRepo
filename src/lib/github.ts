// Cache to avoid hitting the API rate limit during development
let repoCache: Repository[] | null = null;
let repoDetailCache = new Map<string, Repository>();
let communityStatsCache: any | null = null;

import { enhanceRepository, getPersonalizedRecommendations, filterRepositories } from './recommendation-engine';
import type { Repository, UserPreferences, RepositoryFilters, CommunityStats } from './types';

// Fetches a list of popular repositories from the GitHub API
export async function getPopularRepos(useCache = true): Promise<Repository[]> {
  if (useCache && repoCache) {
    return repoCache;
  }

  try {
    // Fetch multiple queries to get diverse repositories
    const queries = [
      'stars:>10000&sort=stars&order=desc&per_page=15',
      'created:>=2023-01-01&sort=stars&order=desc&per_page=10',
      'topic:hacktoberfest&sort=stars&order=desc&per_page=10',
      'good-first-issues:>5&sort=stars&order=desc&per_page=10'
    ];

    const promises = queries.map(query => 
      fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        },
        next: {
          revalidate: 3600,
        }
      })
    );

    const responses = await Promise.all(promises);
    const allRepos: any[] = [];
    const seenIds = new Set();

    for (const response of responses) {
      if (!response.ok) {
        console.error('GitHub API response not OK:', await response.text());
        continue;
      }
      
      const data = await response.json();
      
      // Deduplicate repositories
      data.items.forEach((repo: any) => {
        if (!seenIds.has(repo.id)) {
          seenIds.add(repo.id);
          allRepos.push(repo);
        }
      });
    }

    // Enhance repositories with additional metadata
    const enhancedRepos = allRepos.map((repo: any) => enhanceRepository(repo));
    repoCache = enhancedRepos;
    return enhancedRepos;
  } catch (error) {
    console.error('Failed to fetch popular repos:', error);
    return [];
  }
}

// Get personalized recommendations based on user preferences
export async function getRecommendedRepos(preferences: UserPreferences, limit: number = 10): Promise<Repository[]> {
  const allRepos = await getPopularRepos();
  return getPersonalizedRecommendations(allRepos, preferences, limit);
}

// Get filtered repositories based on filters
export async function getFilteredRepos(filters: RepositoryFilters): Promise<Repository[]> {
  const allRepos = await getPopularRepos();
  return filterRepositories(allRepos, filters);
}

// Fetches details for a single repository from the GitHub API with enhanced data
export async function getRepo(fullName: string, useCache = true): Promise<Repository | null> {
  if (useCache && repoDetailCache.has(fullName)) {
    return repoDetailCache.get(fullName) || null;
  }

  try {
    // Fetch repository details
    const [repoResponse, issuesResponse, contributorsResponse, commitsResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${fullName}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }),
      fetch(`https://api.github.com/repos/${fullName}/issues?state=open&labels=good%20first%20issue&per_page=1`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }),
      fetch(`https://api.github.com/repos/${fullName}/contributors?per_page=100`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }),
      fetch(`https://api.github.com/repos/${fullName}/commits?per_page=30&since=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      })
    ]);

    if (!repoResponse.ok) {
      console.error(`GitHub API response not OK for ${fullName}:`, await repoResponse.text());
      return null;
    }

    const repoData = await repoResponse.json();
    const issuesData = issuesResponse.ok ? await issuesResponse.json() : [];
    const contributorsData = contributorsResponse.ok ? await contributorsResponse.json() : [];
    const commitsData = commitsResponse.ok ? await commitsResponse.json() : [];

    // Add real data to repository
    repoData.good_first_issues_count = issuesData.length || 0;
    repoData.contributor_count = contributorsData.length || 0;
    repoData.recent_commits_count = commitsData.length || 0;

    // Enhance repository with additional metadata
    const enhancedRepo = enhanceRepository(repoData);
    repoDetailCache.set(fullName, enhancedRepo);
    return enhancedRepo;
  } catch (error) {
    console.error(`Failed to fetch repo ${fullName}:`, error);
    return null;
  }
}
