# Project Docs — Index

48 project case-study docs, grouped by origin cluster (the Build Loop). Each follows `_TEMPLATE.md`.
**Convention:** repos stay **private**; projects go viewable via a **public demo URL** (`demo_url`). `demo_type: case-study-only` = backend/sensitive, no clickable demo — use screenshots/diagrams.

Legend: 🟢 public repo · 🔒 private repo · ⭐ anchor/advanced · 🖥️ live-demo-able · 📄 case-study-only

## Weightlifting & coaching *(Alex competes in Olympic weightlifting — the domain is the moat)*
- ⭐🔒🖥️ [mind-games](mind-games.md) — **ANCHOR.** IWF competition simulator; ~7k USAW files → Neon PG; Playwright automation through Sport80's authenticated portal
- ⭐🟢🖥️ [vbt-prototype](vbt-prototype.md) — camera-first VBT tracker; on-device CV pipeline replaces a $400 sensor
- ⭐🔒🖥️ [workoutflow](workoutflow.md) — team programming platform; NIST-grade security hardening
- 🔒🖥️ [moran-website](moran-website.md) — shipped gym platform for a real gym; public site + athlete portal + program builder (client sibling of workoutflow)
- 🟢🖥️ [weightlifting-equipment](weightlifting-equipment.md) — 20+ retailer price tracker for barbells, plates, racks, belts, apparel & shoes; public dataset
- 🟢📄 [usaw-club-pricing](usaw-club-pricing.md) — 770 USAW clubs, 331 with public pricing, 11 charts; the coaching-cost dataset that didn't exist

## Weddings & DJ work
- ⭐🔒🖥️ [weddingos](weddingos.md) — **ANCHOR.** Single-tenant platform replacing HoneyBook + Pixieset + Calendly + DocuSign; 68/68 smoke tests, security-hardened, Neon-backed
- ⭐🔒🖥️ [complete-paperwork](complete-paperwork.md) — DJ Ops: Claude Vision paperwork digitizer (sibling of thrift-lens)
- ⭐🔒🖥️ [sales-bot](sales-bot.md) — sales negotiation co-pilot for wedding vendors; pricing psychology analysis + growing playbook from real calls
- 🔒🖥️ [wedding-timelines](wedding-timelines.md) — run-of-show planner (v2 rebuild of public TIMELINE)
- 🟢🖥️ [live-dj-copilot](live-dj-copilot.md) — mobile DJ suggestion engine; LLM read parsing, mobile PWA, next-track & transition suggestions
- ⭐🔒📄 [wedding-consolidation-api](wedding-consolidation-api.md) — multi-org backend collapsing the vendor tool stack; BYO Dropbox + branded email + migration; 44 tests, row-level isolation verified
- 🔒📄 [wedding-data-explorer](wedding-data-explorer.md) — gated read-only UI over the 1,734-vendor dataset; text-to-SQL ask-the-data box; the interface layer for theknot/pricing-compare data

## Photography & LA Media
- ⭐🔒🖥️ [la-media-dashboard](la-media-dashboard.md) — ops/CRM/invoicing/contracts
- ⭐🔒📄 [gear-rental](gear-rental.md) — rental desk: eBay-valued pricing, e-signed agreements with a SHA-256 audit trail, Stripe fee + damage hold, automated return chasing
- 🔒🖥️ [la-media-website](la-media-website.md) — the commercial site
- 🔒🖥️ [lightlog](lightlog.md) — shoot lighting tracker (astro + weather + AI settings)
- 🟢🖥️ [photo-file-copier](photo-file-copier.md) — macOS selects-copier (desktop app)

## Deal-hunting & scraping
- ⭐🔒🖥️ [thrift-lens](thrift-lens.md) — Vision + eBay comps + deal score (sibling of complete-paperwork)
- ⭐🔒📄 [polybot](polybot.md) — Polymarket AI trading bot; Kelly + Bayesian + risk manager
- ⭐🟢📄 [price-scrapers](price-scrapers.md) — 14 retailers, ~8 techniques incl. an Akamai WAF bypass, honest working/blocked
- ⭐🟢📄 [theknot-scraper](theknot-scraper.md) — nationwide 3-marketplace vendor scraper + sentiment-analysis dashboard; real-browser reliability
- ⭐🟢📄 [wedding-pricing-compare](wedding-pricing-compare.md) — 1,734 vendors across 3 marketplaces; 32,613 reviews; cracked TheKnot GraphQL via introspection
- ⭐🟢📄 [business-recon](business-recon.md) — B2B lead enrichment pipeline; SMTP verification + deep crawl + CRM view; paid-tool replacement at zero cost
- 🔒📄 [public-storage-bot](public-storage-bot.md) — storage rates + Claude deal bot (Telegram)
- 🟢🖥️ [romaleos-2-tracker](romaleos-2-tracker.md) — discontinued-shoe grail tracker; eBay Browse API + US-size extraction + Discord watches
- 🔒📄 [ebay-endpoint](ebay-endpoint.md) — eBay marketplace webhook compliance service; ECDSA signature verification, challenge/response, status dashboard
- ⭐🔒🖥️ [skyscanner](skyscanner.md) — PerimeterX bypass on Skyscanner's mobile API + self-hosted weekend-deal tracker; 200+ destinations
- 🟢🖥️ [earls](earls.md) — Earl's Auction monitor; real-browser rendering

