// PetCare Companion — login with temp capture password; pet dashboard, breeds, vet report.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/login');
  await h.shot('shot-01.png', 'Sign-in — one password, no tutorial required.');

  await page.fill('input[name="password"]', 'capture2026');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
    page.press('input[name="password"]', 'Enter'),
  ]);
  await page.waitForTimeout(1500);

  if (!page.url().includes('login')) {
    await h.shot('shot-02.png', 'Pet dashboard — medical records, vaccinations, and weight trend per pet.');
    await h.shot('shot-03-full.png', 'Full pet dashboard.');

    // Try breeds page
    await h.goto(baseUrl + '/breeds', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);
    if (!page.url().includes('login')) {
      await h.shot('shot-04.png', 'Breed reference — 123 AKC breed profiles with traits, sizes, and standards.');
    }
    // Try a pet detail page for the weight chart
    const links = await page.locator('a[href]').evaluateAll(as => as.map(a => a.getAttribute('href'))).catch(() => []);
    const dogLink = links.find(l => /\/dogs\/\d+/.test(l));
    if (dogLink) {
      await h.goto(baseUrl + dogLink, { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await h.shot('shot-05.png', 'Pet detail — weight trend chart and printable vet report.');
    }
  } else {
    console.log('  ! login failed — keeping existing shots');
  }
}
