# Engine Optimization — Handover
_2026-08-19 · M8 built and proven · one click from closing · arc 10_

## ▶️ Paste this into a new session

```
Engine Optimization M8 — one click from closing

Read coreshift-kanbans/engine-optimization/HANDOVER.md and docs/shipping.md.

M8 is built and proven. The writer, its eight refusals and the drift check all
exist and were exercised against the live database; 188 tests across seven
suites; staging live at 953a5b0.

The doneWhen was REVISED on 2026-08-17, on Ricky's call, and the reason matters.
It originally required a specialist to mark one of Storepro's approved items
shipped. Storepro's August work is not being done — the milestone was a test of
the app, not a commitment to the site — so that clause became unmeetable
honestly. And the shortcut is the worst option available: shipped_at is frozen on
write with no correction path, and the composer reads it to tell a client an item
was delivered, so pressing the gate on Storepro to prove it works writes a
permanent false statement about a real client's work. Walking through a gate to
prove it is shut is not a test of the gate.

So the human act stayed and its subject moved to the app-check fixture client
(`npm run fixture -- --seed`, already seeded and live): status prospect, domain
app-check.invalid, named as not a client in the client list.

NEW doneWhen: "A specialist records a shipment in the app on a deployed
environment, with evidence, and the shipping record and every prediction change
accordingly."

What remains is one click, by Ricky, on staging. If he has done it, verify the row
out of Postgres, exercise the freeze against that real row, confirm the panel and
the CLI agree, and offer /land. If he has not, do not press it for him and do not
press anything on Storepro.

Check the staging deploy before you trust it. A deploy FAILED on 2026-08-19 with
no runtime logs at all and the identical commit succeeded on retry — see the board.
`railway deployment list` and look for FAILED, not just the newest row.

Give me the 5-line orientation, then get on with it.
```

## Where we are — for Ricky

- **M8 is built. It is not closed, and that is on purpose.** The system can now be
  told the work is done — and nothing has been told, because nothing has been
  done. Marking an item shipped that has not shipped is forging the record, which
  is the single thing this milestone exists to prevent.
- **What you can do now that you could not yesterday.** Record a piece of work as
  delivered, with the pull request attached and your name on it, from the app.
  The report stops saying *0 of 13* the moment you do.
- **What the system now polices.** Every prediction says whether the work it is
  about shipped early enough for its window to mean anything — and, while it has
  not, **the exact date it has to by**. That date is knowable months ahead and
  until today it was buried in a source file.
- **The number, again: 3 September.** Ship the FAQ item on or before it and the
  recorded October window stands. Ship on the 4th and October measures a blend,
  so November's answer is *"we cannot tell"* rather than yes or no. It comes out
  of the same function that fixed the window, and this session verified it by
  running that function rather than by reasoning about it.
- **One thing worth knowing.** Adding the shipping statement to the report moved
  the composer to `2026-08-b`, which surfaced that the report panel printed the
  *composed* method version under a green **published** badge — so your frozen
  July report appeared to carry a version it was not published under. Fixed in
  both the panel and the CLI. The panel will also now say permanently that the
  records have moved since publication, which is true and unavoidable.
- **Verified by:** all eight database guarantees exercised against the real
  Storepro FAQ item `1ec62ed8` and refused **by name**, inside a block that rolled
  back; the accept path run through the real writer against a scratch client,
  which recorded a date, a link and `ricky@coreshifthq.com`, then refused every
  attempt to un-ship, re-date, swap the evidence or reassign the owner — while
  still allowing a move to `verified`, so M9 is not blocked; the scratch client
  deleted and the database confirmed byte-identical (1 client, 41 work items, 0
  shipped rows, 0 with evidence, 0 with an owner). Every endpoint refusal
  exercised over HTTP. **188 tests across seven suites**, typecheck clean.
  Staging deployment `dc8236cd` **SUCCESS** with no FAILED above it, serving
  `index-DH96ZgZx.js` — downloaded and grepped, all six new strings present — and
  all three new endpoints 401 unauthenticated. `dev` and `staging` at `3d14835`.
- **Not verified:** two things, named in **⚠️ Not verified** below.

## 👉 On you

1. **Do a piece of August's work, then press the button. That closes M8.** The
   cheapest is item 1, *Some URLs return 200 with no content* — **2.8 hours
   across 3 URLs**, above the capacity line, nothing depends on it. The audit
   re-run on 2026-08-15 still names the same three:
   `storepro.co.nz/blocks/contact-form/`, `/blocks/footer/`,
   `/blocks/join-our-team/`. ⚠️ **Give them real content and the next audit marks
   the item finished on its own, which is what turns *Mark shipped anyway* into
   the one-click. 404 them and the readback correctly reports `not_assessed`
   forever, and you record it with *Mark shipped anyway*.** Then open Storepro →
   Acceptance readback and press it on that row with the pull request as the
   evidence. ⚠️ **It is frozen the instant it is written** —
   no un-shipping, no re-dating, no swapping the evidence. Press it once and on
   the right row. **Default if you say nothing:** M8 stays open and the report
   keeps saying 0 of 13, correctly.

