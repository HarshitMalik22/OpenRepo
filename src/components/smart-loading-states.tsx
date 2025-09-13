"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BrainCircuit, 
  Search, 
  FileText, 
  Network, 
  CheckCircle, 
  X,
  Lightbulb,
  Clock,
  Zap
} from 'lucide-react';

interface LoadingStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  tips: string[];
}

interface SmartLoadingState {
  stage: 'analyzing-repo' | 'understanding-structure' | 'generating-flowchart' | 'creating-explanations' | 'finalizing';
  progress: number;
  message: string;
  estimatedTimeRemaining: number;
  tips: string[];
}

interface SmartLoadingStatesProps {
  isLoading: boolean;
  onCancel?: () => void;
  repository?: string;
}

const loadingStages: LoadingStage[] = [
  {
    id: 'analyzing-repo',
    name: 'Analyzing Repository',
    description: 'Examining codebase structure and files',
    icon: <Search className="w-5 h-5" />,
    duration: 2000,
    tips: [
      'We\'re scanning through all the files to understand the project structure',
      'This helps us identify the main components and their relationships',
      'Large repositories may take longer to analyze thoroughly'
    ]
  },
  {
    id: 'understanding-structure',
    name: 'Understanding Architecture',
    description: 'Mapping component relationships and dependencies',
    icon: <Network className="w-5 h-5" />,
    duration: 3000,
    tips: [
      'We\'re identifying how different parts of your code connect',
      'This helps create a meaningful flowchart of your repository',
      'Understanding dependencies is key to good architecture visualization'
    ]
  },
  {
    id: 'generating-flowchart',
    name: 'Creating Flowchart',
    description: 'Building visual representation of the codebase',
    icon: <BrainCircuit className="w-5 h-5" />,
    duration: 4000,
    tips: [
      'We\'re generating an interactive flowchart you can explore',
      'Each node represents a component or module in your code',
      'You\'ll be able to click, zoom, and pan through the visualization'
    ]
  },
  {
    id: 'creating-explanations',
    name: 'Generating Explanations',
    description: 'Creating detailed component documentation',
    icon: <FileText className="w-5 h-5" />,
    duration: 3500,
    tips: [
      'We\'re analyzing each component to provide clear explanations',
      'Code snippets will be included to show actual implementations',
      'You\'ll get insights into complexity and importance of each part'
    ]
  },
  {
    id: 'finalizing',
    name: 'Finalizing Results',
    description: 'Polishing and preparing your interactive experience',
    icon: <CheckCircle className="w-5 h-5" />,
    duration: 1500,
    tips: [
      'We\'re putting the finishing touches on your analysis',
      'Soon you\'ll have a fully interactive repository explorer',
      'Get ready to dive deep into your codebase understanding!'
    ]
  }
];

export default function SmartLoadingStates({ isLoading, onCancel, repository }: SmartLoadingStatesProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStage(0);
      setStageProgress(0);
      setTotalProgress(0);
      setCurrentTip(0);
      setTimeRemaining(0);
      return;
    }

    // Calculate total duration
    const totalDuration = loadingStages.reduce((sum, stage) => sum + stage.duration, 0);
    setTimeRemaining(totalDuration / 1000);

    let startTime = Date.now();
    let stageStartTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const stageElapsed = Date.now() - stageStartTime;
      const currentStageData = loadingStages[currentStage];

      // Update stage progress
      const stageProgress = Math.min(100, (stageElapsed / currentStageData.duration) * 100);
      setStageProgress(stageProgress);

      // Update total progress
      const totalProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setTotalProgress(totalProgress);

      // Update time remaining
      const remainingTime = Math.max(0, (totalDuration - elapsed) / 1000);
      setTimeRemaining(remainingTime);

      // Rotate tips
      setCurrentTip(Math.floor((elapsed / 3000) % currentStageData.tips.length));

      // Check if stage is complete
      if (stageProgress >= 100 && currentStage < loadingStages.length - 1) {
        setCurrentStage(prev => prev + 1);
        stageStartTime = Date.now();
      }

      // Check if all stages are complete
      if (totalProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isLoading, currentStage]);

  if (!isLoading) return null;

  const currentStageData = loadingStages[currentStage];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Analyzing Repository</h2>
                {repository && (
                  <p className="text-sm text-muted-foreground">{repository}</p>
                )}
              </div>
            </div>
            {onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>

          {/* Overall Progress */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stage {currentStage + 1} of {loadingStages.length}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.ceil(timeRemaining)}s remaining
              </span>
            </div>
          </div>

          {/* Current Stage */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-background rounded-lg">
                {currentStageData.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{currentStageData.name}</h3>
                <p className="text-sm text-muted-foreground">{currentStageData.description}</p>
              </div>
              <Badge variant="outline">{Math.round(stageProgress)}%</Badge>
            </div>
            
            {/* Stage Progress */}
            <Progress value={stageProgress} className="h-1 mb-3" />
            
            {/* Educational Tip */}
            <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">Pro Tip</p>
                <p className="text-xs text-muted-foreground">
                  {currentStageData.tips[currentTip]}
                </p>
              </div>
            </div>
          </div>

          {/* Stage Timeline */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Analysis Timeline</h4>
            <div className="space-y-2">
              {loadingStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    index === currentStage
                      ? 'bg-primary/10 border border-primary/20'
                      : index < currentStage
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-muted/30'
                  }`}
                >
                  <div className={`p-1 rounded ${
                    index === currentStage
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStage
                      ? 'bg-green-500 text-white'
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {index < currentStage ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      index === currentStage ? 'text-primary' : 
                      index < currentStage ? 'text-green-700' : 
                      'text-muted-foreground'
                    }`}>
                      {stage.name}
                    </p>
                    <p className={`text-xs ${
                      index === currentStage ? 'text-primary/70' : 
                      index < currentStage ? 'text-green-600' : 
                      'text-muted-foreground'
                    }`}>
                      {stage.description}
                    </p>
                  </div>
                  {index === currentStage && (
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium mb-2 text-blue-900">Did You Know?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Interactive</div>
                <div className="text-xs text-blue-700">Click nodes to explore</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Smart</div>
                <div className="text-xs text-purple-700">AI-powered insights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">Exportable</div>
                <div className="text-xs text-indigo-700">Share your findings</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
