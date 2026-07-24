---
project: ThriftLens
repo: BUTTERGANG/thrift-lens
visibility: private
demo_url: ""
demo_type: live
cluster: deal-hunting
tier: advanced
status: live
---

# ThriftLens
**One-liner:** Snap a photo of a thrift find and get a HOT/GOOD/PASS deal score in under 20 seconds — Claude Vision identifies the item, live eBay comps price it, and the app tells me whether the margin is real before I ever put it in the cart.

## Origin (the Build Loop)
> Because I was **reselling thrift finds**, I kept hitting **the moment in the aisle where I had to guess at an item's resale value and margin from memory**, so I built **a mobile PWA that photographs the item, identifies it with Claude Vision, pulls live eBay comps, and scores the deal**, that **turns a gut guess into a market value range and a profit estimate on the spot**. It taught me **how to keep an AI pipeline cheap and fast enough to actually use standing in a store — vision once, text-only after, and cache the expensive external call.**

## The problem
Sourcing thrift items to flip means making a buy/pass call in seconds, in the aisle, on your phone. The information I actually needed — what is this, what does it sell for right now, and what's left after fees and shipping — lived across three tabs and a lot of guesswork. I wanted one motion: point the camera, get a verdict, decide.

## What it does
- Camera or library upload with preview, retake, and "choose different"
- Claude Vision identification: brand, model, condition, era, category
- Live eBay Browse API comps (active listings), cached 24h to stay fast and cheap
- Market value range (low/high) plus a net **profit estimate** after platform fees and shipping
- **Deal score** — HOT / GOOD / PASS — with a confidence note
- Selling tips: best platforms, listing keywords, authenticity warnings
- Per-session scan history with client-side filters and a "scan again" CTA
- Installable PWA (iPhone Safari, Add to Home Screen)
- No account required; images are never stored

## How it's built
- **Stack:** Next.js 16 (App Router), Claude Sonnet 4.6 (Vision + Text) via `@anthropic-ai/sdk`, eBay Browse API, NeonDB (serverless PostgreSQL), Tailwind CSS v4, native service worker + manifest for PWA.
- **Notable engineering:**
  - **Two-call AI pipeline that only pays for vision once.** The photo hits Claude Sonnet 4.6 Vision one time to produce a structured `IdentificationResult` (including an `ebay_search_query`). The final analysis — deal score, market value, profit — is a **text-only** Sonnet call that reuses the identification and comps without re-sending the image, roughly 10x cheaper than a second vision call.
  - **Comps cache keyed by SHA-256 of the search query.** Each identification's eBay query is hashed; a `comps_cache` lookup in NeonDB serves a hit or falls through to the eBay Browse API on miss, then caches the result for 24 hours. The expensive external call happens once per distinct item, not once per scan.
  - **eBay OAuth client-credentials flow** with a cached token, wrapped in a small Browse API client.
  - **Profit & loss engine** turns raw comps into a net estimate after platform fees and shipping — the number that actually decides the buy.
  - **Honest data labeling:** comps are *active listings* (asking prices), not sold prices, and the UI says so plus surfaces what the confidence figure means.
- **Architecture:** `POST /api/scan` runs the pipeline end to end — Vision identify → comps cache lookup → eBay Browse on miss (cache 24h) → text-only analysis → NeonDB insert → redirect to `/results/[id]`. Sessions are a UUID in localStorage; there's no auth in beta. A `/api/migrate` endpoint initializes the schema.

## Proof points
- Verdict in **under 20 seconds** from photo to HOT/GOOD/PASS.
- **Two model calls per scan**, only one of them vision — the text-only analysis call is ~10x cheaper than re-sending the image.
- eBay comps cached **24h** per item via SHA-256 query hash; eBay's free tier is 5,000 calls/day, so caching keeps the app well inside it.
- **Zero image storage** and **zero accounts** — privacy is a stated product feature, not an afterthought.

## What to show
- **Demo:** Live PWA (private repo, public demo when deployed). Best shown on an actual phone — open in iPhone Safari, Add to Home Screen, scan a real item.
- **Visuals needed:** phone screen recording of the scan → processing stepper (Identify → Comps → Analysis) → results card with the deal badge; a diagram of the `/api/scan` pipeline; a results screenshot showing the profit estimate. Blur any real API keys if the network tab is visible.

## Cross-links
- **Same photograph-it-and-extract Vision pattern** as the DJ paperwork PWA, [COMPLETE-PAPERWORK](complete-paperwork.md) — point the camera at a real-world artifact, let Claude Vision turn it into structured data, act on the result. ThriftLens applies that pattern to resale sourcing instead of wedding paperwork.
- Shares the **"AI says: is this actually a deal?"** shape with [public-storage-bot](public-storage-bot.md) (rates → Claude verdict) and [POLYBOT](polybot.md) (market price vs. AI estimate → trade/skip).

## Case-study angle
Alex built a real-time, cost-aware AI product — vision once, text after, external comps cached — that survives being used one-handed in a thrift-store aisle, and turned "I think I can flip this" into a defensible profit number.
