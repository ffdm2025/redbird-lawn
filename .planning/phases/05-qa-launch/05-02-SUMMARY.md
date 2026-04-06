---
phase: 05-qa-launch
plan: 02
status: deferred
started: 2026-04-06
completed: 2026-04-06
requirements-completed: []
key-decisions:
  - "Lighthouse audit and Cloudflare Pages deploy deferred — requires local dev server and CF dashboard access"
  - "All code optimizations complete — remaining work is human verification and infrastructure setup"
---

# Phase 05 Plan 02: Lighthouse Audit + Deploy

**Deferred — requires human action**

## Pre-Launch Checklist (for when you're ready)

### 1. Run Lighthouse Audit
```bash
npm run dev
# Open http://localhost:4321 in Chrome
# DevTools > Lighthouse > Mobile > Run audit
# Targets: Performance 95+, SEO 100, Accessibility 95+, Best Practices 100
```

### 2. Fix Any Issues
- If Performance < 95: Check for unoptimized images or render-blocking resources
- If Accessibility < 95: Fix missing alt text, contrast ratios, ARIA labels
- If SEO < 100: Check meta tags, heading hierarchy, canonical URL

### 3. Deploy to Cloudflare Pages
1. Push to GitHub: `git remote add origin <repo-url> && git push -u origin master`
2. Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git
3. Build command: `npm run build`, Output: `dist`, Env: `NODE_VERSION=22`
4. Verify URL ends in `.pages.dev`
5. Speed > Optimization > Auto Minify > uncheck HTML

### 4. Custom Domain (DEPL-03)
1. Cloudflare Dashboard > Pages project > Custom domains > Add
2. Add `redbirdlawnservice.com` (or chosen domain)
3. DNS auto-configured since domain is already on Cloudflare

### 5. Post-Deploy Verification
- [ ] Site loads at custom domain with HTTPS
- [ ] H1 visible, CTA works
- [ ] Click-to-call works on mobile
- [ ] MobileNav opens/closes
- [ ] JSON-LD visible in page source
- [ ] sitemap-index.xml accessible
- [ ] robots.txt accessible

### 6. Submit to Google Search Console
- Add property for the custom domain
- Submit sitemap: `https://redbirdlawnservice.com/sitemap-index.xml`
- Request indexing for the homepage
