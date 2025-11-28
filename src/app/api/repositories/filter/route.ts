import { NextRequest, NextResponse } from 'next/server';
import { getPopularRepos } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();
    
    if (!filters) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Filters are required' 
        },
        { status: 400 }
      );
    }

    // Get all repositories first
    const { repositories } = await getPopularRepos();
    
    // Apply basic filtering (for now)
    // TODO: Implement advanced filtering logic
    let filteredRepos = repositories;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredRepos = filteredRepos.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm) ||
        repo.description?.toLowerCase().includes(searchTerm) ||
        repo.language?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.language && filters.language !== 'all') {
      filteredRepos = filteredRepos.filter(repo => 
        repo.language?.toLowerCase() === filters.language.toLowerCase()
      );
    }
    
    if (filters.minStars) {
      filteredRepos = filteredRepos.filter(repo => 
        repo.stargazers_count >= filters.minStars
      );
    }
    
    if (filters.goodFirstIssues) {
      filteredRepos = filteredRepos.filter(repo => 
        repo.good_first_issues_count && repo.good_first_issues_count > 0
      );
    }
    
    return NextResponse.json({
      success: true,
      repositories: filteredRepos
    });
  } catch (error) {
    console.error('Error filtering repositories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to filter repositories' 
      },
      { status: 500 }
    );
  }
}
