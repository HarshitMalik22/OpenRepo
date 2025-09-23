// GitHub API headers utility - can be used on both client and server

/**
 * Get GitHub API headers with authentication if available
 */
export function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  return headers;
}

/**
 * Check if GitHub token is configured (synchronous version)
 */
export function isGitHubConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN;
}
