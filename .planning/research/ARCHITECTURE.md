# Architecture Patterns

**Domain:** Single-page local service lead-gen website
**Project:** Redbird Lawn Care — Astro 6 static site
**Researched:** 2026-04-05
**Confidence:** HIGH (Astro docs verified), MEDIUM (VAPI patterns from GitHub/SDK docs)

---

## Recommended Architecture

Astro 6 static output (`output: 'static'`) — the entire page is pre-rendered to HTML at build time. React exists only in three isolated islands. No adapter is needed for Cloudflare Pages static deployment; the `dist/` folder deploys directly.

```
Browser
  └── HTML shell (Astro, static)
        ├── Astro components (zero JS, pure HTML/CSS)
        │     ├── Hero
        │     ├── Services
        │     ├── About
        │     ├── TrustBar
        │     └── Footer
        └── React islands (hydrated client-side)
              ├── MobileNav (client:load)
              ├── ContactForm → GHL Webhook (client:load)
              └── VAPIWidget (client:only="react") → VAPI WebRTC
```

---

## File and Directory Structure

```
/
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-image.jpg                  # Open Graph image (static asset)
│
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── hero-bg.jpg
│   │       ├── alberto-murillo.jpg
│   │       └── services/             # Per-service photos
│   │
│   ├── components/
│   │   ├── astro/                    # Zero-JS Astro components
│   │   │   ├── Hero.astro
│   │   │   ├── Services.astro
│   │   │   ├── ServiceCard.astro
│   │   │   ├── About.astro
│   │   │   ├── TrustBar.astro
│   │   │   ├── Footer.astro
│   │   │   └── SectionWrapper.astro  # Shared scroll-animation wrapper
│   │   │
│   │   ├── react/                    # React islands only
│   │   │   ├── MobileNav.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── VAPIWidget.tsx
│   │   │
│   │   └── seo/
│   │       ├── BaseHead.astro        # <title>, meta, canonical, preload
│   │       ├── JsonLd.astro          # LocalBusiness JSON-LD injection
│   │       └── OpenGraph.astro       # OG/Twitter card tags
│   │
│   ├── layouts/
│   │   └── Layout.astro              # HTML shell: <head>, fonts, global CSS
│   │
│   ├── pages/
│   │   └── index.astro               # Single page — all sections composed here
│   │
│   ├── styles/
│   │   ├── global.css                # @import "tailwindcss"; base tokens
│   │   └── animations.css            # Intersection Observer CSS classes
│   │
│   └── lib/
│       ├── constants.ts              # NAP data, service list, site URL
│       ├── schema.ts                 # LocalBusiness JSON-LD object builder
│       └── types.ts                  # Shared TypeScript interfaces
│
├── astro.config.mjs
├── tailwind.config.ts                # Not needed for v4 — config lives in CSS
├── tsconfig.json
└── wrangler.jsonc                    # Cloudflare Pages deployment config
```

---

## Component Boundaries

| Component | Type | Responsibility | Talks To |
|-----------|------|---------------|----------|
| `Layout.astro` | Astro layout | HTML shell, `<head>`, font injection, global CSS | `BaseHead`, `JsonLd`, all page components |
| `BaseHead.astro` | Astro | `<title>`, `<meta>`, canonical, preload hints | None |
| `JsonLd.astro` | Astro | Injects `<script type="application/ld+json">` using `set:html` | `schema.ts` |
| `Hero.astro` | Astro | H1, primary CTA button, hero image | `ContactForm` (scroll anchor) |
| `TrustBar.astro` | Astro | "Locally Owned / Fully Insured / 5-Star" badges | None |
| `Services.astro` | Astro | Service grid layout | `ServiceCard.astro` |
| `ServiceCard.astro` | Astro | Individual service with icon, name, description | `lucide-react` icon (static import) |
| `About.astro` | Astro | Alberto photo, bio copy, local Wentzville context | `next/image` equivalent: `<Image>` from `astro:assets` |
| `SectionWrapper.astro` | Astro | `data-animate` wrapper for Intersection Observer CSS | None |
| `Footer.astro` | Astro | NAP, email, Facebook, copyright | `constants.ts` |
| `MobileNav.tsx` | React island | Hamburger menu, drawer open/close state | `client:load` |
| `ContactForm.tsx` | React island | Controlled form, validation, fetch POST to GHL | GHL webhook URL |
| `VAPIWidget.tsx` | React island | Floating button, VAPI call lifecycle, mic permission | `@vapi-ai/web` SDK |

---

## Data Flow

### 1. Contact Form → GHL Webhook

