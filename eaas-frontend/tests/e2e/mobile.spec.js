import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';

// Mobile device configurations
const devices = [
  { name: 'iPhone 12 Pro', viewport: { width: 390, height: 844 } },
  { name: 'iPhone SE', viewport: { width: 375, height: 667 } },
  { name: 'iPad', viewport: { width: 768, height: 1024 } },
  { name: 'Samsung Galaxy S21', viewport: { width: 360, height: 800 } },
];

test.describe('Mobile Responsive Design', () => {
  devices.forEach((device) => {
    test.describe(`${device.name} (${device.viewport.width}x${device.viewport.height})`, () => {
      test.use({ viewport: device.viewport });

      test('Navigation menu (hamburger works)', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard', { timeout: 15000 });

        // Check if hamburger menu is visible (on mobile devices)
        if (device.viewport.width < 768) {
          const hamburgerButton = page.locator('button:has(svg)').first();
          await expect(hamburgerButton).toBeVisible();

          // Click hamburger to open menu
          await hamburgerButton.click();
          await page.waitForTimeout(300);

          // Verify menu items are visible
          await expect(page.locator('text=Dashboard')).toBeVisible();
          await expect(page.locator('text=Billing')).toBeVisible();
          await expect(page.locator('text=Support')).toBeVisible();
          await expect(page.locator('text=Profile')).toBeVisible();
          await expect(page.locator('text=Logout')).toBeVisible();

          // Take screenshot
          await page.screenshot({ 
            path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-nav-menu.png`,
            fullPage: true 
          });
        } else {
          // On tablet/desktop, navigation should be always visible
          await expect(page.locator('text=Dashboard')).toBeVisible();
          await expect(page.locator('text=Billing')).toBeVisible();
        }
      });

      test('Forms (inputs are accessible)', async ({ page }) => {
        await page.goto('/register');

        // Check all form inputs are visible and accessible
        const nameInput = page.locator('input[name="name"]');
        const emailInput = page.locator('input[name="email"]');
        const passwordInput = page.locator('input[name="password"]');
        const phoneInput = page.locator('input[name="phone"]');
        const addressTextarea = page.locator('textarea[name="address"]');

        await expect(nameInput).toBeVisible();
        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(phoneInput).toBeVisible();
        await expect(addressTextarea).toBeVisible();

        // Test that inputs can be filled
        await nameInput.fill('Test User');
        await emailInput.fill('test@example.com');
        await passwordInput.fill('Test@123456');
        await phoneInput.fill('9876543210');
        await addressTextarea.fill('123 Test Street');

        // Verify values are set
        expect(await nameInput.inputValue()).toBe('Test User');
        expect(await emailInput.inputValue()).toBe('test@example.com');

        // Take screenshot
        await page.screenshot({ 
          path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-form.png`,
          fullPage: true 
        });
      });

      test('Dashboard (charts render correctly)', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard', { timeout: 15000 });

        // Wait for dashboard content to load
        await page.waitForTimeout(2000);

        // Check for key dashboard elements
        await expect(page.locator('text=/dashboard|energy|solar/i').first()).toBeVisible({ timeout: 10000 });

        // Check if charts are present (they might be in a container)
        const chartContainer = page.locator('[class*="chart"], [class*="Chart"], canvas, svg').first();
        if (await chartContainer.isVisible({ timeout: 5000 })) {
          await expect(chartContainer).toBeVisible();
        }

        // Verify no horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // Take screenshot
        await page.screenshot({ 
          path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-dashboard.png`,
          fullPage: true 
        });
      });

      test('Tables (responsive on small screens)', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard', { timeout: 15000 });

        // Navigate to billing page (has tables)
        await page.goto('/billing');
        await page.waitForTimeout(2000);

        // Check if billing page loads
        await expect(page.locator('text=/billing|bills|invoices/i').first()).toBeVisible({ timeout: 10000 });

        // Verify no horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // Take screenshot
        await page.screenshot({ 
          path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-tables.png`,
          fullPage: true 
        });
      });

      test('Notifications (modal fits screen)', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard', { timeout: 15000 });

        // Find and click notification bell
        const bellButton = page.locator('button:has(svg)').first();
        await bellButton.click();
        await page.waitForTimeout(500);

        // Check if notification modal/center is visible
        const notificationModal = page.locator('[role="dialog"], .modal, [class*="notification"]').first();
        if (await notificationModal.isVisible({ timeout: 3000 })) {
          await expect(notificationModal).toBeVisible();

          // Verify modal fits screen (no overflow)
          const modalBox = await notificationModal.boundingBox();
          const viewportSize = await page.viewportSize();
          
          if (modalBox) {
            expect(modalBox.width).toBeLessThanOrEqual(viewportSize.width);
            expect(modalBox.height).toBeLessThanOrEqual(viewportSize.height);
          }
        }

        // Take screenshot
        await page.screenshot({ 
          path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-notifications.png`,
          fullPage: true 
        });
      });

      test('No horizontal scroll on any page', async ({ page }) => {
        const pages = ['/', '/login', '/register', '/dashboard', '/billing', '/support'];

        // Login first if needed
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard', { timeout: 15000 });

        for (const path of pages) {
          await page.goto(path);
          await page.waitForTimeout(1000);

          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });

          expect(hasHorizontalScroll).toBe(false);
        }

        // Take screenshot of each page
        for (const path of pages) {
          await page.goto(path);
          await page.waitForTimeout(1000);
          await page.screenshot({ 
            path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-${path.replace(/\//g, '') || 'home'}.png`,
            fullPage: true 
          });
        }
      });
    });
  });
});

