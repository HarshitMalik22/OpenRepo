'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RepositoryList } from '@/components/repositories/repository-list';
import type { Repository } from '@/lib/types';

export default function ReposPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('q') || '';
  const [filters, setFilters] = useState({
    q: searchQuery,
    languages: searchParams?.get('languages')?.split(',') || [],
    topics: searchParams?.get('topics')?.split(',') || [],
    goodFirstIssues: searchParams?.get('goodFirstIssues') === 'true',
    sortBy: (searchParams?.get('sortBy') as 'stars' | 'updated' | 'newest' | 'name') || 'stars'
  });

  const fetchRepos = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let repositories: Repository[];
      let totalCount: number;

      // Use the good first issues endpoint if the filter is active
      if (filters.goodFirstIssues) {
        const response = await fetch(`/api/repositories/good-first-issues?page=${pageNum}&perPage=30${filters.languages.length ? `&language=${filters.languages[0]}` : ''}`);
        const data = await response.json();
        repositories = data.repositories || [];
        totalCount = data.totalCount || 0;
      } else {
        // Use the popular repos API endpoint
        const response = await fetch(`/api/repositories/popular?page=${pageNum}&perPage=30${filters.languages.length ? `&language=${filters.languages[0]}` : ''}${filters.q ? `&q=${encodeURIComponent(filters.q)}` : ''}`);
        const data = await response.json();
        repositories = data.repositories || [];
        totalCount = data.totalCount || repositories.length;
      }

      if (append) {
        setRepositories(prev => [...prev, ...repositories]);
      } else {
        setRepositories(repositories);
      }

      setHasMore(repositories.length === 30);
      setTotalCount(totalCount);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch repositories:', err);
      setError('Failed to load repositories. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRepos(1);
  }, [fetchRepos]);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepos(nextPage, true);
  }, [page, fetchRepos]);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));

    // Reset to first page when filters change
    setPage(1);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.languages?.length) params.set('languages', newFilters.languages.join(','));
    if (newFilters.topics?.length) params.set('topics', newFilters.topics.join(','));
    if (newFilters.goodFirstIssues) params.set('goodFirstIssues', 'true');
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">{error}</div>
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchRepos(1, false)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover Repositories</h1>
          <p className="text-muted-foreground">
            Find open source projects to contribute to or use in your own projects.
          </p>
        </div>

        <RepositoryList
          repositories={repositories}
          isLoading={loading}
          hasNextPage={hasMore}
          onLoadMore={handleLoadMore}
          isLoadingMore={loadingMore}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
        />

        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
