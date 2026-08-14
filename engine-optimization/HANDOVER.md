# Engine Optimization — Handover
_2026-08-14 · closes M6 · opens M7 (shape undecided)_

## ▶️ Paste this into a new session

```
Engine Optimization — decide what's next after M6

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M6 landed: one prediction is recorded for Storepro against twelve matched untouched
pages, with the readback window fixed before the change and frozen by the database.
Twelve of the thirteen approved items were refused, each with a reason.

The decision: M7 as written is "a report saying what we did, why, what we expected
AND what happened" — and "what happened" needs October's Search Console figures,
which are final on 5 November. Back-dating is refused by a trigger on purpose. So
M7 is calendar-locked for eleven weeks.

Three options, mine first:

1. SPLIT IT (recommended). Rewrite M7's doneWhen to what is closable now — "a
   specialist publishes a report stating what we did, why, and what we expected,
   with last month's predictions shown as pending and their windows visible" — and
   add a new calendar-locked milestone for the verification itself. Cost: one
   session to reshape milestones[], then the report is buildable immediately. The
   report is also the thing that makes M8's "a specialist runs a cycle unaided"
   testable at all, so it unblocks the most.

2. LEAVE IT WHOLE. Build the report and the verification writer in one milestone
   and let it sit open until November. Honest, and it means the board carries an
   open milestone for eleven weeks with nothing moving — which is exactly what the
   doneWhen rule exists to prevent.

3. SECOND CLIENT FIRST. M6's four matching thresholds — 5 pairs, 40% concentration,
   10 points of divergence, 5x magnitude band — each have exactly one property
   behind them. A second client is the only thing that tests them, and finding out
   they are wrong after the report format is fixed is more expensive than before.
   Blocked on Ricky naming a client, so it cannot be the default.

Decide, update milestones[] in kanban.config.js, then emit the work prompt for
whichever wins and get on with it.
```

## Where we are — for Ricky

- **Just closed:** M6 — the prediction machinery. **Open:** M7, shape undecided (see the paste-block).
- **What it means in plain terms:** the tool now writes down, before any work is done, what it expects that work to achieve — and it writes it against a set of pages we deliberately left alone, over a month chosen in advance. It cannot change its mind afterwards: the database refuses to let a recorded prediction be edited. **Nothing else on the market does this.**
- **The prediction, in one sentence:** the 147 pages getting FAQ markup should show more Search Console impressions in **October** than twelve comparable pages we are not touching — direction only, no percentage, and we have said out loud that our confidence is low.
- **The finding worth reading if you read one:** the obvious control set is "every page we didn't touch", and it would have been wrong. Those pages grew **25%** over the four months before the change while the pages we're fixing sat **flat** — they're product category pages and ours are blog posts. A report built on that control would have called a successful month a failure. Membership is now *matched* page-to-page on how each one moved before the change, and the matcher **refused twelve of the thirteen items** because it could not find a good enough control. That refusal rate is the product, not a shortfall.
- **The date that matters:** the first answer arrives **5 November**. Not sooner, and the system won't let anyone pretend otherwise.
- **Verified by:** prediction `a3e5a8a7` read straight out of Postgres — `expected_magnitude` null, control set `d7de6e64` with 12 matched pages at 8.5 points of pre-period divergence, window `[2026-10-01,2026-11-01)` recorded 01:54:33Z against a plan approved 01:01:46Z; **133 tests across five suites** (13 detector, 38 plan, 24 action, 23 prompt, 35 prediction), typecheck and build clean; working tree clean at `994f604` on both `dev` and `staging`; staging serving `index-Ye_0f7Ex.js` with `/health` 200 and both new endpoints 401 unauthenticated; and all five database guarantees fired at the live database and refused by name.
- ⚠️ **Not verified:** the two new panels were seen rendering against a **local** server running the production bundle, not against staging — signing in to staging needs a magic link. Staging is proved to be *serving that bundle* and to have both endpoints gated, which is one step short of watching them draw.

## 👉 On you

