import { diagramCache } from './diagram-cache';
import { getLatestCommitSha } from '@/ai/flows/dynamic-architecture-analysis';

export interface CacheValidationResult {
  isValid: boolean;
  shouldRegenerate: boolean;
  reason?: string;
  currentCommitSha?: string;
}

/**
 * Check if cached diagram is still valid for a repository
 */
export async function validateCachedDiagram(repoFullName: string): Promise<CacheValidationResult> {
  try {
    // Get current commit SHA
    const currentCommitSha = await getLatestCommitSha(
      repoFullName.split('/')[0],
      repoFullName.split('/')[1]
    );

    if (!currentCommitSha) {
      return {
        isValid: false,
        shouldRegenerate: false,
        reason: 'Could not fetch current commit SHA'
      };
    }

    // Check if repository has been updated since cache was generated
    const isUpdated = await diagramCache.isRepositoryUpdated(repoFullName, currentCommitSha);

    if (isUpdated) {
      // Invalidate the outdated cache
      await diagramCache.deleteCachedDiagram(repoFullName);
      
      return {
        isValid: false,
        shouldRegenerate: true,
        reason: 'Repository has been updated since cache was generated',
        currentCommitSha
      };
    }

    return {
      isValid: true,
      shouldRegenerate: false,
      reason: 'Cache is still valid',
      currentCommitSha
    };
  } catch (error) {
    console.error('Error validating cached diagram:', error);
    return {
      isValid: false,
      shouldRegenerate: false,
      reason: 'Error validating cache'
    };
  }
}

/**
 * Automatically invalidate cache if repository is updated
 * This can be called periodically or triggered by webhooks
 */
export async function autoInvalidateStaleCache(): Promise<{
  checked: number;
  invalidated: number;
  errors: number;
}> {
  try {
    // This would typically get all cached repositories from the database
    // For now, we'll implement a basic version
    
    // TODO: Implement bulk cache validation
    // For now, return placeholder
    return {
      checked: 0,
      invalidated: 0,
      errors: 0
    };
  } catch (error) {
    console.error('Error in auto cache invalidation:', error);
    return {
      checked: 0,
      invalidated: 0,
      errors: 1
    };
  }
}

/**
 * Manually trigger cache invalidation for a repository
 */
export async function manuallyInvalidateCache(repoFullName: string): Promise<boolean> {
  try {
    await diagramCache.deleteCachedDiagram(repoFullName);
    console.log(`✅ Manually invalidated cache for ${repoFullName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to manually invalidate cache for ${repoFullName}:`, error);
    return false;
  }
}
