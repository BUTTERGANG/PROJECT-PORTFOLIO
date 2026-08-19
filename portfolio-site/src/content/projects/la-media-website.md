---
project: LA Media Website
repo: BUTTERGANG/LA-MEDIA-WEBSITE
visibility: private
demo_url: ""
demo_type: live
cluster: photo
tier: advanced
status: live
---

# LA Media Website
**One-liner:** The commercial front door for LA Media — a portraits/sports/weddings photography site with a cart and a client portal — built to turn "shooting favors for friends" into a packaged offering people can actually book and pay for.

## Origin (the Build Loop)
> Because I was **turning LA Media from favor-shoots into a real commercial studio in Indianapolis**, I kept hitting **the fact that "we do photography, DM us" isn't an offering — there was nowhere for a client to see packages, book, pay, or get their gallery**, so I built **a public site with a client portal on top of NeonDB, Stripe, and Dropbox** that **presents the work by category and delivers galleries clients log in to renew and download**. It taught me **that migrating a live site's whole backend — auth, storage, database — without breaking the people already using it is its own discipline, separate from building the features.**

## The problem
LA Media existed as talent and a camera, not as a business a stranger could buy from. There was no packaged menu of portraits/sports/weddings, no way to take payment, and no clean way to hand finished galleries to clients. The site had to do the front-of-house job — show the work, state the offering, take the booking — and the back-of-house job — authenticate clients, store their photos, and let them renew and pull down galleries before they expire.

## What it does
- **Category marketing pages** — Home, Portraits, Sports, Weddings, Boudoir, About, FAQ, Contact, each presenting the work as a bookable offering.
- **Cart / checkout** — Stripe Checkout sessions (with webhooks) so clients can pay for a package rather than negotiate over DM.
- **Client portal** — email/password login (Better Auth cookie sessions), a client dashboard, and a gallery renewal flow (`Renew.tsx`) for galleries approaching expiry.
- **Gallery delivery** — galleries stored on Dropbox with generated shared links; admin upload drawer streams files through the server to Dropbox.
- **Automated gallery-expiration emails** — `node-cron` job that emails clients before a gallery lapses (Resend).
- **Photo-first UI** — `react-photo-album` layouts with `yet-another-react-lightbox` for viewing.

## How it's built
- **Stack:** React 19 + TypeScript + Vite, Tailwind CSS v4, `react-router-dom` for the public site and portal. Node.js + Express + TypeScript REST API. NeonDB (PostgreSQL via `pg`, parameterized SQL). Better Auth (cookie sessions, `role` field for admin). Dropbox for file storage, Resend for email, Stripe for payments, `node-cron` for scheduled jobs.
- **Notable engineering:**
  - **A full backend migration on a live business** — moved off Supabase entirely: Supabase Postgres/JS-client → NeonDB with hand-written parameterized SQL; Supabase Auth (JWT bearer tokens) → Better Auth (HTTP-only cookie sessions, `credentials: 'include'`, CORS with credentials); Supabase Storage → Dropbox streaming uploads with shared links. Documented end-to-end in `MIGRATION-NEONDB.md` and completed 2026-07-02.
  - **SQL-injection fix during the migration** — the bulk gallery-file insert was rewritten to `unnest($2::text[], $3::text[])` parameterized arrays instead of string-built SQL, and route param types were narrowed.
  - **Two front-ends, one history** — the original vanilla HTML/CSS/JS site (`webapp/`, plus the root `.html` files) is kept as reference while the React 19 + portal app in `client/` is the live product.
- **Architecture:** React SPA (public pages + `/portal` + `/dashboard`) → Express REST API → NeonDB, with Dropbox (galleries), Stripe (checkout + webhooks), Resend (email), and a node-cron scheduler for expiry notices hanging off the server.

## Proof points
- **Full stack swap with a documented checklist** — database, auth transport, and file storage all replaced, verified item-by-item in `MIGRATION-NEONDB.md`.
- Real commerce path: Stripe Checkout + webhook confirmation, not a mailto link.
- Client lifecycle handled end to end — login, gallery view, expiry warning email, renewal page.
- Category pages span the studio's actual offering: portraits, sports, weddings, boudoir.

## What to show
- **Demo:** Deploy the React `client/` build to a public URL (repo stays private). Land on Home, click through Weddings/Portraits, and show the cart; a seeded demo client account can show the portal + a gallery.
- **Visuals needed:** the home hero and a category gallery (react-photo-album + lightbox); the cart/checkout; the client portal dashboard and gallery-renewal page (blur real client names/emails and any Dropbox links); a before/after note on the Supabase → NeonDB migration. Mark client PII as blur-sensitive.

## Cross-links
- The commercial front door to the same business whose back office is the [LA Media Dashboard](la-media-dashboard.md) — both run on NeonDB + Stripe, both did an "own-your-data" migration.
- Part of the Photography & LA Media cluster with [LightLog](lightlog.md) and [photo-file-copier](photo-file-copier.md).

## Case-study angle
Alex took a photography hobby and stood up the actual business around it — a bookable, paid, gallery-delivering site — and then re-platformed its entire backend (Supabase → NeonDB + Better Auth + Dropbox) on a live site without dropping the clients already using it.
