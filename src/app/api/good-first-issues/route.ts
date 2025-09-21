import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');
    const mentorAvailable = searchParams.get('mentorAvailable');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where: any = {
      state: 'open',
    };
    
    if (language) {
      where.language = language;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (mentorAvailable === 'true') {
      where.mentorAvailable = true;
    }

    // The goodFirstIssue model doesn't exist in the current schema
    // Return empty arrays for now
    const issues: any[] = [];
    const totalCount = 0;

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      issues,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching good first issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch good first issues' },
      { status: 500 }
    );
  }
}
