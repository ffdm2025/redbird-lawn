---
phase: 06-blog-content
plan: "03"
subsystem: content
tags: [blog, seo, content-marketing, lawn-care, local-seo]
dependency_graph:
  requires: [06-01]
  provides: [articles-6-7-8-9]
  affects: [blog-index, sitemap]
tech_stack:
  added: []
  patterns: [astro-content-collections, markdown-frontmatter, first-person-voice]
key_files:
  created:
    - src/content/blog/why-you-should-never-mow-wet-grass.md
    - src/content/blog/art-of-clean-edge-why-edging-matters.md
    - src/content/blog/first-time-mowing-new-sod-what-alberto-does.md
    - src/content/blog/how-to-water-lawn-right-way-missouri.md
  modified: []
decisions:
  - "Plan 02 and 03 ran in parallel; Task 2 files included in Plan 02 commit acda272 due to parallel execution timing — content correct and committed"
metrics:
  duration: "~6 minutes"
  completed: "2026-04-06"
  tasks_completed: 2
  files_created: 4
---

# Phase 06 Plan 03: Blog Articles 6-9 Summary

Four SEO blog articles for Redbird Lawn Care covering wet grass mowing risks, edging technique, new sod first mow, and Missouri lawn watering — written in Alberto Murillo's first-person voice with real university extension citations.

## What Was Built

Four markdown files added to `src/content/blog/`, each conforming to the Astro 6 content collection schema defined in `src/content.config.ts`. All four articles render to `/blog/{slug}/` routes in the static build.

**Article 6 — Why You Should Never Mow Wet Grass** (`why-you-should-never-mow-wet-grass.md`)
Covers: grass laying flat during wet mow, wet clipping mats blocking sunlight, soil compaction and ruts, fungal disease spread. Targets: Wentzville, MO, wet grass mowing. Citations: MU Extension G6700, USDA NRCS Soils.

**Article 7 — The Art of a Clean Edge: Why Edging Makes Your Lawn Look Professional** (`art-of-clean-edge-why-edging-matters.md`)
Covers: edging vs. trimming distinction, grass stolons creeping into hardscape, weekly edging frequency, technique for straight lines and consistent depth. Targets: lawn edging, professional lawn care Wentzville. Citations: MU Extension G6700, Penn State Extension lawn-mowing.

**Article 8 — First Time Mowing New Sod? Here's What Alberto Does** (`first-time-mowing-new-sod-what-alberto-does.md`)
Covers: why new sod is fragile, the tug test for establishment, first mow technique (high deck, sharp blade, wide turns), trimmer and edger caution on first visit. Targets: new sod mowing Wentzville, sod care Missouri. Citations: MU Extension G6700, Texas A&M AgriLife Extension.

**Article 9 — How to Water Your Lawn the Right Way in Missouri** (`how-to-water-lawn-right-way-missouri.md`)
Covers: deep root principle, one inch per week measurement with tuna can method, morning watering best practice, overwatering vs. underwatering signs, Missouri dormancy strategy. Targets: lawn watering Missouri, Wentzville irrigation. Citations: MU Extension G6700, USDA NRCS Irrigation Water Management.

## Verification Results

- `npm run build` exits 0
- 9 blog post routes rendered (5 from Plan 02 + 4 from Plan 03) plus /blog/index.html and /index.html = 11 pages total
- Article JSON-LD schema (`"@type":"Article"`) present in built HTML
- Alberto Murillo byline rendered correctly
- All CTAs reference (314) 497-6152

## Deviations from Plan

**1. [Parallel execution] Task 2 files committed in Plan 02 commit**
- **Found during:** Post-task commit of Task 2
- **Issue:** Plans 02 and 03 ran in parallel. When Plan 02's executor ran its final commit (`acda272`), it picked up the freshly-created Task 2 files from Plan 03 that were sitting in the working tree untracked. The files are committed with correct content under commit `acda272`.
- **Fix:** Files are correctly committed. Content matches plan exactly. No data loss or error. Plan 03 Task 1 commit `a0a8a92` is its own atomic commit as planned.
- **Files modified:** `first-time-mowing-new-sod-what-alberto-does.md`, `how-to-water-lawn-right-way-missouri.md`
- **Commit:** acda272 (Plan 02 commit, files present and correct)

## Commits

| Commit | Type | Description |
|--------|------|-------------|
| a0a8a92 | feat(06-03) | Articles 6 and 7 — wet grass and edging |
| acda272 | feat(06-02) | Articles 8 and 9 committed in parallel Plan 02 commit |

## Known Stubs

None. All four articles contain complete article bodies with real content, real citations, and working CTAs. No placeholder text, no TODO markers, no stub content.

## Self-Check: PASSED

Files verified present:
- FOUND: src/content/blog/why-you-should-never-mow-wet-grass.md
- FOUND: src/content/blog/art-of-clean-edge-why-edging-matters.md
- FOUND: src/content/blog/first-time-mowing-new-sod-what-alberto-does.md
- FOUND: src/content/blog/how-to-water-lawn-right-way-missouri.md

Commits verified:
- FOUND: a0a8a92 (feat(06-03): add articles 6 and 7)
- FOUND: acda272 (Task 2 files present in this commit)

Build: PASSED — 11 pages built, 0 errors
