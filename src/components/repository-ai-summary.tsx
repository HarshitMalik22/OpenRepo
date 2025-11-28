import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Code, GitBranch, Star, Clock, FileText, Layers, BookOpen, Terminal, Package, Info, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReadmeSection {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface RepositoryStats {
  hasIssues: boolean;
  hasWiki: boolean;
  hasProjects: boolean;
  hasDiscussions: boolean;
  isPrivate: boolean;
}

interface RepositoryAISummaryProps {
  /**
   * The AI analysis data containing the repository summary and explanation
   */
  aiData?: {
    summary?: string;
    explanation?: string;
    componentMapping?: string;
    mermaidChart?: string;
    readmeContent?: string;
  };
  
  /**
   * Repository metadata
   */
  repository?: {
    name?: string;
    description?: string;
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    open_issues?: number;
    watchers_count?: number;
    language?: string;
    updated_at?: string;
    created_at?: string;
    license?: {
      key: string;
      name: string;
      spdx_id: string;
      url: string;
    } | null;
    has_issues?: boolean;
    has_wiki?: boolean;
    has_projects?: boolean;
    has_discussions?: boolean;
    private?: boolean;
    owner?: {
      login: string;
      avatar_url: string;
      html_url: string;
    };
  };
  
  /**
   * Loading state
   */
  isLoading?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Extracts key insights from the AI explanation and README content
 */
function extractKeyInsights(explanation: string, readmeContent?: string): {title: string; content: string; icon: React.ReactNode}[] {
  const insights = [];
  
  // Extract from AI explanation if available
  if (explanation) {
    const explanationPoints = explanation
      .split('.')
      .filter(s => s.trim().length > 50)
      .slice(0, 3)
      .map((s, i) => ({
        title: ['Architecture', 'Structure', 'Key Components'][i] || 'Insight',
        content: `${s.trim()}.`,
        icon: <Layers className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
      }));
    insights.push(...explanationPoints);
  }
  
  // Extract from README if available
  if (readmeContent) {
    // Extract features section
    const featuresMatch = readmeContent.match(/##\s*Features?[\s\S]*?(?=##\s*\w|$)/i);
    if (featuresMatch) {
      const features = featuresMatch[0]
        .split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .slice(0, 3)
        .map(feature => ({
          title: 'Feature',
          content: feature.replace(/^[-*]\s*/, '').trim(),
          icon: <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
        }));
      insights.push(...features);
    }
    
    // Extract quick start or installation section
    const quickStartMatch = readmeContent.match(/##\s*(Quick Start|Installation|Getting Started)[\s\S]*?(?=##\s*\w|$)/i);
    if (quickStartMatch && insights.length < 6) {
      const firstStep = quickStartMatch[0]
        .split('\n')
        .find(line => line.trim().startsWith('1.') || line.trim().startsWith('- '));
      
      if (firstStep) {
        insights.push({
          title: 'Getting Started',
          content: firstStep.replace(/^\d+\.\s*|^[-*]\s*/, '').trim(),
          icon: <Terminal className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
        });
      }
    }
  }
  
  return insights.slice(0, 4); // Return max 4 insights
}

/**
 * Formats a date string to a relative time (e.g., "2 days ago")
 */
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) return 'Just now';
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  
  // Less than a month
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  
  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  
  // Years
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

export function RepositoryAISummary({ 
  aiData, 
  repository, 
  isLoading = false, 
  className 
}: RepositoryAISummaryProps) {
  const keyInsights = useMemo(() => 
    extractKeyInsights(aiData?.explanation || '', aiData?.readmeContent),
    [aiData?.explanation, aiData?.readmeContent]
  );
  
  const repositoryStats = useMemo(() => ({
    hasIssues: repository?.has_issues || false,
    hasWiki: repository?.has_wiki || false,
    hasProjects: repository?.has_projects || false,
    hasDiscussions: repository?.has_discussions || false,
    isPrivate: repository?.private || false,
  }), [repository]);
  
  const lastUpdated = useMemo(() => 
    repository?.updated_at ? formatRelativeTime(repository.updated_at) : 'Unknown',
    [repository?.updated_at]
  );
  
  const createdDate = useMemo(() => 
    repository?.created_at ? new Date(repository.created_at).toLocaleDateString() : 'Unknown',
    [repository?.created_at]
  );
  
  const licenseName = useMemo(() => 
    repository?.license?.name || 'No license specified',
    [repository?.license]
  );
  
  if (isLoading) {
    return (
      <Card className={cn("bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aiData?.explanation) {
    return (
      <Card className={cn("bg-amber-50 border-amber-200 text-amber-800 p-6 text-center", className)}>
        <div className="flex flex-col items-center">
          <AlertCircle className="h-8 w-8 mb-2 text-amber-600" />
          <h3 className="font-medium">No AI Analysis Available</h3>
          <p className="text-sm opacity-80 mt-1">
            Click "Analyze with AI" to generate a detailed analysis of this repository
          </p>
          {repository?.description && (
            <div className="mt-4 text-left w-full bg-white/50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-medium flex items-center gap-1.5 text-amber-900">
                <Info className="h-4 w-4" />
                Repository Description
              </h4>
              <p className="mt-1 text-sm text-amber-800">{repository.description}</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full", className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              {repository?.name || 'Repository'} Overview
            </CardTitle>
            {repository?.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {repository.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {repositoryStats.isPrivate && (
              <Badge variant="outline" className="border-amber-200 text-amber-800 bg-amber-50">
                Private
              </Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Updated {lastUpdated}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Repository Summary */}
        {aiData.summary ? (
          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-4 text-sm text-blue-900">
            <div className="font-medium mb-1.5 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-700" />
              Project Summary
            </div>
            <p className="leading-relaxed">{aiData.summary}</p>
          </div>
        ) : null}
        
        {/* Key Insights */}
        {keyInsights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-600" />
              Key Insights
            </h4>
            <div className="space-y-3">
              {keyInsights.map((insight, i) => (
                <div key={i} className="bg-white/50 border rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">{insight.icon}</div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-800">{insight.title}</h5>
                      <p className="text-sm text-gray-700 mt-0.5">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Repository Metadata */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Package className="h-4 w-4 text-gray-600" />
            Repository Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Language</p>
              <div className="flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-sm font-medium">{repository?.language || 'Not specified'}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">License</p>
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-sm font-medium">{licenseName}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Stars</p>
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{(repository?.stargazers_count || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Forks</p>
              <div className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-sm font-medium">{(repository?.forks_count || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Open Issues</p>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-sm font-medium">{(repository?.open_issues_count || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Created</p>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-sm font-medium">{createdDate}</span>
              </div>
            </div>
          </div>
          
          {/* Repository Features */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {repositoryStats.hasIssues && (
              <Badge variant="outline" className="text-xs py-1 h-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                Issues
              </Badge>
            )}
            {repositoryStats.hasWiki && (
              <Badge variant="outline" className="text-xs py-1 h-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                Wiki
              </Badge>
            )}
            {repositoryStats.hasProjects && (
              <Badge variant="outline" className="text-xs py-1 h-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>
                Projects
              </Badge>
            )}
            {repositoryStats.hasDiscussions && (
              <Badge variant="outline" className="text-xs py-1 h-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                Discussions
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RepositoryAISummary;
