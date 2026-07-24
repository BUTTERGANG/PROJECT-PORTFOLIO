---
project: VBT Tracker
repo: BUTTERGANG/VBT-PROTOTYPE
visibility: public
demo_url: ""
demo_type: live
cluster: lifting
tier: advanced
status: prototype
---

# VBT Tracker
**One-liner:** A camera-first velocity-based training PWA that turns any phone into a bar-speed sensor — with AI autoregulation, BLE hardware support, and a live coaching dashboard.

## Origin (the Build Loop)
> Because I **compete in Olympic weightlifting and train by velocity — bar speed is the honest readout of how heavy a weight actually is on a given day**, I kept hitting **the fact that real bar-speed data is hard to capture: commercial VBT units cost hundreds of dollars, and there was no good way to just point a camera at the bar and get velocity**, so I built **a camera-first VBT tracker that runs a computer-vision pipeline in the browser** that **reads bar velocity from video, falls back to a BLE sensor, and autoregulates the session in real time**. It taught me **how to ship an on-device ML vision pipeline that stays usable offline on a phone at the gym.**

## The problem
Velocity-based training only works if you can actually measure bar speed rep to rep — the velocity tells you when to add load, when to stop, and where fatigue is setting in. In practice that data is locked behind expensive linear-position transducers, and the software around them is clunky. I wanted the measurement to be as cheap as the camera already in my pocket, work without a connection in a gym with bad Wi-Fi, and speak the language a lifter and coach actually use: velocity zones, e1RM, RPE, and load-velocity profiles.

## What it does
- **Camera VBT:** point a phone at the bar and get per-rep velocity from an in-browser vision pipeline (barbell detection, pose estimation, rep detection, velocity calculation).
- **BLE live mode:** connect a Bluetooth bar-speed sensor and mirror live velocity in real time via the Web Bluetooth API.
- **Set review:** edit reps, tag RPE, view a bar-path overlay, and read per-rep estimated 1RM.
- **Workout tracking:** multi-set logging with quick weight adjust and a live load-velocity profile as the session builds.
- **Post-set autoregulation:** each set is scored for zone adherence and fatigue, returning a concrete call — increase load, decrease load, maintain, or stop.
- **Analytics:** velocity trends over time, zone distribution, and fatigue alerts.
- **Coach mode:** a multi-athlete live BLE dashboard for watching a whole group's bar speed at once.
- **Session history & offline sync:** sessions cache locally and sync when a connection returns, with a visible sync indicator.

## How it's built
- **Stack:** Vite 8 + React 19 + TypeScript 6 PWA; Tailwind CSS 4; Zustand 5 state; React Router 7; Recharts 3; TensorFlow.js 4 + MediaPipe Tasks Vision for the camera pipeline; Web Bluetooth API; IndexedDB via Dexie 4 for offline cache; `vite-plugin-pwa` service worker. Node.js + Express 5 backend on Neon serverless PostgreSQL. A Python FastAPI microservice handles autoregulation. nRF52840 firmware reference for the hardware path. Deployed on Replit; GitHub Actions CI pins Node 22 + Nix `stable-25_05` for Replit parity.
- **Notable engineering:**
  - **On-device vision pipeline** — a modular `vision/` service (BarbellDetector → PoseEstimator → RepDetector → VelocityCalculator → VisionManager) that computes bar velocity from a live camera feed, lazy-loaded so the ~1.2 MB TF.js/MediaPipe chunk (~301 kB gzip) never blocks the app shell.
  - **Offline-first PWA** — IndexedDB caching plus a sync endpoint means sessions logged in a dead-Wi-Fi gym persist and reconcile later; the backend DB pool initializes lazily and returns 503 on data routes until a `DATABASE_URL` is set, so the app boots cleanly with or without a database.
  - **Three-service architecture on one Replit** — PWA (5173), Express backend (3001), and FastAPI autoregulation service (8000) all start together, with the autoregulation math deliberately isolated in Python.
  - **Domain-correct model** — velocity zones (in-range / fast / slow), e1RM, load-velocity profiling, and RPE are first-class, driven by a single source-of-truth set of zone color tokens and utilities (`velocityProcessor`, `zoneCalculator`, `oneRMCalculator`).
- **Architecture:** camera or BLE input → client vision/velocity processing → Zustand store + IndexedDB cache → Express API on Neon PG → FastAPI autoregulation service returns per-set load recommendations, confidence, and velocity-drop % → Recharts analytics + coach dashboard.

## Proof points
- 17 screen/utility components across 12 routes; two independent capture paths (camera CV and BLE hardware) feeding one data model.
- Full vision pipeline (barbell detection, pose estimation, rep detection, velocity calculation) running client-side in the browser.
- Autoregulation service returns actionable per-set calls — increase / decrease / maintain / stop — with confidence scores and velocity-drop percentage.
- Research-grounded: development priorities derived from 4 peer-reviewed VBT studies (accuracy benchmarks, rep-detection targets), documented in the repo.
- CI enforces Replit/Docker environment parity on every push.

## What to show
- **Demo:** Deploy the Replit build to a public URL. Best live demo is camera VBT on a phone — point it at a loaded bar and show live per-rep velocity, then the post-set autoregulation call.
- **Visuals needed:** the CameraLiveLiftScreen mid-rep with bar-path overlay; the load-velocity profile building across a set; the coach-mode multi-athlete BLE dashboard; the analytics velocity-trend view. No sensitive data to blur.

## Cross-links
- Part of the weightlifting toolchain with [Mind Games](mind-games.md) (the anchor case study — the competition/data side of the sport) and [WORKOUTFLOW](workoutflow.md) (the programming/team side). VBT Tracker is the in-the-gym measurement layer of that trio.
- Shares the **offline-first PWA + IndexedDB caching** pattern with the wedding/DJ paperwork PWA work.

## Case-study angle
Alex turned a $400 piece of gym hardware into a browser tab: a lifter who competes in Olympic weightlifting built the bar-speed sensor he wanted, ran the ML vision pipeline on-device, and wrapped it in coach-grade autoregulation.
