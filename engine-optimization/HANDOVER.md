# Engine Optimization — Handover
_2026-08-14 · M7 built, not landed · arc unchanged at 9_

## ▶️ Paste this into a new session

```
Engine Optimization M7 — Monthly report (finishing)

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.

M7 is built and verified and it is not landed. The report is composed, stored as
Storepro's 2026-07 draft, and passing 9 of 9 publication checks. The doneWhen says
"a specialist publishes" it, and that is a human act by construction — the publisher
must resolve to a real auth.users row and, in the app, comes from the verified
session. Publishing it as Ricky would have forged a human gate, so it waits on him.

If Ricky has published it: verify the row (published_at, published_by, the cycle on
`published`, the body and its checks frozen), then offer /land immediately. Nothing
else is outstanding.

If he has not: he may have read it and wanted the wording changed. The report is
unusually blunt — its second sentence says nothing has shipped, because shipped_at is
null on all 13 items. That is true and it is his call whether it reads as rigour or as
a thin month. Changes to the wording are authored constants in
server/report/compose.ts; nothing there is generated.

Do not mark an item shipped to make the report read better. Do not loosen a
publication check. Do not publish it as anybody.
```

## Where we are — for Ricky

- **M7 is built, tested, deployed and one click from done.** The report exists, it
  passes its own nine checks, and the only thing between it and landing is you
  pressing publish. That is not an oversight — see below.
- **What the report does that nothing else does.** It states what we expected
  **before** the work, what we are comparing it against, and **the date we will
  know** — 5 November, on the face of it, with the readback window `2026-10`
  visible. Plus the twelve items we refused to predict on, each with its reason in
  full. Every competitor's report states what was done. This one states what it
  would not claim.
- **Why I did not publish it.** `--publish` takes an email that must resolve to a
  real `auth.users` row, and in the app the publisher is taken from the verified
  session and cannot be typed into a field. Your address resolves. Publishing as
  you would have put your signature on a client document you had never read, in a
  table that then freezes it. That is the exact failure this product exists to
  replace, and the repo's own rules say don't forge a human gate. So it waits.
- ⚠️ **Read it before you publish it, because it is blunt.** Its second sentence
  is *"Nothing is marked delivered yet: 13 items were approved and the work runs
  from there."* That is true — `shipped_at` is null on all thirteen — and on the
  morning after approval it is the only honest thing to say. Whether that reads as
  rigour or as a thin month is a positioning question and it is yours. The fix, if
  you want one, is in the writing.
- **The finding worth reading if you read one.** The one prediction is attached to
  an **18-hour item in a 12-hour month** — ranked third, marked below the capacity
  line by the plan itself. It is the most likely thing on the plan to slip, and the
  readback window is anchored to the approval date rather than the ship date on
  purpose. If it slips out of August, October stops being a clean month and the
  honest outcome in November is `confounded` rather than negative. Either that item
  gets the hours or the first verified prediction probably comes back inconclusive.
- **Two rules collided and the collision was real.** The milestone said carry each
  rationale verbatim; the standing rule says never quote effort hours to a client.
  `work_items.rationale` contains `Estimated 18h.` So the rationale is now split
  into the labelled clauses the ranker actually builds, every clause is carried word
  for word, and exactly one is withheld — with the omission stated in the report
  rather than left as a gap. The splitter refuses rather than paraphrases: it only
  accepts a split that rejoins into the stored text byte for byte.
- **Verified by:** the composed report read out of Postgres — draft `079c69d1`,
  method `2026-08-a`, 13 committed / 0 delivered, 1 pending prediction carrying
  `{month: 2026-10, period: [2026-10-01,2026-11-01), finalFrom: 2026-11-05}`, 12
  refusals, 8 limits, 9 of 9 checks stored and passing, cycle `017fe91f` moved
  `measuring → drafted`; **162 tests across six suites** (13 detector, 38 plan, 24
  action, 23 prompt, 35 prediction, **29 report**); typecheck and build clean;
  `dev` and `staging` both at `b758643`; staging `/health` 200; the publisher gate
  refusing `nobody@growthpartners.co.nz` by name; **nine database guarantees
  exercised against the live database inside a block that was rolled back**, each
  refusing by name, `reports` and `review_checks` confirmed empty afterwards; and
  the whole report seen rendering in the panel against a local server on the
  production bundle.
