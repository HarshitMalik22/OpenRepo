import { NextRequest, NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '30', 10);
    const language = searchParams.get('language') || undefined;
    const q = searchParams.get('q') || undefined;

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
    console.error('Error fetching popular repositories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch popular repositories',
        repositories: [],
        totalCount: 0
      },
      { status: 500 }
    );
  }
}
