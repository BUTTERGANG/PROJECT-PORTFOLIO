// Infra Metals Dashboard — static HTML with 93 series, COT, LME, power.
export default async function (page, h) {
  await h.goto(h.baseUrl + '/dashboard.html');
  await page.waitForTimeout(2500); // let Chart.js render

  await h.shot('shot-01.png', 'Commodities & macro dashboard — metals, equities, and cycle indicators from free sources.');

  // Interactivity probe: any filter tabs?
  const tabs = await page.locator('button, .tab, [role="tab"]').allTextContents().catch(() => []);
  if (tabs.length > 1) {
    await page.locator('button, .tab, [role="tab"]').nth(1).click().catch(() => {});
    await page.waitForTimeout(1200);
    await h.shot('shot-02.png', 'Series view — Chart.js renders each data series from scraped JSON.');
  }

  await h.shot('shot-03-full.png', 'Full dashboard, top to bottom.');

  await h.record(h.baseUrl + '/dashboard.html');
}