2. **Does the FAQ item get the hours? Decide by 3 September.** Unchanged from the
   last handover and now enforced by something that will say so: an 18-hour item
   in a 12-hour month, ranked third, marked below the capacity line by the plan
   itself, so it slips by default. **Default:** nothing changes, and November's
   first verified prediction comes back `confounded`.

3. **A second client, when you're ready.** Still not blocking. Still the only
   thing that tests M6's four matching thresholds. **Default:** Storepro-only.

**Decided and closed:** the shipping record is frozen once written, on the same
grounds as a published report and a recorded prediction — the date is what every
prediction is measured against, so a date that can move is a window that can be
made to have been met. The correction path for both is one Parking Lot card, to
be built once rather than twice. The drift check states the position and does not
write `predictions.outcome`; verification is M9's. `REPORT_METHOD_VERSION` moved
to `2026-08-b`. Everything else from the last handover stands: no report is
emailed or exported, one published report per cycle, competitor cohort at eight,
prompt generation in-house, Ahrefs Brand Radar declined.

## 🔴 Risks you're carrying

- **A recorded shipment cannot be corrected.** New this session, and it is the
  deliberate half of the freeze. An item shipped by mistake stays shipped; a
  mistyped evidence link stays mistyped. Same gap the published report has, and
  in the Parking Lot with the shape of the fix.
- **The panel offers *Mark shipped anyway* on every item, and will keep doing so
  until real work is done.** ✅ The audit has been re-run (`d853a778`,
  2026-08-15), so the readback is a readback rather than a baseline and *can*
  mark things finished. It still reports 0 finished / 12 failing / 1 needs a
  person, because nothing has been fixed. The foot-gun stands: the warning text
  is there, but the button next to it is one click from a frozen record.
- **An authored action can offer a fix its own acceptance criterion cannot
  observe.** New, and it is on the path to closing M8. Item 1 permits either
  giving three pages content or 404-ing them and removing them from the sitemap.
  Only the first can ever read back as `passed` — a page nobody crawls is
  `not_assessed`, which is the honest verdict and not a bug. Nothing checks for
  this class of mismatch. Card in This Week.
- **A failed deploy is silent.** Unchanged. Railway keeps serving the last good
  build. Never take a green push as a deploy.
- **The loop measures the head of the site.** Unchanged — the published
  prediction covers 12 of 147 target pages, 8%. Still the most likely thing to
  embarrass us.
- **The prediction is on work below the capacity line.** Unchanged. See item 2.
- **Four matching thresholds, one property.** Unchanged.
- **The hours are uncalibrated.** Unchanged, and now *closer* to answerable:
  `shipped_at` can finally be written, so the clock on calibration starts with
  the first real shipment. **Do not quote them.**
- **Audit findings are trusted at full confidence** — reproducible, not correct,
  and client-facing since M7. Unchanged.
- **A single probe is still a sample.** Unchanged. The citation sampling design
  does not exist and is one of the twelve published refusals.
- **In-app prompt sign-off still does not exist.** Unchanged, and it is M10's
  whole test.
- **A published report has no correction path.** Unchanged, and now it has a
  sibling — see the first risk.
- **Two database guarantees still live partly in application code.** `0007`'s
  supersede weakening and `0009`'s insert-only directive trigger. Unchanged.
- **One of M3's five volatility data points may have been our own bug.**
  Unchanged.

## ⚠️ Not verified

1. **Nobody has recorded a shipment on a deployed environment.** The accept path
   was run through the real writer — `judgeShipment`, `recordShipment`, the owner
   resolution and the drift — against a scratch client, and every endpoint
   refusal was exercised over HTTP against a local server on the production
   bundle. The *click itself*, on staging, signed in as a real person, has not
   happened. It cannot be rehearsed on Storepro without writing a frozen record
   about work nobody did.
