// Shot list for the MASS Gym Platform (moran-website). Repo is private; this
// captures a LOCALLY-BOOTED instance (Next.js + Prisma + SQLite dev.db).
//
// Unlike the two public examples (mind-games, portfolio-site), this app is
// AUTH-GATED: the athlete portal and admin back office sit behind NextAuth. So
// this shot list logs in via the real credentials form, then screenshots the
// authenticated screens the doc calls for.
//
// PRIVACY (hard rule — see media-capture-pipeline memory): capture DEMO-SEEDED
// data only, never a real athlete's name/email/waiver PII. Boot against a fresh
// seeded dev DB, not the production data. The dev.db in the repo may hold real
// people — reseed demo accounts first.
//
// Boot + seed, then capture:
//   cd ~/Documents/MORAN-REMAKE
//   SEED_PASSWORD='pick-something' node scripts/seed-user.js   # demo accounts
//   npm run dev                                                # → http://localhost:3000
//   # then, from portfolio-site/scripts/media-capture:
//   MORAN_ADMIN_EMAIL=admin@example.com \
//   MORAN_ATHLETE_EMAIL=athlete@example.com \
//   MORAN_SEED_PASSWORD='pick-something' \
//     node capture-media.mjs --url http://localhost:3000 --slug moran-website
//
// Credentials come from env — never hardcode them (mirrors the app's own
// no-hardcoded-passwords discipline). If MORAN_SEED_PASSWORD is unset, the
// authenticated shots are skipped and only the public marketing pages capture,
// so a partial run still produces something honest rather than error screens.

const ADMIN_EMAIL = process.env.MORAN_ADMIN_EMAIL || 'admin@example.com';
const ATHLETE_EMAIL = process.env.MORAN_ATHLETE_EMAIL || 'athlete@example.com';
const PASSWORD = process.env.MORAN_SEED_PASSWORD || '';

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // Log in through the real NextAuth credentials form, then wait to land on an
  // authenticated route. Returns true on success, false so callers can skip the
  // gated shots rather than capture a login/error screen.
  async function login(email) {
    if (!PASSWORD) return false;
    await h.goto(`${base}/login`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', PASSWORD);
    await Promise.all([
      page.waitForURL((u) => !/\/login\b/.test(u.toString()), { timeout: 20_000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(1500); // let the dashboard hydrate
    return !/\/login\b/.test(page.url());
  }

  async function logout() {
    // NextAuth clears the JWT session cookie; drop cookies so the next login is
    // clean (athlete after admin, no stale session bleed).
    await page.context().clearCookies();
  }

  // ---- PUBLIC marketing site (no auth — the "front door") ------------------
  await h.goto(`${base}/`);
  await page.waitForTimeout(800);
  await h.shot('shot-01.png', 'Public home — the gym’s front door: hero, mission, and calls to register.');

  await h.goto(`${base}/coaches`);
  await page.waitForTimeout(600);
  await h.shot('shot-02.png', 'Coaches — the public roster that presents the gym’s staff.');

  await h.goto(`${base}/programs`);
  await page.waitForTimeout(600);
  await h.shot('shot-03.png', 'Programs — the public training-program offerings.');

  // The approval-gated registration flow — the front of the ACTIVE/PENDING/
  // REJECTED access model. Public, so no login needed.
  await h.goto(`${base}/register`);
  await page.waitForTimeout(600);
  await h.shot('shot-04.png', 'Approval-gated registration — athletes self-register as PENDING; an admin promotes to ACTIVE.');

  // ---- ADMIN back office (auth) — the program builder is the headline ------
  if (await login(ADMIN_EMAIL)) {
    await h.goto(`${base}/dashboard/admin`);
    await page.waitForTimeout(1500);
    await h.shot('shot-05.png', 'Admin back office — approvals, announcements, content, and check-in compliance at a glance.');

    await h.goto(`${base}/dashboard/programs`);
    await page.waitForTimeout(1500);
    await h.shot('shot-06.png', 'Program builder — the block-periodization model: Program → Block → Week → Day → Exercise.');
    await logout();
  } else {
    console.log('  … MORAN_SEED_PASSWORD unset (or admin login failed) — skipping admin shots.');
  }

  // ---- ATHLETE portal (auth) — the assigned-program view ------------------
  if (await login(ATHLETE_EMAIL)) {
    await h.goto(`${base}/dashboard`);
    await page.waitForTimeout(1500);
    await h.shot('shot-07.png', 'Athlete portal — the dashboard with the athlete’s assigned program, workouts, and check-ins.');
    // Keep the athlete session for the video walk-through below.
  } else {
    console.log('  … athlete login skipped — recording the public home instead.');
    await logout();
  }

  // ---- VIDEO: one clean walk-through, its own context ---------------------
  // Record the PUBLIC home page (no auth, no PII) so the autoplay-loop tile is
  // always safe to publish regardless of what seeded data is in the portal.
  await h.record(`${base}/`);
}
