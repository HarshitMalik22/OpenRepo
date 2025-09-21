import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { saveUserPreferencesToDB, getUserPreferencesFromDB } from '@/lib/database';
import type { UserPreferences } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await getUserPreferencesFromDB(userId);
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences: UserPreferences = await request.json();
    const savedPreferences = await saveUserPreferencesToDB(userId, preferences);
    
    return NextResponse.json(savedPreferences);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}