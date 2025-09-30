'use client';

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
  Star,
  Wifi,
  WifiOff
} from 'lucide-react';
import EnhancedRepoFilters from '@/components/enhanced-repo-filters';
import GlassRepoList from '@/components/glass-repo-list';
import { getPopularReposClient, getRecommendedReposClient, getEnhancedRecommendedReposClient, getCommunityStatsClient } from '@/lib/github-client';
import { getUserPreferencesClient } from '@/lib/user-preferences-client';
import { getFilteredRepos, getRecommendationExplanation, getUserStats } from '@/lib/github';
import { trackUserInteractionClient } from '@/lib/database-client';
import { getTestimonials } from '@/lib/github';
import { useCommunityStatsWebSocket, usePopularReposWebSocket, useRecommendationsWebSocket } from '@/hooks/useWebSocket';
import { createPreferencesHash } from '@/lib/github-client';
import type { Repository, RepositoryFilters, UserPreferences } from '@/lib/types';

function ReposPageContentClient() {
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
  
  // WebSocket real-time updates
  const { stats: wsStats, isConnected: wsConnected, connectionError: wsError } = useCommunityStatsWebSocket();
  const { repositories: wsRepos } = usePopularReposWebSocket();
  const [preferencesHash, setPreferencesHash] = useState<string>('');
  const { recommendations: wsRecommendations, joinRoom: joinRecommendationsRoom } = useRecommendationsWebSocket(user?.id, preferencesHash);
  
  // Enhanced recommendation features
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [recommendationExplanations, setRecommendationExplanations] = useState<Map<string, string[]>>(new Map());
  const [userStats, setUserStats] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  
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
      const stats = await getCommunityStatsClient();
      setPreviousStats(communityStats);
      setCommunityStats(stats);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (error) {
      console.error('Failed to load community stats:', error);
      setIsLive(false);
    }
  };
  
  // WebSocket real-time updates
  useEffect(() => {
    if (wsStats) {
      setCommunityStats(wsStats);
      setLastUpdated(new Date());
      setIsLive(true);
    }
  }, [wsStats]);
  
  useEffect(() => {
    if (wsRepos.length > 0) {
      setAllRepos(prev => {
        const newRepos = [...prev];
        wsRepos.forEach(wsRepo => {
          const existingIndex = newRepos.findIndex(r => r.id === wsRepo.id);
          if (existingIndex === -1) {
            newRepos.push(wsRepo);
          } else {
            newRepos[existingIndex] = { ...newRepos[existingIndex], ...wsRepo };
          }
        });
        return newRepos;
      });
    }
  }, [wsRepos]);
  
  useEffect(() => {
    if (wsRecommendations.length > 0) {
      setEnhancedRecommendedRepos(wsRecommendations);
    }
  }, [wsRecommendations]);
  
  useEffect(() => {
    if (preferencesHash && user?.id && joinRecommendationsRoom) {
      joinRecommendationsRoom();
    }
  }, [preferencesHash, user?.id, joinRecommendationsRoom]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user preferences
        const preferences = await getUserPreferencesClient();
        console.log('Loaded preferences:', preferences);
        setUserPreferences(preferences);
        
        // Create preferences hash for WebSocket room
        if (preferences) {
          const hash = await createPreferencesHash(preferences);
          setPreferencesHash(hash);
        }
        
        // Load repositories
        const repos = await getPopularReposClient();
        console.log('Loaded repositories:', repos.length);
        setAllRepos(repos);
        
        // Get personalized recommendations if user has preferences
        if (preferences && preferences.techStack.length > 0) {
          console.log('Getting recommendations for preferences:', preferences);
          const recommended = await getRecommendedReposClient(preferences);
          console.log('Recommended repositories:', recommended.length);
          setRecommendedRepos(recommended);
          
          // Get enhanced ML-based recommendations
          const enhancedRecommended = await getEnhancedRecommendedReposClient(preferences, userId);
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
      const hasActiveFilters = Object.keys(filters).some(key => {
        const value = filters[key as keyof RepositoryFilters];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      });
      
      if (!hasActiveFilters) {
        setFilteredRepos(allRepos);
        setFilterError(null);
        return;
      }
      
      setIsFiltering(true);
      setFilterError(null);
      
      try {
        const filtered = await getFilteredRepos(filters);
        setFilteredRepos(filtered);
        
        if (filtered.length === 0) {
          setFilterError('No repositories match your filters. Try adjusting your criteria.');
        }
      } catch (error) {
        console.error('Filtering error:', error);
        setFilterError('Failed to apply filters. Showing all repositories instead.');
        setFilteredRepos(allRepos);
      } finally {
        setIsFiltering(false);
      }
    };
    
    // Add debounce to avoid excessive API calls
    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
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
    trackUserInteractionClient(userId, repo.full_name, 'contribute').catch(console.error);
    
    // Navigate to repository contribution page
    window.open(repo.html_url, '_blank');
  };

  const handleLikeRepo = (repo: Repository) => {
    // Track user interaction
    trackUserInteractionClient(userId, repo.full_name, 'like', 5).catch(console.error);
    
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
    trackUserInteractionClient(userId, repo.full_name, 'dislike', 1).catch(console.error);
    
    // Update user stats
    const stats = getUserStats(userId);
    setUserStats(stats);
    
    // Remove from recommendations temporarily
    setEnhancedRecommendedRepos(prev => prev.filter(r => r.full_name !== repo.full_name));
  };

  const handleViewRepo = (repo: Repository) => {
    // Track user interaction
    if (user) {
      trackUserInteractionClient(user.id, repo.full_name, 'view').catch(console.error);
    }
    trackUserInteractionClient(userId, repo.full_name, 'view').catch(console.error);
  };

  const handleRateRepo = (repo: Repository, rating: number) => {
    // Track user interaction with rating
    if (user) {
      trackUserInteractionClient(user.id, repo.full_name, 'analyze', rating).catch(console.error);
    }
    trackUserInteractionClient(userId, repo.full_name, 'analyze', rating).catch(console.error);
    
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
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              {wsConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  Live Updates
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  {wsError ? 'WebSocket Error' : 'Connecting...'}
                </>
              )}
            </span>
            {wsError && (
              <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">
                {wsError}
              </span>
            )}
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
          
          {/* Loading and Error States */}
          {isFiltering && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Applying filters...</span>
              </div>
            </div>
          )}
          
          {filterError && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{filterError}</span>
              </div>
            </div>
          )}
          
          <EnhancedRepoFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            disabled={isFiltering}
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

export default function ReposPageContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR or before client-side hydration
  if (!isClient) {
    return (
      <div className="container mx-auto py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading repositories...</p>
        </div>
      </div>
    );
  }

  return <ReposPageContentClient />;
}
