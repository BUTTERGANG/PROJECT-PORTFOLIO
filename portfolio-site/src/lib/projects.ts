import { getCollection, type CollectionEntry } from 'astro:content';
import { CLUSTERS, type ClusterKey, type PillarKey } from '../data/clusters';

export type Project = CollectionEntry<'projects'>;

const TIER_RANK: Record<string, number> = { anchor: 0, advanced: 1, standard: 2 };

/** All projects, sorted anchor → advanced → standard, then alpha by title. */
export async function allProjects(): Promise<Project[]> {
  const items = await getCollection('projects');
  return items.sort((a, b) => {
    const t = TIER_RANK[a.data.tier] - TIER_RANK[b.data.tier];
    return t !== 0 ? t : a.data.project.localeCompare(b.data.project);
  });
}

/** Projects that get their own /projects/<slug> page. */
export async function fullPageProjects(): Promise<Project[]> {
  return (await allProjects()).filter((p) => p.data.tier !== 'standard');
}

export async function projectsByCluster(cluster: ClusterKey): Promise<Project[]> {
  return (await allProjects()).filter((p) => p.data.cluster === cluster);
}

export async function projectsByPillar(pillar: PillarKey): Promise<Project[]> {
  const clusterKeys = Object.values(CLUSTERS)
    .filter((c) => c.pillar === pillar)
    .map((c) => c.key);
  return (await allProjects()).filter((p) => clusterKeys.includes(p.data.cluster));
}

/**
 * Pull the Build Loop origin sentence out of the "## Origin (the Build Loop)"
 * blockquote so it can be rendered prominently outside the full markdown body.
 * Returns the inner text (markdown bold preserved) or null.
 */
export function extractOrigin(body: string): string | null {
  const sec = body.match(/##\s+Origin[^\n]*\n([\s\S]*?)(?:\n##\s|\n*$)/);
  if (!sec) return null;
  const quote = sec[1]
    .split('\n')
    .filter((l) => l.trim().startsWith('>'))
    .map((l) => l.replace(/^\s*>\s?/, ''))
    .join(' ')
    .trim();
  return quote || null;
}

/** Extract the "**One-liner:** ..." hook line. */
export function extractOneLiner(body: string): string | null {
  const m = body.match(/\*\*One-liner:\*\*\s*(.+)/);
  return m ? m[1].trim() : null;
}

/** Very small **bold** → <strong> renderer for the origin/one-liner snippets. */
export function mdBoldToHtml(s: string): string {
  const esc = s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Public GitHub URL for a project, or null. Only returns a link when the repo
 * is actually public and the `repo` field is a real `owner/name` (not the
 * `<repo>` placeholder). Private/off-repo projects never linkify.
 */
export function repoUrl(data: Project['data']): string | null {
  if (data.visibility !== 'public') return null;
  const repo = data.repo?.trim();
  if (!repo || repo.includes('<') || !repo.includes('/')) return null;
  return `https://github.com/${repo}`;
}

/** Chip descriptors for a project's status/visibility/demo. */
export function chipsFor(data: Project['data']) {
  const chips: { label: string; kind: string }[] = [];
  if (data.tier === 'anchor') chips.push({ label: '★ anchor', kind: 'accent' });
  if (data.demo_type === 'live') chips.push({ label: '🖥 live demo', kind: 'live' });
  else chips.push({ label: '📄 case study', kind: 'info' });
  if (data.visibility === 'private') chips.push({ label: '🔒 private repo', kind: 'private' });
  else if (data.visibility === 'off-repo') chips.push({ label: '🔒 off-repo', kind: 'private' });
  else chips.push({ label: 'public repo', kind: 'default' });
  if (data.status === 'prototype') chips.push({ label: 'prototype', kind: 'warn' });
  return chips;
}
