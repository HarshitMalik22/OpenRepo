import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RepoCard from '@/components/repo-card';
import { getPopularRepos } from '@/lib/github';
import type { Repository } from '@/lib/types';

export default async function ProfilePage() {
  const allRepos = await getPopularRepos();
  const savedRepos = allRepos.slice(0, 1); // Mocking saved repos

  return (
    <div className="container mx-auto py-16 animate-fade-in">
      <header className="mb-16">
        <h1 className="text-5xl font-bold font-headline mb-4">Your Dashboard</h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">Manage your saved repositories and preferences.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-6">Saved Repositories</h2>
          <div className="space-y-6">
            {savedRepos.length > 0 ? (
              savedRepos.map(repo => <RepoCard key={repo.id} repo={repo} />)
            ) : (
              <p className="text-muted-foreground">You haven't saved any repositories yet.</p>
            )}
          </div>
        </div>
        
        <div>
          <Card className="bg-glass/90 backdrop-blur-md border-glass-border shadow-glass hover:shadow-glass-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-headline">Your Preferences</CardTitle>
              <CardDescription>These settings help us recommend projects for you.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mock display of preferences */}
              <div className="space-y-2">
                <p><span className="font-semibold">Tech Stack:</span> React, Next.js</p>
                <p><span className="font-semibold">Goal:</span> Understand Architecture</p>
                <p><span className="font-semibold">Experience:</span> Intermediate</p>
              </div>
              <Button variant="glass" asChild className="w-full mt-6">
                <Link href="/onboarding">Edit Preferences</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
