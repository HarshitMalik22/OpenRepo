import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    
    const healthMetrics = await githubAPI.calculateRepositoryHealth(owner, repo);

    return NextResponse.json(healthMetrics);
  } catch (error) {
    console.error('Error calculating repository health:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to calculate repository health metrics' },
      { status: 500 }
    );
  }
}
