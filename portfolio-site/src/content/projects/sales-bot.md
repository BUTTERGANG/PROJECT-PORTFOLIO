---
project: SALES-BOT
repo: BUTTERGANG/SALES-BOT
visibility: private
demo_url: ""
demo_type: live
cluster: weddings
tier: advanced
status: live
---

# SALES-BOT
**One-liner:** A sales negotiation co-pilot for wedding vendors — import a call transcript and get a report card on what you said, what the client signaled, and what to try next.

## Origin (the Build Loop)
> Because I **sell wedding services directly to couples and lead every sales conversation myself**, I kept hitting **the fact that I'd hang up the phone and immediately forget half of what the client signaled — the objections, the budget tells, the things they laughed at**, so I built **a post-call analyst that reads transcripts and scores the conversation against pricing psychology patterns**, that **gives me a report card and a growing playbook of what works with real couples**. It taught me **that the most valuable LLM application isn't generating text — it's analyzing your own pattern against a human domain you thought you understood.**

## The problem
Sales coaching for wedding vendors doesn't exist — there's no "go practice your consultation" simulator and no way to debrief a call systematically. Every conversation with a prospective couple has tells: how they react to a price, what they laugh at, where they pause. A human salesperson can feel "good" or "bad" about a call but can't score it objectively. I wanted a tool that would read a transcript and show me exactly where I left money on the table.

## What it does
- **Transcript analyzer** — paste in a sales call transcript and get a structured report card on rapport, objection handling, value articulation, and close technique.
- **Pricing psychology patterns** — detects where the conversation touched on anchoring, decoy effects, loss aversion, and social proof.
- **Growing playbook** — every analyzed call contributes to an evolving guide of "what works with this demographic" based on real outcomes.
- **Upsell engine** — surfaces margin opportunities by reading what the client signaled they valued (extra hours, specific services, premium add-ons).
- **Rule-based scoring without an API key** — core analysis works offline; LLM-powered event classification is optional via OpenRouter.

## How it's built
- **Stack:** Python, FastAPI, SQLite, HTMX, dark-theme dashboard; OpenRouter (optional LLM layer)
- **Notable engineering:**
  - **Rule-based + LLM hybrid** — core pricing-psychology analysis runs on deterministic rules so it works without any API key. The LLM layer (OpenRouter) enriches it with sentiment and event classification when configured.
  - **Domain-specific scoring** — the rules encode real sales psychology (anchoring, decoy, loss aversion), not generic sentiment analysis.
  - **Lightweight deployment** — runs on port 5559, single binary-equivalent Python app, SQLite-backed.
- **Architecture:** FastAPI serves the HTMX dashboard; transcript text in → rule engine → optional LLM enrichment → report card → playbook update.

## Proof points
- **Live and running** — served on a port-ready instance, taking real wedding transcript analysis.
- **Dual-mode analysis** — works fully with rules alone, improves with LLM enrichment when the key is set.
- **Domain-specific knowledge encoded** — the playbook grows from real calls, not generic sales training.

## What to show
- **Demo:** The dashboard at the configured port showing a sample transcript report card and the growing playbook.
- **Visuals needed:** the report card view showing scores per category; the playbook page showing accumulated patterns; a sample transcript annotated by the tool.

## Cross-links
- Built as a **WeddingOS companion** — SALES-BOT closes the loop from lead inquiry to signed contract with better margin.
- Shares the **domain-specific analysis** DNA with [POLYBOT](polybot.md) (where the domain is betting markets, not sales calls).

## Case-study angle
This is a perfect example of Alex building for his own daily workflow: a wedding-vendor salesperson who built his own post-call coach because the training doesn't exist elsewhere. The rule+LLM hybrid means it works regardless of budget, and the playbook grows from real Indianapolis wedding leads. **It's the domain-moat principle applied to sales.**