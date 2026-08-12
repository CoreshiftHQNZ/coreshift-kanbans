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
  phase: "M1 · Data spine",
  nextMilestone: {
    name: "One client's GSC + GA4 data visible in the app",
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
      status: "current",
    },
    {
      id: "M2",
      name: "Audit engine",
      doneWhen: "A crawl of a real client site produces a scored audit run with per-page snapshots and findings, viewable in the app",
      status: "next",
    },
    {
      id: "M3",
      name: "AI visibility panel",
      doneWhen: "A prompt set runs across every engine for one client and a citation is recorded with its raw answer",
      status: "planned",
    },
    {
      id: "M4",
      name: "Work plan",
      doneWhen: "One ranked work plan, merged from every finding source, is approved by a specialist in the app",
      status: "planned",
    },
    {
      id: "M5",
      name: "The loop",
      doneWhen: "A prediction made in one cycle is verified in the next and reports a delta against its control set",
      status: "planned",
    },
    {
      id: "M6",
      name: "Monthly report",
      doneWhen: "A specialist publishes a report for a real client stating what we did, why, what we expected, and what happened",
      status: "planned",
    },
    {
      id: "M7",
      name: "Handover to the team",
      doneWhen: "A specialist other than Ricky runs a full monthly cycle end to end without help",
      status: "planned",
    },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "in-progress",
      title: "Phase 0",
      subtitle: "Foundation",
      window: "In progress · research complete, schema drafted",
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
      status: "planned",
      title: "Phase 1",
      subtitle: "Measure",
      window: "M2–M3 · after the data spine",
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
      status: "planned",
      title: "Phase 2",
      subtitle: "Plan and do",
      window: "M4 · after measurement is trusted",
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
      status: "planned",
      title: "Phase 3",
      subtitle: "Close the loop",
      window: "M5–M6 · the differentiator",
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
