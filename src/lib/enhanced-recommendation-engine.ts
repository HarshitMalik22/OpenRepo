import type { Repository, UserPreferences, RecommendationScore, CompetitionLevel, ActivityLevel, AIDomain, ContributionDifficulty } from './types';

// Enhanced tech stack mappings with semantic relationships
const techStackMappings: Record<string, string[]> = {
  'react': ['react', 'jsx', 'tsx', 'nextjs', 'gatsby', 'remix', 'react-native', 'redux', 'mobx'],
  'vue': ['vue', 'nuxt', 'vuex', 'vuepress', 'vite'],
  'angular': ['angular', 'ng', 'typescript', 'ionic', 'rxjs'],
  'nodejs': ['nodejs', 'javascript', 'typescript', 'express', 'nest', 'koa', 'fastify', 'hapi'],
  'python': ['python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow', 'pandas', 'numpy'],
  'django': ['django', 'python', 'djangorestframework', 'celery'],
  'flask': ['flask', 'python', 'flask-sqlalchemy', 'jinja2'],
  'fastapi': ['fastapi', 'python', 'pydantic', 'uvicorn'],
  'tensorflow': ['tensorflow', 'ml', 'ai', 'python', 'keras', 'tensorboard'],
  'pytorch': ['pytorch', 'ml', 'ai', 'python', 'torchvision', 'torchaudio'],
  'rust': ['rust', 'cargo', 'actix', 'rocket', 'tokio', 'serde'],
  'go': ['go', 'golang', 'gin', 'echo', 'buffalo', 'fiber'],
  'typescript': ['typescript', 'ts', 'javascript', 'deno', 'esbuild'],
  'nextjs': ['nextjs', 'react', 'vercel', 'next-auth'],
  'svelte': ['svelte', 'sveltekit', 'sapper'],
  'tailwind': ['tailwind', 'css', 'styling', 'postcss'],
  'docker': ['docker', 'container', 'devops', 'kubernetes'],
  'kubernetes': ['kubernetes', 'k8s', 'container', 'orchestration', 'helm'],
  'graphql': ['graphql', 'gql', 'api', 'query', 'apollo', 'relay'],
  'ml': ['machine-learning', 'ai', 'ml', 'tensorflow', 'pytorch', 'sklearn', 'opencv'],
  'java': ['java', 'spring', 'hibernate', 'maven', 'gradle'],
  'php': ['php', 'laravel', 'symfony', 'wordpress', 'composer'],
  'c++': ['cpp', 'c++', 'stl', 'boost', 'cmake'],
  'ruby': ['ruby', 'rails', 'sinatra', 'rack'],
  'swift': ['swift', 'ios', 'macos', 'xcode'],
  'kotlin': ['kotlin', 'android', 'spring', 'ktor'],
};

// Semantic technology categories
const techCategories: Record<string, string[]> = {
  'frontend': ['react', 'vue', 'angular', 'svelte', 'typescript', 'nextjs', 'tailwind', 'css', 'html'],
  'backend': ['nodejs', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'express', 'django', 'spring'],
  'mobile': ['react-native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
  'devops': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'terraform'],
  'ai/ml': ['tensorflow', 'pytorch', 'ml', 'ai', 'sklearn', 'pandas', 'numpy'],
  'database': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'],
};

// User feedback and interaction tracking
interface UserInteraction {
  repositoryFullName: string;
  type: 'view' | 'like' | 'dislike' | 'contribute' | 'analyze';
  timestamp: string;
  score?: number;
}

interface UserStats {
  totalInteractions: number;
  positiveInteractions: number;
  topTechStacks: string[];
  averageScore: number;
  interactionTypes: Record<string, number>;
  skillProgression: {
    beginnerRepos: number;
    intermediateRepos: number;
    advancedRepos: number;
    progressionTrend: 'improving' | 'stable' | 'declining';
  };
  preferenceAccuracy: {
    techStackAccuracy: number;
    difficultyAccuracy: number;
    goalAlignment: number;
    overallAccuracy: number;
  };
  lastActivity: string | null;
}

interface UserProfile {
  preferences: UserPreferences;
  interactions: UserInteraction[];
  learnedWeights: {
    techStack: number;
    difficulty: number;
    goal: number;
    competition: number;
    activity: number;
  };
}

