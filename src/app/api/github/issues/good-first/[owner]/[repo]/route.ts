import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const { owner, repo } = params;
    
    const goodFirstIssues = await githubAPI.getGoodFirstIssuesWithIntelligence(owner, repo);

    return NextResponse.json(goodFirstIssues);
  } catch (error) {
    console.error('Error fetching good first issues:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch good first issues' },
      { status: 500 }
    );
  }
}
