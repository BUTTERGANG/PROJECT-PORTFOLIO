---
project: CivicDuty
repo: BUTTERGANG/CIVIC-DUTY
visibility: private
demo_url: ""
demo_type: live
cluster: civic
tier: advanced
status: live
---

# CivicDuty
**One-liner:** A civic-data aggregator for Fishers, Indiana that pulls council votes, procurement bids, campaign finance, zoning changes, and court records into one searchable dashboard — on a nightly scraping schedule.

## Origin (the Build Loop)
> Because I **wanted to actually know what my local government was doing**, I kept hitting **the reality that the information exists but is scattered across a dozen municipal portals nobody reads**, so I built **a scheduled aggregator that scrapes each source nightly and unifies it into one dashboard**, that **makes local government activity searchable in one place**. It taught me **to orchestrate reliable, scheduled data collection across many hostile sources — the same scraping discipline behind [Mind Games](mind-games.md).**

## The problem
Local government is where decisions actually touch your street — zoning, contracts, who's funding whom — but it's published across separate portals in separate formats, updated on nobody's schedule, and effectively invisible. I wanted a single dashboard that watched all of it for Fishers (a city in Hamilton County) and kept itself current without me babysitting it.

## What it does
- Tracks **council votes, procurement/bids, campaign finance, zoning changes, and court records** for Fishers, IN.
- Runs on a nightly schedule — council 6am, bids 7am, zoning 8am, campaign finance Monday 9am.
- Parses source PDFs into structured records.
- Serves it all through one searchable, authenticated dashboard.

## How it's built
- **Stack:** TypeScript + Express API; `node-cron` scheduled jobs; Playwright scrapers; PostgreSQL (`pg`); JWT auth (`jsonwebtoken` + `bcryptjs`); `pdf-parse` for document extraction; `csv-parse`; CivicClerk OData API for council votes.
- **Notable engineering:**
  - **Scheduled multi-source ingestion** — staggered `node-cron` jobs so each source is scraped on its own cadence.
  - **Mixed extraction** — an official OData API where one exists (CivicClerk council votes), Playwright scraping where it doesn't, and `pdf-parse` for records only published as PDFs.
  - **Safe migrations** — `ALTER TABLE IF NOT EXISTS` schema management for a database that evolves as sources are added.
  - **Auth layer** — JWT-protected API (`requireAuth` middleware) around the dashboard.
- **Architecture:** `node-cron` triggers → per-source scrapers (OData / Playwright / PDF) → normalized rows in Postgres → Express API (JWT) → searchable dashboard.

## Proof points
- 5 distinct civic data categories unified.
- Staggered nightly scraping across sources with different access methods.
- PDF-to-structured-data parsing, not just HTML scraping.

## What to show
- **Demo:** Deploy to a public URL (repo stays private) with seeded/public Fishers data behind a demo login.
- **Visuals needed:** the unified dashboard/search; a council-votes or zoning detail view; a small diagram of the nightly ingestion schedule.

## Cross-links
- Shares the **Playwright scraping + scheduled ingestion** craft with [Mind Games](mind-games.md), [price-scrapers](price-scrapers.md), and [k9-overwatch](k9-overwatch.md).

## Case-study angle
Civic-tech that's really a data-engineering showcase: Alex built a self-updating pipeline that scrapes five kinds of hostile municipal sources on a schedule and makes local government legible — the kind of unglamorous, reliable ingestion work that runs a real operation.

> Note: the portfolio spec earlier called this "Hamilton County" — the actual scope is **city-level, Fishers, IN** (which sits within Hamilton County). Use the accurate framing.
