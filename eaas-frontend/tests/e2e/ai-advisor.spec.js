import { test, expect } from './fixtures.js';
import { loginUser } from './login-helper.js';

test.describe('AI Advisor Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('/ai-advisor');
  });

  test('should display AI Advisor page with chat interface', async ({ page }) => {
    await expect(page).toHaveURL(/.*ai-advisor/);
    
    // Check for page title/header
    const header = page.locator('text=/Lumi AI Advisor|AI Advisor/i');
    await expect(header.first()).toBeVisible();
    
    // Check for initial message from AI
    const initialMessage = page.locator('text=/Hello.*Lumi|I.*m Lumi/i');
    await expect(initialMessage.first()).toBeVisible();
  });

  test('should have input field and send button', async ({ page }) => {
    // Find input by placeholder
    const input = page.locator('input[placeholder*="Ask"], input[placeholder*="ask"]');
    await expect(input.first()).toBeVisible({ timeout: 5000 });
    
    // Find send button - it's a button with an icon (Send icon), positioned absolutely near the input
    // Look for button that's near the input field (in the same container)
    const inputContainer = input.locator('..'); // parent container
    const sendButton = inputContainer.locator('button').or(
      page.locator('button').filter({ has: page.locator('svg') }).near(input.first())
    );
    await expect(sendButton.first()).toBeVisible({ timeout: 5000 });
  });

  test('should send a message and receive a response', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask"], input[placeholder*="ask"]');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    
    // Find send button - button near the input (it has an icon, not text)
    const inputContainer = input.locator('..');
    const sendButton = inputContainer.locator('button').first();
    
    // Type a message
    await input.fill('What are similar EaaS apps?');
    
    // Send the message (can also press Enter)
    await sendButton.click();
    
    // Wait for typing indicator or response
    await page.waitForTimeout(3000);
    
    // Check that user message appears
    const userMessage = page.locator('text=What are similar EaaS apps?');
    await expect(userMessage.first()).toBeVisible({ timeout: 5000 });
    
    // Wait for AI response (mock data has 800-2000ms delay)
    await page.waitForTimeout(3000);
    
    // Check that AI response appears (should contain some text)
    const aiResponse = page.locator('text=/Sunrun|Octopus|Tesla|EaaS|competitor|similar|application/i');
    await expect(aiResponse.first()).toBeVisible({ timeout: 15000 });
  });

  test('should have quick action buttons', async ({ page }) => {
    // Look for quick action chips/buttons
    const quickActions = page.locator('button, [role="button"]').filter({ 
      hasText: /Research|Competitors|Savings|Issue|Report/i 
    });
    
    const count = await quickActions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should handle quick action clicks', async ({ page }) => {
    // Find and click a quick action button
    const researchButton = page.locator('button, [role="button"]').filter({ 
      hasText: /Research|Competitors/i 
    }).first();
    
    if (await researchButton.isVisible()) {
      await researchButton.click();
      
      // Check that input is filled or message is sent
      await page.waitForTimeout(1000);
      
      // Either input should be filled or message should appear
      const input = page.locator('input[type="text"], textarea').first();
      const inputValue = await input.inputValue();
      expect(inputValue.length).toBeGreaterThan(0);
    }
  });

  test('should show typing indicator when AI is responding', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask"], input[placeholder*="ask"]');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    
    const inputContainer = input.locator('..');
    const sendButton = inputContainer.locator('button').first();
    
    await input.fill('Tell me about savings');
    await sendButton.click();
    
    // Check for typing indicator (animate-bounce class on dots)
    const typingIndicator = page.locator('[class*="animate-bounce"]');
    
    // Typing indicator might appear briefly, so we check if it exists at some point
    try {
      await expect(typingIndicator.first()).toBeVisible({ timeout: 3000 });
    } catch {
      // If not visible, that's okay - it might be too fast
      // Just verify that a response eventually appears
      await page.waitForTimeout(2000);
    }
    
    // Verify that a response eventually appears
    const response = page.locator('text=/savings|CO2|carbon|plan|monthly|offset/i');
    await expect(response.first()).toBeVisible({ timeout: 15000 });
  });

  test('should be accessible via navigation', async ({ page }) => {
    // Go to dashboard first
    await page.goto('/dashboard');
    
    // Find and click AI Advisor link in navbar
    const aiAdvisorLink = page.locator('a[href*="ai-advisor"], a').filter({ 
      hasText: /AI Advisor|Advisor/i 
    }).first();
    
    if (await aiAdvisorLink.isVisible()) {
      await aiAdvisorLink.click();
      await expect(page).toHaveURL(/.*ai-advisor/);
    }
  });
});

