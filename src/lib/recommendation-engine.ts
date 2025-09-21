import type { Repository, UserPreferences, RecommendationScore, CompetitionLevel, ActivityLevel, AIDomain, ContributionDifficulty } from './types';

// Tech stack mapping for better matching
const techStackMappings: Record<string, string[]> = {
  'react': ['react', 'jsx', 'tsx', 'nextjs', 'gatsby', 'remix'],
  'vue': ['vue', 'nuxt', 'vuex'],
  'angular': ['angular', 'ng', 'typescript'],
  'nodejs': ['nodejs', 'javascript', 'typescript', 'express', 'nest', 'koa'],
  'python': ['python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow'],
  'django': ['django', 'python'],
  'flask': ['flask', 'python'],
  'fastapi': ['fastapi', 'python'],
  'tensorflow': ['tensorflow', 'ml', 'ai', 'python'],
  'pytorch': ['pytorch', 'ml', 'ai', 'python'],
  'rust': ['rust', 'cargo', 'actix', 'rocket'],
  'go': ['go', 'golang', 'gin', 'echo'],
  'typescript': ['typescript', 'ts', 'javascript'],
  'nextjs': ['nextjs', 'react', 'vercel'],
  'svelte': ['svelte', 'sveltekit'],
  'tailwind': ['tailwind', 'css', 'styling'],
  'docker': ['docker', 'container', 'devops'],
  'kubernetes': ['kubernetes', 'k8s', 'container', 'orchestration'],
  'graphql': ['graphql', 'gql', 'api', 'query'],
  'ml': ['machine-learning', 'ai', 'ml', 'tensorflow', 'pytorch', 'sklearn'],
};

// AI domain classification based on repository characteristics
const classifyAIDomain = (repo: Repository): AIDomain => {
  const name = repo.name.toLowerCase();
  const description = repo.description?.toLowerCase() || '';
  const topics = repo.topics.map(t => t.toLowerCase());
  const allText = `${name} ${description} ${topics.join(' ')}`;

  if (allText.includes('document') || allText.includes('doc') || allText.includes('collaboration')) {
    return 'oss-google-docs';
  }
  if (allText.includes('diagram') || allText.includes('chart') || allText.includes('visual')) {
    return 'lucid';
  }
  if (allText.includes('ai') || allText.includes('machine') || allText.includes('learning')) {
    return 'dive-into-ai';
  }
  if (allText.includes('memory') || allText.includes('brain') || allText.includes('knowledge')) {
    return 'supermemory-ai';
  }
  if (allText.includes('cap') || allText.includes('hat') || allText.includes('cover')) {
    return 'cap';
  }
  if (allText.includes('mail') || allText.includes('email') || allText.includes('smtp')) {
    return 'mail0';
  }
  return 'other';
};

// Calculate competition level based on stars and forks
const calculateCompetitionLevel = (repo: Repository): CompetitionLevel => {
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  
  if (stars > 50000 || forks > 10000) return 'very-high';
  if (stars > 10000 || forks > 2000) return 'high';
  if (stars > 1000 || forks > 200) return 'medium';
  if (stars > 100 || forks > 20) return 'low';
  return 'very-low';
};

// Calculate activity level based on recent commits and issues
const calculateActivityLevel = (repo: Repository): ActivityLevel => {
  const daysSinceUpdate = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24));
  const openIssues = repo.open_issues_count;
  
  if (daysSinceUpdate <= 7 && openIssues > 10) return 'highest';
  if (daysSinceUpdate <= 30 && openIssues > 5) return 'high';
  if (daysSinceUpdate <= 90 && openIssues > 0) return 'medium';
  return 'low';
};

// Calculate contribution difficulty
const calculateContributionDifficulty = (repo: Repository): ContributionDifficulty => {
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  const issues = repo.open_issues_count;
  const daysSinceUpdate = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate individual factors
  const codeComplexity = Math.min(100, (stars / 1000) * 20 + (forks / 100) * 30);
  const communitySize = Math.min(100, (stars / 10000) * 40 + (forks / 1000) * 60);
  const documentationQuality = Math.max(0, 100 - (daysSinceUpdate / 365) * 50);
  const issueResolutionTime = Math.min(100, Math.max(0, 100 - (daysSinceUpdate / 30) * 20));
  
  const totalScore = (codeComplexity + communitySize + documentationQuality + issueResolutionTime) / 4;
  
  let level: ContributionDifficulty['level'];
  if (totalScore < 25) level = 'beginner';
  else if (totalScore < 50) level = 'intermediate';
  else if (totalScore < 75) level = 'advanced';
  else level = 'expert';
  
  return {
    level,
    score: totalScore,
    factors: {
      codeComplexity,
      communitySize,
      documentationQuality,
      issueResolutionTime,
    },
    goodFirstIssues: Math.floor(issues * 0.1), // Simulated
    helpWantedIssues: Math.floor(issues * 0.15), // Simulated
  };
};

