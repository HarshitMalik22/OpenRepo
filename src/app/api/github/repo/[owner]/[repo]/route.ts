import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    
    const [repoData, healthMetrics, goodFirstIssues] = await Promise.all([
      githubAPI.getRepository(owner, repo),
      githubAPI.calculateRepositoryHealth(owner, repo),
      githubAPI.getGoodFirstIssuesWithIntelligence(owner, repo),
    ]);

    return NextResponse.json({
      repository: repoData,
      healthMetrics,
      goodFirstIssues,
    });
  } catch (error) {
    console.error('Error fetching repository data:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch repository data from GitHub' },
      { status: 500 }
    );
  }
}
