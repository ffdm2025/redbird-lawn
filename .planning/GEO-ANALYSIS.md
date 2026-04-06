# GEO Analysis: Redbird Lawn Care Service

**Analyzed:** 2026-04-06
**Source:** dist/index.html (pre-deploy build)
**Domain:** redbirdlawnservice.com (not yet live)

---

## GEO Readiness Score: 38/100

| Category | Score | Max | Notes |
|----------|-------|-----|-------|
| Citability | 8/25 | 25 | No self-contained answer blocks, no statistics, no definitions |
| Structural Readability | 14/20 | 20 | Good heading hierarchy, but no question-based headings, no lists/tables in content |
| Multi-Modal Content | 3/15 | 15 | No images (CSS placeholders), no video, no infographics |
| Authority & Brand Signals | 5/20 | 20 | No author schema, no dates, no citations, zero brand presence |
| Technical Accessibility | 8/20 | 20 | SSR is excellent, but robots.txt missing AI crawlers, no llms.txt |

---

## Platform Breakdown

| Platform | Visibility | Why |
|----------|-----------|-----|
| Google AI Overviews | LOW | Page won't rank yet (not indexed). Once live, content lacks the passage-level citability AI Overviews pull from. No question-based headings, no data points, no statistics. |
| ChatGPT | NONE | Zero brand presence on Wikipedia, Reddit, YouTube. ChatGPT pulls 47.9% from Wikipedia, 11.3% from Reddit. Redbird has no entity presence. |
| Perplexity | NONE | Same issue — 46.7% of Perplexity citations come from Reddit. No community validation anywhere. |
| Bing Copilot | LOW | Not indexed on Bing. No IndexNow implementation. |

---

## AI Crawler Access Status

**Current robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://redbirdlawnservice.com/sitemap-index.xml
```

**Problem:** While `User-agent: *` technically allows all crawlers, best practice is to explicitly allow key AI crawlers. More importantly, there's no `llms.txt` file.

| Crawler | Status | Action |
|---------|--------|--------|
| GPTBot (OpenAI) | Allowed (via wildcard) | Explicitly allow |
| OAI-SearchBot | Allowed | OK |
| ClaudeBot (Anthropic) | Allowed | OK |
| PerplexityBot | Allowed | OK |
| CCBot (training) | Allowed | Consider blocking |
| Bytespider (ByteDance) | Allowed | Consider blocking |

**Recommendation:** Add explicit AI crawler directives. Block training crawlers, allow search crawlers.

---

## llms.txt Status

**MISSING** — No `/llms.txt` file exists.

**Ready-to-use template:**
```
# Redbird Lawn Care Service
> Professional residential lawn care in Wentzville, MO. Owner-operated by Alberto Murillo.

