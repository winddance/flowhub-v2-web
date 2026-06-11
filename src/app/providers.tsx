import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { queryClient } from './queryClient';
import { AuthProvider } from '@/platform/auth/AuthProvider';
import { TenantProvider } from '@/platform/tenancy/TenantProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>{children}</TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
