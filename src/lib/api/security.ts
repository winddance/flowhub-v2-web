import { apiFetch, csrfCookie } from './http';
import { ApiResource, SecurityPayload } from '@/types/api';

export async function fetchSecurity(): Promise<SecurityPayload> {
  const response = await apiFetch<ApiResource<SecurityPayload>>('/api/v1/security');
  return response.data;
}

export async function enableTwoFactor(): Promise<void> {
  await csrfCookie();
  await apiFetch('/user/two-factor-authentication', { method: 'POST' });
}

export async function fetchTwoFactorQrCode(): Promise<{ svg: string }> {
  return apiFetch<{ svg: string }>('/user/two-factor-qr-code');
}

export async function confirmTwoFactor(code: string): Promise<void> {
  await csrfCookie();
  await apiFetch('/user/confirmed-two-factor-authentication', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function fetchRecoveryCodes(): Promise<string[]> {
  return apiFetch<string[]>('/user/two-factor-recovery-codes');
}

export async function regenerateRecoveryCodes(): Promise<void> {
  await csrfCookie();
  await apiFetch('/user/two-factor-recovery-codes', { method: 'POST' });
}

export async function disableTwoFactor(): Promise<void> {
  await csrfCookie();
  await apiFetch('/user/two-factor-authentication', { method: 'DELETE' });
}

export async function deletePasskey(id: string): Promise<void> {
  await csrfCookie();
  await apiFetch(`/user/passkeys/${id}`, { method: 'DELETE' });
}
