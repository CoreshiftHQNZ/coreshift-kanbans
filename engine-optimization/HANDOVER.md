# Engine Optimization — Handover
_2026-08-20 · **M12 client onboarding is current**, inserted ahead of the handover (now M13, still 7 September) · M11 stays blocked until 5 November · arc 13_

## ▶️ Paste this into a new session

```
Engine Optimization — M12: client onboarding in the app

Inserted 2026-08-20. Ricky went to add a real client and could not: it is an old
client the agency manages from a different email address, so the premise the
measurement layer rests on -- access@growthpartners.co.nz already holds
everything, so onboarding needs no Google-side work -- does not hold for it.

doneWhen: A specialist adds a real client through the app on a deployed
environment, choosing which account its access comes through, and its Search
Console and GA4 access is proved to work at the permission level the data needs
before the client is saved.

Read coreshift-kanbans/engine-optimization/HANDOVER.md, then
docs/google-access-setup.md in full, then server/google/auth.ts. In that order --
the doc specifies a mode the code does not have, and reading the code first makes
it look like a missing feature rather than an unimplemented decision.

─── The three findings this milestone exists for ─────────────────────────────

1. The documented fallback has never existed in code. The setup doc's "Fallback:
   direct per-property grants" says to grant the service account email directly
   on the property, "same code path -- just skip the impersonation subject".
   auth.ts always sets `sub` in the JWT, from process.env.GOOGLE_SUBJECT. There
   is no direct path.

2. Access identity is process-global. GOOGLE_SUBJECT is one env var for the whole
   deployment. Nothing on clients, properties or property_access records which
   account a client's access comes through, so "specify the access account" has
   nowhere to be stored. property_access already carries state, permission_level,
   verified_at and failure_reason per property per source -- it is the right home
   and it is missing exactly one thing.

3. RED. The token cache is one unkeyed module-level singleton (`let cached` in
   auth.ts). Fix this FIRST and do not build anything on top of it until it is
   keyed. With two access accounts in existence, whichever mints a token first
   lends it to the other for the rest of the hour -- so one client's ingest runs
   against another's Google account and returns rows that look exactly like the
   right ones. Plausible numbers from the wrong source is the worst thing this
   product can produce. It is harmless today only because one subject exists,
   which means the bug arrives with the feature.

─── Three access modes, and the one the blocked client needs ────────────────

  delegated, access@growthpartners.co.nz   every client today. Unchanged.
  delegated, a different Workspace user    works with the existing domain-wide
                                           delegation, no new Google-side setup,
                                           as long as the address is inside
                                           growthpartners.co.nz.
  direct, no impersonation                 the service account itself is granted
                                           on the property. The only mode that
                                           works for an address outside the
                                           Workspace. This is the documented
                                           fallback that has no code.

The service account is seo-data-reader@gp-seo-data.iam.gserviceaccount.com
(project gp-seo-data). Whoever owns the client's GSC property adds that address
under Settings -> Users and permissions; GA4 under Property access management,
role Viewer, notification unchecked. No Workspace admin is involved in direct
mode, which is why it solves an old client managed from somewhere else.

─── NOT in scope, decided ───────────────────────────────────────────────────

Do not create a service account per client, and do not build anything that mints
or stores a service-account private key. One service account serves every client
because access is granted inside GSC and GA4 rather than through GCP IAM -- the
setup doc calls the IAM step "the part people get wrong" and says to skip it. A
second source of long-lived keys would have neither a secret store nor a rotation
story. If Ricky raises it again, this is the reason, not a capability gap.

─── What the wizard is for, and the trap it must not fall into ──────────────

Capture the access mode and account, print the exact grant text for whoever owns
the property, then PROVE the access before the client is saved -- at the
permission LEVEL, not merely that the property appears in a list. The 2026-08-13
inventory found 11 of 65 Search Console properties present for access@ and
returning HTTP 403 as siteUnverifiedUser. A tickbox saying access was granted
would have onboarded all eleven, and every audit for them would have degraded to
crawl-only while looking configured.

GA4 has a second trap already written up: 22 properties named *Filtered* and 22
named *Test*, usually in matched pairs for the same site. Ingesting the Test one
yields near-zero sessions that read as a traffic collapse. The property ID must
be chosen deliberately and recorded -- never inferred from a name match. The
wizard should show the candidates it can see and make the human pick.

─── Don't ──────────────────────────────────────────────────────────────────

- Don't build the wizard before the token cache is keyed by subject.
- Don't let a client be saved on an unproven access grant, and don't collapse
  "present in the list" into "access". Store the permission level.
- Don't onboard a client as a person. The gates are the product; app-as-me is
  for looking.
- Don't put GOOGLE_SUBJECT's value in the wizard as a default the user cannot
  see -- an inherited access account that nobody chose is how the wrong one gets
  used for a year.
- Don't touch Storepro's access rows. They have worked since 2026-08-13 and
  M13's handover test on 2026-09-07 depends on them.
```

