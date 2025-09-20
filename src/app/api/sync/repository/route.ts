import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/lib/sync-service';

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      );
    }

    const jobId = await syncService.addRepositorySync(owner, repo);

    return NextResponse.json({
      success: true,
      jobId,
      message: `Repository sync job queued for ${owner}/${repo}`,
    });
  } catch (error) {
    console.error('Error queuing repository sync:', error);
    return NextResponse.json(
      { error: 'Failed to queue repository sync' },
      { status: 500 }
    );
  }
}
