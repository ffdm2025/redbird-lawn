---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [astro, tailwindcss, typescript, vite, react, sitemap, sharp, vapi, lucide]

# Dependency graph
requires: []
provides:
  - Astro 6.1.3 static project scaffold building clean with npm run build
  - Pinned dependency manifest with astro@6.1.3, tailwindcss@4.2.2, @vapi-ai/web@2.5.2
  - TypeScript strict mode via astro/tsconfigs/strict
  - Node.js 22 pin via .nvmrc
  - Canonical NAP single source of truth at src/lib/constants.ts
  - HTML shell layout at src/layouts/Layout.astro
  - Global CSS entry at src/styles/global.css
  - Placeholder index page at src/pages/index.astro
affects: [02-foundation, 03-foundation, all-phases]

# Tech tracking
tech-stack:
  added:
    - astro@6.1.3
    - tailwindcss@4.2.2
    - "@tailwindcss/vite@4.2.2"
    - "@astrojs/react@5.0.2"
    - "@astrojs/sitemap@3.7.2"
    - react@19.2.4
    - react-dom@19.2.4
    - sharp@0.34.5
    - "@vapi-ai/web@2.5.2"
    - lucide-react@1.7.0
  patterns:
    - "output: static in astro.config.mjs — no adapter, Cloudflare Pages compatible"
    - "All volatile packages pinned exact (no ^ caret) via --save-exact"
    - "@tailwindcss/vite in vite.plugins — NOT @astrojs/tailwind (deprecated)"
    - "src/lib/constants.ts as canonical NAP single source of truth"

key-files:
  created:
    - package.json
    - astro.config.mjs
    - tsconfig.json
    - .nvmrc
    - .gitignore
    - src/lib/constants.ts
    - src/layouts/Layout.astro
    - src/styles/global.css
    - src/pages/index.astro
  modified: []

key-decisions:
  - "Pinned astro@6.1.3 exact — fixes Cloudflare dev rendering bug in 6.1.x"
  - "Used @tailwindcss/vite not @astrojs/tailwind — deprecated for Tailwind 4"
  - "No @astrojs/cloudflare adapter — output: static needs no adapter"
  - "NAP data centralized in src/lib/constants.ts — never re-typed in components"
  - "Street address and Facebook URL left as [CONFIRM FROM GBP] placeholders"

patterns-established:
  - "Pattern: All exact-version packages use --save-exact flag during npm install"
  - "Pattern: Business data always imported from src/lib/constants.ts, never typed inline"

requirements-completed: [FOUN-01, FOUN-05]

# Metrics
duration: 11min
completed: 2026-04-05
---

# Phase 01 Plan 01: Foundation Scaffold Summary

**Astro 6.1.3 static project with pinned dependencies, TypeScript strict mode, and NAP single source of truth in src/lib/constants.ts**

## Performance

- **Duration:** 11 min
- **Started:** 2026-04-05T15:39:43Z
- **Completed:** 2026-04-05T15:50:56Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Scaffolded Astro 6.1.3 static project with `npm run build` exiting 0 and `dist/index.html` present
- Pinned all volatile packages exact: astro@6.1.3, tailwindcss@4.2.2, @tailwindcss/vite@4.2.2, @vapi-ai/web@2.5.2
- Created canonical NAP constants file with business name, phone, email, and address — verified as the only location of this data across the codebase
- TypeScript strict mode confirmed with `npx astro check` exiting 0 with 0 errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Astro 6 project with pinned dependencies** - `78cd7e0` (feat)
2. **Task 2: Create canonical NAP constants file** - `1bfff0e` (feat)

**Plan metadata:** committed in final docs commit

## Files Created/Modified

- `package.json` - redbird-lawn project, all pinned dependencies, astro@6.1.3
- `astro.config.mjs` - output: static, react + sitemap integrations
- `tsconfig.json` - extends astro/tsconfigs/strict, strictNullChecks, @/* path alias
- `.nvmrc` - Node 22 pin for Cloudflare Pages build environment
- `.gitignore` - node_modules, dist, .astro generated files excluded
- `src/lib/constants.ts` - NAP, SITE_URL, SOCIAL exports as const
- `src/layouts/Layout.astro` - minimal HTML shell with slot, global.css import
- `src/styles/global.css` - placeholder (Tailwind @import added by parallel Plan 02)
- `src/pages/index.astro` - scaffold placeholder using Layout component

## Decisions Made

- Used `@tailwindcss/vite` in `vite.plugins` rather than the deprecated `@astrojs/tailwind` integration — Tailwind 4 requires the Vite plugin approach
- No `@astrojs/cloudflare` adapter installed — `output: 'static'` needs no adapter; the adapter is for SSR only and causes issues with static builds
- Street address (`[CONFIRM FROM GBP]`) and Facebook URL (`[CONFIRM FROM GBP]`) left as explicit placeholders — must be confirmed against live Google Business Profile before Phase 2 SEO/JSON-LD work

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created .gitignore — not in plan but needed**
- **Found during:** Task 1 (post-scaffold)
- **Issue:** Scaffold didn't generate .gitignore because directory wasn't empty for `--no-git`; node_modules and dist would be tracked
- **Fix:** Created standard Astro .gitignore excluding node_modules/, dist/, .astro/, .env*
- **Files modified:** .gitignore
- **Verification:** git status no longer shows node_modules or dist as untracked
- **Committed in:** 78cd7e0 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for correct git operation. No scope creep.

## Issues Encountered

- `npm create astro@latest . -- --template minimal --yes --no-git` detected the non-empty directory and scaffolded into a `./sleepy-solstice/` subdirectory instead of in-place. Files were manually moved to project root. No impact on final state.
- Parallel Plan 02 agent applied Tailwind + fonts config to `astro.config.mjs` and `Layout.astro` during this plan's execution. Build continued passing with those changes (exit 0 confirmed).

## Known Stubs

- `NAP.address.street` = `'[CONFIRM FROM GBP]'` — intentional placeholder, must be confirmed before Phase 2 JSON-LD schema work (FOUN-05 / SEO plan)
- `SOCIAL.facebook` = `'[CONFIRM FROM GBP]'` — intentional placeholder, must be confirmed before Phase 3 Footer component

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- Astro project builds cleanly — Plan 02 (Tailwind + fonts) and Plan 03 (Cloudflare deployment) can proceed
- `src/lib/constants.ts` is the established pattern for all business data; all subsequent components must import from here
- Street address and Facebook URL must be confirmed against GBP before Phase 2 SEO schema work begins

---
*Phase: 01-foundation*
*Completed: 2026-04-05*
