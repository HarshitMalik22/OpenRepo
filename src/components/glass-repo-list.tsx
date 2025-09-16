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
  MapPin
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Repository } from '@/lib/types';

interface GlassRepoListProps {
  repositories: Repository[];
  onViewAnalysis?: (repo: Repository) => void;
  onContribute?: (repo: Repository) => void;
  onFilterChange?: (filters: string[]) => void;
  activeFilters?: string[];
}

export default function GlassRepoList({ 
  repositories, 
  onViewAnalysis, 
  onContribute,
  onFilterChange,
  activeFilters = []
}: GlassRepoListProps) {
  const getBadgeClass = () => {
    return 'bg-black/5 text-gray-700 border border-gray-200';
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

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      case 'expert': return '🔥';
      default: return '📚';
    }
  };

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

  const quickFilters = [
    { id: 'frontend', label: 'Frontend', icon: '💻' },
    { id: 'ai-ml', label: 'AI/ML', icon: '🤖' },
    { id: 'beginner-friendly', label: 'Beginner-friendly', icon: '🌱' },
    { id: 'has-guide', label: 'Has Contrib Guide', icon: '🧭' }
  ];

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
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 p-1">
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilters.includes(filter.id) ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-3 gap-1.5 transition-all duration-200"
              onClick={() => handleFilterClick(filter.id)}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Repository List */}
        <div className="space-y-3">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
            >
              <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <img
                        src={repo.owner.avatar_url}
                        alt={`${repo.owner.login} avatar`}
                        className="w-8 h-8 rounded border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline"
                          >
                            {repo.name}
                            <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          </a>
                        </h3>
                        
                        {repo.recommendation_score && (
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {repo.recommendation_score.totalScore}% match
                          </span>
                        )}
                      </div>
                      
                      {repo.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
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
                        <Badge variant="outline" className={`text-xs px-2 py-1 ${getBadgeClass()}`}>
                          {getDifficultyIcon(repo.contribution_difficulty.level)} {getLabel('difficulty', repo.contribution_difficulty.level)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getTooltipText('difficulty', repo.contribution_difficulty.level)}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className={`text-xs px-2 py-1 ${getBadgeClass()}`}>
                          {getLabel('competition', repo.competition_level)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getTooltipText('competition', repo.competition_level)}</p>
                      </TooltipContent>
                    </Tooltip>
                    
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1 text-xs h-8 px-3 bg-black text-white hover:bg-gray-800 transition-colors"
                    onClick={() => onViewAnalysis?.(repo)}
                  >
                    <Eye className="w-3 h-3 mr-1.5" />
                    Analyze with AI
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs h-8 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => onContribute?.(repo)}
                  >
                    <Code className="w-3 h-3 mr-1.5" />
                    Contribute
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={() => window.open(repo.html_url, '_blank')}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
