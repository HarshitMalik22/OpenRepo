import type { Repository, UserPreferences, RecommendationScore, CompetitionLevel, ActivityLevel, AIDomain, ContributionDifficulty } from './types';

// Tech stack mapping for better matching - expanded to be more inclusive
const techStackMappings: Record<string, string[]> = {
  'react': ['react', 'jsx', 'tsx', 'nextjs', 'gatsby', 'remix', 'react-native', 'reactjs', 'create-react-app'],
  'vue': ['vue', 'nuxt', 'vuex', 'vuejs', 'vue-router', 'vite'],
  'angular': ['angular', 'ng', 'typescript', 'angularjs', 'ionic'],
  'nodejs': ['nodejs', 'javascript', 'typescript', 'express', 'nest', 'koa', 'hapi', 'fastify', 'npm', 'yarn'],
  'python': ['python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'scipy', 'selenium', 'requests'],
  'django': ['django', 'python', 'djangorestframework', 'django-rest-framework'],
  'flask': ['flask', 'python', 'flask-sqlalchemy', 'flask-restful'],
  'fastapi': ['fastapi', 'python', 'uvicorn', 'pydantic'],
  'tensorflow': ['tensorflow', 'ml', 'ai', 'python', 'keras', 'tensorboard'],
  'pytorch': ['pytorch', 'ml', 'ai', 'python', 'torch', 'torchvision', 'torchaudio'],
  'rust': ['rust', 'cargo', 'actix', 'rocket', 'tokio', 'serde'],
  'go': ['go', 'golang', 'gin', 'echo', 'gorilla', 'grpc', 'protobuf'],
  'typescript': ['typescript', 'ts', 'javascript', 'js', 'deno', 'node'],
  'nextjs': ['nextjs', 'react', 'vercel', 'next', 'next-auth'],
  'svelte': ['svelte', 'sveltekit', 'sapper', 'sveltejs'],
  'tailwind': ['tailwind', 'css', 'styling', 'postcss', 'windicss'],
  'docker': ['docker', 'container', 'devops', 'compose', 'kubernetes', 'podman'],
  'kubernetes': ['kubernetes', 'k8s', 'container', 'orchestration', 'helm', 'istio', 'minikube'],
  'graphql': ['graphql', 'gql', 'api', 'query', 'apollo', 'relay', 'prisma'],
  'ml': ['machine-learning', 'ai', 'ml', 'tensorflow', 'pytorch', 'sklearn', 'scikit-learn', 'pandas', 'numpy'],
  'java': ['java', 'spring', 'hibernate', 'maven', 'gradle', 'quarkus', 'micronaut'],
  'javascript': ['javascript', 'js', 'nodejs', 'npm', 'yarn', 'webpack', 'babel', 'vite'],
  'php': ['php', 'laravel', 'symfony', 'wordpress', 'drupal', 'composer'],
  'ruby': ['ruby', 'rails', 'sinatra', 'rack', 'bundler', 'gem'],
  'c++': ['c++', 'cpp', 'stl', 'boost', 'cmake', 'makefile'],
  'c#': ['c#', 'csharp', '.net', 'aspnet', 'entity-framework', 'nuget'],
  'swift': ['swift', 'ios', 'macos', 'xcode', 'uikit', 'swiftui'],
  'kotlin': ['kotlin', 'android', 'jetpack', 'gradle', 'ktor'],
  'android': ['android', 'kotlin', 'java', 'jetpack', 'gradle', 'sdk'],
  'ios': ['ios', 'swift', 'objective-c', 'xcode', 'uikit', 'swiftui'],
  'aws': ['aws', 'amazon', 'ec2', 's3', 'lambda', 'cloudformation', 'dynamodb'],
  'blockchain': ['blockchain', 'ethereum', 'bitcoin', 'solidity', 'web3', 'defi'],
  'ai': ['ai', 'artificial-intelligence', 'machine-learning', 'ml', 'deep-learning', 'neural-network'],
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
export function filterRepositories(
  repositories: Repository[], 
  filters: Partial<import('./types').RepositoryFilters>
): Repository[] {
  console.log('🔍 [FILTER] Starting filter process with filters:', filters);
  console.log(`📊 [FILTER] Total repositories before filtering: ${repositories.length}`);
  
  // If no filters are applied, return all repositories
  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  
  if (!hasActiveFilters) {
    console.log('⚡ [FILTER] No active filters, returning all repositories');
    return repositories;
  }
  
  console.log('✅ [FILTER] Active filters detected, starting filtering process');
  
  const filtered = repositories.filter(repo => {
    let matchScore = 0;
    let requiredMatches = 0;
    
    // Tech stack filter (optional but increases score)
    if (filters.techStack && filters.techStack.length > 0) {
      requiredMatches++;
      const repoText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')} ${repo.language || ''}`.toLowerCase();
      
      const hasMatchingTech = filters.techStack.some(tech => {
        const techLower = tech.toLowerCase();
        const hasDirectMatch = repoText.includes(techLower);
        const hasMappedMatch = techStackMappings[techLower]?.some(keyword => repoText.includes(keyword));
        
        // Add partial matching for better results
        const hasPartialMatch = techLower.length > 3 && 
          repoText.split(' ').some(word => word.includes(techLower.substring(0, 4)) || 
                                  techLower.includes(word.substring(0, Math.min(4, word.length))));
        
        const finalMatch = hasDirectMatch || hasMappedMatch || hasPartialMatch;
        
        // Debug logging for tech stack matching
        if (finalMatch) {
          console.log(`✅ [FILTER] Tech match found: ${tech} for repo ${repo.name} (direct: ${hasDirectMatch}, mapped: ${hasMappedMatch}, partial: ${hasPartialMatch})`);
        }
        
        return finalMatch;
      });
      
      if (hasMatchingTech) {
        matchScore++;
        console.log(`🎯 [FILTER] Tech stack score increased for ${repo.name}, current score: ${matchScore}/${requiredMatches}`);
      }
    }

    // Competition level filter (optional but increases score)
    if (filters.competitionLevel && filters.competitionLevel.length > 0) {
      requiredMatches++;
      if (filters.competitionLevel.includes(repo.competition_level)) {
        matchScore++;
      }
    }

    // Activity level filter (optional but increases score)
    if (filters.activityLevel && filters.activityLevel.length > 0) {
      requiredMatches++;
      if (filters.activityLevel.includes(repo.activity_level)) {
        matchScore++;
      }
    }

    // AI domain filter (optional but increases score)
    if (filters.aiDomain && filters.aiDomain.length > 0) {
      requiredMatches++;
      if (filters.aiDomain.includes(repo.ai_domain)) {
        matchScore++;
      }
    }

    // Language filter (optional but increases score)
    if (filters.language && filters.language.length > 0) {
      requiredMatches++;
      if (repo.language && filters.language.some(lang => 
        lang.toLowerCase() === repo.language?.toLowerCase()
      )) {
        matchScore++;
      }
    }

    // Search query filter (required if present)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      const searchText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')} ${repo.language || ''}`.toLowerCase();
      
      // Use fuzzy matching for search query
      const searchTerms = query.split(' ').filter(term => term.length > 0);
      const matches = searchTerms.filter(term => searchText.includes(term));
      
      // Require at least 50% of search terms to match
      if (matches.length < Math.ceil(searchTerms.length * 0.5)) {
        return false;
      }
    }

    // For other filters, require at least 15% match rate to be much more forgiving
    if (requiredMatches > 0) {
      const matchRate = matchScore / requiredMatches;
      const passesFilter = matchRate >= 0.15; // 15% match rate required - much more forgiving
      
      if (passesFilter) {
        console.log(`✅ [FILTER] ${repo.name} passes filter with score ${matchScore}/${requiredMatches} (${(matchRate * 100).toFixed(1)}%)`);
      } else {
        console.log(`❌ [FILTER] ${repo.name} fails filter with score ${matchScore}/${requiredMatches} (${(matchRate * 100).toFixed(1)}%)`);
      }
      
      return passesFilter;
    }

    return true;
  });
  
  console.log(`📊 [FILTER] Filtered down to ${filtered.length} repositories`);
  
  // Log filtered repositories for debugging
  if (filtered.length > 0 && filtered.length <= 10) {
    console.log('📋 [FILTER] Filtered repositories:');
    filtered.forEach((repo, i) => {
      console.log(`  ${i + 1}. ${repo.name} (${repo.language}) - ${repo.topics.slice(0, 3).join(', ')}`);
    });
  }
  
  // Sort by match score (best matches first)
  filtered.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Calculate scores for sorting
    if (filters.techStack?.length) {
      const textA = `${a.name} ${a.description || ''} ${a.topics.join(' ')} ${a.language || ''}`.toLowerCase();
      const textB = `${b.name} ${b.description || ''} ${b.topics.join(' ')} ${b.language || ''}`.toLowerCase();
      
      filters.techStack.forEach(tech => {
        const techLower = tech.toLowerCase();
        if (textA.includes(techLower) || techStackMappings[techLower]?.some(keyword => textA.includes(keyword))) scoreA++;
        if (textB.includes(techLower) || techStackMappings[techLower]?.some(keyword => textB.includes(keyword))) scoreB++;
      });
    }
    
    return scoreB - scoreA;
  });
  
  console.log(`📊 [FILTER] Final count after sorting: ${filtered.length} repositories`);
  
  // Ensure we always return a reasonable number of results
  if (filtered.length < 20 && repositories.length > 0) {
    const needed = 20 - filtered.length;
    const fallbackRepos = repositories
      .filter(repo => !filtered.some(filteredRepo => filteredRepo.id === repo.id))
      .slice(0, needed);
    
    console.log(`⚠️ [FILTER] Only ${filtered.length} repositories found, adding ${fallbackRepos.length} fallback repositories`);
    filtered.push(...fallbackRepos);
  }
  
  // Final fallback if somehow we still have no results
  if (filtered.length === 0 && repositories.length > 0) {
    console.log('⚠️ [FILTER] No matches found, returning top 20 repositories as fallback');
    return repositories.slice(0, 20);
  }
  
  console.log(`🎉 [FILTER] Final result: ${filtered.length} repositories`);
  return filtered;
};
