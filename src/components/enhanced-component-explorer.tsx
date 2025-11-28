"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Code, 
  FileText, 
  GitBranch,
  Database,
  Cpu,
  Globe,
  Settings,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/styles';
import type { Repository } from '@/lib/types';

interface CodeSnippet {
  language: string;
  code: string;
  highlightedLines: number[];
}

interface ComponentExplanation {
  id: string;
  name: string;
  type: 'component' | 'module' | 'service' | 'utility' | 'hook' | 'config';
  description: string;
  codeSnippet: CodeSnippet;
  filePath: string;
  lineNumbers: {
    start: number;
    end: number;
  };
  dependencies: string[];
  complexity: {
    score: number;
    factors: string[];
  };
  importance: {
    score: number;
    reason: string;
  };
  relatedComponents: string[];
  tags: string[];
}

interface EnhancedComponentExplorerProps {
  components: ComponentExplanation[];
  repository: Repository;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export default function EnhancedComponentExplorer({ 
  components, 
  repository, 
  userSkillLevel = 'intermediate' 
}: EnhancedComponentExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'importance' | 'complexity' | 'alphabetical'>('importance');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<ComponentExplanation | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    let filtered = components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'all' || component.type === filterType;
      
      return matchesSearch && matchesType;
    });

    // Sort components
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'importance':
          return b.importance.score - a.importance.score;
        case 'complexity':
          return b.complexity.score - a.complexity.score;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [components, searchQuery, sortBy, filterType]);

  const getComponentIcon = (type: ComponentExplanation['type']) => {
    const icons = {
      component: <FileText className="w-4 h-4" />,
      module: <GitBranch className="w-4 h-4" />,
      service: <Settings className="w-4 h-4" />,
      utility: <Code className="w-4 h-4" />,
      hook: <Cpu className="w-4 h-4" />,
      config: <Settings className="w-4 h-4" />
    };
    return icons[type] || icons.component;
  };

  const getComplexityColor = (score: number): string => {
    if (score <= 3) return 'text-green-500';
    if (score <= 7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImportanceColor = (score: number): string => {
    if (score <= 3) return 'bg-gray-100 text-gray-600';
    if (score <= 7) return 'bg-blue-100 text-blue-600';
    return 'bg-red-100 text-red-600';
  };

  const handleCopyCode = async (code: string, componentId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(componentId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleViewOnGitHub = (component: ComponentExplanation) => {
    const url = `${repository.html_url}/blob/main/${component.filePath}#L${component.lineNumbers.start}-L${component.lineNumbers.end}`;
    window.open(url, '_blank');
  };

  const componentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'component', label: 'Components' },
    { value: 'module', label: 'Modules' },
    { value: 'service', label: 'Services' },
    { value: 'utility', label: 'Utilities' },
    { value: 'hook', label: 'Hooks' },
    { value: 'config', label: 'Config' }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search components, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="importance">Sort by Importance</SelectItem>
            <SelectItem value="complexity">Sort by Complexity</SelectItem>
            <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {componentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {userSkillLevel} level
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComponents.map(component => (
              <Card 
                key={component.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedComponent(component)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getComponentIcon(component.type)}
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getImportanceColor(component.importance.score)}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {component.importance.score}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{component.type}</Badge>
                    <Badge 
                      variant="outline" 
                      className={getComplexityColor(component.complexity.score)}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {component.complexity.score}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {component.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {component.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {component.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{component.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {component.lineNumbers.end - component.lineNumbers.start + 1} lines
                    </span>
                    <span>{component.filePath.split('/').pop()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {filteredComponents.map(component => (
            <Card 
              key={component.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedComponent(component)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getComponentIcon(component.type)}
                    <div>
                      <h3 className="font-medium">{component.name}</h3>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{component.type}</Badge>
                    <Badge variant="outline">{component.complexity.score}/10</Badge>
                    <Badge variant="outline">{component.importance.score}/10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getComponentIcon(selectedComponent.type)}
                    <h2 className="text-2xl font-bold">{selectedComponent.name}</h2>
                    <Badge variant="secondary">{selectedComponent.type}</Badge>
                  </div>
                  <p className="text-muted-foreground">{selectedComponent.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedComponent(null)}
                >
                  ×
                </Button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Complexity</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getComplexityColor(selectedComponent.complexity.score).replace('text-', 'bg-')}`}
                              style={{ width: `${selectedComponent.complexity.score * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedComponent.complexity.score}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Factors:</p>
                      <ul className="text-xs">
                        {selectedComponent.complexity.factors.map((factor, index) => (
                          <li key={index}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Importance</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${selectedComponent.importance.score * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedComponent.importance.score}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">{selectedComponent.importance.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Code Snippet */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Code Snippet</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyCode(selectedComponent.codeSnippet.code, selectedComponent.id)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedCode === selectedComponent.id ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOnGitHub(selectedComponent)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on GitHub
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedComponent.filePath}:{selectedComponent.lineNumbers.start}-{selectedComponent.lineNumbers.end}
                  </p>
                </CardHeader>
                <CardContent>
                  <SyntaxHighlighter
                    language={selectedComponent.codeSnippet.language}
                    style={atomOneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    showLineNumbers
                    wrapLines
                    lineProps={(lineNumber) => ({
                      style: {
                        display: 'block',
                        backgroundColor: selectedComponent.codeSnippet.highlightedLines.includes(lineNumber)
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'transparent'
                      }
                    })}
                  >
                    {selectedComponent.codeSnippet.code}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>

              {/* Dependencies and Related Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedComponent.dependencies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.dependencies.map(dep => (
                          <Badge key={dep} variant="outline">{dep}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedComponent.relatedComponents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.relatedComponents.map(related => (
                          <Badge key={related} variant="outline">{related}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedComponent.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
