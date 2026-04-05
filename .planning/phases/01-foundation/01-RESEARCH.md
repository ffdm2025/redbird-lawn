# Phase 1: Foundation - Research

**Researched:** 2026-04-05
**Domain:** Astro 6 project scaffold, Tailwind 4 + Vite, Astro Fonts API, Cloudflare Pages deployment
**Confidence:** HIGH (all critical items verified against official docs and npm registry)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and stack research (.planning/research/STACK.md) to guide decisions.

Key constraints from research:
- Astro 6.1.3, Tailwind 4.2.2, @vapi-ai/web pinned to exact 2.5.2
- @tailwindcss/vite (NOT @astrojs/tailwind — deprecated)
- No @astrojs/cloudflare adapter for static output
- Node.js 22 minimum
- Astro Fonts API for Space Grotesk + Inter (check if experimental flag needed)
- NAP single source of truth in lib/constants.ts

### Claude's Discretion
All implementation details — this is a pure infrastructure phase with no user-locked design choices.

### Deferred Ideas (OUT OF SCOPE)
None — infrastructure phase.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUN-01 | Site built with Astro 6 static output, TypeScript throughout | `npm create astro@latest` with minimal template; `output: 'static'` in config; `tsconfig.json` strict mode |
| FOUN-02 | Tailwind CSS 4 integrated via @tailwindcss/vite plugin | `@tailwindcss/vite` 4.2.2 confirmed; goes under `vite.plugins`, not `integrations`; `@import "tailwindcss"` in global.css |
| FOUN-03 | Self-hosted fonts (Space Grotesk headings, Inter body) via Astro Fonts API | Fonts API is top-level (NOT experimental) in Astro 6.1.3; `fontProviders.fontsource()` pattern confirmed; `<Font />` from `astro:assets` |
| FOUN-04 | Responsive mobile-first layout with Tailwind breakpoints | Foundation: layout shell only (index.astro + Layout.astro); breakpoint classes available after FOUN-02 |
| FOUN-05 | Canonical NAP string defined and used as single source of truth | `lib/constants.ts` exports NAP object; imported by Footer and JSON-LD — never re-typed elsewhere |
| DEPL-01 | Deployed to Cloudflare Pages free tier with output: 'static' | Build command: `npm run build`; output dir: `dist`; no adapter needed; verified via Cloudflare Pages docs |
| DEPL-02 | Node.js 22 configured in Cloudflare Pages build environment | CF Pages v3 build image defaults to Node 22.16.0; set `NODE_VERSION=22` env var + `.nvmrc` file as belt-and-suspenders |
| DEPL-04 | Cloudflare Auto Minify disabled (conflicts with Astro's own minification) | Dashboard path confirmed: Speed > Optimization > Auto Minify > uncheck HTML |
</phase_requirements>

---

## Summary

Phase 1 establishes the project skeleton: Astro 6 scaffolded with TypeScript, Tailwind 4 wired through the Vite plugin, self-hosted fonts configured via the Astro Fonts API, canonical NAP data centralized in `lib/constants.ts`, and the first successful Cloudflare Pages deploy producing a valid static HTML file.

The critical verification completed during research: **the Astro Fonts API is no longer under an `experimental` flag in Astro 6.1.3.** It is a top-level `fonts:` key in `astro.config.mjs`, and the `<Font />` component is imported from `astro:assets` (not from an experimental namespace). ARCHITECTURE.md had this correctly in the config example — the `experimental:` wrapper shown in STACK.md is outdated and must NOT be used.

Cloudflare Pages v3 build image defaults to Node 22.16.0 (the same version running locally), so no build-environment mismatch is expected. However, the `.nvmrc` and `NODE_VERSION` env var should still be set explicitly to guard against future build image changes.

**Primary recommendation:** Scaffold with `npm create astro@latest` minimal template, configure all integrations in `astro.config.mjs` before writing any component code, deploy to Cloudflare Pages from day one, and verify the `.pages.dev` URL before declaring Phase 1 complete.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.3 | Static site framework | Fixes a Cloudflare dev rendering bug in 6.1.x; zero-JS default |
| tailwindcss | 4.2.2 | Utility CSS | CSS-first config, no tailwind.config.js needed |
| @tailwindcss/vite | 4.2.2 | Tailwind Vite integration | Official plugin for Tailwind 4; @astrojs/tailwind is deprecated |
| @astrojs/react | 5.0.2 | React island support | Required for ContactForm, MobileNav, VAPIWidget later |
| @astrojs/sitemap | 3.7.2 | Sitemap generation | Phase 2 SEO; install in Phase 1 so `site:` URL is in place |
| react | 19.2.4 | React runtime | Peer dep for @astrojs/react |
| react-dom | 19.2.4 | React DOM | Peer dep for @astrojs/react |
| typescript | (Astro built-in) | Type safety | Astro 6 ships TS support; strict mode via tsconfig |

### Supporting (install in Phase 1, used in later phases)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sharp | 0.34.5 | Image processing | Astro `<Image>` component uses it at build time |
| lucide-react | 1.7.0 | Icons | Service cards, contact info icons — Phase 3 |
| @vapi-ai/web | 2.5.2 | Voice widget SDK | Phase 4 only; install now to pin version |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/vite | @astrojs/tailwind | @astrojs/tailwind is deprecated for Tailwind 4; do not use |
| Astro Fonts API (built-in) | @fontsource/* packages | Fonts API handles download + caching + preload hints automatically |
| No adapter (output: static) | @astrojs/cloudflare adapter | Adapter is for SSR only; installing it for static causes issues |

**Installation (full Phase 1 + future-phase deps, pinned):**
```bash
npm create astro@latest . -- --template minimal --yes --no-git

# Pin exact versions for volatile packages
npm install --save-exact astro@6.1.3
npm install --save-exact tailwindcss@4.2.2 @tailwindcss/vite@4.2.2
npm install @astrojs/react @astrojs/sitemap
npm install --save-exact react@19.2.4 react-dom@19.2.4
npm install sharp
npm install --save-exact @vapi-ai/web@2.5.2
npm install lucide-react
```

**Version verification (confirmed 2026-04-05 against npm registry):**
| Package | Registry Version |
|---------|-----------------|
| astro | 6.1.3 |
| tailwindcss | 4.2.2 |
| @tailwindcss/vite | 4.2.2 |
| @astrojs/react | 5.0.2 |
| @astrojs/sitemap | 3.7.2 |
| react / react-dom | 19.2.4 |
| sharp | 0.34.5 |
| @vapi-ai/web | 2.5.2 |
| lucide-react | 1.7.0 |

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)
```
/
├── public/
│   └── robots.txt               # placeholder — configured in Phase 2
│
├── src/
│   ├── layouts/
│   │   └── Layout.astro         # HTML shell, <head>, Font components, global CSS import
│   │
│   ├── pages/
│   │   └── index.astro          # Minimal placeholder — one <h1> to verify Tailwind renders
│   │
│   ├── styles/
│   │   └── global.css           # @import "tailwindcss"; CSS custom properties
│   │
│   └── lib/
│       └── constants.ts         # NAP, site URL — canonical single source of truth
│
├── .nvmrc                       # "22" — Node version pin
├── astro.config.mjs             # Full integration config (all Phase 1 requirements)
└── tsconfig.json                # Strict TypeScript config
```

### Pattern 1: Astro Config with All Phase 1 Integrations

**What:** Single `astro.config.mjs` that configures static output, Tailwind via Vite, React islands, sitemap, and self-hosted fonts.

**Critical finding:** `fonts:` is a TOP-LEVEL key in Astro 6.1.3 — NOT under `experimental:`. ARCHITECTURE.md has the correct form; STACK.md's `experimental:` wrapper is outdated.

**Verified config:**
```typescript
// Source: https://docs.astro.build/en/reference/experimental-flags/fonts/ (confirmed top-level)
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://redbirdlawnservice.com',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-heading',
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
});
```

### Pattern 2: Font Component in Layout

**What:** The `<Font />` component injects preload hints and `@font-face` rules into `<head>`. Must be inside `<head>`, not `<body>`.

```astro
---
// Source: https://docs.astro.build/en/reference/experimental-flags/fonts/
import { Font } from 'astro:assets';
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Font cssVariable="--font-heading" preload />
    <Font cssVariable="--font-body" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 3: Global CSS with Tailwind 4

**What:** Single CSS entry file that imports Tailwind and declares CSS custom properties for fonts.

```css
/* Source: https://tailwindcss.com/docs/installation/framework-guides/astro */
@import "tailwindcss";

/* Font family CSS custom properties — set by Astro Fonts API */
:root {
  font-family: var(--font-body), system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), system-ui, sans-serif;
}
```

Layout.astro imports this file: `import '../styles/global.css';`

### Pattern 4: NAP Single Source of Truth

**What:** `lib/constants.ts` exports a typed NAP object. Every reference to business name, address, phone, or email imports from here.

```typescript
// src/lib/constants.ts
export const SITE_URL = 'https://redbirdlawnservice.com';

