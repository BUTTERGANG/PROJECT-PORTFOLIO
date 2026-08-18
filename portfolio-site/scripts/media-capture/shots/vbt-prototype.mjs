// Shot list for VBT Tracker — a 3-service PWA (Vite/React frontend, Express
// backend on Neon Postgres, Python FastAPI autoregulation service). Running
// all three live isn't practical for capture (Neon's driver is HTTP-only and
// has no local equivalent; the autoregulation call and BLE hardware aren't
// reproducible headlessly), so this script runs against the frontend alone
// and stands in for the backend with page.route() mocks returning realistic,
// deterministic JSON matching the app's own types. Auth is bypassed by
// seeding the persisted zustand session (same trust boundary the app itself
// uses to survive network errors). Two screens read data the app never puts
// on the network at all — HomeScreen and VideoLibraryScreen read IndexedDB
// directly, so those are seeded via raw IndexedDB writes instead.
//
// SetReviewScreen's bar-path overlay only renders when a videoUrl is set (it
// draws onto a canvas sized to a <video> element). Live camera inference
// isn't reproducible without real lift footage, so this uses a short local
// placeholder clip (pwa/public/demo-lift.mp4, a generated moving rectangle —
// not real footage) purely to give the <video> real pixel dimensions; the
// green path itself is the app's own overlay algorithm drawing real
// coordinate data, unrelated to the clip's content.
//
// CoachModeScreen and WorkoutScreen/PostSetSummaryScreen read from an
// in-memory zustand store (liftStore) that isn't persisted or exposed
// anywhere by default, so liftStore.ts gained one local-only line exposing
// `window.__liftStore` for capture tooling (never pushed upstream — same
// pattern as the local npm-install fix used for productivity-tracker).
//
// Run:
//   node capture-media.mjs --url http://localhost:5173 --slug vbt-prototype

const ATHLETES = [
  { id: 'ath-1', name: 'Jordan Reyes', bodyweight: 82, primaryLifts: ['Squat', 'Bench Press'], baselineVelocity: 0.82, fatigueThreshold: 0.18, createdAt: '2026-02-01T00:00:00Z' },
  { id: 'ath-2', name: 'Priya Nair', bodyweight: 64, primaryLifts: ['Deadlift', 'Squat'], baselineVelocity: 0.75, fatigueThreshold: 0.2, createdAt: '2026-02-14T00:00:00Z' },
  { id: 'ath-3', name: 'Marcus Webb', bodyweight: 95, primaryLifts: ['Bench Press', 'Deadlift'], baselineVelocity: 0.68, fatigueThreshold: 0.15, createdAt: '2026-03-02T00:00:00Z' },
];

function seedAuth() {
  localStorage.setItem(
    'vbt_auth',
    JSON.stringify({ state: { user: { id: 'ath-1', email: 'jordan@example.com' }, token: 'demo-session-token' }, version: 0 })
  );
}

function seedWorkoutSession() {
  const now = Date.now();
  const mkRep = (n, v) => ({ repNumber: n, meanVelocity: v, peakVelocity: v + 0.08, zoneResult: v > 0.75 ? 'IN_RANGE' : v > 0.6 ? 'SLOW' : 'FAST', readings: [] });
  const sets = [
    { id: 'set-1', exercise: 'Back Squat', weight: 120, reps: [mkRep(1, 0.91), mkRep(2, 0.88), mkRep(3, 0.84), mkRep(4, 0.79)], avgVelocity: 0.855, bestVelocity: 0.91, timestamp: now - 1000 * 60 * 9 },
    { id: 'set-2', exercise: 'Back Squat', weight: 130, reps: [mkRep(1, 0.8), mkRep(2, 0.76), mkRep(3, 0.69)], avgVelocity: 0.75, bestVelocity: 0.8, timestamp: now - 1000 * 60 * 5 },
    { id: 'set-3', exercise: 'Back Squat', weight: 135, reps: [mkRep(1, 0.71), mkRep(2, 0.64)], avgVelocity: 0.675, bestVelocity: 0.71, timestamp: now - 1000 * 60 * 2 },
  ];
  sessionStorage.setItem('vbt_workout_sets', JSON.stringify(sets));
}

