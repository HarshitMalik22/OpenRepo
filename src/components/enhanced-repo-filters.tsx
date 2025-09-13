"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  X,
  Zap,
  Activity,
  Trophy,
  Target
} from 'lucide-react';
import { 
  competitionLevels, 
  activityLevels, 
  aiDomains, 
  popularLanguages 
} from '@/lib/filter-data';
import type { RepositoryFilters, CompetitionLevel, ActivityLevel, AIDomain } from '@/lib/types';

interface EnhancedRepoFiltersProps {
  filters: RepositoryFilters;
  onFiltersChange: (filters: RepositoryFilters) => void;
  onClearFilters: () => void;
}

export default function EnhancedRepoFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: EnhancedRepoFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const updateFilter = (key: keyof RepositoryFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (
    key: keyof RepositoryFilters, 
    value: string, 
    currentArray: string[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const getFilterBadge = (label: string, values: string[], icon: React.ReactNode) => {
    if (values.length === 0) return null;
    
    return (
      <Badge variant="secondary" className="gap-1">
        {icon}
        {label}: {values.length}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search repositories by name, description, or topics..."
          value={filters.searchQuery || ''}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Tech Stack Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Tech Stack 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Technologies</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {popularLanguages.map(lang => (
              <DropdownMenuItem
                key={lang}
                onClick={() => toggleArrayFilter('language', lang.toLowerCase(), filters.language)}
                className="flex items-center justify-between"
              >
                <span>{lang}</span>
                {filters.language?.includes(lang.toLowerCase()) && (
                  <span className="text-green-500">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Competition Level Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Trophy className="w-4 h-4 mr-2" />
              Competition 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Competition Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {competitionLevels.map(level => (
              <DropdownMenuItem
                key={level.id}
                onClick={() => toggleArrayFilter('competitionLevel', level.id as CompetitionLevel, filters.competitionLevel)}
                className="flex flex-col items-start space-y-1"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{level.name}</span>
                  {filters.competitionLevel?.includes(level.id as CompetitionLevel) && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{level.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Activity Level Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Activity 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Activity Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activityLevels.map(level => (
              <DropdownMenuItem
                key={level.id}
                onClick={() => toggleArrayFilter('activityLevel', level.id as ActivityLevel, filters.activityLevel)}
                className="flex flex-col items-start space-y-1"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{level.name}</span>
                  {filters.activityLevel?.includes(level.id as ActivityLevel) && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{level.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AI Domain Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              AI Domain 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuLabel>AI-Powered Domains</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {aiDomains.map(domain => (
              <DropdownMenuItem
                key={domain.id}
                onClick={() => toggleArrayFilter('aiDomain', domain.id as AIDomain, filters.aiDomain)}
                className="flex flex-col items-start space-y-1"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{domain.name}</span>
                  {filters.aiDomain?.includes(domain.id as AIDomain) && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{domain.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Expand/Collapse */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-4 h-4 mr-2" />
          {isExpanded ? 'Hide' : 'Show'} Active Filters
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
          {filters.language && filters.language.length > 0 && (
            getFilterBadge("Languages", filters.language, <Target className="w-3 h-3" />)
          )}
          {filters.competitionLevel && filters.competitionLevel.length > 0 && (
            getFilterBadge("Competition", filters.competitionLevel, <Trophy className="w-3 h-3" />)
          )}
          {filters.activityLevel && filters.activityLevel.length > 0 && (
            getFilterBadge("Activity", filters.activityLevel, <Activity className="w-3 h-3" />)
          )}
          {filters.aiDomain && filters.aiDomain.length > 0 && (
            getFilterBadge("AI Domain", filters.aiDomain, <Zap className="w-3 h-3" />)
          )}
          {filters.searchQuery && (
            <Badge variant="secondary">
              Search: "{filters.searchQuery}"
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
