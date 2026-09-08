// USAW Club Pricing — static dashboard with 11 charts.
export default async function (page, h) {
  await h.goto(h.baseUrl + '/index.html');
  await page.waitForTimeout(3500); // charts render

  await h.shot('shot-01.png', 'USAW club pricing dashboard — 770 clubs, 331 with published rates, 11 interactive charts.');

  await h.shot('shot-02-full.png', 'Full dashboard — distributions, state coverage, and the "why 43%" explainer.');
}
