# Technology Stack Validation

**Project:** Redbird Lawn Care Website
**Researched:** 2026-04-05
**Overall Confidence:** HIGH (all major components verified against current sources)

---

## Validation Summary

The decided stack is sound for a local service lead-gen site. All core choices are current and well-matched to the goals of sub-100ms TTFB, Lighthouse 95+, and an 80KB JS budget. Two items need updated version pins; one deployment concern is resolved but worth documenting.

---

## Recommended Stack (Validated)

### Core Framework

| Technology | Decided Version | Current Version | Status | Rationale |
|------------|----------------|-----------------|--------|-----------|
| Astro | 6.x | **6.1.3** (Apr 1, 2026) | PIN TO 6.1.3 | Stable. v6.0 released Mar 10, 2026. 6.1.3 fixes a Cloudflare dev rendering bug specifically. Node 22+ required — verify local environment. |
| TypeScript | throughout | — | CONFIRMED | No version concern. Astro 6 ships with TS support built in. |

**Node.js requirement:** Astro 6 dropped Node 18 and 20. **Node 22 is the minimum.** Verify the Cloudflare Pages build environment matches this.

### CSS / Styling

| Technology | Decided Version | Current Version | Status | Rationale |
|------------|----------------|-----------------|--------|-----------|
| Tailwind CSS | 4 via @tailwindcss/vite | **4.2.2** (mid-Mar 2026) | PIN TO 4.2.2 | v4.0 shipped Jan 22, 2025. v4.1 added text shadows, mask utilities (Apr 2025). v4.2.2 is current stable. @tailwindcss/vite is the official Vite plugin — correct choice. @astrojs/tailwind is deprecated for v4. |

**Integration pattern:** Add `@tailwindcss/vite` to Astro's `vite.plugins` array. Do NOT use `@astrojs/tailwind` — it is deprecated and targets Tailwind v3 only. Import `@import "tailwindcss"` in a single CSS entry file; no `tailwind.config.js` needed (CSS-first config via `@theme`).

### React Islands

| Technology | Decided Version | Current Version | Status | Rationale |
|------------|----------------|-----------------|--------|-----------|
| React | (peer dep) | 19.x | CONFIRMED | Astro 6 supports React 19. Used for contact form, VAPI widget, and mobile nav only. All other content is pure Astro — correct constraint. |

**Critical:** VAPI widget MUST use `client:only="react"` — WebRTC is browser-only and will crash if Astro attempts SSR. This is documented in PROJECT.md and is correct.

### Voice Widget

| Technology | Decided Version | Current Version | Status | Rationale |
|------------|----------------|-----------------|--------|-----------|
| @vapi-ai/web | 2.5.2 | **2.5.2** (Dec 2025) | CONFIRMED — MONITOR | 2.5.2 is the latest published version (9 total releases, 4 months old as of Apr 2026). No newer version exists. This is the current stable. Monitor for updates — VAPI moves fast. |

**Choice rationale confirmed:** `@vapi-ai/web` is the correct lower-level SDK for a single floating widget. `@vapi-ai/client-sdk-react` adds wrapper overhead not needed here. The web SDK gives direct control over the call lifecycle without the React SDK's opinion layer.

**VAPI constraint:** Must remain in a React island with `client:only="react"`. Never include in an Astro component or server context.

### Icons

| Technology | Decided Version | Current Version | Status | Rationale |
|------------|----------------|-----------------|--------|-----------|
| lucide-react | — | **1.7.0** (Apr 4, 2026 — yesterday) | USE 1.7.0 | Very active project, 11,000+ dependents. Tree-shakeable ESM — each icon is ~1KB gzipped. Only import icons actually used. At this bundle budget, do not import icon sets wholesale. |

**Usage pattern:** Import per-icon only: `import { Phone, MapPin, Star } from 'lucide-react'`. Never `import * from 'lucide-react'`.

### Fonts

| Technology | Decided | Status | Rationale |
|------------|---------|--------|-----------|
| Astro Fonts API | Built-in (Astro 6) | CONFIRMED | Astro 6 ships a first-class Fonts API that handles downloading, caching for self-hosting, generating optimized fallbacks, and injecting preload hints automatically. This is new in Astro 6 — not available in v5 without third-party packages. Space Grotesk and Inter are available via Fontsource provider. |

