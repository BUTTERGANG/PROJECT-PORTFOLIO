// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build → dist/, served by Replit Static Deployments.
// Update `site` to the final Replit deployment URL for correct sitemap/OG absolute URLs.
export default defineConfig({
  site: 'https://butterfield-portfolio.replit.app',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
  // Replit's preview proxies through a per-workspace *.worf.replit.dev host that
  // changes per Repl/fork — the dev server's host check rejects it by default.
  server: { allowedHosts: true },
});
