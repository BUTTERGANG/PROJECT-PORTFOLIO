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
**One-liner:** A standalone eBay Marketplace webhook service — challenge-response verification, ECDSA-signed deletion notifications, and a status dashboard — the compliance plumbing every eBay marketplace app must have.

## Origin (the Build Loop)
> Because I **kept building eBay-powered projects** (price trackers, comp lookups, deal alerts), I kept hitting **the fact that eBay's marketplace program requires a public account-deletion endpoint with challenge/response verification and ECDSA signature checks before an app can go live**, so I built **a small standalone service that implements the full webhook spec — verification token, signed notifications, public-key lookup, negative caching — plus a status dashboard**, that **gives every eBay project a compliant notification receiver from day one.** It taught me **that platform compliance plumbing is its own artifact: get it right once, standalone, and every future app inherits it.**

## The problem
eBay's Marketplace Account Deletion/Closure notifications are a hard requirement for production marketplace apps. The spec is unforgiving: a GET challenge must echo a hashed verification token, POST notifications must carry a valid `X-EBAY-SIGNATURE` (ECDSA/SHA-1) checked against eBay's published public key for the notification's `kid`, and everything must respond correctly without leaking credentials. Burying that in each app means repeating the hardest, most security-sensitive part of the integration every time.

## What it does
- **Challenge-response verification** — GET handler answers eBay's `challenge_response` per spec.
- **Signed notification receiver** — POST handler validates `X-EBAY-SIGNATURE` (ECDSA/SHA-1) against eBay's published public key for the notification's `kid`; invalid signatures get `412`.
- **OAuth plumbing** — application token via `EBAY_APP_ID`/`EBAY_CERT_ID`; production or sandbox hosts.
- **Status dashboard** — uptime, last-activity, notification counter (operational metadata only — never tokens or payload contents); optional HTTP Basic Auth.
- **Hardening** — 64KB body cap, disabled decompression, 300 req/min per-IP rate limit, negative caching of bogus public-key lookups (60s) so unknown `kid`s can't spam eBay's API.

## How it's built
- **Stack:** Node.js (Express-style service), Replit deployment; `.env`-driven config.
- **Notable engineering:**
  - **Signature verification done right** — public keys fetched per-`kid` from eBay's API and negatively cached, so forgery attempts cost the attacker nothing and cost the service one failed lookup per minute.
  - **Deliberately small** — the value is the *contract*: one compliant webhook receiver that every eBay app shares.
  - **Kept standalone** — separated from the portfolio site specifically so that stays a static deployment.
- **Architecture:** eBay → `/ebay/deletion` (GET challenge / POST signed notification) → signature check → notification log; dashboard + `/api/*` read operational state only.

## Proof points
- Implements the full eBay compliance spec (challenge/response + ECDSA signature verification) — the part most hobby marketplace apps skip and get rejected for.
- Security-first defaults: signed-only POSTs, negative caching, body caps, rate limiting, metadata-only dashboard.

## What to show
- **Demo:** Case-study-only (holds eBay credentials; webhook endpoint is private). A sequence diagram of the challenge + signed-notification flow is the visual.
- **Visuals needed:** sequence diagram (eBay → GET challenge → POST signed notification → verification); a redacted dashboard screenshot showing uptime/counter.

## Cross-links
- The compliance layer behind [romaleos-2-tracker](romaleos-2-tracker.md) and the eBay comps in [thrift-lens](thrift-lens.md) and [EARLS](earls.md).
- Same "extract the shared service" instinct as the business-recon CRM serving multiple scrape flows.

## Case-study angle
Compliance plumbing is usually invisible until an app gets rejected. Alex implemented eBay's hardest integration requirement once — signature verification, challenge-response, negative caching — as a standalone service every future marketplace app inherits. **Security-critical infrastructure, done deliberately small.**
