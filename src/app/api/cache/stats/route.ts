import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache-manager';

export async function GET(request: NextRequest) {
  try {
    const stats = cacheManager.getStats();
    const metrics = cacheManager.getPerformanceMetrics();
    
    return NextResponse.json({
      stats,
      metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'reset') {
      cacheManager.resetStats();
      return NextResponse.json({ message: 'Cache statistics reset' });
    }
    
    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
