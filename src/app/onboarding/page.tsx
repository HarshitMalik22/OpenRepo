'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Github, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    githubUsername: '',
    experience: '',
    interests: [] as string[],
    preferredLanguages: [] as string[],
    goals: '',
    newsletter: false,
  });

  const interests = [
    'Frontend Development',
    'Backend Development', 
    'Full Stack Development',
    'Machine Learning',
    'DevOps',
    'Mobile Development',
    'Open Source',
    'UI/UX Design',
  ];

  const languages = [
    'JavaScript/TypeScript',
    'Python',
    'Go',
    'Rust',
    'Java',
    'C++',
    'Ruby',
    'PHP',
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(language)
        ? prev.preferredLanguages.filter(l => l !== language)
        : [...prev.preferredLanguages, language]
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                </div>
                {num < 3 && <div className={`w-16 h-1 mx-2 ${
                  step > num ? 'bg-blue-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {step} of 3
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {step === 1 && 'Welcome to OpenSauce!'}
              {step === 2 && 'Tell us about your interests'}
              {step === 3 && 'Your preferences'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 && 'Let\'s get you set up with personalized repository recommendations'}
              {step === 2 && 'Help us find the perfect repositories for you'}
              {step === 3 && 'Almost done! Set your final preferences'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="githubUsername">GitHub Username</Label>
                  <Input
                    id="githubUsername"
                    placeholder="johndoe"
                    value={formData.githubUsername}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUsername: e.target.value }))}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Optional: Connect your GitHub account for personalized recommendations
                  </p>
                </div>

                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Areas of Interest</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <Label htmlFor={interest} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Preferred Languages</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {languages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.preferredLanguages.includes(language)}
                          onCheckedChange={() => handleLanguageToggle(language)}
                        />
                        <Label htmlFor={language} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goals">What are your goals?</Label>
                  <Textarea
                    id="goals"
                    placeholder="I want to contribute to open source, learn new technologies, and build my portfolio..."
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked as boolean }))}
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to our newsletter for repository recommendations and updates
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button onClick={nextStep} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button asChild className="gap-2">
                  <Link href="/repos">
                    Complete Setup
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button variant="ghost" asChild>
            <Link href="/repos">Skip for now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
