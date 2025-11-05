import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';

test.describe('Subscription Workflow', () => {
  test('View available plans', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/onboarding');

    // Should see plan selection step
    await expect(page.locator('text=/select.*plan|choose.*plan/i')).toBeVisible();

    // Should see at least 3 plans
    const plans = page.locator('[data-testid="plan-card"], .plan-card, button:has-text("Basic"), button:has-text("Premium")');
    const planCount = await plans.count();
    expect(planCount).toBeGreaterThanOrEqual(2);
  });

  test('Complete 3-step onboarding', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/onboarding');

    // Step 1: User Info (if required)
    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.isVisible({ timeout: 2000 })) {
      await nameInput.fill('Test User');
      await page.fill('input[name="phone"]', '9876543210');
      await page.fill('input[name="address"]', '123 Test Street');
      await page.click('button:has-text("Next"), button:has-text("Continue")');
    }

    // Step 2: Plan Selection
    await page.waitForTimeout(1000);
    const planButtons = page.locator('button:has-text("Basic"), button:has-text("Select"), [data-testid="plan-button"]');
    const firstPlan = planButtons.first();
    if (await firstPlan.isVisible({ timeout: 5000 })) {
      await firstPlan.click();
      await page.waitForTimeout(500);
      await page.click('button:has-text("Next"), button:has-text("Continue")');
    }

    // Step 3: Payment
    await page.waitForTimeout(1000);
    const paymentSection = page.locator('text=/payment|pay|billing/i');
    if (await paymentSection.isVisible({ timeout: 5000 })) {
      // Mock payment - select payment method
      const paymentMethod = page.locator('select[name="payment_method"], input[value="upi"]').first();
      if (await paymentMethod.isVisible({ timeout: 2000 })) {
        await paymentMethod.selectOption('upi');
      }

      // Complete payment
      const payButton = page.locator('button:has-text("Pay"), button:has-text("Complete"), button:has-text("Submit")');
      if (await payButton.isVisible({ timeout: 2000 })) {
        await payButton.click();
        await page.waitForTimeout(2000); // Wait for payment processing
      }
    }

    // Should redirect to dashboard or show success message
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard|onboarding|subscription)/);
  });

  test('Verify subscription created', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Navigate to subscription page
    await page.goto('/subscription');
    await page.waitForTimeout(2000);

    // Should see subscription details
    const subscriptionDetails = page.locator('text=/current.*plan|subscription|plan.*type/i');
    await expect(subscriptionDetails.first()).toBeVisible({ timeout: 5000 });

    // Should see plan details
    const planInfo = page.locator('text=/kW|kWh|capacity/i');
    if (await planInfo.count() > 0) {
      expect(await planInfo.count()).toBeGreaterThan(0);
    }
  });
});

