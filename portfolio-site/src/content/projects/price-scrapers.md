---
project: Grocery Price Scrapers
repo: BUTTERGANG/price-scrapers
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: advanced
status: live
---

# Grocery Price Scrapers
**One-liner:** Automated price collection across fourteen Indianapolis-area grocery retailers — each one reverse-engineered with the specific technique that store's site actually requires, including a Trader Joe's scraper that beats an Akamai WAF — into a PostgreSQL database for trend tracking and cross-retailer comparison.

## Origin (the Build Loop)
> Because I **shop and compare grocery prices around Broad Ripple**, I kept hitting **the fact that the same item swings in price across a dozen nearby stores and there's no single place to see it**, so I built **a scraper per retailer plus a dashboard that stores every price in a database for comparison and sale detection**, that **turns "is this actually cheap?" into a queryable answer across all twelve stores**. It taught me **that every site is its own puzzle — there is no one scraping technique, only the right one per target.**

## The problem
Grocery prices vary meaningfully store to store, and each retailer exposes its data differently — some have clean public APIs, some embed it in Next.js server-rendered JSON, some only render fully in a real browser. Comparing them by hand is impossible; scraping them all the same way is naïve. I wanted one database with all of it, which meant solving each store on its own terms.

## What it does
- Collects prices from **14 retailers** near ZIP 46220 (Kroger + Kroger Weekly Ad, Walmart, Fresh Thyme, Meijer, Costco, Target, The Fresh Market, Aldi, Whole Foods, Harvest Market, Giant Eagle, GFS Store, Needler's Fresh Market, and Trader Joe's).
- Stores every price in PostgreSQL (NeonDB) for trend tracking, sale detection, and cross-retailer comparison.
- React dashboard + FastAPI backend for real-time search, deal discovery, and price comparison.

## How it's built
- **Stack:** Python scrapers, PostgreSQL (NeonDB), FastAPI backend, React dashboard.
- **Notable engineering — a different method per target, honestly labeled working/blocked:**
  - **Official APIs** — Kroger (public OAuth2 API), Kroger Weekly Ad (DACS public API), Target (`api.target.com` weekly-ads API).
  - **SSR JSON parsing** — Whole Foods & The Fresh Market (`__NEXT_DATA__` from Next.js SSR), Fresh Thyme/Meijer/Aldi (Flipp circular REST API).
  - **Browser-impersonation** — `curl_cffi` (Safari 17 fingerprint) for Meijer, Whole Foods, Giant Eagle (GraphQL), Trader Joe's, and others, so requests render like a normal browser and return complete data.
  - **Trader Joe's — Magento GraphQL behind Akamai.** Trader Joe's runs Magento's GraphQL storefront API behind an Akamai WAF; the scraper uses `curl_cffi`'s Safari fingerprint impersonation to clear Akamai's bot-detection layer and hit the GraphQL endpoint directly, rather than falling back to a slower full-browser approach.
  - **SSR HTML for the smaller chains** — GFS Store (WordPress server-rendered ad tabs + department catalog) and Needler's Fresh Market (a `storebyweb.com` REST product-search API, plus a separate vision-based circular parser that reads the weekly flyer image via Claude).
  - **Documented limits** — Walmart and Costco marked **Not supported** (they don't return usable data from a datacenter IP), with the attempted method (`curl_cffi` / Playwright) recorded rather than faked. Honesty about what doesn't work is itself a signal.
- **Architecture:** per-retailer scraper → normalized price rows → NeonDB → FastAPI → React comparison dashboard.

## Proof points
- 14 retailers, ~8 distinct extraction techniques matched to each site's defenses — and growing (Walmart's Akamai-class bot defense is the current target, in active R&D on a dedicated branch).
- A WAF bypass that shipped: Trader Joe's Magento/GraphQL storefront, behind Akamai, solved with browser-fingerprint impersonation rather than a slower headless-browser fallback.
- Real, documented working/blocked status per store — no pretending.
- Full pipeline: scrape → Postgres → API → dashboard.

## What to show
- **Demo:** The scrapers are backend/CLI, but the **React comparison dashboard is deployable** — consider a live demo of that with cached data. Otherwise case-study screenshots + the retailer/method table (it's genuinely impressive on its own).
- **Visuals needed:** the retailer×method table from the README; a comparison-dashboard screenshot; a price-trend chart.

## Cross-links
- Deepest example of the **scraping-craft** thread running through [Mind Games](mind-games.md), [EARLS](earls.md), [the TheKnot scraper](theknot-scraper.md), and [k9-overwatch](k9-overwatch.md).

## Case-study angle
The clearest proof that Alex doesn't have "a scraper" — he has scraping *judgment*: fourteen sites, fourteen tailored approaches (including a real Akamai WAF bypass), each one's data model understood and either solved or honestly marked unsupported. That per-target discrimination is what separates a real data engineer from someone who copied a tutorial.
