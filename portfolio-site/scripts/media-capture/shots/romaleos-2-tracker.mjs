// Romaleos 2 Tracker — listings dashboard with filters, watches, stats.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/');
  await page.waitForTimeout(2500);
  await h.shot('shot-01.png', 'Live listings — eBay Browse API results with US-size extraction, condition, and freshness badges.');

  await h.shot('shot-02-full.png', 'Full dashboard — filters for size, price, condition; sort by newest / price / ending-soonest.');

  // Watches page
  await h.goto(baseUrl + '/watches', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(1500);
  if (page.url().includes('watches')) {
    await h.shot('shot-03.png', 'Smart watches — per-size / price-range alerts with one-ping-per-listing Discord delivery.');
  }

  await h.record(baseUrl);
}
