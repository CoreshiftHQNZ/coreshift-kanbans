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
  phase: "M6 · The prediction machinery",
  nextMilestone: {
    name: "A prediction recorded against a control, before the change",
    date: "Q3 2026",
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
      // to do with the aggregator. The specialist test lives in M8 and only there.
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
      // Opened 2026-08-14. Re-read against what M5 shipped and left unchanged:
      // the prediction now has something concrete to be about — an approved item
      // naming specific pages with a machine-checkable definition of finished —
      // which is exactly the dependency that pushed this milestone back a place.
      status: "current",
    },
    {
      id: "M7",
      name: "Monthly report",
      doneWhen: "A specialist publishes a report for a real client stating what we did, why, what we expected, and what happened",
      status: "planned",
    },
    {
      id: "M8",
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
      window: "In progress · M5 landed 2026-08-14 — the work is executable; M6 predicts, M7 reads it back in October",
      desc: "Record the prediction, build the control, check it next cycle, and say so in the report. This is the part clients pay a retainer for and the part nothing else does.",
      deliverables: [
        "Readback windows fixed before a change, not chosen after",
        "Matched control-set constructor — demanded by every repo, built by none",
        "Delta-vs-control, with algorithm updates auto-flagged as confounders",
        "Monthly report: what we did, why, what we expected, what happened",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Hand to the team",
      window: "M7 · the real test",
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
