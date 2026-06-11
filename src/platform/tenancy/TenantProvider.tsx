import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { switchWorkspace } from '@/lib/api/workspaces';
import { useAuth } from '@/platform/auth/AuthProvider';
import { WorkspaceSummary } from '@/types/api';

const TenantContext = createContext<{
  activeWorkspace: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  switchToWorkspace: (workspaceId: string) => Promise<void>;
} | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { current } = useAuth();
  const queryClient = useQueryClient();

  const switchMutation = useMutation({
    mutationFn: switchWorkspace,
    onSuccess: (currentUser) => {
      queryClient.setQueryData(['me'], currentUser);
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
    },
  });

  const activeWorkspace = current?.activeWorkspace
    ? current.workspaces.find((workspace) => workspace.id === current.activeWorkspace?.id) ?? null
    : null;

  const value = useMemo(() => ({
    activeWorkspace,
    workspaces: current?.workspaces ?? [],
    switchToWorkspace: async (workspaceId: string) => {
      await switchMutation.mutateAsync(workspaceId);
    },
  }), [activeWorkspace, current?.workspaces, switchMutation]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
