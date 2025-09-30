import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/repos/(.*)/analyze',
]);

export default clerkMiddleware(async (auth, req) => {
  // Check if Clerk is configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  // Debug logging in development (disabled to reduce noise)
  if (process.env.NODE_ENV === 'development' && false) {
    console.log('Middleware Debug:');
    console.log('- Publishable Key present:', !!publishableKey);
    console.log('- Secret Key present:', !!secretKey);
    console.log('- Node Environment:', process.env.NODE_ENV);
    console.log('- Is Vercel:', !!process.env.VERCEL);
    console.log('- Request URL:', req.url);
  }
  
  // If Clerk is not configured, skip authentication
  if (!publishableKey || !secretKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Clerk not configured, skipping authentication');
    }
    return;
  }
  
  if (isProtectedRoute(req)) {
    try {
      const { userId } = await auth();
      if (!userId) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
      }
    } catch (error) {
      // If Clerk authentication fails, continue without authentication
      console.warn('Clerk authentication failed:', error);
      return;
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};