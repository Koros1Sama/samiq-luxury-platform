import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser for currency QA screenshots...');
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch {
    console.warn('Chrome launch failed, trying msedge...');
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ar-YE',
  });

  const page = await context.newPage();

  // 1. Storefront with NO Customer Currency Switcher
  console.log('1. Navigating to Storefront (http://localhost:3000)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const storefrontPath = path.join(targetDir, 'storefront_no_customer_currency_1440.png');
  await page.screenshot({ path: storefrontPath });
  console.log('Saved storefront screenshot:', storefrontPath);

  // 2. Admin Currency Converter Section
  console.log('2. Navigating to Admin (http://localhost:3000/admin)...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check if login passcode form is shown
  const passcodeInput = page.locator('input[type="password"]');
  if (await passcodeInput.isVisible()) {
    console.log('Authenticating with passcode...');
    await passcodeInput.fill('miftah2026');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }

  // Scroll smoothly down a bit so the Currency Converter card is centered and fully visible
  await page.evaluate(() => {
    window.scrollTo({ top: 180, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  const adminPath = path.join(targetDir, 'admin_currency_converter_1440.png');
  await page.screenshot({ path: adminPath });
  console.log('Saved admin currency converter screenshot:', adminPath);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
