import { expect, test } from '@playwright/test';

test.describe('security settings UI', () => {
  test('shows passkey and 2FA management panels for authenticated users', async ({ page }) => {
    await page.route('**/api/v1/me', async (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          user: {
            id: '1',
            name: 'Admin',
            email: 'admin@example.test',
            emailVerifiedAt: new Date().toISOString(),
            avatarUrl: null,
            authProviders: [],
            lastLoginAt: null,
            security: {
              hasPassword: true,
              twoFactorEnabled: false,
              passkeysCount: 0,
            },
          },
          activeWorkspace: { id: '1', name: 'Default Workspace', slug: 'default-workspace' },
          workspaces: [{ id: '1', name: 'Default Workspace', slug: 'default-workspace', role: 'owner', status: 'active' }],
        },
      }),
    }));

    await page.route('**/api/v1/security', async (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          hasPassword: true,
          twoFactorEnabled: false,
          twoFactorConfirmedAt: null,
          passkeys: [],
          passkeysCount: 0,
          authProviders: [],
        },
      }),
    }));

    await page.goto('/app/security');

    await expect(page.getByRole('heading', { name: /security/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /passkeys/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /authenticator app 2fa/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /passwordless email links/i })).toBeVisible();
  });
});
