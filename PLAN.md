# Alex Butterfield — Portfolio Site

> **Alias**: PROJECT-PORTFOLIO  
> **Last Updated**: 2026-08-19  

A static Astro portfolio site organizing 26 project case studies around the **Build Loop** narrative. Deployed as static HTML — zero runtime JS on production builds.

---

## Current State

**Published** — static site, fully built, ready to deploy to any static host.

### What's Built
- **26 project case studies** organized across 4 narrative pillars + 8 origin clusters
- **Tiered content** — `anchor` + `advanced` projects get full pages (`/projects/<slug>/`), `standard` projects render as compact expandable cards
- **Content pipeline** — `scripts/sync-content.mjs` copies from `../docs/*.md` (the source of truth) into `src/content/projects/` on every build, seeding a media manifest per project
- **Media drop-zones** — `public/media/<slug>/` per project for screenshots, GIFs, recordings
- **Static output** — `dist/` (~620K, zero external JS dependencies)
- **Responsive design** — Astro-native with component-based layouts
- **CI workflow** — GitHub Actions (upgraded to advanced tier)

### What's Deployed
- Static site built with Astro
- Ready to deploy to any static host (Netlify, Vercel, Cloudflare Pages, etc.)
- No CDN/domain configuration confirmed in repo

### Test Health
- No test suite (static site — content accuracy verified manually)
- Astro build step fails on schema/content mismatch, which acts as a compile-time check

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Astro |
| **Language** | TypeScript |
| **Content** | Markdown + frontmatter (`src/content/projects/`) |
| **Styling** | Tailwind CSS (via Astro integration) |
| **Build** | `astro build` → static `dist/` |
| **Plugins** | `@astrojs/sitemap` |
| **CI** | GitHub Actions |
| **Package Manager** | npm |

---

## API Implementation

**No API** — this is a fully static site. All content is rendered at build time. No server-side components, no database, no authentication.

### Build Pipeline
```
../docs/*.md  ──sync──▶  src/content/projects/*.md  ──astro build──▶  dist/
```

- Content source of truth is the external `../docs/` directory (shared across projects)
- `scripts/sync-content.mjs` copies + seeds media manifests on every build
- Media lives in `public/media/<slug>/` — referenced directly in the static build

---

## Security Posture

**Minimal surface area** — static site means no server, no database, no auth, no user input.

- No forms, no login, no cookies
- No server-side processing
- Zero external JS in production builds
- Sitemap is the only dynamic output (no PII risk)
- Content is publicly readable by design (portfolio)

---

## MVP / Roadmap

### What's Done
- ✅ 26 project case studies across narrative pillars + clusters
- ✅ Tiered project display (full pages vs compact cards)
- ✅ Content sync pipeline from shared docs
- ✅ Responsive Astro layouts
- ✅ CI workflow
- ✅ Sitemap generation

### Short-Term
- [ ] Deploy to production domain
- [ ] Add missing media assets per project (screenshots, GIFs, recordings)
- [ ] Final content audit for all 26 projects
- [ ] Add Open Graph / social meta tags per project
- [ ] Accessibility audit (ARIA labels, contrast, keyboard nav)

### Medium-Term
- [ ] RSS feed for project updates
- [ ] Lightbox gallery for project media
- [ ] Search/filter across projects
- [ ] Analytics (privacy-focused, e.g. Plausible)
- [ ] Custom 404 page

### Long-Term
- [ ] Blog section for longer-form writing
- [ ] Dark mode toggle
- [ ] i18n / multi-language support
- [ ] Automated media pipeline (screenshot automation)
- [ ] CI-preview deployments per branch