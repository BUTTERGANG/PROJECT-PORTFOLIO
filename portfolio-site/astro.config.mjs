// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build → dist/, served from the Replit Static Deployment that backs
// the custom domain. `site` MUST be the canonical public origin, not the
// internal *.replit.app host: canonical tags, og:url and the sitemap are all
// generated from it, and a dead host there means every shared link and every
// sitemap entry points at a 404.
export default defineConfig({
  site: 'https://alexbutterfield.com',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
  // Replit's preview proxies through a per-workspace *.worf.replit.dev host that
  // changes per Repl/fork — the dev server's host check rejects it by default.
  server: { allowedHosts: true },
});
