---
project: Strain Catalog
repo: BUTTERGANG/strain-catalog
visibility: public
demo_url: ""
demo_type: live
cluster: life-admin
tier: advanced
status: live
---

# Strain Catalog
**One-liner:** A cannabis strain catalog with genetic lineage trees, terpene profiles, effect browsing, and a dispensary map — 4,800 strains enriched from a four-source data pipeline with 59K genetic relationships.

## Origin (the Build Loop)
> Because I **wanted a real reference for what I'm actually consuming — not a marketing description**, I kept hitting **the fact that every strain database is a stale SEO farm: no lineage, no terpene data, effects written by ad copywriters**, so I built **a catalog that merges Kaggle + WikiLeaf + Seedfinder + Leafly into one structured dataset with genetic lineage trees and terpene bars**, that **answers "what is this, what's related to it, and what will it actually do" from data instead of adjectives.** It taught me **that multi-source enrichment with honest coverage percentages (64%, 55%, 91%) beats one clean-looking source with hidden gaps.**

## The problem
Cannabis strain data is scattered across SEO content farms: WikiLeaf has names and types, Seedfinder has breeder/genetics strings, Leafly has terpene profiles and effects, Kaggle dumps have the base list. No single source is complete, none of them publish lineage *trees*, and the user-facing sites are ad-supported sludge. I wanted one structured catalog — image-first, lineage-aware, terpene-honest.

## What it does
- **4,800 strains** with breeder (64%), THC (82%), CBD (97%), effects (91%), and terpene coverage (55%).
- **5,193 genetic relationships** — parent/child StrainLinks powering lineage trees and a similar-strains engine.
- **Strain detail pages** — hero image, THC meter bars, color-coded terpene bars, effects/flavor pills.
- **Breeder pages, effect/terpene browse hubs** — navigate the catalog by genetics or by effect.
- **Dispensary map** — locations + menu items on Leaflet.
- **User reviews** (aroma, effect, price) with auth, plus user-uploaded strain photos.

## How it's built
- **Stack:** Python (FastAPI), async SQLAlchemy (aiosqlite/SQLite), Jinja2 server-rendered pages, Leaflet; Replit-deployed.
- **Notable engineering:**
  - **Four-source enrichment pipeline** — `seed.py` (Kaggle/WikiLeaf base) → `seedfinder_enrich.py` (breeder + genetics → StrainLinks) → `leafly_enrich.py` (terpenes, effects, images, THC/CBD ranges), each tracked with honest coverage percentages.
  - **Similar-strains engine** — terpene/effect similarity over the structured data, not tag matching.
  - **Production hardening** — DB-backed sessions + reset tokens, rate limiting, escaped user content (stored-XSS fix), graceful degradation.
- **Architecture:** FastAPI routers (strains/pages/dispensaries/reviews/auth) → async SQLAlchemy → SQLite; shared `render_page()` template layer; uploads directory for user photos.

## Proof points
- **59K+ genetic relationships** (5,193 StrainLinks across 4,800 strains) — lineage data that doesn't exist on any public consumer site.
- **Multi-source enrichment with published coverage** — 4,800 strains, 3,089 with breeder, 2,661 with terpene profiles, 4,349 with effects.
- **Shipped hardening in the first week** — sessions, rate limiting, XSS fixes, graceful failure paths.

## What to show
- **Demo:** The running app (strain detail with terpene bars and lineage tree is the hero).
- **Visuals needed:** strain detail page with terpene bars + lineage tree; the similar-strains engine output; the effect browse hub; the dispensary map.

## Cross-links
- The **multi-source enrichment pipeline with honest coverage** is the same discipline as [wedding-pricing-compare](wedding-pricing-compare.md) (3 marketplaces, deduped) and [WINE](wine.md) (OSM/TTB/WhiskeyFYI venues).
- Leaflet map + POI data connects to [WINE](wine.md) and [k9-overwatch](k9-overwatch.md).
- Structured-reference-over-marketing-content is the [bible-study-app](bible-study-app.md) and [petcare-companion](petcare-companion.md) (AKC breeds) pattern.

## Case-study angle
Alex took the messiest possible data domain — SEO farms, ad copy, missing lineage — and built the structured reference he wished existed, with coverage percentages published instead of hidden. **The data pipeline IS the product; the UI is just how you read it.**
