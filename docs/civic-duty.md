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
**One-liner:** A civic-data aggregator that grew from a single city into a 3-region platform — Fishers, Indianapolis public safety, and Hamilton County GIS — unifying council votes, procurement bids, campaign finance, zoning, court records, crime/crash/use-of-force data, 311 requests, and county parcel/school/park layers into one searchable, alerting dashboard.

## Origin (the Build Loop)
> Because I **wanted to actually know what my local government was doing**, I kept hitting **the reality that the information exists but is scattered across a dozen municipal portals nobody reads**, so I built **a scheduled aggregator that scrapes each source nightly and unifies it into one dashboard**, that **makes local government activity searchable in one place**. It taught me **to orchestrate reliable, scheduled data collection across many hostile sources — the same scraping discipline behind [Mind Games](mind-games.md).**

## The problem
Local government is where decisions actually touch your street — zoning, contracts, who's funding whom — but it's published across separate portals in separate formats, updated on nobody's schedule, and effectively invisible. I wanted a single dashboard that watched all of it, starting with Fishers (a city in Hamilton County) and kept itself current without me babysitting it.

## What it does
- **Fishers** (original scope): council votes, procurement/bids, campaign finance, zoning changes, and court records.
- **Indianapolis** (added later): council votes, crime incidents, traffic crashes, citations, use-of-force records, 311 service requests, and parcels — all public-safety data.
- **Hamilton County** (added later): county-wide GIS layers — parcels (covering Fishers/Carmel/Noblesville/Westfield/etc.), buildings, tax districts, schools, parks, and polling locations.
- **Alerting** — user-defined keyword and geo-radius alert rules; a matching engine fires an in-app alert the moment a new record (council item, crime incident, zoning notice) matches.
- Runs on a nightly (or, for some Indianapolis/county layers, weekly) schedule, each source staggered on its own cadence and logged for freshness tracking.
- Parses source PDFs into structured records.
- Serves it all through one searchable, JWT-authenticated dashboard with rate-limited endpoints.

## How it's built
- **Stack:** TypeScript + Express API; `node-cron` scheduled jobs; Playwright scrapers; ArcGIS FeatureServer clients; PostgreSQL (`pg`); JWT auth (`jsonwebtoken` + `bcryptjs`); `pdf-parse` for document extraction; `csv-parse`; CivicClerk OData API and Municode Meetings Portal for council votes; Indiana FCPA CSV/ZIP streaming for campaign finance.
- **Notable engineering:**
  - **Scheduled multi-source ingestion** — staggered `node-cron` jobs, each wrapped in a logging helper that writes freshness-tracking rows, so each of ~20 sources is scraped on its own cadence.
  - **Mixed extraction across ~20 sources** — an official OData API where one exists (CivicClerk council votes), a scraped municipal meetings portal for Indianapolis council, a shared `ArcgisScraper` base class (pagination, upsert, alert-firing) reused across a dozen ArcGIS FeatureServer layers (crime, crashes, parcels, schools, parks, polling), Playwright for on-demand court lookups, and `pdf-parse` for records only published as PDFs.
  - **Alert engine** — keyword and geo-radius rule matching runs against every batch of new records as it's ingested, so a user-created alert rule fires without a separate polling job.
  - **Safe migrations** — `ALTER TABLE IF NOT EXISTS` schema management for a database that evolves as sources are added.
  - **Auth + rate limiting** — JWT-protected API (`requireAuth` middleware), with dedicated rate limiters on the API, auth, and court-lookup endpoints, and pagination bounds clamped server-side.
- **Architecture:** `node-cron` triggers → per-source scrapers (OData / Municode / ArcGIS / Playwright / PDF) → normalized rows in Postgres → alert engine evaluates new rows against user rules → Express API (JWT, rate-limited) → searchable, alerting dashboard.

## Proof points
- Grew from **5 civic data categories in one city** to **~20 data modules across 3 regions** (Fishers, Indianapolis, Hamilton County).
- A reusable ArcGIS scraper base class let a dozen county/city GIS layers get added without re-solving pagination and upsert logic each time.
- Live alerting — keyword/geo rules matched against new records in real time, not just a static dashboard.
- Staggered nightly-to-weekly scraping across sources with different access methods, all logged for freshness tracking.
- PDF-to-structured-data parsing, not just HTML scraping.

## What to show
- **Demo:** Deploy to a public URL (repo stays private) with seeded/public data behind a demo login.
- **Visuals needed:** the unified dashboard/search; a council-votes or zoning detail view; the alert-rule creation flow; a small diagram of the 3-region, ~20-source ingestion schedule.

## Cross-links
- Shares the **Playwright scraping + scheduled ingestion** craft with [Mind Games](mind-games.md), [price-scrapers](price-scrapers.md), and [k9-overwatch](k9-overwatch.md).

## Case-study angle
Civic-tech that's really a data-engineering showcase: Alex built a self-updating pipeline that started covering one city and grew, source by source, into a 3-region platform spanning ~20 hostile municipal and county data sources with live alerting — the kind of unglamorous, reliable ingestion work that runs a real operation, and that scales cleanly when the scope grows past the original plan.
