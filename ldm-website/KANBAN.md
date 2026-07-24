# LDM Finance Website — Kanban

> Visual build state for the LDM Finance website. Edit this file and run `node tools/build.js ldm-website` from the coreshift-kanbans repo root to refresh.
>
> Card format: `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **Motorcentral sample ingest** `phase-0` `shipped` — Real DMS export unpacked: 49 vehicles with full specs and 950 photos. Curated 12-vehicle photo set derived for design and build (`data/motorcentral-sample`, `design/assets`).
- **Build specs from the DigitalArchitect report** `phase-0` `docs` `shipped` — `docs/ia.md` (information architecture, keyword mapping) and `docs/seo-readiness.md` (SEO/GEO/AEO acceptance criteria and launch gates) distilled from the July 2026 audit.
- **Design prototype + handoff bundle** `phase-0` `shipped` — All 16 templates designed in Claude Design against real inventory and exported to `design/handoff` as the source of truth for the build.
- **Astro site — 16 templates + 49 vehicle pages** `phase-1` `shipped` — Pixel-faithful implementation on Astro 7: URL-state calculator, 3-step apply wizard, filterable stock, galleries, mobile drawer. 8-angle review pass, ~30 findings fixed. PR #1 → dev → main.
- **SEO/GEO/AEO build items** `phase-1` `shipped` — Per-template JSON-LD, titles/metas in budget, canonical + hreflang, AI-crawler robots.txt, segmented sitemaps, llms.txt + llms-full.txt, /api/finance-products.json, self-hosted fonts, WebP images.
- **Cloudflare Pages project (staging on Coreshift account)** `phase-1` `infra` `shipped` — GitHub-connected: production tracks main, every branch gets a preview deploy. Node 22 pinned. Client-account move happens at go-live.
- **Production deploy verified on staging URL** `phase-1` `infra` `shipped` — dev → main merged and the site serves at https://ldm-website.pages.dev (the canonical staging address until go-live).
- **UI/UX audit + full remediation** `phase-1` `shipped` — Site run through the ui-ux-pro-max skill (docs/ui-ux-review.md): WCAG AA contrast tokens, 44px mobile touch targets, 12px caption floor, skip link, reduced-motion, table scopes, focus management, aria-live. PR #3 awaiting merge.

## 🟡 In Progress

- **Lead relay — live, email delivery pending sending domain** `phase-1` `deliverable` — Pages Function (Turnstile + honeypot + Cloudflare Email Service). Turnstile is configured and working on production (real site key live; fixed a missing `/v0/` in the widget script URL that had been blocking every submission), and the Pages secrets are set. Last step: onboard a Cloudflare Email Sending domain so `LEAD_FROM` can send — testing from a Coreshift subdomain now, switches to the client's domain at go-live once its DNS is on Cloudflare.
- **Stock feed — live, awaiting first Motorcentral push** `phase-2` `infra` — Full pipeline wired and proven end to end. Motorcentral requires standard SFTP port 22, which Railway's TCP proxy can't bind, so the SFTPGo sidecar now runs on **Fly.io** (dedicated IPv4, port 22); a test upload landed in the ldm-stock R2 bucket, R2 vars are set on the Pages build env, and the deploy-hook rule is loaded. New port-22 details drafted to Peter. The only remaining link is Motorcentral scheduling the first real push.

## 🚫 Blocked

- **UDC final disclaimer wording** `phase-3` `blocked-by:client` — Interim UDC standard wording now live site-wide (PR #7), reframed as pending UDC marketing review. Jack chasing UDC for anything more substantial. Lands once in `src/lib/disclaimers.ts`.
- **Client Privacy Policy + Terms & Conditions** `phase-3` `blocked-by:client` — /privacy and the new /terms page (PR #7) carry flagged placeholders; per Keitha, final legal wording comes from LDM (with legal advice) given the personal data collected.
- **FSPR number, team profiles, testimonials** `phase-3` `blocked-by:client` — Placeholder blocks flagged in-page on /about, footer compliance panel and testimonial strips. First-party testimonials only (Brand Foundation rule).
- **UDC calculator access** `phase-3` `blocked-by:client` — UDC iframe embeds as the official-quote option once the client secures access. Jack has asked the client.
- **Lender naming — final confirm** `phase-3` `blocked-by:client` — Applied Jack's steer (PR #7): "Marac" not "Heartland Bank (Marac)", dropped "(preferred)". Awaiting his formal confirmation; trivial to adjust a label.

## 🔵 This Week

- **Domain confirmed** `phase-3` `shipped` — Client confirmed finance.ldmmotor.group (Jack, 20 Jul). DNS + hosting access being chased for go-live.
- **All PRs merged, production current** `phase-1` `shipped` — PR #6 (analytics), #7 (client feedback), #8/#9 (live stock feed) merged to main. Production serves the current build with the client-feedback changes live (Marac naming, /terms page, UDC disclaimer wording). A Cloudflare build-queue outage (20–23 Jul) was bypassed with a direct `wrangler pages deploy`; auto-deploys have since recovered.
- **Send Peter the SFTP host/port** `phase-2` — Peter confirmed Motorcentral needs standard port 22, so the endpoint moved to Fly.io (dedicated IP, port 22). Reply with the new host + port drafted; username/password unchanged. Retire the Railway service once Peter confirms the first push.
- **Configure the relay (Abe, dashboards)** `phase-1` `infra` — Done: Turnstile widget + keys live, all Pages secrets set, R2 vars on the build env, SFTPGo redeployed to Fly.io on port 22. Remaining: onboard a Cloudflare Email Sending domain so lead emails actually send (Coreshift subdomain for now, the client's domain at go-live).

## ⚪ Backlog

- **Analytics accounts** `phase-2` `blocked-by:gp` — GA4 property, GSC + Bing verification, Peec AI, Cloudflare Web Analytics. The on-site side is done: GA4 funnel events (calculator/application/enquiry, fleet distinct) are instrumented and dormant, IndexNow key served, env-driven GA4/CF slots in the layout. Just needs the platform IDs from GP.
- **Level B/C pages from ia.md** `phase-3` — Car finance, commercial vehicle, truck, ute hubs; guide articles (pre-approval, structures compared, credit score NZ); FAQ sub-hubs. Reuses the shipped template patterns.
- **/finance-eligibility + lender comparison page** `phase-3` `docs` — Machine-readable eligibility criteria and the UDC Finance vs Marac vs Avanti matrix page (seo-readiness §2.4) — no designs yet. UDC asset-category list now available in the input notes.
- **Go-live handover** `phase-4` `infra` — Recreate the Pages project on the client's Cloudflare account, Jack/LDM switch DNS, onboard Better Stack uptime + Sentinel weekly audit with primary_url.
- **Post-launch audit** `phase-4` — Full SEO/GEO/AEO audit skill against the live site before the 3-month review. Targets: SEO ≥8/10, GEO ≥8/10, AEO ≥8/10, Lighthouse mobile ≥85.
