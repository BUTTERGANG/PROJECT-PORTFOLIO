// AI Pricing Research — rendered report page (dark themed, tables + trends).
export default async function (page, h) {
  await h.goto(h.baseUrl + '/ai-pricing-report.html');
  await page.waitForTimeout(1500);

  await h.shot('shot-01.png', 'Consolidated price history — 216 LLM price points across 11 providers, 2020–2026.');

  // Jump to the free-model dashboard section
  const anchor = page.locator('h2:has-text("free model availability")').first();
  if (await anchor.count()) {
    await anchor.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(600);
    await h.shot('shot-02.png', 'OpenRouter free-model availability dashboard — current reachability per model.');
  }

  await h.shot('shot-03-full.png', 'Full report — per-provider histories, market data, and sources.');
}
