// Project kanban config — read by tools/build.js.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "HeyGem",
  tagline: "Remote admin support for Kiwi tradies — “put a Gem on it.”",
  description:
    "A four-surface platform for a tradie remote-admin service: public marketing site, " +
    "Stripe checkout, a customer dashboard showing “what your Gem sorted this week,” " +
    "and an internal staff/ops workspace where pooled “Gems” log their work and minutes. " +
    "Those logged minutes are the single source of truth for both the dashboard and weekly metered billing.",

  phase: "Phase 0 · Foundations",
  nextMilestone: {
    name: "Marketing site live",
    date: "Phase 1",
  },

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "💸",
      title: "Get tradies paid faster",
      desc: "Same-day invoicing + chasing, surfaced back to the customer as real weekly results.",
    },
    {
      icon: "⏱️",
      title: "Minutes are the source of truth",
      desc: "Gems log time per task; the same data feeds the dashboard and the Stripe metered bill. One pipeline, no reconciliation.",
    },
    {
      icon: "💎",
      title: "Every assistant is “Gem”",
      desc: "A pooled team all present as one branded persona — so customers say “hey Gem, thanks Gem, you’re a gem.”",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "🚀",
      title: "Live site",
      desc: "heygem.co.nz — holding page until Phase 1 ships",
      url: "https://heygem.co.nz",
    },
    {
      icon: "🎨",
      title: "Design prototype",
      desc: "Clickable React/Babel prototype + brief (marketing, checkout, dashboard)",
      url: "https://github.com/CoreshiftHQNZ/coreshift-kanbans",
      internal: true,
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "O", name: "Owner / client", person: "Ricky + client", verbs: "Decide · brand · register business" },
    { initial: "B", name: "Builder", person: "Claude Code", verbs: "Design · code · ship" },
    { initial: "G", name: "Gems (ops)", person: "Pooled staff", verbs: "Log work · track minutes · write weekly note" },
    { initial: "S", name: "The stack", person: "Vite · Supabase · Railway · Stripe", verbs: "Auth · store · bill" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "in-progress",
      title: "Phase 0",
      subtitle: "Foundations",
      window: "In progress · Jun 2026",
      desc: "Repos, infra and the shared design system — no user-facing output, but everything downstream depends on it.",
      deliverables: [
        "GitHub repo + dev → staging → main flow",
        "Supabase project (one DB, role-based RLS for both apps)",
        "Railway services wired to CI",
        "Cloudflare DNS for heygem.co.nz (verify propagation)",
        "Design system extracted from prototype (theme, Icon/Logo/GemPhoto)",
      ],
    },
    {
      key: "phase-1",
      status: "planned",
      title: "Phase 1",
      subtitle: "Marketing site live",
      window: "Ships independently — first",
      desc: "Port the marketing prototype to a real build and start capturing leads. Lowest risk, earns trust while the platform is built.",
      deliverables: [
        "marketing.jsx → production Vite/React on heygem.co.nz",
        "Callback form → Supabase lead capture + ops notify",
        "GST-correct pricing copy, SEO, analytics",
      ],
    },
    {
      key: "phase-2",
      status: "planned",
      title: "Phase 2",
      subtitle: "Accounts & auth",
      window: "After Phase 1",
      desc: "Identity and the data backbone shared by both apps.",
      deliverables: [
        "Supabase Auth — magic-link customers, password staff/ops",
        "Data model: businesses → many users, gems, ops roles + RLS",
        "Customer app + staff/ops app shells (separate apps)",
      ],
    },
    {
      key: "phase-3",
      status: "planned",
      title: "Phase 3",
      subtitle: "Staff & ops workspace",
      window: "Longest pole",
      desc: "The engine that produces everything the customer sees. Until this exists, the dashboard has no real data.",
      deliverables: [
        "Ops: lead queue → account, pooled-team assignment",
        "Gem: log task (type · $ · minutes · note) → timeline item",
        "Weekly note authoring; minutes roll up per customer/week",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Dashboard, billing & launch",
      window: "Payments go-live gated on business registration",
      desc: "Customer dashboard on real data, Stripe metered billing (built in test mode, flipped live once registered), then polish and launch.",
      deliverables: [
        "portal.jsx → real data (hours ring, bill, timeline, note)",
        "Real staff photos w/ brand-avatar fallback (all “Gem”)",
        "Stripe: weekly plan + $1/min metered overage + PAYG, GST 15%",
        "Self-serve cancel + plan change",
        "Go-live: swap to live Stripe keys, staging → main",
      ],
    },
  ],

  footerHtml:
    'Edit <code>heygem/KANBAN.md</code> and run <code>node tools/build.js heygem</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
