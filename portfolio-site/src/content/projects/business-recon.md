---
project: Business Recon
repo: BUTTERGANG/business-recon
visibility: public
demo_url: ""
demo_type: live
cluster: deal-hunting
tier: advanced
status: live
---

# Business Recon
**One-liner:** A B2B lead discovery and enrichment pipeline — SMTP-verify emails, deep-crawl company websites, and render the results as a CRM view.

## Origin (the Build Loop)
> Because I **needed to find and qualify B2B leads without paying for ZoomInfo or Lusha**, I kept hitting **the fact that every lead-generation tool is $100+/month and the underlying data is mostly public — you just have to find it on the right three pages**, so I built **a pipeline that SMTP-verifies email addresses, deep-crawls company sites, and presents the enrichment as a CRM view**, that **takes a raw lead and returns a research file ready to send. It taught me **that most business data is "public but not published" — it lives on an about-us page, a LinkedIn profile, or a PDF that Google crawled three years ago.**

## The problem
B2B lead generation tools (ZoomInfo, Lusha, Apollo) are expensive and their data is often stale. The raw information — company size, funding, tech stack, recent hires, email format — is public on the company's own website, LinkedIn, and industry directories. The work is finding it, verifying it, and formatting it. I wanted to enter a company name and get back a complete lead file without paying per-record.

## What it does
- **SMTP email verification** — checks whether an email address actually exists on the recipient's mail server without sending mail (catch-all detection + mailbox verification).
- **Deep website crawl** — given a company domain, discovers about-us, team, careers, and press pages and extracts contact info, team size, and technology signals.
- **CRM view** — presents the enriched leads as a structured table with status, verification score, and enrichment depth.
- **Retry logic for unknown SMTP verdicts** — servers that return "try again later" get requeued, not dropped.
- **Admin actions** — delete stale leads, re-verify email addresses, re-crawl company pages.

## How it's built
- **Stack:** Python, FastAPI, SQLite, SMTP library, web crawling, HTMX UI
- **Notable engineering:**
  - **SMTP verification without sending** — connects to the recipient's MX server, initiates the SMTP conversation, and parses the RCPT TO response. Handles catch-all domains, greylisting, and timeouts.
  - **Deep crawl extraction** — not just a sitemap scrape but targeted page discovery (linkedin.com/company/ redirect from the site, /about/, /team/, /careers/ patterns) with content extraction from each.
  - **Queued retry architecture** — leads with unknown SMTP verdicts enter a retry queue with exponential backoff. CRM view shows the verification confidence.
  - **SCRUM-based development** — built through tracked tasks with explicit completion criteria.
- **Architecture:** FastAPI → SMTP verifier + web crawler → SQLite → HTMX CRM view. Admin actions trigger re-verification without blocking the UI.

## Proof points
- **SMTP verification pipeline works** — process email addresses through MX handshake without sending mail, with catch-all detection and retry queue.
- **Deep crawl extracts real contact context** — not just an email but the role, company context, and industry signals.
- **SCRUM-tracked build** — completed through a task pipeline (task 007: retry unknown verdicts + deep crawl + CRM view) rather than ad-hoc iteration.
- **CRM view** — structured lead table with verification confidence, enrichment status, and admin controls.

## What to show
- **Demo:** Deploy to a public URL (repo is public). The CRM view with a populated lead table and the SMTP verification results is the hero.
- **Visuals needed:** the CRM view showing enriched leads with verification scores; the deep-crawl results panel per company; the retry queue showing "unknown → verified" progression.

## Cross-links
- The **data-enrichment pipeline architecture** connects to [WEDDING-PRICING-COMPARE](wedding-pricing-compare.md) (enrich raw vendors → structured DB) and [theknot-scraper](theknot-scraper.md) (enrich raw marketplace data).
- Shares the **SMTP protocol dance** DNA with [SALES-BOT](sales-bot.md) (both leverage low-level internet protocols for business advantage).

## Case-study angle
The most "scrappy startup ops" project in the portfolio: Alex built his own ZoomInfo replacement because the real tool costs money and the data is public anyway. SMTP verification without sending mail is a genuinely underused technique, and the deep-crawl pattern shows he thinks beyond "scrape a single page." **It's a lead-sourcing engine that costs zero monthly recurring and returns verified data.**