# Alex Butterfield — Portfolio Site

A static Astro site organizing 26 project case studies around the **Build Loop**
narrative. Repos stay private; projects are shown via media (screenshots/GIFs/
recordings) and, where deployed, public demo URLs.

## How it works

- **Content source of truth:** `../docs/*.md` (the 26 case-study docs). They are NOT
  edited by the site. `scripts/sync-content.mjs` copies them into
  `src/content/projects/` on every `dev`/`build` and seeds a media manifest per project.
- **Schema:** `src/content/config.ts` mirrors the docs' frontmatter exactly.
- **Narrative structure:** `src/data/pillars.ts` (4 pillars) + `src/data/clusters.ts`
  (8 origin clusters). Nav order = narrative arc, not alphabetical.
- **Tiering:** `anchor` + `advanced` projects get a full page at `/projects/<slug>/`;
  `standard` projects render as compact expandable cards only.

## Commands

```bash
npm install
npm run dev        # sync docs + Astro dev server (localhost:4321)
npm run build      # → dist/  (static, ~620K, zero external JS)
npm run preview    # serve the built dist/
npm run sync       # re-copy docs → content (also runs automatically)
```

## Adding media (the main ongoing task)

Each project has a drop-zone: `public/media/<slug>/`.

1. Drop your file(s) there — `.png/.jpg/.webp` (image), `.gif` (gif), or
   `.mp4/.webm` (video; autoplays muted+looped, far smaller than a GIF).
2. Edit `public/media/<slug>/manifest.json` — set each item's `file`, `caption`,
   and `type` (`image` | `gif` | `video`). Anything left as `type: "placeholder"`
   renders a labeled TODO box whose caption is the shot list.
3. The per-project `README.md` in each media folder lists exactly what to capture
   (auto-derived from the doc's "What to show" section).

Video tip for screen recordings: export short `.mp4` (H.264, muted) or `.webm` —
they loop like a GIF at a fraction of the size.

## Deploying on Replit

Static Deployment:

- **Build command:** `npm install && npm run build`
- **Public directory:** `dist`

`.replit` already encodes this. After the first deploy, set the real URL in
`astro.config.mjs` (`site:`) so sitemap/OG tags use absolute URLs.

## Filling in demo URLs

When you deploy an individual app (Mind Games, Job Hunter, etc.) to its own public
URL, set `demo_url:` in that project's `docs/<slug>.md` frontmatter. The site picks
it up on the next build and shows an "Open live demo ↗" button.

## Open TODOs (non-blocking, marked `[TODO]` on-site)

- Resume PDF → `public/assets/resume.pdf` (linked from Next Chapter + Contact).
- Email / phone / LinkedIn on Contact.
- Final wedding metrics on Live Execution; LA Media package pricing on Business.
- Real media assets per project (placeholders + shot lists ship now).
- `public/media/og-default.png` social-share image (referenced by BaseLayout).
