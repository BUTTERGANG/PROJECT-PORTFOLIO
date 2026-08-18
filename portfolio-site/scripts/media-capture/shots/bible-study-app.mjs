// Shot list for Bible Study App — full-stack Bible study platform with 25+
// tools (insights, cross-references, word study, timeline, maps, groups,
// doctrine, sermon builder, and more) panelled alongside the reader.
// Captured against a local dev instance seeded with real KJV text (public
// domain, via the SWORD project) plus real timeline/cross-reference data.
// Deep-links directly into /read/KJV/... — the URL is canonical navigation
// state, so no landing-page click-through is needed. The right-side tool
// panel uses role="tab" buttons.
//
// NT-OT connections are sparse (only a handful of NT verses have recorded
// links), so that shot specifically navigates to Hebrews 1:5 — one of the
// few verses with data — rather than the more famous John 3:16, which has
// none.
//
// Run:
//   node capture-media.mjs --url http://localhost:5050 --slug bible-study-app

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // Reader — a well-known, content-rich chapter.
  await h.goto(`${base}/read/KJV/John/3`);
  await page.waitForTimeout(1500);
  await h.shot('shot-01.png', 'Reader — KJV text with chapter navigation and the study tool panel alongside.');

  // Timeline — historical/biblical event timeline (not passage-dependent).
  await page.getByRole('tab', { name: /^Timeline$/i }).click();
  await page.waitForTimeout(1200);
  await h.shot('shot-02.png', 'Timeline — biblical events plotted chronologically.');

  // NT-OT — Old Testament / New Testament cross-connections. Navigate to a
  // verse that actually has recorded connections, then select it.
  await h.goto(`${base}/read/KJV/Hebrews/1`);
  await page.waitForTimeout(1200);
  await page.locator('#v5').click();
  await page.waitForTimeout(500);
  await page.getByRole('tab', { name: /^NT-OT$/i }).click();
  await page.waitForTimeout(1200);
  await h.shot('shot-03.png', 'NT-OT connections — links between this passage and related Old/New Testament text.');

  // Record the clean walk-through last: reader → timeline → verse select → NT-OT.
  await h.record(`${base}/read/KJV/John/3`, async (vpage) => {
    await vpage.waitForTimeout(800);
    await vpage.getByRole('tab', { name: /^Timeline$/i }).click();
    await vpage.waitForTimeout(1500);
    await vpage.goto(`${base}/read/KJV/Hebrews/1`);
    await vpage.waitForTimeout(1200);
    await vpage.locator('#v5').click();
    await vpage.waitForTimeout(500);
    await vpage.getByRole('tab', { name: /^NT-OT$/i }).click();
    await vpage.waitForTimeout(1800);
  });
}
