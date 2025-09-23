import { NextResponse } from 'next/server';
import { getGitHubConfigStatus } from '@/lib/github-config';

export async function GET() {
  try {
    const configStatus = await getGitHubConfigStatus();
    
    return NextResponse.json({
      success: true,
      config: configStatus
    });
  } catch (error) {
    console.error('Error getting GitHub config status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get GitHub configuration status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
