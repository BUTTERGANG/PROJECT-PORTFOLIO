---
project: WINE
repo: BUTTERGANG/WINE
visibility: public
demo_url: ""
demo_type: live
cluster: life-admin
tier: advanced
status: live
---

# WINE
**One-liner:** A social wine tracking & discovery app — snap a bottle *or a glass*, tag where you're drinking on an interactive map, rate it, and see what your community is uncorking nearby, backed by a ~50,000-winery location database.

## Origin (the Build Loop)
> Because I **wanted to remember what I drink and where**, I kept hitting **the fact that every wine app (Vivino, CellarTracker, Delectable) makes you scan a bottle label and writes a text note — none of them map *where* you drank, and none can identify a wine from a photo of the glass in your hand**, so I built **WINE: photo ID for bottles and glasses, a Leaflet map of every tasting, and a community feed**, that **turns "what am I drinking" into "where should I drink next."** It taught me **that a domain "everyone has an app for" can still have a whitespace — the map + glass-ID + social combo simply didn't exist, and free data sources (OSM Overpass, TTB, WhiskeyFYI) were enough to fill it.**

## The problem
The wine app market has 70M+ users across Vivino, CellarTracker, Wine-Searcher, and Delectable — yet all of them miss the same three things:
1. **No location map** — text notes at best; no interactive map of everywhere you've tasted or what people near you are drinking.
2. **No glass photo ID** — every scanner requires a bottle label, but the moment you actually want to log a wine is when it's already poured.
3. **No real social discovery** — Vivino's feed is a marketplace; Delectable (the best social app) was abandoned.

## What it does
- **Photo identification** for bottles (label scan) *and* glasses (color/legs/opacity heuristics).
- **Interactive map** (Leaflet + OSM, marker clustering) with personal/all/winery/distillery modes and an interactive home mini-map.
- **~50,214 wineries across 60+ countries** in the locations database, with **~33% carrying rich descriptions** from venue enrichment (website crawl + Google Places).
- **Distillery coverage** — imported via TTB permit data + OSM Overpass + WhiskeyFYI.
- **Spirit groups** — create/join groups, group-filtered feed, category model.
- **Ratings, reviews, venue detail pages** with stats, wines poured, and recent tastings.
- **Notifications and security hardening** alongside the map improvements.

## How it's built
- **Stack:** Python (FastAPI), SQLite (WAL mode), Leaflet + OpenStreetMap, vanilla JS frontend; ~608K lines across Python/HTML/CSS/JS.
- **Notable engineering:**
  - **Free-data venue pipeline** — OSM Overpass queries (via curl subprocess after httpx kept failing) + TTB permit data + WhiskeyFYI imports built the 50k-winery base at zero cost; website crawling + Google Places enrichment layered descriptions, phones, and images on top (+412 wineries, +505 crawled sites in one batch).
  - **WAL-mode SQLite** at scale — one file backing a map app with thousands of location rows and live check-ins.
  - **Glass photo ID** — the feature none of the 70M-user incumbents ship.
- **Architecture:** FastAPI backend → SQLite (locations, wines, tastings, users, groups) → Leaflet map + server-rendered pages. Runs on :8002, live and actively developed.

## Proof points
- **~50,214 wineries, 60+ countries** — a free-data venue database that would cost real money from a commercial POI vendor.
- **16,886 rich venue descriptions (33%)** via the enrichment pipeline.
- **291 distilleries** imported from a single fixed Overpass query batch.
- **Live on :8002** and iterating daily — groups, notifications, security, and map modes all shipped in its first week.

## What to show
- **Demo:** The running app (map with clustered winery pins, a venue page, a tasting check-in flow).
- **Visuals needed:** the map view with clusters; a glass-photo ID result; a venue detail page with enrichment; the group feed.

## Cross-links
- The **map + geocoding + POI aggregation** DNA is shared with [k9-overwatch](k9-overwatch.md) (lost pets on a map) and [civic-duty](civic-duty.md) (civic data on a map).
- The **free-data sourcing discipline** (TTB/OSM/government sets) is the same muscle as [api-access](../docs/_INDEX.md) and [infra-metals-dashboard](infra-metals-dashboard.md).
- Photo-ID-of-objects is the pattern from [thrift-lens](thrift-lens.md) and [complete-paperwork](complete-paperwork.md) pointed at wine.

## Case-study angle
Alex looked at a 70M-user market, found the exact three features every incumbent was missing, and built them on free government and OSM data — a 50k-venue discovery platform in its first week of life. **The whitespace thesis wasn't a guess; it's the product.**
