# Engine Optimization — Handover
_2026-08-15 · closes M7 · opens M8 · arc 10_

## ▶️ Paste this into a new session

```
Engine Optimization M8 — The shipping record

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M7 landed: Storepro's 2026-07 report is published, frozen, and attributed to Ricky.
It states what we expected before the work, against a matched control, with the date
we will know — 5 November — plus the twelve items we refused to predict on.

M8 exists because of the question that closed the M7 session: "we need some way of
telling the system the work is done so that it can police the assumptions and see if
it worked." work_items.shipped_at has existed since 0001 and nothing anywhere writes
it — not a CLI, not an endpoint, not the app. Same for owner_id and evidence_url. The
published report reads that column to decide "delivered", which is why it says 0 of 13.

Two halves. The writer: a specialist marks an approved item shipped, with evidence,
attributed to a session, and it refuses what it should — no shipment without evidence,
none dated before the plan was approved, no silent un-shipping. Plus the readback's
"the audit agrees, mark it shipped" one-click, wanted since M6. The policing:
re-derive the readback window from shipped_at with the existing pure readbackWindow
and compare it to the window the prediction recorded. No new judgement. For plan
70337c95 the boundary is 3 September, verified by running the function — ship by then
and the recorded October window stands; ship on the 4th and October is confounded.

Do not mark anything shipped that has not been done. Like M7's publish, the doneWhen
ends on a real specialist act: build it, prove every refusal, hand back one click.

Check the staging deploy before you trust it. A failed build is silent — Railway keeps
serving the last good one, so /health stays 200 while the newest commit was never live.
`railway deployment list` and look for FAILED, not just the newest row.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **M7 is done. You published it.** Storepro's July report went out on the record at
  **21:44 on 14 August**, attributed to you, and it is now frozen — the database
  refuses to change it, delete it, or un-publish it.
- **What that report says that nobody else's does.** Not just what was done and why.
  It states **what we expected before we did it**, the set of pages we are comparing
  against, and **the exact date we will know** — 5 November. Plus the twelve things we
  refused to put a claim behind, each with its reason in full. A client can check us.
- **What is actually in it:** 13 items, each traceable to the finding that produced it
  and carrying the reason it was chosen, word for word from when it was chosen. One
  prediction, marked **pending**. Twelve refusals. Eight stated limits, including that
  the prediction covers 12 of 147 pages and that nothing has shipped yet.
- **What M8 does, in one line:** gives the system a way to be told the work is done —
  and then checks that it happened early enough for the prediction to still mean
  anything.
- **The number to remember: 3 September.** That is the last day the FAQ-schema work
  can ship and still have October be a clean month. Miss it and November's answer is
  "we can't tell", which costs a whole cycle. It is not a guess — it comes out of the
  same function that fixed the window in the first place.
- **Two things went wrong this session and both are worth knowing.** You pressed
  publish and got "Failed to fetch" — that was a dev server I had shut down under a
  button I had left on screen, and the panel should never have offered you that
  button in local mode anyway. Both fixed. And **staging quietly stopped deploying a
  day ago**: the site kept answering, `/health` kept returning 200, and the newest
  code was never live. Also fixed, and now written down.
- **Verified by:** the published row read out of Postgres — `079c69d1`, `published_at`
  2026-08-14 21:44:15Z, `published_by` `ricky@coreshifthq.com`, cycle `2026-07` on
  `published`, 9 of 9 checks passing, body carrying 13 committed / 0 delivered / 1
  pending / 12 refused. Every freeze then exercised **against that real row**: body
  edit refused, publication revoke refused, check flip refused, delete refused, second
  published report refused — and `body_tampered` still false afterwards, so nothing
  leaked through. **162 tests across six suites**, typecheck clean, `dev` and
  `staging` at `06d6b20`.
- **Not verified:** three things, named in **⚠️ Not verified** below. None of them
  affects the published report.

## 👉 On you

1. **Does the FAQ item get the hours? Decide by 3 September.** It is an 18-hour item
   in a 12-hour month, ranked third and marked below the capacity line by the plan
   itself, so it slips by default. Ship on or before 3 September and the October
   window stands; ship on the 4th and October comes back `confounded` — a wasted
   cycle rather than a wrong answer. **Default if you say nothing:** nothing changes,
   and November's first verified prediction probably comes back inconclusive.

2. **A second client, when you're ready.** Still not blocking. It is the only thing
   that tests M6's four matching thresholds, every one of which has exactly one
   property behind it. **Default:** Storepro-only until you name one.

**Decided and closed:** M7 split from the verdict, and the shipping record inserted as
its own M8 rather than folded into the readback — both on the grounds that work which
must be *recorded now* cannot live in a milestone that cannot move until November. Arc
8 → 9 → 10. No deliberate holdouts. Ahrefs Brand Radar declined. Prompt generation
in-house. Competitor cohort at eight domains. No report is emailed or exported — the
format a client receives is a positioning decision and was left unbuilt on purpose.
One published report per cycle, so a correction is a designed re-issue, not a re-run.

## 🔴 Risks you're carrying

- **Nothing records that work was done.** This is M8, and the clock on it is real:
  **3 September**. Until it exists the report says 0 of 13 delivered forever, and
  November cannot tell `failed` from `confounded`.
- **A failed deploy is silent.** Railway keeps serving the last good build, so
  `/health` returns 200 and the site looks fine while the newest commit is not live.
  It hid a broken build for about a day. The build is fixed and the check is written
  down, but the shape of the failure remains: **never take a green push as a deploy.**
- **The loop measures the head of the site.** Search Console returns per-page rows for
  50 of Storepro's 202 crawled pages, so the published prediction covers **12 of 147
  target pages** — 8%. Stated in the report twice, in words. Paging the API further is
  possible and has not been costed. Still the most likely thing to embarrass us.
- **The prediction is on work below the capacity line.** 18 hours against 12. See
  item 1 above.
- **Four matching thresholds, one property.** Unchanged.
- **The hours are uncalibrated** — now withheld from the client rather than merely
  labelled, which is stronger but does not calibrate them. **Do not quote them.**
- **Audit findings are trusted at full confidence, which means reproducible, not
  correct.** ⚠️ Now client-facing: the published report carries each finding's own
  evidence and first principle, so a wrong judgement is a wrong statement in a
  document a client has.
- **A single probe is still a sample.** The citation sampling design does not exist;
  it is one of the twelve published refusals, and it is what a client asks about by
  name.
- **In-app prompt sign-off still does not exist.** M7 built the in-app publish gate,
  which was the other half of the same complaint. A specialist who cannot sign a
  prompt set off in the app cannot run a cycle unaided — which is M10's whole test.
- **A published report has no correction path.** One per cycle, frozen, undeletable.
  The right default and not a usable one if a report goes out wrong. In the Parking
  Lot with the shape of the fix.
- **Two database guarantees still live partly in application code.** `0007`'s
  supersede weakening and `0009`'s insert-only directive trigger. Unchanged.
- **One of M3's five volatility data points may have been our own bug.** Unchanged.

## ⚠️ Not verified

Everything claimed above has named evidence except these three, stated so they are
decisions rather than omissions.

1. **Nobody has pressed the in-app publish button on a deployed environment.** The
   publication went through the CLI, which runs the identical `publishBuiltReport`.
   Staging demonstrably carries the code — the live bundle was downloaded and grepped,
   and all three new strings are in it — and the endpoint is gated (401
   unauthenticated). But the click itself is unexercised, and now cannot be: there is
   one published report per cycle and it is frozen. It will be exercised the first
   time a second cycle is reported on.
2. **The "no publish button because a check is failing" branch has never been seen on
   screen.** All nine checks pass, so the branch is unreachable without breaking the
   report on purpose. It is covered by the composer tests, not by observation.
3. **Who set `NODE_ENV=production` on Railway, and when, is unknown.** The CLI does not
   expose variable history. It is what broke the staging build, and the fix does not
   depend on knowing — but nobody should claim it was one of us or wasn't.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at
  `06d6b20`, working tree clean apart from an untracked `.claude/`. Working dir
  `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase
  `xslwvntwrlvqccdupmni`. Railway project `engine-optimization`, staging auto-deploys
  on push to `staging`. `main` does not exist.
