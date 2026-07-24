// Shot list for the portfolio site itself — the first real capture, proving the
// whole pipeline with zero secrets (the site is already public and booting).
// Captures the three pages that best show the Build Loop narrative, then records
// a scroll-through of the home page (the acceleration-arc timeline animates).

export default async function (page, h) {
  // Home — hero + animated acceleration timeline.
  await h.goto(`${h.baseUrl}/`);
  await h.shot('shot-01.png', 'Home — the thesis and the acceleration-arc timeline.');

  // Builder — the origin-clustered project grid (the core of the site).
  await h.goto(`${h.baseUrl}/builder`);
  await h.shot('shot-02-full.png', 'The Builder — every project grouped by origin cluster.');

  // A project page — shows the case-study layout private repos rely on.
  await h.goto(`${h.baseUrl}/projects/mind-games`);
  await h.shot('shot-03.png', 'A project case study — the anchor, Mind Games.');

  // Record the home-page scroll as one clean walk-through (own context).
  await h.record(`${h.baseUrl}/`);
}
