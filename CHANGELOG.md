# Changelog

All notable changes to PROJECT-PORTFOLIO. Newest first.

## 2026-10-31 — Own-site links, new address, inquiry form

The photography business used to live on its own domain. It no longer does, so
nothing on the site links out to it any more — and inquiries now have a real
form instead of a link off-site.

- **Every `workwithla.media` link is gone** from the built output. Footer entry
  "LA Media" → "Photography" (internal), `/business/` → "See the photography &
  video portfolio →" pointing at `/photography/`, and `/contact/`'s channel list
  links the portfolio instead of the retired domain.
- **Address is now `alex@alexbutterfield.com`** everywhere (contact page,
  photography page, the form's fallback and the mailto links).
- **`/photography/` booking CTAs route to `/contact/`** — "Book a shoot →" and
  "Start an inquiry →" are internal links now, no `target="_blank"`.
- **New inquiry form on `/contact/`** — name, email, shoot type, date and
  details, plus an off-screen honeypot. Server-rendered, native validation
  (`required` + typed inputs, `:user-invalid` styling), and it still works with
  JS off because the form's own `action`/`method` submit it.
- **`FORM_ENDPOINT` in `contact.astro` picks the transport.** Left empty it runs
  in **mailto mode**: the script composes the message and hands off to the
  visitor's mail client. Set it to a Formspree / Basin / Web3Forms / self-hosted
  URL and *both* paths switch over — the script POSTs via `fetch` with inline
  success/error, and the no-JS `action` becomes the endpoint instead of mailto.
- Fixed: the photography hero counted frames with `c.hero` — stale after the
  hero→cover rename — so it under-reported the set by 4.

Verified end-to-end in Brave with real mouse/keystroke input:
- **Endpoint mode** against a local POST echo: a 677-byte payload arrived
  containing the typed name, email and message; status flipped to success; form
  reset.
- **Honeypot:** a filled trap reports success and sends nothing.
- **Mailto mode:** empty submit blocked by native validation (handler never
  runs); a valid submit does not navigate away, keeps the values, and Chrome's
  own `Page.frameRequestedNavigation` event confirms the composed URL is
  `mailto:alex@alexbutterfield.com?subject=Photography%20inquiry…&body=…`.
- 0px horizontal overflow at 1280/900/640/390/320px; the field grid collapses to
  one column at 640px; with JS disabled the form still has a real action and its
  required fields.

## 2026-10-31 — Photography: cover carousel + dropping gallery

Replaces the stacked galleries with one cover photo per discipline in a
carousel, and the gallery for the selected cover drops in underneath it.

- **Four covers, one per discipline** (weddings / sports / portraits / travel),
  each carrying its label and photo count. Selecting one is what switches the
  gallery below.
- **Genuinely scrollable, not just clickable.** The strip is a real horizontal
  scroll container with scroll-snap, so swipe and trackpad work natively, plus a
  pointer-drag handler for a mouse. Cards are sized so ~3.2 show at desktop
  width — at the first sizing all four nearly fit in 1040px and the strip had
  only 80px of travel, which is not a carousel.
- **Motion on cycle:** the active cover lifts 4px, brightens (drops its dim
  filter), zooms from 1.05 to 1.01, warms its count to accent, and takes a sweep
  of accent light across it; inactive covers sit at 68% opacity and 96.5% scale.
  The indicator pill widens and slides.
- **The gallery drops in:** the new panel animates down from behind the carousel
  (`translateY(-18px)` → 0 with a fade), while the container eases between the
  old and new heights so nothing snaps.
- **Navigation:** click a cover, click a dot, use the ← → buttons (both wrap), or
  arrow-key through the strip with a proper roving tabindex and
  `aria-selected`. Deep links (`/photography/#portraits`) open that discipline.
- **Degrades cleanly:** with JS off every gallery renders stacked; under
  `prefers-reduced-motion` the panels switch with no animation.
- Stat tile corrected: **"2 shooters on the top tier" → "1 shooter, shoot to
  delivery"**, and the Legacy wedding package no longer claims a second shooter.

Two bugs found and fixed by testing rather than assuming:
- **Mouse drag died after ~40px.** `pointerleave` fired as soon as the strip
  shifted under the cursor and ended the gesture. Fixed with
  `setPointerCapture` on pointerdown, and the covers now carry
  `draggable="false"` + `user-drag: none` so a mouse drag can't start a native
  image drag instead.
- **The drag test itself was invalid at first** — it dispatched mouse events at
  y=1076 in a 1000px viewport, so nothing was ever hit. Re-run with the carousel
  scrolled into view, the drag tracks the cursor 1:1 and snaps on release.

Verified in Brave over raw CDP at 320/390/560/720/900/1100/1440px: strip
scrollable at every width, 0px horizontal overflow, cards 191–309px; click /
arrow / dot / keyboard all switch the panel and update `aria-selected` and the
roving tabindex; only one panel is ever visible; drag scrolls without selecting;
deep link works; reduced-motion and no-JS paths both behave.

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
