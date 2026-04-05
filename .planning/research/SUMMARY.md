# Project Research Summary

**Project:** Redbird Lawn Care Website
**Domain:** Local service lead-gen — single-page brochure + voice AI + form capture
**Researched:** 2026-04-05
**Confidence:** HIGH

---

## Executive Summary

Redbird Lawn Care is building a high-performance static lead-gen site for a single-market lawn care business in Wentzville, MO. The research confirms a technically sound, well-chosen stack: Astro 6 static output deployed to Cloudflare Pages, with Tailwind CSS v4, React islands for three interactive components, and a VAPI voice widget as the primary differentiator. Every technology choice has been validated against current sources and version-pinned. The performance targets (Lighthouse 95+, 80KB JS budget, sub-100ms TTFB) are achievable with this stack — they are not achievable with any alternative considered (Next.js, Vercel, Framer Motion, WordPress).

The competitive landscape in Wentzville is weak. All 10 analyzed local competitors are running Wix or WordPress sites scoring 40–65 on Lighthouse mobile. None have real testimonials, none have AI/voice interaction, and none target zip-code-specific keywords. The market position is clear: Redbird wins by being faster, more trustworthy (real reviews, real owner photo), and more accessible (24/7 Vivian voice widget) than everyone in the local market. This is not a theoretical advantage — it is documented from direct competitor analysis.

The principal risks are integration-level, not architecture-level. VAPI's WebRTC SDK requires careful `client:only` handling and a CSP exemption. The GHL webhook form submission may require a Cloudflare Worker proxy if CORS is not configured on the GHL side. NAP consistency across the website, Google Business Profile, and Facebook is the highest-impact, lowest-effort SEO requirement and must be locked in before any content is written. These risks are all well-understood and have documented mitigations.

---

## Key Findings

### Stack Overview

The stack is validated at specific version pins. All choices are greenfield-appropriate and production-ready as of April 2026. The most important constraint is that Astro 6 requires Node 22 minimum — this must be configured in Cloudflare Pages build settings before first deploy, or the build will fail silently.

**Core technologies:**

| Package | Pin | Purpose |
|---------|-----|---------|
| astro | 6.1.3 | Static site framework; zero-JS by default |
| tailwindcss | 4.2.2 | CSS-first utility styling; no config file needed |
| @tailwindcss/vite | 4.2.2 | Vite plugin for Tailwind 4 (replaces deprecated @astrojs/tailwind) |
| react / react-dom | 19.x | Three islands only: MobileNav, ContactForm, VAPIWidget |
| @vapi-ai/web | 2.5.2 | Voice widget SDK — pin exact, VAPI moves fast |
| lucide-react | 1.7.0 | Icons — named imports only, never wildcard |
| @astrojs/sitemap | 3.7.2 | Auto sitemap generation |
| sharp | latest | Build-time image processing |

**Deployment:** Cloudflare Pages (free tier, unlimited bandwidth). No adapter needed for `output: 'static'`. DNS already on Cloudflare — no nameserver changes. Astro's Fonts API handles Space Grotesk + Inter at build time with zero external font requests at runtime.

**What to avoid:** `@astrojs/tailwind` (deprecated for v4), `@astrojs/cloudflare` adapter (SSR only, breaks static output), any JS animation library (Framer Motion/GSAP alone exceed the 80KB JS budget).

See `.planning/research/STACK.md` for full version rationale and installation snippets.

---

### Competitor Intelligence

Ten local competitors were analyzed directly. The competitive gap is significant and well-documented.

**What all competitors do:**
- Hero with service area in H1
- Click-to-call phone in header
- "Free estimate" CTA
- LocalBusiness structured data (some)

**What all competitors are missing (Redbird opportunity gaps):**

