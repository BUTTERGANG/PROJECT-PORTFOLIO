---
project: Bible Study App
repo: BUTTERGANG/bible-study-app
visibility: public
demo_url: ""
demo_type: live
cluster: life-admin
tier: standard
status: prototype
---

# Bible Study App
**One-liner:** A Logos-style Bible study app — commentary, word study, and an AI study assistant — built because the established software costs a fortune.

## Origin (the Build Loop)
> Because I **wanted to study Scripture deeply**, I kept hitting **the fact that the serious tools (Logos and the like) are expensive and heavy**, so I built **my own study app with commentary, word study, and an AI assistant**, that **gives me the depth I wanted without the price tag**, It taught me **a full-stack build with real theological data ingestion — FastAPI backend, structured study data, and an AI layer over it.**

## The problem
Good Bible-study software exists but it's costly and bloated. I wanted the core of what it offers — commentary, original-language word study, cross-references, and a smart assistant to synthesize it — in something I built and controlled.

## What it does
- Logos-style study interface: commentary, word study, and more.
- AI study assistant over the text.
- Structured scripture/study data ingestion pipeline.

## How it's built
- **Stack:** FastAPI + SQLAlchemy + SQLite (async, aiosqlite), Alembic migrations, Anthropic Claude (`anthropic`), `pypdf` for source ingestion, JWT auth (python-jose), Playwright in the ingest tooling; JS/React frontend. Dockerized with a Makefile.
- **Notable engineering:** a real data-ingestion pipeline for study resources; async FastAPI backend with migrations and auth; an AI assistant layered over structured scripture data.
- **Architecture:** ingest (Playwright/pypdf) → structured store (SQLAlchemy/SQLite, Alembic) → FastAPI (JWT) → React study UI with Claude assistant.

## Proof points
- Full-stack build with a genuine data pipeline, migrations, and auth.
- AI assistant grounded in structured study data, not a bare chatbot.

## What to show
- **Demo:** Deploy to a public URL (repo is public); note prototype status and which features are live.
- **Visuals needed:** the study interface (passage + commentary + word study); an AI-assistant answer; the ingest pipeline diagram.

## Cross-links
- Life-admin/personal cluster; shares the **FastAPI + AI-over-structured-data** shape with [personal-finance-dashboard](personal-finance-dashboard.md).

## Case-study angle
Another "wouldn't pay for it, so I built it" project — and a solid full-stack sample: ingestion pipeline, migrations, auth, and an AI layer, all in service of something Alex personally uses.
