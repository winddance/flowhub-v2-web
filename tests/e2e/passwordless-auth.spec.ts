import { expect, test } from '@playwright/test';

test.describe('passwordless authentication UI', () => {
  test('shows passkey, Google, password, and magic-link sign-in methods', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: /sign in with passkey/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /email me a magic sign-in link/i })).toBeVisible();
  });

  test('can request a magic link without revealing account existence', async ({ page }) => {
    await page.route('**/sanctum/csrf-cookie', async (route) => route.fulfill({ status: 204 }));
    await page.route('**/api/v1/auth/magic-link', async (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'If the account exists, a sign-in link has been sent.' }),
    }));

    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@example.test');
    await page.getByRole('button', { name: /email me a magic sign-in link/i }).click();

    await expect(page.getByText(/if the account exists/i)).toBeVisible();
  });
});
