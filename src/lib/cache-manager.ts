import { Redis } from '@upstash/redis'
/**
 * Smart Cache Manager for GitHub API Data
 * Implements intelligent caching with TTL and invalidation strategies
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  // Different TTLs for different data types
  repositoryBasic: number;     // Basic repo info (name, owner, description) - 1 hour
  repositoryStats: number;     // Stars, forks, issues count - 5 minutes
  repositoryActivity: number;  // Commits, PRs, recent activity - 2 minutes
  repositoryIssues: number;    // Issues list - 10 minutes
  repositoryHealth: number;    // Health score and metrics - 30 minutes
  searchResults: number;       // Search results - 15 minutes
}

interface CacheStats {
  memoryHits: number;
  memoryMisses: number;
  redisHits: number;
  redisMisses: number;
  totalRequests: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig = {
    repositoryBasic: 60 * 60 * 1000,     // 1 hour
    repositoryStats: 5 * 60 * 1000,      // 5 minutes
    repositoryActivity: 2 * 60 * 1000,   // 2 minutes
    repositoryIssues: 10 * 60 * 1000,    // 10 minutes
    repositoryHealth: 30 * 60 * 1000,    // 30 minutes
    searchResults: 15 * 60 * 1000,       // 15 minutes
  };

  // Generate cache key with context
  private generateKey(prefix: string, identifier: string, context?: string): string {
    const parts = [prefix, identifier];
    if (context) parts.push(context);
    return parts.join(':');
  }

  // Check if cache entry is valid
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Get cached data
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || !this.isValid(entry)) {
      if (entry) this.cache.delete(key); // Clean up expired entries
      return null;
    }
    return entry.data;
  }

  // Set cached data with TTL
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Repository-specific cache methods
  getRepositoryBasic(fullName: string) {
    return this.get(this.generateKey('repo-basic', fullName));
  }

  setRepositoryBasic(fullName: string, data: any) {
    this.set(this.generateKey('repo-basic', fullName), data, this.config.repositoryBasic);
  }

  getRepositoryStats(fullName: string) {
    return this.get(this.generateKey('repo-stats', fullName));
  }

  setRepositoryStats(fullName: string, data: any) {
    this.set(this.generateKey('repo-stats', fullName), data, this.config.repositoryStats);
  }

  getRepositoryActivity(fullName: string) {
    return this.get(this.generateKey('repo-activity', fullName));
  }

  setRepositoryActivity(fullName: string, data: any) {
    this.set(this.generateKey('repo-activity', fullName), data, this.config.repositoryActivity);
  }

  getRepositoryIssues(fullName: string, labels?: string) {
    const context = labels || 'all';
    return this.get(this.generateKey('repo-issues', fullName, context));
  }

  setRepositoryIssues(fullName: string, data: any, labels?: string) {
    const context = labels || 'all';
    this.set(this.generateKey('repo-issues', fullName, context), data, this.config.repositoryIssues);
  }

  getRepositoryHealth(fullName: string) {
    return this.get(this.generateKey('repo-health', fullName));
  }

  setRepositoryHealth(fullName: string, data: any) {
    this.set(this.generateKey('repo-health', fullName), data, this.config.repositoryHealth);
  }

  getSearchResults(query: string) {
    return this.get(this.generateKey('search', query));
  }

  setSearchResults(query: string, data: any) {
    this.set(this.generateKey('search', query), data, this.config.searchResults);
  }

  // Invalidate specific cache entries
  invalidateRepository(fullName: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(fullName)
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Invalidate all cache (for emergencies)
  invalidateAll(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach(entry => {
      if (this.isValid(entry)) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: validEntries / (validEntries + expiredEntries) || 0,
    };
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp >= entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Start periodic cleanup
  startPeriodicCleanup(intervalMs: number = 5 * 60 * 1000): NodeJS.Timeout {
    return setInterval(() => this.cleanup(), intervalMs);
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Export types for TypeScript
export type { CacheConfig };
