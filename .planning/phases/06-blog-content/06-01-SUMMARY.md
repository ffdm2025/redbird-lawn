---
phase: 06-blog-content
plan: "01"
subsystem: blog
tags: [blog, content-collections, seo, schema, navigation]
dependency_graph:
  requires: []
  provides: [blog-infrastructure, article-schema, blog-nav]
  affects: [src/lib/schema.ts, src/layouts/Layout.astro, src/components/astro/Header.astro, src/components/react/MobileNav.tsx]
tech_stack:
  added: [astro-content-collections-v6, glob-loader]
  patterns: [article-json-ld, content-collection-glob-loader, head-slot-injection]
key_files:
  created:
    - src/content.config.ts
    - src/pages/blog/index.astro
    - src/pages/blog/[...slug].astro
  modified:
    - src/lib/schema.ts
    - src/layouts/Layout.astro
    - src/components/astro/Header.astro
    - src/components/react/MobileNav.tsx
decisions:
  - "Astro 6 requires src/content.config.ts with glob() loader — legacy src/content/config.ts removed in v6"
  - "Use entry.id instead of entry.slug with Astro 6 glob loader"
  - "Use render() import from astro:content instead of entry.render() method"
  - "Added empty-state message on blog index for zero-post condition (plans 02/03 will populate)"
metrics:
  duration_seconds: 224
  completed_date: "2026-04-06T01:49:34Z"
  tasks_completed: 2
  files_changed: 7
---

# Phase 06 Plan 01: Blog Infrastructure Summary

Blog infrastructure for Astro 6 with glob-loader content collections, Article JSON-LD schema builder, SEO-complete post layout, and Blog nav link in desktop header and mobile drawer.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Content collection schema + Article JSON-LD builder | 2175ec2 | src/content.config.ts, src/lib/schema.ts, src/layouts/Layout.astro |
| 2 | Blog index page + post layout + nav updates | f18ae13 | src/pages/blog/index.astro, src/pages/blog/[...slug].astro, src/components/astro/Header.astro, src/components/react/MobileNav.tsx |

## What Was Built

**Content collection** (`src/content.config.ts`): Astro 6 glob loader targeting `src/content/blog/**/*.{md,mdx}`. Schema enforces `title`, `date`, `author` (default: Alberto Murillo), `excerpt`, optional `tags[]`, optional `ogImage`. Build-time validation on all frontmatter.

**Article JSON-LD** (`src/lib/schema.ts`): New `buildArticleSchema()` function alongside the existing `buildLocalBusinessSchema()` (untouched). Produces Schema.org `Article` type with headline, description, url, datePublished, dateModified, author (Person), publisher (Organization from NAP constants), and mainEntityOfPage.

**Blog index** (`/blog`): Sorted post grid (newest first), responsive 2-column layout, post cards with date, first tag, title, excerpt, and "Read more" link. Empty-state message shown when no posts exist.

**Post layout** (`/blog/[id]`): Breadcrumb nav, tag pills, author + date byline, Tailwind prose body, Article JSON-LD injected into `<head>` via Layout head slot, CTA aside with click-to-call, back link.

**Head slot**: Added `<slot name="head" />` to `Layout.astro` before `</head>` for per-page script/meta injection.

**Navigation**: Blog link added to desktop nav (after Contact) and mobile drawer NAV_ITEMS (after Contact). Desktop nav is hidden on mobile — MobileNav React island handles mobile only.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Astro 6 removed legacy content collections API**
- **Found during:** Task 1 — build failed immediately with `LegacyContentConfigError`
- **Issue:** Plan specified `src/content/config.ts` which Astro 6 no longer accepts. Astro 6 requires `src/content.config.ts` at the project root with a `loader` defined on each collection.
- **Fix:** Deleted `src/content/config.ts`, created `src/content.config.ts` using `glob()` loader from `astro/loaders`
- **Files modified:** src/content.config.ts (new location), removed src/content/config.ts
- **Reference:** https://docs.astro.build/en/guides/upgrade-to/v6/#removed-legacy-content-collections

**2. [Rule 1 - Bug] Astro 6 glob loader uses entry.id not entry.slug**
- **Found during:** Task 2 — plan template used `post.slug` and `entry.slug`
- **Issue:** The glob loader assigns `entry.id` as the file path identifier; `entry.slug` does not exist
- **Fix:** Changed all `entry.slug` / `post.slug` references to `entry.id` / `post.id` in both blog pages

**3. [Rule 1 - Bug] Astro 6 render() is a named export, not a method**
- **Found during:** Task 2 — plan template used `entry.render()`
- **Issue:** In Astro 6, `render()` is imported from `astro:content` and called as `render(entry)`, not `entry.render()`
- **Fix:** Used `import { getCollection, render } from 'astro:content'` and `await render(entry)`

**4. [Rule 2 - Missing functionality] Empty-state for blog index with zero posts**
- **Found during:** Task 2 implementation review
- **Issue:** Plan template had no handling for the zero-post state (Plans 02/03 haven't run yet); the grid would render nothing with no user feedback
- **Fix:** Added conditional empty-state paragraph: "Articles coming soon. Check back shortly!"

## Known Stubs

None. Blog index correctly renders an empty state message when no posts exist. Post layout renders actual content from collection entries.

## Verification

- `npm run build` exits 0 with no TypeScript errors
- `dist/blog/index.html` exists and contains "Lawn Care Tips from Alberto" H1
- Blog index page and post dynamic route build without errors
- Desktop header includes Blog nav link
- Mobile drawer includes Blog nav item
- `buildLocalBusinessSchema()` untouched and still exported from src/lib/schema.ts

## Self-Check: PASSED
