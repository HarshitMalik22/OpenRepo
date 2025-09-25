import { NextRequest, NextResponse } from 'next/server';
import { trackUserInteraction } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoFullName, type, score, metadata } = await request.json();
    
    const interaction = await trackUserInteraction(userId, repoFullName, type, score, metadata);
    
    return NextResponse.json({
      success: true,
      result: interaction
    });
  } catch (error) {
    console.error('Error tracking user interaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}