# Lean SEO — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js leanseo` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## ✅ Done

- **Repo audit & onboarding** `phase-0` `shipped` — Reviewed the codebase: CoreShift Starter stack (React/Vite SPA + Express + Drizzle/Supabase + Railway), productized SEO funnel, and the Apr 2026 pivot to manual human delivery.
- **SEO/GEO capability audit** `phase-0` `shipped` — Found the keystone gap: client-rendered SPA with no SSR/prerender, so all per-page schema (Service, FAQPage, BlogPosting) is JS-injected and invisible to non-JS AI crawlers. Plus missing og-image.png and blog posts absent from the sitemap.
- **Method benchmark vs reference tools** `phase-0` `shipped` — Benchmarked seoplan.ts (single homepage regex + one claude-haiku call, no GEO/AEO/data/gate) against claudeseoskill.com + aaron-he-zhu skills. Verdict: behind on method, absent on GEO/AEO, ahead only on productization.
- **Tooling QA pass** `phase-0` `shipped` — Ran the seo-geo skill connectors against the live site. Reproduced the audit AND found two new things: AI crawlers (GPTBot/ClaudeBot/Google-Extended/CCBot/Bytespider) blocked at the robots layer, and 0 crawlable internal links (site undiscoverable without JS).
- **Adoption roadmap agreed** `phase-0` `milestone` — 4-phase plan (fix own house → adopt as internal tool → build into product → recurring value). This board is the canonical state.
- **Unblocked AI crawlers (Cloudflare)** `phase-0` `infra` `shipped` — AI bots were hard-blocked (403) at the edge AND disallowed via a Cloudflare-managed robots.txt (`ai-train=no`). Fixed in the Coreshift 2 account: Block AI Bots Scope → Do not block, and Managed robots.txt OFF (AI Crawl Control → Signals). Verified: GPTBot/ClaudeBot/OAI-SearchBot/PerplexityBot/Googlebot all 200; robots.txt back to clean `Allow: /`.
- **Prerender + GEO foundations live on staging** `phase-0` `shipped` — PR #5 (prerender of all 23 public routes + sitemap, llms.txt, Organization schema, og-image) and PR #6 (Dockerfile with system Chromium — fixed the Railway build that Railpack broke). Verified end-to-end: staging serves real content + per-page JSON-LD (e.g. /seo-for-plumbers → 200, full content). Prod still on the old shell pending promotion. Staging env confirmed serving.
- **Phase 2: plan-generation method rebuilt** `phase-2` `shipped` — PR #7. Replaced single-homepage-regex + haiku with a real multi-page site audit (crawl + on-page + schema + robots/sitemap, scored SEO/GEO/AEO — `siteAudit.ts`) feeding a Sonnet-generated structured plan across all three axes with prioritised recs + CORE-EEAT/CITE notes (`seoplan.ts`). GSC/GA4 data seam (`searchData.ts`, graceful). Still human-gated. Audit layer verified live (prod GEO 3 vs staging GEO 10). On staging.
- **Phase 1: quality gate documented** `phase-1` `playbook` `shipped` — docs/standards/quality-gate.md: CORE-EEAT + CITE human sign-off checklist. The generator emits a matching qualityGate section for the reviewer to check.
- **Entity optimisation (Wikidata) in plans** `phase-2` `shipped` — On PR #10: `entityData.ts` reconciles the business to a Wikidata entity (official-website P856 match only — same-name traps rejected, subdomain-tolerant, failures degrade honestly to "couldn't check"). Signal feeds the AI prompt (delimited as untrusted, Wikidata is world-editable) and the fallback plan's GEO recommendations. Live-tested 6/6 scenarios.

## 🟡 In Progress

