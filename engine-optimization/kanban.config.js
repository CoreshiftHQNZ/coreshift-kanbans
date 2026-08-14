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
  phase: "M8 · The shipping record",
  nextMilestone: {
    name: "Telling the system the work is done, so it can police what we assumed",
    date: "Q3 2026 · the FAQ work must ship by 3 September or October reads as confounded",
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
      // milestone and only there — M8 when this was written, M10 after two
      // insertions since. The number moves; the rule does not.
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
      // ⚠️ Ends on a human act, like M7's publish. Marking an item shipped when it
      // has not been done is forging the record, so the close waits on the team
      // doing a piece of August's work. Item 1 is 2.8 hours across 3 URLs.
      doneWhen: "A specialist marks an approved item shipped, with its evidence, and every prediction states whether the work it is about shipped inside the window it assumed",
      status: "current",
    },
    {
      id: "M9",
      name: "The readback",
      // Added 2026-08-14 when M7 was split; renumbered from M8 on 2026-08-15 when
      // the shipping record was inserted ahead of it. This is the half of the loop that
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
      // ⚠️ It now has a hard input it did not have before: `confounded` is only
      // decidable if something recorded when the work shipped. That is M8, and it
      // has to land before the window closes rather than alongside the verdict.
      doneWhen: "A recorded prediction is verified against its matched control and the report states what actually happened, including when the answer is that we were wrong",
      status: "planned",
    },
    {
      id: "M10",
      name: "Handover to the team",
      // ✅ The hard prerequisite is now met. Postmark was wired on 2026-08-14
      // (smtp.postmarkapp.com, sender hello@growthpartners.co.nz) and the send
      // rate limit raised from 2/hour to 100/hour. mal@growthpartners.co.nz — a
      // specialist who is not Ricky — has signed in and approved a plan, so the
      // "can a second human use this at all" question is answered. What remains is
      // the real test: a full cycle, end to end, unaided.
      doneWhen: "A specialist other than Ricky runs a full monthly cycle end to end without help",
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
      window: "In progress · M7 landed 2026-08-14 — the first report is published and frozen; M8 gives the system a way to be told the work is done, and the verdict follows in M9 from 5 November",
      desc: "Record the prediction, build the control, check it next cycle, and say so in the report. This is the part clients pay a retainer for and the part nothing else does.",
      deliverables: [
        "✅ Readback windows fixed before a change, not chosen after — derived from the approval timestamp, immutable by trigger",
        "✅ Matched control-set constructor — demanded by every repo, built by none. It refuses twelve of thirteen items and says why",
        "✅ Monthly report: what we did, why, and what we expected — predictions shown pending with their readback windows, behind a nine-check publication gate",
        "→ The shipping record: a specialist marks work done, and the system says whether it landed inside the window its prediction assumed",
        "Delta-vs-control, with algorithm updates auto-flagged as confounders",
        "The verdict: what actually happened, including when the answer is that we were wrong",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Hand to the team",
      window: "M9 · the real test",
      desc: "The tool is finished when a specialist who didn't build it runs a client month unaided. Until then it's Ricky's tool, not the team's.",
      deliverables: [
        "Specialist-facing onboarding flow with access checklist",
        "Role-based access and per-client assignment",
        "Scheduled cycles firing unattended, with actionable failure alerts",
        "One specialist completes a full cycle end to end without help",
      ],
    },
  ],
};
