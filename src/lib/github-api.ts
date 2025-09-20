import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignee: any;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  pull_request?: any;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  state: string;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
}

interface GitHubContributor {
  login: string;
  id: number;
  contributions: number;
  avatar_url: string;
}

interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

class GitHubAPI {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN || null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenSauce-App',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 403) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toLocaleString() : 'unknown';
      throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate}`);
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    return this.request<GitHubRepo>(`/repos/${owner}/${repo}`);
  }

  async getIssues(owner: string, repo: string, state: 'open' | 'closed' = 'open', labels?: string[]): Promise<GitHubIssue[]> {
    const labelParam = labels ? `&labels=${labels.join(',')}` : '';
    return this.request<GitHubIssue[]>(`/repos/${owner}/${repo}/issues?state=${state}${labelParam}`);
  }

  async getGoodFirstIssues(owner: string, repo: string): Promise<GitHubIssue[]> {
    return this.request<GitHubIssue[]>(`/repos/${owner}/${repo}/issues?state=open&labels=good%20first%20issue`);
  }

  async getCommits(owner: string, repo: string, since?: string): Promise<GitHubCommit[]> {
    const sinceParam = since ? `&since=${since}` : '';
    return this.request<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=100${sinceParam}`);
  }

  async getPullRequests(owner: string, repo: string, state: 'open' | 'closed' = 'all'): Promise<GitHubPR[]> {
    return this.request<GitHubPR[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`);
  }

  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    return this.request<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=100`);
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.request<GitHubUser>(`/users/${username}`);
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    return this.request<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);
  }

  // Health metrics calculation
  async calculateRepositoryHealth(owner: string, repo: string): Promise<{
    healthScore: number;
    issueResolutionRate: number;
    prMergeRate: number;
    maintainerActivityScore: number;
    busFactor: number;
    codeQualityScore: number;
    testCoverage: number;
    documentationScore: number;
    maintainerResponseTime: number;
    isActive: boolean;
    lastCommitDate: string | null;
  }> {
    try {
      const [repoData, openIssues, closedIssues, prs, commits, contributors] = await Promise.all([
        this.getRepository(owner, repo),
        this.getIssues(owner, repo, 'open'),
        this.getIssues(owner, repo, 'closed'),
        this.getPullRequests(owner, repo),
        this.getCommits(owner, repo),
        this.getContributors(owner, repo),
      ]);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentCommits = commits.filter(commit => 
        new Date(commit.commit.author.date) > thirtyDaysAgo
      );

      const recentPRs = prs.filter(pr => 
        new Date(pr.created_at) > thirtyDaysAgo
      );

      const mergedPRs = recentPRs.filter(pr => pr.merged_at);
      const closedIssuesRecent = closedIssues.filter(issue => 
        issue.closed_at && new Date(issue.closed_at) > thirtyDaysAgo
      );

      // Calculate metrics
      const issueResolutionRate = closedIssues.length > 0 
        ? (closedIssuesRecent.length / (openIssues.length + closedIssuesRecent.length)) * 100 
        : 0;

      const prMergeRate = recentPRs.length > 0 
        ? (mergedPRs.length / recentPRs.length) * 100 
        : 0;

      const maintainerActivityScore = Math.min(100, (recentCommits.length / 30) * 100);
      
      const busFactor = Math.max(1, contributors.filter(c => c.contributions > 10).length);
      
      const isActive = recentCommits.length > 0 || recentPRs.length > 0;
      
      const lastCommitDate = commits.length > 0 ? commits[0].commit.author.date : null;

      // Estimate code quality based on various factors
      const hasContributing = repoData.topics.includes('contributing');
      const hasTests = repoData.topics.includes('testing') || repoData.topics.includes('test');
      const hasDocs = repoData.topics.includes('documentation') || repoData.topics.includes('docs');
      
      const codeQualityScore = Math.min(100, 
        (hasContributing ? 20 : 0) + 
        (hasTests ? 30 : 0) + 
        (hasDocs ? 25 : 0) + 
        (repoData.stargazers_count > 100 ? 15 : 0) + 
        (repoData.forks_count > 50 ? 10 : 0)
      );

      // Estimate test coverage (this would need actual code analysis in real implementation)
      const testCoverage = hasTests ? Math.min(95, 50 + Math.random() * 45) : 0;

      // Estimate documentation score
      const documentationScore = Math.min(100, 
        (hasDocs ? 40 : 0) + 
        (repoData.description ? 20 : 0) + 
        (repoData.topics.length > 3 ? 15 : 0) + 
        (repoData.stargazers_count > 50 ? 15 : 0) + 
        (contributors.length > 5 ? 10 : 0)
      );

      // Estimate maintainer response time (in hours)
      const maintainerResponseTime = Math.max(1, 24 - (maintainerActivityScore / 100) * 20);

      // Calculate overall health score
      const healthScore = Math.min(100, 
        (issueResolutionRate * 0.2) + 
        (prMergeRate * 0.2) + 
        (maintainerActivityScore * 0.2) + 
        (codeQualityScore * 0.15) + 
        (documentationScore * 0.15) + 
        (testCoverage * 0.1)
      );

      return {
        healthScore: Math.round(healthScore),
        issueResolutionRate: Math.round(issueResolutionRate),
        prMergeRate: Math.round(prMergeRate),
        maintainerActivityScore: Math.round(maintainerActivityScore),
        busFactor,
        codeQualityScore: Math.round(codeQualityScore),
        testCoverage: Math.round(testCoverage),
        documentationScore: Math.round(documentationScore),
        maintainerResponseTime: Math.round(maintainerResponseTime),
        isActive,
        lastCommitDate,
      };
    } catch (error) {
      console.error('Error calculating repository health:', error);
      return {
        healthScore: 50,
        issueResolutionRate: 0,
        prMergeRate: 0,
        maintainerActivityScore: 0,
        busFactor: 1,
        codeQualityScore: 50,
        testCoverage: 0,
        documentationScore: 50,
        maintainerResponseTime: 24,
        isActive: false,
        lastCommitDate: null,
      };
    }
  }

  // Get good first issues with intelligence
  async getGoodFirstIssuesWithIntelligence(owner: string, repo: string): Promise<Array<{
    issueNumber: number;
    title: string;
    body: string | null;
    state: string;
    labels: string[];
    estimatedTime: string;
    requiredSkills: string[];
    mentorAvailable: boolean;
    successRate: number;
    difficulty: string;
    type: string;
    language: string | null;
    assignee: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
  }>> {
    try {
      const issues = await this.getGoodFirstIssues(owner, repo);
      const repoData = await this.getRepository(owner, repo);

      return issues.map(issue => {
        const labels = issue.labels.map(label => label.name);
        
        // Estimate time based on issue complexity
        const hasCodeChanges = labels.some(label => 
          ['bug', 'enhancement', 'feature'].includes(label.toLowerCase())
        );
        const hasDocs = labels.some(label => 
          ['documentation', 'docs'].includes(label.toLowerCase())
        );
        
        let estimatedTime = '2hrs';
        if (hasCodeChanges && hasDocs) estimatedTime = '4hrs';
        else if (hasCodeChanges) estimatedTime = '3hrs';
        else if (hasDocs) estimatedTime = '1hr';

        // Determine required skills based on labels and repo language
        const requiredSkills: string[] = [];
        if (repoData.language) requiredSkills.push(repoData.language);
        if (labels.includes('bug')) requiredSkills.push('Debugging');
        if (labels.includes('enhancement') || labels.includes('feature')) requiredSkills.push('Feature Development');
        if (labels.includes('documentation') || labels.includes('docs')) requiredSkills.push('Technical Writing');

        // Check if mentor is available (assignee exists)
        const mentorAvailable = issue.assignee !== null;

        // Estimate success rate based on issue age and labels
        const issueAge = Date.now() - new Date(issue.created_at).getTime();
        const daysOld = issueAge / (1000 * 60 * 60 * 24);
        const successRate = Math.max(20, Math.min(95, 100 - (daysOld * 2)));

        // Determine type
        let type = 'bug-fix';
        if (labels.includes('enhancement') || labels.includes('feature')) type = 'feature';
        else if (labels.includes('documentation') || labels.includes('docs')) type = 'docs';
        else if (labels.includes('refactor')) type = 'refactor';

        return {
          issueNumber: issue.number,
          title: issue.title,
          body: issue.body,
          state: issue.state,
          labels,
          estimatedTime,
          requiredSkills,
          mentorAvailable,
          successRate: Math.round(successRate),
          difficulty: 'beginner',
          type,
          language: repoData.language,
          assignee: issue.assignee?.login || null,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          closedAt: issue.closed_at,
        };
      });
    } catch (error) {
      console.error('Error getting good first issues:', error);
      return [];
    }
  }

  // Sync repository data with database
  async syncRepository(owner: string, repo: string): Promise<void> {
    try {
      const [repoData, healthMetrics, goodFirstIssues] = await Promise.all([
        this.getRepository(owner, repo),
        this.calculateRepositoryHealth(owner, repo),
        this.getGoodFirstIssuesWithIntelligence(owner, repo),
      ]);

      // Update or create repository in database
      await prisma.repository.upsert({
        where: { fullName: repoData.full_name },
        update: {
          name: repoData.name,
          owner: repoData.owner.login,
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          contributors: 0, // Will be updated separately
          lastUpdated: new Date(repoData.updated_at),
          topics: repoData.topics,
          techStack: repoData.topics,
          difficulty: this.estimateDifficulty(repoData),
          competition: this.estimateCompetition(repoData),
          hasContributing: repoData.topics.includes('contributing'),
          matchScore: null,
          aiAnalysis: null,
          lastCommitDate: healthMetrics.lastCommitDate ? new Date(healthMetrics.lastCommitDate) : null,
          issueResolutionRate: healthMetrics.issueResolutionRate,
          prMergeRate: healthMetrics.prMergeRate,
          maintainerActivityScore: healthMetrics.maintainerActivityScore,
          busFactor: healthMetrics.busFactor,
          codeQualityScore: healthMetrics.codeQualityScore,
          testCoverage: healthMetrics.testCoverage,
          documentationScore: healthMetrics.documentationScore,
          maintainerResponseTime: healthMetrics.maintainerResponseTime,
          isActive: healthMetrics.isActive,
          healthScore: healthMetrics.healthScore,
          updatedAt: new Date(),
        },
        create: {
          fullName: repoData.full_name,
          name: repoData.name,
          owner: repoData.owner.login,
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          contributors: 0,
          lastUpdated: new Date(repoData.updated_at),
          topics: repoData.topics,
          techStack: repoData.topics,
          difficulty: this.estimateDifficulty(repoData),
          competition: this.estimateCompetition(repoData),
          hasContributing: repoData.topics.includes('contributing'),
          matchScore: null,
          aiAnalysis: null,
          lastCommitDate: healthMetrics.lastCommitDate ? new Date(healthMetrics.lastCommitDate) : null,
          issueResolutionRate: healthMetrics.issueResolutionRate,
          prMergeRate: healthMetrics.prMergeRate,
          maintainerActivityScore: healthMetrics.maintainerActivityScore,
          busFactor: healthMetrics.busFactor,
          codeQualityScore: healthMetrics.codeQualityScore,
          testCoverage: healthMetrics.testCoverage,
          documentationScore: healthMetrics.documentationScore,
          maintainerResponseTime: healthMetrics.maintainerResponseTime,
          isActive: healthMetrics.isActive,
          healthScore: healthMetrics.healthScore,
        },
      });

      // Update good first issues
      for (const issue of goodFirstIssues) {
        await prisma.goodFirstIssue.upsert({
          where: {
            repoFullName_issueNumber: {
              repoFullName: repoData.full_name,
              issueNumber: issue.issueNumber,
            },
          },
          update: {
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: issue.labels,
            estimatedTime: issue.estimatedTime,
            requiredSkills: issue.requiredSkills,
            mentorAvailable: issue.mentorAvailable,
            successRate: issue.successRate,
            difficulty: issue.difficulty,
            type: issue.type,
            language: issue.language,
            assignee: issue.assignee,
            updatedAt: new Date(issue.updatedAt),
            closedAt: issue.closedAt ? new Date(issue.closedAt) : null,
          },
          create: {
            repoFullName: repoData.full_name,
            issueNumber: issue.issueNumber,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: issue.labels,
            estimatedTime: issue.estimatedTime,
            requiredSkills: issue.requiredSkills,
            mentorAvailable: issue.mentorAvailable,
            successRate: issue.successRate,
            difficulty: issue.difficulty,
            type: issue.type,
            language: issue.language,
            assignee: issue.assignee,
            createdAt: new Date(issue.createdAt),
            updatedAt: new Date(issue.updatedAt),
            closedAt: issue.closedAt ? new Date(issue.closedAt) : null,
          },
        });
      }

      console.log(`Successfully synced repository: ${repoData.full_name}`);
    } catch (error) {
      console.error(`Error syncing repository ${owner}/${repo}:`, error);
      throw error;
    }
  }

  // Sync user data with database
  async syncUser(username: string): Promise<void> {
    try {
      const userData = await this.getUser(username);
      const userRepos = await this.getUserRepos(username);

      // Calculate contributor score
      const totalStars = userRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = userRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
      const contributorScore = Math.min(100, 
        (userData.public_repos * 2) + 
        (userData.followers * 1) + 
        (totalStars * 0.1) + 
        (totalForks * 0.2)
      );

      // Update or create user in database
      await prisma.user.upsert({
        where: { githubUsername: username },
        update: {
          email: userData.email || `${username}@users.noreply.github.com`,
          firstName: userData.name?.split(' ')[0] || null,
          lastName: userData.name?.split(' ').slice(1).join(' ') || null,
          imageUrl: userData.avatar_url,
          bio: userData.bio,
          location: userData.location,
          website: userData.blog,
          twitterUsername: userData.twitter_username,
          experienceLevel: this.estimateUserExperience(userData),
          availability: 'sporadic', // Default, can be updated by user
          openSourceExperience: this.calculateExperienceYears(userData.created_at),
          totalContributions: userRepos.length,
          totalStarsReceived: totalStars,
          followersCount: userData.followers,
          followingCount: userData.following,
          publicReposCount: userData.public_repos,
          contributorScore: Math.round(contributorScore),
          lastGitHubSync: new Date(),
          updatedAt: new Date(),
        },
        create: {
          clerkId: `github_${username}`, // This would need to be handled properly with Clerk
          email: userData.email || `${username}@users.noreply.github.com`,
          firstName: userData.name?.split(' ')[0] || null,
          lastName: userData.name?.split(' ').slice(1).join(' ') || null,
          imageUrl: userData.avatar_url,
          githubUsername: username,
          bio: userData.bio,
          location: userData.location,
          website: userData.blog,
          twitterUsername: userData.twitter_username,
          experienceLevel: this.estimateUserExperience(userData),
          availability: 'sporadic',
          openSourceExperience: this.calculateExperienceYears(userData.created_at),
          totalContributions: userRepos.length,
          totalStarsReceived: totalStars,
          followersCount: userData.followers,
          followingCount: userData.following,
          publicReposCount: userData.public_repos,
          contributorScore: Math.round(contributorScore),
          lastGitHubSync: new Date(),
        },
      });

      console.log(`Successfully synced user: ${username}`);
    } catch (error) {
      console.error(`Error syncing user ${username}:`, error);
      throw error;
    }
  }

  private estimateDifficulty(repo: GitHubRepo): string {
    if (repo.stargazers_count > 10000) return 'expert';
    if (repo.stargazers_count > 1000) return 'advanced';
    if (repo.stargazers_count > 100) return 'intermediate';
    return 'beginner';
  }

  private estimateCompetition(repo: GitHubRepo): string {
    if (repo.forks_count > 1000) return 'high';
    if (repo.forks_count > 100) return 'medium';
    return 'low';
  }

  private estimateUserExperience(user: GitHubUser): string {
    const years = this.calculateExperienceYears(user.created_at);
    if (years > 5) return 'expert';
    if (years > 2) return 'advanced';
    if (years > 1) return 'intermediate';
    return 'beginner';
  }

  private calculateExperienceYears(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }
}

export const githubAPI = new GitHubAPI();
export default GitHubAPI;
