---
project: Skyscanner Flight Tracker
repo: BUTTERGANG/skyscanner-scraper
visibility: private
demo_url: ""
demo_type: live
cluster: deal-hunting
tier: advanced
status: live
---

# Skyscanner Flight Tracker
**One-liner:** A weekend flight-deal platform that beats Skyscanner's PerimeterX anti-bot — mobile-API PX cookie solving + residential proxies feeding a self-hosted deal tracker with price history and 200+ destination coverage.

## Origin (the Build Loop)
> Because I **hunt weekend flight deals from Indianapolis**, I kept hitting **the fact that Skyscanner blocks every scraper behind PerimeterX — instant 403s, JS challenges, fingerprinting**, so I built **a two-part system: a scraper that solves PX challenges on Skyscanner's mobile API through residential proxies, and a self-hosted tracker app that turns the feed into price history and deal alerts**, that **replaces "refresh Skyscanner for an hour" with a dashboard that watches 200+ destinations daily.** It taught me **that anti-bot bypass at this level is a systems problem — cookie solving, proxy rotation, and API choice matter more than any single trick.**

## The problem
Skyscanner sits behind PerimeterX: plain requests get fingerprinted and blocked, headless browsers get challenged, and there's no public API for the flexible-date searches that actually find weekend deals. The only paths in are the mobile API (with PX cookie solving) or a fully stealthed real browser.

## What it does
- **Scraper** — three-tier fallback: **Skyscanner mobile API** (PX cookie solver + residential proxy) → **Playwright stealth browser** → **Bright Data managed proxy**.
- **Tracker app (SkyApp)** — self-hosted FastAPI app: set a home airport, track cheapest weekend trips to major destinations, background refresh (on-demand + daily scheduled), price history, visual comparison, one-click booking links.
- **200+ destinations** with dynamic airport mapping, served from a VPS API on :8010.

## How it's built
- **Stack:** Python (both sides), Playwright (stealth-patched), PX cookie solver, residential proxies (DataImpulse), FastAPI + APScheduler + SQLite (app), VPS API + Replit UI.
- **Notable engineering:**
  - **PerimeterX bypass on the mobile API** — solved PX cookies + residential IP rotation, chosen over browser automation for speed; browser path kept as fallback.
  - **Two-repo architecture** — the scraper (credential-heavy, VPS) is decoupled from the tracker (public-facing, Replit), so proxy credentials never touch the web app.
  - **APScheduler background refresh** — daily sweep + on-demand polls, SQLite price history underneath.
- **Architecture:** cron/daily trigger → mobile-API search (PX solver + proxy) → price feed → VPS API :8010 → SkyApp dashboard (Replit) with price history + booking links.

## Proof points
- **Working PX bypass against one of the most aggressive anti-bot deployments in travel.**
- **200+ destinations tracked daily** with price history and visual comparison.
- **Running in production** — VPS API auto-starts on boot; the app refreshes on a schedule without babysitting.

## What to show
- **Demo:** The SkyApp dashboard (weekend grid + price history). The scraper side is credential-heavy — case-study-only.
- **Visuals needed:** the weekend-deal grid for a home airport; a price-history chart for one route; the architecture diagram (mobile API → PX solver → proxy → feed → app).

## Cross-links
- The **anti-bot ladder** (mobile API → stealth browser → managed proxy) is the most advanced rung of the scraping thread: [price-scrapers](price-scrapers.md), [EARLS](earls.md), [theknot-scraper](theknot-scraper.md), [infra-metals-dashboard](infra-metals-dashboard.md).
- The **track → history → alert** app shape matches [romaleos-2-tracker](romaleos-2-tracker.md) and [public-storage-bot](public-storage-bot.md).

## Case-study angle
The portfolio's deepest anti-bot work: a PerimeterX bypass good enough to run daily against Skyscanner, wrapped in a two-repo architecture that keeps credentials off the public app. **Scraper-as-infrastructure, not scraper-as-script.**
