# Phase 2: Layout Shell + SEO - Research

**Researched:** 2026-04-05
**Domain:** Astro 6 SEO infrastructure — JSON-LD, meta tags, sitemap, robots.txt
**Confidence:** HIGH (all major decisions verified against official docs or primary sources)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Claude's Discretion
All implementation choices (component structure, schema properties, meta tag set) are Claude's discretion.

### Deferred Ideas (OUT OF SCOPE)
None — SEO infrastructure stays within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | LocalBusiness JSON-LD schema with exact NAP matching GBP and Facebook | Schema.org type hierarchy confirmed; field set, `set:html` injection pattern documented |
| SEO-02 | Meta title "Redbird Lawn Care Service | Top Rated Mowing in Wentzville, MO" | Astro `<title>` pattern via BaseHead.astro confirmed; 60-char limit OK for this title |
| SEO-03 | Meta description optimized for "lawn care services near Wentzville, MO" with zip code 63385 | 150-160 char guidance confirmed; description template drafted in Code Examples |
| SEO-04 | Semantic HTML (proper H1, H2, H3 hierarchy) | Layout.astro shell currently has no headings — H1 goes in Hero (Phase 3), but hierarchy must be established in index.astro |
| SEO-05 | sitemap.xml auto-generated via @astrojs/sitemap with canonical URL | @astrojs/sitemap already integrated; `site:` field already set in astro.config.mjs; generates sitemap-index.xml |
| SEO-06 | robots.txt properly configured (allow all) | Static file in public/; Cloudflare managed-robots.txt opt-in warning documented |
| SEO-07 | Service area cities mentioned in content | Goes in JSON-LD `areaServed` array + visible page copy (Phase 3 content); schema layer addressable now |
</phase_requirements>

---

## Summary

Phase 2 installs the full SEO infrastructure before any content is written. The work divides cleanly into four deliverables: (1) a `BaseHead.astro` component housing all meta tags and canonical link, (2) a `JsonLd.astro` component injecting a `LocalBusiness` JSON-LD block built from `constants.ts`, (3) `public/robots.txt` as a static allow-all file, and (4) verification that `@astrojs/sitemap` (already wired) generates a valid `sitemap-index.xml` at build time.

The existing `Layout.astro` is currently a bare shell — it handles fonts and global CSS but has no SEO tags, no canonical, and no structured data. This phase fills that gap by replacing the bare `<title>` tag with a full `<BaseHead>` component and adding `<JsonLd>` inside `<head>`. No new npm packages are needed — `@astrojs/sitemap` is already installed and configured in `astro.config.mjs`.

The two decisions with non-obvious answers are the JSON-LD `@type` value and the Cloudflare robots.txt behavior. For `@type`, use `["LocalBusiness", "HomeAndConstructionBusiness"]` — `LawnCareService` and `LandscapingService` are not official schema.org types. For robots.txt, an explicit `Allow: /` file in `public/` must be present, and the Cloudflare "Managed robots.txt" AI-blocking feature must not be enabled, or it will prepend AI crawler `Disallow` directives to the file silently.

**Primary recommendation:** Build `BaseHead.astro` + `JsonLd.astro` as separate components consumed by `Layout.astro`. Drive all values from `constants.ts`. Run `astro build && cat dist/sitemap-index.xml` to verify sitemap output before marking the phase done.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/sitemap | 3.7.2 | Auto-generates sitemap-index.xml + sitemap-0.xml at build | Official Astro integration; already installed |
| Astro built-in (astro:assets) | 6.1.3 | `Astro.url`, `Astro.site` for canonical URL construction | Zero deps; built-in to Astro 6 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema.org vocabulary | — | JSON-LD type definitions | Always — no npm package needed, pure JSON |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled `BaseHead.astro` | `astro-seo` npm package | Package adds abstraction; hand-rolled is ~40 lines and gives full control. For a single-page site the package overhead is not justified. |
| `set:html` JSON.stringify | `<Fragment set:html>` | Same result; inline script tag with `set:html` on the tag itself is cleaner in Astro |

**No new installation needed.** All dependencies are already present.

---

## Architecture Patterns

### Recommended Component Structure

