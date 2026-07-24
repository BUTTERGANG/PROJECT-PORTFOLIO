---
project: K9-Overwatch
repo: BUTTERGANG/k9-overwatch
visibility: public
demo_url: ""
demo_type: live
cluster: civic
tier: advanced
status: live
---

# K9-Overwatch
**One-liner:** A lost-and-found pet platform for the Indianapolis metro that scrapes five separate pet-listing sources — each one reverse-engineered differently — geocodes them onto one map, and matches lost dogs against found reports.

## Origin (the Build Loop)
> Because I **saw how scattered and frantic lost-pet searches are**, I kept hitting **the fact that a lost dog might be reported on any of five different sites, none of which talk to each other**, so I built **a platform that aggregates all five into one geographic view and automatically matches lost against found**, that **gives owners one place to look instead of five**. It taught me **that real aggregation means solving each source on its own terms — one had an open API, one hid behind AWS WAF, one needed a headless browser.**

## The problem
When a pet goes missing, reports land across a patchwork of services — shelters, PawBoost, local alert sites, Pet FBI — with no shared map and no cross-matching. An owner has to check all of them, repeatedly. I wanted one unified, geocoded view that also did the matching work automatically, which meant pulling from five sources that each guard their data differently.

## What it does
- Aggregates **lost / found / adoptable** pet listings from 5 sources into one database.
- Geocodes street-level addresses to lat/lon coordinates.
- Displays pets on an **interactive map** with filtering by type, status, color, size, and recency.
- **Matches** lost pets against found/shelter records using description similarity.
- **Alerts** users when a new pet matching their criteria appears near their location.

## How it's built
- **Stack:** Python; per-source scrapers/clients; geocoding; interactive map front end.
- **Notable engineering — five sources, five techniques (documented in `docs/`):**
  - **24petconnect** — PetHarbor backend, HTML scraping.
  - **PawBoost** — Cloudflare-protected, Playwright required.
  - **IndyLostPetAlert** — open WordPress REST API.
  - **Pet FBI** — GraphQL API behind AWS WAF; **provides lat/lon directly** (skips geocoding).
  - **Lost My Doggie** — Cloudflare-protected phone-alert service.
  - Plus **Haversine distance** math for the "near me" matching/alerts.
- **Architecture:** 5 source adapters → normalize + geocode → unified DB → similarity matcher → interactive map + proximity alerts.

## Proof points
- 5 heterogeneous sources unified — open REST, GraphQL/WAF, HTML scrape, and two Cloudflare-protected sites.
- Description-similarity matching plus Haversine proximity alerts.
- Live and functional (not shelved).

## What to show
- **Demo:** Deploy to a public URL (repo is public). The interactive map with real aggregated Indy-area listings is the hero view.
- **Visuals needed:** the map with filters applied; a lost→found match example; the source-analysis table from `docs/`.

## Cross-links
- Multi-source API-reversing joins the scraping thread with [price-scrapers](price-scrapers.md), [Mind Games](mind-games.md), [CIVIC-DUTY](civic-duty.md), and [EARLS](earls.md).

## Case-study angle
A genuinely useful community tool that doubles as proof of integration range: five services, five different access methods — open API to AWS-WAF GraphQL to real-browser rendering of JavaScript-heavy sites — unified into one map that reunites people with their pets.
