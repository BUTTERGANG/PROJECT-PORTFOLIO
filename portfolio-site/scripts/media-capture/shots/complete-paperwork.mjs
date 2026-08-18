// Shot list for DJ Ops (Complete Paperwork) — mobile-first PWA that
// photographs a physical event contract or run-of-show sheet and extracts
// the details into a searchable database with Claude Vision.
//
// Captured against a local dev instance backed by a real Postgres database
// seeded with sample (non-real) DJ events — a mix of weddings and a
// corporate gig, both completed and upcoming, each with full pay/timeline
// data as if extracted from real paperwork. Auth is Replit-identity-based
// in production; the app has a dev-mode fallback (auto-logs in as
// "Dev User" when the identity headers are absent), so no login flow is
// needed here.
//
// Run:
//   node capture-media.mjs --url http://localhost:5175 --slug complete-paperwork

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  await h.goto(`${base}/`);
  await page.waitForTimeout(1200);
  await h.shot('shot-01.png', 'Dashboard — completed/upcoming counts, YTD and per-event pay, and next gigs at a glance.');

  // Events — full list with search + status filters.
  await page.getByRole('link', { name: /^Events$/i }).first().click();
  await page.waitForTimeout(1000);
  await h.shot('shot-02.png', 'Events — every gig, searchable by client or venue, filterable by status.');

  // Event detail — a completed wedding with rich extracted data (pay, timeline, party).
  await page.getByText('Megan Foster').first().click();
  await page.waitForTimeout(1000);
  await h.shot('shot-03.png', 'Event detail — venue, timeline, wedding party, and pay breakdown, all pulled from the scanned paperwork.');

  // Scan — the capture entry point (camera/upload UI for a new document).
  await page.goto(`${base}/scan`);
  await page.waitForTimeout(1000);
  await h.shot('shot-04.png', 'Scan Paperwork — photograph a contract or run-of-show sheet to extract with Claude Vision.');

  // Record the clean walk-through last: dashboard → events → event detail → scan.
  await h.record(`${base}/`, async (vpage) => {
    await vpage.waitForTimeout(1000);
    await vpage.getByRole('link', { name: /^Events$/i }).first().click();
    await vpage.waitForTimeout(1200);
    await vpage.getByText('Megan Foster').first().click();
    await vpage.waitForTimeout(1500);
    await vpage.goto(`${base}/scan`);
    await vpage.waitForTimeout(1800);
  });
}
