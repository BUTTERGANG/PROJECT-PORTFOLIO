// optimize-media — one-shot media optimizer for public/media/<slug>/.
//
// The capture harness (scripts/media-capture) shoots at deviceScaleFactor 2, so
// stills land at 2880px — ~4x wider than they're ever displayed (gallery cells
// are ≤380px; the lightbox tops out near 1700 physical px on a retina monitor).
// This script downscales every real image to ≤MAX_W, re-encodes as WebP, deletes
// the original PNG, and rewrites each manifest with the new filename + intrinsic
// width/height. Those dimensions let <img>/<video> reserve space and kill CLS.
//
// Videos are left as-is (already viewport-sized) but their real dimensions are
// probed via ffprobe and written into the manifest for the same aspect-ratio
// reservation. Placeholder items are untouched.
//
// Idempotent: an item already pointing at a .webp with width/height is skipped.
//
//   node scripts/optimize-media.mjs            # optimize all slugs with a manifest
//   node scripts/optimize-media.mjs mind-games # just one slug

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_ROOT = path.resolve(__dirname, '..', 'public', 'media');
const MAX_W = 1600;   // hard cap on stored image width
const QUALITY = 80;   // webp quality — visually lossless for UI screenshots

const isImage = (t) => t === 'image' || t === 'gif';

async function probeVideo(file) {
  try {
    const { stdout } = await execFileP('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height',
      '-of', 'csv=s=x:p=0', file,
    ]);
    const [w, h] = stdout.trim().split('x').map(Number);
    if (w && h) return { width: w, height: h };
  } catch {
    /* ffprobe missing or non-video — fall through */
  }
  return {};
}

async function optimizeImage(dir, item) {
  const srcPath = path.join(dir, item.file);
  const base = item.file.replace(/\.[^.]+$/, '');
  const outFile = `${base}.webp`;
  const outPath = path.join(dir, outFile);

  const img = sharp(srcPath, { animated: item.type === 'gif' });
  const meta = await img.metadata();
  const resize = meta.width > MAX_W ? { width: MAX_W } : null;

  await (resize ? img.resize(resize) : img)
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  // For animated webp, `pages` multiplies height — use pageHeight when present.
  const height = outMeta.pageHeight || outMeta.height;

  if (outFile !== item.file) await fs.rm(srcPath, { force: true });

  return { ...item, file: outFile, width: outMeta.width, height };
}

async function processSlug(slug) {
  const dir = path.join(MEDIA_ROOT, slug);
  const manifestPath = path.join(dir, 'manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  } catch {
    return { slug, skipped: 'no manifest' };
  }
  if (!Array.isArray(manifest.items)) return { slug, skipped: 'no items' };

  let changed = false;
  const items = [];
  for (const item of manifest.items) {
    const already = /\.webp$/i.test(item.file) && item.width && item.height;
    if (isImage(item.type) && !already) {
      const before = (await fs.stat(path.join(dir, item.file)).catch(() => ({ size: 0 }))).size;
      const next = await optimizeImage(dir, item);
      const after = (await fs.stat(path.join(dir, next.file))).size;
      console.log(`  ✓ ${slug}/${item.file} → ${next.file}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (${next.width}×${next.height})`);
      items.push(next);
      changed = true;
    } else if (item.type === 'video' && !(item.width && item.height)) {
      const dims = await probeVideo(path.join(dir, item.file));
      if (dims.width) { console.log(`  · ${slug}/${item.file}  video ${dims.width}×${dims.height}`); changed = true; }
      items.push({ ...item, ...dims });
    } else {
      items.push(item);
    }
  }

  if (changed) {
    manifest.items = items;
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  }
  return { slug, changed };
}

async function main() {
  const only = process.argv[2];
  const slugs = only
    ? [only]
    : (await fs.readdir(MEDIA_ROOT, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

  for (const slug of slugs) {
    const r = await processSlug(slug);
    if (r.skipped) continue;
    if (!r.changed) console.log(`  – ${slug}: already optimized`);
  }
  console.log('[optimize-media] done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
