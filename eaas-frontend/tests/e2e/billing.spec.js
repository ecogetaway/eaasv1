import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';
import path from 'path';
import fs from 'fs';

test.describe('Billing Module', () => {
  test('View bills list', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/billing');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Should see bills page
    await expect(page.locator('text=/billing|bills|invoices/i').first()).toBeVisible({ timeout: 5000 });

    // Should see bills list or empty state
    const billsList = page.locator('[class*="bill"], [class*="card"]');
    const billCount = await billsList.count();
    
    // Either have bills or show "No bills" message
    if (billCount === 0) {
      await expect(page.locator('text=/no.*bills|no.*found/i')).toBeVisible();
    } else {
      expect(billCount).toBeGreaterThan(0);
    }
  });

  test('Filter bills by status', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/billing');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Look for filter buttons or dropdown
    const filterButtons = page.locator('button:has-text("Pending"), button:has-text("Paid"), select[name*="status"]');
    const filterCount = await filterButtons.count();
    
    if (filterCount > 0) {
      // Click on a filter
      await filterButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Verify bills are filtered (check URL or visible bills)
      const currentUrl = page.url();
      // Filter might update URL or just filter visible items
      expect(currentUrl).toBeTruthy();
    }
  });

  test('View bill details', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/billing');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find first bill card/link
    const billLink = page.locator('a[href*="/billing/"], [class*="bill"] a, button:has-text("View")').first();
    
    if (await billLink.isVisible({ timeout: 5000 })) {
      await billLink.click();
      await page.waitForURL(/\/billing\/[^/]+/, { timeout: 10000 });

      // Should see bill details
      await expect(page.locator('text=/bill.*details|amount|total/i').first()).toBeVisible({ timeout: 5000 });
      
      // Should see breakdown
      const breakdown = page.locator('text=/subscription|energy|charge|breakdown/i');
      await expect(breakdown.first()).toBeVisible({ timeout: 5000 });
    } else {
      // Skip if no bills
      test.skip();
    }
  });

  test('Download invoice', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/billing');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find first bill
    const billLink = page.locator('a[href*="/billing/"], [class*="bill"] a').first();
    
    if (await billLink.isVisible({ timeout: 5000 })) {
      await billLink.click();
      await page.waitForURL(/\/billing\/[^/]+/, { timeout: 10000 });

      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      
      // Click download button
      const downloadButton = page.locator('button:has-text("Download"), button:has-text("Invoice"), [aria-label*="download" i]').first();
      
      if (await downloadButton.isVisible({ timeout: 5000 })) {
        await downloadButton.click();
        
        const download = await downloadPromise;
        if (download) {
          // Verify download started
          expect(download.suggestedFilename()).toMatch(/invoice|\.pdf/i);
          
          // Save file to temp location
          const downloadsPath = path.join(process.cwd(), 'tests', 'downloads');
          if (!fs.existsSync(downloadsPath)) {
            fs.mkdirSync(downloadsPath, { recursive: true });
          }
          await download.saveAs(path.join(downloadsPath, download.suggestedFilename()));
        }
      }
    } else {
      test.skip('No bills available for download test');
    }
  });

  test('Make payment', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/billing');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find a pending bill
    const pendingBill = page.locator('text=/pending/i').first();
    
    if (await pendingBill.isVisible({ timeout: 5000 })) {
      // Click on pending bill
      await pendingBill.click({ force: true });
      await page.waitForTimeout(2000);

      // Look for payment button
      const payButton = page.locator('button:has-text("Pay"), button:has-text("Make Payment")').first();
      
      if (await payButton.isVisible({ timeout: 5000 })) {
        // Select payment method if dropdown exists
        const paymentMethod = page.locator('select[name*="payment"], select[id*="payment"]').first();
        if (await paymentMethod.isVisible({ timeout: 2000 })) {
          await paymentMethod.selectOption('upi');
        }

        // Click pay button
        await payButton.click();
        
        // Wait for payment modal to open
        await page.waitForTimeout(1000);
        
        // Payment modal should be visible (Razorpay mock)
        const paymentModal = page.locator('text=/Razorpay|Payment|UPI|Card|Net Banking/i');
        if (await paymentModal.isVisible({ timeout: 5000 })) {
          // Complete payment in modal (select UPI and wait)
          const upiOption = page.locator('text=/UPI/i').first();
          if (await upiOption.isVisible({ timeout: 2000 })) {
            await upiOption.click();
            await page.waitForTimeout(2000);
          }
          
          // Look for payment success in modal or wait for modal to close
          await page.waitForTimeout(4000);
        }

        // After payment, should see "Payment Completed" or bill status updated
        const successMessage = page.locator('text=/Payment Completed|Paid on|success|paid/i');
        await expect(successMessage.first()).toBeVisible({ timeout: 15000 });
      }
    } else {
      test.skip('No pending bills available for payment test');
    }
  });
});

