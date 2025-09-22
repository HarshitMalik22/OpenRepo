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

// Save user preferences to database via API (client-side only)
export async function saveUserPreferencesToDBClient(preferences: UserPreferences): Promise<void> {
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to save preferences to database');
    }
  } catch (error) {
    console.error('Failed to save user preferences to database:', error);
    throw error;
  }
}

// Get user preferences from database via API (client-side only)
export async function getUserPreferencesFromDBClient(): Promise<UserPreferences | null> {
  try {
    const response = await fetch('/api/user/preferences');
    
    if (!response.ok) {
      if (response.status === 401) {
        // User is not authenticated, return null
        return null;
      }
      throw new Error('Failed to fetch preferences from database');
    }
    
    const preferences = await response.json();
    return preferences;
  } catch (error) {
    console.error('Failed to get user preferences from database:', error);
    return null;
  }
}
