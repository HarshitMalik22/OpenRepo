import { NextResponse } from 'next/server';

export async function GET() {
  const isConfigured = !!process.env.GITHUB_TOKEN;
  
  return NextResponse.json({ 
    success: true,
    config: {
      isConfigured,
      hasToken: isConfigured,
      warnings: isConfigured ? [] : ['GitHub token is not configured']
    }
  });
}