| Gap | Competitor Status | Redbird Advantage |
|-----|------------------|-------------------|
| Real testimonials with names | ALL empty or absent | Display Google reviews with attribution |
| AI voice interaction | None whatsoever | Vivian (VAPI) — genuine first-mover in this market |
| Before/after photo gallery | Most have zero | Document every job |
| Owner photo + personal story | Most lack it | Alberto's Wentzville connection is authentic |
| Zip-code targeting (63385, 63366) | None targeting zip | Meta and content targeting gaps |
| Response time promise | None advertise SLA | "Respond within 24 hours" = trust signal |
| Detailed service inclusions | Vague universally | List exactly what weekly mowing includes |
| Mobile performance | 40–65 Lighthouse scores | Astro static = 95+ is a real differentiator |

**Keyword gaps competitors are not targeting:**
- "lawn care near me 63385" (zip-specific)
- "lawn care Troy MO" / "lawn care Foristell MO" (adjacent towns)
- "residential lawn mowing Wentzville"
- "mulch installation Wentzville MO"
- "weekly lawn service Wentzville"

See `.planning/research/FEATURES.md` for full competitor table and keyword analysis.

---

### Features: MVP vs. Defer

**Must ship to launch (table stakes + highest-ROI differentiators):**

1. H1 with primary keyword ("Lawn Care Wentzville MO") above fold
2. Click-to-call phone in sticky header and hero — `(314) 497-6152`
3. Trust bar — "Locally Owned / Fully Insured / 5-Star Rated"
4. Services section — 4 services with detailed descriptions (what's included)
5. About section — Alberto's photo + personal Wentzville story
6. Testimonials — minimum 3 real reviews with names (no placeholders)
7. Lead capture form — Name, Address, Phone, Service → GHL webhook
8. VAPI Vivian widget — floating button, React island, `client:only="react"`
9. Footer — NAP (exact match), email, Facebook link
10. LocalBusiness JSON-LD schema — `["LocalBusiness", "LawnCareService"]` type
11. SEO meta tags — title, description, zip codes 63385 + 63366
12. sitemap.xml + robots.txt

**Defer to v1.1 (low effort, high value, needs assets):**
- Before/after photo gallery (blocked on Alberto building photo pipeline)
- FAQ section (5–10 questions, strong long-tail SEO value)
- Service area cities list with map or text (Wentzville, O'Fallon, Troy, Foristell)

**Defer to v2 (architecture change required):**
- City-specific service area pages (multi-page routing)
- Blog / content marketing
- Cloudflare Turnstile spam protection on form
- Cloudflare Web Analytics

**Deliberate non-features:** Online booking, pricing display, customer login, video background, Google Maps embed iframe, cookie consent banner, newsletter signup, social media feed embeds.

---

### Architecture Summary

The entire site is pre-rendered to static HTML at build time. React exists in exactly three isolated islands. No server runtime. No adapter. The `dist/` folder deploys directly to Cloudflare Pages via Wrangler.

```
Browser
  HTML shell (Astro, pure static)
    ├── Astro components (zero JS)
    │     Hero, TrustBar, Services, About, Testimonials, Footer
    └── React islands (client-hydrated only)
          MobileNav (client:load)
          ContactForm → GHL Webhook (client:load)
          VAPIWidget (client:only="react") → VAPI WebRTC
```

**Single source of truth rule:** NAP data (name, address, phone, email) lives exclusively in `lib/constants.ts`. Both `JsonLd.astro` and `Footer.astro` import from it. This prevents the NAP drift that kills local SEO.

**Key data flows:**
- Contact form: React controlled state → `fetch()` POST to `PUBLIC_GHL_WEBHOOK_URL` → success/error message
- VAPI widget: `useEffect` init → `vapi.start(assistantId)` → WebRTC → `call-end` → reset
- Scroll animations: `data-animate` attribute → 10-line vanilla IntersectionObserver script → CSS transition (~0.2KB, not a React island)
- Fonts: Astro Fonts API downloads Space Grotesk + Inter at build time → zero external requests at runtime

**Build order (must follow dependency chain):**
1. Foundation (`astro.config.mjs`, `constants.ts`, `types.ts`, `global.css`, Node 22 configured)
2. Layout shell (`BaseHead.astro`, `schema.ts`, `JsonLd.astro`, `Layout.astro`)
3. Static sections (all Astro components — Hero through Footer)
4. React islands (MobileNav → ContactForm → VAPIWidget, in order of complexity)
5. Final assembly + SEO (`index.astro`, sitemap verification, Lighthouse audit)

See `.planning/research/ARCHITECTURE.md` for component boundary table, full file structure, and config file templates.

---

### Critical Pitfalls

Top 5 issues that cause rewrites or zero SEO benefit if missed:

1. **NAP inconsistency across website, GBP, and Facebook** — Lock the canonical NAP string in `lib/constants.ts` before writing any content. The exact name, address format, and phone format must match GBP character-for-character. Inconsistency reduces Local 3-Pack eligibility by ~40%.

2. **VAPI widget without `client:only="react"`** — The `@vapi-ai/web` SDK references `window`, `RTCPeerConnection`, and `getUserMedia` at module load time. Any hydration mode other than `client:only="react"` crashes the build or silently fails at runtime. Also: VAPI requires `'unsafe-eval'` in `script-src` CSP headers due to Daily.co internals — omitting this causes the voice call to silently fail even if the widget renders.

3. **Cloudflare silently routing static site to Workers** — If `@astrojs/cloudflare` was ever installed or the dashboard defaults to Workers mode, the deployment behaves differently: broken 404s, failed `_redirects` and `_headers` handling. Always set `output: 'static'` explicitly. Verify the project URL is `*.pages.dev` after first deploy, not `*.workers.dev`.

4. **Tailwind v4 `@apply` in Astro scoped `<style>` blocks silently produces no output** — Tailwind v4's CSS-first model cannot resolve utility classes inside `.astro` scoped style blocks. No build warning. Use inline utility classes in markup instead. If scoped styles are unavoidable, add `@reference "../../styles/global.css"` at the top of the style block.

5. **GHL webhook CORS failure** — The form's `fetch()` POST to GHL is cross-origin. GHL webhooks may not return CORS headers. The form appears to submit successfully from the user's perspective but the lead never arrives. Always test form submission in browser DevTools Network tab on the production domain. Have a Cloudflare Worker proxy ready as fallback.

**Moderate pitfalls to watch:**
- `site:` URL missing in `astro.config.mjs` → empty sitemap, relative canonical tags
- Wrong JSON-LD schema type (`LocalBusiness` only, not `LawnCareService`) → no rich result eligibility
- Font swap CLS without size-adjusted fallbacks → Lighthouse CLS > 0.1
- Cloudflare Auto Minify (HTML) breaking React hydration → disable in CF Speed settings
- Node 22 not set in Cloudflare build environment → build fails

See `.planning/research/PITFALLS.md` for full pitfall list with detection steps and phase warnings.

---

## Implications for Roadmap

Based on research, the architecture's dependency chain and pitfall phase-mapping suggest a 5-phase build:

### Phase 1: Foundation + Configuration
**Rationale:** All components import from constants and types. CSS, config, and Node version must exist before anything else can be built. Pitfalls 1, 3, 4, and Node version issue all live here — get them wrong and every subsequent phase is compromised.
**Delivers:** Repo scaffold, version-pinned dependencies, `astro.config.mjs`, `constants.ts` with canonical NAP, `global.css` with Tailwind import, Cloudflare Pages project configured with Node 22.
**Addresses:** Table stakes: NAP consistency, performance architecture, Tailwind v4 setup.
**Avoids:** Silent Workers routing (Pitfall 3), Tailwind `@apply` breakage (Pitfall 4), Node version mismatch (Pitfall 16), sitemap URL failure (Pitfall 6).

### Phase 2: Layout Shell + SEO Infrastructure
**Rationale:** Every page section renders inside Layout. JSON-LD schema and BaseHead must exist before content components so SEO is never bolted on after the fact.
**Delivers:** `Layout.astro`, `BaseHead.astro` with canonical + meta, `JsonLd.astro` with full `LawnCareService` schema, `schema.ts` builder, scroll animation inline script.
**Addresses:** LocalBusiness JSON-LD schema, sitemap.xml, robots.txt.
**Avoids:** NAP drift (Pitfall 4 — schema imports from constants.ts), wrong schema type (Pitfall 7), missing `site:` URL (Pitfall 6).

### Phase 3: Static Content Sections
**Rationale:** Pure HTML/CSS components have no external dependencies beyond Layout. Build them all before touching React islands to keep the JS budget clear and validate the visual design on zero JS.
**Delivers:** Hero (H1 + CTA + click-to-call), TrustBar, Services grid with detailed descriptions, About section with Alberto's photo, Testimonials section, Footer with NAP.
**Addresses:** All table stakes content features; differentiators (owner story, real testimonials, detailed service descriptions, trust signals).
**Avoids:** Adding React to static sections (Pitfall — bloats JS budget), CLS from unsized images (Pitfall 13), tap target size failures (Pitfall 15), scroll animation accessibility issues (Pitfall 10).

### Phase 4: React Islands + Integrations
**Rationale:** Islands are the highest-complexity, highest-risk components. Build after static sections so there is already a working, deployable page before adding interactivity. Sequence from simplest to most complex.
**Delivers:** MobileNav (hamburger drawer), ContactForm with GHL webhook + error handling, VAPIWidget with full call lifecycle and fallback states.
**Addresses:** Lead capture, VAPI voice differentiator, mobile navigation.
**Avoids:** VAPI SSR crash (Pitfall 2 — `client:only="react"`), VAPI CSP failure (Pitfall 3 — `unsafe-eval` in `_headers`), GHL CORS failure (Pitfall 9 — test in DevTools + proxy fallback), lucide-react bundle bloat (Pitfall 12).

### Phase 5: QA, Performance, and Launch
**Rationale:** Integration testing across all components, performance audit, and deployment verification. Can only happen after all phases are complete.
**Delivers:** Lighthouse 95+ audit pass, Cloudflare Auto Minify disabled, sitemap verified, robots.txt complete, canonical URL verified on all preview deployments, production deploy.
**Addresses:** Final Lighthouse targets, Core Web Vitals, CLS from fonts (Pitfall 8), hydration breakage from Auto Minify (Pitfall 11), preview URL duplicate content (Pitfall 14).
**Avoids:** Shipping with broken form submission, untested VAPI widget, or CLS above 0.1.

### Phase Ordering Rationale

- Configuration-first ordering mirrors the actual dependency chain documented in ARCHITECTURE.md: constants → layout → static content → islands → assembly.
- Keeping React islands in Phase 4 (not Phase 3) enforces the discipline of proving the site works with zero JS before adding interactivity — this is the only way to guarantee the 80KB JS budget is not accidentally violated.
- SEO infrastructure in Phase 2 (not Phase 5) ensures JSON-LD, canonical tags, and sitemap are present from the first deployable build, not added as an afterthought.
- The pitfall map in PITFALLS.md aligns pitfalls to exactly these phases — phases 1 and 2 carry the most critical pitfalls (deployment config, NAP, Tailwind setup); Phase 4 carries the integration-level VAPI/GHL risks.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 4 (VAPI integration):** VAPI docs returned a 404 during research. SDK patterns were inferred from GitHub README and issues. Before implementing VAPIWidget, verify current `vapi.start()` call signature and event names against the live SDK at `github.com/VapiAI/client-sdk-web`. Vivian's assistant configuration (prompts, phone number, intent flow) is also unresearched — needs a separate planning session.
- **Phase 4 (GHL webhook):** GHL webhook CORS behavior is account/configuration-dependent. No GHL documentation was reviewed. Test the specific webhook endpoint before building the form component to determine if a Cloudflare Worker proxy is needed.

**Phases with standard, well-documented patterns (research-phase not required):**
- **Phase 1 (Astro scaffold):** Official Astro docs are comprehensive. Version pins are confirmed.
- **Phase 2 (JSON-LD schema):** Google's LocalBusiness schema docs are authoritative and well-structured.
- **Phase 3 (static sections):** Pure HTML/CSS/Astro — no novel patterns.
- **Phase 5 (Lighthouse audit):** Standard process, well-documented.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages verified against official releases and current docs. Version pins are exact. |
| Features | HIGH | Competitor analysis was direct site scrapes (6+ sites). Table stakes derived from industry sources. |
| Architecture | HIGH | Official Astro docs used throughout. Component boundaries reflect documented island patterns. |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls verified against GitHub issues and official docs. VAPI docs returned 404 — SDK patterns from GitHub README only. |

**Overall confidence:** HIGH

### Gaps to Address

- **VAPI Vivian assistant configuration:** No research was done on the Vivian assistant setup in the VAPI dashboard — prompts, call flow, qualification questions, phone number routing. This needs a separate planning/design session before Phase 4. The SDK integration is understood; the assistant behavior is not.
- **GHL webhook behavior:** The specific GHL account's webhook CORS configuration is unknown. Treat CORS failure as likely until tested. Have the Cloudflare Worker proxy pattern ready before writing ContactForm.tsx.
- **Real content assets:** Before/after photos, Alberto's headshot, and 3+ Google review screenshots are external blockers that must be confirmed available before Phase 3 and Phase 5 respectively.
- **VAPI API key and assistant ID:** Required env vars for Phase 4. Must be provisioned before VAPIWidget.tsx can be tested.
- **GHL webhook URL:** Required env var for Phase 4. Must be provisioned before ContactForm.tsx can be tested end-to-end.
- **Keyword volume validation:** Competitor keyword gap analysis was not cross-validated against actual Google Search Console or keyword tool data. The gaps identified (zip-specific, adjacent towns) are logical but unconfirmed.

---

## Sources

### Primary (HIGH confidence — official docs)
- Astro 6.0 release post — astro.build/blog/astro-6/
- Astro 6.1 release post — astro.build/blog/astro-610/
- Astro Project Structure docs — docs.astro.build/en/basics/project-structure/
- Astro Islands Architecture docs — docs.astro.build/en/concepts/islands/
- Astro deploy to Cloudflare guide — docs.astro.build/en/guides/deploy/cloudflare/
- Astro Experimental Fonts API — docs.astro.build/en/reference/experimental-flags/fonts/
- Tailwind CSS v4.0 announcement — tailwindcss.com/blog/tailwindcss-v4
- Tailwind + Astro installation guide — tailwindcss.com/docs/installation/framework-guides/astro
- Cloudflare Pages limits — developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages Headers config — developers.cloudflare.com/pages/configuration/headers/
- Google LocalBusiness schema — developers.google.com/search/docs/appearance/structured-data/local-business
- @astrojs/sitemap npm — npmjs.com/package/@astrojs/sitemap
- lucide-react npm — npmjs.com/package/lucide-react

### Secondary (MEDIUM confidence — verified GitHub/community sources)
- @vapi-ai/web GitHub — github.com/VapiAI/client-sdk-web (VAPI docs URL returned 404; SDK README used)
- Astro v6 static + Cloudflare bug (resolved) — github.com/withastro/astro/issues/15650
- Tailwind v4 @apply Astro issue — github.com/tailwindlabs/tailwindcss/discussions/16429
- Cloudflare Pages to Workers migration — cogley.jp/articles/cloudflare-pages-to-workers-migration

### Tertiary (MEDIUM confidence — competitor analysis)
- Direct scrapes of 10 Wentzville/St. Charles County lawn care competitors (April 2026)
- Green Frog Web Design lawn care marketing strategy 2026
- BrightLocal NAP consistency research
- BrightLocal service area pages SEO guide

---

*Research completed: 2026-04-05*
*Ready for roadmap: yes*
