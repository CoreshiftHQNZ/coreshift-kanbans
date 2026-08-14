# Engine Optimization — Handover
_2026-08-14 · M5 built and verified · one approval click from landed_

## ▶️ Paste this into a new session

```
Engine Optimization M6 — The prediction machinery

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M5 made every work item an instruction with machine-checkable acceptance criteria.
M6 attaches a prediction to a committed action and checks it against a control —
"we expected X because we did Y", where Y is now a specific, dated, finished thing.

⚠️ FIRST: check whether the draft plan has been approved. If it has not, M5 is
still open and closing it is the first move — see 'On you' below.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **M5 is built, tested and deployed. It is not landed.** Its `doneWhen` says *approved* plan, and the draft is unapproved. That is one sign-in and one click — see 👉 below.
- **In plain terms:** M4's plan could tell you what mattered most this month. It could not tell anyone what to *do*. The top item read *"Question content is marked up as such · 14.5h"*. It now reads:

  > **Add FAQPage, QAPage or HowTo JSON-LD to the 147 pages listed on this item, mirroring question-and-answer content that is already visible on each page.**
  > *Done when this exists:* every listed page carries answer-type JSON-LD whose questions and answers match, word for word, Q&A content a visitor can see.
  > *Accepted when:* the next audit run reports `aeo.faq_schema` passing on all 147 pages listed on this item.

  All 147 URLs are on the item. A specialist can open it and start.
- **The thing worth knowing, if you read one paragraph:** the plan was quoting **147 pages of work as 25**, and nothing in it could have shown you. Findings cap their evidence at 25 URLs — right for an evidence blob, wrong the moment it becomes an instruction — and the hours are computed from that list. Every page-level finding in Storepro's plan was affected. The real counts are 35, 39, 41, 55, 62, 70, 91, 94, 107 and 147. **The plan's total went from 234.1h to 268.5h with no new work found.**
- **Also true, and it is a discipline thing:** the fix was not a bigger cap. `page_snapshots` already retained the whole crawl from M2, stored precisely so a question asked later could be answered without a re-crawl. The full list is recovered by running *the audit's own predicate* over it — and where it cannot be (one rule, derived from sitemap data), the item says "25 of 126 listed" and names the reason rather than presenting 25 as the job.
- **Verified by:** 97 tests across four suites (12 detector, 38 plan, 23 prompt, **24 new action**), typecheck and build clean; draft plan `70337c95` read straight out of Postgres — **13 of 13 items with an action and at least one acceptance criterion, 0 unauthored, 12 machine-checkable**; the recovery independently reproducing the audit's own failing-page count on all nine recoverable rules; the database refusing an item written into a plan without a directive (attempted, rejected, nothing left behind); staging deployed and returning 401 unauthenticated. Commit `754e70d`.
- **Next:** approve the plan to close M5, then M6.

## 👉 On you

1. **Approve the draft work plan. It closes M5.** Draft `70337c95` is in the app: 13 items, 268.5h, 2 inside a 12-hour line. Open the top two, read the instruction, approve. **Nobody else can do this** — `POST /plans/:id/approve` takes the approver from the verified session and never from the request body, so an approval that is not a real signed-in human is exactly what the gate exists to prevent. Mal can do it instead of you; it does not have to be you. **Default if you don't answer:** M5 stays open on a click, finished code sitting behind it, and M6 cannot start — a prediction attaches to a *committed* action.
2. **Review the 15 prompts and sign them off.** Unchanged from the last handover. Stored **unreviewed**, and every report says so until an analyst signs them. 6 awareness / 5 consideration / 4 commercial. **Default:** the set runs as-is and the panel keeps flagging it. ⚠️ Note this now costs more than it did: 14 of the 15 have no answered run under the current detector, so the plan carries **one** citation item where M4's carried three.
3. **Declare Storepro's competitor cohort.** Unchanged. Seen citing alongside Storepro across four engines: `dexion.co.nz`, `palletrackingsolutions.co.nz`, `shelvingshopgroup.co.nz`, `stackit.co.nz`. **Default:** predictions run on traffic and citation presence only.
4. **The client list.** Unchanged. Still only Storepro; 47 hosts have working Search Console access with no way to tell a retainer client from an old access grant. **Default:** Storepro-only, fine until M8.

**Decided and closed:** Ahrefs Brand Radar ($129/mo) — declined, not revisiting. Prompt generation built in-house.

## 🔴 Risks you're carrying

- **The hours are still uncalibrated, and M5 raised the stakes.** Declared constants, labelled as estimates everywhere. An item naming 147 specific pages and an 18-hour figure invites someone to schedule against the number — and the target-recovery correction moved several estimates by 25%+ in one release, which is itself evidence they were never load-bearing. **Do not quote these hours to a client.** `work_items.shipped_at` makes it answerable after two or three cycles.
- **A single probe is still a sample.** Unchanged and not addressed by M5. Every prompt has n≥3 in the *stored* history, but the prompt set was rebuilt and the new prompts have almost no runs — 14 of 15 have none under the current detector. The sampling *design* (n sweeps across a window, reported as a rate with its sample size) still does not exist, and month-over-month citation deltas remain unsafe to show a client. M5 handles this honestly rather than fixing it: a probe item's acceptance is a rate comparison at a stated sample and says in as many words that one improved sweep is not evidence.
- **Audit findings are trusted at full confidence, and that means reproducible, not correct.** Unchanged. M2 proved two runs agree; nothing has tested whether the judgements are right. ⚠️ **M5 propagates this further than M4 did** — an acceptance criterion that says "`aeo.faq_schema` passes on all 147 pages" inherits whatever is wrong with the check, and now it inherits it as a *definition of done*.
- **One of M3's five volatility data points may have been our own bug.** Unchanged. Weakens one data point of five; does not overturn the finding.
- **The demand signal is truncated toward the head.** Unchanged — top-N Search Console rows, 50 pages carrying 57,456 of 77,496 impressions. Work outside those rows ranks with no demand signal. ⚠️ Worth noting the *page* truncation is now fixed and the *demand* truncation is not: an item can name all 147 affected pages while scoring on the handful of them Search Console returned.
- **`intent` on a prompt is cosmetic.** Unchanged. All 15 classify `informational`; `funnel_stage` does the real work. DataForSEO's `search_intent` would fix it for ~$0.013/client.
- **Two database guarantees now live partly in application code.** `0007`'s supersede weakening, and now `0009`: the directive requirement is a `before insert` trigger, so an UPDATE could blank one and the CHECK would allow it. Both are deliberate, both are written down, and neither has a writer that would do it today.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at `754e70d`, working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase `xslwvntwrlvqccdupmni`. Railway `engine-optimization`, staging auto-deploys on push to `staging`. `main` does not exist.
- **Read first:** `docs/planning.md` — now covers both the ranking (M4) and the instruction (M5); the section *"From a ranked finding to a job"* is the one M6 builds on. Then `docs/ai-visibility.md`, `docs/scoring.md`, `docs/schema.md`. `README.md` has the commands.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul), 2 audit runs (both `partial` at 147/202 — normal), 15 active prompts (all unreviewed) plus 14 retired, 240 probe runs, **2 work plans: `62ff1c2c` approved (M4, 15 items, no directives) and `70337c95` draft (M5, 13 items, all with directives)**. `predictions` / `control_sets` still empty — that is M6.
- **Two auth users:** `mal@growthpartners.co.nz` and Ricky. Postmark live at 100 emails/hour.

### What M5 built, and where

| File | What it does |
|---|---|
| `server/plan/actions.ts` | The 29 authored actions, one per rule the audit can emit. Pure. **This is the file to extend when a check is added.** |
| `server/plan/targets.ts` | Recovers the complete affected-page set from `page_snapshots` by running the audit's own predicate. Pure — the DB read lives in `sources.ts` so `rank.ts` stays provable offline. |
| `server/audit/findings.ts` | `OBSERVED_PAGE_RULES` — the observational predicates, lifted out into a named table so `targets.ts` uses the *same function object* rather than a second copy that could drift. |
| `db/migrations/0009` | `work_items.directive`, a CHECK that it is absent-or-complete, and a `before insert` trigger requiring one on any item written into a plan. |
| `server/plan/actions.test.ts` | 24 tests, each named after a way an instruction can lie. |

### Where M6 starts

- **The acceptance criteria are already structured for it.** `directive.acceptance[]` carries `{ruleKey, mode: "rule_passes" | "finding_absent", scope, passRate}`, GIN-indexed. Twelve of thirteen items are decidable by re-running the audit. **Nothing reads them back yet — that is M6's first move**, and it is what turns "finished" from a claim into a fact.
- **A prediction attaches to a *committed* action.** The item, its targets and its acceptance criterion are the "because we did Y". The approval is what makes it committed.

### Don't

Everything on M4's list still holds. Read it in the previous handover if you have it; the ones M5 touched or added:

- **Don't** raise the 25-URL evidence cap to "fix" a truncated target list. The cap is correct for a finding. The recovery is the fix, and it works because `page_snapshots` retains the whole crawl.
- **Don't** let `targets.ts` and the audit hold two copies of a predicate. It re-runs `CHECKS[key].evaluate` and `OBSERVED_PAGE_RULES[key]` — the same objects. A copy that drifts makes the plan and the audit disagree about which pages are broken, silently.
- **Don't** delete the recovery self-check. If the re-derived set does not contain every URL the audit recorded, the recovery loses. Losing an expansion costs a caveat; trusting a wrong one sends someone to the wrong pages.
- **Don't** generate an action with a model. Authored per `rule_key` for the same reason as `EFFORT` and the prompt templates: a sentence that reads differently every month makes an unfinished item look like new work.
- **Don't** label a manual acceptance criterion `audit_rule`. That is the unenforced checklist this product exists to replace, wearing a machine's clothes.
- **Don't** name a page on a probe item. The probe records absence from an answer, not which page should have been there.
- **Don't** rewrite plan `62ff1c2c`'s items to give them directives. It is approved, and an approved plan is the record a client's report cites.
- **Don't** change the detector without bumping `DETECTOR_VERSION`, the ranker without `RANK_METHOD_VERSION`, or the actions without `ACTION_METHOD_VERSION`. All three refuse to compare across versions.
- **Don't** let any scored or ranked term read the current time.
- **Don't** treat "couldn't measure" as "measured zero" — broken four times in this project, and M5's target recovery was the fifth opportunity.

### Useful

```bash
npm run plan -- --client storepro --capacity 12            # prints every instruction inside the line
npm run plan -- --client storepro --capacity 12 --verbose  # every item, every target URL, every rationale
npm run plan -- --client storepro --capacity 12 --write    # store as the client's draft
npm run test:actions                                       # prove the instructions, offline
npm run test:plan / test:prompts / test:detector           # the other three suites
npm run audit -- --client storepro --verify                # prove audit reproducibility
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity is deliberately not a real `auth.users` row, so every gate rejects it. Set `AUTH_DISABLED_USER_ID` to a real user id to exercise an approval locally — but note that a local approval is still attributed to that human, so it is not a substitute for them approving the plan themselves.
