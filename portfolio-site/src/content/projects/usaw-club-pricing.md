---
project: USAW Club Pricing
repo: BUTTERGANG/usaw-club-pricing
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: lifting
tier: standard
status: live
---

# USAW Club Pricing
**One-liner:** A research-grade dataset and interactive dashboard covering 770 USAW-affiliated weightlifting clubs across all 50 states — with public pricing for 331 (43%) — built entirely from free public web research.

## Origin (the Build Loop)
> Because I **compete in USAW weightlifting and wanted to know what coaching actually costs across the country**, I kept hitting **the fact that most clubs deliberately hide pricing behind "fill out our form" lead-capture gates, and nobody has ever published the actual distribution**, so I built **a dataset + dashboard that documents which clubs publish pricing, what they charge, and — just as honestly — which don't**, that **turns a market's best-kept number into an open dataset.** It taught me **that "we couldn't find it" is data too: the 57% without pricing is the finding.**

## The problem
USAW club pricing doesn't exist as a dataset. Clubs bury rates behind contact forms, compare sites don't cover weightlifting, and USAW itself doesn't publish club dues. For an athlete relocating or a coach benchmarking rates, the only option is calling clubs one by one.

## What it does
- **770 clubs, all 50 states** — the full USAW affiliate list, structured.
- **331 clubs (43%) with public pricing** — coaching/membership rates harvested from club sites.
- **11 interactive charts** — distributions, state breakdowns, price bands.
- **Honest absence tracking** — clubs without public pricing are documented as such, not dropped.
- **Static + self-contained** — deployable to Replit, VPS, GitHub Pages, or localhost.

## How it's built
- **Stack:** Static HTML + charts; dataset as structured files. No paid APIs, no scraped subscriber content — all free public web research.
- **Notable engineering:**
  - **The 43% is the story** — the dataset distinguishes "priced" (publishes rates) from "gated" (hides behind lead forms), quantifying a deliberate market behavior instead of pretending the data doesn't exist.
  - **Research-grade rigor from free sources** — every pricing point sourced from a club's own public site.
- **Architecture:** public-web research pipeline → structured dataset → static dashboard with 11 charts.

## Proof points
- **770 clubs across 50 states** — the complete USAW affiliate list, structured.
- **331 with published pricing** — the largest public weightlifting-coaching pricing dataset that exists.
- **Zero paid APIs** — built from club sites alone.

## What to show
- **Demo:** The dashboard itself (static — deployable anywhere).
- **Visuals needed:** the price-distribution chart; the state-coverage map; a screenshot of the "why 43%" explainer.

## Cross-links
- Sits in the **weightlifting cluster** with [mind-games](mind-games.md), [weightlifting-equipment](weightlifting-equipment.md), and [vbt-prototype](vbt-prototype.md) — the domain-moat applied to market research.
- The **free-public-data + honest-coverage** approach mirrors [infra-metals-dashboard](infra-metals-dashboard.md) (93 series from government/exchange sites) and [strain-catalog](strain-catalog.md).

## Case-study angle
Only someone inside USAW weightlifting would know club pricing is deliberately gated — and would care enough to build the dataset that quantifies it. **770 clubs, 331 price points, zero paid sources: domain knowledge turned into the reference dataset that didn't exist.**
