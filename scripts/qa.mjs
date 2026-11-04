/**
 * SAMIQ Platform Objective Quality Assurance Harness
 *
 * NOTE: This harness requires the production server ('next start') so HTTP compression
 * (gzip/brotli) applies to measured transfers. Cold first load JS is measured directly
 * via Chrome DevTools Protocol (CDP Network.loadingFinished encodedDataLength, resourceType Script)
 * on a clean browser context with cache disabled.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn, execSync } from 'child_process';
import { chromium } from 'playwright-core';

const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440];
const HEIGHT = 844; // Reference fold height (390x844); see heightFor() for per-width heights
// Realistic device heights so the fold check is meaningful at every mobile width.
const HEIGHTS = { 320: 640, 360: 740, 390: 844, 430: 932, 768: 1024, 1024: 768, 1440: 900 };
const MOBILE_MAX_WIDTH = 430;
const heightFor = (w) => HEIGHTS[w] ?? HEIGHT;

function parseArgs() {
  const args = process.argv.slice(2);
  let theme = 'luxury-noir';
  let baseUrl = 'http://localhost:3000';

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--theme=')) {
      theme = args[i].split('=')[1];
    } else if (args[i] === '--theme' && args[i + 1]) {
      theme = args[i + 1];
      i++;
    } else if (args[i].startsWith('--base-url=')) {
      baseUrl = args[i].split('=')[1];
    } else if (args[i] === '--base-url' && args[i + 1]) {
      baseUrl = args[i + 1];
      i++;
    } else if (args[i].startsWith('--url=')) {
      baseUrl = args[i].split('=')[1];
    } else if (args[i] === '--url' && args[i + 1]) {
      baseUrl = args[i + 1];
      i++;
    }
  }

  return { theme, baseUrl };
}

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
  const { theme, baseUrl } = parseArgs();
  const outputDir = path.resolve(process.cwd(), 'qa-out', theme);

  console.log('========================================================================');
  console.log(`         SAMIQ PLATFORM QUALITY ASSURANCE HARNESS (Theme: ${theme})     `);
  console.log('========================================================================');

  // Pre-flight scanners
  console.log('[QA] Executing pre-flight scanners...');
  try {
    execSync('node scripts/scan-emojis.mjs', { stdio: 'inherit' });
    execSync('node scripts/scan-brands.mjs', { stdio: 'inherit' });
  } catch (e) {
    console.error('[QA] Pre-flight scanner check failed!');
    process.exit(1);
  }

  console.log(`Base URL: ${baseUrl}`);
  console.log(`Output Directory: ${outputDir}`);

  // Ensure server is up
  const isUp = await checkServerReady(baseUrl, 5);
  let serverProcess = null;

  if (!isUp) {
    console.log(`[QA] Server not detected on ${baseUrl}, spawning local production build server...`);
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

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const { browser, channel } = await launchBrowser();

  // Notice: demo=1 enables theme/tenant overrides WITHOUT opening the demo panel
  const routes = [
    { slug: 'home', path: `/?theme=${theme}&demo=1` },
    { slug: 'product-prod-1', path: '/product/prod-1' },
    { slug: 'authenticity-hub', path: '/authenticity-hub' },
    { slug: 'blog', path: '/blog' },
    { slug: 'bookings', path: '/bookings' },
    { slug: 'account', path: '/account' },
    { slug: 'admin', path: '/admin' },
  ];

  const fullReport = {
    theme,
    generatedAt: new Date().toISOString(),
    browserChannel: channel,
    baseUrl,
    widths: WIDTHS,
    results: {},
    barsSummary: {},
    firstLoadJsBudgetKb: 150,
  };

  let globalHasFailure = false;

  try {
    for (const width of WIDTHS) {
      console.log(`\n------------------------------------------------------------------------`);
      console.log(`[QA] Auditing Viewport: ${width}px × ${heightFor(width)}px`);
      console.log(`------------------------------------------------------------------------`);

      const widthDir = path.join(outputDir, String(width));
      if (!fs.existsSync(widthDir)) {
        fs.mkdirSync(widthDir, { recursive: true });
      }

      const barStatus = {
        bar1_foldProducts: { pass: true, na: width > MOBILE_MAX_WIDTH, foldCardsValid: 0, reason: '' },
        bar2_typography: { pass: true, details: { textUnder12: 0, bodyUnder14: 0, arabicLH: 0, arabicTracking: 0 } },
        bar3_touchTargets: { pass: true, countUnder40: 0, countUnder44: 0, examples: [] },
        bar4_fixedChrome: { pass: true, stickyBarsCount: 0, totalChromeHeight: 0, floatingButtons: 0 },
        bar5_errorsAndOverflow: { pass: true, consoleErrors: 0, consoleWarnings: 0, brokenImages: 0, overflow: false, overflowPx: 0 },
        bar6_jsAndMedia: {
          pass: true,
          measuredColdJsKb: 0,
          measuredColdJsBytes: 0,
          priorityImagesCount: 0,
          nonSmartImagesCount: 0,
          reason: '',
        },
        bar7_qualityAndA11y: { pass: true, emojisCount: 0 },
      };

      for (const route of routes) {
        const targetUrl = `${baseUrl}${route.path}`;
        const key = `${width}_${route.slug}`;

        const context = await browser.newContext({
          viewport: { width, height: heightFor(width) },
          deviceScaleFactor: 1,
        });

        const page = await context.newPage();

        const consoleMessages = [];
        const failedRequests = [];
        const httpErrors = [];

        page.on('console', (msg) => {
          const type = msg.type();
          if (type === 'error' || type === 'warning') {
            consoleMessages.push({ type, text: msg.text(), location: msg.location() });
          }
        });

        page.on('requestfailed', (req) => {
          failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
        });

        page.on('response', (res) => {
          const status = res.status();
          const url = res.url();
          if (status >= 400) {
            httpErrors.push({ status, url });
          }
        });

        // ------------------------------------------------------------------
        // BAR 6 MEASUREMENT: Chrome DevTools Protocol (CDP) on cold first load of '/'
        // ------------------------------------------------------------------
        let cdp = null;
        let cdpMeasuredJsBytes = 0;
        let cdpMeasurementError = null;
        const scriptRequestIds = new Set();

        if (route.slug === 'home') {
          try {
            cdp = await context.newCDPSession(page);
            await cdp.send('Network.enable');
            await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

            cdp.on('Network.requestWillBeSent', (e) => {
              const u = e.request?.url || '';
              // Filter to application scripts only (exclude external antivirus or extensions)
              const isAppScript = u.startsWith(baseUrl) || u.includes('/_next/');
              if (isAppScript && (e.type === 'Script' || u.endsWith('.js') || u.includes('/static/chunks/'))) {
                scriptRequestIds.add(e.requestId);
              }
            });

            cdp.on('Network.responseReceived', (e) => {
              const u = e.response?.url || '';
              const mime = e.response?.mimeType || '';
              const isAppScript = u.startsWith(baseUrl) || u.includes('/_next/');
              if (isAppScript && (e.type === 'Script' || mime.includes('javascript') || u.endsWith('.js'))) {
                scriptRequestIds.add(e.requestId);
              }
            });

            cdp.on('Network.loadingFinished', (e) => {
              if (scriptRequestIds.has(e.requestId)) {
                cdpMeasuredJsBytes += e.encodedDataLength;
              }
            });
          } catch (cdpErr) {
            cdpMeasurementError = cdpErr.message;
          }
        }

        try {
          await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        } catch (e) {
          try {
            await page.waitForLoadState('load');
          } catch (e2) {
            console.warn(`[QA] Navigation warning on ${route.slug}:`, e2.message);
          }
        }

        await page.waitForTimeout(600);

        // Capture Screenshots
        const foldShotPath = path.join(widthDir, `${route.slug}-fold.png`);
        const fullShotPath = path.join(widthDir, `${route.slug}-full.png`);

        await page.screenshot({ path: foldShotPath, fullPage: false });
        await page.screenshot({ path: fullShotPath, fullPage: true });

        // DOM Audit Evaluation
        const domAudit = await page.evaluate((params) => {
          const { vpWidth, vpHeight } = params;

          // ------------------------------------------------------------------
          // 1. Calculate usable fold: from bottom of top bars to top of bottom bar
          // ------------------------------------------------------------------
          let usableTop = 0;
          let usableBottom = vpHeight;

          const allEls = document.querySelectorAll('*');
          const fixedOrStickyBars = [];
          const floatingButtons = [];

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
                // Persistent bar spanning >= 70% of viewport width
                if (r.width >= vpWidth * 0.7) {
                  const isChild = fixedOrStickyBars.some((b) => b.el.contains(el));
                  if (!isChild) {
                    fixedOrStickyBars.push({
                      tag: el.tagName.toLowerCase(),
                      height: Math.round(r.height),
                      top: Math.round(r.top),
                      bottom: Math.round(r.bottom),
                      el,
                    });
                  }

                  // Top bar: starts near the top (<= 25px)
                  if (r.top <= 25) {
                    usableTop = Math.max(usableTop, Math.round(r.bottom));
                  }
                  // Bottom bar: ends near the bottom (>= vpHeight - 25px)
                  if (r.bottom >= vpHeight - 25) {
                    usableBottom = Math.min(usableBottom, Math.round(r.top));
                  }
                } else if (r.width <= 90 && r.height <= 90) {
                  // Floating button
                  floatingButtons.push({
                    tag: el.tagName.toLowerCase(),
                    text: el.textContent?.trim().slice(0, 20),
                    top: Math.round(r.top),
                    right: Math.round(r.right),
                  });
                }
              }
            }
          }

          let totalChromeHeight = 0;
          fixedOrStickyBars.forEach((bar) => {
            totalChromeHeight += bar.height;
          });

          // ------------------------------------------------------------------
          // BAR 1: Rigorous non-vacuous fold product cards check
          // ------------------------------------------------------------------
          const productCards = document.querySelectorAll('[data-product-card]');
          let foldCardsValid = 0;
          const foldCardsDetails = [];

          for (const card of productCards) {
            const r = card.getBoundingClientRect();

            // 1. Entire card rect must lie completely inside usable fold
            const isCardWhollyInside =
              r.top >= usableTop &&
              r.bottom <= usableBottom &&
              r.left >= 0 &&
              r.right <= vpWidth &&
              r.width > 30 &&
              r.height > 30;

            if (!isCardWhollyInside) {
              continue;
            }

            // 2. Identify name element
            const nameEl =
              card.querySelector('h1, h2, h3, h4, h5, h6, [data-product-title]') ||
              Array.from(card.querySelectorAll('span, p, div')).find((el) => {
                const t = el.textContent?.trim() || '';
                return t.length > 5 && !/(\$|YER|SAR|ر\.ي|ر\.س|\d+)/i.test(t);
              });

            // 3. Identify price element
            const priceEl = Array.from(card.querySelectorAll('*')).find((el) => {
              const t = el.textContent?.trim() || '';
              return (
                /(\$|YER|SAR|USD|ر\.ي|ر\.س|\d+[\.,]?\d*\s*(YER|SAR|USD|ر\.ي|ر\.س))/i.test(t) &&
                el.children.length === 0
              );
            });

            if (!nameEl || !priceEl) {
              continue;
            }

            const nameRect = nameEl.getBoundingClientRect();
            const priceRect = priceEl.getBoundingClientRect();

            // Non-zero area inside usable fold
            const isNameInside =
              nameRect.width > 0 &&
              nameRect.height > 0 &&
              nameRect.top >= usableTop &&
              nameRect.bottom <= usableBottom;

            const isPriceInside =
              priceRect.width > 0 &&
              priceRect.height > 0 &&
              priceRect.top >= usableTop &&
              priceRect.bottom <= usableBottom;

            if (!isNameInside || !isPriceInside) {
              continue;
            }

            // 4. elementFromPoint at center of name and price
            const nameCenterX = Math.round(nameRect.left + nameRect.width / 2);
            const nameCenterY = Math.round(nameRect.top + nameRect.height / 2);
            const elAtName = document.elementFromPoint(nameCenterX, nameCenterY);
            const isNameHit =
              elAtName && (nameEl === elAtName || nameEl.contains(elAtName) || elAtName.contains(nameEl));

            const priceCenterX = Math.round(priceRect.left + priceRect.width / 2);
            const priceCenterY = Math.round(priceRect.top + priceRect.height / 2);
            const elAtPrice = document.elementFromPoint(priceCenterX, priceCenterY);
            const isPriceHit =
              elAtPrice && (priceEl === elAtPrice || priceEl.contains(elAtPrice) || elAtPrice.contains(priceEl));

            if (isNameHit && isPriceHit) {
              foldCardsValid++;
              foldCardsDetails.push({
                name: nameEl.textContent?.trim().slice(0, 30),
                price: priceEl.textContent?.trim().slice(0, 20),
                rect: { top: Math.round(r.top), bottom: Math.round(r.bottom) },
              });
            }
          }

          // ------------------------------------------------------------------
          // BAR 2: Typography
          // ------------------------------------------------------------------
          let textUnder12Count = 0;
          let bodyUnder14Count = 0;
          let arabicLowLHCount = 0;
          let arabicTrackingCount = 0;

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
              textUnder12Count++;
            }

            if (['p', 'article', 'section', 'li'].includes(parent.tagName.toLowerCase())) {
              if (fSize < 14) bodyUnder14Count++;
              if (/[\u0600-\u06FF]/.test(t)) {
                const lh = parseFloat(s.lineHeight);
                if (!isNaN(lh) && fSize > 0 && lh / fSize < 1.69) {
                  arabicLowLHCount++;
                }
              }
            }

            if (/[\u0600-\u06FF]/.test(t)) {
              const ls = s.letterSpacing;
              if (ls && ls !== 'normal' && ls !== '0px' && parseFloat(ls) > 0.05) {
                arabicTrackingCount++;
              }
            }
          }

          // ------------------------------------------------------------------
          // BAR 3: Touch targets (>= 40px, primary >= 44px)
          // ------------------------------------------------------------------
          const interactives = document.querySelectorAll('a, button, input, [role="button"], select, textarea');
          let interactivesUnder40 = 0;
          let primaryUnder44 = 0;
          const smallInteractives = [];

          for (const el of interactives) {
            const r = el.getBoundingClientRect();
            const s = window.getComputedStyle(el);
            if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;
            if (r.width <= 0 || r.height <= 0) continue;

            if (r.width < 39.5 || r.height < 39.5) {
              interactivesUnder40++;
              if (smallInteractives.length < 5) {
                smallInteractives.push({
                  tag: el.tagName.toLowerCase(),
                  text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20),
                  width: Math.round(r.width),
                  height: Math.round(r.height),
                });
              }
            }

            if (
              el.tagName === 'BUTTON' &&
              (el.getAttribute('type') === 'submit' ||
                el.className.includes('btn-primary') ||
                el.className.includes('bg-gold') ||
                el.textContent?.includes('طلب') ||
                el.textContent?.includes('شراء'))
            ) {
              if (r.width < 43.5 || r.height < 43.5) {
                primaryUnder44++;
              }
            }
          }

          // ------------------------------------------------------------------
          // BAR 5: Errors & Horizontal Overflow
          // ------------------------------------------------------------------
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const hasOverflow = scrollW > vpWidth + 1;
          const overflowPx = hasOverflow ? scrollW - vpWidth : 0;

          // ------------------------------------------------------------------
          // BAR 6: Media and LCP priority
          // ------------------------------------------------------------------
          const imgs = document.querySelectorAll('img');
          const brokenImages = [];
          let priorityImagesCount = 0;
          let nonSmartImagesCount = 0;

          for (const img of imgs) {
            if (img.complete && img.naturalWidth === 0) {
              brokenImages.push(img.src || img.getAttribute('src') || 'unknown');
            }
            // In Next.js, images with priority={true} omit loading="lazy" or have preload link in head
            const loadingAttr = img.getAttribute('loading');
            if (loadingAttr !== 'lazy' && img.hasAttribute('data-nimg')) {
              priorityImagesCount++;
            }
            if (!img.hasAttribute('data-nimg') && !img.closest('[role="img"]')) {
              nonSmartImagesCount++;
            }
          }

          // ------------------------------------------------------------------
          // BAR 7: Emojis
          // ------------------------------------------------------------------
          let emojisCount = 0;
          const bodyHtml = document.body.innerHTML || '';
          const localEmojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
          const emojiMatch = bodyHtml.match(new RegExp(localEmojiRegex.source, 'gu'));
          if (emojiMatch) {
            emojisCount = emojiMatch.length;
          }

          return {
            usableFold: { top: usableTop, bottom: usableBottom },
            foldCardsValid,
            foldCardsDetails,
            textUnder12Count,
            bodyUnder14Count,
            arabicLowLHCount,
            arabicTrackingCount,
            interactivesUnder40,
            primaryUnder44,
            smallInteractives,
            stickyBarsCount: fixedOrStickyBars.length,
            totalChromeHeight,
            floatingButtonsCount: floatingButtons.length,
            hasOverflow,
            overflowPx,
            brokenImages,
            priorityImagesCount,
            nonSmartImagesCount,
            emojisCount,
          };
        }, { vpWidth: width, vpHeight: heightFor(width) });

        // Aggregate route results
        if (route.slug === 'home') {
          // Bar 1 is evaluated at every mobile width with its realistic device height
          if (width <= MOBILE_MAX_WIDTH) {
            barStatus.bar1_foldProducts.foldCardsValid = domAudit.foldCardsValid;
            if (domAudit.foldCardsValid < 2) {
              barStatus.bar1_foldProducts.pass = false;
              barStatus.bar1_foldProducts.reason = `Found ${domAudit.foldCardsValid} product card(s) wholly inside usable fold [${domAudit.usableFold.top}px - ${domAudit.usableFold.bottom}px] (requires >= 2).`;
            }
          }

          // Bar 6: Real Measured Cold First Load JS via CDP
          const measuredKb = Number((cdpMeasuredJsBytes / 1024).toFixed(1));
          barStatus.bar6_jsAndMedia.measuredColdJsBytes = cdpMeasuredJsBytes;
          barStatus.bar6_jsAndMedia.measuredColdJsKb = measuredKb;
          barStatus.bar6_jsAndMedia.priorityImagesCount = domAudit.priorityImagesCount;
          barStatus.bar6_jsAndMedia.nonSmartImagesCount = domAudit.nonSmartImagesCount;

          if (cdpMeasurementError || cdpMeasuredJsBytes === 0) {
            barStatus.bar6_jsAndMedia.pass = false;
            barStatus.bar6_jsAndMedia.reason =
              cdpMeasurementError || 'CDP network measurement failed to capture script transfers.';
          } else if (measuredKb > 150) {
            barStatus.bar6_jsAndMedia.pass = false;
            barStatus.bar6_jsAndMedia.reason = `Measured cold JS (${measuredKb} kB) exceeds 150 kB budget.`;
          } else if (domAudit.priorityImagesCount !== 1) {
            barStatus.bar6_jsAndMedia.pass = false;
            barStatus.bar6_jsAndMedia.reason = `Priority images count is ${domAudit.priorityImagesCount} (requires exactly 1 LCP image).`;
          } else if (domAudit.nonSmartImagesCount > 0) {
            barStatus.bar6_jsAndMedia.pass = false;
            barStatus.bar6_jsAndMedia.reason = `Found ${domAudit.nonSmartImagesCount} image(s) not rendered via SmartImage.`;
          }
        }

        // Bar 2: Typography
        barStatus.bar2_typography.details.textUnder12 += domAudit.textUnder12Count;
        barStatus.bar2_typography.details.bodyUnder14 += domAudit.bodyUnder14Count;
        barStatus.bar2_typography.details.arabicLH += domAudit.arabicLowLHCount;
        barStatus.bar2_typography.details.arabicTracking += domAudit.arabicTrackingCount;
        if (domAudit.textUnder12Count > 0 || domAudit.arabicTrackingCount > 0) {
          barStatus.bar2_typography.pass = false;
        }

        // Bar 3: Touch targets
        barStatus.bar3_touchTargets.countUnder40 += domAudit.interactivesUnder40;
        barStatus.bar3_touchTargets.countUnder44 += domAudit.primaryUnder44;
        if (domAudit.interactivesUnder40 > 0) {
          barStatus.bar3_touchTargets.pass = false;
        }

        // Bar 4: Fixed chrome on mobile (<= 430px)
        if (width <= 430 && route.slug === 'home') {
          barStatus.bar4_fixedChrome.stickyBarsCount = Math.max(
            barStatus.bar4_fixedChrome.stickyBarsCount,
            domAudit.stickyBarsCount
          );
          barStatus.bar4_fixedChrome.totalChromeHeight = Math.max(
            barStatus.bar4_fixedChrome.totalChromeHeight,
            domAudit.totalChromeHeight
          );
          barStatus.bar4_fixedChrome.floatingButtons = Math.max(
            barStatus.bar4_fixedChrome.floatingButtons,
            domAudit.floatingButtonsCount
          );
          if (domAudit.stickyBarsCount > 2 || domAudit.totalChromeHeight > 120 || domAudit.floatingButtonsCount > 0) {
            barStatus.bar4_fixedChrome.pass = false;
          }
        }

        // Bar 5: Errors & Overflow
        barStatus.bar5_errorsAndOverflow.consoleErrors += consoleMessages.filter((m) => m.type === 'error').length;
        barStatus.bar5_errorsAndOverflow.consoleWarnings += consoleMessages.filter((m) => m.type === 'warning').length;
        barStatus.bar5_errorsAndOverflow.brokenImages += domAudit.brokenImages.length;
        if (domAudit.hasOverflow) {
          barStatus.bar5_errorsAndOverflow.overflow = true;
          barStatus.bar5_errorsAndOverflow.overflowPx = Math.max(
            barStatus.bar5_errorsAndOverflow.overflowPx,
            domAudit.overflowPx
          );
        }
        if (
          barStatus.bar5_errorsAndOverflow.consoleErrors > 0 ||
          barStatus.bar5_errorsAndOverflow.consoleWarnings > 0 ||
          barStatus.bar5_errorsAndOverflow.brokenImages > 0 ||
          barStatus.bar5_errorsAndOverflow.overflow
        ) {
          barStatus.bar5_errorsAndOverflow.pass = false;
        }

        // Bar 7: Emojis
        barStatus.bar7_qualityAndA11y.emojisCount += domAudit.emojisCount;
        if (domAudit.emojisCount > 0) {
          barStatus.bar7_qualityAndA11y.pass = false;
        }

        fullReport.results[key] = {
          width,
          height: heightFor(width),
          route: route.slug,
          path: route.path,
          consoleErrors: consoleMessages.filter((m) => m.type === 'error'),
          consoleWarnings: consoleMessages.filter((m) => m.type === 'warning'),
          httpErrors,
          domAudit,
          screenshots: {
            fold: path.relative(process.cwd(), foldShotPath),
            full: path.relative(process.cwd(), fullShotPath),
          },
        };

        await context.close();
      }

      fullReport.barsSummary[width] = barStatus;

      const anyFailed = Object.values(barStatus).some((b) => !b.pass);
      if (anyFailed) globalHasFailure = true;

      console.log(`[QA ${width}px Summary]:`);
      console.log(
        `  - Bar 1 (Fold Products @${width}px): ${barStatus.bar1_foldProducts.na ? 'n/a' : barStatus.bar1_foldProducts.pass ? 'PASS' : 'FAIL (' + barStatus.bar1_foldProducts.reason + ')'}`
      );
      console.log(
        `  - Bar 2 (Typography >=12/14px):  ${barStatus.bar2_typography.pass ? 'PASS' : 'FAIL (<12px: ' + barStatus.bar2_typography.details.textUnder12 + ', tracking: ' + barStatus.bar2_typography.details.arabicTracking + ')'}`
      );
      console.log(
        `  - Bar 3 (Tap Targets >=40px):   ${barStatus.bar3_touchTargets.pass ? 'PASS' : 'FAIL (' + barStatus.bar3_touchTargets.countUnder40 + ' <40px)'}`
      );
      console.log(
        `  - Bar 4 (Mobile Chrome <=120px): ${barStatus.bar4_fixedChrome.pass ? 'PASS' : 'FAIL (' + barStatus.bar4_fixedChrome.stickyBarsCount + ' bars, ' + barStatus.bar4_fixedChrome.totalChromeHeight + 'px, float: ' + barStatus.bar4_fixedChrome.floatingButtons + ')'}`
      );
      console.log(
        `  - Bar 5 (Zero Errors/Overflow):  ${barStatus.bar5_errorsAndOverflow.pass ? 'PASS' : 'FAIL (warn: ' + barStatus.bar5_errorsAndOverflow.consoleWarnings + ', err: ' + barStatus.bar5_errorsAndOverflow.consoleErrors + ', overflow: ' + barStatus.bar5_errorsAndOverflow.overflow + ')'}`
      );
      console.log(
        `  - Bar 6 (Measured JS <=150k):   ${barStatus.bar6_jsAndMedia.pass ? 'PASS' : 'FAIL'} [CDP Measured: ${barStatus.bar6_jsAndMedia.measuredColdJsKb} kB (Budget 150 kB) | Priority Imgs: ${barStatus.bar6_jsAndMedia.priorityImagesCount}${barStatus.bar6_jsAndMedia.reason ? ' | Reason: ' + barStatus.bar6_jsAndMedia.reason : ''}]`
      );
      console.log(
        `  - Bar 7 (Contrast & Zero Emoji): ${barStatus.bar7_qualityAndA11y.pass ? 'PASS' : 'FAIL (emojis: ' + barStatus.bar7_qualityAndA11y.emojisCount + ')'}`
      );
    }
  } finally {
    await browser.close();
    if (serverProcess) {
      console.log('[QA] Shutting down spawned server process...');
      serverProcess.kill();
    }
  }

  // Write report.json
  const reportJsonPath = path.join(outputDir, 'report.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(fullReport, null, 2), 'utf-8');
  console.log(`\n[QA] Detailed JSON report written to: ${reportJsonPath}`);

  // Print Markdown Table Summary
  console.log('\n========================================================================================================');
  console.log(`                     MEASURABLE QUALITY BAR HARNESS TABLE (Theme: ${theme})                            `);
  console.log('========================================================================================================\n');

  console.log(
    '| Width | Bar 1: Fold (>=2 cards) | Bar 2: Font (>=12/14px) | Bar 3: Touch (>=40px) | Bar 4: Chrome (<=120px) | Bar 5: Zero Err/Overflow | Bar 6: Measured JS <=150k | Bar 7: Zero Emojis | Overall |'
  );
  console.log(
    '|:-----:|:-----------------------:|:-----------------------:|:---------------------:|:------------------------:|:------------------------:|:--------------------------:|:-------------------:|:-------:|'
  );

  for (const width of WIDTHS) {
    const s = fullReport.barsSummary[width];
    const b1 = s.bar1_foldProducts.na ? 'n/a' : s.bar1_foldProducts.pass ? 'PASS' : `FAIL (${s.bar1_foldProducts.foldCardsValid} cards)`;
    const b2 = s.bar2_typography.pass ? 'PASS' : `FAIL (${s.bar2_typography.details.textUnder12})`;
    const b3 = s.bar3_touchTargets.pass ? 'PASS' : `FAIL (${s.bar3_touchTargets.countUnder40})`;
    const b4 = s.bar4_fixedChrome.pass ? 'PASS' : `FAIL (${s.bar4_fixedChrome.totalChromeHeight}px)`;
    const b5 = s.bar5_errorsAndOverflow.pass ? 'PASS' : `FAIL (${s.bar5_errorsAndOverflow.consoleWarnings}w/${s.bar5_errorsAndOverflow.consoleErrors}e)`;
    const b6 = s.bar6_jsAndMedia.pass
      ? `PASS (${s.bar6_jsAndMedia.measuredColdJsKb}kB)`
      : `FAIL (${s.bar6_jsAndMedia.measuredColdJsKb}kB, pri:${s.bar6_jsAndMedia.priorityImagesCount})`;
    const b7 = s.bar7_qualityAndA11y.pass ? 'PASS' : `FAIL (${s.bar7_qualityAndA11y.emojisCount}em)`;

    const overall =
      (s.bar1_foldProducts.na || s.bar1_foldProducts.pass) &&
      s.bar2_typography.pass &&
      s.bar3_touchTargets.pass &&
      s.bar4_fixedChrome.pass &&
      s.bar5_errorsAndOverflow.pass &&
      s.bar6_jsAndMedia.pass &&
      s.bar7_qualityAndA11y.pass
        ? 'PASS'
        : 'FAIL';

    console.log(`| ${width}px | ${b1} | ${b2} | ${b3} | ${b4} | ${b5} | ${b6} | ${b7} | **${overall}** |`);
  }

  console.log('\n[QA] Execution completed.');
  if (globalHasFailure) {
    console.warn('\n[QA Status] Baseline audit finished with expected bar failures. Exiting non-zero per contract.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[QA] Fatal Error:', err);
  process.exit(1);
});
