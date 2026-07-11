# Coreshift Live Edit — Kanban

> Visual build state for the core product. Edit this file and run `node tools/build.js live-edit` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colours.

---

## ✅ Done

- **In-page editor** `shipped` — Click-to-edit text and images, rich text with links, nav/footer editors, add-pages, SEO + settings panels, theme + brand-colour switching, in-memory draft, and a sign-off gate. In real use across the live sites.
- **Section + theme engine** `shipped` — 7 section types and ~10 theme styles rendered through one shared code path used by both the editor and the edge renderer, so swapping themes never loses content.
- **Instant publish + edge renderer** `shipped` — Publishing is a DB pointer flip + edge-cache purge; one Cloudflare Worker resolves host → tenant → published content → SSR. **15 sites live and published.**
- **Contact forms → leads** `shipped` — Published forms post to a public function that resolves the recipient server-side, stores the lead, and shows it in the dashboard. Proven by real leads.
- **Telemetry** `shipped` — Page-view counting, dashboard error capture, and an editor "ask for a change" feed — all live with real data.
- **Auth + accounts** `shipped` — Google sign-in with automatic personal-account + owner-membership provisioning.
- **Trial + billing gate** `shipped` — 14-day trial from first publish; cancelled/expired sites serve a calm offline page from the renderer.
- **Marketing site + signup funnel** `shipped` — coreshift.page carries a pasted URL through sign-in into the "bring my site" onboarding.
- **CI auto-deploy** `infra` `shipped` — Push to main deploys the dashboard, renderer, marketing, and edge functions to Cloudflare/Supabase, gated on typecheck + tests + a prod smoke test.
- **P0: content-write RPCs locked down** `security` `shipped` — `publish_site`/`save_draft`/`rollback_site`/`provision_site` now enforce owner checks and are no longer callable by `anon`. Hotfixed in prod + codified in PR #7.

## 🟡 In Progress

- **Billing end-to-end** `billing` — Every path is built and deployed, but no real payment has gone through Stripe in prod yet; the webhook also needs replay/idempotency guards and to persist the subscription id.
- **Email deliverability** `infra` — Postmark is wired for leads, auth, support and invites, but there is no confirmation any email has actually been delivered; it should fail loudly, not silently.
- **Magic-link login** `auth` — Built, but has never completed a real round trip in production (depends on the Postmark auth hook above).
- **Site generation quality** `enhancement` — "Make me a site" works, but it runs slow, is currently limited to a small set of theme styles, and generated copy/links need sanitising before publish.
- **Team invites / agency linking** `auth` — Partly wired; several bindings and the invite-accept surface still need connecting and one real run-through.
- **Two-way support chat** `enhancement` — Customer → team works; the team → customer reply and the customer email notification still need to be delivered (the widget already promises "we'll email you").
- **Stored-XSS hardening** `security` — Add an href allow-list on links + a parser-based rich-text sanitizer shared by the browser and the Worker.
- **SSRF hardening** `security` — Resolve DNS and re-check the resolved IP before the crawler/scorer fetch a user-supplied URL.

## 🚫 Blocked

- **Confirm Postmark is configured in prod** `needs-ricky` — Until the token is verified set, every lead / auth / support / invite email may be silently failing.
- **Stripe webhook secret + one test-card sale** `billing` `needs-ricky` — Confirm the `checkout.session.completed` endpoint + signing secret for coreshift-sites, then run one real test payment before charging customers.
- **Custom domains: decide the path** `needs-ricky` — Customers can connect a domain but nothing activates it. Either finish activation (Cloudflare for SaaS ownership/SSL) or stop advertising it until it works.

## 🔵 This Week

- **Ship the stored-XSS fix** `security` — `safeHref()` on all links + swap the regex sanitizer for a real parser; add a `javascript:` href test.
- **SSRF DNS-resolve guard** `security` — Apply to crawl-site, score-site, and generate-site's asset fetch, on every redirect hop.
- **Webhook robustness + payment-failed handling** `billing` — Timestamp/replay guard, event dedup, persist `stripe_subscription_id`, handle `invoice.payment_failed`.
- **Reconcile live DB → migrations** `infra` — The core tables and RPCs exist only in the prod DB; capture them into `saas-platform/db/migrations/` so source is the truth and a rebuild is safe.

## ⚪ Backlog

- **Self-serve billing portal** `billing` — Cancel / update card / view invoices (Stripe portal helper already exists, just unwired) + dunning on failed payments.
- **Custom-domain lifecycle** `enhancement` — Verify / retry / remove a hostname; purge cache on custom-domain go-live; tear down on cancel.
- **Account lifecycle** `enhancement` — Rename / leave / transfer-ownership / delete-account (GDPR), a co-owner / recovery path, and an access-change audit trail.
- **RLS/telemetry hardening** `security` — Tighten the `sites` anon read (tenant enumeration), disable `site-assets` bucket listing, lengthen the preview password, add view-count integrity.
- **Test coverage** `infra` — No tests yet for edge functions, RLS/multitenancy, checkout/webhook, or href sanitization.
- **Lazy-load the editor** `enhancement` — Code-split the overlay so it never ships to end-visitors on published sites.
- **Branch flow** `infra` — dev/staging are behind main; reconcile to match the local → dev → staging → main standard.
