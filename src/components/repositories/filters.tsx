'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Filter, Star, Calendar, Clock, ArrowDownUp, X, ChevronDown, Trophy, Activity, Zap, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

// Simple debounce implementation
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

type SortOption = 'stars' | 'updated' | 'newest' | 'name';

interface RepositoryFiltersProps {
  onFilterChange: (filters: any) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function RepositoryFilters({
  onFilterChange,
  viewMode,
  onViewModeChange
}: RepositoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [goodFirstIssues, setGoodFirstIssues] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('stars');

  // Handle search input with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounce(() => {
      onFilterChange({
        q: value,
        languages: selectedLanguages,
        topics: selectedTopics,
        goodFirstIssues,
        sortBy
      });
    }, 300)();
  };

  // Available languages and topics
  const availableLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'];
  const availableTopics = ['react', 'nextjs', 'node', 'ai', 'ml', 'web', 'mobile'];

  const handleFilterChange = () => {
    onFilterChange({
      q: searchQuery,
      languages: selectedLanguages,
      topics: selectedTopics,
      goodFirstIssues,
      sortBy
    });
  };

  // Update filters when any filter changes
  useEffect(() => {
    handleFilterChange();
  }, [selectedLanguages, selectedTopics, goodFirstIssues, sortBy]);

  const toggleLanguage = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(newLanguages);
  };

  const toggleTopic = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newTopics);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguages([]);
    setSelectedTopics([]);
    setGoodFirstIssues(false);
    setSortBy('stars');
    onFilterChange({
      q: '',
      languages: [],
      topics: [],
      goodFirstIssues: false,
      sortBy: 'stars'
    });
  };

  const activeFiltersCount = selectedLanguages.length + selectedTopics.length + (goodFirstIssues ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="search"
          placeholder="Search repositories by name, description, or topics..."
          className="pl-9 bg-background/50 border-muted"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tech Stack Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <Code2 className="mr-2 h-4 w-4" />
              Tech Stack
              {selectedLanguages.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                    {selectedLanguages.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedLanguages.length > 2 ? (
                      <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                        {selectedLanguages.length} selected
                      </Badge>
                    ) : (
                      selectedLanguages.map((lang) => (
                        <Badge
                          variant="secondary"
                          key={lang}
                          className="rounded-sm px-1 font-normal"
                        >
                          {lang}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <div className="space-y-2">
                <h4 className="font-medium text-xs text-muted-foreground px-2 mb-2">Languages</h4>
                {availableLanguages.map((language) => (
                  <div key={language} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent rounded-sm cursor-pointer" onClick={() => toggleLanguage(language)}>
                    <Checkbox
                      id={`lang-${language}`}
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={() => toggleLanguage(language)}
                    />
                    <Label htmlFor={`lang-${language}`} className="text-sm font-normal cursor-pointer flex-1">
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Types Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <Filter className="mr-2 h-4 w-4" />
              Types
              {(goodFirstIssues || sortBy === 'stars') && (
                <Separator orientation="vertical" className="mx-2 h-4" />
              )}
              {sortBy === 'stars' && !goodFirstIssues && (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  Stars
                </Badge>
              )}
              {goodFirstIssues && (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  GFI
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2" align="start">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start font-normal',
                  sortBy === 'stars' ? 'bg-accent' : ''
                )}
                onClick={() => setSortBy('stars')}
              >
                <Star className="w-4 h-4 mr-2" />
                Most Stars
              </Button>
              <div className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer" onClick={() => setGoodFirstIssues(!goodFirstIssues)}>
                <Checkbox
                  id="good-first-issues"
                  checked={goodFirstIssues}
                  onCheckedChange={(checked) => setGoodFirstIssues(!!checked)}
                />
                <Label htmlFor="good-first-issues" className="text-sm font-normal cursor-pointer flex-1">
                  Good First Issue
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
