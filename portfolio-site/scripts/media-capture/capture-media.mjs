#!/usr/bin/env node
// Portfolio media capture harness — the "Browser-in-the-Loop" pipeline, VPS edition.
//
// Antigravity captures the app its agent just built and already has running. We
// can't clone-and-capture cold: private repos need secrets, a DB, and seed data
// to reach a real screen. So this harness is deliberately URL-driven, NOT
// repo-driven — you (or Hermes) boot an app's local server however it needs
// booting, then hand this the localhost URL. Capture is decoupled from boot.
//
//   node capture-media.mjs --url http://localhost:4321 --slug moran-website
//   node capture-media.mjs --url http://localhost:3000 --slug la-media-website --no-video
//
// It emits PNG screenshots + an optional MP4 scroll/interaction recording into
// ../../public/media/<slug>/, then rewrites that slug's manifest.json so the
// site's MediaGallery flips the placeholders to real image/video tiles.
//
// Per-project shot lists live in ./shots/<slug>.mjs (see ./shots/_default.mjs
// for the shape). Missing config → the default full-page + scroll-through.

import { chromium } from 'playwright';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

// The video settles this many seconds at the top before scrolling (to clear the
// SPA's load/fade-in). We record it, then trim it off so the final clip opens
// directly on loaded content — important because the site autoplays + loops it.
const VIDEO_SETTLE_SECONDS = 2.4;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_ROOT = path.resolve(__dirname, '..', '..', 'public', 'media');
const SHOTS_DIR = path.join(__dirname, 'shots');

