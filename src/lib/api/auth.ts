import { apiFetch, API_BASE_URL, csrfCookie } from './http';
import { ApiResource, CurrentUserPayload } from '@/types/api';

export type LoginInput = {
  email: string;
  password: string;
  remember?: boolean;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  workspace_name: string;
};

export class TwoFactorRequiredError extends Error {
  constructor() {
    super('Two-factor authentication is required.');
  }
}

type TwoFactorRequiredPayload = {
  two_factor: true;
  message: string;
};

export async function login(input: LoginInput): Promise<CurrentUserPayload> {
  await csrfCookie();
  const response = await apiFetch<ApiResource<CurrentUserPayload> | TwoFactorRequiredPayload>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if ('two_factor' in response) {
    throw new TwoFactorRequiredError();
  }

  return response.data;
}

export async function submitTwoFactorChallenge(input: { code?: string; recovery_code?: string }): Promise<CurrentUserPayload> {
  await csrfCookie();
  const response = await apiFetch<ApiResource<CurrentUserPayload>>('/api/v1/auth/two-factor-challenge', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function requestMagicLink(input: { email: string; redirect?: string }): Promise<{ message: string }> {
  await csrfCookie();
  return apiFetch<{ message: string }>('/api/v1/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput): Promise<CurrentUserPayload> {
  await csrfCookie();
  const response = await apiFetch<ApiResource<CurrentUserPayload>>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiFetch('/api/v1/auth/logout', { method: 'POST' });
}

export async function fetchCurrentUser(): Promise<CurrentUserPayload> {
  const response = await apiFetch<ApiResource<CurrentUserPayload>>('/api/v1/me');
  return response.data;
}

export function googleOAuthUrl(redirectPath = '/app/dashboard'): string {
  const params = new URLSearchParams({ redirect: redirectPath });
  return `${API_BASE_URL}/api/v1/auth/google/redirect?${params.toString()}`;
}

export function redirectToGoogleOAuth(redirectPath = '/app/dashboard'): void {
  window.location.assign(googleOAuthUrl(redirectPath));
}
