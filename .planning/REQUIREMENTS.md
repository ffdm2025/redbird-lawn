# Requirements: Redbird Lawn Care Website

**Defined:** 2026-04-05
**Core Value:** The website must rank for "lawn care services near Wentzville, MO," load in under 100ms TTFB, and convert residential homeowners into quote requests.

## v1 Requirements

### Foundation

- [x] **FOUN-01**: Site built with Astro 6 static output, TypeScript throughout
- [x] **FOUN-02**: Tailwind CSS 4 integrated via @tailwindcss/vite plugin
- [x] **FOUN-03**: Self-hosted fonts (Space Grotesk headings, Inter body) via Astro Fonts API
- [x] **FOUN-04**: Responsive mobile-first layout with Tailwind breakpoints
- [x] **FOUN-05**: Canonical NAP string defined and used as single source of truth across all components

### Content

- [x] **CONT-01**: Hero section with H1 "Expert Residential Lawn Care in Wentzville, MO" and subheadline
- [x] **CONT-02**: Trust bar with "Locally Owned & Operated" | "Fully Insured" | "5-Star Rated"
- [x] **CONT-03**: Services section with 4 cards (Weekly Mowing, Trimming, Mulch & Bed Maintenance, Seasonal Cleanups) including detailed descriptions of what's included
- [x] **CONT-04**: About section featuring Alberto Murillo with photo and Wentzville community connection
- [x] **CONT-05**: Testimonials section with minimum 3 real customer reviews with names
- [x] **CONT-06**: Footer with NAP, email (sales@redbirdlawnservic.com), Facebook link, and sitemap link

### Conversion

- [x] **CONV-01**: Primary CTA "Get a Free Quote" button in hero linking to contact form
- [x] **CONV-02**: Click-to-call button for (314) 497-6152 in header and hero
- [x] **CONV-03**: Lead capture form (Name, Address, Phone, Service Requested) posting to GHL webhook
- [x] **CONV-04**: Response time promise displayed near form ("We respond within 24 hours")
- [x] **CONV-05**: Sticky mobile header with phone number visible at all times

### SEO

