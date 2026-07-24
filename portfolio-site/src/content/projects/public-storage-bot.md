---
project: Public Storage Rate Aggregator & AI Analyzer
repo: BUTTERGANG/public-storage-bot
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: deal-hunting
tier: standard
status: live
---

# Public Storage Rate Aggregator & AI Analyzer
**One-liner:** A tool that pulls live Public Storage unit pricing across locations and a Telegram bot that uses Claude to tell me whether the current rate is actually a good deal.

## Origin (the Build Loop)
> Because I **was pricing self-storage units**, I kept hitting **the fact that Public Storage rates fluctuate constantly and there's no easy way to know if right now is a good time to book**, so I built **an aggregator that scrapes rates across locations plus a Claude-powered Telegram bot that judges the deal**, that **turns "is this a good rate?" into an on-demand answer in my chat app**. It taught me **the reusable pattern: scrape a market, then let an AI make the buy/skip call — the same shape I later scaled up in [POLYBOT](polybot.md).**

## The problem
Storage pricing is opaque and time-sensitive — the same unit swings in price, and the "sale" may or may not be real. I wanted real-time pricing across locations and a quick verdict on whether to book, without building a whole dashboard I'd never open.

## What it does
- **Scraper CLI** — fetches real-time pricing, availability, and unit features via the internal JSON API plus static HTML.
- **CSV aggregation** — exports multiple locations into one combined spreadsheet.
- **Telegram bot with AI analysis** — Claude 3.5 Sonnet analyzes the aggregated rates and tells me which deals are actually worth it, delivered in Telegram.

## How it's built
- **Stack:** Python; internal JSON API + HTML scraping; CSV export; Telegram bot; Anthropic Claude 3.5 Sonnet; runs as a `systemd` service.
- **Notable engineering:** combined internal-API + HTML data sources; an always-on service; delivery through a chat app I already use rather than a bespoke UI.
- **Architecture:** scraper (JSON API + HTML) → combined CSV → Claude deal analysis → Telegram delivery.

## Proof points
- Real-time multi-location pricing via internal API + HTML fallback.
- AI deal judgment delivered to a chat app, always-on via systemd.
- An early, small version of the "scrape a market → AI decides" pattern.

## What to show
- **Demo:** None — it's a Telegram bot / CLI. **Case-study-only.**
- **Visuals needed:** a Telegram screenshot of a deal verdict; a sample of the aggregated CSV; a one-line diagram (scrape → CSV → Claude → Telegram).

## Cross-links
- Same **scrape-then-AI-judge** DNA as [POLYBOT](polybot.md) (markets), [thrift-lens](thrift-lens.md) (resale), and [Hermes](hermes.md) (delivery to chat).

## Case-study angle
A tidy proof of a repeated instinct: Alex keeps building the same useful shape — aggregate a confusing market, then let an AI give a plain buy/skip answer where he'll actually see it. POLYBOT is this idea grown up.
