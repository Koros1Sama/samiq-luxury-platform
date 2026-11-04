import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { chromium } from 'playwright-core';

const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440];
const HEIGHT = 840;

const ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'home-theme', path: '/?theme=luxury-noir' },
  { slug: 'product-prod-1', path: '/product/prod-1' },
  { slug: 'authenticity-hub', path: '/authenticity-hub' },
  { slug: 'blog', path: '/blog' },
  { slug: 'bookings', path: '/bookings' },
  { slug: 'account', path: '/account' },
  { slug: 'admin', path: '/admin' },
];

const OUTPUT_DIR = path.resolve(process.cwd(), 'qa-out');

function checkServerReady(url, maxRetries = 30) {
  return new Promise((resolve) => {
    let retries = 0;
    const interval = setInterval(() => {
      const req = http.get(url, (res) => {
        clearInterval(interval);
        resolve(true);
      });
      req.on('error', () => {
        retries++;
        if (retries >= maxRetries) {
          clearInterval(interval);
          resolve(false);
        }
      });
    }, 1000);
  });
}

async function launchBrowser() {
  let browser = null;
  let browserChannel = 'chrome';

  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('[QA] Launched browser with channel: chrome');
    return { browser, channel: 'chrome' };
  } catch (err) {
    console.warn('[QA] Chrome launch failed, falling back to msedge:', err.message);
  }

  try {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('[QA] Launched browser with channel: msedge');
    return { browser, channel: 'msedge' };
  } catch (err) {
    console.error('[QA] Both Chrome and Edge failed to launch:', err.message);
    throw new Error('No compatible system browser (Chrome/Edge) found.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  let baseUrl = 'http://localhost:3000';
  const urlArgIdx = args.indexOf('--base-url');
  if (urlArgIdx >= 0 && args[urlArgIdx + 1]) {
    baseUrl = args[urlArgIdx + 1];
  }

  console.log(`[QA] Starting objective QA harness against ${baseUrl}...`);

  // Ensure server is up
  const isUp = await checkServerReady(baseUrl, 5);
  let serverProcess = null;

  if (!isUp) {
    console.log(`[QA] Server not detected on ${baseUrl}, spawning local build server...`);
    // Run npm run start
    serverProcess = spawn('npm.cmd', ['run', 'start', '--', '-p', '3000'], {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: true,
    });
    const ready = await checkServerReady(baseUrl, 40);
    if (!ready) {
      console.error('[QA] Failed to start server in time.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const { browser, channel } = await launchBrowser();
  const fullReport = {
    generatedAt: new Date().toISOString(),
    browserChannel: channel,
    baseUrl,
    widths: WIDTHS,
    results: {},
    summaryByWidth: {},
  };

  try {
    for (const width of WIDTHS) {
      console.log(`\n========================================`);
      console.log(`[QA] Auditing Viewport Width: ${width}px`);
      console.log(`========================================`);

      const widthDir = path.join(OUTPUT_DIR, String(width));
      if (!fs.existsSync(widthDir)) {
        fs.mkdirSync(widthDir, { recursive: true });
      }

      fullReport.summaryByWidth[width] = {
        routesAudited: 0,
        consoleErrors: 0,
        consoleWarnings: 0,
        overflowRoutes: 0,
        smallInteractivesTotal: 0,
        smallTextsTotal: 0,
        brokenImagesTotal: 0,
        stickyOverlapsTotal: 0,
      };

      for (const route of ROUTES) {
        const targetUrl = `${baseUrl}${route.path}`;
        const key = `${width}_${route.slug}`;

        const context = await browser.newContext({
          viewport: { width, height: HEIGHT },
          deviceScaleFactor: 1,
        });

        const page = await context.newPage();

        const consoleMessages = [];
        const failedRequests = [];

        page.on('console', (msg) => {
          const type = msg.type();
          if (type === 'error' || type === 'warning') {
            consoleMessages.push({ type, text: msg.text() });
          }
        });

        page.on('requestfailed', (req) => {
          failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
        });

        try {
          await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        } catch (e) {
          // If networkidle times out, wait for load
          try {
            await page.waitForLoadState('load');
          } catch (e2) {
            console.warn(`[QA] Navigation warning on ${route.slug}:`, e2.message);
          }
        }

        // Small wait for client hydration
        await page.waitForTimeout(600);

        // Take Screenshots: fold & full
        const foldShotPath = path.join(widthDir, `${route.slug}-fold.png`);
        const fullShotPath = path.join(widthDir, `${route.slug}-full.png`);

        await page.screenshot({ path: foldShotPath, fullPage: false });
        await page.screenshot({ path: fullShotPath, fullPage: true });

        // DOM Audits
        const audit = await page.evaluate((vpWidth) => {
          // 1. Horizontal Overflow
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const innerW = window.innerWidth;
          const hasOverflow = scrollW > innerW + 1;

          const overflowElements = [];
          if (hasOverflow) {
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > innerW + 1 && r.width > 0 && r.height > 0) {
                const tag = el.tagName.toLowerCase();
                const id = el.id ? `#${el.id}` : '';
                const cls =
                  typeof el.className === 'string' && el.className.trim()
                    ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                    : '';
                overflowElements.push({
                  selector: `${tag}${id}${cls}`.slice(0, 50),
                  right: Math.round(r.right),
                  width: Math.round(r.width),
                });
                if (overflowElements.length >= 5) break;
              }
            }
          }

          // 2. Interactive elements < 40px
          const interactives = document.querySelectorAll(
            'a, button, input, [role="button"], select, textarea'
          );
          const smallInteractives = [];
          let smallInteractiveCount = 0;
          for (const el of interactives) {
            const r = el.getBoundingClientRect();
            const s = window.getComputedStyle(el);
            if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;
            if (r.width <= 0 || r.height <= 0) continue;
            if (r.width < 40 || r.height < 40) {
              smallInteractiveCount++;
              if (smallInteractives.length < 5) {
                const tag = el.tagName.toLowerCase();
                const id = el.id ? `#${el.id}` : '';
                const text = (el.textContent || el.getAttribute('aria-label') || '')
                  .trim()
                  .slice(0, 25);
                smallInteractives.push({
                  selector: `${tag}${id} ("${text}")`,
                  width: Math.round(r.width),
                  height: Math.round(r.height),
                });
              }
            }
          }

          // 3. Text < 12px
          const smallTexts = [];
          let smallTextCount = 0;
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            const t = node.nodeValue?.trim();
            if (!t || t.length <= 1) continue;
            const parent = node.parentElement;
            if (!parent) continue;
            const s = window.getComputedStyle(parent);
            if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;
            const r = parent.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            const fSize = parseFloat(s.fontSize);
            if (fSize < 12) {
              smallTextCount++;
              if (smallTexts.length < 5) {
                smallTexts.push({
                  text: t.slice(0, 30),
                  fontSize: `${fSize}px`,
                  tag: parent.tagName.toLowerCase(),
                });
              }
            }
          }

          // 4. Broken Images
          const imgs = document.querySelectorAll('img');
          const brokenImages = [];
          for (const img of imgs) {
            if (img.complete && img.naturalWidth === 0) {
              brokenImages.push({
                src: img.src || img.getAttribute('src'),
                alt: img.alt || '',
              });
            }
          }

          // 5. Fixed & Sticky Overlaps
          const allEls = document.querySelectorAll('*');
          const fixedEls = [];
          for (const el of allEls) {
            const s = window.getComputedStyle(el);
            if (s.position === 'fixed' || s.position === 'sticky') {
              const r = el.getBoundingClientRect();
              if (
                r.width > 0 &&
                r.height > 0 &&
                s.display !== 'none' &&
                s.visibility !== 'hidden' &&
                parseFloat(s.opacity) > 0.05
              ) {
                const tag = el.tagName.toLowerCase();
                const id = el.id ? `#${el.id}` : '';
                const cls =
                  typeof el.className === 'string' && el.className.trim()
                    ? `.${el.className.trim().split(/\s+/)[0]}`
                    : '';
                fixedEls.push({
                  name: `${tag}${id}${cls}`,
                  rect: {
                    top: Math.round(r.top),
                    bottom: Math.round(r.bottom),
                    left: Math.round(r.left),
                    right: Math.round(r.right),
                  },
                  el,
                });
              }
            }
          }

          const overlaps = [];
          for (let i = 0; i < fixedEls.length; i++) {
            for (let j = i + 1; j < fixedEls.length; j++) {
              const a = fixedEls[i];
              const b = fixedEls[j];
              if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
              const isIntersecting = !(
                a.rect.right <= b.rect.left ||
                a.rect.left >= b.rect.right ||
                a.rect.bottom <= b.rect.top ||
                a.rect.top >= b.rect.bottom
              );
              if (isIntersecting) {
                overlaps.push({
                  elemA: a.name,
                  elemB: b.name,
                  rectA: a.rect,
                  rectB: b.rect,
                });
              }
            }
          }

          return {
            hasOverflow,
            scrollWidth: scrollW,
            innerWidth: innerW,
            overflowElements,
            smallInteractiveCount,
            smallInteractives,
            smallTextCount,
            smallTexts,
            brokenImages,
            fixedElementCount: fixedEls.length,
            overlaps,
          };
        }, width);

        const routeResult = {
          width,
          slug: route.slug,
          path: route.path,
          url: targetUrl,
          consoleErrors: consoleMessages.filter((m) => m.type === 'error'),
          consoleWarnings: consoleMessages.filter((m) => m.type === 'warning'),
          failedRequests,
          audit,
          screenshots: {
            fold: path.relative(process.cwd(), foldShotPath),
            full: path.relative(process.cwd(), fullShotPath),
          },
        };

        fullReport.results[key] = routeResult;

        // Aggregate summary
        const summary = fullReport.summaryByWidth[width];
        summary.routesAudited++;
        summary.consoleErrors += routeResult.consoleErrors.length;
        summary.consoleWarnings += routeResult.consoleWarnings.length;
        if (audit.hasOverflow) summary.overflowRoutes++;
        summary.smallInteractivesTotal += audit.smallInteractiveCount;
        summary.smallTextsTotal += audit.smallTextCount;
        summary.brokenImagesTotal += audit.brokenImages.length;
        summary.stickyOverlapsTotal += audit.overlaps.length;

        console.log(
          `  -> [${route.slug}] Overflow: ${audit.hasOverflow ? 'YES (' + audit.scrollWidth + 'px)' : 'No'} | SmallButtons: ${audit.smallInteractiveCount} | Text<12px: ${audit.smallTextCount} | BrokenImgs: ${audit.brokenImages.length} | Overlaps: ${audit.overlaps.length} | Warnings: ${routeResult.consoleWarnings.length}`
        );

        await context.close();
      }
    }
  } finally {
    await browser.close();
    if (serverProcess) {
      console.log('[QA] Shutting down spawned server process...');
      serverProcess.kill();
    }
  }

  // Write report.json
  const reportJsonPath = path.join(OUTPUT_DIR, 'report.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(fullReport, null, 2), 'utf-8');
  console.log(`\n[QA] Detailed JSON report written to: ${reportJsonPath}`);

  // Print Markdown Table Summary
  console.log('\n========================================================================');
  console.log('                 OBJECTIVE QA HARNESS SUMMARY TABLE                     ');
  console.log('========================================================================\n');

  console.log(
    '| Width | Audited | Overflow Pages | Small Interactive (<40px) | Font <12px | Broken Imgs | Overlaps | Console Warn/Err |'
  );
  console.log(
    '|:-----:|:-------:|:--------------:|:--------------------------:|:----------:|:-----------:|:--------:|:----------------:|'
  );

  for (const width of WIDTHS) {
    const s = fullReport.summaryByWidth[width];
    console.log(
      `| ${width}px | ${s.routesAudited} | ${s.overflowRoutes} | ${s.smallInteractivesTotal} | ${s.smallTextsTotal} | ${s.brokenImagesTotal} | ${s.stickyOverlapsTotal} | ${s.consoleWarnings}w / ${s.consoleErrors}e |`
    );
  }

  console.log('\n[QA] Harness execution complete.');
}

main().catch((err) => {
  console.error('[QA] Fatal Error:', err);
  process.exit(1);
});