**Setup note:** Configure in `astro.config.mjs` under `fonts: []`. Astro downloads and caches the font files at build time — no external font CDN requests at runtime, satisfying the "zero external requests" constraint.

### Image Processing

| Technology | Decided | Status | Rationale |
|------------|---------|--------|-----------|
| Astro `<Image>` + sharp | Built-in | CONFIRMED | sharp is the default image service for `astro:assets`. Astro 6.1 added codec-specific sharp defaults. Install sharp explicitly: `npm install sharp`. On pnpm, this is required manually. At static output, all images are processed at build time — no runtime cost. |

### Animations

| Technology | Decided | Status | Rationale |
|------------|---------|--------|-----------|
| CSS + Intersection Observer | No library | CONFIRMED | Correct call. Framer Motion (~150KB) and GSAP (~60KB) both exceed the 80KB JS budget on their own. CSS transitions + `IntersectionObserver` achieve fade-in/slide-in effects at zero JS cost. Browser support for Intersection Observer is universal (97%+ global). |

### Integrations / SEO

| Technology | Decided | Current Version | Status | Rationale |
|------------|---------|-----------------|--------|-----------|
| @astrojs/sitemap | sitemap.xml generation | **3.7.2** (Mar 26, 2026) | USE 3.7.2 | Official Astro integration, actively maintained, Astro 6 compatible. |

### Deployment

| Technology | Decided | Status | Rationale |
|------------|---------|--------|-----------|
| Cloudflare Pages | Free tier | CONFIRMED WITH NOTE | Pages free tier is still fully operational in 2026: unlimited bandwidth, 500 builds/month, 20,000 files max (well within scope for a single-page site). DNS is already on Cloudflare — no nameserver change needed. |

**Important deployment note — Pages vs Workers:**

Cloudflare is converging Pages into Workers. New feature investment is Workers-only. However:

