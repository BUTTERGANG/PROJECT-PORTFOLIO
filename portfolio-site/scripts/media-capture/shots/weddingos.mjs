// WeddingOS shot list — login → vendor dashboard (the all-in-one client hub).
export default async function (page, h) {
  const { baseUrl } = h;

  // 1. Login screen
  await h.goto(baseUrl + '/login');
  await h.shot('shot-01.png', 'Vendor login — session auth with SameSite=Strict cookies.');

  // 2. Log in through the real form
  await page.fill('input[type="email"]', 'demo@weddingos.dev');
  await page.fill('input[type="password"]', 'DemoPass2026!x');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1500);

  // 3. Dashboard — clients + stats
  await h.shot('shot-02.png', 'Vendor dashboard — clients, revenue, and upcoming events at a glance.');

  // 4. Full-page dashboard
  await h.shot('shot-03-full.png', 'Full dashboard — every module one login away.');

  // 5. Timeline view if reachable
  await h.goto(baseUrl + '/timeline', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
  await h.shot('shot-04.png', 'Wedding-day timeline — run-of-show synced to the client record.');

  await h.record(baseUrl, async (vpage) => {
    await vpage.waitForTimeout(800);
  });
}