// Calculate recommendation score based on user preferences
const calculateRecommendationScore = (
  repo: Repository, 
  preferences: UserPreferences
): RecommendationScore => {
  let techStackMatch = 0;
  let difficultyMatch = 0;
  let goalAlignment = 0;
  let competitionScore = 0;
  let activityScore = 0;

  // Tech stack matching
  if (preferences.techStack.length > 0) {
    const repoText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
    const matchingTechs = preferences.techStack.filter(tech => {
      const techLower = tech.toLowerCase();
      return repoText.includes(techLower) || 
             techStackMappings[techLower]?.some(keyword => repoText.includes(keyword));
    });
    techStackMatch = (matchingTechs.length / preferences.techStack.length) * 100;
  }

  // Difficulty matching based on experience level
  const experienceDifficultyMap: Record<string, number> = {
    'beginner': 25,
    'intermediate': 50,
    'advanced': 75,
  };
  const targetDifficulty = experienceDifficultyMap[preferences.experienceLevel] || 50;
  const actualDifficulty = repo.contribution_difficulty.score;
  difficultyMatch = 100 - Math.abs(targetDifficulty - actualDifficulty);

  // Goal alignment
  const goalAlignmentMap: Record<string, number> = {
    'learn': 80,
    'contribute': 90,
    'architecture': 70,
    'inspiration': 60,
  };
  goalAlignment = goalAlignmentMap[preferences.goal] || 50;

  // Competition scoring (lower competition = higher score for beginners)
  const competitionScores: Record<CompetitionLevel, number> = {
    'very-low': 90,
    'low': 75,
    'medium': 50,
    'high': 25,
    'very-high': 10,
  };
  competitionScore = competitionScores[repo.competition_level];

  // Activity scoring (higher activity = higher score)
  const activityScores: Record<ActivityLevel, number> = {
    'highest': 90,
    'high': 75,
    'medium': 50,
    'low': 25,
  };
  activityScore = activityScores[repo.activity_level];

  // Calculate total score with weighted average
  const totalScore = (
    techStackMatch * 0.3 +
    difficultyMatch * 0.25 +
    goalAlignment * 0.2 +
    competitionScore * 0.15 +
    activityScore * 0.1
  );

  return {
    totalScore: Math.round(totalScore),
    techStackMatch: Math.round(techStackMatch),
    difficultyMatch: Math.round(difficultyMatch),
    goalAlignment: Math.round(goalAlignment),
    competitionScore: Math.round(competitionScore),
    activityScore: Math.round(activityScore),
  };
};

// Enhance repository with additional metadata using real GitHub data
export const enhanceRepository = (repo: Repository): Repository => {
  // Use real data if available, otherwise calculate with deterministic values
  const contributorCount = repo.contributor_count || Math.floor(repo.forks_count * 0.3);
  const recentCommits = repo.recent_commits_count || Math.floor((repo.stargazers_count || 100) * 0.1) + 10;
  const goodFirstIssues = repo.good_first_issues_count || Math.floor(repo.open_issues_count * 0.1);
  
  return {
    ...repo,
    competition_level: calculateCompetitionLevel(repo),
    activity_level: calculateActivityLevel(repo),
    ai_domain: classifyAIDomain(repo),
    contribution_difficulty: {
      ...calculateContributionDifficulty(repo),
      goodFirstIssues,
      helpWantedIssues: Math.floor(repo.open_issues_count * 0.15),
    },
    last_analyzed: repo.updated_at || new Date().toISOString(),
    contributor_count: contributorCount,
    recent_commits: recentCommits,
    issue_response_rate: recentCommits > 20 ? Math.min(95, 60 + (recentCommits / 50) * 35) : 60,
    documentation_score: repo.topics.length > 3 ? Math.min(95, 70 + (repo.topics.length / 10) * 25) : 70,
  };
};

// Get personalized recommendations
export const getPersonalizedRecommendations = (
  repositories: Repository[], 
  preferences: UserPreferences,
  limit: number = 10
): Repository[] => {
  // Enhance repositories with calculated metadata
  const enhancedRepos = repositories.map(enhanceRepository);
  
  // Calculate recommendation scores
  const reposWithScores = enhancedRepos.map(repo => ({
    ...repo,
    recommendation_score: calculateRecommendationScore(repo, preferences),
  }));

  // Sort by recommendation score and return top results
  return reposWithScores
    .sort((a, b) => (b.recommendation_score?.totalScore || 0) - (a.recommendation_score?.totalScore || 0))
    .slice(0, limit);
};

// Filter repositories based on filters
export const filterRepositories = (
  repositories: Repository[], 
  filters: Partial<import('./types').RepositoryFilters>
): Repository[] => {
  console.log('Filtering repositories with filters:', filters);
  console.log('Total repositories before filtering:', repositories.length);
  
  const filtered = repositories.filter(repo => {
    // Tech stack filter
    if (filters.techStack && filters.techStack.length > 0) {
      const repoText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
      const hasMatchingTech = filters.techStack.some(tech => {
        const techLower = tech.toLowerCase();
        const hasDirectMatch = repoText.includes(techLower);
        const hasMappedMatch = techStackMappings[techLower]?.some(keyword => repoText.includes(keyword));
        const match = hasDirectMatch || hasMappedMatch;
        
        if (match) {
          console.log(`Tech stack match found for ${tech} in repo: ${repo.name}`);
        }
        
        return match;
      });
      if (!hasMatchingTech) return false;
    }

    // Competition level filter
    if (filters.competitionLevel && filters.competitionLevel.length > 0) {
      if (!filters.competitionLevel.includes(repo.competition_level)) return false;
    }

    // Activity level filter
    if (filters.activityLevel && filters.activityLevel.length > 0) {
      if (!filters.activityLevel.includes(repo.activity_level)) return false;
    }

    // AI domain filter
    if (filters.aiDomain && filters.aiDomain.length > 0) {
      if (!filters.aiDomain.includes(repo.ai_domain)) return false;
    }

    // Language filter
    if (filters.language && filters.language.length > 0) {
      if (!repo.language || !filters.language.includes(repo.language.toLowerCase())) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
      if (!searchText.includes(query)) return false;
    }

    return true;
  });
  
  console.log('Total repositories after filtering:', filtered.length);
  return filtered;
};
