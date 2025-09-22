import { auth } from '@clerk/nextjs/server';

/**
 * Get the current user ID from Clerk, gracefully handling missing configuration
 * @returns The user ID if authenticated, null if not authenticated or Clerk is not configured
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    // Check if Clerk is configured
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const secretKey = process.env.CLERK_SECRET_KEY;
    
    if (!publishableKey || !secretKey) {
      return null;
    }
    
    const { userId } = await auth();
    return userId;
  } catch (error) {
    // If Clerk authentication fails, return null
    console.warn('Clerk authentication failed:', error);
    return null;
  }
}

/**
 * Check if the current user is authenticated
 * @returns true if the user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return !!userId;
}

/**
 * Require authentication for a route, redirecting to sign in if not authenticated
 * @returns The user ID if authenticated, or throws an error if not
 */
export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return userId;
}
