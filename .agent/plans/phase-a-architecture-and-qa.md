# Phase A: Real multi-template architecture + objective QA harness

Read first: `.agent/skills/samiq-architect/SKILL.md` (rules there are binding: zero emojis, logical CSS, no tracking on Arabic, themes only render).

## Why this phase exists (audited facts, do not argue with them)
1. Only ONE template exists (`src/themes/base/luxury-noir`). The "ThemeSwitcher" only swaps colors. The client wants templates that are COMPLETELY DIFFERENT DESIGNS (different layout structure, navigation pattern, typography, product-card form), not color themes.
2. `src/app/page.tsx` hardcodes `LuxuryNoirTheme`. `tenant.themeId` is never used.
3. `src/themes/base/luxury-noir/index.tsx` owns business state (cart, currency, features). Any new template would have to duplicate it. Business state must live in core.
4. Tenant-specific content is hardcoded: skin routine in `page.tsx`, `'prod-1'` guide lookup, shop name inside the WhatsApp message string in the theme, social links / map / address inside `StoreLocationAndSocial.tsx`.
5. Console shows: `beforeinstallprompt.preventDefault() called... banner not shown` and an unused `_next/image` preload warning.
6. This phase changes STRUCTURE only. Do NOT restyle anything. Visual redesign is a later phase.

## Tasks (do in order, small commits)

### A1. Headless storefront core
Create `src/core/storefront/StorefrontProvider.tsx` ('use client') exposing `useStorefront()` returning:
`{ tenant, features, products, categories, currency, setCurrency, formatPrice(prices), cart: { items, count, total, add, setQty, remove, clear, isOpen, open, close }, wishlist: { ids, toggle, has }, search: { query, setQuery, results }, activeCategory, setActiveCategory, whatsapp: { orderUrl(items), productUrl(product) } }`.
- Persist cart + wishlist + currency in `localStorage` (guard SSR, no hydration mismatch: read in `useEffect`).
- `whatsapp.*` builds messages using `tenant.name` and `tenant.whatsapp`. No shop name literals anywhere else.
- Types live in `src/themes/contract/index.ts` (keep it free of any import from db/supabase/modules).

### A2. Theme contract + registry
- Contract: a theme is `{ id, name, description, Layout: React.ComponentType<ThemeLayoutProps> }` where `ThemeLayoutProps = { content: StorefrontContent }` and the theme reads behavior only via `useStorefront()`. Themes keep only pure UI state (drawer open, tab, slider position).
- `src/themes/registry.ts`: `THEMES: Record<ThemeId, { meta, load: () => Promise<{default: ThemeLayout}> }>` using `next/dynamic` / dynamic import so each shop only downloads its own theme. `ThemeId = 'luxury-noir' | 'ivory-journal'` (the second is registered as a stub that renders a clearly labeled "under construction" page for now; it will be built in Phase C).
- `src/app/page.tsx` (server): resolve tenant, load `db`, choose `themeId` = `searchParams.theme` ONLY when `process.env.NODE_ENV !== 'production' || searchParams.demo === '1'`, otherwise `db.tenant.themeId`. Remember: in Next 15 `searchParams` is a Promise in server components.
- Move luxury-noir to the new contract: `luxury-noir/index.tsx` becomes a thin Layout that composes its existing components, which now call `useStorefront()` instead of receiving 10 props. Delete the state/cart code from it.

### A3. Remove fake theming and hardcoded content
- Delete `ThemeSwitcher.tsx` and every usage; delete any localStorage theme-token hack and unused CSS variables for fake themes.
- `FeatureTierSimulator`: stop rendering it on the public storefront. Render it only when `demo=1` is in the URL, as an inline collapsible strip at the very top (NOT a floating button, NOT covering content).
- Move skin routine content out of `page.tsx` into the db (`db.content.skinRoutine`) with the same shape; seed it in `store.ts`. Guide selection: pass the guides map; the theme picks per product, no `'prod-1'` literal.
- Move contact info into `tenant.contact = { whatsapp, phone, social: {tiktok, instagram, facebook}, map: { url, label, city } }` in the db seed and read it from `useStorefront()`. Values (use exactly these):
  - tiktok `https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0` handle `@tamiffttah`
  - instagram `https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53` handle `@tamifttah`
  - facebook `https://www.facebook.com/share/1XjEnK4CeM/`
  - whatsapp/phone `775234989` (international `967775234989`)
  - map `https://maps.app.goo.gl/DxsZTHrv2r386bXa9`
- Add `themeId: 'luxury-noir'` to the tenant seed.

### A4. Console warnings
- PWA: do not call `preventDefault()` on `beforeinstallprompt` unless the app stores the event and exposes its own install button that calls `event.prompt()`. If the custom button exists, keep it; otherwise do not intercept.
- Images: create `src/core/ui/SmartImage.tsx` (aspect-ratio box, `next/image` with real `sizes`, no `priority` except the single LCP image, neutral dark/light blur placeholder, graceful fallback block on error). Replace raw/other usages. Configure `images.remotePatterns` for the hosts actually used. No unused preloads.

### A5. Objective QA harness (the most important deliverable)
Create `scripts/qa.mjs` (Node, Playwright; launch with `channel: 'chrome'`, fallback `msedge`; do not download browsers unless both are missing, and tell me if you had to).
For each width in `[320, 360, 390, 430, 768, 1024, 1440]`, for each URL in `/`, `/?theme=luxury-noir`, `/product/prod-1`, `/authenticity-hub`, `/blog`, `/bookings`, `/account`, `/admin`:
- Collect console errors and warnings.
- `horizontalOverflow`: `document.documentElement.scrollWidth > window.innerWidth`, plus list the first 5 elements whose `getBoundingClientRect().right` exceeds viewport width (selector + width).
- Visible interactive elements (a, button, input, [role=button]) with width or height under 40px: count + first 5 selectors.
- Visible text nodes with computed font-size under 12px: count + first 5 samples.
- Images with `naturalWidth === 0` or failed requests (404/blocked).
- Elements overlapping the fixed bottom nav or each other when fixed/sticky (list fixed elements with their rects; flag intersections).
- Save screenshots to `qa-out/<w>/<slug>-fold.png` (viewport only) and `qa-out/<w>/<slug>-full.png`.
- Write `qa-out/report.json` and print a compact markdown table summary per width. Add `qa-out/` to `.gitignore`.
Add `npm run qa` script.

## Execution rules
- Never run `next build` while `next dev` is running (they corrupt `.next`). Stop dev, build, restart dev.
- Evidence or it did not happen: in your final report paste the real output of `npx tsc --noEmit`, `npm run build`, the emoji scan, and the `npm run qa` summary table. Report failures and anything you skipped honestly; do not write "100% perfect".
- Commit locally with clear messages. Do NOT push and do NOT deploy in this phase.
- Keep functions small (clean-code-guard). No mock success returns. No emojis. Logical CSS only.

## Final report format
1. What changed (file list).
2. Real command outputs.
3. QA summary table across widths for the CURRENT luxury-noir design (this is the baseline of defects for Phase B).
4. Anything you could not do and why.
