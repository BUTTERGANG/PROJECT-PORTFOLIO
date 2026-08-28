# Project Docs — Index

38 project case-study docs, grouped by origin cluster (the Build Loop). Each follows `_TEMPLATE.md`.
**Convention:** repos stay **private**; projects go viewable via a **public demo URL** (`demo_url`). `demo_type: case-study-only` = backend/sensitive, no clickable demo — use screenshots/diagrams.

Legend: 🟢 public repo · 🔒 private repo · ⭐ anchor/advanced · 🖥️ live-demo-able · 📄 case-study-only

## Weightlifting & coaching *(Alex competes in Olympic weightlifting — the domain is the moat)*
- ⭐🔒🖥️ [mind-games](mind-games.md) — **ANCHOR.** IWF competition simulator; ~7k USAW files → Neon PG; Playwright automation through Sport80's authenticated portal
- ⭐🟢🖥️ [vbt-prototype](vbt-prototype.md) — camera-first VBT tracker; on-device CV pipeline replaces a $400 sensor
- ⭐🔒🖥️ [workoutflow](workoutflow.md) — team programming platform; NIST-grade security hardening
- 🔒🖥️ [moran-website](moran-website.md) — shipped gym platform for a real gym; public site + athlete portal + program builder (client sibling of workoutflow)
- 🟢🖥️ [weightlifting-equipment](weightlifting-equipment.md) — 20+ retailer price tracker for barbells, plates, racks, belts, apparel & shoes; public dataset

## Weddings & DJ work
- ⭐🔒🖥️ [weddingos](weddingos.md) — **ANCHOR.** Single-tenant platform replacing HoneyBook + Pixieset + Calendly + DocuSign; 68/68 smoke tests, security-hardened, Neon-backed
- ⭐🔒🖥️ [complete-paperwork](complete-paperwork.md) — DJ Ops: Claude Vision paperwork digitizer (sibling of thrift-lens)
- ⭐🔒🖥️ [sales-bot](sales-bot.md) — sales negotiation co-pilot for wedding vendors; pricing psychology analysis + growing playbook from real calls
- 🔒🖥️ [wedding-timelines](wedding-timelines.md) — run-of-show planner (v2 rebuild of public TIMELINE)
- 🟢🖥️ [live-dj-copilot](live-dj-copilot.md) — mobile DJ suggestion engine; LLM read parsing, mobile PWA, next-track & transition suggestions

## Photography & LA Media
- ⭐🔒🖥️ [la-media-dashboard](la-media-dashboard.md) — ops/CRM/invoicing/contracts
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
- 🟢🖥️ [earls](earls.md) — Earl's Auction monitor; real-browser rendering

## Life admin
- ⭐🔒📄 [personal-finance-dashboard](personal-finance-dashboard.md) — Plaid/OFX aggregator *(NEVER public — real accounts)*
- ⭐🔒📄 [echo](echo.md) — local-first voice journal; on-device Whisper + SQLite-WASM
- ⭐🟢🖥️ [petcare-companion](petcare-companion.md) — pet records + 123 AKC breed reference + weight chart + printable vet report; zero-jargon PWA for non-technical users
- 🟢🖥️ [productivity-tracker](productivity-tracker.md) — GitHub-style habit grid *(easiest first live demo)*
- 🟢🖥️ [3d-car-manual](3d-car-manual.md) — Three.js Traverse manual + RAG *(prototype)*
- 🟢🖥️ [bible-study-app](bible-study-app.md) — Logos-style study app + AI *(prototype)*

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