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
};

// This type is now based on the GitHub API response for a repository.
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
}
