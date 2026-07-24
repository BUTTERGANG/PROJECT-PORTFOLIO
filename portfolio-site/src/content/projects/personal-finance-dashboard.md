---
project: Personal Finance Dashboard
repo: BUTTERGANG/PERSONAL-FINANCE-DASHBOARD
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: life-admin
tier: advanced
status: prototype
---

# Personal Finance Dashboard
**One-liner:** A self-hosted dashboard that pulls my real money — Fidelity, Chase, Citi, PayPal, and Venmo — into one net-worth view, so I stop logging into five sites to answer one question.

## Origin (the Build Loop)
> Because I was **managing my money across five separate institutions**, I kept hitting **the friction of logging into five portals just to know my net worth or where last month's money went**, so I built **a self-hosted dashboard that aggregates every account via Plaid and Fidelity OFX Direct Connect into one FastAPI + React interface**, that **shows net worth, spend trends, and budget alerts in a single screen I own end-to-end**. It taught me **that the moment data is this sensitive, the architecture decision is "never a public demo" — the security model comes before the feature list.**

> Note: this is the **"Dashboard" app the portfolio spec had listed as a blank TODO** — now a real build.

## The problem
My finances were scattered across Fidelity, Chase, Citi, PayPal, and Venmo. Answering "what's my net worth?" or "where did last month go?" meant five logins and mental math. Consumer aggregators exist, but they want to sit in the middle of every one of my financial accounts — and I didn't want a third party holding read access to all my money. The only version I trusted was one I hosted and controlled myself.

## What it does
- Aggregates live balances and transactions from Fidelity, Chase, Citi, PayPal, and Venmo into one unified database.
- Overview page: net-worth, total-assets, total-debt, and 30-day-spend metric cards at a glance.
- Net-worth trend as a 180-day area chart.
- Month-over-month spending comparison surfacing the top movers.
- Account balance list with per-institution badges.
- Budget alert banner with warning/danger thresholds.
- Dark/light theme toggle.
- Auto-sync scheduler that refreshes accounts on a schedule instead of on demand.

## How it's built
- **Stack:** FastAPI + SQLite (backend), React + Vite + Recharts (frontend), Plaid API + Fidelity OFX Direct Connect (data ingestion). Hosted on Replit (Always On).
- **Notable engineering:**
  - **Two ingestion paths under one sync engine** — Plaid handles the institutions it covers; Fidelity comes in over OFX Direct Connect, a different protocol entirely. The backend normalizes both into one transaction/account schema.
  - **Security-first data model** — Plaid access tokens are encrypted at rest with Fernet (AES-128); no credentials ever live in code or git history; all secrets sit in Replit Secrets / environment variables; a pre-commit hook and `generate_key.py` script back that up.
  - **Read-only by design** — Plaid connections carry no transfer capability. The dashboard can see money; it can't move it. That's a deliberate blast-radius decision.
  - **Migration off a throwaway UI** — an original Streamlit frontend is kept for reference; the current UI is a purpose-built React + Recharts app (Overview complete, seven more pages scaffolded).
- **Architecture:** `backend/` (FastAPI app, Plaid client, OFX client, sync engine) → SQLite → `react-frontend/` (Vite + Recharts). An auto-sync scheduler keeps the DB current. Everything runs inside a single Replit Always-On instance that I control.

## Proof points
- 5 real financial institutions aggregated (Fidelity, Chase, Citi, PayPal, Venmo) across 2 ingestion protocols (Plaid + OFX).
- Access tokens encrypted at rest with Fernet AES-128; zero secrets in git.
- Read-only Plaid scope — no transfer capability by design.
- Overview page fully built (4 metric cards, 180-day net-worth chart, MoM spend comparison, budget alerts); 7 further pages scaffolded for Phase 2.

## What to show
- **Demo:** None, and never a public one. This dashboard aggregates my real financial data across five institutions — a live, clickable demo would expose actual account balances and transactions. It is **case-study-only** by hard rule.
- **Visuals needed:** screenshots with **all dollar figures blurred** (metric cards, net-worth chart, account list), plus a clean architecture diagram showing the two-path ingestion (Plaid + OFX → sync engine → SQLite → React) and where encryption sits. Never publish an unredacted screen.

## Cross-links
- Shares the **"self-hosted aggregator I own end-to-end rather than trusting a third party"** shape with [CivicDuty](civic-duty.md) (my own civic-data pipeline) and [K9-Overwatch](k9-overwatch.md) (my own multi-source scraper).
- The **encryption-at-rest + secrets-hygiene** discipline echoes the risk-first posture in [POLYBOT](polybot.md).

## Case-study angle
The build that proves Alex treats security as an architecture decision, not a feature: handed the most sensitive data in the portfolio, he chose a self-hosted, read-only, encrypted-at-rest design and ruled out a public demo entirely — because the right call was protecting the data, not showing it off.
