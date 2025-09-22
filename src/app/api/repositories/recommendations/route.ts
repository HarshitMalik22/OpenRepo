import { NextRequest, NextResponse } from 'next/server';
import { githubLiveService } from '@/lib/github-live';
import { trackUserInteraction, getUserPreferencesFromDB } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user preferences for personalization
    const userPreferences = await getUserPreferencesFromDB(userId);
    
    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const language = searchParams.get('language') || '';
    const topic = searchParams.get('topic') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Track the search interaction
    if (query || language || topic || difficulty) {
      await trackUserInteraction(
        userId,
        'search',
        'search',
        undefined,
        {
          query,
          language,
          topic,
          difficulty,
          timestamp: new Date().toISOString()
        }
      );
    }

    // Build search query based on user preferences and filters
    let searchQuery = query;
    
    // Add language preference if specified
    if (language) {
      searchQuery += ` language:${language}`;
    } else if (userPreferences?.techStack?.length) {
      // Use user's preferred tech stack if no specific language is requested
      const preferredLanguage = userPreferences.techStack[0];
      if (preferredLanguage) {
        searchQuery += ` language:${preferredLanguage}`;
      }
    }

    // Add topic preference if specified
    if (topic) {
      searchQuery += ` topic:${topic}`;
    } else if (userPreferences?.goal) {
      // Add relevant topics based on user's goal
      const goalTopics = {
        'learn': 'beginner-friendly',
        'contribute': 'good-first-issue',
        'build': 'hacktoberfest',
        'network': 'community'
      };
      if (goalTopics[userPreferences.goal as keyof typeof goalTopics]) {
        searchQuery += ` topic:${goalTopics[userPreferences.goal as keyof typeof goalTopics]}`;
      }
    }

    // Add difficulty filter
    if (difficulty) {
      const difficultyLabels = {
        'beginner': 'good-first-issue,help-wanted',
        'intermediate': 'enhancement,bug',
        'advanced': 'refactor,performance'
      };
      if (difficultyLabels[difficulty as keyof typeof difficultyLabels]) {
        searchQuery += ` label:${difficultyLabels[difficulty as keyof typeof difficultyLabels]}`;
      }
    }

    // Search for repositories using GitHub API
    // Note: searchRepositories method doesn't exist, using getLivePopularRepos instead
    const searchResults = await githubLiveService.getLivePopularRepos(limit);

    // Fetch detailed live data for each repository
    const repositories = await Promise.all(
      searchResults.map(async (repo: any) => {
        try {
          const detailedRepo = await githubLiveService.getLiveRepository(repo.full_name);
          
          if (!detailedRepo) {
            return null;
          }
          
          // Track the view interaction
          await trackUserInteraction(
            userId,
            repo.full_name,
            'view',
            0.5,
            { source: 'recommendations' }
          );

          return {
            ...detailedRepo,
            relevance_score: detailedRepo.recommendation_score || 0
          };
        } catch (error) {
          console.error(`Error fetching details for ${repo.full_name}:`, error);
          return repo; // Fallback to basic search result
        }
      })
    );

    // Filter repositories based on user preferences and difficulty
    const filteredRepositories = repositories.filter((repo: any) => {
      if (!repo) return false;
      
      // Filter by difficulty if specified
      if (difficulty) {
        const hasGoodFirstIssues = (repo.good_first_issues_count || 0) > 0;
        const hasHelpWantedIssues = (repo.help_wanted_issues_count || 0) > 0;
        
        if (difficulty === 'beginner' && !hasGoodFirstIssues) return false;
        if (difficulty === 'intermediate' && !(hasGoodFirstIssues || hasHelpWantedIssues)) return false;
      }
      
      // Filter by language if specified
      if (language && repo.language?.toLowerCase() !== language.toLowerCase()) {
        return false;
      }
      
      return true;
    });

    // Sort by recommendation score and relevance
    const sortedRepositories = filteredRepositories.sort((a: any, b: any) => {
      if (!a || !b) return 0;
      
      const scoreA = a.recommendation_score || 0;
      const scoreB = b.recommendation_score || 0;
      
      // Boost repositories that match user's tech stack
      const techStackBonusA = userPreferences?.techStack?.includes(a.language || '') ? 10 : 0;
      const techStackBonusB = userPreferences?.techStack?.includes(b.language || '') ? 10 : 0;
      
      return (scoreB + techStackBonusB) - (scoreA + techStackBonusA);
    });

    return NextResponse.json({
      repositories: sortedRepositories.slice(0, limit),
      metadata: {
        total: sortedRepositories.length,
        query: searchQuery,
        userPreferences: {
          techStack: userPreferences?.techStack || [],
          experienceLevel: userPreferences?.experienceLevel || 'beginner',
          goal: userPreferences?.goal || 'learn'
        }
      }
    });

  } catch (error) {
    console.error('Error in repository recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repository recommendations' },
      { status: 500 }
    );
  }
}
