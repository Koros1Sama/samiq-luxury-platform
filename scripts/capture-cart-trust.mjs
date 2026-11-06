import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

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
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  // Desktop 1440x900: Mutual Trust Payment & WhatsApp Handshake in Cart
  {
    console.log('Capturing cart_mutual_trust_whatsapp_1440.png...');
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    await page.addInitScript(() => {
      const sampleCart = [
        {
          id: 'prod-1-v1',
          productId: 'prod-1',
          variantId: 'v1',
          title: 'سيروم فيتامين سي النقي 10% (Pure Vitamin C10)',
          variantTitle: '30 مل (الأصلي)',
          unitPrice: { YER: 28500, SAR: 195, USD: 52 },
          quantity: 1,
          image: '/media/products/serum-vitamin-c.jpg',
        },
      ];
      localStorage.setItem('samiq_cart_items', JSON.stringify(sampleCart));
    });

    await page.goto('http://localhost:3000/?demo=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Open Cart Drawer
    const cartBtn = page.locator('button[aria-label="سلة المشتريات"]').first();
    if (await cartBtn.isVisible()) {
      await cartBtn.click();
      await page.waitForTimeout(800);
    }

    // Select "بنك الكريمي"
    const kuraimiBtn = page.locator('button:has-text("بنك الكريمي")').first();
    if (await kuraimiBtn.isVisible()) {
      await kuraimiBtn.click();
      await page.waitForTimeout(600);
    }

    // Scroll down inside the cart drawer container so the Mutual Trust Box is fully displayed
    const scrollableDrawer = page.locator('.overflow-y-auto').first();
    if (await scrollableDrawer.isVisible()) {
      await scrollableDrawer.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      await page.waitForTimeout(800);
    }

    await page.screenshot({
      path: path.join(targetDir, 'cart_mutual_trust_whatsapp_1440.png'),
    });
    console.log('Saved cart_mutual_trust_whatsapp_1440.png');
    await page.close();
  }

  await browser.close();
  console.log('Capture completed successfully!');
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
