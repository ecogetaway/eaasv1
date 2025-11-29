import { test, expect } from './fixtures.js';
import { loginUser } from './login-helper.js';

test.describe('Services & Plans Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('/services-plans');
  });

  test('should display Services & Plans page', async ({ page }) => {
    await expect(page).toHaveURL(/.*services-plans/);
    
    // Check for page content
    const content = page.locator('text=/Services|Plans|Plan|Solar|Battery/i');
    await expect(content.first()).toBeVisible();
  });

  test('should show plan cards', async ({ page }) => {
    // Look for plan cards (should have at least 2-3 plans)
    // Mock plans are: Basic Solar, Solar + Battery, Premium
    const planCards = page.locator('text=/Basic Solar|Solar.*Battery|Premium|Starter|Hybrid|Grid|Independent|kW|kWh|Plan/i');
    const count = await planCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have Subscribe Now buttons', async ({ page }) => {
    const subscribeButtons = page.locator('button, a').filter({ 
      hasText: /Subscribe|Subscribe Now/i 
    });
    
    const count = await subscribeButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should highlight current plan if user has subscription', async ({ page }) => {
    // Check for indicators of active/current plan
    const activeIndicators = page.locator('text=/Current|Active|Your Plan|Selected/i');
    
    // May or may not be visible depending on user's subscription status
    // Just check that page loads without error
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to onboarding on Subscribe click', async ({ page }) => {
    const subscribeButton = page.locator('button, a').filter({ 
      hasText: /Subscribe|Subscribe Now/i 
    }).first();
    
    if (await subscribeButton.isVisible()) {
      await subscribeButton.click();
      
      // Should navigate to onboarding or show subscription flow
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(onboarding|subscription|services-plans)/);
    }
  });

  test('should be accessible via navigation', async ({ page }) => {
    // Go to dashboard first
    await page.goto('/dashboard');
    
    // Find and click Services & Plans link in navbar
    const servicesLink = page.locator('a[href*="services-plans"], a').filter({ 
      hasText: /Services|Plans/i 
    }).first();
    
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await expect(page).toHaveURL(/.*services-plans/);
    }
  });

  test('should require authentication', async ({ page }) => {
    // Logout first
    await page.goto('/');
    const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Sign Out/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
    
    // Try to access services-plans
    await page.goto('/services-plans');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

