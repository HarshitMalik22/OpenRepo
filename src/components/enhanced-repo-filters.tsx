"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Target
} from 'lucide-react';
import { 
  techStacks 
} from '@/lib/filter-data';
import type { RepositoryFilters } from '@/lib/types';

interface EnhancedRepoFiltersProps {
  filters: RepositoryFilters;
  onFiltersChange: (filters: RepositoryFilters) => void;
  onClearFilters: () => void;
  disabled?: boolean;
}

export default function EnhancedRepoFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  disabled = false
}: EnhancedRepoFiltersProps) {

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

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative flex-grow">
        <Input
          placeholder="Search repositories by name, description, or topics..."
          value={filters.searchQuery || ''}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Tech Stack Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled}>
              <Target className="w-4 h-4 mr-2" />
              Tech Stack 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Technologies</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {techStacks.map(tech => (
              <DropdownMenuItem
                key={tech.id}
                onClick={() => toggleArrayFilter('techStack', tech.id, filters.techStack)}
                className="flex items-center justify-between"
              >
                <span>{tech.icon} {tech.name}</span>
                {filters.techStack?.includes(tech.id) && (
                  <span className="text-green-500">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

    </div>
  );
}