2. **The readback panel's shipping controls were verified by reading the DOM, not
   by screenshot.** The browser pane returned blank images throughout this
   session while reporting a 1280×720 viewport with the elements in view, so the
   evidence is the rendered text and element state read out of the live page:
   warning copy present, evidence field empty, *Record it as shipped* disabled
   until a link is typed, attribution line naming the signed-in specialist. That
   is stronger than a screenshot for what it asserts and weaker for layout.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at
  `3d14835`. Working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`.
  Supabase `xslwvntwrlvqccdupmni`. Railway project `engine-optimization`, staging
  auto-deploys on push to `staging`. `main` does not exist. `.claude/` is now
  gitignored — it holds local launch configs, including `app-as-me`, which starts
  a local server signed in as a real `auth.users` row so the human gates can be
  *looked at*. Use it to look, not to press.
- **Read first:** `docs/shipping.md` — the whole milestone, both halves, and the
  list of what it does not cover. Then `server/ship/drift.ts`, whose header
  explains why re-deriving the window from `shipped_at` and storing it would have
  destroyed the guarantee. `docs/predictions.md` for why the window is anchored to
  approval. `README.md` has every command.
- **State:** 21 tables, RLS on. Storepro only. **41 work items, 0 shipped, 0 with
  evidence, 0 with an owner.** 4 months ingested (Apr–Jul), 2 audit runs (both
  `partial` at 147/202 — normal), 15 active prompts all reviewed, 240 probe runs.
  ⚠️ There are now **3 audit runs**: `54b3758e` (the plan's baseline),
  `d853a778` (2026-08-15, the first that post-dates approval, so the first the
  readback can mark anything finished from), and one earlier run.
  Plans: `62ff1c2c` approved (M4 history, leave it), `101a4531` superseded,
  `70337c95` approved (M5, 13 items). One prediction `a3e5a8a7`, immutable, window
  `2026-10`, answerable 2026-11-05. One report `079c69d1`, published and frozen at
  method `2026-08-a` while the composer is now `2026-08-b`.
- **The one-click's evidence defaults to the audit run that agreed**, as
  `${origin}/api/audits/<runId>`. That is an authenticated artefact, not something
  a client opens. Evidence is what a colleague can check the claim against; if a
  client-facing report format is ever built, look at this again.
- **`latestShipDate` must keep deriving its answer by running `readbackWindow`.**
  The latency subtraction is only a seed for where to start looking. A test
  asserts, for every change type across four months, that the day after the answer
  earns a different month — that test is the guarantee, not the function's
  arithmetic.

### What M8 built, and where

| File | What it does |
|---|---|
| `db/migrations/0012_shipping_record.sql` | Eight guarantees: evidence and an owner, evidence is a link, only approved work ships, `status` and `shipped_at` agree, not before the plan's approval, not in the future, frozen once written, and `shipping_stated` added to the report's required-check array. |
| `server/ship/ship.ts` | Pure. Every refusal, with `now` passed in. `itemBlocker` is split out so the panel can ask "would the gate refuse this?" without inventing an identity to ask with. |
| `server/ship/drift.ts` | Pure. `latestShipDate` and `windowDrift`. Authors the sentence the report and the panel both carry, the same way `windows.ts` does. |
| `server/ship/sources.ts` | Every database read and write. The `recordShipment` update is guarded on `shipped_at is null` so two presses cannot both win. |
| `server/ship/build.ts` | Orchestration. Decides nothing. |
| `server/cli/ship.ts` | `npm run ship` prints the record and every deadline; `--item --evidence --by` records one. `--by` resolves an email to a real user or refuses. |
| `server/ship/ship.test.ts` | 22 tests, each named after a way a shipping record can be a lie that still reads like a record. |
| `client/src/App.tsx` → `ShippingRecord` | Read-only panel, leading with the binding date. |
| `client/src/App.tsx` → `Readback` | The one-click, and no button wherever the gate would refuse. |
| `server/report/compose.ts` | Pending predictions carry the shipping statement; tenth publication check; `REPORT_METHOD_VERSION` → `2026-08-b`. |

### Don't

- **Don't mark anything shipped that has not been done.** This is the whole
  milestone. It is also now one click away, which makes it easier to get wrong
  than it was yesterday.
- **Don't publish, approve or sign anything as a person.** The gates are the
  product.
- **Don't infer shipping from the readback.** It reports; a specialist decides.
- **Don't re-derive a prediction's readback window from `shipped_at` and store
  it.** That would make every prediction retroactively correct about its own
  timing, which is exactly the story-with-the-flattering-dates `windows.ts`
  exists to refuse.
- **Don't write `predictions.outcome` from a late shipment.** `confounded` is a
  verdict; M8 states the position and M9 decides.
- **Don't let anything in `windows.ts` read the clock, and don't back-date a
  window.**
- **Don't add a publication check to `compose.ts` without adding it to the
  required-check array in the newest migration.** A test reads the *last*
  migration that declares that array and fails if the two disagree.
- **Don't change the composer or a check without bumping
  `REPORT_METHOD_VERSION`** — and check that nothing prints the composed version
  where a published one belongs.
- **Don't offer an action in the UI that the gate behind it will refuse.**
- **Don't take a green push as a deploy.** `railway deployment list`, look for
  FAILED, download the served bundle and grep it.
- **Don't trust a claim in a handover you cannot check.**

### Useful

```bash
npm run ship     -- --client storepro                       # the record, every deadline, every drift
npm run ship     -- --client storepro --item <id> --evidence <url> --by <email>
npm run test:ship                                           # 22 tests, offline
npm run report   -- --client storepro                       # compose and print; writes nothing
npm run readback -- --client storepro                       # acceptance criteria vs the latest audit run
npm run audit    -- --client storepro                       # needed before the readback can agree with anything
railway deployment list                                     # FAILED is silent — look for it
```

**Local human gates:** `AUTH_DISABLED=true` skips login and its default identity
(`local@localhost`) is deliberately not a real `auth.users` row, so every gate —
publish, approve, and now ship — rejects it. The panels say so instead of offering
a button. `.claude/launch.json`'s `app-as-me` config supplies a real identity so
those branches can be inspected; it is for looking at, not for pressing.
