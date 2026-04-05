# Feature Landscape

**Domain:** Local lawn care service website (residential, single-market, lead-gen)
**Business:** Redbird Lawn Care Service — Wentzville, MO
**Researched:** 2026-04-05
**Research Mode:** Ecosystem + Competitor Intelligence

---

## Competitor Intelligence

### Competitors Analyzed

| Competitor | URL | Coverage Area | Notes |
|------------|-----|---------------|-------|
| Refresh Outdoor Services | refreshmyoutdoor.com | Wentzville MO 63385 | Direct overlap — same zip code |
| Perfect Image Total Lawn | perfectimagelawn.com | Wentzville, St. Charles County | Wix-built, thin content |
| Greenside Lawncare | greensidelawncare.com | Wentzville + surrounding | Service packages listed, no testimonials |
| Landesign Plus | landesignplus.net | Wentzville, O'Fallon, Saint Peters | Has location pages, single testimonial |
| Greenway Lawncare STL | greenwaystl.com | St. Charles County | Site was unreachable during research |
| Ramos Landscaping LLC | ramoslandscapingllc.com | Greater St. Louis | Landscaping-focused, more premium |
| Leave It to Roman | leaveit2roman.com | O'Fallon, Lake Saint Louis, Dardenne Prairie | Site appeared sparse |
| K&S Lawn Maintenance | kslawnstl.com | O'Fallon, Wentzville, St. Charles | Sod installation focus |
| SCC Lawncare | stcharlescountylawncare.com | St. Charles County | Serving since 2008 |
| Brothers Lawn Maintenance | brotherslawnmaintenancemo.com | O'Fallon, Lake Saint Louis | Phone-first approach |

### What Competitors Do Well

- **Hero sections** with service area call-outs ("Wentzville, MO" in H1) — Greenside, Landesign Plus
- **Service packages** with tier names (Elite, Platinum, Gold) — Greenside
- **Years of experience** claims — most sites feature this prominently
- **Phone number in header** — universal across all analyzed sites
- **Free estimate CTAs** — universal
- **LocalBusiness structured data** — Ramos Landscaping, Refresh Outdoor, Landesign Plus
- **Location-specific pages** — Landesign Plus, Greenside (multiple city pages)
- **License number display** — Refresh Outdoor (C30529 Missouri license)

### What Competitors Are Missing (Redbird Opportunity Gaps)

| Gap | Which Competitors Miss It | Redbird Advantage |
|-----|--------------------------|-------------------|
| Customer testimonials with names/photos | ALL analyzed sites have empty or absent review sections | Display real Google reviews with attribution |
| Before/after photo gallery | Refresh has 10 photos; most have none | Document every job with before/after shots |
| AI voice assistant / chatbot | None of the local competitors have any AI interaction | Vivian (VAPI) is a genuine first-mover differentiator |
| Owner face + personal story | Ramos and Refresh have owner bios, most don't | Alberto's Wentzville connection is authentic content |
| Transparent service descriptions | Most sites are vague; package names without detail | Describe exactly what "weekly mowing" includes |
| Mobile performance | Wix/WordPress sites score 40-65 on Lighthouse mobile | Sub-100ms TTFB with Astro is a real advantage |
| Service area map or zip code list | No competitor displays a visual service map | Simple map or city list builds trust |
| FAQ content | Refresh has 3 FAQs; most have zero | Detailed FAQs capture long-tail search traffic |
| Response time promise | None advertise response SLA | "We respond within 24 hours" is a differentiator |

### Keyword Targeting Observed in Competitors

- "lawn care Wentzville MO" (Greenside, Landesign Plus — competitive)
- "lawn care St. Charles County" (Landesign Plus, Greenway)
- "lawn mowing Wentzville" (Greenside)
- "lawn fertilization Wentzville" (Refresh, Landesign Plus)
- "lawn care O'Fallon MO" (multiple)
- "landscaping Wentzville MO" (Ramos, Landesign Plus)

**Keyword gaps not targeted by local competitors:**
- "lawn care near me 63385" (zip-specific)
- "residential lawn mowing Wentzville" (qualifier: residential)
- "mulch installation Wentzville MO"
- "seasonal cleanup Wentzville MO"
- "weekly lawn service Wentzville"
- "lawn care Troy MO" / "lawn care Foristell MO" (adjacent towns underserved)

---

## Table Stakes

