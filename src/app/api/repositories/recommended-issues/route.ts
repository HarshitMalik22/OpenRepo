import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedIssues, getAIEnhancedRecommendations } from '@/lib/issue-recommender';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const techStackParam = searchParams.get('techStack');
    const techStack = techStackParam ? techStackParam.split(',').map(s => s.trim()) : [];
    
    const languagesParam = searchParams.get('languages');
    const languages = languagesParam ? languagesParam.split(',').map(s => s.trim()) : [];
    
    const experienceLevel = (searchParams.get('experience') as 'beginner' | 'intermediate' | 'advanced') || 'intermediate';
    const maxResults = parseInt(searchParams.get('limit') || '20', 10);
    const userGoal = searchParams.get('goal') || '';
    const enhanceWithAI = searchParams.get('ai') === 'true';
    
    // Get base recommendations
    let recommendations = await getRecommendedIssues({
      techStack,
      languages,
      experienceLevel,
      maxResults,
    });
    
    // Optionally enhance with AI
    if (enhanceWithAI && userGoal) {
      recommendations = await getAIEnhancedRecommendations(recommendations, userGoal);
    }
    
    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
      filters: {
        techStack,
        languages,
        experienceLevel,
        maxResults,
        aiEnhanced: enhanceWithAI && !!userGoal,
      },
    });
    
  } catch (error) {
    console.error('Error fetching recommended issues:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        recommendations: [],
      },
      { status: 500 }
    );
  }
}
