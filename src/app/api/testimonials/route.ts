import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock testimonials for now
    // TODO: Implement real testimonials from database
    const testimonials = [
      {
        id: 1,
        name: 'Sarah Chen',
        role: 'Frontend Developer',
        content: 'OpenRepo helped me understand complex React codebases in minutes. The AI analysis is incredibly accurate!',
        avatar: '/avatars/sarah.jpg',
        rating: 5
      },
      {
        id: 2,
        name: 'Mike Rodriguez',
        role: 'Full Stack Engineer',
        content: 'The repository visualization features are game-changing. I can now onboard to new projects much faster.',
        avatar: '/avatars/mike.jpg',
        rating: 5
      },
      {
        id: 3,
        name: 'Emily Johnson',
        role: 'Tech Lead',
        content: 'We use OpenRepo for team onboarding. It saves us hours of explanation time.',
        avatar: '/avatars/emily.jpg',
        rating: 4
      }
    ];
    
    return NextResponse.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch testimonials' 
      },
      { status: 500 }
    );
  }
}
