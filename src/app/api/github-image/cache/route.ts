import { NextRequest, NextResponse } from 'next/server';

// Import the cache from the main route (shared reference)
// Note: This is a simple approach for demo purposes. In production, you'd want a proper cache manager.
let imageCache: Map<string, { data: ArrayBuffer; timestamp: number }> | null = null;

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'GitHub Image Cache Management',
    endpoints: {
      'GET /api/github-image/cache': 'Get cache statistics',
      'POST /api/github-image/cache': 'Clear entire cache',
      'DELETE /api/github-image/cache?repo=owner/repo': 'Clear specific repository cache',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Clear the entire cache
    if (imageCache) {
      const size = imageCache.size;
      imageCache.clear();
      return NextResponse.json({
        message: 'Cache cleared successfully',
        clearedEntries: size,
      });
    }
    
    return NextResponse.json({
      message: 'Cache is already empty',
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get('repo');
    
    if (!repo) {
      return NextResponse.json({ error: 'Repository parameter is required' }, { status: 400 });
    }
    
    if (imageCache && imageCache.has(repo)) {
      imageCache.delete(repo);
      return NextResponse.json({
        message: `Cache cleared for ${repo}`,
      });
    }
    
    return NextResponse.json({
      message: `No cache entry found for ${repo}`,
    });
  } catch (error) {
    console.error('Error clearing cache entry:', error);
    return NextResponse.json({ error: 'Failed to clear cache entry' }, { status: 500 });
  }
}
