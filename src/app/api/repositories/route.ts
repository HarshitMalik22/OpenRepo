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
    const sortBy = searchParams.get('sortBy') || 'healthScore';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (language) {
      where.language = language;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const [repositories, totalCount] = await Promise.all([
      prisma.repository.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
        include: {
          contributionOpportunities: {
            take: 3,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      }),
      prisma.repository.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      repositories,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
