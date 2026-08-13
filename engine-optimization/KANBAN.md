# Engine Optimization — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js engine-optimization` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## 🟡 In Progress

- **M2: Audit engine** `M2` `phase-1` — Crawl a real client site and produce a scored audit run with per-page snapshots and findings, viewable in the app. The tables are already built and waiting (`audit_runs`, `page_snapshots`, `findings`) — this milestone fills them. Scoring must be deterministic: two runs against an unchanged site have to produce the same number, or every month-over-month claim built on top is fiction.

## 🚫 Blocked

_None._

## 👉 On Ricky

- **DataForSEO account + API credentials** `M2` `decision-made` — Approved 2026-08-13, not yet created. Doesn't block M2's crawl-and-score work, but CITE (the domain-authority framework) needs a backlink index and requires 100% item coverage, so without it CITE returns `UNDECIDED` forever rather than a low score. **Default if no answer:** M2 ships with SEO/GEO/AEO scoring only and CITE waits.
- **The client list** `M2` — Only Storepro is onboarded. There are 47 hosts with usable Search Console access across the Growth Partners estate and no way to tell a retainer client from an old access grant. A list of names is enough; the property mapping is automated. **Default if no answer:** everything stays Storepro-only, which is fine for building but not for a real monthly cycle.

## ✅ Done