```
User fills form (Name, Address, Phone, Service)
    ↓
ContactForm.tsx — React controlled state
    ↓
onSubmit → fetch(GHL_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(formData) })
    ↓
GHL processes webhook → creates Contact in pipeline
    ↓
UI: success message shown / form reset
    ↓ (error path)
UI: error message shown, form remains populated
```

The GHL webhook URL is a build-time environment variable (`import.meta.env.PUBLIC_GHL_WEBHOOK_URL`). It is prefixed `PUBLIC_` so Astro exposes it to the client bundle. No server-side proxying is needed for a static site.

### 2. VAPI Widget Lifecycle

```
Page load
    ↓
VAPIWidget.tsx mounts (client:only="react" — no SSR, no hydration mismatch)
    ↓
new Vapi(import.meta.env.PUBLIC_VAPI_KEY) — lazy init on mount
    ↓
User clicks floating button → vapi.start(assistantId)
    ↓
WebRTC connection established → browser requests mic permission
    ↓
vapi.on('call-start') → button state: "active / pulse animation"
vapi.on('volume-level') → optional audio visualizer
vapi.on('call-end') → button state: "idle"
vapi.on('error') → show error toast, reset state
    ↓
User clicks again → vapi.stop()
```

`client:only="react"` is mandatory — VAPI uses WebRTC browser APIs (`RTCPeerConnection`, `getUserMedia`) that throw during SSR. Astro will not attempt to server-render this component.

### 3. Scroll Animations (No JS Island)

```
Build time: SectionWrapper.astro wraps each section with data-animate attribute
    ↓
animations.css: [data-animate] starts with opacity:0 / translateY
    ↓
Layout.astro injects inline <script> (vanilla JS, ~10 lines)
    ↓
IntersectionObserver watches all [data-animate] elements
    ↓
On enter viewport: element.classList.add('in-view')
    ↓
CSS transitions play: opacity 1, translateY 0
```

This costs ~0.2KB JS. It is not a React island. The script tag goes in Layout.astro as a bare `<script>` — Astro will bundle it once.

### 4. Font Loading (Astro Fonts API)

```
astro.config.mjs: fonts[] array with Fontsource provider
    ↓
Astro downloads Space Grotesk + Inter at build time → caches to dist/
    ↓
Layout.astro: <Font cssVariable="--font-heading" /> in <head>
    ↓
Astro injects preload links + @font-face rules automatically
    ↓
global.css: body { font-family: var(--font-body); }
             h1,h2,h3 { font-family: var(--font-heading); }
```

No external font requests at runtime. Zero user data sent to Google.

### 5. Structured Data (JSON-LD)

```
lib/schema.ts exports buildLocalBusinessSchema() → returns typed object
    ↓
JsonLd.astro: receives schema object, JSON.stringify, injects via set:html
    ↓
<script type="application/ld+json">{...}</script> in <head>
    ↓
Google crawler reads LocalBusiness schema with exact NAP
```

NAP values (name, address, phone) are defined once in `lib/constants.ts` and consumed by both `JsonLd.astro` and `Footer.astro`. This prevents the drift that breaks local SEO.

---

## Key Configuration Files

### astro.config.mjs

```javascript
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
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500],
    },
  ],
});
```

Note: `@astrojs/tailwind` is deprecated for Tailwind 4. The `@tailwindcss/vite` plugin goes under `vite.plugins`, not `integrations`.

### wrangler.jsonc (Cloudflare Pages static)

```jsonc
{
  "name": "redbird-lawn",
  "compatibility_date": "2026-04-01",
  "assets": {
    "directory": "./dist"
  }
}
```

No adapter needed. `output: 'static'` + Wrangler assets is the correct pattern for Cloudflare Pages static deployment as of 2025-2026. The `@astrojs/cloudflare` adapter is only required for SSR/on-demand rendering.

---

## Suggested Build Order

Dependencies between components determine sequencing. Each phase must complete before the next.

### Phase 1: Foundation (no dependencies)
1. `astro.config.mjs` — configures everything else
2. `tsconfig.json` — TypeScript config
3. `lib/constants.ts` — NAP, site metadata, service list
4. `lib/types.ts` — TypeScript interfaces
5. `src/styles/global.css` — Tailwind import + CSS custom properties
6. `wrangler.jsonc` — deployment config

**Why first:** All components import from constants and types. CSS must exist before Layout.

### Phase 2: Layout Shell (depends on Phase 1)
1. `BaseHead.astro` — meta, canonical, preload
2. `lib/schema.ts` — JSON-LD builder using constants
3. `JsonLd.astro` — consumes schema builder
4. `Layout.astro` — assembles head, fonts, scroll-animation script

**Why second:** Every page section wraps inside Layout.

