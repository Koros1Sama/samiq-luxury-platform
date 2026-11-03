---
name: samiq-architect
description: Core architectural, visual, multi-tenant RLS, and luxury Arabic RTL standards for the SAMIQ platform.
---

# SAMIQ Architecture & Design Directives

## 1. Engine Boundaries & Multi-Tenancy (`core/` vs `themes/`)
- **Theme Isolation:** `src/themes/**` are pure presentational skins. They MUST consume only typed props/slots defined in `src/themes/contract/`. **FORBIDDEN:** Direct imports of `supabase`, `src/core/db`, server actions, or `src/modules/**` inside `themes/**`.
- **Server-Side Data Only:** Client components must never execute raw cross-tenant queries via browser Supabase client. All tenant mutations and queries run in Next.js Server Components / Actions.
- **Tenant Isolation:** Every tenant table MUST have `tenant_id uuid` with strict Postgres RLS: `tenant_id = (auth.jwt() ->> 'tenant_id')::uuid` or `tenant_id = current_tenant_id()`.
- **Dual-Mode Config:** Architecture must dynamically respect `process.env.TENANT_MODE` (`'shared'` = multi-tenant routing via subdomain/slug; `'single'` = single-brand instance).

## 2. Luxury Arabic RTL & Visual Engineering (`luxury-noir` DNA)
- **ZERO EMOJIS & ANTI-AI-SLOP MANDATE (CRITICAL):**
  - **STRICTLY FORBIDDEN:** Never use ANY Unicode emojis (✨, ⚡, 💧, 🛡️, 👑, 🛒, ✅, ❌, etc.) anywhere in UI components, buttons, badges, chat, or dashboards. Emojis instantly turn luxury UI into cheap "AI slop".
  - **MANDATORY REPLACEMENT:** Use exclusively ultra-thin monoline bespoke SVG icons (`strokeWidth={1.25}`, `#C9A84C` / `#E6CFA0`) and high-fashion editorial photography/textures. Avoid cheesy cartoon CSS shapes for bottles; use realistic photographic assets with subtle lighting overlays.
- **Typography:**
  - Display/H1–H2 Headings: Royal Arabic Serif (`font-serif` -> `Amiri` / `Noto Naskh Arabic`).
  - UI/Body/Numbers: Geometric Arabic Sans (`font-sans` -> `IBM Plex Sans Arabic` / `Readex Pro`).
  - **CRITICAL ARABIC RULE:** NEVER apply letter-spacing (`tracking-*`) to Arabic text — it destroys cursive glyph ligatures. Tracking is strictly reserved for Latin badges (`[dir="ltr"] uppercase tracking-[0.2em]`) or tabular data (`tabular-nums`).
- **Strict Logical CSS:**
  - **BANNED:** `left-*`, `right-*`, `ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, `text-right`.
  - **MANDATORY:** `start-*`, `end-*`, `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`. Use `rtl:-scale-x-100` for directional indicators (arrows, chevrons).
- **Color Palette (`luxury-noir`):**
  - Background: Obsidian `#070709` | Surface: `#0E0E12` | Elevated: `#15151B`.
  - Accents: Imperial Gold `#C9A84C` | Champagne `#E6CFA0` | Warm Ivory `#F5F2EB` | Muted `#9A968E`.
- **Double-Bezel Hardware Architecture (Doppelrand):**
  - Outer Shell: `p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/[0.08]`
  - Inner Core: `rounded-[calc(1.75rem-0.375rem)] bg-[#0E0E12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`
- **Fluid Motion:**
  - Custom curve: `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`.
  - Animate ONLY `transform` and `opacity`. NEVER animate `height`, `width`, `top`, `margin`.

## 3. Yemen & Mobile-First Resilience
- **Thumb Zone Design:** Mobile viewport (`375px–430px`) is primary. Use sticky bottom action bars, bottom sheet drawers for filters/cart, min `44x44px` touch targets, and `min-h-[100dvh]` (never `h-screen`).
- **GPU & Network Budget:**
  - NO `backdrop-blur` on scrolling cards, grids, or product feeds (use solid/semi-opaque CSS overlays). `backdrop-blur-md` is permitted ONLY on fixed top headers or floating bottom bars.
  - Optimize for 3G/4G: Lean Server Component payloads, zero bloated client libraries, and `motion-reduce:transition-none`.

## 4. Companion Skills & CI/CD
- **Code Standards:** Strictly adhere to `clean-code-guard` (functions ≤20 LoC, params ≤4, no broad error swallowing, no mock success returns in production).
- **Zero-VPN Deployment:** Strictly adhere to `vercel-cloud-deploy` (all deployments to Vercel occur via GitHub Actions; NEVER run `vercel deploy` locally).

## 5. Luxury Component Patterns & Zero-Bloat Motion
- **Metallic Liquid Gold Gradients:**
  - Text: `bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(201,168,76,0.2)]`
  - Border/Surface: `border border-[#C9A84C]/20 bg-gradient-to-b from-[#15151B] to-[#0E0E12]`
- **Interactive Original-vs-Fake Slider (Compare):**
  - Zero-bloat Motion `clip-path` slider for side-by-side packaging, texture & barcode inspection (`Original / أصلي مضمون ✅` vs `Counterfeit / تقليد مغشوش ❌`). Touch-drag handle with haptic snap at 50%.
- **Spotlight & Ambient Shimmer Cards:**
  - Radial follower: `bg-[radial-gradient(400px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(201,168,76,0.12),transparent_40%)]`
  - Card Border Glow: Magic UI `Shine Border` with `shineColor={["#BF953F", "#FCF6BA", "#C9A84C"]}` for VIP tiers.
- **Vaul Mobile Drawers & Action Bar:**
  - Use `vaul` (`shadcn/ui` Drawer) for cart & filters: `fixed inset-x-0 bottom-0 rounded-t-[2rem] bg-[#0E0E12] border-t border-[#C9A84C]/20`.
  - Sticky Mobile Checkout Bar: `min-h-[64px] pb-safe bg-[#070709]/95 backdrop-blur-md border-t border-white/[0.08]` with 1-tap Buy button.
- **Active Ingredients & Shade Swatches (Animated Beam & Tactile Pills):**
  - Render active skincare actives (Vitamin C, Hyaluronic Acid, Niacinamide), skin types & makeup shade swatches connected via lightweight SVG `Animated Beam` with golden pulses.
