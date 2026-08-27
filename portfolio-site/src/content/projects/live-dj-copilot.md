---
project: Live DJ Co-Pilot
repo: BUTTERGANG/live-dj-copilot
visibility: public
demo_url: ""
demo_type: live
cluster: weddings
tier: standard
status: live
---

# Live DJ Co-Pilot
**One-liner:** A DJ suggestion engine that reads the room and suggests next tracks, transitions, and crowd-management moves — built as a FastAPI + mobile PWA.

## Origin (the Build Loop)
> Because I **DJ weddings and events every weekend**, I kept hitting **the fact that the best next-track decision is obvious in hindsight but hard in the moment — especially when you're managing a mic and a playlist**, so I built **a co-pilot that knows the current track, the room energy, and the genre map, and suggests what comes next**, that **gives me one less thing to think about when I'm running sound**. It taught me **that the most useful tool is the one that takes a 1-second decision down to zero seconds — not the one that generates perfect set lists.**

## The problem
A working DJ manages three things at once: what's playing now, what comes next, and how the room is responding. The "what comes next" decision is the one that suffers in the moment — you default to what you know, not what the room wants. A co-pilot that suggests the next track, transition type, and energy change based on the current state of the set would save the 1-second hesitation that's the difference between a smooth blend and an awkward silence.

## What it does
- **Track suggestion engine** — given the current track and room-energy assessment, suggests go-to next plays with transition type (blend, hard cut, fade, acapella intro).
- **Crowd-read integration** — logs energy assessments per track and builds a model of what works with this specific crowd.
- **Genre mapping** — tracks relationships between songs by energy, key, era, and genre to suggest viable transitions even between different styles.
- **Mobile PWA** — accessible from a phone or tablet on the DJ table, no second laptop required.

## How it's built
- **Stack:** Python, FastAPI, LLM (OpenRouter), SQLite, PWA (mobile-first manifest)
- **Notable engineering:**
  - **LLM-read parsing** — the co-pilot reads the current context (track, key, BPM, energy level) and uses structured LLM calls to suggest follow-ups rather than just retrieving from a static catalog.
  - **Context-aware transitions** — the suggestion isn't just "play Track B" but "hard cut on the downbeat, splice in the intro loop."
  - **Mobile-first** — the PWA is designed for the phone screen size on a DJ table, not a desktop workspace.
- **Architecture:** FastAPI → LLM (optional) + rule engine → SQLite suggestion DB → PWA frontend.

## Proof points
- **Shipped MVP** (August 24) — live and functional with core suggestion loop working.
- **Context-aware output** — not just a track list but actual transition advice (blend, cut, fade, acapella intro).
- **Real-event workflow** — built for Alex's own weekend workflow, not a hypothetical use case.

## What to show
- **Demo:** Deploy to a public URL (repo is public). The suggestion UI on mobile with a current-track context and next-track suggestion is the hero.
- **Visuals needed:** the mobile PWA suggestion screen; the genre-map visualization; a sample suggestion with transition type and energy delta.

## Cross-links
- Sits in the **weddings/DJ cluster** with [Wedding Timeline Planner](wedding-timelines.md), [WeddingOS](weddingos.md), and [COMPLETE-PAPERWORK](complete-paperwork.md).
- The **LLM-structured-output** pattern connects to [SALES-BOT](sales-bot.md) and [POLYBOT](polybot.md).

## Case-study angle
A DJ who built his own mobile co-pilot because the commercial tools (DJ.Studio, Mixed In Key) are desktop-only and don't read the room. **It's the "scratch your own itch" ethos applied to the literal DJ table — mobile-first, context-aware, and built for the moment between tracks.**