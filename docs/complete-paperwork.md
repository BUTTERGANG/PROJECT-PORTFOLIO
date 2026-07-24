---
project: DJ Ops (Complete Paperwork)
repo: BUTTERGANG/COMPLETE-PAPERWORK
visibility: public
demo_url: ""
demo_type: live
cluster: weddings
tier: advanced
status: live
---

# DJ Ops — Paperwork Digitizer
**One-liner:** A mobile-first PWA that photographs a physical event contract or run-of-show sheet and extracts the details into a searchable database with Claude Vision — so "where's that paperwork?" stops being a question I ask mid-event.

## Origin (the Build Loop)
> Because I **DJ 25–40 weddings and events a year**, I kept hitting **the moment on the floor where I needed a detail off a signed contract or run-of-show and it was a photo buried in my phone or a sheet in a folder in the car**, so I built **a PWA that snaps the paperwork, reads it with Claude Vision, and files the extracted fields into a searchable database**, that **puts every event's details one search away, live, from my phone**. It taught me **that the photograph-it-and-extract pattern is reusable — I later built the same core into [thrift-lens](thrift-lens.md).**

## The problem
Working DJs run on paper: contracts, run-of-show sheets, pay details, timelines. In the moment — mic in one hand, next song cued — you don't want to be scrolling a camera roll or digging through a folder for the one number you need. I wanted to photograph the paperwork once and have it become structured, searchable data I could pull up instantly at the next event.

## What it does
- **Scan paperwork** — photograph a contract or run-of-show sheet from the phone.
- **AI extraction** — Claude Vision reads the image and pulls the structured details (event info, timeline, pay) into the database.
- **Event management** — manage events and track pay across them.
- **Searchable history** — every digitized document is queryable, so any detail is one search away on-site.
- **Installable PWA** — works like a native app on a phone, built for use in the field.

## How it's built
- **Stack:** React + TypeScript + Vite (frontend, port 5000), Express + tsx (backend, port 3000), Drizzle ORM + PostgreSQL, `@anthropic-ai/sdk` for Claude Vision; `heic-convert` (handles iPhone HEIC photos); `p-limit` / `p-retry` for resilient batch processing; deployed on Replit with its identity system for auth.
- **Notable engineering:**
  - **HEIC conversion** — iPhones shoot HEIC; the pipeline converts before sending to Vision, a real-world detail most demos skip.
  - **Resilient extraction** — `p-limit` + `p-retry` handle rate limits and transient failures on batch scans rather than failing the whole upload.
  - **Vision-to-schema** — the hard part is mapping messy real-world paperwork to a clean Drizzle schema reliably.
- **Architecture:** phone camera → HEIC convert → Claude Vision extraction (rate-limited/retried) → Drizzle/Postgres → searchable PWA.

## Proof points
- Purpose-built for a real workflow Alex runs 25–40 times a year.
- Handles the actual field conditions (iPhone HEIC, flaky venue connectivity, batch scans).
- Same Vision-extraction core later reused in a completely different domain (resale) — proof of a repeatable skill.

## What to show
- **Demo:** Deploy to a public URL (repo is public). Seed with a sample (non-real) contract so a visitor can scan → see extracted fields → search. Use a dummy document, not a client's real contract.
- **Visuals needed:** the scan/capture screen; the extracted-fields result; the search view. Blur or fake any real client/PII.

## Cross-links
- **Direct sibling of [thrift-lens](thrift-lens.md)** — same photograph-it-and-extract Claude Vision pattern, different domain. This pair is the portfolio's clearest "reusable pattern, not one-off" evidence.
- Complements the off-repo Node.js/docx **run-of-show generator** and the [wedding timeline planners](wedding-timelines.md) in the weddings cluster.

## Case-study angle
The tool that most literally captures the thesis: a working DJ got tired of hunting for paperwork on the floor, so he built a Vision-AI app to make it searchable from his phone — then reused the exact same engine to price thrift finds. One pattern, two businesses.
