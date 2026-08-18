// Shot list for 365 Day Productivity Tracker — a local-first Vite SPA (no
// backend, no database). All state lives in localStorage, so a fresh clone
// opens to a completely empty contribution grid — which fails the case
// study's explicit "what to show: the filled-in contribution grid; a streak
// view" requirement.
//
// Fix: seed localStorage with a year of realistic task history via
// page.addInitScript() before the first navigation — a deterministic
// (seeded-random) mix of scattered activity days, a long-ago "best streak"
// run, and a current streak ending today, across all 5 categories, with
// enough volume to unlock most of the Goals achievements too. This mirrors
// what a real year of daily use would look like; nothing here is faked
// beyond supplying data the app's own localStorage schema expects.
//
// Run:
//   node capture-media.mjs --url http://localhost:5173 --slug productivity-tracker

function seedLocalStorageData() {
  // mulberry32 — small deterministic PRNG so re-runs produce the same grid.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(20260812);

  const CATEGORY_KEYS = ['work', 'personal', 'health', 'learning', 'other'];
  const TASK_NAMES = [
    'Morning workout', 'Write project update', 'Read 20 pages', 'Meal prep',
    'Review PRs', 'Clean inbox', 'Plan tomorrow', 'Stretch / mobility work',
    'Deep work block', 'Walk the dog', 'Practice guitar', 'Budget check-in',
    'Client follow-up', 'Study session', 'Journal', 'Meditate 10 min',
  ];

  function fmt(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function makeTask(dateStr, completed) {
    const category = CATEGORY_KEYS[Math.floor(rand() * CATEGORY_KEYS.length)];
    const name = TASK_NAMES[Math.floor(rand() * TASK_NAMES.length)];
    return {
      id: `${dateStr}-${Math.floor(rand() * 1e9).toString(36)}`,
      name,
      completed,
      createdAt: new Date(dateStr + 'T09:00:00').toISOString(),
      category,
    };
  }

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  // Windows that get guaranteed, fully-completed activity: a long "best
  // streak" run mid-year, and a current streak ending today.
  const bestStreakStart = new Date(today.getFullYear(), 3, 6); // Apr 6
  const bestStreakLen = 16;
  const bestStreakEnd = new Date(bestStreakStart);
  bestStreakEnd.setDate(bestStreakEnd.getDate() + bestStreakLen - 1);

  const currentStreakLen = 9;
  const currentStreakStart = new Date(today);
  currentStreakStart.setDate(currentStreakStart.getDate() - (currentStreakLen - 1));

  function inRange(d, start, end) {
    return d >= start && d <= end;
  }

  const taskData = {};
  let perfectDayPlaced = false;

  for (
    let d = new Date(yearStart);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = fmt(d);
    const forcedStreak =
      inRange(d, bestStreakStart, bestStreakEnd) || inRange(d, currentStreakStart, today);

    // Scattered baseline activity elsewhere in the year (~55% of days).
    if (!forcedStreak && rand() > 0.55) continue;

    const taskCount = forcedStreak
      ? 2 + Math.floor(rand() * 3) // 2-4 tasks on streak days
      : 1 + Math.floor(rand() * 5); // 1-5 tasks on scattered days

    let completedCount;
    if (forcedStreak) {
      completedCount = taskCount; // guarantee streak credit (needs >=1 completed)
    } else {
      completedCount = Math.floor(rand() * (taskCount + 1));
    }

    // Give one generous day a genuine "perfect day" (all done, 3+ tasks).
    if (!perfectDayPlaced && !forcedStreak && taskCount >= 5) {
      completedCount = taskCount;
      perfectDayPlaced = true;
    }

    const tasks = [];
    for (let i = 0; i < taskCount; i++) {
      tasks.push(makeTask(dateStr, i < completedCount));
    }
    // Shuffle so completed tasks aren't always the first N.
    for (let i = tasks.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
    }
    taskData[dateStr] = tasks;
  }

  localStorage.setItem('productivity-tracker-data', JSON.stringify(taskData));
  // Suppress the "export your data" reminder banner — it's not the story.
  localStorage.setItem('lastExportAt', String(Date.now()));
}

export default async function (page, h) {
  await page.addInitScript(seedLocalStorageData);

  await h.goto(`${h.baseUrl}`);
  await page.waitForTimeout(1000);
  await h.shot('shot-01.png', 'Contribution grid — a year of daily task activity, with an active current streak and category filters.');

  // Analytics tab — weekly activity, category breakdown, day-of-week trends.
  await page.getByRole('tab', { name: 'Analytics' }).click();
  await page.waitForTimeout(900);
  await h.shot('shot-02.png', 'Analytics — completion rate, weekly activity heatmap, tasks by category, and productivity by day of week.');

  // Goals tab — achievements unlocked by the seeded history.
  await page.getByRole('tab', { name: 'Goals' }).click();
  await page.waitForTimeout(600);
  await h.shot('shot-03.png', 'Goals & Achievements — streak and volume milestones unlocked from the tracked history.');

  // Click a populated day to show the task panel with real tasks.
  await page.getByRole('tab', { name: 'Grid' }).click();
  await page.waitForTimeout(600);
  const cell = page.locator('.grid-cell.level-3, .grid-cell.level-4').first();
  if (await cell.count()) {
    await cell.click();
    await page.waitForTimeout(500);
    await h.shot('shot-04.png', 'Day detail panel — tasks for a selected day, with category tagging and notes.');
    await page.keyboard.press('Escape').catch(() => {});
  }

  await h.record(
    `${h.baseUrl}`,
    async (vpage) => {
      await vpage.getByRole('tab', { name: 'Analytics' }).click();
      await vpage.waitForTimeout(1800);
      await vpage.getByRole('tab', { name: 'Goals' }).click();
      await vpage.waitForTimeout(1600);
    },
    { initScript: seedLocalStorageData }
  );
}
