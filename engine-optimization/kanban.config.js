// Engine Optimization — kanban config for tools/build.js.
//
// Edit this file to change anything project-specific (title, hero, goals,
// milestones, phases, links, roles). Card-level content lives in KANBAN.md.

module.exports = {
  // ── Source / output (both relative to this project folder) ────
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Engine Optimization",
  tagline:
    "The internal tool Growth Partners' SEO specialists run their clients on — audit, plan, do, measure, report, re-plan.",
  description:
    "A web app for managing SEO/AEO/GEO clients on a monthly cycle. Everything that can run unattended does: crawls, " +
    "Search Console and GA4 pulls, AI-citation probes, delta analysis, plan drafting, report drafting. A human signs off " +
    "before anything touches a client site or reaches a client. The thing that makes it different from every tool we " +
    "surveyed: it records what we predicted a change would do, then checks — against a control — whether it happened.",
  phase: "M12 · Client onboarding in the app — a real client whose access is not via access@growthpartners.co.nz",
  nextMilestone: {
    name: "A specialist adds a real client through the app, choosing which account its access comes through, and the app proves that access works before saving",
    date: "Blocking the next real client · the documented direct-grant fallback has never existed in code, access identity is process-global, and the token cache is unkeyed · M13's handover test still runs the week of 2026-09-07 on Storepro, and M11's verdict still waits for 2026-11-05",
  },

  // ── Goals (3 cards in a row) ──────────────────────────────────
  goals: [
    {
      icon: "🎯",
      title: "Specialists, not engineers",
      desc: "A team of SEO specialists runs the whole monthly cycle in a web app. Nobody opens a terminal.",
    },
    {
      icon: "🔁",
      title: "Close the assumption loop",
      desc: "Record what we expect a change to do, then verify it against an untouched control set next month. No prior art does this.",
    },
    {
      icon: "📈",
      title: "Built for 10, designed for 100",
      desc: "Ten clients today. Multi-client scheduling, per-client history and zero-touch Google access from day one.",
    },
  ],

  // ── Quick links ───────────────────────────────────────────────
  links: [
    {
      icon: "🗄",
      title: "Data model",
      desc: "docs/schema.md — clients, audits, findings, work, predictions, reports",
      url: "https://github.com/CoreshiftHQNZ/engine-optimization/blob/main/docs/schema.md",
      internal: true,
    },
    {
      icon: "🔑",
      title: "Google access setup",
      desc: "docs/google-access-setup.md — service account + domain-wide delegation",
      url: "https://github.com/CoreshiftHQNZ/engine-optimization/blob/main/docs/google-access-setup.md",
      internal: true,
    },
    {
      icon: "📐",
      title: "Audit method",
      desc: "docs/scoring.md — the 23 checks, and what makes a score reproducible",
      url: "https://github.com/CoreshiftHQNZ/engine-optimization/blob/main/docs/scoring.md",
      internal: true,
    },
    {
      icon: "📚",
      title: "Method source (Apache-2.0)",
      desc: "aaron-marketing-skills — CORE-EEAT + CITE frameworks we're adopting",
      url: "https://github.com/aaron-he-zhu/aaron-marketing-skills",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "R", name: "Owner",        person: "Ricky",                                     verbs: "Decide · prioritise · review" },
    { initial: "S", name: "Specialists",  person: "Growth Partners SEO team",                  verbs: "Run cycles · sign off · deliver" },
    { initial: "T", name: "The Tools",    person: "Claude Agent SDK · GSC/GA4 · DataForSEO",   verbs: "Crawl · probe · draft · measure" },
  ],

  // ── Milestones ────────────────────────────────────────────────
  // doneWhen is a single observable event — the only thing stopping
  // a milestone from quietly expanding.
  milestones: [
    {
      id: "M1",
      name: "Data spine",
      doneWhen: "One real client's GSC and GA4 data for a calendar month is visible in the app",
      status: "done",
    },
    {
      id: "M2",
      name: "Audit engine",
      doneWhen: "A crawl of a real client site produces a scored audit run with per-page snapshots and findings, viewable in the app",
      status: "done",
    },
    {
      id: "M3",
      name: "AI visibility panel",
      doneWhen: "A prompt set runs across every engine for one client and a citation is recorded with its raw answer",
      status: "done",
    },
    {
      id: "M4",
      name: "Work plan",
      // Revised 2026-08-13. The original doneWhen read "…is approved by a
      // specialist in the app", which tested two different things: that the
      // approval gate exists (M4's job) and that someone other than Ricky can
      // operate the tool — the handover milestone's doneWhen almost verbatim. The
      // duplication made M4 unclosable on a mail-provider config that has nothing
      // to do with the aggregator. The specialist test lives in the handover
      // milestone and only there — M8 when this was written, M12 after four
      // insertions since (M5, M8, M9, and the in-app controls milestone). It was
      // left reading M10 through two of those; corrected 2026-08-19. The number
      // moves; the rule does not.
      doneWhen: "A ranked work plan for one real client, merged from every finding source, moves to approved in the app — every item carrying its rationale and its originating source",
      status: "done",
    },
    {
      id: "M5",
      name: "Actionable work",
      // Added 2026-08-14 on Ricky's call, and it reorders everything after it.
      //
      // He asked the right question: "we will need a list of work to be done with
      // actual actionable items". M4 produces "Question content is marked up as
      // such · 14.5h" — a finding restated, not an instruction. Nobody on the team
      // can pick that up and start.
      //
      // It is a prerequisite rather than a nicety: a prediction is "we expect X
      // because we did Y", and Y has to be a specific, dated, completed action.
      // Without actionable items the prediction machinery has nothing real to
      // attach to, so this has to come first.
      //
      // The data is already stored — findings.affected_urls, evidence,
      // failure_check — so this is mostly turning what we hold into an
      // instruction, not gathering anything new.
      doneWhen: "Every item in an approved plan states what to do, which specific pages or assets to do it to, and how a specialist will know it is finished",
      // Landed 2026-08-14. Plan 70337c95, approved 01:01:46Z by
      // ricky@coreshifthq.com — 13 of 13 items carrying an action, their complete
      // target list and their acceptance criteria; 12 of the 13 decidable by
      // re-running the audit. Commit 754e70d.
      status: "done",
    },
    {
      id: "M6",
      name: "The prediction machinery",
      // Reshaped 2026-08-13, same day it opened, on Ricky's call.
      //
      // It read "a prediction made in one cycle is verified in the next and
      // reports a delta against its control set" — which cannot be satisfied in a
      // session for a calendar reason, not a build one. Verifying against the next
      // cycle needs the next cycle's data: a prediction recorded in August reads
      // back against September, which lands in Search Console in early October.
      // Back-dating it against a month already on file is exactly what the
      // readback protocol exists to forbid.
      //
      // The verification did not need a milestone of its own — the report
      // milestone already requires it ("what we expected, and what happened"), so
      // it lands there, on the calendar.
      //
      // ⚠️ Renumbered M5 → M6 on 2026-08-14 when actionable work was inserted
      // ahead of it. The arc grew from seven to eight, deliberately: a prediction
      // needs a concrete action to be about.
      doneWhen: "A prediction for a real client is recorded against a matched control set, with its readback window fixed before the change and visible in the app",
      // Landed 2026-08-14. Prediction a3e5a8a7 on plan 70337c95's top item —
      // gsc_impressions, expected up, no magnitude, over 2026-10, final from
      // 2026-11-05 — against control set d7de6e64, twelve matched untouched
      // pages at 8.5 points of pre-period divergence. Twelve of the thirteen
      // items were refused with a named reason, which is the part that took the
      // milestone. Commit 994f604, method in docs/predictions.md.
      status: "done",
    },
    {
      id: "M7",
      name: "Monthly report",
      // ⚠️ Split on 2026-08-14, on Ricky's call, the day M6 landed.
      //
      // It read "…what we did, why, what we expected, AND what happened" — and
      // "what happened" needs October's Search Console figures, which are final
      // on 5 November. Back-dating is refused by a database trigger on purpose.
      // So the milestone as written was calendar-locked for eleven weeks, which
      // is exactly the quiet expansion a doneWhen exists to prevent: a board
      // carrying an open milestone with nothing able to move.
      //
      // The verification did not get smaller by being split off — it got its own
      // finish line and its own date. What is left here is buildable today, and
      // it is also the thing M9's "a specialist runs a cycle unaided" is tested
      // against, so splitting unblocks more than it defers.
      doneWhen: "A specialist publishes a report for a real client stating what we did, why, and what we expected — with last cycle's predictions shown as pending and their readback windows visible",
      // Built 2026-08-14, commit b758643, and deliberately not closed. The report
      // is composed and stored as Storepro's 2026-07 draft with 9 of 9 publication
      // checks passing; the cycle moved measuring → drafted. The last word of the
      // doneWhen is "publishes", and that is a human act by construction: the
      // publisher is resolved to a real auth.users row and, in the app, taken from
      // the verified session. Publishing it as Ricky would have forged a human
      // gate, which is the failure this whole product exists to make impossible.
      // Landed 2026-08-14 21:44:15Z. Ricky published it himself — report 079c69d1
      // on cycle 017fe91f, published_by ricky@coreshifthq.com, cycle moved to
      // `published`, 9 of 9 review_checks passing and frozen with it. Every freeze
      // was then exercised against that real row and refused by name: body edit,
      // publication revoke, check flip, delete, and a second published report for
      // the cycle. review_notes stayed writable, which is correct. 162 tests across
      // six suites. Commits b758643 and 15a0f23. Method in docs/reports.md.
      status: "done",
    },
    {
      id: "M8",
      name: "The shipping record",
      // Inserted 2026-08-15, on Ricky's call, from his question at the end of the
      // M7 session: "we need some way of telling the system the work is done so
      // that it can police the assumptions and see if it worked."
      //
      // He was right, and the gap is wider than the Parking Lot recorded.
      // `work_items.shipped_at` has existed since 0001 and **nothing anywhere in
      // the system writes it** — not a CLI, not an endpoint, not the app. Same for
      // `owner_id` and `evidence_url`. M7's report reads that column to decide
      // "delivered", which is why it correctly reports 0 of 13 and why it will keep
      // reporting 0 for as long as no writer exists.
      //
      // Why it is not part of the readback milestone, which is where the Parking
      // Lot had it: the readback cannot begin before 5 November. Recording August's
      // shipping in November means reconstructing from memory the one field that
      // decides whether the prediction is readable at all. Same reasoning that
      // split M7 — work that must happen now, trapped in a milestone that cannot
      // move for eleven weeks.
      //
      // The policing half needs no new judgement, which is what makes this small
      // enough to land quickly: re-derive the window from `shipped_at` with the
      // existing pure `readbackWindow` and compare it to the window the prediction
      // recorded. For plan 70337c95 the boundary is **3 September** — verified by
      // running the function, not reasoned. Ship on or before it and the recorded
      // October window stands; ship on the 4th and the honest window was November,
      // so the October reading is `confounded` rather than `failed`.
      //
      // ⚠️ Ends on a human act, like M7's publish.
      //
      // Revised 2026-08-17, on Ricky's call. The original read "A specialist marks
      // an approved item shipped, with its evidence, and every prediction states
      // whether the work it is about shipped inside the window it assumed" — and
      // it assumed Storepro's August work would happen. It is not happening: the
      // milestone was a test of the app, not a commitment to the site.
      //
      // That left the clause unmeetable honestly. `shipped_at` is frozen the
      // moment it is written, there is no correction path, and the composer reads
      // it to tell a client an item was *delivered* — so pressing the gate on
      // Storepro to see whether it works costs a permanent false statement about a
      // real client's work in a document they receive. Walking through a gate to
      // prove it is shut is not a test of the gate.
      //
      // So the human act stays and its subject moves to the `app-check` fixture
      // (`npm run fixture`): status `prospect`, domain `app-check.invalid`, named
      // as not a real client in the client list. Storepro keeps 0 of 13, which is
      // true. What still has to happen is the thing M7 left undone as well — a
      // person pressing the control on a deployed environment.
      doneWhen: "A specialist records a shipment in the app on a deployed environment, with evidence, and the shipping record and every prediction change accordingly",
      status: "done",
    },
    {
      id: "M9",
      name: "The verdict machinery",
      // Split from the readback on 2026-08-19, on Ricky's call, the day M8
      // landed. Third time this call has been made and the third time for the
      // same reason: M7 was split from its verification, M8 was inserted ahead of
      // it because `shipped_at` had to be written while the work was being done
      // rather than reconstructed from memory in November, and this is the rest of
      // that same argument.
      //
      // The readback as written cannot close before 5 November — prediction
      // a3e5a8a7 reads back over October 2026 and those figures are not final
      // until then, and back-dating is refused by a trigger on purpose. Eleven
      // weeks of an open milestone with nothing able to move is precisely the
      // quiet expansion a doneWhen exists to prevent.
      //
      // What the verdict needs, though, all exists now and is all buildable now:
      // the delta-vs-control arithmetic, the writer that records an outcome
      // against terms the database has frozen, and the algorithm-update ledger
      // that populates `predictions.confounders`. `algorithm_updates` has existed
      // since `0001` and **nothing has ever written to it** — the same shape of
      // gap M8 found in `shipped_at`, and worth more here: deciding in November
      // whether a core update overlapped an October window, while October's
      // numbers are already on screen, is the order that lets the answer pick its
      // own confounder. Ledger first, verdict second.
      //
      // ⚠️ The verdict itself is deliberately not in here. Nothing in this
      // milestone may write `outcome`, `actual_value` or `control_value` for
      // a3e5a8a7 — including `too_early`, which would be honest and would still
      // empty the work queue that the `outcome is null` index exists to keep.
      //
      // Closed 2026-08-19. Met on all three clauses and checked mechanically
      // rather than from recollection: the arithmetic produced a full verdict
      // over Storepro's real June (failed · unproven, -6.1 points against the
      // matched control) using a3e5a8a7's own frozen pairs, with the May 2026
      // core update and the June 2026 spam update named from the ledger; and
      // a3e5a8a7 itself was refused by name with its 2026-11-05 date in both the
      // CLI and the app, with outcome/decision/verified_at/actual_value/
      // control_value/confounders all read back null out of Postgres afterwards.
      // 223 tests across 8 suites, tsc --noEmit exit 0, staging deploy ee298f23
      // SUCCESS with the served bundle downloaded and grepped.
      //
      // Two decisions taken inside it and enforced in 0013, both reversible only
      // by migration: a verdict is frozen once written (same grounds as a
      // published report and a recorded shipment), and `too_early` is never
      // written at all because it would empty the `outcome is null` work queue.
      doneWhen: "The verification arithmetic produces a complete verdict from real data on a closed month — the delta against a matched control, with every algorithm update overlapping the window named from the ledger — while a3e5a8a7's own verdict is refused by name as unanswerable until 2026-11-05 and nothing is written to its outcome",
      status: "done",
    },
    {
      id: "M10",
      name: "The controls a specialist presses",
      // Inserted 2026-08-19 on Ricky's call, the day M9 landed. Fourth time this
      // split has been made and the fourth time for the same reason: M7 was split
      // from its verification, M8 was inserted because `shipped_at` had to be
      // written while the work was happening rather than reconstructed in
      // November, M9 was split because the verdict machinery was buildable and the
      // verdict was not — and the readback still cannot close before 5 November.
      // That is eleven weeks. A milestone nobody can move is how a board starts
      // overstating progress, which is the one failure it has no defence against.
      //
      // What fills it is not filler. All three gaps were found by building M8 and
      // M9, all three are in-app, none waits on a calendar, and every one of them
      // blocks the handover milestone — "a specialist other than Ricky runs a full
      // monthly cycle unaided" — as hard as it blocks the readback:
      //
      // 1. A verdict cannot be recorded from the app at all. `predictions` has no
      //    `verified_by`, so a verdict pressed in the app could not be attributed,
      //    while every other frozen write here carries a name: `reports.
      //    published_by`, `work_items.owner_id`, `work_plans.approved_by`. So the
      //    single event the readback exists to produce happens at somebody's
      //    terminal. One column — written from the verified session and never from
      //    a request body, exactly as `owner_id` is — and one endpoint.
      //
      // 2. Prompt sign-off is still a CLI flag. `npm run probes --review <email>`
      //    is the only way to sign a prompt set off. It has demanded a real
      //    identity since M6, so it is correct; it is just not a surface, and a
      //    specialist who cannot sign off a prompt set in the app cannot run a
      //    cycle unaided. It has sat on the Parking Lot since M6 carrying a note
      //    saying it should be built alongside M8 or M9 rather than discovered in
      //    the handover. This is that, one milestone later than the note asked.
      //
      // 3. Three frozen writes and no correction path: a published report, a
      //    recorded shipment, and — since M9 — a written verdict. One design and
      //    three call sites, already specified on the Parking Lot: a superseding
      //    row rather than an edit, the original left on the record, the
      //    correction naming who made it and why, and every reader taking the
      //    latest. The cost of deferring it rises with each frozen write added,
      //    and M9 added the one with the highest stakes — an algorithm update
      //    discovered after a verdict cannot be added to its confounders.
      //
      //    Scope settled by Ricky on 2026-08-19: **in-app only, nothing is sent to
      //    the client.** The published report a client received stays the document
      //    of record; the correction is visible to the agency with the original
      //    readable underneath, and nothing notifies, re-issues or re-exports. A
      //    send path would be a bigger change than the correction and would decide
      //    the client-facing report format, which is deliberately still open.
      //
      // ⚠️ The doneWhen is three clauses where the rule asks for one observable
      // event, and that is a real weakening rather than an oversight. The
      // milestone is three named gaps; it is bounded by that list and by nothing
      // else, and anything found inside it that is not on that list is a card.
      //
      // ⚠️ Ends on a human act, like M7's publish and M8's shipment. Two of the
      // three controls are gates, and walking through a gate as Ricky to prove it
      // is shut is the failure this product exists to make impossible.
      //
      // ⚠️ Nothing in here may write a verdict for `a3e5a8a7`. The in-app verdict
      // control is proved on the `app-check` fixture over a month that has already
      // closed, exactly as M9 proved the writer — which needs a third fixture
      // prediction, answerable and unanswered, because the fixture's only closed
      // month already carries a frozen verdict. Storepro stays refused by name
      // until 2026-11-05 and its outcome stays null.
      doneWhen: "On a deployed environment a specialist signs off a prompt set and records a verdict in the app, both attributed to their own verified session, and a correction supersedes one of this system's frozen writes with the original still readable on the record",
      // Met 2026-08-19, all three clauses, by Ricky pressing them on the
      // `app-check` fixture against staging: 5 of 5 prompts signed off at
      // 03:32:51; `dca82ef8` answered `held · promote` and `18c4cde3` answered
      // `held · keep_testing` with both overlapping Google updates named on the
      // verdict; correction `f2d8c709` superseding shipment `c266bd31` while
      // `work_items.evidence_url` still reads what was written first. His
      // Supabase session refreshed at 03:32 — the minute of the first press —
      // which local no-auth mode cannot produce, because it never signs in.
      status: "done",
    },
    {
      id: "M11",
      name: "The readback",
      // Added 2026-08-14 when M7 was split; renumbered from M8 on 2026-08-15 when
      // the shipping record was inserted ahead of it, from M9 on 2026-08-19 when
      // the verdict machinery was split out ahead of it, and from M10 later the
      // same day when the in-app controls were inserted ahead of it too.
      //
      // 🔒 **Blocked on a calendar and on nothing else**, which is why it is not
      // the current milestone despite being next. It cannot open usefully before
      // 5 November. It is on the board under Blocked rather than In Progress so
      // that the column says what is true: no work on it can move. What is left here is
      // the verdict and only the verdict — every input it reads is M9's, so this
      // milestone spends eleven weeks waiting on a calendar and nothing else.
      // This is the half of the loop that
      // cannot be hurried: prediction a3e5a8a7 reads back over October 2026 and
      // those figures are final on 5 November. Everything it needs can be built
      // before then — the verification writer, the algorithm-update ledger that
      // populates `confounders` — and the milestone still cannot close until the
      // month exists. That is the point of it, not a defect.
      //
      // It is also the first time this system will be told it was wrong, which is
      // the outcome it was built to be able to survive: `failed` + `keep_testing`
      // is a legitimate pair, and `confounded` is a real outcome rather than a
      // euphemism.
      //
      // ✅ Every input is now built and exercised (M8 the shipping record, M9 the
      // arithmetic, the writer and the ledger). What is left is genuinely three
      // things: ingest October once it settles — the arithmetic refuses a month
      // with no complete snapshot rather than reading it as zero, so this is a
      // prerequisite and not a detail; run the verdict once, frozen afterwards;
      // and make the report carry the answer, which means a new publication
      // check, its twin in the newest migration's required-check array, and a
      // REPORT_METHOD_VERSION bump.
      //
      // ⚠️ Two things could still make this milestone close on `confounded`
      // rather than on yes or no, and both are legitimate outcomes rather than
      // failures: the FAQ item is below the capacity line and may not be done at
      // all, and if it ships after 2026-09-03 October contains days from before
      // the change.
      doneWhen: "A recorded prediction is verified against its matched control and the report states what actually happened, including when the answer is that we were wrong",
      // Was current from 2026-08-19; **handed the current slot to M12 later the
      // same day** and blocked on a calendar rather than on work. `a3e5a8a7`'s
      // window is 2026-10 and its figures are not final until 2026-11-05. Every
      // input exists — the arithmetic, the ledger, the writer, and now the
      // control that records it. What it still needs is October ingested, one
      // press, and a report that carries the answer, and none of the three can
      // be started early. It keeps its number: see the note on M12.
      status: "planned",
    },
    {
      id: "M12",
      name: "Client onboarding in the app",
      // Inserted 2026-08-20 on Ricky's call, and it is the fifth insertion in this
      // arc. He went to add a real client and could not: it is an old client the
      // agency manages from a different email address, so the whole premise the
      // measurement layer was built on — `access@growthpartners.co.nz` already
      // holds everything, so onboarding needs no Google-side work — does not hold
      // for it.
      //
      // Three things were found looking at whether this was a small change. It is
      // not, and the reason it is not is the third one.
      //
      // 1. **`docs/google-access-setup.md` already specifies the fix and the code
      //    does not implement it.** The doc's "Fallback: direct per-property
      //    grants" section says to grant the service account email directly on the
      //    property and describes it as *"same code path — just skip the
      //    impersonation subject"*. `server/google/auth.ts` has no such path: it
      //    always sets `sub` in the JWT, from `process.env.GOOGLE_SUBJECT`. The
      //    documented fallback has never existed in code.
      //
      // 2. **Access identity is process-global, not per-client.** `GOOGLE_SUBJECT`
      //    is one env var for the whole deployment. There is nowhere on a client,
      //    a property or `property_access` to record which account its access
      //    comes through — so "specify the access account" has no column to go in.
      //
      // 3. 🔴 **The token cache is a single unkeyed module-level singleton**
      //    (`auth.ts`, `let cached`), and that turns this feature into a data
      //    integrity bug rather than a schema addition. The moment two clients
      //    resolve to different access accounts, whichever mints a token first
      //    lends it to the other for the rest of the hour — so client B's ingest
      //    runs against client A's Google account and returns rows that look
      //    exactly like client B's. Plausible numbers from the wrong source is the
      //    worst failure this product can have, and it is the one thing every part
      //    of the measurement layer is built to refuse. Harmless today only
      //    because there is exactly one subject in existence.
      //
      // ⚠️ **What this milestone does not do: create a service account per
      // client.** Ricky asked for it as an option and it is the wrong shape. One
      // service account serves every client, because access is granted inside
      // Search Console and GA4 rather than through GCP IAM — the setup doc calls
      // that "the part people get wrong". One per client would multiply long-lived
      // private keys for no additional reach. And minting and storing a service
      // account private key from a web wizard is a credential path this project
      // should not grow: the existing key already lives in a secret store with a
      // documented rotation story, and a second source of keys would have neither.
      //
      // ✅ **What replaces it, and it is the more useful half anyway:** the wizard
      // captures the access mode and account, prints the exact grant text for
      // whoever owns the property, and then **proves the access works before the
      // client is saved** — at the permission *level*, not merely that the
      // property appears in a list. That distinction is not theoretical: the
      // 2026-08-13 inventory found **11 of 65** Search Console properties present
      // for `access@` and returning HTTP 403 as `siteUnverifiedUser`. A tickbox
      // saying access was granted would have onboarded all eleven.
      //
      // ⚠️ Ends on a human act, like M7's publish, M8's shipment and M10's three
      // controls. The specialist presses through the wizard; nothing onboards a
      // client on their behalf.
      doneWhen: "A specialist adds a real client through the app on a deployed environment, choosing which account its access comes through, and its Search Console and GA4 access is proved to work at the permission level the data needs before the client is saved",
      status: "current",
    },
    {
      id: "M13",
      name: "Handover to the team",
      // ⚠️ Renumbered M11 → M12 on 2026-08-19 when the in-app controls milestone
      // was inserted, and M12 → M13 on 2026-08-20 when client onboarding was
      // inserted ahead of it. It did not move further away: the onboarding
      // milestone fills the window this one was already waiting out, and the test
      // below runs on **Storepro**, whose access has worked since 2026-08-13 — so
      // nothing in the new milestone is a prerequisite for it and the 7 September
      // date is unchanged. Three of its blockers moved into that milestone with it —
      // in-app prompt sign-off, an attributable verdict control, and a correction
      // path — so this one got shorter rather than further away.
      //
      // ✅ The hard prerequisite is now met. Postmark was wired on 2026-08-14
      // (smtp.postmarkapp.com, sender hello@growthpartners.co.nz) and the send
      // rate limit raised from 2/hour to 100/hour. mal@growthpartners.co.nz — a
      // specialist who is not Ricky — has signed in and approved a plan, so the
      // "can a second human use this at all" question is answered. What remains is
      // the real test: a full cycle, end to end, unaided.
      //
      // ── Brought forward 2026-08-19, ahead of M11, on Ricky's stated default ──
      //
      // Fifth time the eleven-week calendar lock has forced this call, and the
      // first time the answer is a milestone that already existed rather than a
      // newly inserted one. M11 cannot open before 2026-11-05. M12 is the last
      // milestone in the arc, it is not locked to November, and all three of the
      // things that used to block it — in-app prompt sign-off, an attributable
      // verdict control, and a correction path — became controls in M10 on
      // 2026-08-19.
      //
      // ⚠️ **It cannot start today either, and the handover that recommended it
      // did not say so.** A full monthly cycle needs a month to run over.
      // Storepro's cycles are Apr–Jul with 2026-07 `published`; there is no
      // 2026-08 cycle, and August's Search Console figures are not final until
      // ~5 September on this system's own five-day convention — the same
      // convention that makes 2026-10 answerable on 2026-11-05. Re-running the
      // published July cycle would be a rehearsal, refused by name elsewhere in
      // this project. **So the test runs the week of 2026-09-07** — two and a
      // half weeks out rather than eleven, which is still the argument for
      // bringing it forward, just not the argument as it was written.
      //
      // **What the gap to 7 September is for, and it is bounded:** the four
      // already-written cards in `This Week` that a specialist running a cycle
      // will actually touch — the UTC shipping-date label, the plan built with
      // no declared capacity, the subdomain split in the competitor cohort, and
      // the acceptance-criterion decidability check. Fixing a *known, written-up*
      // finding before a usability test is not hiding it; it stops the test
      // spending its budget rediscovering what is already on the board.
      // ⚠️ **Nothing else gets pre-fixed.** If it was not already a card on
      // 2026-08-19 it is a finding for the specialist to hit, and pre-empting it
      // is how this becomes a polish milestone that answers nothing.
      //
      // ⚠️ **The session that runs the test must not help.** That is the one way
      // a handover test gets laundered into a pass. Claude observes and records:
      // every point where the specialist had to ask anybody anything is a
      // finding, and the doneWhen is not met if there were any. If it turns out a
      // cycle cannot be run unaided, that is the finding and not a failure — the
      // findings become cards and the test is re-run.
      //
      // ✅ **It feeds M11 rather than competing with it.** Whatever a real
      // specialist trips over in September is fixed before November's verdict,
      // rather than discovered on the day the answer is due.
      //
      // 🔴 **It creates one interaction nothing currently checks.** If the cycle
      // the specialist runs ships work on Storepro in September or October that
      // touches any of `a3e5a8a7`'s twelve control-matched pages, October
      // measures two changes and the verdict machinery will not say so:
      // `server/verify/verify.ts` assembles confounders from the prediction's own
      // shipping drift and from verified Google algorithm updates, and from
      // nothing else. **Our own concurrent work on the same pages is not a
      // confounder anywhere in this system.** Carded, not fixed here.
      //
      // 🔒 **Numbering deliberately not swapped with M11.** The M-numbers encode
      // the order this system needed these things, and the four past renumbers
      // were all insertions that preserved relative order. A swap would rewrite
      // every historical reference in the docs and the board to buy a cosmetic
      // ordering. M12 runs first, M11 keeps its number, and the phase string
      // says so out loud.
      doneWhen: "A specialist other than Ricky runs a full monthly cycle end to end without help",
      // Handed the current slot to M12 (client onboarding) on 2026-08-20 while
      // staying scheduled for the week of 2026-09-07 — the two do not compete,
      // because this test runs on Storepro and needs nothing the new milestone
      // builds.
      status: "planned",
    },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Foundation",
      window: "Done · M1 landed 2026-08-13",
      desc: "Get data flowing and prove the measurement is trustworthy before any surface is built on it. The Google service account is the hard blocker — nothing downstream produces a defensible number until it exists.",
      deliverables: [
        "Google service account + domain-wide delegation via access@growthpartners.co.nz",
        "Supabase schema applied — clients, properties, audits, findings, work, predictions, reports",
        "GSC + GA4 ingestion on a calendar-month cadence, with 'couldn't measure' distinct from 'measured zero'",
        "Access preflight that verifies property access rather than trusting a tickbox",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "Measure",
      window: "Done · M2 and M3 landed 2026-08-13",
      desc: "Everything that observes a client site. Deterministic where it matters — a score that drifts on an unchanged site destroys the month-over-month report.",
      deliverables: [
        "Crawler + SEO/GEO/AEO scoring, per-page snapshots retained for page-level diffs",
        "CORE-EEAT (80 items) and CITE (40 items) frameworks ported under Apache-2.0",
        "DataForSEO backlink ingestion — without a link index CITE cannot score at all",
        "Our own multi-engine AI-citation panel, storing raw answers so 'cited' can be redefined later",
      ],
    },
    {
      key: "phase-2",
      status: "done",
      title: "Phase 2",
      subtitle: "Plan and do",
      window: "Done · M4 landed 2026-08-13 — first plan approved by a specialist",
      desc: "Turn six separate priority lists into one ranked month of work that fits the retainer. The aggregator is the piece no surveyed repo has.",
      deliverables: [
        "Cross-source finding merge + dedupe (a missing H1 appears in three audits)",
        "Single priority function, effort estimates, owners, capacity fit",
        "Work items carry a required rationale — it becomes the report's 'why'",
        "Human approval gate before anything touches a client site",
      ],
    },
    {
      key: "phase-3",
      status: "in-progress",
      title: "Phase 3",
      subtitle: "Close the loop",
      window: "In progress · M8, M9 and M10 all landed 2026-08-19 — the shipment is on the record, the drift check reads it, a prediction can be answered against its control or refused by name, and all three controls are in the app. M11 reads the verdict back once October's figures are final on 5 November, and nothing about it can move until then",
      desc: "Record the prediction, build the control, check it next cycle, and say so in the report. This is the part clients pay a retainer for and the part nothing else does.",
      deliverables: [
        "✅ Readback windows fixed before a change, not chosen after — derived from the approval timestamp, immutable by trigger",
        "✅ Matched control-set constructor — demanded by every repo, built by none. It refuses twelve of thirteen items and says why",
        "✅ Monthly report: what we did, why, and what we expected — predictions shown pending with their readback windows, behind a ten-check publication gate",
        "✅ The shipping record: a specialist marks work done — with evidence, attributed, frozen — and the system re-derives the readback window from that date and says whether it landed in time",
        "✅ Delta-vs-control arithmetic, the verification writer, and an algorithm-update ledger that flags confounders before the window it judges is readable — and refuses a verdict over a lead nobody has confirmed",
        "✅ The controls a specialist presses: an attributable verdict button, prompt sign-off in the app, and one correction path for all three frozen writes — pressed on a deployed environment by a person, not described",
        "🔒 M11 · The verdict: what actually happened, including when the answer is that we were wrong — blocked on the calendar until 5 November, with M12 running ahead of it",
      ],
    },
    {
      key: "phase-4",
      status: "in-progress",
      title: "Phase 4",
      subtitle: "Hand to the team",
      window: "In progress · M12 client onboarding is current from 2026-08-20 · M13's handover test still runs the week of 2026-09-07 on Storepro, which needs nothing M12 builds",
      desc: "The tool is finished when a specialist who didn't build it runs a client month unaided. Until then it's Ricky's tool, not the team's.",
      deliverables: [
        "→ M12 · Specialist-facing onboarding flow: per-client access account, the direct-grant mode the setup doc has always specified and the code never had, and a preflight that proves the permission level rather than trusting a tickbox",
        "Role-based access and per-client assignment",
        "Scheduled cycles firing unattended, with actionable failure alerts",
        "M13 · One specialist completes a full cycle end to end without help — week of 2026-09-07",
      ],
    },
  ],
};
