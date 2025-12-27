'use server';

/**
 * @fileOverview Issue Recommender Service
 * 
 * AI-powered matching of GitHub issues to user skills and interests.
 * Fetches open issues with beginner-friendly labels and scores them
 * based on user's tech stack and experience level.
 */

import { getGitHubHeadersForContext } from './github-headers';
import { redisCache } from './redis-cache';
import { createLangChainModel, isAIConfigured } from '@/ai/langchain-config';
import type { Issue } from './types';

// =============================================================================
// Types
// =============================================================================

export interface RecommendedIssue {
  issue: Issue;
  matchScore: number; // 0-100
  matchReasons: string[];
  requiredSkills: string[];
  estimatedEffort: 'quick' | 'medium' | 'substantial';
  repository: {
    full_name: string;
    html_url: string;
    language: string | null;
    stargazers_count: number;
  };
}

export interface IssueRecommenderOptions {
  techStack?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  maxResults?: number;
  languages?: string[];
}

interface GitHubSearchIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
    description: string | null;
  }>;
  assignee: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  comments: number;
  repository_url: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchIssue[];
}

interface GitHubRepo {
  full_name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
}

// =============================================================================
// GitHub API Helpers
// =============================================================================

async function fetchGitHubAPI<T>(url: string): Promise<T | null> {
  try {
    const headers = getGitHubHeadersForContext();
    const response = await fetch(url, { 
      headers,
      next: { revalidate: 1800 } // Cache for 30 minutes
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
// Skill Detection
// =============================================================================

const SKILL_KEYWORDS: Record<string, string[]> = {
  'typescript': ['typescript', 'ts', 'tsx', '.ts', 'type-safe'],
  'javascript': ['javascript', 'js', 'jsx', 'node', 'nodejs', 'npm'],
  'react': ['react', 'reactjs', 'react-native', 'hooks', 'components', 'jsx'],
  'python': ['python', 'py', 'django', 'flask', 'pandas', 'numpy'],
  'go': ['golang', 'go ', 'goroutine'],
  'rust': ['rust', 'cargo', 'rustc'],
  'java': ['java', 'jvm', 'spring', 'maven', 'gradle'],
  'css': ['css', 'scss', 'sass', 'tailwind', 'styling', 'styles'],
  'html': ['html', 'markup', 'dom'],
  'sql': ['sql', 'database', 'postgresql', 'mysql', 'sqlite'],
  'docker': ['docker', 'container', 'kubernetes', 'k8s'],
  'testing': ['test', 'testing', 'jest', 'mocha', 'pytest', 'unit test'],
  'documentation': ['docs', 'documentation', 'readme', 'jsdoc', 'typedoc'],
  'api': ['api', 'rest', 'graphql', 'endpoint'],
  'frontend': ['frontend', 'ui', 'ux', 'component', 'styling'],
  'backend': ['backend', 'server', 'api', 'database'],
  'devops': ['ci', 'cd', 'pipeline', 'deployment', 'infrastructure'],
};

function detectSkillsFromText(text: string): string[] {
  const skills = new Set<string>();
  const lowerText = text.toLowerCase();
  
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        skills.add(skill);
        break;
      }
    }
  }
  
  return Array.from(skills);
}

// =============================================================================
// Effort Estimation
// =============================================================================

function estimateEffort(issue: GitHubSearchIssue): RecommendedIssue['estimatedEffort'] {
  const labels = issue.labels.map(l => l.name.toLowerCase());
  const bodyLength = issue.body?.length || 0;
  
  // Check for explicit effort labels
  if (labels.some(l => l.includes('good first issue') || l.includes('easy') || l.includes('beginner'))) {
    return 'quick';
  }
  if (labels.some(l => l.includes('hard') || l.includes('complex') || l.includes('major'))) {
    return 'substantial';
  }
  
  // Estimate from body length
  if (bodyLength < 500) return 'quick';
  if (bodyLength > 2000) return 'substantial';
  
  return 'medium';
}

// =============================================================================
// Match Scoring
// =============================================================================

function calculateMatchScore(
  issue: GitHubSearchIssue,
  repo: GitHubRepo,
  options: IssueRecommenderOptions
): { score: number; reasons: string[] } {
  let score = 50; // Base score
  const reasons: string[] = [];
  
  const userTechStack = (options.techStack || []).map(s => s.toLowerCase());
  const experienceLevel = options.experienceLevel || 'intermediate';
  
  // Language match
  const repoLanguage = repo.language?.toLowerCase() || '';
  if (repoLanguage && userTechStack.some(tech => 
    repoLanguage.includes(tech) || tech.includes(repoLanguage)
  )) {
    score += 20;
    reasons.push(`Matches your ${repoLanguage} skills`);
  }
  
  // Topic match
  const repoTopics = (repo.topics || []).map(t => t.toLowerCase());
  const matchingTopics = userTechStack.filter(tech => 
    repoTopics.some(topic => topic.includes(tech) || tech.includes(topic))
  );
  if (matchingTopics.length > 0) {
    score += Math.min(15, matchingTopics.length * 5);
    reasons.push(`Topics match: ${matchingTopics.slice(0, 3).join(', ')}`);
  }
  
  // Skill detection from issue text
  const issueText = `${issue.title} ${issue.body || ''}`;
  const requiredSkills = detectSkillsFromText(issueText);
  const matchingSkills = requiredSkills.filter(skill => 
    userTechStack.some(tech => tech.includes(skill) || skill.includes(tech))
  );
  if (matchingSkills.length > 0) {
    score += Math.min(15, matchingSkills.length * 5);
    reasons.push(`Skills match: ${matchingSkills.slice(0, 3).join(', ')}`);
  }
  
  // Beginner-friendly labels
  const labels = issue.labels.map(l => l.name.toLowerCase());
  if (labels.some(l => l.includes('good first issue'))) {
    if (experienceLevel === 'beginner') {
      score += 15;
      reasons.push('Marked as good first issue');
    } else {
      score += 5;
    }
  }
  if (labels.some(l => l.includes('help wanted'))) {
    score += 5;
    reasons.push('Help wanted by maintainers');
  }
  if (labels.some(l => l.includes('documentation') || l.includes('docs'))) {
    if (experienceLevel === 'beginner') {
      score += 10;
      reasons.push('Documentation task (great for beginners)');
    }
  }
  
  // Popular repo bonus (but not too popular = too competitive)
  const stars = repo.stargazers_count;
  if (stars >= 100 && stars <= 5000) {
    score += 5;
    reasons.push('Active, well-maintained project');
  } else if (stars > 50000) {
    score -= 5; // Very competitive
  }
  
  // Not assigned = more available
  if (!issue.assignee) {
    score += 5;
    reasons.push('Unassigned - available to work on');
  } else {
    score -= 10;
  }
  
  // Recent issues are better
  const daysSinceCreation = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 7) {
    score += 5;
    reasons.push('Recently opened');
  } else if (daysSinceCreation > 90) {
    score -= 5; // Might be stale
  }
  
  // Clamp score
  return { score: Math.max(0, Math.min(100, score)), reasons };
}

