import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log('Launching browser for verification screenshots...');
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (err) {
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

  // 1. perfection_blog_unified_header_1440.png
  console.log('Capturing Screenshot 1: /blog Unified Header...');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path1 = path.join(targetDir, 'perfection_blog_unified_header_1440.png');
  await page.screenshot({ path: path1 });
  console.log('Saved:', path1);

  // 2. perfection_blog_article_reader_1440.png
  console.log('Capturing Screenshot 2: /blog Interactive Article Reader...');
  // Navigate to blog and click the first article card to open the interactive reader
  await page.goto('http://localhost:3000/blog?post=how-to-verify-vitamin-c-serum', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Also try clicking the first article card if not already open
  const articleCard = page.locator('article button, [data-article-slug], article').first();
  if (await articleCard.isVisible()) {
    try {
      await articleCard.click({ timeout: 2000 });
      await page.waitForTimeout(1000);
    } catch {}
  }
  const path2 = path.join(targetDir, 'perfection_blog_article_reader_1440.png');
  await page.screenshot({ path: path2 });
  console.log('Saved:', path2);

  // 3. perfection_blog_ivory_theme_1440.png
  console.log('Capturing Screenshot 3: /blog Ivory Theme...');
  await page.goto('http://localhost:3000/blog?theme=ivory-journal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const path3 = path.join(targetDir, 'perfection_blog_ivory_theme_1440.png');
  await page.screenshot({ path: path3 });
  console.log('Saved:', path3);

  await browser.close();
  console.log('All 3 verification screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
