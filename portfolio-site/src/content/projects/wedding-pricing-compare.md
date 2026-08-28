---
project: Wedding Pricing Compare
repo: BUTTERGANG/WEDDING-PRICING-COMPARE
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: advanced
status: live
---

# Wedding Pricing Compare
**One-liner:** A multi-source wedding vendor pricing research tool that scrapes DJ, coordinator, and photobooth pricing from TheKnot, Zola, and WeddingWire — surfacing market rates for a data-advantaged sales approach.

## Origin (the Build Loop)
> Because I **sell wedding services and needed to know exactly what competitors charge across every metro**, I kept hitting **the fact that market-rate data exists — it's just locked inside three giant marketplaces behind rate limits, bot detection, and GraphQL schemas**, so I built **a scrapers pipeline that collects pricing from TheKnot, Zola, and WeddingWire, deduplicates, and renders it as a clean dashboard**, that **lets me quote with actual market support instead of gut feel**. It taught me **that GraphQL introspection works for more than just APIs you own — TheKnot's review graph was cracked open through standard introspection queries.**

## The problem
Wedding vendors need to know the market rate to price competitively, but the pricing data lives inside the three big wedding marketplaces (TheKnot, Zola, WeddingWire) — behind login walls, rate limits, GraphQL endpoints, and bot-detection. Individual vendors can estimate by calling around, but nobody has the actual distribution. I wanted the median, the range, the metro-level breakdown — and I wanted it from real listings, not surveys.

## What it does
- **Multi-source pricing collection** — scrapes DJ, coordinator, and photobooth pricing from TheKnot, Zola, and WeddingWire.
- **Deduplicated vendor database** — cross-references vendors across sources using name, city, and service type matching.
- **Market-rate dashboard** — renders price distributions, medians, and ranges per service type and metro area.
- **Rate-limit and bot-detection analysis** — documented which sources allow what (TheKnot GraphQL is one of the most permissive; WeddingWire is the most aggressive with blocking).

## How it's built
- **Stack:** Python, Playwright, PostgreSQL, HTML/Chart.js dashboard
- **Notable engineering:**
  - **TheKnot GraphQL deck** — discovered via standard introspection on `svc.theknotww.com/reviews-api/graphql`. The `x-tenant-id:tk-us` header and `storefrontId` filter unlocked paginated review access. `Comment.content` and `ratings[].value` fields exposed full vendor feedback. **This wasn't a reverse-engineered private API — a standard introspection query showed the deck.**
  - **Playwright for Zola/WeddingWire** — both sites require real-browser rendering; Zola is navigable with careful rate limiting, WeddingWire triggers blocking thresholds around 50 requests.
  - **Cross-source deduplication** — matching vendors across three sources with different naming conventions, same vendor in different cities.
  - **PostgreSQL at scale** — 1,734 vendors and 32,613 reviews across all three sources in a local PG instance.
- **Architecture:** 3 source adapters → normalize → PostgreSQL → Chart.js dashboard. Source adapters run independently so one source failure doesn't block the others.

## Proof points
- **1,734 vendors** collected across TheKnot (1,593), Zola (91), WeddingWire (50).
- **32,613 reviews** analyzed — TheKnot (31,128 via cracked GraphQL), Zola (1,485 via Playwright).
- **Market-rate findings:** DJ median $2,400, coordinator median $1,850 — these are real market numbers, not estimates.
- **985 vendors with reviews** — enough for statistically meaningful per-category, per-metro distributions.
- **28 metro areas** covered with DJ (787) and coordinator (836) as the deepest categories.

## What to show
- **Demo:** Case-study-only (sensitive data — real vendor pricing). The dashboard showing price distributions per service type is the hero.
- **Visuals needed:** the price distribution histogram per service type; the metro-level median comparison; the source analysis table (permissions, rate limits, techniques); the GraphQL introspection cheat sheet.

## Cross-links
- Shares the **GraphQL introspection technique** and the underlying vendor/review dataset with [theknot-scraper](theknot-scraper.md), which analyzes the same data for sentiment/complaint patterns rather than pricing.
- The **multi-source scraping discipline** connects it to [price-scrapers](price-scrapers.md), [EARLS](earls.md), and [infra-metals-dashboard](infra-metals-dashboard.md).
- Feeds directly into [SALES-BOT](sales-bot.md) (market-rate anchoring for sales calls).

## Case-study angle
This is data advantage in practice: a vendor who built his own pricing-intelligence pipeline because knowing the actual market rate is the single best sales lever. The GraphQL introspect-on-a-whim story is its own artifact — most developers don't know that `__schema` meta-queries work on third-party APIs. **It proves Alex finds data advantage where others don't think to look (GraphQL introspection) and builds the pipeline to deliver it.**