1. **Decide M7's shape.** The paste-block asks it properly. **Default if you don't answer:** split it — the report gets built now against a closable finish line, verification becomes its own calendar-locked milestone.
2. **Review the 15 prompts and sign them off.** Still open from M5. 6 awareness / 5 consideration / 4 commercial, stored **unreviewed**, and every report says so until an analyst signs them. **Default:** the set runs as-is and the panel keeps flagging it.
3. **Do we ever hold a page back on purpose?** New, and it is a methodology decision with a client cost. Today's control is *pages the plan happens not to target* — good for seasonality and core updates, but those pages were never broken the way the treated ones were. A true holdout (leave 15 of the 147 knowingly unfixed for a month) buys a much stronger claim and costs the client real traffic, and it would have to be said to them out loud. **My recommendation: not yet** — revisit once one prediction has actually verified and we know the signal is even visible. **Default:** matched controls only, no page is ever deliberately left broken.
4. **The client list.** Still only Storepro. Names are enough. **Default:** Storepro-only, which is fine until M8 — but see option 3 in the paste-block, because a second client is the only thing that tests M6's thresholds.

**Decided and closed:** Ahrefs Brand Radar ($129/mo) declined, not revisiting. Prompt generation built in-house. Competitor cohort settled at eight domains (v2, 2026-08-14).

## 🔴 Risks you're carrying

- **The loop measures the head of the site and says nothing about the tail.** Search Console returns per-page rows for **50** of Storepro's 202 crawled pages, and only **31** appear in all four months. So the FAQ prediction covers **12 of 147 target pages**. It is stated in words on the prediction rather than hidden, but it means a client could be told "the work we measured moved" about 8% of the work they paid for. Paging the Search Console API further is possible and has not been costed.
- **Four matching thresholds, one property.** 5 pairs, 40% concentration, 10 points of divergence, 5× magnitude band — each declared with a written reason and each exercised against exactly one client. They produced one prediction from thirteen items, which is right for Storepro and may be wrong for a bigger site.
- **The hours are still uncalibrated.** Declared constants in `server/plan/rank.ts`, never checked against how long work took, and M5's target recovery moved several by 25%+ in one release. **Do not quote these hours to a client.** Answerable after two or three cycles via `work_items.shipped_at`.
- **Audit findings are trusted at full confidence, which means reproducible, not correct.** M2 proved two runs of an unchanged site agree; nothing has tested whether the judgements are right. ⚠️ **M6 propagated this one step further than M5 did** — the readback now decides "finished" from those same checks, so a wrong check is now a wrong definition of done being read back automatically.
- **A single probe is still a sample.** The citation sampling design does not exist, 14 of 15 active prompts have no answered run under the current detector, and M6 responded by **refusing to predict a citation rate at all** rather than by guessing. That refusal has to be revisited, not forgotten — it is currently the largest thing the loop cannot see.
- **The prediction assumes the work ships inside August.** The window is anchored to the plan's approval because `shipped_at` is unknown when the prediction is written, and waiting for it would mean choosing the window after the change. If the work slips, the honest outcome is `confounded`. Nothing checks this yet.
- **Two database guarantees still live partly in application code.** `0007`'s supersede weakening and `0009`'s insert-only directive trigger. Both deliberate, both written down, neither has a writer that would break them today.
- **One of M3's five volatility data points may have been our own bug.** Unchanged from M5. Weakens one data point of five; does not overturn the finding.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at `994f604`, working tree clean apart from an untracked `.claude/` that predates this session. Working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase `xslwvntwrlvqccdupmni`. Railway `engine-optimization`, staging auto-deploys on push to `staging`. `main` does not exist.
- **Read first:** `docs/predictions.md` — the whole of M6, and the sections that matter next are *"Part three — the window, fixed before the change"* and *"What this does not cover"*. Then `docs/planning.md` for how an item becomes an instruction, `docs/schema.md` for the `predictions` / `control_sets` model, `docs/ai-visibility.md` for what "cited" means. `README.md` has every command.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul, all complete), 2 audit runs (both `partial` at 147/202 — normal), 15 active prompts (all unreviewed) plus 14 retired, 240 probe runs. Plans: `62ff1c2c` approved (M4, history, leave it), `101a4531` superseded, `70337c95` approved (M5, 13 items, all with directives). **`predictions` holds one row and `control_sets` one row — both written 2026-08-14, both immutable.**
- **The prediction:** `a3e5a8a7` · `aeo.faq_schema` → `gsc_impressions` · up · no magnitude · confidence low · baseline 16,184 over 2026-07 · readback `[2026-10-01,2026-11-01)` · final 2026-11-05 · control `d7de6e64`, 12 pairs, divergence 0.085.

