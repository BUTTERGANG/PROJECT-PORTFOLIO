---
project: Wedding Data Explorer
repo: BUTTERGANG/wedding-data-explorer
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: weddings
tier: standard
status: live
---

# Wedding Data Explorer
**One-liner:** A gated, read-only web UI over the nationwide wedding vendor dataset — browse 1,734 vendors, explore 32k+ reviews, and ask plain-English questions with text-to-SQL.

## Origin (the Build Loop)
> Because I **built the scraper pipeline that collected TheKnot + Zola data**, I kept hitting **the fact that a Postgres database is useless to non-technical people who want to browse it — "just write SQL" isn't an answer for an office**, so I built **a gated snapshot app: Postgres → SQLite export → read-only FastAPI UI with filters and an ask-the-data box**, that **lets anyone on the team explore vendors, reviews, and pricing without touching a query.** It taught me **that the last mile of a data project is an interface, not a pipeline.**

## The problem
The wedding-vendor dataset (1,734 vendors, 32,613 reviews across TheKnot and Zola) lived in a Postgres instance on the VPS. Anyone who wanted an answer — "what's the median DJ price in Indianapolis," "what do people complain about with photographers" — needed SQL access. The data was collected; the access was the bottleneck.

## What it does
- **Overview page** — KPI cards, sentiment split, top complaints, pricing by category, top metros.
- **Vendors** — filter 1,734 vendors by name/category/state with pricing, ratings, and contact context.
- **Reviews** — explore genuine customer feedback (vendor-written replies excluded and flagged in the snapshot, so sentiment numbers stay honest).
- **Ask the Data** — plain-English question box → text-to-SQL → answer + the underlying data table (OpenRouter-powered, optional).

## How it's built
- **Stack:** Python (FastAPI), SQLite (~11MB snapshot), vanilla JS; deployed on Replit with a single shared passphrase (cookie-gated, 30-day session).
- **Notable engineering:**
  - **Postgres → SQLite snapshot builder** (`export_snapshot.py`) — the VPS database stays authoritative; the app ships a read-only snapshot, so the public-facing surface has no write path at all.
  - **Text-to-SQL on a fixed schema** — the ask-the-data box is constrained to the snapshot's known tables, which keeps the LLM's SQL honest and the data read-only.
  - **Gated by design** — passphrase + private Replit deploy; the dataset stays internal.
- **Architecture:** VPS Postgres → `export_snapshot.py` → `wedding_data.sqlite` → FastAPI (browse/reviews/ask) → Replit deploy.

## Proof points
- **1,734 vendors and 32,613 reviews** made browsable to non-technical users.
- **Vendor replies excluded** from every sentiment number — a data-integrity choice most review dashboards skip.
- **~11MB snapshot** — the entire national dataset ships inside the repo.

## What to show
- **Demo:** Case-study-only (gated internal tool). Screenshots of the Overview KPIs and the Ask-the-Data answer flow.
- **Visuals needed:** the overview page with KPI cards; a filtered vendor table; an ask-the-data question with its SQL + result table.

## Cross-links
- Built directly on the dataset from [wedding-pricing-compare](wedding-pricing-compare.md) and [theknot-scraper](theknot-scraper.md) — the interface layer of the same data story.
- The **text-to-SQL** pattern connects to [SALES-BOT](sales-bot.md) (LLM over a fixed domain schema).

## Case-study angle
Every data pipeline needs a last mile. Alex turned a scraped database into a gated product his team can actually use — filters for the common questions, text-to-SQL for everything else, and vendor-reply filtering so the sentiment numbers stay honest.
