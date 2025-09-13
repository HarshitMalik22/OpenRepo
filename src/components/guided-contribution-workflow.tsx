"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Code, 
  GitBranch, 
  MessageSquare, 
  ExternalLink,
  Target,
  Clock,
  Users,
  FileText,
  Zap,
  Trophy
} from 'lucide-react';
import type { Repository, ContributionDifficulty } from '@/lib/types';

interface GuidedContributionWorkflowProps {
  repository: Repository;
  onComplete?: () => void;
}

interface ContributionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
  tips?: string[];
  estimatedTime?: string;
}

export default function GuidedContributionWorkflow({ 
  repository, 
  onComplete 
}: GuidedContributionWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const difficulty = repository.contribution_difficulty;
  
  const steps: ContributionStep[] = [
    {
      id: 'understand',
      title: 'Understand the Project',
      description: 'Read the README, understand the project structure, and get familiar with the codebase.',
      icon: <BookOpen className="w-5 h-5" />,
      completed: completedSteps.has('understand'),
      estimatedTime: '15-30 minutes',
      tips: [
        'Start with the README.md file',
        'Check the CONTRIBUTING.md guidelines',
        'Look at the project structure and main directories',
        'Review open issues to understand current problems'
      ],
      action: {
        label: 'Read README',
        href: `${repository.html_url}/blob/main/README.md`,
        external: true
      }
    },
    {
      id: 'setup',
      title: 'Set Up Development Environment',
      description: 'Fork the repository, clone it locally, and set up your development environment.',
      icon: <Code className="w-5 h-5" />,
      completed: completedSteps.has('setup'),
      estimatedTime: '10-20 minutes',
      tips: [
        'Fork the repository to your GitHub account',
        'Clone your fork locally',
        'Install dependencies following the setup instructions',
        'Run the project to ensure everything works'
      ],
      action: {
        label: 'Fork Repository',
        href: repository.html_url,
        external: true
      }
    },
    {
      id: 'find-issue',
      title: 'Find an Issue to Work On',
      description: 'Choose an issue that matches your skill level and interests.',
      icon: <Target className="w-5 h-5" />,
      completed: completedSteps.has('find-issue'),
      estimatedTime: '5-15 minutes',
      tips: [
        difficulty.level === 'beginner' ? 'Look for "good first issue" labels' : 
        difficulty.level === 'intermediate' ? 'Choose issues with clear requirements' :
        'Tackle complex issues that require deep understanding',
        'Check if anyone is already working on the issue',
        'Ask questions in the issue if anything is unclear',
        'Consider the impact and scope of the issue'
      ],
      action: {
        label: 'Browse Issues',
        href: `${repository.html_url}/issues`,
        external: true
      }
    },
    {
      id: 'branch',
      title: 'Create a Feature Branch',
      description: 'Create a new branch for your contribution following the project\'s naming conventions.',
      icon: <GitBranch className="w-5 h-5" />,
      completed: completedSteps.has('branch'),
      estimatedTime: '2-5 minutes',
      tips: [
        'Use a descriptive branch name (e.g., feature/your-feature-name)',
        'Keep your branch focused on a single change',
        'Sync your branch with the latest main branch',
        'Follow the project\'s branching guidelines if they exist'
      ]
    },
    {
      id: 'develop',
      title: 'Develop Your Solution',
      description: 'Implement your solution, write tests, and ensure your code follows the project standards.',
      icon: <Zap className="w-5 h-5" />,
      completed: completedSteps.has('develop'),
      estimatedTime: difficulty.level === 'beginner' ? '1-2 hours' : 
                   difficulty.level === 'intermediate' ? '2-4 hours' :
                   difficulty.level === 'advanced' ? '4-8 hours' : '8+ hours',
      tips: [
        'Write clean, well-commented code',
        'Follow the project\'s coding style and conventions',
        'Write tests for your changes',
        'Ensure your solution doesn\'t break existing functionality',
        'Commit your changes with clear, descriptive messages'
      ]
    },
    {
      id: 'test',
      title: 'Test Your Changes',
      description: 'Run all tests, check for linting errors, and manually test your changes.',
      icon: <CheckCircle className="w-5 h-5" />,
      completed: completedSteps.has('test'),
      estimatedTime: '10-30 minutes',
      tips: [
        'Run the full test suite',
        'Check for linting and formatting issues',
        'Manually test your changes in different scenarios',
        'Test edge cases and error conditions',
        'Ensure documentation is updated if needed'
      ]
    },
    {
      id: 'submit',
      title: 'Submit Pull Request',
      description: 'Create a pull request with a clear description of your changes and link to the relevant issue.',
      icon: <MessageSquare className="w-5 h-5" />,
      completed: completedSteps.has('submit'),
      estimatedTime: '10-20 minutes',
      tips: [
        'Write a clear, descriptive PR title',
        'Provide a detailed description of your changes',
        'Link to the issue your PR addresses',
        'Include screenshots if your changes are visual',
        'Be responsive to review feedback'
      ],
      action: {
        label: 'Create Pull Request',
        href: `${repository.html_url}/compare`,
        external: true
      }
    },
    {
      id: 'review',
      title: 'Address Review Feedback',
      description: 'Respond to code review feedback and make necessary changes to get your PR merged.',
      icon: <Users className="w-5 h-5" />,
      completed: completedSteps.has('review'),
      estimatedTime: '30 minutes - 2 hours',
      tips: [
        'Be respectful and responsive to feedback',
        'Make requested changes promptly',
        'Ask for clarification if feedback is unclear',
        'Thank reviewers for their time and suggestions',
        'Be patient - reviews can take time'
      ]
    }
  ];

  const markStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepId);
    setCompletedSteps(newCompleted);
  };

  const markStepIncomplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.delete(stepId);
    setCompletedSteps(newCompleted);
  };

  const handleStepClick = (stepId: string) => {
    if (completedSteps.has(stepId)) {
      markStepIncomplete(stepId);
    } else {
      markStepComplete(stepId);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (completedSteps.size / steps.length) * 100;

  const getDifficultyColor = (level: string) => {
    const colors = {
      'beginner': 'text-green-600 bg-green-50 border-green-200',
      'intermediate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'advanced': 'text-orange-600 bg-orange-50 border-orange-200',
      'expert': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Guided Contribution Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2">{repository.name}</h3>
              <p className="text-muted-foreground mb-4">
                Follow this step-by-step guide to make your first contribution to this project.
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getDifficultyColor(difficulty.level)}>
                  {difficulty.level === 'beginner' ? 'Beginner Friendly' :
                   difficulty.level === 'intermediate' ? 'Intermediate' :
                   difficulty.level === 'advanced' ? 'Advanced' : 'Expert Level'}
                </Badge>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimated total time: {difficulty.level === 'beginner' ? '2-4 hours' : 
                                              difficulty.level === 'intermediate' ? '4-8 hours' :
                                              difficulty.level === 'advanced' ? '8-16 hours' : '16+ hours'}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{difficulty.goodFirstIssues} good first issues</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Step List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Contribution Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  currentStep === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStepClick(step.id);
                    }}
                    className="flex-shrink-0"
                    title={step.completed ? "Mark step as incomplete" : "Mark step as complete"}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{step.title}</div>
                    {step.estimatedTime && (
                      <div className="text-xs text-muted-foreground">{step.estimatedTime}</div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {index + 1}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Step Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>

            {steps[currentStep].estimatedTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Estimated time: {steps[currentStep].estimatedTime}</span>
              </div>
            )}

            {steps[currentStep].tips && steps[currentStep].tips.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tips & Best Practices:</h4>
                <ul className="space-y-1">
                  {steps[currentStep].tips?.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {steps[currentStep].action && (
              <Button
                onClick={() => {
                  if (steps[currentStep].action?.external) {
                    window.open(steps[currentStep].action?.href, '_blank');
                  } else {
                    // Handle internal navigation
                    window.location.href = steps[currentStep].action?.href || '';
                  }
                }}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {steps[currentStep].action?.label}
              </Button>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStepClick(steps[currentStep].id)}
                >
                  {steps[currentStep].completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Incomplete
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>

              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Congratulations! 🎉</h3>
            <p className="text-muted-foreground mb-4">
              You've completed all the steps for contributing to {repository.name}. 
              Your contribution will help make this project better for everyone!
            </p>
            <Button onClick={onComplete}>
              Start Another Contribution
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