export const NAP = {
  name: 'Redbird Lawn Care Service',
  phone: '(314) 497-6152',
  phoneHref: 'tel:+13144976152',
  email: 'sales@redbirdlawnservic.com',
  address: {
    street: '[CONFIRM FROM GBP]',
    city: 'Wentzville',
    state: 'MO',
    zip: '63385',
    country: 'US',
  },
} as const;

export const SOCIAL = {
  facebook: '[CONFIRM FROM GBP]',
} as const;
```

**Note:** Street address and Facebook URL must be confirmed against the live Google Business Profile before Phase 2 (SEO) begins. Placeholder values in Phase 1 are acceptable — the structure must exist.

### Pattern 5: TypeScript Config (strict mode)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Pattern 6: Cloudflare Pages Deployment

**What:** Two approaches confirmed working. Use the dashboard approach for v1 (DNS already on Cloudflare).

**Dashboard build settings:**
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version env var: `NODE_VERSION = 22`

**Also add `.nvmrc` to project root:**
```
22
```

**No wrangler.jsonc needed for dashboard-based Cloudflare Pages deploys.** The `wrangler.jsonc` pattern (from ARCHITECTURE.md) is for CLI-based deploys with `npx wrangler deploy`. For dashboard + git integration, only the build settings above are needed.

If CLI deployment is preferred (more reproducible):
```jsonc
// wrangler.jsonc
{
  "name": "redbird-lawn",
  "compatibility_date": "2026-04-01",
  "assets": {
    "directory": "./dist"
  }
}
```
Deploy command: `npx astro build && npx wrangler deploy`

### Anti-Patterns to Avoid

- **`experimental: { fonts: [...] }`**: Outdated. Fonts API is top-level in Astro 6.1.3. Using the experimental wrapper will either be ignored or cause a config error.
- **`@astrojs/tailwind` in integrations**: Deprecated for Tailwind 4. Causes conflicts with `@tailwindcss/vite`. Do not install or reference it.
- **`@astrojs/cloudflare` adapter for static output**: Only needed for SSR. Installing it for a static site changes output mode and breaks the deploy.
- **NAP data defined in component JSX**: Never type the phone number, address, or business name directly in a component. Always import from `lib/constants.ts`.
- **`@apply` in `.astro` scoped `<style>` blocks**: Silently produces no output in Tailwind 4. Use inline utility classes or `@reference` if scoped styles are required.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting | Custom font download script, manual @font-face | Astro Fonts API (built-in) | Handles download, caching, fallback generation, and preload hints automatically |
| CSS preprocessing | PostCSS config, webpack loaders | `@tailwindcss/vite` plugin | Official Vite-native integration; no PostCSS config needed for Tailwind 4 |
| Static HTML output | Custom SSG script | Astro `output: 'static'` | Built-in; produces optimized HTML with inlined critical CSS |
| TypeScript path aliases | Custom webpack resolve | `tsconfig.json` paths + Astro's built-in TS support | Astro resolves tsconfig paths natively |

---

## Common Pitfalls

### Pitfall 1: `experimental:` wrapper for Fonts API
**What goes wrong:** Config is silently ignored or throws. Fonts don't load. Zero external-request test fails.
**Why it happens:** STACK.md research note flagged "verify if experimental flag needed" — answer is NO, it's top-level.
**How to avoid:** Use `fonts: [...]` as a top-level key in `defineConfig({})`. See Pattern 1 above.
**Warning signs:** Build completes but DevTools shows external font requests (Fontsource CDN).

### Pitfall 2: Cloudflare Pages routing to Workers instead of Pages
**What goes wrong:** Deploy URL shows `<hash>.workers.dev` instead of `<name>.pages.dev`. Static asset serving differs.
**Why it happens:** Cloudflare UI during project creation may default to Workers mode.
**How to avoid:** After first deploy, check the URL format. If `.workers.dev`: go to project settings and use "Shift to Pages" link.
**Warning signs:** DEPL-01 success criterion requires `*.pages.dev` URL specifically.

### Pitfall 3: Node version mismatch on Cloudflare Pages build
**What goes wrong:** Build fails with "engine not compatible" or similar Node version error.
**Why it happens:** Old Cloudflare Pages build images default to Node 18.
**How to avoid:** Set `NODE_VERSION=22` as environment variable in Cloudflare Pages settings AND add `.nvmrc` containing `22`.
**Warning signs:** First build fails; build log shows Node version < 22.

### Pitfall 4: `@apply` in Astro scoped style blocks
**What goes wrong:** Component renders without styles. No build error.
**Why it happens:** Tailwind 4 processes scoped `<style>` blocks separately from the main CSS bundle.
**How to avoid:** Use inline Tailwind utility classes. If scoped styles are needed, add `@reference "../../styles/global.css"` at top of `<style>` block.
**Warning signs:** Element has the correct class in HTML but no matching CSS rule in DevTools.

### Pitfall 5: Cloudflare Auto Minify breaking React hydration (post-Phase 1)
**What goes wrong:** React islands (form, nav) silently fail to hydrate in production.
**Why it happens:** Cloudflare's HTML minifier corrupts Astro's hydration payload.
**How to avoid:** Disable via Cloudflare Dashboard > Speed > Optimization > Auto Minify > uncheck HTML. Do this at first deploy in Phase 1.
**Warning signs:** Components render correctly on preview but are non-functional on production.

---

## Code Examples

### Minimal `index.astro` (Phase 1 placeholder)
```astro
---
// Source: official Astro structure pattern
import Layout from '../layouts/Layout.astro';
---
<Layout title="Redbird Lawn Care Service | Wentzville, MO">
  <main>
    <h1 class="text-4xl font-bold text-green-800">
      Expert Residential Lawn Care in Wentzville, MO
    </h1>
  </main>
