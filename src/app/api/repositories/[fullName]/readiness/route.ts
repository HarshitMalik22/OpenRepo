import { NextRequest, NextResponse } from 'next/server';
import { calculateReadinessScore, ReadinessMetrics } from '@/lib/contribution-readiness';

interface RouteParams {
  params: Promise<{ fullName: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { fullName } = await params;
    
    // Decode URL-encoded fullName (e.g., "facebook%2Freact" -> "facebook/react")
    const decodedFullName = decodeURIComponent(fullName);
    
    // Validate format
    const parts = decodedFullName.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid repository format. Expected: owner/repo' 
        },
        { status: 400 }
      );
    }
    
    const [owner, repo] = parts;
    
    // Calculate readiness score
    const metrics = await calculateReadinessScore(owner, repo);
    
    return NextResponse.json({
      success: true,
      repository: decodedFullName,
      metrics
    });
    
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
