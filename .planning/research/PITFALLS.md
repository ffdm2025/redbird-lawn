# Domain Pitfalls

**Domain:** Local service website — lawn care brochure + lead-gen (Astro 6 / Cloudflare Pages / Tailwind 4 / VAPI SDK)
**Researched:** 2026-04-05
**Confidence:** MEDIUM-HIGH (most findings verified against official docs or GitHub issues)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deploys, or zero SEO benefit.

---

### Pitfall 1: Cloudflare Silently Routes Static Site to Workers Instead of Pages

**What goes wrong:** If `@astrojs/cloudflare` adapter was ever installed — or Cloudflare's UI defaults to Workers mode during project creation — your "static" Astro site gets deployed to Workers infrastructure. The deployment URL shows `<account-hash>.workers.dev` instead of `*.pages.dev`. Static file serving behaves differently, and the project settings show "Worker runtime" rather than "Build Output Directory."

**Why it happens:** Cloudflare is actively merging Pages and Workers into a unified platform. During the transition, the dashboard UI can silently route new projects to Workers. Installing `@astrojs/cloudflare` also switches Astro's default `output` to `server`, overriding a missing explicit declaration.

**Consequences:** Incorrect routing, broken 404 pages, failed `_redirects` and `_headers` handling, potential unexpected billing.

**Prevention:**
- Always set `output: 'static'` explicitly in `astro.config.mjs` — never rely on defaults.
- Do NOT install `@astrojs/cloudflare` unless SSR is needed. This is a pure static site.
- After first deploy, verify the project URL ends in `.pages.dev` and the settings show "Build Output Directory."
- If routed to Workers by mistake: navigate to project settings and use the "Shift to Pages" link at the bottom.

**Detection:** Check deploy URL format. Check settings page for "Worker runtime" vs "Build Output Directory."

**Phase:** Foundation / Deployment setup (Phase 1)

---

### Pitfall 2: VAPI SDK Requires `client:only="react"` — SSR Will Crash the Build

**What goes wrong:** `@vapi-ai/web` uses `window`, `navigator.mediaDevices`, and WebRTC APIs that do not exist in Node.js. If the VAPI widget component is imported as a normal Astro component (or a React island without `client:only`), the build will crash or the component will silently fail at runtime.

**Why it happens:** Astro runs components on the server during build. Any reference to browser APIs at module load time — not just inside handlers — causes a crash. `client:load` still partially executes on the server; only `client:only="react"` skips SSR entirely.

**Consequences:** Build failure or hydration mismatch. On mobile, VAPI also requires HTTPS for WebRTC microphone access — `localhost` without a tunnel will fail.

**Prevention:**
- Always import the VAPI widget with `client:only="react"` — not `client:load`, not `client:idle`.
- Initialize the `Vapi` class inside a `useEffect` hook, never at module scope.
- Test on HTTPS during development (use `--host` flag + Cloudflare tunnel, or ngrok).
- Add a `try/catch` around `vapi.start()` — users who deny microphone permission must see a graceful fallback, not a broken button.

**Detection:** Build error referencing `window is not defined` or `navigator is not defined`. Runtime: button renders but clicking does nothing.

**Phase:** VAPI integration phase

---

### Pitfall 3: VAPI SDK Requires `unsafe-eval` in Content Security Policy

**What goes wrong:** The `@vapi-ai/web` SDK (which wraps Daily.co) requires `'unsafe-eval'` in the `script-src` CSP directive. If a strict CSP is added via `_headers` without this exception, the VAPI widget will silently fail to connect.

**Why it happens:** Daily.co's WebRTC layer uses eval-based code generation internally. This is a confirmed open GitHub issue in the VAPI client SDK.

**Consequences:** Voice widget appears to load but calls never connect. Console shows CSP violation errors.

**Prevention:**
- In the `_headers` file (Cloudflare Pages), include `'unsafe-eval'` in `script-src` only for the VAPI widget's scope.
- Alternatively, scope the permissive CSP header to the page that loads VAPI (a single-page site means this affects the whole page).
- Document this trade-off explicitly in the codebase — `unsafe-eval` is a security relaxation that is required by this specific third-party SDK.

**Detection:** Browser DevTools console shows `Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source`.

