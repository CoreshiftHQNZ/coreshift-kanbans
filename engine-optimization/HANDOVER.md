# Engine Optimization — Handover
_2026-08-19 · closes M8 · splits M9 from the verdict · opens M9 · arc 11_

## ▶️ Paste this into a new session

```
Engine Optimization — M9: The verdict machinery

Read coreshift-kanbans/engine-optimization/HANDOVER.md, then docs/predictions.md
and docs/shipping.md. `server/predict/windows.ts` and `server/ship/drift.ts` are
the two files whose headers explain why this milestone is shaped the way it is.

The decision after M8 was made on 2026-08-19: M9 was split from the verdict for
the third time and for the same reason. M9 is everything the readback needs and
it can close this week. M10 is the verdict and it waits for 5 November, when
October's Search Console figures settle. Nothing brings that forward.

M9 closes when: the verification arithmetic produces a complete verdict from real
data on a closed month — the delta against a matched control, with every
algorithm update overlapping the window named from the ledger — while a3e5a8a7's
own verdict is refused by name as unanswerable until 2026-11-05 and nothing is
written to its outcome.

Three pieces, none of them the verdict:

1. The delta-vs-control arithmetic. What the treated pages did against the twelve
   matched untouched pages in control set d7de6e64, reported as a delta against
   the control and never as a raw delta. Pure, clock-free, `now` passed in, the
   way windows.ts and drift.ts are — it has to be exercisable on a month that has
   already closed without back-dating anything.

2. The verification writer. Writes verified_at, verified_in_cycle, actual_value,
   control_value, actual_period, outcome, decision, outcome_notes and
   confounders, and nothing else — the terms are frozen by
   predictions_terms_immutable and that trigger is the point. Honour
   predictions_outcome_carries_control: only `too_early` and `confounded` may be
   written without numbers. Decide, and write down, whether a verdict is itself
   frozen once written; a published report and a recorded shipment both are, and
   a verdict that can be revised after the client has read it is worth nothing.

3. The algorithm-update ledger. `algorithm_updates` has existed since 0001 and
   nothing has ever written to it — the same shape of gap M8 found in
   `shipped_at`. Google-owned source URLs only, `verified` false is a research
   lead and not evidence. It auto-flags predictions.confounders when an update's
   date range overlaps a prediction's window.

Ledger before verdict, and that ordering is the entire argument for building this
now rather than in November: deciding whether a core update overlapped October
while October's numbers are already on screen lets the answer choose its own
confounder.

Do not write a verdict for prediction a3e5a8a7. Not `failed`, not `confounded`,
and not `too_early` — `too_early` would be honest and would still empty the work
queue that the `outcome is null` index exists to keep. The refusal is a feature of
this milestone and should be visible in the app and in the CLI, with the date.

Do not re-derive or move a readback window. Do not let anything in windows.ts read
the clock. Do not add a publication check to compose.ts without adding it to the
required-check array in the newest migration, and do not change the composer or a
check without bumping REPORT_METHOD_VERSION.

Also on the board this week, all small, all optional for the doneWhen: a shipping
date recorded and displayed in UTC that reads a day behind in NZ and carries a
bounded twelve-hour edge at a deadline boundary; nothing checking that an authored
action's branches leave its own acceptance criterion decidable; and staging
deploys failing roughly every other time with no runtime logs.

Check the staging deploy before you trust it — and expect to retry it. The last
deployment before this session, b7ee3997, succeeded at 10:01 NZ on 19 August, but
two of the four before it failed and both succeeded on retry of the identical
commit. `railway deployment list`, look for FAILED, then download the served
bundle and grep it.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **M8 is done, and you closed it.** You recorded the first shipment this system
  has ever held — in the app, on staging, on 18 August at 21:47 UTC, attributed
  to you and frozen the instant it was written.
- **What the system can do now that it could not a week ago.** Be told the work
  is done. `shipped_at` had existed since day one with nothing anywhere writing
  it, which is why your July report says *13 committed, 0 delivered*. That was
  true, and it was true because there was no way to say anything else — the
  system could not tell "nothing was delivered" from "nothing can be recorded".
- **A shipment is three things or it is nothing:** a date, a link somebody else
  can open, and a named person. It refuses eight different ways of being a tick
  in a box, and once written it cannot be un-shipped, re-dated, or have its
  evidence swapped.
- **And it now polices the promise the predictions rest on.** Every prediction
  says whether the work it is about shipped early enough for its window to mean
  anything — and while it has not, the exact date it has to by. **For Storepro
  that is still 3 September.** That date was previously buried in a source file;
  it is now on the report a client reads.
- **The decision that made this landable was yours, and it was the right one.**
  You said Storepro's site is not being changed — this was a test of the app. The
  tempting move was to press the button on Storepro anyway to prove it works, and
  that would have written a permanent false *delivered* about a real client's work
  into the document they receive. Instead the gate is exercised on a fixture
  client that is unmistakably not one. **Storepro still says 0 of 13, which is
  true.**
- **Verified by:** the shipment read straight out of Postgres — item `c1def139`,
  `shipped_at` 2026-08-18 21:47:56Z, owner resolving to `ricky@coreshifthq.com`,
  evidence stored, status `shipped`. Then every freeze exercised **against that
  real row** and refused by name: un-ship, re-date later, re-date earlier, swap
  the evidence, reassign the owner, revert the status — while a move to
  `verified` stayed allowed, so November is not blocked. A second shipment
  refused through the real writer. All eight database guarantees also exercised
  against Storepro's real FAQ item. The drift check then produced **on_time** out
  of the database rather than out of a test: shipped 18 August, sixteen days
  before the 3 September deadline, recorded window October unchanged. **188 tests
  across seven suites**, typecheck clean.
- **Not verified:** two things, named in **⚠️ Not verified** below.

## 👉 On you

1. ~~Decide what comes next.~~ **Decided 2026-08-19: M9 is split.** The verdict
   machinery — delta-vs-control, the verification writer, the algorithm-update
   ledger — is **M9** and can close this week. The verdict itself is **M10** and
   waits for October's figures on **5 November**. The handover milestone moved to
   **M11**; the arc is 11. Board updated, work prompt above. **Nothing on you
   here** unless you want it cut differently.

2. **Does the FAQ item get the hours? By 3 September.** Unchanged, and now the
   system will say so out loud in the report either way. 18-hour item in a
   12-hour month, ranked third, below the capacity line, so it slips by default.
   **Default:** it slips, and November's answer is `confounded` rather than yes
   or no.

3. **The `app-check` fixture client is live in the real database.** It is
   deliberately obvious — status `prospect`, domain `app-check.invalid`, and a
   name that says so in the client list. Remove it whenever with
   `npm run fixture -- --drop`. **Default:** it stays, because it is the only way
   to press a human gate without lying to a real client, and M9 and M10 both have
   gates left to press.

4. **A second client, when you're ready.** Still not blocking. Still the only
   thing that tests M6's four matching thresholds, each of which has exactly one
   property behind it. **Default:** Storepro-only.

**Decided and closed:** M8's doneWhen was replaced rather than reinterpreted, on
your call, when Storepro's work stopped being in scope — the old wording and the
reasoning are kept in `kanban.config.js`. A shipment is frozen once written, on
the same grounds as a published report and a recorded prediction; the correction
path for all three is one Parking Lot card, to be built once. The drift check
states the position and does not write `predictions.outcome` — verification is
M9's. `REPORT_METHOD_VERSION` moved to `2026-08-b`, and report `079c69d1` stays
frozen at `2026-08-a`. Everything else stands: no report is emailed or exported,
one published report per cycle, competitor cohort at eight, prompt generation
in-house, Ahrefs Brand Radar declined.

## 🔴 Risks you're carrying

- **Staging deploys fail roughly every other time and always succeed on retry.**
  New, and the most operationally annoying thing on this list. Three failures on
  19 August, each with the build completing and the image pushing, each with **no
  runtime logs at all**, each fine on a retry of the identical commit. Railway
  exposes no commit SHA at runtime, so there is no way from outside to confirm
  what is being served. **Every deploy now needs `railway deployment list` and
  probably a retry** — a manual step in an otherwise automatic pipeline. First
  place to look is the healthcheck timeout against a cold `tsx` start.
- **A recorded shipment cannot be corrected.** The deliberate half of the freeze.
  An item shipped by mistake stays shipped; a mistyped evidence link stays
  mistyped. Same gap a published report has. Parking Lot, with the fix's shape.
- **An authored action can offer a fix its own acceptance criterion cannot
  observe.** Storepro's item 1 permits either giving three pages content or
  404-ing them and dropping them from the sitemap — and only the first can ever
  read back as passed, because a page nobody crawls is `not_assessed`. Nothing
  checks for this class of mismatch. This Week.
- **A shipping date is recorded and displayed in UTC.** You pressed it on the
  morning of 19 August NZ and the record reads 18 August. Correct and internally
  consistent — but there is a bounded twelve-hour edge at a deadline boundary,
  and underneath it the unexamined question of Search Console reporting in the
  property's timezone rather than UTC. This Week; worth costing before M9
  verifies anything.
- **The loop measures the head of the site.** Unchanged. The published prediction
  covers 12 of 147 target pages — 8%. Still the most likely thing to embarrass
  us.
- **The prediction is on work below the capacity line.** Unchanged. See item 2.
- **Four matching thresholds, one property.** Unchanged.
- **The hours are uncalibrated** — and now genuinely answerable, because
  `shipped_at` can finally be written. One fixture shipment is not a calibration.
  **Do not quote them.**
- **Audit findings are trusted at full confidence** — reproducible, not correct,
  and client-facing since M7. Unchanged.
- **A single probe is still a sample.** The citation sampling design does not
  exist and is one of the twelve published refusals.
- **In-app prompt sign-off still does not exist.** Unchanged, and it is M10's
  whole test.
- **A published report has no correction path.** Unchanged, and it now has two
  siblings.
- **Two database guarantees still live partly in application code.** `0007`'s
  supersede weakening and `0009`'s insert-only directive trigger. Unchanged.
- **One of M3's five volatility data points may have been our own bug.**
  Unchanged.

## ⚠️ Not verified

Everything claimed above has named evidence except these two.

1. **Which commit staging is actually running.** The landed commit `9a8ded1`
   changed only `server/cli/fixture.ts`, a CLI the server never imports, so there
   is nothing about it observable from the deployed app — and Railway exposes no
   commit SHA at runtime. What *is* verified: the deployment succeeded, `/health`
   returns 200, the served bundle was downloaded and grepped for the current UI
   strings, and the shipping endpoint returns 401 unauthenticated. The behaviour
   the doneWhen is about was live when the button was pressed, and the shipment
   row proves it.
2. **The magic-link sign-in round trip.** Ricky signed in to staging to press the
   button, so it evidently works — but nobody recorded the flow and no session
   here observed it, so it is his word rather than named evidence.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at
  `9a8ded1`, working tree clean. Working dir
  `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase
  `xslwvntwrlvqccdupmni` — one project, shared by local and staging. Railway
  project `engine-optimization`, staging auto-deploys on push to `staging`.
  `main` does not exist. `.claude/` is gitignored and holds local launch configs,
  including `app-as-me`, which runs a local server signed in as a real
  `auth.users` row so the human gates can be *looked at*. Use it to look.