### What M6 built, and where

| File | What it does |
|---|---|
| `server/predict/control.ts` | The matcher, and the four declared thresholds. **The refusals are the interface** — read `ControlRefusal` before changing anything here. Pure. |
| `server/predict/windows.ts` | `READBACK` latency table + `CHANGE_TYPE` per rule. Pure and clock-free: the window is a function of `work_plans.approved_at` and nothing else. |
| `server/predict/predict.ts` | `MECHANISM` — an authored reason to expect a metric to move, per rule, or an authored reason there is none. `FORBIDDEN_METRICS` is the permanent refusal list. |
| `server/predict/readback.ts` | Acceptance criteria against an audit run. Four verdicts, not two. Dispatches on `mode`, never on `scope`. |
| `db/migrations/0010_predictions.sql` | Control set NOT NULL, terms frozen by trigger, back-dating rejected, window ordering, outcome-carries-control. |
| `server/predict/predict.test.ts` | 35 tests, each named after a way a prediction can be a lie that still looks like a measurement. |

### Don't

- **Don't** loosen a matching threshold to get more predictions. One honest prediction and twelve stated refusals is the product; thirteen confident numbers nobody will check is every other tool.
- **Don't** predict an audit score. It rises by construction the moment its own check is fixed — the size of the rise is in `score_detail` before anybody starts — and it would make the loop appear to work every single month. On `FORBIDDEN_METRICS` permanently.
- **Don't** predict a citation rate until the sampling design exists. It is the number a client would most want to believe and it currently rests on a sample nobody has bounded.
- **Don't** put a magnitude on a prediction. Nothing here has been verified against an outcome, so any percentage is invented — and a fabricated number is the one a client remembers.
- **Don't** let anything in `windows.ts` read the clock. The entire claim is that the window was fixed before the change; a window derived from `now()` cannot be re-derived, and the guarantee evaporates.
- **Don't** try to close the loop early or back-date a window. The trigger refuses it by name, and it is refusing the correct thing.
- **Don't** treat a target page the crawl did not reach as a page that passed. Above the crawl budget that is the normal case, and it is the fifth appearance of the "couldn't measure = measured zero" failure in this project.
- **Don't** mark an item shipped from the readback. It reports; a specialist decides. "The audit says this check passes" and "this work is done" are different claims.
- **Don't** use a control page that any *other* item on the plan targets. It is a treated page with a delay on it.
- **Don't** dispatch an acceptance criterion on `scope`. Every observational rule is authored `{mode: "finding_absent", scope: "site"}`, and looking those up as scored checks reports six clear answers as "no result".
- **Don't** generate an action, a rationale, a prompt or a mechanism with a model. Authored per key, for the same reason throughout: a sentence that reads differently every month makes an unfinished item look like new work.
- **Don't** rewrite plan `62ff1c2c`'s items, forge a human gate, or exclude `partial` audit runs. All three unchanged from M5 and all three still true.
- **Don't** change the detector without bumping `DETECTOR_VERSION`, the ranker without `RANK_METHOD_VERSION`, the actions without `ACTION_METHOD_VERSION`, or the mechanism table / matching rules without `PREDICTION_METHOD_VERSION`. All four refuse to compare across versions.
- **Don't** trust a claim in a handover you cannot check. It cost thirty seconds to find that two documents were wrong about who had signed in.

### Useful

```bash
npm run predict  -- --client storepro             # build and print; writes nothing
npm run predict  -- --client storepro --verbose   # every matched pair, every refusal in full
npm run predict  -- --client storepro --write     # record; immutable afterwards
npm run readback -- --client storepro             # acceptance criteria against the latest audit run
npm run audit    -- --client storepro             # produce a run that can say whether anything changed
npm run test:predict                              # 35 tests, offline
npm run plan -- --client storepro --capacity 12 --verbose
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity is deliberately not a real `auth.users` row, so every gate rejects it. `AUTH_DISABLED_USER_ID` set to a real id exercises an approval locally — the record is still attributed to that human, so it is not a substitute for them approving it themselves.
