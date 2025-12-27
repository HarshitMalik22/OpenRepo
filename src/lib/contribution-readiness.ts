'use server';

/**
 * @fileOverview Contribution Readiness Score Calculator
 * 
 * Calculates how ready a repository is to receive contributions by analyzing:
 * - Maintainer response times on issues/PRs
 * - Documentation quality (README, CONTRIBUTING.md)
 * - Community health files (CODE_OF_CONDUCT, templates)
 * - First-timer friendliness indicators
 */

import { getGitHubHeadersForContext } from './github-headers';
import { redisCache, CacheTTL } from './redis-cache';

// =============================================================================
// Types
// =============================================================================

export interface ResponseTimeMetrics {
  avgHours: number;
  medianHours: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  sampleSize: number;
}

export interface DocumentationMetrics {
  hasReadme: boolean;
  readmeSize: number;
  hasContributing: boolean;
  hasChangelog: boolean;
  hasLicense: boolean;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface CommunityHealthMetrics {
  codeOfConduct: boolean;
  issueTemplates: boolean;
  prTemplates: boolean;
  discussionsEnabled: boolean;
  healthPercentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface FirstTimerMetrics {
  goodFirstIssueCount: number;
  helpWantedCount: number;
  isFriendly: boolean;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ReadinessMetrics {
  score: number; // 0-100
  tier: 'excellent' | 'good' | 'moderate' | 'challenging' | 'difficult';
  responseTime: ResponseTimeMetrics;
  documentation: DocumentationMetrics;
  communityHealth: CommunityHealthMetrics;
  firstTimer: FirstTimerMetrics;
  breakdown: {
    responseTimeScore: number;
    documentationScore: number;
    communityHealthScore: number;
    firstTimerScore: number;
  };
  analyzedAt: string;
}

// =============================================================================
// Grade & Score Helpers
// =============================================================================

function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function getTierFromScore(score: number): ReadinessMetrics['tier'] {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'moderate';
  if (score >= 25) return 'challenging';
  return 'difficult';
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// =============================================================================
// GitHub API Helpers
// =============================================================================

async function fetchGitHubAPI<T>(url: string): Promise<T | null> {
  try {
    const headers = getGitHubHeadersForContext();
    const response = await fetch(url, { 
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error: ${response.status} for ${url}`);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

// =============================================================================
// Response Time Analysis
// =============================================================================

interface GitHubIssue {
  number: number;
  created_at: string;
  comments: number;
  pull_request?: object;
}

interface GitHubComment {
  created_at: string;
  author_association: string;
}

async function analyzeResponseTime(owner: string, repo: string): Promise<ResponseTimeMetrics> {
  // Fetch recent issues (excluding PRs)
  const issues = await fetchGitHubAPI<GitHubIssue[]>(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=30&sort=created&direction=desc`
  );
  
  if (!issues || issues.length === 0) {
    return {
      avgHours: 0,
      medianHours: 0,
      grade: 'C', // Neutral grade for no data
      sampleSize: 0
    };
  }
  
  // Filter to only issues (not PRs) and those with comments
  const issuesWithComments = issues.filter(i => !i.pull_request && i.comments > 0);
  
  if (issuesWithComments.length === 0) {
    return {
      avgHours: 168, // Default to 1 week if no responses
      medianHours: 168,
      grade: 'D',
      sampleSize: 0
    };
  }
  
  // Get first response time for each issue
  const responseTimes: number[] = [];
  
  for (const issue of issuesWithComments.slice(0, 10)) { // Limit to 10 for rate limiting
    const comments = await fetchGitHubAPI<GitHubComment[]>(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue.number}/comments?per_page=1`
    );
    
    if (comments && comments.length > 0) {
      // Check if commenter is maintainer/owner
      const firstComment = comments[0];
      const isMaintainerResponse = ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(
        firstComment.author_association
      );
      
      if (isMaintainerResponse) {
        const issueDate = new Date(issue.created_at).getTime();
        const commentDate = new Date(firstComment.created_at).getTime();
        const hoursToRespond = (commentDate - issueDate) / (1000 * 60 * 60);
        responseTimes.push(hoursToRespond);
      }
    }
  }
  
  if (responseTimes.length === 0) {
    return {
      avgHours: 168,
      medianHours: 168,
      grade: 'D',
      sampleSize: issuesWithComments.length
    };
  }
  
  const avgHours = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const medianHours = calculateMedian(responseTimes);
  
  // Grade based on average response time
  let grade: ResponseTimeMetrics['grade'];
  if (avgHours < 12) grade = 'A';      // Under 12 hours
  else if (avgHours < 48) grade = 'B'; // Under 2 days
  else if (avgHours < 120) grade = 'C'; // Under 5 days
  else if (avgHours < 336) grade = 'D'; // Under 2 weeks
  else grade = 'F';
  
  return {
    avgHours: Math.round(avgHours * 10) / 10,
    medianHours: Math.round(medianHours * 10) / 10,
    grade,
    sampleSize: responseTimes.length
  };
}

// =============================================================================
// Documentation Analysis
// =============================================================================

interface GitHubContent {
  name: string;
  size: number;
  type: string;
}

async function analyzeDocumentation(owner: string, repo: string): Promise<DocumentationMetrics> {
  const [rootContents, communityProfile] = await Promise.all([
    fetchGitHubAPI<GitHubContent[]>(`https://api.github.com/repos/${owner}/${repo}/contents`),
    fetchGitHubAPI<{ files: Record<string, { url?: string }> }>(
      `https://api.github.com/repos/${owner}/${repo}/community/profile`
    )
  ]);
  
  const files = communityProfile?.files || {};
  const rootFiles = rootContents || [];
  
  const readme = rootFiles.find(f => f.name.toLowerCase().startsWith('readme'));
  const hasReadme = !!readme || !!files.readme?.url;
  const readmeSize = readme?.size || 0;
  
  const hasContributing = rootFiles.some(f => 
    f.name.toLowerCase().includes('contributing')
  ) || !!files.contributing?.url;
  
  const hasChangelog = rootFiles.some(f => 
    f.name.toLowerCase().includes('changelog') || f.name.toLowerCase().includes('history')
  );
  
  const hasLicense = rootFiles.some(f => 
    f.name.toLowerCase().includes('license')
  ) || !!files.license?.url;
  
  // Calculate score
  let score = 0;
  if (hasReadme) score += 25;
  if (readmeSize > 2000) score += 15; // Substantial README
  if (readmeSize > 5000) score += 10; // Very detailed README
  if (hasContributing) score += 25;
  if (hasChangelog) score += 10;
  if (hasLicense) score += 15;
  
  return {
    hasReadme,
    readmeSize,
    hasContributing,
    hasChangelog,
    hasLicense,
    grade: getGradeFromScore(score)
  };
}

// =============================================================================
// Community Health Analysis
// =============================================================================

async function analyzeCommunityHealth(owner: string, repo: string): Promise<CommunityHealthMetrics> {
  const [communityProfile, repoData] = await Promise.all([
    fetchGitHubAPI<{ 
      health_percentage: number;
      files: Record<string, { url?: string }>;
    }>(`https://api.github.com/repos/${owner}/${repo}/community/profile`),
    fetchGitHubAPI<{ has_discussions: boolean }>(
      `https://api.github.com/repos/${owner}/${repo}`
    )
  ]);
  
  const files = communityProfile?.files || {};
  const healthPercentage = communityProfile?.health_percentage || 0;
  
  const codeOfConduct = !!files.code_of_conduct?.url;
  const issueTemplates = !!files.issue_template?.url;
  const prTemplates = !!files.pull_request_template?.url;
  const discussionsEnabled = repoData?.has_discussions || false;
  
  return {
    codeOfConduct,
    issueTemplates,
    prTemplates,
    discussionsEnabled,
    healthPercentage,
    grade: getGradeFromScore(healthPercentage)
  };
}

// =============================================================================
// First Timer Analysis
// =============================================================================

interface GitHubSearchResult {
  total_count: number;
}

async function analyzeFirstTimerFriendliness(owner: string, repo: string): Promise<FirstTimerMetrics> {
  const [goodFirstIssues, helpWanted] = await Promise.all([
    fetchGitHubAPI<GitHubSearchResult>(
      `https://api.github.com/search/issues?q=repo:${owner}/${repo}+label:"good first issue"+state:open&per_page=1`
    ),
    fetchGitHubAPI<GitHubSearchResult>(
      `https://api.github.com/search/issues?q=repo:${owner}/${repo}+label:"help wanted"+state:open&per_page=1`
    )
  ]);
  
  const goodFirstIssueCount = goodFirstIssues?.total_count || 0;
  const helpWantedCount = helpWanted?.total_count || 0;
  
  // Calculate friendliness
  const isFriendly = goodFirstIssueCount >= 3 || helpWantedCount >= 5;
  
  // Calculate score
  let score = 0;
  if (goodFirstIssueCount >= 1) score += 20;
  if (goodFirstIssueCount >= 5) score += 25;
  if (goodFirstIssueCount >= 10) score += 15;
  if (helpWantedCount >= 1) score += 15;
  if (helpWantedCount >= 5) score += 15;
  if (helpWantedCount >= 10) score += 10;
  
  return {
    goodFirstIssueCount,
    helpWantedCount,
    isFriendly,
    grade: getGradeFromScore(score)
  };
}

// =============================================================================
// Main Calculator
// =============================================================================

export async function calculateReadinessScore(
  owner: string, 
  repo: string
): Promise<ReadinessMetrics> {
  const cacheKey = `readiness:${owner}/${repo}`;
  
  // Check cache first
  try {
    const cached = await redisCache.get<ReadinessMetrics>(cacheKey);
    if (cached) {
      console.log(`ReadinessScore: Cache hit for ${owner}/${repo}`);
      return cached;
    }
  } catch (e) {
    console.warn('Redis cache read failed:', e);
  }
  
  console.log(`ReadinessScore: Calculating for ${owner}/${repo}`);
  
  // Run all analyses in parallel
  const [responseTime, documentation, communityHealth, firstTimer] = await Promise.all([
    analyzeResponseTime(owner, repo),
    analyzeDocumentation(owner, repo),
    analyzeCommunityHealth(owner, repo),
    analyzeFirstTimerFriendliness(owner, repo)
  ]);
  
  // Calculate component scores (0-25 each, max 100)
  const gradeToScore = { A: 25, B: 20, C: 15, D: 10, F: 5 };
  
  const responseTimeScore = gradeToScore[responseTime.grade];
  const documentationScore = gradeToScore[documentation.grade];
  const communityHealthScore = gradeToScore[communityHealth.grade];
  const firstTimerScore = gradeToScore[firstTimer.grade];
  
  const totalScore = responseTimeScore + documentationScore + communityHealthScore + firstTimerScore;
  
  const metrics: ReadinessMetrics = {
    score: totalScore,
    tier: getTierFromScore(totalScore),
    responseTime,
    documentation,
    communityHealth,
    firstTimer,
    breakdown: {
      responseTimeScore,
      documentationScore,
      communityHealthScore,
      firstTimerScore
    },
    analyzedAt: new Date().toISOString()
  };
  
  // Cache for 6 hours (21600 seconds)
  try {
    await redisCache.set(cacheKey, metrics, 21600);
  } catch (e) {
    console.warn('Redis cache write failed:', e);
  }
  
  return metrics;
}

// =============================================================================
// Batch Calculation for Multiple Repos
// =============================================================================

export async function calculateReadinessScoreBatch(
  repos: Array<{ owner: string; repo: string }>
): Promise<Map<string, ReadinessMetrics>> {
  const results = new Map<string, ReadinessMetrics>();
  
  // Process in parallel with concurrency limit
  const BATCH_SIZE = 5;
  
  for (let i = 0; i < repos.length; i += BATCH_SIZE) {
    const batch = repos.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async ({ owner, repo }) => {
        try {
          const metrics = await calculateReadinessScore(owner, repo);
          return { key: `${owner}/${repo}`, metrics };
        } catch (e) {
          console.error(`Failed to calculate readiness for ${owner}/${repo}:`, e);
          return null;
        }
      })
    );
    
    for (const result of batchResults) {
      if (result) {
        results.set(result.key, result.metrics);
      }
    }
  }
  
  return results;
}
