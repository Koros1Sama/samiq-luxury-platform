import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const targetDirs = [
  'C:\\Users\\KorosSama\\.gemini\\antigravity\\brain\\e2695a51-816f-4921-b075-50af543ba247',
  'C:\\Users\\KorosSama\\.gemini\\antigravity\\brain\\d55b82f9-0629-4650-bd98-0039eb1e6a35',
];

for (const d of targetDirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
}

async function run() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: 'ar-YE',
  });

  console.log('[1/3] Capturing platform_quote_tree_1440.png...');
  await page.goto('http://localhost:3000/platform', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to frame the full interactive tree and pricing calculator
  await page.evaluate(() => {
    window.scrollTo({ top: 1300, behavior: 'instant' });
  });
  await page.waitForTimeout(600);

  const shot1 = await page.screenshot({ fullPage: false });
  for (const d of targetDirs) {
    fs.writeFileSync(path.join(d, 'platform_quote_tree_1440.png'), shot1);
  }

  console.log('[2/3] Capturing pdf_invoice_preview_1440.png...');
  // Click on the PDF invoice button
  const pdfBtn = await page.locator('button:has-text("تصدير عرض السعر / الفاتورة (PDF)")').first();
  if (await pdfBtn.isVisible()) {
    await pdfBtn.click();
    await page.waitForTimeout(1000);
    const shot2 = await page.screenshot({ fullPage: false });
    for (const d of targetDirs) {
      fs.writeFileSync(path.join(d, 'pdf_invoice_preview_1440.png'), shot2);
    }
  } else {
    console.error('Could not find PDF button on /platform');
  }

  console.log('[3/3] Capturing samiq_tiers_pricing_1440.png...');
  await page.goto('http://localhost:3000/samiq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Switch to custom tab to show tree, store title input, and PDF export button
  const customTabBtn = await page.locator('button:has-text("حاسبة الباقة المخصصة وشجرة الترابطات")').first();
  if (await customTabBtn.isVisible()) {
    await customTabBtn.click();
    await page.waitForTimeout(600);
  }

  await page.evaluate(() => {
    window.scrollTo({ top: 480, behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  const shot3 = await page.screenshot({ fullPage: false });
  for (const d of targetDirs) {
    fs.writeFileSync(path.join(d, 'samiq_tiers_pricing_1440.png'), shot3);
  }

  await browser.close();
  console.log('All screenshots captured and saved successfully!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