// =============================================================================
// Main Recommender
// =============================================================================

export async function getRecommendedIssues(
  options: IssueRecommenderOptions = {}
): Promise<RecommendedIssue[]> {
  const { 
    techStack = [], 
    experienceLevel = 'intermediate',
    maxResults = 20,
    languages = []
  } = options;
  
  // Build search query
  let query = 'is:open is:issue label:"good first issue"';
  
  // Add language filter if specified
  if (languages.length > 0) {
    query += ` language:${languages[0]}`;
  } else if (techStack.length > 0) {
    // Try to infer language from tech stack
    const langMap: Record<string, string> = {
      'react': 'javascript',
      'next.js': 'javascript',
      'vue': 'javascript',
      'angular': 'typescript',
      'typescript': 'typescript',
      'python': 'python',
      'django': 'python',
      'flask': 'python',
      'go': 'go',
      'rust': 'rust',
      'java': 'java',
      'spring': 'java',
    };
    
    for (const tech of techStack) {
      const lang = langMap[tech.toLowerCase()];
      if (lang) {
        query += ` language:${lang}`;
        break;
      }
    }
  }
  
  // Sort by recently updated
  const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=50`;
  
  const searchResult = await fetchGitHubAPI<GitHubSearchResponse>(searchUrl);
  
  if (!searchResult || searchResult.items.length === 0) {
    console.log('IssueRecommender: No issues found');
    return [];
  }
  
  console.log(`IssueRecommender: Found ${searchResult.items.length} issues`);
  
  // Fetch repo details for each unique repository
  const repoUrls = new Set(searchResult.items.map(i => i.repository_url));
  const repoMap = new Map<string, GitHubRepo>();
  
  await Promise.all(
    Array.from(repoUrls).slice(0, 20).map(async (url) => {
      const repo = await fetchGitHubAPI<GitHubRepo>(url);
      if (repo) {
        repoMap.set(url, repo);
      }
    })
  );
  
  // Score and rank issues
  const scoredIssues: RecommendedIssue[] = [];
  
  for (const issue of searchResult.items) {
    const repo = repoMap.get(issue.repository_url);
    if (!repo) continue;
    
    const { score, reasons } = calculateMatchScore(issue, repo, options);
    const requiredSkills = detectSkillsFromText(`${issue.title} ${issue.body || ''}`);
    
    scoredIssues.push({
      issue: {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        html_url: issue.html_url,
        user: issue.user,
        labels: issue.labels,
        assignee: issue.assignee,
        comments: issue.comments,
      },
      matchScore: score,
      matchReasons: reasons,
      requiredSkills,
      estimatedEffort: estimateEffort(issue),
      repository: {
        full_name: repo.full_name,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
      },
    });
  }
  
  // Sort by score and return top results
  scoredIssues.sort((a, b) => b.matchScore - a.matchScore);
  
  return scoredIssues.slice(0, maxResults);
}

// =============================================================================
// AI-Enhanced Recommendations (Optional)
// =============================================================================

export async function getAIEnhancedRecommendations(
  issues: RecommendedIssue[],
  userGoal: string
): Promise<RecommendedIssue[]> {
  if (!isAIConfigured() || issues.length === 0) {
    return issues;
  }
  
  try {
    const model = createLangChainModel();
    
    // Create a summary for AI analysis
    const issuesSummary = issues.slice(0, 5).map((item, i) => 
      `${i + 1}. [${item.repository.full_name}] "${item.issue.title}" - Labels: ${item.issue.labels.map(l => l.name).join(', ')}`
    ).join('\n');
    
    const prompt = `Given a user's goal: "${userGoal}"

Here are 5 open source issues they could work on:
${issuesSummary}

Re-rank these issues from most to least suitable for the user's goal. 
Just respond with the numbers in order, separated by commas. Example: "3,1,5,2,4"`;

    const response = await model.invoke(prompt);
    const content = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);
    
    // Parse ranking
    const rankingMatch = content.match(/[\d,\s]+/);
    if (rankingMatch) {
      const ranking = rankingMatch[0].split(',').map(n => parseInt(n.trim()) - 1);
      const reranked = ranking
        .filter(i => i >= 0 && i < issues.length)
        .map(i => issues[i]);
      
      // Combine reranked with remaining issues
      const rerankedIds = new Set(reranked.map(i => i.issue.id));
      const remaining = issues.filter(i => !rerankedIds.has(i.issue.id));
      
      return [...reranked, ...remaining];
    }
  } catch (error) {
    console.error('AI enhancement failed:', error);
  }
  
  return issues;
}
