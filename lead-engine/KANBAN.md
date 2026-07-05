# Lead Engine — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js lead-engine` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## ✅ Done

- **M1: Workspace auth + roles** `phase-1` `shipped` — Migration `0001`. Coreshift **agency account** created; `team_roles` (admin/sales/reviewer) separate from site roles; `my_team_role()`, `ensure_coreshift_membership()` domain auto-join, `set_team_role()`. Wired into the app auth bootstrap. (Discovery found `is_app_admin()` already grants `@coreshifthq.com` — so login already worked; this added role granularity + the pipeline tenant.) PR #1.
- **M2: Prospects pipeline + CRM board** `phase-2` `shipped` — Migration `0002`. `prospects` table (all later-milestone columns up-front), 13-stage machine as 5 lanes, RLS by agency, `create_prospect` / `prospect_set_stage` / `prospect_convert_to_customer`. `PipelineView` board with score bars, stage control, review notes. Role-aware (Russ → focused sales view). PR #2.
- **M3: Scoring engine** `phase-3` `shipped` — `score-site` edge function scores the 7-check rubric (max 98, qualify ≥50); deterministic mobile/HTTPS/outdated/stale/analytics + heuristic images/broken-links + `needs_vision` hints. **Verified live**: stripe.com→8, neverssl.com→74. Score/Re-score button per card. PR #3.
- **M4: On-call sale (Stripe, card-once)** `phase-4` `shipped` — `create-sale-checkout` (one-off fee + `setup_future_usage` saves the card + Postmark pay link), webhook converts prospect→customer account, `start-subscription` begins $100/mo off-session at go-live. "💳 Make the sale" box for Russ. Stripe secrets confirmed present. PR #4.
- **M5: Discovery · outreach · preview · booking** `phase-5` `shipped` — Migrations `0003`/`0004`. `discover-leads` (Google Places), `send-invitation` (warm copy + book/preview CTAs + 0800 + UEMA unsubscribe + suppression), `unsubscribe`, password-token `PreviewGate` (auto-unlock via `?t=`), admin Settings & Discover panel. PR #5.
- **Discovery + reuse audit** `phase-0` `shipped` — ~60% already built (crawl-site, generate-site, Stripe, Postmark, agency model). v1 scope + sale model locked.

## 🟡 In Progress

- **End-to-end verification pass** `verify` — Backends are deployed + probe-tested; the full happy path (sign in as Coreshift → discover/score → generate → review → invite → book → sale → go-live) needs one walk-through with a real session + Stripe **test card**.

## 🚫 Blocked

- **`GOOGLE_PLACES_API_KEY`** `phase-5` `needs-ricky` — Set this Supabase function secret to switch on auto-discovery. `discover-leads` is deployed and returns "not configured" until then.
- **Russ's Google Calendar (booking auto-create)** `phase-5` `needs-ricky` — Link-based booking works today via Settings → Booking link. Auto-creating the 15-min Meet with the preview URL in the notes needs Russ's Google OAuth.
- **Stripe test-mode dry run + webhook endpoint** `phase-4` `needs-ricky` — Confirm `STRIPE_WEBHOOK_SECRET` + a `checkout.session.completed` endpoint are wired for coreshift-sites, then run one test-card sale before first real use.

## 🔵 This Week

- **Set Russ to `sales`** `phase-1` `needs-ricky` — Once Russ signs in once: `select set_team_role('<russ>@coreshifthq.com','sales');`
- **Fill Settings** `phase-5` — In Lead Engine → Settings & discover: booking link, 0800 number, from-name, reply-to.
- **Deploy the edge functions + app** `infra` — 5 new edge functions are deployed to prod already via MCP; deploy the updated `coreshift-app` (Cloudflare) so the Lead Engine UI is live for the team.
- **Trust video** `phase-5` `needs-ricky` — Record the short "how/why we built this for you" video for the preview page.

## ⚪ Backlog

- **Vision pass for images/outdated** `enhancement` — Use a screenshot + vision model where `score-site` emits `needs_vision` to sharpen the fuzzy checks.
- **Renderer-level preview gate** `enhancement` — Move the client-facing password gate into the Cloudflare renderer so the gated preview is the real rendered `coreshift.page` site, not the in-app editor view.
- **SMS pay link** `enhancement` — Add an SMS provider (e.g. Twilio) so Russ can text the pay link as well as email it.
- **Site-gen theme/template tagging** `enhancement` — Tag themes/templates/sections so `generate-site` auto-selects the best fit instead of pure LLM inference.
- **Branch flow for coreshift-live-edit** `infra` — Repo has only `main`; add `dev`/`staging` to match the Coreshift standard.
