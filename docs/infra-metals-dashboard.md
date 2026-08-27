---
project: Infra Metals Dashboard
repo: BUTTERGANG/infra-metals-dashboard
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: advanced
status: live
---

# Infra Metals Dashboard
**One-liner:** A zero-budget commodities and macro-cycle dashboard tracking 93 data series across 8 metals, 15 stocks, 28 macro indicators, COT, LME, and ERCOT — all from free sources.

## Origin (the Build Loop)
> Because I **wanted to understand commodity cycles without paying for Bloomberg or Reuters**, I kept hitting **the fact that all the useful macro data is free — it's just scattered across 20 government sites, exchange portals, and PDFs, each with its own auth wall and export format**, so I built **a dashboard that collects 93 data series from zero-budget sources and renders them as clean charts**, that **lets me see demand vs output divergence, inventory trends, and volatility signals from one page**. It taught me **that institutional-quality macro research is accessible to anyone willing to reverse-engineer a PDF and a few Playwright flows.**

## The problem
Professional macro research costs $2,000+/month for Bloomberg or Reuters terminals. The underlying data is mostly free — USGS, BLS, LME, SHFE, EIA, CFTC — but it lives in PDFs, password-protected Excel files, and JavaScript-rendered tables behind Cloudflare. Getting 8 metals, 15 mining stocks, 28 macro series, and a COT ladder onto one page without paying anyone is a collection problem, not an insight problem.

## What it does
- **93 data series** covering 8 metals (Cu, Al, Zn, Pb, Ni, Sn, steel rebar, hot-rolled coil), 15 major mining equities, 28 macro indicators (PMI, industrial production, housing, durable goods, capacity utilization).
- **LME warehouse inventory** scraped from real-browser Playwright against the LME website's XLSX export.
- **SHFE (Shanghai Futures Exchange)** — Playwright automation through the Chinese exchange's JavaScript-heavy data portal, with PDF-embedded tabular data extraction and PoW challenge handling.
- **COT (Commitments of Traders)** — CFTC data for copper, silver, gold, and 6 other commodities showing commercial vs non-commercial positioning.
- **ERCOT power prices** — Texas grid energy cost data.
- **Volatility pingers** — alert on unusual movement, not price-direction signals.
- **Dalio-category sorting** — series tagged by "inventories," "demand," "supply," "cost structure," "financial conditions," "policy" following Ray Dalio's macro framework.

## How it's built
- **Stack:** HTML, JavaScript, Chart.js; Yahoo Finance for equities; LME (Playwright XLSX); SHFE (Playwright PDF + PoW); CFTC for COT; EIA for energy; USGS for supply data.
- **Notable engineering:**
  - **WAF ladder for SHFE** — the Shanghai exchange's data portal uses Cloudflare challenges and JavaScript-rendered tables. The scraper navigates the PoW challenge, extracts PDF data with a 2-page probe, and formats timestamps using the non-standard `kx{date}.dat` convention.
  - **LME via Playwright XLSX** — the LME portal generates XLSX files on demand behind a real-browser session; the scraper logs in, triggers downloads, and parses the cells.
  - **Playwright reliability** — the same real-browser discipline used across the portfolio applied to financial data portals.
- **Architecture:** 8 cron-triggered scrapers (Python, Playwright, HTTP clients) → JSON data files → static HTML dashboard (Chart.js). Deployed via cron on VPS and mirrored to Replit.

## Proof points
- **93 data series maintained from zero-cost sources** — no Bloomberg, no Quandl, no paid API. Everything is scraped or parsed from government/exchange sites.
- **3 production crons** — Monday 8AM digest, Friday 6PM physical update, Monday 2PM power update, monthly LME+watchdog. All running on VPS.
- **Tin thesis confirmed** — the dashboard's demand-vs-output divergence analysis flagged tin supply tightness before mainstream coverage.
- **Dalio categorization** applied to every series — not just raw numbers, but the lens that institutional research desks use.

## What to show
- **Demo:** Case-study-only (private VPS + Replit host). The dashboard itself is the deliverable — it's a fully rendered static HTML page with 93 charts.
- **Visuals needed:** the dashboard overview page showing the 93-series grid; the copper COT ladder chart with commercial vs non-commercial positioning; the Dalio-views panel showing category breakdown; the SHFE extraction flow (playwright → PDF → data).

## Cross-links
- The **Playwright extraction discipline** connects this to [EARLS](earls.md), [price-scrapers](price-scrapers.md), and [theknot-scraper](theknot-scraper.md).
- The **cron + dashboard delivery pattern** is the same architecture as [productivity-tracker](productivity-tracker.md) and the Master Dashboard.
- Shares the **commodity domain** with [metals-research](metals-research.md).

## Case-study angle
This is the best proof that Alex can do institutional-quality research without an institutional budget. Twelve distinct data sources, three extraction techniques (API, Playwright, PDF), 93 series, all maintained by automated cron — and the analysis is sophisticated enough to catch a real supply-tightness signal before it hit the news. **He built his own Bloomberg terminal from government PDFs and Chinese exchange portals.**