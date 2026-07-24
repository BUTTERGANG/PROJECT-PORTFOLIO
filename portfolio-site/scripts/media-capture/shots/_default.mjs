// Default shot list — used when there's no shots/<slug>.mjs for a project.
// Good enough for any single-page app: one above-the-fold shot, one full-page
// shot, and (if --video) one clean scroll-through recorded as the walk-through.
//
// A shot list is:  async (page, h) => { ... }
// Helpers (h):
//   h.goto(url?, opts?)   navigate + wait for networkidle, health-checked
//                         (retries transient 5xx; throws on error pages)
//   h.shot(file, caption) screenshot to public/media/<slug>/<file>
//                         (filename containing "full" → full-page capture)
//   h.record(url?, fn?)   record ONE clean video in its OWN context: settles the
//                         desktop layout first (no mobile-flash), then runs
//                         fn(vpage) or a default scroll. Call ONCE, last.
//                         No-op under --no-video.
//   h.page                the raw Playwright Page for custom interactions
//   h.baseUrl             the --url value

export default async function (page, h) {
  await h.goto();
  await h.shot('shot-01.png', 'Above the fold — the landing view.');
  await h.shot('shot-02-full.png', 'Full page, top to bottom.');
  // One clean walk-through video, recorded in its own context (not the churn
  // of the screenshot navigations above).
  await h.record();
}
