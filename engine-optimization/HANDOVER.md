# Engine Optimization — Handover
_2026-08-19 · closes M9 · decision taken: M10 inserted ahead of the readback · arc 12_
_Amended 2026-08-19 after the decision session. M9's record below is unchanged._

## ▶️ Paste this into a new session

```
Engine Optimization — M10 · The controls a specialist presses

Read coreshift-kanbans/engine-optimization/HANDOVER.md, then the
"There is no button in the app" section of docs/verification.md. The Parking Lot
cards "A recorded shipment has no correction path" and "Re-issuing a published
report" are the correction path's specification, not a backlog note — read both
before designing one.

M10 was inserted on 2026-08-19 ahead of the readback, which cannot close before
5 November. Three gaps, all in-app, all found by building M8 and M9, all blocking
M12 as hard as they block M11:

1. A verdict cannot be recorded from the app. `predictions` has no `verified_by`,
   so a verdict pressed in the app could not be attributed — and every other
   frozen write here carries a name (`reports.published_by`,
   `work_items.owner_id`, `work_plans.approved_by`). One column, written from the
   verified session and never from a request body exactly as `owner_id` is, one
   endpoint, and the control in the Verification panel that today says why there
   isn't one.

2. Prompt sign-off is still a CLI flag. `npm run probes --review <email>` is the
   only way to sign a prompt set off. It has demanded a real identity since M6,
   so it is correct — it is just not a surface, and a specialist who cannot sign
   off a prompt set in the app cannot run a cycle unaided.

3. There is no correction path for a published report, a recorded shipment or a
   verdict. One design, three call sites: a superseding row rather than an edit,
   the original left on the record, the correction naming who made it and why,
   every reader taking the latest.

doneWhen: On a deployed environment a specialist signs off a prompt set and
records a verdict in the app, both attributed to their own verified session, and
a correction supersedes one of this system's frozen writes with the original
still readable on the record.

It ends on a human act. Do not press any of the three as Ricky — build them,
deploy to staging, and hand him the URLs. `.claude/app-as-me` runs a local server
signed in as a real auth.users row so a gate can be *looked at* without being
pressed. Use it to look.

Prove the verdict control on the `app-check` fixture over a month that has
already closed. That needs a THIRD fixture prediction — the fixture's only closed
month (2026-07) already carries the frozen verdict M9 wrote. `npm run fixture --
--seed` drops and recreates the client, which is how Ricky's c1def139 shipment was
lost last time; if you re-seed, say so in the handover.

Do not write a verdict for a3e5a8a7 before 2026-11-05, and never write
`too_early` — the database refuses it and the reason is the `outcome is null`
work queue. Do not let anything in windows.ts read the clock. Don't add a
publication check to compose.ts without adding it to the required-check array in
the newest migration declaring one, and don't change the composer or a check
without bumping REPORT_METHOD_VERSION.

Check the staging deploy before you trust it. `railway deployment list --json` —
`meta.queuedReason` names a stall the plain list hides, and it is the only place
the commit hash appears.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **M9 is done, and it is the half of the loop nothing on the market has.** The
  system can now answer *"what did the pages we changed do against twelve pages we
  deliberately did not"* — and it reports the **difference**, never the raw
  number. On Storepro's real June the treated pages rose 2.7% and the untouched
  control rose 8.8%, so the honest answer is **−6.1 against the control** where a
  normal retainer report would have printed *"+2.7%, up"*. Both numbers are on
  screen, side by side, so what the control buys is visible rather than asserted.
- **The bar an effect has to clear is read off the data, not chosen by us.** Those
  twelve matched pairs drifted 8.5 points apart before anybody touched anything,
  so anything smaller than that cannot be told apart from the matching itself.
  That makes the bar **harder**, which is the only direction a bar you set
  yourself should ever move.
- **Nothing was written about Storepro, deliberately.** `a3e5a8a7` is refused by
  name, in the app and in the CLI, with the date: *"read back over 2026-10 …
  figures are not final until 2026-11-05 … there is no answer to give, which is
  not the same as the answer being no."* It will not even record *too early*,
  because that would tick the prediction off the work queue while nothing had been
  learned.
- **The confounders are written down before the answer, not after it.** Six real
  Google updates are now on file, each read off its own incident page on Google's
  own status dashboard. **None of them touches October.** That is the whole
  argument for building this in August: deciding in November whether a core update
  overlapped October, with October's numbers already on screen, would let the
  answer pick its own excuse.
- **A verdict cannot be edited once written.** Same rule as a published report and
  a recorded shipment, and for a stronger reason — it is the sentence that says
  whether the work worked. One that could be revised after you'd read it would be
  an opening position, not a finding.
- **Verified by:** the June rehearsal above, run on `a3e5a8a7`'s own frozen pairs,
  with the May core update and the June spam update named on it from the ledger;
  `a3e5a8a7` read straight out of Postgres afterwards with every verdict field
  null; **ten database refusals fired by name** against the live database inside a
  transaction that was aborted so nothing was kept; the writer's accept path
  pressed for real on the fixture client only; **223 tests across 8 suites**,
  typecheck clean; staging deploy `ee298f23` SUCCESS, `/health` 200, the served
  bundle downloaded and grepped for every new string, both new endpoints 401
  unauthenticated.
- **Not verified:** one thing, named in **⚠️ Not verified** below.

## 👉 On you

1. ~~**Decide what fills the eleven weeks.**~~ **Taken 2026-08-19 — option A.** A new
   **M10 · The controls a specialist presses** is inserted ahead of the readback,
   which is renumbered M11 and sits under **Blocked** on the board because it is
   blocked on a calendar and on nothing else. Handover is M12; the arc is 12.
   Say so if you want it reversed — nothing has been built yet.

2. **The correction path has one decision in it that is yours, and it is
   customer-facing.** The *shape* is settled and has been since M8: a superseding
   row, never an edit. What is not settled is what a correction to a report a
   client has already read actually **does** — is the corrected report re-issued
   to them, or is it corrected in the app with the original still standing as the
   thing they received? That is positioning, not architecture. **Default if you
   say nothing:** in-app only, the original stays the document of record, and
   nothing is sent — because nothing in this system emails or exports a report
   today and adding that quietly is the bigger change.
3. **Tell the team about 3 September.** Unchanged and still the sharpest date on
   the board: it is the last day *"Question content is marked up as such"* can be
   recorded as shipped and still leave October able to answer anything. Ship on
   the 4th and November's first verdict comes back `confounded` — no answer rather
   than a wrong one, at the cost of a full cycle. **Nothing chases it.**
   **Default:** the work slips and November is inconclusive.
4. **The fixture's shipment row went with the re-seed.** M9 needed a prediction
   over a month that had already closed so the writer could be pressed at all,
   which meant recreating the fixture client, which took `c1def139` — the shipment
   *you* recorded on 18 August — with it. Nothing depends on it; the gate was
   proven then and the evidence is in M8's card. It was not re-recorded because
   that would attribute a delivery to you that you did not press. **Default:** the
   fixture stays at 0 shipped; press it in the app if you want it back.
5. **A second client, when you're ready.** Still not blocking, still the only
   thing that would test M6's four matching thresholds against more than one
   property. **Default:** Storepro-only.

**Decided and closed:** a verdict is frozen once written, on the same grounds as a
published report and a recorded shipment — and the missing correction path is now
one card covering all three rather than two. `too_early` is never written and the
database refuses it, because it would empty the work queue that exists to make
sure somebody comes back. There is no verdict button in the app, because
`predictions` has no `verified_by` column and an unattributable permanent claim is
worse than no control at all. The ledger takes Google-owned sources only, and an
unconfirmed entry refuses a verdict rather than being ignored. Everything else
stands: the capacity line comes off the next plan, no report is emailed or
exported, one published report per cycle, competitor cohort at eight, prompt
generation in-house, Ahrefs Brand Radar declined.

## 🔴 Risks you're carrying

- **Staging deploys have two failure signatures now, not one.** The old one: fails
  roughly every other time, build completes, image pushes, **no runtime logs at
  all**, succeeds on retry of the identical commit. The new one, seen today: both
  deploys sat at `QUEUED` for twelve minutes with nothing in `railway deployment
  list` to explain it, then built and deployed cleanly first time.
  **`railway deployment list --json` is the fix for both** — it carries a
  `queuedReason` the plain list hides (today: *"upstream GitHub issues"*, while
  GitHub itself reported all systems operational) and it is the only place the
  commit hash appears at all. Every deploy still needs checking.
- **Nobody can record a verdict except from a terminal.** M10's whole event is a
  specialist pressing this, and today they cannot. One column and one endpoint.
- **A verdict, a shipment and a report all have no correction path.** Three frozen
  writes, one missing design, deliberately taken three times. Parking Lot.
- **The ledger is filled by hand and nothing watches it.** An empty ledger reads on
  a verdict as *no confounders* when it means *nobody looked*. The CLI and the
  panel say when it is empty; that is the whole of the mechanism.
- **A shipping date is recorded and displayed in UTC.** Bounded twelve-hour edge at
  a deadline boundary, and Google publishes its update dates in US/Pacific while
  the ledger stores calendar dates — the same edge, in a second place now.
- **The loop measures the head of the site.** Unchanged. The published prediction
  covers 12 of 147 target pages — 8%. Still the most likely thing to embarrass us.
- **The prediction is on work below the capacity line.** Unchanged. See item 2.
- **Four matching thresholds, one property.** Unchanged.
- **The hours are uncalibrated.** Unchanged. **Do not quote them.**
- **Audit findings are trusted at full confidence** — reproducible, not correct,
  and client-facing since M7. Unchanged.
- **A single probe is still a sample.** The citation sampling design does not
  exist and is one of the twelve published refusals.
- **In-app prompt sign-off still does not exist.** Unchanged, and it is M11's test.
- **Two database guarantees still live partly in application code.** `0007`'s
  supersede weakening and `0009`'s insert-only directive trigger. Unchanged.
- **One of M3's five volatility data points may have been our own bug.** Unchanged.

## ⚠️ Not verified

Everything claimed above has named evidence except this.

1. **Which commit staging is actually running.** Railway exposes no commit SHA at
   runtime. What *is* verified: deployment `ee298f23` reports SUCCESS against
   commit `2c97048`, `/health` returns 200, the served bundle is the new hash
   (`index-D8_ejAjv.js`, not the previous `index-Cl4c33NA.js`) and greps clean for
   every M9 string, and both new endpoints return 401 unauthenticated. That is as
   close as this can be checked from outside, and it is closer than last time.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at
  `2c97048`, working tree clean. Working dir
  `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase
  `xslwvntwrlvqccdupmni` — one project, shared by local and staging. Railway
  project `engine-optimization`, staging auto-deploys on push to `staging`.
  `main` does not exist. `.claude/` is gitignored and holds `app-as-me`, which
  runs a local server signed in as a real `auth.users` row so the human gates can
  be *looked at*. Use it to look.
