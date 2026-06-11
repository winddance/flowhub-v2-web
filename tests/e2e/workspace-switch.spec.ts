import { expect, test } from '@playwright/test';

// Enable after API server and test workspace fixtures are running.
test.skip('user can switch workspaces', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@flowhub.local');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByLabel('Switch workspace')).toBeVisible();
});