- **Phase 3 built: data seam + rank tracker + monthly reports — PR #10 MERGED + deployed to staging** `phase-3` — Full slice on `feature/phase-3-pickup`: live GSC/GA4 fetches (verified: GA4 33 sessions/28d; GSC genuinely 0 — the before-picture until prod promotes), snapshot rank tracker (`search_snapshots`), deterministic monthly report generator with before/after deltas (`performance_reports`), human-gated publish flow (drafts until admin publishes; portal shows published only), portal Performance Reports section + admin capture/generate/publish controls. 8-angle review run, all confirmed findings fixed; e2e-tested on scratch Postgres with live Google data. MERGED to dev→staging 2026-07-06 (Abe, same access as Ricky): CI green, Phase-3 endpoints live + auth-guarded on staging, public pages intact. REMAINING (Ricky): 3 Railway staging service vars (`GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN`, values with Mal) so live GSC/GA4 data flows on staging + nominate a safe test client + external scheduler → `POST /api/admin/snapshots/capture-all` (idempotent per day) + fold migration 0003 into next pass. **Railway build regressed 2026-07-07** (Debian apt `chromium` drifted to v150 → crashes on launch in the build sandbox) — **re-fixed in PR #11** by basing the Dockerfile on `ghcr.io/puppeteer/puppeteer:25.2.1` (Chrome baked + container-ready; no build-time download, no distro-chromium crash). Verified green via local `docker build`, which faithfully reproduces Railway's sandbox. Merged → staging; Railway redeploying.
- **Builder handover ready** `phase-3` `shipped` — `docs/HANDOVER.md` (PR #8) is the self-contained onboarding for the next builder: current state, setup + build gotchas, the decision points blocking Phase 3, the Phase 3 build plan, landmines, and paste-ready prompts. Start there.
- **Release strategy: hold prod until all phases done** `milestone` — Phase 0 is complete and verified on staging. Decision: every phase accumulates on `staging`; a single `staging → main` promotion ships Phases 0–4 to leanseo.co.nz at the very end (see Backlog). Note: the AI-crawler unblock is already live on prod (Cloudflare config, not a code deploy). Next up: Phase 1.

## 🚫 Blocked

- **Live crawl/index verification** `phase-0` `blocked-by:access` — Can't read LeanSEO's live client/index data: the supabase-prod MCP connector points at a different Coreshift app. Need the correct Supabase connection and/or GSC access.

## 🔵 This Week

- **RESOLVED: Google OAuth wired (GSC + GA4)** `phase-2` `phase-3` `infra` — 2026-07-03: OAuth app published to production, fresh refresh token minted via local consent flow against the LeanSEO Google account (`webmasters.readonly` + `analytics.readonly`). Account is siteOwner on `sc-domain:leanseo.co.nz` + has GA4 property 532359443. Live data verified end-to-end through `searchData.ts` (PR #10). Remaining per-client step: grant the LeanSEO identity viewer access to each client's GSC + GA4 property as clients onboard.
- **DECISION: verify AI plan output** `phase-2` `blocked-by:test-client` — Full pipeline verified locally with live data (audit + GSC/GA4 + entity → plan stored; fallback path solid; Sonnet token usage logged per plan). The `ANTHROPIC_API_KEY` is now **VALID** (Abe 2026-07-06: staging key tests HTTP 200; prod key set to the same good value; the earlier 401 was a corrupted/RTF-mangled copy, not a dead key). The AI-written output itself is still un-reviewed. REMAINING: Ricky nominates a safe test client (shared DB holds real clients), then run one generation on staging and review it against `docs/standards/quality-gate.md` + note the token cost for Abe's model sign-off.

## ⚪ Backlog

- **Install skills as internal team tool** `phase-1` — `/plugin marketplace add aaron-he-zhu/seo-geo-claude-skills` in Claude Code; wire free GSC + GA4 for client sites.
- **Standardise client deliverables on the audit skill** `phase-1` `deliverable` — Generate the opportunity/execution plans (the PDFs hand-built today) via the audit skill into the existing seo_plans flow.
- **Wire the monthly snapshot scheduler** `phase-3` `infra` `ricky` — The capture endpoint (`POST /api/admin/snapshots/capture-all`, admin-secret auth, idempotent per day, runs in background) is built and on PR #10; needs an external scheduler (Railway cron or similar) hitting it monthly. Deliberately no in-app cron — Ricky's call on the mechanism.
- **Define LeanSEO best-practices output** `phase-4` `deliverable` `blocked-by:phase-0` — Produce the output Coreshift Live Edit consumes, in three forms: a spec/checklist, a machine-readable ruleset, and an SEO/GEO-ready starter theme. Generalises the Phase 0 bundle (SSR/schema/llms.txt), proven on our own site, into a reusable ruleset.
- **Bake best practices into Coreshift Live Edit** `phase-4` — Wire the ruleset into Live Edit's themes + edge renderer so every built site ships SSR, schema, llms.txt, and a clean sitemap by default.
- **LeanSEO as a Live Edit add-on** `phase-4` `milestone` — Prep built sites with integration hooks, then offer LeanSEO as a switch-on add-on/integration to Live Edit clients (upsell on the $100/mo platform).
- **Rebrand template scaffolding** `ops` — package.json is still `coreshift-starter`; README/AGENTS.md describe the generic starter, never customised for LeanSEO.
- **Prune stale branches** `ops` — 4 merged feature branches (admin-dashboard, dark-glassmorphic-redesign, dashboard-spec-updates, multistep-onboarding) still on the remote.
- **Protect staging from indexing** `ops` — turning off the zone-wide Cloudflare managed robots.txt means staging.leanseo.co.nz now serves `Allow: /` too. Add a noindex / auth gate so staging isn't crawled or indexed.
- **FINAL: promote all phases to prod (staging → main)** `milestone` `blocked-by:phases-1-4` — The single production release. HELD until Phases 0–4 are complete and verified on staging. Then open staging → main, let Railway deploy, and smoke-test leanseo.co.nz (onpage/schema_lint: prerendered content + JSON-LD live; AI crawlers 200).
