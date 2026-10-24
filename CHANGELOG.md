# Changelog

All notable changes to PROJECT-PORTFOLIO. Newest first.

## 2026-10-23 — Security: dependency vulnerability fixes

Known advisories (OSV) in lockfiles: **1 critical, 18 high, 17 moderate, 6 low → none**.

- `portfolio-site`: **Astro 7.2.4 → ^7.4.2** — fixes critical RCE via AVIF image optimization plus several highs; `npm audit fix` for the rest (audit now clean)
- Case study `bible-study-app.md` (docs + synced content copy): JWT auth is now PyJWT, not python-jose
- Critical/high advisories cleared in: `astro`, `devalue`, `http-cache-semantics`, `js-yaml`, `sharp`, `source-map-js`, `svgo`, `undici`, `vite`, `zod`
- Verified: `npm run build` passes (40 pages)
