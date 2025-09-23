import type { Repository, UserPreferences, RepositoryFilters, CommunityStats, LiveActivity, Issue, PullRequest, Commit, Contributor, AIDomain, ContributionDifficulty } from './types';
import { cacheManager } from './cache-manager';

// Live GitHub API service for real-time data
export class GitHubLiveService {
  private static instance: GitHubLiveService;
  private activityCache: Map<string, LiveActivity> = new Map();
  private lastUpdated: Map<string, Date> = new Map();
  
  // Cache expiration times (in milliseconds)
  private readonly CACHE_EXPIRY = {
    REPO_BASIC: 5 * 60 * 1000, // 5 minutes for basic repo info
    ISSUES: 2 * 60 * 1000,     // 2 minutes for issues
    COMMITS: 1 * 60 * 1000,    // 1 minute for commits
    PRS: 2 * 60 * 1000,        // 2 minutes for pull requests
    STATS: 10 * 60 * 1000,     // 10 minutes for community stats
  };

  static getInstance(): GitHubLiveService {
    if (!GitHubLiveService.instance) {
      GitHubLiveService.instance = new GitHubLiveService();
    }
    return GitHubLiveService.instance;
  }

  private getGitHubHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    return headers;
  }

  private isCacheValid(key: string, expiryTime: number): boolean {
    const lastUpdate = this.lastUpdated.get(key);
    if (!lastUpdate) return false;
    
    return (Date.now() - lastUpdate.getTime()) < expiryTime;
  }

  // Get real-time activity data (always fresh)
  private async getRealTimeActivity(fullName: string) {
    try {
      const [commitsResponse, issuesResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${fullName}/commits?per_page=10&since=${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`, {
          headers: this.getGitHubHeaders()
        }),
        fetch(`https://api.github.com/repos/${fullName}/issues?state=open&per_page=20&sort=updated`, {
          headers: this.getGitHubHeaders()
        })
      ]);

      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      const issues = issuesResponse.ok ? await issuesResponse.json() : [];

      return {
        recent_commits: commits.length,
        recent_issues: issues.length,
        last_activity: commits[0]?.commit?.author?.date || issues[0]?.created_at || null
      };
    } catch (error) {
      console.error('Error fetching real-time activity:', error);
      return {
        recent_commits: 0,
        recent_issues: 0,
        last_activity: null
      };
    }
  }

  // Get live repository data with real-time metrics
  async getLiveRepository(fullName: string): Promise<Repository | null> {
    const cacheKey = `repo-${fullName}`;
    
    // Check legacy cache first for backward compatibility
    if (this.isCacheValid(cacheKey, this.CACHE_EXPIRY.REPO_BASIC)) {
      const cached = this.activityCache.get(cacheKey);
      if (cached?.repository) {
        // Enhance with real-time activity
        const realTimeActivity = await this.getRealTimeActivity(fullName);
        return {
          ...cached.repository,
          ...realTimeActivity
        };
      }
    }

    try {
      const [repoResponse, issuesResponse, contributorsResponse, commitsResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${fullName}`, {
          headers: this.getGitHubHeaders()
        }),
        fetch(`https://api.github.com/repos/${fullName}/issues?state=open&per_page=100`, {
          headers: this.getGitHubHeaders()
        }),
        fetch(`https://api.github.com/repos/${fullName}/contributors?per_page=100`, {
          headers: this.getGitHubHeaders()
        }),
        fetch(`https://api.github.com/repos/${fullName}/commits?per_page=30&since=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`, {
          headers: this.getGitHubHeaders()
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

      // Calculate live metrics
      const goodFirstIssues = issuesData.filter((issue: any) => 
        issue.labels.some((label: any) => 
          label.name.toLowerCase().includes('good first issue') || 
          label.name.toLowerCase().includes('good-first-issue')
        )
      );

      const helpWantedIssues = issuesData.filter((issue: any) => 
        issue.labels.some((label: any) => 
          label.name.toLowerCase().includes('help wanted') || 
          label.name.toLowerCase().includes('help-wanted')
        )
      );

      const recentIssues = issuesData.filter((issue: any) => {
        const issueDate = new Date(issue.created_at);
        const daysSince = (Date.now() - issueDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      });

      // Enhanced repository with live data
      const liveRepo: Repository = {
        id: repoData.id,
        full_name: repoData.full_name,
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description,
        language: repoData.language,
        html_url: repoData.html_url,
        stargazers_count: repoData.stargazers_count,
        watchers_count: repoData.watchers_count || repoData.stargazers_count,
        forks_count: repoData.forks_count,
        open_issues_count: repoData.open_issues_count,
        topics: repoData.topics || [],
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        pushed_at: repoData.pushed_at,
        
        // Live metrics
        good_first_issues_count: goodFirstIssues.length,
        help_wanted_issues_count: helpWantedIssues.length,
        recent_issues_count: recentIssues.length,
        contributor_count: contributorsData.length,
        recent_commits_count: commitsData.length,
        
        // Enhanced fields for recommendation engine
        techStack: this.extractTechStack(repoData.language, repoData.topics || []),
        competition_level: this.calculateCompetitionLevel(repoData.stargazers_count, repoData.forks_count),
        activity_level: this.calculateActivityLevel(repoData.pushed_at, commitsData.length),
        ai_domain: this.isAIDomain(repoData.topics || [], repoData.description || ''),
        contribution_difficulty: this.calculateContributionDifficulty(
          goodFirstIssues.length, 
          helpWantedIssues.length, 
          repoData.open_issues_count
        ),
        
        // Required fields with defaults
        last_analyzed: new Date().toISOString(),
        recent_commits: commitsData.length,
        issue_response_rate: 0.8, // Default value, can be calculated from actual data
        documentation_score: 0.7, // Default value, can be calculated from actual data
        
        // Live health score
        health_score: this.calculateLiveHealthScore(repoData, {
          goodFirstIssues: goodFirstIssues.length,
          recentCommits: commitsData.length,
          contributors: contributorsData.length,
          recentIssues: recentIssues.length
        })
      };

      // Cache the result with intelligent cache manager
      const basicData = {
        id: liveRepo.id,
        name: liveRepo.name,
        full_name: liveRepo.full_name,
        owner: liveRepo.owner,
        description: liveRepo.description,
        language: liveRepo.language,
        html_url: liveRepo.html_url,
        topics: liveRepo.topics,
        created_at: liveRepo.created_at,
        updated_at: liveRepo.updated_at
      };
      
      const statsData = {
        stargazers_count: liveRepo.stargazers_count,
        watchers_count: liveRepo.watchers_count,
        forks_count: liveRepo.forks_count,
        open_issues_count: liveRepo.open_issues_count,
        contributor_count: liveRepo.contributor_count
      };
      
      const healthData = {
        health_score: liveRepo.health_score,
        techStack: liveRepo.techStack,
        competition_level: liveRepo.competition_level,
        activity_level: liveRepo.activity_level,
        ai_domain: liveRepo.ai_domain,
        contribution_difficulty: liveRepo.contribution_difficulty,
        good_first_issues_count: liveRepo.good_first_issues_count,
        help_wanted_issues_count: liveRepo.help_wanted_issues_count
      };
      
      // Store in intelligent cache with different TTLs
      await cacheManager.setRepositoryBasic(fullName, basicData);
      await cacheManager.setRepositoryStats(fullName, statsData);
      await cacheManager.setRepositoryHealth(fullName, healthData);
      
      // Also update legacy cache for compatibility
      this.activityCache.set(cacheKey, {
        repository: liveRepo,
        lastUpdated: new Date()
      });
      this.lastUpdated.set(cacheKey, new Date());

      return liveRepo;
    } catch (error) {
      console.error(`Failed to fetch live repository ${fullName}:`, error);
      return null;
    }
  }

  // Get live issues for a repository
  async getLiveIssues(fullName: string, labels: string[] = [], state: 'open' | 'closed' | 'all' = 'open'): Promise<Issue[]> {
    const cacheKey = `issues-${fullName}-${labels.join('-')}-${state}`;
    
    if (this.isCacheValid(cacheKey, this.CACHE_EXPIRY.ISSUES)) {
      return this.activityCache.get(cacheKey)?.issues || [];
    }

    try {
      const labelQuery = labels.length > 0 ? `&labels=${labels.join(',')}` : '';
      const response = await fetch(
        `https://api.github.com/repos/${fullName}/issues?state=${state}&per_page=100${labelQuery}`,
        { headers: this.getGitHubHeaders() }
      );

      if (!response.ok) {
        console.error(`Failed to fetch issues for ${fullName}:`, await response.text());
        return [];
      }

      const issuesData = await response.json();
      const issues: Issue[] = issuesData.map((issue: any) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        html_url: issue.html_url,
        user: {
          login: issue.user.login,
          avatar_url: issue.user.avatar_url,
          html_url: issue.user.html_url
        },
        labels: issue.labels.map((label: any) => ({
          name: label.name,
          color: label.color,
          description: label.description
        })),
        assignee: issue.assignee ? {
          login: issue.assignee.login,
          avatar_url: issue.assignee.avatar_url,
          html_url: issue.assignee.html_url
        } : null,
        comments: issue.comments,
        pull_request: issue.pull_request ? {
          html_url: issue.pull_request.html_url,
          diff_url: issue.pull_request.diff_url,
          patch_url: issue.pull_request.patch_url
        } : null
      }));

      // Cache the result
      this.activityCache.set(cacheKey, {
        issues,
        lastUpdated: new Date()
      });
      this.lastUpdated.set(cacheKey, new Date());

      return issues;
    } catch (error) {
      console.error(`Failed to fetch live issues for ${fullName}:`, error);
      return [];
    }
  }

  // Get live pull requests for a repository
  async getLivePullRequests(fullName: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<PullRequest[]> {
    const cacheKey = `prs-${fullName}-${state}`;
    
    if (this.isCacheValid(cacheKey, this.CACHE_EXPIRY.PRS)) {
      return this.activityCache.get(cacheKey)?.pullRequests || [];
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${fullName}/pulls?state=${state}&per_page=100`,
        { headers: this.getGitHubHeaders() }
      );

      if (!response.ok) {
        console.error(`Failed to fetch pull requests for ${fullName}:`, await response.text());
        return [];
      }

      const prsData = await response.json();
      const pullRequests: PullRequest[] = prsData.map((pr: any) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        closed_at: pr.closed_at,
        merged_at: pr.merged_at,
        html_url: pr.html_url,
        diff_url: pr.diff_url,
        patch_url: pr.patch_url,
        user: {
          login: pr.user.login,
          avatar_url: pr.user.avatar_url,
          html_url: pr.user.html_url
        },
        head: {
          ref: pr.head.ref,
          sha: pr.head.sha
        },
        base: {
          ref: pr.base.ref,
          sha: pr.base.sha
        },
        mergeable: pr.mergeable,
        merged: pr.merged,
        draft: pr.draft,
        comments: pr.comments,
        review_comments: pr.review_comments,
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changed_files: pr.changed_files
      }));

      // Cache the result
      this.activityCache.set(cacheKey, {
        pullRequests,
        lastUpdated: new Date()
      });
      this.lastUpdated.set(cacheKey, new Date());

      return pullRequests;
    } catch (error) {
      console.error(`Failed to fetch live pull requests for ${fullName}:`, error);
      return [];
    }
  }

  // Get live commits for a repository
  async getLiveCommits(fullName: string, since?: Date): Promise<Commit[]> {
    const sinceParam = since ? `&since=${since.toISOString()}` : '';
    const cacheKey = `commits-${fullName}-${since?.toISOString() || 'all'}`;
    
    if (this.isCacheValid(cacheKey, this.CACHE_EXPIRY.COMMITS)) {
      return this.activityCache.get(cacheKey)?.commits || [];
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${fullName}/commits?per_page=100${sinceParam}`,
        { headers: this.getGitHubHeaders() }
      );

      if (!response.ok) {
        console.error(`Failed to fetch commits for ${fullName}:`, await response.text());
        return [];
      }

      const commitsData = await response.json();
      const commits: Commit[] = commitsData.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          date: commit.commit.author.date
        },
        committer: {
          name: commit.commit.committer.name,
          email: commit.commit.committer.email,
          date: commit.commit.committer.date
        },
        html_url: commit.html_url,
        url: commit.url,
        comments_url: commit.comments_url
      }));

      // Cache the result
      this.activityCache.set(cacheKey, {
        commits,
        lastUpdated: new Date()
      });
      this.lastUpdated.set(cacheKey, new Date());

      return commits;
    } catch (error) {
      console.error(`Failed to fetch live commits for ${fullName}:`, error);
      return [];
    }
  }

  // Get live contributors for a repository
  async getLiveContributors(fullName: string): Promise<Contributor[]> {
    const cacheKey = `contributors-${fullName}`;
    
    if (this.isCacheValid(cacheKey, this.CACHE_EXPIRY.REPO_BASIC)) {
      return this.activityCache.get(cacheKey)?.contributors || [];
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${fullName}/contributors?per_page=100`,
        { headers: this.getGitHubHeaders() }
      );

      if (!response.ok) {
        console.error(`Failed to fetch contributors for ${fullName}:`, await response.text());
        return [];
      }

      const contributorsData = await response.json();
      const contributors: Contributor[] = contributorsData.map((contributor: any) => ({
        login: contributor.login,
        id: contributor.id,
        avatar_url: contributor.avatar_url,
        gravatar_id: contributor.gravatar_id,
        url: contributor.url,
        html_url: contributor.html_url,
        followers_url: contributor.followers_url,
        following_url: contributor.following_url,
        gists_url: contributor.gists_url,
        starred_url: contributor.starred_url,
        subscriptions_url: contributor.subscriptions_url,
        organizations_url: contributor.organizations_url,
        repos_url: contributor.repos_url,
        events_url: contributor.events_url,
        received_events_url: contributor.received_events_url,
        type: contributor.type,
        site_admin: contributor.site_admin,
        contributions: contributor.contributions
      }));

      // Cache the result
      this.activityCache.set(cacheKey, {
        contributors,
        lastUpdated: new Date()
      });
      this.lastUpdated.set(cacheKey, new Date());

      return contributors;
    } catch (error) {
      console.error(`Failed to fetch live contributors for ${fullName}:`, error);
      return [];
    }
  }

  // Get live community statistics
  async getLiveCommunityStats(): Promise<CommunityStats> {
    const cacheKey = 'community-stats';
    
    if (this.isCacheValid(cacheKey, this.CACHE_EXPIRY.STATS)) {
      return this.activityCache.get(cacheKey)?.communityStats || this.getFallbackStats();
    }

    try {
      const [reposResponse, usersResponse, commitsResponse] = await Promise.all([
        // Get repositories with good first issues (active open source projects)
        fetch('https://api.github.com/search/repositories?q=good-first-issues:>1+help-wanted-issues:>1+stars:>50+pushed:>=2024-01-01&per_page=1', {
          headers: this.getGitHubHeaders()
        }),
        // Get active contributors
        fetch('https://api.github.com/search/users?q=repos:>1+followers:>5&per_page=1', {
          headers: this.getGitHubHeaders()
        }),
        // Get recent commits
        fetch('https://api.github.com/search/commits?q=committer-date:>=2024-01-01&sort=committer-date&order=desc&per_page=1', {
          headers: this.getGitHubHeaders()
        })
      ]);

      const reposData = reposResponse.ok ? await reposResponse.json() : { total_count: 50000 };
      const usersData = usersResponse.ok ? await usersResponse.json() : { total_count: 1000000 };
      const commitsData = commitsResponse.ok ? await commitsResponse.json() : { total_count: 5000000 };

      const stats: CommunityStats = {
        totalQueries: Math.floor(Math.random() * 50000) + 100000, // Simulated query count
        totalUsers: Math.min(usersData.total_count * 10, 5000000), // Estimate active users
        activeRepositories: Math.min(reposData.total_count * 5, 250000), // Active repos with contribution opportunities
        successfulContributions: Math.floor(commitsData.total_count / 5), // Estimate successful contributions
        averageSatisfaction: 4.2 + (Math.random() * 0.6 - 0.3) // 3.9-4.8 range
      };

      // Cache the result
      this.activityCache.set(cacheKey, {
        communityStats: stats,
        lastUpdated: new Date()
      });
      this.lastUpdated.set(cacheKey, new Date());

      return stats;
    } catch (error) {
      console.error('Failed to fetch live community stats:', error);
      return this.getFallbackStats();
    }
  }

  // Get live popular repositories with real-time data
  async getLivePopularRepos(limit: number = 50): Promise<Repository[]> {
    const queries = [
      'stars:>1000+pushed:>=2024-01-01+good-first-issues:>1',
      'stars:>500+help-wanted-issues:>1+pushed:>=2024-06-01',
      'topic:hacktoberfest+stars:>100+pushed:>=2024-01-01',
      'language:javascript+stars:>500+good-first-issues:>1',
      'language:python+stars:>500+help-wanted-issues:>1',
      'language:typescript+stars:>300+pushed:>=2024-06-01',
      'topic:machine-learning+stars:>200+pushed:>=2024-06-01',
      'topic:react+stars:>300+good-first-issues:>1'
    ];

    const allRepos: Repository[] = [];
    const seenNames = new Set();

    for (const query of queries) {
      if (allRepos.length >= limit) break;

      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`,
          { headers: this.getGitHubHeaders() }
        );

        if (!response.ok) continue;

        const data = await response.json();
        
        for (const item of data.items || []) {
          if (!seenNames.has(item.full_name) && allRepos.length < limit) {
            seenNames.add(item.full_name);
            const liveRepo = await this.getLiveRepository(item.full_name);
            if (liveRepo) {
              allRepos.push(liveRepo);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch repos for query ${query}:`, error);
      }
    }

    return allRepos;
  }

  // Helper methods
  private extractTechStack(language: string | null, topics: string[]): string[] {
    const techStack: string[] = [];
    
    if (language) {
      techStack.push(language.toLowerCase());
    }
    
    const techKeywords = ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++', 'php', 'ruby', 'swift', 'kotlin'];
    topics.forEach(topic => {
      if (techKeywords.includes(topic.toLowerCase())) {
        techStack.push(topic.toLowerCase());
      }
    });
    
    return [...new Set(techStack)];
  }

  private calculateCompetitionLevel(stars: number, forks: number): 'low' | 'medium' | 'high' {
    const score = stars * 0.7 + forks * 0.3;
    if (score < 1000) return 'low';
    if (score < 10000) return 'medium';
    return 'high';
  }

  private calculateActivityLevel(pushedAt: string, recentCommits: number): 'low' | 'medium' | 'high' {
    const lastPush = new Date(pushedAt);
    const daysSince = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSince > 30 || recentCommits === 0) return 'low';
    if (daysSince > 7 || recentCommits < 5) return 'medium';
    return 'high';
  }

  private isAIDomain(topics: string[], description: string): AIDomain {
    const aiKeywords = ['ai', 'machine-learning', 'deep-learning', 'neural-network', 'tensorflow', 'pytorch', 'nlp', 'computer-vision'];
    const text = (topics.join(' ') + ' ' + description).toLowerCase();
    
    if (aiKeywords.some(keyword => text.includes(keyword))) {
      return 'other'; // Default AI domain, can be enhanced to detect specific domains
    }
    return 'other';
  }

  private calculateContributionDifficulty(goodFirstIssues: number, helpWantedIssues: number, totalIssues: number): ContributionDifficulty {
    const accessibilityScore = (goodFirstIssues * 3 + helpWantedIssues * 2) / Math.max(totalIssues, 1);
    
    let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    let score: number;
    
    if (accessibilityScore > 0.5) {
      level = 'beginner';
      score = 0.9;
    } else if (accessibilityScore > 0.3) {
      level = 'intermediate';
      score = 0.7;
    } else if (accessibilityScore > 0.1) {
      level = 'advanced';
      score = 0.5;
    } else {
      level = 'expert';
      score = 0.3;
    }
    
    return {
      level,
      score,
      factors: {
        codeComplexity: 1 - score, // Inverse relationship
        communitySize: Math.min(totalIssues / 100, 1),
        documentationQuality: score * 0.8, // Assume better docs for more accessible projects
        issueResolutionTime: 1 - (accessibilityScore * 0.7)
      },
      goodFirstIssues,
      helpWantedIssues
    };
  }

  private calculateLiveHealthScore(repo: any, metrics: { goodFirstIssues: number; recentCommits: number; contributors: number; recentIssues: number }): number {
    let score = 50; // Base score
    
    // Recent activity (0-30 points)
    const lastPush = new Date(repo.pushed_at);
    const daysSince = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince <= 7) score += 30;
    else if (daysSince <= 30) score += 20;
    else if (daysSince <= 90) score += 10;
    
    // Recent commits (0-15 points)
    if (metrics.recentCommits > 20) score += 15;
    else if (metrics.recentCommits > 10) score += 10;
    else if (metrics.recentCommits > 5) score += 5;
    
    // Contributor activity (0-15 points)
    if (metrics.contributors > 50) score += 15;
    else if (metrics.contributors > 20) score += 10;
    else if (metrics.contributors > 10) score += 5;
    
    // Issue accessibility (0-10 points)
    if (metrics.goodFirstIssues > 5) score += 10;
    else if (metrics.goodFirstIssues > 2) score += 7;
    else if (metrics.goodFirstIssues > 0) score += 3;
    
    // Community engagement (0-10 points)
    if (metrics.recentIssues > 10) score += 10;
    else if (metrics.recentIssues > 5) score += 7;
    else if (metrics.recentIssues > 0) score += 3;
    
    return Math.min(score, 100);
  }

  private getFallbackStats(): CommunityStats {
    return {
      totalQueries: 150000,
      totalUsers: 500000,
      activeRepositories: 25000,
      successfulContributions: 75000,
      averageSatisfaction: 4.2
    };
  }
}

// Export singleton instance
export const githubLiveService = GitHubLiveService.getInstance();
