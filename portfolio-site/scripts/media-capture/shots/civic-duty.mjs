// Shot list for Civic Duty — civic data aggregator for Fishers, IN: council
// votes, bids, zoning/development activity, campaign finance, and court
// records scraped nightly from CivicClerk, Fishers ArcGIS, IDOA, Indiana
// FCPA, and MyCase, unified behind one login-gated dashboard.
//
// Captured against a local dev instance backed by a real Postgres database
// seeded from actual scraper runs (823 council votes, 105 bids, 233 zoning
// records — a mix of public-notice rezonings and ArcGIS development
// projects). Auth is required for every view, so the script logs in first
// via the real register/login flow before navigating.
//
// Run:
//   node capture-media.mjs --url http://localhost:5173 --slug civic-duty

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // The app's mobile nav drawer has an unconditional "open" class in its
  // className (a pre-existing bug — it's meant to be gated on mobileOpen
  // state but isn't), so it renders permanently overlapping the dashboard
  // at any viewport width. Hide it for capture rather than patch app source.
  const hideMobileNav = (p) =>
    p.addStyleTag({ content: '.mobile-nav-menu { display: none !important; }' });

  async function login(p) {
    await p.goto(`${base}/`);
    await p.waitForTimeout(800);
    await p.getByPlaceholder(/you@example\.com/i).fill('demo@civicduty.app');
    await p.getByPlaceholder(/••••••••/).fill('DemoPass123!');
    await p.locator('form').getByRole('button', { name: /Sign In/i }).click();
    await p.waitForTimeout(1500);
    await hideMobileNav(p);
  }

  await login(page);
  await h.shot('shot-01.png', 'Dashboard — unified counts and latest activity across every scraped civic data source.');

  // Council — meeting votes with tallies, tags, summaries, and linked documents.
  // Default sort is by date desc, so empty future "upcoming" placeholders
  // (0-0-0 votes, no summary) surface before decided meetings. Search
  // narrows to City Council Meeting rows, then scroll past the handful of
  // upcoming ones to reach past meetings with real tallies and summaries.
  await page.getByRole('link', { name: /^Council$/ }).first().click();
  await page.waitForTimeout(1000);
  await page.getByPlaceholder(/Search titles/i).fill('City Council Meeting');
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, 750);
  await page.waitForTimeout(400);
  await h.shot('shot-02.png', 'Council — meeting votes with tallies, tags, and summaries, pulled from CivicClerk and extracted PDFs.');

  // Zoning — development projects and rezoning notices from Fishers ArcGIS.
  await page.getByRole('link', { name: /^Zoning$/ }).first().click();
  await page.waitForTimeout(1200);
  await h.shot('shot-03.png', 'Zoning — rezoning notices and active development projects from Fishers ArcGIS.');

  // Record the clean walk-through last: dashboard → council → zoning.
  await h.record(`${base}/`, async (vpage) => {
    await login(vpage);
    await vpage.waitForTimeout(1000);
    await vpage.getByRole('link', { name: /^Council$/ }).first().click();
    await vpage.waitForTimeout(1000);
    await vpage.getByPlaceholder(/Search titles/i).fill('City Council Meeting');
    await vpage.waitForTimeout(900);
    await vpage.mouse.wheel(0, 750);
    await vpage.waitForTimeout(900);
    await vpage.getByRole('link', { name: /^Zoning$/ }).first().click();
    await vpage.waitForTimeout(1800);
  });
}
