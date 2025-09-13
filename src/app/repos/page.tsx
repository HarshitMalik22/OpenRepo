"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Trophy,
  Zap,
  Activity,
  Target,
  Filter
} from 'lucide-react';
import EnhancedRepoFilters from '@/components/enhanced-repo-filters';
import EnhancedRepoCard from '@/components/enhanced-repo-card';
import { getPopularRepos, getRecommendedRepos, getFilteredRepos } from '@/lib/github';
import { getUserPreferences } from '@/lib/user-preferences';
import { getCommunityStats, getTestimonials } from '@/lib/github';
import type { Repository, RepositoryFilters, UserPreferences } from '@/lib/types';

export default function ReposPage() {
  const [allRepos, setAllRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [recommendedRepos, setRecommendedRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [activeTab, setActiveTab] = useState('recommended');
  const [communityStats, setCommunityStats] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<RepositoryFilters>({
    searchQuery: '',
    techStack: [],
    competitionLevel: [],
    activityLevel: [],
    aiDomain: [],
    language: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user preferences
        const preferences = getUserPreferences();
        setUserPreferences(preferences);
        
        // Load repositories
        const repos = await getPopularRepos();
        setAllRepos(repos);
        
        // Get personalized recommendations if user has preferences
        if (preferences && preferences.techStack.length > 0) {
          const recommended = await getRecommendedRepos(preferences);
          setRecommendedRepos(recommended);
        }
        
        // Load community statistics
        const stats = await getCommunityStats();
        setCommunityStats(stats);
        
        // Load testimonials
        const userTestimonials = await getTestimonials();
        setTestimonials(userTestimonials);
        
        setFilteredRepos(repos);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      if (Object.keys(filters).some(key => {
        const value = filters[key as keyof RepositoryFilters];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      })) {
        const filtered = await getFilteredRepos(filters);
        setFilteredRepos(filtered);
      } else {
        setFilteredRepos(allRepos);
      }
    };
    
    applyFilters();
  }, [filters, allRepos]);

  const handleFiltersChange = (newFilters: RepositoryFilters) => {
    setFilters(newFilters);
    setActiveTab('all');
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      techStack: [],
      competitionLevel: [],
      activityLevel: [],
      aiDomain: [],
      language: [],
    });
  };

  const handleViewAnalysis = (repo: Repository) => {
    // Navigate to repository analysis page
    window.open(`/repos/${repo.full_name}`, '_blank');
  };

  const handleContribute = (repo: Repository) => {
    // Navigate to repository contribution page
    window.open(repo.html_url, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading repositories...</p>
        </div>
      </div>
    );
  }

  const displayRepos = activeTab === 'recommended' ? recommendedRepos : filteredRepos;

  return (
    <div className="container mx-auto py-16 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold font-headline mb-6">Find Your Next Project</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover personalized open source opportunities tailored to your skills and goals.
          Our AI-powered recommendations help you find the perfect projects to contribute to.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
        <Card className="hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{communityStats.totalQueries.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Queries</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{communityStats.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{communityStats.activeRepositories.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Active Repos</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{communityStats.successfulContributions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Contributions</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold mb-1">⭐ {communityStats.averageSatisfaction}</div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-12 bg-glass/90 backdrop-blur-md border-glass-border shadow-glass hover:shadow-glass-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedRepoFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommended" className="flex items-center gap-2" disabled={!userPreferences || userPreferences.techStack.length === 0}>
            <Sparkles className="w-4 h-4" />
            For You
            {recommendedRepos.length > 0 && (
              <Badge variant="glass" className="ml-1">
                {recommendedRepos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            All Repos
            <Badge variant="glass" className="ml-1">
              {filteredRepos.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-6">
          {userPreferences && userPreferences.techStack.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Personalized Recommendations</h2>
                <p className="text-muted-foreground">
                  Based on your preferences: {userPreferences.techStack.join(', ')} • {userPreferences.experienceLevel} • {userPreferences.goal}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendedRepos.map(repo => (
                  <EnhancedRepoCard
                    key={repo.id}
                    repository={repo}
                    onViewAnalysis={handleViewAnalysis}
                    onContribute={handleContribute}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Complete Your Onboarding</h3>
              <p className="text-muted-foreground mb-4">
                Set up your preferences to get personalized recommendations tailored to your skills and goals.
              </p>
              <Button variant="glass" onClick={() => window.location.href = '/onboarding'}>
                Complete Onboarding
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">All Repositories</h2>
              <p className="text-muted-foreground">
                Browse through our curated collection of open source projects
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayRepos.map(repo => (
                <EnhancedRepoCard
                  key={repo.id}
                  repository={repo}
                  onViewAnalysis={handleViewAnalysis}
                  onContribute={handleContribute}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Trending Repos</h2>
              <p className="text-muted-foreground">
                Most popular repositories this week
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allRepos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10)
                .map(repo => (
                  <EnhancedRepoCard
                    key={repo.id}
                    repository={repo}
                    onViewAnalysis={handleViewAnalysis}
                    onContribute={handleContribute}
                  />
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