// Raw IndexedDB writes for the two screens that read local data directly
// (VBTTrackerDB for HomeScreen's quick stats, VBTDatabase for the video
// library list) rather than going through the network.
async function seedIndexedDB() {
  function open(name, version, upgrade) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(name, version);
      req.onupgradeneeded = () => upgrade(req.result);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  function tx(db, store, mode, fn) {
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      fn(s);
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
    });
  }

  const now = Date.now();

  const trackerDb = await open('VBTTrackerDB', 1, (db) => {
    if (!db.objectStoreNames.contains('sessions')) {
      db.createObjectStore('sessions', { keyPath: 'id' });
    }
  });
  await tx(trackerDb, 'sessions', 'readwrite', (store) => {
    const rows = [
      { id: 'hs-1', timestamp: now - 86400000 * 1, exercise: 'Back Squat', bestVelocity: 0.91, sets: [1, 2, 3] },
      { id: 'hs-2', timestamp: now - 86400000 * 3, exercise: 'Bench Press', bestVelocity: 0.64, sets: [1, 2] },
      { id: 'hs-3', timestamp: now - 86400000 * 5, exercise: 'Deadlift', bestVelocity: 0.55, sets: [1, 2, 3, 4] },
      { id: 'hs-4', timestamp: now - 86400000 * 8, exercise: 'Back Squat', bestVelocity: 0.87, sets: [1, 2] },
      { id: 'hs-5', timestamp: now - 86400000 * 12, exercise: 'Front Squat', bestVelocity: 0.79, sets: [1, 2, 3] },
    ];
    for (const r of rows) store.put(r);
  });
  trackerDb.close();

  const videoDb = await open('VBTDatabase', 1, (db) => {
    if (!db.objectStoreNames.contains('readings')) {
      const r = db.createObjectStore('readings', { keyPath: 'id', autoIncrement: true });
      r.createIndex('sessionId', 'sessionId');
    }
    if (!db.objectStoreNames.contains('sessions')) {
      const s = db.createObjectStore('sessions', { keyPath: 'id' });
      s.createIndex('athleteId', 'athleteId');
      s.createIndex('startTime', 'startTime');
    }
  });
  await tx(videoDb, 'sessions', 'readwrite', (store) => {
    const rows = [
      { id: 'vid-1', athleteId: 'ath-1', exercise: 'Back Squat', startTime: now - 86400000 * 1, endTime: now - 86400000 * 1 + 1800000, synced: false },
      { id: 'vid-2', athleteId: 'ath-1', exercise: 'Bench Press', startTime: now - 86400000 * 3, endTime: now - 86400000 * 3 + 1500000, synced: true },
      { id: 'vid-3', athleteId: 'ath-1', exercise: 'Deadlift', startTime: now - 86400000 * 5, endTime: now - 86400000 * 5 + 2100000, synced: false },
      { id: 'vid-4', athleteId: 'ath-1', exercise: 'Front Squat', startTime: now - 86400000 * 9, endTime: now - 86400000 * 9 + 1700000, synced: true },
    ];
    for (const r of rows) store.put(r);
  });
  videoDb.close();

  window.__vbtSeeded = true;
}

function buildBarPath() {
  // A squat-style descent/ascent: mostly vertical travel with a small
  // sinusoidal horizontal wobble, matching the motion in demo-lift.mp4.
  const pts = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1); // 0..1 over the rep
    const y = 90 + 560 * Math.abs(Math.sin(Math.PI * t));
    const x = 190 + 40 * Math.sin(2 * Math.PI * t * 1.5);
    pts.push({ x, y });
  }
  return pts;
}

