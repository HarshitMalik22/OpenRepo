import { diagramCache } from './diagram-cache';

export interface CacheValidationResult {
  isValid: boolean;
  reason: string;
}

/**
 * Validates if a cached diagram is still valid and usable
 */
export async function validateCachedDiagram(repoFullName: string): Promise<CacheValidationResult> {
  try {
    const cacheResult = await diagramCache.getCachedDiagram(repoFullName);
    
    if (cacheResult.found && cacheResult.data) {
      // Since Redis handles TTL automatically, if we found the data it's still valid
      // The cache has a 24-hour TTL set in Redis
      return {
        isValid: true,
        reason: 'Cache is valid (Redis TTL managed)'
      };
    } else {
      return {
        isValid: false,
        reason: 'No cached diagram found'
      };
    }
  } catch (error) {
    console.error('Error validating cached diagram:', error);
    return {
      isValid: false,
      reason: 'Error validating cache'
    };
  }
}
