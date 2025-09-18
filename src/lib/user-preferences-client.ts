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

// Get user preferences from local storage (client-side only)
export async function getUserPreferencesClient(): Promise<UserPreferences | null> {
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
    console.error('Failed to get user preferences from localStorage:', error);
    return null;
  }
}

// Save user preferences to local storage (client-side only)
export async function saveUserPreferencesClient(preferences: UserPreferences): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save user preferences to localStorage:', error);
  }
}

// Save user preferences to database (client-side only, requires userId)
export async function saveUserPreferencesToDBClient(preferences: UserPreferences, userId: string): Promise<void> {
  try {
    await saveUserPreferencesToDB(userId, preferences);
  } catch (error) {
    console.error('Failed to save user preferences to database:', error);
    throw error;
  }
}

// Get user preferences from database (client-side only, requires userId)
export async function getUserPreferencesFromDBClient(userId: string): Promise<UserPreferences | null> {
  try {
    const dbPreferences = await getUserPreferencesFromDB(userId);
    if (dbPreferences) {
      return {
        techStack: dbPreferences.techStack,
        goal: dbPreferences.goal,
        experienceLevel: dbPreferences.experienceLevel,
        completed: dbPreferences.completed,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get user preferences from database:', error);
    return null;
  }
}
