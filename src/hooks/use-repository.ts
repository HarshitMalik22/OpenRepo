import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheManager } from '@/lib/cache-manager';
import { queryKeys } from '@/lib/react-query/config';

// API function that uses the enhanced cache
const fetchRepository = async (fullName: string) => {
  // Try cache first
  const cached = await cacheManager.getRepositoryBasic(fullName);
  if (cached) {
    return cached;
  }

  // Fetch from API if not in cache
  const response = await fetch(`/api/repositories/${encodeURIComponent(fullName)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch repository');
  }

  const data = await response.json();
  
  // Store in cache
  await cacheManager.setRepositoryBasic(fullName, data);
  
  return data;
};

export const useRepository = (fullName: string) => {
  return useQuery({
    queryKey: queryKeys.repositories.detail(fullName),
    queryFn: () => fetchRepository(fullName),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time)
    enabled: !!fullName,
  });
};

export const useInvalidateRepository = () => {
  const queryClient = useQueryClient();

  return {
    invalidateRepository: async (fullName: string) => {
      // Invalidate React Query cache
      await queryClient.invalidateQueries({ 
        queryKey: queryKeys.repositories.detail(fullName) 
      });
      
      // Invalidate enhanced cache
      await cacheManager.invalidateRepositoryCache(fullName);
    },
  };
};
