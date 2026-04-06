# Roadmap: Redbird Lawn Care Website

## Overview

A 5-phase build that scaffolds a high-performance Astro 6 static site, wires up SEO infrastructure, delivers all static content sections, integrates React islands (contact form, mobile nav, VAPI voice widget), then audits and launches to Cloudflare Pages. Each phase is deployable and verifiable before the next begins. The project is complete when a homeowner in Wentzville can find the site on Google, click to call or fill out a quote form, and optionally speak with Vivian — all within a page that scores 95+ on Lighthouse.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Repo scaffold, version-pinned deps, Tailwind 4, self-hosted fonts, canonical NAP, Cloudflare Pages build config
- [ ] **Phase 2: Layout Shell + SEO** - BaseHead, Layout, JSON-LD schema, meta tags, sitemap, robots.txt, semantic HTML structure
- [x] **Phase 3: Static Content + Visual** - All Astro content sections (Hero through Footer), conversion elements, color palette, scroll animations (completed 2026-04-05)
- [ ] **Phase 4: React Islands + Integrations** - MobileNav, ContactForm → GHL webhook, VAPIWidget with Vivian, CSP headers
- [ ] **Phase 5: QA + Launch** - Lighthouse audit 95+, bundle verification, image optimization, custom domain, production deploy

## Phase Details

### Phase 1: Foundation
**Goal**: The project builds and deploys to Cloudflare Pages with zero content — just a working scaffold with correct config, pinned dependencies, canonical NAP as single source of truth, and Tailwind 4 rendering
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05, DEPL-01, DEPL-02, DEPL-04
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes without errors and `dist/` contains a valid static HTML file
  2. Cloudflare Pages deploys the `dist/` output at a `*.pages.dev` URL (not `*.workers.dev`)
  3. Space Grotesk and Inter fonts load from self-hosted assets — zero external font requests in DevTools Network tab
  4. A Tailwind utility class applied to any element renders correctly in the browser
  5. `lib/constants.ts` exports the canonical NAP (name, address, phone, email) and is the only place this data is defined
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Astro 6 project with pinned deps and canonical NAP constants
- [x] 01-02-PLAN.md — Wire Tailwind 4, Astro Fonts API (Space Grotesk + Inter), responsive layout scaffold
- [ ] 01-03-PLAN.md — Deploy to Cloudflare Pages, verify *.pages.dev URL, disable Auto Minify

### Phase 2: Layout Shell + SEO
**Goal**: Every page has a complete HTML head with canonical meta tags, LocalBusiness JSON-LD schema, sitemap.xml, and robots.txt — SEO infrastructure is in place before any content is written
**Depends on**: Phase 1
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-05, SEO-06, SEO-07
**Success Criteria** (what must be TRUE):
  1. Google's Rich Results Test validates the LocalBusiness JSON-LD schema with no errors, and the NAP in the schema matches `lib/constants.ts` exactly
  2. The page `<title>` is "Redbird Lawn Care Service | Top Rated Mowing in Wentzville, MO" and the meta description contains "63385"
  3. `sitemap.xml` is accessible at `/sitemap-index.xml` and contains the canonical site URL
  4. `robots.txt` is accessible at `/robots.txt` and allows all crawlers
  5. BaseHead.astro component exists and is imported in Layout.astro head section
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — SEO component layer: schema.ts, BaseHead.astro, JsonLd.astro, Layout.astro update
- [x] 02-02-PLAN.md — Static files + sitemap verification: robots.txt, og-image.png, @astrojs/sitemap build check

### Phase 3: Static Content + Visual
**Goal**: A homeowner visiting the site sees the complete Redbird brand experience — hero, services, about Alberto, real testimonials, trust signals, footer — all rendered with zero JavaScript, correct visual design, and scroll animations
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONV-01, CONV-02, CONV-04, CONV-05, VISL-01, VISL-02, VISL-03, VISL-04, SEO-04
**Success Criteria** (what must be TRUE):
  1. The hero H1 reads "Expert Residential Lawn Care in Wentzville, MO" and the "Get a Free Quote" CTA button is visible above the fold on mobile
  2. The services section shows all 4 services (Weekly Mowing, Trimming, Mulch & Bed Maintenance, Seasonal Cleanups) with detailed descriptions of what's included
  3. The about section shows Alberto Murillo's photo and references his Wentzville community connection
  4. The testimonials section shows at least 3 real customer reviews with names (no placeholder text)
  5. On mobile, a sticky header with the phone number (314) 497-6152 is visible at all times while scrolling
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Visual design foundation: @theme color tokens, animation CSS, SectionWrapper, IntersectionObserver
- [x] 03-02-PLAN.md — Above-fold sections: Header (sticky + click-to-call), Hero (H1 + CTA), TrustBar
- [x] 03-03-PLAN.md — Content sections + final composition: Services, About, Testimonials, Footer, index.astro wired