// ---- tiny arg parser (no dependency) --------------------------------------
function parseArgs(argv) {
  const out = { video: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') out.url = argv[++i];
    else if (a === '--slug') out.slug = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--no-video') out.video = false;
    else if (a === '--width') out.width = Number(argv[++i]);
    else if (a === '--height') out.height = Number(argv[++i]);
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

const HELP = `capture-media — URL-driven screenshot + video harness

Required:
  --url <url>        A RUNNING server to capture (e.g. http://localhost:4321).
                     Boot the app's local server yourself first; this only captures.
  --slug <slug>      Project slug — media lands in public/media/<slug>/ and its
                     manifest.json is rewritten. Must match a docs/<slug>.md.

Optional:
  --no-video         Skip the MP4 recording (screenshots only).
  --width <px>       Viewport width  (default 1440).
  --height <px>      Viewport height (default 900).
  --out <dir>        Override media root (default ../../public/media).

Per-project shot lists: ./shots/<slug>.mjs (falls back to ./shots/_default.mjs).`;

// ---- manifest rewrite ------------------------------------------------------
// After capture, regenerate <slug>/manifest.json from what was actually shot.
// Captions come from the shot list (they ARE the "what to show" narrative), so
// the manifest is fully self-describing and the placeholders disappear.
async function writeManifest(dir, slug, project, demoType, captured) {
  const manifest = {
    project,
    demo_type: demoType,
    captured_at: new Date().toISOString(),
    items: captured.map((c) => ({
      file: c.file,
      caption: c.caption || '',
      type: c.type, // 'image' | 'video'
    })),
  };
  await fs.writeFile(
    path.join(dir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );
}

// Read the prior manifest to recover project name + demo_type (seeded by
// sync-content from the doc's frontmatter) so the rewrite keeps them.
async function readPriorManifest(dir) {
  try {
    return JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'));
  } catch {
    return {};
  }
}

async function loadShots(slug) {
  const candidate = path.join(SHOTS_DIR, `${slug}.mjs`);
  const fallback = path.join(SHOTS_DIR, '_default.mjs');
  const file = (await exists(candidate)) ? candidate : fallback;
  const mod = await import(pathToFileURL(file).href);
  return { shots: mod.default, usedDefault: file === fallback };
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

// Locate the ffmpeg binary Playwright ships (used to trim the video's leading
// load/settle seconds). Scans the Playwright browser cache; null if not found.
async function locateFfmpeg() {
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH
    || path.join(process.env.HOME || '', 'Library', 'Caches', 'ms-playwright');
  try {
    for (const dir of await fs.readdir(cache)) {
      if (!dir.startsWith('ffmpeg')) continue;
      for (const name of ['ffmpeg-mac', 'ffmpeg-mac-arm64', 'ffmpeg-linux', 'ffmpeg.exe', 'ffmpeg']) {
        const p = path.join(cache, dir, name);
        if (await exists(p)) return p;
      }
    }
  } catch { /* no cache */ }
  return null;
}

// Trim the first `seconds` off a video so it opens on loaded content, not the
// blank initial page load / settle. Re-encodes (the recording's keyframes are
// sparse, so a stream copy would start on a blank frame). No-op if ffmpeg is
// missing — the untrimmed video is still fine, just opens a touch early.
async function trimLeading(ffmpeg, file, seconds) {
  if (!ffmpeg || seconds <= 0) return false;
  const tmp = file.replace(/(\.\w+)$/, '.trimmed$1');
  try {
    await execFileP(ffmpeg, [
      '-y', '-ss', String(seconds), '-i', file,
      '-c:v', 'libvpx', '-b:v', '2M', '-an', tmp,
    ]);
    await fs.rename(tmp, file);
    return true;
  } catch (e) {
    await fs.rm(tmp, { force: true }).catch(() => {});
    console.log(`  … video trim skipped (${e.message.split('\n')[0]})`);
    return false;
  }
}

// Smooth scroll to the bottom and back — the default video walk-through motion.
async function defaultScroll(pg, ms = 3000) {
  await pg.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await pg.waitForTimeout(ms);
  await pg.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await pg.waitForTimeout(1200);
}

// ---- main ------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.url || !args.slug) {
    console.log(HELP);
    process.exit(args.help ? 0 : 1);
  }

  const width = args.width || 1440;
  const height = args.height || 900;
  const mediaRoot = args.out ? path.resolve(args.out) : MEDIA_ROOT;
  const outDir = path.join(mediaRoot, args.slug);
  await fs.mkdir(outDir, { recursive: true });

  const prior = await readPriorManifest(outDir);
  const projectName = prior.project || args.slug;
  const demoType = prior.demo_type || 'live';

  const { shots, usedDefault } = await loadShots(args.slug);
  console.log(`[capture] ${args.slug} ← ${args.url}`);
  console.log(`[capture] shot list: ${usedDefault ? 'default (full-page + scroll)' : `shots/${args.slug}.mjs`}`);

  // Idempotent re-runs: clear any stale videos (Playwright writes raw
  // random-named .webm files; an interrupted prior run can leave orphans that
  // would otherwise accumulate). Screenshots overwrite by name, so only videos
  // need sweeping.
  if (args.video) {
    for (const f of await fs.readdir(outDir).catch(() => [])) {
      if (f.endsWith('.webm') || f.endsWith('.mp4')) {
        await fs.rm(path.join(outDir, f), { force: true });
      }
    }
  }

  const browser = await chromium.launch({ headless: true });

  // Health-checked navigation, reused by both the screenshot page and the video
  // page. networkidle resolves even for 5xx/error pages, so a "Service
  // Unavailable" screen would be silently captured. We refuse error pages — but
  // transient 5xx (cold starts, rate limits) are common on serverless demos, so
  // retry with backoff before giving up.
  async function healthyGoto(pg, u, opts) {
    const RETRIES = 4;
    let resp, status;
    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      resp = await pg.goto(u, { waitUntil: 'networkidle', timeout: 30_000, ...opts });
      status = resp?.status();
      if (!status || status < 400) return resp; // healthy
      if (attempt < RETRIES) {
        console.log(`  … ${u} → HTTP ${status}, retry ${attempt}/${RETRIES - 1} after backoff`);
        await pg.waitForTimeout(2000 * attempt);
      }
    }
    throw new Error(`${u} returned HTTP ${status} after ${RETRIES} attempts — refusing to capture an error page. The route may be down; re-run later.`);
  }

  // ---- STILLS: a NON-recording context, so no video captures the churn of
  // navigating between screenshots. ----
  const shotContext = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2, // retina-crisp screenshots
  });
  const page = await shotContext.newPage();

  const captured = [];
  let hadError = null;
  try {
    const helpers = {
      goto: (u = args.url, opts) => healthyGoto(page, u, opts),
      shot: async (file, caption) => {
        // Guard against error pages that returned 200 but rendered an error
        // (SPA client-side failures) — don't capture a near-empty error screen.
        const bad = await page.evaluate(() => {
          const t = (document.body?.innerText || '').trim();
          const short = t.length < 60;
          const erry = /service unavailable|internal server error|502 bad gateway|application error|something went wrong/i.test(t);
          return short && erry ? t.slice(0, 80) : null;
        });
        if (bad) {
          throw new Error(`page shows an error state ("${bad}") — refusing to capture ${file}. Re-run when the server is healthy.`);
        }
        const full = /full/i.test(file);
        await page.screenshot({ path: path.join(outDir, file), fullPage: full });
        captured.push({ file, caption, type: 'image' });
        console.log(`  ✓ png  ${file}`);
      },
      // record(url, fn?) — the ONLY thing that produces video. Opens a fresh
      // recording context at `url`, lets the SPA settle to the desktop layout
      // (avoids the mobile-first reflow flash), runs an optional interaction fn,
      // then closes → one clean, short walk-through. Called once per shot list.
      record: async (url = args.url, fn) => {
        if (!args.video) return;
        const vctx = await browser.newContext({
          viewport: { width, height },
          recordVideo: { dir: outDir, size: { width, height } }, // match viewport = no letterbox
        });
        const vpage = await vctx.newPage();
        try {
          await healthyGoto(vpage, url);
          // Settle at the top so the opening frames are the finished desktop
          // layout, not the SPA reflowing in.
          await vpage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await vpage.waitForTimeout(VIDEO_SETTLE_SECONDS * 1000); // recorded, then trimmed off post-hoc
          if (fn) await fn(vpage);
          else await defaultScroll(vpage);
        } finally {
          await vctx.close(); // finalizes the .webm
        }
      },
      page,
      baseUrl: args.url,
    };

    await shots(page, helpers);
  } catch (e) {
    hadError = e;
  }

  await shotContext.close();
  await browser.close();

  // Adopt whatever single video the recording context produced.
  if (args.video) {
    const files = await fs.readdir(outDir);
    const raw = files.find((f) => f.endsWith('.webm') || f.endsWith('.mp4'));
    if (raw) {
      // The site's <video> tag plays webm fine, so honor the real container.
      const realName = raw.endsWith('.webm') ? 'demo.webm' : 'demo.mp4';
      const finalPath = path.join(outDir, realName);
      if (raw !== realName) {
        await fs.rename(path.join(outDir, raw), finalPath);
      }
      // Trim the recorded settle seconds so the clip opens on loaded content.
      const ffmpeg = await locateFfmpeg();
      const trimmed = await trimLeading(ffmpeg, finalPath, VIDEO_SETTLE_SECONDS);
      captured.push({
        file: realName,
        caption: 'Recorded walk-through of the running app.',
        type: 'video',
      });
      console.log(`  ✓ video ${realName}${trimmed ? ' (trimmed)' : ''}`);
    }
  }

  if (captured.length === 0) {
    console.error('[capture] nothing captured — leaving manifest untouched.');
    if (hadError) throw hadError;
    process.exit(1);
  }

  await writeManifest(outDir, args.slug, projectName, demoType, captured);
  console.log(`[capture] wrote ${captured.length} item(s) + manifest.json → public/media/${args.slug}/`);

  // Screenshots come off the harness at deviceScaleFactor 2 (≈2880px) — ~4x
  // wider than they're ever shown. Hand off to the optimizer so what actually
  // ships is downscaled WebP with intrinsic dimensions baked into the manifest
  // (kills layout shift). Runs from the repo root, which owns `sharp`.
  const optimizer = path.resolve(__dirname, '..', 'optimize-media.mjs');
  try {
    const { stdout } = await execFileP('node', [optimizer, args.slug], {
      cwd: path.resolve(__dirname, '..', '..'),
    });
    process.stdout.write(stdout);
  } catch (e) {
    console.error(`[capture] NOTE: optimize-media failed — assets left at capture resolution. ${e.message}`);
  }
  if (hadError) {
    console.error(`[capture] NOTE: shot list threw after ${captured.length} capture(s):`, hadError.message);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('[capture] fatal:', e.message);
  process.exit(1);
});
