import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extract owner and repo name from GitHub URL
export function extractOwnerAndRepo(repoUrl: string): { owner: string; repo: string } | null {
  try {
    // Handle different GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\?#]+)/i,
      /github\.com\/([^\/]+)\/([^\/\?#]+)\.git/i
    ];
    
    for (const pattern of patterns) {
      const match = repoUrl.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2]
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to extract owner and repo from URL:', error);
    return null;
  }
}