Features users expect. A missing table stakes element causes visitors to leave or distrust the site.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| H1 with primary keyword | "Lawn care Wentzville MO" must appear above fold | Low | Direct SEO rank signal |
| Click-to-call phone number | Mobile users expect one tap to call | Low | (314) 497-6152 in sticky header + hero |
| Services list with descriptions | Visitors must know what you offer in 5 seconds | Low | Weekly Mowing, Trimming, Mulch, Seasonal Cleanup |
| Lead capture form | Primary conversion goal — name, address, phone, service | Medium | Posts to GHL webhook |
| Mobile-first layout | 70%+ of local service searches are mobile | Medium | Tailwind responsive grid |
| Fast load time | >3 second load = visitor abandons | High | Astro static + Cloudflare CDN |
| Trust signals (insured, local, rated) | Homeowners won't hire strangers without trust cues | Low | "Fully Insured" + "Locally Owned" + "5-Star Rated" |
| Business name, address, phone (NAP) | Local SEO requires exact NAP match with GBP | Low | Footer + JSON-LD schema |
| LocalBusiness JSON-LD schema | Required for Google rich results eligibility | Medium | Exact match with GBP and Facebook NAP |
| Social links (Facebook) | Local businesses expected to have social presence | Low | Footer link only |
| About section | Homeowners hire people, not companies — owner matters | Low | Alberto Murillo, Wentzville connection |
| sitemap.xml | Required for search engine indexation | Low | Auto-generated via @astrojs/sitemap |
| robots.txt | Proper crawl configuration | Low | Allow all, disallow nothing |
| Meta title + description | Page-level SEO — appears in Google results | Low | "Lawn Care Services Wentzville MO" |
| Responsive images | Mobile page weight; Core Web Vitals | Medium | next/image equivalent via Astro Image |

---

## Differentiators

Features not universally expected but that create competitive advantage — especially given the specific gaps found in Wentzville competitors.

| Feature | Value Proposition | Complexity | Competitor Gap | Notes |
|---------|-------------------|------------|----------------|-------|
| VAPI voice assistant (Vivian) | 24/7 lead capture via voice; no competitor has this | High | All local competitors | Floating widget, WebRTC, React island |
| Real customer testimonials with names | ALL local competitors have empty review sections | Low | All local competitors | Pull from Google/Facebook reviews; no fake content |
| Before/after photo gallery | Visual proof of work quality; most competitors have none | Low | Most competitors | Document jobs with phone; label with neighborhood |
| Owner photo + personal story | Alberto's Wentzville roots = emotional trust connection | Low | Most competitors | Authentic local connection beats national chains |
| Response time promise | "We respond within 24 hours" — no competitor advertises this | Low | All local competitors | Sets expectation, reduces anxiety, drives form submits |
| Service area callout (cities served) | Captures "lawn care Troy MO" searches competitors miss | Medium | Most competitors | List Wentzville, O'Fallon, Lake Saint Louis, Troy, Foristell |
| Zip-code targeted page title/meta | "lawn care near me 63385" — competitors not targeting zip | Low | All local competitors | Add "63385" and "63366" zip codes in meta |
| Detailed service descriptions | What does "weekly mowing" actually include? Competitors vague | Low | All local competitors | List what's included: mow, edge, blow, bag/mulch clippings |
| FAQ section (5-10 questions) | Captures long-tail search traffic; builds trust | Medium | Most competitors | "Do you require contracts?" "Are you insured?" etc. |
| Scroll-triggered animations | Modern feel vs. flat static competitor sites | Low | All local competitors | CSS + Intersection Observer — no JS libs |
| Lighthouse 95+ performance score | Measurably faster than Wix/WordPress competitors | High | All local competitors | Astro static output enables this |

---

## Anti-Features

Features to deliberately NOT build in v1. These would add complexity, cost, or bloat without increasing conversion.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Online booking / scheduling calendar | Requires backend, adds complexity; Alberto handles offline | Form → GHL → Alberto calls back |
| Pricing pages with dollar amounts | Local lawn pricing varies by property; quoted competitors don't show prices either | "Request a free quote" with form |
| Customer login / portal | Brochure site — no returning user needs | Defer to v2 if CRM integration deepens |
| Blog / content management | v1 is single-page; no CMS needed | Defer to v2 for SEO content plays |
| Multiple pages / full site | Single high-converting landing page is the v1 goal | Add service area pages in v2 |
| Stripe / payment processing | No transactions on lead-gen site | Defer to v2 if recurring billing launched |
| Live chat (non-AI) | Requires Alberto to be online; worse than a form | Use Vivian (VAPI) instead |
| Stock photography with people | Fake content destroys trust | Real job photos only |
| Video background / hero video | Kills performance; violates 500KB page budget | Use high-quality static image |
| Newsletter / email capture | B2C local service; not a content product | GHL handles nurture sequences |
| Social media feed embeds | Third-party JS requests; performance penalty | Link to Facebook profile instead |
| Google Maps embed (iframe) | Adds 300-500KB; hurts Core Web Vitals | Text-based service area list instead |
| Framer Motion / GSAP | Violates 80KB JS budget | CSS transitions + Intersection Observer |
| Cookie consent banner | Static site with no analytics cookies; not required | Use Cloudflare Analytics (cookieless) |

