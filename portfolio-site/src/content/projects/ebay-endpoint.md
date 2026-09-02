---
project: eBay Endpoint
repo: BUTTERGANG/ebay-endpoint
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: standard
status: live
---

# eBay Endpoint
**One-liner:** A self-hosted eBay API layer — OAuth token management and a clean endpoint other projects call instead of each re-implementing eBay auth.

## Origin (the Build Loop)
> Because I **kept building eBay-powered projects** (price trackers, comp lookups, deal alerts), I kept hitting **the fact that every one of them needed the same OAuth dance — token fetch, refresh, expiry handling, rate limits — copy-pasted into each repo**, so I built **a small standalone service that owns eBay auth and exposes one clean endpoint**, that **gives every deal-hunting project a single place to get eBay data.** It taught me **that a shared credential-and-auth layer is a product, even when it's one file.**

## The problem
The eBay Browse API requires OAuth (client credentials → access token → refresh before expiry → 429 handling). Duplicating that logic in romaleos-2-tracker, EARLS's retail floor, thrift-lens comps, and everything after it means four places to fix when the flow changes — and four chances to leak a token.

## What it does
- **Owns eBay OAuth** — token fetch, refresh, and expiry handling in one place.
- **Exposes a clean endpoint** — internal projects call it with a query; it returns listings/pricing data without knowing anything about OAuth.
- **Centralizes credentials** — `.env.example` documents the setup; the token never lives in consumer repos.

## How it's built
- **Stack:** Node.js (JavaScript), Express-style service; `.replit` deploy config.
- **Notable engineering:** deliberately tiny — the value is the *contract*, not the code size. One auth owner, N consumers.
- **Architecture:** consumer project → ebay-endpoint (token cache + refresh) → eBay Browse API.

## Proof points
- **In active use** as the auth layer behind the eBay-powered trackers.
- **Converted repeated OAuth plumbing into a shared service** — the textbook "extract the pattern" refactor applied across his own repos.

## What to show
- **Demo:** Case-study-only (internal service holding credentials). A sequence diagram of consumer → endpoint → eBay is the visual.
- **Visuals needed:** an architecture diagram (consumers → ebay-endpoint → eBay); a redacted token-refresh log line.

## Cross-links
- The extracted auth layer behind [romaleos-2-tracker](romaleos-2-tracker.md), [EARLS](earls.md) (retail floor comps), and [thrift-lens](thrift-lens.md) (eBay comps).
- Same "extract the shared service" instinct as the business-recon CRM serving multiple scrape flows.

## Case-study angle
The smallest repo in the portfolio might be the best engineering-judgment signal: after the third project copy-pasted eBay OAuth, Alex extracted it into one owned service. **Knowing when to deduplicate your own infrastructure is the difference between a pile of scripts and a platform.**