```
src/
├── components/
│   └── seo/
│       ├── BaseHead.astro        # <title>, meta description, canonical, OG, sitemap link
│       └── JsonLd.astro          # <script type="application/ld+json"> via set:html
├── layouts/
│   └── Layout.astro              # Updated: replace bare <title> with <BaseHead> + <JsonLd>
├── lib/
│   ├── constants.ts              # Already exists — NAP, SITE_URL, SOCIAL
│   └── schema.ts                 # NEW: buildLocalBusinessSchema() → typed JS object
└── pages/
    └── index.astro               # Passes title/description props to Layout
public/
└── robots.txt                    # NEW: static allow-all file
```

### Pattern 1: BaseHead.astro Component

**What:** Centralized `<head>` meta tag block accepting `title` and `description` as props. Constructs canonical URL from `Astro.url.pathname` + `Astro.site`. Includes sitemap discovery link.

**When to use:** Included once in `Layout.astro`, inside `<head>`. All pages automatically inherit it.

**Example:**
```astro
---
// src/components/seo/BaseHead.astro
// Source: Astro docs + eastondev.com verified pattern
interface Props {
  title: string;
  description: string;
  ogImage?: string;
}
const { title, description, ogImage = '/og-image.jpg' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImageURL = new URL(ogImage, Astro.site);
---
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
<link rel="sitemap" href="/sitemap-index.xml" />
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:site_name" content="Redbird Lawn Care Service" />
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />
```

### Pattern 2: JsonLd.astro Component with set:html

**What:** Accepts a pre-built schema object, JSON.stringify's it, and injects via `set:html`. The `set:html` directive is mandatory — without it, Astro escapes the curly braces and the JSON renders as text, not a valid script block.

**When to use:** Inside `<head>` in Layout.astro, after BaseHead.

**Example:**
```astro
---
// src/components/seo/JsonLd.astro
// Source: Astro docs — set:html directive for unescaped HTML injection
interface Props {
  schema: Record<string, unknown>;
}
const { schema } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Pattern 3: schema.ts Builder Function

**What:** Pure TypeScript function that imports from `constants.ts` and returns a fully typed LocalBusiness schema object. Keeps business logic out of the Astro component layer.

**When to use:** Called once in `Layout.astro` (or `index.astro`) to produce the schema object passed to `JsonLd.astro`.

**Example:**
```typescript
// src/lib/schema.ts
import { NAP, SITE_URL, SOCIAL } from './constants';

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#business`,
    "name": NAP.name,
    "url": SITE_URL,
    "telephone": NAP.phone,
    "email": NAP.email,
    "image": `${SITE_URL}/og-image.jpg`,
    "priceRange": "$$",
    "description": "Residential lawn care services in Wentzville, MO and surrounding areas including O'Fallon, Lake Saint Louis, Troy, and Foristell.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": NAP.address.street,
      "addressLocality": NAP.address.city,
      "addressRegion": NAP.address.state,
      "postalCode": NAP.address.zip,
      "addressCountry": NAP.address.country
    },
    "areaServed": [
      { "@type": "City", "name": "Wentzville, MO" },
      { "@type": "City", "name": "O'Fallon, MO" },
      { "@type": "City", "name": "Lake Saint Louis, MO" },
      { "@type": "City", "name": "Troy, MO" },
      { "@type": "City", "name": "Foristell, MO" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      SOCIAL.facebook
    ]
  } as const;
}
```

### Pattern 4: Updated Layout.astro

**What:** Replace the bare `<title>` tag in the existing layout with `<BaseHead>` and add `<JsonLd>`. The `<Font>` tags and global.css import remain exactly as-is.

**Example:**
```astro
---
// src/layouts/Layout.astro
import { Font } from 'astro:assets';
import '../styles/global.css';
import BaseHead from '../components/seo/BaseHead.astro';
import JsonLd from '../components/seo/JsonLd.astro';
import { buildLocalBusinessSchema } from '../lib/schema';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Redbird Lawn Care Service | Top Rated Mowing in Wentzville, MO",
  description = "Professional lawn care services near Wentzville, MO. Weekly mowing, trimming, mulch & bed maintenance, and seasonal cleanups. Serving 63385 and surrounding areas. Get a free quote today."
} = Astro.props;

const schema = buildLocalBusinessSchema();
---
<html lang="en">
  <head>
    <BaseHead title={title} description={description} />
    <JsonLd schema={schema} />
    <Font cssVariable="--font-heading" preload />
    <Font cssVariable="--font-body" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 5: robots.txt (Static File)

