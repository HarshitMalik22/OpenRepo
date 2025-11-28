'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClerkComponentsWrapperProps {
  children: ReactNode;
}

export default function ClerkComponentsWrapper({ children }: ClerkComponentsWrapperProps) {
  const [isClerkReady, setIsClerkReady] = useState(false);
  const [isClerkConfigured, setIsClerkConfigured] = useState(false);

  useEffect(() => {
    // Check if Clerk is configured
    const clerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    setIsClerkConfigured(clerkConfigured);
    
    // Wait for Clerk to be ready
    const timer = setTimeout(() => {
      setIsClerkReady(true);
    }, 100); // Small delay to ensure Clerk is initialized

    return () => clearTimeout(timer);
  }, []);

  // If Clerk is not configured, don't render Clerk components
  if (!isClerkConfigured) {
    return null;
  }

  if (!isClerkReady) {
    return null; // Don't render Clerk components until ready
  }

  return <>{children}</>;
}
