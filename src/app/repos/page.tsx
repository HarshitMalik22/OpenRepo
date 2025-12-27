'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Compass, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RepositoryList } from '@/components/repositories/repository-list';
import { IssueRecommendationCard } from '@/components/issue-recommendation-card';
import type { Repository } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

interface RecommendedIssue {
  issue: {
    id: number;
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    created_at: string;
    updated_at: string;
    labels: Array<{ name: string; color: string }>;
    assignee: { login: string } | null;
    comments: number;
  };
  matchScore: number;
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

// =============================================================================
// Constants
// =============================================================================

const TECH_STACKS = [
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js',
  'Python', 'Django', 'Go', 'Rust', 'TypeScript'
];

// =============================================================================
// Issues Section Component
// =============================================================================

function IssuesSection() {
  const [issues, setIssues] = useState<RecommendedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedTechs.length > 0) params.append('techStack', selectedTechs.join(','));
      params.append('limit', '30');

      const response = await fetch(`/api/repositories/recommended-issues?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setIssues(data.recommendations);
      } else {
        setError(data.error || 'Failed to fetch issues');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [selectedTechs]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <div className="space-y-6">
      {/* Skill Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground mr-2">Your skills:</span>
        {TECH_STACKS.map(tech => (
          <Badge
            key={tech}
            variant={selectedTechs.includes(tech) ? 'default' : 'outline'}
            className={`cursor-pointer transition-all ${selectedTechs.includes(tech)
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'hover:border-primary'
              }`}
            onClick={() => toggleTech(tech)}
          >
            {tech}
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchIssues}
          disabled={loading}
          className="ml-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Finding issues matched to your skills...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load issues</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchIssues} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found <span className="text-foreground font-semibold">{issues.length}</span> issues
              {selectedTechs.length > 0 && (
                <span> matching {selectedTechs.length} skill{selectedTechs.length > 1 ? 's' : ''}</span>
              )}
            </p>
            {issues.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                Sorted by match score
              </div>
            )}
          </div>

          {issues.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No issues found</h2>
              <p className="text-muted-foreground">Select some skills to find matching issues</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {issues.map((issue) => (
                <IssueRecommendationCard key={issue.issue.id} issue={issue} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =============================================================================
// Repos Section Component
// =============================================================================

function ReposSection() {
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

      if (filters.goodFirstIssues) {
        const response = await fetch(`/api/repositories/good-first-issues?page=${pageNum}&perPage=30${filters.languages.length ? `&language=${filters.languages[0]}` : ''}`);
        const data = await response.json();
        repositories = data.repositories || [];
        totalCount = data.totalCount || 0;
      } else {
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
    setPage(1);
    setLoading(true);

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
      <div className="text-center py-8">
        <div className="text-destructive mb-4">{error}</div>
        <Button variant="outline" onClick={() => fetchRepos(1, false)}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

// =============================================================================
// Main Page
// =============================================================================

function ReposPageContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get('tab') || 'repos';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          <p className="text-muted-foreground">
            Find open source projects to contribute to and beginner-friendly issues.
          </p>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="repos" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Repositories</span>
              <span className="sm:hidden">Repos</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Find Issues</span>
              <span className="sm:hidden">Issues</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repos" className="mt-6">
            <ReposSection />
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <IssuesSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ReposPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 px-4">Loading...</div>}>
      <ReposPageContent />
    </Suspense>
  );
}