async function registerApiMocks(page) {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ user: { id: 'ath-1', email: 'jordan@example.com' } }) });
  });

  await page.route('**/api/athletes**', async (route) => {
    if (route.request().method() !== 'GET') return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ATHLETES) });
  });

  await page.route('**/api/analytics/dashboard**', async (route) => {
    // Note: AnalyticsDashboard only renames these four top-level keys from
    // snake_case — each array item is read back out in camelCase (a
    // pre-existing quirk in the app itself), so item fields must be
    // camelCase here or the screen throws reading undefined.
    const body = {
      velocity_trend: [
        { exercise: 'Back Squat', sessionDate: '2026-07-20', avgVelocity: 0.79, maxPeak: 1.05, totalReps: 12 },
        { exercise: 'Back Squat', sessionDate: '2026-07-27', avgVelocity: 0.81, maxPeak: 1.08, totalReps: 10 },
        { exercise: 'Back Squat', sessionDate: '2026-08-03', avgVelocity: 0.84, maxPeak: 1.1, totalReps: 11 },
        { exercise: 'Back Squat', sessionDate: '2026-08-10', avgVelocity: 0.855, maxPeak: 1.12, totalReps: 9 },
      ],
      zone_distribution: [
        { zoneResult: 'IN_RANGE', count: 34, percentage: 58 },
        { zoneResult: 'SLOW', count: 16, percentage: 27 },
        { zoneResult: 'FAST', count: 9, percentage: 15 },
      ],
      fatigue_alerts: [
        { sessionId: 'hs-1', exercise: 'Back Squat', startTime: '2026-08-10T15:00:00Z', fatigueFlag: true, autoregScore: 0.42, setNumber: 3, velocityDropPct: 0.21 },
      ],
      program_adherence: [
        { programName: 'Strength Block — Squat Focus', sessionsCompleted: 9, startDate: '2026-07-01', endDate: null, isActive: true },
        { programName: 'Bench Volume Phase', sessionsCompleted: 6, startDate: '2026-06-01', endDate: '2026-06-28', isActive: false },
      ],
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });

  await page.route('**/api/analytics/history**', async (route) => {
    const mkRep = (n, v) => ({ rep_number: n, mean_velocity: v, peak_velocity: v + 0.07, zone_result: v > 0.78 ? 'IN_RANGE' : v > 0.62 ? 'SLOW' : 'FAST' });
    const sessions = [
      { id: 'hs-1', exercise: 'Back Squat', start_time: '2026-08-10T15:00:00Z', end_time: '2026-08-10T15:42:00Z', fatigue_flag: true, autoreg_score: 0.42, tags: ['strength'], athlete_name: 'Jordan Reyes', program_name: 'Strength Block — Squat Focus', sets: [{ set_number: 1, reps: [mkRep(1, 0.91), mkRep(2, 0.88), mkRep(3, 0.84)] }, { set_number: 2, reps: [mkRep(1, 0.8), mkRep(2, 0.76)] }], total_reps: 9, avg_velocity: 0.855 },
      { id: 'hs-2', exercise: 'Bench Press', start_time: '2026-08-08T14:10:00Z', end_time: '2026-08-08T14:38:00Z', fatigue_flag: false, autoreg_score: 0.71, tags: [], athlete_name: 'Jordan Reyes', program_name: 'Bench Volume Phase', sets: [{ set_number: 1, reps: [mkRep(1, 0.64), mkRep(2, 0.6)] }], total_reps: 4, avg_velocity: 0.62 },
      { id: 'hs-3', exercise: 'Deadlift', start_time: '2026-08-06T16:00:00Z', end_time: '2026-08-06T16:35:00Z', fatigue_flag: false, autoreg_score: 0.68, tags: ['heavy'], athlete_name: 'Jordan Reyes', program_name: 'Strength Block — Squat Focus', sets: [{ set_number: 1, reps: [mkRep(1, 0.55), mkRep(2, 0.51), mkRep(3, 0.48), mkRep(4, 0.44)] }], total_reps: 11, avg_velocity: 0.5 },
      { id: 'hs-4', exercise: 'Front Squat', start_time: '2026-08-02T15:20:00Z', end_time: '2026-08-02T15:50:00Z', fatigue_flag: false, autoreg_score: 0.75, tags: [], athlete_name: 'Jordan Reyes', program_name: 'Strength Block — Squat Focus', sets: [{ set_number: 1, reps: [mkRep(1, 0.79), mkRep(2, 0.77)] }], total_reps: 8, avg_velocity: 0.79 },
    ];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessions, pagination: { limit: 50, offset: 0, count: sessions.length, total: sessions.length } }) });
  });

  await page.route('**/api/sessions**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await page.route('**/api/autoregulate', async (route) => {
    const body = {
      session_summary: { exercise: 'Back Squat', total_sets: 3, total_reps: 9, overall_avg_velocity: 0.76, max_peak_velocity: 1.12 },
      set_recommendations: [
        { set_number: 1, recommendation: 'maintain', reason: 'Velocity within target zone across all reps.', suggested_velocity_target: 0.85, confidence: 0.88 },
        { set_number: 2, recommendation: 'maintain', reason: 'Slight drop but still in range.', suggested_velocity_target: 0.8, confidence: 0.79 },
        { set_number: 3, recommendation: 'decrease_load', reason: 'Velocity drop exceeded 20% from set 1 — reduce load next session.', suggested_velocity_target: 0.75, confidence: 0.83 },
      ],
      overall_recommendation: 'Velocity dropped 21% across the session — reduce load 5-8% next session to stay in the target zone.',
      overall_confidence: 0.81,
      fatigue_detected: true,
      velocity_drop: 0.21,
      message: 'Velocity dropped 21% across the session — consider reducing load 5-8% next session to stay in the target zone.',
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

async function seedLiftStore(pg, patch) {
  await pg.waitForFunction(() => !!window.__liftStore);
  await pg.evaluate((p) => window.__liftStore.setState(p), patch);
}

export default async function (page, h) {
  await registerApiMocks(page);
  await page.addInitScript(seedAuth);
  await page.addInitScript(seedWorkoutSession);

  // Seed IndexedDB on a first load, then reload so HomeScreen/VideoLibrary
  // mount against already-populated databases (avoids a mount-vs-write race).
  await page.addInitScript(seedIndexedDB);
  await h.goto(`${h.baseUrl}/`);
  await page.waitForFunction(() => window.__vbtSeeded === true);
  await page.reload();
  await page.waitForTimeout(900);
  // Note: seedLiftStore writes to in-memory zustand state, which a full
  // page.goto()/reload() wipes — always seed AFTER the last navigation to
  // a screen, never before, or the seeded fields silently revert to defaults.
  await seedLiftStore(page, { athletes: ATHLETES });
  await page.waitForTimeout(300);
  await h.shot('shot-01.png', 'Home dashboard with quick stats pulled from real session history.');

  await h.goto(`${h.baseUrl}/history`);
  await page.waitForTimeout(1000);
  await h.shot('shot-02.png', 'Session history — exercise, sets, and average velocity across recent training sessions.');

  await h.goto(`${h.baseUrl}/analytics`);
  await page.waitForTimeout(1000);
  await h.shot('shot-03.png', 'Analytics dashboard — velocity trend over time, zone distribution, and fatigue alerts.');

  await h.goto(`${h.baseUrl}/athletes`);
  await page.waitForTimeout(800);
  await h.shot('shot-04.png', 'Athlete profiles — bodyweight, primary lifts, and baseline velocity per athlete.');

  await h.goto(`${h.baseUrl}/videos`);
  await page.waitForTimeout(800);
  await h.shot('shot-05.png', 'Video library — saved training sets by exercise, filterable and linked to their performance data.');

  await h.goto(`${h.baseUrl}/workout`);
  await page.waitForTimeout(800);
  await h.shot('shot-06.png', 'Active workout — sets logged this session with per-set average and best velocity.');

  // Coach mode reads live BLE state from the in-memory store — seed a
  // multi-athlete live feed directly since there's no real BLE hardware here.
  await page.goto(`${h.baseUrl}/coach`);
  await seedLiftStore(page, {
    athletes: ATHLETES,
    bleState: 'connected',
    liveAthletes: {
      'ath-1': { athleteId: 'ath-1', sessionId: 'live-1', velocity: 0.86, zone: 'IN_RANGE', repNumber: 4, setNumber: 2, timestamp: Date.now() },
      'ath-2': { athleteId: 'ath-2', sessionId: 'live-2', velocity: 0.58, zone: 'SLOW', repNumber: 2, setNumber: 1, timestamp: Date.now() },
      'ath-3': { athleteId: 'ath-3', sessionId: 'live-3', velocity: 1.02, zone: 'FAST', repNumber: 1, setNumber: 3, timestamp: Date.now() },
    },
  });
  await page.waitForTimeout(800);
  await h.shot('shot-07.png', 'Coach mode — multiple athletes streaming live velocity and zone data over BLE.');

  // Post-set summary — seed completedReps AFTER navigating to /summary
  // (a page.goto() to a new URL wipes the in-memory store, so seeding
  // beforehand and then navigating loses the data — the screen renders
  // its "no reps" empty state instead).
  await page.goto(`${h.baseUrl}/summary`);
  await seedLiftStore(page, {
    exercise: 'Back Squat',
    completedReps: [
      { repNumber: 1, meanVelocity: 0.91, peakVelocity: 0.99, zoneResult: 'IN_RANGE', readings: [] },
      { repNumber: 2, meanVelocity: 0.85, peakVelocity: 0.93, zoneResult: 'IN_RANGE', readings: [] },
      { repNumber: 3, meanVelocity: 0.76, peakVelocity: 0.84, zoneResult: 'SLOW', readings: [] },
      { repNumber: 4, meanVelocity: 0.68, peakVelocity: 0.75, zoneResult: 'SLOW', readings: [] },
    ],
  });
  await page.waitForTimeout(1400);
  await h.shot('shot-08.png', 'Post-set summary — autoregulation call with confidence score and load recommendation for the next set.');

  // Set review — bar-path overlay, delivered via router state (the same
  // path the real camera-capture flow uses to hand off into this screen).
  await page.goto(`${h.baseUrl}/`);
  const reviewData = {
    exercise: 'Back Squat',
    weight: 120,
    reps: [
      { repNumber: 1, meanVelocity: 0.91, peakVelocity: 0.99, zoneResult: 'IN_RANGE', readings: [] },
      { repNumber: 2, meanVelocity: 0.88, peakVelocity: 0.95, zoneResult: 'IN_RANGE', readings: [] },
      { repNumber: 3, meanVelocity: 0.84, peakVelocity: 0.91, zoneResult: 'IN_RANGE', readings: [] },
      { repNumber: 4, meanVelocity: 0.79, peakVelocity: 0.86, zoneResult: 'SLOW', readings: [] },
    ],
    readings: [],
    videoUrl: '/demo-lift.mp4',
    barPath: buildBarPath(),
    prevSet: { avgVelocity: 0.8, bestVelocity: 0.87, weight: 115 },
  };
  await page.evaluate((data) => {
    const key = Math.random().toString(36).slice(2);
    const idx = (window.history.state && typeof window.history.state.idx === 'number') ? window.history.state.idx + 1 : 0;
    window.history.pushState({ usr: { data }, key, idx }, '', '/review');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, reviewData);
  await page.waitForTimeout(1600);
  await h.shot('shot-09.png', 'Set review with bar-path overlay — per-rep velocity, zone tags, and estimated 1RM.');

  // h.record() opens a fresh browser context for the recording — it doesn't
  // inherit this page's route mocks or storage seeds, so both must be
  // re-registered here via opts, or every screen redirects straight to the
  // login form (no auth token) instead of showing real data.
  await h.record(`${h.baseUrl}/analytics`, async (vpage) => {
    await vpage.waitForTimeout(1500);
    await vpage.goto(`${h.baseUrl}/history`);
    await vpage.waitForTimeout(1400);
    await vpage.goto(`${h.baseUrl}/coach`);
    await seedLiftStore(vpage, {
      athletes: ATHLETES,
      bleState: 'connected',
      liveAthletes: {
        'ath-1': { athleteId: 'ath-1', sessionId: 'live-1', velocity: 0.86, zone: 'IN_RANGE', repNumber: 4, setNumber: 2, timestamp: Date.now() },
        'ath-2': { athleteId: 'ath-2', sessionId: 'live-2', velocity: 0.58, zone: 'SLOW', repNumber: 2, setNumber: 1, timestamp: Date.now() },
        'ath-3': { athleteId: 'ath-3', sessionId: 'live-3', velocity: 1.02, zone: 'FAST', repNumber: 1, setNumber: 3, timestamp: Date.now() },
      },
    });
    await vpage.waitForTimeout(1800);
  }, {
    initScripts: [seedAuth, seedWorkoutSession],
    setup: registerApiMocks,
  });
}
