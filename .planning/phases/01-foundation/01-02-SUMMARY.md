---
phase: 01-foundation
plan: 02
subsystem: infra
tags: [astro, tailwindcss, tailwind-4, vite, fonts, space-grotesk, inter, fontsource]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: Astro 6 static project scaffold with Layout.astro, global.css, and installed packages

provides:
  - Tailwind CSS 4 via @tailwindcss/vite compiling utility classes in built output
  - Self-hosted Space Grotesk (heading) and Inter (body) fonts via Astro Fonts API
  - Font preload hints injected into <head> via Font component (--font-heading preloaded, --font-body standard)
  - global.css with @import "tailwindcss", font CSS vars, and @variant dark
  - Responsive layout scaffold in Layout.astro ready for Phase 3 content

affects: [03-content, 04-integrations, all phases using Tailwind utility classes or font variables]

# Tech tracking
tech-stack:
  added:
    - "@tailwindcss/vite@4.2.2 — Tailwind 4 Vite plugin (added to vite.plugins, not integrations)"
    - "fontProviders.fontsource() — Astro Fonts API provider for Space Grotesk and Inter"
    - "Font component from astro:assets — injects preload hints and @font-face rules into <head>"
  patterns:
    - "Tailwind 4 wired via vite.plugins, never via @astrojs/tailwind (deprecated)"
    - "Fonts API uses top-level fonts: key in astro.config.mjs — NOT experimental: wrapper"
    - "Font components placed inside <head> in Layout.astro, not in <body>"
    - "global.css opens with @import \"tailwindcss\" as first non-comment line"
    - "@variant dark (&:is(.dark *)) for dark mode support without tailwind.config.js"
    - "No @apply in .astro scoped <style> blocks — silently fails in Tailwind 4"

key-files:
  created: []
  modified:
    - "astro.config.mjs — added @tailwindcss/vite in vite.plugins + top-level fonts: array with fontProviders.fontsource()"
    - "src/layouts/Layout.astro — added Font component imports and <Font /> tags in <head>"
    - "src/styles/global.css — replaced placeholder with @import tailwindcss + font CSS vars + @variant dark"
    - "src/pages/index.astro — added Tailwind utility classes to verify compiled output"

key-decisions:
  - "fonts: is top-level in astro.config.mjs (not experimental:) — verified against Astro 6.1.3 docs; experimental wrapper causes errors"
  - "Space Grotesk assigned --font-heading with preload=true for LCP performance; Inter assigned --font-body without preload"
  - "@variant dark (&:is(.dark *)) chosen over media-query dark mode to match CLAUDE.md dark-mode-first constraint"

patterns-established:
  - "Pattern: Tailwind 4 via vite.plugins — never @astrojs/tailwind"
  - "Pattern: Font component in Layout.astro <head> — one per cssVariable"
  - "Pattern: global.css starts with @import tailwindcss — no other location for Tailwind entry"

requirements-completed: [FOUN-02, FOUN-03, FOUN-04]

# Metrics
duration: 18min
completed: 2026-04-05
---

# Phase 01 Plan 02: Tailwind 4 + Self-Hosted Fonts + Responsive Layout Summary

**Tailwind 4 utility classes compiling to dist/ via @tailwindcss/vite, Space Grotesk and Inter self-hosted as 5 woff2 files in dist/_astro/fonts/ via Astro Fonts API, with Font preload hints injected in <head>**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-04-05T20:45:00Z
- **Completed:** 2026-04-05T20:50:30Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Tailwind CSS 4 integrated via `@tailwindcss/vite` — utility classes (`text-4xl`, `font-bold`, `text-green-800`, `min-h-screen`, `p-8`, `mt-4`, `text-gray-600`) all compiled and verified in `dist/_astro/*.css`
- Space Grotesk + Inter self-hosted: 5 `.woff2` files in `dist/_astro/fonts/` — zero external CDN requests at runtime
- `<Font cssVariable="--font-heading" preload />` injects `<link rel="preload">` for LCP optimization; `<Font cssVariable="--font-body" />` loads Inter without preload
- `@variant dark (&:is(.dark *))` establishes dark mode support without a `tailwind.config.js`

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire Tailwind 4 and Astro Fonts API into astro.config.mjs** - `4205842` (feat)
2. **Task 2: Update Layout.astro with Font components and global.css with Tailwind import** - `bae94d0` (feat)

**Plan metadata:** (final docs commit — see below)

## Files Created/Modified

- `astro.config.mjs` — added `import tailwindcss from '@tailwindcss/vite'`, `vite.plugins: [tailwindcss()]`, top-level `fonts:` array with two `fontProviders.fontsource()` entries
- `src/layouts/Layout.astro` — added `import { Font } from 'astro:assets'`; added `<Font cssVariable="--font-heading" preload />` and `<Font cssVariable="--font-body" />` inside `<head>`
- `src/styles/global.css` — replaced placeholder with `@import "tailwindcss"` (first line), font CSS vars on `:root` and `h1-h6`, `@variant dark` rule
- `src/pages/index.astro` — updated with Tailwind utility classes (`text-4xl font-bold text-green-800`) to verify compiled CSS output

## Decisions Made

- Used `fonts:` as a top-level key in `astro.config.mjs` (NOT `experimental: { fonts: [...] }`) — the `experimental:` wrapper is outdated and causes errors in Astro 6.1.3
- `--font-heading` (Space Grotesk) gets `preload` on the Font component to prioritize the largest text download for LCP; `--font-body` (Inter) does not preload (body text loads after paint is acceptable)
- `@variant dark (&:is(.dark *))` syntax follows Tailwind 4 CSS-first config, eliminating the need for `tailwind.config.js`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Executed 01-01 prerequisites before starting 01-02**

- **Found during:** Pre-execution check
- **Issue:** 01-01-SUMMARY.md did not exist; scaffold files from 01-01 were only partially committed by the parallel agent (Layout.astro, global.css, index.astro were committed, but constants.ts was missing)
- **Fix:** Created `src/lib/constants.ts` (canonical NAP single source of truth) and committed it as `1bfff0e feat(01-01): add canonical NAP constants file` before proceeding to 01-02 tasks
- **Files modified:** `src/lib/constants.ts`
- **Verification:** `npx astro check` exits 0 (5 files checked, 0 errors)
- **Committed in:** `1bfff0e`

---

**Total deviations:** 1 auto-fixed (1 blocking prerequisite)
**Impact on plan:** The missing `constants.ts` from 01-01 was committed as a prerequisite. 01-02 plan itself executed exactly as specified.

## Issues Encountered

- Initial npm installs were accidentally run in the `sleepy-solstice/` subdirectory (an artifact from `npm create astro` creating a subfolder) before discovering the actual project root is `Website Build/`. Corrected by running all installs and file operations in the correct root directory. The `sleepy-solstice/` directory contains duplicate untracked files that are not tracked by git and do not affect the build.

## User Setup Required

None — no external service configuration required for this plan. Cloudflare Pages deployment (DEPL-01) is handled in a separate plan (01-03).

## Next Phase Readiness

- Tailwind 4 utility classes available for all Phase 3 content components
- Font CSS variables (`--font-heading`, `--font-body`) available globally via CSS custom properties
- Dark mode variant pattern established; Phase 3 components can use `dark:` prefix classes
- `src/lib/constants.ts` canonical NAP data ready for Footer and JSON-LD usage in Phase 2/3
- Blocker: Street address and Facebook URL in `constants.ts` are placeholders (`[CONFIRM FROM GBP]`) — must be resolved before Phase 2 (SEO/JSON-LD)

---

*Phase: 01-foundation*
*Completed: 2026-04-05*
