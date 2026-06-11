import { expect, test } from '@playwright/test';

test('login page renders', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /sign in to flowhub/i })).toBeVisible();
});

// Enable after API server and seeded user are running.
test.skip('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@flowhub.local');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
