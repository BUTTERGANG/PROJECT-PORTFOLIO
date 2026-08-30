// Business Recon CRM — Flask view over outreach_pack.csv.
export default async function (page, h) {
  await h.goto(h.baseUrl + '/');
  await page.waitForTimeout(1200);

  await h.shot('shot-01.png', 'CRM view — enriched leads with verification status and outreach context.');

  await h.shot('shot-02-full.png', 'Full CRM table — SMTP-verified leads from the deep-crawl pipeline.');

  await h.record(h.baseUrl);
}