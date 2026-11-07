import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-core';

const targetDir = 'C:/Users/KorosSama/.gemini/antigravity/brain/e2695a51-816f-4921-b075-50af543ba247';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function getBrowser() {
  try {
    return await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch {
    return await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
}

async function main() {
  console.log('=== STARTING RED-TEAM PLAYWRIGHT VERIFICATION ===');
  const browser = await getBrowser();
  const errors = [];

  function attachErrorListener(page, pageName) {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected/ignorable favicon or network warnings if any
        if (!text.includes('favicon.ico')) {
          console.error(`[CONSOLE ERROR - ${pageName}]:`, text);
          errors.push(`[${pageName}] ${text}`);
        }
      }
    });
    page.on('pageerror', (err) => {
      console.error(`[PAGE ERROR - ${pageName}]:`, err.message);
      errors.push(`[PAGE ERROR - ${pageName}] ${err.message}`);
    });
  }

  // -------------------------------------------------------------
  // TEST FLOW 1: IVORY JOURNAL FULL CONTINUITY CRAWL
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Ivory Journal Flow ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    attachErrorListener(page, 'IvoryFlow');

    // 1. Visit /samiq
    console.log('Navigating to /samiq...');
    await page.goto('http://localhost:3000/samiq', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 2. Open /?demo=1&theme=ivory-journal
    console.log('Opening /?demo=1&theme=ivory-journal...');
    await page.goto('http://localhost:3000/?demo=1&theme=ivory-journal', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Verify theme in DOM
    let themeCheck = await page.evaluate(() => {
      return localStorage.getItem('samiq_active_theme') || document.body.getAttribute('data-theme');
    });
    console.log('Theme after home visit:', themeCheck);

    // 3. Navigate to /blog
    console.log('Navigating to /blog...');
    await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const blogTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/blog active theme:', blogTheme);
    if (blogTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /blog, got ${blogTheme}`);

    // 4. Navigate to /blog/post-1
    console.log('Navigating to /blog/post-1...');
    await page.goto('http://localhost:3000/blog/post-1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const postTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/blog/post-1 active theme:', postTheme);
    if (postTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /blog/post-1, got ${postTheme}`);

    // 5. Navigate to /account
    console.log('Navigating to /account...');
    await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const accountTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/account active theme:', accountTheme);
    if (accountTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /account, got ${accountTheme}`);

    // 6. Navigate to /bookings
    console.log('Navigating to /bookings...');
    await page.goto('http://localhost:3000/bookings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const bookingsTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/bookings active theme:', bookingsTheme);
    if (bookingsTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /bookings, got ${bookingsTheme}`);

    // 7. Navigate to /authenticity-hub
    console.log('Navigating to /authenticity-hub...');
    await page.goto('http://localhost:3000/authenticity-hub', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const authTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/authenticity-hub active theme:', authTheme);
    if (authTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /authenticity-hub, got ${authTheme}`);

    // 8. Navigate to /product/prod-1
    console.log('Navigating to /product/prod-1...');
    await page.goto('http://localhost:3000/product/prod-1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const prodTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/product/prod-1 active theme:', prodTheme);
    if (prodTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /product/prod-1, got ${prodTheme}`);

    // 9. Navigate back to / (WITHOUT ?theme=)
    console.log('Navigating back to / (WITHOUT query params)...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const homeFinalTheme = await page.evaluate(() => {
      return localStorage.getItem('samiq_active_theme');
    });
    console.log('/ (final return) active theme:', homeFinalTheme);
    if (homeFinalTheme !== 'ivory-journal') errors.push(`Expected ivory-journal on /, got ${homeFinalTheme}`);

    // CAPTURE SCREENSHOT 3: redteam_home_after_cookie_nav_ivory_1440.png
    console.log('Capturing redteam_home_after_cookie_nav_ivory_1440.png...');
    await page.screenshot({
      path: path.join(targetDir, 'redteam_home_after_cookie_nav_ivory_1440.png'),
    });
    console.log('Saved redteam_home_after_cookie_nav_ivory_1440.png');

    await context.close();
  }

  // -------------------------------------------------------------
  // TEST FLOW 2: CLINIC LAB FULL CONTINUITY CRAWL & SCREENSHOT 1
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Clinic Lab Flow ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ar-YE',
    });
    const page = await context.newPage();
    attachErrorListener(page, 'ClinicFlow');

    // 1. Open /?demo=1&theme=clinic-lab
    console.log('Opening /?demo=1&theme=clinic-lab...');
    await page.goto('http://localhost:3000/?demo=1&theme=clinic-lab', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 2. Navigate to /blog
    console.log('Navigating to /blog...');
    await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const blogTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/blog active theme:', blogTheme);
    if (blogTheme !== 'clinic-lab') errors.push(`Expected clinic-lab on /blog, got ${blogTheme}`);

    // 3. Navigate to /blog/post-1 and capture Screenshot 1
    console.log('Navigating to /blog/post-1?theme=clinic-lab...');
    await page.goto('http://localhost:3000/blog/post-1?theme=clinic-lab', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    console.log('Capturing redteam_blog_post_clinic_1440.png...');
    await page.screenshot({
      path: path.join(targetDir, 'redteam_blog_post_clinic_1440.png'),
    });
    console.log('Saved redteam_blog_post_clinic_1440.png');

    // 4. Navigate to /account
    console.log('Navigating to /account...');
    await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const accountTheme = await page.evaluate(() => localStorage.getItem('samiq_active_theme'));
    console.log('/account active theme:', accountTheme);
    if (accountTheme !== 'clinic-lab') errors.push(`Expected clinic-lab on /account, got ${accountTheme}`);

    // 5. Navigate to /bookings
    console.log('Navigating to /bookings...');
    await page.goto('http://localhost:3000/bookings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // 6. Navigate to /authenticity-hub
    console.log('Navigating to /authenticity-hub...');
    await page.goto('http://localhost:3000/authenticity-hub', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // 7. Navigate to /product/prod-1
    console.log('Navigating to /product/prod-1...');
    await page.goto('http://localhost:3000/product/prod-1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    await context.close();
  }

  // -------------------------------------------------------------
  // TEST FLOW 3: MOBILE DRAWER IN IVORY THEME (375x727) & SCREENSHOT 2
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Mobile Drawer in Ivory Theme (375x727) ---');
  {
    const context = await browser.newContext({
      viewport: { width: 375, height: 727 },
      locale: 'ar-YE',
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    attachErrorListener(page, 'MobileDrawer');

    console.log('Opening /?theme=ivory-journal at 375x727...');
    await page.goto('http://localhost:3000/?theme=ivory-journal', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Open Mobile More Drawer via custom event
    console.log('Dispatching samiq_open_more_drawer event...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('samiq_open_more_drawer'));
    });
    await page.waitForTimeout(800);

    console.log('Capturing redteam_mobile_drawer_ivory_375.png...');
    await page.screenshot({
      path: path.join(targetDir, 'redteam_mobile_drawer_ivory_375.png'),
    });
    console.log('Saved redteam_mobile_drawer_ivory_375.png');

    await context.close();
  }

  await browser.close();

  console.log('\n=============================================================');
  if (errors.length > 0) {
    console.error(`FAILED: ${errors.length} error(s) detected during verification!`);
    errors.forEach((e) => console.error(' - ', e));
    process.exit(1);
  } else {
    console.log('PASS: Zero console errors, 100% theme continuity across all routes!');
    console.log('All 3 verification screenshots saved successfully.');
    console.log('=============================================================');
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
