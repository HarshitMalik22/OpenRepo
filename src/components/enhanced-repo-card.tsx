"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  GitFork, 
  Users, 
  Clock, 
  Zap,
  Activity,
  Trophy,
  Target,
  ExternalLink,
  Eye,
  Code
} from 'lucide-react';
import type { Repository } from '@/lib/types';

interface EnhancedRepoCardProps {
  repository: Repository;
  onViewAnalysis?: (repo: Repository) => void;
  onContribute?: (repo: Repository) => void;
}

export default function EnhancedRepoCard({ 
  repository, 
  onViewAnalysis, 
  onContribute 
}: EnhancedRepoCardProps) {
  const {
    name,
    description,
    language,
    stargazers_count,
    forks_count,
    competition_level,
    activity_level,
    ai_domain,
    contribution_difficulty,
    recommendation_score,
    html_url
  } = repository;

  // Get colors for different levels
  const getCompetitionColor = (level: string) => {
    const colors = {
      'very-high': 'bg-red-500',
      'high': 'bg-orange-500',
      'moderate': 'bg-yellow-500',
      'low': 'bg-green-500',
      'very-low': 'bg-blue-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const getActivityColor = (level: string) => {
    const colors = {
      'highest': 'bg-green-500',
      'high': 'bg-emerald-500',
      'moderate': 'bg-yellow-500',
      'low': 'bg-gray-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const getDifficultyColor = (level: string) => {
    const colors = {
      'beginner': 'bg-green-500',
      'intermediate': 'bg-yellow-500',
      'advanced': 'bg-orange-500',
      'expert': 'bg-red-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const getDifficultyLabel = (level: string) => {
    const labels = {
      'beginner': 'Beginner Friendly',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert Level'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1 flex items-center gap-2">
              <a 
                href={html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {name}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {recommendation_score && (
            <div className="flex flex-col items-end ml-4">
              <div className="text-2xl font-bold text-blue-600">
                {recommendation_score.totalScore}%
              </div>
              <div className="text-xs text-muted-foreground">Match</div>
            </div>
          )}
        </div>
        
        {/* Tech Stack and Language */}
        <div className="flex flex-wrap gap-2 mt-3">
          {language && (
            <Badge variant="outline" className="text-xs">
              <Code className="w-3 h-3 mr-1" />
              {language}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {ai_domain?.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{formatNumber(stargazers_count)}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span>{formatNumber(forks_count)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatNumber(repository.contributor_count || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{repository.recent_commits || 0} commits</span>
          </div>
        </div>

        {/* Competition and Activity Levels */}
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className={`${getCompetitionColor(competition_level)} text-white border-0 text-xs`}
          >
            <Trophy className="w-3 h-3 mr-1" />
            Competition: {competition_level.replace('-', ' ')}
          </Badge>
          <Badge 
            variant="outline" 
            className={`${getActivityColor(activity_level)} text-white border-0 text-xs`}
          >
            <Activity className="w-3 h-3 mr-1" />
            Activity: {activity_level}
          </Badge>
        </div>

        {/* Contribution Difficulty */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${getDifficultyColor(contribution_difficulty.level)} text-white border-0 text-xs`}
            >
              <Target className="w-3 h-3 mr-1" />
              {getDifficultyLabel(contribution_difficulty.level)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Score: {Math.round(contribution_difficulty.score)}%
            </span>
          </div>
          <Progress value={contribution_difficulty.score} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Good First Issues:</span> {contribution_difficulty.goodFirstIssues}
            </div>
            <div>
              <span className="font-medium">Help Wanted:</span> {contribution_difficulty.helpWantedIssues}
            </div>
          </div>
        </div>

        {/* Recommendation Score Breakdown */}
        {recommendation_score && (
          <div className="pt-2 border-t">
            <div className="text-xs font-medium mb-2">Why this match?</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex justify-between">
                <span>Tech Stack:</span>
                <span className="font-medium">{recommendation_score.techStackMatch}%</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="font-medium">{recommendation_score.difficultyMatch}%</span>
              </div>
              <div className="flex justify-between">
                <span>Goal Alignment:</span>
                <span className="font-medium">{recommendation_score.goalAlignment}%</span>
              </div>
              <div className="flex justify-between">
                <span>Competition:</span>
                <span className="font-medium">{recommendation_score.competitionScore}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewAnalysis?.(repository)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Analysis
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onContribute?.(repository)}
          >
            <Code className="w-4 h-4 mr-2" />
            Contribute
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
