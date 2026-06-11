import { expect, test } from '@playwright/test';

test('login page exposes google oauth entry point', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
});

test('register page exposes google oauth entry point', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
});

test('google oauth callback page renders pending state', async ({ page }) => {
  await page.route('**/api/v1/me', async (route) => {
    await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Unauthenticated.' }) });
  });

  await page.goto('/oauth/google/callback?error=oauth_failed');
  await expect(page.getByRole('heading', { name: /google sign-in failed/i })).toBeVisible();
});
