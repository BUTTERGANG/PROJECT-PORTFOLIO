// Shot list for Wedding Timelines — collaborative wedding-day planning app
// (run-of-show timeline builder, task list, shot list, family/team roster).
//
// Captured against a local dev instance backed by the app's own in-memory
// storage backend (STORAGE_MODE=memory — no Postgres required for local
// capture) and seeded with a realistic demo wedding via the app's own API
// (register → create wedding → set-current-wedding → create timeline
// events/tasks/shot-list items/family members). Auth is traditional
// session-based (no Replit-identity dev-bypass here), so both the stills
// page and the video's fresh recording context need the seeded session
// cookie injected before their first navigation.
//
// Run:
//   node capture-media.mjs --url http://localhost:5099 --slug wedding-timelines

// Session cookie captured from the curl-based seeding pass (see
// /tmp/wt-cookies.txt during seeding) — signed express-session cookie for
// demo user "jordan_taylor" with wedding "Maya & Devon" set as current.
const SESSION_COOKIE = {
  name: 'wedding_session',
  value: 's%3AUyBK0Gz7NSZr1NvqTmkWzZleR9bn1Sgc.vmF5uBBhto9v9Wyw7%2FMh2vQhXxOd%2F2YHfkW7q%2BpZ7k4',
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  secure: false,
  sameSite: 'Strict',
};

// The app shows a first-run "Welcome to Wedding Planner" tour modal until
// this localStorage flag is set (client/src/components/onboarding.tsx) —
// suppress it so it never covers the seeded data.
const ONBOARDING_KEY = 'wedding-planner-onboarding-complete';

// The Overview screen's weather widget calls /api/weather, which 503s locally
// since there's no OPENWEATHER_API_KEY configured — mock a plausible sunny
// forecast for Asheville, NC so the widget renders real-looking data instead
// of a "Weather service unavailable" error card.
const MOCK_WEATHER = {
  temperature: 68,
  description: 'clear sky',
  humidity: 45,
  windSpeed: 6,
  icon: '01d',
  location: 'Asheville, NC',
  forecast: [
    { date: '2026-10-17', high: 71, low: 52, description: 'clear sky', icon: '01d' },
    { date: '2026-10-18', high: 69, low: 50, description: 'few clouds', icon: '02d' },
    { date: '2026-10-19', high: 66, low: 48, description: 'partly cloudy', icon: '02d' },
  ],
};

async function addSession(ctx) {
  await ctx.addCookies([SESSION_COOKIE]);
  await ctx.addInitScript((key) => {
    window.localStorage.setItem(key, 'true');
  }, ONBOARDING_KEY);
  await ctx.route('**/api/weather**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) })
  );
}

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // Inject the authenticated session (and suppress the first-run onboarding
  // tour) before the stills page's first navigation so it lands straight on
  // the wedding dashboard, not the landing/login screen or a modal.
  await addSession(page.context());

  await h.goto(`${base}/#home`);
  await page.waitForTimeout(1200);
  await h.shot('shot-01.png', 'Dashboard — Maya & Devon\'s wedding at a glance, with the collaborative team on hand.');

  await page.goto(`${base}/#timeline`);
  await page.waitForTimeout(1000);
  await h.shot('shot-02.png', 'Timeline builder — the full day, ceremony to send-off, with categories, priorities, and color-coded blocks.');

  await page.goto(`${base}/#overview`);
  await page.waitForTimeout(1000);
  await h.shot('shot-03.png', 'Run-of-show overview — the generated, shareable summary of the day.');

  await page.goto(`${base}/#shotlist`);
  await page.waitForTimeout(1000);
  await h.shot('shot-04.png', 'Shot list — must-have, ceremony, reception, and family shots the photographer needs to hit.');

  await page.goto(`${base}/#tasks`);
  await page.waitForTimeout(1000);
  await h.shot('shot-05.png', 'Tasks — planning to-dos with priority and completion tracking.');

  // Record the clean walk-through last: dashboard → timeline → overview → shot list.
  await h.record(`${base}/#home`, async (vpage) => {
    await vpage.waitForTimeout(1000);
    await vpage.goto(`${base}/#timeline`);
    await vpage.waitForTimeout(1400);
    await vpage.goto(`${base}/#overview`);
    await vpage.waitForTimeout(1400);
    await vpage.goto(`${base}/#shotlist`);
    await vpage.waitForTimeout(1400);
  }, {
    setup: async (vpage) => addSession(vpage.context()),
  });
}
