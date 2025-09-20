import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    const [userData, userRepos] = await Promise.all([
      githubAPI.getUser(username),
      githubAPI.getUserRepos(username),
    ]);

    return NextResponse.json({
      user: userData,
      repositories: userRepos,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch user data from GitHub' },
      { status: 500 }
    );
  }
}
