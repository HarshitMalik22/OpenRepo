import { NextResponse } from 'next/server';
import { getPopularRepos } from '@/lib/github';

export async function GET() {
  try {
    const repositories = await getPopularRepos();
    
    return NextResponse.json({
      success: true,
      repositories,
      count: repositories.length
    });
  } catch (error) {
    console.error('Error fetching popular repositories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch popular repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
