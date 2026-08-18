// Shot list for Job Hunter — the living proof behind the "Where It's Heading"
// pillar. Captured against a local dev instance seeded with a real scrape
// (repo is public; no PII in job-board listings).
//
// Run:
//   node capture-media.mjs --url http://localhost:3002 --slug job-hunter

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // Ranked job list — the core dashboard, jobs scored across six dimensions.
  await h.goto(`${base}/`);
  await page.waitForTimeout(1200);
  await h.shot('shot-01.png', 'Ranked job list — every scraped listing scored across six weighted dimensions.');
  await h.shot('shot-02-full.png', 'Full ranked list — pay, flexibility, location, requirements, hours, workload.');

  // Market Analysis dashboard — sector/salary charts.
  await h.goto(`${base}/analysis`);
  await page.waitForTimeout(1500);
  await h.shot('shot-03.png', 'Market Analysis — sector breakdown, salary distribution, remote vs. onsite, posting timeline.');

  // Record the clean walk-through last, in its own context.
  await h.record(`${base}/`);
}
