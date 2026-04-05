# Phase 3: Static Content + Visual — Research

**Researched:** 2026-04-05
**Domain:** Astro 6 component authoring, Tailwind 4 theming, CSS-only scroll animations, responsive images
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Visual Design & Color**
- Primary "Redbird red" accent: `#C41E3A` (cardinal red)
- Green palette: `#1a472a` dark forest, `#2d6a4f` mid green, `#52b788` light green
- Neutral tones: whites, light grays for backgrounds, dark grays (`#1a1a2e` or similar) for text
- Dark mode: Subtle — dark gray backgrounds, muted greens, red accent stays vibrant
- Hero background: Gradient overlay on solid color with geometric/organic shapes — no stock photos

**Content & Copy**
- Testimonials: Placeholder structure with realistic names and realistic-sounding content. Mark clearly in code as placeholders.
- Service descriptions: Detailed bullet lists per service (e.g., "Mow, edge, blow, bag clippings") — competitor gap
- About section: First-person from Alberto's perspective — "I started Redbird because..." — authentic, personal, local connection
- Footer: Full density — NAP, email, Facebook link, service area cities list, quick nav links

**Animation & Interaction**
- Scroll animations: Fade-up with 20px translateY, 0.6s duration, staggered delays per section
- Animation trigger: IntersectionObserver at 15% threshold
- Button hover: Scale 1.02 + shadow lift + color darken
- Service card hover: Subtle border glow + slight lift (translateY -2px)
- All animations via CSS transitions + Intersection Observer — no JS animation libraries (budget: <80KB JS)

**Semantic HTML (SEO-04)**
- H1: "Expert Residential Lawn Care in Wentzville, MO" — one per page, in Hero
- H2: Section headings (Services, About, Testimonials, Contact)
- H3: Individual service names, testimonial attributions
- No skipped heading levels

### Claude's Discretion
- Exact component file organization (components/sections/ vs components/ui/)
- CSS class naming patterns (all Tailwind utility, no custom classes unless needed)
- Intersection Observer implementation details (single observer vs per-section)
- Responsive breakpoints beyond Tailwind defaults
- Exact spacing/padding values between sections

### Deferred Ideas (OUT OF SCOPE)
- Before/after photo gallery — needs real photos from Alberto (v2)
- FAQ section — v1.1
- Service area city-specific landing pages — v2 multi-page architecture
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Hero section with H1 "Expert Residential Lawn Care in Wentzville, MO" and subheadline | Hero.astro pattern, semantic HTML hierarchy |
| CONT-02 | Trust bar with "Locally Owned & Operated", "Fully Insured", "5-Star Rated" | TrustBar.astro component, simple Astro pattern |
| CONT-03 | Services section with 4 cards with detailed descriptions | ServiceCard.astro + Services.astro composition pattern |
| CONT-04 | About section featuring Alberto Murillo with photo and Wentzville community connection | astro:assets Image component, responsive image patterns |
| CONT-05 | Testimonials section with minimum 3 customer reviews with names | Testimonials.astro, placeholder content structure |
| CONT-06 | Footer with NAP, email, Facebook link, and sitemap link | constants.ts imports, Footer.astro pattern |
| CONV-01 | Primary CTA "Get a Free Quote" button in hero linking to contact form | Anchor link to #contact section, button component |
| CONV-02 | Click-to-call button for (314) 497-6152 in header and hero | NAP.phoneHref from constants.ts, `<a href="tel:...">` |
| CONV-04 | Response time promise displayed near form ("We respond within 24 hours") | Inline copy near CTA area |
| CONV-05 | Sticky mobile header with phone number visible at all times | Tailwind `sticky top-0 z-50`, mobile-specific show/hide |
| VISL-01 | Professional color palette with Redbird red accent against greens, whites, dark grays | Tailwind 4 @theme directive, CSS custom properties |
| VISL-02 | Scroll-triggered fade-in/slide-up animations via CSS + Intersection Observer | IntersectionObserver vanilla JS (~10 lines), animations.css |
| VISL-03 | Subtle hover effects on buttons, service cards, and interactive elements | Tailwind transition/hover utilities |
| VISL-04 | Dark mode support via Tailwind dark mode classes | @variant dark syntax, class-based toggle |
| SEO-04 | Semantic HTML (proper H1, H2, H3 hierarchy) | One H1 in Hero, H2 per section, H3 per service/testimonial |
</phase_requirements>

