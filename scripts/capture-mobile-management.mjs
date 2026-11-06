import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser for mobile management captures (375x727)...');
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  const context = await browser.newContext({
    viewport: { width: 375, height: 727 },
    locale: 'ar-YE',
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. mobile_375_samiq.png
  console.log('1. Capturing mobile_375_samiq.png...');
  await page.goto('http://localhost:3000/samiq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const pathSamiq = path.join(targetDir, 'mobile_375_samiq.png');
  await page.screenshot({ path: pathSamiq });
  console.log('Saved:', pathSamiq);

  // 2. mobile_375_platform.png
  console.log('2. Capturing mobile_375_platform.png...');
  await page.goto('http://localhost:3000/platform', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const pathPlatform = path.join(targetDir, 'mobile_375_platform.png');
  await page.screenshot({ path: pathPlatform });
  console.log('Saved:', pathPlatform);

  // 3. mobile_375_admin.png
  console.log('3. Capturing mobile_375_admin.png...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const passInput = page.locator('input[type="password"]');
  if (await passInput.count() > 0) {
    await passInput.fill('miftah2026');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }
  const pathAdmin = path.join(targetDir, 'mobile_375_admin.png');
  await page.screenshot({ path: pathAdmin });
  console.log('Saved:', pathAdmin);

  await browser.close();
  console.log('All 3 management mobile screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
