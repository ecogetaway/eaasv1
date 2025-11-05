import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';

test.describe('Profile Management', () => {
  test('Update personal information', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/profile');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Should see profile form
    await expect(page.locator('text=/profile|personal.*information/i').first()).toBeVisible({ timeout: 5000 });

    // Update name
    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.isVisible({ timeout: 5000 })) {
      await nameInput.clear();
      await nameInput.fill('Updated Test Name');
    }

    // Update phone
    const phoneInput = page.locator('input[name="phone"]').first();
    if (await phoneInput.isVisible({ timeout: 2000 })) {
      await phoneInput.clear();
      await phoneInput.fill('9876543210');
    }

    // Update address
    const addressInput = page.locator('textarea[name="address"], input[name="address"]').first();
    if (await addressInput.isVisible({ timeout: 2000 })) {
      await addressInput.clear();
      await addressInput.fill('Updated Test Address, Test City');
    }

    // Save changes
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();

    // Should see success message
    await page.waitForTimeout(2000);
    const successMessage = page.locator('text=/success|updated|saved/i');
    await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('Change password', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/profile');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find password section
    const passwordSection = page.locator('text=/change.*password|password/i').first();
    await expect(passwordSection).toBeVisible({ timeout: 5000 });

    // Fill password fields
    const currentPasswordInput = page.locator('input[name="currentPassword"], input[type="password"]').first();
    if (await currentPasswordInput.isVisible({ timeout: 5000 })) {
      await currentPasswordInput.fill('Demo@123');
    }

    const newPasswordInputs = page.locator('input[type="password"]').all();
    const passwordInputs = await newPasswordInputs;
    
    if (passwordInputs.length >= 2) {
      await passwordInputs[1].fill('NewPassword@123');
      if (passwordInputs.length >= 3) {
        await passwordInputs[2].fill('NewPassword@123');
      }
    }

    // Submit password change
    const changePasswordButton = page.locator('button:has-text("Change Password"), button:has-text("Update Password")').first();
    if (await changePasswordButton.isVisible({ timeout: 2000 })) {
      await changePasswordButton.click();
      
      // Should see success message
      await page.waitForTimeout(2000);
      const successMessage = page.locator('text=/success|password.*changed/i');
      await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Update notification preferences', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/profile');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find notification preferences section
    const notificationSection = page.locator('text=/notification.*preferences|preferences/i').first();
    await expect(notificationSection).toBeVisible({ timeout: 5000 });

    // Toggle notification preferences
    const emailCheckbox = page.locator('input[type="checkbox"]').first();
    if (await emailCheckbox.isVisible({ timeout: 5000 })) {
      const isChecked = await emailCheckbox.isChecked();
      await emailCheckbox.setChecked(!isChecked);
      
      // Save preferences
      const saveButton = page.locator('button:has-text("Save Preferences"), button:has-text("Save")').first();
      if (await saveButton.isVisible({ timeout: 2000 })) {
        await saveButton.click();
        
        // Should see success message
        await page.waitForTimeout(2000);
        const successMessage = page.locator('text=/success|saved|updated/i');
        await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('View subscription details', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/profile');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Should see profile page
    await expect(page.locator('text=/profile|settings/i').first()).toBeVisible({ timeout: 5000 });

    // Navigate to subscription page
    const subscriptionLink = page.locator('a[href*="/subscription"], button:has-text("Subscription")').first();
    
    if (await subscriptionLink.isVisible({ timeout: 5000 })) {
      await subscriptionLink.click();
      await page.waitForURL(/\/subscription/, { timeout: 10000 });
      
      // Should see subscription details
      await expect(page.locator('text=/subscription|plan|current/i').first()).toBeVisible({ timeout: 5000 });
    } else {
      // Try direct navigation
      await page.goto('/subscription');
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Should see subscription details
      await expect(page.locator('text=/subscription|plan|current/i').first()).toBeVisible({ timeout: 5000 });
    }
  });
});