- **Read first:** `docs/shipping.md` — both halves of M8 and the list of what it
  does not cover. Then `server/ship/drift.ts`, whose header explains why
  re-deriving the window from `shipped_at` and storing it would destroy the
  guarantee. `docs/predictions.md` for why the window is anchored to approval and
  for the twelve refusals. `README.md` has every command.
- **State:** 21 tables, RLS on. **Two clients: Storepro, and the `app-check`
  fixture.** Storepro — 4 months ingested (Apr–Jul), 3 audit runs (`54b3758e`
  the plan's baseline, `d853a778` from 2026-08-15 which post-dates approval and
  is therefore the first that can mark anything finished, plus one earlier), 15
  active prompts all reviewed, 240 probe runs, plans `62ff1c2c` approved (M4
  history, leave it), `101a4531` superseded, `70337c95` approved with 13 items,
  **0 shipped**. One prediction `a3e5a8a7`, immutable, window `2026-10`,
  answerable 2026-11-05, drift `not_shipped` with 3 September binding. One report
  `079c69d1`, published and frozen at method `2026-08-a` while the composer is
  now `2026-08-b`. Fixture — 1 approved plan, 3 ranked items, **1 shipped**, 1
  prediction reading `on_time`.
- **M9's inputs are all present now.** `predictions` carries `verified_at`,
  `actual_value`, `control_value`, `outcome`, `decision`, `outcome_notes` and
  `confounders` with their constraints and no writer. `algorithm_updates` exists
  and nothing writes to it. A shipped item can still move to `verified`, which
  was checked deliberately so the freeze does not block the promotion.

