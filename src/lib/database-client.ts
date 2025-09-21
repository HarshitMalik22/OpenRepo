// Client-side versions of database functions that use API endpoints

export async function getRepositoryAnalysisClient(userId: string, repoFullName: string) {
  try {
    const response = await fetch(`/api/repositories/analysis?repoFullName=${encodeURIComponent(repoFullName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch repository analysis');
    }

    return data.analysis;
  } catch (error) {
    console.error('Error fetching repository analysis from client:', error);
    return null;
  }
}

export async function saveRepositoryAnalysisClient(userId: string, repoFullName: string, analysis: any) {
  try {
    const response = await fetch('/api/repositories/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoFullName, analysis }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to save repository analysis');
    }

    return data.result;
  } catch (error) {
    console.error('Error saving repository analysis from client:', error);
    return null;
  }
}

export async function trackUserInteractionClient(userId: string, repoFullName: string, action: string, metadata?: any) {
  try {
    const response = await fetch('/api/interactions/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoFullName, action, metadata }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to track user interaction');
    }

    return data.result;
  } catch (error) {
    console.error('Error tracking user interaction from client:', error);
    return null;
  }
}
