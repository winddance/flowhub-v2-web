import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  fetchCurrentUser,
  login,
  logout,
  register,
  submitTwoFactorChallenge,
  LoginInput,
  RegisterInput,
} from '@/lib/api/auth';
import { CurrentUserPayload } from '@/types/api';

const AuthContext = createContext<{
  current: CurrentUserPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<CurrentUserPayload>;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  completeTwoFactorChallenge: (input: { code?: string; recovery_code?: string }) => Promise<void>;
  signOut: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const value = useMemo(() => ({
    current: meQuery.data ?? null,
    isAuthenticated: Boolean(meQuery.data),
    isLoading: meQuery.isLoading,
    refresh: async () => {
      const current = await queryClient.fetchQuery({
        queryKey: ['me'],
        queryFn: fetchCurrentUser,
      });
      queryClient.setQueryData(['me'], current);
      return current;
    },
    signIn: async (input: LoginInput) => {
      const current = await login(input);
      queryClient.setQueryData(['me'], current);
    },
    signUp: async (input: RegisterInput) => {
      const current = await register(input);
      queryClient.setQueryData(['me'], current);
    },
    completeTwoFactorChallenge: async (input: { code?: string; recovery_code?: string }) => {
      const current = await submitTwoFactorChallenge(input);
      queryClient.setQueryData(['me'], current);
    },
    signOut: async () => {
      await logout();
      queryClient.clear();
    },
  }), [meQuery.data, meQuery.isLoading, queryClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
