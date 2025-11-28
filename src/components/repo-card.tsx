import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitBranch, GitPullRequest, AlertCircle, Clock, Save, ExternalLink, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RepositoryWithActivity } from '@/types/repositories';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RepositoryCardProps {
  repo: RepositoryWithActivity;
  isSaved: boolean;
  onSaveToggle: (repoId: number) => void;
  variant?: 'grid' | 'list';
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

const RepositoryCard = ({ 
  repo, 
  isSaved,
  onSaveToggle,
  variant = 'grid',
}: RepositoryCardProps) => {
  const slug = repo.full_name?.replace('/', '--') || '';
  // Check if the repository is archived
  const isArchived = 'archived' in repo ? Boolean(repo.archived) : false;
  const lastUpdated = repo.updated_at 
    ? formatDistanceToNow(new Date(repo.updated_at as string), { addSuffix: true })
    : 'Unknown';

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSaveToggle(repo.id);
  };
  
  // Ensure we have valid repository data
  if (!repo) return null;

  // List view
  if (variant === 'list') {
    return (
      <Card className={cn("hover:border-primary transition-colors group")}>
        <Link href={`/repos/${slug}`} className="block">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium truncate">
                    {repo.full_name}
                  </h3>
                  {isArchived && (
                    <Badge variant="outline" className="text-xs">Archived</Badge>
                  )}
                  {repo.trendingThisWeek && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      Trending
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {repo.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.topics.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>{repo.language}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4" />
                    <span>{formatNumber(repo.forks_count)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formatNumber(repo.open_issues_count)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated {lastUpdated}</span>
                  </div>
                  
                  {repo.activity?.maintainerResponseTime && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>~{repo.activity.maintainerResponseTime}h response</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average maintainer response time to issues</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleSave}
                >
                  <Save className={cn("w-4 h-4", isSaved && "fill-current")} />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/repos/${slug}`}>
                    Analyze with AI
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Default grid view
  // Grid view (default)
  return (
    <Card className="h-full flex flex-col hover:border-primary transition-colors group">
      <Link href={`/repos/${slug}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-xl line-clamp-1">
              {repo.name}
            </CardTitle>
            <Button
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleSave}
            >
              <Save className={cn("w-4 h-4", isSaved && "fill-current")} />
            </Button>
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {repo.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            {repo.topics.slice(0, 4).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {repo.activity && (
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span>{lastUpdated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Open issues</span>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{repo.activity.openIssues}</span>
                </div>
              </div>
              {repo.activity.maintainerResponseTime && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response time</span>
                  <span>~{repo.activity.maintainerResponseTime}h</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{formatNumber(repo.stargazers_count)}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              <span>{formatNumber(repo.forks_count)}</span>
            </div>
            {repo.language && (
              <div className="hidden sm:flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>{repo.language}</span>
              </div>
            )}
          </div>
          
          <Button size="sm" variant="outline" className="shrink-0">
            Analyze
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}

// Export as both named and default
export { RepositoryCard };
export default RepositoryCard;
