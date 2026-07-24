// Sync the case-study docs from ../docs into src/content/projects/.
//
// docs/ is the single source of truth. This copies each project markdown into
// the Astro content collection, deriving `slug` from the filename. It also
// parses each doc's "What to show" section to seed a media manifest of TODO
// placeholders (public/media/<slug>/manifest.json) when none exists yet.
//
// Tolerant of a missing ../docs (e.g. on Replit where only portfolio-site/ is
// deployed): if the source dir is absent, it leaves already-committed content
// in place and exits 0 so the build still succeeds.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(ROOT, '..', 'docs');
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'projects');
const MEDIA_DIR = path.join(ROOT, 'public', 'media');

const EXCLUDE = new Set(['_TEMPLATE.md', '_INDEX.md', 'README.md']);

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

// Minimal frontmatter reader — we only need a few keys here; Astro's zod
// schema does the real validation at build time.
function readFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["']|["']$/g, '');
    out[kv[1]] = v;
  }
  return out;
}

// Pull bullet lines out of the "## What to show" section to seed shot-list TODOs.
function extractShotList(md) {
  const sec = md.match(/##\s+What to show([\s\S]*?)(?:\n##\s|\n*$)/);
  if (!sec) return [];
  const shots = [];
  for (const line of sec[1].split('\n')) {
    const b = line.match(/^\s*[-*]\s+(.*)$/);
    if (b) shots.push(b[1].replace(/\*\*/g, '').trim());
  }
  return shots;
}

async function main() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  if (!(await exists(DOCS_DIR))) {
    console.log('[sync-content] ../docs not found — using committed content as-is.');
    return;
  }

  const files = (await fs.readdir(DOCS_DIR)).filter(
    (f) => f.endsWith('.md') && !EXCLUDE.has(f) && !f.startsWith('_')
  );

  let copied = 0, manifests = 0;
  for (const file of files) {
    const src = path.join(DOCS_DIR, file);
    const md = await fs.readFile(src, 'utf8');
    const fm = readFrontmatter(md);
    const slug = file.replace(/\.md$/, '');

    // Copy the doc verbatim into the content collection.
    await fs.writeFile(path.join(CONTENT_DIR, file), md, 'utf8');
    copied++;

    // Seed a media manifest of TODO placeholders if none exists yet.
    const mediaSlugDir = path.join(MEDIA_DIR, slug);
    const manifestPath = path.join(mediaSlugDir, 'manifest.json');
    if (!(await exists(manifestPath))) {
      await fs.mkdir(mediaSlugDir, { recursive: true });
      const shots = extractShotList(md);
      const items = shots.length
        ? shots.map((caption, i) => ({
            file: `shot-${String(i + 1).padStart(2, '0')}.png`,
            caption,
            type: 'placeholder',
          }))
        : [{ file: 'shot-01.png', caption: 'Add a screenshot or GIF', type: 'placeholder' }];
      await fs.writeFile(
        manifestPath,
        JSON.stringify({ project: fm.project || slug, demo_type: fm.demo_type || '', items }, null, 2),
        'utf8'
      );

      // Per-project shot-list README so it's obvious what to capture.
      const readme =
        `# Media drop-zone — ${fm.project || slug}\n\n` +
        `Drop screenshots/GIFs/recordings here, then set each item's \`type\` in \`manifest.json\`:\n` +
        `\`image\` (.png/.jpg/.webp), \`gif\` (.gif), or \`video\` (.mp4/.webm, autoplay-muted-loop).\n\n` +
        `**demo_type:** ${fm.demo_type || 'n/a'}\n\n## Shots needed (from "What to show")\n` +
        (shots.length ? shots.map((s) => `- [ ] ${s}`).join('\n') : '- [ ] (add shots)') + '\n';
      await fs.writeFile(path.join(mediaSlugDir, 'README.md'), readme, 'utf8');
      manifests++;
    }
  }

  console.log(`[sync-content] copied ${copied} docs → src/content/projects/; seeded ${manifests} media manifests.`);
}

main().catch((e) => { console.error('[sync-content] failed:', e); process.exit(1); });
