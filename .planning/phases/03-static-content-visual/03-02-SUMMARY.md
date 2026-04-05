---
phase: 03-static-content-visual
plan: "02"
subsystem: ui
tags: [astro, tailwind, hero, header, trust-bar, click-to-call, seo, dark-mode]

# Dependency graph
requires:
  - phase: 03-01
    provides: brand color tokens (bg-redbird-red, bg-forest-green, etc.), SectionWrapper.astro, data-animate scroll system, global.css animation CSS

provides:
  - Sticky Header.astro with click-to-call (NAP.phoneHref) and desktop nav
  - TrustBar.astro with 3 trust signals (Locally Owned, Fully Insured, 5-Star Rated)
  - Hero.astro with exact H1, primary CTA (#contact), click-to-call, 24hr response promise, geometric background
  - index.astro wired to render Header + TrustBar + Hero above the fold

affects:
  - 03-03 (Services, About, Testimonials, ContactPlaceholder, Footer sections compose after Hero in same index.astro)
  - Phase 4 (MobileNav React island slots into Header; ContactForm React island replaces #contact placeholder)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - NAP import pattern: all business data imported from src/lib/constants.ts, never hardcoded in components
    - Geometric CSS backgrounds: decorative shapes via absolute-positioned divs with brand color opacity utilities (no images)
    - data-animate stagger: sequential data-animate-delay="100/200/300" for H1 → subheadline → CTAs → promise
    - Dark mode via dark: variants on every background/text color

key-files:
  created:
    - src/components/astro/Header.astro
    - src/components/astro/TrustBar.astro
    - src/components/astro/Hero.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "Phone number and business name rendered only via NAP.phone / NAP.phoneHref / NAP.name — no hardcoded strings in any component"
  - "Hero background is CSS geometric shapes (absolute-positioned divs with opacity utilities) — no stock photos per locked CONTEXT.md decision"
  - "Click-to-call appears twice above fold: sticky header (always visible, CONV-05) and hero secondary CTA (CONV-02)"
  - "TrustBar placed between Header and Hero so trust signals appear immediately below sticky nav on all viewport heights"

patterns-established:
  - "NAP import pattern: import { NAP } from '../../lib/constants' — no hardcoded business data in components"
  - "Geometric background pattern: absolute inset-0 overflow-hidden pointer-events-none wrapper containing decorative shape divs"
  - "Hero CTA layout: flex-col on mobile, flex-row sm:flex-row on desktop with full-width buttons on small screens"

requirements-completed: [CONT-01, CONT-02, CONV-01, CONV-02, CONV-04, CONV-05, SEO-04]

# Metrics
duration: 3min
completed: 2026-04-05
---

# Phase 03 Plan 02: Above-the-Fold Hero Summary

**Sticky header with click-to-call, trust bar with 3 signals, and Hero with SEO-target H1 + #contact CTA + 24hr promise built and rendered in static HTML**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-05T22:03:53Z
- **Completed:** 2026-04-05T22:06:22Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Header.astro created — sticky top-0 z-50, brand name link, desktop nav, always-visible click-to-call button from NAP constants, dark mode support
- TrustBar.astro created — forest-green bar with SVG icon + text for each of the 3 required trust signals
- Hero.astro created — exact H1 text "Expert Residential Lawn Care in Wentzville, MO", Get a Free Quote button anchored to #contact, secondary click-to-call via NAP.phoneHref, "We respond within 24 hours" promise, CSS geometric background, data-animate stagger on all key elements
- index.astro updated to import and compose Header + TrustBar + Hero; build passes and dist/index.html confirmed all 5 required strings

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sticky Header.astro** - `2028524` (feat)
2. **Task 2: TrustBar.astro, Hero.astro, index.astro** - `6433f47` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `src/components/astro/Header.astro` - Sticky header with brand name + click-to-call phone button sourced from NAP constants
- `src/components/astro/TrustBar.astro` - Forest-green trust bar with home/shield/star SVG icons and the 3 required trust signals
- `src/components/astro/Hero.astro` - Full hero section: exact H1, geometric CSS background, primary + secondary CTAs, response time promise
- `src/pages/index.astro` - Updated to compose Header + TrustBar + Hero replacing the scaffold placeholder

## Decisions Made

Phone number and business name are rendered only through NAP imports from constants.ts — zero hardcoded strings in components. Hero background uses CSS geometric shapes (absolute-positioned divs with opacity utilities) per the locked decision in 03-CONTEXT.md (no stock photos). Click-to-call appears in both the sticky header and the hero secondary CTA for maximum above-fold exposure. TrustBar sits immediately below the header so trust signals are the second thing every visitor sees.

## Deviations from Plan

None — plan executed exactly as written. All three components match the exact markup specified in the plan, including NAP constants usage, CSS class names, data-animate attributes, and copy text.

## Issues Encountered

None. Build passed on first attempt in 7.38s.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Above-the-fold is complete: Header, TrustBar, Hero are wired and rendering in static HTML
- Plan 03 can proceed immediately to add Services, About, Testimonials, ContactPlaceholder, and Footer sections below the Hero
- The `<main id="main-content">` wrapper in index.astro is in place with a comment indicating where Plan 03 sections insert
- Phase 4 hook points are in place: desktop nav links (#services, #about, #testimonials, #contact) and `<main>` structure ready for React islands

---
*Phase: 03-static-content-visual*
*Completed: 2026-04-05*