- **Not verified:** the panel was seen against a **local** server, not staging —
  same gap as M6, and it needs a magic link. The publish *button* was not clicked
  (the local identity is deliberately not a real user, and clicking it as you was
  not mine to do), so the in-app publish path is proved by its code and by the CLI
  running the identical `publishBuiltReport`, not by a click. The failing-check
  branch that hides the publish button is proved by the composer tests, not by
  seeing it on screen.

## 👉 On you

1. **Publish Storepro's 2026-07 report.** This is the whole of what is left.

   ```bash
   npm run report -- --client storepro --publish ricky@coreshifthq.com
   ```

   Or open Storepro in the app and press **Publish this report**. Read it first —
   `npm run report -- --client storepro --verbose` prints the lot. Publishing marks
   it final and moves the cycle to `published`. **Nothing is emailed or sent
   anywhere**; there is no delivery mechanism, deliberately.

   Then say `/land` and M7 closes.

2. **Does the FAQ item get the hours?** Not blocking the report. It decides whether
   November's first verified prediction is an answer or a `confounded`. **Default:**
   nothing changes, and the report already says the risk out loud.

3. **A second client, when you're ready.** Unchanged and still not blocking. Every
   matching threshold has exactly one property behind it. **Default:**
   Storepro-only until you name one.

**Decided and closed:** M7 split, verification moved to M8 (2026-08-14). No
deliberate holdouts. Ahrefs Brand Radar declined. Prompt generation in-house.
Competitor cohort settled at eight domains. **New this session:** no report is
emailed or exported — the format a client receives is a positioning decision and
was left unbuilt on purpose; one published report per cycle, so a correction is a
designed re-issue rather than a re-run.

## 🔴 Risks you're carrying

- **The report's first sentence about work is that there is none delivered.** Not a
  bug — `shipped_at` is null on all thirteen items and the report refuses to call a
  commitment a completion. But it means the first document a client sees leads with
  an absence, and how that lands is a writing problem nobody has solved yet.
- **The prediction is on work below the capacity line.** 18 hours against 12,
  ranked third. Most likely thing to slip; slipping makes November `confounded`.
  Stated in the report's limits rather than hidden.
- **The loop still measures the head of the site.** Search Console returns per-page
  rows for 50 of Storepro's 202 crawled pages, so the prediction covers **12 of 147
  target pages** — 8%. Stated in the report in words, twice. Paging the Search
  Console API further is possible and has not been costed. **Still the single most
  likely thing to embarrass the first report.**
- **Four matching thresholds, one property.** Unchanged.
- **The hours are still uncalibrated** — and now they are *withheld from the
  client* rather than merely labelled, which is stronger but does not calibrate
  them. **Do not quote them.**
- **Audit findings are trusted at full confidence, which means reproducible, not
  correct.** ⚠️ M7 propagated this one step further again: the report now carries
  each finding's own evidence and first principle to a client, so a wrong judgement
  is now a wrong statement in a client document rather than an internal one.
- **A single probe is still a sample.** The citation sampling design does not
  exist, the report says so as one of its twelve refusals, and it is still what a
  client will ask about by name.
- **In-app prompt sign-off still does not exist.** Carried from M6 and *not* closed
  here — M7 built the in-app publish gate, which was the other half of the same
  complaint. A specialist who cannot sign off a prompt set in the app cannot run a
  cycle unaided, which is M9's whole test. Should be built in M8.
- **A published report has no correction path.** One per cycle, frozen, undeletable.
  The right default and not a usable one if a report goes out wrong. In the Parking
  Lot with the shape of the fix.
- **Two database guarantees still live partly in application code.** `0007`'s
  supersede weakening and `0009`'s insert-only directive trigger. Unchanged.
