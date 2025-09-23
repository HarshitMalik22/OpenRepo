// GitHub API configuration utilities

'use server';

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
 * Check GitHub API configuration status
 */
export async function getGitHubConfigStatus(): Promise<GitHubConfigStatus> {
  const warnings: string[] = [];
  let hasToken = false;
  let tokenPrefix = '';
  let rateLimitInfo;

  // Check if token is configured
  const token = process.env.GITHUB_TOKEN;
  hasToken = !!token;
  
  if (hasToken && token) {
    tokenPrefix = token.substring(0, 10) + '...';
  } else {
    warnings.push('GITHUB_TOKEN environment variable is not set. API requests will be unauthenticated and rate-limited.');
  }

  // Try to get rate limit info if token is available
  if (hasToken && token) {
    try {
      const response = await fetch('https://api.github.com/rate_limit', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        rateLimitInfo = {
          limit: data.rate.limit,
          remaining: data.rate.remaining,
          reset: new Date(data.rate.reset * 1000).toISOString()
        };

        // Warn if rate limit is low
        if (data.rate.remaining < 100) {
          warnings.push(`GitHub API rate limit is low (${data.rate.remaining} requests remaining). Reset at ${rateLimitInfo.reset}.`);
        }
      } else {
        warnings.push('Failed to fetch rate limit information. Token may be invalid.');
      }
    } catch (error) {
      warnings.push('Failed to check rate limit status.');
    }
  } else {
    // For unauthenticated requests, rate limit is typically 60 requests per hour
    warnings.push('Unauthenticated requests have a lower rate limit (60 requests/hour). Consider adding a GITHUB_TOKEN for higher limits (5000 requests/hour).');
  }

  return {
    isConfigured: hasToken,
    hasToken,
    tokenPrefix: hasToken ? tokenPrefix : undefined,
    rateLimitInfo,
    warnings
  };
}

/**
 * Validate GitHub token format
 */
export async function validateGitHubToken(token: string): Promise<{ isValid: boolean; error?: string }> {
  if (!token) {
    return { isValid: false, error: 'Token is required' };
  }

  // GitHub personal access tokens typically start with 'ghp_' for classic tokens
  // or are 40 characters for fine-grained tokens
  if (token.startsWith('ghp_')) {
    if (token.length < 40) {
      return { isValid: false, error: 'Token appears to be incomplete' };
    }
  } else if (token.length !== 40) {
    return { isValid: false, error: 'Token should be 40 characters long for fine-grained tokens' };
  }

  return { isValid: true };
}

/**
 * Log configuration status on startup
 */
export async function logGitHubConfigStatus(): Promise<void> {
  try {
    const status = await getGitHubConfigStatus();
    
    console.log('GitHub API Configuration Status:');
    console.log('- Token configured:', status.hasToken);
    if (status.hasToken && status.tokenPrefix) {
      console.log('- Token prefix:', status.tokenPrefix);
    }
    if (status.rateLimitInfo) {
      console.log('- Rate limit:', `${status.rateLimitInfo.remaining}/${status.rateLimitInfo.limit}`);
      console.log('- Rate limit reset:', status.rateLimitInfo.reset);
    }
    
    if (status.warnings.length > 0) {
      console.warn('GitHub API Configuration Warnings:');
      status.warnings.forEach(warning => console.warn('- ' + warning));
    }
  } catch (error) {
    console.error('Failed to check GitHub API configuration:', error);
  }
}
