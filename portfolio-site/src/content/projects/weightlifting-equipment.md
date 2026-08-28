---
project: Weightlifting Equipment Price Tracker
repo: BUTTERGANG/weightlifting-equipment
visibility: public
demo_url: ""
demo_type: live
cluster: lifting
tier: standard
status: live
---

# Weightlifting Equipment Price Tracker
**One-liner:** Collects pricing data from 20+ weightlifting equipment retailers — barbells, plates, racks, belts, apparel, and shoes — and makes it publicly browsable.

## Origin (the Build Loop)
> Because I **train and compete in Olympic weightlifting and buy gear regularly**, I kept hitting **the fact that equipment prices vary wildly by retailer and there's no single place to compare**, so I built **a scraper that polls 20+ retailers and collects of barbell, plate, rack, belt, apparel, and shoe prices into one database**, that **lets me see who has the best price on a Rogue Ohio bar this week without checking six sites**. It taught me **that the most valuable public dataset is the one nobody else bothered to build because it's "just scraping."**

## The problem
Weightlifting equipment is sold across dozens of specialty retailers (Rogue, Rep Fitness, Titan, American Barbell, etc.) with no cross-shop comparison tool. Prices change frequently, stock comes and goes, and finding a specific barbell at the best price means clicking through every shop manually. I wanted one source of truth for equipment pricing that was public and maintained.

## What it does
- **20+ retailer price tracking** — barbells, plates, racks, belts, apparel, and shoes.
- **Structured product database** — product name, price, retailer, category, and availability per scrape cycle.
- **Public dataset** — the collected data is usable outside the tool itself; the repo has the data, not just the scraper.
- **Replit-hosted app** — runs in-app scraping on Replit's infrastructure.

## How it's built
- **Stack:** Python, Playwright, SQLite (Replit-hosted)
- **Notable engineering:**
  - **Retailer-specific selectors** — each of the 20+ retailers requires its own CSS/xpath extraction strategy (no two retailers structure their product pages the same way).
  - **Playwright resilience** — handles dynamic JS-rendered pages, popups, cookie consent walls, and CAPTCHA redirects per retailer.
  - **Collection products.json pattern** — adopted the "collection" approach: gather raw product data into intermediate JSON before normalizing, rather than scraping directly into DB.
- **Architecture:** Per-retailer scraper (Playwright) → intermediate `products.json` → SQLite → public dataset.

## Proof points
- **20+ retailers instrumented** — the widest equipment price coverage in any public repository. Every major specialty retailer included.
- **Public dataset** — the collected price history is committed to the repo, not behind a dashboard or login.
- **Replit in-app scraping** — the scrapers run in a hosted environment without needing local infrastructure.

## What to show
- **Demo:** Deploy the Replit app to a public URL. The price browse page with category filters is the hero view.
- **Visuals needed:** the browse interface showing barbell prices across retailers; a product detail view showing price history; the retailer adapter count.

## Cross-links
- The **retailer-specific extraction** approach connects to [price-scrapers](price-scrapers.md) (grocery, same technique, different category) and the Playwright discipline shared across [EARLS](earls.md), [infra-metals-dashboard](infra-metals-dashboard.md), and [theknot-scraper](theknot-scraper.md).
- Sits in the **weightlifting cluster** with [Mind Games](mind-games.md), [VBT-PROTOTYPE](vbt-prototype.md), and [WORKOUTFLOW](workoutflow.md) — the practical-data side of the same sport.

## Case-study angle
A direct demonstration of the "build the tool that helps me buy gear" ethos, scaled to 20+ retailers. The public dataset commitment (the data lives in the repo, not behind a login) shows Alex thinks about value beyond the code itself. **It's data collection as a public good for the lifting community.**