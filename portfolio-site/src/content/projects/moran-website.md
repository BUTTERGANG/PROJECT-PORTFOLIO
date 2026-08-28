---
project: MASS Gym Platform
repo: BUTTERGANG/MORAN-WEBSITE
visibility: private
demo_url: "https://moranacademy.replit.app/"
demo_type: live
cluster: lifting
tier: advanced
status: live
---

# MASS Gym Platform
**One-liner:** A full gym-management platform for a real weightlifting gym — public marketing site, athlete portal, and an admin back office with a block-periodization program builder — built on Next.js, Prisma, and NeonDB.

## Origin (the Build Loop)
> Because I **live inside the Olympic-weightlifting gym world and know how a strength gym actually runs**, I kept hitting **the fact that a real gym was operating on DMs, spreadsheets, and paper waivers — no single place for athletes to see their programming, sign a waiver, or get updates, and no clean back office for the coaches**, so I built **a complete platform: a public site, an approval-gated athlete portal, and an admin panel with a full program builder** that **runs the gym's front-of-house and back-of-house from one Next.js app on Postgres**. It taught me **that building for someone else's real athletes — real names, real waivers, real payments — forces a security and access-control discipline a personal project never does.**

## The problem
A working strength gym had talent, athletes, and programming — but no system. Athletes learned about schedule changes over group chats, waivers lived on paper, and the coaches had nowhere to build, assign, and track training programs. The site needed to do two jobs at once: be the public front door that presents the gym and its coaches, and be the private operations hub — approving new athletes, publishing programming, capturing signed waivers with a real audit trail, and tracking check-ins and payments.

## What it does
- **Public marketing site** — Home, Programs, Coaches, Articles, an internal events calendar, Schedule, Contact, and a strength shop, built on the Next.js App Router.
- **Approval-gated registration** — athletes self-register (status `PENDING`), an admin approves them to `ACTIVE`; rejected users get a dedicated page and no athlete access.
- **Athlete portal** — dashboard with the athlete's assigned (or tier-default) program, daily workouts, check-ins, surveys, announcements, and payment links.
- **Program builder** — full block-periodization model: Program → Block → Week → Workout Day → Exercise Prescription (sets, reps, %/RPE, rest, notes), with reusable block templates, per-athlete exercise overrides, a preview mode to see the athlete's view, and bulk duplicate/delete.
- **Check-in tracking** — mood, soreness, sleep, and bodyweight logged per day, rendered as compliance sparklines with CSV export for the coaches.
- **Admin back office** — announcements, surveys with response tracking, article/SOP content management, team/tier management, expense tracking with receipt uploads, and Stripe payment links.
- **Signed waivers** — typed-signature waiver flow that captures IP, user agent, waiver version, and a SHA-256 hash of the exact text agreed to, exportable to PDF.
- **Near-real-time updates** — lightweight 45-second polling on the program and alerts managers, paused when the browser tab is hidden.
- **Coach-facing analytics** — per-athlete trend detail pages and a team-wide trends dashboard, plus a public team leaderboard.
- **Operational hardening** — scheduled athlete-data sync with failure alerting, a match-queue admin UI, a waiver-text drift guard (flags if the live waiver text no longer matches what was actually signed), and automated database backups to Replit Object Storage.

## How it's built
- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4. NextAuth / Auth.js (JWT sessions, credentials provider) for auth. Prisma 5 ORM over NeonDB (serverless PostgreSQL). `bcryptjs` for password hashing, `pdf-lib` for waiver PDFs, `nodemailer` for email, `sharp` for image re-encoding, DOMPurify for HTML sanitization, and Three.js for the ambient visual background.
- **Notable engineering:**
  - **Centralized, role-aware access control** — a three-tier role model (`ATHLETE` / `ADMIN` / `SUPERADMIN`) crossed with account status (`PENDING` / `ACTIVE` / `REJECTED`). Every API route goes through shared guards (`isAdminOrAbove`, `isSuperAdmin`, `isActive`), and `middleware.ts` enforces the same rules at the edge — pending users are boxed into `/pending`, admin routes are closed to non-admins, and only superadmins can delete users or change roles.
  - **Hardened file uploads** — receipt uploads are size-capped, MIME-validated with magic-byte header checks (real PDF detection, SVG explicitly blocked as an XSS vector), re-encoded through `sharp` to strip anything embedded, and filename-sanitized.
  - **Legally meaningful waiver audit trail** — rather than a checkbox, each signature stores the signer's IP, user agent, waiver version, and a SHA-256 hash of the precise text they agreed to, so the gym can prove exactly what was signed.
  - **XSS-safe admin content** — all admin-authored rich HTML (articles, SOPs) runs through a `sanitizeRichHtml()` DOMPurify pass that strips scripts, event handlers, and iframes and restricts links to safe schemes.
- **Architecture:** One Next.js App Router application — public pages, an athlete `/dashboard`, and an `/dashboard/admin` back office — talking to route handlers backed by Prisma and NeonDB, with NextAuth JWT sessions, middleware guarding every protected path, and Stripe payment links + email notifications hanging off the admin side.

## Proof points
- **Real client work** — a live platform for an actual weightlifting gym and its athletes, not a demo.
- Complete relational programming model — Program → Block → Week → Day → Exercise, with templates and per-athlete overrides — not a flat workout list.
- Security taken seriously for a small-gym app: centralized guards, edge middleware, hashed passwords, sanitized rich HTML, magic-byte upload validation, and a hashed waiver audit trail.
- Front-of-house and back-of-house in one codebase: marketing site, approval flow, athlete portal, and full admin panel.
- Kept shipping after launch: coach-facing trends dashboards, a public leaderboard, scheduled sync with failure alerting, a waiver-text drift guard, and automated DB backups — the kind of post-launch operational hardening that separates a real production app from a portfolio demo.

## What to show
- **Demo:** Deploy to a public URL (repo stays private). Land on the public home page, walk through Programs and Coaches, then log into a seeded demo athlete account to show the portal and an assigned program; a seeded admin account can show the program builder and check-in sparklines.
- **Visuals needed:** the public home hero and coaches page; the admin program builder (Block → Week → Day → Exercise) with preview mode; the check-in compliance sparklines; the approval-gated registration flow; the waiver signature/audit view. Blur real athlete names, emails, and any waiver PII as blur-sensitive.

## Cross-links
- The client-delivered sibling of [WorkoutFlow](workoutflow.md) — both are team-programming platforms for strength coaching; WorkoutFlow is the self-driven R&D, this is the shipped-for-a-real-gym build.
- Shares the same "public site + authenticated portal + Stripe + Postgres migration" shape as the [LA Media Website](la-media-website.md) — the client-facing web pattern, applied to a different business.
- Part of the Weightlifting & Coaching cluster with [Mind Games](mind-games.md) and [VBT Prototype](vbt-prototype.md) — the domain expertise that makes the software correct.

## Case-study angle
Alex built and shipped a real gym's entire operating system — public site, approval-gated athlete portal, and a block-periodization program builder — with production-grade access control and a legally-defensible waiver audit trail, for a business with real athletes' data on the line.
