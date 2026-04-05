# Phase 4: React Islands + Integrations - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

A visitor can submit a quote request form (lead delivered to GHL), navigate the site on mobile via the hamburger drawer, and optionally speak with Vivian the AI assistant — all three React islands work without crashing the static build. Covers CONV-03, VAPI-01 through VAPI-04.

</domain>

<decisions>
## Implementation Decisions

### Contact Form (React Island — client:load)
- Form fields: Name, Address, Phone, Service Requested (dropdown)
- Validation: Client-side with inline error messages (red text below each field)
- Success state: Replace form with "Thank you! We'll be in touch within 24 hours" + green checkmark
- GHL webhook failure: Show error message "Something went wrong. Please call us at (314) 497-6152" with click-to-call link
- Submit button: Redbird red, "Get a Free Quote" text, disabled state while submitting
- Service dropdown options: Weekly Mowing, Trimming, Mulch & Bed Maintenance, Seasonal Cleanup, Other

### Mobile Nav (React Island — client:load)
- Drawer direction: Slide from right with dark semi-transparent backdrop
- Hamburger icon: 3-line icon in header, transforms to X when open
- Nav items match desktop: Services, About, Reviews, Contact (anchor links)
- Close on: backdrop click, X button, or nav link click
- Body scroll: Lock when drawer is open

### VAPI Voice Widget (React Island — client:only="react")
- Position: Bottom-right floating button, fixed position
- Visual style: Redbird red circle (#C41E3A) with phone/microphone icon, subtle pulse animation when idle
- Call state: Expand to small panel showing "Speaking with Vivian..." + waveform indicator + end call button
- Mic denied fallback: Friendly message "Please enable your microphone to speak with Vivian" + "Or call us instead" with click-to-call link to (314) 497-6152
- Hydration: client:only="react" — NEVER SSR (WebRTC APIs don't exist in Node)
- CSP: Must add 'unsafe-eval' to Content-Security-Policy headers for VAPI SDK
- SDK: @vapi-ai/web@2.5.2 (exact pin, no caret)
- Assistant ID: Use PUBLIC_VAPI_ASSISTANT_ID from environment or constants

### Claude's Discretion
- React component internal state management (useState vs useReducer)
- Form field order and layout (single column vs two-column on desktop)
- Exact animation timing for drawer open/close
- VAPI event handler implementation details
- Error boundary placement and fallback UI

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/lib/constants.ts — NAP data (phone, phoneHref, email, services array, serviceArea)
- src/components/astro/SectionWrapper.astro — scroll animation wrapper
- src/styles/global.css — @theme color tokens (redbird-red, forest-green, etc.)

### Established Patterns
- Astro components for static content, React only for interactive islands
- client:load for above-fold interactive (Header mobile nav)
- client:only="react" for browser-only APIs (VAPI WebRTC)
- Tailwind utility classes for styling
- Constants imported from lib/constants.ts

### Integration Points
- src/pages/index.astro — #contact section placeholder needs ContactForm island
- Header.astro — mobile hamburger button needs MobileNav React island
- Layout.astro — VAPI widget goes before closing </body>
- public/_headers — CSP headers for Cloudflare Pages

</code_context>

<specifics>
## Specific Ideas

- GHL webhook URL needs to be configured — use environment variable or constants.ts
- VAPI widget must be tested with HTTPS (WebRTC requires secure context)
- Mobile nav should reuse the same nav items as desktop Header
- Contact form section should match the #contact anchor from Hero CTA

</specifics>

<deferred>
## Deferred Ideas

- Form analytics/conversion tracking — v2 (V2-ANLYT-03)
- reCAPTCHA or spam protection — evaluate post-launch based on spam volume
- Multi-step form wizard — overkill for 4 fields

</deferred>