</Layout>
```

This minimal page verifies: (1) Tailwind renders `text-4xl font-bold`, (2) fonts load from self-hosted assets, (3) build produces valid HTML.

### Font preload in Layout
```astro
---
import { Font } from 'astro:assets';
import '../styles/global.css';
interface Props { title: string; }
const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <Font cssVariable="--font-heading" preload />
    <Font cssVariable="--font-body" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` in `vite.plugins` | Tailwind v4 (Jan 2025) | @astrojs/tailwind is deprecated — do not use |
| `experimental: { fonts: [...] }` | Top-level `fonts: [...]` | Astro 6.0 (Mar 2026) | Experimental wrapper causes errors in 6.1.3 |
| `tailwind.config.js` | CSS-first `@theme` in global.css | Tailwind v4 | No JS config file needed |
| `@font-face` manual setup | Astro Fonts API | Astro 6.0 | Automated download, cache, fallback, preload |
| `@astrojs/cloudflare` adapter | No adapter for static | Always correct | Adapter is SSR-only; was incorrectly used in early v6 betas |

---

## Open Questions

1. **Exact GBP street address for NAP**
   - What we know: City is Wentzville, MO 63385; phone is (314) 497-6152
   - What's unclear: Exact street address format as listed on Google Business Profile
   - Recommendation: Use `'[CONFIRM FROM GBP]'` placeholder in `lib/constants.ts` Phase 1. Must be resolved before Phase 2 (SEO/JSON-LD).

2. **Facebook page URL for SOCIAL constant**
   - What we know: Facebook link appears in Phase 3 Footer requirement
   - What's unclear: Exact Facebook page URL
   - Recommendation: Same placeholder pattern. Blocker for CONT-06, not Phase 1.

3. **Cloudflare Pages project name / `*.pages.dev` subdomain**
   - What we know: Project name determines `<name>.pages.dev` URL
   - What's unclear: Whether `redbird-lawn` or `redbirdlawnservice` or similar is available/preferred
   - Recommendation: Confirm during DEPL-01 execution. Use `redbird-lawn` as the wrangler.jsonc `name` field.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro 6 build | ✓ | 22.16.0 | — |
| npm | Package management | ✓ | 11.12.1 | — |
| wrangler CLI | CLI-based CF deploy | ✗ | — | Use Cloudflare Pages dashboard git integration |
| Git | Cloudflare Pages git integration | ✓ | (system) | Manual upload via wrangler |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:**
- `wrangler` CLI not installed globally. Cloudflare Pages git integration (dashboard) works without it. If CLI deploy is needed, install via `npm install -g wrangler` or use `npx wrangler`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No automated test framework in Phase 1 (static scaffold) |
| Config file | none — Wave 0 gap |
| Quick run command | `npm run build` (build success is the primary gate) |
| Full suite command | `npm run build && npx astro check` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-01 | `npm run build` completes, `dist/` contains valid HTML | smoke | `npm run build` | ✅ (astro build script) |
| FOUN-02 | Tailwind utility class renders in browser | smoke | `npm run build` + manual inspect | ✅ |
| FOUN-03 | Zero external font requests in DevTools | manual | Build + browser DevTools Network tab | ❌ manual only |
| FOUN-04 | Mobile-first layout responds to breakpoints | manual | Browser DevTools responsive mode | ❌ manual only |
| FOUN-05 | `lib/constants.ts` exports NAP; no other NAP definitions | smoke | `npx astro check` (TS type-checks constants usage) | ✅ |
| DEPL-01 | `*.pages.dev` URL serves static HTML | smoke | `curl https://<name>.pages.dev` | ❌ Wave 0 — needs deploy |
| DEPL-02 | CF build log shows Node 22 | manual | Check CF Pages build log | ❌ manual only |
| DEPL-04 | CF Auto Minify disabled | manual | CF dashboard verification | ❌ manual only |