**What:** Plain text file in `public/` — Astro copies it to `dist/` unchanged at build time. No generation needed.

**When to use:** Single static file, never templated.

```
User-agent: *
Allow: /

Sitemap: https://redbirdlawnservice.com/sitemap-index.xml
```

**Critical note:** The `Sitemap:` directive in robots.txt tells crawlers where to find it. Use the absolute URL. Use `sitemap-index.xml` (not `sitemap.xml`) — that is what `@astrojs/sitemap` generates.

### Anti-Patterns to Avoid

- **Omitting `set:html` on JSON-LD script tag:** Astro escapes `{` as `&lbrace;` and the structured data is rendered as text. Always use `set:html={JSON.stringify(schema)}`.
- **Hardcoding NAP strings in schema.ts:** Import from `constants.ts`. Never retype the phone number or business name.
- **Using `LawnCareService` as @type:** This is not an official schema.org type. Google will not error, but the type is meaningless. Use `["LocalBusiness", "HomeAndConstructionBusiness"]`.
- **Using `sitemap.xml` in the sitemap link and robots.txt directive:** `@astrojs/sitemap` generates `sitemap-index.xml` as the entry point, not `sitemap.xml`. Using the wrong filename means crawlers can't find it.
- **Not setting `site:` in astro.config.mjs before building:** The `site` field is already set to `https://redbirdlawnservice.com` in the existing config. Do not remove it. Without it, `@astrojs/sitemap` generates nothing and `Astro.site` is undefined, breaking canonical URL construction.
- **Enabling Cloudflare Managed robots.txt:** If the "Instruct AI bot traffic with robots.txt" setting is enabled in the Cloudflare dashboard, Cloudflare prepends `Disallow` directives for AI crawlers to the `public/robots.txt` file silently. For a local service site, allowing all crawlers (including AI) is correct. Verify this setting is off.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom sitemap.xml template | @astrojs/sitemap (already installed) | Handles lastmod, entryLimit, changefreq, index file automatically |
| Canonical URL construction | String concatenation | `new URL(Astro.url.pathname, Astro.site)` | Handles trailing slash, path encoding, and domain correctly |
| JSON-LD validation | Custom validator | Google Rich Results Test | Authoritative; flags missing recommended fields |

**Key insight:** The entire sitemap story is solved by setting `site:` in astro.config.mjs and running `astro build`. Zero configuration beyond what's already done.

---

## Common Pitfalls

### Pitfall 1: `set:html` Missing on JSON-LD Script Tag
**What goes wrong:** `<script type="application/ld+json">{JSON.stringify(schema)}</script>` — without `set:html`, Astro treats the content as JSX-style children and HTML-escapes it. The output is literal text with `&quot;` entities, not valid JSON. Google will not parse it.
**Why it happens:** Astro's default behavior is to escape dynamic content for XSS safety. `set:html` is the opt-out for raw injection.
**How to avoid:** Always use `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`.
**Warning signs:** View page source — if you see `&quot;` or `&lbrace;` in the script block, the directive is missing.

### Pitfall 2: NAP Drift Between JSON-LD and Footer
**What goes wrong:** Phone number or business name typed differently in schema vs. visible footer text. Google's local ranking algorithm detects NAP inconsistency across website, GBP, and structured data.
**Why it happens:** Easy to forget to update one place when the other is changed.
**How to avoid:** `schema.ts` imports `NAP` from `constants.ts`. `Footer.astro` (Phase 3) must also import from `constants.ts`. Never retype phone or name strings.
**Warning signs:** Google Rich Results Test shows different NAP than visible page footer.

### Pitfall 3: Wrong Sitemap Filename Reference
**What goes wrong:** `<link rel="sitemap" href="/sitemap.xml" />` and `Sitemap: .../sitemap.xml` in robots.txt — both incorrect. `@astrojs/sitemap` generates `sitemap-index.xml` as the index, with the actual URLs in `sitemap-0.xml`.
**Why it happens:** Most robots.txt templates and tutorials reference `sitemap.xml`. The Astro integration uses a different naming convention.
**How to avoid:** Reference `/sitemap-index.xml` in both `<link rel="sitemap">` and robots.txt `Sitemap:` directive.
**Warning signs:** Google Search Console reports sitemap not found at the submitted URL.

