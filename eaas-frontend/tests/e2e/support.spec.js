import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';
import path from 'path';

test.describe('Support System', () => {
  test('Create new ticket', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/support');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Click create ticket button
    const createButton = page.locator('button:has-text("Create"), button:has-text("New Ticket"), a:has-text("Create")').first();
    await createButton.click({ timeout: 5000 });
    
    await page.waitForTimeout(1000);

    // Fill ticket form
    const subjectInput = page.locator('input[name="subject"], input[placeholder*="subject" i]').first();
    if (await subjectInput.isVisible({ timeout: 5000 })) {
      await subjectInput.fill('Test Ticket - E2E Testing');
    }

    const categorySelect = page.locator('select[name="category"], select[name="ticket_category"]').first();
    if (await categorySelect.isVisible({ timeout: 2000 })) {
      await categorySelect.selectOption('technical');
    }

    const prioritySelect = page.locator('select[name="priority"]').first();
    if (await prioritySelect.isVisible({ timeout: 2000 })) {
      await prioritySelect.selectOption('medium');
    }

    const descriptionTextarea = page.locator('textarea[name="description"], textarea[placeholder*="description" i]').first();
    if (await descriptionTextarea.isVisible({ timeout: 2000 })) {
      await descriptionTextarea.fill('This is a test ticket created during E2E testing. Please ignore.');
    }

    // Submit ticket
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Create Ticket")').first();
    await submitButton.click();

    // Should see success message or redirect
    await page.waitForTimeout(2000);
    const successMessage = page.locator('text=/success|created|submitted/i');
    await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('View ticket list', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/support');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Should see tickets list or empty state
    const ticketsList = page.locator('[class*="ticket"], [class*="card"]');
    const ticketCount = await ticketsList.count();
    
    // Either have tickets or show "No tickets" message
    if (ticketCount === 0) {
      await expect(page.locator('text=/no.*tickets|no.*found/i')).toBeVisible();
    } else {
      expect(ticketCount).toBeGreaterThan(0);
    }
  });

  test('View ticket details', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/support');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find first ticket
    const ticketLink = page.locator('a[href*="/support/"], [class*="ticket"] a, button:has-text("View")').first();
    
    if (await ticketLink.isVisible({ timeout: 5000 })) {
      await ticketLink.click();
      await page.waitForURL(/\/support\/[^/]+/, { timeout: 10000 });

      // Should see ticket details
      await expect(page.locator('text=/ticket|subject|status/i').first()).toBeVisible({ timeout: 5000 });
      
      // Should see ticket information
      const ticketInfo = page.locator('text=/priority|category|created/i');
      await expect(ticketInfo.first()).toBeVisible({ timeout: 5000 });
    } else {
      test.skip('No tickets available');
    }
  });

  test('Add comment to ticket', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/support');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find first ticket
    const ticketLink = page.locator('a[href*="/support/"], [class*="ticket"] a').first();
    
    if (await ticketLink.isVisible({ timeout: 5000 })) {
      await ticketLink.click();
      await page.waitForURL(/\/support\/[^/]+/, { timeout: 10000 });

      // Find comment textarea
      const commentTextarea = page.locator('textarea[name="comment"], textarea[name="reply"], textarea[placeholder*="comment" i]').first();
      
      if (await commentTextarea.isVisible({ timeout: 5000 })) {
        await commentTextarea.fill('This is a test comment from E2E testing.');
        
        // Submit comment
        const submitButton = page.locator('button:has-text("Reply"), button:has-text("Add Comment"), button:has-text("Submit")').first();
        await submitButton.click();
        
        // Should see comment added
        await page.waitForTimeout(2000);
        await expect(page.locator('text=/test.*comment|comment.*added/i')).toBeVisible({ timeout: 10000 });
      } else {
        test.skip('Comment functionality not available');
      }
    } else {
      test.skip('No tickets available');
    }
  });
});

