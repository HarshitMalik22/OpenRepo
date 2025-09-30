// GitHub API headers utility - can be used on both client and server

/**
 * Get GitHub API headers with authentication if available (SERVER-SIDE ONLY)
 * This function can only be used on the server side where process.env is available
 */
export function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
  };
  
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
    headers['X-GitHub-Api-Version'] = '2022-11-28';
  }
  
  return headers;
}

/**
 * Get GitHub API headers for client-side use
 * This function returns basic headers without authentication
 * Client-side GitHub API calls should go through API endpoints
 */
export function getClientGitHubHeaders(): Record<string, string> {
  return {
    'Accept': 'application/vnd.github+json',
  };
}

/**
 * Check if GitHub token is configured (synchronous version - SERVER-SIDE ONLY)
 */
export function isGitHubConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN;
}

/**
 * Check if we're running on the server side
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get appropriate GitHub headers based on the current context
 * Returns server headers with auth if on server, client headers if on client
 */
export function getGitHubHeadersForContext(): Record<string, string> {
  if (isServerSide()) {
    return getGitHubHeaders();
  }
  return getClientGitHubHeaders();
}
