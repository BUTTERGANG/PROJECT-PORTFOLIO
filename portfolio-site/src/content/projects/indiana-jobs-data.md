---
project: Indiana Jobs Data
repo: BUTTERGANG/indiana-jobs-data
visibility: public
demo_url: ""
demo_type: live
cluster: job-search
tier: standard
status: live
---

# Indiana Jobs Data
**One-liner:** A knowledge base and analytics pipeline for the daily Indiana job market — structured data from multiple job boards, trend analysis, and DOCX-ready reports.

## Origin (the Build Loop)
> Because I **was applying to jobs in the Indianapolis market and wanted to know what was actually out there**, I kept hitting **the fact that job boards show you listings but nobody shows you the shape of the market — which companies are hiring most, what titles are trending, where the salary ranges actually sit**, so I built **a daily scraper-pipeline that collects, structures, and analyzes Indiana job postings**, that **turns raw listings into market intel I can act on**. It taught me **that the job market is a data-pipeline problem, not a search problem.**

## The problem
Job boards are built for search, not analysis. You can find a job, but you can't answer "what's the most common title in my metro this week" or "which companies posted the most yesterday" or "how does the salary range for this role compare to last month." I wanted the market-level view — the daily pulse, not the per-listing search.

## What it does
- **Daily job scraping** — collects listings from multiple Indiana-focused job sources.
- **Structured knowledge base** — job title, company, location, salary range (when available), posting date.
- **Market analytics** — trending titles, top hiring companies, salary distributions per role, posting volume over time.
- **DOCX report generation** — formatted market-summary documents for offline review or submission.
- **Trend tracking** — week-over-week changes in posting volume and composition.

## How it's built
- **Stack:** Python, SQLite, DOCX template generation, Playwright
- **Notable engineering:**
  - **Scheduled daily pipeline** — the scraper runs on a daily cron with idempotent insertion (same listing → no duplicate).
  - **DOCX with defensive null handling** — the report generator handles missing salary ranges, null descriptions, and partial listings without crashing (defensive coding learned from earlier fragility).
- **Architecture:** Daily cron trigger → multi-source scraper → SQLite → analytics query → dashboard/DOCX output.

## Proof points
- **Continuous daily collection** — not a one-off harvest. The dataset grows every day with new postings.
- **DOCX report generation** — formatted output ready for offline review.
- **Market-intel output** — answers questions like "which companies are hiring most right now" and "what are the salary ranges for this title."

## What to show
- **Demo:** The analytics dashboard showing market trends; a sample DOCX market report.
- **Visuals needed:** the trend chart showing posting volume over time; the top-companies table; a sample DOCX report page.

## Cross-links
- Sibling project to [JOB-HUNTER](job-hunter.md) (same domain, different output — JOB-HUNTER is the application tool, Indiana Jobs Data is the market-intel side).
- The **scheduled pipeline + DOCX generation** pattern connects to [JOB-HUNTER](job-hunter.md) (DOCX defense) and [SALES-BOT](sales-bot.md) (cron-triggered data flow).

## Case-study angle
The data side of the job-search thesis: Alex built his own market-intel pipeline for the Indiana job market because the existing platforms only show listings, not trends. **It's job-search as a data science problem — and the most honest proof that Alex applies the same analytical approach to his own career that he does to commodities and pricing.**