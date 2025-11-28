"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  GitFork,
  ExternalLink,
  Eye,
  Code,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  MapPin,
  BarChart2,
  Trophy,
  HeartHandshake
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Repository } from '@/lib/types';

interface GlassRepoListProps {
  repositories: Repository[];
  onViewAnalysis?: (repo: Repository) => void;
  onContribute?: (repo: Repository) => void;
  onViewRepo?: (repo: Repository) => void;
  onLikeRepo?: (repo: Repository) => void;
  onDislikeRepo?: (repo: Repository) => void;
  onRateRepo?: (repo: Repository, rating: number) => void;
  onFilterChange?: (filters: string[]) => void;
  activeFilters?: string[];
  showExplanations?: boolean;
  explanations?: Map<string, string[]>;
  enhanced?: boolean;
}

export default function GlassRepoList({
  repositories,
  onViewAnalysis,
  onContribute,
  onViewRepo,
  onLikeRepo,
  onDislikeRepo,
  onRateRepo,
  onFilterChange,
  activeFilters = [],
  showExplanations = false,
  explanations,
  enhanced = false
}: GlassRepoListProps) {
  const getBadgeClass = () => {
    return 'bg-white/20 dark:bg-black/30 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-colors';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getLabel = (type: string, level: string) => {
    const labels: Record<string, Record<string, string>> = {
      difficulty: {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'expert': 'Expert'
      },
      competition: {
        'very-high': 'Very High',
        'high': 'High',
        'moderate': 'Moderate',
        'low': 'Low',
        'very-low': 'Very Low'
      }
    };
    return labels[type]?.[level] || level.replace('-', ' ');
  };

  // Emoji helper removed as per user request

  const getTooltipText = (type: string, level: string) => {
    const tooltips: Record<string, Record<string, string>> = {
      difficulty: {
        'beginner': 'Great for newcomers to open source',
        'intermediate': 'Some experience with Git and coding recommended',
        'advanced': 'Requires solid technical skills',
        'expert': 'For experienced developers only'
      },
      competition: {
        'very-high': 'Many contributors, high competition for issues',
        'high': 'Popular repository with active contributors',
        'moderate': 'Balanced contribution opportunities',
        'low': 'Fewer contributors, good opportunities',
        'very-low': 'High chance of getting contributions accepted'
      }
    };
    return tooltips[type]?.[level] || '';
  };



  const handleFilterClick = (filterId: string) => {
    if (onFilterChange) {
      const newFilters = activeFilters.includes(filterId)
        ? activeFilters.filter(f => f !== filterId)
        : [...activeFilters, filterId];
      onFilterChange(newFilters);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">

        {/* Repository List */}
        <div className="space-y-3">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="group relative overflow-hidden rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-gray-300/60 dark:hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 dark:hover:bg-black/50"
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              {/* Subtle gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 dark:from-white/5 via-transparent to-white/10 dark:to-white/5 pointer-events-none" />
              <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <img
                        src={typeof repo.owner === 'string' ? `https://github.com/${repo.owner}.png` : repo.owner.avatar_url}
                        alt={`${typeof repo.owner === 'string' ? repo.owner : repo.owner.login} avatar`}
                        className="w-10 h-10 rounded-full border-2 border-white/20 dark:border-white/30 shadow-lg bg-white/20 dark:bg-black/30 backdrop-blur-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline"
                          >
                            {repo.name}
                            <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          </a>
                        </h3>

                        {repo.recommendation_score && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-purple-300/30">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span className="text-xs font-medium text-purple-700">
                              {repo.recommendation_score.totalScore}% match
                            </span>
                          </div>
                        )}
                      </div>

                      {repo.description && (
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags and Stats Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {repo.language && (
                      <Badge variant="outline" className={`text-xs px-2 py-1 ${getBadgeClass()}`}>
                        {repo.language}
                      </Badge>
                    )}

                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className={`text-xs px-2 py-1 gap-1.5 ${getBadgeClass()}`}>
                          <BarChart2 className="w-3 h-3" />
                          <span>Difficulty: {getLabel('difficulty', repo.contribution_difficulty)}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getTooltipText('difficulty', repo.contribution_difficulty)}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className={`text-xs px-2 py-1 gap-1.5 ${getBadgeClass()}`}>
                          <Trophy className="w-3 h-3" />
                          <span>Competition: {getLabel('competition', repo.competition_level)}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getTooltipText('competition', repo.competition_level)}</p>
                      </TooltipContent>
                    </Tooltip>

                    {repo.good_first_issues_count && repo.good_first_issues_count > 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className={`text-xs px-2 py-1 gap-1.5 ${getBadgeClass()}`}>
                            <HeartHandshake className="w-3 h-3" />
                            <span>{formatNumber(repo.good_first_issues_count)} Good First Issues</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Issues labeled as good for first-time contributors</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {repo.contributor_count > 0 && (
                      <Badge variant="outline" className={`text-xs px-2 py-1 ${getBadgeClass()}`}>
                        <Users className="w-3 h-3 mr-1" />
                        {formatNumber(repo.contributor_count)} contributors
                      </Badge>
                    )}

                    {/* Contributing Guide Badge */}
                    {repo.documentation_score > 0.7 && (
                      <Badge variant="outline" className={`text-xs px-2 py-1 ${getBadgeClass()}`}>
                        <BookOpen className="w-3 h-3 mr-1" />
                        Has Guide
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{formatNumber(repo.stargazers_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{formatNumber(repo.forks_count)}</span>
                    </div>
                    {repo.open_issues_count > 0 && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{repo.open_issues_count}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendation Explanation */}
                {showExplanations && explanations?.get(repo.full_name) && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">Why this match?</span>
                    </div>
                    <div className="space-y-1">
                      {explanations.get(repo.full_name)?.slice(0, 3).map((explanation, idx) => (
                        <div key={idx} className="text-xs text-purple-600 flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>{explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1 text-xs h-8 px-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 dark:border-white/20"
                    onClick={() => {
                      onViewAnalysis?.(repo);
                      onViewRepo?.(repo);
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1.5" />
                    Analyze with AI
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 text-xs h-8 px-3 bg-white/20 dark:bg-black/30 backdrop-blur-sm border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-black/40 hover:border-white/40 dark:hover:border-white/30 transition-all duration-300"
                    onClick={() => {
                      onContribute?.(repo);
                      onViewRepo?.(repo);
                    }}
                  >
                    <Code className="w-3 h-3 mr-1.5" />
                    Contribute
                  </Button>

                  {enhanced && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-green-500/10 backdrop-blur-sm border-green-300/50 text-green-600 hover:bg-green-500/20 hover:border-green-300/70 transition-all duration-300"
                        onClick={() => onLikeRepo?.(repo)}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-red-500/10 backdrop-blur-sm border-red-300/50 text-red-600 hover:bg-red-500/20 hover:border-red-300/70 transition-all duration-300"
                        onClick={() => onDislikeRepo?.(repo)}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/20 dark:bg-black/30 backdrop-blur-sm border-white/30 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-black/40 hover:border-white/40 dark:hover:border-white/30 transition-all duration-300"
                    onClick={() => window.open(repo.html_url, '_blank')}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>

                {/* Rating Section for Enhanced Mode */}
                {enhanced && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Rate this recommendation:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-yellow-500 transition-colors"
                            onClick={() => onRateRepo?.(repo, rating)}
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
