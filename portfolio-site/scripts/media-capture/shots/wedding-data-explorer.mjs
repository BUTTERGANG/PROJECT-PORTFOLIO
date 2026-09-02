// Wedding Data Explorer — v2: the app uses real routes (/overview, /vendors, /ask).
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/');
  await page.waitForTimeout(800);
  await h.shot('shot-01.png', 'Passphrase gate — one shared code, 30-day cookie session, fully read-only.');

  await page.fill('input[name="code"]', 'weddings2026');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
    page.press('input[name="code"]', 'Enter'),
  ]);
  await page.waitForTimeout(1500);

  // Overview (the real dashboard route)
  await h.goto(baseUrl + '/overview');
  await page.waitForTimeout(2500);
  await h.shot('shot-02.png', 'Overview — KPI cards, sentiment split, top complaints, pricing by category, top metros.');
  await h.shot('shot-03-full.png', 'Full overview — snapshot of 1,734 vendors and 28,819 customer reviews.');

  // Vendors
  await h.goto(baseUrl + '/vendors');
  await page.waitForTimeout(2000);
  await h.shot('shot-04.png', 'Vendors — 1,734 listings filterable by name, category, and state with pricing and ratings.');

  // Ask the Data
  await h.goto(baseUrl + '/ask');
  await page.waitForTimeout(1500);
  const box = page.locator('input[type="text"], textarea').first();
  if (await box.count()) {
    await box.fill('What is the median DJ price in Indiana?').catch(() => {});
    await page.keyboard.press('Enter').catch(() => {});
    await page.waitForTimeout(6000); // text-to-SQL roundtrip
  }
  await h.shot('shot-05.png', 'Ask the Data — plain-English question through text-to-SQL to answer + source table.');
}
