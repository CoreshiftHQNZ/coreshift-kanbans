# Engine Optimization — Handover
_2026-08-14 · M5 landed · M6 open_

## ▶️ Paste this into a new session

```
Engine Optimization M6 — The prediction machinery

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M5 landed: every item in the approved plan is now an instruction — what to do, which
specific pages, and a definition of finished that a machine can decide. M6 is the
reason the product exists: record what we expect a change to achieve, against a
matched control set of pages we deliberately did not touch, with the readback window
fixed BEFORE the change rather than chosen afterwards.

Nothing on the market does this. Every tool recommends work; none writes down what it
expected and then checks.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **Just closed:** M5 — actionable work. **Now open:** M6 — the prediction machinery.
- **What actually changed:** the plan stopped describing problems and started giving instructions. The top item used to read *"Question content is marked up as such · 14.5h"*. It now reads:

  > **Add FAQPage, QAPage or HowTo JSON-LD to the 147 pages listed on this item, mirroring question-and-answer content that is already visible on each page.**
  > *Done when this exists:* every listed page carries answer-type JSON-LD whose questions and answers match, word for word, Q&A content a visitor can see.
  > *Accepted when:* the next audit run reports `aeo.faq_schema` passing on all 147 pages listed on this item.

  All 147 URLs are on the item. Someone on the team can open it and start. **769 named target URLs across the thirteen items**, and twelve of the thirteen have a finish line a machine can decide.
- **The thing worth knowing, if you read one paragraph:** the plan had been quoting **147 pages of work as 25**, and nothing in it could have shown you. Findings cap their evidence at 25 URLs — right for evidence, wrong the moment it becomes an instruction — and the hours are computed from that list. Every page-level finding was affected. Real counts: 35, 39, 41, 55, 62, 70, 91, 94, 107, 147. **The plan's total went from 234.1h to 268.5h with no new work found.**
- **You passed a human gate for the first time.** Row created 01:00:34Z, signed in 01:00:50Z, plan approved 01:01:46Z. Two documents had claimed this already happened; `auth.users` said otherwise, and both have been corrected on the board.
- **Verified by:** plan `70337c95` read straight out of Postgres — `status=approved`, approved 2026-08-14 01:01:46Z by `ricky@coreshifthq.com`, **13 of 13 items approved and attributed, 13 with an action, 13 with acceptance criteria, 13 with targets, 0 unauthored, 0 blank rationales, 0 without a source**; 97 tests across four suites (12 detector, 38 plan, 23 prompt, 24 action); typecheck and build clean; working tree clean at `754e70d` on both `dev` and `staging`; staging serving `index-CY2XdO6r.js` with `/health` 200 and the plan endpoint 401 unauthenticated.
- **Next:** M6, and the paste-block above starts it.

## 👉 On you

1. **Review the 15 prompts and sign them off.** Stored **unreviewed**, and every report says so until an analyst signs them. 6 awareness / 5 consideration / 4 commercial. Read them in the app and cut or reword anything that is not how a buyer would ask. ⚠️ **This costs more than it did in M4:** 14 of the 15 have no answered run under the current detector, so the plan carries **one** citation item where M4's carried three. **Default if you don't answer:** the set runs as-is and the panel keeps flagging it on every screen.
2. **Declare Storepro's competitor cohort in the app.** The panel is built and waiting — you add the domains and it records who declared them and why. Seen citing alongside Storepro across four engines: `dexion.co.nz`, `palletrackingsolutions.co.nz`, `shelvingshopgroup.co.nz`, `stackit.co.nz`. **This one now blocks something concrete:** without a cohort, competitor displacement cannot be a prediction subject in M6, and the report records it as *not measured*. **Default if you don't answer:** predictions run on traffic and citation presence only.
3. **The client list.** Still only Storepro. 47 hosts have working Search Console access with no way to tell a retainer client from an old access grant. Names are enough. **Default if you don't answer:** Storepro-only, which is fine until M8.

**Decided and closed:** Ahrefs Brand Radar ($129/mo) — declined as too expensive, not revisiting. Prompt generation built in-house rather than bought.

## 🔴 Risks you're carrying

- **The hours are still uncalibrated, and M5 raised the stakes.** Declared constants in `server/plan/rank.ts`, labelled as estimates everywhere they appear, never checked against how long the work took. An item naming 147 specific pages and an 18-hour figure invites someone to schedule against the number — and the target-recovery correction moved several estimates by 25%+ in a single release, which is itself evidence they were never load-bearing. **Do not quote these hours to a client.** `work_items.shipped_at` makes it answerable after two or three cycles.
- **A single probe is still a sample, and M6 will want to predict on it.** The sampling design — n sweeps across a window, reported as a rate with its sample size — still does not exist. The prompt set was rebuilt after M4, so 14 of 15 active prompts have no answered run under the current detector. Month-over-month citation deltas remain unsafe to show a client. M5 handled this honestly rather than fixing it: a probe item's acceptance is a rate comparison at a stated sample and says in as many words that one improved sweep is not evidence. ⚠️ **A prediction whose subject is a citation rate rests on this, so M6 has to decide early whether citations are a legitimate prediction subject yet.**
- **Audit findings are trusted at full confidence, and that means reproducible, not correct.** M2 proved two runs of an unchanged site agree; nothing has tested whether the judgements are right. ⚠️ **M5 propagated this further than M4 did** — an acceptance criterion that says *"`aeo.faq_schema` passes on all 147 pages"* inherits whatever is wrong with the check, and now inherits it as a *definition of done*.
- **The demand signal is truncated toward the head.** Top-N Search Console rows — 50 pages carrying 57,456 of 77,496 impressions. Work outside those rows ranks with no demand signal. ⚠️ Note the asymmetry M5 introduced: the *page* truncation is fixed and the *demand* truncation is not, so an item can name all 147 affected pages while scoring on the handful Search Console returned.
- **One of M3's five volatility data points may have been our own bug.** The two M3 sweeps straddled a detector change. The three "AI Overview appeared or vanished" changes stand regardless; "one citation flipped" may be the detector rather than Google. Weakens one data point of five; does not overturn the finding.
- **`intent` on a prompt is cosmetic.** All 15 classify `informational` because the regex cannot see commercial intent. `funnel_stage` does the real work. DataForSEO's `search_intent` would fix it for ~$0.013/client.
- **Two database guarantees now live partly in application code.** `0007` weakened "every superseded plan names its successor" to "a successor pointer may only appear on a superseded plan". `0009` requires a directive on every item *inserted* into a plan via a trigger, so an UPDATE could still blank one and the CHECK would allow it — the CHECK has to permit the pre-M5 rows to exist at all. Both deliberate, both written down, neither has a writer that would do it today.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at `754e70d`, working tree clean. Working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase `xslwvntwrlvqccdupmni`. Railway `engine-optimization`, staging auto-deploys on push to `staging`. `main` does not exist.
- **Read first:** `docs/planning.md` — covers both the ranking (M4) and the instruction (M5); the section *"From a ranked finding to a job"* is what M6 builds on, and *"Acceptance: the audit is the check"* is the specific hook. Then `docs/schema.md` for `predictions` and `control_sets`, `docs/scoring.md`, `docs/ai-visibility.md`. `README.md` has the commands.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul), 2 audit runs (both `partial` at 147/202 — normal), 15 active prompts (all unreviewed) plus 14 retired, 240 probe runs. **Three work plans: `62ff1c2c` approved (M4, 15 items, no directives — history, leave it), `101a4531` superseded, `70337c95` approved (M5, 13 items, all with directives).** `predictions` and `control_sets` are still empty — that is M6.
- **Two auth users:** `mal@growthpartners.co.nz` (`ac3e0ebb-…`) and `ricky@coreshifthq.com`, created 2026-08-14 01:00:34Z. Both have approved a plan. Postmark live at 100 emails/hour, allowlist `growthpartners.co.nz,coreshifthq.com` confirmed against the deployed `/auth-config`.

### What M5 built, and where

| File | What it does |
|---|---|
| `server/plan/actions.ts` | The 29 authored actions, one per rule the audit can emit, plus the probe and anomaly directives. Pure. **Extend this when a check is added** — `test:actions` fails if a rule has no action. |
| `server/plan/targets.ts` | Recovers the complete affected-page set from `page_snapshots` by running the audit's own predicate over reconstructed `PageSignals`. Pure — the DB read lives in `sources.ts` so `rank.ts` stays provable offline. |
| `server/audit/findings.ts` | `OBSERVED_PAGE_RULES` — the observational predicates lifted into a named table so `targets.ts` uses the *same function object*, not a second copy that could drift. |
| `db/migrations/0009` | `work_items.directive`, a CHECK that it is absent-or-complete, a `before insert` trigger requiring one on any planned item, and a GIN index on `acceptance` for M6's readback. |
| `server/plan/actions.test.ts` | 24 tests, each named after a way an instruction can lie. |

### Where M6 starts

- **The acceptance criteria are already structured for it.** `directive.acceptance[]` carries `{ruleKey, mode: "rule_passes" | "finding_absent", scope, passRate}`, GIN-indexed. Twelve of the thirteen approved items are decidable by re-running the audit. **Nothing reads them back yet — that is M6's first move**, and it is what turns "finished" from a claim into a fact.
- **A prediction attaches to a committed action.** The item, its 147 named targets and its acceptance criterion are the "because we did Y"; the approval is what makes it committed. All of that now exists on plan `70337c95`.
- **The calendar is a hard constraint, not a build one.** A prediction recorded in August reads back against September, which lands in Search Console in early October. M6's `doneWhen` is deliberately about *recording* a prediction with a fixed window — the verification lands in M7, on the calendar. Do not try to close the loop in one session, and do not back-date against a month already on file.

### Don't

- **Don't** raise the 25-URL evidence cap to "fix" a truncated target list. The cap is correct for a finding. The recovery is the fix, and it works because `page_snapshots` retains the whole crawl.
- **Don't** let `targets.ts` and the audit hold two copies of a predicate. It re-runs `CHECKS[key].evaluate` and `OBSERVED_PAGE_RULES[key]` — the same objects. A copy that drifts makes the plan and the audit disagree about which pages are broken, silently.
- **Don't** delete the recovery self-check. If the re-derived set does not contain every URL the audit recorded, the recovery loses to the audit. Losing an expansion costs a caveat; trusting a wrong one sends someone to the wrong pages.
- **Don't** generate an action, a rationale or a prompt with a model. Authored per key, for the same reason throughout: a sentence that reads differently every month makes an unfinished item look like new work.
- **Don't** label a manual acceptance criterion `audit_rule`. That is the unenforced checklist this product exists to replace, wearing a machine's clothes.
- **Don't** name a page on a probe item. The probe records absence from an answer, not which page should have been there.
- **Don't** rewrite plan `62ff1c2c`'s items to give them directives. It is approved, and an approved plan is the record a client's report cites.
- **Don't** forge a human gate. The fastest way to land M5 was to write the approval as Mal locally; it would have put a named colleague's signature on a plan he had never seen, in an immutable table. Every gate takes its identity from the verified session on purpose.
- **Don't** treat "couldn't measure" as "measured zero". Broken four times in this project, and M5's target recovery was the fifth opportunity.
- **Don't** exclude `partial` audit runs — partial is the normal outcome above the crawl budget.
- **Don't** infer scope from an empty list. Scope is declared (`site` / `pages` / `query`).
- **Don't** group probe work per engine. Work is grouped per prompt; the panel keeps the per-engine view. Five tests guard this.
- **Don't** treat a query's absence from the latest month's rows as a fix — Search Console returns top-N, so a query leaves by improving *or* by being crowded out.
- **Don't** re-judge a probe run from `raw_answer` alone, and don't "fix" `rejudge` refusing runs with an empty `engine_sources` — those predate the column and must be re-probed.
- **Don't** let the prompt writer stop retiring, and don't retire a reviewed prompt.
- **Don't** change the detector without bumping `DETECTOR_VERSION`, the ranker without `RANK_METHOD_VERSION`, or the actions without `ACTION_METHOD_VERSION`. All three refuse to compare across versions.
- **Don't** let any scored or ranked term read the current time.
- **Don't** trust a 200 from DataForSEO, and don't trust `ListModels` from Gemini. Only a real call is evidence.
- **Don't** assume a Search Console property works because it is listed — 11 of 65 are `siteUnverifiedUser`. And don't sum query rows for a total.
- **Don't** trust a claim in a handover you cannot check. Two documents said Ricky had signed in; `auth.users` held one row and it was Mal's. Checking took thirty seconds.

### Useful

```bash
npm run plan -- --client storepro --capacity 12            # prints every instruction inside the line
npm run plan -- --client storepro --capacity 12 --verbose  # every item, every target URL, every rationale
npm run plan -- --client storepro --capacity 12 --write    # store as the client's draft
npm run test:actions                                       # prove the instructions, offline
npm run test:plan / test:prompts / test:detector           # the other three suites
npm run audit -- --client storepro --verify                # prove audit reproducibility
npm run ai-probe -- --client storepro                      # a sweep across all five engines
npm run verify:engines                                     # real calls; the only evidence a key works
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity is deliberately not a real `auth.users` row, so every gate rejects it. `AUTH_DISABLED_USER_ID` set to a real id exercises an approval locally — but the record is still attributed to that human, so it is not a substitute for them approving it themselves.
