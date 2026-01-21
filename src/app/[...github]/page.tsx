import { redirect, notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ github: string[] }>;
}

/**
 * Catch-all route to handle GitHub URL prefixing
 * 
 * This allows users to access repository analysis by prefixing a GitHub URL with openrepo.xyz
 * 
 * Examples:
 *   openrepo.xyz/github.com/facebook/react     → redirects to /repos/facebook--react
 *   openrepo.xyz/www.github.com/vercel/next.js → redirects to /repos/vercel--next.js
 *   openrepo.xyz/https://github.com/owner/repo → redirects to /repos/owner--repo
 */
export default async function GitHubRedirectPage({ params }: PageProps) {
    const { github } = await params;

    // Join all segments to reconstruct the path
    const fullPath = github.join('/');

    // Clean up the path - remove protocol prefixes and www
    let cleanPath = fullPath
        .replace(/^https?:\/\//, '')   // Remove http:// or https://
        .replace(/^www\./, '');         // Remove www.

    // Check if it starts with github.com
    if (!cleanPath.startsWith('github.com/')) {
        // Not a valid GitHub URL pattern
        notFound();
    }

    // Extract owner and repo from github.com/owner/repo/...
    const pathAfterGithub = cleanPath.replace('github.com/', '');
    const segments = pathAfterGithub.split('/').filter(Boolean);

    // We need at least owner and repo
    if (segments.length < 2) {
        notFound();
    }

    const owner = segments[0];
    const repo = segments[1];

    // Validate owner and repo (basic validation)
    if (!owner || !repo || owner.length === 0 || repo.length === 0) {
        notFound();
    }

    // Construct the slug in the format expected by /repos/[slug]
    const slug = `${owner}--${repo}`;

    // Redirect to the repository analysis page
    redirect(`/repos/${slug}`);
}
