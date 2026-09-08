---
project: AI Pricing Research
repo: BUTTERGANG/ai-pricing-research
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: standard
status: live
---

# AI Pricing Research
**One-liner:** A structured knowledge base of LLM API pricing — 216 price points across 11 providers with historical trends (2020–2026), free-model availability, and market context — plus a generated dashboard and report.

## Origin (the Build Loop)
> Because I **run a fleet of AI-powered projects on OpenRouter and needed to know what inference actually costs over time**, I kept hitting **the fact that pricing pages are marketing surfaces — per-token rates change silently, free tiers come and go, and nobody keeps the history**, so I built **a canonical JSONL dataset (one file per provider) with every price change timestamped, plus a generated dashboard and report**, that **gives the portfolio's model-selection decisions a data foundation.** It taught me **that "what does GPT-4 cost" is a time-series question, and everyone else is only looking at today's number.**

## The problem
LLM pricing is published as current-state marketing pages. Historical price movements (the cost-collapse curve that defines the industry), free-tier churn, and cross-provider comparisons require scraping documentation diffs and release notes across a dozen vendors — work nobody does, so nobody can answer "is inference getting cheaper, how fast, and for whom?"

## What it does
- **216 price points across 11 providers** — canonical structured JSONL (one file per provider: OpenAI 37 entries 2020–2026, Anthropic 27, Google 31, DeepSeek 9, xAI 5, and more).
- **Market data** — industry sizing, spend, infrastructure, adoption context.
- **Free-model availability table** — OpenRouter free tier tracked per model.
- **Generated dashboard + report** — 15 sections rendered from the dataset, with dynamic counts.
- **Trend analysis** — per-provider price trajectories, thinking-token pricing, and free-model churn.

## How it's built
- **Stack:** Python (data collection + generators), JSONL canonical datasets, HTML dashboard, CSV exports.
- **Notable engineering:**
  - **Canonical dataset per provider** — one JSONL per vendor means the data is diffable, versionable, and mergeable without a database.
  - **Generated-not-handwritten reports** — section counts and totals are computed from the dataset, so the report can't drift from the data.
  - **Dynamic-count fix discipline** — header numbers, TOC numbering, and README totals all regenerated from source (a series of commits fixing exactly the drift that plagues hand-written reports).
- **Architecture:** provider pricing collection → JSONL knowledge base → generator → dashboard + report + CSV.

## Proof points
- **216 price points, 11 providers, 6 years of history** (2020–2026) — the time-series that pricing pages won't give you.
- **Report and data can't disagree** — all counts generated from the JSONL source of truth.
- Directly informs model selection across the portfolio's OpenRouter-powered projects.

## What to show
- **Demo:** Case-study-only (knowledge base). The dashboard's price-trend chart and free-model table are the visuals.
- **Visuals needed:** the per-provider price trajectory chart; the free-model availability table; a JSONL snippet showing the record structure.

## Cross-links
- The **cost-data foundation** for every OpenRouter-powered project: [SALES-BOT](sales-bot.md), [live-dj-copilot](live-dj-copilot.md), [wedding-data-explorer](wedding-data-explorer.md).
- The **knowledge-base-over-marketing-pages** approach matches [api-access](../docs/_INDEX.md) and [metals-research](metals-research.md).

## Case-study angle
Everyone reads today's pricing page; Alex built the six-year price history across 11 providers because "what does inference cost" is a trend question. **A research artifact that quietly powers model decisions across the whole portfolio.**