// Enhanced recommendation engine with ML-based scoring
export class EnhancedRecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map();
  private repositoryCache: Map<string, Repository> = new Map();

  constructor() {
    this.loadUserProfiles();
  }

  // Get or create user profile
  private getUserProfile(userId: string): UserProfile {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        preferences: this.getDefaultPreferences(),
        interactions: [],
        learnedWeights: {
          techStack: 0.3,
          difficulty: 0.25,
          goal: 0.2,
          competition: 0.15,
          activity: 0.1,
        },
      });
    }
    return this.userProfiles.get(userId)!;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      techStack: [],
      goal: 'learn',
      experienceLevel: 'beginner',
      completed: false,
    };
  }

  // Load user profiles from localStorage
  private loadUserProfiles(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('opensauce-user-profiles');
      if (stored) {
        const profiles = JSON.parse(stored);
        Object.entries(profiles).forEach(([userId, profile]) => {
          this.userProfiles.set(userId, profile as UserProfile);
        });
      }
    } catch (error) {
      console.error('Failed to load user profiles:', error);
    }
  }

  // Save user profiles to localStorage
  private saveUserProfiles(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const profiles: Record<string, UserProfile> = {};
      this.userProfiles.forEach((profile, userId) => {
        profiles[userId] = profile;
      });
      localStorage.setItem('opensauce-user-profiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('Failed to save user profiles:', error);
    }
  }

  // Track user interaction
  trackInteraction(userId: string, repositoryFullName: string, type: UserInteraction['type'], score?: number): void {
    const profile = this.getUserProfile(userId);
    profile.interactions.push({
      repositoryFullName,
      type,
      timestamp: new Date().toISOString(),
      score,
    });
    this.saveUserProfiles();
  }

  // Update learned weights based on user behavior
  private updateLearnedWeights(profile: UserProfile): void {
    const recentInteractions = profile.interactions.slice(-50); // Last 50 interactions
    
    if (recentInteractions.length < 10) return; // Need enough data

    const positiveActions = recentInteractions.filter(i => 
      i.type === 'like' || i.type === 'contribute' || (i.score && i.score > 3)
    );
    
    const negativeActions = recentInteractions.filter(i => 
      i.type === 'dislike' || (i.score && i.score < 3)
    );

    // Adjust weights based on what users engage with
    if (positiveActions.length > 0) {
      // Increase weights for factors that lead to positive engagement
      profile.learnedWeights.techStack = Math.min(0.5, profile.learnedWeights.techStack + 0.05);
      profile.learnedWeights.difficulty = Math.min(0.4, profile.learnedWeights.difficulty + 0.03);
    }

    if (negativeActions.length > 0) {
      // Decrease weights for factors that lead to negative engagement
      profile.learnedWeights.competition = Math.max(0.05, profile.learnedWeights.competition - 0.02);
      profile.learnedWeights.activity = Math.max(0.05, profile.learnedWeights.activity - 0.02);
    }
  }

  // Enhanced semantic matching
  private calculateSemanticMatch(repo: Repository, preferences: UserPreferences): number {
    let matchScore = 0;
    let totalFactors = 0;

    // Tech stack semantic matching
    if (preferences.techStack.length > 0) {
      const repoText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')} ${repo.language || ''}`.toLowerCase();
      
      for (const tech of preferences.techStack) {
        const techLower = tech.toLowerCase();
        
        // Direct match
        if (repoText.includes(techLower)) {
          matchScore += 1.0;
        }
        
        // Mapped matches
        const mappedTechs = techStackMappings[techLower] || [];
        const mappedMatches = mappedTechs.filter(mappedTech => repoText.includes(mappedTech));
        matchScore += mappedMatches.length * 0.7;
        
        // Category matching
        for (const [category, techs] of Object.entries(techCategories)) {
          if (techs.includes(techLower)) {
            const categoryMatches = techs.filter(t => repoText.includes(t));
            matchScore += categoryMatches.length * 0.3;
          }
        }
      }
      
      totalFactors += preferences.techStack.length;
    }

    return totalFactors > 0 ? Math.min(100, (matchScore / totalFactors) * 100) : 0;
  }

  // Enhanced difficulty matching with experience consideration
  private calculateDifficultyMatch(repo: Repository, preferences: UserPreferences): number {
    const experienceDifficultyMap: Record<string, number> = {
      'beginner': 20,
      'intermediate': 45,
      'advanced': 70,
      'expert': 85,
    };
    
    const targetDifficulty = experienceDifficultyMap[preferences.experienceLevel] || 50;
    const actualDifficulty = repo.contribution_difficulty?.score || 50;
    
    // Calculate match with tolerance based on experience
    const tolerance = preferences.experienceLevel === 'beginner' ? 15 : 25;
    const difference = Math.abs(targetDifficulty - actualDifficulty);
    
    if (difference <= tolerance) {
      return 100 - (difference / tolerance) * 30; // Perfect match within tolerance
    } else {
      return Math.max(0, 70 - (difference - tolerance) * 2); // Penalty for being outside tolerance
    }
  }

  // Enhanced goal alignment
  private calculateGoalAlignment(repo: Repository, preferences: UserPreferences): number {
    const goalAlignmentMap: Record<string, (repo: Repository) => number> = {
      'learn': (repo) => {
        // Favor repos with good documentation and beginner-friendly issues
        const docScore = repo.contribution_difficulty?.factors?.documentationQuality || 50;
        const goodFirstIssues = repo.contribution_difficulty?.goodFirstIssues || 0;
        return Math.min(100, docScore * 0.6 + Math.min(50, goodFirstIssues * 5));
      },
      'contribute': (repo) => {
        // Favor active repos with many issues and good response rates
        const activityScore = repo.recent_commits ? Math.min(100, repo.recent_commits * 2) : 50;
        const responseRate = repo.issue_response_rate || 50;
        const openIssues = repo.open_issues_count || 0;
        return Math.min(100, activityScore * 0.4 + responseRate * 0.4 + Math.min(20, openIssues * 0.5));
      },
      'architecture': (repo) => {
        // Favor well-established, complex repos
        const stars = repo.stargazers_count || 0;
        const complexity = repo.contribution_difficulty?.score || 50;
        return Math.min(100, Math.log10(stars + 1) * 20 + complexity * 0.6);
      },
      'inspiration': (repo) => {
        // Favor trending, innovative repos
        const stars = repo.stargazers_count || 0;
        const recentActivity = repo.recent_commits || 0;
        return Math.min(100, Math.log10(stars + 1) * 15 + recentActivity * 3);
      },
    };

    const calculator = goalAlignmentMap[preferences.goal];
    return calculator ? calculator(repo) : 50;
  }

  // Enhanced recommendation scoring with ML weights
  calculateEnhancedScore(repo: Repository, preferences: UserPreferences, userId?: string): RecommendationScore {
    const profile = userId ? this.getUserProfile(userId) : null;
    const weights = profile?.learnedWeights || {
      techStack: 0.3,
      difficulty: 0.25,
      goal: 0.2,
      competition: 0.15,
      activity: 0.1,
    };

    const techStackMatch = this.calculateSemanticMatch(repo, preferences);
    const difficultyMatch = this.calculateDifficultyMatch(repo, preferences);
    const goalAlignment = this.calculateGoalAlignment(repo, preferences);

    // Competition scoring
    const competitionScores: Record<CompetitionLevel, number> = {
      'very-low': 90,
      'low': 75,
      'medium': 50,
      'high': 25,
      'very-high': 10,
    };
    const competitionScore = competitionScores[repo.competition_level] || 50;

    // Activity scoring
    const activityScores: Record<ActivityLevel, number> = {
      'highest': 90,
      'high': 75,
      'medium': 50,
      'low': 25,
    };
    const activityScore = activityScores[repo.activity_level] || 50;

    // Calculate weighted total score
    const totalScore = (
      techStackMatch * weights.techStack +
      difficultyMatch * weights.difficulty +
      goalAlignment * weights.goal +
      competitionScore * weights.competition +
      activityScore * weights.activity
    );

    return {
      totalScore: Math.round(totalScore),
      techStackMatch: Math.round(techStackMatch),
      difficultyMatch: Math.round(difficultyMatch),
      goalAlignment: Math.round(goalAlignment),
      competitionScore: Math.round(competitionScore),
      activityScore: Math.round(activityScore),
    };
  }

  // Get enhanced personalized recommendations
  getEnhancedRecommendations(
    repositories: Repository[], 
    preferences: UserPreferences, 
    userId?: string,
    limit: number = 10
  ): Repository[] {
    // Enhance repositories with calculated metadata
    const enhancedRepos = repositories.map(repo => ({
      ...repo,
      recommendation_score: this.calculateEnhancedScore(repo, preferences, userId),
    }));

    // Sort by recommendation score and return top results
    return enhancedRepos
      .sort((a, b) => (b.recommendation_score?.totalScore || 0) - (a.recommendation_score?.totalScore || 0))
      .slice(0, limit);
  }

  // Get recommendation explanations
  getRecommendationExplanation(repo: Repository, score: RecommendationScore): string[] {
    const explanations: string[] = [];

    if (score.techStackMatch > 70) {
      explanations.push(`Strong match with your tech stack (${score.techStackMatch}%)`);
    } else if (score.techStackMatch > 40) {
      explanations.push(`Good tech stack alignment (${score.techStackMatch}%)`);
    }

    if (score.difficultyMatch > 80) {
      explanations.push(`Perfect difficulty level for your experience`);
    } else if (score.difficultyMatch > 60) {
      explanations.push(`Suitable difficulty level`);
    }

    if (score.goalAlignment > 80) {
      explanations.push(`Excellent match for your goals`);
    } else if (score.goalAlignment > 60) {
      explanations.push(`Good goal alignment`);
    }

    if (score.competitionScore > 70) {
      explanations.push(`Low competition - great opportunity`);
    }

    if (score.activityScore > 70) {
      explanations.push(`Highly active community`);
    }

    return explanations.length > 0 ? explanations : ['Recommended based on overall profile match'];
  }

  // Update user preferences
  updateUserPreferences(userId: string, preferences: UserPreferences): void {
    const profile = this.getUserProfile(userId);
    profile.preferences = preferences;
    this.saveUserProfiles();
  }

  // Get user statistics
  getUserStats(userId: string): UserStats {
    const profile = this.getUserProfile(userId);
    const interactions = profile.interactions;
    
    if (interactions.length === 0) {
      return {
        totalInteractions: 0,
        positiveInteractions: 0,
        topTechStacks: [],
        averageScore: 0,
        interactionTypes: {},
        skillProgression: {
          beginnerRepos: 0,
          intermediateRepos: 0,
          advancedRepos: 0,
          progressionTrend: 'stable',
        },
        preferenceAccuracy: {
          techStackAccuracy: 0,
          difficultyAccuracy: 0,
          goalAlignment: 0,
          overallAccuracy: 0,
        },
        lastActivity: null,
      };
    }

    const positiveInteractions = interactions.filter(i => 
      i.type === 'like' || (i.score && i.score >= 4) || i.type === 'contribute'
    );

    const techStackCounts: Record<string, number> = {};
    interactions.forEach(interaction => {
      const repo = this.repositoryCache.get(interaction.repositoryFullName);
      if (repo?.language) {
        techStackCounts[repo.language] = (techStackCounts[repo.language] || 0) + 1;
      }
    });

    const topTechStacks = Object.entries(techStackCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tech]) => tech);

    const scores = interactions
      .filter(i => i.score !== undefined)
      .map(i => i.score!);

    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      totalInteractions: interactions.length,
      positiveInteractions: positiveInteractions.length,
      topTechStacks,
      averageScore,
      interactionTypes: this.getInteractionTypeBreakdown(interactions),
      skillProgression: this.getSkillProgression(interactions),
      preferenceAccuracy: this.getPreferenceAccuracy(interactions, profile.preferences),
      lastActivity: interactions.length > 0 ? interactions[interactions.length - 1].timestamp : null,
    };
  }

  /**
   * Get breakdown of interaction types
   */
  private getInteractionTypeBreakdown(interactions: UserInteraction[]): Record<string, number> {
    const typeCounts = interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return typeCounts;
  }

  /**
   * Analyze skill progression based on successful contributions
   */
  private getSkillProgression(interactions: UserInteraction[]): {
    beginnerRepos: number;
    intermediateRepos: number;
    advancedRepos: number;
    expertRepos: number;
    progressionTrend: 'improving' | 'stable' | 'declining';
  } {
    const contributeInteractions = interactions.filter(i => i.type === 'contribute');
    const repoDifficulties = contributeInteractions.map(i => {
      const repo = this.repositoryCache.get(i.repositoryFullName);
      return repo?.contribution_difficulty?.level || 'unknown';
    });

    const difficultyCounts: Record<'beginner' | 'intermediate' | 'advanced' | 'expert' | 'unknown', number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0,
      unknown: 0
    };
    
    // Count occurrences of each difficulty level
    repoDifficulties.forEach(difficulty => {
      if (difficulty in difficultyCounts) {
        difficultyCounts[difficulty]++;
      }
    });

    // Analyze progression trend
    const sortedInteractions = contributeInteractions.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const recentDifficulties = sortedInteractions.slice(-3).map(i => {
      const repo = this.repositoryCache.get(i.repositoryFullName);
      return repo?.contribution_difficulty?.level || 'unknown';
    });
    
    const earlierDifficulties = sortedInteractions.slice(0, 3).map(i => {
      const repo = this.repositoryCache.get(i.repositoryFullName);
      return repo?.contribution_difficulty?.level || 'unknown';
    });

    const difficultyRank = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4, 'unknown': 0 };
    const recentAvg = recentDifficulties.reduce((sum, d) => sum + difficultyRank[d], 0) / recentDifficulties.length;
    const earlierAvg = earlierDifficulties.reduce((sum, d) => sum + difficultyRank[d], 0) / earlierDifficulties.length;
    
    let progressionTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg > earlierAvg + 0.5) progressionTrend = 'improving';
    else if (recentAvg < earlierAvg - 0.5) progressionTrend = 'declining';

    return {
      beginnerRepos: difficultyCounts['beginner'] || 0,
      intermediateRepos: difficultyCounts['intermediate'] || 0,
      advancedRepos: difficultyCounts['advanced'] || 0,
      expertRepos: difficultyCounts['expert'] || 0,
      progressionTrend,
    };
  }

  /**
   * Calculate preference accuracy based on user feedback
   */
  private getPreferenceAccuracy(interactions: UserInteraction[], preferences: UserPreferences): {
    techStackAccuracy: number;
    difficultyAccuracy: number;
    goalAlignment: number;
    overallAccuracy: number;
  } {
    const scoredInteractions = interactions.filter(i => i.score !== undefined);
    if (scoredInteractions.length === 0) {
      return { techStackAccuracy: 0, difficultyAccuracy: 0, goalAlignment: 0, overallAccuracy: 0 };
    }

    const userPreferences = this.getUserPreferences('default-user');
    if (!userPreferences) {
      return { techStackAccuracy: 0, difficultyAccuracy: 0, goalAlignment: 0, overallAccuracy: 0 };
    }

    let techStackMatches = 0;
    let difficultyMatches = 0;
    let goalMatches = 0;
    let totalChecks = 0;

    scoredInteractions.forEach(interaction => {
      const repo = this.repositoryCache.get(interaction.repositoryFullName);
      if (!repo) return;

      // Check tech stack alignment
      if (repo.language && userPreferences.techStack.includes(repo.language)) {
        techStackMatches++;
      }
      totalChecks++;

      // Check difficulty alignment
      if (repo.contribution_difficulty?.level === userPreferences.experienceLevel) {
        difficultyMatches++;
      }
      totalChecks++;

      // Check goal alignment
      if (this.isGoalAligned(repo, userPreferences)) {
        goalMatches++;
      }
      totalChecks++;
    });

    const techStackAccuracy = totalChecks > 0 ? (techStackMatches / (scoredInteractions.length)) * 100 : 0;
    const difficultyAccuracy = totalChecks > 0 ? (difficultyMatches / (scoredInteractions.length)) * 100 : 0;
    const goalAlignment = totalChecks > 0 ? (goalMatches / (scoredInteractions.length)) * 100 : 0;
    const overallAccuracy = (techStackAccuracy + difficultyAccuracy + goalAlignment) / 3;

    return {
      techStackAccuracy,
      difficultyAccuracy,
      goalAlignment,
      overallAccuracy,
    };
  }

  /**
   * Update user preferences based on interaction patterns
   */
  public updateUserPreferencesFromBehavior(): void {
    const interactions = this.getUserInteractions('default-user');
    if (interactions.length < 5) return; // Need enough data

    const userPreferences = this.getUserPreferences('default-user');
    if (!userPreferences) return;

    const positiveInteractions = interactions.filter(i => 
      i.type === 'like' || (i.score && i.score >= 4) || i.type === 'contribute'
    );

    if (positiveInteractions.length === 0) return;

    // Analyze preferred tech stacks
    const techStackCounts: Record<string, number> = {};
    positiveInteractions.forEach(interaction => {
      const repo = this.repositoryCache.get(interaction.repositoryFullName);
      if (repo?.language) {
        techStackCounts[repo.language] = (techStackCounts[repo.language] || 0) + 1;
      }
    });

    // Update tech stack preferences if new preferences emerge
    const topTechStacks = Object.entries(techStackCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tech]) => tech);

    const newTechStacks = topTechStacks.filter(tech => !userPreferences.techStack.includes(tech));
    if (newTechStacks.length > 0) {
      userPreferences.techStack.push(...newTechStacks.slice(0, 2)); // Add up to 2 new tech stacks
    }

    // Analyze preferred difficulty
    const difficultyCounts: Record<string, number> = {};
    positiveInteractions.forEach(interaction => {
      const repo = this.repositoryCache.get(interaction.repositoryFullName);
      if (repo?.contribution_difficulty?.level) {
        difficultyCounts[repo.contribution_difficulty.level] = (difficultyCounts[repo.contribution_difficulty.level] || 0) + 1;
      }
    });

    const preferredDifficulty = Object.entries(difficultyCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    if (preferredDifficulty && preferredDifficulty !== userPreferences.experienceLevel) {
      // Only update if there's a strong preference (at least 3 interactions)
      if (difficultyCounts[preferredDifficulty] >= 3) {
        userPreferences.experienceLevel = preferredDifficulty as 'beginner' | 'intermediate' | 'advanced';
      }
    }

    // Save updated preferences
    this.saveUserPreferences('default-user', userPreferences);
  }

  /**
   * Get personalized insights for the user
   */
  public getUserInsights(): {
    topStrengths: string[];
    improvementAreas: string[];
    recommendedActions: string[];
    learningPath: string[];
  } {
    const interactions = this.getUserInteractions('default-user');
    const stats = this.getUserStats('default-user');
    
    const insights = {
      topStrengths: [] as string[],
      improvementAreas: [] as string[],
      recommendedActions: [] as string[],
      learningPath: [] as string[],
    };

    // Analyze strengths
    if (stats.topTechStacks.length > 0) {
      insights.topStrengths.push(`Strong in ${stats.topTechStacks.slice(0, 2).join(' and ')}`);
    }
    
    if (stats.positiveInteractions / stats.totalInteractions > 0.7) {
      insights.topStrengths.push('Good at selecting suitable repositories');
    }

    // Analyze improvement areas
    if (stats.averageScore < 3) {
      insights.improvementAreas.push('Focus on finding better-matched repositories');
    }
    
    const contributeRate = stats.interactionTypes['contribute'] / stats.totalInteractions;
    if (contributeRate < 0.1) {
      insights.improvementAreas.push('Increase contribution rate');
    }

    // Generate recommended actions
    if (stats.skillProgression.progressionTrend === 'improving') {
      insights.recommendedActions.push('Continue challenging yourself with more complex projects');
    } else if (stats.skillProgression.progressionTrend === 'stable') {
      insights.recommendedActions.push('Try repositories with different technologies');
    }

    // Generate learning path
    if (stats.skillProgression.beginnerRepos > stats.skillProgression.advancedRepos) {
      insights.learningPath.push('Focus on intermediate-level repositories');
    }
    
    if (stats.topTechStacks.length < 3) {
      insights.learningPath.push('Explore new technologies to diversify skills');
    }

    return insights;
  }

  // Missing method implementations
  private getUserPreferences(userId: string): UserPreferences {
    const profile = this.getUserProfile(userId);
    return profile.preferences;
  }

  private getUserInteractions(userId: string): UserInteraction[] {
    const profile = this.getUserProfile(userId);
    return profile.interactions;
  }

  private saveUserPreferences(userId: string, preferences: UserPreferences): void {
    this.updateUserPreferences(userId, preferences);
  }

  private isGoalAligned(repository: Repository, preferences: UserPreferences): boolean {
    // Simple goal alignment check - can be enhanced
    if (!preferences.goal) return true;
    
    const repoTopics = repository.topics || [];
    const repoLang = repository.language?.toLowerCase() || '';
    const goalLower = preferences.goal.toLowerCase();
    
    return repoTopics.some(topic => topic.toLowerCase().includes(goalLower)) ||
           repoLang.includes(goalLower);
  }
}

// Global instance
export const enhancedRecommendationEngine = new EnhancedRecommendationEngine();
