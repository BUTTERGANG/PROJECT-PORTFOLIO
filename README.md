# PROJECT-PORTFOLIO

Source for my portfolio site — a static [Astro](https://astro.build) site that
organizes ~27 project case studies around one idea, the **Build Loop**: I start
by *doing* something (running an event, cutting a photo gallery, hitting a lift,
hunting a job), hit the same friction twice, and build the tool the second time.

Live site: **https://butterfield-portfolio.replit.app**

## Layout

```
docs/            # Case-study source of truth (one markdown file per project)
portfolio-site/  # The Astro site — reads docs/ at build time
```

`docs/` is the single source of truth. `portfolio-site/scripts/sync-content.mjs`
copies each doc into the Astro content collection at build time, so the two
directories are one unit — the site won't have its case studies without `docs/`
beside it.

## Build

```bash
cd portfolio-site
npm install
npm run build      # runs sync-content, then astro build → dist/
npm run dev        # local preview
```

Ships zero client JavaScript beyond a few tiny inline scripts (theme, scroll
reveals, a lightbox). System font stack, no framework runtime. Media is
committed as optimized WebP/WebM; `scripts/optimize-media.mjs` downscales and
re-encodes anything the capture harness produces.

## Notes

- Most of the underlying project repos are private; they're shown here via
  screenshots, recordings, and — where deployed — public demo links.
- This repo tracks the portfolio itself over time, not the individual projects.
