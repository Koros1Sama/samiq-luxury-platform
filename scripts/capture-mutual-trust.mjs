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

  // 1. Mobile 375x727: Top header clean (no cart), cart only in bottom app bar
  {
    console.log('Capturing mobile_375_clean_top_header_cart_bottom.png...');
    const page = await browser.newPage({
      viewport: { width: 375, height: 727 },
      locale: 'ar-YE',
    });
    await page.goto('http://localhost:3000/?demo=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(targetDir, 'mobile_375_clean_top_header_cart_bottom.png'),
    });
    console.log('Saved mobile_375_clean_top_header_cart_bottom.png');
    await page.close();
  }

  // 2. Desktop 1440x900: Mutual Trust Payment & WhatsApp Handshake in Cart
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

    // Scroll down inside the cart drawer container so payment methods & mutual trust box are visible
    const scrollableDrawer = page.locator('aside .overflow-y-auto, div.fixed .overflow-y-auto').first();
    if (await scrollableDrawer.isVisible()) {
      await scrollableDrawer.evaluate((el) => { el.scrollTop = 350; });
      await page.waitForTimeout(500);
    }

    // Select Kuraimi
    const kuraimiOption = page.locator('text=حساب الكريمي المميز').first();
    if (await kuraimiOption.isVisible()) {
      await kuraimiOption.click();
      await page.waitForTimeout(500);
    }

    // Scroll slightly more if needed to show the trust box and transfer reference
    if (await scrollableDrawer.isVisible()) {
      await scrollableDrawer.evaluate((el) => { el.scrollTop = 550; });
      await page.waitForTimeout(600);
    }

    await page.screenshot({
      path: path.join(targetDir, 'cart_mutual_trust_whatsapp_1440.png'),
    });
    console.log('Saved cart_mutual_trust_whatsapp_1440.png');
    await page.close();
  }

  // 3. Desktop 1440x900: Admin Order & Stock Handshake Controls
  {
    console.log('Capturing admin_order_stock_handshake_1440.png...');
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    await page.addInitScript(() => {
      localStorage.setItem('samiq_admin_auth', 'true');
    });
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click Orders Tab
    const ordersTabBtn = page.locator('button:has-text("الطلبات والمبيعات")').first();
    if (await ordersTabBtn.isVisible()) {
      await ordersTabBtn.click();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({
      path: path.join(targetDir, 'admin_order_stock_handshake_1440.png'),
    });
    console.log('Saved admin_order_stock_handshake_1440.png');
    await page.close();
  }

  // 4. Desktop 1440x900: Platform Master Owner Lock Screen
  {
    console.log('Capturing platform_master_lock_1440.png...');
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    // Ensure no auth in localStorage
    await page.addInitScript(() => {
      localStorage.removeItem('samiq_platform_owner_auth');
    });
    await page.goto('http://localhost:3000/platform', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(targetDir, 'platform_master_lock_1440.png'),
    });
    console.log('Saved platform_master_lock_1440.png');
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
