import type { Repository as BaseRepository } from '@/lib/types';

export type Repository = BaseRepository;

export type SortOption = 'stars' | 'updated' | 'newest' | 'name';
export type ViewMode = 'grid' | 'list';

export interface RepositoryFilters {
  q?: string;
  languages?: string[];
  topics?: string[];
  difficulty?: [number, number];
  goodFirstIssues?: boolean;
  sortBy?: SortOption;
  viewMode?: ViewMode;
  page?: number;
  perPage?: number;
}

export interface RepositoryListProps {
  initialRepos?: Repository[];
  totalCount?: number;
  filters?: RepositoryFilters;
}

export interface RepositoryCardProps {
  repo: Repository;
  viewMode?: ViewMode;
  onSave?: (repo: Repository) => void;
  isSaved?: boolean;
}

export interface RepositoryPaginationProps {
  totalCount: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export interface RepositoryActivity {
  lastUpdated: string;
  openIssues: number;
  prsLastMonth: number;
  commitActivity: number[];
  contributors: number;
  maintainerResponseTime?: number; // in hours
}

export interface RepositoryWithActivity extends Omit<Repository, 'activity' | 'health_score' | 'updated_at' | 'html_url' | 'description' | 'language' | 'topics' | 'stargazers_count' | 'forks_count' | 'open_issues_count'> {
  activity?: RepositoryActivity;
  healthScore?: number;
  similarRepos?: Repository[];
  trendingThisWeek?: boolean;
  saved?: boolean;
  updated_at: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}