- **Read first:** `docs/verification.md` — the arithmetic, the eight columns a
  verdict may write, why `too_early` is never one of them, and the ledger. Then
  `server/verify/verify.ts`, whose header is the argument. `docs/predictions.md`
  for why the window is anchored to approval; `docs/shipping.md` for the drift
  check the verdict reads. `README.md` has every command.
- **State:** 21 tables, RLS on. **Two clients: Storepro, and the `app-check`
  fixture.** Storepro — 4 months ingested (Apr–Jul), 3 audit runs, 15 active
  prompts, 240 probe runs, plan `70337c95` approved with 13 items, **0 shipped**,
  one prediction `a3e5a8a7` (window `2026-10`, answerable 2026-11-05, drift
  `not_shipped` with 3 September binding, **outcome null**), one report `079c69d1`
  published and frozen at method `2026-08-a` while the composer is `2026-08-b`.
  Fixture — 1 approved plan, 4 ranked items, **0 shipped**, two predictions: one
  over `2026-10` for the shipping gate and one over the closed month `2026-07`
  carrying the only verdict in the database (`held` · `promote`, frozen).
  **`algorithm_updates` holds six verified 2026 entries.**
- **The verdict's inputs are all present.** What **M11** still needs is October
  ingested, one write, and a report that carries the answer — and it cannot start
  before 5 November. **M10 is what happens in between**, and none of it is
  calendar-locked.