### Pitfall 4: Cloudflare Managed robots.txt Overriding Allow-All Policy
**What goes wrong:** A clean `Allow: /` robots.txt in `public/` is modified by Cloudflare at the CDN layer, prepending `Disallow` directives for AI crawlers (ClaudeBot, GPTBot, etc.) before serving.
**Why it happens:** Cloudflare's "Instruct AI bot traffic with robots.txt" feature is opt-in, but the default for new Cloudflare zones (as of 2025-2026) may differ from older zones.
**How to avoid:** After deploy, fetch `https://redbirdlawnservice.com/robots.txt` directly and verify it only contains what was written. Check Cloudflare dashboard > Security > Bots > "Manage Robots.txt" to confirm the feature is not enabled.
**Warning signs:** robots.txt served from Cloudflare contains lines not present in `public/robots.txt`.

### Pitfall 5: Meta Description Exceeds 160 Characters
**What goes wrong:** Google truncates meta descriptions beyond ~160 characters in SERPs. Truncation cuts off the zip code or CTA if it appears late in the string.
**Why it happens:** Adding city list + zip + CTA pushes descriptions long.
**How to avoid:** Keep description under 155 characters. Front-load the primary keyword and zip code. Validate at https://www.google.com/webmasters/tools/.
**Warning signs:** Google SERP shows "..." mid-description before the zip code.

### Pitfall 6: `NAP.address.street` Still a Placeholder
**What goes wrong:** `src/lib/constants.ts` currently has `street: '[CONFIRM FROM GBP]'`. If JSON-LD is generated and submitted without the real street address, Google Rich Results Test passes but the local business signal is weak (or incorrect).
**Why it happens:** Street address was intentionally left as a placeholder during Phase 1.
**How to avoid:** Before Phase 2 is marked complete, confirm the exact street address from Alberto's Google Business Profile and update `constants.ts`. The JSON-LD schema will automatically inherit the fix.
**Warning signs:** Rich Results Test shows `"streetAddress": "[CONFIRM FROM GBP]"`.

---

## Code Examples

Verified patterns from official and authoritative sources:

### Correct JSON-LD @type for Lawn Care Business
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": "https://redbirdlawnservice.com/#business"
}
```
**Rationale:** `LawnCareService` is not a schema.org type (404 on schema.org/LawnCareService). `HomeAndConstructionBusiness` is the correct parent type for home service businesses per schema.org hierarchy. Using an array `@type` value is valid JSON-LD and lets both types apply.

### Canonical URL Construction in Astro 6
```astro
---
// Source: Astro docs — Astro.url and Astro.site built-ins
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// For index page: https://redbirdlawnservice.com/
// For any subpage: https://redbirdlawnservice.com/[path]/
---
<link rel="canonical" href={canonicalURL} />
```

### @astrojs/sitemap Output Verification
```bash
# Run after astro build to verify sitemap was generated correctly
npx astro build && cat dist/sitemap-index.xml
# Expected output: XML with <loc>https://redbirdlawnservice.com/</loc>
# If empty or missing: check that site: is set in astro.config.mjs
```

### Correct robots.txt for Single-Page Site with Sitemap
```
User-agent: *
Allow: /

Sitemap: https://redbirdlawnservice.com/sitemap-index.xml
```

### Meta Title Character Count Verification
```
"Redbird Lawn Care Service | Top Rated Mowing in Wentzville, MO"
 123456789012345678901234567890123456789012345678901234567890123
                                                             ^63 chars
