import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const testimonials = await getTestimonials();
    
    return NextResponse.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch testimonials'
      },
      { status: 500 }
    );
  }
}
