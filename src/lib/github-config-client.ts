// Client-side GitHub configuration utilities

export interface GitHubConfigStatus {
  isConfigured: boolean;
  hasToken: boolean;
  tokenPrefix?: string;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    reset: string;
  };
  warnings: string[];
}

/**
 * Get GitHub configuration status from the server
 */
export async function getGitHubConfigStatus(): Promise<GitHubConfigStatus> {
  try {
    const response = await fetch('/api/github/config-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get GitHub config status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get GitHub configuration');
    }

    return data.config;
  } catch (error) {
    console.error('Error fetching GitHub config status:', error);
    
    // Return a default error status
    return {
      isConfigured: false,
      hasToken: false,
      warnings: [error instanceof Error ? error.message : 'Failed to check GitHub configuration']
    };
  }
}

/**
 * Check if GitHub is properly configured for API calls
 */
export async function isGitHubConfigured(): Promise<boolean> {
  const config = await getGitHubConfigStatus();
  return config.isConfigured;
}

/**
 * Get GitHub configuration warnings
 */
export async function getGitHubWarnings(): Promise<string[]> {
  const config = await getGitHubConfigStatus();
  return config.warnings;
}
