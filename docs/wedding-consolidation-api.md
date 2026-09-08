---
project: Wedding Consolidation API
repo: BUTTERGANG/Wedding-Consolidation-API
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: weddings
tier: advanced
status: prototype
---

# Wedding Consolidation API
**One-liner:** The backend that collapses a wedding vendor's 4–5 tool stack — CRM, galleries/delivery, file storage, email — into one multi-org service, with vendors bringing their own Dropbox, their own branded email templates, and their own gear inventory.

## Origin (the Build Loop)
> Because I **built WeddingOS and saw where the real vendor pain lives — not in the CRM but in the stack around it**, I kept hitting **the fact that every vendor juggles HoneyBook + Pixieset + Dropbox + Mailchimp, each with its own billing and its own login**, so I built **a multi-org backend where each vendor keeps their own storage account and their own branded email identity, and WeddingOS just calls this service**, that **makes "bring your own everything" the architecture instead of a feature request.** It taught me **that multi-tenancy done right (per-org API keys, row-level isolation, encrypted OAuth tokens) is the difference between a demo and a product.**

## The problem
WeddingOS handles the vendor-facing UI. But vendors still need: file storage (Dropbox/Drive), branded email (their identity, not a generic sender), migration from their old tools, and venue/contact management. Each is a separate SaaS with separate billing. The consolidation thesis: one backend service, org-scoped, where vendors plug in their own accounts — and WeddingOS's UI calls this platform instead of reimplementing it.

## What it does
- **Design DNA** — per-org brand tokens (8), font/logo uploads, validated with traversal guards.
- **Email render pipeline** — variables + DNA CSS → inline/strip/rewrite modes, dev vs. send rendering, 5 template foundations.
- **AgentMail send layer** — render → send → history, idempotent, automation rules.
- **Dropbox storage** — full OAuth flow with CSRF state, **encrypted tokens at rest** (Fernet), refresh, folders/upload/share links.
- **Migration importer** — CSV → mapped client payload with source hints, dedupe, and warnings; stateless.
- **Venues** — venue records with emergency contacts, org-scoped CRUD.
- **Per-org rate limiting** — token buckets on send/import/storage endpoints.

## How it's built
- **Stack:** Python, Alembic migrations, pytest, ruff, CI with **spec-diff checks**; per-org API-key auth.
- **Notable engineering:**
  - **Row-level isolation at the query layer** — `OrgScopedRepository` makes cross-org leaks structurally impossible, verified by isolation tests for DNA, assets, sends, imports, venues, and storage connections.
  - **OAuth tokens encrypted at rest** — Dropbox tokens Fernet-encrypted from `SECRET_KEY`.
  - **Spec-diff CI** — the OpenAPI spec is a tracked artifact; drift fails the build.
  - **Asset traversal guard** — per-org asset paths that 403 on escape attempts.
- **Architecture:** WeddingOS UI → this service (per-org API key) → AgentMail / Dropbox / Postgres. 27 API paths, 44 passing tests, ruff clean.

## Proof points
- **All 6 phases complete, pre-deploy** — 44 tests passing, ruff clean, 27 API paths, all isolation tests green.
- **Six security guarantees verified by test**, not by intention: row-level isolation, encrypted OAuth tokens, traversal guards, per-org rate buckets.
- **Designed as a platform seam** — WeddingOS (UI) and this service (platform) have a contract, not a tangle.

## What to show
- **Demo:** Case-study-only (multi-tenant backend holding vendor credentials). The TIER1 status board and an architecture diagram are the visuals.
- **Visuals needed:** service architecture diagram (WeddingOS → consolidation API → Dropbox/AgentMail/DB); the isolation test matrix; the Design DNA token flow.

## Cross-links
- **Direct companion to [WeddingOS](weddingos.md)** — the platform layer under the UI layer.
- Shares the **multi-tenant security discipline** with [WeddingOS](weddingos.md) (Zod/CSRF/CSP) and [WORKOUTFLOW](workoutflow.md) (NIST-grade hardening).
- The **BYO-storage OAuth pattern** connects to [gear-rental](gear-rental.md) (rental concepts feeding the same vendor stack).

## Case-study angle
This is the project where "full-stack" means more than "can build a UI": row-level isolation enforced at the query layer, OAuth tokens encrypted at rest, spec-diff CI, and every security guarantee proven by a test. **The unglamorous backend discipline that makes a multi-tenant SaaS real.**
