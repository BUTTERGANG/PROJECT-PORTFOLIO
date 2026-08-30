// Master Dashboard — project command center with live GitHub data.
export default async function (page, h) {
  await h.goto(h.baseUrl + '/dashboard.html');
  await page.waitForTimeout(2500);

  await h.shot('shot-01.png', 'Project command center — 20+ projects with live GitHub commit/issue/PR data.');

  // Status filter buttons if present
  const btns = page.locator('button.filter, .filter-btn, [data-status]');
  if (await btns.count() > 0) {
    await btns.first().click().catch(() => {});
    await page.waitForTimeout(800);
    await h.shot('shot-02.png', 'Filtered view — status and priority filtering across the portfolio.');
  }

  await h.shot('shot-03-full.png', 'Full dashboard.');

  await h.record(h.baseUrl + '/dashboard.html');
}
