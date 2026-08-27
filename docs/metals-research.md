---
project: Metals Research
repo: BUTTERGANG/metals-research
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: standard
status: live
---

# Metals Research
**One-liner:** A research companion to the Infra Metals Dashboard — silver supply-side modeling, decades-long macro series, and the analytical write-ups that turn raw data into investment decisions.

## Origin (the Build Loop)
> Because I **was tracking metals prices and wanted to understand the deeper structure of supply and demand**, I kept hitting **the fact that the dashboard shows you what's happening but doesn't explain why — silver supply has been flat for a decade, but you'd never know that from the daily chart**, so I built **a research repository that models supply-side constraints, walks through decades-long macro cycles, and connects the dots between policy decisions and metal prices**, that **turns "price went up" into "here's why it might keep going."** It taught me **that the real value isn't the data — it's the narrative around the data.**

## The problem
The Infra Metals Dashboard is excellent at showing what's happening now — 93 data series and dozens of charts. But it doesn't answer "why" or "what's the long view." Silver industrial demand has been growing for years while mine supply plateaus; that's a multi-year thesis, not a daily signal. I wanted a companion research layer that connected the data series to the narratives that drive investment decisions.

## What it does
- **Silver supply-side model** — decades-long production data from primary and byproduct silver mines, showing that silver is largely a byproduct of copper, lead, and zinc mining (which means its supply is constrained by other metals' economics).
- **Macro cycle research** — long-duration series connecting interest rates, dollar strength, industrial production, and metal prices going back decades.
- **Thesis formulation** — structured write-ups that turn data observations into testable investment theses (e.g., "silver demand from solar manufacturing is structural and price-inelastic").
- **Companion to the dashboard** — the research points to specific dashboard series for live confirmation.

## How it's built
- **Stack:** Python (research notebooks + models), HTML/Markdown (write-ups), data from USGS, Silver Institute, LME, EIA
- **Notable engineering:**
  - **Byproduct supply modeling** — distinguishes primary silver mines from byproduct production (Cu, Pb, Zn) to model the true supply constraint: silver supply is constrained by copper demand, not silver demand.
  - **Decades-scale data** — series that go back 20+ years, not just the 2-year window most dashboards show.
  - **Thesis-to-dashboard link** — each research write-up identifies which dashboard data series would confirm or refute the thesis in real time.
- **Architecture:** Research notebooks → structured write-ups → linked to dashboard series. The research lives in the repo as markdown + charts; the dashboard is the live confirmation layer.

## Proof points
- **Silver supply thesis** — demonstrated that silver is structurally supply-constrained because >70% of production is byproduct of base metal mining. Growing industrial demand (solar, electronics) faces an inelastic supply curve.
- **Macro-scale analysis** — not single-quarter trends but multi-decade cycle structures that drive commodity super-cycles.
- **Directed research** — every write-up is thesis-driven, not just "here's a chart of this series."

## What to show
- **Demo:** Case-study-only (research repository). The silver supply model chart with byproduct breakdown is the hero; the thesis write-ups show the thinking process.
- **Visuals needed:** the silver byproduct supply-model chart (mine production split by primary vs byproduct); a macro-cycle timeline annotated with policy/price milestones; the dashboard-series reference table per thesis.

## Cross-links
- Direct companion to [Infra Metals Dashboard](infra-metals-dashboard.md) — the research layer behind the 93-series dashboard.
- Shares the **commodity-macro analysis** approach with the broader infra cluster ([hermes](hermes.md), [security-research](security-research.md), [home-infrastructure](home-infrastructure.md)).

## Case-study angle
The project that proves Alex doesn't just collect data — he forms theses from it. The silver supply-side model reveals a structural constraint that most casual metal watchers miss entirely (byproduct dependency), and connects it to real-world drivers (solar panel manufacturing). **It's the difference between a data collector and a research analyst.**