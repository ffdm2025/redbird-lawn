# Phase 3: Static Content + Visual - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

A homeowner visiting the site sees the complete Redbird brand experience — hero, services, about Alberto, real testimonials, trust signals, footer — all rendered with zero JavaScript, correct visual design, and scroll animations. Covers CONT-01 through CONT-06, CONV-01, CONV-02, CONV-04, CONV-05, VISL-01 through VISL-04, and SEO-04.

</domain>

<decisions>
## Implementation Decisions

### Visual Design & Color
- Primary "Redbird red" accent: `#C41E3A` (cardinal red) — bold, stands out against greens
- Green palette: `#1a472a` dark forest, `#2d6a4f` mid green, `#52b788` light green — earthy/professional
- Neutral tones: whites, light grays for backgrounds, dark grays (#1a1a2e or similar) for text
- Dark mode: Subtle approach — dark gray backgrounds, muted greens, red accent stays vibrant
- Hero background: Gradient overlay on solid color with geometric/organic shapes — no stock photos per project constraint

### Content & Copy
- Testimonials: Use placeholder structure with realistic names and realistic-sounding content — Alberto fills with real reviews before launch. Mark clearly in code as placeholders.
- Service descriptions: Detailed bullet lists per service (e.g., "Mow, edge, blow, bag clippings") — this is a competitor gap, no one else in Wentzville does this
- About section: First-person from Alberto's perspective — "I started Redbird because..." — authentic, personal, local connection
- Footer: Full density — NAP, email, Facebook link, service area cities list (Wentzville, O'Fallon, Lake Saint Louis, Troy, Foristell), quick nav links

### Animation & Interaction
- Scroll animations: Fade-up with 20px translateY, 0.6s duration, staggered delays per section
- Animation trigger: IntersectionObserver at 15% threshold (fires early, feels responsive)
- Button hover: Scale 1.02 + shadow lift + color darken — subtle but tactile
- Service card hover: Subtle border glow + slight lift (translateY -2px)
- All animations via CSS transitions + Intersection Observer — no JS animation libraries (budget: <80KB JS)

### Semantic HTML (SEO-04)
- H1: "Expert Residential Lawn Care in Wentzville, MO" — one per page, in Hero
- H2: Section headings (Services, About, Testimonials, Contact)
- H3: Individual service names, testimonial attributions
- No skipped heading levels

### Claude's Discretion
- Exact component file organization (components/sections/ vs components/ui/)
- CSS class naming patterns (all Tailwind utility, no custom classes unless needed)
- Intersection Observer implementation details (single observer vs per-section)
- Responsive breakpoints beyond Tailwind defaults
- Exact spacing/padding values between sections

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/lib/constants.ts — NAP data (name, address, phone, email, services, serviceArea, social)
- src/layouts/Layout.astro — Base layout with BaseHead + JsonLd in head, Font components
- src/components/seo/BaseHead.astro — Meta tags, OG tags, canonical
- src/components/seo/JsonLd.astro — LocalBusiness schema
- src/lib/schema.ts — JSON-LD builder from constants
- src/styles/global.css — Tailwind import, font vars, dark mode variant

### Established Patterns
- Astro components (.astro) for all static content — no React for non-interactive sections
- Tailwind utility classes for styling
- CSS custom properties for font families (--font-heading, --font-body)
- Dark mode via @variant dark (&:is(.dark *))

### Integration Points
- src/pages/index.astro — main page, imports Layout, will import all section components
- Layout.astro slot — where page content renders

</code_context>

<specifics>
## Specific Ideas

- Competitor research shows all local competitors have empty/missing testimonials — real reviews with names are an immediate differentiator
- Service descriptions should spell out exactly what's included (mow, edge, blow, bag clippings) — competitors are universally vague
- Trust signals ("Locally Owned & Operated" | "Fully Insured" | "5-Star Rated") should appear above the fold
- Click-to-call (314) 497-6152 in sticky mobile header AND hero section
- "Get a Free Quote" primary CTA anchors to contact section (form built in Phase 4)
- Response time promise "We respond within 24 hours" near the CTA area
- Service area cities in visible content (not just JSON-LD) for SEO-07 keyword targeting

</specifics>

<deferred>
## Deferred Ideas

- Before/after photo gallery — needs real photos from Alberto (v2)
- FAQ section — v1.1, low effort high SEO value
- Service area city-specific landing pages — v2 multi-page architecture

</deferred>
