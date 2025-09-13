import type { LucideIcon } from 'lucide-react';

export type TechStack = {
  id: string;
  name: string;
  icon: LucideIcon;
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
export type CompetitionLevel = 'very-high' | 'high' | 'moderate' | 'low' | 'very-low';
export type ActivityLevel = 'highest' | 'high' | 'moderate' | 'low';
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
  owner: {
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
}
