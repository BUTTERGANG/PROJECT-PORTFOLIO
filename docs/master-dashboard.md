---
project: Master Dashboard
repo: BUTTERGANG/MASTER-DASHBOARD
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: infra
tier: advanced
status: live
---

# Master Dashboard
**One-liner:** A live command center for every project in this portfolio — real-time GitHub stats over Server-Sent Events, an agent-facing JSON API multiple Claude Code sessions can safely read and write concurrently, and human login + email 2FA gating the view — the tool built to manage the tools.

## Origin (the Build Loop)
> Because I was **running many AI coding agent sessions across dozens of repos at once**, I kept hitting **no single place to see what's blocked, what shipped, and who (or which agent) touched what last** — status lived in my head or got lost between sessions, so I built **a FastAPI dashboard that pulls live GitHub data over webhooks, lets agents read/write project status through a JSON API with attributed, lock-safe writes, and pushes updates to the browser over SSE**, that **turns "what's the state of everything" into a page that's always current**. It taught me **that once you're running multiple agents in parallel, coordination itself becomes the engineering problem — the dashboard isn't a nice-to-have, it's the thing that keeps concurrent agent work from silently overwriting itself.**

## The problem
Running this many self-directed projects — many of them worked on by AI coding agents in parallel sessions — created a coordination gap no README solves: which project is blocked, which has an open P1, what changed in the last hour, and whether two agents just clobbered each other's edits. GitHub itself doesn't answer "what's the state of everything right now" in one glance, and nothing enforced that a status change was attributable to a specific person or agent session.

## What it does
- **Live project command center** — a single-page dashboard with stat tiles, a "needs attention" panel (blocked projects + open P1s), and filterable/searchable project cards, one per repo.
- **Real-time updates over SSE** — a GitHub webhook hits `/webhook/github`, invalidates the cache, and pushes a Server-Sent Event so every open browser tab refreshes within ~1 second; falls back to a 120-second reload if no webhook is wired up.
- **Agent-facing JSON API** — `/api/projects`, `/api/detail`, `/api/agent-context` stay open to agent sessions even when the human-facing page is login-gated, by design, since they're meant to be hit directly by Claude Code sessions.
- **Attributed, lock-safe writes** — `PATCH /api/projects/{id}` updates a project's status/priority/blockers/notes and logs who (or which agent session) changed what via `X-Actor` / `X-Actor-Type` / `X-Actor-Session` headers; concurrent writes to the same project are serialized so racing agents can't silently clobber each other.
- **Human login + email 2FA** — optional username/password gate on the dashboard view, followed by a 6-digit code emailed through AgentMail; rate-limited logins, expiring OTPs, 7-day sessions.
- **Activity feed** — every attributed change appears in a global activity panel, a per-card "last touched by" pill, and a per-project detail drawer.

## How it's built
- **Stack:** Python, FastAPI, Server-Sent Events for push updates, GitHub CLI (`gh api`) shelled out for live repo data, AgentMail for transactional 2FA email, deployed on Replit.
- **Notable engineering:**
  - **Read-modify-write locking, not just an activity log.** `PATCH` holds a lock across the full read-modify-write span for a given project, so two concurrent agent sessions editing the same project's status can't race each other into an inconsistent write — the known gap is attribution (`X-Actor` is self-reported), not data loss.
  - **Two independent trust boundaries.** `DASHBOARD_KEY` gates agent writes (`PATCH`, notes, backfill) separately from `DASHBOARD_USERNAME`/`PASSWORD` + 2FA, which gates the human-facing page and its SSE feed — the agent JSON API is deliberately reachable without a browser session so agent sessions never need to carry a human login.
  - **Signed webhook verification** — `/webhook/github` validates `X-Hub-Signature-256` via HMAC-SHA256 against `GH_WEBHOOK_SECRET` when set, rejecting unsigned payloads once a real webhook is wired to a public URL.
  - **Honest failure mode, documented** — the README calls out that without `gh` authenticated, every project silently shows blank/zero live stats with no error surfaced; that's flagged as a known sharp edge rather than hidden.
  - **In-process caching with webhook-driven invalidation** — live GitHub stats (pushed date, commits, open issues/PRs) cache for 5 minutes per instance, or invalidate immediately on an incoming webhook, balancing GitHub API rate limits against freshness.
- **Architecture:** GitHub webhook → signature check → cache invalidation → SSE push to open tabs. Agent/human clients hit the FastAPI JSON API (`/api/projects`, `/api/detail`, `/api/agent-*`) which reads `projects.json` + live `gh api` data and writes back through a locked, attributed `PATCH` path; `activity.json` (capped at 500 entries) backs the activity feed.

## Proof points
- Coordinates live status across the entire multi-repo portfolio from one page, refreshed in real time via webhooks + SSE rather than manual polling.
- A concurrency model explicit enough to name its own limitation: writes are lock-safe, identity is self-reported and explicitly documented as such.
- Two separately configurable auth layers (agent API key vs. human 2FA login) reflecting two genuinely different trust models for the same data.
- Built to be used by AI agents as a first-class client, not just a human dashboard — the API is the primary interface, the UI is secondary.

## What to show
- **Demo:** None — internal tooling with real project data and credentials. **Case-study-only.**
- **Visuals needed:** the dashboard's stat tiles + "needs attention" panel; a project detail drawer showing the activity log with actor attribution; the SSE/webhook flow as a short diagram; the login + 2FA screen (with credentials blurred).

## Cross-links
- The meta-project of the portfolio: built to manage the other ~37 projects documented here, including this site.
- Shares the **webhook + real-time push** pattern with [k9-overwatch](k9-overwatch.md)'s Discord alerting and [job-hunter](job-hunter.md)'s scheduled Discord pings.
- Shares the **auth + rate-limited login** discipline with [moran-website](moran-website.md) and [weddingos](weddingos.md).

## Case-study angle
The clearest evidence that Alex's Build Loop applies recursively: once he was running several AI agents across dozens of repos, the friction of not knowing "what's the state of everything" became its own project — so he built the coordination layer, including the specific engineering (locking, signed webhooks, dual auth boundaries) that concurrent, multi-agent, multi-repo work actually requires. It's the tool that manages the tools.
