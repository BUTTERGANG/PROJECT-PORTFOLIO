// Generates public/media/og-default.png (1200×630) — the social share card.
// On-brand: dark #0d1117 base, amber #f5a623 accent, matching favicon "B" mark.
// Run: node scripts/make-og.mjs   (sharp is already an allowed dependency)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const out = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..', 'public', 'media', 'og-default.png'
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d1117"/>
      <stop offset="1" stop-color="#161b22"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="8" fill="#f5a623"/>

  <!-- favicon "B" mark -->
  <g transform="translate(80,72)">
    <rect width="76" height="76" rx="17" fill="#0d1117" stroke="#232b36" stroke-width="1.5"/>
    <g transform="translate(14.5,14.5) scale(1.47)">
      <path d="M9 23V9h6.2c2.9 0 4.6 1.4 4.6 3.7 0 1.6-.9 2.7-2.3 3.1 1.7.3 2.8 1.5 2.8 3.3 0 2.4-1.8 3.9-4.8 3.9H9zm3-8.3h2.6c1.2 0 1.9-.6 1.9-1.6s-.7-1.5-1.9-1.5H12v3.1zm0 5.6h2.8c1.3 0 2-.6 2-1.7s-.7-1.6-2-1.6H12v3.3z" fill="#f5a623"/>
    </g>
  </g>
  <text x="176" y="122" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#e6edf3" letter-spacing="0.5">Alex Butterfield</text>

  <!-- headline -->
  <text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#e6edf3" letter-spacing="-1.5">The operator who</text>
  <text x="80" y="376" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#e6edf3" letter-spacing="-1.5">builds his own <tspan fill="#f5a623">tools</tspan>.</text>

  <!-- subline -->
  <text x="80" y="452" font-family="Helvetica, Arial, sans-serif" font-size="27" font-weight="400" fill="#9aa7b4">I run live events for a living — and build the systems behind them.</text>

  <!-- footer eyebrow -->
  <text x="80" y="560" font-family="monospace" font-size="21" font-weight="700" fill="#f5a623" letter-spacing="3">THE BUILD LOOP</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
