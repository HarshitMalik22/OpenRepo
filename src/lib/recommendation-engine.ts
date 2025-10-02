import type { Repository, UserPreferences, RecommendationScore, CompetitionLevel, ActivityLevel, AIDomain, ContributionDifficulty } from './types';

// Tech stack mapping for better matching - more specific to reduce false positives
const techStackMappings: Record<string, string[]> = {
  'react': ['react', 'jsx', 'tsx', 'nextjs', 'gatsby', 'remix', 'react-native', 'reactjs'],
  'vue': ['vue', 'nuxt', 'vuex', 'vuejs', 'vue-router'],
  'angular': ['angular', 'angularjs', 'ionic', 'ng'],
  'nodejs': ['nodejs', 'express', 'nest', 'koa', 'hapi', 'fastify'],
  'python': ['python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow'],
  'django': ['django', 'djangorestframework', 'django-rest-framework'],
  'flask': ['flask', 'flask-sqlalchemy', 'flask-restful'],
  'fastapi': ['fastapi', 'uvicorn', 'pydantic'],
  'tensorflow': ['tensorflow', 'keras', 'tensorboard'],
  'pytorch': ['pytorch', 'torch', 'torchvision', 'torchaudio'],
  'rust': ['rust', 'cargo', 'actix', 'rocket', 'tokio'],
  'go': ['go', 'golang', 'gin-framework', 'echo-framework', 'gorilla-mux'],
  'typescript': ['typescript', 'ts'],
  'nextjs': ['nextjs', 'next', 'next-auth'],
  'svelte': ['svelte', 'sveltekit', 'sapper', 'sveltejs'],
  'tailwind': ['tailwind', 'tailwindcss'],
  'docker': ['docker', 'dockerfile', 'docker-compose'],
  'kubernetes': ['kubernetes', 'k8s', 'helm', 'istio'],
  'graphql': ['graphql', 'gql', 'apollo', 'relay'],
  'ml': ['machine-learning', 'tensorflow', 'pytorch', 'sklearn', 'scikit-learn'],
  'java': ['java', 'spring', 'hibernate', 'maven', 'gradle'],
  'javascript': ['javascript', 'js'],
  'php': ['php', 'laravel', 'symfony', 'wordpress'],
  'ruby': ['ruby', 'rails', 'sinatra'],
  'c++': ['c++', 'cpp', 'stl', 'boost'],
  'c#': ['c#', 'csharp', '.net', 'aspnet'],
  'swift': ['swift', 'swiftui'],
  'kotlin': ['kotlin', 'jetpack'],
  'android': ['android', 'jetpack'],
  'ios': ['ios', 'uikit', 'swiftui'],
  'aws': ['aws', 'ec2', 's3', 'lambda'],
  'blockchain': ['blockchain', 'ethereum', 'bitcoin', 'solidity'],
  'ai': ['artificial-intelligence', 'machine-learning', 'deep-learning', 'neural-network'],
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
      
      // Debug: Show the actual text being searched
      console.log(`🔍 [FILTER] Searching for tech stack in: "${repoText}"`);
      
      const hasMatchingTech = filters.techStack.some(tech => {
        const techLower = tech.toLowerCase();
        const hasDirectMatch = repoText.includes(techLower);
        
        // Get mapped keywords for this tech
        const mappedKeywords = techStackMappings[techLower] || [];
        // More strict matching for mapped keywords - require word boundaries for framework keywords
        const hasMappedMatch = mappedKeywords.some(keyword => {
          // For framework-specific keywords, be more strict
          if (keyword.includes('-framework') || keyword.includes('-mux')) {
            const baseKeyword = keyword.replace('-framework', '').replace('-mux', '');
            // Look for the framework name with word boundaries
            const regex = new RegExp(`\\b${baseKeyword}\\b`, 'i');
            return regex.test(repoText);
          }
          return repoText.includes(keyword);
        });
        
        // More strict partial matching - only for specific cases
        const hasPartialMatch = techLower.length > 4 && 
          (techLower === 'typescript' && repoText.includes('ts') ||
           techLower === 'javascript' && repoText.includes('js') ||
           techLower === 'python' && repoText.includes('py') ||
           (repoText.includes(techLower) && repoText.split(' ').some(word => word.length > 4 && word.includes(techLower))));
        
        const finalMatch = hasDirectMatch || hasMappedMatch; // Remove partial matching for now
        
        // Validation: Ensure the match is legitimate
        const isLegitimateMatch = hasDirectMatch || 
          (hasMappedMatch && mappedKeywords.length > 0);
        
        // Enhanced debug logging for tech stack matching
        if (finalMatch && isLegitimateMatch) {
          console.log(`✅ [FILTER] Tech match found: ${tech} for repo ${repo.name}`);
          console.log(`   - Direct match (${techLower}): ${hasDirectMatch}`);
          console.log(`   - Mapped keywords [${mappedKeywords.join(', ')}]: ${hasMappedMatch}`);
          console.log(`   - Partial match: ${hasPartialMatch}`);
          
          // Show what actually matched
          if (hasDirectMatch) {
            console.log(`   - Matched term: "${techLower}" found in text`);
          }
          if (hasMappedMatch) {
            const matchedKeyword = mappedKeywords.find(keyword => {
              if (keyword.includes('-framework') || keyword.includes('-mux')) {
                const baseKeyword = keyword.replace('-framework', '').replace('-mux', '');
                const regex = new RegExp(`\\b${baseKeyword}\\b`, 'i');
                return regex.test(repoText);
              }
              return repoText.includes(keyword);
            });
            console.log(`   - Matched keyword: "${matchedKeyword}" found in text`);
          }
        } else if (finalMatch && !isLegitimateMatch) {
          console.log(`⚠️ [FILTER] False positive detected for ${tech} in repo ${repo.name} - ignoring match`);
        }
        
        // Only return legitimate matches
        return finalMatch && isLegitimateMatch;
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

    // For tech stack filtering, require exact matches (100% for tech stack)
    // For other optional filters, be more forgiving
    if (requiredMatches > 0) {
      let passesFilter = false;
      let matchRate = matchScore / requiredMatches;
      
      // Special handling for tech stack - require exact match
      if (filters.techStack && filters.techStack.length > 0) {
        // For tech stack filtering, we need at least one tech stack match
        passesFilter = matchScore >= 1; // Must match at least one tech stack
      } else {
        // For other filters, use 50% match rate for better results
        passesFilter = matchRate >= 0.5;
      }
      
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
