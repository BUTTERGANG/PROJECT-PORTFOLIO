---
project: LA Media Dashboard
repo: BUTTERGANG/la-media-dashboard
visibility: private
demo_url: ""
demo_type: live
cluster: photo
tier: advanced
status: live
---

# LA Media Dashboard
**One-liner:** The operating system for a two-person photo/video business — projects, invoicing, contracts, proposals, and CRM — built to replace the pile of spreadsheets and HoneyBook that were running the studio.

## Origin (the Build Loop)
> Because I was **running LA Media as an actual commercial studio — booking shoots, chasing invoices, sending contracts**, I kept hitting **the point where spreadsheets and a $40/mo SaaS tool couldn't keep two people in sync or trusted with money**, so I built **a full ops dashboard on our own NeonDB** that **runs the whole pipeline from client inquiry to signed contract to paid invoice**. It taught me **that "internal tool" is not an excuse to skip security — the moment real payments run through it, invoice races, webhook signatures, and auth guards are the actual product.**

## The problem
Two photographers, one shared business, and every moving part lived somewhere different: shoot bookings in a spreadsheet, contracts in HoneyBook, invoices half-manual, client intake in email. Nobody could see the whole pipeline at once, invoice numbers collided when we both worked at the same time, and paying a third-party $40/month to hold our client data started feeling backwards when I could build exactly what we needed. The trigger for building it myself was wanting our own database, our own contracts, and our own Stripe/Gmail wiring — not a rented workflow.

## What it does
- **Projects & pipeline** — tracks each shoot from lead through pre-production, shooting, editing, and delivery, with tasks, gear checklists, and per-user XP/gamified metrics for the two-person team.
- **Invoicing** — line-item invoices with server-computed totals, Stripe Payment Links, PDF export (PDFKit), overdue auto-flipping, and partial-payment tracking.
- **Contracts** — templated contracts with `{{clientName}}`/`{{eventDate}}` placeholders frozen at creation, public sign/decline pages, typed or drawn (canvas) signatures, and IP/UA capture at sign time.
- **Packages & proposals** — reusable service bundles that seed client-facing proposals with accept/decline and auto-expiry.
- **Public client intake** — an `/inquire` form (honeypot + rate-limited) that converts an inquiry straight into a project.
- **SOP library with a Claude chat panel** — streaming AI assistant that drafts standard operating procedures and saves them back into the library.
- **Real-time sync** — WebSocket push so both users see notifications, SOP edits, and paid invoices instantly.
- **Google Calendar + per-user Gmail sending** — invoices email from the logged-in user's own Workspace account (e.g. `alex@workwithla.media`).

## How it's built
- **Stack:** TypeScript end-to-end. React + Vite + TailwindCSS + shadcn/ui (26 Radix primitives) + wouter + TanStack Query on the client (all pages lazy-loaded for code splitting). Express + Drizzle ORM + `pg` on the server. NeonDB (external PostgreSQL) via a `NEONDB` secret. `express-session` + `connect-pg-simple` for Postgres-backed sessions. WebSocket server for real-time. Stripe, Gmail OAuth2 (`googleapis`), `@anthropic-ai/sdk` + `openai`, PDFKit, Helmet, bcrypt.
- **Notable engineering:**
  - **Invoice integrity under concurrency** — `getNextInvoiceNumber()` serializes with `pg_advisory_xact_lock` inside a transaction, plus a partial unique index on active invoice numbers and a retry-on-23505 loop, so two people creating invoices simultaneously never collide.
  - **Money you can't spoof** — totals (subtotal/tax/total cents) are omitted from the insert schema and always recomputed server-side; Stripe refunds are made idempotent by keying on `refund:<charge.id>` rather than fuzzy note matching; the webhook verifies signatures from the raw request body and only flips an invoice to `paid` once cumulative payments cover the total.
  - **Public-before-auth routing** — token-accessed pages (`/sign/:token`, `/proposal/:token`, `/inquire`) mount before the global session guard, while everything else sits behind auth; a real security pass added Helmet CSP, session-cookie hardening, login rate limiting, and removed a leaky webhook-secret endpoint.
  - **Production hardening** — GitHub Actions CI (typecheck → lint → build → npm audit → smoke-test against a Postgres service container), multi-stage Dockerfile, graceful SIGTERM shutdown that drains requests and closes the PG pool, and a public `/api/health` endpoint.
- **Architecture:** React SPA → Express domain routers (`auth`, `projects`, `invoices`, `contracts`, `packages`, `proposals`, `public`, `financial`, `gear`, `ai`, `calendar`, `webhooks`, `system`) → Drizzle storage layer → NeonDB (30 tables). Stripe/Gmail/Google Calendar/Claude integrations bolt onto the server; WebSocket broadcasts changes back to both clients.

## Proof points
- **30 tables** in the Drizzle schema (projects, invoices, line items, payments, contracts, contract templates, packages, proposals, inquiries, SOPs, conversations, messages, and more).
- Real money moves through it — Stripe Payment Links + webhook-confirmed payments, with server-side amount bounds ($0.01–$100k).
- Migrated the production database off Replit's built-in Postgres onto the studio's own NeonDB (all 20-then-30 tables, enums, constraints, and data copied) so the business owns its data.
- Iterated in public via a dated changelog — from first backend (Feb 2026) through invoicing, contracts/proposals (the "HoneyBook-replacement" phase), and a full CI/CD + security hardening pass (Jun 2026).

## What to show
- **Demo:** Deploy to a public URL with a seeded demo tenant (repo stays private). A visitor should be able to open a sample project, view an invoice with a Stripe test link, and open a public contract-sign page.
- **Visuals needed:** the project pipeline board; an invoice detail with the Send modal (blur real client names/emails/amounts); the public contract-sign page with a drawn signature; the SOP Claude chat panel mid-stream; a small architecture diagram (React → Express routers → NeonDB, with Stripe/Gmail/Claude on the side). Mark all client PII and `workwithla.media` addresses as blur-sensitive.

## Cross-links
- Shares the **NeonDB + Drizzle + Express + React/Radix/TanStack** stack and the "own-your-data migration" move with [Mind Games](mind-games.md).
- The commercial front door for the same business is [the LA Media website](la-media-website.md) — this dashboard is the back office behind it.
- Part of the Photography & LA Media cluster with [LightLog](lightlog.md) and [photo-file-copier](photo-file-copier.md).

## Case-study angle
Alex built a payments-grade internal platform for his own studio — 30 tables, Stripe, contracts, and real invoice-race and webhook-signature hardening — proving he treats "just an internal tool" with production security discipline the moment real money runs through it.
