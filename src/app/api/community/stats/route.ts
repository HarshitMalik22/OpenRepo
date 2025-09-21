import { NextResponse } from 'next/server';
import { getCommunityStats } from '@/lib/github';

export async function GET() {
  try {
    const stats = await getCommunityStats();
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch community stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
