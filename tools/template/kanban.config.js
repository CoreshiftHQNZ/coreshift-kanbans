// Project kanban config — read by tools/build.js.
//
// Edit the placeholder values below for your project. Card-level content
// (the actual board cards in 5 columns) lives in KANBAN.md next to this file.
//
// All top-level arrays (goals, links, roles, phases) are required, even if
// short. The renderer assumes they exist.

module.exports = {
  // ── Source / output (relative to this project folder) ────────
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  // Title appears in the dark header bar AND as the page H1.
  // Tagline is the italic one-liner under the title.
  // Description is the longer paragraph below — 1–3 sentences, plain text.
  title: "My Project Name",
  tagline: "A short, opinionated one-liner about what this project does.",
  description:
    "One or two sentences expanding the tagline. What problem does this " +
    "project solve, who is it for, and what's the operating principle?",

  // Current phase pill + next milestone pill (rendered in the hero).
  phase: "Phase 1 · Foundation",
  nextMilestone: {
    name: "First customer onboarded",
    date: "Q3 2026",
  },

  // ── Goals (renders as 3 cards in a row; works with 2–4) ──────
  goals: [
    {
      icon: "🎯",
      title: "Goal one",
      desc: "One sentence on what this goal looks like in practice.",
    },
    {
      icon: "⚡",
      title: "Goal two",
      desc: "Another sentence — keep these aspirational but measurable.",
    },
    {
      icon: "🌐",
      title: "Goal three",
      desc: "The third goal completes the triangle.",
    },
  ],

  // ── Quick links / Key artifacts (renders as horizontal cards) ─
  // Links with `internal: true` are filtered from the published build.
  // Set INTERNAL=1 in the environment to include them when building locally.
  links: [
    {
      icon: "📖",
      title: "Playbook",
      desc: "Operating principles in one styled viewer",
      url: "playbook.html",
    },
    {
      icon: "🚀",
      title: "Live app",
      desc: "Production URL — click to visit",
      url: "https://example.com",
    },
    // Example of an internal-only link (uncomment + edit):
    // {
    //   icon: "📊",
    //   title: "Pitch Deck",
    //   desc: "Internal-only — not shown on the public board",
    //   url: "pitch-deck.html",
    //   internal: true,
    // },
  ],

  // ── Roles (who's involved) — 2–4 entries works ───────────────
  // `initial` is a single character shown in the round avatar.
  // `name` is the role; `person` is who fills it.
  roles: [
    { initial: "O", name: "Owner",       person: "Name",         verbs: "Decide · prioritise · review" },
    { initial: "B", name: "Builder",     person: "Name",         verbs: "Design · code · ship" },
    { initial: "T", name: "The Tools",   person: "Stack · here", verbs: "Watch · alert · record" },
  ],

  // ── Phases (renders as 5 cards in a row; works with 3–5) ─────
  // status: "done" | "in-progress" | "planned" | "future"
  //   done         → green stripe + "Done" pill
  //   in-progress  → amber stripe + "In progress" pill
  //   planned      → blue stripe + "Planned" pill
  //   future       → grey stripe + "Future" pill (also dimmed)
  //
  // `title` should start with "Phase N" — the engine strips that for the
  // round marker, so "Phase 0" gives a marker that reads "0".
  // `subtitle` is the short label next to the title.
  // `window` is the dated status line under the title.
  // `desc` is one paragraph; deliverables is a checklist.
  phases: [
    {
      key: "phase-0",
      status: "in-progress",
      title: "Phase 0",
      subtitle: "Foundation",
      window: "In progress · target Q3",
      desc: "What this phase establishes. Keep it to one paragraph — the deliverables list does the heavy lifting.",
      deliverables: [
        "Concrete deliverable 1",
        "Concrete deliverable 2",
        "Concrete deliverable 3",
      ],
    },
    {
      key: "phase-1",
      status: "planned",
      title: "Phase 1",
      subtitle: "Next thing",
      window: "Starts after Phase 0",
      desc: "What follows once the foundation lands.",
      deliverables: [
        "Deliverable A",
        "Deliverable B",
      ],
    },
  ],
};
