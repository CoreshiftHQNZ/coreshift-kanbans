# Engine Optimization — Handover
_2026-08-14 · closes M6 · opens M7 · arc grew to 9_

## ▶️ Paste this into a new session

```
Engine Optimization M7 — Monthly report

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M6 landed: one prediction is recorded for Storepro against twelve matched untouched
pages, with the readback window fixed before the change and frozen by the database.
Twelve of the thirteen approved items were refused, each with a reason.

M7 is the report a client actually reads. It was split on 2026-08-14 — the old
version demanded "what happened", which needs October data that is final on
5 November, and a milestone nobody can move for eleven weeks is exactly the quiet
expansion a doneWhen exists to prevent. The verdict is now M8. What is left is
buildable today: bind the month's applied work to its originating findings, carry
each item's rationale verbatim, and show last cycle's predictions as PENDING with
their readback windows visible.

That last part is the whole point. Every SEO report on the market states what was
done. This one states what we expected before we did it, what we are comparing it
against, and the date we will know — including the twelve items we refused to
predict on and why.

The report has to survive its own honesty: one prediction, low confidence,
direction only, covering 12 of 147 pages. If that reads as thin rather than as
rigorous, the fix is in the writing, not in loosening a threshold.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **Just closed:** M6 — the prediction machinery. **Now open:** M7 — the monthly report. **The arc grew from 8 to 9**, on your call: the verification half became its own milestone (M8) because it cannot happen before November, and handover moved to M9.
- **What M6 means in plain terms:** the tool now writes down, before any work is done, what it expects that work to achieve — against a set of pages we deliberately left alone, over a month chosen in advance. It cannot change its mind afterwards: the database refuses to let a recorded prediction be edited. **Nothing else on the market does this.**
- **The prediction, in one sentence:** the pages getting FAQ markup should show more Search Console impressions in **October** than twelve comparable pages we are not touching — direction only, no percentage, and we have said out loud that our confidence is low.
- **The finding worth reading if you read one:** the obvious control set is "every page we didn't touch", and it would have been wrong. Those pages grew **25%** over the four months before the change while the pages we're fixing sat **flat** — they're product category pages and ours are blog posts. A report built on that control would have called a successful month a failure. Membership is now *matched* page-to-page on how each one moved beforehand, and the matcher **refused twelve of the thirteen items** because it could not find a good enough control. That refusal rate is the product, not a shortfall.
- **You signed the prompts off, and doing it found a bug.** The sign-off gate took a free-text name and left `reviewed_by` empty — it recorded that *somebody* approved the set and made it impossible to say who. Now fixed: it takes an email that must resolve to a real user, and refuses one that doesn't. Your sign-off is on the record properly.
- **The date that matters:** the first answer arrives **5 November**. Not sooner, and the system won't let anyone pretend otherwise.
- **Verified by:** prediction `a3e5a8a7` read straight out of Postgres — `expected_magnitude` null, control set `d7de6e64` with 12 matched pages at 8.5 points of pre-period divergence, window `[2026-10-01,2026-11-01)` recorded 01:54:33Z against a plan approved 01:01:46Z; **15 active prompts reviewed and attributed to `ricky@coreshifthq.com`** with the 14 retired ones untouched, and an unknown reviewer refused by name; **133 tests across five suites** (13 detector, 38 plan, 24 action, 23 prompt, 35 prediction), typecheck and build clean; working tree clean at `c33c617` on `dev` and `staging`; staging serving `index-Ye_0f7Ex.js` with `/health` 200 and both new endpoints 401 unauthenticated; all five database guarantees fired at the live database and refused by name.
- **Not verified:** the two new panels were seen rendering against a **local** server running the production bundle, not against staging — that needs a magic link. Staging is proved to be serving that exact bundle and to have both endpoints gated, which is one step short of watching them draw.

## 👉 On you

**Nothing.** All four open questions were answered on 2026-08-14 — M7 split, prompts signed off, no holdouts, Storepro-only. One standing note rather than a request:

1. **A second client, when you're ready.** Not blocking M7 or M8. It matters more than it looks because every threshold M6 declared — 5 pairs, 40% concentration, 10 points of divergence, 5× magnitude band — has exactly one property behind it, and finding out one is wrong *after* the report format is fixed costs more than finding out before. **Default:** Storepro-only until you name one.

**Decided and closed:** M7 split, verification moved to M8 (2026-08-14). No deliberate holdouts — matched controls only, revisit once a prediction has actually verified. Ahrefs Brand Radar declined, not revisiting. Prompt generation in-house. Competitor cohort settled at eight domains.

## 🔴 Risks you're carrying

- **The loop measures the head of the site and says nothing about the tail.** Search Console returns per-page rows for **50** of Storepro's 202 crawled pages, and only **31** appear in all four months — so the prediction covers **12 of 147 target pages**. Stated in words on the prediction rather than hidden, but a client could be told "the work we measured moved" about 8% of the work they paid for. Paging the Search Console API further is possible and has not been costed. **This is the single most likely thing to embarrass the first report.**
- **Four matching thresholds, one property.** Each declared with a written reason and each exercised against exactly one client. They produced one prediction from thirteen items, which is right for Storepro and may be wrong for a bigger site.
- **The hours are still uncalibrated.** Declared constants in `server/plan/rank.ts`, never checked against how long work took, and M5's target recovery moved several by 25%+ in one release. **Do not quote these hours to a client.**
- **Audit findings are trusted at full confidence, which means reproducible, not correct.** M2 proved two runs of an unchanged site agree; nothing has tested whether the judgements are right. ⚠️ **M6 propagated this a step further** — the readback now decides "finished" from those same checks, so a wrong check is a wrong definition of done being read back automatically.
- **A single probe is still a sample.** The citation sampling design does not exist and M6 responded by **refusing to predict a citation rate at all** rather than guessing. That refusal has to be revisited, not forgotten — it is the largest thing the loop currently cannot see, and it is what a client will ask about by name.
- **The prediction assumes the work ships inside August.** The window is anchored to the plan's approval because `shipped_at` is unknown when the prediction is written. If the work slips, the honest outcome is `confounded`. Nothing checks this yet — it belongs with M8's verification writer.
- **There is no in-app prompt sign-off.** The gate is a CLI flag. Fine while Ricky is the only reviewer; it is a real gap for M9's "a specialist runs a cycle unaided", and it should be a surface in M7 or M8 rather than a discovery in M9.
- **Two database guarantees still live partly in application code.** `0007`'s supersede weakening and `0009`'s insert-only directive trigger. Both deliberate, both written down, neither has a writer that would break them today.
- **One of M3's five volatility data points may have been our own bug.** Unchanged. Weakens one data point of five; does not overturn the finding.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at `c33c617`, working tree clean apart from an untracked `.claude/` that predates this session. Working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase `xslwvntwrlvqccdupmni`. Railway `engine-optimization`, staging auto-deploys on push to `staging`. `main` does not exist.
- **Read first:** `docs/predictions.md` — all of M6. The sections M7 builds on are *"Coverage is stated, never blended into confidence"* and *"What this does not cover"*. Then `docs/planning.md` (an item's rationale is the report's "why"), `docs/schema.md` for `reports` / `cycles` / `predictions`, `docs/ai-visibility.md` for what "cited" means. `README.md` has every command.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul, all complete), 2 audit runs (both `partial` at 147/202 — normal), **15 active prompts, all reviewed and attributed**, plus 14 retired and untouched, 240 probe runs. Plans: `62ff1c2c` approved (M4, history, leave it), `101a4531` superseded, `70337c95` approved (M5, 13 items with directives). `predictions` and `control_sets` hold one row each, both written 2026-08-14, both immutable. `reports` is empty — that is M7.
- **The prediction M7 has to render:** `a3e5a8a7` · `aeo.faq_schema` → `gsc_impressions` · up · no magnitude · confidence low · baseline 16,184 over 2026-07 · readback `[2026-10-01,2026-11-01)` · final 2026-11-05 · control `d7de6e64`, 12 pairs, divergence 0.085. Plus the **twelve refusals**, which belong in the report and not in a footnote.

### What M6 built, and where

| File | What it does |
|---|---|
| `server/predict/control.ts` | The matcher and its four declared thresholds. **The refusals are the interface** — read `ControlRefusal` before changing anything. Pure. |
| `server/predict/windows.ts` | `READBACK` latency table + `CHANGE_TYPE` per rule. Pure and clock-free: the window is a function of `work_plans.approved_at` and nothing else. |
| `server/predict/predict.ts` | `MECHANISM` — an authored reason to expect a metric to move, per rule, or an authored reason there is none. `FORBIDDEN_METRICS` is the permanent refusal list. |
| `server/predict/readback.ts` | Acceptance criteria against an audit run. Four verdicts, not two. Dispatches on `mode`, never on `scope`. |
| `db/migrations/0010_predictions.sql` | Control set NOT NULL, terms frozen by trigger, back-dating rejected, window ordering, outcome-carries-control. |
| `server/predict/predict.test.ts` | 35 tests, each named after a way a prediction can be a lie that still looks like a measurement. |
| `server/cli/probes.ts` | The sign-off gate, now identity-bearing. `--review <email>` must resolve to a real `auth.users` row. |

### Don't

- **Don't** let the report state a raw before/after. Delta-vs-control or nothing — a raw delta is the claim this whole product replaces, and it will be the easiest thing to accidentally write.
- **Don't** hide the twelve refusals in the report. What we refuse to claim is the only reason to believe what we do claim, and a report showing one confident prediction and no refusals is indistinguishable from every competitor's.
- **Don't** quote effort hours to a client. Uncalibrated, and M5 moved several by 25% in one release.
- **Don't** loosen a matching threshold to get more predictions. One honest prediction and twelve stated refusals is the product.
- **Don't** predict an audit score — it rises by construction when its own check is fixed. On `FORBIDDEN_METRICS` permanently.
- **Don't** predict a citation rate until the sampling design exists.
- **Don't** put a magnitude on a prediction. Nothing has been verified against an outcome, so any percentage is invented.
- **Don't** let anything in `windows.ts` read the clock, and **don't** back-date a window. The trigger refuses it by name, and it is refusing the correct thing.
- **Don't** treat a target page the crawl did not reach as a page that passed. Fifth appearance of "couldn't measure = measured zero" in this project.
- **Don't** mark an item shipped from the readback. It reports; a specialist decides.
- **Don't** use a control page any *other* item on the plan targets — it is a treated page with a delay on it.
- **Don't** dispatch an acceptance criterion on `scope`. Every observational rule is authored `{mode: "finding_absent", scope: "site"}`.
- **Don't** generate an action, rationale, prompt or mechanism with a model. Authored per key throughout, so an unfinished item never looks like new work.
- **Don't** rewrite plan `62ff1c2c`'s items, or the `inputs` on `70337c95` — its "15 of 15 prompts unreviewed" note records what was true when it was built, and a fresh plan run already says zero.
- **Don't** forge a human gate, mark a retired prompt reviewed, or retire a reviewed one.
- **Don't** exclude `partial` audit runs, infer scope from an empty list, or sum Search Console query rows for a total.
- **Don't** change the detector without bumping `DETECTOR_VERSION`, the ranker without `RANK_METHOD_VERSION`, the actions without `ACTION_METHOD_VERSION`, or the mechanisms / matching rules without `PREDICTION_METHOD_VERSION`.
- **Don't** trust a claim in a handover you cannot check. It cost thirty seconds to find that two documents were wrong about who had signed in.

### Useful

```bash
npm run predict  -- --client storepro --verbose    # every matched pair, every refusal in full
npm run readback -- --client storepro              # acceptance criteria against the latest audit run
npm run plan     -- --client storepro --capacity 12 --verbose
npm run probes   -- --client storepro              # the reviewed set, with ✓ per prompt
npm run audit    -- --client storepro              # a run that can say whether anything changed
npm run test:predict                               # 35 tests, offline
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity is deliberately not a real `auth.users` row, so every gate rejects it. `AUTH_DISABLED_USER_ID` set to a real id exercises an approval locally — the record is still attributed to that human, so it is not a substitute for them approving it themselves.
