import { NextRequest, NextResponse } from 'next/server';
import { getGitHubHeaders } from '@/lib/github-headers';

// Simple in-memory cache to avoid repeated requests
const imageCache = new Map<string, { data: ArrayBuffer; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Rate limiting - track requests by IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 1000 * 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP (generous for authenticated requests)

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    // Reset window
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  // Try various headers to get the real client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cf = request.headers.get('cf-connecting-ip');
  
  return cf || real || forwarded?.split(',')[0] || 'unknown';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');
  
  if (!repo) {
    return NextResponse.json({ error: 'Repository parameter is required' }, { status: 400 });
  }

  // Validate repo format
  if (!/^[^/]+\/[^/]+$/.test(repo)) {
    return NextResponse.json({ error: 'Invalid repository format' }, { status: 400 });
  }

  // Rate limiting
  const clientIP = getClientIP(request);
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Check cache first
  const cached = imageCache.get(repo);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new NextResponse(cached.data, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=1800',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // Fetch the GitHub OG image with timeout and authentication
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const githubHeaders = getGitHubHeaders();
    const isAuthenticated = !!githubHeaders['Authorization'];
    
    console.log(`Fetching GitHub image for ${repo} (authenticated: ${isAuthenticated})`);
    
    const response = await fetch(`https://opengraph.githubassets.com/1/${repo}`, {
      headers: {
        ...githubHeaders,
        'User-Agent': 'OpenSauce/1.0',
        'Accept': 'image/*',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`GitHub API error for ${repo}: ${response.status} - ${errorText}`);
      
      // Special handling for rate limiting
      if (response.status === 429) {
        console.warn(`GitHub rate limit exceeded for ${repo}`);
        throw new Error('GitHub rate limit exceeded');
      }
      
      // Special handling for auth errors
      if (response.status === 401 || response.status === 403) {
        console.warn(`GitHub authentication error for ${repo}: ${response.status}`);
        throw new Error(`GitHub authentication error: ${response.status}`);
      }
      
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Cache the result
    imageCache.set(repo, {
      data: arrayBuffer,
      timestamp: Date.now(),
    });

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=1800',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub image:', error);
    
    // Return a fallback image
    const [owner, name] = repo.split('/');
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner || name)}&background=0d1117&color=ffffff&size=500x300`;
    
    try {
      const fallbackResponse = await fetch(fallbackUrl);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.arrayBuffer();
        return new NextResponse(fallbackData, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600',
            'X-Fallback': 'true',
          },
        });
      }
    } catch (fallbackError) {
      console.error('Error fetching fallback image:', fallbackError);
    }

    // Return a simple 1x1 transparent PNG as last resort
    const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    return new NextResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'X-Fallback': 'transparent',
      },
    });
  }
}