## Services
- [Weekly Mowing](https://redbirdlawnservice.com/#services): Professional mowing, edging, and cleanup on a consistent schedule
- [Trimming & Edging](https://redbirdlawnservice.com/#services): Sharp clean lines around obstacles, fence lines, and flower beds
- [Mulch & Bed Maintenance](https://redbirdlawnservice.com/#services): Fresh mulch and clean beds for curb appeal
- [Seasonal Cleanups](https://redbirdlawnservice.com/#services): Spring and fall cleanup services

## Service Area
- Wentzville, MO 63385
- O'Fallon, MO
- Lake Saint Louis, MO
- Troy, MO
- Foristell, MO

## Contact
- Phone: (314) 497-6152
- Email: sales@redbirdlawnservic.com
- Quote: https://redbirdlawnservice.com/#contact

## Key Facts
- Locally owned and operated in Wentzville, MO
- Fully insured residential lawn care
- Owner: Alberto Murillo
- Service area: St. Charles County, MO
```

---

## Brand Mention Analysis

| Platform | Presence | Impact |
|----------|----------|--------|
| Wikipedia | NONE | Critical gap — 47.9% of ChatGPT citations come from Wikipedia |
| Reddit | NONE | Critical gap — 46.7% of Perplexity citations, 11.3% of ChatGPT |
| YouTube | NONE | Strongest correlation with AI visibility (0.737) |
| LinkedIn | NONE | Moderate correlation |
| Google Business Profile | EXISTS (assumed) | Primary local signal but not an AI citation source |
| Facebook | EXISTS (URL unconfirmed) | Minimal AI citation impact |

**Brand mentions correlate 3x more with AI visibility than backlinks.** This is the single biggest gap.

---

## Passage-Level Citability

**Current state: POOR.** The site content is conversational and brand-forward but lacks the specific, quotable, fact-based passages that AI systems extract for citations.

**What AI systems want (134-167 word self-contained answer blocks):**
- Direct answers in first 40-60 words of section
- Specific statistics with sources
- "X is..." definition patterns
- Unique data points

**What the site currently has:**
- Marketing copy ("reliable work from someone who lives right here")
- Service descriptions without specifics ("Professional mowing on a schedule")
- Testimonials (good for trust, not citable by AI)
- No statistics, no data points, no sourced claims

**Example fix — current About section opening:**
> "I started Redbird because I was tired of seeing lawn companies that showed up late, did a rushed job, and were impossible to reach."

**GEO-optimized rewrite:**
> "Redbird Lawn Care Service is a residential lawn care company serving Wentzville, MO and St. Charles County. Founded by Alberto Murillo, Redbird provides weekly mowing, trimming, mulch and bed maintenance, and seasonal cleanup services to homeowners in the 63385 zip code. According to the University of Missouri Extension, cool-season grasses like those in the Wentzville area need mowing every 5-7 days during peak growing season to maintain a healthy root system."

The rewrite includes: a definition, specific services, a geographic identifier, a zip code, and a cited fact. That's what gets cited by AI.

---

## Server-Side Rendering Check

**EXCELLENT.** Astro 6 with `output: 'static'` renders everything server-side. All content is in the HTML source — AI crawlers can read it without JavaScript execution. The React islands (ContactForm, MobileNav, VAPIWidget) are progressive enhancements that don't affect content crawlability.

This is a significant structural advantage over competitors running Wix/WordPress with heavy JS.

---

## Top 10 Highest-Impact Changes

### Quick Wins (implement now)

1. **Create `/llms.txt`** — Template above is ready to deploy. Zero effort, immediate AI discoverability signal.

2. **Update `robots.txt`** — Add explicit AI crawler allowances and block training crawlers.

3. **Add question-based H2 headings** to service descriptions — "What does weekly mowing include?" instead of "Weekly Mowing." Matches the query patterns AI systems answer.

4. **Add a definition block** to the About section — "Redbird Lawn Care Service is a [definition]" in the first sentence. AI systems extract these for knowledge panels.

5. **Add publication date and author** to the homepage — `<time>` element with `datetime` attribute, plus Person schema for Alberto.

### Medium Effort (implement with blog)

6. **Create self-contained answer blocks** in each blog article — 134-167 word passages that directly answer the title question with cited facts. These are what AI Overviews pull.

7. **Implement Person schema** for Alberto Murillo — author byline with `sameAs` links to LinkedIn, Facebook. This builds entity recognition.

8. **Add FAQ section** to homepage with question-based headings and short direct answers. Not FAQ schema (Google penalizes commercial FAQ schema) but visible content.

### High Impact (ongoing)

9. **Build Reddit presence** — Alberto (or you) answering lawn care questions in r/lawncare, r/StLouis, r/wentzville with natural Redbird mentions. This is the #1 signal for Perplexity and a strong ChatGPT signal.

10. **Create YouTube content** — Even 60-second "quick tip" videos from Alberto shot on a phone. YouTube mentions have the strongest correlation (0.737) with AI citation visibility.

---

## Schema Recommendations

**Current:** LocalBusiness + HomeAndConstructionBusiness (good)

**Missing:**
- `Person` schema for Alberto Murillo (author/founder)
- `Article` schema for blog posts (being added in Phase 6)
- `FAQPage` or visible FAQ content
- `Service` schema for individual services
- `Review` schema for testimonials (with `reviewRating`)

**Priority add:** Person schema with `sameAs` links + Review schema for testimonials.

---

## Content Reformatting Suggestions

### Hero Section
**Current:** Marketing headline + subtext
**Add:** A 2-sentence definition block below the subheadline:
"Redbird Lawn Care Service provides residential mowing, trimming, mulching, and seasonal cleanup to homeowners in Wentzville, MO 63385 and surrounding St. Charles County communities including O'Fallon, Lake Saint Louis, Troy, and Foristell."

### Service Descriptions
**Current:** Short marketing descriptions
**Add:** Specific details that answer "what's included?" — already planned in Phase 3 with detailed bullet lists. Make each service description start with a direct answer: "Weekly mowing includes..."

### About Section
**Current:** First-person story (great for trust)
**Add:** A factual opening sentence before the story: "Alberto Murillo is the owner and operator of Redbird Lawn Care Service in Wentzville, MO, serving residential customers since [year]."

---

*Analysis based on pre-deploy build. Scores will improve significantly with blog content (Phase 6), llms.txt, updated robots.txt, and brand presence building.*