### Phase 4: React Islands + Integrations
**Goal**: A visitor can submit a quote request form (lead delivered to GHL), navigate the site on mobile via the hamburger drawer, and optionally speak with Vivian the AI assistant — all three React islands work without crashing the static build
**Depends on**: Phase 3
**Requirements**: CONV-03, VAPI-01, VAPI-02, VAPI-03, VAPI-04
**Success Criteria** (what must be TRUE):
  1. Submitting the contact form (Name, Address, Phone, Service Requested) with valid data delivers a lead to the GHL webhook — confirmed in GHL pipeline or Network tab showing 200 response
  2. The VAPI floating button renders without errors, clicking it initiates a voice call with Vivian, and microphone permission denial shows a graceful error message (not a blank screen or console crash)
  3. The mobile hamburger menu opens and closes the navigation drawer on touch devices
  4. The page build does not include the VAPI widget in the SSR pass — only `client:only="react"` hydration
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — CSP headers, env var scaffold, MobileNav island wired into Header
- [x] 04-02-PLAN.md — ContactForm (GHL CORS probe gate + form island) + VAPIWidget island wired into Layout
- [ ] 04-03-PLAN.md — Human verification of all three islands end-to-end

### Phase 5: QA + Launch
**Goal**: The site passes Lighthouse 95+/100/95+/100, stays within all bundle budgets, has a custom domain live on Cloudflare Pages, and is ready for a homeowner to find via Google search
**Depends on**: Phase 4
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, PERF-07, DEPL-03
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile audit scores: Performance 95+, SEO 100, Accessibility 95+, Best Practices 100
  2. Total homepage transfer size is under 500KB, JS bundle is under 80KB*, CSS is under 50KB, fonts are under 150KB — confirmed in DevTools Network tab
  3. TTFB on the Cloudflare Pages production URL is under 100ms (measured from a US-based location)
  4. All images below the fold use lazy loading and are served as WebP or AVIF
  5. The site is live at the custom domain (redbirdlawnservice.com or confirmed alternative) with HTTPS
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Performance optimization: ContactForm client:idle, CSP verification, PERF-05 budget override documented
- [ ] 05-02-PLAN.md — Lighthouse audit + Cloudflare Pages production deploy + custom domain checkpoint

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/3 | In Progress|  |
| 2. Layout Shell + SEO | 1/2 | In Progress|  |
| 3. Static Content + Visual | 3/3 | Complete   | 2026-04-05 |
| 4. React Islands + Integrations | 2/3 | In Progress|  |
| 5. QA + Launch | 1/2 | In Progress|  |
| 6. Blog Content | 3/3 | Complete   | 2026-04-06 |

### Phase 6: Blog Content
**Goal**: A blog section with 9 SEO-optimized articles written in Alberto's first-person voice at 8th-grade readability, targeting local lawn care keywords in Wentzville MO. Each article includes citations to reputable sources (university extension offices, turf science research). Blog infrastructure uses Astro content collections with a blog index page and individual post layouts.
**Depends on**: Phase 3
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07, BLOG-08, BLOG-09, BLOG-10, BLOG-11
**Success Criteria** (what must be TRUE):
  1. Blog index page at /blog lists all 9 articles with titles, dates, and excerpts
  2. Each article has a unique URL at /blog/{slug} with proper meta tags and JSON-LD Article schema
  3. All articles are written at 8th-grade reading level in Alberto's first-person voice
  4. Each article contains 2-3 citations to reputable sources (university extensions, USDA, turf research)
  5. Navigation includes a "Blog" link visible on desktop and mobile
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Blog infrastructure: content collection schema, index page, post layout, Article JSON-LD, nav updates
- [x] 06-02-PLAN.md — Articles 1-5: mowing frequency, lawn health 101, sharp blades, mowing pattern, mowing height
- [x] 06-03-PLAN.md — Articles 6-9: wet grass, edging, new sod, watering guide (parallel with Plan 02)
