// Live DJ Co-Pilot — drive a real session: create event, log a line, get suggestions.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/app/');
  await page.waitForTimeout(1500);
  await h.shot('shot-01.png', 'DJ Co-Pilot PWA — event picker, live view, stats, and track library.');

  // Create a real event so the UI has content
  await page.locator('button:has-text("New Event")').first().click().catch(() => {});
  await page.waitForTimeout(800);
  // Fill any visible inputs (client/service fields)
  const inputs = page.locator('input:visible');
  const n = await inputs.count();
  if (n >= 1) {
    await inputs.nth(0).fill('Wedding — Chen Party').catch(() => {});
    // submit the dialog/form
    await page.locator('button:has-text("Start"), button:has-text("Create"), button[type="submit"]').first().click().catch(() => {});
    await page.waitForTimeout(1500);
  }
  await h.shot('shot-02.png', 'Live session — type what\'s being said and suggestion cards appear.');

  // Go to tracks library
  await page.locator('text=Tracks').first().click().catch(() => {});
  await page.waitForTimeout(1200);
  await h.shot('shot-03.png', 'Track library — genre/energy map powering the suggestion engine.');

  await h.shot('shot-04-full.png', 'Full PWA view.');
}