**Phase:** VAPI integration / Security hardening

---

### Pitfall 4: NAP Inconsistency Across Website, GBP, and Facebook

**What goes wrong:** The business name, address, and phone number on the website do not exactly match Google Business Profile and Facebook. Even minor variations — "Redbird Lawn Care" vs "Redbird Lawn Care Service," or "(314) 497-6152" vs "3144976152" — signal conflicting entities to Google's local ranking algorithm.

**Why it happens:** Website content is created independently of GBP setup. Easy to drift when making quick edits.

**Consequences:** Reduced Local 3-Pack ranking potential. Businesses with consistent NAP are 40% more likely to appear in the Local Pack. Inconsistency can make Google treat the website and GBP as separate businesses.

**Prevention:**
- Before writing any content, document the exact canonical NAP string:
  - **Name:** Redbird Lawn Care Service
  - **Address:** [exact GBP address, including suite/unit format if any]
  - **Phone:** (314) 497-6152 (match GBP format exactly)
  - **Email:** sales@redbirdlawnservic.com
- Copy this canonical string into JSON-LD, footer, contact section, and `<meta>` tags — never retype it.
- The JSON-LD `LocalBusiness` schema must match GBP character-for-character.

**Detection:** Manually compare website footer, JSON-LD output (via Google Rich Results Test), and GBP listing side-by-side.

**Phase:** Content / SEO setup (Phase 1-2)

---

### Pitfall 5: Tailwind v4 `@apply` Breaks Inside Astro `<style>` Scoped Blocks

**What goes wrong:** Using `@apply` inside a `<style>` block in an `.astro` file silently produces no output with Tailwind v4. The compiled styles are stripped because Tailwind processes component style blocks in isolation from the main CSS bundle — it cannot resolve utility classes without a reference to the main CSS file.

**Why it happens:** Tailwind v4 uses a CSS-first config model. Scoped `<style>` blocks in Astro are processed separately from the global stylesheet where Tailwind's utilities are defined. Unlike v3, there is no `tailwind.config.mjs` to bridge the gap automatically.

**Consequences:** Styles appear in source but are missing at runtime. No build error — silently broken. Particularly common when applying custom component-level variants.

**Prevention:**
- Do NOT use `@apply` inside `<style>` blocks in `.astro` files.
- If scoped styles are needed, use `@reference "../../styles/global.css"` at the top of the style block to make theme variables accessible.
- Prefer inline utility classes in markup over `@apply` for all component styling.
- Use CSS custom properties (`var(--color-brand-500)`) for dynamic values in style blocks instead of `@apply`.

**Detection:** Elements styled with `@apply` in `.astro` files render without styles. No build warning is produced.

**Phase:** Foundation / Styling setup

---

## Moderate Pitfalls

---

### Pitfall 6: `astro.config.mjs` Missing `site:` URL Causes Sitemap and Canonical Failures

**What goes wrong:** If `site: 'https://redbirdlawnservice.com'` is not set in `astro.config.mjs`, the `@astrojs/sitemap` integration generates no sitemap, and canonical URL meta tags resolve to relative paths. Google cannot index a relative canonical.

**Why it happens:** Astro requires an absolute `site` URL to generate any absolute URLs at build time. This is a required field for static deployments, not a default.

**Consequences:** `sitemap.xml` is empty or missing. Canonical tags point to relative paths. SEO benefit of the sitemap is zero.

**Prevention:**
- Set `site: 'https://redbirdlawnservice.com'` in `astro.config.mjs` on day one, before any SEO work.
- Verify with `npx astro build && cat dist/sitemap-index.xml` — it should contain the full absolute URL.
- Add `<link rel="sitemap" href="/sitemap-index.xml" />` in the `<head>`.

**Detection:** Run `astro build` and inspect `dist/sitemap-index.xml`. Empty or missing file = this pitfall.

**Phase:** Foundation (Phase 1)

---

### Pitfall 7: Wrong `serviceType` and Missing Fields in LocalBusiness JSON-LD

**What goes wrong:** Using the generic `LocalBusiness` type instead of `LawnCareService` (or `HomeAndConstructionBusiness`) misses schema richness. Missing fields like `areaServed`, `priceRange`, `openingHoursSpecification`, and `sameAs` reduce schema quality and rich result eligibility.