```
**Result:** 63 characters — just over the "under 60" soft guideline but within the ~60-65 char display window Google uses for most screens. Acceptable for this locked requirement.

### Meta Description Template (Under 155 Characters)
```
"Expert lawn care services near Wentzville, MO 63385. Mowing, trimming & cleanups. Serving O'Fallon, Lake Saint Louis, Troy. Get a free quote!"
```
Character count: ~143. Includes primary keyword, zip code 63385, service area cities, and CTA within the 155-char limit.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `microdata` / `RDFa` inline schema | JSON-LD in `<head>` | 2016 (Google recommendation) | JSON-LD is fully decoupled from HTML; easier to maintain |
| `@astrojs/sitemap` under `integrations` (v3 only) | Same — stable API | — | No change needed; already configured correctly |
| Astro `<title>` in Layout.astro directly | `BaseHead.astro` component with typed props | Astro best practice | Encapsulates all head concerns; enables per-page overrides |

**No deprecated approaches in use.** The existing `astro.config.mjs` and `Layout.astro` are clean starting points.

---

## Open Questions

1. **Real street address for NAP**
   - What we know: `constants.ts` has `street: '[CONFIRM FROM GBP]'`
   - What's unclear: Exact address format on Alberto's Google Business Profile
   - Recommendation: Confirm from Alberto before Phase 2 is marked verified. The schema will auto-correct once constants.ts is updated. This is a data gap, not a code problem.

2. **Facebook Page URL for `sameAs`**
   - What we know: `SOCIAL.facebook` in constants.ts is currently `'[CONFIRM FROM GBP]'`
   - What's unclear: Exact Facebook page URL
   - Recommendation: Same as above — fill in constants.ts when available. `sameAs` will be an empty/placeholder value until then; schema is still valid without it.

3. **Business hours for `openingHoursSpecification`**
   - What we know: No canonical hours are defined anywhere yet
   - What's unclear: Alberto's actual operating hours (Mon-Sat? Mon-Fri? Hours?)
   - Recommendation: Use Mon-Sat 8:00-18:00 as a reasonable default for a residential lawn service. Confirm and update schema.ts when known. This does not block the phase.

4. **OG image asset**
   - What we know: `public/` contains `favicon.ico` and `favicon.svg` only; no `og-image.jpg` exists yet
   - What's unclear: Whether Phase 2 should create a placeholder OG image or reference a non-existent path
   - Recommendation: Create a minimal 1200×630 placeholder PNG in `public/og-image.jpg` (solid color with text is acceptable) so the OG meta tag resolves to a valid URL. Phase 3 can replace it with a real job photo.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 2 is code and static file changes only. No external tools, services, CLIs, or databases are required beyond the existing project dependencies (`@astrojs/sitemap` already installed, Astro 6.1.3 already pinned).

---

## Sources

### Primary (HIGH confidence)
- [Google Search Central — LocalBusiness Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business) — required/recommended properties, Rich Results Test guidance
- [schema.org/LocalBusiness](https://schema.org/LocalBusiness) — confirmed type hierarchy; HomeAndConstructionBusiness subtypes listed
- [schema.org/HomeAndConstructionBusiness](https://schema.org/HomeAndConstructionBusiness) — confirmed LawnCareService is NOT a subtype; Electrician, HVACBusiness, etc. are listed
- [@astrojs/sitemap Astro Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — configuration API, output filenames (sitemap-index.xml), canonical URL format
- [Cloudflare Managed robots.txt docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) — confirmed Cloudflare prepends AI-blocking directives if feature is enabled

### Secondary (MEDIUM confidence)
- [Astro SEO Complete Guide — eastondev.com (Dec 2025)](https://eastondev.com/blog/en/posts/dev/20251202-astro-seo-complete-guide/) — BaseHead.astro pattern, `set:html` requirement verified
- [Local Business Schema Guide 2026 — clickyowl.com](https://clickyowl.com/local-business-schema/) — complete JSON-LD example with areaServed, openingHoursSpecification, sameAs
- [Meta Titles & Descriptions for Local SEO 2026 — sink-or-swim-marketing.com](https://sink-or-swim-marketing.com/blog/how-to-optimize-your-meta-titles-descriptions-for-top-local-rankings-in-2026/) — title format `Keyword + Location | Value | Brand`, 160-char limit

### Tertiary (LOW confidence — not needed; core decisions covered by primary sources)
- None required

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — @astrojs/sitemap already installed, Astro built-ins verified in docs
- Architecture: HIGH — BaseHead/JsonLd pattern verified against Astro 6 docs and `set:html` directive confirmed
- JSON-LD schema type: HIGH — schema.org type hierarchy verified directly; LawnCareService confirmed absent
- Sitemap output: HIGH — official Astro docs confirm `sitemap-index.xml` filename
- robots.txt Cloudflare behavior: MEDIUM — official CF docs confirmed the feature exists; whether it's on by default for new Pages projects is not fully documented

**Research date:** 2026-04-05
**Valid until:** 2026-07-05 (Astro stable, schema.org stable; @astrojs/sitemap version should be re-verified if > 30 days pass)