- **Cloudflare Pages is NOT deprecated.** It remains fully supported, free, and appropriate for this use case.
- For `output: 'static'`, NO adapter is needed (`@astrojs/cloudflare` is for SSR only).
- There was a known v6 beta bug (Issue #15650) where static output + the cloudflare adapter caused deploy failures. It was resolved in March 2026 (PR #15694). The fix: do not install the adapter for static sites.
- **Cloudflare Workers is the forward-looking alternative.** The migration path is a `wrangler.jsonc` pointing `assets.directory` at `./dist`. Both approaches work identically for static HTML delivery.

**Recommendation:** Stay on Cloudflare Pages for v1 — it's the path of least resistance given existing DNS setup. If you migrate to Workers later, it is a 10-minute change (add `wrangler.jsonc`, run `wrangler deploy`). No code changes required.

---

## Alternatives Considered (Validation Against Decisions)

| Category | Decided | Alternative | Why Decided Is Correct |
|----------|---------|-------------|------------------------|
| Framework | Astro 6 | Next.js 15 | Next.js ships a React runtime (100KB+) on every page. Astro ships zero JS by default. For a static brochure + lead form, Astro's island architecture wins on every performance metric. |
| CSS | Tailwind 4 | Tailwind 3 | v3 is in maintenance mode. v4 is faster (up to 182x faster incremental builds), CSS-first config, native cascade layers. No reason to use v3 for a greenfield project. |
| Hosting | Cloudflare Pages | Vercel | Vercel free tier has bandwidth limits; Cloudflare is unlimited. DNS is already on Cloudflare. Astro was acquired by Cloudflare — first-class support is a real advantage. |
| Animations | CSS + IntersectionObserver | Framer Motion / GSAP | Both JS animation libraries exceed the 80KB JS budget alone. CSS transitions are sufficient for scroll reveals, hover effects, and entrance animations on a brochure site. |
| Icons | lucide-react | Heroicons, Phosphor | lucide-react has the largest community momentum (11,000+ dependents vs ~3,000 for heroicons), most active release cadence (v1.7.0 released yesterday), and identical tree-shaking story. |
| Fonts | Astro Fonts API | @fontsource/*, google-fonts-optimizer | Astro 6 built-in handles download, caching, fallback generation, and preload hints automatically. Third-party packages are now redundant. |
| Voice SDK | @vapi-ai/web | @vapi-ai/client-sdk-react | React SDK is a wrapper around the web SDK. For a single floating widget, the extra layer adds bundle weight without benefit. Direct web SDK gives full lifecycle control. |

---

## Installation

```bash
# Core
npm create astro@latest -- --template minimal

# Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# React islands
npm install react react-dom @astrojs/react

# Voice widget
npm install @vapi-ai/web

# Icons
npm install lucide-react

# Image processing
npm install sharp

# Sitemap
npm install @astrojs/sitemap

# Dev / build
# Node 22+ required
```

**astro.config.mjs minimum shape:**
```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://redbirdlawnservice.com',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // Fonts API (Astro 6 built-in)
  experimental: {
    fonts: [
      {
        provider: 'fontsource',
        name: 'Space Grotesk',
        cssVariable: '--font-space-grotesk',
      },
      {
        provider: 'fontsource',
        name: 'Inter',
        cssVariable: '--font-inter',
      },
    ],
  },
});
```

Note: `experimental` key for fonts may stabilize in a patch release — verify against Astro 6.1.3 docs before coding.

---

## Version Pins Summary

| Package | Pin To |
|---------|--------|
| astro | 6.1.3 |
| tailwindcss | 4.2.2 |
| @tailwindcss/vite | 4.2.2 (same release as tailwindcss) |
| @vapi-ai/web | 2.5.2 |
| lucide-react | 1.7.0 |
| @astrojs/sitemap | 3.7.2 |
| react / react-dom | 19.x (latest) |
| sharp | latest |
| @astrojs/react | latest compatible with Astro 6 |

---

## Concerns and Flags

### LOW RISK — Monitor

1. **@vapi-ai/web version staleness.** 2.5.2 is 4 months old and is the latest. VAPI is an active startup; a new SDK version could ship any time with breaking changes. Pin to exact version (`2.5.2`) in `package.json`, not a range (`^2.5.2`). Test the widget after any update before deploying.

2. **Astro Fonts API experimental flag.** In Astro 6, the Fonts API may still sit under `experimental`. Verify against 6.1.3 docs before implementing. If experimental, it is stable enough for production (Astro uses "experimental" for features in final testing, not alpha features).

3. **Node 22 in CI/build environment.** Astro 6 dropped Node 18 and 20. Cloudflare Pages build environment must be set to Node 22. Set this explicitly in the Cloudflare Pages dashboard or via a `.nvmrc` / `package.json` engines field.

### RESOLVED — Documented for Awareness

4. **Cloudflare static output bug (Issue #15650).** There was a deploy failure bug when using `output: 'static'` with the `@astrojs/cloudflare` adapter in early v6 betas. Resolution: do not install the adapter at all for static sites. The bug is fixed in current Astro (6.1.x), but the correct behavior was always to omit the adapter for static output.

---

## Sources

- Astro 6.0 release post: https://astro.build/blog/astro-6/
- Astro releases (GitHub): https://github.com/withastro/astro/releases
- Astro 6.1 release post: https://astro.build/blog/astro-610/
- Tailwind CSS v4.0 announcement: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind CSS v4.1 release: https://tailwindcss.com/blog/tailwindcss-v4-1
- Tailwind + Astro installation guide: https://tailwindcss.com/docs/installation/framework-guides/astro
- Cloudflare Pages: deploy an Astro site: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Cloudflare Workers: Astro guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/
- Astro deploy to Cloudflare docs: https://docs.astro.build/en/guides/deploy/cloudflare/
- Astro v6 static + Cloudflare bug (resolved): https://github.com/withastro/astro/issues/15650
- lucide-react npm: https://www.npmjs.com/package/lucide-react
- @vapi-ai/web GitHub: https://github.com/VapiAI/client-sdk-web
- @astrojs/sitemap npm: https://www.npmjs.com/package/@astrojs/sitemap
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages vs Workers 2026: https://cogley.jp/articles/cloudflare-pages-to-workers-migration
