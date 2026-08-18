// Shot list for WorkoutFlow — coach/athlete strength-training program platform
// (program builder, athlete roster, mobile set logger with RPE + plate calc).
//
// Repo is private; captures a LOCALLY-BOOTED instance (Express + Postgres via
// Drizzle). Auth is traditional session-based (Passport local strategy), so
// this logs in through the real email/password form as two different demo
// users — a coach and an athlete — rather than injecting a session cookie.
//
// PRIVACY: all seeded people are fictional demo accounts (Taylor Reyes,
// Morgan Lee, Jordan Patel @ "Summit Performance Lab") — no real client data.
//
// Seed (curl-based, ad hoc — see harness README "Capturing a private repo"):
//   coach.taylor@example.com / athlete.morgan@example.com / athlete.jordan@example.com,
//   all password DemoPass123456!, org "Summit Performance Lab", team "Varsity
//   Strength", 5 exercises, an 8-week program with 2 populated weeks / 3 days,
//   2 program assignments, and a handful of completed workout sessions with
//   exercise/set logs so the coach roster and program builder show real data.
//
// NOTE: the app's Progress Analytics page (client/src/pages/progress.tsx) is
// entirely static markup — every stat and chart placeholder is hardcoded
// ("0", "--", "No workout data yet") with no useQuery wiring at all. It's not
// a real feature yet, so it's skipped here rather than screenshotted as if it
// were live — capturing it would misrepresent an unbuilt page as a working
// progression chart, mocking a whole feature. Same reasoning excludes the
// Dashboard's "Recent Activity" panel, which is hardcoded and untouched.
//
// The mobile set-logger's "active session" is local React component state,
// not rehydrated from an existing in-progress session on load — so rather
// than rely on a pre-seeded partial session (which the UI can't resume), this
// script starts a fresh session live and logs two real sets in-browser before
// the shot, producing genuine "Completed Sets" data the same way an athlete
// would.
//
// Run:
//   node capture-media.mjs --url http://localhost:5098 --slug workoutflow

const COACH_EMAIL = 'coach.taylor@example.com';
const ATHLETE_EMAIL = 'athlete.morgan@example.com';
const PASSWORD = 'DemoPass123456!';

async function login(page, h, email) {
  const base = h.baseUrl.replace(/\/$/, '');
  await page.context().clearCookies();
  // NOTE: intentionally page.goto, not h.goto — h.goto is bound to the
  // harness's stills page, not whichever page this is called with. During
  // the video pass this runs against a fresh recording-context page, so
  // navigating through h.goto would silently drive the wrong tab and leave
  // this page blank.
  await page.goto(`${base}/login`, { waitUntil: 'load', timeout: 30_000 });
  await page.fill('[data-testid="input-login-email"]', email);
  await page.fill('[data-testid="input-login-password"]', PASSWORD);
  // The app's own post-login redirect races its auth-state query invalidation
  // (client-side ProtectedRoute can bounce back to "/" if the query hasn't
  // resolved yet) — wait for the actual login response, then navigate
  // ourselves once the session cookie is confirmed set, rather than trusting
  // the client redirect timing.
  await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/auth/login') && r.request().method() === 'POST', { timeout: 20_000 }),
    page.click('[data-testid="button-submit-login"]'),
  ]);
  await page.waitForTimeout(800);
  await page.goto(`${base}/dashboard`);
  await page.waitForTimeout(1200);
}

async function logSetLive(page) {
  // Fill weight/reps and log a couple of real sets through the actual UI
  // interactions, so "Completed Sets" reflects genuinely-logged data.
  await page.fill('[data-testid="input-weight"]', '225');
  await page.selectOption('[data-testid="select-rpe"]', '8').catch(() => {});
  await page.click('[data-testid="button-log-set"]');
  await page.waitForTimeout(900);
  await page.fill('[data-testid="input-weight"]', '225');
  await page.click('[data-testid="button-log-set"]');
  await page.waitForTimeout(900);
}

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // ---- COACH: dashboard, program builder, athlete roster --------------------
  await login(page, h, COACH_EMAIL);

  await page.goto(`${base}/dashboard`);
  await page.waitForTimeout(1200);
  await h.shot('shot-01.png', 'Coach dashboard — programs, athletes, completion rate, and weekly volume for Summit Performance Lab.');

  await page.goto(`${base}/programs`);
  await page.waitForTimeout(1200);
  await h.shot('shot-02.png', 'Programs — the 8-Week Strength Block, assigned to both athletes.');

  await page.click('text=8-Week Strength Block');
  await page.waitForTimeout(1000);
  await h.shot('shot-03.png', 'Program builder — workout days with their planned exercises, sets, reps, and intensity.');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  await page.goto(`${base}/athletes`);
  await page.waitForTimeout(1200);
  await h.shot('shot-04.png', 'Athlete roster — coach view of the team with assigned programs.');

  // ---- ATHLETE: mobile set logger with RPE + plate calculator ---------------
  await login(page, h, ATHLETE_EMAIL);

  await page.goto(`${base}/workout`);
  await page.waitForTimeout(1200);
  await page.click('[data-testid="button-start-workout"]');
  await page.waitForTimeout(1000);
  await logSetLive(page);
  await h.shot('shot-05.png', 'Mobile set logger — weight, reps, RPE, rest timer, and live-logged sets for today\'s bench press work.');

  // Record the clean walk-through last: coach dashboard → programs → builder → athletes.
  await h.record(`${base}/dashboard`, async (vpage) => {
    await vpage.waitForTimeout(1000);
    await vpage.goto(`${base}/programs`);
    await vpage.waitForTimeout(1400);
    await vpage.click('text=8-Week Strength Block');
    await vpage.waitForTimeout(1600);
    await vpage.keyboard.press('Escape');
    await vpage.waitForTimeout(600);
    await vpage.goto(`${base}/athletes`);
    await vpage.waitForTimeout(1400);
  }, {
    setup: async (vpage) => {
      await login(vpage, h, COACH_EMAIL);
    },
  });
}
