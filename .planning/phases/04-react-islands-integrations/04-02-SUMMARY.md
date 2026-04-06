---
phase: 04-react-islands-integrations
plan: 02
subsystem: react-islands
tags: [contact-form, vapi, ghl-webhook, cloudflare-worker, react-islands]
dependency_graph:
  requires:
    - 04-01 (MobileNav island, React runtime confirmed working)
    - src/lib/constants.ts (NAP data for phone fallback and mic-denied link)
  provides:
    - ContactForm island with GHL webhook integration and error fallback
    - VAPIWidget island with VAPI SDK lifecycle and mic-denied panel
    - Cloudflare Worker CORS proxy (ready to deploy if GHL CORS probe fails)
  affects:
    - src/pages/index.astro (contact section now interactive)
    - src/layouts/Layout.astro (VAPI floating widget on every page)
tech_stack:
  added: []
  patterns:
    - Controlled React form with inline validation and FormStatus state machine
    - useRef + useEffect initialization for VAPI SDK (never at module scope)
    - client:only="react" for WebRTC components (never client:load)
    - Phone fallback wired to NAP.phoneHref on any fetch error
key_files:
  created:
    - src/components/react/ContactForm.tsx
    - src/components/react/VAPIWidget.tsx
    - workers/ghl-proxy/index.ts
  modified:
    - src/pages/index.astro
    - src/layouts/Layout.astro
decisions:
  - ContactForm uses direct fetch to PUBLIC_GHL_WEBHOOK_URL; CF Worker proxy built as ready fallback
  - VAPIWidget uses client:only="react" with JSDoc guard — prevents accidental SSR build crash
  - Error state always shows NAP.phone click-to-call fallback (locked decision from CONTEXT.md)
  - CF Worker proxy scoped to redbirdlawnservice.com origin only (not wildcard *)
metrics:
  duration_seconds: 198
  completed_date: "2026-04-05T23:58:12Z"
  tasks_completed: 2
  files_created: 3
  files_modified: 2
---

# Phase 04 Plan 02: React Islands — ContactForm + VAPIWidget Summary

ContactForm island with GHL webhook POST, inline validation, and phone fallback; VAPIWidget island with VAPI SDK lifecycle management, mic-denied fallback panel, and client:only="react" guard — both wired into the page with build passing.

## What Was Built

### Task 1 (skipped per objective)
The GHL CORS probe checkpoint was skipped as directed. No GHL webhook URL is provisioned yet. ContactForm was built with the direct-fetch pattern (no-ghl-url scenario). The Cloudflare Worker proxy was built regardless as documented insurance.

### Task 2: ContactForm + CF Worker Proxy + index.astro wiring

`src/components/react/ContactForm.tsx` — controlled form with four fields (Name, Address, Phone, Service Requested). Validation runs client-side on submit; inline red error messages appear below each failing field and clear on change. Submit handler POSTs to `import.meta.env.PUBLIC_GHL_WEBHOOK_URL` with the GHL payload shape (firstName, lastName, phone, address1, customData). Status state machine: idle → submitting → success/error. Success state replaces the form with a green checkmark and thank-you message. Error state shows the phone fallback with `NAP.phoneHref` click-to-call link and a "Try again" reset button.

`workers/ghl-proxy/index.ts` — Cloudflare Worker CORS proxy. Handles OPTIONS preflight (204), rejects non-POST methods (405), forwards POST body to `GHL_WEBHOOK_URL`, returns response with CORS headers scoped to `redbirdlawnservice.com`. Deploy only if the GHL CORS probe confirms the raw webhook blocks browser fetch.

`src/pages/index.astro` — ContactForm import added to frontmatter. The `<section id="contact">` inner content replaced with the heading + `<ContactForm client:load />` island.

Commit: `0fc4574`

### Task 3: VAPIWidget + Layout.astro wiring

`src/components/react/VAPIWidget.tsx` — VAPI SDK initialized inside `useEffect` with `useRef` storing the instance. Event handlers: `call-start` sets status active, `call-end` resets to idle and clears micDenied, `error` checks error name for NotAllowedError/PermissionDeniedError (sets micDenied=true) then sets status error. Cleanup returns `vapi.stop()`. Toggle handler: if active calls stop(), otherwise sets connecting, calls `vapi.start(PUBLIC_VAPI_ASSISTANT_ID)`, catch sets error. Three UI states: idle (Phone icon), connecting (Mic icon, button disabled), active (PhoneOff icon + expanded "Speaking with Vivian..." panel with animated waveform bars and End call button). Mic-denied panel floats above the button with enable-microphone message and NAP.phoneHref call link. JSDoc guard comment at top of file prevents accidental client:load usage.

`src/layouts/Layout.astro` — VAPIWidget import added, `<VAPIWidget client:only="react" />` inserted after `<slot />` and before the scroll animation `<script>` block.

Commit: `de9eb75`

## Decisions Made

- **Direct fetch pattern chosen for ContactForm**: No GHL URL provisioned yet (no-ghl-url scenario per objective). ContactForm reads `PUBLIC_GHL_WEBHOOK_URL` from env. If the live CORS probe later shows GHL blocks browser fetch, flip the env var to point at the deployed Worker URL — no code change needed.
- **CF Worker proxy built regardless**: Small file, zero risk, real insurance. Pre-built means zero delay if CORS probe fails at launch.
- **CORS origin locked to production domain**: `Access-Control-Allow-Origin: https://redbirdlawnservice.com` — not wildcard. Prevents the proxy from being abused as a public relay.
- **client:only="react" guard comment on VAPIWidget**: JSDoc comment at file top makes the constraint visible to any future editor before they accidentally wire it with client:load.

## Deviations from Plan

None — plan executed exactly as written. Task 1 (CORS probe checkpoint) was skipped per the execution objective's explicit instruction to treat it as the "no-ghl-url" scenario.

## Known Stubs

- `PUBLIC_GHL_WEBHOOK_URL` is not yet provisioned. ContactForm will throw a network error (which it handles gracefully — shows phone fallback) until the real GHL webhook URL is set in `.env`.
- `PUBLIC_VAPI_KEY` and `PUBLIC_VAPI_ASSISTANT_ID` are not yet provisioned. VAPIWidget will initialize but `vapi.start()` will fail (triggering the error state) until real credentials are filled in.
- Both stubs are intentional and documented in `04-02-PLAN.md` under `user_setup`. End-to-end testing is blocked until credentials are provisioned — this is expected behavior, not a bug.

## Self-Check: PASSED

All files confirmed present. Both task commits confirmed in git history.

| Check | Result |
|-------|--------|
| src/components/react/ContactForm.tsx | FOUND |
| src/components/react/VAPIWidget.tsx | FOUND |
| workers/ghl-proxy/index.ts | FOUND |
| src/pages/index.astro | FOUND |
| src/layouts/Layout.astro | FOUND |
| Commit 0fc4574 (Task 2) | FOUND |
| Commit de9eb75 (Task 3) | FOUND |
