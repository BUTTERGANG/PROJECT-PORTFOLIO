---
project: Gear Rental
repo: BUTTERGANG/gear-rental
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: photo
tier: advanced
status: live
---

# Gear Rental
**One-liner:** The rental desk LA Media never had — a FastAPI platform that prices a lens off live eBay comps, writes and e-signs the rental agreement, takes the fee up front, holds a damage deposit on the same card, and chases the gear until it comes back.

## Origin (the Build Loop)
> Because I was **lending LA Media's cameras and lenses to other shooters**, I kept hitting **the fact that a rental between friends is all handshake — no agreement anyone signed, no deposit, no record of what went out or when it was due, and no idea what the gear was even worth if it came back broken**, so I built **a rental platform that values every item from eBay comps, generates a signed agreement with a real audit trail, captures the fee and a damage hold through Stripe, and emails the renter before the gear is late** that **turns a favor into an actual, insured, documented rental business**. It taught me **that the moment money and liability enter a hobby is the moment the paperwork — and the system that produces it — becomes the product.**

## The problem
LA Media owns gear worth more than the shoot day pays for. Lending it out meant: no signed terms, no idea what the replacement cost was if something came back cracked, no upfront payment, and nothing that remembered a return date. Every rental was a new negotiation and a new risk. Doing it at any volume needed three things the business didn't have — a defensible price, a signed agreement, and a hold that covers the gear.

## What it does
- **Rental agreements in three formats** — PDF, Word (`.docx`) or HTML, generated per rental and downloadable in one click.
- **E-signature with a legal audit trail** — canvas or typed signature, captured IP, browser, OS, device fingerprint, optional geolocation, server UTC timestamp plus client timezone, an explicit consent checkbox, and a **SHA-256 hash of the document at signing** for tamper evidence.
- **Email verification before signing** — a 6-digit OTP, 10-minute expiry, stored hashed, 5-attempt lockout. No signature without a verified address.
- **Automated email lifecycle** — the agreement lands as an attachment with a "Sign your agreement" button; a daily cron emails renters when gear is overdue or due within 3 days; renter replies are ingested back into their CRM communication log. Every send is logged per rental.
- **eBay-powered valuation** — active *and* sold comps are pulled to establish an item's replacement cost, which then drives every number downstream.
- **Industry-standard rate model** — cameras ~4%, lenses ~3%, grip ~2% of replacement value per day, with a weekly discount (4× daily), weekend billing (Fri–Mon = 2 days), and a live price calculator on the booking page.
- **Payments and damage holds** — the full rental fee is captured up front via Stripe PaymentIntent; a damage pre-authorization hold of **100% of replacement value** is placed with `capture_method: manual` and released on undamaged return, or captured full or partial against a reported incident.
- **Business ops** — equipment inventory with specs, serials and condition; a renter CRM with profiles, rental history and a communication log; a dashboard covering revenue, utilization and most-rented gear; a reminders page.
- **No client JS framework** — the whole UI is server-rendered Jinja2 templates that work on a phone at the counter.

## How it's built
- **Stack:** FastAPI, Jinja2 templates, SQLite, ReportLab (PDF), `python-docx` (Word), Stripe, AgentMail, eBay Browse API.
- **Notable engineering:**
  - **The agreement is a data structure before it's a document.** One rental record renders to three output formats plus the sign page, so signing, hashing and exporting all read the same source and can't drift.
  - **Every external service degrades gracefully.** With no eBay key the app falls back to manual valuation; with no Stripe key the paper trail still works; with no AgentMail key the OTP step is skipped rather than dead-ending the flow — so the platform is usable on day one and gets progressively stricter as keys are added.
  - **Inbound email wired back into the CRM** — the AgentMail webhook turns a renter's reply into a logged communication against the right rental, so the paper trail isn't one-way.
  - **Multi-step payment state machine** — create intent → confirm fee → place hold → release or capture, each stage exposed as its own endpoint so a partial failure leaves a recoverable state rather than a silent gap.
- **Architecture:** FastAPI app (47 routes) serving Jinja2 pages and a small JSON API for the payment/OTP/eBay actions → SQLite for rentals, renters, equipment, email log and signature records → ReportLab/python-docx for document generation → Stripe, AgentMail and the eBay Browse API as side services. A cron script (`scripts/daily_reminder.py`) drives the lapsed-return emails.

## Proof points
- **47 routes** across inventory, renters, rentals, agreements, payments, damage, email/OTP and export.
- **Three deliverables from one record** — PDF, `.docx` and HTML agreements, plus the public signing page.
- **Tamper-evident signatures** — SHA-256 document hash stored alongside IP, UA, OS, device fingerprint and geolocation.
- **Money handled properly** — upfront capture *and* a separate manual-capture hold for damage, with full or partial capture on incident.
- **Valuation is sourced, not guessed** — replacement cost comes from live eBay active + sold listings, and the daily rate is derived from it by category.

## What to show
- **Demo:** none clickable — the app is deploy-ready (`.replit` + `replit.nix` included) but not published, and the repo stays private. This is a screenshot + recording case study.
- **Dashboard** — revenue, utilization, most-rented gear.
- **Rental detail** — the agreement export buttons (PDF / Word / HTML) next to the payment state.
- **Sign page mid-signature** — canvas signature with the audit-trail fields visible (IP, device fingerprint, timestamp, consent).
- **Price calculator** — responding live to a date change, showing the weekend rule and the weekly discount.
- **Payments** — a Stripe PaymentIntent for the fee *and* the separate manual-capture damage hold.
- **Reminders page** — an overdue item with its email log.
- **Architecture diagram** — FastAPI → SQLite, with Stripe, AgentMail and the eBay Browse API on the side.
- **Blur-sensitive:** renter names, emails, amounts, and any Stripe keys shown in Settings.

## Cross-links
- Part of the **Photography & LA Media** cluster with the [LA Media Dashboard](la-media-dashboard.md), the [LA Media Website](la-media-website.md), [LightLog](lightlog.md) and [photo-file-copier](photo-file-copier.md).
- Reads like its siblings: the [LA Media Dashboard](la-media-dashboard.md) runs invoicing and contracts for the same business, and **Complete Paperwork** takes the same "turn a document into structured data" instinct in the opposite direction.
- Pricing off live marketplace comps is the same pattern as [thrift-lens](thrift-lens.md) and [romaleos-2-tracker](romaleos-2-tracker.md).

## Case-study angle
Alex owned real gear, started lending it, and instead of writing a note in his phone he built the whole back office: valuation from live market data, a signed agreement with a hash for tamper evidence, a payment and a deposit hold on the same card, and a cron job that chases the return.
