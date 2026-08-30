// Weightlifting Equipment Price Tracker — Flask login → price browse + deals.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/login');
  await h.shot('shot-01.png', 'Login — rate-limited, salted-scrypt auth (AgentMail-backed password reset).');

  await page.fill('input[name="username"]', 'admin@buttergang.dev');
  await page.fill('input[name="password"]', 'capture2026');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1500);

  if (!page.url().includes('login')) {
    await h.shot('shot-02.png', 'Price dashboard — 27+ retailers, deal flags, category filters.');
    await h.shot('shot-03-full.png', 'Full price browse view.');

    // Cheapest barbell / category views if linked
    const links = await page.locator('a[href]').evaluateAll(as => as.map(a => a.getAttribute('href'))).catch(() => []);
    const cat = links.find(l => /category/.test(l)) || links.find(l => /barbell/.test(l));
    if (cat) {
      await h.goto(baseUrl + cat, { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await h.shot('shot-04.png', 'Category view — barbell prices across 27+ retailers with history trends.');
    }
  } else {
    console.log('  ! login failed — keeping existing shots');
  }
}
