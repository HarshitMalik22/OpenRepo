import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedRepos } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json();
    
    if (!preferences) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Preferences are required' 
        },
        { status: 400 }
      );
    }

    // For now, use the same recommendation logic
    // TODO: Implement enhanced ML-based recommendations
    const repositories = await getRecommendedRepos(preferences);
    
    return NextResponse.json({
      success: true,
      repositories
    });
  } catch (error) {
    console.error('Error fetching enhanced recommended repositories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch enhanced recommended repositories' 
      },
      { status: 500 }
    );
  }
}
