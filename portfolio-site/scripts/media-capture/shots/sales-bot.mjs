// SALES-BOT — HTMX dashboard; live co-pilot + post-call analyst + playbook.
export default async function (page, h) {
  const { baseUrl } = h;

  await h.goto(baseUrl + '/');
  await h.shot('shot-01.png', 'SALES-BOT dashboard — post-call analyst + live co-pilot for sales calls.');

  // Probe nav links for sub-pages
  const links = await page.locator('a[href^="/"]').evaluateAll(
    (as) => as.map((a) => a.getAttribute('href')).filter((v, i, arr) => v && arr.indexOf(v) === i && v !== '/')
  ).catch(() => []);

  const interesting = links.filter(l => /live|call|playbook|report|transcript/i.test(l)).slice(0, 2);
  let n = 2;
  for (const l of interesting) {
    await h.goto(baseUrl + l, { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(1200);
    await h.shot(`shot-0${n}.png`, `View: ${l.replace(/^\//, '')} — rule-based scoring + LLM-enriched analysis.`);
    n++;
  }

  await h.shot('shot-03-full.png', 'Full dashboard page.');

  await h.record(baseUrl);
}
