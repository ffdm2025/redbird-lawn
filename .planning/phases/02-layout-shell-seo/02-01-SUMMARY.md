---
phase: 02-layout-shell-seo
plan: "01"
subsystem: seo
tags: [seo, schema, json-ld, meta-tags, layout]
dependency_graph:
  requires: [src/lib/constants.ts, src/layouts/Layout.astro]
  provides: [buildLocalBusinessSchema, BaseHead, JsonLd]
  affects: [every page head, Google Rich Results, Lighthouse SEO score]
tech_stack:
  added: []
  patterns: [Astro component composition, JSON-LD via set:html, canonical URL from Astro.site]
key_files:
  created:
    - src/lib/schema.ts
    - src/components/seo/BaseHead.astro
    - src/components/seo/JsonLd.astro
  modified:
    - src/layouts/Layout.astro
    - src/pages/index.astro
key_decisions:
  - "set:html is mandatory on the JSON-LD script tag — without it Astro HTML-escapes curly braces"
  - "title and description are optional in Layout.astro with SEO-optimized defaults so no page is ever missing meta"
  - "buildLocalBusinessSchema() imports exclusively from constants.ts — zero hardcoded business data"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-05"
  tasks: 2
  files: 5
---

# Phase 02 Plan 01: SEO Component Layer Summary

**One-liner:** LocalBusiness JSON-LD + BaseHead meta tags via Astro components wired into Layout, with canonical URL, OG, Twitter Card, and 5-city areaServed schema — all driven from constants.ts.

## What Was Built

Three files were created and one layout was updated to install complete SEO infrastructure on every page of the site. The key insight was that `set:html` on the JSON-LD script tag is non-negotiable — Astro's default template escaping would corrupt the JSON with `&quot;` entities, breaking Google's structured data parser.

`buildLocalBusinessSchema()` in `src/lib/schema.ts` constructs the full LocalBusiness schema at build time, importing all business data (name, phone, email, address, social) exclusively from `constants.ts`. Zero business data is hardcoded anywhere in the SEO layer.

`BaseHead.astro` handles all head meta: charset, viewport, title, description, canonical (derived from `Astro.url.pathname + Astro.site` — correct for static builds), sitemap discovery link, Open Graph (6 tags), and Twitter Card (4 tags).

`Layout.astro` was updated to call `buildLocalBusinessSchema()` once and pass the result to `JsonLd`. Both `title` and `description` are now optional props with locked SEO defaults — no page can accidentally ship without meta tags.

## Verification Results

All 12 automated checks against `dist/index.html` passed:

- Title tag exactly matches the locked value
- Meta description contains "Wentzville, MO 63385"
- JSON-LD script block present with unescaped JSON (no `&quot;` entities)
- Canonical points to https://redbirdlawnservice.com/
- Sitemap discovery link to /sitemap-index.xml present
- LocalBusiness + HomeAndConstructionBusiness in @type
- All 5 areaServed cities present: Wentzville, O'Fallon, Lake Saint Louis, Troy, Foristell
- `npm run build` exits with code 0

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 90ab496 | feat(02-01): create schema.ts and SEO components |
| Task 2 | 7d839d8 | feat(02-01): wire BaseHead + JsonLd into Layout.astro |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `og-image.png` does not exist yet (referenced in schema and BaseHead). Plan 02-02 creates the placeholder. OG image URL is valid; the file just 404s until Phase 3 provides a real photo. This does not affect JSON-LD validation or meta tag rendering.
- `NAP.address.street` is `"[CONFIRM FROM GBP]"` and `SOCIAL.facebook` is `"[CONFIRM FROM GBP]"` — these stubs exist in constants.ts from Phase 1 and are intentionally deferred until Alberto confirms GBP data. They appear in the JSON-LD schema but do not prevent the plan's SEO goal from being achieved.

## Self-Check: PASSED

All files exist, both commits verified, SUMMARY.md created.