- **M1: Data spine — Storepro's data is in the app** `M1` `phase-0` `milestone` `shipped` — The whole spine, end to end: a Supabase project (`xslwvntwrlvqccdupmni`), a 20-table schema, Google access, ingestion, and a client view. **Verified by:** four calendar months of Storepro data (Apr–Jul 2026) queried straight out of Postgres — 8 snapshot rows, 2 sources × 4 months; `GET /api/clients/storepro` returning 200 with 4 months and correct deltas; a screenshot of the client view; `tsc` clean; commit `bd7cbe5` on `origin/dev`. **Real numbers:** July 815 clicks / 77,496 impressions / 1,264 organic sessions. *(Trap worth knowing: the app runs locally only — there is no Railway environment yet, so "in the app" means the local build, not a deployed URL.)*
- **Google access solved permanently — 65 properties, zero per-client setup** `M1` `infra` `shipped` — The blocker that had been open in the enablement log since the GHS Law build in July. Ricky created a service account (`seo-data-reader@gp-seo-data.iam.gserviceaccount.com`) and authorised **domain-wide delegation** so it impersonates `access@growthpartners.co.nz` — the account that already holds access to every client asset. **The consequence is the important bit: onboarding a client now needs nothing at all on the Google side.** Ten clients and a hundred clients are the same amount of setup work: none. **Verified by:** `scripts/verify-google-access.mjs` minting a token and enumerating **65 Search Console and 98 GA4 properties**, plus live Search Analytics queries returning real data. Deliberately *not* user OAuth — LeanSEO's refresh token died twice with `invalid_grant` and took its own re-mint script with it.
- **Found: 11 properties look like access and deliver nothing** `M1` `infra` `finding` — Of the 65 Search Console properties, 11 are `siteUnverifiedUser` — `access@` is listed on them but verification was never completed. They appear in the property list exactly like working ones, so a naive "is it in the list?" check passes and then every data call 403s. **Tested rather than assumed:** `siteOwner` and `siteFullUser` both returned 200 with real data; `siteUnverifiedUser` returned 403. Onboarding now checks the permission *level* and records it, and a 403 during ingestion is written as **revoked access** rather than dissolving into a generic failure note nobody reads.
- **Found: GA4 property IDs cannot be auto-matched** `M1` `infra` `finding` — 98 GA4 properties against roughly 10 SEO clients, including 22 matched Test/Filtered pairs. A name-matching experiment paired `hotspring.com.au` with the *Hawkes Bay* property and `unistor.com.au` with a lead-page property — both wrong, and picking a Test stream yields near-zero sessions that read as a traffic collapse. Decision: **the GA4 property ID is supplied explicitly at onboarding and never inferred**, and the onboarding script warns if the chosen property is named "Test".
- **Storepro's baseline — and a hypothesis worth testing** `M1` `finding` — First client onboarded and measured. Non-brand share **31.8%** (the warning threshold is 30%), non-brand CTR **0.13%**, and **114 queries sitting at position 5–20** with 50+ impressions. The odd part: several informational queries rank at position 7–9 with 500+ impressions and **zero clicks** — *"automated racking solutions"* at 7.0 with 521 impressions, *"what is a mezzanine floor"* at 9.8 with 509. Position 7 should return 10–15 clicks. **Impressions holding while clicks go to zero is the diagnostic fingerprint for AI Overview absorption**, and GA4 corroborates that AI engines read this site — AI-assistant sessions went 0 → 0 → 31 → 43 across the four months. ⚠️ **Explicitly unverified as a cause** — average position is an average and a SERP feature could do the same thing. It's the first thing M3's probe panel should test.
- **Schema applied — 20 tables, and the loop nobody else has** `M1` `phase-0` `shipped` — The reviewed data model from `docs/schema.md` is live: clients, properties, access state, versioned client context, immutable audit runs, per-page snapshots, findings carrying a falsifiability contract, work items with a mandatory rationale, **predictions and control sets**, cycles, metric snapshots, tracked keywords, AI probes storing raw answers, reports with a real review-check table, and the algorithm-update ledger. RLS enabled on every table with staff-only policies; Supabase security advisors return **clean** (one warning fixed on the way — the `updated_at` trigger function was callable over the REST API and had its execute grant revoked).
- **Ingestion built on rules that came from other people's failures** `M1` `phase-0` `shipped` — Every design choice traces to a specific observed failure in a surveyed tool, not to taste. **Calendar months, not rolling windows** — a rolling 28-day window anchored to capture time overlaps its own baseline and dilutes every delta. **Totals from a dimensionless Search Console call** — Google anonymises low-volume queries, so summing query rows under-reports; for Storepro's July, 536 of 815 clicks came from queries too small to list, and the app says so on screen. **Both property forms tried** — `sc-domain:` and URL-prefix are different objects with different data, and Storepro has only the URL-prefix form. **"Couldn't measure" never becomes "measured zero"** — a failed source writes no snapshot and records why. **A month can't be ingested until it settles** — Search Console lags ~2 days, so the tool refuses to ingest a month before the 3rd of the next one rather than recording an incomplete month as final.
- **Project registered + seven milestones** `phase-0` `milestone` — Board, config and handover created; `.coreshift-project` written so every future session in the directory auto-orients. M1 Data spine → M2 Audit engine → M3 AI visibility panel → M4 Work plan → M5 The loop → M6 Monthly report → M7 Handover to the team. Each `doneWhen` is a single observable event.
- **Reference research: seven codebases surveyed** `phase-0` `research` — Read in full: `coreyhaines31/marketingskills`, `AgriciDaniel/claude-seo`, `AgriciDaniel/claude-blog`, `zubair-trabzada/geo-seo-claude`, `aaron-he-zhu/aaron-marketing-skills` (contract layer + 16 SEO/GEO skills), and Coreshift's own `leanseo`. Verdict: they collectively supply ~60% of an agency SOP and 0% of the system. Best material is Apache-2.0 — fork, adapt, use commercially, strip the trademarks.
- **Key finding: nobody closes the assumption loop** `phase-0` `research` — Grepping every surveyed codebase for prediction/assumption logic returns essentially nothing. LeanSEO's only hit is the string `"expected impact"` inside a prompt, written to an untyped blob and never read back. Recording what we expect and checking it is entirely net-new, and it's the product.
- **Key finding: no tool measures AI visibility** `phase-0` `research` — Every repo measures GEO/AEO *readiness* and calls it AI visibility. Not one queries ChatGPT, Perplexity or AI Overviews to check whether a client is actually cited. The single keyless probe available measures Tavily, not the engines clients care about.
- **Correction: CORE-EEAT 80 / CITE 40 are item counts, not pass marks** `phase-0` `research` — LeanSEO's quality-gate doc treats them as thresholds. They're dimension counts (8×10 and 4×10). Real pass mark is 75, with one verified veto capping the score at 59 and two vetoes blocking outright with no score emitted.
- **Architecture decided** `phase-0` `milestone` — Web app on Railway + Supabase, since specialists won't use a terminal. Agent work runs server-side via the Claude Agent SDK. The method lives in versioned, portable skill files the server loads at runtime and we can also run in Claude Code while building. Schema first, before any screen.
- **Automation posture decided** `phase-0` `decision` — Everything unattended: crawls, GSC/GA4 pulls, AI probes, snapshots, delta analysis, plan and report drafting. Human gate before any site change and before anything reaches a client.
- **Data sources chosen** `phase-0` `decision` — DataForSEO for backlinks (cheapest per-call, right at 10 clients; revisit at 100). Build our own multi-engine AI-citation panel rather than buying a monitor — it's the differentiated asset and it feeds the history corpus that becomes the moat.

