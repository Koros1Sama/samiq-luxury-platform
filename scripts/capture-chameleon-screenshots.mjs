import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

async function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // 1. chameleon_platform_studio_1440.png
  console.log('[Capture 1] Loading /platform...');
  await page.goto('http://localhost:3000/platform', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Scroll to the Quick Client Rebrand Studio panel
  const studioPanel = page.locator('text=تجهيز سريع لعميل جديد').first();
  if (await studioPanel.count() > 0) {
    await studioPanel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }
  await page.screenshot({
    path: path.join(TARGET_DIR, 'chameleon_platform_studio_1440.png'),
    fullPage: false,
  });
  console.log('[Capture 1] Done: chameleon_platform_studio_1440.png');

  // 2. chameleon_admin_analytics_1440.png
  console.log('[Capture 2] Loading /admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Fill password
  const passInput = page.locator('input[type="password"]');
  if (await passInput.count() > 0) {
    await passInput.fill('miftah2026');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }
  // Click on settings tab
  const settingsTab = page.locator('button:has-text("إعدادات المتجر")').first();
  if (await settingsTab.count() > 0) {
    await settingsTab.click();
    await page.waitForTimeout(1000);
    // Scroll to presets section if needed
    const presetsSection = page.locator('text=قوالب الهوية الجاهزة بنقرة واحدة').first();
    if (await presetsSection.count() > 0) {
      await presetsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
  }
  await page.screenshot({
    path: path.join(TARGET_DIR, 'chameleon_admin_analytics_1440.png'),
    fullPage: false,
  });
  console.log('[Capture 2] Done: chameleon_admin_analytics_1440.png');

  // 3. chameleon_subpage_light_1440.png
  console.log('[Capture 3] Loading /authenticity-hub?theme=clinic-lab...');
  await page.goto('http://localhost:3000/authenticity-hub?theme=clinic-lab', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(TARGET_DIR, 'chameleon_subpage_light_1440.png'),
    fullPage: false,
  });
  console.log('[Capture 3] Done: chameleon_subpage_light_1440.png');

  // 4. chameleon_storefront_customizer_1440.png
  console.log('[Capture 4] Loading /?demo=1...');
  await page.goto('http://localhost:3000/?demo=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Find color customizer button or open it
  const colorBtn = page.locator('button[title*="ألوان"], button:has-text("ألوان"), button[aria-label*="ألوان"], button:has-text("Palette"), button:has-text("تخصيص")').first();
  if (await colorBtn.count() > 0) {
    await colorBtn.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({
    path: path.join(TARGET_DIR, 'chameleon_storefront_customizer_1440.png'),
    fullPage: false,
  });
  console.log('[Capture 4] Done: chameleon_storefront_customizer_1440.png');

  await browser.close();
  console.log('[All Captures Completed Successfully]');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
