import { Passkeys } from '@laravel/passkeys';
import { API_BASE_URL } from '@/lib/api/http';

let configuredToken: string | null = null;

export const passkeyRoutes = {
  login: {
    options: `${API_BASE_URL}/passkeys/login/options`,
    submit: `${API_BASE_URL}/passkeys/login`,
  },
  register: {
    options: `${API_BASE_URL}/user/passkeys/options`,
    submit: `${API_BASE_URL}/user/passkeys`,
  },
  confirm: {
    options: `${API_BASE_URL}/passkeys/confirm/options`,
    submit: `${API_BASE_URL}/passkeys/confirm`,
  },
};

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift() ?? '');
  }
  return null;
}

export function configurePasskeys(): void {
  const xsrfToken = getCookie('XSRF-TOKEN');

  if (configuredToken === xsrfToken) {
    return;
  }

  Passkeys.configure({
    fetch: {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      },
    },
  });

  configuredToken = xsrfToken;
}

export { Passkeys };
