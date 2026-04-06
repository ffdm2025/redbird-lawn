---
phase: "06-blog-content"
plan: "02"
subsystem: "blog-content"
tags: ["blog", "seo", "content", "markdown", "astro"]
dependency_graph:
  requires: ["06-01"]
  provides: ["five-seo-articles"]
  affects: ["src/content/blog", "dist/blog"]
tech_stack:
  added: []
  patterns: ["astro-content-collections", "markdown-frontmatter", "first-person-local-seo"]
key_files:
  created:
    - src/content/blog/how-often-mow-lawn-wentzville-mo.md
    - src/content/blog/lawn-health-101-wentzville-homeowner.md
    - src/content/blog/why-sharp-mower-blades-matter.md
    - src/content/blog/why-we-alternate-mowing-pattern.md
    - src/content/blog/right-mowing-height-missouri-lawns.md
  modified: []
decisions:
  - "Articles target cool-season grass types dominant in Wentzville (tall fescue, Kentucky bluegrass)"
  - "Citations use MU Extension G6700 as anchor — it's the most authoritative local source"
  - "OSU Extension HYG-4020 added for scalping content (Penn State, Purdue, NTEP also used)"
  - "CTA format standardized: inline sentence + phone number + link to /#contact"
metrics:
  duration_seconds: 232
  completed_date: "2026-04-06"
  tasks_completed: 2
  files_created: 5
  files_modified: 0
---

# Phase 06 Plan 02: Blog Articles 1–5 Summary

**One-liner:** Five first-person SEO articles for Wentzville lawn care targeting mowing frequency, lawn health fundamentals, blade sharpness, mowing patterns, and seasonal mowing height — all with real university extension citations.

## What Was Built

Five markdown articles added to `src/content/blog/` as Astro content collection entries. Each article is written in Alberto Murillo's first-person voice at an 8th-grade reading level, targets local keywords (Wentzville, MO, St. Charles County, 63385), includes 2 real university extension citations, and ends with a CTA linking to (314) 497-6152.

All 5 articles rendered successfully at their `/blog/{slug}` URLs after `npm run build`. Build completed in 12.81 seconds with 0 errors.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Articles 1 and 2 — Mowing Frequency + Lawn Health 101 | e92ab09 | how-often-mow-lawn-wentzville-mo.md, lawn-health-101-wentzville-homeowner.md |
| 2 | Articles 3, 4, and 5 — Sharp Blades + Mowing Pattern + Mowing Height | acda272 | why-sharp-mower-blades-matter.md, why-we-alternate-mowing-pattern.md, right-mowing-height-missouri-lawns.md |

## Articles Created

**Article 1: How Often Should You Mow Your Lawn in Wentzville, MO?**
- Slug: `/blog/how-often-mow-lawn-wentzville-mo`
- Date: 2026-03-10
- Citations: MU Extension G6700, NTEP (ntep.org)
- Key topics: one-third rule, cool-season vs warm-season grass, seasonal mowing calendar

**Article 2: Lawn Health 101: What Every Wentzville Homeowner Should Know**
- Slug: `/blog/lawn-health-101-wentzville-homeowner`
- Date: 2026-03-17
- Citations: MU Extension G6700, USDA NRCS soil health
- Key topics: root system depth, mowing/watering/feeding triad, St. Charles County lawn calendar

**Article 3: Why Sharp Mower Blades Matter More Than You Think**
- Slug: `/blog/why-sharp-mower-blades-matter`
- Date: 2026-03-24
- Citations: MU Extension G6700, Penn State Extension lawn mowing
- Key topics: torn vs clean cut, fungal disease entry, sharpening frequency

**Article 4: Why We Alternate Our Mowing Pattern Every Week**
- Slug: `/blog/why-we-alternate-mowing-pattern`
- Date: 2026-03-31
- Citations: MU Extension G6700, Purdue Extension lawn resources
- Key topics: grass lean, soil compaction ruts, lawn striping effect

**Article 5: What's the Right Mowing Height for Missouri Lawns?**
- Slug: `/blog/right-mowing-height-missouri-lawns`
- Date: 2026-04-07
- Citations: MU Extension G6700, OSU Extension HYG-4020
- Key topics: grass-as-solar-panels metaphor, grass type height guide, seasonal height table, scalping

## Verification Results

- `ls src/content/blog/` confirms 5 target .md files present (9 total including 06-01 articles)
- `npm run build` exits 0, 11 pages built in 12.81 seconds
- All 5 slugs appear in build output under `dist/blog/`
- Sitemap auto-updated by @astrojs/sitemap

## Deviations from Plan

None — plan executed exactly as written. Article content matched the plan specification. CTA format was slightly standardized to use an inline markdown link alongside the phone number for better UX.

## Known Stubs

None. All articles are complete with real content, real citations, and functioning CTAs.

## Self-Check: PASSED

- [x] `src/content/blog/how-often-mow-lawn-wentzville-mo.md` — FOUND
- [x] `src/content/blog/lawn-health-101-wentzville-homeowner.md` — FOUND
- [x] `src/content/blog/why-sharp-mower-blades-matter.md` — FOUND
- [x] `src/content/blog/why-we-alternate-mowing-pattern.md` — FOUND
- [x] `src/content/blog/right-mowing-height-missouri-lawns.md` — FOUND
- [x] Commit e92ab09 — FOUND (Task 1)
- [x] Commit acda272 — FOUND (Task 2)
- [x] Build: 0 errors, all 5 slugs rendered