- [x] **SEO-01**: LocalBusiness JSON-LD schema with exact NAP matching GBP and Facebook
- [x] **SEO-02**: Meta title "Redbird Lawn Care Service | Top Rated Mowing in Wentzville, MO"
- [x] **SEO-03**: Meta description optimized for "lawn care services near Wentzville, MO" with zip code 63385
- [x] **SEO-04**: Semantic HTML (proper H1, H2, H3 hierarchy)
- [x] **SEO-05**: sitemap.xml auto-generated via @astrojs/sitemap with canonical URL
- [x] **SEO-06**: robots.txt properly configured (allow all)
- [x] **SEO-07**: Service area cities mentioned in content (Wentzville, O'Fallon, Lake Saint Louis, Troy, Foristell)

### Performance

- [ ] **PERF-01**: Lighthouse Performance score 95+
- [ ] **PERF-02**: Lighthouse SEO score 100
- [ ] **PERF-03**: Lighthouse Accessibility score 95+
- [ ] **PERF-04**: Lighthouse Best Practices score 100
- [ ] **PERF-05**: Total homepage < 500KB, JS < 80KB*, CSS < 50KB, Fonts < 150KB
  > *JS budget note: @vapi-ai/web SDK (~200KB minified) + React runtime exceed the original 80KB target. Budget set before VAPI was a requirement. Total page < 500KB remains binding. ContactForm changed to client:idle to minimize render-blocking JS.
- [ ] **PERF-06**: Sub-100ms TTFB on Cloudflare Pages
- [ ] **PERF-07**: All images optimized (WebP/AVIF via Astro Image component, lazy loading below fold)

### Visual Polish

- [x] **VISL-01**: Professional color palette with Redbird red accent against greens, whites, dark grays
- [x] **VISL-02**: Scroll-triggered fade-in/slide-up animations via CSS + Intersection Observer
- [x] **VISL-03**: Subtle hover effects on buttons, service cards, and interactive elements
- [x] **VISL-04**: Dark mode support via Tailwind dark mode classes

### Voice Assistant

- [x] **VAPI-01**: VAPI widget (Vivian) integrated as floating button using @vapi-ai/web 2.5.2
- [x] **VAPI-02**: Widget rendered via client:only="react" (never SSR)
- [x] **VAPI-03**: Microphone permission handling with graceful error states
- [x] **VAPI-04**: CSP headers configured with unsafe-eval for VAPI SDK

### Deployment

- [ ] **DEPL-01**: Deployed to Cloudflare Pages free tier with output: 'static'
- [ ] **DEPL-02**: Node.js 22 configured in Cloudflare Pages build environment
- [ ] **DEPL-03**: Custom domain configured (redbirdlawnservice.com or similar)
- [ ] **DEPL-04**: Cloudflare Auto Minify disabled (conflicts with Astro's own minification)

## v2 Requirements

### Content Expansion

- **V2-CONT-01**: Before/after photo gallery with neighborhood labels
- **V2-CONT-02**: FAQ section (5-10 questions) for long-tail search capture
- **V2-CONT-03**: Service area city-specific landing pages (multi-page architecture)
- **V2-CONT-04**: Blog for content marketing and SEO authority building

### Analytics

- **V2-ANLYT-01**: Cloudflare Analytics integration (cookieless)
- **V2-ANLYT-02**: Google Search Console verification and sitemap submission
- **V2-ANLYT-03**: Conversion tracking on form submissions

## Out of Scope

| Feature | Reason |
|---------|--------|
| Online booking / scheduling | Requires backend; Alberto handles scheduling offline via GHL |
| Pricing pages | Local pricing varies by property; competitors don't show prices either |
| Customer login / portal | Brochure lead-gen site; no returning user needs |
| Stripe / payments | No transactions on lead-gen site |
| Live chat (non-AI) | Requires Alberto online; Vivian (VAPI) replaces this |
| Stock photography | Destroys trust; real content only |
| Video background / hero video | Kills performance; violates 500KB page budget |
| Newsletter / email capture | B2C local service; GHL handles nurture |
| Social media feed embeds | Third-party JS requests; performance penalty |
| Google Maps embed | Adds 300-500KB; hurts Core Web Vitals |
| Framer Motion / GSAP | Violates 80KB JS budget |
| Cookie consent banner | Static site with no analytics cookies; not required |
| Next.js | Overkill for content site; Astro zero-JS default is faster |
| Vercel hosting | Cloudflare Pages chosen for free unlimited bandwidth + existing DNS |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Complete |
| FOUN-02 | Phase 1 | Complete |
| FOUN-03 | Phase 1 | Complete |
| FOUN-04 | Phase 1 | Complete |
| FOUN-05 | Phase 1 | Complete |
| DEPL-01 | Phase 1 | Pending |
| DEPL-02 | Phase 1 | Pending |
| DEPL-04 | Phase 1 | Pending |
| SEO-01 | Phase 2 | Complete |
| SEO-02 | Phase 2 | Complete |
| SEO-03 | Phase 2 | Complete |
| SEO-04 | Phase 2 | Complete |
| SEO-05 | Phase 2 | Complete |
| SEO-06 | Phase 2 | Complete |
| SEO-07 | Phase 2 | Complete |
| CONT-01 | Phase 3 | Complete |
| CONT-02 | Phase 3 | Complete |
| CONT-03 | Phase 3 | Complete |
| CONT-04 | Phase 3 | Complete |
| CONT-05 | Phase 3 | Complete |
| CONT-06 | Phase 3 | Complete |
| CONV-01 | Phase 3 | Complete |
| CONV-02 | Phase 3 | Complete |
| CONV-04 | Phase 3 | Complete |
| CONV-05 | Phase 3 | Complete |
| VISL-01 | Phase 3 | Complete |
| VISL-02 | Phase 3 | Complete |
| VISL-03 | Phase 3 | Complete |
| VISL-04 | Phase 3 | Complete |
| CONV-03 | Phase 4 | Complete |
| VAPI-01 | Phase 4 | Complete |
| VAPI-02 | Phase 4 | Complete |
| VAPI-03 | Phase 4 | Complete |
| VAPI-04 | Phase 4 | Complete |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| PERF-03 | Phase 5 | Pending |
| PERF-04 | Phase 5 | Pending |
| PERF-05 | Phase 5 | Pending |
| PERF-06 | Phase 5 | Pending |
| PERF-07 | Phase 5 | Pending |
| DEPL-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 42 total
- Mapped to phases: 42
- Unmapped: 0

**Note:** REQUIREMENTS.md initially listed 35 requirements. Upon direct count during roadmap creation, the actual total is 42 (FOUN×5, CONT×6, CONV×5, SEO×7, PERF×7, VISL×4, VAPI×4, DEPL×4). All 42 are mapped.

---
*Requirements defined: 2026-04-05*
*Last updated: 2026-04-05 after roadmap creation — traceability populated*