### Sampling Rate
- **Per task commit:** `npm run build` (must pass clean)
- **Per wave merge:** `npm run build && npx astro check`
- **Phase gate:** All success criteria met + `.pages.dev` URL verified before Phase 2

### Wave 0 Gaps
- [ ] `npm run build` defined in package.json — included by default in `create astro`, confirm it exists
- [ ] `npx astro check` TypeScript validation — requires `typescript` in devDependencies (Astro includes it)
- [ ] No automated test for zero external font requests — manual verification required

---

## Project Constraints (from CLAUDE.md)

| Directive | Source | Applies to Phase 1? |
|-----------|--------|---------------------|
| TypeScript strict, no `any` | CLAUDE.md | Yes — tsconfig strict mode required |
| Zustand for state | CLAUDE.md | Not in Phase 1 (no state management needed yet) |
| Dark mode first | CLAUDE.md | Phase 1 scaffold: add `dark:` class support structure; full dark mode in Phase 3 |
| Auto-commit after every change | CLAUDE.md | Yes — each task should commit its changes |
| Functional components + hooks only | frontend.md rules | Phase 1 has no React components yet; applies from Phase 3+ |
| shadcn/ui for primitives | frontend.md rules | Not in Phase 1; install in Phase 3 when components are built |
| cn() for conditional classes | frontend.md rules | Not in Phase 1 |
| next/image for all images | frontend.md rules | OVERRIDDEN by project stack: use `<Image>` from `astro:assets` instead |
| Tailwind CSS, dark mode first | frontend.md rules | Yes — global.css should include `@variant dark (&:is(.dark *))` pattern |

