# Running the portfolio

This repository's Astro site lives in `portfolio-site/`; the top-level `docs/`
directory supplies its case-study content during each build.

- **Development preview:** `cd portfolio-site && npm run dev -- --host 0.0.0.0 --port 5000`
- **Production build:** `cd portfolio-site && npm run build`
- **Static deployment output:** `portfolio-site/dist`

The `Start application` workflow uses the development command above and serves
the preview on port 5000.