---

## Summary

Phase 3 converts the scaffold `index.astro` (currently a single H1 placeholder) into a complete single-page experience. All new components are Astro components (`.astro`) producing zero JavaScript — the only JS is a ~10-line vanilla IntersectionObserver script injected as a bare `<script>` tag in the existing `Layout.astro`. React islands are explicitly out of scope for this phase.

The project's technical foundation (Astro 6.1.3, Tailwind 4.2.2, constants.ts NAP data, Layout.astro shell) is already in place from Phases 1 and 2. Phase 3 is entirely additive: create new component files, wire them into `index.astro`, and add color/animation CSS to `global.css`.

One important finding: the `global.css` currently uses `@variant dark (&:is(.dark *))`. This is confirmed valid in Tailwind 4 — it auto-upgrades to `@custom-variant` internally. Color tokens must be defined via `@theme { --color-*: ... }` in `global.css`, not a `tailwind.config.ts` (which is irrelevant for Tailwind 4).

**Primary recommendation:** Build components bottom-up (SectionWrapper → leaf components → section composites → Header → index.astro), with the animation CSS and color @theme tokens in global.css landing in Wave 1 before any component references them.

---

## Standard Stack

### Core — Already Installed

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `astro` | 6.1.3 (pinned) | Static site framework, component authoring | Installed |
| `tailwindcss` | 4.2.2 | Utility CSS, theming, dark mode | Installed |
| `@tailwindcss/vite` | 4.2.2 | Vite plugin for Tailwind 4 | Installed |
| `sharp` | ^0.34.5 | Astro image processing (WebP/AVIF conversion) | Installed |
| `lucide-react` | ^1.7.0 | Icon library for service cards (static SVG import) | Installed |

### No Additional Installs Required

All libraries needed for Phase 3 are already in `package.json`. Phase 3 is a file-authoring phase, not a dependency-installation phase.

**Installation:** None needed.

**Version verification:** Confirmed from `package.json` — no drift.

---

## Architecture Patterns

### Recommended Project Structure

Following `.planning/research/ARCHITECTURE.md` exactly:

```
src/
├── assets/
│   └── images/
│       ├── alberto-murillo.jpg   # About section photo (placeholder until Alberto provides)
│       └── hero-bg.jpg           # Optional hero background (may use CSS gradient only)
│
├── components/
│   ├── astro/                    # All Phase 3 components live here
│   │   ├── SectionWrapper.astro  # data-animate wrapper — build first
│   │   ├── Header.astro          # Sticky header with click-to-call
│   │   ├── Hero.astro            # H1, subheadline, CTA, trust signals
│   │   ├── TrustBar.astro        # "Locally Owned | Fully Insured | 5-Star Rated"
│   │   ├── Services.astro        # Grid layout, composes ServiceCard
│   │   ├── ServiceCard.astro     # Single service: icon + name + bullet list
│   │   ├── About.astro           # Alberto photo + bio + local connection
│   │   ├── Testimonials.astro    # 3 placeholder reviews with names
│   │   └── Footer.astro          # NAP + email + Facebook + service area cities
│   │
│   ├── react/                    # Untouched in Phase 3
│   └── seo/                      # Untouched in Phase 3
│
├── styles/
│   ├── global.css                # Add @theme colors + animation CSS here
│   └── animations.css            # Optional: split animation rules here
│
└── pages/
    └── index.astro               # Compose all section components
```

### Pattern 1: Astro Component with Constants Import

All content components import from `constants.ts` — never re-type NAP data.

```astro
---
// src/components/astro/Footer.astro
import { NAP, SOCIAL } from '../../lib/constants';
---
<footer>
  <address>
    <span>{NAP.name}</span>
    <a href={NAP.phoneHref}>{NAP.phone}</a>
    <span>{NAP.email}</span>
    <span>{NAP.address.city}, {NAP.address.state} {NAP.address.zip}</span>
  </address>
  <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
</footer>
```

### Pattern 2: Tailwind 4 Color Token Definition

Color tokens are defined with `@theme` in `global.css`. This creates corresponding Tailwind utility classes (`bg-redbird-red`, `text-forest-green`, etc.).

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Redbird brand colors */
  --color-redbird-red: #C41E3A;
  --color-forest-green: #1a472a;
  --color-mid-green: #2d6a4f;
  --color-light-green: #52b788;
  --color-dark-bg: #1a1a2e;

  /* Font families (CSS custom properties set by Astro Fonts API) */
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}

