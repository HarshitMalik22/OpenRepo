import { NextRequest, NextResponse } from 'next/server';
import { getGitHubConfigStatus } from '@/lib/github-config';

export async function GET(request: NextRequest) {
  try {
    const configStatus = await getGitHubConfigStatus();
    
    return NextResponse.json({
      success: true,
      config: configStatus,
      message: configStatus.hasToken 
        ? 'GitHub token is configured' 
        : 'GitHub token is not configured - you may experience rate limits',
      recommendations: configStatus.hasToken 
        ? [] 
        : [
            'Add GITHUB_TOKEN to your .env file',
            'Get a token from https://github.com/settings/tokens',
            'Required scopes: public_repo, repo:status, read:user'
          ]
    });
  } catch (error) {
    console.error('Error checking GitHub config:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check GitHub configuration',
      config: {
        isConfigured: false,
        hasToken: false,
        warnings: ['Unable to check GitHub configuration']
      }
    }, { status: 500 });
  }
}
