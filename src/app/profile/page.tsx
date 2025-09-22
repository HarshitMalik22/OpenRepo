import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSavedRepositories, getUserInteractions } from '@/lib/database';
import { getUserWithPreferences } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Clock, TrendingUp } from 'lucide-react';
import type { Repository } from '@/lib/types';
import SavedRepoCard from '@/components/saved-repo-card';
import { getCurrentUserId } from '@/lib/auth-utils';

// Make this page dynamic to avoid static generation issues with auth()
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const [user, savedRepos, recentInteractions] = await Promise.all([
    getUserWithPreferences(userId),
    getSavedRepositories(userId),
    getUserInteractions(userId, 10)
  ]);

  return (
    <div className="container mx-auto py-16 animate-fade-in">
      <header className="mb-16">
        <h1 className="text-5xl font-bold font-headline mb-4">Your Dashboard</h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Welcome back, {user?.firstName || 'Developer'}! Manage your saved repositories and track your progress.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-8">
            {/* Saved Repositories */}
            <div>
              <h2 className="text-2xl font-bold font-headline mb-6">Saved Repositories</h2>
              <div className="space-y-4">
                {savedRepos.length > 0 ? (
                  savedRepos.map(repo => (
                    <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              <a 
                                href={repo.repoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                {repo.repoName}
                              </a>
                            </h3>
                            {repo.description && (
                              <p className="text-muted-foreground mb-3">{repo.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{repo.stars.toLocaleString()}</span>
                              </div>
                              {repo.language && (
                                <Badge variant="outline">{repo.language}</Badge>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Saved {new Date(repo.savedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/repos/${repo.repoFullName.replace('/', '--')}`}>
                                View Analysis
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You haven't saved any repositories yet.</p>
                      <Button asChild>
                        <Link href="/repos">Discover Repositories</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold font-headline mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {recentInteractions.length > 0 ? (
                  recentInteractions.map(interaction => (
                    <Card key={interaction.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div>
                              <p className="font-medium">{interaction.repositoryFullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {interaction.type} • {new Date(interaction.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {interaction.score && (
                            <Badge variant="outline">
                              {interaction.score}/5 ⭐
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No recent activity.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* User Preferences */}
          <Card className="bg-glass/90 backdrop-blur-md border-glass-border shadow-glass hover:shadow-glass-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-headline">Your Preferences</CardTitle>
              <CardDescription>These settings help us recommend projects for you.</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.userPreferences ? (
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-sm">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.userPreferences.techStack.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Goal:</span>
                    <p className="text-sm text-muted-foreground">{user.userPreferences.goal}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Experience:</span>
                    <p className="text-sm text-muted-foreground">{user.userPreferences.experienceLevel}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Complete your onboarding to get personalized recommendations.</p>
                  <Button variant="outline" asChild>
                    <Link href="/onboarding">Complete Onboarding</Link>
                  </Button>
                </div>
              )}
              <Button variant="glass" asChild className="w-full mt-6">
                <Link href="/onboarding">Edit Preferences</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-glass/90 backdrop-blur-md border-glass-border shadow-glass hover:shadow-glass-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-headline">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Saved Repositories</span>
                  <span className="font-semibold">{savedRepos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Interactions</span>
                  <span className="font-semibold">{recentInteractions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Member Since</span>
                  <span className="font-semibold text-xs">
                    {user ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            {savedRepos.length > 0 ? (
              savedRepos.map(repo => <SavedRepoCard key={repo.id} repo={repo} />)
            ) : (
              <p className="text-muted-foreground">You haven't saved any repositories yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