### What M9 built, and where

| File | What it does |
|---|---|
| `db/migrations/0013_verification.sql` | Nine guarantees: a Google-owned https source, a non-empty entry, ordered rollout dates, a known category, a slug id, a verdict that is an outcome *and* a decision *and* its working, no promotion over a confounder, `too_early` never written, and the verdict frozen once written. |
| `server/verify/effect.ts` | Pure, clock-free. The delta against the control, the raw figure named beside it, the noise floor read off the control set's own drift, and every unmeasured pair dropped and named rather than zeroed. |
| `server/verify/verify.ts` | Pure, `now` passed in. The bands, the four refusals, and `verificationPatch` — the only place that decides which columns a verdict may touch. |
| `server/verify/updates.ts` | Pure. The Google-source rule, the categories, the overlap test, and the confounder sentence. |
| `server/verify/sources.ts` | Every read and write. `writeVerdict` is guarded on `outcome is null` so two answers cannot both win. |
| `server/verify/build.ts` | Sequencing, and the rehearsal — which is marked unwritable rather than trusted not to be written. |
| `server/cli/verify.ts` | `npm run verify` prints the verdict or the refusal; `--over` rehearses; `--prediction --write` answers one. |
| `server/cli/updates.ts` | `npm run updates` — the ledger, and which recorded windows each entry touches. |
| `server/verify/verify.test.ts` | 35 tests, each named after a way a verdict could be a lie that still reads like a verdict. |
| `client/src/App.tsx` → `Verification` | Leads with the refusal and its date. No button, and it says why. |
| `server/cli/fixture.ts` | Gains a prediction over a closed month, so the writer's accept path can be pressed at all. |

