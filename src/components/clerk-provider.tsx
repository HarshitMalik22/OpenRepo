'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Suppress hydration and browser extension warnings
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Suppress hydration warnings
      if (errorMessage.includes('hydration')) {
        return;
      }
      
      // Suppress browser extension warnings
      if (errorMessage.includes('__processed_') || errorMessage.includes('bis_register')) {
        return;
      }
      
      // Suppress video element warnings (from browser extensions)
      if (errorMessage.includes('Video element not found')) {
        return;
      }
      
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  // Only render ClerkProvider on client-side
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