## 🔵 This Week

- **Build the crawler** `M2` — Fetch and parse pages without JS execution, because that is exactly what an AI crawler sees. Retain per-page signals; discarding them makes page-level month-over-month diffs impossible, which is the mistake LeanSEO made.
- **SEO / GEO / AEO scoring** `M2` — Deterministic and stored at full precision. Rounding to integers 0–10 makes a real improvement show as zero delta.
- **Findings with the falsifiability contract** `M2` — Every finding carries its evidence, the first principle it rests on, what would prove it wrong, and a leading indicator. The columns already exist.
- **Railway staging** `M2` `infra` — Not needed to close M1 but needed before anyone else can look at this. The service-account key moves to a Railway secret at the same time.

## ⚪ Backlog

- **Port CORE-EEAT (80 items, 9 content-type profiles)** `M2` `method` — Apache-2.0. Includes per-item pass/partial/fail bands and calibration examples; expensive to reproduce, free to take.
- **Port CITE (40 items, 7 domain profiles)** `M3` `method` — Peer-relative by design; each client needs a locked 3–5 domain peer cohort declared at onboarding. That's a human step, budget for it.
- **AI Overview recovery playbook** `M3` `deliverable` — Four-phase incident SOP. Storepro may already be a live case — see the baseline finding above.
- **Composite content-decay score** `M4` `method` — Traffic 30 / position 25 / CTR 15 / freshness 15 / competitive displacement 15, with action bands and a refresh-vs-rewrite rule.
- **Report generator + branded output** `M6` — Bind report templates to the metrics store, pull the month's applied work with its originating findings, and surface last month's predictions with their verdicts.
- **Algorithm update ledger** `M5` — Google-owned sources only, verified entries only. Auto-flags confounders on predictions whose window overlaps an update.

## 🅿️ Parking Lot

- **Content production pipeline** — Briefs, drafts and publishing are a separate concern. Work items can reference them by URL until we know we need more.
- **CMS write adapters** — Applying changes directly to client sites (WordPress, Shopify, Webflow, git PR). Approval-gated, and not needed before M7.
- **Multi-agency tenancy** — Built for Growth Partners as a single agency. If Coreshift needs an isolated instance, that's a column plus RLS. Cheap to add later, premature now.
- **API cost accounting** — At 100 clients, per-client API spend becomes real and billable. Worth a table before we get there.
- **Local SEO / Google Business Profile** — Not in scope until a client needs it.
- **Auth for the app** — No login yet; the client view is unauthenticated on localhost. Needed before Railway staging is reachable by anyone else.
- **Calibration study** — After ~12 months we'll have change/prediction/outcome data across every client. That corpus is the moat: it lets us answer "do refreshes on position 8–15 pages actually beat control?" from our own evidence rather than quoting unsourced blog percentages.
