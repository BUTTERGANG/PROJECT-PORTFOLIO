// The 8 origin clusters (the Build Loop grouping). Each maps to a narrative
// pillar and carries display metadata. Order here defines display order.

export type ClusterKey =
  | 'lifting' | 'weddings' | 'photo' | 'deal-hunting'
  | 'life-admin' | 'civic' | 'job-search' | 'infra';

export type PillarKey = 'live' | 'builder' | 'business' | 'next';

export interface Cluster {
  key: ClusterKey;
  label: string;
  blurb: string;      // the "life that spawned these" one-liner
  pillar: PillarKey;
  order: number;
}

export const CLUSTERS: Record<ClusterKey, Cluster> = {
  lifting: {
    key: 'lifting',
    label: 'Weightlifting & Coaching',
    blurb: 'I compete in Olympic weightlifting — the domain expertise became the software’s moat.',
    pillar: 'builder',
    order: 1,
  },
  weddings: {
    key: 'weddings',
    label: 'Weddings & DJ Work',
    blurb: 'The events came first. The software came from running them.',
    pillar: 'builder',
    order: 2,
  },
  photo: {
    key: 'photo',
    label: 'Photography & LA Media',
    blurb: 'Built to make the photo business run — several are literally LA Media internal tools.',
    pillar: 'builder',
    order: 3,
  },
  'deal-hunting': {
    key: 'deal-hunting',
    label: 'Deal-Hunting & Scraping',
    blurb: 'I resell and hunt deals. Every one turns “is this a good price?” into a built answer.',
    pillar: 'builder',
    order: 4,
  },
  'life-admin': {
    key: 'life-admin',
    label: 'Life Admin',
    blurb: 'The most literal form of the loop — my own life was the client.',
    pillar: 'builder',
    order: 5,
  },
  civic: {
    key: 'civic',
    label: 'Civic & Community',
    blurb: 'Scattered public data, pulled into one place worth looking at.',
    pillar: 'builder',
    order: 6,
  },
  infra: {
    key: 'infra',
    label: 'Infrastructure & Security',
    blurb: 'Builder means infrastructure too — self-hosted systems and security R&D, debugged at the OS level.',
    pillar: 'builder',
    order: 7,
  },
  'job-search': {
    key: 'job-search',
    label: 'The Job Search Itself',
    blurb: 'The thesis applied to itself: I built the tool for this exact search.',
    pillar: 'next',
    order: 8,
  },
};

export const clusterList = (): Cluster[] =>
  Object.values(CLUSTERS).sort((a, b) => a.order - b.order);
