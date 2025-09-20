import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/lib/sync-service';

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Sync type is required (popular, stale-repos, stale-users)' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'popular':
        await syncService.syncPopularRepositories();
        return NextResponse.json({
          success: true,
          message: 'Popular repositories sync initiated',
        });
      
      case 'stale-repos':
        await syncService.syncStaleRepositories();
        return NextResponse.json({
          success: true,
          message: 'Stale repositories sync initiated',
        });
      
      case 'stale-users':
        await syncService.syncStaleUsers();
        return NextResponse.json({
          success: true,
          message: 'Stale users sync initiated',
        });
      
      default:
        return NextResponse.json(
          { error: 'Invalid sync type. Must be "popular", "stale-repos", or "stale-users"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in auto sync:', error);
    return NextResponse.json(
      { error: 'Failed to initiate auto sync' },
      { status: 500 }
    );
  }
}
