// Shot list for LA Media Website. Repo is private; this captures a LOCALLY-BOOTED
// instance (Express + local Postgres standing in for NeonDB, LOCAL_DEV_NO_SSL=true).
//
// The React client (client/) has no cart/checkout ROUTE — category pages are
// static marketing pages, and the real "pay" flow lives in the client portal's
// gallery-renewal page (Renew.tsx, $49 Stripe Checkout). Stripe isn't configured
// with a real key here, so we screenshot Renew.tsx BEFORE the "Continue to
// Checkout" click — the real UI, just not the off-app Stripe-hosted step.
//
// PRIVACY: only synthetic demo content. Seed script (server/scripts/seed-demo.ts)
// creates a fake client "Jordan Rivera" / demo.client@example.com — never real
// LA Media client data.
//
// Boot + seed, then capture:
//   cd .local-clones/la-media-website
//   (local Postgres running, server/.env has LOCAL_DEV_NO_SSL=true)
//   npm run dev                                    # → :5173 (or next free port) + :3001
//   cd server && npx ts-node scripts/seed-demo.ts   # seeds demo client once
//   # then, from portfolio-site/scripts/media-capture:
//   LA_MEDIA_EMAIL=demo.client@example.com \
//   LA_MEDIA_PASSWORD='DemoClient123!' \
//     node capture-media.mjs --url http://localhost:5173 --slug la-media-website --no-video

const EMAIL = process.env.LA_MEDIA_EMAIL || 'demo.client@example.com';
const PASSWORD = process.env.LA_MEDIA_PASSWORD || '';

export default async function (page, h) {
  const base = h.baseUrl.replace(/\/$/, '');

  // ---- PUBLIC marketing site ------------------------------------------------
  await h.goto(`${base}/`);
  await page.waitForTimeout(1200); // let hero motion/fade-ins settle
  await h.shot('shot-01.png', 'Home hero — the studio’s front door: full-bleed photography, not a "DM us" placeholder.');

  await h.goto(`${base}/weddings`);
  await page.waitForTimeout(1000);
  await h.shot('shot-02.png', 'Weddings category page — the photo-first layout (react-photo-album) presenting the offering by category.');

  // ---- CLIENT PORTAL (auth) -------------------------------------------------
  if (PASSWORD) {
    await h.goto(`${base}/portal/login`);
    await page.waitForTimeout(500);
    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await Promise.all([
      page.waitForURL((u) => /\/portal\/dashboard/.test(u.toString()), { timeout: 20_000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(1200);

    if (/\/portal\/dashboard/.test(page.url())) {
      await h.shot('shot-03.png', 'Client portal dashboard — a seeded demo client’s gallery, access countdown, and renew/view actions (Better Auth cookie session).');

      // Follow the gallery card into the renewal flow — the real $49 Stripe
      // Checkout entry point, screenshotted before the "Continue to Checkout"
      // click (Stripe isn't live-keyed in this local demo).
      const renewLink = page.locator('a[href^="/portal/renew/"]').first();
      if (await renewLink.count()) {
        await renewLink.click();
        await page.waitForTimeout(800);
        await h.shot('shot-04.png', 'Gallery renewal — the real Stripe Checkout entry point for extending a client’s 1-year gallery access.');
      }
    } else {
      console.log('  … portal login did not reach dashboard — skipping portal shots.');
    }
  } else {
    console.log('  … LA_MEDIA_PASSWORD unset — skipping client portal shots.');
  }
}
