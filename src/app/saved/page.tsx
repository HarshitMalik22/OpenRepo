import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, GitBranch, ExternalLink, BookmarkCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function SavedReposPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const savedRepos = await prisma.saved_repositories.findMany({
        where: {
            user_id: userId
        },
        include: {
            repository: true
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    return (
        <div className="container mx-auto py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-2">
                    <BookmarkCheck className="w-8 h-8 text-primary" />
                    Saved Repositories
                </h1>
                <p className="text-muted-foreground">
                    Repositories you have bookmarked for later.
                </p>
            </header>

            {savedRepos.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <h3 className="text-lg font-medium mb-2">No saved repositories yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Browse repositories and click the "Save" button to add them here.
                    </p>
                    <Button asChild>
                        <Link href="/">Explore Repositories</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRepos.map((saved) => {
                        const repo = saved.repository;
                        // Handle BigInt serialization for client
                        const repoId = repo.id.toString();
                        // Parse JSON data if needed, or use typed fields
                        const repoData = repo.data as any;
                        const description = repoData?.description || 'No description available';
                        const language = repoData?.language || 'Unknown';
                        const stars = repoData?.stargazers_count || 0;
                        const topics = (repoData?.topics || []).slice(0, 3);

                        // Construct slug for link (owner--repo)
                        const slug = repo.full_name.replace('/', '--');

                        return (
                            <Card key={saved.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-bold truncate" title={repo.full_name}>
                                            <Link href={`/repos/${slug}`} className="hover:underline">
                                                {repo.full_name}
                                            </Link>
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 h-10">
                                        {description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>{(stars / 1000).toFixed(1)}k</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <GitBranch className="w-4 h-4" />
                                            <span>{language}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {topics.map((topic: string) => (
                                            <Badge key={topic} variant="secondary" className="text-xs">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild variant="default" className="w-full">
                                            <Link href={`/repos/${slug}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
