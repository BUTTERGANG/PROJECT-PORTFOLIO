# Changelog

All notable changes to PROJECT-PORTFOLIO. Newest first.

## 2026-10-31 — Photography: collapsible galleries

The galleries page ran ~13,000px of photos in one scroll. Each discipline is now
a disclosure you open on demand — and the collapsed row is deliberately thin so
the collapse actually buys back scrolling.

- **Weddings / Sports & Powerlifting / Portraits / Travel** are native
  `<details>` disclosures: Weddings open on load, the rest collapsed. Clicking
  the row toggles it; no JS, no framework, keyboard accessible for free.
- **Collapsed row is 53px** — one line: title, photo count, 18px chevron. The
  descriptive blurb moved *inside* the panel, so a closed section costs a single
  row instead of a block of prose. (First cut left the blurb in the header and
  the rows came out 153–178px each, which defeated the point.)
- **Every default disclosure triangle is suppressed** — `::-webkit-details-marker`
  *and* `::marker` — because Safari paints its own triangle sized off the
  summary's font, which is how a summary ends up with a giant arrow. The chevron
  SVG also carries explicit `width`/`height` attributes so it can never fall back
  to the 300×150 replaced-element size if a stylesheet fails to load.
- Page height: **13,283px all open → 4,087px all closed → 6,191px with Weddings
  open**. Collapsed sections don't fetch their images (5 downloaded vs 34).
- Deep links (`/photography/#portraits`) open their section before the anchor
  lands — otherwise the link scrolls to a closed header.
- Stat tile corrected: **"2 shooters on the top tier" → "1 shooter, shoot to
  delivery"**, and the Legacy wedding package no longer claims a second shooter.

Verified in Brave over raw CDP at 320/390/560/720/900/1100/1440px: 53px rows and
18px chevrons at every width, no SVG over 30px anywhere on the page, 0px
horizontal overflow and no clipped titles; click toggles open→closed→open.

## 2026-10-31 — Photography section + freshness pass

**The site was live but its links pointed at a dead host.** `astro.config.mjs`
still had `site: 'https://butterfield-portfolio.replit.app'`, a Replit URL that
404s ("This app isn't live yet"), while the real site has served
**https://alexbutterfield.com** the whole time. Every `<link rel=canonical>`,
`og:url`, `og:image` and sitemap entry on the live site was therefore pointing at
a 404. Fixed, plus CI, which had been red on `main` since 2026-10-24.

### Added
- **`/photography/`** — the LA Media photo/video portfolio as a top-level page
  and a nav item (after Live Execution). Four galleries (Weddings, Sports &
  Powerlifting, Portraits, Travel), the film/reel offering, the published
  package menu, and a booking CTA through to workwithla.media.
- **34 WebP frames** under `public/photography/` (1.7 MB total), resized and
  re-encoded from the LA Media site's own photo set. Curated list, alt text and
  real pixel dimensions in `src/data/photography.ts`; reproducible via
  `scripts/build-photography.sh` (verified byte-for-byte).
- **`docs/gear-rental.md`** — case study for the LA Media gear-rental platform
  (eBay-valued pricing, e-signed agreements with a SHA-256 audit trail, Stripe
  fee + damage hold, automated return chasing). Photography & LA Media cluster,
  tier `advanced`. Docs count 47 → 48.
- A photography teaser block on `/business/`, linking the pillar page through to
  the new gallery.

### Fixed
- **Canonical/OG/sitemap origin** — `site` now `https://alexbutterfield.com`;
  sitemap no longer emits a single `replit.app` URL.
- **CI red since 2026-10-24** — the workflow pinned `node-version: 22`, but
  Astro 7.4.2 requires `>=22.23.4`, so the build failed on every push
  (run 40136532038). Now `node-version: 24`. The artifact step also used
  `upload-pages-artifact` with no Pages deploy job consuming it; switched to a
  plain `upload-artifact` (`portfolio-dist`).
- **Wedding pricing drift on `/business/`** — the stat band and copy said
  weddings "from $2,000"; the studio's own current menu says **$1,800**
  (Ceremony), with portraits from $300 and the Signature session at $450.
  Aligned to the studio's published pricing.
- **README** — said "~27 project case studies" (it's 48) and advertised the dead
  Replit URL as the live site.

### Verified
- `npm run build` passes: **42 pages**.
- Driven in the persistent Brave over CDP at 1440/1100/900/720/390 px:
  3/3/3/2/1 masonry columns, **0 px horizontal overflow** at every width, all 34
  photography assets decode (`naturalWidth > 0`), lightbox opens on click with
  the right `src`, theme toggle round-trips dark → light → dark, nav marks
  `/photography/` active. One tab created, one tab closed.

## 2026-10-23 — Security: dependency vulnerability fixes

Known advisories (OSV) in lockfiles: **1 critical, 18 high, 17 moderate, 6 low → none**.

- `portfolio-site`: **Astro 7.2.4 → ^7.4.2** — fixes critical RCE via AVIF image optimization plus several highs; `npm audit fix` for the rest (audit now clean)
- Case study `bible-study-app.md` (docs + synced content copy): JWT auth is now PyJWT, not python-jose
- Critical/high advisories cleared in: `astro`, `devalue`, `http-cache-semantics`, `js-yaml`, `sharp`, `source-map-js`, `svgo`, `undici`, `vite`, `zod`
- Verified: `npm run build` passes (40 pages)