## Where we are — for Ricky

- **M10 is done, and you closed it yourself.** Four presses, all on the fixture,
  all against staging. A specialist can now record a verdict, sign off a prompt
  set, and correct a mistake — none of which needed a terminal by the end of the
  day, and all three of which did at the start of it.
- **The verdict control writes what the machine decided, not what a person
  typed.** There is no outcome dropdown and no decision dropdown, on purpose. The
  answer on screen came out of the matched control, the noise floor read off that
  control's own drift, the shipping record and the ledger. What you recorded when
  you pressed it is that you have read it and stand behind it — which is the only
  thing a person can honestly add to a number, and it is what the new column
  stores.
- **You saw the confounder cap work.** Two verdicts, the same +28 points against
  control. The one over a July with nothing announced over it came back
  **promote**. The one over a June that two Google updates overlap came back
  **keep_testing**, with both updates named on the verdict and linked to Google's
  own status page. Same arithmetic, different conclusion, and the difference is
  the ledger doing exactly what it was built in August to do.
- **A mistake can now be undone without anything being rewritten.** You corrected
  the shipment's evidence link, and the original still reads `https://google.com`
  in the database — untouched. That is the whole design: nothing is edited, a new
  row supersedes, and every reader takes the latest while still showing you what
  it superseded. One design covering a published report, a recorded shipment and
  a written verdict.
- **A correction never leaves the app.** Your call, and it held: the report a
  client received stays the document they received. The correction sits beside it
  in the app and travels into the next report's corrections section. Nothing is
  re-sent.
- **Nothing of Storepro's moved.** `a3e5a8a7` is still refused by name until
  5 November with its outcome null, still 0 shipped, still no corrections, and the
  published report is still frozen exactly as it went out.
- **Verified by:** your four presses, read back out of Postgres afterwards — 5 of
  5 prompts signed off at 03:32:51, both verdicts frozen with your name on them,
  correction `f2d8c709` superseding shipment `c266bd31` with the original evidence
  link intact; your Supabase session refreshed at 03:32, the minute of the first
  press, which the local no-auth mode can never produce because it never signs in;
  **14 database refusals fired by name** against the live database inside a
  transaction that was rolled back so nothing was kept; 253 tests across 9 suites,
  typecheck clean; staging deploy `95386240` SUCCESS on commit `5135d6d`, `/health`
  200, the served bundle downloaded and grepped for every new string, all five new
  endpoints 401 unauthenticated.
- **Not verified:** one thing, named in **⚠️ Not verified** below.

## 👉 On you

1. ✅ **Decided 2026-08-19 — M12 comes forward, which was your default.** What is
   left on you is one thing: **book Mal for the week of 7 September.** The test
   cannot run earlier — a full monthly cycle needs a month to run over, and
   Storepro's August Search Console figures are not final until around
   5 September. That is 2.5 weeks out rather than eleven, which is still the
   argument for bringing it forward, and the weeks in between are prep on four
   named cards. Budget most of a day; it is a full cycle, not a walkthrough, and
   **he must not be helped during it** — that is the whole measurement.
   **Default if you say nothing:** the week passes, October becomes the next
   opportunity, and M12 lands after M11 rather than before it, which is the
   outcome this decision existed to avoid.
2. **Tell the team about 3 September.** Unchanged, and now the sharpest thing on
   the board by a distance: it is the last day *"Question content is marked up as
   such"* can be recorded as shipped and still leave October able to answer
   anything. Ship on the 4th and November's first verdict comes back `confounded`
   — no answer rather than a wrong one, at the cost of a full cycle. **Nothing
   chases it. There is no scheduler in this system.** **Default:** the work slips
   and November is inconclusive.
3. **Sign off a real client's next prompt set in the app.** Small. Storepro's
   fifteen prompts were all signed off in M6, so there was nothing real to press
   and the gate was proved on the fixture. Next time a set is generated, sign it
   off in the panel rather than the terminal — that is the path a specialist who
   is not you will take. **Default:** the CLI keeps working and M12 discovers it.
