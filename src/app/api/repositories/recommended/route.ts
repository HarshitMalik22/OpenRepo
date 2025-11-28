import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedRepos } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json();
    
    if (!preferences) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Preferences are required' 
        },
        { status: 400 }
      );
    }

    const repositories = await getRecommendedRepos(preferences);
    
    return NextResponse.json({
      success: true,
      repositories
    });
  } catch (error) {
    console.error('Error fetching recommended repositories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recommended repositories' 
      },
      { status: 500 }
    );
  }
}
