import type { LucideIcon } from 'lucide-react';

export type TechStack = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type Goal = {
  id: string;
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

export type Repository = {
  id: string;
  slug: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  githubUrl: string;
  tags: string[];
  explanation: {
    why: string;
    what: string;
    how: string;
    flowchartMermaid: string;
    explanation: Record<string, string>;
  };
  resources: {
    type: 'video' | 'docs' | 'blog';
    title: string;
    url: string;
  }[];
  modules: {
    name: string;
    description: string;
  }[];
};
