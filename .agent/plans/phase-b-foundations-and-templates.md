# Phase B: shared foundations (B0), then three fully different templates (B1, B2, B3)

Binding rules: `.agent/skills/samiq-architect/SKILL.md`. Evidence-based reporting: paste real command output, list what you skipped, never write "perfect". No push, no deploy.

Context from the audit of the current `luxury-noir` at 390x844 (screenshot `qa-out/390/home-fold.png`):
- Three stacked bars (utility strip, header, category chips) eat about 145px before any content.
- A text-only hero eats another 280px. Products are still NOT visible in the first screen.
- The hero photo is an off-brand grey stock photo that clashes with the black/gold identity. Product photos do not match product names.
- Floating AI button overlaps content. Translucent bottom nav blurs over content with weak label contrast.
- QA baseline: 101-118 tap targets under 40px, 135-189 text nodes under 12px per page set.

## Measurable quality bar (applies to every template, enforced by `npm run qa`)
1. At 390x844, the fold must show at least 2 product cards with name and price visible. Every product card root carries `data-product-card`.
2. No visible text under 12px. Body text 14px+. Arabic body line-height 1.7+. Zero `letter-spacing` on Arabic text.
3. Every interactive element 40x40 minimum, primary actions 44x44.
4. At most 2 fixed/sticky bars on mobile, total fixed chrome height 120px or less (including safe-area padding). No floating buttons that cover content.
5. Zero console errors or warnings, zero broken images, zero horizontal overflow at 320, 360, 390, 430, 768, 1024, 1440.
6. First Load JS of `/` under 150 kB per template. Exactly one image with `priority` (the LCP image). All images through `SmartImage`.
7. Contrast 4.5:1 for text. Visible keyboard focus. `prefers-reduced-motion` respected. Logical CSS properties only. Zero emojis.

---

## B0: Shared foundations (one agent, do this first, then report)

