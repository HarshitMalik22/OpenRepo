import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time)
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

// Query key factory
export const queryKeys = {
  repositories: {
    all: ['repositories'] as const,
    lists: () => [...queryKeys.repositories.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.repositories.lists(), filters] as const,
    details: () => [...queryKeys.repositories.all, 'detail'] as const,
    detail: (fullName: string) => [...queryKeys.repositories.details(), fullName] as const,
  },
  user: {
    all: ['user'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
    savedRepos: () => [...queryKeys.user.all, 'saved-repos'] as const,
  },
} as const;
