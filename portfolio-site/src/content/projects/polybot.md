---
project: POLYBOT
repo: BUTTERGANG/POLYBOT
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: advanced
status: prototype
---

# POLYBOT
**One-liner:** An AI-forecaster trading bot for Polymarket that finds mispriced prediction markets and trades the edge — with a real risk manager and the discipline to stay in paper-trade mode until the data earns real money.

## Origin (the Build Loop)
> Because I **thought the crowd was mispricing prediction markets**, I kept hitting **the question of whether that was a real edge or just my bias**, so I built **a bot that detects divergence between market price and a calibrated AI forecast, sizes bets with Kelly, and enforces hard risk limits**, that **trades the edge automatically — but only on paper until the performance data proves it out**. It taught me **discipline over conviction: the interesting engineering is the risk manager and the paper-trade gate, not the trade itself.**

## The problem
Prediction markets price events as probabilities. If a market says "30% chance" but the true probability is 45%, buying YES at 30¢ is a positive-EV trade. The hard part isn't spotting a gap — it's knowing whether the *market* is wrong or the *model* is wrong, and not blowing up your bankroll finding out. Most "AI trading bot" projects skip exactly that part.

## What it does
- Scans live Polymarket markets and screens out the ones it has no edge in.
- Asks a calibrated AI forecaster for a true-probability estimate, blends it with the market price, and trades only when the divergence clears a threshold.
- Sizes each position with Kelly criterion, under exposure and daily-loss caps.
- Runs a separate sports-line divergence strategy (Polymarket vs. Pinnacle) via a real odds feed.
- Runs in **dry-run / paper-trade mode by default** — no real capital until paper performance validates the edge.

## How it's built
- **Stack:** Python. Anthropic Claude (Haiku for batch screening, Sonnet for confirmation), The Odds API, n8n workflow, MapLibre web view, systemd service (`polybot.service`), Loguru.
- **Notable engineering:**
  - **Pre-filter gates before any model call** — liquidity floor ($500), price-extreme cutoffs (skip <0.07 / >0.93 where models miscalibrate), and rule-based exclusion of sports and crypto-price markets the model can't reason about. Cheap rules gate expensive LLM calls.
  - **Two-tier model pipeline** — Haiku batch-screens the field cheaply, Sonnet confirms the survivors, with per-day cost tracking and a budget cap.
  - **Bayesian log-odds opinion pool** (`bayesian.py`) — blends market-implied probability with the Claude estimate rather than trusting either alone.
  - **Real risk layer** (`risk.py`) — exposure limits, daily loss cap, duplicate-trade prevention; Kelly sizing in the main loop with daily rollover.
  - **Separate sports strategy** (`odds_scanner.py`) — divergence between Polymarket and sportsbook lines, since the LLM has no live game data.
- **Architecture:** `main.py` loop → `scanner.py` (fetch + pre-filter + batch screen + confirm) → `model.py` (Claude calls, cost tracking) + `bayesian.py` (blend) → `risk.py` (sizing/limits) → trade or skip. `odds_scanner.py`/`odds.py` run the parallel sports strategy.

## Proof points
- Layered decision pipeline: rule gates → cheap model → expensive model → Bayesian blend → risk-gated Kelly sizing.
- Cost-aware LLM use: Haiku/Sonnet split with a daily budget cap, not naive one-model-per-market.
- Real risk controls: exposure caps, daily loss cap, duplicate prevention.
- Deliberately un-shipped to production capital — paper-trade gate is the point, not a limitation.

## What to show
- **Demo:** None — a trading bot has no clickable UI, and the value is the logic, not a screen. This is a **case-study-only** write-up.
- **Visuals needed:** the decision-pipeline diagram (rule gates → Haiku → Sonnet → Bayesian → risk → trade); a redacted paper-trade performance report (`analyze_performance.py` output); a code snippet of the pre-filter gates or the Kelly/risk logic. Reads as "engineer," not "gambler."

## Cross-links
- Shares the "**AI reasoning over scraped/market data with a discipline layer**" shape with [thrift-lens](thrift-lens.md) (Vision + comps + deal score) and [public-storage-bot](public-storage-bot.md) (rates + Claude "is this a deal?").
- Part of the off-repo infra story alongside [Hermes](hermes.md) (n8n, MCP, VPS).

## Case-study angle
The project that proves Alex thinks like an operator, not a hobbyist: he built the boring, essential parts — the risk manager, the cost gate, the paper-trade discipline — that separate a real trading system from a demo, and refused to risk real money until the data justified it.
