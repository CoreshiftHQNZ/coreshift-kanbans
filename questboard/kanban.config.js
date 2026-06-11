// Project kanban config — read by tools/build.js.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "QuestBoard",
  tagline: "Company project monitoring as an RPG world map — progress is boss kills, not percent bars.",
  description:
    "A visibility-first monitoring app: each business vertical is a Continent, each project a Kingdom, " +
    "each effort with its own finish line a Campaign, each phase a Boss whose HP is its exit criteria " +
    "frozen at spawn. Completing work deals damage; discovered work spawns a Minion or a new Boss — it " +
    "never heals an existing fight. Board state is emitted by Claude Code (the scribe) as a byproduct " +
    "of doing the work, so it can never go stale.",

  phase: "Planning · PRD sliced into issues",
  nextMilestone: {
    name: "Slice 1 — Sentinel dungeon renders from canonical state (issue #2)",
    date: "first build session",
  },

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "🗡️",
      title: "Honest progress",
      desc: "Boss HP = exit criteria locked at spawn. The denominator can't move, so the bar can't drift backward when new work is discovered.",
    },
    {
      icon: "✍️",
      title: "Emitted, not entered",
      desc: "The scribe (Claude Code) writes board state as a byproduct of doing the work — a merged PR becomes damage against the right boss. No human hand-updates a slider.",
    },
    {
      icon: "🗺️",
      title: "One source, two skins",
      desc: "The per-project dungeon view and the company world map render from the same canonical state, so the views can never disagree.",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "📦",
      title: "Repo",
      desc: "CoreshiftHQNZ/questboard — main / dev, docs in-repo",
      url: "https://github.com/CoreshiftHQNZ/questboard",
      internal: true,
    },
    {
      icon: "📋",
      title: "PRD",
      desc: "Issue #1 — problem, 40 user stories, implementation & testing decisions",
      url: "https://github.com/CoreshiftHQNZ/questboard/issues/1",
      internal: true,
    },
    {
      icon: "🎟️",
      title: "Issue tracker",
      desc: "Ten tracer-bullet slices (#2–#11) with dependency cross-references",
      url: "https://github.com/CoreshiftHQNZ/questboard/issues",
      internal: true,
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "O", name: "Owner", person: "Abe", verbs: "Decide storage · judge legibility · ack Criticals" },
    { initial: "B", name: "Builder", person: "Claude Code", verbs: "TDD pure core · render · ship" },
    { initial: "S", name: "Scribe", person: "Claude Code", verbs: "Emit state · translate PRs into damage" },
    { initial: "T", name: "The stack", person: "Vitest · state.json/Supabase (TBD) · Railway", verbs: "Test · store · serve" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Spec → PRD → issues",
      window: "Done · Jun 2026",
      desc: "Design interrogation locked twelve decisions and six invariants; PRD published; build sliced into ten tracer-bullet issues.",
      deliverables: [
        "Design Spec v1 (docs/design-spec-v1.md)",
        "PRD as issue #1, ready-for-agent",
        "Repo + main/dev branches",
        "Issues #2–#11 filed in dependency order",
      ],
    },
    {
      key: "phase-1",
      status: "planned",
      title: "Slice 1",
      subtitle: "Sentinel dungeon",
      window: "First build — validates the model cheaply",
      desc: "Walking skeleton plus the pure core. Ends with the falsifiable test: does Sentinel's board read legible once Privacy splits into its own campaign?",
      deliverables: [
        "Walking skeleton: sample state → dungeon screen (#2)",
        "HP Ledger — frozen max_hp, damage, minions (#3)",
        "Scope Router (#4) · Flee/Resume (#5)",
        "Persistence decision + adapter (#8, HITL)",
      ],
    },
    {
      key: "phase-2",
      status: "planned",
      title: "Slice 2",
      subtitle: "Real PRs & alarms",
      window: "After Slice 1",
      desc: "Damage routed from real merged PRs by campaign tag — the first seam expected to tear — plus computed Criticals.",
      deliverables: [
        "Damage Router with split damage (#6)",
        "Scribe convention + real Sentinel board (#7, HITL)",
        "Critical Evaluator + acknowledge/snooze (#9)",
      ],
    },
    {
      key: "phase-3",
      status: "future",
      title: "Slice 3",
      subtitle: "World map",
      window: "Full vision",
      desc: "The company overworld: Continents holding Kingdoms, drill-down into dungeons, tier-scaled fanfare for kills.",
      deliverables: [
        "World map: Continents → Kingdoms, drill-down (#10)",
        "Tier-scaled fanfare — mini / boss / raid (#11)",
      ],
    },
  ],

  footerHtml:
    'Edit <code>questboard/KANBAN.md</code> and run <code>node tools/build.js questboard</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