4. **A second client, when you're ready.** Still not blocking, still the only
   thing that would test M6's four matching thresholds against more than one
   property. **Default:** Storepro-only.

**Decided and closed:** a correction supersedes and never edits, and it never
leaves the app — the report a client received stays the document of record. A
correction states a corrected reading or withdraws the write, never both. What it
may touch is bounded per kind, and a shipment correction can never re-attribute
the delivery to somebody else. A corrected verdict is held to every rule the
first one was. A verdict is attributed to the session that pressed it and never
to a name typed into a form. Everything else stands: the capacity line comes off
the next plan, no report is emailed or exported, one published report per cycle,
competitor cohort at eight, prompt generation in-house, Ahrefs Brand Radar
declined.

## 🔴 Risks you're carrying

- **The next milestone is blocked on a calendar for eleven weeks.** M11 cannot
  start before 5 November. This is the second time the arc has hit this and the
  board will start overstating progress again if nothing fills it. Item 1 above.
- **3 September is unwatched.** The binding shipping date for October to answer
  anything, and nothing in this system chases it.
- **Withdrawing a verdict does not put the prediction back in the work queue.**
  Found while building M10 and written into `docs/corrections.md` rather than left
  to be discovered. The `outcome is null` index *is* the queue and a withdrawal
  supersedes rather than nulls, so the row stays out of it. Every reader treats a
  withdrawn verdict as unanswered; the database index does not. Parking Lot.
- **The ledger is filled by hand and nothing watches it.** An empty ledger reads
  on a verdict as *no confounders* when it means *nobody looked*.
- **Staging deploys have two failure signatures.** Silent no-runtime-logs failures
  roughly every other time, and twelve-minute `QUEUED` stalls. `railway deployment
  list --json` is the fix for both — `meta.queuedReason` names the stall and it is
  the only place the commit hash appears. Both of M10's deploys were clean first
  time; that is not a pattern yet.
- **A shipping date is recorded and displayed in UTC.** Bounded twelve-hour edge
  at a deadline boundary, and Google publishes update dates in US/Pacific while
  the ledger stores calendar dates — the same edge, in a second place.
- **The loop measures the head of the site.** Unchanged. 12 of 147 target pages —
  8%. Still the most likely thing to embarrass us.
- **The prediction is on work below the capacity line.** Unchanged.
- **Four matching thresholds, one property.** Unchanged.
- **The hours are uncalibrated.** Unchanged. **Do not quote them.**
- **Audit findings are trusted at full confidence** — reproducible, not correct,
  and client-facing since M7. Unchanged.
- **A single probe is still a sample.** The citation sampling design does not
  exist and is one of the twelve published refusals.
- **Two database guarantees still live partly in application code.** `0007`'s
  supersede weakening and `0009`'s insert-only directive trigger. Unchanged.
- **One of M3's five volatility data points may have been our own bug.** Unchanged.

## ⚠️ Not verified

Everything claimed above has named evidence except this.

