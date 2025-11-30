import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repo = searchParams.get('repo');

  if (!repo) {
    return new NextResponse('Missing repo parameter', { status: 400 });
  }

  try {
    // Fetch the GitHub repository page
    const response = await fetch(`https://github.com/${repo}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      return new NextResponse('GitHub repo not found', { status: 404 });
    }

    const html = await response.text();
    
    // Extract the og:image URL using a simple regex
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    const ogImage = match ? match[1] : null;

    if (ogImage) {
      // Redirect to the actual image URL
      return NextResponse.redirect(ogImage);
    } else {
      // Fallback if no og:image found (shouldn't happen for valid public repos)
      return new NextResponse('Image not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching GitHub image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
