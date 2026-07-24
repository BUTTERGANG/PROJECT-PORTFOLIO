---
project: 365 Day Productivity Tracker
repo: BUTTERGANG/productivity-tracker
visibility: public
demo_url: ""
demo_type: live
cluster: life-admin
tier: standard
status: live
---

# 365 Day Productivity Tracker
**One-liner:** A GitHub-style contribution grid for personal productivity — track daily tasks, build streaks, and see the whole year at a glance.

## Origin (the Build Loop)
> Because I **wanted to actually build and hold daily habits**, I kept hitting **the fact that a to-do list forgets yesterday and gives you no sense of momentum**, so I built **a year-long contribution grid for my own tasks and streaks**, that **makes consistency visible the way GitHub's grid makes commits visible**, It taught me **that the right visualization is itself the motivation — you don't want to break the chain.**

## The problem
Ordinary task apps live in the present: check a box, it disappears, and you lose the thread of whether you've actually been consistent. The thing that drives habit is *seeing the streak*. I wanted the GitHub contribution-graph feeling applied to my own daily goals.

## What it does
- A GitHub-style contribution grid for daily tasks.
- Streak tracking and year-at-a-glance visualization.
- Clean, fast single-purpose web app.

## How it's built
- **Stack:** Vite + JavaScript (client-side app; `npm run dev` / build to `dist/`).
- **Notable engineering:** the contribution-grid rendering and streak logic; deliberately lightweight and deployable anywhere static.
- **Architecture:** local-first Vite SPA rendering the grid from stored daily entries.

## Proof points
- Simple, finished, public, and deployable in minutes.
- A good "built for myself, ships clean" example.

## What to show
- **Demo:** Deploy the static build to Vercel/Pages (repo is public) — instant live URL.
- **Visuals needed:** the filled-in contribution grid; a streak view.

## Cross-links
- Life-admin cluster with [ECHO](echo.md) (journaling/streaks) and [personal-finance-dashboard](personal-finance-dashboard.md).

## Case-study angle
A small, honest "I build for myself" piece — and the easiest thing on the whole site to put behind a live URL, which makes it useful as a low-stakes first demo link.