## Life admin
- ⭐🟢🖥️ [wine](wine.md) — social wine tracking & discovery; glass+label photo ID, Leaflet map, ~50,214-winery free-data venue DB, spirit groups
- ⭐🔒📄 [personal-finance-dashboard](personal-finance-dashboard.md) — Plaid/OFX aggregator *(NEVER public — real accounts)*
- ⭐🔒📄 [echo](echo.md) — local-first voice journal; on-device Whisper + SQLite-WASM
- ⭐🟢🖥️ [petcare-companion](petcare-companion.md) — pet records + 123 AKC breed reference + weight chart + printable vet report; zero-jargon PWA for non-technical users
- 🟢🖥️ [productivity-tracker](productivity-tracker.md) — GitHub-style habit grid *(easiest first live demo)*
- 🟢🖥️ [3d-car-manual](3d-car-manual.md) — Three.js Traverse manual + RAG *(prototype)*
- 🟢🖥️ [bible-study-app](bible-study-app.md) — Logos-style study app + AI *(prototype)*
- ⭐🟢🖥️ [strain-catalog](strain-catalog.md) — 4,800-strain catalog; genetic lineage trees, terpene bars, similar-strains engine; 4-source enrichment pipeline

## Civic & community
- ⭐🔒🖥️ [civic-duty](civic-duty.md) — 3-region civic aggregator (Fishers, Indianapolis, Hamilton Co.); ~20 sources, live alerting
- ⭐🟢🖥️ [k9-overwatch](k9-overwatch.md) — lost-pet aggregation; 5 sources, 5 techniques *(live)*

## Job search *(the thesis, applied to itself)*
- ⭐🟢🖥️ [job-hunter](job-hunter.md) — AI-ranked job dashboard; **hero of "Where It's Heading"**
- 🟢🖥️ [indiana-jobs-data](indiana-jobs-data.md) — daily job-market scraper & analytics pipeline; DOCX report generation; market-intel companion to JOB-HUNTER

## Infrastructure & off-repo *(no repo to link — screenshots/write-ups)*
- ⭐📄 [infra-metals-dashboard](infra-metals-dashboard.md) — zero-budget commodities dashboard; 93 series, 8 metals, 3 extraction techniques, 3 production crons *(public repo)*
- ⭐📄 [hermes](hermes.md) — self-hosted market-intel agent; n8n + MCP on VPS
- ⭐📄 [security-research](security-research.md) — Kali/Metasploit MCP servers; 78 verified bug-bounty findings across 21 targets; PicoCTF
- 📄 [master-dashboard](master-dashboard.md) — live command center for the whole portfolio; GitHub webhooks + SSE, agent-facing JSON API, human 2FA login
- 🟢📄 [ai-pricing-research](ai-pricing-research.md) — 216 LLM price points across 11 providers, 2020-2026; generated dashboard; the model-cost time series nobody else keeps
- 📄 [metals-research](metals-research.md) — silver supply-side model; byproduct production analysis; decades-long macro research; companion to Infra Metals Dashboard
- 📄 [home-infrastructure](home-infrastructure.md) — QNAP + Tailscale + CCS proxy; OS/network debugging

---

## Deployment checklist (to make projects "viewable")
Repos stay private; deploy each 🖥️ project to a public URL and fill its `demo_url`. Priority order:
1. **productivity-tracker** — static, deploy in minutes (proves the pattern)
2. **job-hunter** — already public, hero of Pillar 4
3. **mind-games** — anchor case study (flip nothing; deploy demo with seeded meet)
4. **complete-paperwork** + **thrift-lens** — the Vision-pattern pair
5. Remaining 🖥️ projects as time allows

📄 case-study-only projects have no live demo — need screenshots + architecture diagrams instead.