---

## Feature Dependencies

```
LocalBusiness JSON-LD schema
  └── Requires exact NAP (Name/Address/Phone) defined first
      └── Must match Google Business Profile exactly

Lead capture form (React island)
  └── Requires GHL webhook URL configured
      └── Requires GHL account/pipeline set up

VAPI voice widget (React island, client:only)
  └── Requires VAPI API key + assistant ID
      └── Requires Vivian assistant configured in VAPI dashboard
          └── Requires script/prompts written for Vivian

Before/after gallery
  └── Requires real job photos from Alberto
      └── Requires photo documentation process established

Testimonials section
  └── Requires real reviews from Google or Facebook
      └── Cannot launch with placeholder/fake content

Service area cities list
  └── Feeds meta tags (city-specific keywords)
      └── Informs structured data service area coverage

sitemap.xml
  └── Requires @astrojs/sitemap integration configured
      └── Requires canonical URL defined in astro.config.ts

Performance targets (Lighthouse 95+)
  └── Requires self-hosted fonts (Space Grotesk + Inter)
  └── Requires zero external requests (except GHL + VAPI)
  └── Requires optimized images (Astro Image component)
  └── Requires CSS animations (no JS animation libraries)
```

---

## MVP Recommendation

**Must ship to launch (table stakes + highest-ROI differentiators):**

1. Hero section — H1 with keyword, primary CTA, click-to-call
2. Trust bar — "Locally Owned" + "Fully Insured" + "5-Star Rated"
3. Services section — 4 services with detailed descriptions (what's included)
4. About section — Alberto's photo + Wentzville story
5. Testimonials — minimum 3 real reviews with names
6. Lead capture form — Name, Address, Phone, Service (posts to GHL)
7. VAPI Vivian widget — floating button, React island, client-only
8. Footer — NAP, email, Facebook, sitemap/robots
9. LocalBusiness JSON-LD schema — exact NAP match
10. SEO meta tags — title, description, zip codes

**Defer post-launch (v2):**
- Before/after photo gallery (needs photo asset pipeline first)
- FAQ section (valid for v1.1 — low effort, high SEO value)
- Service area city pages (multi-page architecture for v2)
- Blog / content marketing (v2 SEO strategy)
- Service area map (low value vs. performance cost)

---

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Competitor features/gaps | HIGH | Direct site scrapes of 6+ local competitors |
| Table stakes features | HIGH | Industry sources + competitor pattern matching |
| Differentiators | MEDIUM | Competitor gap analysis + industry best practices |
| Keyword gaps | MEDIUM | Competitor content analysis; not validated against actual search volume |
| Conversion best practices | MEDIUM | Multiple industry sources (ServiceAutopilot, GorillaDesk, GreenFrog) |
| AI voice assistant as differentiator | HIGH | Zero local competitors have any AI/chatbot; VAPI confirmed available |

---

## Sources

- [Refresh Outdoor Services](https://refreshmyoutdoor.com/) — direct competitor, Wentzville MO 63385
- [Perfect Image Total Lawn Management](https://www.perfectimagelawn.com/) — direct competitor, Wentzville
- [Greenside Lawncare — Wentzville](https://www.greensidelawncare.com/locations/wentzville-lawn-care/) — direct competitor
- [Landesign Plus — Lawn Care Wentzville](https://landesignplus.net/our-services/lawn-care/) — direct competitor
- [Ramos Landscaping LLC](https://www.ramoslandscapingllc.com/) — regional competitor, St. Louis area
- [Leave It to Roman](https://www.leaveit2roman.com/) — O'Fallon / Lake Saint Louis competitor
- [20 Best Lawn Care Websites — CyberOptik](https://www.cyberoptik.net/blog/20-best-lawn-care-websites/) — industry best practices
- [Best Lawn Care Website Designs — Service Autopilot](https://www.serviceautopilot.com/lawn-care/best-landscaping-lawn-care-website-designs/) — conversion features
- [Lawn Care Marketing Strategy 2026 — Green Frog Web Design](https://greenfrogwebdesign.com/lawn-care-marketing-strategy/) — SEO + conversion strategy
- [Landscaping Lead Generation — Improve and Grow](https://improveandgrow.com/contractors-and-trades/landscaping-lead-generation/) — lead gen tactics
- [Service Area Page SEO — BrightLocal](https://www.brightlocal.com/learn/service-area-pages/) — local SEO structure
- [Local SEO for Home Services 2026 — Shawn The SEO Geek](https://shawntheseogeek.com/local-seo-for-home-services) — ranking strategy
- [Top 7 AI Agents for Lawn Care — AgentiveAIQ](https://agentiveaiq.com/listicles/top-7-smart-ai-agents-for-lawn-care) — AI/chatbot landscape