**Key conflict resolved:** The global `frontend.md` rule says "next/image for all images" — this project uses Astro, not Next.js. Use `<Image>` from `astro:assets` for all images. This is explicitly called out in CLAUDE.md stack definition (Next.js is listed as "Out of Scope" in REQUIREMENTS.md).

---

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/reference/experimental-flags/fonts/ — Fonts API syntax; confirmed top-level `fonts:` key, `<Font />` from `astro:assets`
- https://tailwindcss.com/docs/installation/framework-guides/astro — `@tailwindcss/vite` in `vite.plugins`; `@import "tailwindcss"` in CSS
- https://developers.cloudflare.com/pages/configuration/build-image/ — Node 22.16.0 default on v3 build image; `NODE_VERSION` env var
- https://developers.cloudflare.com/pages/configuration/build-configuration/ — Build command `npm run build`; output dir `dist`
- npm registry (2026-04-05) — All package versions verified

### Secondary (MEDIUM confidence)
- https://github.com/withastro/astro/blob/main/packages/create-astro/README.md — `create-astro` flags: `--template minimal --yes --no-git`
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ — Dashboard-based deployment steps

### Tertiary (LOW confidence — inherited from project research)
- .planning/research/STACK.md — Validated project stack; fonts `experimental` note is superseded by direct doc verification
- .planning/research/ARCHITECTURE.md — File structure and config patterns; largely confirmed
- .planning/research/PITFALLS.md — Pitfall catalog; all Phase 1-relevant pitfalls incorporated above

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed from npm registry 2026-04-05
- Architecture: HIGH — config patterns verified against official Astro and Tailwind docs
- Fonts API experimental flag: HIGH — directly confirmed via official docs (top-level, not experimental)
- Cloudflare Pages config: HIGH — build settings confirmed via CF Pages docs
- Pitfalls: HIGH — inherited from project research + cross-verified

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable ecosystem; Astro patch releases unlikely to break these patterns within 30 days)
