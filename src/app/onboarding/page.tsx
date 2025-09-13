import OnboardingForm from '@/components/onboarding-form';

export default function OnboardingPage() {
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
