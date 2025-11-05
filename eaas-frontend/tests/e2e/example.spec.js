import { test, expect } from './fixtures.js';

// Example test to verify setup
test.describe('Example Test - Verify Setup', () => {
  test('Frontend is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Should see homepage content
    await expect(page.locator('body')).toBeVisible();
    
    // Should see login or sign up button
    const loginLink = page.locator('text=/login|sign.*up/i').first();
    await expect(loginLink).toBeVisible({ timeout: 5000 });
  });
});

