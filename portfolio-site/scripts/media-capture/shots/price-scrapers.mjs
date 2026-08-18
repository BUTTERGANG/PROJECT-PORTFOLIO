// Shot list for Price Scrapers — grocery price aggregation across retailers.
// Captured against a local dev instance seeded with real historical scrape
// data. The React frontend uses pure client-side tab state (no URL routing),
// so navigation here clicks the actual tab buttons instead of loading URLs.
//
// Run:
//   node capture-media.mjs --url http://localhost:5001 --slug price-scrapers

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  await h.goto(`${base}/`);
  await page.waitForTimeout(1200);
  await h.shot('shot-01.png', 'Dashboard — price trends and stats aggregated across tracked retailers.');

  // Deals — best current price drops. Widen the data-age window since the
  // seeded scrape data is older than the 7-day default filter.
  await page.getByRole('tab', { name: /Deals/i }).click();
  await page.waitForTimeout(1000);
  await page.locator('select').nth(1).selectOption('365');
  await page.waitForTimeout(800);
  await h.shot('shot-02.png', 'Deals — biggest price drops surfaced across every tracked store.');

  // Search — type a query and let the debounced search fire.
  await page.getByRole('tab', { name: /Search/i }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder(/Search groceries/i).fill('milk');
  await page.waitForTimeout(1200);
  await h.shot('shot-03.png', 'Search — live product search across all scraped retailer catalogs.');

  // Stores — coverage across retailers.
  await page.getByRole('tab', { name: /Stores/i }).click();
  await page.waitForTimeout(1000);
  await h.shot('shot-04.png', 'Stores — retailer coverage and catalog size per source.');

  // Record the clean walk-through last: dashboard → deals → stores.
  await page.getByRole('tab', { name: /Dashboard/i }).click();
  await page.waitForTimeout(500);
  await h.record(`${base}/`, async (vpage) => {
    await vpage.getByRole('tab', { name: /Deals/i }).click();
    await vpage.waitForTimeout(600);
    await vpage.locator('select').nth(1).selectOption('365');
    await vpage.waitForTimeout(1500);
    await vpage.getByRole('tab', { name: /Stores/i }).click();
    await vpage.waitForTimeout(1800);
    await vpage.getByRole('tab', { name: /Dashboard/i }).click();
    await vpage.waitForTimeout(1200);
  });
}
