# KeyContent — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js keycontent` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## ✅ Done

- **Full auth (Supabase)** `phase-0` `shipped` — Email + magic-link authentication with multi-agency role-based access.
- **AI job creation + generation pipeline** `phase-0` `shipped` — Blog, social video, and social image job types from brief to generated output.
- **Social account connect (Zernio)** `phase-0` `shipped` — Agency clients connect their social accounts via the Zernio / Late.dev integration.
- **Calendar scheduling** `phase-1` `shipped` — Full calendar view for scheduling and managing social posts across clients.
- **Quick Post composer** `phase-1` `shipped` — Standalone composer for posting directly without a full job workflow.
- **Client review portal** `phase-1` `shipped` — Shareable links let clients review and approve content without logging in.
- **Agency + client management** `phase-1` `shipped` — Multi-agency, multi-client architecture with invite flows and role management.
- **Publish-to-social via Zernio** `phase-1` `shipped` — Compose, schedule, and publish to connected social accounts through the Zernio API.
- **Sentry error tracking** `phase-2` `shipped` — Frontend, backend, and edge function error capture; release tracking; catch-block discipline across all 138 route sites.
- **Postmark transactional email** `phase-2` `shipped` — `hello@keycontent.ai` verified; transactional emails for auth flows and ops notifications.
- **Report-issue Edge Function + bug_reports table** `phase-2` `shipped` — In-app floating widget (Bug / Suggestion / Question) persists reports to Supabase and fires operator + user-ack emails via Postmark.
- **PR review standards doc** `phase-2` `shipped` — `docs/standards/pr-reviews.md` in repo; two-phase review (pre-merge description + post-merge staging verification).
- **W5 in-repo docs** `phase-2` `shipped` — `priority.md`, `incidents.md`, and `OPERATOR.md` published in keycontent-app.
- **Client-outcomes endpoint for Sentinel** `phase-3` `ops` `shipped` — `GET /api/client-outcomes` reports per-client job rollups so Sentinel's outcome watch spots repeat generation failures instead of waiting for a client to complain. Deployed to prod 2026-08-03 (PRs #262/#263/#264) and **live** — token set, `keycontent` added to Sentinel's `OUTCOME_WATCH_TARGETS`, first sweep wrote 3 client rows.
- **Stalled-job detection (`oldestRunningAt`)** `phase-3` `ops` `shipped` — Reports the oldest in-flight job so Sentinel can escalate work that **hangs** rather than fails (PRs #265 → #266 → #267). A stuck job never errors and never completes, so nothing emailed anyone. Immediately surfaced a job wedged in `generating` since **2026-03-23** for Kepner-Tregoe ANZ — ~4 months, hidden behind newer successful jobs. Follow-up fix (#268 → #269 → #270) exempts in-flight work from the 60-day window, which had been filtering current state and hiding long stalls. **Open item: that Kepner-Tregoe job still needs resuming or failing** — detection doesn't clear it.

## 🟡 In Progress

_None actively in flight right now._

## 🚫 Blocked

_None._

## 🔵 This Week

- **Client reactivation UI** `phase-3` `feature` — No UI exists to reactivate a soft-deleted client. Backend `PATCH /api/clients/:id` with `isActive: true` already works. Needs: "Show inactive" toggle in the clients list + Reactivate button per inactive row.

## ⚪ Backlog

- **bug_reports migration to prod** `phase-3` `ops` — Migration applied to staging only. Needs 24h soak confirmation then promotion to KC prod.
- **ZERNIO_WEBHOOK_SECRET in prod env** `phase-3` `ops` — Env var is missing from the Railway production environment. Required for Zernio webhook signature verification.
- **Standalone composer improvements** `phase-3` `feature` — UX polish and workflow improvements to the Quick Post composer based on early usage.
- **PR #22 redesign** `phase-3` `design` — Open PR with a visual redesign. Currently unscheduled and unmentioned in the active brief — needs operator review to prioritise or close.
- **Sentinel V1 scaffold for KC** `ops` `low-priority` — Sentinel tracks KC bug reports and social token health in production. Pre-flight checklist for onboarding any second app not yet done.
- **Quarterly free-tier usage check** `recurring` — Sentry / Postmark / Better Stack / Railway against plan limits.
- **Quarterly stale-issue prune** `recurring` — Close aged P3s and stale GitHub issues.
