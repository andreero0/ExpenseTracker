/**
 * React Query Configuration
 * Configures React Query for server state management
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Default options for React Query
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Stale time: How long until data is considered stale (5 minutes)
    staleTime: 1000 * 60 * 5,

    // Cache time: How long to keep unused data in cache (10 minutes)
    gcTime: 1000 * 60 * 10,

    // Retry failed requests 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus (useful for keeping data fresh)
    refetchOnWindowFocus: true,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Don't refetch on mount if data is fresh
    refetchOnMount: false,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
    retryDelay: 1000,
  },
};

/**
 * Create React Query Client
 */
export const queryClient = new QueryClient({
  defaultOptions,
});

/**
 * Query Keys
 * Centralized query keys for type safety and consistency
 */
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },

  // User
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
    preferences: ['user', 'preferences'] as const,
  },

  // Transactions (example)
  transactions: {
    all: ['transactions'] as const,
    list: (userId: string) => ['transactions', 'list', userId] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
    summary: (userId: string) => ['transactions', 'summary', userId] as const,
  },

  // Add more query keys as needed
} as const;

/**
 * Common query/mutation error handler
 */
export const handleQueryError = (error: any) => {
  console.error('Query error:', error);

  // You can add global error handling here
  // For example, show a toast notification

  return error;
};

export default queryClient;
