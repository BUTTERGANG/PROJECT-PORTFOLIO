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
});
