'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [clerkConfig, setClerkConfig] = useState<{ publishableKey?: string }>({});

  useEffect(() => {
    setIsClient(true);
    
    // Set Clerk configuration on client side
    if (typeof window !== 'undefined') {
      const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Clerk Provider Debug:');
        console.log('- Publishable Key present:', !!publishableKey);
        console.log('- Publishable Key prefix:', publishableKey ? publishableKey.substring(0, 10) + '...' : 'N/A');
        console.log('- Node Environment:', process.env.NODE_ENV);
        console.log('- Is Vercel:', !!process.env.VERCEL);
      }
      
      setClerkConfig({
        publishableKey: publishableKey
      });
    }
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
      
      // Suppress Clerk missing key warnings in production
      if (process.env.NODE_ENV === 'production' && 
          errorMessage.includes('Missing publishableKey')) {
        return;
      }
      
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  // Only render ClerkProvider on client-side and when we have the config
  if (!isClient) {
    return <>{children}</>;
  }

  // If no Clerk publishable key is available, render children without Clerk
  if (!clerkConfig.publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      {children}
    </ClerkProvider>
  );
}