- **Read first for M8:** `server/predict/windows.ts` — `readbackWindow` *is* the
  policing check and it is already pure, total, clock-free and tested; the drift check
  is a comparison, not new logic. Then `docs/predictions.md` on why the window is
  anchored to the plan's approval rather than to shipping. Then
  `server/predict/readback.ts` for the four verdicts the one-click has to respect.
  `docs/reports.md` for what M7 built and how the publish gate works. `README.md` has
  every command.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul), 2 audit
  runs (both `partial` at 147/202 — normal), 15 active prompts all reviewed, 240 probe
  runs. Plans: `62ff1c2c` approved (M4 history, leave it), `101a4531` superseded,
  `70337c95` approved (M5, 13 items). `predictions` and `control_sets` hold one row
  each, both immutable. **`reports` holds one row: `079c69d1`, published and frozen,
  with 9 passing `review_checks` that are frozen with it.** Cycle `017fe91f` is
  `published`; the other three are `measuring`.
- **All 13 items have `shipped_at` null and nothing can set it.** That is M8. When it
  can, re-running `npm run report` moves them into the delivered section on its own —
  the report side needs no change, which is why M8 is a writer and a check rather than
  a rewrite.
- **The build is pinned in `nixpacks.toml`, and the comment in it explains two
  failures.** Do not move the install override into `railway.json`'s `buildCommand` —
  that was tried and fails with `EBUSY` on the cache mounted inside `node_modules`.

