# Engine Optimization — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js engine-optimization` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## 🟡 In Progress

- **M1: Supabase project + schema** `M1` `phase-0` — Apply the reviewed data model from `docs/schema.md`. Clients, properties, access state, versioned client context, immutable audit runs, per-page snapshots, findings with falsifiability fields, work items, predictions, control sets, cycles, metric snapshots, tracked keywords, AI probes, reports with a real review-check table, and the algorithm-update ledger.

## 🚫 Blocked

- **Everything downstream of measurement** `M1` `blocked-by:google-access` — No GSC or GA4 data flows until the Google service account exists and domain-wide delegation is authorised. Audits produce crawl scores without it, but no traffic, ranking, or delta figure is possible. Steps written up in `docs/google-access-setup.md`.

## 👉 On Ricky

- **Create the Google service account + authorise delegation** `M1` `blocked-by:access` — Needs Google Cloud console and Workspace super-admin on `growthpartners.co.nz`. Full steps in `docs/google-access-setup.md` §3–5. Verified the domain is on Workspace (MX → `aspmx.l.google.com`), so delegation is available — this is what makes 10 clients and 100 clients the same amount of setup work: none.
- **DataForSEO account + API credentials** `M2` `decision-made` — Approved 2026-08-13. Needed before CITE can emit a score at all; nine of its forty items require a link index and the framework demands 100% coverage.
- **Confirm the milestone set** `M1` `decision` — Seven milestones drafted below and on the board. Reshape any before M2 starts; they're the scope arbiter for the next several months.

## ✅ Done

- **Reference research: seven codebases surveyed** `phase-0` `research` — Read in full: `coreyhaines31/marketingskills`, `AgriciDaniel/claude-seo`, `AgriciDaniel/claude-blog`, `zubair-trabzada/geo-seo-claude`, `aaron-he-zhu/aaron-marketing-skills` (contract layer + 16 SEO/GEO skills), and Coreshift's own `leanseo`. Verdict: they collectively supply ~60% of an agency SOP and 0% of the system. Best material is Apache-2.0 — fork, adapt, use commercially, strip the trademarks.
- **Key finding: nobody closes the assumption loop** `phase-0` `research` — Grepping every surveyed codebase for prediction/assumption/expectation logic returns essentially nothing. LeanSEO's only hit is the string `"expected impact"` inside a prompt, written to an untyped blob and never read back. Recording what we expect and checking it is entirely net-new, and it's the product.
- **Key finding: no tool measures AI visibility** `phase-0` `research` — Every repo measures GEO/AEO *readiness* and calls it AI visibility. Not one queries ChatGPT, Perplexity, or AI Overviews to check whether a client is actually cited. The single keyless probe available measures Tavily, not the engines clients care about.
- **Correction: CORE-EEAT 80 / CITE 40 are item counts, not pass marks** `phase-0` `research` — LeanSEO's quality-gate doc treats them as thresholds. They're dimension counts (8×10 and 4×10). Real pass mark is 75, with one verified veto capping the score at 59 and two vetoes blocking outright with no score emitted.
- **Architecture decided** `phase-0` `milestone` — Web app on Railway + Supabase, since specialists won't use a terminal. Agent work runs server-side via the Claude Agent SDK. The method lives in versioned, portable skill files the server loads at runtime and we can also run in Claude Code while building. Schema first, before any screen.
- **Automation posture decided** `phase-0` `decision` — Everything unattended: crawls, GSC/GA4 pulls, AI probes, snapshots, delta analysis, plan and report drafting. Human gate before any site change and before anything reaches a client.
- **Google access path solved** `phase-0` `infra` — `access@growthpartners.co.nz` already holds access to every client asset, and the domain is on Google Workspace. A service account with domain-wide delegation impersonates it and inherits everything, so onboarding a client needs zero Google-side work from us. Avoids the user-OAuth refresh token that died twice on LeanSEO.
- **Data sources chosen** `phase-0` `decision` — DataForSEO for backlinks (cheapest per-call, right at 10 clients; revisit at 100). Build our own multi-engine AI-citation panel rather than buying a monitor — it's the differentiated asset and it feeds the history corpus.

## 🔵 This Week

- **Apply the schema to a Supabase project** `M1` — Create the project in the CoreShift org, apply the migration, generate types.
- **Write the GSC + GA4 ingestion** `M1` — Calendar-month windows ending `today − 2` (Search Console lags ~2 days). Try both `sc-domain:` and URL-prefix property forms. Classify a 403 as revoked access, not a transient failure.
- **Build the access preflight** `M1` — Verify each property programmatically rather than trusting a tickbox; paginate the GA4 account-summaries call properly.
- **Scaffold the app** `M1` — Repo, Railway staging, dev → staging → main. Minimal client list and a client detail view, so there's somewhere for M1's data to land.

## ⚪ Backlog

- **Port CORE-EEAT (80 items, 9 content-type profiles)** `M2` `method` — Apache-2.0. Includes per-item pass/partial/fail bands and calibration examples; expensive to reproduce, free to take.
- **Port CITE (40 items, 7 domain profiles)** `M2` `method` — Peer-relative by design; each client needs a locked 3–5 domain peer cohort declared at onboarding. That's a human step, budget for it.
- **Composite content-decay score** `M4` `method` — Traffic 30 / position 25 / CTR 15 / freshness 15 / competitive displacement 15, with action bands and a refresh-vs-rewrite rule. Drops straight into the monthly cycle.
- **AI Overview recovery playbook** `M3` `deliverable` — Four-phase incident SOP with a genuine diagnostic fingerprint: impressions flat while clicks fall. Productisable as a standalone audit.
- **Report generator + branded output** `M6` — Bind report templates to the metrics store, pull the month's applied work with its originating findings, and surface last month's predictions with their verdicts.
- **Algorithm update ledger** `M5` — Google-owned sources only, verified entries only. Auto-flags confounders on predictions whose window overlaps an update.

## 🅿️ Parking Lot

- **Content production pipeline** — Briefs, drafts and publishing are a separate concern. Work items can reference them by URL until we know we need more.
- **CMS write adapters** — Applying changes directly to client sites (WordPress, Shopify, Webflow, git PR). Approval-gated, and not needed before M7.
- **Multi-agency tenancy** — Built for Growth Partners as a single agency. If Coreshift needs an isolated instance, that's a column plus RLS. Cheap to add later, premature now.
- **API cost accounting** — At 100 clients, per-client API spend becomes real and billable. Worth a table before we get there.
- **Local SEO / Google Business Profile** — Not in scope until a client needs it.
- **Calibration study** — After ~12 months we'll have change/prediction/outcome data across every client. That corpus is the moat: it lets us answer "do refreshes on position 8–15 pages actually beat control?" from our own evidence rather than quoting unsourced blog percentages.
