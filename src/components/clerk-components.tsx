'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClerkComponentsWrapperProps {
  children: ReactNode;
}

export default function ClerkComponentsWrapper({ children }: ClerkComponentsWrapperProps) {
  const [isClerkReady, setIsClerkReady] = useState(false);

  useEffect(() => {
    // Wait for Clerk to be ready
    const timer = setTimeout(() => {
      setIsClerkReady(true);
    }, 100); // Small delay to ensure Clerk is initialized

    return () => clearTimeout(timer);
  }, []);

  if (!isClerkReady) {
    return null; // Don't render Clerk components until ready
  }

  return <>{children}</>;
}
