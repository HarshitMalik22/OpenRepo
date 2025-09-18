"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
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
  Filter,
  Star
} from 'lucide-react';
import EnhancedRepoFilters from '@/components/enhanced-repo-filters';
import GlassRepoList from '@/components/glass-repo-list';
import { getPopularRepos, getRecommendedRepos, getFilteredRepos, getEnhancedRecommendedRepos, trackUserInteraction, getRecommendationExplanation, getUserStats } from '@/lib/github';
import { getUserPreferencesClient } from '@/lib/user-preferences-client';
import { trackUserInteraction as trackUserInteractionDB } from '@/lib/database';
import { getCommunityStats, getTestimonials } from '@/lib/github';
import type { Repository, RepositoryFilters, UserPreferences } from '@/lib/types';

export default function ReposPage() {
  const { user } = useUser();
  const [allRepos, setAllRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [recommendedRepos, setRecommendedRepos] = useState<Repository[]>([]);
  const [enhancedRecommendedRepos, setEnhancedRecommendedRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [activeTab, setActiveTab] = useState('recommended');
  const [communityStats, setCommunityStats] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [previousStats, setPreviousStats] = useState<any>(null);
  
  // Enhanced recommendation features
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [recommendationExplanations, setRecommendationExplanations] = useState<Map<string, string[]>>(new Map());
  const [userStats, setUserStats] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  
  const [filters, setFilters] = useState<RepositoryFilters>({
    searchQuery: '',
    techStack: [],
    competitionLevel: [],
    activityLevel: [],
    aiDomain: [],
    language: [],
  });

  // Animated number component
  const AnimatedNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      let startTime: number;
      let animationFrame: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(value * easeOutQuart));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [value, duration]);
    
    return <span>{displayValue.toLocaleString()}</span>;
  };

  const loadCommunityStats = async () => {
    try {
      const stats = await getCommunityStats();
      setPreviousStats(communityStats);
      setCommunityStats(stats);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (error) {
      console.error('Failed to load community stats:', error);
      setIsLive(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user preferences
        const preferences = await getUserPreferencesClient();
        console.log('Loaded preferences:', preferences);
        setUserPreferences(preferences);
        
        // Load repositories
        const repos = await getPopularRepos();
        console.log('Loaded repositories:', repos.length);
        setAllRepos(repos);
        
        // Get personalized recommendations if user has preferences
        if (preferences && preferences.techStack.length > 0) {
          console.log('Getting recommendations for preferences:', preferences);
          const recommended = await getRecommendedRepos(preferences);
          console.log('Recommended repositories:', recommended.length);
          setRecommendedRepos(recommended);
          
          // Get enhanced ML-based recommendations
          const enhancedRecommended = await getEnhancedRecommendedRepos(preferences, userId);
          console.log('Enhanced recommended repositories:', enhancedRecommended.length);
          setEnhancedRecommendedRepos(enhancedRecommended);
          
          // Generate recommendation explanations
          const explanations = new Map<string, string[]>();
          enhancedRecommended.forEach(repo => {
            explanations.set(repo.full_name, getRecommendationExplanation(repo));
          });
          setRecommendationExplanations(explanations);
          
          // Load user statistics
          const stats = getUserStats(userId);
          setUserStats(stats);
        } else {
          console.log('No preferences found or empty tech stack');
        }
        
        // Load community statistics
        await loadCommunityStats();
        
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
    
    // Set up periodic polling for live stats (every 30 seconds)
    const intervalId = setInterval(loadCommunityStats, 30000);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
    // Encode the full_name by replacing '/' with '--' for the dynamic route
    if (!repo.full_name || !repo.full_name.includes('/')) {
      console.error('Invalid repository full_name:', repo.full_name);
      return;
    }
    
    const encodedSlug = repo.full_name.replace('/', '--');
    const url = `/repos/${encodedSlug}`;
    console.log('handleViewAnalysis - repo.full_name:', repo.full_name);
    console.log('handleViewAnalysis - encodedSlug:', encodedSlug);
    console.log('handleViewAnalysis - final URL:', url);
    
    // Validate the URL before opening
    if (!url || url === '/repos/') {
      console.error('Invalid URL generated:', url);
      return;
    }
    
    window.open(url, '_blank');
  };

  const handleContribute = (repo: Repository) => {
    // Track user interaction
    trackUserInteraction(userId, repo.full_name, 'contribute');
    
    // Navigate to repository contribution page
    window.open(repo.html_url, '_blank');
  };

  const handleLikeRepo = (repo: Repository) => {
    // Track user interaction
    trackUserInteraction(userId, repo.full_name, 'like', 5);
    
    // Update user stats
    const stats = getUserStats(userId);
    setUserStats(stats);
    
    // Show feedback
    setSelectedRepo(repo);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleDislikeRepo = (repo: Repository) => {
    // Track user interaction
    trackUserInteraction(userId, repo.full_name, 'dislike', 1);
    
    // Update user stats
    const stats = getUserStats(userId);
    setUserStats(stats);
    
    // Remove from recommendations temporarily
    setEnhancedRecommendedRepos(prev => prev.filter(r => r.full_name !== repo.full_name));
  };

  const handleViewRepo = (repo: Repository) => {
    // Track user interaction
    if (user) {
      trackUserInteractionDB(user.id, repo.full_name, 'view').catch(console.error);
    }
    trackUserInteraction(userId, repo.full_name, 'view');
  };

  const handleRateRepo = (repo: Repository, rating: number) => {
    // Track user interaction with rating
    if (user) {
      trackUserInteractionDB(user.id, repo.full_name, 'analyze', rating).catch(console.error);
    }
    trackUserInteraction(userId, repo.full_name, 'analyze', rating);
    
    // Update user stats
    const stats = getUserStats(userId);
    setUserStats(stats);
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

  const displayRepos = activeTab === 'recommended' ? recommendedRepos : 
                     activeTab === 'enhanced' ? enhancedRecommendedRepos : 
                     filteredRepos;

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
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-muted-foreground font-medium">
              {isLive ? 'Live Stats' : 'Connection Lost'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Queries Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                {communityStats ? <AnimatedNumber value={communityStats.totalQueries} /> : '—'}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Total Queries</div>
              <div className="text-xs text-green-500 font-medium">+12% this week</div>
            </div>
          </div>
          
          {/* Active Users Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                {communityStats ? <AnimatedNumber value={communityStats.totalUsers} /> : '—'}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Active Users</div>
              <div className="text-xs text-green-500 font-medium">+8% this week</div>
            </div>
          </div>
          
          {/* Active Repos Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                {communityStats ? <AnimatedNumber value={communityStats.activeRepositories} /> : '—'}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Active Repos</div>
              <div className="text-xs text-green-500 font-medium">+15% this week</div>
            </div>
          </div>
          
          {/* Contributions Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                {communityStats ? <AnimatedNumber value={communityStats.successfulContributions} /> : '—'}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Contributions</div>
              <div className="text-xs text-green-500 font-medium">+22% this week</div>
            </div>
          </div>
          
          {/* Average Rating Card */}
          <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                {communityStats ? communityStats.averageSatisfaction : '—'}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Avg Rating</div>
              <div className="text-xs text-green-500 font-medium">+0.2 this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Filter className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
                <p className="text-sm text-muted-foreground">Refine your repository search</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
              className="bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 text-foreground"
            >
              Clear All
            </Button>
          </div>
          
          <EnhancedRepoFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-1 inline-flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0 gap-1">
              <TabsTrigger 
                value="recommended" 
                className={`flex items-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                  !userPreferences || userPreferences.techStack.length === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white/10 data-[state=active]:bg-white/20'
                }`}
                disabled={!userPreferences || userPreferences.techStack.length === 0}
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">For You</span>
                {recommendedRepos.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-white/20 text-foreground border-white/30">
                    {recommendedRepos.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="enhanced" 
                className={`flex items-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                  !userPreferences || userPreferences.techStack.length === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white/10 data-[state=active]:bg-white/20'
                }`}
                disabled={!userPreferences || userPreferences.techStack.length === 0}
              >
                <Target className="w-4 h-4" />
                <span className="font-medium">AI-Powered</span>
                {enhancedRecommendedRepos.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-foreground border-white/30">
                    {enhancedRecommendedRepos.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="flex items-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 hover:bg-white/10 data-[state=active]:bg-white/20"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">All Repos</span>
                <Badge variant="secondary" className="ml-1 bg-white/20 text-foreground border-white/30">
                  {filteredRepos.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="flex items-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 hover:bg-white/10 data-[state=active]:bg-white/20"
              >
                <Activity className="w-4 h-4" />
                <span className="font-medium">Trending</span>
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
                  <GlassRepoList
                    repositories={recommendedRepos}
                    onViewAnalysis={handleViewAnalysis}
                    onContribute={handleContribute}
                    onViewRepo={handleViewRepo}
                  />
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

            <TabsContent value="enhanced" className="mt-6">
              {userPreferences && userPreferences.techStack.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">AI-Powered Recommendations</h2>
                    <p className="text-muted-foreground mb-4">
                      Enhanced with machine learning and real-time GitHub data
                    </p>
                    {userStats && (
                      <div className="flex justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Interactions:</span>
                          <span className="font-medium">{userStats.totalInteractions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Positive:</span>
                          <span className="font-medium text-green-500">{userStats.positiveInteractions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Avg Score:</span>
                          <span className="font-medium">{userStats.averageScore.toFixed(1)}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* User Feedback Toast */}
                  {showFeedback && selectedRepo && (
                    <div className="fixed top-4 right-4 z-50 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-400">Feedback recorded!</p>
                          <p className="text-sm text-muted-foreground">Thanks for rating {selectedRepo.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <GlassRepoList
                    repositories={enhancedRecommendedRepos}
                    onViewAnalysis={handleViewAnalysis}
                    onContribute={handleContribute}
                    onViewRepo={handleViewRepo}
                    onLikeRepo={handleLikeRepo}
                    onDislikeRepo={handleDislikeRepo}
                    onRateRepo={handleRateRepo}
                    showExplanations={true}
                    explanations={recommendationExplanations}
                    enhanced={true}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Complete Your Onboarding</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up your preferences to get AI-powered recommendations with machine learning.
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
                <GlassRepoList
                  repositories={displayRepos}
                  onViewAnalysis={handleViewAnalysis}
                  onContribute={handleContribute}
                />
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
                <GlassRepoList
                  repositories={allRepos
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 10)}
                  onViewAnalysis={handleViewAnalysis}
                  onContribute={handleContribute}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
