---
project: Job Hunter
repo: BUTTERGANG/JOB-HUNTER
visibility: public
demo_url: ""
demo_type: live
cluster: job-search
tier: advanced
status: live
---

# Job Hunter
**One-liner:** A personal job-hunting dashboard that scrapes five job boards, AI-ranks every listing, benchmarks the pay against government wage data, and pings me on Discord when a good one lands — the Build Loop pointed straight at my own career.

## Origin (the Build Loop)
> Because I **was actively pursuing operations/AGM roles**, I kept hitting **the same drowning-in-browser-tabs problem — the same listings across five sites, no way to tell a real offer from a lowball, and good roles gone before I refreshed**, so I built **a dashboard that scrapes the boards, scores each job with Claude, benchmarks salary against BLS data, and alerts me on Discord**, that **turns a chaotic search into a ranked, tracked pipeline**. It taught me **that the strongest proof of "I build the tools for the job I'm doing" is building the tool for the job search itself.**

## The problem
Job hunting for the exact kind of role this portfolio is about — ops/AGM — meant the same friction every day: the same listings duplicated across LinkedIn, Indeed, Glassdoor, ZipRecruiter, and Google; no fast way to tell whether a posting was worth my time or a lowball; and the good ones filled before I got around to checking. I wanted a system that did the watching and the first-pass judgment for me.

## What it does
- **Multi-board scraping** — LinkedIn, Indeed, Glassdoor, ZipRecruiter, and Google via `python-jobspy`.
- **AI ranking** — scores each job across pay, flexibility, location, requirements, hours, and workload using Claude.
- **BLS wage benchmarks** — compares each salary against Bureau of Labor Statistics Indiana wage data, so "is this pay real?" gets an answer.
- **Salary targeting** — set minimum / target / stretch salaries and benchmark against the data.
- **Discord alerts** — scheduled scrapes ping a channel the moment a job clears my score threshold.
- **Tracking pipeline** — import jobs into a tracker with status, tier, notes, and resume tailoring, backed by a stored master resume.
- **Market Analysis dashboard** — visual breakdown of every scraped job: sectors, salary distribution, remote vs. onsite, top companies, posting timeline.
- **Dedup everywhere** — cross-run deduplication (never analyze/alert the same listing twice) and import duplicate protection.

## How it's built
- **Stack:** Next.js 15 App Router, React, Tailwind, shadcn/ui; SQLite via `better-sqlite3`; Anthropic Claude API; `python-jobspy` driven as a Python subprocess; `recharts` for the analysis dashboard; `papaparse`; Discord webhooks.
- **Notable engineering:**
  - Node/Next front end orchestrating a Python scraping subprocess — a clean polyglot bridge rather than reimplementing the scraper.
  - AI scoring across six weighted dimensions, not a single "good/bad" flag.
  - Cross-run dedup and scheduled scraping make it a standing service, not a one-shot script.
  - Real external data integration (BLS wage benchmarks) to ground the salary judgment.
- **Architecture:** scheduled scrape → `python-jobspy` subprocess → dedup → Claude scoring + BLS benchmark → SQLite → dashboard + Discord alert → tracking pipeline.

## Proof points
- 5 job boards aggregated through one pipeline.
- 6-dimension AI scoring per listing.
- Government wage-data benchmarking, not just scraped salary text.
- Deduplicated, scheduled, alerting — a real running system.

## What to show
- **Demo:** Deploy to a public URL (repo is already public). Seed with a live scrape so a visitor sees the ranked list, the Market Analysis charts, and a sample Discord alert.
- **Visuals needed:** the ranked job list with scores; the Market Analysis dashboard (sector/salary charts); a Discord alert screenshot.

## Cross-links
- Shares the **scrape → AI-score → deliver** shape with [Hermes](hermes.md) and the "AI says is-this-worth-it" judgment in [thrift-lens](thrift-lens.md) and [POLYBOT](polybot.md).
- It's the living proof behind the [Where It's Heading](../next-chapter.md) pillar.

## Case-study angle
The single most on-thesis project in the portfolio: Alex built his own AI-ranked job-search platform to run the exact search these applications are part of. If you want to know whether he actually turns friction into systems — he did it to find *you*.
