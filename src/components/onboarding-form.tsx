"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { techStacks, goals, experienceLevels } from '@/lib/filter-data';
import type { UserPreferences } from '@/lib/types';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Select Your Tech Stack', description: 'Choose the technologies you are interested in. You can select multiple.' },
  { id: 2, title: 'Choose Your Goal', description: 'What do you want to achieve?' },
  { id: 3, title: 'Select Your Experience Level', description: 'This helps us find projects that match your skill level.' },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    techStack: [],
  });

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
      }
      router.push('/repos');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleTechStack = (id: string) => {
    const currentStack = preferences.techStack || [];
    const newStack = currentStack.includes(id)
      ? currentStack.filter(techId => techId !== id)
      : [...currentStack, id];
    setPreferences({ ...preferences, techStack: newStack });
  };
  
  const selectGoal = (id: string) => {
    setPreferences({ ...preferences, goal: id });
  };

  const selectExperience = (id: string) => {
    setPreferences({ ...preferences, experienceLevel: id });
  };

  const progressValue = (step / steps.length) * 100;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStacks.map((tech) => (
              <Button
                key={tech.id}
                variant={preferences.techStack?.includes(tech.id) ? 'default' : 'outline'}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => toggleTechStack(tech.id)}
              >
                <tech.icon className="w-8 h-8" />
                <span>{tech.name}</span>
              </Button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <Button
                key={goal.id}
                variant={preferences.goal === goal.id ? 'default' : 'outline'}
                className="h-auto py-4 flex items-center justify-start gap-4 text-left"
                onClick={() => selectGoal(goal.id)}
              >
                <goal.icon className="w-8 h-8 flex-shrink-0" />
                <span>{goal.name}</span>
              </Button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experienceLevels.map((level) => (
              <Button
                key={level.id}
                variant={preferences.experienceLevel === level.id ? 'default' : 'outline'}
                className="h-auto py-4 text-lg"
                onClick={() => selectExperience(level.id)}
              >
                {level.name}
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Progress value={progressValue} className="mb-4" />
        <CardTitle className="font-headline">{steps[step - 1].title}</CardTitle>
        <CardDescription>{steps[step - 1].description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px]">
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className={cn(step === 1 && 'invisible')}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === steps.length ? (
            <>
              Finish <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            'Next'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
