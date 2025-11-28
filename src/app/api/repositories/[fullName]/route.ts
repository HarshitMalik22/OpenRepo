import { NextRequest, NextResponse } from 'next/server';
import { getGitHubRepoDetails } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fullName: string }> }
) {
  try {
    const { fullName } = await params;
    const repository = await getGitHubRepoDetails(fullName);
    
    if (!repository) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Repository not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: repository
    });
  } catch (error) {
    console.error('Error fetching repository:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch repository' 
      },
      { status: 500 }
    );
  }
}
