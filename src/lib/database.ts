import { prisma, ensureUser, getUserWithPreferences } from './prisma';
import type { Repository, UserPreferences, RepositoryFilters } from './types';
import { enhanceRepository } from './recommendation-engine';
import { githubLiveService } from './github-live';

// User management
export async function createOrUpdateUser(clerkUser: any) {
  return await ensureUser(clerkUser);
}

export async function getUserPreferencesFromDB(clerkId: string) {
  const user = await getUserWithPreferences(clerkId);
  return user?.preferences;
}

export async function saveUserPreferencesToDB(clerkId: string, preferences: UserPreferences) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: {
      techStack: preferences.techStack,
      goal: preferences.goal,
      experienceLevel: preferences.experienceLevel,
      completed: preferences.completed || false,
    },
    create: {
      userId: user.id,
      techStack: preferences.techStack,
      goal: preferences.goal,
      experienceLevel: preferences.experienceLevel,
      completed: preferences.completed || false,
    }
  });
}

// Repository management - now uses live data
export async function saveRepositoryAnalysis(
  clerkId: string,
  repoFullName: string,
  analysis: {
    flowchartMermaid: string;
    explanation: any;
    resources: any;
  }
) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // First, ensure the repository exists
  const repo = await prisma.repository.upsert({
    where: { fullName: repoFullName },
    update: {},
    create: {
      fullName: repoFullName,
      name: repoFullName.split('/')[1],
      owner: repoFullName.split('/')[0]
    }
  });

  return await prisma.aiAnalysis.create({
    data: {
      userId: user.id,
      repositoryFullName: repoFullName,
      analysisType: 'explanation',
      content: {
        flowchartMermaid: analysis.flowchartMermaid,
        explanation: analysis.explanation,
        resources: analysis.resources
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  });
}

export async function getRepositoryAnalysis(clerkId: string, repoFullName: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    return null;
  }

  return await prisma.aiAnalysis.findFirst({
    where: {
      userId: user.id,
      repositoryFullName: repoFullName
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function saveRepository(clerkId: string, repository: Repository) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.savedRepository.upsert({
    where: {
      userId_repoFullName: {
        userId: user.id,
        repoFullName: repository.full_name
      }
    },
    update: {
      repoName: repository.name,
      repoUrl: repository.html_url,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      tags: repository.topics,
    },
    create: {
      userId: user.id,
      repoFullName: repository.full_name,
      repoName: repository.name,
      repoUrl: repository.html_url,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      tags: repository.topics,
    }
  });
}

export async function getSavedRepositories(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      savedRepos: {
        orderBy: { savedAt: 'desc' }
      }
    }
  });

  return user?.savedRepos || [];
}

export async function removeSavedRepository(clerkId: string, repoFullName: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.savedRepository.delete({
    where: {
      userId_repoFullName: {
        userId: user.id,
        repoFullName
      }
    }
  });
}

// Repository reference management for faster lookups
export async function upsertRepositoryReference(repository: Repository) {
  return await prisma.repositoryReference.upsert({
    where: { fullName: repository.full_name },
    update: {
      name: repository.name,
      owner: typeof repository.owner === 'string' ? repository.owner : repository.owner.login,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      tags: repository.topics,
      updatedAt: new Date()
    },
    create: {
      fullName: repository.full_name,
      name: repository.name,
      owner: typeof repository.owner === 'string' ? repository.owner : repository.owner.login,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      tags: repository.topics
    }
  });
}

export async function getRepositoryReference(fullName: string) {
  return await prisma.repositoryReference.findUnique({
    where: { fullName }
  });
}

// User interactions
export async function trackUserInteraction(
  clerkId: string,
  repoFullName: string,
  type: 'view' | 'like' | 'dislike' | 'contribute' | 'analyze' | 'search' | 'filter',
  score?: number,
  metadata?: any,
  duration_ms?: number,
  source_page?: string
) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // First, ensure the repository exists
  const repo = await prisma.repository.upsert({
    where: { fullName: repoFullName },
    update: {},
    create: {
      fullName: repoFullName,
      name: repoFullName.split('/')[1],
      owner: repoFullName.split('/')[0]
    }
  });

  return await prisma.userInteraction.create({
    data: {
      userId: user.id,
      repositoryFullName: repoFullName,
      type,
      score,
      metadata,
      timestamp: new Date(),
      session_id: metadata?.session_id,
      duration_ms,
      source_page
    }
  });
}

