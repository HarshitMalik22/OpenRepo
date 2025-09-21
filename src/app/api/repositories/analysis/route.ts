import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getRepositoryAnalysis, saveRepositoryAnalysis } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const repoFullName = searchParams.get('repoFullName');

    if (!repoFullName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Repository full name is required'
        },
        { status: 400 }
      );
    }

    const analysis = await getRepositoryAnalysis(userId, repoFullName);
    
    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error fetching repository analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch repository analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { repoFullName, analysis } = await request.json();

    if (!repoFullName || !analysis) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Repository full name and analysis are required'
        },
        { status: 400 }
      );
    }

    const result = await saveRepositoryAnalysis(userId, repoFullName, analysis);
    
    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error saving repository analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save repository analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
