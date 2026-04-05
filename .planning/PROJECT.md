# Redbird Lawn Care Website

## What This Is

A high-performance, SEO-optimized local service website for Redbird Lawn Care Service, a residential lawn care company owned by Alberto Murillo in Wentzville, MO. The site establishes a professional digital footprint that ranks for local search, converts visitors into leads, and integrates a VAPI-powered AI voice assistant (Vivian) for automated customer interaction.

## Core Value

The website must rank for "lawn care services near Wentzville, MO," load in under 100ms TTFB, and convert residential homeowners into quote requests — if it doesn't rank, load fast, and convert, the business loses to competitors.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section with clear H1 targeting "lawn care Wentzville MO" and primary CTA for quote requests
- [ ] Services section highlighting Weekly Mowing, Trimming, Mulch & Bed Maintenance, Seasonal Cleanups
- [ ] About section featuring Alberto Murillo and local Wentzville connection
- [ ] Contact/lead capture form (Name, Address, Phone, Service Requested) posting to GHL webhook
- [ ] Click-to-call button for (314) 497-6152
- [ ] LocalBusiness JSON-LD schema markup with exact NAP matching GBP and Facebook
- [ ] Meta tags optimized for local search ("lawn care services near Wentzville, MO")
- [ ] Mobile-first responsive design (most local searches are mobile)
- [ ] Lighthouse 95+ Performance, 100 SEO, 95+ Accessibility, 100 Best Practices
- [ ] VAPI voice widget (Vivian AI assistant) integrated as floating button
- [ ] Self-hosted fonts (Space Grotesk headings, Inter body) via Astro Fonts API
- [ ] Scroll-triggered animations via CSS + Intersection Observer (no JS animation libraries)
- [ ] Footer with NAP, email (sales@redbirdlawnservic.com), Facebook link
- [ ] Trust signals: "Locally Owned & Operated" | "Fully Insured" | "5-Star Rated"
- [ ] Sitemap.xml auto-generated via @astrojs/sitemap
- [ ] robots.txt properly configured

### Out of Scope

- **Payment processing / Stripe** — Not needed for lead-gen site; quote requests handled offline
- **User accounts / authentication** — No login needed; this is a brochure + lead capture site
- **Blog / content management** — v1 is a single-page lead-gen site; blog deferred to v2
- **Multi-page site** — Single high-converting landing page for v1
- **Next.js** — Overkill for content site; Astro 6 delivers zero-JS-by-default with smaller bundles
- **Vercel hosting** — Cloudflare Pages chosen for unlimited free bandwidth and existing DNS setup
- **Framer Motion / GSAP** — Violates 80KB JS budget; CSS animations achieve same visual result
- **Stock photos / fake testimonials** — No fake content; real business, real results

## Context

- **Business:** Redbird Lawn Care Service, strictly residential in Wentzville, MO 63385
- **Owner:** Alberto Murillo, (314) 497-6152, sales@redbirdlawnservic.com
- **Current online presence:** Facebook page, Google Business Profile (assumed)
- **Competitor landscape:** Local lawn care market in Wentzville — needs competitive research to inform content strategy
- **Lead flow:** Website form → GHL webhook → Alberto's CRM pipeline
- **Voice assistant:** VAPI SDK with Vivian AI, using WebRTC (requires `client:only="react"`, never SSR)
- **DNS:** Already managed on Cloudflare

## Constraints

- **Framework:** Astro 6 with `output: 'static'` — zero JS by default, islands architecture
- **Deployment:** Cloudflare Pages free tier — unlimited bandwidth, 330+ edge locations
- **Performance:** Sub-100ms TTFB, Lighthouse 95+ across all categories
- **Bundle budget:** Total homepage < 500KB, JS < 80KB, CSS < 50KB, Fonts < 150KB
- **Zero external requests:** Self-host everything except GHL webhook and VAPI SDK
- **TypeScript:** Throughout the entire project
- **No fake content:** No lorem ipsum, no fake testimonials, no stock photo people
- **React islands only:** Contact form, VAPI widget, mobile nav drawer — nothing else gets React

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 6 over Next.js | Content-focused site; zero JS default = faster loads, 90% smaller bundles | — Pending |
| Cloudflare Pages over Vercel | Free unlimited bandwidth, DNS already on CF, Astro acquired by CF | — Pending |
| Tailwind 4 via @tailwindcss/vite | CSS-only config, native cascade layers, zero runtime; @astrojs/tailwind deprecated for v4 | — Pending |
| CSS animations over Framer Motion | JS budget < 80KB; CSS transitions + Intersection Observer achieves same visual result | — Pending |
| Space Grotesk + Inter fonts | Geometric/authoritative headings, clean readable body; self-hosted via Astro Fonts API | — Pending |
| lucide-react for icons | Tree-shakeable ESM, ~1KB per icon gzipped, largest community momentum | — Pending |
| @vapi-ai/web over React SDK | Lower-level control for single floating widget; React SDK adds unnecessary wrapper | — Pending |
| Competitor research before build | Analyze local competition to inform content strategy and SEO positioning | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-05 after initialization*
