---
project: Hermes + n8n automation stack
repo: ""
visibility: off-repo (self-hosted VPS)
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: advanced
status: live
---

# Hermes + n8n Automation Stack
**One-liner:** A self-hosted market-intelligence agent and automation layer running on a personal VPS — proof that Alex builds infrastructure, not just apps.

## Origin (the Build Loop)
> Because I **wanted a steady read on markets and opportunities without babysitting a dozen sources**, I kept hitting **the fact that the useful signal was scattered across the web and nobody was going to aggregate it for me**, so I built **Hermes — a market-intelligence pipeline on my own VPS that searches, summarizes, and delivers**, that **posts digestible summaries straight to where I'll actually read them**. It taught me **to run and maintain always-on infrastructure — the unglamorous part of "it just works."**

## The problem
Most "AI agent" projects live on someone else's platform and die when the free tier ends. I wanted something I actually own and control: an agent that runs on my own box, pulls current information through real search tooling, and pushes summaries to me on a schedule — plus a broader automation layer for the other recurring jobs in my life.

## What it does
- **Hermes** — a market-intelligence pipeline that runs on a schedule, searches the web via MCP-connected search providers, summarizes findings, and delivers them to a channel I read daily.
- **n8n automation layer** — the broader workflow platform on the same VPS running additional jobs, including a job-market scraper and newsletter automation.
- **Human-in-the-loop review** — summaries flow to a connected surface (e.g. a Google Sheet) so a non-technical partner can review them without touching the pipeline.

## How it's built
- **Stack:** n8n (self-hosted workflow orchestration) on a Servarica VPS; MCP servers for web search (Brave Search / Tavily); delivery to Discord (migrated off Telegram); Google Sheets for human review.
- **Notable engineering:**
  - Self-hosted and maintained — provisioning, uptime, and migration between delivery channels (Telegram → Discord) are all owned end to end.
  - MCP-server integration for tool-use, the same pattern used across Alex's other AI work.
  - Multi-channel delivery (Slack + Discord for the newsletter automation) and a spreadsheet review loop for non-technical stakeholders.
- **Architecture:** scheduled n8n trigger → MCP search tools → summarize → deliver to Discord/Sheet. Additional independent workflows (job-scraper, newsletter) run on the same instance.

## Proof points
- Always-on, self-hosted on owned infrastructure — not a hosted-platform toy.
- Multiple production workflows on one VPS (Hermes + job scraper + newsletter).
- Real migration executed in production (Telegram → Discord) without losing the pipeline.
- Human-review loop makes the output usable by a non-engineer.

## What to show
- **Demo:** None — it's backend infrastructure on a private VPS. **Case-study-only.**
- **Visuals needed:** a screenshot of the n8n workflow canvas (nodes visible); an example Discord summary post; a simple diagram (schedule → MCP search → summarize → deliver). Redact any keys/endpoints.

## Cross-links
- Shares the **MCP + AI + scheduled delivery** DNA with [POLYBOT](polybot.md) (n8n workflow, Discord) and the job-market scraper that also surfaces in [JOB-HUNTER](job-hunter.md).
- Part of the off-repo infrastructure story with [Home Infrastructure](home-infrastructure.md) and [Security Research](security-research.md).

## Case-study angle
The project that proves "builder" means infrastructure too: Alex stood up and maintains an always-on, self-hosted AI agent on his own VPS — provisioning, tool integration, channel migration, and a human-review loop included.
