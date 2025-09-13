import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitBranch, ExternalLink, BrainCircuit } from 'lucide-react';
import RepoExplanationClient from '@/components/repo-explanation-client';
import { getRepo } from '@/lib/github';

export default async function RepoDetailPage({ params }: { params: { slug: string } }) {
  // Validate the slug parameter
  if (!params.slug || typeof params.slug !== 'string') {
    console.error('RepoDetailPage - Invalid slug parameter:', params.slug);
    notFound();
  }
  
  // The slug is expected to be in the format "owner--repo".
  // We need to decode and replace '--' with '/' to get "owner/repo".
  const decodedSlug = decodeURIComponent(params.slug);
  const repoFullName = decodedSlug.replace('--', '/');
  
  console.log('RepoDetailPage - params.slug:', params.slug);
  console.log('RepoDetailPage - decodedSlug:', decodedSlug);
  console.log('RepoDetailPage - repoFullName:', repoFullName);
  
  // Validate the repository full name
  if (!repoFullName || !repoFullName.includes('/') || repoFullName.split('/').length !== 2) {
    console.error('RepoDetailPage - Invalid repoFullName:', repoFullName);
    notFound();
  }
  
  try {
    const repo = await getRepo(repoFullName);
    
    console.log('RepoDetailPage - repo fetched:', repo ? 'Found' : 'Not found');

    if (!repo) {
      console.log('RepoDetailPage - Showing 404 for:', repoFullName);
      notFound();
    }
    
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
              {repo.topics.map((tag: string) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </header>

        <RepoExplanationClient repository={repo} />
      </div>
    );
  } catch (error) {
    console.error('RepoDetailPage - Error fetching repository:', error);
    notFound();
  }
}
