# Media Capture Harness — "Browser-in-the-Loop", VPS edition

Auto-generates the PNG screenshots and MP4/WebM walk-throughs the portfolio site
displays for each project. It's the DIY version of Google Antigravity's
integrated browser-capture pipeline, built on Playwright so it runs headless on
a Linux VPS (Hermes) or locally.

## The key design decision: capture is decoupled from boot

Antigravity captures the app *its agent just built and already has running*. It
never clones a repo cold. We can't do that — a private repo like MASS Gym
Platform needs a database, auth secrets, and seed data before it reaches a single
real screen. Backend-only projects (polybot, hermes) have no UI to capture at
all.

So this harness is **URL-driven, not repo-driven**. The hard part — booting an
app to a working localhost — is yours (or Hermes'). You run the app's local
server however it needs running; this harness just points a headless browser at
the URL, drives it, and drops the artifacts. That split is deliberate: it's the
only honest way to do this across repos with wildly different boot requirements.

## Isolation

This folder has its **own** `package.json` and `node_modules`. Playwright is a
big dependency and the portfolio site is intentionally zero-dependency so the
Replit build stays lean. Keeping the harness's deps nested here (and gitignored)
means Playwright never enters the site's build tree.

## One-time setup

```bash
cd portfolio-site/scripts/media-capture
npm install                 # installs the playwright node module
npx playwright install chromium   # downloads the matching browser (~90MB, cached)
```

On a headless Linux VPS you'll also need the system libs Chromium wants:
`npx playwright install-deps chromium` (or the distro equivalent).

## Usage

```bash
# 1. Boot the target app's local server yourself, e.g.:
#      (portfolio site)   npm run preview        -> http://localhost:4321
#      (a Next.js repo)   npm run dev            -> http://localhost:3000
#      (with seed data / demo secrets in its own .env)

# 2. Capture — hand the harness the running URL + the project slug:
node capture-media.mjs --url http://localhost:4321 --slug portfolio-site
node capture-media.mjs --url http://localhost:3000 --slug moran-website --no-video
```

Flags: `--no-video` (screenshots only), `--width` / `--height` (viewport,
default 1440×900), `--out <dir>` (override media root). `--help` for all.

## What it produces

Into `portfolio-site/public/media/<slug>/`:

- `shot-01.png`, `shot-02-full.png`, … — retina (2×) screenshots. A filename
  containing `full` triggers a full-page capture.
- `demo.webm` (or `demo.mp4`) — one clean recorded walk-through (own context,
  viewport-matched, leading settle trimmed), when video is on.
- `manifest.json` — **rewritten** so the captions become real `image`/`video`
  tiles. This is what flips the site's on-page placeholders to actual media —
  `MediaItem.astro` already renders `.webm`/`.mp4` as `<video autoplay muted
  loop>` and `.png` into the lightbox, so no site code changes are needed.

## Per-project shot lists

`shots/<slug>.mjs` describes what to capture for one project. No file → the
generic `shots/_default.mjs` (above-the-fold + full-page + scroll-through) runs.

A shot list is `async (page, h) => { ... }` with helpers:

| helper | does |
|---|---|
| `h.goto(url?, opts?)` | navigate + wait for `networkidle`, **health-checked** — retries transient 5xx with backoff, throws on a persistent error page (defaults to `--url`) |
| `h.shot(file, caption)` | screenshot → `public/media/<slug>/<file>` (`full` in name = full-page). Refuses to capture a near-empty error screen. |
| `h.record(url?, fn?)` | record **one** clean video in its **own** context: settles the desktop layout, then runs `fn(vpage)` or a default scroll. **Call once, last.** No-op under `--no-video`. |
| `h.page` | the raw Playwright `Page`, for clicks/hovers/form fills |
| `h.baseUrl` | the `--url` value, for multi-page captures |

`shots/mind-games.mjs` is the worked example: five screenshots across public
tool routes (landing, populated data browser, competition mode, warmup) then one
`h.record()` walk-through of the landing page.

**Why video is its own helper, not a scroll at the end:** the recording context
is separate from the screenshot context on purpose. If one context did both, the
video would capture all the screenshot navigations (blank flashes between every
`goto`) — a 40-second clip of churn. `h.record()` opens a fresh context, does
one clean pass, and closes. Custom interactions:

```js
await h.record(`${base}/`, async (vpage) => {
  await vpage.click('button:has-text("Start")');
  await vpage.waitForTimeout(2000);
});
```

## Gotchas & lessons learned (read before capturing new projects)

These are real failures we hit capturing the Mind Games demo — the harness now
handles each, but know them when writing new shot lists:

- **Error pages capture silently.** `networkidle` resolves even on a 5xx. We
  once shipped a "Service Unavailable" screenshot. The harness now health-checks
  every `goto` (retries transient 5xx up to 4× with backoff, throws on a
  persistent error) and refuses to screenshot a near-empty error page. If a run
  throws on a flaky route, just re-run — serverless demos cold-start into 503s.
- **The video letterboxes if its size ≠ viewport.** Recording at 1280×720 while
  the viewport is 1440×900 produces grey bars. The recording size is now pinned
  to the viewport (1440×900).
- **SPAs record a mobile-first flash.** Client-rendered apps reflow from a
  mobile layout to desktop on load. The video settles ~2.4s at the top first,
  and that settle is **trimmed off** post-hoc with ffmpeg so the clip opens on
  loaded content (it autoplays + loops on the site, so the first frame matters).
- **Live stat numbers may exceed your doc's claims.** The Data Browser showed
  68,637 lifters / 7,358 competitions — bigger than the doc's "~7,000 records"
  (which was the CSV *file* count). Check the live demo's real numbers and update
  the doc; don't undersell.
- **Empty states are weak shots.** The Data Browser's default screen is an empty
  search box. The shot list types a query first so the screenshot shows
  populated results. Interact to reach the *interesting* state before `h.shot`.
- **ffmpeg comes with Playwright.** No separate install — the harness finds it in
  the browser cache (`~/Library/Caches/ms-playwright/ffmpeg-*/`). On a fresh VPS
  it appears after `npx playwright install chromium`.

## Capturing a private repo (the real workflow)

1. Clone/pull the private repo somewhere local.
2. Give it a **demo** `.env` — a throwaway database and fake seed data, **no
   real client PII**. (MASS Gym Platform: seed a demo athlete + admin; LA Media:
   demo Stripe test keys + a scratch Neon branch.)
3. Boot its dev server, seed it, log in as the demo user.
4. Write `shots/<that-slug>.mjs` to click through the screens worth showing
   (blur/avoid any PII — capture demo data only).
5. `node capture-media.mjs --url http://localhost:PORT --slug <that-slug>`.

The repo stays private; only the rendered demo media becomes public. That's the
whole strategy: show the capability, never ship the code.
