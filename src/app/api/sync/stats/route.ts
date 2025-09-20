import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/lib/sync-service';

export async function GET(request: NextRequest) {
  try {
    const stats = await syncService.getSyncStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting sync stats:', error);
    return NextResponse.json(
      { error: 'Failed to get sync stats' },
      { status: 500 }
    );
  }
}
