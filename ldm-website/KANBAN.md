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
- **Lead relay — live and proven end to end** `phase-1` `shipped` — Pages Function (Turnstile + honeypot + Cloudflare Email Service): a real submission verifies Turnstile and delivers to the sales inbox, confirmed end to end (24 Jul). Fixed en route — the Turnstile script URL (missing `/v0/`), the send payload (plain address strings, not objects), and `reply_to` (snake_case on the REST API). Sends from a Coreshift Email Sending subdomain for now; `LEAD_FROM` switches to the client's domain at go-live.

- **Stock feed — LIVE with real Motorcentral stock** `phase-2` `infra` `shipped` — First production push landed 24 Jul: 39 live vehicles with photos rendering across the site, replacing the sample dataset. Full loop proven — Motorcentral → SFTP on Fly.io (dedicated IPv4, port 22, after Railway's proxy couldn't bind 22) → R2 → Pages deploy hook → build. Fixed one bug the live data exposed: the feed's image sequence numbers don't always start at 1 (a vehicle can arrive with only `-2.jpg`), so vehicle cards and the homepage hero now resolve photos via `vehicleHero()` instead of assuming `-1.jpg`. A daily automated check watches subsequent pushes.

## 🟡 In Progress

- **Point lead emails at the new domain** `phase-1` `infra` — ldmfinance.co.nz is onboarded to Cloudflare Email Sending. Last step is switching `LEAD_FROM` on the Pages project to `no-reply@ldmfinance.co.nz` and redeploying. Leads currently send from `no-reply@send.coreshifthq.com` and arrive fine, so this is polish rather than a blocker.
- **Guide author bylines** `phase-3` — Six guides are still attributed to invented authors ("Jordan Mackenzie", "Priya Sharma"), flagged in-page as placeholders. Last fabricated content on the site. Options: attribute to LDM Finance as the organisation (safe, recommended), to Louis or Logan (stronger E-E-A-T but implies they wrote it), or ask the client whether they will be credited as reviewers.

## 🚫 Blocked

- **UDC wording vs the multi-lender panel** `phase-3` `blocked-by:client` — UDC's mandatory CCCFA text says "Finance is provided by UDC Finance Limited", which is inaccurate on a panel site where the lender may be Marac or Avanti. Interim wording stays until UDC confirm what they will accept; question with Jack to put to UDC.
- **Legal sign-off on Privacy + Terms** `phase-3` `blocked-by:client` — The client's real draft content is now live on /privacy and /terms, with a visible "working draft, pending final legal review" notice. Their lawyer's review is the only thing outstanding; removing the notice is a one-line change.
- **Analytics + Search Console accounts** `phase-2` `blocked-by:gp` — GA4 property, Search Console and Bing verification, Peec AI. The on-site instrumentation is built and dormant; only the platform IDs are missing.
- **Keyword sign-off for the phase-2 pages** `phase-3` `blocked-by:gp` — Also gates the deferred OPPORTUNITY pages (audience hubs, model landers), which stay unbuilt until target volumes are confirmed.
- **UDC calculator** `phase-3` `blocked-by:client` — Resolved as a misunderstanding: the file supplied was UDC's *application form* iframe, not a calculator. A drafting note in the client's legal draft confirms UDC **is** building a calculator from LDM's rate inputs; not yet available. Our own calculator stays either way.

## 🔵 This Week

