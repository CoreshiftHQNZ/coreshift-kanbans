// Kanban Engine — config for tools/build.js.
//
// This is the kanban for the kanban tool itself. Meta but useful: every
// improvement to the engine, template, or "how we do project boards"
// convention lands here as a card, so the work is visible the same way
// every other Coreshift project's work is.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  brandMark: "📋",
  brandSub: "Build System",

  title: "Coreshift Kanban Engine",
  tagline: "Build once. Clone for every project. Stays in sync as part of the work.",
  description:
    "The shared rendering engine + template kit that turns project-by-project boards into one system. Built first for Sentinel; every Coreshift project that follows gets the same board structure for free. This board tracks improvements to the tool itself.",
  phase: "Phase 1 · Engine + template shipped",
  nextMilestone: {
    name: "Operator demo",
    date: "Before retrofitting other boards",
  },

  goals: [
    {
      icon: "🧰",
      title: "Build once, clone everywhere",
      desc: "The engine is reusable. Adding a project is three files copied from tools/template — no surgery on the renderer.",
    },
    {
      icon: "📝",
      title: "Markdown is the source of truth",
      desc: "Cards live in KANBAN.md (version-controlled), not in rendered HTML. Edit the file, run the build, push.",
    },
    {
      icon: "⚡",
      title: "Stays in sync as part of the work",
      desc: "The kanban refresh is part of every ship — not a separate doc pass. If the board lags the code, the convention is broken.",
    },
  ],

  links: [
    {
      icon: "🧰",
      title: "Engine source",
      desc: "tools/build.js — the project-agnostic renderer",
      url: "https://github.com/CoreshiftHQNZ/coreshift-kanbans/blob/main/tools/build.js",
    },
    {
      icon: "📦",
      title: "Template starter kit",
      desc: "tools/template/ — copy this to start a new project board",
      url: "https://github.com/CoreshiftHQNZ/coreshift-kanbans/tree/main/tools/template",
    },
    {
      icon: "📖",
      title: "How to add a project",
      desc: "Paste-and-go Claude Code prompt + six-step manual setup",
      url: "how-to-add-a-project.html",
    },
    {
      icon: "🛡",
      title: "Sentinel board (proof case)",
      desc: "The first board built on this engine — and the gold standard the template inherits from",
      url: "https://coreshifthqnz.github.io/coreshift-kanbans/sentinel/",
    },
  ],

  roles: [
    { initial: "O", name: "Operator",    person: "Abe",          verbs: "Decide · present · approve retrofits" },
    { initial: "I", name: "Implementer", person: "Claude Code",  verbs: "Extract · refactor · ship" },
    { initial: "P", name: "The Pipeline",person: "Markdown → engine → Pages", verbs: "Parse · render · publish" },
  ],

  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Sentinel proves the format",
      window: "May 2026",
      desc: "Built first as a 1088-line build_kanban.js + KANBAN.md inside the Sentinel folder. The gold standard that earned the request to template it.",
      deliverables: [
        "build_kanban.js renderer + parser",
        "5-column kanban convention (Done / In Progress / Blocked / This Week / Backlog)",
        "Card format spec — `- **Title** \\`tag\\` — Description.`",
        "Phase + Goals + Links + Roles + Recently Shipped sections",
        "Public push to GitHub Pages",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "Extract + template",
      window: "Shipped 2026-05-29",
      desc: "Engine separated from config; template kit added; Sentinel migrated to verify zero visual regression. The keystone change — everything downstream depends on this.",
      deliverables: [
        "tools/build.js (project-agnostic engine)",
        "tools/template/ starter kit (config + KANBAN + README)",
        "sentinel/kanban.config.js extracted from META",
        "sentinel/KANBAN.md moved into version-controlled source of truth",
        "Byte-identical Sentinel output verified",
        "brandMark / brandSub / footerHtml config overrides",
        "Pushed to main · commit 3df58a5",
      ],
    },
    {
      key: "phase-2",
      status: "planned",
      title: "Phase 2",
      subtitle: "Demo, then expand",
      window: "Next presentation slot",
      desc: "Operator presents the kanban + template as the gold-standard pattern. Retrofitting other boards waits until after — until then, no other project's board is touched.",
      deliverables: [
        "Operator presentation",
        "Decision to retrofit existing boards",
      ],
    },
    {
      key: "phase-3",
      status: "planned",
      title: "Phase 3",
      subtitle: "Retrofit existing",
      window: "After demo · ~15 min/board",
      desc: "Each existing project board (digital-architect, planner, velocity, sow, sponsored-listicle-writer, storepro-component-count) gets a kanban.config.js + KANBAN.md and uses the shared engine.",
      deliverables: [
        "digital-architect retrofit",
        "planner retrofit",
        "velocity retrofit",
        "sow retrofit",
        "sponsored-listicle-writer retrofit",
        "storepro-component-count retrofit",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Playbook + roadmap engines",
      window: "When needed",
      desc: "Apply the same engine/config/content split to build_playbook.js and build_roadmap.js. Same payoff: build once, clone everywhere.",
      deliverables: [
        "tools/build-playbook.js engine",
        "tools/build-roadmap.js engine",
        "Per-project playbook + roadmap configs",
        "HOW-WE-DO-KANBANS.md playbook entry",
        "Optional: GitHub Action auto-build on push",
      ],
    },
  ],

  footerHtml:
    'Edit <code>KANBAN.md</code> and run <code>node tools/build.js kanban-engine</code> to refresh this view. ' +
    '&nbsp;·&nbsp; ' +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
