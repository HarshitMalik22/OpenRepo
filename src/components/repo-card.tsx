import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitBranch } from 'lucide-react';
import type { Repository } from '@/lib/types';

interface RepoCardProps {
  repo: Repository;
}

export default function RepoCard({ repo }: RepoCardProps) {
  // Slugs for URLs can't have '/', so we replace it with a hyphen.
  const slug = repo.full_name.replace('/', '-');

  return (
    <Card className="h-full flex flex-col hover:border-primary transition-colors">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{repo.name}</CardTitle>
        <CardDescription>{repo.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
          {repo.topics.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{(repo.stargazers_count / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="w-4 h-4" />
            <span>{repo.language}</span>
          </div>
        </div>
        <Button asChild>
          <Link href={`/repos/${slug}`}>Explain with AI</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
