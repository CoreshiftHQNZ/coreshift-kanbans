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

## 🟡 In Progress

- **Prerender + GEO foundations** `phase-0` `in-progress` — PR #5: headless prerender of all 23 public routes, clean-URL serving, sitemap (incl. blog posts), llms.txt, Organization schema, og-image. Verified locally (real content + JSON-LD per route). Awaiting review + first staging deploy.

## 🚫 Blocked

- **Live crawl/index verification** `phase-0` `blocked-by:access` — Can't read LeanSEO's live client/index data: the supabase-prod MCP connector points at a different Coreshift app. Need the correct Supabase connection and/or GSC access.

## 🔵 This Week

- **Unblock AI crawlers (Cloudflare)** `phase-0` `infra` `blocked-by:dashboard` — Confirmed: AI bots are hard-blocked at the edge — 403 to GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot, Googlebot 200 — via AI Crawl Control + "Block AI Scrapers" + managed robots.txt (ai-train=no). Decision: allow ALL AI crawlers. Action (dashboard, CoreshiftHq acct): AI Crawl Control → Crawlers → Allow; Security → Bots → Block AI Scrapers = Off; disable managed robots.txt. Not doable via the Workers-only MCP. Until lifted, PR #5 prerender doesn't reach AI engines.
- **Verify Railway/Chromium build on staging** `phase-0` `infra` `blocked-by:pr-5` — After PR #5 merges, confirm the nixpacks build installs Chromium and prerender runs on the staging deploy (the one thing not testable locally).

## ⚪ Backlog

- **Install skills as internal team tool** `phase-1` — `/plugin marketplace add aaron-he-zhu/seo-geo-claude-skills` in Claude Code; wire free GSC + GA4 for client sites.
- **Standardise client deliverables on the audit skill** `phase-1` `deliverable` — Generate the opportunity/execution plans (the PDFs hand-built today) via the audit skill into the existing seo_plans flow.
- **Adopt CORE-EEAT / CITE quality gate** `phase-1` `playbook` — 80-item + 40-item human sign-off checklists before anything ships. Fits the "specialist runs the show" model.
- **Rebuild seoplan.ts method** `phase-2` — Replace homepage-regex + single-haiku with real crawl + onpage + schema_lint + GSC/GA4 inputs; multi-step engine with stronger model.
- **Add GEO/AEO axis to plans** `phase-2` `deliverable` — Entity optimisation (Wikidata), schema generation, FAQ/HowTo + answer-density — net-new sellable value.
- **Recurring monitoring + reporting** `phase-3` `recurring` — Rank tracker + monthly GSC performance report surfaced in the client portal; ledger before/after deltas.
- **Define LeanSEO best-practices output** `phase-4` `deliverable` `blocked-by:phase-0` — Produce the output Coreshift Live Edit consumes, in three forms: a spec/checklist, a machine-readable ruleset, and an SEO/GEO-ready starter theme. Generalises the Phase 0 bundle (SSR/schema/llms.txt), proven on our own site, into a reusable ruleset.
- **Bake best practices into Coreshift Live Edit** `phase-4` — Wire the ruleset into Live Edit's themes + edge renderer so every built site ships SSR, schema, llms.txt, and a clean sitemap by default.
- **LeanSEO as a Live Edit add-on** `phase-4` `milestone` — Prep built sites with integration hooks, then offer LeanSEO as a switch-on add-on/integration to Live Edit clients (upsell on the $100/mo platform).
- **Rebrand template scaffolding** `ops` — package.json is still `coreshift-starter`; README/AGENTS.md describe the generic starter, never customised for LeanSEO.
- **Prune stale branches** `ops` — 4 merged feature branches (admin-dashboard, dark-glassmorphic-redesign, dashboard-spec-updates, multistep-onboarding) still on the remote.
