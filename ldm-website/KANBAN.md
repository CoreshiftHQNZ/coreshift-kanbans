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

- **Lead relay — built, awaiting merge + config** `phase-1` `deliverable` — Pages Function (Turnstile + honeypot + Cloudflare Email Service) with real form submission, loading states and /sub-processors page, tested end to end with wrangler + browser. PR #4. Needs: merge, Turnstile keys, Email Sending domain onboarding and Pages secrets.
- **Stock feed — built, awaiting deploy** `phase-2` `infra` — Ingest converter verified against the sample feed; ldm-stock R2 bucket created; SFTPGo Railway container config + deploy guide in infra/sftpgo. Needs: railway login deploy (~10 min), R2 token + deploy hook from the dashboard, then Motorcentral pointed at the endpoint.

## 🚫 Blocked

- **UDC-approved disclaimer wording** `phase-3` `blocked-by:client` — Every finance surface carries a flagged placeholder disclaimer pending UDC sign-off. Wording lands once, in `src/lib/disclaimers.ts`.
- **FSPR number, team profiles, testimonials** `phase-3` `blocked-by:client` — Placeholder blocks are flagged in-page on /about, footer compliance panel and testimonial strips. First-party testimonials only (Brand Foundation rule).
- **Domain + UDC calculator access** `phase-3` `blocked-by:client` — finance.ldmmotor.group pending final confirmation; UDC iframe embeds as the official-quote option once the client secures access.

## 🔵 This Week

- **Merge PR #3 then PR #4, release dev → main** `phase-1` — UI/UX remediation, then the lead relay + stock feed branch stacked on it.
- **Configure the relay (Abe, ~15 min in dashboards)** `phase-1` `infra` — Create the real Turnstile widget, onboard a sender domain to Email Sending, set the Pages secrets/vars (PR #4 lists them), railway login + deploy the SFTPGo sidecar per infra/sftpgo/README.

## ⚪ Backlog

- **Build-time R2 pull + sold-vehicle pruning** `phase-2` `infra` `blocked-by:motorcentral` — The last feed piece: wired once Peter Knight confirms push semantics (wholesale replace vs incremental) and protocol. Everything either side of it is built.
- **Analytics + measurement** `phase-2` — GA4 (funnel events separating application submits from generic contact), GSC + Bing verification, IndexNow (key file already served), Peec AI tracking, Cloudflare Web Analytics. Env-driven slots already in the layout; waits on GP platform IDs.
- **Level B/C pages from ia.md** `phase-3` — Car finance, commercial vehicle, truck, ute hubs; guide articles (pre-approval, structures compared, credit score NZ); FAQ sub-hubs. Reuses the shipped template patterns.
- **/finance-eligibility + lender comparison page** `phase-3` `docs` — Machine-readable eligibility criteria and the UDC vs Heartland/Marac vs Avanti matrix page (seo-readiness §2.4) — no designs yet.
- **Go-live handover** `phase-4` `infra` — Recreate the Pages project on the client's Cloudflare account, Jack/LDM switch DNS, onboard Better Stack uptime + Sentinel weekly audit with primary_url.
- **Post-launch audit** `phase-4` — Full SEO/GEO/AEO audit skill against the live site before the 3-month review. Targets: SEO ≥8/10, GEO ≥8/10, AEO ≥8/10, Lighthouse mobile ≥85.
