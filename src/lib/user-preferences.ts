import { auth } from '@clerk/nextjs/server';
import { getUserPreferencesFromDB, saveUserPreferencesToDB } from './database';
import type { UserPreferences } from './types';

// Default preferences
const defaultPreferences: UserPreferences = {
  techStack: [],
  goal: 'learn',
  experienceLevel: 'beginner',
  completed: false,
};

// Get user preferences (server-side only)
export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const { userId } = await auth();
    
    if (userId) {
      // Get from database if user is authenticated
      const dbPreferences = await getUserPreferencesFromDB(userId);
      if (dbPreferences) {
        return {
          techStack: dbPreferences.techStack,
          goal: dbPreferences.goal,
          experienceLevel: dbPreferences.experienceLevel,
          completed: dbPreferences.completed,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get user preferences from database:', error);
    return null;
  }
}

// Save user preferences (server-side only)
export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
    const { userId } = await auth();
    
    if (userId) {
      // Save to database if user is authenticated
      await saveUserPreferencesToDB(userId, preferences);
    }
  } catch (error) {
    console.error('Failed to save user preferences to database:', error);
    throw error;
  }
}

// Update specific preference fields
export async function updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
  const current = await getUserPreferences();
  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
  };

  await saveUserPreferences(updated);
  return updated;
}

// Check if user has completed onboarding
export async function hasCompletedOnboarding(): Promise<boolean> {
  const preferences = await getUserPreferences();
  return preferences?.completed || false;
}

// Get user's tech stack preferences
export async function getTechStackPreferences(): Promise<string[]> {
  const preferences = await getUserPreferences();
  return preferences?.techStack || [];
}

// Get user's goal preference
export async function getGoalPreference(): Promise<string> {
  const preferences = await getUserPreferences();
  return preferences?.goal || 'learn';
}

// Get user's experience level preference
export async function getExperienceLevelPreference(): Promise<string> {
  const preferences = await getUserPreferences();
  return preferences?.experienceLevel || 'beginner';
}
