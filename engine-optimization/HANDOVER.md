# Engine Optimization — Handover
_2026-08-14 · M4 landed · M5 open_

## ▶️ Paste this into a new session

```
Engine Optimization M5 — Actionable work

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M4 produces a ranked, approved plan, but its items are findings restated —
"Question content is marked up as such · 14.5h". Nobody on the team can pick that
up and start. M5 makes every item an instruction: what to do, which specific pages
or assets to do it to, and how a specialist knows it is finished.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **Just closed:** M4 — the work plan. **Now open:** M5 — making that plan executable.
- **In plain terms:** the tool can already work out what matters most this month and put it in order. What it cannot do is tell anyone *what to actually do*. An item currently reads "Question content is marked up as such, 14.5 hours" — that is a restatement of the problem, not a job. M5 turns each one into "add FAQ schema to these 14 product pages, here they are, and here is how you know it's done."
- **Why this went ahead of the prediction work:** a prediction is *"we expected X because we did Y"*. Y has to be a specific, dated, finished action. Until the plan produces those, there is nothing real to predict about. This is why the arc grew from seven milestones to eight.
- **Also landed since the last handover, without being the milestone:**
  - **All five AI engines are live.** A full sweep put Storepro at Perplexity 14/15, Claude 14/15, Gemini 7/8, ChatGPT 13/15, Google AI Overviews 7/10. Eleven of fifteen prompts are cited by *every* engine that answered. The M3 finding now generalises: Storepro is cited nearly everywhere a buyer might ask, and still gets no clicks.
  - **The prompt set was measuring one product line six times** and has been rebuilt. 26 raw queries now pool into 15 distinct concepts, covering awareness / consideration / commercial instead of asking "What should I know about X" fifteen times.
  - **Postmark is wired.** The old ceiling of 2 sign-in emails an hour to Supabase members only is gone; it is 100/hour from `hello@growthpartners.co.nz`, and you have signed in for real.
- **Verified by:** 73 tests passing across three suites (23 prompt, 38 plan, 12 detector), typecheck and build clean, the prompt set written live (15 active, 14 retired, **240 probe runs intact — nothing deleted**), Postmark proved by an SMTP handshake that authenticated and had the sender accepted without sending anything, and all five engines answering a real question with Storepro cited. Commit `5fe7a23`.
- **Next:** M5, and the paste-block above starts it.

## 👉 On you

1. **Review the 15 prompts and sign them off.** They are stored **unreviewed**, and every report will say so until an analyst signs them. The mix is 6 awareness / 5 consideration / 4 commercial. Read them in the app and cut or reword anything that is not how a buyer would ask. **Default if you don't answer:** the set runs as-is and the panel keeps flagging it on every screen.
2. **Declare Storepro's competitor cohort in the app.** The panel is built and waiting — you add the domains and it records who declared them and why. Without a cohort, competitor presence stays *not measured* and displacement cannot become a prediction subject in M6. Seen citing alongside Storepro across four engines: `dexion.co.nz`, `palletrackingsolutions.co.nz`, `shelvingshopgroup.co.nz`, `stackit.co.nz`. **Default if you don't answer:** predictions run on traffic and citation presence only.
3. **The client list.** Still only Storepro. 47 hosts have working Search Console access with no way to tell a retainer client from an old access grant. Names are enough. **Default if you don't answer:** Storepro-only, which is fine until M8.

**Decided and closed:** Ahrefs Brand Radar ($129/mo) — declined as too expensive, not revisiting. Prompt generation is built in-house rather than bought, which the research supported: no vendor sells NZ conversational buying prompts, and the vendor keyword data carried the same near-duplicate problem worse than Search Console did.

## 🔴 Risks you're carrying

- **The plan's hours have never been calibrated.** Declared estimates, labelled as estimates everywhere they appear, never checked against how long the work took. `work_items.shipped_at` makes it answerable after two or three cycles. **Don't quote hours to a client yet** — and note M5 makes this more pressing, because an actionable item invites someone to schedule against the number.
- **A single probe is still a sample.** Much improved — every prompt now has n≥3 and most n≥6 across engines, so nothing in the plan rests on a coin flip any more. But the sampling *design* (n sweeps across a window, reported as a rate with its sample size) still does not exist, and month-over-month citation deltas remain unsafe to show a client.
- **One of M3's five volatility data points may have been our own bug.** The two M3 sweeps straddled a detector change. The three "AI Overview appeared or vanished" changes stand regardless; "one citation flipped" may be the detector rather than Google. It weakens one data point of five; it does not overturn the finding.
- **Audit findings are trusted at full confidence, and that means reproducible, not correct.** M2 proved two runs of an unchanged site agree; nothing has tested whether the judgements are right. Uniform across all audit findings, so it does not distort their relative order — but the whole block could sit too high and we would not know.
- **The demand signal is truncated toward the head.** Per-page and per-query demand come from the top rows Search Console returns — 50 pages carrying 57,456 of 77,496 impressions for Storepro. Work outside those rows ranks with no demand signal. Reported per item and counted on the plan, but it under-ranks the long tail.
- **`intent` on a prompt is cosmetic.** All 15 classify `informational` because the regex cannot see commercial intent. `funnel_stage` does the real work now. DataForSEO's `search_intent` would fix it for ~$0.013/client.
- **One database guarantee lives in application code.** `0007` weakened "every superseded plan names its successor" to "a successor pointer may only appear on a superseded plan", because the strict pair was unsatisfiable in either order and Postgres cannot defer a CHECK. `writePlan` enforces the rest, which is weaker.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at `5fe7a23`, working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase `xslwvntwrlvqccdupmni`. Railway `engine-optimization`, staging auto-deploys on push to `staging`. `main` does not exist.
- **Read first:** `docs/planning.md` — the ranking method and what the plan refuses to do; M5 extends exactly this. Then `docs/ai-visibility.md`, `docs/scoring.md`, `docs/schema.md`. `README.md` has the commands.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul), 2 audit runs (both `partial` at 147/202 pages — normal), **15 active prompts** (6 awareness / 5 consideration / 4 commercial, all unreviewed) plus 14 retired, **240 probe runs**, **1 approved work plan** (`62ff1c2c`, 15 items) — and `predictions` / `control_sets` still empty, which is M6.
- **Two auth users** exist: `mal@growthpartners.co.nz` and Ricky. Postmark is live at 100 emails/hour.

### What M5 actually has to produce

Each work item needs three things it does not have today:

1. **An action** — a verb and a deliverable, not the finding's title. "Add FAQ schema to 14 product pages", not "Question content is marked up as such".
2. **The specific targets** — which pages, which images, which URLs. Mostly already stored.
3. **Acceptance criteria** — how a specialist knows they are done, ideally checkable by re-running the audit.

- **The data is already there.** `findings.affected_urls`, `findings.evidence` (per-check counts, failing URLs, pass rates), `findings.failure_check` and `findings.leading_indicator`. This is mostly a transformation, not a collection problem.
- **Author the actions per `rule_key`, in code, the way `EFFORT` in `server/plan/rank.ts` is authored.** Same reasoning as the effort model and the prompt templates: a model-generated action would read differently every month, so an unfinished item would look like new work. The audit has 23 checks plus 6 observational rules — a bounded, writable set.
- ⚠️ **`affected_urls` is capped at 25 in `findings.ts`.** A finding affecting 60 pages lists 25. An action that says "fix these pages" and lists 25 of 60 is wrong in a way nobody will notice. The real count is in `evidence` (`pagesFailing`, `pagesApplicable`), and the full list is recoverable from `page_snapshots` for that `audit_run_id`. Say "14 of 60, first 25 listed" or re-derive; do not silently truncate.
- **Acceptance criteria should be the audit itself where possible.** "This item is done when `aeo.faq_schema` passes on all 14 pages in the next audit run" is checkable by machine, and it sets up M6's readback for free.

### Don't

- **Don't** treat "couldn't measure" as "measured zero". Broken four times in this project. Check constraints enforce it on `ai_probe_runs` and `work_items`; keep it that way.
- **Don't** exclude `partial` audit runs — partial is the normal outcome above the crawl budget, and excluding them once meant no audit finding could enter a plan at all.
- **Don't** infer scope from an empty list. A candidate with no affected URLs is not automatically site-wide; that assumption let three coin-flip observations outrank every audit finding. Scope is declared (`site` / `pages` / `query`).
- **Don't** group probe work per engine. It was `(probe, engine)` until four engines existed, and then a 0-of-6 signal fragmented into four unrankable singletons. Work is grouped per prompt; the panel keeps the per-engine view. Five tests guard this.
- **Don't** treat a query's absence from the latest month's rows as a fix — Search Console returns top-N, so a query leaves by improving *or* by being crowded out.
- **Don't** re-judge a probe run from `raw_answer` alone, and don't "fix" `rejudge` refusing runs with an empty `engine_sources` — those predate the column and must be re-probed.
- **Don't** let the prompt writer stop retiring. `ignoreDuplicates: true` means it only ever appends unless superseded prompts are deactivated; without that, 15 prompts silently becomes 30 and a five-engine sweep costs double.
- **Don't** retire a reviewed prompt. A signed-off prompt outranks a regenerated set.
- **Don't** change the detector without bumping `DETECTOR_VERSION`, or the ranker without `RANK_METHOD_VERSION`. Both refuse to compare across versions.
- **Don't** let any scored or ranked term read the current time.
- **Don't** trust a 200 from DataForSEO, and don't trust `ListModels` from Gemini — it advertised a model that 404s on a real call. Only a real call is evidence.
- **Don't** assume a Search Console property works because it is listed — 11 of 65 are `siteUnverifiedUser`. And don't sum query rows for a total.
- **Useful:** `npm run plan -- --client storepro --capacity 12` builds and prints a plan with every score term, writes nothing (`--verbose` for full rationales, `--write` to store a draft). `npm run probes -- --client storepro --from-gsc` proposes a prompt set, `--write` stores it and retires what it replaces. `npm run ai-probe -- --client storepro` runs a sweep across all five engines. `npm run test:plan` / `test:prompts` / `test:detector` prove the logic offline. `npm run verify:engines` makes real calls. `npm run audit -- --client storepro --verify` proves audit reproducibility.
- **Local human gates:** `AUTH_DISABLED=true` skips login and its default identity is deliberately not a real `auth.users` row, so every gate rejects it. Set `AUTH_DISABLED_USER_ID` to a real user id to exercise an approval locally.
