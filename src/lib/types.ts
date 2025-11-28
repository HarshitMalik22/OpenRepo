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

// Enums for repository properties
export enum CompetitionLevel {
  VERY_HIGH = 'very-high',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  VERY_LOW = 'very-low'
}

export enum ActivityLevel {
  HIGHEST = 'highest',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum AIDomain {
  OSS_GOOGLE_DOCS = 'oss-google-docs',
  LUCID = 'lucid',
  DIVE_INTO_AI = 'dive-into-ai',
  SUPERMEMORY_AI = 'supermemory-ai',
  CAP = 'cap',
  MAIL0 = 'mail0',
  OTHER = 'other'
}

export enum ContributionDifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

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
  level: ContributionDifficultyLevel;
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

export interface ContributionDifficultyDetails {
  level: ContributionDifficulty;
  score: number;
  reason: string;
  suggestedTasks?: string[];
  learningResources?: string[];
  estimatedTimeToFirstContribution?: string;
}

export interface CommunityStats {
  totalQueries: number;
  totalUsers: number;
  activeRepositories: number;
  successfulContributions: number;
  averageSatisfaction: number;
  lastUpdated?: string; // ISO date string
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
  // Core GitHub repository fields
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
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
  pushed_at: string | null;
  default_branch: string;
  
  // GitHub repository status flags
  archived: boolean;
  disabled: boolean;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  
  // License information
  license?: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  };
  
  // Enhanced fields for our application
  good_first_issues_count?: number;
  recent_commits_count?: number;
  help_wanted_issues_count?: number;
  recent_issues_count?: number;
  health_score?: number;
  competition_level: CompetitionLevel;
  activity_level: ActivityLevel;
  ai_domain: AIDomain;
  contribution_difficulty: ContributionDifficultyLevel;
  recommendation_score?: RecommendationScore;
  last_analyzed: string;
  contributor_count: number;
  recent_commits: number;
  issue_response_rate: number;
  documentation_score: number;
  techStack?: string[];
  
  // Backward compatibility
  login?: string;        // Same as owner.login
  avatar_url?: string;   // Same as owner.avatar_url
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
