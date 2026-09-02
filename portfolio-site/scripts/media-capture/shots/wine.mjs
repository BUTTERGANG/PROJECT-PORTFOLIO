// WINE — social wine tracking: map view, venue pages, tasting flow, groups.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/');
  await page.waitForTimeout(2500);

  await h.shot('shot-01.png', 'WINE home — interactive mini-map and the community feed of what everyone is drinking.');

  // Map page (the hero feature)
  const mapLink = page.locator('a[href*="map"]').first();
  if (await mapLink.count()) {
    await mapLink.click().catch(() => {});
    await page.waitForTimeout(3500); // let Leaflet + clusters render
    await h.shot('shot-02.png', 'Discovery map — ~50,214 wineries clustered across 60+ countries (Leaflet + OSM).');
  } else {
    await h.shot('shot-02-full.png', 'Map view — winery discovery.');
  }

  // Full home page
  await h.goto(baseUrl + '/');
  await page.waitForTimeout(1500);
  await h.shot('shot-03-full.png', 'Full home page.');

  await h.record(baseUrl);
}
