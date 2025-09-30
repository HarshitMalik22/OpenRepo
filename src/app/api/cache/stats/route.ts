import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache-manager';
import { redisCache } from '@/lib/redis-cache';

export async function GET(request: NextRequest) {
  try {
    const stats = cacheManager.getStats();
    const metrics = cacheManager.getPerformanceMetrics();
    const redisStats = await redisCache.getStats();
    
    return NextResponse.json({
      cacheManager: {
        stats,
        metrics,
      },
      redis: redisStats,
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
    const { action, target } = await request.json();
    
    if (action === 'reset') {
      if (target === 'cacheManager' || !target) {
        cacheManager.resetStats();
      }
      if (target === 'redis' || !target) {
        await redisCache.flushall();
      }
      return NextResponse.json({ 
        message: `Cache statistics reset for: ${target || 'all'}` 
      });
    }
    
    if (action === 'clear') {
      if (target === 'redis') {
        await redisCache.flushall();
        return NextResponse.json({ message: 'Redis cache cleared' });
      }
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