- **Client content round 1 shipped** `phase-3` `shipped` — Everything Logan and Louis supplied on 28 Jul is live: approved LDM Finance logo pack (header + footer), both team profiles with real bios and photos, four verified BuyerScore reviews, and the real Privacy + Terms content behind a pending-legal-review notice. PRs #11, #13, #15.
- **Two live defects corrected** `phase-1` `shipped` — The site claimed LDM is "a registered financial service provider" (they hold no FSPR registration; it now describes the referral arrangement), and published a placeholder address and phone — including in the lead-relay error messages, which told customers to ring a number that is not LDM's. NAP verified against LDM's live site, the legal draft and Louis's signature. Stale specs that mandated the FSPR number were corrected too, so it cannot be rebuilt from an obsolete brief.
- **LIVE on ldmfinance.co.nz** `phase-3` `infra` `shipped` — The site now serves on its own domain, registered and managed by Coreshift, replacing the finance.ldmmotor.group subdomain so the finance site stays independent of the Motorcentral-hosted parent. Domain on the Coreshift Cloudflare account, attached to the Pages project, TLS issued, Turnstile hostname added, and ldmfinance.co.nz onboarded to Email Sending. Verified end to end: every key page 200, valid certificate, http→https 301, and canonicals, both sitemaps, robots, JSON-LD @ids, og:url, llms.txt and the products API all on the new origin (PR #17/#18). **Killed the DNS blocker outright** — no access to ldmmotor.group needed, and no migration for the client to plan.
- **All PRs merged, production current** `phase-1` `shipped` — PR #6 (analytics), #7 (client feedback), #8/#9 (live stock feed) merged to main. Production serves the current build with the client-feedback changes live (Marac naming, /terms page, UDC disclaimer wording). A Cloudflare build-queue outage (20–23 Jul) was bypassed with a direct `wrangler pages deploy`; auto-deploys have since recovered.
- **Sent Peter the SFTP details; Railway retired** `phase-2` `shipped` — Endpoint moved to Fly.io (dedicated IP, port 22) after Peter confirmed Motorcentral needs standard port 22; new host + port sent, username/password unchanged. Railway SFTPGo service deleted. Awaiting Motorcentral's first push.
- **Relay configured end to end** `phase-1` `infra` `shipped` — Turnstile widget + keys live, all Pages secrets set, R2 vars on the build env, Email Sending domain onboarded, `LEAD_TO` set to sales@ldmmotor.group. Lead delivery proven end to end (24 Jul).
- **Phase 2/3 content pages — built, in PR** `phase-2` `shipped` — 17 pages from ia.md built and verified (astro check + build clean, browser-smoke-tested): car / commercial / truck / ute / balloon-pcp hubs, fleet + machinery finance, two truck Level-C pages, five guides + the guides hub, and the calculator + commercial FAQ sub-hubs. Hub/guide/FAQ cross-links and FINANCE_PRODUCTS wired to match. PR #10 into dev.

## ⚪ Backlog

- **Analytics accounts** `phase-2` `blocked-by:gp` — GA4 property, GSC + Bing verification, Peec AI, Cloudflare Web Analytics. The on-site side is done: GA4 funnel events (calculator/application/enquiry, fleet distinct) are instrumented and dormant, IndexNow key served, env-driven GA4/CF slots in the layout. Just needs the platform IDs from GP.
- **Remaining ia.md pages (deferred)** `phase-3` `blocked-by:gp` — The OPPORTUNITY pages held pending keyword-volume validation: audience hubs (/audiences/tradies, /audiences/business) and model landers (Ford Ranger, Toyota Hilux, Mercedes Sprinter). Build once GP confirms target volumes. The NEW Level B/C hubs, guides and FAQ sub-hubs are already built (see This Week).
- **/finance-eligibility + lender comparison page** `phase-3` `docs` — Machine-readable eligibility criteria and the UDC Finance vs Marac vs Avanti matrix page (seo-readiness §2.4) — no designs yet. UDC asset-category list now available in the input notes.
- **Go-live handover** `phase-4` `infra` — Recreate the Pages project on the client's Cloudflare account, Jack/LDM switch DNS, onboard Better Stack uptime + Sentinel weekly audit with primary_url.
- **Post-launch audit** `phase-4` — Full SEO/GEO/AEO audit skill against the live site before the 3-month review. Targets: SEO ≥8/10, GEO ≥8/10, AEO ≥8/10, Lighthouse mobile ≥85.
