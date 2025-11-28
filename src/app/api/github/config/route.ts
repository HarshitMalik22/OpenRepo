import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({
      hasToken: !!process.env.GITHUB_TOKEN,
      isConfigured: !!process.env.GITHUB_TOKEN,
      warnings: process.env.GITHUB_TOKEN ? [] : ['GitHub token not configured'],
      rateLimit: {
        remaining: 5000,
        reset: new Date(Date.now() + 3600000).toISOString(),
      }
    });

    response.headers.set('Content-Type', 'application/json');
    return response;
  } catch (error) {
    console.error('GitHub config API error:', error);
    return NextResponse.json(
      { error: 'Failed to get GitHub config status' },
      { status: 500 }
    );
  }
}
