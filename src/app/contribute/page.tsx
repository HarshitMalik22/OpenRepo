"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Sparkles, 
  Trophy, 
  Users, 
  Target,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import EnhancedRepoCard from '@/components/enhanced-repo-card';
import GuidedContributionWorkflow from '@/components/guided-contribution-workflow';
import EnhancedRepoFilters from '@/components/enhanced-repo-filters';
import { getPopularRepos, getRecommendedRepos, getFilteredRepos } from '@/lib/github';
import { getUserPreferences } from '@/lib/user-preferences';
import { communityStats } from '@/lib/mock-data';
import type { Repository, RepositoryFilters, UserPreferences } from '@/lib/types';

export default function ContributePage() {
  const [allRepos, setAllRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [recommendedRepos, setRecommendedRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [activeTab, setActiveTab] = useState('find');
  
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

  const handleStartContribution = (repo: Repository) => {
    setSelectedRepo(repo);
    setActiveTab('workflow');
  };

  const handleViewAnalysis = (repo: Repository) => {
    window.open(`/repos/${repo.full_name}`, '_blank');
  };

  const handleContribute = (repo: Repository) => {
    handleStartContribution(repo);
  };

  const handleWorkflowComplete = () => {
    setSelectedRepo(null);
    setActiveTab('find');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contribution opportunities...</p>
        </div>
      </div>
    );
  }

  const displayRepos = activeTab === 'recommended' ? recommendedRepos : filteredRepos;

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">Start Contributing</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find the perfect open source project to contribute to and follow our guided workflow 
          to make your first contribution with confidence.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{communityStats.successfulContributions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Contributions Made</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{communityStats.activeRepositories.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {allRepos.reduce((sum, repo) => sum + repo.contribution_difficulty.goodFirstIssues, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Beginner Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold mb-1">⭐ {communityStats.averageSatisfaction}</div>
            <div className="text-xs text-muted-foreground">Contributor Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find Projects
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2" disabled={!userPreferences || userPreferences.techStack.length === 0}>
            <Sparkles className="w-4 h-4" />
            For You
            {recommendedRepos.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {recommendedRepos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2" disabled={!selectedRepo}>
            <BookOpen className="w-4 h-4" />
            Contribution Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Find Your Perfect Project</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedRepoFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </CardContent>
            </Card>

            {/* Repository Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Available Projects</h2>
                <Badge variant="outline">
                  {filteredRepos.length} projects
                </Badge>
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
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          {userPreferences && userPreferences.techStack.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Recommended for You</h2>
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
              <Button onClick={() => window.location.href = '/onboarding'}>
                Complete Onboarding
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          {selectedRepo ? (
            <GuidedContributionWorkflow
              repository={selectedRepo}
              onComplete={handleWorkflowComplete}
            />
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Select a Project</h3>
              <p className="text-muted-foreground mb-4">
                Choose a project from the "Find Projects" or "For You" tabs to start the contribution workflow.
              </p>
              <Button onClick={() => setActiveTab('find')}>
                Browse Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