/* Dark mode variant — @variant auto-upgrades to @custom-variant internally */
@variant dark (&:is(.dark *));
```

**Source:** [Tailwind CSS Theme Variables docs](https://tailwindcss.com/docs/theme) — HIGH confidence

### Pattern 3: Scroll Animation — CSS + IntersectionObserver

This is the approved approach from CONTEXT.md. Costs ~0.2KB JS.

**Step 1 — animations.css rules:**

```css
/* src/styles/animations.css (or in global.css) */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-animate].in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered delays for child elements */
[data-animate-delay="100"] { transition-delay: 100ms; }
[data-animate-delay="200"] { transition-delay: 200ms; }
[data-animate-delay="300"] { transition-delay: 300ms; }
[data-animate-delay="400"] { transition-delay: 400ms; }
```

**Step 2 — SectionWrapper.astro:**

```astro
---
// src/components/astro/SectionWrapper.astro
interface Props {
  class?: string;
  delay?: number;
}
const { class: className = '', delay } = Astro.props;
---
<div
  data-animate
  data-animate-delay={delay}
  class={className}
>
  <slot />
</div>
```

**Step 3 — Vanilla JS in Layout.astro (add before closing `</body>`):**

```astro
<!-- Add to Layout.astro body -->
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el);
  });
</script>
```

**Why single observer:** One IntersectionObserver instance watching all `[data-animate]` elements is more efficient than per-component observers. Astro bundles the bare `<script>` tag once.

### Pattern 4: Sticky Header with Tailwind

```astro
---
// src/components/astro/Header.astro
import { NAP } from '../../lib/constants';
---
<header class="sticky top-0 z-50 bg-white dark:bg-dark-bg shadow-sm">
  <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
    <!-- Logo / brand name -->
    <span class="font-heading font-bold text-xl text-forest-green dark:text-light-green">
      {NAP.name}
    </span>
    <!-- Click-to-call — always visible on mobile -->
    <a
      href={NAP.phoneHref}
      class="flex items-center gap-2 bg-redbird-red text-white px-4 py-2 rounded-full font-semibold text-sm hover:scale-[1.02] transition-transform"
      aria-label={`Call ${NAP.name}`}
    >
      📞 {NAP.phone}
    </a>
  </div>
</header>
```

**Key Tailwind classes:** `sticky top-0 z-50` — positions header as sticky, keeps it above all content. `bg-white` required on the sticky header or content scrolls through it visibly.

**Source:** [Tailwind CSS position docs](https://tailwindcss.com/docs/position) — HIGH confidence

### Pattern 5: astro:assets Image Component for About Section

```astro
---
// src/components/astro/About.astro
import { Image } from 'astro:assets';
// Placeholder until Alberto provides real photo:
import albertoPhoto from '../../assets/images/alberto-murillo.jpg';
---
<section id="about">
  <Image
    src={albertoPhoto}
    alt="Alberto Murillo, owner of Redbird Lawn Care Service in Wentzville, MO"
    width={400}
    height={500}
    loading="lazy"
    decoding="async"
    class="rounded-lg object-cover w-full max-w-sm"
  />
</section>
```

**Important:** `sharp` is already installed (`^0.34.5`) — required for Astro to process images to WebP/AVIF at build time. No additional setup needed.

**Placeholder strategy:** Until Alberto provides a real photo, use a CSS-only placeholder div with initials "AM" and the brand green background. This avoids a missing-asset build failure.

```astro
<!-- Placeholder when no real photo available -->
<div
  class="w-48 h-48 rounded-full bg-forest-green flex items-center justify-center text-white text-4xl font-bold"
  aria-label="Alberto Murillo"
>
  AM
</div>
```

### Pattern 6: Dark Mode Implementation

The existing `global.css` already has `@variant dark (&:is(.dark *))` — confirmed valid. Dark mode activates when a `.dark` class is on an ancestor element (typically `<html>`).

Apply dark mode classes using the `dark:` prefix on any element:

```astro
<section class="bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100">
  ...
