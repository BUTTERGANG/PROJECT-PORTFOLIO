---
project: LightLog
repo: BUTTERGANG/LIGHTLOG
visibility: private
demo_url: ""
demo_type: live
cluster: photo
tier: advanced
status: live
---

# LightLog
**One-liner:** A photography lighting tracker that tells you exactly when and how to shoot — astronomical sun/moon math plus live weather feeding AI camera-setting recommendations.

## Origin (the Build Loop)
> Because I was **shooting photography where the whole outcome depends on the light — golden hour, blue hour, cloud cover, where the sun actually is**, I kept hitting **the fact that I was mentally juggling sunset times, twilight windows, moon phase, and weather to guess my settings**, so I built **LightLog** that **computes the celestial timing precisely, pulls live weather, and recommends ISO/aperture/shutter for the conditions**. It taught me **that a good tool doesn't just show data — it turns sun elevation + cloud cover into the one thing I actually need on location: what to dial in right now.**

## The problem
The quality of a photo is set before you ever press the shutter, by the light. Knowing when to be somewhere — golden hour, the blue-hour window, when the sun drops below the horizon — and what the sky is doing means cross-referencing a sunset calculator, a weather app, and experience, every time. On location that's mental overhead when you should be shooting. I wanted one screen that knew where the sun and moon were, what the weather was doing, and translated that into camera settings.

## What it does
- **Real-time sun & moon tracking** — precise sun elevation/azimuth via SunCalc, current moon phase and illumination, all location- and timezone-aware.
- **Photography timeline** — golden hour, blue hour, and civil/nautical/astronomical twilight windows for the day, so you know exactly when to shoot.
- **AI Photography Wizard** — condition-aware ISO/aperture/shutter recommendations that adapt to current lighting, weather, and celestial data, with contextual pro tips per scenario.
- **Weather integration** — live temperature, humidity, cloud cover, and visibility via OpenWeather, with automated light-quality analysis (falls back to simulated data with no API key).
- **Global location search** — pick any location worldwide via OpenStreetMap Nominatim geocoding, with quick switching between favorites.
- **Dynamic "Miami Vice" theming** — the theme shifts with the sun's position at the selected location; mobile-first, touch-optimized, dark-mode.

## How it's built
- **Stack:** React 18 + TypeScript + Vite on the front end; Wouter routing, TailwindCSS, Radix UI primitives, TanStack Query, React Hook Form + Zod, Framer Motion. Node 20 + Express + TypeScript on the back end. SunCalc for astronomy, `date-fns`/`date-fns-tz` for timezone-correct times. In-memory storage now, with a Drizzle ORM/PostgreSQL schema already defined for a future migration.
- **Notable engineering:**
  - **Astronomy done correctly** — sun elevation/azimuth, moon phase/illumination, and the full twilight-band timeline are computed from SunCalc against the chosen location and timezone, so the "when to shoot" windows are real, not approximate.
  - **Conditions → settings translation** — the AI wizard fuses celestial position with live weather into concrete camera recommendations, which is the actual value: not "here's the data," but "shoot at this ISO/aperture/shutter."
  - **Graceful degradation** — works without an OpenWeather key by falling back to simulated weather, so the app is never dead on arrival.
- **Architecture:** React client (components/hooks/lib) → Express server → external APIs (OpenWeather for weather, OSM Nominatim for geocoding), with SunCalc doing astronomy client-side; shared TypeScript schema between client and server, Drizzle schema staged for a later PostgreSQL move.

## Proof points
- Real astronomical calculation (SunCalc) for sun/moon position + full twilight-band timeline, timezone-aware for any location on earth.
- Live weather integration (OpenWeather) with an automated light-quality assessment.
- Global location coverage via OSM Nominatim geocoding.
- MIT-licensed, documented (`README`, `SETUP.md`, `IMPLEMENTATION.md`, `CONTRIBUTING.md`), React 18 / Node 20 / TypeScript 5.

## What to show
- **Demo:** Deploy to a public URL (repo stays private). Open on a location, show today's timeline and the AI wizard recommendation for the current conditions.
- **Visuals needed:** the main dashboard with sun/moon + weather; the photography timeline (golden/blue hour, twilight bands); the AI Photography Wizard recommendation card; the dynamic theme at a couple of sun positions. TODO: capture a mobile screenshot to show the mobile-first bottom-nav layout.

## Cross-links
- Part of the Photography & LA Media cluster with [LA Media Dashboard](la-media-dashboard.md), [LA Media website](la-media-website.md), and [photo-file-copier](photo-file-copier.md).
- Shares the **React + Radix + TanStack + Wouter + Zod + Vite** app skeleton with [LA Media Dashboard](la-media-dashboard.md) and [Mind Games](mind-games.md) — the same stack reused across builds.

## Case-study angle
Alex turned a domain problem he lives — light dictates the shot — into a tool that does real astronomical math and fuses it with live weather to output the one thing a photographer needs on location: what to dial in right now.
