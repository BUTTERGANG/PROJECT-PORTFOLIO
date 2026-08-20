import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Mirrors the frontmatter of the docs/*.md files exactly, so NO doc edits are
// required. `visibility` is free-form for off-repo projects
// (e.g. "off-repo (self-hosted VPS)"), so we normalize it into a clean enum.

const CLUSTERS = [
  'lifting', 'weddings', 'photo', 'deal-hunting',
  'life-admin', 'civic', 'job-search', 'infra',
] as const;

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    project: z.string(),
    repo: z.string().default(''),
    visibility: z
      .string()
      .transform((v) => {
        const s = v.toLowerCase();
        if (s.startsWith('off-repo')) return 'off-repo';
        if (s.startsWith('public')) return 'public';
        return 'private';
      })
      .pipe(z.enum(['public', 'private', 'off-repo'])),
    demo_url: z.string().default(''),
    demo_type: z.enum(['live', 'case-study-only']),
    cluster: z.enum(CLUSTERS),
    tier: z.enum(['anchor', 'advanced', 'standard']),
    status: z.enum(['live', 'prototype', 'shelved']),
  }),
});

export const collections = { projects };