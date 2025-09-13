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
export function getUserPreferences(): UserPreferences | null {
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
export function saveUserPreferences(preferences: UserPreferences): void {
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
export function updateUserPreferences(updates: Partial<UserPreferences>): UserPreferences | null {
  const current = getUserPreferences();
  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
  };

  saveUserPreferences(updated);
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
export function hasCompletedOnboarding(): boolean {
  const preferences = getUserPreferences();
  return preferences?.completed || false;
}

// Get user's tech stack preferences
export function getTechStackPreferences(): string[] {
  const preferences = getUserPreferences();
  return preferences?.techStack || [];
}

// Get user's goal preference
export function getGoalPreference(): string {
  const preferences = getUserPreferences();
  return preferences?.goal || 'learn';
}

// Get user's experience level preference
export function getExperienceLevelPreference(): string {
  const preferences = getUserPreferences();
  return preferences?.experienceLevel || 'beginner';
}
