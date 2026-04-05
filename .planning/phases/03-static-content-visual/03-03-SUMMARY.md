---
phase: 03-static-content-visual
plan: "03"
subsystem: ui
tags: [astro, tailwind, components, seo, content, services, testimonials, footer]

# Dependency graph
requires:
  - phase: 03-static-content-visual
    provides: "SectionWrapper, brand color tokens, scroll animation CSS, Hero, TrustBar, Header"
  - phase: 02-layout-shell-seo
    provides: "Layout.astro, NAP constants, JSON-LD schema, sitemap"
provides:
  - "ServiceCard.astro — reusable service card with inline SVG icon, title, description, bullet list"
  - "Services.astro — 4-card grid (Weekly Mowing, Trimming, Mulch & Bed Maintenance, Seasonal Cleanups)"
  - "About.astro — Alberto Murillo bio, CSS photo placeholder, trust signals"
  - "Testimonials.astro — 3 placeholder reviews marked PLACEHOLDER in code"
  - "Footer.astro — full NAP from constants.ts, 5 service area cities, quick nav links"
  - "index.astro — fully composed single-page experience (all 8 components wired)"
affects:
  - 04-react-islands
  - phase-04

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline SVG icons in Astro components — zero JS, no lucide-react runtime"
    - "set:html={icon} for safe inline SVG injection in Astro"
    - "Testimonial placeholders marked // PLACEHOLDER in code per CONTEXT.md policy"
    - "CSS photo placeholder (initials in colored div) until real headshot provided"

key-files:
  created:
    - src/components/astro/ServiceCard.astro
    - src/components/astro/Services.astro
    - src/components/astro/About.astro
    - src/components/astro/Testimonials.astro
    - src/components/astro/Footer.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "Inline SVG strings in Services.astro — no lucide-react import prevents React runtime in static components"
  - "Phone number hardcoded in contact placeholder per plan note — placeholder replaced entirely in Phase 4"
  - "SOCIAL.facebook conditional render in Footer — hides Facebook link until GBP URL confirmed"

patterns-established:
  - "ServiceCard pattern: data-animate on article, set:html={icon} for SVG, hover:border-redbird-red hover:-translate-y-0.5"
  - "Section pattern: id= anchor, aria-labelledby, py-16 sm:py-20 px-4 outer, max-w-5xl mx-auto inner"
  - "Testimonial placeholder policy: each review object has // PLACEHOLDER comment; author/location fields required"

requirements-completed: [CONT-03, CONT-04, CONT-05, CONT-06]

# Metrics
duration: 4min
completed: 2026-04-05
---

# Phase 03 Plan 03: Services, About, Testimonials, Footer Summary

**5 content components built with detailed service bullet lists, first-person owner bio, 3 placeholder reviews, and full NAP footer — index.astro fully composed for single-page homeowner experience**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-05T22:09:28Z
- **Completed:** 2026-04-05T22:13:09Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Built ServiceCard.astro (reusable, data-animate, inline SVG, hover effects) and Services.astro (4 services with 5-bullet includes each) — covers CONT-03
- Built About.astro with first-person Alberto Murillo bio referencing Wentzville community and CSS initials placeholder for headshot — covers CONT-04
- Built Testimonials.astro with 3 placeholder reviews (Mike T./Wentzville, Sarah K./O'Fallon, James R./Lake Saint Louis), each clearly marked PLACEHOLDER in code — covers CONT-05
- Built Footer.astro importing NAP/SOCIAL from constants.ts, rendering all 5 service area cities (Wentzville, O'Fallon, Lake Saint Louis, Troy, Foristell), nav links, and copyright — covers CONT-06
- Fully composed index.astro with all 8 components wired and contact placeholder section (id="contact") ready for Phase 4 React island

## Task Commits

Each task was committed atomically:

1. **Task 1: ServiceCard.astro and Services.astro** - `0377007` (feat)
2. **Task 2: About, Testimonials, Footer, index.astro** - `5c01e80` (feat)

**Plan metadata:** _(docs commit to follow)_

## Files Created/Modified

- `src/components/astro/ServiceCard.astro` — Reusable card: icon (set:html), title (H3), description, bullet list with checkmarks; data-animate + VISL-03 hover effects
- `src/components/astro/Services.astro` — 4-card grid with inline SVG icons and detailed 5-bullet includes per service; H2 section heading for SEO-04
- `src/components/astro/About.astro` — Alberto Murillo first-person bio, CSS initials placeholder for headshot with replacement instructions, trust signals row
- `src/components/astro/Testimonials.astro` — 3 placeholder reviews with star ratings, blockquote text, figcaption attribution; each marked // PLACEHOLDER
- `src/components/astro/Footer.astro` — NAP from constants.ts (never hardcoded), 5 service area city list, quick nav links, conditional Facebook link, copyright
- `src/pages/index.astro` — Full single-page composition: Header, TrustBar, Hero, Services, About, Testimonials, contact placeholder, Footer

## Decisions Made

- Inline SVG strings in Services.astro rather than lucide-react imports — importing lucide-react in Astro components would add React runtime overhead to a static section; inline SVGs are ~200 bytes each
- Phone number hardcoded in contact section placeholder per plan note — this entire section will be replaced by a React island (ContactForm) in Phase 4 which will use constants.ts properly
- SOCIAL.facebook conditional render in Footer — `{SOCIAL.facebook !== '[CONFIRM FROM GBP]' && (...)}` hides the link until Alberto confirms the URL, preventing a broken href in production

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Photo placeholder (CSS initials div) | src/components/astro/About.astro | Alberto has not provided headshot yet; placeholder clearly marked with replacement instructions in comment |
| 3 placeholder testimonial reviews | src/components/astro/Testimonials.astro | Real Google reviews not yet collected; each marked // PLACEHOLDER in code per CONTEXT.md policy |
| Contact form placeholder section | src/pages/index.astro | React island (ContactForm) added in Phase 4; current placeholder maintains #contact anchor for CTA links |
| SOCIAL.facebook URL | src/lib/constants.ts | Awaiting GBP confirmation from Alberto; conditional render hides it from output until set |

_These stubs do not prevent the plan's goals from being achieved. All content sections are structurally complete. Stubs will be resolved: headshot and reviews by Alberto before launch; ContactForm in Phase 4; Facebook URL when GBP is confirmed._

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

Before launch, Alberto must provide:
1. **Headshot** — Replace the CSS initials placeholder in `About.astro`. Instructions in the comment block show the exact `<Image>` component code needed.
2. **Real Google reviews** — Replace the 3 `// PLACEHOLDER` review objects in `Testimonials.astro` with actual review text, author full names, and locations.
3. **Facebook URL** — Update `SOCIAL.facebook` in `src/lib/constants.ts` from `'[CONFIRM FROM GBP]'` to the actual Facebook page URL. Footer will auto-show it once set.

## Next Phase Readiness

Phase 3 is complete. All CONT requirements (CONT-03 through CONT-06) are satisfied.

Phase 4 (react-islands) can now add:
- ContactForm React island to replace the `#contact` placeholder section
- MobileNav drawer for the mobile hamburger menu
- VAPIWidget floating button for Vivian AI assistant

No blockers from this plan. Phase 4 blockers remain (VAPI docs, GHL webhook CORS) as documented in STATE.md.

---
*Phase: 03-static-content-visual*
*Completed: 2026-04-05*