</section>
```

For the initial page load, default to light mode. Dark mode toggle (if desired) requires adding/removing `class="dark"` on `<html>` — this can be a Phase 3 enhancement or deferred. Phase 3 requirement VISL-04 requires dark mode *support*, not a toggle UI.

**Minimum viable VISL-04 compliance:** Add all `dark:` utility variants to components. The `.dark` class can be manually applied to `<html>` for testing. Full toggle UI is discretionary.

### Pattern 7: ServiceCard with Lucide Icon

`lucide-react` is installed but Astro recommends using static SVG imports for zero-JS icon usage. In Astro components (not React), lucide-react icons can be imported as React components only if rendered inside a React island. For static Astro components, use inline SVG or a dedicated Astro icon library.

**Recommended approach for Phase 3:** Use inline SVG strings for the 4 service icons to keep the components zero-JS. Lucide SVG paths are available from the lucide.dev icon library. This avoids loading the React runtime just for icons in a static section.

```astro
---
// src/components/astro/ServiceCard.astro
interface Props {
  title: string;
  description: string;
  includes: string[];
  icon: string; // inline SVG string or emoji as fallback
}
const { title, description, includes, icon } = Astro.props;
---
<article class="
  rounded-xl border border-gray-200 dark:border-gray-700
  p-6 bg-white dark:bg-gray-800
  hover:border-redbird-red hover:-translate-y-0.5
  transition-all duration-200 cursor-default
">
  <div class="text-3xl mb-4" aria-hidden="true" set:html={icon}></div>
  <h3 class="font-heading font-semibold text-xl text-forest-green dark:text-light-green mb-2">
    {title}
  </h3>
  <p class="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
  <ul class="space-y-1 text-sm text-gray-500 dark:text-gray-400">
    {includes.map((item) => (
      <li class="flex items-start gap-2">
        <span class="text-redbird-red mt-0.5">✓</span>
        {item}
      </li>
    ))}
  </ul>
</article>
```

### Anti-Patterns to Avoid

- **Using lucide-react in .astro files (non-island):** Importing React components into Astro components works at build time but ships the React runtime unnecessarily — or breaks with a hydration mismatch. Use inline SVG for static Astro components.
- **Hardcoding NAP data in components:** All phone numbers, addresses, and business names MUST come from `constants.ts`. Never type `(314) 497-6152` in a component file.
- **Skipping H2 headings on sections:** Every section needs an H2 (not H3) as its heading. Skipping heading levels breaks SEO-04.
- **Using `position: fixed` for the header instead of `sticky`:** `fixed` removes the element from flow, causing the first section to slide under it unless you add padding to `<body>`. `sticky top-0` keeps the header in flow until it reaches the scroll threshold.
- **Applying `@theme` font tokens that conflict with Astro Fonts API:** The Astro Fonts API injects `--font-heading` and `--font-body` CSS variables directly. Do not redeclare these in `@theme` or you'll override the injected values. Keep them in `:root` as-is.
- **Missing `alt` on `<Image>` component:** Astro enforces this at build time — a missing `alt` prop causes a build error.
- **Placeholder testimonials that look real:** Must be visually marked as placeholder (e.g., `{/* PLACEHOLDER: Replace with real review */}` comment AND a visible "Example Review" label in dev, or a commented-out flag). CONT-05 says 3 real reviews — if not available at phase start, create placeholders but document clearly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization (WebP/AVIF) | Custom resize/convert scripts | `<Image>` from `astro:assets` | Automatic srcset, lazy loading, format conversion at build time; `sharp` already installed |
| CSS variable generation for colors | Manual `:root { --my-color }` | `@theme { --color-* }` in global.css | Auto-generates bg-*, text-*, border-* utility classes for free |
| Scroll animations | JS animation library (AOS, Framer Motion) | CSS transitions + IntersectionObserver | Libraries cost 30-100KB+ JS; violates 80KB budget |
| Click-to-call link | Custom component | `<a href="tel:+13144976152">` with `NAP.phoneHref` | Native HTML, works on all mobile devices without JS |

**Key insight:** In Astro static sites, the framework already provides image optimization and CSS handles animations. The temptation to reach for npm packages for scroll effects or icon libraries must be resisted — the JS budget is 80KB total.

---

## Common Pitfalls

### Pitfall 1: `@theme` Font Variables Conflict with Astro Fonts API

**What goes wrong:** Developer adds `--font-heading` and `--font-body` to `@theme` block in global.css, overriding the values injected by Astro Fonts API at build time. Result: fonts load as system-ui fallback.

**Why it happens:** `@theme` variables are declared at CSS parse time; Astro Fonts API injects after. If both declare the same variable, last-write wins — and the order is unpredictable.

**How to avoid:** Never put `--font-heading` or `--font-body` inside `@theme`. Leave the existing `:root { font-family: var(--font-body) }` and heading rules in global.css exactly as-is. Only add `--color-*` tokens to `@theme`.

**Warning signs:** H1 renders in system-ui sans-serif instead of Space Grotesk.

### Pitfall 2: Sticky Header Causes Content to Render Under It

**What goes wrong:** The sticky header floats over the first section (Hero), hiding the top of the content when the page loads.

**Why it happens:** `sticky` removes the element from normal stacking but keeps it in flow. If the Hero section starts at the very top and the header is taller than expected, the hero content begins behind the header.

**How to avoid:** The header renders naturally in the document flow — the Hero section starts below it. Since `sticky` is in-flow, there is no gap unless `position: fixed` is accidentally used. Confirm by checking `position` in DevTools.

**Warning signs:** H1 text is clipped when navigating to `#about` anchor — means the anchor scroll position doesn't account for sticky header height. Fix with `scroll-margin-top` CSS on section IDs:

