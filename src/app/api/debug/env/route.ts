import { NextRequest, NextResponse } from 'next/server';
import { getEnvironmentDebugInfo } from '@/lib/debug-env';

export async function GET(request: NextRequest) {
  try {
    const debugInfo = getEnvironmentDebugInfo();
    
    // Return the debug information as JSON
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: debugInfo,
    });
  } catch (error) {
    console.error('Error in debug environment route:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to get environment debug info',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
