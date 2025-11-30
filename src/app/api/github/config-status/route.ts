import { NextResponse } from 'next/server';

export async function GET() {
  const isConfigured = !!process.env.GITHUB_TOKEN;
  
  return NextResponse.json({ 
    configured: isConfigured,
    // Don't expose the actual token, just whether it exists
  });
}