```css
section[id] {
  scroll-margin-top: 72px; /* match header height */
}
```

### Pitfall 3: `data-animate` Elements Start Invisible (JS Disabled or Slow)

**What goes wrong:** `[data-animate]` CSS sets `opacity: 0`. If the IntersectionObserver script hasn't run yet (slow JS parse) or JS is disabled, all animated sections are invisible.

**Why it happens:** CSS applies immediately; JS fires after parse. There is a brief window where content is invisible.

**How to avoid:** Wrap the `[data-animate]` CSS in a `@media (prefers-reduced-motion: no-preference)` block, and add a fallback for `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-animate] {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  [data-animate].in-view {
    opacity: 1;
    transform: translateY(0);
  }
}
```

This also satisfies PERF-03 (Accessibility score 95+) — respecting `prefers-reduced-motion` is an a11y requirement.

**Warning signs:** Lighthouse Accessibility audit flags "content not visible without animations."

### Pitfall 4: `<Image>` Build Failure Without Asset File

**What goes wrong:** `About.astro` imports `alberto-murillo.jpg` from `src/assets/images/`. If the file doesn't exist, `astro build` fails with a module-not-found error.

**Why it happens:** Astro processes local image imports at build time. A missing file is a fatal error.

**How to avoid:** Until Alberto provides a real headshot, use the CSS placeholder pattern (initials div) instead of an `<Image>` import. Add a `// TODO: Replace with real photo` comment.

### Pitfall 5: Testimonial Section Violates Trust if Obviously Fake

**What goes wrong:** Placeholder reviews with generic names ("John D.", "Happy Customer") undermine the exact competitive advantage Redbird is trying to win (real reviews vs. competitors who have none).

**Why it happens:** Developer creates placeholder content, site launches before Alberto swaps in real reviews.

**How to avoid:** Use realistic-sounding placeholder names and review text as specified in CONTEXT.md, AND add a visible placeholder warning in the component that can be toggled with a `PLACEHOLDER_REVIEWS` boolean:

```astro
---
const PLACEHOLDER_REVIEWS = true; // Set to false when real reviews are added
---
{PLACEHOLDER_REVIEWS && (
  <div class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 text-sm mb-4 rounded">
    ⚠️ PLACEHOLDER — Replace with real customer reviews before launch
  </div>
)}
```

This warning only shows in the actual HTML — remove or toggle off before deploying to production.

### Pitfall 6: Dark Mode Not Activating Without `.dark` Class Toggle

**What goes wrong:** `dark:` utility classes are applied correctly but dark mode never activates. Developer sees only light mode.

**Why it happens:** The `@variant dark (&:is(.dark *))` pattern requires a `.dark` class on an ancestor element. Without a JS toggle or manual `<html class="dark">`, the dark mode styles never fire.

**How to avoid:** For Phase 3 testing, manually add `class="dark"` to the `<html>` tag in `Layout.astro` to verify dark mode styles. Remove before final review. A permanent dark mode toggle can be added as a discretionary enhancement.

---

## Code Examples

### Complete global.css with @theme Color Tokens

