# Coreshift Privacy & Security — Kanban

> Cross-cutting program board. Edit this file and run `node tools/build.js privacy-security` from the coreshift-kanbans repo root to refresh.
>
> Card format: `- **Title** \`tag\` \`tag\` — Description.`
>
> The strategy doc (SECURITY-PRIVACY-PLAN.md) and the meeting brief (PRIVACY-SECURITY-MEETING-BRIEF.md) are kept local in `Sentinel/playbook/` since they list live findings. This board is the operational view.

---

## ✅ Done

- **Privacy & security plan kickoff** `phase-A` `meta` `shipped` — `Sentinel/playbook/SECURITY-PRIVACY-PLAN.md` published 2026-05-29 with phased plan (A: quick wins; B: foundation; C: Sentinel briefs 14-18; D: trigger-gated compliance). Operator forks listed inside the doc.
- **Phase A1: KC `bug_reports_set_updated_at` search_path hardened** `phase-A` `security` `shipped` — `ALTER FUNCTION public.bug_reports_set_updated_at() SET search_path = ''`. Closes [Supabase advisor Lint 0011](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable). Migration through dev→staging→main + applied to prod via `execute_sql` + `schema_migrations` stamped.
- **Phase A2: Sentinel `maintenance_set_updated_at` search_path hardened** `phase-A` `security` `shipped` — Same fix on Sentinel prod. Closes Lint 0011 there.
- **Phase A3: Sentinel `rls_auto_enable()` PUBLIC EXECUTE revoked** `phase-A` `security` `shipped` — Pre-flight verified: SECURITY DEFINER event-trigger function exposed to anon + authenticated via PostgREST `/rest/v1/rpc/`. `REVOKE EXECUTE ... FROM PUBLIC` — safe because event triggers fire via engine, bypassing routine_privileges. Closes Lints [0028](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) + [0029](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- **Phase A4: clean advisor baseline established** `phase-A` `audit` `shipped` — `get_advisors(security)` returns `lints: []` on both KC prod (`keycontent-v2`) and Sentinel prod. HOW-WE-DO-SECURITY.md "Current findings snapshot" refreshed to the new zero-findings baseline.
- **Phase A5: bug_reports end-to-end data flow documented** `phase-A` `privacy` `docs` `shipped` — `Sentinel/playbook/data-flows/bug_reports.md` published. ASCII diagram + table of every field, sub-processor (region + retention), RLS posture, 8 identified privacy gaps. Template for the next ones (social_accounts, clients, jobs).
- **Phase A6: KC privacy notice + cookies audited** `phase-A` `privacy` `audit` `shipped` — `Sentinel/playbook/audits/2026-05-29-kc-privacy-notice.md`. Headline: KC app has NO published privacy notice, ToS, consent prompt, or cookie banner — but also no analytics/tracking SDKs. Cookies/storage are operational only.
- **Coreshift T&Cs reviewed for Privacy Act 2020 coverage** `phase-A` `privacy` `audit` `shipped` — Verified the Type 3 Platform Subscription Agreement template covers Privacy Act 2020 (clause 7), notifiable breach under Part 6 (clause 7.4), data exit (clause 12, 60-day Export Window), Sentinel named (clause 8), customer data ownership (clause 5.4), sub-processor framework (Annexure 2 placeholder). **Insight:** the privacy gap is NOT contract-layer — it's end-user-facing notice on the app.
- **Public privacy/ToS hosting probed** `phase-A` `privacy` `audit` `shipped` — Confirmed: nothing published at `coreshifthq.com` or `keycontent.ai` (both SPAs catch-all to 1.7-1.9KB shells). B8b is "publish new," not "link existing."
- **Phase B1: data inventory** `phase-B` `privacy` `foundation` `shipped` — `Sentinel/playbook/data-flows/DATA-INVENTORY.md`. Classification scheme + all 30 KC tables + 2 Storage buckets (job-assets 935 objects, bug-report-screenshots 1) + 3 Sentinel tables + 7 sub-processor stub apps + 12 identified gaps.
- **Phase B7: sub-processor inventory** `phase-B` `privacy` `foundation` `shipped` — `Sentinel/playbook/data-flows/SUB-PROCESSORS.md`. 18 third parties classified with jurisdiction, data class, retention, DPA status, per-app applicability matrix. **🚨 P1 finding: Kling (Chinese video AI) is an active KC sub-processor — IPP 12 overseas-transfer concern.**
- **Phase B2: retention policy** `phase-B` `privacy` `docs` `shipped` — `Sentinel/playbook/HOW-WE-DO-RETENTION.md`. Per-class retention rules. Privacy Act 2020 IPP 9 aligned.
- **Phase B3: deletion path doc** `phase-B` `privacy` `docs` `shipped` — `Sentinel/playbook/HOW-WE-DO-DATA-DELETION.md`. Three scenarios (IPP 7 request 30d SLA · agency Type-3 closure 60d Export Window · retention expiry). Cascade map for every KC table. Four scripts scoped.
- **Phase B4: breach response plan** `phase-B` `security` `docs` `shipped` — `Sentinel/playbook/HOW-WE-DO-BREACH-RESPONSE.md`. Privacy Act 2020 Part 6 aligned: detect → contain → assess → notify. OPC + affected-individual notification templates. Three rehearsed scenarios from real KC incidents.
- **Phase B5: threat models (KC + Sentinel)** `phase-B` `security` `docs` `shipped` — `Sentinel/playbook/threat-models/keycontent.md` + `sentinel.md`. Top 8 threats each, ranked, mitigations + residual risk. KC top: **T3 cross-agency data leak via missing scope filter**. Sentinel top: **T1 Sentinel-as-cross-app trust-anchor**.
- **Phase B8b: KC privacy notice (draft v1)** `phase-B` `privacy` `docs` `shipped` — `Sentinel/playbook/drafts/PRIVACY-NOTICE-KC-DRAFT.md`. 12 sections, NZ Privacy Act 2020 framing only, all 18 sub-processors disclosed. Blocked on Kling decision + 7 vendor verifications + `/privacy` route + footer link + signup consent.
- **Phase A4 follow-up: schema_migrations drift cleanup** `infra` `audit-followup` `shipped` — Backfilled 2 missing rows on Sentinel prod `supabase_migrations.schema_migrations`. Future `supabase db push` won't trip.
- **Brief 18 — Sentry heartbeat shipped to prod** `phase-C` `briefs` `observability` `shipped` — Endpoints on both apps + Sentinel scheduler + `sentry_heartbeat_pings` table on Sentinel prod. Safe-by-default until SENTRY_HEARTBEAT_TOKEN is set in Railway. Closes the 2026-05-22 Sentry env-var drift incident class. **Operator activation Tuesday.**
- **Phase B3 retention sweep scripts shipped to prod** `phase-B` `privacy` `code` `shipped` — `script/retention-sweep-{daily,monthly}.ts` in keycontent-app. Dry-run by default; `--confirm` to delete. TTL: review_tokens, team_invitations, social_connect_tokens. Anonymise: bug_reports past 24m. Delete: webhook_events + audit_logs past 6m. **Operator activation: dry-run on staging, then confirm-run, then schedule.**
- **Phase B9 — OWASP ZAP DAST CI shipped to prod** `phase-B` `security` `pen-testing` `shipped` — `.github/workflows/zap-baseline.yml` on KC + Sentinel. Weekly Sunday 11pm UTC + `workflow_dispatch`. V1 informational only; findings post to rolling GitHub Issue. **First real pen-testing motion for Coreshift.** First scheduled run next Sunday.
- **Meeting brief** `phase-B` `ops` `docs` `shipped` — `Sentinel/playbook/PRIVACY-SECURITY-MEETING-BRIEF.md` — operator-ready single doc for team review. TL;DR + before/after + 9-item risk register + state-table + decisions needed + stock answers to common questions.

## 🟡 In Progress

_None — Phase B foundation complete + autonomous weekend shipments through main. Awaiting operator on Tuesday-activation items + Kling decision._

## 🚫 Blocked

- **Phase B8b: end-user privacy notice (publish)** `phase-B` `privacy` `blocked-by:kling+verifications` — Draft v1 ready (see Done). Blocked on: (1) Kling decision (drop vs. disclose); (2) 7 vendor verifications (Postmark TTL, Sentry region, OpenAI no-train opt-out, Gemini tier, Zernio DPA, repo-private call, plus operator email confirmation); (3) `/privacy` route + footer link + signup consent checkbox in KC app.
- **Annexure 2 fill on Type 3 agreement** `phase-B` `privacy` `blocked-by:verifications` — SUB-PROCESSORS.md is ready to copy into Annexure 2 once Kling decision + DPA confirmations close.

## 🔵 This Week

- **🚨 Kling sub-processor decision** `phase-B` `privacy` `P1-finding` — KC's `ai_providers` table lists Kling (Kuaishou, China) for video generation. Privacy Act 2020 IPP 12 overseas-transfer concern — PRC has no comparable privacy regime. Three options: **(a)** drop Kling, route all video through Veo (already wired and in active use; ~half-day removal); **(b)** keep Kling, gate behind explicit user authorisation in privacy notice; **(c)** accept the IPP 12 risk with an explicit policy memo. **Recommendation: (a).** Blocks Annexure 2 fill + B8b publish.
- **Brief 18 activation — operator adds env vars** `phase-C` `ops` — Set `SENTRY_HEARTBEAT_TOKEN` (any opaque string, same in both apps) in Railway prod + staging for KC and Sentinel. Optional: `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` in Sentinel only to enable Sentry-API verification of pings. ~5 min total.
- **B3 retention sweeps — first dry-run on staging** `phase-B` `ops` — `railway run --service keycontent-app -e staging -- npx tsx script/retention-sweep-daily.ts` (and `monthly`). Verify counts. Then `--confirm` on staging. Then first prod run. ~15 min.
- **B9 ZAP — manual first run** `phase-B` `ops` — Trigger `zap-baseline.yml` once via `workflow_dispatch` on KC and Sentinel to get the first baseline report before next Sunday's auto-run. ~2 min.
- **7 vendor verifications** `phase-B` `ops` — Postmark plan TTL · Sentry org region · OpenAI no-train opt-out · Gemini paid-tier · Zernio DPA + jurisdiction + retention · `keycontent-app` repo-private decision · `hello@coreshifthq.com` address confirm. From SUB-PROCESSORS.md action items.

## ⚪ Backlog

- **Phase B3-code: deletion + access scripts** `phase-B` `privacy` `code` `~4d` — Implementation of B3 doc. Four scripts in `keycontent-app/script/`: `export-user-data.ts` (IPP 6 access), `delete-user-data.ts` (IPP 7 cascade + anonymise), `close-account.ts` (Type 3 clause 11/12), monthly aggregation step for `ai_call_logs`. **Needs operator review of cascade semantics before code lands.** Unblocks the 30-day deletion SLA promise.
- **Phase B5 follow-on: req.scoped() query builder + KC route audit** `phase-B` `security` `code` `~2-3d` — Highest residual KC risk per threat model (T3): multi-tenant scope filter is in-code, not in-DB. Closes the gap with an Express middleware-bound query builder that refuses queries without an explicit `agency_id`. Plus targeted audit of every existing route for the pattern. Quarter-budget work — not urgent but highest ROI.
- **Brief 14 — Security advisor surface in Sentinel** `phase-C` `briefs` `security` — `/security` sub-page. Runs `get_advisors` on cron across every onboarded app. Surfaces findings by severity. Folds ERROR into Monday digest. **Highest leverage in Phase C** — closes the reactive-only-detection gap.
- **Brief 15 — Data inventory surface in Sentinel** `phase-C` `briefs` `privacy` — `/data-inventory` sub-page reading B1 from a Sentinel-owned table. Drift detection (new public table → alert).
- **Brief 16 — Pen-test cadence tracking** `phase-C` `briefs` `security` — Stores last pen test / next due / scope / report link per app in `maintenance_entries`. Surfaces in digest when overdue. Same shape as Brief 10 lifecycle reference.
- **Brief 17 — Breach response runbook surfacing** `phase-C` `briefs` `security` — `/breach-response` sub-page; clickable B4 card with "Start incident" button that scaffolds incident folder + notification draft templates.
- **Brief 19 — KC `job-assets` daily R2 backup** `phase-C` `briefs` `infra` — Sentinel-owned node-cron: list Supabase Storage `job-assets`, diff against R2 bucket, copy new/changed objects, prune versions per retention policy. Companion CLI `script/restore-from-r2.ts`. R2 export decision locked.
- **Brief 18 V2 — heartbeat dashboard in Sentinel** `phase-C` `briefs` `observability` `low-priority` — Add a `/heartbeats` page that shows recent ping + verification status from `sentry_heartbeat_pings`. Today the data is DB-only. UI elevates "Sentry is healthy" to a glanceable status pill.
- **Sentry alert "heartbeat" detection follow-up** `phase-C` `low-priority` — V2 of Brief 18: if Sentinel-side verify pass reports `missing`, fold into Monday digest as a P1 alert. Today operator inspects pings manually.
- **Phase D triggers** `phase-D` `future` — Compliance escalations. Each is trigger-gated, not calendar: NZ Privacy Act formal review · GDPR posture for EU customers · SOC 2 Type I / II · annual third-party pen test · automated DAST in CI · cyber-insurance · bug-bounty.
