# Coreshift Live Edit — Kanban

> Visual build state for the core product. Edit this file and run `node tools/build.js live-edit` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colours.
>
> **🎯 Current focus: the go-live push.** The machine works and 15 sites are live; the gap to real paying customers is the launch checklist below (email delivery, live payments, legal, a decision on custom domains, and a full dress rehearsal). Design-Engine quality work continues in parallel but is not a launch blocker.

---

## ✅ Done

- **In-page editor** `shipped` — Click-to-edit text and images, rich text with links, nav/footer editors, add-pages, SEO + settings panels, theme + brand-colour switching, in-memory draft, and a sign-off gate. In real use across the live sites.
- **Section + theme engine** `shipped` — 8 section types and ~11 theme styles rendered through one shared code path used by both the editor and the edge renderer, so swapping themes never loses content.
- **Design Engine + Tailwind authoring layer** `shipped` — Sections are now authored in Tailwind v4 utilities bridged to runtime theme tokens (no preflight, so existing themes don't drift), compiled by the editor's Vite plugin and the renderer's CLI from one source. Variety is cheap and theme-swap still keeps content. Canon: the Simplicity Budget (customers pick pictures not parameters; "Ask" is the advanced mode; UI surface frozen).
- **Testimonials: 6-layout calibration** `shipped` — First engine-built section: spotlight, cards, mosaic, portrait, stacked and marquee on one content contract with zero toggles. Reviewable on the board (`?gallery=section&type=testimonials`, `?variant=<id>` to deep-link one).
- **Expressive motion** `shipped` — Micro-motion as a contract: sections expose hooks (scroll reveal, staggered card cascades, hover), each of the 11 themes carries a tuned motion personality (calm / gentle / snappy / precise / hard), and functional micro-interactions (button press, focus rings) are always on. Fast (CSS + a tiny observer), and fully off under reduced-motion. Preview with `?motion=on` on the review board.
- **Instant publish + edge renderer** `shipped` — Publishing is a DB pointer flip + edge-cache purge; one Cloudflare Worker resolves host → tenant → published content → SSR. **15 sites live and published.**
- **Contact forms → leads** `shipped` — Published forms post to a public function that resolves the recipient server-side, stores the lead, and shows it in the dashboard. Proven by real leads.
- **Telemetry** `shipped` — Page-view counting, dashboard error capture, and an editor "ask for a change" feed — all live with real data.
- **Auth + accounts** `shipped` — Google sign-in with automatic personal-account + owner-membership provisioning.
- **Trial + billing gate** `shipped` — 14-day trial from first publish; cancelled/expired sites serve a calm offline page from the renderer.
- **Billing hardened + self-serve portal** `launch` `shipped` — Stripe webhook now has a replay guard, idempotent event dedup, persists the subscription id, and handles payment-failed/succeeded. Customers get a "Manage billing" button (Stripe portal) to update card / cancel themselves. Real end-to-end sale still to be run in the rehearsal.
- **Legal & trust pages** `launch` `shipped` — Terms, Privacy (NZ Privacy Act + real sub-processors), and a plain-English Refunds policy, served at /terms, /privacy, /refunds and linked from the footer. Pending a final human/legal review.
- **Marketing site + signup funnel** `shipped` — coreshift.page carries a pasted URL through sign-in into the "bring my site" onboarding.
- **CI auto-deploy** `infra` `shipped` — Push to main deploys the dashboard, renderer, marketing, and edge functions to Cloudflare/Supabase, gated on typecheck + tests + a prod smoke test.
- **P0: content-write RPCs locked down** `security` `shipped` — `publish_site`/`save_draft`/`rollback_site`/`provision_site` now enforce owner checks and are no longer callable by `anon`. Hotfixed in prod + codified in PR #7.
- **Stored-XSS fix: URL guards + tokenizer sanitizer** `security` `shipped` — Link/image fields go through a scheme allow-list (safeUrl/safeSrc) and rich text through a parser-style sanitizer; blocks javascript: hrefs and unterminated-tag bypasses, with tests. PR #8.
- **SSRF hardening: DNS-rebinding guard** `security` `shipped` — Crawler/scorer/generator resolve the host over DNS-over-HTTPS and reject private/reserved IPs (not just the hostname string); generate-site asset fetch is guarded too. PR #9.

## 🟡 In Progress

- **Custom domains — Cloudflare for SaaS** `launch` — Decided IN for launch. Create-hostname flow + renderer resolution already exist; building the lifecycle now (status polling pending→active, remove, teardown-on-cancel, guiding UI). Needs Cloudflare-for-SaaS enabled on the zone + the CF secrets confirmed (see Blocked).
- **Email deliverability** `launch` `infra` — Postmark is wired for leads, auth, support and invites, but there is no confirmation any email has actually been delivered; it should fail loudly, not silently. Blocked on the prod-config check below.
- **Magic-link login** `auth` — Built, but has never completed a real round trip in production (depends on the Postmark auth hook above).
- **Team invites / agency linking** `auth` — Partly wired; several bindings and the invite-accept surface still need connecting and one real run-through.
- **Two-way support chat** `enhancement` — Customer → team works; the team → customer reply and the customer email notification still need to be delivered (the widget already promises "we'll email you").

## 🚫 Blocked — go-live gates (need Ricky)

- **1️⃣ Confirm email delivery in prod** `launch` `needs-ricky` — Verify the Postmark token/sender is live and a real lead / login / support email actually arrives (not just "sent"). Everything downstream depends on this — a site whose leads don't land is worthless. First domino.
- **2️⃣ Go live on Stripe: keys + webhook + one real sale** `launch` `billing` `needs-ricky` — Switch to live keys, set the `checkout.session.completed` signing secret, then run one real card through the full trial→pay path before charging anyone.
- **3️⃣ Enable Cloudflare for SaaS + confirm domain secrets** `launch` `needs-ricky` — Turn on Custom Hostnames on the coreshift.page zone, set the fallback origin to `sites.coreshift.page`, and confirm the edge secrets: `CLOUDFLARE_API_TOKEN` (cert edit scope), `CLOUDFLARE_ZONE_ID`, `CUSTOM_DOMAIN_TARGET`. Unblocks the custom-domains build.

## 🔵 This Week — launch wave (Claude can drive)

- **Reconcile live DB → migrations** `launch` `infra` — Capture the 19 prod tables + RPCs + RLS into `saas-platform/db/migrations/` so the source is the truth and a rebuild is safe before real customers depend on it.
- **Go-live dress rehearsal** `launch` — One clean end-to-end run as a brand-new customer: sign up → generate/edit a site → publish → confirm the lead email lands → hit the trial gate → pay → confirm the site stays live. Fix whatever the rehearsal surfaces.

## ⚪ Backlog

- **Design Engine — Phase B: migrate 7 sections to Tailwind** `enhancement` `post-launch` — Rebuild Hero, Feature grid, Gallery, Rich text, CTA, Team and Contact form in the new Tailwind authoring layer, retire their legacy CSS, and apply the "kill list" (fewer in-section options, more curated layouts). Then scale to new section types + theme families. Parallel quality track — not launch-blocking.
- **Site generation quality** `enhancement` `post-launch` — "Make me a site" works but runs slow and is limited to a few theme styles; speed it up, widen the theme range, sanitise generated copy/links before publish.
- **Custom-domain lifecycle** `enhancement` — Verify / retry / remove a hostname; purge cache on custom-domain go-live; tear down on cancel.
- **Account lifecycle** `enhancement` — Rename / leave / transfer-ownership / delete-account (GDPR), a co-owner / recovery path, and an access-change audit trail.
- **RLS/telemetry hardening** `security` — Tighten the `sites` anon read (tenant enumeration), disable `site-assets` bucket listing, lengthen the preview password, add view-count integrity.
- **Test coverage** `infra` — No tests yet for edge functions, RLS/multitenancy, checkout/webhook, or href sanitization.
- **Lazy-load the editor** `enhancement` — Code-split the overlay so it never ships to end-visitors on published sites.
- **Branch flow** `infra` — dev/staging are behind main; reconcile to match the local → dev → staging → main standard.
