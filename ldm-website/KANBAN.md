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
- **Lead relay — live and proven end to end** `phase-1` `shipped` — Pages Function (Turnstile + honeypot + Cloudflare Email Service). Fixed en route: the Turnstile script URL (missing `/v0/`), the send payload (plain address strings, not objects), and `reply_to` (snake_case on the REST API). Now sends from `no-reply@ldmfinance.co.nz` to sales@ldmmotor.group, re-verified end to end from the live domain after the switch (2 Aug).
- **No invented content left on the site** `phase-3` `shipped` — Removed in three passes: fabricated homepage testimonials, a fabricated testimonial on /apply, and fabricated guide authors ("Jordan Mackenzie", "Priya Sharma"). Guides are now attributed to LDM Finance itself, with `article()` referencing the Organization node and taking an optional named author so a real expert can be credited later. Verified testimonials live in one shared module so the pages cannot drift (PRs #13, #15, #19).

- **Stock feed — LIVE with real Motorcentral stock** `phase-2` `infra` `shipped` — First production push landed 24 Jul: 39 live vehicles with photos rendering across the site, replacing the sample dataset. Full loop proven — Motorcentral → SFTP on Fly.io (dedicated IPv4, port 22, after Railway's proxy couldn't bind 22) → R2 → Pages deploy hook → build. Fixed one bug the live data exposed: the feed's image sequence numbers don't always start at 1 (a vehicle can arrive with only `-2.jpg`), so vehicle cards and the homepage hero now resolve photos via `vehicleHero()` instead of assuming `-1.jpg`. A daily automated check watches subsequent pushes.

## 🟡 In Progress

_Nothing. Everything buildable is shipped; the remaining items are all waiting on the client or GP._

## 🚫 Blocked

- **Client review of the site** `phase-3` `blocked-by:client` — The site is gated behind a password so Jack can walk Logan and Louis through it before it goes public. Logan is the project lead and is UK-based, so scheduling is the constraint. The gate comes off once they have seen it and the legal sign-off lands.
- **Legal sign-off on Privacy + Terms** `phase-3` `blocked-by:client` — The client's real draft content is live on /privacy and /terms, with a visible "working draft, pending final legal review" notice. Their lawyer's review is the only thing outstanding; removing the notice is a one-line change. Jack has raised it with the client and they are aware.
- **Analytics + Search Console accounts** `phase-2` `blocked-by:gp` — GA4 property, Search Console and Bing verification, Peec AI. The on-site instrumentation is built and dormant; only the platform IDs are missing. Nichee Orocio at GP now looping in on this.
- **Keyword sign-off for the phase-2 pages** `phase-3` `blocked-by:gp` — Also gates the deferred OPPORTUNITY pages (audience hubs, model landers), which stay unbuilt until target volumes are confirmed.
- **UDC calculator** `phase-3` `blocked-by:client` — Resolved as a misunderstanding: the file supplied was UDC's *application form* iframe, not a calculator. A drafting note in the client's legal draft confirms UDC **is** building a calculator from LDM's rate inputs; not yet available. Our own calculator stays either way.

## 🔵 This Week

- **Site gated for client review** `phase-3` `infra` `shipped` — Jack asked for the site to be password protected until the client has seen it, given the financial nature of the business and the outstanding legal sign-off. A Pages middleware puts everything behind HTTP Basic Auth when `SITE_PASSWORD` is set — pages, assets, API and robots.txt — with noindex/nofollow and no-store on every response so it cannot be indexed or cached. Deliberately fail-open: with the variable absent the site is public, so going live is deleting a variable rather than a code change. Verified both directions locally and on production (PR #21/#22). Note the site was publicly reachable 2–4 Aug, so a page or two may have been crawled before gating.
- **UDC wording resolved** `phase-3` `shipped` — The client confirmed (4 Aug) that UDC's standard sentence "Finance is provided by UDC Finance Limited" is not required on a multi-lender site. Removed the "pending UDC marketing review" caveat from the shared disclaimers, the DisclaimerSlot title row on every finance page, and the compliance page intro and warning box. **Clears one of the two client blockers.**

- **Client content round 1 shipped** `phase-3` `shipped` — Everything Logan and Louis supplied on 28 Jul is live: approved LDM Finance logo pack (header + footer), both team profiles with real bios and photos, four verified BuyerScore reviews, and the real Privacy + Terms content behind a pending-legal-review notice. PRs #11, #13, #15.
- **Two live defects corrected** `phase-1` `shipped` — The site claimed LDM is "a registered financial service provider" (they hold no FSPR registration; it now describes the referral arrangement), and published a placeholder address and phone — including in the lead-relay error messages, which told customers to ring a number that is not LDM's. NAP verified against LDM's live site, the legal draft and Louis's signature. Stale specs that mandated the FSPR number were corrected too, so it cannot be rebuilt from an obsolete brief.
- **LIVE on ldmfinance.co.nz** `phase-3` `infra` `shipped` — The site now serves on its own domain, registered and managed by Coreshift, replacing the finance.ldmmotor.group subdomain so the finance site stays independent of the Motorcentral-hosted parent. Domain on the Coreshift Cloudflare account, attached to the Pages project, TLS issued, Turnstile hostname added, and ldmfinance.co.nz onboarded to Email Sending. Verified end to end: every key page 200, valid certificate, http→https 301, and canonicals, both sitemaps, robots, JSON-LD @ids, og:url, llms.txt and the products API all on the new origin (PR #17/#18). **Killed the DNS blocker outright** — no access to ldmmotor.group needed, and no migration for the client to plan.
- **All PRs merged, production current** `phase-1` `shipped` — PR #6 (analytics), #7 (client feedback), #8/#9 (live stock feed) merged to main. Production serves the current build with the client-feedback changes live (Marac naming, /terms page, UDC disclaimer wording). A Cloudflare build-queue outage (20–23 Jul) was bypassed with a direct `wrangler pages deploy`; auto-deploys have since recovered.
- **SFTP endpoint handed over; Railway retired** `phase-2` `shipped` — Endpoint moved to Fly.io (dedicated IP, port 22) after Peter confirmed Motorcentral needs standard port 22; details sent and Motorcentral's first push landed successfully. Railway SFTPGo service deleted.
- **Relay configured end to end** `phase-1` `infra` `shipped` — Turnstile widget + keys live, all Pages secrets set, R2 vars on the build env, Email Sending domain onboarded, `LEAD_TO` set to sales@ldmmotor.group. Lead delivery proven end to end (24 Jul).
- **Phase 2/3 content pages — live** `phase-2` `shipped` — 17 pages from ia.md, merged and serving: car / commercial / truck / ute / balloon-pcp hubs, fleet + machinery finance, two truck Level-C pages, five guides + the guides hub, and the calculator + commercial FAQ sub-hubs. Hub/guide/FAQ cross-links and FINANCE_PRODUCTS wired to match. Site is now 84 pages (PR #10).

## ⚪ Backlog

- **Named-expert bylines (E-E-A-T upside)** `phase-3` — Guides are attributed to LDM Finance as the organisation, which is accurate but weaker than a named expert on the E-E-A-T axis that seo-readiness §2.2 targets. If Louis or Logan will be credited as reviewers, `article()` already accepts a named author — no markup change needed. Only worth raising if the conversation comes up naturally; do not invent a person.
- **Remaining ia.md pages (deferred)** `phase-3` `blocked-by:gp` — The OPPORTUNITY pages held pending keyword-volume validation: audience hubs (/audiences/tradies, /audiences/business) and model landers (Ford Ranger, Toyota Hilux, Mercedes Sprinter). Build once GP confirms target volumes. The NEW Level B/C hubs, guides and FAQ sub-hubs are already built (see This Week).
- **/finance-eligibility + lender comparison page** `phase-3` `docs` — Machine-readable eligibility criteria and the UDC Finance vs Marac vs Avanti matrix page (seo-readiness §2.4) — no designs yet. UDC asset-category list now available in the input notes.
- **Go-live handover** `phase-4` `infra` — Recreate the Pages project on the client's Cloudflare account, Jack/LDM switch DNS, onboard Better Stack uptime + Sentinel weekly audit with primary_url.
- **Post-launch audit** `phase-4` — Full SEO/GEO/AEO audit skill against the live site before the 3-month review. Targets: SEO ≥8/10, GEO ≥8/10, AEO ≥8/10, Lighthouse mobile ≥85.
