---
project: Mind Games
repo: BUTTERGANG/MINDGAMES
visibility: private
demo_url: "https://mindgames.fit/"
demo_type: live
cluster: lifting
tier: anchor
status: live
---

# Mind Games
**One-liner:** An IWF-compliant Olympic weightlifting competition simulator, built end-to-end as a data platform on ~7,000 real USAW competition records.

## Origin (the Build Loop)
> Because I **compete in USAW-sanctioned Olympic weightlifting and know the IWF rules cold**, I kept hitting **the fact that there was nowhere to practice the strategy of a meet — the attempt selection, the clock, the "who's leading after this lift" math**, so I built **a full competition simulator on real historical data** that **lets you run a meet the way it actually plays out**. It taught me **that deep domain expertise is the moat — the rules knowledge is what made the simulation correct, and the correctness is what makes it valuable.**

## The problem
Olympic weightlifting meets are as much strategy as strength: when you open, how you jump, whether you chase a placing or play it safe, all under a running clock and IWF rules. There's no flight simulator for that. And the historical data that would make a realistic simulator lives inside USAW's Sport80 portal — behind a SAML login, a cookie-consent step, and paginated tables, exported as thousands of individual CSVs.

## What it does
- **Competition Mode** — simulates a sanctioned Olympic weightlifting meet under IWF rules: 2-minute clocks, weight declarations, attempt order, and live standings.
- **Data Browser** — searches a live database of **68,637 lifters across 7,358 competitions** of public USAW results, per-lifter bests and history.
- **Warmup Generator, Speed Run, Dice, and Masters modes** — a suite of practice tools all built on the same historical dataset.
- Runs on real historical athlete/meet data rather than synthetic numbers.
- Full web app UI (React + Radix) for running and reviewing simulated meets, live at [mindgames.fit](https://mindgames.fit/).

## How it's built
- **Stack:** TypeScript, React, Radix UI, Tailwind; Neon (serverless PostgreSQL); Drizzle ORM; Playwright; Vite; Vitest. Node/Express server, `etl/` pipeline, `scripts/`, `migrations/`.
- **Notable engineering:**
  - **ETL at scale** — ingests ~7,000 USAW CSV files into Neon PostgreSQL through a repeatable pipeline (not a one-time hand import).
  - **Authenticated data collection** — custom Playwright automation that logs in through Sport80's SAML flow, handles the cookie-consent step, and walks paginated result tables to export the full dataset reliably.
  - **Rules-correct domain model** — the schema and simulation encode IWF competition rules, which is what separates this from a generic sports database.
- **Architecture:** Playwright scrapers → normalized CSVs → ETL into Neon PG (Drizzle-managed schema/migrations) → Express API → React simulation client.

## Proof points
- ~7,000 USAW CSV files ingested into a production PostgreSQL database — surfacing **68,637 lifters across 7,358 competitions** in the live Data Browser.
- Automated a real SAML login + cookie-consent + pagination flow to collect the data at scale.
- End-to-end: scraper → ETL → database → API → interactive simulator, all one person.
- Separate USA Masters dataset/config — the platform generalizes beyond one data source.

## What to show
- **Demo:** Deploy the Replit build to a public URL (repo stays private). Seed with a real historical meet so a visitor can run a simulation in one click.
- **Visuals needed:** the simulation screen mid-meet; a standings/leaderboard view; a small architecture diagram (scrapers → ETL → Neon → UI); optionally a screenshot of the ETL run count.

## Cross-links
- Shares the **Playwright + real-browser data-collection** discipline with [EARLS](earls.md), [the TheKnot scraper](theknot-scraper.md), and [CIVIC-DUTY](civic-duty.md).
- Sits at the top of the weightlifting toolchain with [VBT-PROTOTYPE](vbt-prototype.md) and [WORKOUTFLOW](workoutflow.md).

## Case-study angle
The clearest proof that Alex builds where his lived expertise is deepest: a rules-correct Olympic-lifting simulator that only exists because he knew the sport well enough to model it — and was persistent enough to build the authenticated pipeline that collected 7,000 files to feed it. **This is the anchor case study for the whole portfolio.**
