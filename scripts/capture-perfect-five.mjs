import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser for perfection screenshots...');
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

  // 1. perfection_blog_ivory_theme_1440.png (/blog?theme=ivory-journal)
  console.log('1. Capturing perfection_blog_ivory_theme_1440.png (/blog?theme=ivory-journal)...');
  await page.goto('http://localhost:3000/blog?theme=ivory-journal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path1 = path.join(targetDir, 'perfection_blog_ivory_theme_1440.png');
  await page.screenshot({ path: path1 });
  console.log('Saved:', path1);

  // 2. perfection_blog_article_reader_1440.png (Open first article reader)
  console.log('2. Capturing perfection_blog_article_reader_1440.png...');
  await page.goto('http://localhost:3000/blog?post=how-to-verify-vitamin-c-serum', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const articleModal = page.locator('[data-testid="article-reader-modal"]').first();
  if (!(await articleModal.isVisible())) {
    const card = page.locator('article, [data-testid="article-card"]').first();
    if (await card.isVisible()) {
      await card.click();
      await page.waitForTimeout(1000);
    }
  }
  await page.waitForSelector('[data-testid="article-reader-modal"]', { timeout: 6000 });
  await page.waitForTimeout(1500);
  const path2 = path.join(targetDir, 'perfection_blog_article_reader_1440.png');
  await page.screenshot({ path: path2 });
  console.log('Saved:', path2);

  // 3. perfection_product_ivory_1440.png (/product/prod-1?theme=ivory-journal)
  console.log('3. Capturing perfection_product_ivory_1440.png (/product/prod-1?theme=ivory-journal)...');
  await page.goto('http://localhost:3000/product/prod-1?theme=ivory-journal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const pathProd = path.join(targetDir, 'perfection_product_ivory_1440.png');
  await page.screenshot({ path: pathProd });
  console.log('Saved:', pathProd);

  // 4. perfection_bookings_clinic_1440.png (/bookings?theme=clinic-lab)
  console.log('4. Capturing perfection_bookings_clinic_1440.png (/bookings?theme=clinic-lab)...');
  await page.goto('http://localhost:3000/bookings?theme=clinic-lab', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const pathBook = path.join(targetDir, 'perfection_bookings_clinic_1440.png');
  await page.screenshot({ path: pathBook });
  console.log('Saved:', pathBook);

  // 5. chameleon_subpage_light_1440.png (/authenticity-hub?theme=clinic-lab)
  console.log('5. Capturing chameleon_subpage_light_1440.png (/authenticity-hub?theme=clinic-lab)...');
  await page.goto('http://localhost:3000/authenticity-hub?theme=clinic-lab', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path3 = path.join(targetDir, 'chameleon_subpage_light_1440.png');
  await page.screenshot({ path: path3 });
  console.log('Saved:', path3);

  // 6. perfection_platform_fleet_sync_1440.png (/platform)
  console.log('6. Capturing perfection_platform_fleet_sync_1440.png (/platform)...');
  await page.goto('http://localhost:3000/platform', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const anchoringSection = page.locator('text=Anchoring & Multiplier Pricing').first();
  if (await anchoringSection.count() > 0) {
    await anchoringSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }
  const path4 = path.join(targetDir, 'perfection_platform_fleet_sync_1440.png');
  await page.screenshot({ path: path4 });
  console.log('Saved:', path4);

  // 7. chameleon_admin_analytics_1440.png (/admin showing wrapped tabs)
  console.log('7. Capturing chameleon_admin_analytics_1440.png (/admin)...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const passInput = page.locator('input[type="password"]');
  if (await passInput.count() > 0) {
    await passInput.fill('miftah2026');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }
  const settingsTab = page.locator('button:has-text("إعدادات المتجر")').first();
  if (await settingsTab.count() > 0) {
    await settingsTab.click();
    await page.waitForTimeout(1000);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const path5 = path.join(targetDir, 'chameleon_admin_analytics_1440.png');
  await page.screenshot({ path: path5 });
  console.log('Saved:', path5);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
