import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser for mobile 375x727 perfection captures...');
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

  // Listen to console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`[Page Error] ${err.message}`);
  });

  // 1. mobile_375_home_tab.png
  console.log('1. Capturing mobile_375_home_tab.png...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path1 = path.join(targetDir, 'mobile_375_home_tab.png');
  await page.screenshot({ path: path1 });
  console.log('Saved:', path1);

  // 2. mobile_375_catalog_tab.png (Click "المنتجات" bottom tab)
  console.log('2. Capturing mobile_375_catalog_tab.png...');
  const catalogTab = page.locator('nav[aria-label="شريط تنقل تطبيق الجوال"] button:has-text("المنتجات")').first();
  if (await catalogTab.isVisible()) {
    await catalogTab.click();
    await page.waitForTimeout(1200);
  } else {
    await page.goto('http://localhost:3000/?tab=catalog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
  }
  const path2 = path.join(targetDir, 'mobile_375_catalog_tab.png');
  await page.screenshot({ path: path2 });
  console.log('Saved:', path2);

  // 3. mobile_375_authenticity_tab.png (Click "الأصالة" bottom tab)
  console.log('3. Capturing mobile_375_authenticity_tab.png...');
  const authTab = page.locator('nav[aria-label="شريط تنقل تطبيق الجوال"] button:has-text("الأصالة")').first();
  if (await authTab.isVisible()) {
    await authTab.click();
    await page.waitForTimeout(1200);
  } else {
    await page.goto('http://localhost:3000/?tab=authenticity', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
  }
  const path3 = path.join(targetDir, 'mobile_375_authenticity_tab.png');
  await page.screenshot({ path: path3 });
  console.log('Saved:', path3);

  // 4. mobile_375_ivory_theme.png (Ivory template on mobile)
  console.log('4. Capturing mobile_375_ivory_theme.png...');
  await page.goto('http://localhost:3000/?theme=ivory-journal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path4 = path.join(targetDir, 'mobile_375_ivory_theme.png');
  await page.screenshot({ path: path4 });
  console.log('Saved:', path4);

  // 5. mobile_375_blog_subpage.png (Subpage with mobile header and bottom bar)
  console.log('5. Capturing mobile_375_blog_subpage.png...');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path5 = path.join(targetDir, 'mobile_375_blog_subpage.png');
  await page.screenshot({ path: path5 });
  console.log('Saved:', path5);

  console.log('--- Console Errors during Mobile Run ---');
  if (errors.length > 0) {
    console.error('Found errors:', errors);
  } else {
    console.log('ZERO errors detected across all mobile views! Perfect clean console.');
  }

  await browser.close();
  console.log('All mobile screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
