// Shot list for K9 Overwatch — lost/found pet aggregation platform.
// Captured against a local dev instance seeded with a real IndyLostPetAlert
// scrape (repo is public; scraped listings carry no PII beyond what the
// source site already publishes). Admin routes are intentionally excluded.
//
// Run:
//   node capture-media.mjs --url http://localhost:8080 --slug k9-overwatch

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // Map view — the core surface, pins for lost/found reports in the area.
  await h.goto(`${base}/map`);
  await page.waitForTimeout(1800);
  await h.shot('shot-01.png', 'Map view — lost and found pet reports plotted from multiple scraped sources.');

  // Pets — filterable list of scraped listings.
  await h.goto(`${base}/pets`);
  await page.waitForTimeout(1200);
  await h.shot('shot-02.png', 'Pet listings — normalized records aggregated from shelters and lost-pet boards.');

  // Matches — the lost/found matching engine's output.
  await h.goto(`${base}/matches`);
  await page.waitForTimeout(1200);
  await h.shot('shot-03.png', 'Match candidates — the matcher pairing lost reports against found reports and flagging cross-source duplicates.');

  // Record the clean walk-through last, starting on the map.
  await h.record(`${base}/map`);
}