### Don't

- **Don't write a verdict for `a3e5a8a7` before 2026-11-05**, and don't write
  `too_early` ever — the database refuses it and the reason is the work queue.
- **Don't re-derive or move a readback window**, and don't let anything in
  `windows.ts` read the clock.
- **Don't store a number against a `confounded` window.** The arithmetic still
  runs and the figure goes in the notes marked *"for the record only"*; a value in
  `actual_value` will be quoted as though the window could answer.
- **Don't treat a page Search Console did not return as a page with no
  impressions.** Fifth time. Drop it, name it, and say how many.
- **Don't let an unverified ledger entry pass silently.** It refuses the verdict
  on purpose; ignoring it turns *nobody checked* into *no confounders*.
- **Don't write a rehearsal.** `--over` picks a month for having data in it, which
  is the one thing `windows.ts` exists to make impossible.
- **Don't publish, approve, ship or verify as a person.** The gates are the
  product.
- **Don't add a publication check to `compose.ts` without adding it to the
  required-check array in the newest migration declaring one** — a test reads the
  last such migration (`0012` today) and fails if the two disagree — and don't
  change the composer or a check without bumping `REPORT_METHOD_VERSION`.
- **Don't take a green push as a deploy.** `railway deployment list --json`, read
  `queuedReason` and `commitHash`, then download the served bundle and grep it.
- **Don't trust a claim in a handover you cannot check.**
