---
project: Romaleos 2 Tracker
repo: BUTTERGANG/romaleos-2-tracker
visibility: public
demo_url: ""
demo_type: live
cluster: deal-hunting
tier: standard
status: live
---

# Romaleos 2 Tracker
**One-liner:** A price tracker and listing finder for Nike Romaleos 2 weightlifting shoes — live eBay Browse API search, US-size extraction, smart watches, and Discord alerts.

## Origin (the Build Loop)
> Because I **compete in weightlifting and Romaleos 2s are the grail shoe — discontinued, so the only market is eBay resellers**, I kept hitting **the fact that good pairs appear randomly, sell fast, and every listing hides its size inside a messy title**, so I built **a tracker that polls the eBay Browse API, extracts the US size from each title, and pings Discord when a watch matches**, that **turns "check eBay obsessively" into a filter and a push notification.** It taught me **that the hard part of deal-hunting isn't finding listings — it's structuring them (size, condition, freshness) so an alert can be trusted.**

## The problem
Romaleos 2s haven't been made in years. eBay is the only market, listings are hit-or-miss (fakes, wrong sizes, beat pairs), and the good ones sell within hours. Refreshing eBay all day isn't a strategy — a structured feed with size/condition/price filters and instant alerts is.

## What it does
- **Live eBay listings** via the official Browse API, with automatic **US-size extraction** from listing titles.
- **Filter & sort** by price range, condition, size, and newest/price/ending-soonest.
- **Freshness-aware UI** — relative ages ("7h ago"), NEW badges on fresh listings, and a last-synced indicator on the dashboard.
- **Smart watches** — alerts for a specific size (or size range) and price range.
- **Discord notifications** — one ping per matching listing via configurable webhook.
- **Background polling** every 30 minutes, plus immediate poll on startup if the cache is empty.

## How it's built
- **Stack:** Python (FastAPI), eBay Browse API (OAuth), Discord webhooks, vanilla JS dashboard; ~84K lines across Python/HTML/CSS/Shell.
- **Notable engineering:**
  - **eBay-compliant caching** — respects the API's cache headers so the poller stays within policy instead of hammering search.
  - **Size extraction from messy titles** — "Nike Romaleos 2 size 10.5 mens" / "R2 45 EU" / "WMNS 8" all normalize to a structured US size, which is what makes per-size watches possible.
  - **Dedup + NEW detection** — listings are tracked across polls so alerts fire once per listing, not once per refresh.
- **Architecture:** eBay Browse API poller → SQLite cache → FastAPI dashboard (filter/sort) → Discord webhook alerts on watch matches.

## Proof points
- Official API (not scraping) — OAuth'd Browse API with compliant caching.
- **US-size extraction** from unstructured titles — the feature that makes watch alerts meaningful.
- 30-minute background polling with startup backfill, deployed and running.

## What to show
- **Demo:** The dashboard with a filtered listing table and a watch configuration.
- **Visuals needed:** the listing table with size/condition/age columns; a Discord alert message; the watch editor.

## Cross-links
- The **track → filter → alert** shape is the deal-hunting thread with [EARLS](earls.md), [price-scrapers](price-scrapers.md), and [public-storage-bot](public-storage-bot.md).
- Shares the **official-API-with-OAuth** approach (vs. scraping) with [ebay-endpoint](ebay-endpoint.md) and [k9-overwatch](k9-overwatch.md)'s Petfinder integration.
- The weightlifting tie-in puts it alongside [mind-games](mind-games.md) and [weightlifting-equipment](weightlifting-equipment.md).

## Case-study angle
The domain-moat pattern again: only a lifter knows Romaleos 2s are the grail shoe, that the eBay market is the whole market, and that size-in-title parsing is what makes an alert trustworthy. A weekend build that replaced an obsessive refresh habit with a filter and a webhook.