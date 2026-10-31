// Curated LA Media photo set for the /photography/ page.
//
// Every image here was cropped/resized from the live LA Media site
// (BUTTERGANG/LA-MEDIA-WEBSITE → client/public/images) by
// scripts/build-photography.mjs and committed as WebP under
// public/photography/. `w`/`h` are the real decoded dimensions so the browser
// can reserve the box before load (no layout shift, no CLS).

export interface Photo {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface PhotoCategory {
  key: 'portraits' | 'sports' | 'weddings' | 'travel';
  label: string;
  blurb: string;
  /** The one image that represents the discipline in the carousel. */
  cover?: Photo;
  photos: Photo[];
}

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  {
    key: 'weddings',
    label: 'Weddings',
    blurb:
      'Full-day coverage — getting ready through the last dance — with the film cut alongside the stills. Coverage runs 4 to 10+ hours; 250+ edited images per wedding on an 8–10 week turnaround.',
    cover: { src: '/photography/weddings/hero.webp', alt: 'Outdoor wedding at golden hour', w: 1800, h: 1200 },
    photos: [
      { src: '/photography/weddings/w-02.webp',   alt: 'Wedding portrait',              w: 666,  h: 1000 },
      { src: '/photography/weddings/w-66.webp',   alt: 'Ceremony moment',               w: 1000, h: 666 },
      { src: '/photography/weddings/w-111.webp',  alt: 'Couple portrait',               w: 666,  h: 1000 },
      { src: '/photography/weddings/w-82.webp',   alt: 'Reception detail',              w: 1000, h: 666 },
      { src: '/photography/weddings/w-70.webp',   alt: 'Getting-ready portrait',        w: 666,  h: 1000 },
      { src: '/photography/weddings/w-0348.webp', alt: 'Wedding day candid',            w: 1000, h: 666 },
      { src: '/photography/weddings/w-134.webp',  alt: 'Detail from a wedding day',     w: 666,  h: 1000 },
      { src: '/photography/weddings/hero-portrait.webp', alt: 'Wedding day portrait',   w: 1000, h: 666 },
    ],
  },
  {
    key: 'sports',
    label: 'Sports & Powerlifting',
    blurb:
      'Meet coverage built from the inside of the sport — I compete in Olympic weightlifting, so I know the attempts worth shooting. 40+ edited photos per lifter, plus video of the lifts and a 45–60 second hype reel.',
    cover: { src: '/photography/sports/hero.webp', alt: 'Athlete mid-lift under meet lighting', w: 1500, h: 1000 },
    photos: [
      { src: '/photography/sports/aiden.webp',      alt: 'Competitor at a powerlifting meet',  w: 666,  h: 1000 },
      { src: '/photography/sports/august.webp',     alt: 'Athlete setup before an attempt',    w: 666,  h: 1000 },
      { src: '/photography/sports/jon.webp',        alt: 'Athlete during a meet attempt',      w: 666,  h: 1000 },
      { src: '/photography/sports/jennifer.webp',   alt: 'Lifter mid-attempt',                 w: 666,  h: 1000 },
      { src: '/photography/sports/karlie.webp',     alt: 'Competitor portrait at a meet',      w: 666,  h: 1000 },
      { src: '/photography/sports/sophie.webp',     alt: 'Athlete on the platform',            w: 666,  h: 1000 },
      { src: '/photography/sports/david.webp',      alt: 'Lifter under meet lights',           w: 666,  h: 1000 },
      { src: '/photography/sports/weight-room.webp',alt: 'Training session in the weight room', w: 666, h: 1000 },
      { src: '/photography/sports/gold.webp',       alt: 'Athlete celebrating a good lift',    w: 1000, h: 666 },
      { src: '/photography/sports/silver.webp',     alt: 'Competitor mid-lift',                w: 666,  h: 1000 },
    ],
  },
  {
    key: 'portraits',
    label: 'Portraits',
    blurb:
      'Sessions for headshots, seniors, couples and families — posed but never stiff. 30-minute to 2-hour sessions, every shoot delivered with an online gallery and full-resolution downloads.',
    cover: { src: '/photography/portraits/hero.webp', alt: 'Outdoor portrait session', w: 1500, h: 899 },
    photos: [
      { src: '/photography/portraits/lydia.webp',    alt: 'Portrait session — Lydia',      w: 666,  h: 1000 },
      { src: '/photography/portraits/lydia-02.webp', alt: 'Portrait session, second look',  w: 666,  h: 1000 },
      { src: '/photography/portraits/lindsey.webp',  alt: 'Portrait session — Lindsey',     w: 666,  h: 1000 },
      { src: '/photography/portraits/tomi.webp',     alt: 'Portrait session — Tomi',        w: 1000, h: 667 },
      { src: '/photography/portraits/dells.webp',    alt: 'Outdoor portrait session',       w: 1000, h: 667 },
      { src: '/photography/portraits/dells-02.webp', alt: 'Outdoor portrait, second frame', w: 1000, h: 666 },
      { src: '/photography/portraits/sara.webp',     alt: 'Portrait session — Sara',        w: 1000, h: 667 },
      { src: '/photography/portraits/kaylee.webp',   alt: 'Portrait session — Kaylee',      w: 1000, h: 667 },
    ],
  },
  {
    key: 'travel',
    label: 'Travel & Place',
    blurb:
      'The work that keeps the eye sharp between paid jobs — city, light and detail, shot on assignment and on the road.',
    cover: { src: '/photography/travel/hero.webp', alt: 'City street photographed at dusk', w: 1000, h: 1500 },
    photos: [
      { src: '/photography/travel/nyc-01.webp', alt: 'New York street scene',    w: 800, h: 1200 },
      { src: '/photography/travel/nyc-02.webp', alt: 'New York cityscape',       w: 800, h: 1200 },
      { src: '/photography/travel/nyc-04.webp', alt: 'New York architecture',    w: 800, h: 1200 },
      { src: '/photography/travel/nyc-05.webp', alt: 'New York, detail shot',    w: 800, h: 1200 },
    ],
  },
];

/** Video offering — mirrors the film deliverables on the live LA Media site. */
export const VIDEO_OFFERING = [
  {
    title: 'Wedding films',
    detail:
      'Cinematic highlight film (3–5 min), a full ceremony + reception cut on the top tier, and a 60-second highlight reel. Films are delivered 8–12 weeks out; full ceremony + reception films run up to 16 weeks depending on scope.',
    tags: ['Highlight film', 'Full ceremony + reception', '60s reel'],
  },
  {
    title: 'Sports hype reels',
    detail:
      'Video of the lifts plus a 45–60 second hype reel cut for social — the format lifters actually post. Available on the Silver and Gold meet packages.',
    tags: ['Lift video', '45–60s reel', 'Expedited delivery'],
  },
  {
    title: 'Commercial & brand',
    detail:
      'Product and brand work — including a product-photography campaign for Airwave performance mouthpieces — shot for catalog, web and paid social. Quoted per scope.',
    tags: ['Product', 'Brand campaign', 'Licensing'],
  },
];
