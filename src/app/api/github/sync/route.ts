import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

export async function POST(request: NextRequest) {
  try {
    const { type, owner, repo, username } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required (repository or user)' },
        { status: 400 }
      );
    }

    if (type === 'repository') {
      if (!owner || !repo) {
        return NextResponse.json(
          { error: 'Owner and repo are required for repository sync' },
          { status: 400 }
        );
      }

      await githubAPI.syncRepository(owner, repo);
      
      return NextResponse.json({
        success: true,
        message: `Successfully synced repository ${owner}/${repo}`,
      });
    } else if (type === 'user') {
      if (!username) {
        return NextResponse.json(
          { error: 'Username is required for user sync' },
          { status: 400 }
        );
      }

      await githubAPI.syncUser(username);
      
      return NextResponse.json({
        success: true,
        message: `Successfully synced user ${username}`,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "repository" or "user"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in GitHub sync API:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to sync data from GitHub' },
      { status: 500 }
    );
  }
}
