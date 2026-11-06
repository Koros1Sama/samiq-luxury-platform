import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser for verification captures...');
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

  // 1. Mobile 375x727 Profile Tab & Account Services Hub
  {
    console.log('1. Capturing Mobile 375x727 Profile Tab (/account)...');
    const context = await browser.newContext({
      viewport: { width: 375, height: 727 },
      isMobile: true,
      hasTouch: true,
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const savePath = path.join(targetDir, 'mobile_375_profile_tab.png');
    await page.screenshot({ path: savePath, fullPage: false });
    console.log('Saved:', savePath);
    await context.close();
  }

  // 2. SAMIQ Showcase Header & All-Prices PDF Modal (1440x900)
  {
    console.log('2. Capturing SAMIQ Showcase Header & All-Prices PDF Modal (/samiq)...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/samiq', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    // Click the "كتالوج كافة الأسعار (PDF)" button
    await page.click('button:has-text("كتالوج كافة الأسعار (PDF)")');
    await page.waitForTimeout(1200);
    const savePath = path.join(targetDir, 'samiq_clean_header_and_full_pdf_1440.png');
    await page.screenshot({ path: savePath, fullPage: false });
    console.log('Saved:', savePath);
    await context.close();
  }

  // 3. Admin Store Manager Header Isolation (1440x900)
  {
    console.log('3. Capturing Admin Store Manager Header Isolation (/admin)...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('samiq_admin_auth', 'true');
    });
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const savePath = path.join(targetDir, 'admin_isolated_clean_header_1440.png');
    await page.screenshot({ path: savePath, fullPage: false });
    console.log('Saved:', savePath);
    await context.close();
  }

  await browser.close();
  console.log('All 3 verification screenshots captured successfully.');
}

main().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
