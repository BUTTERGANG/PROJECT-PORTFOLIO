---
project: Workout Programming Platform
repo: BUTTERGANG/WORKOUTFLOW
visibility: private
demo_url: ""
demo_type: live
cluster: lifting
tier: advanced
status: live
---

# Workout Programming Platform
**One-liner:** A professional weightlifting team-management platform — coaches build and assign periodized programs, athletes log workouts mobile-first, and progression is tracked end to end.

## Origin (the Build Loop)
> Because I **compete in Olympic weightlifting and end up coaching and programming for a team**, I kept hitting **the fact that programming, assigning, and tracking a whole team of athletes was scattered across spreadsheets and texts, with no shared tooling that both coach and athlete could actually use**, so I built **a team-management platform where coaches build periodized programs and athletes log against them on their phones** that **ties program → workout → set log → progression into one system**. It taught me **how to model a real coaching org hierarchy with role-based access and how much security a multi-user platform actually demands.**

## The problem
Coaching a weightlifting team is a data problem wearing a clipboard. A coach writes periodized programs (weeks, days, exercises, phases), assigns them per athlete, and needs to see who's actually completing work and progressing. The athlete needs the opposite side of the same coin: a fast, one-handed, mobile way to log weight, reps, and RPE mid-session — with sweaty hands, in a loud gym. Nothing off the shelf fit both roles without turning into a spreadsheet, so I built the shared tool the team needed.

## What it does
- **Program builder:** coaches create periodized programs organized Weeks → Days → Exercises, assign them to athletes, and reuse templates.
- **Exercise library:** pre-loaded library plus support for custom exercises.
- **Team management:** Organizations → Teams → Athletes with role-based access (Admin, Head Coach, Assistant Coach, Athlete).
- **Org join flow:** search organizations by name, 8-character invite codes, and shareable invite links (`/join/:inviteCode`) — all gated behind coach approval.
- **Mobile-first workout logging:** athletes log sets, reps, and RPE through a dark, thumb-reachable UI built for one-handed gym use.
- **Athlete tools:** rest timer and plate calculator built in.
- **Progress analytics:** 1RM estimates, weekly volume, completion rates, and strength-progression visualizations over time.
- **Dashboard statistics:** real-time coach view (active programs, athlete count, completed workouts, 7-day completion rate, weekly volume) and athlete view (assigned programs, completion).
- **Self-assignment & messaging:** athletes can self-assign template programs; organization-wide messaging with polling-based updates.

## How it's built
- **Stack:** React 18 + TypeScript frontend with TailwindCSS and Shadcn UI (Material Design 3 dark theme, Roboto / Roboto Mono); Express.js + TypeScript backend; PostgreSQL (NeonDB serverless) via Drizzle ORM; TanStack Query; wouter routing; Recharts. Passport.js local auth with bcrypt. Built and deployed on Replit.
- **Notable engineering:**
  - **Real org hierarchy + RBAC** — Organizations → Teams → Athletes with four roles enforced on every API endpoint, not just in the UI.
  - **Security hardening pass** — 12-character minimum password policy following NIST SP 800-63B (length over complexity), Helmet security headers, auth-endpoint rate limiting (5 attempts / 15 min / IP), crypto-safe invite codes with collision detection, SameSite session cookies, database error masking in production, and a structured logger that recursively redacts 15+ sensitive patterns across all log calls.
  - **Query & transaction correctness** — rewrote `getProgramWeeks()` from 73 queries to 1 via JOINs for 12-week programs, killed N+1s in athlete assignments, and wrapped program creation, join-request approval, and cascade deletes in transactions to prevent orphaned data and race conditions. Composite btree indexes on `workout_sessions(athlete_id, started_at)` and `set_logs(exercise_log_id, timestamp)` back the statistics queries.
  - **Data-integrity validation** — guards against duplicate week/day numbers and exercise orders, validates day numbers 1–7 and positive set counts before a program is written.
- **Architecture:** Passport-authenticated Express API over Drizzle/Neon PostgreSQL, session store in PG via `connect-pg-simple`; React + TanStack Query client with a mobile-optimized logging surface and a desktop program-builder surface; role-based data filtering at the endpoint layer.

## Proof points
- Four-tier role model (Admin / Head Coach / Assistant Coach / Athlete) enforced server-side on all endpoints.
- Documented performance wins: 73 queries → 1 for program weeks; N+1 elimination in athlete assignments; COUNT(DISTINCT) aggregations to prevent double-counting athletes across teams.
- Structured logger replaced all 74 `console.error` calls with redaction-safe logging; removed all 5 unsafe `as any` casts for proper typing.
- End-to-end data model: Organization → Team → Program (Weeks/Days/Exercises) → Workout Session → Exercise Log → Set Log, with comprehensive atomic cascade deletes.

## What to show
- **Demo:** Deploy the Replit build to a public URL (repo stays private). Seed with a demo org so a visitor can view the coach dashboard and the athlete logging flow.
- **Visuals needed:** the program builder (library / tree / details three-pane); the mobile set-logger with the RPE slider; the coach dashboard statistics; a strength-progression chart. Blur any real athlete names/emails in seeded data.

## Cross-links
- The programming/team half of the weightlifting toolchain with [Mind Games](mind-games.md) (the competition/data anchor) and [VBT Tracker](vbt-prototype.md) (the in-gym bar-speed measurement layer). Same domain expertise — Olympic weightlifting — expressed at three different layers.
- Shares the **Drizzle + Neon PostgreSQL + Replit** stack with Mind Games.

## Case-study angle
A lifter who coaches built the team platform he actually needed — real RBAC, a periodization-correct data model, and a security pass (NIST password policy, redacting logger, rate limiting, transaction atomicity) that most solo prototypes never get near.
