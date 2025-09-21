import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedRecommendedRepos } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const { preferences, userId } = await request.json();
    
    if (!preferences) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Preferences are required'
        },
        { status: 400 }
      );
    }

    const repositories = await getEnhancedRecommendedRepos(preferences, userId);
    
    return NextResponse.json({
      success: true,
      repositories,
      count: repositories.length
    });
  } catch (error) {
    console.error('Error fetching enhanced recommended repositories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch enhanced recommended repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