### What M8 built, and where

| File | What it does |
|---|---|
| `db/migrations/0012_shipping_record.sql` | Eight guarantees: evidence and an owner, evidence is a link, only approved work ships, `status` and `shipped_at` agree, not before the plan's approval, not in the future, frozen once written, and `shipping_stated` added to the report's required-check array. |
| `server/ship/ship.ts` | Pure. Every refusal, with `now` passed in. `itemBlocker` is split out so a panel can ask "would the gate refuse this?" without inventing an identity to ask with. |
| `server/ship/drift.ts` | Pure. `latestShipDate` and `windowDrift`. Authors the sentence the report and the panel both carry, the way `windows.ts` does. |
| `server/ship/sources.ts` | Every read and write. `recordShipment` is guarded on `shipped_at is null` so two presses cannot both win. |
| `server/cli/ship.ts` | `npm run ship` prints the record and every deadline; `--item --evidence --by` records one, resolving the email to a real user or refusing. |
| `server/cli/fixture.ts` | The `app-check` fixture, and the argument for why it exists rather than testing on a real client. |
| `server/ship/ship.test.ts` | 22 tests, each named after a way a shipping record can be a lie that still reads like a record. |
| `client/src/App.tsx` → `ShipControl` | One control, used in both panels, with per-row state. |
| `client/src/App.tsx` → `ShippingRecord` | Leads the client view, because it is the only panel carrying a deadline. |
| `server/report/compose.ts` | Pending predictions carry the shipping statement; tenth check; `REPORT_METHOD_VERSION` → `2026-08-b`. |

