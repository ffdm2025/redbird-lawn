# Phase 2: Layout Shell + SEO - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Every page has a complete HTML head with canonical meta tags, LocalBusiness JSON-LD schema, sitemap.xml, and robots.txt — SEO infrastructure is in place before any content is written. Covers SEO-01 through SEO-07.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — infrastructure/SEO phase. Use ROADMAP phase goal, success criteria, and research findings to guide decisions.

Key constraints:
- LocalBusiness JSON-LD must use NAP from src/lib/constants.ts (single source of truth)
- Meta title: "Redbird Lawn Care Service | Top Rated Mowing in Wentzville, MO"
- Meta description must include "lawn care services near Wentzville, MO" and zip code 63385
- Semantic HTML hierarchy (H1 → H2 → H3)
- sitemap.xml via @astrojs/sitemap (already in dependencies)
- robots.txt as static file in public/
- Service area cities: Wentzville, O'Fallon, Lake Saint Louis, Troy, Foristell
- Note: Deploy is deferred — use placeholder for site URL in sitemap config until domain is set

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/lib/constants.ts — canonical NAP (name, address, phone, email, facebook)
- src/layouts/Layout.astro — base layout with Font components and global.css
- src/styles/global.css — Tailwind + font vars + dark mode variant

### Established Patterns
- Astro 6 static output, TypeScript throughout
- @astrojs/sitemap already in integrations array in astro.config.mjs
- Fonts loaded via Astro Fonts API (top-level config, not experimental)

### Integration Points
- Layout.astro <head> section — where meta tags and JSON-LD go
- astro.config.mjs site field — needed for sitemap generation
- public/ directory — static files like robots.txt

</code_context>

<specifics>
## Specific Ideas

No specific requirements — SEO infrastructure phase. Follow research recommendations and competitor analysis for keyword targeting.

</specifics>

<deferred>
## Deferred Ideas

None — SEO infrastructure stays within phase scope.

</deferred>
