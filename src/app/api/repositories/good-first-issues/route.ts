import { NextRequest, NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;
    const minStars = searchParams.get('minStars') || '100';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '30', 10);

    // Construct a query that mimics the old behavior
    // The old route constructed: `good-first-issues:>0 stars:>=${minStars}`
    let q = `good-first-issues:>0 stars:>=${minStars}`;
    if (language) {
      q += ` language:${language}`;
    }

    const { repositories, totalCount } = await RepositoryService.getPopularRepositories({
      page,
      perPage,
      language,
      q
    });
    
    return NextResponse.json({
      success: true,
      repositories,
      totalCount
    });

  } catch (error) {
    console.error('Error fetching repositories with good first issues:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        repositories: [],
        totalCount: 0
      },
      { status: 500 }
    );
  }
}