export async function getUserInteractions(clerkId: string, limit: number = 50) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    return [];
  }

  return await prisma.userInteraction.findMany({
    where: { userId: user.id },
    orderBy: {
      timestamp: 'desc'
    },
    take: limit
  });
}

// Community stats
export async function updateCommunityStats() {
  const stats = await prisma.communityStats.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if we already have stats for today
  if (stats && stats.date >= today) {
    return stats;
  }

  // Calculate new stats
  const totalUsers = await prisma.user.count();
  const totalInteractions = await prisma.userInteraction.count();
  const totalAnalyses = await prisma.repositoryAnalysis.count();
  const totalSavedRepos = await prisma.savedRepository.count();

  // Calculate average satisfaction from user interactions with scores
  const satisfactionData = await prisma.userInteraction.aggregate({
    where: {
      score: { not: null }
    },
    _avg: {
      score: true
    }
  });

  return await prisma.communityStats.create({
    data: {
      totalQueries: totalInteractions,
      totalUsers,
      activeRepositories: totalSavedRepos,
      successfulContributions: totalAnalyses,
      averageSatisfaction: satisfactionData._avg.score || 4.2,
      date: today,
    }
  });
}

// Repository caching
export async function cachePopularRepository(repository: Repository) {
  const enhanced = enhanceRepository(repository);
  
  return await prisma.popularRepository.upsert({
    where: { fullName: repository.full_name },
    update: {
      name: repository.name,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      openIssues: repository.open_issues_count,
      topics: repository.topics,
      competitionLevel: enhanced.competition_level,
      activityLevel: enhanced.activity_level,
      aiDomain: enhanced.ai_domain,
      difficultyLevel: enhanced.contribution_difficulty.level,
      difficultyScore: enhanced.contribution_difficulty.score,
      contributorCount: enhanced.contributor_count,
      recentCommits: enhanced.recent_commits,
      issueResponseRate: enhanced.issue_response_rate,
      documentationScore: enhanced.documentation_score,
      lastFetched: new Date(),
    },
    create: {
      fullName: repository.full_name,
      name: repository.name,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      openIssues: repository.open_issues_count,
      topics: repository.topics,
      competitionLevel: enhanced.competition_level,
      activityLevel: enhanced.activity_level,
      aiDomain: enhanced.ai_domain,
      difficultyLevel: enhanced.contribution_difficulty.level,
      difficultyScore: enhanced.contribution_difficulty.score,
      contributorCount: enhanced.contributor_count,
      recentCommits: enhanced.recent_commits,
      issueResponseRate: enhanced.issue_response_rate,
      documentationScore: enhanced.documentation_score,
      lastFetched: new Date(),
    }
  });
}

export async function getCachedPopularRepositories(): Promise<Repository[]> {
  const cached = await prisma.popularRepository.findMany({
    where: {
      lastFetched: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    orderBy: { stars: 'desc' }
  });

  return cached.map(repo => ({
    id: Math.abs(repo.fullName.split('').reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0)),
    name: repo.name,
    full_name: repo.fullName,
    owner: {
      login: repo.fullName.split('/')[0],
      avatar_url: `https://github.com/${repo.fullName.split('/')[0]}.png`
    },
    html_url: `https://github.com/${repo.fullName}`,
    description: repo.description,
    stargazers_count: repo.stars,
    watchers_count: repo.stars,
    forks_count: repo.forks,
    open_issues_count: repo.openIssues,
    language: repo.language,
    topics: repo.topics,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    competition_level: repo.competitionLevel as any,
    activity_level: repo.activityLevel as any,
    ai_domain: repo.aiDomain as any,
    contribution_difficulty: {
      level: repo.difficultyLevel as any,
      score: repo.difficultyScore,
      factors: {
        codeComplexity: repo.difficultyScore * 0.8,
        communitySize: repo.stars / 1000,
        documentationQuality: repo.documentationScore,
        issueResolutionTime: repo.issueResponseRate,
      },
      goodFirstIssues: Math.floor(repo.openIssues * 0.1),
      helpWantedIssues: Math.floor(repo.openIssues * 0.15),
    },
    last_analyzed: repo.lastFetched.toISOString(),
    contributor_count: repo.contributorCount,
    recent_commits: repo.recentCommits,
    issue_response_rate: repo.issueResponseRate,
    documentation_score: repo.documentationScore,
  }));
}