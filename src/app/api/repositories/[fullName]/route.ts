import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { githubLiveService } from '@/lib/github-live';
import { trackUserInteraction, getRepositoryAnalysis, saveRepositoryAnalysis, upsertRepositoryReference } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fullName: string }> }
) {
  const { fullName } = await params;
  try {
    const { userId } = await auth();

    if (!fullName) {
      return NextResponse.json({ error: 'Repository full name is required' }, { status: 400 });
    }

    // Fetch live repository data from GitHub
    const repository = await githubLiveService.getLiveRepository(fullName);

    if (!repository) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // Track the view interaction if user is authenticated
    if (userId) {
      await trackUserInteraction(
        userId,
        fullName,
        'view',
        undefined,
        {
          source: 'repository-detail',
          health_score: repository.health_score,
          language: repository.language,
          stars: repository.stargazers_count
        }
      );

      // Get any existing AI analysis for this user and repository
      const existingAnalysis = await getRepositoryAnalysis(userId, fullName);
      
      // Upsert repository reference for faster future lookups
      await upsertRepositoryReference(repository);

      return NextResponse.json({
        repository,
        userAnalysis: existingAnalysis?.content || null,
        isAuthenticated: true
      });
    }

    return NextResponse.json({
      repository,
      userAnalysis: null,
      isAuthenticated: false
    });

  } catch (error) {
    console.error('Error fetching repository:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repository data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fullName: string }> }
) {
  const { fullName } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fullName) {
      return NextResponse.json({ error: 'Repository full name is required' }, { status: 400 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'save':
        // Save repository to user's saved list
        const repository = await githubLiveService.getLiveRepository(fullName);
        await trackUserInteraction(
          userId,
          fullName,
          'like',
          5, // High score for saved repositories
          {
            action: 'save',
            timestamp: new Date().toISOString()
          }
        );
        
        // Note: You would need to implement the saveRepository function
        // This would interact with your database to save the repository
        
        return NextResponse.json({ success: true, message: 'Repository saved' });

      case 'analyze':
        // Save AI analysis for this repository
        if (data?.analysis) {
          await saveRepositoryAnalysis(userId, fullName, data.analysis);
          await trackUserInteraction(
            userId,
            fullName,
            'analyze',
            4, // High score for analysis
            {
              action: 'analyze',
              analysis_type: data.analysis.type || 'explanation',
              timestamp: new Date().toISOString()
            }
          );
        }
        return NextResponse.json({ success: true, message: 'Analysis saved' });

      case 'contribute':
        // Track contribution interest
        await trackUserInteraction(
          userId,
          fullName,
          'contribute',
          5, // Highest score for contribution intent
          {
            action: 'contribute_intent',
            difficulty: data?.difficulty || 'intermediate',
            timestamp: new Date().toISOString()
          }
        );
        return NextResponse.json({ success: true, message: 'Contribution interest tracked' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in repository POST:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
