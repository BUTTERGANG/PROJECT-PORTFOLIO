---
project: Earl's Auction Scraper & Monitor
repo: BUTTERGANG/EARLS
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: advanced
status: live
---

# Earl's Auction Scraper & Monitor
**One-liner:** A Playwright scraper that watches every lot at Earl's live auctions, tracks each bid over time, looks up the retail price, and tells me the actual dollars-and-percent savings — so I know which lots are a real deal before I bid.

## Origin (the Build Loop)
> Because I was **bidding at Earl's live auctions**, I kept hitting **the problem that a "cheap" winning bid means nothing unless I know what the item retails for right now**, so I built **a monitor that scrapes every lot, tracks the price on each cycle, and compares it against a Google Shopping retail lookup**, that **prints a savings report — dollar and percentage off retail — for the whole auction**. It taught me **how to reliably read a JavaScript-heavy site with a real browser, and how to keep a long-running monitor cheap by caching retail lookups and rate-limiting the searches.**

## The problem
Earl's runs live online auctions where prices move as people bid. The whole game is buying under retail, but in the moment you're staring at a lot title and a current bid with no idea whether $40 is a steal or a wash. I needed something continuously watching the auction, resolving each lot to a retail price, and doing the savings math for me.

## What it does
- Scrapes all active auctions and lots from earlsauction.com via Playwright (real-browser rendering for a JavaScript-heavy site)
- Continuous **daemon mode** monitoring on a configurable interval (default 30 min)
- **Price-change detection** — logs new bids, increases, and decreases per lot over time
- **Retail price lookup** — searches Google Shopping per lot and caches the result
- **Savings calculation** — auction price vs. retail, in dollars and percent
- **Scraper v2 (Aug 2026)** — **realtime WebSocket client** that reverse-engineered the auction site's live protocol (`graphql-transport-ws` subscriptions, validated browser-free and documented in `docs/REALTIME_PROTOCOL.md`), plus an **eBay pricing-floor module** for comp resolution
- Full history in SQLite (`auctions.db`): auctions, lots, price history, retail products, comparisons, and a lot-change log
- CLI: single-run (`--once`), daemon, CSV/JSON export, manual retail products, and per-lot price history

## How it's built
- **Stack:** Python, Playwright (Chromium), SQLite, Google Shopping for retail comps.
- **Notable engineering:**
  - **Realtime protocol reverse-engineering (v2).** The v1 poller became a realtime subscriber: the site's `graphql-transport-ws` subscription protocol was reverse-engineered from the browser's WebSocket traffic, validated without a browser session, and documented — bids now arrive as they happen instead of on a polling interval.
  - **Real-browser rendering.** Playwright driving Chromium renders the JavaScript-heavy auction site that plain HTTP scrapers can't read, so the data comes back complete and reliable.
  - **Time-series price tracking.** Every monitoring cycle timestamps each lot's price into `price_history`, and a `lot_change` table logs new/removed lots between cycles — so the tool captures the whole arc of an auction, not just a snapshot.
  - **Cost-controlled retail lookups.** Retail searches are the expensive, rate-limit-sensitive part, so results are cached in `retail_products` and the run is bounded by `MAX_RETAIL_SEARCHES_PER_CYCLE` (default 15) with a `RETAIL_SEARCH_INTERVAL_SECONDS` delay (default 3s) between searches. A `SKIP_KEYWORDS` list drops lots that aren't worth a retail comparison.
  - **Savings engine** joins current auction price against cached retail into `price_comparisons` with dollar and percentage savings.
- **Architecture:** `run.py` is the CLI entry — `--once` does one scrape + comparison + report; bare `run.py` runs the monitoring daemon on `CHECK_INTERVAL_SECONDS`. `scraper.py` handles the Playwright fetch (and can emit standalone JSON), `retail_lookup.py` does Google Shopping + caching, `database.py` owns the SQLite schema, `monitor.py` drives the continuous loop, `config.py` centralizes the tunables.

## Proof points
- **6 SQLite tables** modeling the full lifecycle: auctions → lots → timestamped price history → retail products → savings comparisons → lot-change log.
- **Realtime v2** — reverse-engineered `graphql-transport-ws` protocol documented and implemented browser-free, replacing the 30-minute poll with live bid events.
- Retail lookups **capped at 15/cycle** with a 3s delay and a persistent cache — a long-running monitor that doesn't hammer Google.
- JavaScript-heavy target read reliably with a real Chromium browser.
- Exports to **CSV and JSON** for offline sorting of the best deals.

## What to show
- **Demo:** No clickable UI — it's a scraper/CLI + background monitor. Show terminal output and exports.
- **Visuals needed:** the `--once` comparison report in the terminal (lot, current bid, retail, $ saved, % off); a `deals.csv` export opened in a spreadsheet sorted by % savings; optionally a snippet of the price-history table showing a lot's bid climbing across cycles.

## Cross-links
- Shares the **scrape → resolve a comp → compute savings** shape with [price-scrapers](price-scrapers.md) (grocery prices across stores) and the retail-comparison half of [thrift-lens](thrift-lens.md).
- Real-browser rendering of a JavaScript-heavy site is the same core challenge taken much further in [TheKnot scraper](theknot-scraper.md).

## Case-study angle
Alex turned live-auction bidding into a data problem: a continuous monitor that tracks every lot's price over time and computes real savings against retail, so the buy decision is backed by numbers instead of adrenaline.
