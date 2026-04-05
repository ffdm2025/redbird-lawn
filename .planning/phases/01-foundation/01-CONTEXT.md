# Phase 1: Foundation - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

The project builds and deploys to Cloudflare Pages with zero content — just a working scaffold with correct config, pinned dependencies, canonical NAP as single source of truth, and Tailwind 4 rendering. Covers FOUN-01 through FOUN-05, DEPL-01, DEPL-02, DEPL-04.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and stack research (.planning/research/STACK.md) to guide decisions.

Key constraints from research:
- Astro 6.1.3, Tailwind 4.2.2, @vapi-ai/web pinned to exact 2.5.2
- @tailwindcss/vite (NOT @astrojs/tailwind — deprecated)
- No @astrojs/cloudflare adapter for static output
- Node.js 22 minimum
- Astro Fonts API for Space Grotesk + Inter (check if experimental flag needed)
- NAP single source of truth in lib/constants.ts

</decisions>

<code_context>
## Existing Code Insights

Greenfield project — no existing code. Codebase context will emerge during implementation.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Follow stack research recommendations.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
