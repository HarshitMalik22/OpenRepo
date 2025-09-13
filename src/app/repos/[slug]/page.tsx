import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitBranch, ExternalLink, Bookmark } from 'lucide-react';
import RepoExplanationClient from '@/components/repo-explanation-client';
import { getRepo } from '@/lib/github';

export default async function RepoDetailPage({ params }: { params: { slug: string } }) {
  // The slug is expected to be in the format "owner-repo".
  // We need to decode and replace '-' with '/' to get "owner/repo".
  const repoFullName = decodeURIComponent(params.slug).replace('-', '/');
  const repo = await getRepo(repoFullName);

  if (!repo) {
    notFound();
  }
  
  // Create a simplified repo object for the explanation component.
  // The AI flow expects a simpler structure.
  const explanationRepo = {
    id: repo.id.toString(),
    slug: params.slug,
    name: repo.full_name,
    description: repo.description || '',
    stars: repo.stargazers_count,
    language: repo.language || 'N/A',
    githubUrl: repo.html_url,
    tags: repo.topics || [],
    // These fields are no longer available from the GitHub API directly
    // and are expected by the AI flow. We provide mock/empty data for now.
    explanation: {
      why: '',
      what: '',
      how: '',
      flowchartMermaid: '',
      explanation: {},
    },
    resources: [],
    modules: [],
  };

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">{repo.name}</h1>
        <p className="text-lg text-muted-foreground">{repo.description}</p>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{(repo.stargazers_count / 1000).toFixed(1)}k Stars</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GitBranch className="w-5 h-5" />
            <span className="font-medium">{repo.language}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {repo.topics.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <Button>
            <Star className="mr-2 h-4 w-4" /> Star
          </Button>
          <Button variant="secondary">
            <GitBranch className="mr-2 h-4 w-4" /> Fork
          </Button>
          <Button variant="outline">
            <Bookmark className="mr-2 h-4 w-4" />
            Save for later
          </Button>
          <Button variant="ghost" asChild>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      <RepoExplanationClient repo={explanationRepo} />
    </div>
  );
}
