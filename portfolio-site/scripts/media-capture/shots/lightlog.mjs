// Shot list for LightLog — photography lighting tracker with real-time
// sun/moon position (SunCalc), golden/blue hour timing, an AI-style camera
// settings wizard, and weather (OpenWeather, falls back to simulated data
// without an API key).
//
// Captured against a local dev instance with in-memory storage — there's no
// database and no seed data. Location is hardcoded to San Francisco (the
// "Change" location button is a static placeholder, not yet wired up), and
// Sessions has no creation flow yet, so its empty state is the real,
// intended state rather than a bug.
//
// Run:
//   node capture-media.mjs --url http://localhost:5000 --slug lightlog

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  await h.goto(`${base}/`);
  await page.waitForTimeout(1500);
  await h.shot('shot-01.png', 'Dashboard — live sun elevation/azimuth, today’s light schedule (sunrise through blue hour), current weather, and moon phase.');

  // Camera Wizard — AI-style recommendations tied to current light + weather.
  await page.goto(`${base}/camera-wizard`);
  await page.waitForTimeout(1200);
  await h.shot('shot-02.png', 'Camera Settings Wizard — ISO, aperture, and shutter recommendations plus pro tips for the current lighting conditions.');

  // Sessions — real empty state (no creation flow implemented yet).
  await page.goto(`${base}/sessions`);
  await page.waitForTimeout(1000);
  await h.shot('shot-03.png', 'Sessions — tracks lighting sessions over time.');

  // Record the clean walk-through: dashboard → camera wizard → sessions.
  await h.record(`${base}/`, async (vpage) => {
    await vpage.waitForTimeout(1200);
    await vpage.goto(`${base}/camera-wizard`);
    await vpage.waitForTimeout(1800);
    await vpage.goto(`${base}/sessions`);
    await vpage.waitForTimeout(1200);
  });
}