```css
/* src/styles/global.css */
@import "tailwindcss";

/* Redbird brand color tokens — auto-generate bg-*, text-*, border-* utilities */
@theme {
  --color-redbird-red: #C41E3A;
  --color-forest-green: #1a472a;
  --color-mid-green: #2d6a4f;
  --color-light-green: #52b788;
  --color-dark-bg: #1a1a2e;
  --color-dark-surface: #252542;
}

/* Font families — injected by Astro Fonts API; do NOT redeclare in @theme */
:root {
  font-family: var(--font-body, system-ui, sans-serif);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading, system-ui, sans-serif);
}

/* Anchor scroll offset for sticky header */
section[id] {
  scroll-margin-top: 72px;
}

/* Dark mode variant — @variant auto-upgrades to @custom-variant internally */
@variant dark (&:is(.dark *));

/* Scroll animations — respects reduced motion preference */
@media (prefers-reduced-motion: no-preference) {
  [data-animate] {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  [data-animate].in-view {
    opacity: 1;
    transform: translateY(0);
  }

  [data-animate-delay="100"] { transition-delay: 100ms; }
  [data-animate-delay="200"] { transition-delay: 200ms; }
  [data-animate-delay="300"] { transition-delay: 300ms; }
  [data-animate-delay="400"] { transition-delay: 400ms; }
}
```

### Hero.astro Structure

```astro
---
// src/components/astro/Hero.astro
import { NAP } from '../../lib/constants';
---
<section class="relative bg-forest-green dark:bg-dark-bg overflow-hidden py-20 px-4">
  <!-- Geometric background shapes (CSS-only, no images) -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-0 right-0 w-96 h-96 bg-light-green rounded-full translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-mid-green rounded-full -translate-x-1/3 translate-y-1/3"></div>
  </div>

  <div class="relative max-w-4xl mx-auto text-center">
    <h1 class="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
      Expert Residential Lawn Care in Wentzville, MO
    </h1>
    <p class="text-lg md:text-xl text-green-100 mb-2">
      Serving Wentzville, O'Fallon, Lake Saint Louis, Troy &amp; Foristell
    </p>
    <p class="text-sm text-green-200 mb-8">We respond within 24 hours</p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <!-- Primary CTA -->
      <a
        href="#contact"
        class="bg-redbird-red text-white px-8 py-4 rounded-full font-semibold text-lg
               hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
      >
        Get a Free Quote
      </a>
      <!-- Click-to-call -->
      <a
        href={NAP.phoneHref}
        class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg
               hover:bg-white hover:text-forest-green transition-all duration-200"
        aria-label={`Call ${NAP.name} at ${NAP.phone}`}
      >
        {NAP.phone}
      </a>
    </div>
  </div>
</section>
```

### IntersectionObserver Script for Layout.astro

```astro
<!-- Add inside <body> in Layout.astro, before </body> -->
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el);
  });
</script>
```

### Updated index.astro Composition

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/astro/Header.astro';
import Hero from '../components/astro/Hero.astro';
import TrustBar from '../components/astro/TrustBar.astro';
import Services from '../components/astro/Services.astro';
import About from '../components/astro/About.astro';
import Testimonials from '../components/astro/Testimonials.astro';
import Footer from '../components/astro/Footer.astro';
---
<Layout>
  <Header />
  <main>
    <Hero />
    <TrustBar />
    <Services />
    <About />
    <Testimonials />
    <!-- Phase 4: ContactForm island goes here as id="contact" -->
    <div id="contact" class="py-20 px-4 text-center text-gray-500">
      Contact form coming in Phase 4
    </div>
  </main>
  <Footer />
</Layout>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` darkMode: 'class' | `@custom-variant dark` in CSS (or `@variant` which auto-upgrades) | Tailwind 4.0 (2025) | No config file needed; all config lives in CSS |
| `@theme inline` | Standard `@theme` (without `inline` keyword) | Tailwind 4.x discussion | `inline` was an experimental syntax; plain `@theme` is canonical |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` under `vite.plugins` | Tailwind 4.0 (already in this project) | Correctly configured in Phase 1 |
| `<img>` with manual srcset | `<Image>` from `astro:assets` with `layout` prop | Astro 4+ | Automatic srcset, AVIF/WebP at build time |
| `@astrojs/image` package | `astro:assets` (built-in) | Astro 3.0 | No separate install; `sharp` is the only dep |

**Deprecated/outdated in this project:**
- `tailwind.config.ts` — irrelevant for Tailwind 4; already absent from project structure
- `@astrojs/tailwind` — deprecated; already using `@tailwindcss/vite` correctly

---

## Open Questions

