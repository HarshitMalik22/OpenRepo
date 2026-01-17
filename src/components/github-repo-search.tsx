"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Github } from 'lucide-react';
import LaserFlow from '@/components/LaserFlow';

import { useAuth } from '@clerk/nextjs';

export default function GithubRepoSearch() {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { userId } = useAuth();

  const extractRepoFromUrl = (url: string): string | null => {
    // Remove trailing slashes and whitespace
    const cleanUrl = url.trim().replace(/\/$/, '');

    // Handle various GitHub URL formats
    const patterns = [
      /^https?:\/\/github\.com\/([^\/]+)\/([^\/\?#]+)/i,
      /^github\.com\/([^\/]+)\/([^\/\?#]+)/i,
      /^([^\/]+)\/([^\/\?#]+)$/  // Simple owner/repo format
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        const owner = match[1];
        const repo = match[2];
        // Remove .git extension if present
        const repoName = repo.replace(/\.git$/, '');
        return `${owner}/${repoName}`;
      }
    }

    return null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    const repoFullName = extractRepoFromUrl(repoUrl);

    if (!repoFullName) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
      return;
    }

    // Convert to slug format for routing
    const slug = repoFullName.replace('/', '--');

    if (!userId) {
      router.push(`/sign-in?redirect_url=/repos/${slug}`);
      return;
    }

    router.push(`/repos/${slug}`);
  };

  return (
    <div className="w-full relative border-0 shadow-none">
      <div className="relative min-h-[300px] flex items-end pb-10 w-full overflow-hidden">
        <div className="absolute inset-x-0 -top-[20%] bottom-0 z-0 pointer-events-none flex justify-center">
          <div className="w-full max-w-2xl relative h-full">
            <LaserFlow
              color="#3b82f6"
              horizontalBeamOffset={0}
              verticalBeamOffset={-0.15}
              verticalSizing={2}
              horizontalSizing={0.49}
              fogIntensity={0.02}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 flex flex-col items-center">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mt-0 w-full">
            <div className="relative flex-grow w-full">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Enter GitHub repository URL..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="pl-10 bg-background/95 backdrop-blur-md w-full rounded-xl border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5),0_0_40px_rgba(59,130,246,0.3)] focus-visible:shadow-[0_0_25px_rgba(59,130,246,0.7),0_0_50px_rgba(59,130,246,0.4)] focus-visible:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto gap-2 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="h-5 w-5" />
              Analyze Repo
            </Button>
          </form>
          {error && (
            <p className="text-destructive text-sm mt-2 text-center">{error}</p>
          )}
          <p className="text-muted-foreground text-sm mt-2 text-center">
            Try: https://github.com/facebook/react or vercel/next.js
          </p>
        </div>
      </div>
    </div>
  );
}