import { PrismaClient } from '@prisma/client';
import { githubAPI } from './github-api';

const prisma = new PrismaClient();

interface SyncJob {
  id: string;
  type: 'repository' | 'user';
  owner?: string;
  repo?: string;
  username?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

class SyncService {
  private syncQueue: SyncJob[] = [];
  private isProcessing = false;

  async addRepositorySync(owner: string, repo: string): Promise<string> {
    const jobId = `repo_${Date.now()}_${owner}_${repo}`;
    
    this.syncQueue.push({
      id: jobId,
      type: 'repository',
      owner,
      repo,
      status: 'pending',
      createdAt: new Date(),
    });

    this.processQueue();
    return jobId;
  }

  async addUserSync(username: string): Promise<string> {
    const jobId = `user_${Date.now()}_${username}`;
    
    this.syncQueue.push({
      id: jobId,
      type: 'user',
      username,
      status: 'pending',
      createdAt: new Date(),
    });

    this.processQueue();
    return jobId;
  }

  async getSyncStatus(jobId: string): Promise<SyncJob | null> {
    return this.syncQueue.find(job => job.id === jobId) || null;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.syncQueue.length > 0) {
      const job = this.syncQueue[0];
      
      if (job.status === 'pending') {
        job.status = 'running';
        
        try {
          if (job.type === 'repository' && job.owner && job.repo) {
            await githubAPI.syncRepository(job.owner, job.repo);
          } else if (job.type === 'user' && job.username) {
            await githubAPI.syncUser(job.username);
          }
          
          job.status = 'completed';
          job.completedAt = new Date();
        } catch (error) {
          job.status = 'failed';
          job.error = error instanceof Error ? error.message : 'Unknown error';
          job.completedAt = new Date();
        }
      }

      // Remove completed jobs from queue after 5 minutes
      if (job.status === 'completed' && job.completedAt) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (job.completedAt < fiveMinutesAgo) {
          this.syncQueue.shift();
        }
      } else if (job.status === 'failed' && job.completedAt) {
        // Remove failed jobs after 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (job.completedAt < oneHourAgo) {
          this.syncQueue.shift();
        }
      } else {
        this.syncQueue.shift();
      }
    }

    this.isProcessing = false;
  }

  // Auto-sync popular repositories
  async syncPopularRepositories(): Promise<void> {
    try {
      const popularRepos = [
        { owner: 'facebook', repo: 'react' },
        { owner: 'microsoft', repo: 'vscode' },
        { owner: 'vercel', repo: 'next.js' },
        { owner: 'vuejs', repo: 'vue' },
        { owner: 'angular', repo: 'angular' },
        { owner: 'tensorflow', repo: 'tensorflow' },
        { owner: 'pytorch', repo: 'pytorch' },
        { owner: 'rust-lang', repo: 'rust' },
        { owner: 'go', repo: 'go' },
        { owner: 'nodejs', repo: 'node' },
      ];

      for (const { owner, repo } of popularRepos) {
        try {
          await this.addRepositorySync(owner, repo);
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error syncing ${owner}/${repo}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in syncPopularRepositories:', error);
    }
  }

  // Sync repositories that haven't been updated recently
  async syncStaleRepositories(): Promise<void> {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const staleRepos = await prisma.repository.findMany({
        where: {
          OR: [
            { updatedAt: { lt: threeDaysAgo } },
            { healthScore: { lt: 50 } },
          ],
        },
        orderBy: { updatedAt: 'asc' },
        take: 20, // Limit to 20 repos per run
      });

      for (const repo of staleRepos) {
        try {
          const [owner, repoName] = repo.fullName.split('/');
          await this.addRepositorySync(owner, repoName);
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error syncing stale repo ${repo.fullName}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in syncStaleRepositories:', error);
    }
  }

  // Sync users who haven't been updated recently
  async syncStaleUsers(): Promise<void> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const staleUsers = await prisma.user.findMany({
        where: {
          lastGitHubSync: { lt: sevenDaysAgo },
          githubUsername: { not: null },
        },
        orderBy: { lastGitHubSync: 'asc' },
        take: 50, // Limit to 50 users per run
      });

      for (const user of staleUsers) {
        try {
          if (user.githubUsername) {
            await this.addUserSync(user.githubUsername);
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Error syncing stale user ${user.githubUsername}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in syncStaleUsers:', error);
    }
  }

  // Get sync statistics
  async getSyncStats(): Promise<{
    totalRepos: number;
    activeRepos: number;
    totalUsers: number;
    activeUsers: number;
    lastSyncTime: Date | null;
    pendingJobs: number;
    runningJobs: number;
    failedJobs: number;
  }> {
    try {
      const [
        totalRepos,
        activeRepos,
        totalUsers,
        activeUsers,
        lastSyncTime,
        pendingJobs,
        runningJobs,
        failedJobs,
      ] = await Promise.all([
        prisma.repository.count(),
        prisma.repository.count({ where: { isActive: true } }),
        prisma.user.count(),
        prisma.user.count({ where: { lastGitHubSync: { not: null } } }),
        prisma.repository.findFirst({ orderBy: { updatedAt: 'desc' } }),
        this.syncQueue.filter(job => job.status === 'pending').length,
        this.syncQueue.filter(job => job.status === 'running').length,
        this.syncQueue.filter(job => job.status === 'failed').length,
      ]);

      return {
        totalRepos,
        activeRepos,
        totalUsers,
        activeUsers,
        lastSyncTime: lastSyncTime?.updatedAt || null,
        pendingJobs,
        runningJobs,
        failedJobs,
      };
    } catch (error) {
      console.error('Error getting sync stats:', error);
      return {
        totalRepos: 0,
        activeRepos: 0,
        totalUsers: 0,
        activeUsers: 0,
        lastSyncTime: null,
        pendingJobs: 0,
        runningJobs: 0,
        failedJobs: 0,
      };
    }
  }
}

export const syncService = new SyncService();
export default SyncService;
