import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser with playwright-core...');
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

  // 1. Desktop 1440x900: /account navigated from /?theme=ivory-journal (No ?theme= in URL, proving persistence + ivory styling)
  {
    console.log('Capturing theme_continuity_account_ivory_1440.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    // Step 1: visit home with ?theme=ivory-journal
    await page.goto('http://localhost:3000/?theme=ivory-journal', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    // Step 2: navigate to /account directly (no query parameter)
    await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(targetDir, 'theme_continuity_account_ivory_1440.png'),
    });
    console.log('Saved theme_continuity_account_ivory_1440.png');
    await context.close();
  }

  // 2. Desktop 1440x900: /account in clinic-lab theme
  {
    console.log('Capturing theme_continuity_account_clinic_1440.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    // Step 1: visit home with ?theme=clinic-lab
    await page.goto('http://localhost:3000/?theme=clinic-lab', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    // Step 2: navigate to /account directly (no query parameter)
    await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(targetDir, 'theme_continuity_account_clinic_1440.png'),
    });
    console.log('Saved theme_continuity_account_clinic_1440.png');
    await context.close();
  }

  // 3. Mobile 375x727: /?theme=ivory-journal tapping "المنتجات" (catalog) in bottom bar
  {
    console.log('Capturing mobile_375_ivory_catalog_tab.png...');
    const context = await browser.newContext({
      viewport: { width: 375, height: 727 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/?theme=ivory-journal', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    // Tap the catalog tab button in bottom nav
    const catalogTabBtn = page.locator('nav[data-testid="bottom-nav"] button').nth(1);
    await catalogTabBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(targetDir, 'mobile_375_ivory_catalog_tab.png'),
    });
    console.log('Saved mobile_375_ivory_catalog_tab.png');
    await context.close();
  }

  // 4. Mobile 375x727: /?theme=clinic-lab tapping "الأصالة" (authenticity) in bottom bar
  {
    console.log('Capturing mobile_375_clinic_authenticity_tab.png...');
    const context = await browser.newContext({
      viewport: { width: 375, height: 727 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/?theme=clinic-lab', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    // Tap the authenticity tab button in bottom nav
    const authTabBtn = page.locator('nav[data-testid="bottom-nav"] button').nth(2);
    await authTabBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(targetDir, 'mobile_375_clinic_authenticity_tab.png'),
    });
    console.log('Saved mobile_375_clinic_authenticity_tab.png');
    await context.close();
  }

  await browser.close();
  console.log('All 4 theme continuity screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
