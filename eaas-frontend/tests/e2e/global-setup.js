import { chromium } from '@playwright/test';

async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Check if backend is running
  try {
    await page.goto('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Backend is running');
  } catch (error) {
    console.warn('⚠️  Backend might not be running at http://localhost:5001');
    console.warn('   Make sure to start the backend server before running tests');
  }
  
  await browser.close();
}

export default globalSetup;