1. **Media wiring.** The three hero photos already exist in `public/media/hero/` (hero-noir.jpg, hero-ivory.jpg, hero-clinic.jpg). The six product packshots could NOT be generated (image quota exhausted for hours). The owner will generate them externally and drop them into `public/media/products/` with these exact names: serum-vitamin-c.jpg, cleanser-hydrating.jpg, serum-niacinamide.jpg, lipstick-couture.jpg, eyeshadow-palette.jpg, cream-moisturizing.jpg (square, warm greige studio backdrop). Until then create TEMPORARY placeholder files with those exact names (use `sharp`, which ships with Next: 1200x1200, soft warm greige gradient #CFC8BE to #B9B1A6, plus a simple centered rounded-rectangle silhouette in a slightly darker tone, no text) so layouts can be built and QA'd; mark them in `public/media/products/PLACEHOLDERS.md` so we know to overwrite them. Do not use stock photos. Point the seed (`src/core/db/store.ts`, `data/samiq-db.json`, `mockData.ts`) at these local paths: prod-1 serum-vitamin-c, prod-2 cleanser-hydrating, prod-3 serum-niacinamide, prod-4 lipstick-couture, prod-5 eyeshadow-palette, prod-6 cream-moisturizing. Add `heroImages: { noir, ivory, clinic }` to the tenant record. Remove `images.unsplash.com` from remotePatterns when nothing uses it anymore.
2. **Neutral catalog naming.** The photos are brand-neutral, so remove real brand names (CeraVe, The Ordinary, La Roche-Posay, YSL) from seed product titles, category titles and block data. Categories become: "السيرومات", "المنظفات والمرطبات", "المكياج", "العناية بالبشرة". Keep descriptive Arabic titles and the concentration/ingredient info. The client will enter real brands later from the admin panel.
3. **Headless hooks in core** (move logic out of luxury-noir components, no styling):
   - `useAdvisorChat()` in `src/core/storefront/` (messages, send, loading, suggested product cards, handoff flag) calling `/api/ai/chat`.
   - `useBatchVerifier()` (input, verify, result states) calling `/api/store/authenticity`.
   - `useCheckout()` (delivery zone, coupon, payment method, totals, submit order, whatsapp redirect) from the logic currently inside `WhatsAppCartDrawer.tsx`.
   - A `ProductQuickInfo` selector helper that returns display fields (price in current currency, badges, ingredients/concentration if present).
   luxury-noir components then consume these hooks.
4. **Data attributes.** `data-product-card` on card roots. `data-testid` on cart button, search button, menu button, bottom nav, header.
5. **Upgrade `scripts/qa.mjs`**: accept `--theme=<id>` (uses `?theme=<id>&demo=1` on `/`), implement the 7 numbered bar items above as assertions, print PASS/FAIL per item per width, write `qa-out/<theme>/<width>/...` screenshots, exit non-zero on failure. Also measure `/` First Load JS from the build output or via network transfer sizes.
6. **Investigate and fix** the single 404 recorded on `/product/prod-1` at 320px.
7. Run `npx tsc --noEmit`, build (stop dev first), emoji scan. Commit locally.

---

## B1: `luxury-noir` rebuilt as an app-first dark template (owns ONLY `src/themes/base/luxury-noir/**`)

Identity: obsidian #070709, surfaces #0E0E12, gold gradient per SKILL.md, ivory text. Amiri for display, IBM Plex Sans Arabic for UI. Feels like a native shopping app.

Mobile structure, top to bottom:
1. ONE header, 56px: logo mark + shop name on one line, search icon, cart icon. A menu button opens a full bottom sheet "More" that contains: currency switcher, branches/location, social links, language placeholder, PWA install, contact. The current utility strip is deleted.
2. Sticky category chips row, 44px, directly under the header (these two are the only top fixed chrome). Active chip uses a soft gold glass look, no solid yellow blocks, no dots.
3. Compact hero banner, 180-220px high, `hero-noir.jpg` as background with a dark gradient, ONE headline line, ONE short sub line, ONE primary button. No badge pills, no trust row.
4. "الأكثر طلبا" horizontal snap rail of product cards (card width about 150px, image, 2-line name, price, 44px add button). This rail must be inside the first screen at 390x844.
5. Full 2-column product grid.
6. Trust strip as one compact row under the grid (not above products).
7. Authenticity block: a verifier card with one batch-code field and a result area, plus a link to the comparison slider section.
8. Category grid, routine block, contact/social/map section, footer.
9. Bottom nav: opaque #0A0A0D, 56px plus safe-area, 5 equal columns, active item shown by a gold top line and colored icon (no circles, no blur over content). The AI advisor is a header icon opening a bottom sheet (no floating button).
Desktop: header with inline nav and search field, 2-column hero, product grid 4 columns, sticky cart drawer on the side.

---

## B2: `ivory-journal`, an editorial magazine template (owns ONLY `src/themes/base/ivory-journal/**`)

Identity: warm ivory #FAF7F2 paper, espresso #1B1612 text, one muted sage #5E6B5A as secondary, champagne #B89B5E used sparingly for hairlines. Amiri for large display type, IBM Plex Sans Arabic for body. Large photography, generous space, quiet motion. It must not look like the dark template with light colors: different structure, navigation, product card form.

Mobile structure:
1. Header 52px: hamburger on one side, centered wordmark, bag icon with count on the other. The hamburger opens a full-screen overlay menu with large type links (categories, verify a product, contact, currency, social).
2. Full-bleed editorial hero using `hero-ivory.jpg`, about 60dvh, headline in large Amiri over the calm area, one text link style CTA (underlined, not a pill). The photo's empty cream area is on its LEFT, but RTL text starts on the right: mirror the image horizontally (`-scale-x-100` on the image wrapper only, never on the text) so the face sits on the left and the headline sits on the right (start side). Same check for `hero-noir.jpg` (its empty area is on the right, which already matches RTL start, so do not flip it) and `hero-clinic.jpg` (empty area on the right, no flip).
3. "اختيارات الأسبوع" asymmetric two-column mosaic: columns offset vertically, alternating tall (4:5) and short (1:1) images, caption below each image with name and price in small type, a plain "+" add control (44px hit area). First two cards must reach into the first screen via a negative-margin overlap with the hero bottom edge.
4. Large-type category index list (each row a big serif category name with an arrow, full-width tappable rows).
5. One pull-quote or editorial text section (use `rich-text`), the authenticity block as an editorial two-step "Learn to spot the fake" article card with the batch verifier inline.
6. Contact section laid out like a magazine colophon.
Navigation pattern: NO bottom tab bar. When the cart has items show a slim bottom pill "الحقيبة: N · total" (the only fixed bottom element). Product detail opens as a tall bottom sheet quick view with image, description, options, add button.
Desktop: centered wordmark, links split on both sides, hero as split image/text, mosaic 3 columns with offsets.

---

## B3: `clinic-lab`, a clean clinical template (owns ONLY `src/themes/base/clinic-lab/**`; add it to `src/themes/registry.ts` and `ThemeId`)

Identity: white #FFFFFF and mist #F2F7F5, deep teal #0F4C4A text accents, soft mint #CFE8E1, alert coral #D9534F only for the "fake" state. IBM Plex Sans Arabic only (single family, weights 400/500/700). Data-forward, calm, trustworthy, pharmacy-like.

Mobile structure:
1. Header 56px: logo, always-visible search field filling the width under the logo row (the field is part of the header, header total about 104px).
2. Scrollable text tabs under it: "المتجر | روتيني | تحقق من الدفعة | تواصل" (tabs scroll/anchor to sections, no bottom nav at all).
3. Skin-type segmented selector as the FIRST content ("نوع بشرتك": دهنية, جافة, حساسة, الكل) directly followed by the results list. Selection filters products live (use the routine block's skin-type to recommended product ids; fall back to category when absent).
4. Product LIST rows (not a grid): image 88px on the start side, name, 2 ingredient/concentration chips, a verification badge, price and a 44px add button on the end. At least 3 rows visible in the first screen at 390x844.
5. A prominent "تحقق من رقم الدفعة" panel with an input and clear verified/suspicious result states (teal check state, coral warning state), with the comparison slider as a secondary section below.
6. Routine block rendered as step-by-step cards (steps are a true sequence there). Contact section as plain cards.
Desktop: left filter sidebar (skin type, concern, price, availability), results grid 3 columns, sticky summary of cart on the end side.

---

## Execution notes for B1, B2, B3 (run in parallel after B0)
- Each agent edits only its own theme folder plus the single registry line it needs. If you need a shared change, stop and report it instead of editing shared files.
- Every template implements the generic `SectionRenderers` for all section types, its own cart drawer UI using `useCheckout()`, its own search UI using `useStorefront().search`, its own advisor chat UI using `useAdvisorChat()`, and its own verifier UI using `useBatchVerifier()`.
- Final report per template: real `tsc`, build, emoji scan output, and `npm run qa -- --theme=<id>` PASS/FAIL table for all 7 widths, plus the screenshot paths `qa-out/<theme>/390/home-fold.png` and `home-full.png`. Do not claim a bar is met unless the QA table says so.
