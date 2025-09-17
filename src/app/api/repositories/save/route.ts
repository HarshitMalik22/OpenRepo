import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { saveRepository } from '@/lib/database';
import type { Repository } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const repository: Repository = await request.json();
    const savedRepo = await saveRepository(userId, repository);
    
    return NextResponse.json(savedRepo);
  } catch (error) {
    console.error('Error saving repository:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}