**Why it happens:** Most tutorials show minimal JSON-LD. Developers copy a template and don't check which properties Google's Rich Results Test flags as recommended.

**Consequences:** Schema validates but earns no rich result features. Lower schema quality score. Missing `areaServed` means Google has less signal that this business serves Wentzville, MO.

**Prevention:** Use this minimum field set:
  - `@type`: `["LocalBusiness", "LawnCareService"]`
  - `name`, `telephone`, `email`, `url`
  - `address` (full `PostalAddress` with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`)
  - `areaServed`: `"Wentzville, MO"`
  - `openingHoursSpecification`
  - `sameAs`: GBP URL, Facebook page URL
  - `image`: absolute URL to a real photo

**Detection:** Run output through [Google Rich Results Test](https://search.google.com/test/rich-results). All recommended fields should be present.

**Phase:** SEO / Schema markup

---

### Pitfall 8: Font-Induced Cumulative Layout Shift (CLS) Killing Lighthouse Score

**What goes wrong:** Space Grotesk and Inter have different metrics than system fonts. When `font-display: swap` is used without a size-adjusted fallback, the page renders with a system font, then swaps to the web font, causing a visible layout shift. On a heading-heavy landing page, this is a significant CLS hit.

**Why it happens:** `font-display: swap` prevents FOIT (invisible text) but causes FOUT (text flash) + layout shift when font metrics differ significantly from the fallback.

**Consequences:** CLS above 0.1 fails the "Good" Core Web Vitals threshold. Lighthouse score drops below 95 target. Real-user CLS (CrUX) data impacts Google ranking.

**Prevention:**
- Use Astro 6's built-in Fonts API — it auto-generates size-adjusted `@font-face` fallbacks that match web font metrics, minimizing layout shift.
- If using `astro-font` instead, also install `fontaine` for fallback font metric adjustment.
- Subset fonts to Latin character sets only — reduces file size by ~60-80%.
- Preload the above-the-fold font (Space Grotesk, used in H1) with `<link rel="preload" as="font">`.
- Test CLS specifically on mobile throttled 3G in Chrome DevTools, not just desktop Lighthouse.

**Detection:** Lighthouse CLS > 0.1. WebPageTest filmstrip shows text reflow between frames 1-3.

**Phase:** Performance / Font setup

---

### Pitfall 9: GHL Webhook CORS Failure from Static Site Form Submission

**What goes wrong:** Submitting the lead capture form via `fetch()` to a GoHighLevel webhook URL triggers a CORS preflight. If the GHL webhook endpoint does not return CORS headers for the production domain, the form submission silently fails in the browser.

**Why it happens:** Browsers enforce CORS on cross-origin `fetch()` requests. GHL webhook endpoints are cross-origin. This works in Postman / server-side but fails in-browser on a static site.

**Consequences:** Form appears to submit successfully (no visible error to user) but lead never reaches GHL. Alberto misses inbound leads.

**Prevention:**
- Test the form submission with browser DevTools Network tab open in production, not just locally.
- If GHL webhook does not support CORS: use a Cloudflare Worker as a proxy (free tier, trivial to set up) that forwards the POST server-side.
- Add explicit error handling in the React form component that shows a fallback "Call us at (314) 497-6152" message if the webhook fails.
- Always handle the `catch` block in form submit — never assume the webhook succeeded.

**Detection:** Form submits with 200 response in DevTools but no lead appears in GHL. Or Network tab shows CORS preflight failure (red request, `Access-Control-Allow-Origin` missing).

**Phase:** Lead capture integration

---

### Pitfall 10: Scroll Animations Cause Accessibility and CLS Problems

**What goes wrong:** CSS + Intersection Observer animations that fade/slide elements in from `opacity: 0; transform: translateY(20px)` cause two problems:
1. Content is invisible until scrolled into view — fails accessibility for users who scroll quickly or use keyboard navigation.
2. If `transform` is applied to elements that affect layout flow, CLS can occur.

**Why it happens:** Developers test animations on fast hardware by slowly scrolling. Edge cases with fast scroll, keyboard users, and reduced-motion preferences are missed.

**Consequences:** Accessibility score below 95 target. Content inaccessible to screen reader users until they "trigger" the animation. Potential CLS from improperly structured animation targets.

**Prevention:**
- Always implement `prefers-reduced-motion` media query: if set, skip all transitions and show content immediately.
- Only animate `opacity` and `transform` — never `height`, `width`, `margin`, or `padding` (these cause layout recalculation and potential CLS).
- Ensure animated elements have reserved space before animation triggers (never set `display: none` — use `opacity: 0` with `visibility: hidden`).
- Set `rootMargin: '-10% 0px'` on the Intersection Observer so elements trigger before they're fully in viewport, preventing content "popping in" as the user scrolls.

**Detection:** Lighthouse Accessibility tab. Axe DevTools scan. Manual keyboard navigation test — tab through the page and verify all content is reachable before scrolling to it.

**Phase:** UI / Animation implementation

---

### Pitfall 11: Cloudflare Auto Minify Breaking React Hydration

**What goes wrong:** Cloudflare's "Auto Minify" feature (HTML/JS/CSS) in the Speed settings can corrupt the serialized React component state embedded in the HTML during Astro's server rendering. This causes React to fail hydration with "Hydration completed but contains mismatches."

**Why it happens:** Cloudflare's minifier strips whitespace or rewrites attribute ordering in ways that don't match the expected hydration payload.

**Consequences:** React islands (contact form, VAPI widget, mobile nav) silently fail to hydrate. Form appears rendered but is non-functional.

**Prevention:**
- Disable Cloudflare Auto Minify for HTML. Keep CSS/JS minification if desired, but HTML minification is the primary offender.
- Path: Cloudflare Dashboard > Speed > Optimization > Auto Minify > uncheck HTML.
- Astro's build output is already minified — Cloudflare's additional pass is redundant and risky.

**Detection:** Open browser console on production. Look for React hydration mismatch warnings. Test all interactive components (form, VAPI button, nav drawer) on the `*.pages.dev` URL.

**Phase:** Deployment / QA

---

## Minor Pitfalls

---

### Pitfall 12: `lucide-react` Imported Incorrectly Bloating JS Bundle

**What goes wrong:** Importing lucide-react as `import { Phone, MapPin, Star } from 'lucide-react'` is correct tree-shaking. But importing with `import * as Icons from 'lucide-react'` or via a barrel re-export imports the entire 1,000+ icon library (~200KB), destroying the JS budget.

**Prevention:** Always use named imports. Verify with `npx astro build --verbose` that the bundle report shows only the icons actually used. Target: 3-5 icons at ~1KB each gzipped.

**Phase:** Foundation / Component build

---

### Pitfall 13: Missing `width` and `height` on Images Causing CLS

**What goes wrong:** Any `<img>` (or `next/image` equivalent — here `<Image>` from `astro:assets`) without explicit `width` and `height` attributes causes the browser to not reserve space, causing layout shift when the image loads.

**Prevention:**
- Always specify `width` and `height` on every image, including the hero.
- Use `aspect-ratio` CSS property for responsive images that should scale fluidly.
- For the hero, also add `fetchpriority="high"` and `loading="eager"` — this is the LCP element.

**Phase:** UI / Image optimization

---

### Pitfall 14: `robots.txt` Blocking Cloudflare Pages Preview URLs

**What goes wrong:** Cloudflare Pages creates preview deployment URLs (`<hash>.pages.dev`) for every commit. If `robots.txt` does not disallow these preview domains, Google can index them as duplicate content of the production site.

**Prevention:**
- Set `Disallow: /` in robots.txt only for preview environments — either via a Cloudflare Worker header approach or by ensuring the canonical URL is always set to the production domain.
- The simplest fix: ensure every page has `<link rel="canonical" href="https://redbirdlawnservice.com/">` pointing to production, so even if Googlebot crawls a preview URL, canonical signals redirect credit to production.

**Phase:** SEO / Deployment configuration

---

### Pitfall 15: Mobile Tap Target Size Below 44px for CTA Buttons

**What goes wrong:** The primary CTA button and click-to-call link render below the minimum 44x44px tap target size on mobile, causing accidental misses and Lighthouse Accessibility failures.

**Prevention:**
- All interactive elements must have a minimum `min-height: 44px` and `min-width: 44px`.
- For the click-to-call `<a href="tel:...">`, wrap it in a block with `py-3 px-6` Tailwind classes at minimum.
- Test by running Lighthouse Accessibility audit — it explicitly flags undersized tap targets.

**Phase:** UI / Mobile design

---

### Pitfall 16: Astro Build Node.js Version Mismatch on Cloudflare

**What goes wrong:** Cloudflare Pages defaults to an older Node.js version for builds, which may be incompatible with Astro 6's minimum Node requirement or Tailwind v4's Vite plugin.

**Prevention:**
- Add a `.nvmrc` file in the project root specifying `22` (or whatever Node version is used locally).
- Alternatively, set `NODE_VERSION=22` in Cloudflare Pages environment variables.
- Verify: after first successful build, check the build log to confirm Node version.

**Phase:** Foundation / CI setup

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Initial project scaffold | Tailwind v4 `@apply` scoped style issue | Use inline utilities; add `@reference` if scoped styles are needed |
| Cloudflare Pages first deploy | Silent Workers routing | Verify URL is `*.pages.dev`; set `output: 'static'` explicitly |
| SEO / Schema markup | NAP mismatch + wrong schema type | Document canonical NAP string first; use `LawnCareService` type |
| Font loading | CLS from font swap | Use Astro 6 Fonts API; subset to Latin; preload hero font |
| Lead capture form | GHL webhook CORS failure | Test in browser DevTools on production; have CF Worker proxy ready |
| VAPI widget | SSR crash + CSP failure | `client:only="react"`; add `unsafe-eval` to CSP `_headers` |
| Scroll animations | Accessibility + CLS | Implement `prefers-reduced-motion`; animate only opacity/transform |
| Production QA | Cloudflare Auto Minify breaking hydration | Disable HTML Auto Minify in CF Speed settings |
| SEO sitemap | Missing/empty sitemap | Set `site:` in `astro.config.mjs` before build |
| Image handling | CLS from unsized images | Always declare `width` + `height`; `fetchpriority="high"` on hero |

---

## Sources

- [How to Deploy Astro on Cloudflare Pages Without Getting Screwed by Hidden UI Traps](https://www.gmkennedy.com/blog/deploy-astro-cloudflare-pages/)
- [Cloudflare Pages Headers configuration](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages Redirects configuration](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Astro Cloudflare integration docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Astro deploy to Cloudflare guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [VAPI client-sdk-web GitHub Issues](https://github.com/VapiAI/client-sdk-web/issues)
- [VAPI Web calls SDK docs](https://docs.vapi.ai/sdk/web)
- [Tailwind v4 @apply broken in Astro style blocks — GitHub Discussion #16429](https://github.com/tailwindlabs/tailwindcss/discussions/16429)
- [Tailwind v4 @apply broken — GitHub Issue #16346](https://github.com/tailwindlabs/tailwindcss/issues/16346)
- [Astro site failing after upgrading Tailwind v3 to v4 — GitHub Issue #18055](https://github.com/tailwindlabs/tailwindcss/issues/18055)
- [Tailwind CSS v4 Astro installation guide](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [NAP Consistency for Local SEO - BrightLocal](https://www.brightlocal.com/learn/what-is-nap/)
- [LocalBusiness Structured Data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Common Schema Markup Errors That Kill SEO — Medium](https://robertcelt95.medium.com/common-schema-markup-errors-that-kill-your-seo-rankings-cc64a83480af)
- [Astro Font optimization — Rodney Lab](https://rodneylab.com/astro-self-hosted-fonts/)
- [Reduce font CLS in Astro with Fontaine — John Eatmon](https://eatmon.co/blog/using-fontaine-with-astro)
- [Astro sitemap integration docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [WebRTC Safari guide 2025 — VideoSDK](https://www.videosdk.live/developer-hub/webrtc/webrtc-safari)
- [Hybrid sites broken in Cloudflare Workers — Astro GitHub Issue #15237](https://github.com/withastro/astro/issues/15237)
- [Lighthouse performance scoring — Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Lead Generation Mistakes: The Ultimate Guide — pyrsonalize](https://pyrsonalize.com/blog/common-mistakes-to-avoid-in-lead-generation-campaigns/)
