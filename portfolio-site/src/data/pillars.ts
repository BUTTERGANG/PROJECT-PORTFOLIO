// The 4 narrative pillars — the arc the site reads top-to-bottom.
// Nav order = this order (Live → Builder → Business → Next), never alphabetical.

import type { PillarKey } from './clusters';

export interface Pillar {
  key: PillarKey;
  num: number;
  slug: string;
  label: string;
  tagline: string;      // the "quote" that defines the pillar
  teaser: string;       // homepage 2–3 line teaser
  order: number;
}

export const PILLARS: Pillar[] = [
  {
    key: 'live',
    num: 1,
    slug: '/live-execution/',
    label: 'Live Execution',
    tagline: 'Performs under pressure, in real time, with people watching.',
    teaser:
      '120+ weddings and events as a DJ/MC — 90%+ NPS, Rookie of the Year, #1 DJ Q3 2025. Built on a decade of operations at scale: Amazon logistics, multi-event coordination. Zero do-overs, every time.',
    order: 1,
  },
  {
    key: 'builder',
    num: 2,
    slug: '/builder/',
    label: 'Builder',
    tagline: 'Builds the tool nobody else was going to build for him.',
    teaser:
      'Self-taught, all of it shipped — a competition simulator on 7,000 records, Vision-AI PWAs that read contracts off a photo, resilient data pipelines with real-browser automation, a real-money trading bot with a risk manager. Grouped by the life that spawned each one.',
    order: 2,
  },
  {
    key: 'business',
    num: 3,
    slug: '/business/',
    label: 'Business Growth',
    tagline: 'Turned a favor-based side hustle into a real commercial operation.',
    teaser:
      'LA Media: photo/video moving into B2B commercial, with tiered packages, a cold-outreach engine fed by a 25,000-business dataset, and an 8-tab operating system underneath it.',
    order: 3,
  },
  {
    key: 'next',
    num: 4,
    slug: '/next-chapter/',
    label: 'Where It’s Heading',
    tagline: 'Same operator mindset, next chapter.',
    teaser:
      'Operations and AGM roles that use this exact execution-plus-systems profile. And the proof: I built my own AI-ranked job-hunting dashboard to run this search.',
    order: 4,
  },
];

export const pillarBySlug = (slug: string) => PILLARS.find((p) => p.slug === slug);
export const pillarByKey = (key: PillarKey) => PILLARS.find((p) => p.key === key);