1. **Which commit staging is actually running.** Railway exposes no commit SHA at
   runtime. What *is* verified: deployment `95386240` reports SUCCESS against
   commit `5135d6d`, `/health` returns 200, the served bundle is the new hash
   (`index-B89ex2Sa.js`) and matches the local build byte-for-byte by name, it
   greps clean for every M10 string, and all five new endpoints return 401
   unauthenticated. That is as close as this can be checked from outside.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, `dev` and `staging` both at
  `5135d6d`, working tree clean. Working dir
  `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase
  `xslwvntwrlvqccdupmni` — one project, shared by local and staging. Railway
  project `engine-optimization`, staging auto-deploys on push to `staging`.
  `main` does not exist. `.claude/` is gitignored and holds `launch.json`, whose
  `app-as-me` config runs a local server signed in as a real `auth.users` row so
  the human gates can be *looked at*. Use it to look, never to press.
- **Read first:** `docs/corrections.md` — the one design behind three frozen
  writes, what a correction may touch and what it may never touch, and the
  withdrawn-verdict limit. Then `docs/verification.md` for the arithmetic, the
  nine columns a verdict may write and why the app had no button until `0014`.
  `docs/predictions.md` for why a window is anchored to approval;
  `docs/shipping.md` for the drift check. `README.md` has every command.
- **State:** 22 tables, RLS on. **Two clients: Storepro, and the `app-check`
  fixture.** Storepro — 4 months ingested (Apr–Jul), 3 audit runs, 15 active
  prompts all reviewed, 240 probe runs, plan `70337c95` approved with 13 items,
  **0 shipped**, one prediction `a3e5a8a7` (window `2026-10`, answerable
  2026-11-05, drift `not_shipped` with 3 September binding, **outcome null**), one
  report `079c69d1` published and frozen at method `2026-08-a` while the composer
  is `2026-08-c`. Fixture — 1 approved plan, 5 ranked items, 5 prompts **all
  signed off**, **1 shipped** (`c266bd31`, corrected), three predictions: one over
  `2026-10` unanswered, and two over closed months **both now carrying frozen
  verdicts** (`held · promote` over 2026-07, `held · keep_testing` over 2026-06
  with two confounders). **`corrections` holds one row.** `algorithm_updates`
  holds six verified 2026 entries.
- **M11 needs three things and cannot start before 5 November:** October
  ingested, one press of the verdict control that now exists, and a report that
  carries the answer.

### What M10 built, and where

| File | What it does |
|---|---|
| `db/migrations/0014_specialist_controls.sql` | `predictions.verified_by`, required the moment an outcome exists and frozen with the verdict; the `corrections` table and its nine rules; `corrections_stated` added to the required publication checks. |
| `server/correct/correct.ts` | Pure, `now` passed in. `CORRECTABLE`, every refusal, and `readThrough` — which follows the `supersedes` chain rather than the clock. |
| `server/correct/sources.ts` | Every read and write. ⚠️ Nothing in it updates a `reports`, `work_items` or `predictions` row, and that is the design rather than an omission. |
| `server/correct/build.ts` | Sequencing. `correctOne` reads the subject first so "nothing to correct" and "malformed correction" are different sentences. |
| `server/correct/correct.test.ts` | 23 tests, each named after a way a correction could be a hole in a freeze and still look like a correction. |
| `server/ai/review.ts` | The prompt sign-off writer, shared by the CLI and the endpoint. |
| `server/verify/verify.ts` → `verificationPatch` | Now takes an identity and refuses without one. Nine columns, not eight. |
| `server/routes/api.ts` | `POST /predictions/:id/verify`, `POST /corrections`, `GET /clients/:slug/corrections`, `POST /clients/:slug/prompts/sign-off`. Identity from the session, never the body. |
| `server/report/compose.ts` | `2026-08-c`. A withdrawn shipment is `committed`, not `delivered`; the corrections section; `corrections_stated`. |
| `client/src/App.tsx` | `VerdictControl`, `SignOffControl`, `CorrectionControl` and `CorrectionTrail`. One correction component, three call sites. |
| `server/cli/fixture.ts` | Five items, an unreviewed prompt set, three predictions, three fabricated months. ⚠️ `--seed` drops and recreates the client. |

### Don't

- **Don't write a verdict for `a3e5a8a7` before 2026-11-05**, and don't write
  `too_early` ever — as a verdict or as a correction to one. The database refuses
  both and the reason is the `outcome is null` work queue.
- **Don't edit a frozen row to "apply" a correction.** The correction path
  supersedes; nothing in `server/correct/` updates a `reports`, `work_items` or
  `predictions` row, and a writer that "also updated the original for
  convenience" would undo the whole milestone while looking like a tidy-up.
- **Don't weaken a freeze trigger in a later migration.** A test asserts `0014`
  drops none of them; keep that true.
- **Don't add a field to `CORRECTABLE` without adding it to
  `corrections_fields_are_bounded` in `0014`** — a test compares the two — and
  remember a `CHECK` cannot carry a subquery.
- **Don't re-derive or move a readback window**, and don't let anything in
  `windows.ts` read the clock.
- **Don't store a number against a `confounded` window**, and don't treat a page
  Search Console did not return as a page with no impressions. Sixth time.
- **Don't let an unverified ledger entry pass silently.**
- **Don't write a rehearsal.**
- **Don't publish, approve, ship, verify or correct as a person.** The gates are
  the product. `app-as-me` is for looking.
- **Don't disable a control without naming every reason it is disabled.** M10's
  own bug: a dead button with no sentence beside it cost two real presses.
- **Don't add a publication check to `compose.ts` without adding it to the
  required-check array in the newest migration declaring one** (`0014` today),
  and don't change the composer or a check without bumping
  `REPORT_METHOD_VERSION`.
- **Don't take a green push as a deploy.** `railway deployment list --json`, read
  `queuedReason` and `commitHash`, then download the served bundle and grep it.
- **Don't trust a claim in a handover you cannot check.**
