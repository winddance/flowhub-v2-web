import { useQuery } from '@tanstack/react-query';
import { fetchNavigation } from '@/lib/api/workspaces';
import { useTenant } from '@/platform/tenancy/TenantProvider';

export function useNavigation() {
  const { activeWorkspace } = useTenant();

  return useQuery({
    queryKey: ['navigation', activeWorkspace?.id],
    queryFn: () => fetchNavigation(activeWorkspace!.id),
    enabled: Boolean(activeWorkspace?.id),
  });
}
