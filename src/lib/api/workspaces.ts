import { apiFetch } from './http';
import { ApiCollection, ApiResource, CurrentUserPayload, NavigationPayload, WorkspaceSummary } from '@/types/api';

export async function fetchWorkspaces(): Promise<WorkspaceSummary[]> {
  const response = await apiFetch<ApiCollection<WorkspaceSummary>>('/api/v1/workspaces');
  return response.data;
}

export async function createWorkspace(name: string): Promise<CurrentUserPayload> {
  const response = await apiFetch<ApiResource<CurrentUserPayload>>('/api/v1/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return response.data;
}

export async function switchWorkspace(workspaceId: string): Promise<CurrentUserPayload> {
  const response = await apiFetch<ApiResource<CurrentUserPayload>>(`/api/v1/workspaces/${workspaceId}/switch`, {
    method: 'POST',
  });
  return response.data;
}

export async function fetchNavigation(workspaceId: string): Promise<NavigationPayload> {
  return apiFetch<NavigationPayload>('/api/v1/navigation', {
    workspaceId,
  });
}