### Phase 3: Static Sections (depends on Phase 2)
1. `SectionWrapper.astro` — animation wrapper
2. `TrustBar.astro` — no external deps
3. `ServiceCard.astro` — leaf component
4. `Services.astro` — composes ServiceCards
5. `Hero.astro` — references CTA anchor
6. `About.astro` — uses `<Image>` from astro:assets
7. `Footer.astro` — uses constants

**Why third:** These are pure HTML/CSS. Composable in any order after Layout exists.

### Phase 4: React Islands (depends on Phase 2, independent of Phase 3)
1. `MobileNav.tsx` — simplest island, no external SDK
2. `ContactForm.tsx` — fetch to GHL webhook, needs env var
3. `VAPIWidget.tsx` — most complex, WebRTC + SDK

**Why fourth:** Islands are independent of static sections but require Layout to host them.

### Phase 5: SEO + Final Assembly (depends on all prior phases)
1. `pages/index.astro` — composes all sections in order
2. Sitemap verification
3. robots.txt
4. Lighthouse audit pass

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using client:load for VAPIWidget
**What goes wrong:** Astro attempts SSR of the component before hydrating. `RTCPeerConnection` and `getUserMedia` are not defined in Node.js — build fails or throws at runtime.
**Instead:** Always `client:only="react"` for VAPI. No exceptions.

### Anti-Pattern 2: @astrojs/tailwind with Tailwind 4
**What goes wrong:** `@astrojs/tailwind` is deprecated for v4. Installing it creates conflicts with the Vite plugin and produces duplicate CSS.
**Instead:** Use `@tailwindcss/vite` under `vite.plugins` in `astro.config.mjs`. Single `@import "tailwindcss"` in global.css.

### Anti-Pattern 3: Separate NAP strings in Footer and JSON-LD
**What goes wrong:** Phone number or address drifts between schema markup and visible footer text. Google detects mismatched NAP and reduces local pack trust signals.
**Instead:** Single source of truth in `lib/constants.ts`. Both `JsonLd.astro` and `Footer.astro` import from it.

### Anti-Pattern 4: Hardcoding GHL Webhook URL in component
**What goes wrong:** URL is committed to source control and visible in the client bundle when inspected.
**Instead:** `import.meta.env.PUBLIC_GHL_WEBHOOK_URL` set in `.env` and Cloudflare Pages environment variables. `PUBLIC_` prefix is intentional — static sites have no server, all env vars ship to client.

### Anti-Pattern 5: Adding React to static section components
**What goes wrong:** Each additional React island adds hydration overhead (~43KB React runtime). Hydrating Hero or Services for cosmetic animations blows the 80KB JS budget.
**Instead:** React is limited to exactly three components. Animations use CSS + vanilla IntersectionObserver.

### Anti-Pattern 6: Putting @astrojs/cloudflare adapter in config for static output
**What goes wrong:** The adapter switches Astro to `output: 'server'` mode by default, enabling Worker-based SSR. Static assets behave differently, and the adapter is unnecessary overhead.
**Instead:** No adapter. `output: 'static'` + `wrangler.jsonc` assets config. Deploy with `npx wrangler deploy`.

---

## Scalability Considerations

This is intentionally a single-page, single-purpose lead-gen site. Scalability decisions are forward-looking for v2.

| Concern | v1 (current) | v2 (if needed) |
|---------|-------------|----------------|
| Content updates (services, pricing) | Edit `.astro` files, redeploy | Migrate to Astro Content Collections + headless CMS |
| Blog / SEO content expansion | Out of scope | `src/content/blog/` + `src/pages/blog/[slug].astro` |
| Multiple locations | Out of scope | Dynamic routes per city, separate JSON-LD per page |
| Form spam protection | Honeypot field in ContactForm | Cloudflare Turnstile (CF-native, free, no captcha UX) |
| Analytics | None in v1 (no tracking = no JS overhead) | Cloudflare Web Analytics (privacy-first, zero JS) |

---

## Sources

- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) — HIGH confidence, official docs
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) — HIGH confidence, official docs
- [Astro Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) — HIGH confidence, official docs
- [Astro Experimental Fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/) — HIGH confidence, official docs
- [Tailwind CSS with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — HIGH confidence, official docs
- [VAPI Web SDK GitHub](https://github.com/VapiAI/client-sdk-web) — MEDIUM confidence, GitHub README
- [VAPI Web Calls Docs](https://docs.vapi.ai/sdk/web) — MEDIUM confidence (page returned 404; SDK GitHub verified patterns)
- [Astro 6 Release](https://astro.build/blog/astro-6/) — HIGH confidence, official release notes
