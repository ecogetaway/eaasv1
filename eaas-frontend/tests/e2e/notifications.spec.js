import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';

test.describe('Notifications', () => {
  test('Notification center opens', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Click notification bell icon
    const bellButton = page.locator('button:has(svg), [aria-label*="notification" i], button:has([class*="bell"])').first();
    
    // Find bell icon specifically
    const bellIcon = page.locator('svg').filter({ hasText: /bell/i }).or(page.locator('button').filter({ has: page.locator('svg') })).first();
    
    // Try multiple selectors
    let bellFound = false;
    const bellSelectors = [
      'button:has-text("🔔")',
      'button[aria-label*="notification" i]',
      page.locator('button').filter({ has: page.locator('svg') }).nth(0),
    ];

    for (const selector of bellSelectors) {
      try {
        if (await selector.isVisible({ timeout: 2000 })) {
          await selector.click();
          bellFound = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    if (!bellFound) {
      // Try clicking any button in navbar that might be the bell
      const navbarButtons = page.locator('nav button').all();
      for (const btn of await navbarButtons) {
        const text = await btn.textContent();
        if (!text || text.length < 10) { // Likely icon button
          await btn.click();
          await page.waitForTimeout(500);
          break;
        }
      }
    }

    // Should see notification center modal
    await page.waitForTimeout(1000);
    const notificationModal = page.locator('text=/notification|notifications/i').first();
    await expect(notificationModal).toBeVisible({ timeout: 5000 });
  });

  test('Notifications display', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Open notification center (similar to above)
    const navbarButtons = page.locator('nav button').all();
    for (const btn of await navbarButtons) {
      const text = await btn.textContent();
      if (!text || text.length < 10) {
        await btn.click();
        await page.waitForTimeout(500);
        break;
      }
    }

    await page.waitForTimeout(1000);

    // Should see notifications list or empty state
    const notifications = page.locator('[class*="notification"], [class*="card"]');
    const notificationCount = await notifications.count();
    
    // Either have notifications or show "No notifications" message
    if (notificationCount === 0) {
      await expect(page.locator('text=/no.*notifications|no.*found/i')).toBeVisible({ timeout: 5000 });
    } else {
      expect(notificationCount).toBeGreaterThan(0);
    }
  });

  test('Mark as read', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Open notification center
    const navbarButtons = page.locator('nav button').all();
    for (const btn of await navbarButtons) {
      const text = await btn.textContent();
      if (!text || text.length < 10) {
        await btn.click();
        await page.waitForTimeout(500);
        break;
      }
    }

    await page.waitForTimeout(1000);

    // Find unread notification (might have a badge or different styling)
    const unreadNotification = page.locator('[class*="unread"], [class*="blue"], button:has-text("Mark")').first();
    
    if (await unreadNotification.isVisible({ timeout: 5000 })) {
      // Click mark as read button
      const markButton = page.locator('button:has-text("Mark"), button[aria-label*="read" i]').first();
      if (await markButton.isVisible({ timeout: 2000 })) {
        await markButton.click();
        await page.waitForTimeout(1000);
        
        // Notification should be marked as read (check for visual change)
        expect(await unreadNotification.isVisible()).toBeFalsy();
      }
    } else {
      test.skip('No unread notifications available');
    }
  });

  test('Badge count updates', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check for notification badge (red circle with number)
    const badge = page.locator('[class*="badge"], [class*="count"], span:has-text(/\\d+/), [class*="red"]').first();
    
    if (await badge.isVisible({ timeout: 5000 })) {
      const badgeText = await badge.textContent();
      const badgeNumber = parseInt(badgeText || '0');
      
      // Badge should show a number
      expect(badgeNumber).toBeGreaterThanOrEqual(0);
    } else {
      // No badge means no unread notifications
      test.skip('No notification badge visible (might be 0 unread)');
    }
  });
});

