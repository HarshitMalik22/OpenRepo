import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitBranch } from 'lucide-react';

interface SavedRepository {
  id: string;
  userId: string;
  repoFullName: string;
  repoName: string;
  repoUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  tags: string[];
  notes: string | null;
  savedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SavedRepoCardProps {
  repo: SavedRepository;
}

export default function SavedRepoCard({ repo }: SavedRepoCardProps) {
  // Slugs for URLs can't have '/', so we replace it with a unique separator.
  const slug = repo.repoFullName.replace('/', '--');

  return (
    <Card className="h-full flex flex-col hover:border-primary transition-colors">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{repo.repoName}</CardTitle>
        <CardDescription>{repo.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {repo.language && (
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {repo.stars}
          </span>
        </div>
        {repo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repo.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {repo.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{repo.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        {repo.notes && (
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Notes:</strong> {repo.notes}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/repository/${slug}`}>View Repository</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
