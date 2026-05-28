// Sentinel — kanban config for tools/build.js.
//
// Edit this file to change anything project-specific (title, hero, goals,
// phases, links, roles). Card-level content lives in KANBAN.md.

module.exports = {
  // ── Source / output (both relative to this project folder) ────
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Coreshift HQ Ops",
  tagline: "How we run apps. Five plays. One deliberate system.",
  description:
    "An internal operating system for catching bugs before users do, shipping fixes in hours, and scaling to every Coreshift HQ app. Built once for KeyContent. Cloned in an afternoon for every app after.",
  phase: "Phase 4 · Multi-app + Maintenance",
  nextMilestone: {
    name: "Noozey onboarding",
    date: "After operator sets up Sentry alert rules",
  },

  // ── Goals (3 cards in a row) ──────────────────────────────────
  goals: [
    {
      icon: "🎯",
      title: "Catch bugs before users do",
      desc: "Sentry + the in-app widget surface issues automatically — no more 'thanks for letting us know' emails.",
    },
    {
      icon: "⚡",
      title: "Ship fixes in hours, not days",
      desc: "Brief Claude Code → review the preview → merge → done. Triage takes 10 min/day.",
    },
    {
      icon: "🌐",
      title: "Scale to every Coreshift HQ app",
      desc: "One playbook, cloned per app. Built right means built once.",
    },
  ],

  // ── Quick links ───────────────────────────────────────────────
  // Links with `internal: true` are filtered from the published build.
  // Set INTERNAL=1 in the env to include them when building locally.
  links: [
    {
      icon: "📊",
      title: "Pitch Deck",
      desc: "14 slides — the system, the elevation, the ask",
      url: "pitch-deck.html",
      internal: true,
    },
    {
      icon: "📖",
      title: "Operations Playbook",
      desc: "Five HOW-WE-DO plays in a single styled viewer",
      url: "ops-playbook.html",
    },
    {
      icon: "🗺",
      title: "Detailed Roadmap",
      desc: "Multi-phase plan, every task, every blocker",
      url: "roadmap.html",
    },
    {
      icon: "🚀",
      title: "Live on Staging",
      desc: "Phase 0 widget shipped May 11 — visit and try it",
      url: "https://staging.keycontent.ai",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "A", name: "Operator",    person: "Abe",                                          verbs: "Triage · brief · verify" },
    { initial: "C", name: "Implementer", person: "Claude Code",                                  verbs: "Read · code · ship" },
    { initial: "T", name: "The Tools",   person: "Sentry · Better Stack · Cloudflare · Supabase", verbs: "Watch · alert · record" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  // status: "done" | "in-progress" | "planned" | "future"
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Foundation Widget",
      window: "Shipped May 11",
      desc: "The user-facing piece: a Report Issue widget. Authenticated users submit Bug / Suggestion / Question reports with optional screenshot.",
      deliverables: [
        "In-app floating button on every authenticated page",
        "Type selector (Bug / Suggestion / Question)",
        "Screenshot upload to Supabase Storage",
        "Postmark email to operator with full context",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "Maintenance Ops Rollout",
      window: "Complete · 2026-05-14",
      desc: "Wrapped monitoring, alerting, triage, and workflow around the widget. All 5 weeks shipped — full audit pass complete, ops playbook live, docs published in-repo.",
      deliverables: [
        "Week 1: GitHub Issues + Sentry SDK ✓",
        "Week 2: Better Stack + status page + Cloudflare alerts ✓",
        "Week 3: Widget shipped in Phase 0 ✓",
        "Week 4: Triage rhythm + briefing template + PR review in repo ✓",
        "Week 5: priority + incidents + OPERATOR docs in repo ✓",
      ],
    },
    {
      key: "phase-2",
      status: "done",
      title: "Phase 2",
      subtitle: "Widget Enhancements",
      window: "Shipped 2026-05-14",
      desc: "Widget reports now persist as data, not just email. Foundation for the Sentinel Dashboard's data layer.",
      deliverables: [
        "bug_reports table in Supabase ✓",
        "Immediate ack email to user on submit ✓",
        "Auto-create GH Issue + resolution-ack moved to Phase 3 (Dashboard)",
        "\"My past reports\" view deferred",
      ],
    },
    {
      key: "phase-3",
      status: "done",
      title: "Phase 3",
      subtitle: "Sentinel Dashboard",
      window: "Complete · V1 shipped 2026-05-21",
      desc: "The unified internal ops dashboard. All 7 V1 briefs + Brief 4.5 (Google OAuth) shipped to production. Live at sentinel.coreshifthq.com.",
      deliverables: [
        "Brief 1: Scaffold + Google OAuth (via Brief 4.5) ✓",
        "Brief 2: bug_reports read-only board ✓",
        "Brief 3: Drag-and-drop status updates ✓",
        "Brief 4: Card detail panel + triage fields ✓",
        "Brief 5: Auto-file GitHub Issue when leaving Triage ✓",
        "Brief 6: Resolution-ack email on → Done ✓",
        "Brief 7: Better Stack status pills ✓",
      ],
    },
    {
      key: "phase-4",
      status: "in-progress",
      title: "Phase 4",
      subtitle: "Multi-app + Maintenance",
      window: "In progress · Noozey onboarding closes phase",
      desc: "Scope grew mid-flight: multi-app filter strip + an entirely new /maintenance surface for tracking AI-model lifecycle, vendor reviews, and recurring upkeep. Noozey onboarding closes the phase.",
      deliverables: [
        "Brief 8: App filter strip (conditional render) ✓",
        "Brief 9a: /maintenance V1 foundation (sidebar, AppShell, RLS) ✓",
        "Brief 9b: Auto-discovery scanner — node-cron nightly + GitHub Code Search ✓",
        "Brief 10: Vendor lifecycle reference table + UI banner ✓",
        "Brief 11: Maintenance digest ✓ (manual button + weekly Monday auto-schedule)",
        "PLAYBOOK-cloning-to-new-app.md ✓ (PLAY 9 — onboarding runbook + V2 strategy)",
        "Track A code changes (generalize fileIssue target + GitHub PAT lookup)",
        "Noozey onboarding via PLAY 9 (closes Phase 4)",
      ],
    },
  ],
};
