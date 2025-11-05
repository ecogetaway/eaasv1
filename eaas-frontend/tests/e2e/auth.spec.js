import { test, expect } from './fixtures.js';
import { TEST_USER, TEST_USER_INVALID, NEW_USER } from './fixtures.js';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User registration with valid data', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*register/);

    await page.fill('input[name="name"]', NEW_USER.name);
    await page.fill('input[name="email"]', NEW_USER.email);
    await page.fill('input[name="phone"]', NEW_USER.phone);
    // Address is a textarea, not input
    await page.fill('textarea[name="address"]', NEW_USER.address);
    await page.fill('input[name="password"]', NEW_USER.password);
    await page.fill('input[name="confirmPassword"]', NEW_USER.password);

    await page.click('button[type="submit"]');

    // Should redirect to onboarding or dashboard
    await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/(onboarding|dashboard)/);
  });

  test('User registration with duplicate email', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*register/);

    await page.fill('input[name="name"]', 'Duplicate User');
    await page.fill('input[name="email"]', TEST_USER.email); // Using existing email
    await page.fill('input[name="phone"]', '9876543210');
    // Address is a textarea, not input
    await page.fill('textarea[name="address"]', 'Test Address');
    await page.fill('input[name="password"]', 'Test@123456');
    await page.fill('input[name="confirmPassword"]', 'Test@123456');

    await page.click('button[type="submit"]');

    // Should show error message (check for red error div or any error text)
    const errorMessage = page.locator('.bg-red-50').or(page.locator('text=/email.*already|already.*registered|registration.*failed/i'));
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('User login with correct credentials', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);

    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL('/dashboard');
    
    // Should see user name in navbar (it's in a link to profile)
    // The name is inside a span within a link, so we check for the name text or profile link
    const userNameOrProfile = page.locator(`text=${TEST_USER.name}`).or(page.locator('a[href="/profile"]'));
    await expect(userNameOrProfile.first()).toBeVisible({ timeout: 5000 });
  });

  test('User login with incorrect credentials', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);

    await page.fill('input[type="email"]', TEST_USER_INVALID.email);
    await page.fill('input[type="password"]', TEST_USER_INVALID.password);
    await page.click('button[type="submit"]');

    // Should show error message (check for red error div or error text)
    const errorMessage = page.locator('.bg-red-50').or(page.locator('text=/invalid.*credentials|login.*failed|incorrect.*password/i'));
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('Logout functionality', async ({ authenticatedPage: page }) => {
    // Should be on dashboard (from authenticatedPage fixture)
    await expect(page).toHaveURL('/dashboard');

    // Click logout button (check if mobile menu needs to be opened first)
    const logoutButton = page.locator('text=Logout').first();
    const isMobile = await page.evaluate(() => window.innerWidth < 768);
    
    if (isMobile && !(await logoutButton.isVisible({ timeout: 1000 }))) {
      // Open mobile menu
      await page.click('button:has(svg)'); // Menu button
      await page.waitForTimeout(500);
    }
    
    await logoutButton.click();

    // Should redirect to login page
    await page.waitForURL(/.*login/, { timeout: 5000 });
    await expect(page).toHaveURL(/.*login/);

    // Try to access dashboard - should redirect to login
    await page.goto('/dashboard');
    await page.waitForURL(/.*login/, { timeout: 5000 });
    await expect(page).toHaveURL(/.*login/);
  });

  test('Session persistence', async ({ page, context }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Check that token is stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Reload page
    await page.reload();
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Should still be logged in (check for user name or profile link)
    const userNameOrProfile = page.locator(`text=${TEST_USER.name}`).or(page.locator('a[href="/profile"]'));
    await expect(userNameOrProfile.first()).toBeVisible({ timeout: 5000 });
  });
});