1. **Alberto's headshot availability**
   - What we know: STATE.md explicitly flags this as a blocker: "Alberto's headshot and 3+ real Google review text must be available before Phase 3 begins. Confirm assets."
   - What's unclear: Whether assets will be available when Phase 3 tasks execute
   - Recommendation: Build the About section with a CSS placeholder (initials circle) and a `TODO` comment. Swap in `<Image>` import when real photo arrives. This unblocks Phase 3 execution.

2. **Real testimonial reviews availability**
   - What we know: STATE.md flags this. CONT-05 requires minimum 3 real reviews with names.
   - What's unclear: Whether Alberto has 3 real Google/Facebook reviews to provide
   - Recommendation: Build Testimonials with 3 placeholder reviews marked with `PLACEHOLDER_REVIEWS = true` flag. Requirements traceability marks CONT-05 as "conditional complete" pending real review text. Plan tasks should note this dependency explicitly.

3. **Dark mode toggle UI**
   - What we know: VISL-04 requires dark mode support; CONTEXT.md leaves toggle implementation as Claude's discretion
   - What's unclear: Whether a sun/moon toggle button is wanted in the header
   - Recommendation: Implement full `dark:` coverage on all components (satisfies VISL-04), and add a minimal theme toggle button to the Header. Keep toggle state in `localStorage` using the standard pattern. ~15 lines of vanilla JS in a `<script>` tag on the button — no React island needed.

4. **constants.ts missing data**
   - What we know: `SOCIAL.facebook` is `'[CONFIRM FROM GBP]'` and `address.street` is `'[CONFIRM FROM GBP]'`
   - What's unclear: Whether Alberto has confirmed these values
   - Recommendation: Footer and JSON-LD gracefully handle the placeholder string — it will render literally. Add a visible dev-only warning if the string includes `[CONFIRM`. Does not block Phase 3 but should be flagged.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 22+ | Astro build, sharp image processing | Confirm | engines: >=22.12.0 in package.json | — |
| `sharp` | `<Image>` component WebP/AVIF conversion | Installed | ^0.34.5 | Without sharp, Astro falls back to original format (no optimization) |
| Alberto headshot JPG | `About.astro` `<Image>` component | Unknown — flagged as blocker | — | CSS initials placeholder |
| Real customer reviews | CONT-05 | Unknown — flagged as blocker | — | Placeholder reviews with toggle flag |

**Missing dependencies with no fallback:**
- None that block build execution.

**Missing dependencies with fallback:**
- Alberto's headshot: CSS placeholder unblocks execution
- Real reviews: Placeholder content with `PLACEHOLDER_REVIEWS` flag unblocks execution

---

## Sources

### Primary (HIGH confidence)
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) — Image component API, `<Picture>` usage, astro:assets patterns
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme) — `@theme` directive syntax for custom color tokens
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark` class strategy syntax
- [Tailwind CSS Position](https://tailwindcss.com/docs/position) — `sticky top-0 z-50` pattern

### Secondary (MEDIUM confidence)
- [Tailwind @variant vs @custom-variant Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/18976) — Confirmed `@variant` auto-upgrades to `@custom-variant`; existing `global.css` is valid
- [Dark mode using Tailwindcss v4.0 — DEV Community](https://dev.to/tene/dark-mode-using-tailwindcss-v40-2lc6) — Class-based dark mode implementation pattern
- [Configuring Tailwind CSS v4.0 — Bryan Anthonio](https://bryananthonio.com/blog/configuring-tailwind-css-v4/) — @theme color setup walkthrough

### Tertiary (LOW confidence — patterns verified by inspection)
- IntersectionObserver scroll animation pattern — verified against MDN + Astro architecture doc consensus
- Placeholder photo CSS circle pattern — standard HTML/CSS pattern, no source needed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies confirmed in package.json
- Architecture: HIGH — follows ARCHITECTURE.md exactly; patterns verified against official docs
- Color/theme tokens: HIGH — verified against Tailwind 4 official docs
- Scroll animation: HIGH — confirmed vanilla JS approach in project ARCHITECTURE.md, MDN-level pattern
- Dark mode: HIGH — confirmed @variant validity from Tailwind GitHub discussion
- Pitfalls: MEDIUM — some pitfalls (e.g., font variable conflict) are inferred from framework behavior; not a documented official pitfall

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable stack; Tailwind 4 and Astro 6 are not fast-moving at patch level)
