// Shot list for Mind Games — the anchor project. Repo stays private; this
// captures the PUBLIC deployed demo at https://mindgames.fit/.
//
// The site is a client-rendered SPA with real routes (nav is buttons, but the
// routes are directly navigable). We capture the marketing landing plus the
// three signed-out tool screens that show the ~7k-record data platform without
// needing a login: the Data Browser, Competition Mode, and Warmup Generator.
//
// Run against the live demo:
//   node capture-media.mjs --url https://mindgames.fit --slug mind-games

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // Landing — the hero + "how it works" + the coach-facing pitch.
  await h.goto(`${base}/`);
  await page.waitForTimeout(1200); // let the SPA settle past networkidle
  await h.shot('shot-01.png', 'Landing — "Analyze Every Lifter. Simulate Every Meet." on ~7,000 real USAW records.');
  await h.shot('shot-02-full.png', 'Full landing page — the data platform pitch coaches use to win Nationals.');

  // Data Browser — the queryable historical-results database. Run a real search
  // so the shot shows populated results (public USAW meet records), not the
  // empty search state. Shows the true scale: 7,358 competitions / 68,637 lifters.
  await h.goto(`${base}/data-browser`);
  await page.waitForTimeout(1500);
  const search = await page.$('input[type=text], input[placeholder*="lifter" i], input[placeholder*="name" i]');
  if (search) {
    await search.fill('Smith');
    await page.waitForTimeout(2800); // let results load
  }
  await h.shot('shot-03.png', 'Data Browser — searching 68,637 lifters across 7,358 competitions of public USAW results.');

  // Competition Mode — the meet simulator (attempt selection, clock, placings).
  await h.goto(`${base}/competition-mode`);
  await page.waitForTimeout(1500);
  await h.shot('shot-04.png', 'Competition Mode — simulate a live meet: attempt selection, the clock, who leads.');

  // Warmup Generator — the athlete-facing tool built on the same data.
  await h.goto(`${base}/warmup-generator`);
  await page.waitForTimeout(1500);
  await h.shot('shot-05.png', 'Warmup Generator — timed warm-up plan derived from the opener.');

  // Record the video LAST and in its own clean context — a single smooth
  // scroll-through of the landing page. h.record() opens a fresh recording
  // context, settles the desktop layout, scrolls, and closes, so the video is
  // ONLY this walk-through (not the churn of the screenshot navigations above).
  await h.record(`${base}/`);
}
