---
project: WeddingOS
repo: BUTTERGANG/WeddingOS
visibility: private
demo_url: ""
demo_type: live
cluster: weddings
tier: anchor
status: live
---

# WeddingOS
**One-liner:** An all-in-one wedding platform that replaces HoneyBook + Pixieset + Calendly + DocuSign in one tenant — CRM, galleries, invoicing, timeline, contracts, print store, and partial payments.

## Origin (the Build Loop)
> Because I **DJ and MC weddings every weekend and saw how fragmented the vendor-side tooling was**, I kept hitting **the fact that couples want one login for everything but vendors send them to five different apps**, so I built **WeddingOS — a single-tenant platform that handles every client workflow from inquiry to final delivery**, that **lets couples schedule, sign, pay, browse galleries, and approve timelines in one place**. It taught me **that when you build for your own workflow you find the cracks no SaaS product sees — partial payments with a hold, print-store margin, the empty state when a couple hasn't uploaded anything yet.**

## The problem
Most wedding tech solves one piece: HoneyBook for CRM, Pixieset for galleries, Calendly for scheduling, DocuSign for contracts. None of them talk to each other, and the vendor pays for all of them. For a client, that means five logins, five portals, and a fragmented experience. For the vendor, it means maintaining integrations that don't exist. I wanted one tenant where couples can do everything — and where the vendor has full control of the margin stack.

## What it does
- **Client CRM** — intake, communication, status tracking per-couple
- **Photo galleries** — curated couple-facing galleries with print store integration
- **Invoicing with partial payments** — collect payments with a hold-and-release pattern (not just fixed installments)
- **Contracts & e-signatures** — built-in, no third-party signing service
- **Timeline planner** — day-of run-of-show linked to the guest workflow
- **Guest management** — CSV import with deduplication, RSVP tracking
- **Print store** — couple-facing merchandise store built into their portal
- **Budget tracking** — per-event budget visibility with actuals
- **Reminder system** — cron-based email reminders (ready for AgentMail, running in dry-run)

## How it's built
- **Stack:** TypeScript, React, Tailwind; Neon (serverless PostgreSQL); Drizzle ORM; Express; Zincir (CSRF); AgentMail (transactional email, key pending); Stripe (payments, key pending)
- **Notable engineering:**
  - **Security-hardened from day one** — Zod validation on every mutation, CSRF double-submit cookie pattern, strict Content-Security-Policy in production, bcrypt password policy with minimum strength enforcement, multer file-upload hardening.
  - **Partial payments with a hold** — not just "split into N installments." A payment can be partially collected with the remainder held against the booking, with status tracking per-payment.
  - **CSV import with dedupe** — guest list upload that matches against existing entries by name+email and shows a merge preview before committing.
  - **Numbered SQL migrations** — no ORM-push against shared Neon; every schema change goes through a versioned migration file.
- **Architecture:** React SPA → Express API → Drizzle ORM → Neon PostgreSQL. Monorepo with `packages/server`, `packages/db`, `packages/shared`.

## Proof points
- **68/68 smoke tests passing** covering every mutation endpoint — auth, galleries, contracts, invoices, guests, timelines, budgets.
- **23 populated database tables** with seeded demo data across the full schema.
- **Security-hardened:** Zod validation, CSRF double-submit, CSP, password policy, file-upload sanitization — all in a personal project that I'd trust for live client data.
- **Code-split frontend to 199KB** through lazy route loading — the entire SPA loads faster than most landing pages.
- **Full-stack from one person** — design, schema, API, contracts, payments, email, security, CI.

## What to show
- **Demo:** Deploy to a public URL once Stripe + AgentMail keys are in place (repo stays private). Until then, screenshots of each module.
- **Visuals needed:** the couple dashboard showing all modules; the gallery view; the invoice form with partial payment controls; the CSV import merge preview; a simple architecture diagram (React → Express → Drizzle → Neon).

## Cross-links
- Shares the **vendor-workflow domain** with [SALES-BOT](sales-bot.md) (add-on sales negotiation for wedding vendors), [WEDDING-PRICING-COMPARE](wedding-pricing-compare.md), and [Wedding Timeline Planner](wedding-timelines.md).
- The **security hardening** pattern is used across the portfolio (see [WORKOUTFLOW](workoutflow.md) for the same discipline).

## Case-study angle
WeddingOS is the closest thing to a "this could be a real company" project in the portfolio. It replaces five separate SaaS products with one tenant, it's security-hardened for production, and it was built by one person who actually does the job every weekend. **It proves full-stack product ownership — from contracts to CX to print-store margins — in a domain Alex knows from the inside.**