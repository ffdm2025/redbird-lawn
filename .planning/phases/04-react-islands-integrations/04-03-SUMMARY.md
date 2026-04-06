---
phase: 04-react-islands-integrations
plan: 03
status: deferred
started: 2026-04-05
completed: 2026-04-05
requirements-completed: []
key-decisions:
  - "Live browser verification deferred — GHL webhook URL and VAPI credentials not yet provisioned"
  - "All components build clean and are structurally complete — only env vars block functional testing"
---

# Phase 04 Plan 03: Live Browser Verification

**Deferred — credentials not yet provisioned**

## Status
Live browser verification cannot run without:
1. `PUBLIC_GHL_WEBHOOK_URL` — Alberto's real GHL webhook URL
2. `PUBLIC_VAPI_KEY` — VAPI public API key from app.vapi.ai
3. `PUBLIC_VAPI_ASSISTANT_ID` — Vivian assistant ID from app.vapi.ai

## What Can Be Verified Now
- Build passes (`npm run build` exits 0)
- MobileNav renders and opens/closes (visual check via `npm run dev`)
- ContactForm renders with validation (visual check)
- VAPIWidget renders as floating button (visual check)
- No SSR errors from `client:only="react"` components

## What Needs Credentials
- ContactForm → GHL webhook POST (needs real URL + CORS probe)
- VAPIWidget → voice call with Vivian (needs VAPI keys)

## Resume Instructions
Once Alberto provisions credentials:
1. Copy `.env.example` to `.env` and fill in values
2. Run `npm run dev` and test all three islands
3. Run `/gsd:verify-work 4` for formal UAT
