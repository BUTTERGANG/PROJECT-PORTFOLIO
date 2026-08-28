---
project: TheKnot Vendor Scraper
repo: BUTTERGANG/theknot-scraper
visibility: public
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: advanced
status: live
---

# TheKnot Vendor Scraper
**One-liner:** A production-grade, Dockerized scraper that started as a single-site vendor collector and grew into a nationwide, 3-marketplace vendor-and-review intelligence pipeline with its own sentiment-analysis dashboard — a written engineering analysis, a test suite, and pre-commit gates behind it the whole way.

## Origin (the Build Loop)
> Because I was **doing wedding and DJ work and needed real vendor data to work from**, I kept hitting **the fact that pulling TheKnot programmatically with a plain HTTP request never returned usable data**, so I built **a production scraper using a real Chrome browser with realistic timing, human-like interaction, and session persistence**, that **reliably extracts a vendor's business name, starting price, and packages**. It taught me **that "it's blocked" is usually a diagnosis worth double-checking — the biggest failure in this build wasn't access at all, it was scraping the wrong page type, and I only found that by writing the analysis down.**

## The problem
The wedding industry's vendor data lives on sites that are hard to read programmatically — plain HTTP requests come back empty because the pages depend on a real browser environment to render. Getting clean, structured vendor records off TheKnot meant treating it as a serious data-engineering problem, not a weekend `requests` script.

## What it does
- Extracts structured vendor data from TheKnot.com vendor pages: business name, starting price, and package list (as a validated Pydantic model)
- Runs reliably with a real-browser setup where plain HTTP scraping returns nothing
- Single-vendor and batch/multi-vendor scraping examples
- Configurable entirely via environment variables (timing, behavior, proxy, output)
- Ships with a full test suite, Docker deployment, and code-quality tooling
- **Grew into a nationwide vendor + review pipeline** — added a cracked TheKnot GraphQL reviews endpoint, plus Zola and WeddingWire scrapers, feeding the same PostgreSQL store (28 metros, 22 states, DJs/planners/photographers/venues/florists/caterers).
- **Rule-based sentiment tagger** — classifies every review positive/neutral/negative and auto-detects 29 complaint/praise categories (communication, billing, professionalism, etc.), with vendor replies excluded from complaint analytics so a vendor's own rebuttal doesn't get counted as a customer complaint.
- **Dashboard v2** — rebuilt as a modern dark-themed, responsive vendor-intelligence dashboard on top of the sentiment data.

## How it's built
- **Stack:** Python 3.8+, undetected-chromedriver + Selenium (real Chrome), Pydantic (typed vendor models + config), Loguru; packaged with `pyproject.toml`; Docker + docker-compose; Makefile; pytest + mypy + black + ruff + pre-commit.
- **Notable engineering:**
  - **Real-browser reliability engineering.** A genuine Chrome environment, respectful pacing (mouse movement, gradual scrolling, randomized 5–10s delays so it behaves like a person and doesn't hammer the site), cookie/session persistence across runs, retry-with-backoff, and HTTP/SOCKS proxy support.
  - **Documented engineering analysis, not just code.** The repo carries a written technical analysis of why real-browser rendering is required, plus design notes, implementation notes, a systematic-improvements log, and an enhancements summary.
  - **A real debugging story baked into the docs.** The analysis concludes that an early "we're blocked" failure was actually a **page-type mismatch** — the scraper was pointed at a marketplace *listing* page whose selectors never match an individual *vendor* page. Navigation succeeded and cookies persisted; the CSS selectors just didn't exist on that page. Diagnosing the real cause instead of the assumed one is the engineering lesson.
  - **Measured, honest success rates.** The README publishes expected success by configuration: 90–95% (visible browser + residential IP + delays) down to 10–30% (headless) — real operational numbers, with residential proxies and non-headless mode called out as the difference between working and blocked.
  - **Production hygiene:** Dockerfile + docker-compose with health checks, resource limits, and volume mounts; a Makefile of common commands; pre-commit hooks; a stated >85% unit-test-coverage target with mypy type checking.
- **Architecture:** the `theknot_scraper/` package holds `scraper.py` (core, context-managed), `config.py` (env-driven `ScraperConfig`), and `utils.py`, with single- and multi-vendor examples and a `validate_setup.py` preflight. A separate `tests/` suite covers config and utils with pytest fixtures. Docker wraps the whole thing for reproducible, scalable (`--scale scraper=3`) runs.

## Proof points
- **Self-rated 9/10 technical difficulty** with a written engineering analysis to back the rating.
- **5 technical design/analysis docs** plus quick-start and testing guides — this is documented like a product.
- **Published success-rate matrix** (90–95% best case → 10–30% headless) instead of a vague "it works."
- **>85% unit-test coverage target**, mypy, black, ruff, and pre-commit hooks enforced.
- Dockerized with health checks, resource limits, and horizontal scaling via docker-compose.
- Grew from one vendor page's worth of fields into a 3-marketplace pipeline with its own rule-based sentiment classifier and 29-category complaint/praise taxonomy — the discipline (tests, Docker, written analysis) held as the scope grew.

## What to show
- **Demo:** None clickable — it's a data-collection service. This is a **case-study** on engineering rigor.
- **Visuals needed:** an excerpt of the engineering analysis (especially the "this is NOT an access problem — it's a page-type mismatch" conclusion); the README success-rate table; the extracted vendor Pydantic model; the docker-compose health-check block. This project sells the *documentation and process* as much as the code.

## Cross-links
- The real-browser data-collection problem here is the deep end of the same challenge in [Earl's Auction scraper](earls.md) and the harder-to-read retailers in [price-scrapers](price-scrapers.md).
- Wedding-vendor data ties into the weddings/DJ cluster (TIMELINE, WEDDINGTIMELINE, COMPLETE-PAPERWORK) — the deal-hunting toolchain feeding the wedding work.
- Shares the same vendor/review dataset with [Wedding Pricing Compare](wedding-pricing-compare.md), viewed through a different lens: that project analyzes the data for **pricing** (medians, ranges by metro); this one analyzes it for **sentiment** (complaint/praise patterns, vendor-reply handling).

## Case-study angle
Alex treated a hard data-collection problem as a real engineering problem — technical analysis, real-browser reliability stack, test suite, Docker, and a written post-mortem that caught a misdiagnosed failure — proving he can ship production data-collection infrastructure, not just a script that works once.
