import { auth } from '@clerk/nextjs/server';
import { getUserPreferencesFromDB, saveUserPreferencesToDB } from './database';
import type { UserPreferences } from './types';

const STORAGE_KEY = 'opensauce-user-preferences';

// Default preferences
const defaultPreferences: UserPreferences = {
  techStack: [],
  goal: 'learn',
  experienceLevel: 'beginner',
  completed: false,
};

// Get user preferences from local storage
export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const { userId } = auth();
    
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
  } catch (error) {
    console.error('Failed to get user preferences from database:', error);
  }

  // Fallback to localStorage for unauthenticated users
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const preferences = JSON.parse(stored);
    
    // Validate and merge with defaults to ensure all required fields exist
    return {
      ...defaultPreferences,
      ...preferences,
    };
  } catch (error) {
    console.error('Failed to load user preferences:', error);
    return null;
  }
}

// Save user preferences to local storage
export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
    const { userId } = auth();
    
    if (userId) {
      // Save to database if user is authenticated
      await saveUserPreferencesToDB(userId, preferences);
      return;
    }
  } catch (error) {
    console.error('Failed to save user preferences to database:', error);
  }

  // Fallback to localStorage for unauthenticated users
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const mergedPreferences = {
      ...defaultPreferences,
      ...preferences,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedPreferences));
  } catch (error) {
    console.error('Failed to save user preferences:', error);
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

// Clear user preferences
export function clearUserPreferences(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user preferences:', error);
  }
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
