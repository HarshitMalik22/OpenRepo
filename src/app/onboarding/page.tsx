import OnboardingForm from '@/components/onboarding-form';

export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-12 md:py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-center">Let's Personalize Your Journey</h1>
        <p className="text-muted-foreground text-center mt-2 mb-12">
          Tell us about your interests to find the perfect open-source projects for you.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
