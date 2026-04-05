# Phase 4: React Islands + Integrations — Research

**Researched:** 2026-04-05
**Domain:** React islands in Astro 6 — VAPI WebRTC widget, GHL webhook form, mobile nav drawer
**Confidence:** HIGH (VAPI SDK verified against GitHub README; Astro client directives verified against official docs; Cloudflare _headers verified against CF docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Contact Form (React Island — client:load)**
- Form fields: Name, Address, Phone, Service Requested (dropdown)
- Validation: Client-side with inline error messages (red text below each field)
- Success state: Replace form with "Thank you! We'll be in touch within 24 hours" + green checkmark
- GHL webhook failure: Show error message "Something went wrong. Please call us at (314) 497-6152" with click-to-call link
- Submit button: Redbird red, "Get a Free Quote" text, disabled state while submitting
- Service dropdown options: Weekly Mowing, Trimming, Mulch & Bed Maintenance, Seasonal Cleanup, Other

**Mobile Nav (React Island — client:load)**
- Drawer direction: Slide from right with dark semi-transparent backdrop
- Hamburger icon: 3-line icon in header, transforms to X when open
- Nav items match desktop: Services, About, Reviews, Contact (anchor links)
- Close on: backdrop click, X button, or nav link click
- Body scroll: Lock when drawer is open

**VAPI Voice Widget (React Island — client:only="react")**
- Position: Bottom-right floating button, fixed position
- Visual style: Redbird red circle (#C41E3A) with phone/microphone icon, subtle pulse animation when idle
- Call state: Expand to small panel showing "Speaking with Vivian..." + waveform indicator + end call button
- Mic denied fallback: Friendly message "Please enable your microphone to speak with Vivian" + "Or call us instead" with click-to-call link to (314) 497-6152
- Hydration: client:only="react" — NEVER SSR (WebRTC APIs do not exist in Node)
- CSP: Must add the unsafe-eval keyword to Content-Security-Policy script-src for VAPI SDK
- SDK: @vapi-ai/web@2.5.2 (exact pin, no caret)
- Assistant ID: Use PUBLIC_VAPI_ASSISTANT_ID from environment or constants

### Claude's Discretion
- React component internal state management (useState vs useReducer)
- Form field order and layout (single column vs two-column on desktop)
- Exact animation timing for drawer open/close
- VAPI event handler implementation details
- Error boundary placement and fallback UI

### Deferred Ideas (OUT OF SCOPE)
- Form analytics/conversion tracking — v2 (V2-ANLYT-03)
- reCAPTCHA or spam protection — evaluate post-launch based on spam volume
- Multi-step form wizard — overkill for 4 fields
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONV-03 | Lead capture form (Name, Address, Phone, Service Requested) posting to GHL webhook | GHL accepts POST JSON; field names are flexible; CORS is unverified — proxy strategy documented |
| VAPI-01 | VAPI widget (Vivian) integrated as floating button using @vapi-ai/web 2.5.2 | SDK API verified: `new Vapi(key)`, `vapi.start(assistantId)`, `vapi.stop()`, all event names confirmed |
| VAPI-02 | Widget rendered via client:only="react" (never SSR) | Astro docs confirmed: client:only skips server rendering entirely; no HTML until client JS loads |
| VAPI-03 | Microphone permission handling with graceful error states | `vapi.on('error', handler)` catches mic denied; try/catch around vapi.start() required |
| VAPI-04 | CSP headers configured with the unsafe-eval keyword for VAPI SDK | Cloudflare _headers file format verified; required for Daily.co WebRTC layer used internally by VAPI |
</phase_requirements>

---

## Summary

Phase 4 introduces three React islands into an otherwise zero-JS Astro 6 static site. The islands are isolated by design: MobileNav and ContactForm use `client:load` (Astro generates placeholder HTML on the server, React hydrates on page load), while VAPIWidget uses `client:only="react"` (no server rendering at all — essential because WebRTC APIs crash in Node.js).

The VAPI SDK API is well-documented and verified: `new Vapi(publicKey)` initializes the client, `vapi.start(assistantId)` begins a call, and event listeners handle the call lifecycle (`call-start`, `call-end`, `error`, `volume-level`). The SDK must be initialized inside a `useEffect` hook (never at module scope) with the instance stored in `useRef` to survive re-renders without reinitializing.

The biggest operational unknown is GHL webhook CORS behavior. GHL documentation does not confirm CORS support for browser-side fetch calls. The safe approach is to probe the real webhook URL from the browser before building the form — if the preflight succeeds, proceed with direct fetch. If not, a Cloudflare Worker proxy is the ready fallback. The contact form must always show the phone number fallback on any fetch error regardless — this is a locked decision.

**Primary recommendation:** Build the three islands in order (MobileNav first, ContactForm second, VAPIWidget last). Confirm GHL webhook URL is provisioned and test CORS behavior before writing the ContactForm submit handler. Provision VAPI credentials before testing VAPIWidget end-to-end.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @vapi-ai/web | 2.5.2 (exact pin) | VAPI SDK for voice calls | Low-level web SDK with full lifecycle control; no React wrapper overhead. Already in package.json. |
| react | 19.2.4 | React island runtime | Already installed; Astro 6 + @astrojs/react provides the runtime. |
| react-dom | 19.2.4 | DOM renderer | Already installed. |
| lucide-react | ^1.7.0 | Icons (Phone, Menu, X, Mic) | Already installed; per-icon tree-shaking keeps bundle minimal. |

### No New Packages Needed

All required packages are already present in `package.json`. Phase 4 requires zero new npm installs.

**Confirmed installed packages:**
```json
"@vapi-ai/web": "2.5.2",
"react": "19.2.4",
"react-dom": "19.2.4",
"lucide-react": "^1.7.0",
"@astrojs/react": "^5.0.2"
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @vapi-ai/web (direct) | @vapi-ai/client-sdk-react | React SDK is a wrapper around the web SDK; adds bundle weight without benefit for a single floating widget |
| Inline scroll lock (useEffect + overflow) | body-scroll-lock npm package | 10-line inline pattern achieves the same result; no package justified |
| Cloudflare Worker CORS proxy | External proxy service (Cloudflare, etc.) | CF Worker is free, co-located, minimal latency, zero additional accounts |

---

## Architecture Patterns

### Integration Points (Pre-Wired in Phase 3)

The existing codebase already has placeholder slots ready:

| Integration Point | Current State | Phase 4 Action |
|------------------|---------------|---------------|
| `src/pages/index.astro` | `<section id="contact">` with static placeholder text | Replace placeholder content with `<ContactForm client:load />` |
| `src/components/astro/Header.astro` | Desktop nav `hidden md:flex`; no hamburger button exists | Add `<MobileNav client:load />` — component renders its own trigger button |
| `src/layouts/Layout.astro` | `<slot />` then scroll animation script before `</body>` | Add `<VAPIWidget client:only="react" />` after `<slot />` |
| `public/_headers` | Does not exist | Create with CSP including the unsafe-eval keyword |

### New Files to Create

```
src/components/react/
├── MobileNav.tsx        — hamburger trigger + slide-right drawer + body scroll lock
├── ContactForm.tsx      — controlled form, client-side validation, fetch POST to GHL
└── VAPIWidget.tsx       — VAPI floating button, call lifecycle, mic permission handling

public/
└── _headers             — Cloudflare Pages HTTP headers (CSP)
```

---

### Pattern 1: Astro client:load vs client:only="react"

**Behavior comparison:**

| Directive | Server-side HTML? | When JS loads | Use for |
|-----------|-------------------|--------------|---------|
| `client:load` | Yes — Astro generates static HTML | Immediately on page load | MobileNav, ContactForm (graceful without JS) |
| `client:only="react"` | No — nothing rendered server-side | Immediately on page load | VAPIWidget (WebRTC APIs undefined in Node.js) |

**The critical rule for VAPI:** `client:only="react"` is mandatory. `client:load` would have Astro attempt server-rendering, which references `window`, `navigator.mediaDevices`, and `RTCPeerConnection` — all undefined in Node.js. The build crashes or produces a silent runtime hydration failure.

**Usage in .astro files:**

```astro
---
// src/pages/index.astro
import ContactForm from '../components/react/ContactForm';
---
<ContactForm client:load />
```

```astro
---
// src/components/astro/Header.astro
import MobileNav from '../components/react/MobileNav';
---
<MobileNav client:load />
```

```astro
---
// src/layouts/Layout.astro
import VAPIWidget from '../components/react/VAPIWidget';
---
<slot />
<VAPIWidget client:only="react" />
```

**Props passing to client:only components:** Works identically to other hydrated components. Props must be serializable types (strings, numbers, plain objects, arrays, Maps, Sets, Dates). Functions cannot be passed.

---

### Pattern 2: VAPI SDK — Verified API

**Source:** https://github.com/VapiAI/client-sdk-web (README, HIGH confidence)

```typescript
import Vapi from '@vapi-ai/web';

// Constructor — takes public API key as string
const vapi = new Vapi('your-public-key');

// start() — two overloads:
// 1. Assistant ID string (preferred for this project)
vapi.start('your-assistant-id');
// 2. Configuration object (not needed here — Vivian is pre-configured)
vapi.start({ model: { provider: 'openai', model: 'gpt-4o', messages: [...] } });

// stop() — ends call and closes connection
vapi.stop();

// Mute control
vapi.isMuted();         // returns boolean
vapi.setMuted(true);    // mute microphone

// Events — all verified event names:
vapi.on('call-start', () => {});
vapi.on('call-end', () => {});
vapi.on('speech-start', () => {});
vapi.on('speech-end', () => {});
vapi.on('volume-level', (level: number) => {}); // 0.0–1.0
vapi.on('message', (msg) => {});                // transcripts, function calls
vapi.on('error', (error) => {});                // error object
```

**React initialization pattern (useRef + useEffect):**

```typescript
// IMPORTANT: This component MUST use client:only="react" — never client:load
// WebRTC APIs (RTCPeerConnection, navigator.mediaDevices) are browser-only
import { useRef, useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';

type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

export default function VAPIWidget() {
  // useRef stores the instance without triggering re-renders
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [micDenied, setMicDenied] = useState(false);

  useEffect(() => {
    // Initialize INSIDE useEffect — never at module scope
    // client:only="react" guarantees this code only runs in the browser
    const vapi = new Vapi(import.meta.env.PUBLIC_VAPI_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => setStatus('active'));
    vapi.on('call-end', () => { setStatus('idle'); setMicDenied(false); });
    vapi.on('error', (err: unknown) => {
      // Mic permission denied — check both common error shapes defensively
      const errName = (err as any)?.error?.name ?? (err as any)?.name ?? '';
      const isPermissionError =
        errName === 'NotAllowedError' ||
        errName === 'PermissionDeniedError';
      if (isPermissionError) setMicDenied(true);
      setStatus('error');
    });

    // Cleanup on unmount — stop any active call
    return () => { vapi.stop(); };
  }, []); // Empty array — run once on mount only

  const handleToggle = async () => {
    if (status === 'active') {
      vapiRef.current?.stop();
    } else {
      setStatus('connecting');
      setMicDenied(false);
      try {
        await vapiRef.current?.start(import.meta.env.PUBLIC_VAPI_ASSISTANT_ID);
      } catch {
        setStatus('error');
      }
    }
  };

  // ... render floating button with status-driven UI
}
```

**Key rules:**
- `new Vapi()` inside `useEffect`, never at module top level
- Instance stored in `useRef`, not `useState` (refs survive re-renders without triggering them)
- `vapi.stop()` called in `useEffect` cleanup return function
- `try/catch` around `vapi.start()` is required — mic denial surfaces here and/or in the error event

---

### Pattern 3: Contact Form — GHL Webhook

**GHL inbound webhook field format (MEDIUM confidence):**

GHL inbound webhooks accept arbitrary JSON POSTed to the workflow trigger URL. Fields are mapped inside the GHL workflow builder UI — there is no rigid required schema at the API level. The one firm rule: the payload must include `email` or `phone` to allow GHL to find or create a contact record.

**Recommended payload shape:**
```typescript
// GHL Contact object field names (from GHL docs and community examples)
const payload = {
  firstName: formData.name.split(' ')[0],
  lastName: formData.name.split(' ').slice(1).join(' ') || '',
  phone: formData.phone,
  address1: formData.address,
  customData: {
    serviceRequested: formData.service,
    source: 'website-contact-form',
  },
};
```

**Form component state shape:**

```typescript
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  address: string;
  phone: string;
  service: string;
}

interface FieldErrors {
  name?: string;
  address?: string;
  phone?: string;
  service?: string;
}
```

**Submit handler pattern:**

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!validate()) return;

  setStatus('submitting');
  try {
    const response = await fetch(import.meta.env.PUBLIC_GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setStatus('success');
  } catch {
    setStatus('error');
    // Error state renders the phone fallback — locked decision
  }
}
```

**The CORS problem and probe-first strategy:**

GHL webhook documentation contains no mention of CORS. GHL is designed for server-to-server integration. A browser `fetch()` to a cross-origin URL triggers a CORS preflight (`OPTIONS` request). If GHL does not respond with `Access-Control-Allow-Origin`, the browser blocks the request before it reaches GHL.

**Action:** Before writing the ContactForm submit handler, test the real webhook URL directly from a browser console or a minimal HTML test page. This test must happen before the ContactForm submit handler is built, not after.

```javascript
// Run this in browser DevTools console on the deployed site (or localhost)
// to determine if CORS preflight succeeds before building the form:
fetch('PASTE_GHL_WEBHOOK_URL_HERE', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '3145550000', firstName: 'Test' }),
}).then(r => console.log('Status:', r.status)).catch(e => console.error('CORS or network error:', e));
```

If this throws a TypeError about CORS: deploy the CF Worker proxy (pattern below) and point `PUBLIC_GHL_WEBHOOK_URL` to the Worker URL instead.

**Cloudflare Worker CORS proxy (ready fallback):**

```typescript
// workers/ghl-proxy/index.ts
// Deploy to Cloudflare Workers — free tier, ~100,000 requests/day
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/...';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://redbirdlawnservice.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    // Forward POST to GHL server-side (no CORS restrictions on server)
    const body = await request.text();
    const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return new Response(await ghlResponse.text(), {
      status: ghlResponse.status,
      headers: CORS_HEADERS,
    });
  },
};
```

---

### Pattern 4: Mobile Nav Drawer — Body Scroll Lock

**Inline useEffect scroll lock pattern (HIGH confidence — standard React pattern):**

The basic `document.body.style.overflow = 'hidden'` approach must also target `document.documentElement` to fix iOS Safari, and must compensate for scrollbar width to prevent layout shift.

```typescript
// Inside MobileNav.tsx — runs when isOpen changes
useEffect(() => {
  if (!isOpen) return;

  // Scrollbar width compensation prevents layout shift when scrollbar disappears
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.documentElement.style.overflow = 'hidden'; // Required for iOS Safari

  return () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.overflow = '';
  };
}, [isOpen]);
```

**Drawer Tailwind transition pattern (no animation library needed):**

```typescript
// Backdrop — dark overlay
<div
  className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
  onClick={close}
  aria-hidden="true"
/>

// Drawer panel — slides from right
<nav
  className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-dark-bg shadow-xl
    transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
  role="dialog"
  aria-modal="true"
  aria-label="Navigation menu"
>
```

**MobileNav self-contained architecture:**

`Header.astro` currently has no hamburger button. Rather than modifying `Header.astro` to wire up state across the Astro/React boundary, `MobileNav.tsx` should render its own hamburger trigger button (visible `md:hidden`) alongside the drawer. This keeps the component self-contained and avoids serializable prop constraints.

```typescript
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div className="md:hidden">
      {/* Hamburger button — sits in the header flow */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="p-2 min-h-[44px] min-w-[44px] ..."
      >
        {/* 3-line SVG or lucide Menu icon */}
      </button>

      {/* Backdrop and drawer rendered via portal or fixed positioning */}
      {/* ... */}
    </div>
  );
}
```

Import into `Header.astro` alongside the existing desktop nav and call button:
```astro
---
import MobileNav from '../components/react/MobileNav';
---
<!-- existing header content -->
<MobileNav client:load />
```

---

### Pattern 5: Cloudflare Pages `_headers` — CSP Format

**Verified format (HIGH confidence — official Cloudflare Pages docs):**

File location: `public/_headers` — Astro copies `public/` contents to `dist/` at build time.

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' UNSAFE_EVAL_PLACEHOLDER; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.vapi.ai wss://*.vapi.ai https://*.daily.co wss://*.daily.co; frame-src 'none'; object-src 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(self), geolocation=()
```

Note: Replace `UNSAFE_EVAL_PLACEHOLDER` above with the literal CSP keyword `'unsafe-eval'` in the actual file. The CSP keyword is a string value in the header — not executable code.

**Key CSP directives explained:**

| Directive | Value | Reason |
|-----------|-------|--------|
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'` | `unsafe-eval` is required by VAPI's Daily.co WebRTC layer (confirmed GitHub issue). `unsafe-inline` required for Astro's hydration scripts. |
| `connect-src` | `*.vapi.ai wss://*.vapi.ai *.daily.co wss://*.daily.co` | VAPI uses Daily.co for WebRTC signaling. Both HTTPS and WSS protocols required. |
| `Permissions-Policy` | `microphone=(self)` | Explicitly allows mic access on the same origin — required for WebRTC. |

**Format rules:**
- URL pattern `/*` matches all pages
- Headers are indented with two spaces under the URL pattern
- Max 100 header rules per file
- Does not apply to Cloudflare Worker responses, only Pages static responses

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| VAPI WebRTC voice calls | Custom WebRTC signaling | @vapi-ai/web 2.5.2 | WebRTC negotiation, codec detection, STUN/TURN, Daily.co infra — thousands of edge cases |
| CSP header delivery | Custom middleware / meta http-equiv | `public/_headers` static file | CF Pages serves this natively at no cost |
| Form validation | Validation library (Zod, Yup, etc.) | Inline useState per field | 4 fields, client-side only; a library is unjustified at this scale |
| Body scroll lock | iOS-compatible custom scroll freeze | Inline useEffect with overflow + documentElement | 10-line pattern handles iOS Safari and scrollbar compensation |
| CORS proxy hosting | Self-hosted proxy server | Cloudflare Worker (free tier) | Co-located with CF Pages, zero-latency, 100k requests/day free |

**Key insight:** Phase 4's islands are intentionally minimal. The 80KB JS budget constraint means each component must justify its bytes. React's built-in hooks cover all state management needs here — no external state library is warranted.

---

## Common Pitfalls

### Pitfall 1: client:load on VAPIWidget — SSR Crash

**What goes wrong:** Astro partially executes the component during server rendering. `window.RTCPeerConnection` is undefined in Node.js. Build throws `ReferenceError: window is not defined`, or the widget hydrates silently without connecting.

**Why it happens:** `client:load` generates server-side HTML first, then hydrates client-side. `client:only="react"` skips the server pass entirely.

**How to avoid:** Every usage of `VAPIWidget` in `.astro` files must use `client:only="react"`. Add a JSDoc comment on the component: `// MUST use client:only="react" — WebRTC APIs are browser-only`.

**Warning signs:** Build error `ReferenceError: window is not defined`. Or: widget renders, button click does nothing, no console error.

---

### Pitfall 2: Vapi Instance Created at Module Scope

**What goes wrong:** `const vapi = new Vapi(key)` at the top of the file runs during module evaluation. During SSR (if somehow triggered), this crashes. Client-side, the instance is shared across hot-module reloads and may leave open connections.

**How to avoid:** Always initialize inside `useEffect`. Store in `useRef`. This is the only correct pattern.

**Warning signs:** VAPI works on first load, breaks on HMR reload during development. Or phantom calls that cannot be stopped.

---

### Pitfall 3: GHL Webhook CORS Failure — Silent Lead Loss

**What goes wrong:** Form submits, catches a generic error, shows the phone fallback — but no lead appears in GHL. DevTools Network tab shows a CORS preflight failure (`OPTIONS` request rejected, `Access-Control-Allow-Origin` absent from response headers). Or: fetch resolves with a TypeError about CORS.

**Why it happens:** GHL inbound webhooks are designed for server-to-server use. CORS support is not documented. Browser fetch to a cross-origin URL triggers a preflight.

**How to avoid:**
1. Test the GHL webhook URL from the browser before writing the submit handler (see probe pattern above).
2. Always implement the `catch` block showing the phone number fallback.
3. Do NOT assume a missing error means success — always check `response.ok`.

**Warning signs:** Network tab shows `OPTIONS` request with status 0 (CORS blocked). Or a TypeError in the console rather than an HTTP status error.

---

### Pitfall 4: Missing unsafe-eval Breaks VAPI Silently in Production

**What goes wrong:** VAPI widget loads in development (CSP often not enforced on localhost), button renders fine, user clicks — nothing happens on the deployed site. Browser console shows `Refused to evaluate a string as JavaScript because the unsafe-eval keyword is not an allowed source of script`.

**Why it happens:** VAPI wraps Daily.co's WebRTC layer, which uses code generation internally for codec detection. This is a confirmed open issue in the VAPI SDK GitHub repo.

**How to avoid:** The `public/_headers` file must be created as part of this phase — specifically in Wave 1 — not deferred. Test VAPI on the deployed `.pages.dev` URL, not just localhost.

**Warning signs:** VAPI works on `localhost` but not on the deployed URL. Console shows a CSP violation for the unsafe-eval keyword.

---

### Pitfall 5: Header.astro Currently Has No Hamburger Button

**What goes wrong:** The implementation plan might assume a hamburger trigger exists in `Header.astro` — it does not. The comment says "MobileNav React island added in Phase 4" but left no button stub.

**How to avoid:** `MobileNav.tsx` must render its own trigger button (a `<button>` visible only on mobile via `md:hidden`). This keeps the component self-contained. Import `<MobileNav client:load />` into `Header.astro` alongside the existing click-to-call button. No state needs to cross the Astro/React boundary.

---

### Pitfall 6: Environment Variables Not Provisioned Before Testing

**What goes wrong:** `PUBLIC_GHL_WEBHOOK_URL`, `PUBLIC_VAPI_KEY`, or `PUBLIC_VAPI_ASSISTANT_ID` are `undefined` at runtime. ContactForm fetches to the string `"undefined"`. VAPIWidget initializes with an invalid key and no call connects.

**How to avoid:** Create a local `.env` file (already in `.gitignore`) before running any manual tests. For Cloudflare Pages deployment, set these in the CF Pages dashboard (Settings > Environment variables).

**Required env vars for Phase 4:**
```bash
PUBLIC_GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
PUBLIC_VAPI_KEY=...
PUBLIC_VAPI_ASSISTANT_ID=...
```

**Warning signs:** Network tab shows a fetch to the literal URL `"undefined"`. Or Vapi constructor logs an invalid key error.

---

## Code Examples

### ContactForm.tsx — Complete State and Submit Pattern

```typescript
// Source: React controlled form pattern + GHL field names from official GHL docs
import { useState, useCallback } from 'react';
import { NAP } from '../../lib/constants';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  address: string;
  phone: string;
  service: string;
}

const SERVICE_OPTIONS = [
  'Weekly Mowing',
  'Trimming',
  'Mulch & Bed Maintenance',
  'Seasonal Cleanup',
  'Other',
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '', address: '', phone: '', service: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const validate = useCallback((): boolean => {
    const next: Partial<FormData> = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.address.trim()) next.address = 'Address is required';
    if (!formData.phone.trim()) next.phone = 'Phone number is required';
    if (!formData.service) next.service = 'Please select a service';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const nameParts = formData.name.trim().split(' ');
      const response = await fetch(import.meta.env.PUBLIC_GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || '',
          phone: formData.phone,
          address1: formData.address,
          customData: {
            serviceRequested: formData.service,
            source: 'website-contact-form',
          },
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // Success view
  if (status === 'success') {
    return (
      <div role="alert" className="text-center py-12">
        {/* Green checkmark icon */}
        <p className="font-heading font-bold text-2xl text-forest-green dark:text-light-green mt-4">
          Thank you! We'll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  // Error view — always shows phone fallback per locked decision
  if (status === 'error') {
    return (
      <div role="alert" className="text-center py-12">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Something went wrong. Please{' '}
          <a href={NAP.phoneHref} className="text-redbird-red font-semibold">
            call us at {NAP.phone}
          </a>
        </p>
        <button onClick={() => setStatus('idle')} className="text-sm text-gray-500 underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Each field: label + input + conditional error span */}
      {/* Submit button: bg-redbird-red, disabled when submitting */}
    </form>
  );
}
```

### VAPIWidget.tsx — Core Structure

```typescript
// Source: Verified against @vapi-ai/web GitHub README
// MUST use client:only="react" in .astro parent — never client:load
import { useRef, useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { NAP } from '../../lib/constants';

type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

export default function VAPIWidget() {
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [micDenied, setMicDenied] = useState(false);

  useEffect(() => {
    const vapi = new Vapi(import.meta.env.PUBLIC_VAPI_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => setStatus('active'));
    vapi.on('call-end', () => { setStatus('idle'); setMicDenied(false); });
    vapi.on('error', (err: unknown) => {
      const name = (err as any)?.error?.name ?? (err as any)?.name ?? '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMicDenied(true);
      }
      setStatus('error');
    });

    return () => { vapi.stop(); };
  }, []);

  const handleToggle = async () => {
    if (status === 'active') {
      vapiRef.current?.stop();
    } else {
      setStatus('connecting');
      setMicDenied(false);
      try {
        await vapiRef.current?.start(import.meta.env.PUBLIC_VAPI_ASSISTANT_ID);
      } catch {
        setStatus('error');
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Mic denied fallback panel */}
      {micDenied && (
        <div role="alert" className="mb-3 p-4 bg-white dark:bg-dark-bg rounded-lg shadow-lg max-w-xs text-sm">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Please enable your microphone to speak with Vivian.
          </p>
          <a href={NAP.phoneHref} className="text-redbird-red font-semibold">
            Or call us instead
          </a>
        </div>
      )}

      {/* Floating button — #C41E3A circle, pulse when active */}
      <button
        onClick={handleToggle}
        disabled={status === 'connecting'}
        aria-label={status === 'active' ? 'End call with Vivian' : 'Speak with Vivian AI assistant'}
        className={`w-14 h-14 rounded-full bg-redbird-red text-white shadow-lg
          hover:bg-[#a01830] transition-all duration-200 disabled:opacity-70
          ${status === 'active' ? 'animate-pulse' : ''}`}
      >
        {/* Phone icon (idle/connecting) or Mic icon (active) from lucide-react */}
      </button>

      {/* Active call panel */}
      {status === 'active' && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-dark-bg rounded-lg shadow-xl p-4 w-56">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Speaking with Vivian...</p>
          {/* Waveform indicator — CSS animation bars */}
          <button onClick={() => vapiRef.current?.stop()} className="mt-3 text-xs text-red-500 font-semibold">
            End call
          </button>
        </div>
      )}
    </div>
  );
}
```

### public/_headers — Cloudflare Pages

```
# Cloudflare Pages HTTP headers
# Source: https://developers.cloudflare.com/pages/configuration/headers/
# Note: script-src includes the unsafe-eval keyword — required by VAPI/Daily.co WebRTC layer
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.vapi.ai wss://*.vapi.ai https://*.daily.co wss://*.daily.co; frame-src 'none'; object-src 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(self), geolocation=()
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| VAPI with `client:load` | VAPI with `client:only="react"` | Astro 1+ / whenever VAPI was added | Non-negotiable; SSR crash prevention |
| body-scroll-lock npm package | Inline useEffect with overflow + documentElement | React hooks era (2019+) | Zero package weight for equivalent result |
| GHL webhook URL hardcoded | `import.meta.env.PUBLIC_GHL_WEBHOOK_URL` | Astro env var convention | URL out of source control |
| Vapi instance at module scope | Vapi instance in useRef inside useEffect | React StrictMode / hooks discipline | Prevents double-initialization in React 18+ StrictMode and HMR breakage |

---

## Open Questions

1. **GHL webhook CORS support**
   - What we know: GHL documentation does not mention CORS. Designed for server-to-server. All documented examples use Postman, Zapier, or Make.
   - What's unclear: Whether GHL's inbound webhook endpoint sends `Access-Control-Allow-Origin: *` in practice
   - Recommendation: The first task in the ContactForm wave must be a CORS probe test against the real GHL webhook URL from a browser. Build the Cloudflare Worker proxy file in parallel (it is small) so it can be deployed immediately if needed. Do not skip this test and discover the issue after building the full form UI.

2. **VAPI error object shape for mic denial**
   - What we know: `vapi.on('error', handler)` fires on mic permission denial. Error is an object.
   - What's unclear: Whether the property is `err.name`, `err.error.name`, or something else — not documented in the SDK README.
   - Recommendation: Check both `err.name` and `err?.error?.name` defensively. Any error in the `'error'` event should trigger the mic-denied UI path if either contains `NotAllowedError` or `PermissionDeniedError`. Show the fallback for all error conditions regardless.

3. **VAPI connect-src domains beyond *.vapi.ai and *.daily.co**
   - What we know: VAPI is built on Daily.co WebRTC. Both `*.vapi.ai` and `*.daily.co` are the known domains.
   - What's unclear: Whether backend configuration might route through Twilio, LiveKit, or other providers
   - Recommendation: Start with `*.vapi.ai wss://*.vapi.ai *.daily.co wss://*.daily.co` in the CSP. After the first test call on the deployed site, inspect the browser console for any CSP violation errors and add blocked domains.

4. **MobileNav trigger button alignment in Header.astro**
   - What we know: `Header.astro` has brand name (left), desktop nav (center, `hidden md:flex`), click-to-call (right). No hamburger button exists.
   - What's unclear: Exact positioning of the hamburger trigger relative to the existing click-to-call button on mobile
   - Recommendation: `MobileNav.tsx` renders its own `md:hidden` trigger button. Position it to the left of the click-to-call button in the header flex row by importing it before the call button in `Header.astro`. This requires no state to cross the Astro/React boundary.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | Yes | v22.16.0 | — |
| npm | Package management | Yes | 11.12.1 | — |
| @vapi-ai/web 2.5.2 | VAPIWidget | Yes (package.json) | 2.5.2 | — |
| react 19.2.4 | All islands | Yes (package.json) | 19.2.4 | — |
| @astrojs/react ^5.0.2 | Island hydration | Yes (package.json) | ^5.0.2 | — |
| lucide-react ^1.7.0 | Icons | Yes (package.json) | ^1.7.0 | Inline SVG strings (Phase 3 precedent) |
| wrangler CLI | CF Worker proxy (if needed) | No | — | Deploy via CF dashboard UI without CLI |
| GHL webhook URL | ContactForm | Not yet provisioned | — | requestbin.com for local dev smoke test |
| VAPI public key | VAPIWidget | Not yet provisioned | — | Component buildable; end-to-end test blocked until provisioned |
| VAPI assistant ID | VAPIWidget | Not yet provisioned | — | Same as above |
| public/_headers | CSP for VAPI | Does not exist | — | Must be created in this phase before production VAPI test |

**Missing dependencies with no fallback:**
- GHL webhook URL — ContactForm cannot be verified end-to-end. Plan must include a task to obtain the webhook URL from Alberto's GHL account before the ContactForm integration task.
- VAPI public key + assistant ID — VAPIWidget cannot be tested end-to-end. Plan must include a task to provision these env vars (local `.env` and CF Pages dashboard) before the VAPIWidget verification step.

**Missing dependencies with fallback:**
- wrangler CLI — not needed unless GHL CORS probe fails; CF Worker can be deployed via dashboard
- public/_headers — does not block the build, but VAPI will silently fail in production without it; must be treated as a Wave 1 task

---

## Sources

### Primary (HIGH confidence)
- [VapiAI/client-sdk-web GitHub README](https://github.com/VapiAI/client-sdk-web) — Constructor, start(), stop(), all event names verified
- [Astro framework components docs](https://docs.astro.build/en/guides/framework-components/) — client:load vs client:only behavior and syntax verified
- [Cloudflare Pages _headers docs](https://developers.cloudflare.com/pages/configuration/headers/) — file format, URL pattern syntax, constraints verified
- [Cloudflare Workers CORS header proxy example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) — proxy pattern verified

### Secondary (MEDIUM confidence)
- [GHL Workflow Trigger — Inbound Webhook](https://help.gohighlevel.com/support/solutions/articles/155000003147) — flexible JSON accepted; phone or email required
- [GHL Webhook Integration Guide](https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/index.html) — confirms POST JSON format; no CORS documentation found
- [VapiAI React example repository](https://github.com/VapiAI/example-client-javascript-react) — useRef/useEffect pattern confirmed as the community-standard approach

### Tertiary (LOW confidence — flagged for validation)
- GHL CORS behavior from browser fetch — no official documentation found; must be tested against live endpoint
- VAPI error object shape for mic permission denial — not explicitly documented in SDK README; defensive pattern recommended
- VAPI `connect-src` domains beyond `*.vapi.ai` and `*.daily.co` — inferred from Daily.co dependency; verify post-deploy via CSP console errors

---

## Metadata

**Confidence breakdown:**
- VAPI SDK API (constructor, methods, events): HIGH — verified against official GitHub README
- Astro client directives behavior: HIGH — verified against official Astro docs
- Cloudflare Pages _headers format: HIGH — verified against official CF docs
- GHL webhook field names and format: MEDIUM — documented examples exist but schema is flexible/unmapped
- GHL CORS behavior from browser: LOW — no documentation found; probe test required before build
- Body scroll lock pattern: HIGH — standard React pattern, multiple 2024 sources agree
- CF Worker proxy pattern: HIGH — verified against official CF Workers docs

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (30 days — stable technologies; VAPI moves fast, check for 2.5.x patch releases before implementation)
