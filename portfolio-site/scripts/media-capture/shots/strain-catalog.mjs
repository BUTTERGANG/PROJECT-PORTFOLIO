// Strain Catalog (WEED) — hero, strain detail w/ terpene bars + lineage, hubs, map.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/');
  await page.waitForTimeout(2000);
  await h.shot('shot-01.png', 'Home — hero, stats, and featured strains from the 4,800-strain dataset.');

  // Strains listing
  await h.goto(baseUrl + '/strains', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await h.shot('shot-02.png', 'Strain listing — image-first cards with breeder badges, THC, and effect pills.');

  // A strain detail page: grab first strain link
  const detailLink = page.locator('a[href*="/strains/"]').first();
  if (await detailLink.count()) {
    const href = await detailLink.getAttribute('href');
    await h.goto(baseUrl + href, { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(1800);
    await h.shot('shot-03.png', 'Strain detail — THC meter, color-coded terpene bars, effects, and genetic lineage tree.');
    await h.shot('shot-04-full.png', 'Full strain detail — similar-strains engine and photo gallery below.');
  }

  // Dispensary map
  await h.goto(baseUrl + '/map', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(3000);
  if (!page.url().endsWith('404')) {
    await h.shot('shot-05.png', 'Dispensary map — locations and menus on Leaflet.');
  }
}
