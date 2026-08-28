---
project: PetCare Companion
repo: BUTTERGANG/petcare-companion
visibility: public
demo_url: ""
demo_type: live
cluster: life-admin
tier: advanced
status: live
---

# PetCare Companion
**One-liner:** A pet-care app built for non-technical pet owners — medical records, breed reference, weight tracking, and a printable vet report, all in one clean PWA.

## Origin (the Build Loop)
> Because I **have dogs and wanted one place for their medical records, weight logs, and breed info**, I kept hitting **the fact that most pet apps are either toys (cute photos only) or veterinary EMRs (too specialized, ugly, locked behind logins)**, so I built **a dead-simple PWA that the actual pet owner in the house can use without explanation**, that **does medical records, breed reference, weight tracking, and prints a vet-ready summary from any device**. It taught me **that "for non-technical users" means every UI decision is a UX test — if the label doesn't say exactly what it does, it's wrong.**

## The problem
Pet owners need to track vaccinations, vet visits, weights, and medications — but the tools are either fluffy toy apps or clinical EMRs designed for vets. There's nothing in the middle that a normal person can open, enter "12.4 lbs," and walk away. I wanted an app that my partner could use without a tutorial — and that could hand a vet a clean record summary at a glance.

## What it does
- **Medical records** — log vaccinations, vet visits, medications, allergies, and surgeries per pet.
- **123 AKC-sourced breed reference** — browse official breed standards, traits, sizes, and temperaments.
- **Weight trend chart** — log weights and see a long-term trend line, not just the latest number.
- **Printable vet report** — one-button export of all medical records formatted for a vet visit.
- **Symptom checker** — basic triage guidance for common pet symptoms.
- **Nutrition tracking** — log food, treats, and supplements.

## How it's built
- **Stack:** Python, FastAPI, SQLite, Tailwind, PWA (offline-capable manifest + service worker)
- **Notable engineering:**
  - **123 AKC breed data** — the complete American Kennel Club breed standard dataset sourced and normalized into structured form. This is the only complete AKC breed reference available outside the AKC's own site.
  - **Zero-clarity UI** — every label and action is in plain English, no jargon, no icons without text, no hidden gestures. Designed to be usable by someone who doesn't know what a "hamburger menu" is.
  - **PWA-first** — installable on any device, works offline, no App Store required.
  - **Auth added without friction** — passwordless or simple-pin flow so the least-technical user doesn't hit a login wall.
- **Architecture:** FastAPI backend → SQLite → PWA frontend. 31 API routes. Single `uvicorn` process.

## Proof points
- **123 AKC breed profiles** sourced and structured — the most complete open pet-breed reference outside the AKC's own portal.
- **MVP + Phase 2 shipped** — auth, weight chart, vet report, symptom checker, nutrition tracking.
- **Clean UX validated by a non-technical user** — the primary design goal.
- **31 API routes** covering every feature module.

## What to show
- **Demo:** Deploy to a public URL (repo is public). The per-pet dashboard showing records + weight chart is the hero.
- **Visuals needed:** the pet dashboard with medical summary + weight trend chart; the breed browser with AKC-standard details; the vet report output.

## Cross-links
- Shares the **PWA + FastAPI + SQLite** pattern with the [live-dj-copilot](live-dj-copilot.md) and [k9-overwatch](k9-overwatch.md).
- The **non-technical-user design discipline** is the opposite of most portfolio projects, which is what makes it a good range signal.

## Case-study angle
PetCare Companion shows Alex can build something that his partner can actually use — not another dev-tool-facing project. The complete AKC breed dataset is genuinely valuable data work, and the clean PWA delivery means it works for the one person who actually needs it. **It's a range-broadener: domain expertise isn't always weightlifting and weddings.**