// A simple cache to avoid hitting the API rate limit during development.
// This should be replaced with a more robust caching strategy in a real app.
let repoCache: any[] | null = null;
let repoDetailCache = new Map<string, any>();

// Fetches a list of popular repositories from the GitHub API.
// To avoid rate limits, it uses a simple in-memory cache.
export async function getPopularRepos(useCache = true) {
  if (useCache && repoCache) {
    return repoCache;
  }

  try {
    const response = await fetch('https://api.github.com/search/repositories?q=stars:>20000&sort=stars&order=desc&per_page=30', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Uncomment and add your GitHub token to the .env file to increase rate limits
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      next: {
        // Revalidate the data every hour
        revalidate: 3600,
      }
    });

    if (!response.ok) {
      console.error('GitHub API response not OK:', await response.text());
      return [];
    }
    
    const data = await response.json();
    repoCache = data.items;
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch popular repos:', error);
    return [];
  }
}

// Fetches details for a single repository from the GitHub API.
// To avoid rate limits, it uses a simple in-memory cache.
export async function getRepo(fullName: string, useCache = true) {
  if (useCache && repoDetailCache.has(fullName)) {
    return repoDetailCache.get(fullName);
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      next: {
        revalidate: 3600,
      }
    });

     if (!response.ok) {
      console.error(`GitHub API response not OK for ${fullName}:`, await response.text());
      return null;
    }

    const data = await response.json();
    repoDetailCache.set(fullName, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch repo ${fullName}:`, error);
    return null;
  }
}
