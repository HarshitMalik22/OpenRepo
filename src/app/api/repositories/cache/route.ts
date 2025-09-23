import { NextResponse } from 'next/server';
import { cachePopularRepository } from '@/lib/database';
import type { Repository } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { repositories } = await request.json();
    
    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid repositories data' 
        },
        { status: 400 }
      );
    }

    // Cache repositories in database
    const results = await Promise.allSettled(
      repositories.map((repo: Repository) => cachePopularRepository(repo))
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Cached ${successful} repositories successfully, ${failed} failed`);

    return NextResponse.json({
      success: true,
      cached: successful,
      failed,
      total: repositories.length
    });
  } catch (error) {
    console.error('Error caching repositories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cache repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
