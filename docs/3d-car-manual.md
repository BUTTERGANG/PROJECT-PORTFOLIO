---
project: 3D Car Manual
repo: BUTTERGANG/3D-CAR-MANUAL
visibility: public
demo_url: ""
demo_type: live
cluster: life-admin
tier: standard
status: prototype
---

# 3D Car Manual
**One-liner:** An interactive 3D maintenance manual for my own 2011 Chevrolet Traverse — click any part of the model to get service procedures, troubleshooting, and AI-assisted diagnosis.

## Origin (the Build Loop)
> Because I **maintain my own 2011 Traverse**, I kept hitting **the friction of paper manuals and scattered forum threads when I need a specific procedure**, so I built **a clickable 3D model of the vehicle that surfaces maintenance info and AI diagnostics per part**, that **turns "how do I service this?" into clicking the part**, It taught me **3D web rendering (Three.js / React Three Fiber) and RAG-based diagnostics — a stack I hadn't used before.**

## The problem
Car maintenance info is fragmented — a PDF manual, YouTube, forum posts — and none of it is organized around "the part I'm looking at right now." For my specific vehicle (2011 Traverse LTZ FWD V6-3.6L) I wanted a spatial interface: point at the component, get the procedure and a diagnostic assist.

## What it does
- Interactive 3D model of the vehicle; click a part for maintenance info, service procedures, and troubleshooting.
- AI-assisted diagnosis for symptoms.
- Scoped to one specific real vehicle rather than generic.

## How it's built
- **Stack (partly planned/prototype — being honest):** React + TypeScript with Three.js / React Three Fiber for the 3D UI; Node/Express backend; PostgreSQL; a Python FastAPI microservice for RAG-based diagnostics.
- **Notable engineering:** first venture into 3D web rendering and a RAG diagnostics service; spatial part-selection UI.
- **Architecture:** React Three Fiber model → part selection → Express/PG for procedure data + FastAPI RAG service for diagnosis.

## Proof points
- Demonstrates range into 3D/graphics and RAG, outside Alex's usual app stack.
- Grounded in a real object he owns and maintains.

## What to show
- **Demo:** Deploy the front end to a public URL (repo is public) so visitors can spin the model and click parts. Flag clearly which features are live vs. planned.
- **Visuals needed:** the interactive 3D model; a part-detail panel; a diagnosis example.

## Cross-links
- Life-admin cluster with [personal-finance-dashboard](personal-finance-dashboard.md) and [ECHO](echo.md) — all "built for my own life."

## Case-study angle
A range-stretcher: it shows Alex will reach for an unfamiliar stack (3D rendering, RAG) when the problem calls for it — here, turning his own truck into a clickable manual. Frame honestly as a prototype exploring new tech, not a finished product.
