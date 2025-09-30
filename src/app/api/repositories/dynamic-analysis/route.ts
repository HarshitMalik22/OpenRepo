import { NextRequest, NextResponse } from 'next/server';
import { dynamicArchitectureAnalysis } from '@/ai/flows/dynamic-architecture-analysis';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { repoUrl, techStack, goal } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Repository URL is required'
        },
        { status: 400 }
      );
    }

    console.log(`Starting dynamic analysis for repository: ${repoUrl}`);
    
    // Perform the dynamic architecture analysis
    const analysis = await dynamicArchitectureAnalysis({
      repoUrl,
      techStack: techStack || [],
      goal: goal || 'Understand the repository architecture',
      includeMetrics: true,
      optimizeLayout: true
    });

    console.log(`Dynamic analysis completed successfully for: ${repoUrl}`);
    
    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error performing dynamic repository analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform repository analysis',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
