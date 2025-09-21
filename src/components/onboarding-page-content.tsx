"use client";

import OnboardingForm from '@/components/onboarding-form';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function OnboardingPageContentClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return (
      <div className="container mx-auto py-16 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 md:py-32 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold font-headline text-center mb-6">Let's Personalize Your Journey</h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed mb-16">
          Tell us about your interests to find the perfect open-source projects for you.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}

export default function OnboardingPageContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR or before client-side hydration
  if (!isClient) {
    return (
      <div className="container mx-auto py-16 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <OnboardingPageContentClient />;
}
