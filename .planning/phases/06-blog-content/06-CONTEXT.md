# Phase 6: Blog Content - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Blog infrastructure (Astro content collections, index page, post layout, nav update) plus 9 SEO-optimized articles written in Alberto's first-person voice. Each article targets a specific local lawn care keyword gap identified in competitor research. All content at 8th-grade reading level with citations to reputable sources.

</domain>

<decisions>
## Implementation Decisions

### Blog Infrastructure
- Astro content collections for markdown blog posts (src/content/blog/)
- Blog index page at /blog with title, date, excerpt for each post
- Individual post layout at /blog/{slug} with Article JSON-LD schema
- Navigation updated with "Blog" link on both desktop and mobile
- Posts sorted by date descending on index page
- Each post has: title, date, author (Alberto Murillo), excerpt, featured image (optional), tags

### Content Voice & Style
- First-person from Alberto: "Here's what I tell every homeowner..." / "In my experience..." / "When I'm out mowing in Wentzville..."
- 8th-grade reading level: short sentences, everyday words, no industry jargon without explanation
- Conversational but knowledgeable — a neighbor who happens to be an expert
- NOT corporate marketing copy, NOT AI-generic "comprehensive guide" voice
- Include local references: Wentzville, Missouri weather, St. Charles County, specific neighborhoods if possible
- Each article 800-1200 words (enough for SEO value, not overwhelming)

### Citations & Sources
- Every article must cite 2-3 reputable sources
- Preferred sources: University of Missouri Extension, Purdue Turf Science, USDA, Penn State Extension, Texas A&M AgriLife, Ohio State University turf program
- Citations formatted as inline links within the text, plus a "Sources" section at bottom
- Citations must support specific claims (e.g., "According to the University of Missouri Extension, cool-season grasses should be mowed at 3-4 inches")
- Do NOT fabricate citation URLs — use real, verifiable URLs from these institutions

### SEO Strategy
- Each article targets a specific long-tail keyword from competitor gap analysis
- Title includes primary keyword + local modifier (Wentzville, MO, Missouri)
- Meta description under 160 chars with keyword
- H2/H3 subheadings with secondary keywords
- Internal links back to homepage services section where relevant
- CTA at end of each article: "Need help with [topic]? Call Redbird at (314) 497-6152"

### Article Topics (9 total)
1. How Often Should You Mow Your Lawn in Wentzville, MO?
2. Lawn Health 101: What Every Wentzville Homeowner Should Know
3. Why Sharp Mower Blades Matter More Than You Think
4. Why We Alternate Our Mowing Pattern Every Week
5. What's the Right Mowing Height for Missouri Lawns?
6. Why You Should Never Mow Wet Grass
7. The Art of a Clean Edge: Why Edging Makes Your Lawn Look Professional
8. First Time Mowing New Sod? Here's What Alberto Does
9. How to Water Your Lawn the Right Way in Missouri

### Claude's Discretion
- Exact content collection schema fields
- Blog index page layout and card design
- Post layout typography and spacing
- Tag taxonomy
- Exact article structure within the voice/style guidelines

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/lib/constants.ts — NAP data for CTA links in articles
- src/components/astro/SectionWrapper.astro — scroll animation wrapper (use on blog index)
- src/styles/global.css — brand colors, font vars, dark mode
- src/components/seo/BaseHead.astro — meta tags (extend for blog posts)
- src/components/seo/JsonLd.astro — schema (add Article schema variant)
- src/lib/schema.ts — JSON-LD builder (add buildArticleSchema function)

### Established Patterns
- Astro components for all static content
- Tailwind utility classes
- Dark mode via @variant dark
- Font vars: --font-heading (Space Grotesk), --font-body (Inter)

### Integration Points
- src/pages/ — add blog/ directory with index.astro and [...slug].astro
- src/content/ — new directory for content collections
- Header.astro — add Blog nav link
- MobileNav.tsx — add Blog nav item

</code_context>

<specifics>
## Specific Ideas

- Blog cards on index page should match the service card visual style (border glow hover, consistent spacing)
- Articles should end with a CTA section that matches the site's conversion style
- Consider adding "Related Articles" links at bottom of each post
- Published dates should be realistic (stagger across recent weeks for authenticity)

</specifics>

<deferred>
## Deferred Ideas

- RSS feed — v2
- Blog search — v2
- Category/tag filtering pages — v2
- Comments section — not needed for local service blog

</deferred>
