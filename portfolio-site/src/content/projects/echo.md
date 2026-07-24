---
project: ECHO
repo: BUTTERGANG/ECHO
visibility: private
demo_url: ""
demo_type: case-study-only
cluster: life-admin
tier: advanced
status: prototype
---

# ECHO
**One-liner:** A local-first voice journal — talk, get it transcribed and optionally summarized, track habits and mood — built so my thoughts live on my device, not on someone's server.

## Origin (the Build Loop)
> Because I was **wanting to journal by voice without shipping my private thoughts to a server**, I kept hitting **the fact that every voice-journal app assumes the cloud — your audio and transcripts sit in someone else's database**, so I built **a local-first Expo app where structured data lives in an in-browser WASM SQLite DB, audio blobs stay in IndexedDB, and nothing leaves the device unless I explicitly opt into an AI summary**, that **lets me journal by voice, track habits and mood, and see streak insights while owning the data**. It taught me **privacy-by-architecture: the guarantee has to be enforced by where the bytes physically live, not by a promise in a privacy policy.**

> Note: this is the **"note-taking app" the portfolio spec had listed as a blank TODO** — now a real, privacy-engineered build.

## The problem
I wanted to journal by voice — talking is faster and more honest than typing. But every voice-journaling app I looked at is cloud-first: your audio is uploaded, your transcripts are stored on their servers, and you're trusting a privacy policy. Journaling is exactly the kind of data I don't want in someone else's database. The interesting problem wasn't the journaling UI — it was building the whole thing so that "your thoughts never leave your device" is true by construction.

## What it does
- Record a voice entry; it's transcribed to text (Whisper).
- Optionally request an AI-generated **three-part summary** (Anthropic Claude) — only when the user opts in, per entry.
- Track user-defined daily habits with one check-in per habit per day.
- Mood and streak insights derived over your own history (mood heatmap, streak counter).
- Playback of the original audio alongside the transcript in the entry detail.
- Opt-in encryption at rest: set a passphrase and journal transcripts are encrypted with AES-256-GCM.
- One Expo universal codebase runs on web now and migrates to iOS/Android later.

## How it's built
- **Stack:** Expo / React Native (universal — web + native), TypeScript, `expo-audio`, `expo-sqlite` (native) / sql.js WASM (web), `drizzle-orm` + drizzle-kit migrations, Zustand, Express proxy server for AI calls.
- **Notable engineering — privacy by architecture:**
  - **On web, the database is SQLite compiled to WASM (sql.js) running inside a plain Web Worker**, persisted to IndexedDB via a drizzle `sqlite-proxy` driver. It needs no COOP/COEP headers and no cross-origin isolation — which is what lets it run inside a sandboxed preview iframe while keeping all structured data client-side.
  - **Audio blobs never touch a database server** — they're stored in IndexedDB keyed by entry id (`idb:<id>`), on-device. On native the same data uses real `expo-sqlite` and the filesystem, with the *same* drizzle migration bundle across both platforms.
  - **Write-order guarantees no data loss** — the record flow persists audio *before* transcription runs, so a transcription failure can never lose the recording.
  - **Opt-in-only AI** — a Claude three-part summary is generated only when the user asks, only from transcript text, and the API key is a server-side secret behind an Express proxy (`server/index.mjs`), never shipped in the client bundle. A `check-web-env.mjs` script blocks `EXPO_PUBLIC_…` keys from web builds.
  - **Opt-in encryption at rest** — AES-256-GCM via WebCrypto, key derived with PBKDF2-SHA-256 (210k iterations); only the salt and a verifier are persisted, the key lives in memory only, and there's deliberately no recovery path (forgotten passphrase = unreadable, by design).
  - **Honest trade-off, documented in-repo:** on web, transcription is done server-side (a `/api/transcribe` proxy to hosted Whisper) because on-device transformers.js proved unreliable — the first-run model download was large and WASM inference OOM'd on constrained devices. Audio is streamed through the proxy for transcription (never stored server-side); the record screen and Settings copy reflect this exactly rather than overclaiming an on-device guarantee.
- **Architecture:** platform-conditional files (`.ts` / `.native.ts`) share one API. `db/client.ts` picks sql.js-in-Worker (web) or expo-sqlite (native); `services/` splits into `whisper` (transcription), `claude` (summary proxy), `audioStore`, `vault` (encryption), `export`. Data model: `entries`, `ai_summaries` (one row per Claude summary, storing the parsed 3-part output + raw response + prompt version), `habits` / `habit_logs` (unique-indexed per habit/date).

## Proof points
- 100% of structured data and audio stays client-side (WASM SQLite + IndexedDB); nothing leaves the device except opt-in AI-summary transcript text.
- AES-256-GCM at rest with PBKDF2-SHA-256 (210k iterations), key-in-memory-only, no recovery path.
- One Expo universal codebase targeting web + iOS + Android from a single drizzle migration bundle.
- Prompt versioning stored per summary so AI output can be reproduced/audited across prompt revisions.

## What to show
- **Demo:** None — the entries are my personal journal. Even though it runs on web, a live demo would mean exposing real journal data, so this is **case-study-only**.
- **Visuals needed:** a data-locality diagram (Web Worker + WASM SQLite + IndexedDB on-device, vs. the single opt-in arrow out to the Claude proxy); a screenshot of the record → transcript → summary flow with **entry text redacted**; the mood heatmap / streak insights with placeholder data.

## Cross-links
- Shares the **local-first, "I own the data" posture** with [Personal Finance Dashboard](personal-finance-dashboard.md) (self-hosted, never-public).
- Reuses the **Claude-behind-a-server-proxy, key-never-in-the-client** pattern from [POLYBOT](polybot.md).

## Case-study angle
The build that proves Alex can make a privacy promise *true by construction*: instead of claiming "your data is safe," he engineered an app where the sensitive bytes physically never leave the device — and documented the one honest exception rather than papering over it.
