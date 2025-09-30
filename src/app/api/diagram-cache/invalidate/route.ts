import { NextRequest, NextResponse } from 'next/server';
import { diagramCache } from '@/lib/diagram-cache';

export async function POST(request: NextRequest) {
  try {
    const { repoFullName, currentCommitSha } = await request.json();

    if (!repoFullName) {
      return NextResponse.json(
        { error: 'Repository full name is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Checking cache invalidation for ${repoFullName}`);

    // Check if repository has been updated since cache was generated
    if (currentCommitSha) {
      const isUpdated = await diagramCache.isRepositoryUpdated(repoFullName, currentCommitSha);
      
      if (isUpdated) {
        console.log(`🗑️  Repository ${repoFullName} has been updated, invalidating cache`);
        await diagramCache.deleteCachedDiagram(repoFullName);
        
        return NextResponse.json({
          success: true,
          message: 'Cache invalidated due to repository update',
          repoFullName,
          action: 'deleted'
        });
      } else {
        return NextResponse.json({
          success: true,
          message: 'Cache is still valid',
          repoFullName,
          action: 'kept'
        });
      }
    } else {
      // If no commit SHA provided, just delete the cache
      console.log(`🗑️  Manually invalidating cache for ${repoFullName}`);
      await diagramCache.deleteCachedDiagram(repoFullName);
      
      return NextResponse.json({
        success: true,
        message: 'Cache manually invalidated',
        repoFullName,
        action: 'deleted'
      });
    }
  } catch (error) {
    console.error('Error invalidating diagram cache:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoFullName = searchParams.get('repoFullName');

    if (repoFullName) {
      // Check specific repository cache status
      const cacheResult = await diagramCache.getCachedDiagram(repoFullName);
      
      return NextResponse.json({
        repoFullName,
        cached: cacheResult.found,
        fromCache: cacheResult.fromCache,
        data: cacheResult.data ? {
          generatedAt: cacheResult.data.generatedAt,
          accessCount: cacheResult.data.accessCount,
          lastAccessedAt: cacheResult.data.lastAccessedAt,
          version: cacheResult.data.version
        } : null
      });
    } else {
      // Get overall cache statistics
      const stats = await diagramCache.getCacheStats();
      
      return NextResponse.json({
        stats,
        message: 'Cache statistics retrieved successfully'
      });
    }
  } catch (error) {
    console.error('Error getting cache status:', error);
    return NextResponse.json(
      { error: 'Failed to get cache status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoFullName = searchParams.get('repoFullName');

    if (repoFullName) {
      // Delete specific repository cache
      await diagramCache.deleteCachedDiagram(repoFullName);
      
      return NextResponse.json({
        success: true,
        message: `Cache deleted for ${repoFullName}`,
        repoFullName
      });
    } else {
      // Clear all expired cache entries
      const clearedCount = await diagramCache.clearExpiredCache();
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${clearedCount} expired cache entries`,
        clearedCount
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
