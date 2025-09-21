import type { LucideIcon } from 'lucide-react';

export type TechStack = {
  id: string;
  name: string;
  logo?: string;
};

export type Goal = {
  id:string;
  name: string;
  icon: LucideIcon;
};

export type ExperienceLevel = {
  id: string;
  name: string;
};

export type UserPreferences = {
  techStack: string[];
  goal: string;
  experienceLevel: string;
  completed?: boolean;
};

// New types for enhanced features
export type CompetitionLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
export type ActivityLevel = 'highest' | 'high' | 'medium' | 'low';
export type AIDomain = 'oss-google-docs' | 'lucid' | 'dive-into-ai' | 'supermemory-ai' | 'cap' | 'mail0' | 'other';

export interface RepositoryFilters {
  techStack?: string[];
  competitionLevel?: CompetitionLevel[];
  activityLevel?: ActivityLevel[];
  aiDomain?: AIDomain[];
  language?: string[];
  searchQuery?: string;
}

export interface RecommendationScore {
  totalScore: number;
  techStackMatch: number;
  difficultyMatch: number;
  goalAlignment: number;
  competitionScore: number;
  activityScore: number;
}

export interface ContributionDifficulty {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  score: number;
  factors: {
    codeComplexity: number;
    communitySize: number;
    documentationQuality: number;
    issueResolutionTime: number;
  };
  goodFirstIssues: number;
  helpWantedIssues: number;
}

export interface CommunityStats {
  totalQueries: number;
  totalUsers: number;
  activeRepositories: number;
  successfulContributions: number;
  averageSatisfaction: number;
}

export interface Testimonial {
  id: string;
  userName: string;
  userHandle: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
  repository?: string;
}

// Enhanced Repository type with new fields
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: string | {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at?: string;
  
  // Real GitHub data fields (optional for backward compatibility)
  good_first_issues_count?: number;
  recent_commits_count?: number;
  help_wanted_issues_count?: number;
  recent_issues_count?: number;
  health_score?: number;
  
  // New enhanced fields
  competition_level: CompetitionLevel;
  activity_level: ActivityLevel;
  ai_domain: AIDomain;
  contribution_difficulty: ContributionDifficulty;
  recommendation_score?: RecommendationScore;
  last_analyzed: string;
  contributor_count: number;
  recent_commits: number;
  issue_response_rate: number;
  documentation_score: number;
  techStack?: string[];
}

// Live data types
export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed' | 'all';
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
  pull_request?: {
    html_url: string;
    diff_url: string;
    patch_url: string;
  } | null;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed' | 'all';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  html_url: string;
  diff_url: string;
  patch_url: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  mergeable: boolean | null;
  merged: boolean;
  draft: boolean;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  html_url: string;
  url: string;
  comments_url: string;
}

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
}

export interface LiveActivity {
  repository?: Repository;
  issues?: Issue[];
  pullRequests?: PullRequest[];
  commits?: Commit[];
  contributors?: Contributor[];
  communityStats?: CommunityStats;
  lastUpdated: Date;
}