- **One of M3's five volatility data points may have been our own bug.** Unchanged.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at
  `b758643`, working tree clean apart from an untracked `.claude/`. Working dir
  `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase
  `xslwvntwrlvqccdupmni`. Railway `engine-optimization`, staging auto-deploys on
  push to `staging`. `main` does not exist.
- **Read first:** `docs/reports.md` — all of M7, and the part that matters most is
  *"Part three — why publishing is a human act"*. Then `docs/predictions.md` for
  what the report renders as pending, and `docs/planning.md` for where a rationale
  comes from. `README.md` has every command.
- **State:** 21 tables, RLS on. Storepro only. 4 months ingested (Apr–Jul), 2 audit
  runs (both `partial` at 147/202 — normal), 15 active prompts all reviewed, 240
  probe runs. Plans: `62ff1c2c` approved (M4 history, leave it), `101a4531`
  superseded, `70337c95` approved (M5, 13 items). `predictions` and `control_sets`
  hold one row each, both immutable. **`reports` holds one row: draft `079c69d1`
  on cycle `017fe91f`, unpublished, with 9 passing `review_checks`.** Cycle
  `017fe91f` is `drafted`; the other three are `measuring`.
- **All 13 items have `shipped_at` null.** Nothing has been done to the site. If
  that changes, re-running `npm run report` moves those items into the delivered
  section on its own — no code change needed.

### What M7 built, and where

| File | What it does |
|---|---|
| `server/report/compose.ts` | Pure. The whole report, the rationale segmenter and the nine publication checks. **Every client-facing sentence is authored here or carried verbatim** — nothing is generated. Read `segmentRationale` before touching the rationale. |
| `server/report/sources.ts` | Every database read and write. The cycle is the **plan's** cycle, never today's month. |
| `server/report/build.ts` | Orchestration. Refusals are re-derived, recorded predictions are read back. Decides nothing. |
| `server/cli/report.ts` | `--write` stores the draft, `--publish <email>` publishes as a resolvable person. Nothing written without a flag. |
| `db/migrations/0011_reports.sql` | Nine guarantees: attribution, checks present, checks passing, published body frozen, undeletable, checks frozen, one draft, one published, body non-empty. |
| `server/report/report.test.ts` | 29 tests, each named after a way a report can be a lie that still reads professionally. |
| `client/src/App.tsx` → `MonthlyReport` | The panel, at the top of the client view. No publish button when a check fails. |

### Don't

- **Don't** publish a report as anybody. The gate is the feature.
- **Don't** mark an item shipped to make the report read better. `shipped_at` is a
  specialist saying so, and the readback reports rather than decides.
- **Don't** loosen or delete a publication check to get a report out. The database
  holds its own copy of the required list and a test fails if the two disagree.
- **Don't** let the report state a raw before/after. The month's totals are the
  *starting position*; a delta only exists against a control after a window closes.
- **Don't** quote an effort estimate. It lives inside the verbatim rationale, so the
  guard is the segmenter plus a prose scan, and both have to keep working.
- **Don't** paraphrase a rationale. A split that does not rejoin byte for byte fails
  the gate, and that is the correct outcome.
- **Don't** put a magnitude on a prediction, or predict an audit score or a citation
  rate. Unchanged from M6, and the report repeats each refusal.
- **Don't** hide the twelve refusals, shorten them, or move them into a footnote.
- **Don't** generate a report sentence with a model, for the same reason actions and
  mechanisms are authored: a sentence that changes every month makes an unchanged
  situation look like news.
- **Don't** anchor a report to the current calendar month. It is the plan's cycle.
- **Don't** treat a target page the crawl did not reach as a page that passed.
- **Don't** change the composer or a check without bumping `REPORT_METHOD_VERSION`.
- **Don't** trust a claim in a handover you cannot check.

### Useful

```bash
npm run report   -- --client storepro                       # compose and print; writes nothing
npm run report   -- --client storepro --verbose             # every item's reasoning, criteria and caveats
npm run report   -- --client storepro --write               # store as the cycle's draft
npm run report   -- --client storepro --publish <email>     # publish as a named person; frozen afterwards
npm run test:report                                         # 29 tests, offline
npm run predict  -- --client storepro --verbose             # every matched pair, every refusal
npm run readback -- --client storepro                       # acceptance criteria against the latest audit run
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity
(`local@localhost`) is deliberately not a real `auth.users` row, so every gate —
including the new publish gate — rejects it. That is the correct default and it is
why the publish button was not clicked locally.
