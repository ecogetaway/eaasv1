import { test, expect } from './fixtures.js';

test.describe('Authentication Flow - Detailed', () => {
  test('Complete registration flow', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);

    // 2. Click "Sign Up" button
    const signUpButton = page.locator('text=/sign.*up|register/i').first();
    await signUpButton.click();
    await expect(page).toHaveURL(/.*register/);

    // 3. Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="password"]', 'Test@123');
    
    // Handle confirm password if it exists
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]').first();
    if (await confirmPasswordInput.isVisible({ timeout: 2000 })) {
      await confirmPasswordInput.fill('Test@123');
    }

    // Handle address field if it exists
    const addressInput = page.locator('input[name="address"], textarea[name="address"]').first();
    if (await addressInput.isVisible({ timeout: 2000 })) {
      await addressInput.fill('123 Test Street');
    }

    // 4. Submit form
    await page.click('button[type="submit"]');

    // 5. Verify redirect to dashboard (or onboarding)
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 });
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard|onboarding)/);

    // 6. Verify user is logged in
    // Check for user name in navbar or logout button
    const userIndicator = page.locator('text=/test.*user|logout/i').first();
    await expect(userIndicator).toBeVisible({ timeout: 10000 });

    // 7. Take screenshot
    await page.screenshot({ path: 'test-results/auth-registration-success.png', fullPage: true });
  });

  test('Login flow with demo user', async ({ page }) => {
    // Start from dashboard if already logged in, or from home
    await page.goto('/');
    
    // If already logged in, logout first
    const logoutButton = page.locator('text=/logout/i').first();
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      await page.waitForURL(/.*login/, { timeout: 5000 });
    }

    // 1. Click "Login"
    const loginButton = page.locator('text=/login/i').first();
    await loginButton.click();
    await expect(page).toHaveURL(/.*login/);

    // 2. Enter email: demo1@eaas.com
    await page.fill('input[type="email"]', 'demo1@eaas.com');

    // 3. Enter password: Demo@123
    await page.fill('input[type="password"]', 'Demo@123');

    // 4. Submit
    await page.click('button[type="submit"]');

    // 5. Verify dashboard loads
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL('/dashboard');

    // Verify dashboard content is visible
    const dashboardContent = page.locator('text=/dashboard|energy|solar/i').first();
    await expect(dashboardContent).toBeVisible({ timeout: 10000 });

    // Take screenshot
    await page.screenshot({ path: 'test-results/auth-login-success.png', fullPage: true });
  });
});


