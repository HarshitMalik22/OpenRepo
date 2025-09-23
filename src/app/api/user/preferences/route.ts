import { NextRequest, NextResponse } from 'next/server';
import { saveUserPreferencesToDB, getUserPreferencesFromDB } from '@/lib/database';
import type { UserPreferences } from '@/lib/types';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    
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
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists in database, create if not
    const { prisma, ensureUser } = await import('@/lib/prisma');
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      try {
        // Get the full user object from Clerk
        const { clerkClient } = await import('@clerk/nextjs/server');
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        
        // Create the user in our database
        user = await ensureUser({
          id: clerkUser.id,
          emailAddresses: clerkUser.emailAddresses,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        });
      } catch (error) {
        console.error('Failed to create user:', error);
        return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
      }
    }

    const preferences: UserPreferences = await request.json();
    const savedPreferences = await saveUserPreferencesToDB(userId, preferences);
    
    return NextResponse.json(savedPreferences);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}