### What M7 built, and where

| File | What it does |
|---|---|
| `server/report/compose.ts` | Pure. The whole report, the rationale segmenter and the nine publication checks. Every client-facing sentence is authored here or carried verbatim — nothing is generated. Read `segmentRationale` before touching a rationale. |
| `server/report/sources.ts` | Every database read and write. The cycle is the **plan's** cycle, never today's month. |
| `server/report/build.ts` | Orchestration. Refusals re-derived, recorded predictions read back. Decides nothing. |
| `server/cli/report.ts` | `--write` stores the draft, `--publish <email>` publishes as a resolvable person. Nothing written without a flag. |
| `db/migrations/0011_reports.sql` | Nine guarantees: attribution, checks present, checks passing, body frozen, undeletable, checks frozen, one draft, one published, body non-empty. |
| `server/report/report.test.ts` | 29 tests, each named after a way a report can be a lie that still reads professionally. |
| `client/src/App.tsx` → `MonthlyReport` | The panel. No publish button when a check fails **or** when the session cannot be attributed — two different reasons, said differently. |
| `nixpacks.toml` | The install phase, pinned. Reads as a bug report because it is one. |

### Don't

- **Don't** publish, approve or sign anything as a person. The gates are the product.
- **Don't** mark an item shipped that has not been done, and don't infer shipping from
  the readback. It reports; a specialist decides.
- **Don't** loosen or delete a publication check. The database holds its own copy of
  the required list and a test fails if the two disagree.
- **Don't** try to edit, delete or re-publish report `079c69d1`. Every one of those is
  refused, by name, and the refusal is correct.
- **Don't** let a report state a raw before/after. The month's totals are the starting
  position; a result exists only against a control after its window closes.
- **Don't** quote an effort estimate. It lives inside the verbatim rationale, so the
  guard is the segmenter plus a prose scan, and both have to keep working.
- **Don't** paraphrase a rationale. A split that does not rejoin byte for byte fails
  the gate, and that is the correct outcome.
- **Don't** put a magnitude on a prediction, or predict an audit score or a citation
  rate.
- **Don't** anchor a report to the current calendar month. It is the plan's cycle.
- **Don't** let anything in `windows.ts` read the clock, and don't back-date a window.
- **Don't** treat a target page the crawl did not reach as a page that passed.
- **Don't** offer an action in the UI that the gate behind it will refuse. That is a
  control which looks passable and is not, and it cost a confused publish attempt.
- **Don't** take a green push as a deploy. `railway deployment list`, look for FAILED,
  and check which bundle is actually being served.
- **Don't** change the composer or a check without bumping `REPORT_METHOD_VERSION`.
- **Don't** trust a claim in a handover you cannot check.

### Useful

```bash
npm run report   -- --client storepro                       # compose and print; writes nothing
npm run report   -- --client storepro --verbose             # every item's reasoning and criteria
npm run test:report                                         # 29 tests, offline
npm run predict  -- --client storepro --verbose             # every matched pair, every refusal
npm run readback -- --client storepro                       # acceptance criteria vs the latest audit run
railway deployment list                                     # FAILED is silent — look for it
railway logs --build <deployment-id>                        # why a build failed
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity
(`local@localhost`) is deliberately not a real `auth.users` row, so every gate rejects
it — including the publish gate. The panel now says so instead of offering a button.
