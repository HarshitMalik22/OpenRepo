import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/lib/sync-service';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const jobId = await syncService.addUserSync(username);

    return NextResponse.json({
      success: true,
      jobId,
      message: `User sync job queued for ${username}`,
    });
  } catch (error) {
    console.error('Error queuing user sync:', error);
    return NextResponse.json(
      { error: 'Failed to queue user sync' },
      { status: 500 }
    );
  }
}
