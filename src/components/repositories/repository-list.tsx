'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RepositoryFilters } from './filters';
import GlassRepoList from '@/components/glass-repo-list';
import { Repository, RepositoryFilters as Filters, SortOption } from '@/types/repositories';
import { cn } from '@/lib/utils';
import { RepositoryFilters as FiltersType } from '@/types/repositories';

interface RepositoryListProps {
  repositories: Repository[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  onFilterChange: (filters: {
    q?: string;
    languages?: string[];
    topics?: string[];
    goodFirstIssues?: boolean;
    sortBy?: 'stars' | 'updated' | 'newest' | 'name';
  }) => void;
  totalCount: number;
}

export function RepositoryList({
  repositories,
  isLoading,
  hasNextPage,
  onLoadMore,
  isLoadingMore,
  onFilterChange,
  totalCount,
}: RepositoryListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for repositories and loading
  const [repos, setRepos] = useState<Repository[]>(repositories);
  const [filters, setFilters] = useState<Filters>({
    q: '',
    languages: [],
    topics: [],
    goodFirstIssues: false,
    sortBy: 'stars',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('repoViewMode') as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [savedRepos, setSavedRepos] = useState<Set<number>>(new Set());

  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(repos.length / perPage);

  // Load saved repositories and view mode from localStorage
  useEffect(() => {
    const savedRepos = localStorage.getItem('savedRepos');
    const savedViewMode = localStorage.getItem('repoViewMode') as 'grid' | 'list' | null;

    if (savedRepos) {
      setSavedRepos(new Set(JSON.parse(savedRepos)));
    }

    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Update repositories when repositories prop changes
  useEffect(() => {
    setRepos(repositories);
  }, [repositories]);

  // Handle saving/unsaving repositories
  const toggleSaveRepo = useCallback((repoId: number) => {
    setSavedRepos((prev) => {
      const newSavedRepos = prev.has(repoId)
        ? new Set([...prev].filter((id) => id !== repoId))
        : new Set([...prev, repoId]);

      localStorage.setItem('savedRepos', JSON.stringify(Array.from(newSavedRepos)));
      return newSavedRepos;
    });
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    onFilterChange(newFilters);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('repoViewMode', mode);
    }
  };

  // Filter and sort repositories based on filters
  const filterAndSortRepositories = useCallback(() => {
    if (!repos) return [];

    let result = [...repos];

    // Client-side filtering is removed as we rely on server-side filtering
    // We only keep sorting logic here

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'stars':
          result.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
          break;
        case 'updated':
          result.sort((a, b) =>
            new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
          );
          break;
        case 'newest':
          result.sort((a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    return result;
  }, [repos, filters]);

  // Update filtered repositories when filters or repositories change
  useEffect(() => {
    setFilteredRepos(filterAndSortRepositories());
  }, [filterAndSortRepositories]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // Update URL with new page
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', newPage.toString());

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    router.push(`/repos?${params.toString()}`);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          «
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          ‹
        </Button>

        {startPage > 1 && (
          <Button variant="ghost" size="sm" disabled>
            ...
          </Button>
        )}

        {pageNumbers.map((num) => (
          <Button
            key={num}
            variant={page === num ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(num)}
          >
            {num}
          </Button>
        ))}

        {endPage < totalPages && (
          <Button variant="ghost" size="sm" disabled>
            ...
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          ›
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          »
        </Button>
      </div>
    );
  };

  // Loading skeleton for repositories
  const renderLoadingSkeletons = () => {
    return (
      <div className="space-y-4">
        {/* Skeleton List */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 p-4"
            >
              {/* Header Row Skeleton */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Avatar Skeleton */}
                  <Skeleton className="w-10 h-10 rounded-full" />

                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Title Skeleton */}
                    <Skeleton className="h-5 w-48" />
                    {/* Description Skeleton */}
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                </div>
              </div>

              {/* Tags Row Skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <RepositoryFilters
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {isLoading ? (
        renderLoadingSkeletons()
      ) : (
        <GlassRepoList
          repositories={filteredRepos}
          onViewAnalysis={(repo) => {
            // Navigate to repository analysis
            window.open(`/repos/${repo.full_name?.replace('/', '--')}`, '_blank');
          }}
          onContribute={(repo) => {
            // Navigate to contribute page or open repo
            window.open(repo.html_url, '_blank');
          }}
          onViewRepo={(repo) => {
            // Open repository in new tab
            window.open(repo.html_url, '_blank');
          }}
        />
      )}

      {totalPages > 1 && renderPagination()}

      {/* Results count */}
      <div className="text-sm text-muted-foreground text-center mt-4">
        Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, totalCount)} of {totalCount} repositories
      </div>
    </div>
  );
}
