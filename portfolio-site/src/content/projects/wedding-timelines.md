---
project: Wedding Timeline Planner
repo: BUTTERGANG/WEDDINGTIMELINE
visibility: private
demo_url: ""
demo_type: live
cluster: weddings
tier: advanced
status: live
---

# Wedding Timeline Planner
**One-liner:** A planner that generates and formats the day-of run-of-show timeline for a wedding — the second, full rebuild of a tool I first shipped as a simple public version.

## Origin (the Build Loop)
> Because I **DJ and MC weddings**, I kept hitting **the fact that every event needs a precise day-of timeline and I was rebuilding them by hand each time**, so I built **a planner that generates and formats the run-of-show**, that **turns a repetitive document into a few inputs and a clean output**. It taught me **the value of rebuilding v1 properly once I understood the real workflow — [TIMELINE](https://github.com/BUTTERGANG/TIMELINE) was the sketch, WEDDINGTIMELINE is the real thing.**

## The problem
A wedding lives or dies on its timeline — when the party starts, grand entrance, first dance, toasts, cake, last song. As the DJ/MC I need that run-of-show tight and consistent for every event, and hand-building each one is slow and error-prone. I wanted to enter the moving pieces once and get a clean, formatted timeline out.

## What it does
- Builds and formats a wedding day-of / run-of-show timeline.
- Full web app for entering events and generating the schedule.
- Successor to the earlier public **TIMELINE** planner (v1) — same job, proper build.

## How it's built
- **Stack:** React + TypeScript, Drizzle ORM, Vite, Vitest (Replit-style client/server/migrations layout); tests included.
- **Notable engineering:** clean rebuild with a real schema and test coverage, versus the minimal v1.
- **Architecture:** React client → Express/Drizzle server → Postgres, with migrations.

## Proof points
- A v1 → v2 progression (TIMELINE → WEDDINGTIMELINE) that shows learning from a shipped tool.
- Test coverage on a personal project.
- Used against the real event workflow behind [DJ Ops paperwork](complete-paperwork.md).

## What to show
- **Demo:** Deploy WEDDINGTIMELINE to a public URL (repo stays private); TIMELINE v1 is already public and linkable as the predecessor.
- **Visuals needed:** the timeline-builder input screen; a generated run-of-show output.

## Cross-links
- Weddings cluster with [DJ Ops paperwork digitizer](complete-paperwork.md); connects to the off-repo Node.js/docx **run-of-show generator** script.

## Case-study angle
A small but honest signal of craft growth: Alex shipped a basic timeline tool, learned from running real events with it, then rebuilt it properly with a schema and tests. The Build Loop applied to his own earlier code.