### Don't

- **Don't mark anything shipped that has not been done**, and never on a real
  client to prove the app works. Use `npm run fixture -- --seed`.
- **Don't publish, approve or sign anything as a person.** The gates are the
  product.
- **Don't infer shipping from the readback.** It reports; a specialist decides.
- **Don't re-derive a prediction's readback window from `shipped_at` and store
  it.** That makes every prediction retroactively right about its own timing.
- **Don't write `predictions.outcome` from a late shipment.** `confounded` is a
  verdict, and M9 decides it.
- **Don't let anything in `windows.ts` read the clock, and don't back-date a
  window.**
- **Don't add a publication check to `compose.ts` without adding it to the
  required-check array in the newest migration.** A test reads the *last*
  migration declaring that array and fails if the two disagree.
- **Don't change the composer or a check without bumping
  `REPORT_METHOD_VERSION`** — and check nothing prints the composed version where
  a published one belongs. That bug shipped once already.
- **Don't offer an action in the UI that the gate behind it will refuse**, and
  don't bury one seven cards down a page.
- **Don't take a green push as a deploy, and expect to retry.**
  `railway deployment list`, look for FAILED, download the served bundle and grep
  it.
- **Don't trust a claim in a handover you cannot check.**

### Useful

```bash
npm run ship     -- --client storepro                       # the record, every deadline, every drift
npm run ship     -- --client app-check                      # the fixture, with one shipment on it
npm run fixture  -- --seed | --drop                         # the fixture client
npm run test:ship                                           # 22 tests, offline
npm run report   -- --client storepro                       # compose and print; writes nothing
npm run readback -- --client storepro                       # acceptance criteria vs the latest audit run
railway deployment list                                     # FAILED is silent — look for it, then retry
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity
(`local@localhost`) is deliberately not a real `auth.users` row, so publish,
approve and ship all reject it — the panels say so instead of offering a button.
`.claude/launch.json`'s `app-as-me` supplies a real identity so those branches can
be inspected.
