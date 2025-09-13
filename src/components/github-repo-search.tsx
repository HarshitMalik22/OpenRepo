"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Github } from 'lucide-react';

export default function GithubRepoSearch() {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
    router.push(`/repos/${slug}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter GitHub repository URL..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="lg" className="gap-2 whitespace-nowrap">
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
  );
}
