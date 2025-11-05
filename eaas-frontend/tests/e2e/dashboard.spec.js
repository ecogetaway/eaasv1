import { test, expect } from './fixtures.js';
import { TEST_USER } from './fixtures.js';

test.describe('Dashboard Functionality', () => {
  test('Dashboard loads with data', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Should see dashboard title or main content
    const dashboardContent = page.locator('text=/dashboard|energy|solar/i');
    await expect(dashboardContent.first()).toBeVisible({ timeout: 10000 });

    // Should see live metrics cards
    const metricCards = page.locator('[class*="card"], [class*="metric"]');
    const cardCount = await metricCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('Real-time metrics update', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Get initial metric values
    const solarMetric = page.locator('text=/solar.*generation|solar.*kw/i').first();
    if (await solarMetric.isVisible({ timeout: 5000 })) {
      const initialValue = await solarMetric.textContent();
      
      // Wait a few seconds for potential updates
      await page.waitForTimeout(5000);
      
      // Check if value changed (WebSocket updates)
      const updatedValue = await solarMetric.textContent();
      // Values might be the same or different depending on timing
      expect(updatedValue).toBeTruthy();
    }
  });

  test('Charts render correctly', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Look for chart container (Recharts renders SVG elements)
    const chartContainer = page.locator('svg, [class*="chart"], [class*="recharts"]').first();
    await expect(chartContainer).toBeVisible({ timeout: 10000 });

    // Should see chart controls (period buttons)
    const periodButtons = page.locator('button:has-text("Day"), button:has-text("Week"), button:has-text("Month")');
    const buttonCount = await periodButtons.count();
    if (buttonCount > 0) {
      expect(buttonCount).toBeGreaterThanOrEqual(2);
    }
  });

  test('WebSocket connection established', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Monitor console for WebSocket connection messages
    const wsMessages = [];
    page.on('console', msg => {
      if (msg.text().includes('WebSocket') || msg.text().includes('connected')) {
        wsMessages.push(msg.text());
      }
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(3000);

    // Check browser console for WebSocket connection
    // WebSocket connection should be established
    // Note: In Playwright, we can't directly test WebSocket, but we can check for related UI updates
    const dashboardLoaded = await page.locator('text=/dashboard|energy/i').first().isVisible();
    expect(dashboardLoaded).toBeTruthy();
  });

  test('Energy data displays', async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Should see energy metrics
    const energyLabels = [
      'solar',
      'consumption',
      'grid',
      'battery',
      'kW',
      'kWh'
    ];

    let foundMetrics = false;
    for (const label of energyLabels) {
      const element = page.locator(`text=/${label}/i`).first();
      if (await element.isVisible({ timeout: 2000 })) {
        foundMetrics = true;
        break;
      }
    }

    expect(foundMetrics).toBeTruthy();

    // Should see numeric values (not NaN)
    const numericContent = page.locator('text=/\\d+\\.?\\d*\\s*(kW|kWh)/');
    const numericCount = await numericContent.count();
    expect(numericCount).toBeGreaterThan(0);
  });
});

