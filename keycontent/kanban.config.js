// KeyContent — kanban config for tools/build.js.
//
// Edit this file to change anything project-specific (title, hero, goals,
// phases, links, roles). Card-level content lives in KANBAN.md.

module.exports = {
  // ── Source / output (both relative to this project folder) ────
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "KeyContent",
  tagline: "AI content creation SaaS for agencies and their clients.",
  description:
    "KeyContent is a multi-tenant platform where agencies manage clients, generate AI content (blog, social video, social image), schedule and publish via Zernio, and share a client review portal — all built on React + Express + Supabase, hosted on Railway, and monitored by Sentinel.",
  phase: "SHIP · Live in Production",
  nextMilestone: {
    name: "Client reactivation UI",
    date: "This week",
  },

  // ── Goals (3 cards in a row) ──────────────────────────────────
  goals: [
    {
      icon: "🎯",
      title: "Content without the agency overhead",
      desc: "Agencies deliver AI-generated blog posts, social video, and social images to clients — from brief to publish, in one platform.",
    },
    {
      icon: "⚡",
      title: "One platform, every client",
      desc: "Multi-agency, multi-client architecture with role-based access, a client review portal, and calendar scheduling built in.",
    },
    {
      icon: "🌐",
      title: "Observable and operationally sound",
      desc: "Sentry, Better Stack, Sentinel, Postmark, and Zernio webhooks keep the platform visible and recoverable around the clock.",
    },
  ],

  // ── Quick links ───────────────────────────────────────────────
  links: [
    {
      icon: "🚀",
      title: "Live app (prod)",
      desc: "keycontent.ai — production environment",
      url: "https://keycontent.ai",
    },
    {
      icon: "🧪",
      title: "Staging app",
      desc: "staging.keycontent.ai — pre-prod environment",
      url: "https://staging.keycontent.ai",
    },
    {
      icon: "📊",
      title: "Sentinel ops board",
      desc: "Bug reports, social token health, maintenance digest",
      url: "../sentinel/",
    },
    {
      icon: "💻",
      title: "GitHub repo",
      desc: "CoreshiftHQNZ/keycontent-app",
      url: "https://github.com/CoreshiftHQNZ/keycontent-app",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "A", name: "Operator",    person: "Abe",          verbs: "Prioritise · triage · verify" },
    { initial: "R", name: "Builder",     person: "Ricky + team", verbs: "Design · code · ship" },
    { initial: "C", name: "AI Pair",     person: "Claude Code",  verbs: "Brief · review · assist" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  // status: "done" | "in-progress" | "planned" | "future"
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Foundation",
      window: "Shipped",
      desc: "Auth, core job pipeline, agency/client data model, and the social account connection layer.",
      deliverables: [
        "Supabase auth (email + magic link) ✓",
        "Multi-agency / multi-client architecture ✓",
        "AI job creation + generation pipeline ✓",
        "Social account connect via Zernio ✓",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "Platform Features",
      window: "Shipped",
      desc: "The full user-facing feature set: calendar, Quick Post composer, client review portal, and the publish-to-social pipeline.",
      deliverables: [
        "Calendar scheduling ✓",
        "Quick Post composer ✓",
        "Client review portal with shareable links ✓",
        "Publish-to-social via Zernio ✓",
      ],
    },
    {
      key: "phase-2",
      status: "done",
      title: "Phase 2",
      subtitle: "Ops Layer",
      window: "Shipped",
      desc: "The full observability and operations stack: error tracking, transactional email, in-app bug reporting, and in-repo operating docs.",
      deliverables: [
        "Sentry (frontend + backend + edge functions) ✓",
        "Postmark transactional email ✓",
        "Report-issue Edge Function + bug_reports table ✓",
        "Operator + ack emails on bug submit ✓",
        "priority.md, incidents.md, OPERATOR.md in repo ✓",
        "PR review standards doc ✓",
      ],
    },
    {
      key: "phase-3",
      status: "in-progress",
      title: "Phase 3",
      subtitle: "Polish + Completeness",
      window: "In progress",
      desc: "Closing the gaps identified after going live: client lifecycle management, env-var hygiene, and outstanding UX polish.",
      deliverables: [
        "Client reactivation UI (in progress)",
        "bug_reports migration promoted to prod",
        "ZERNIO_WEBHOOK_SECRET in prod env",
        "Standalone composer improvements",
        "PR #22 redesign (open, unscheduled)",
      ],
    },
  ],
};
