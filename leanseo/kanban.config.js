// Lean SEO — kanban config for tools/build.js.
//
// Edit this file to change anything project-specific (title, hero, goals,
// phases, links, roles). Card-level content lives in KANBAN.md.

module.exports = {
  // ── Source / output (both relative to this project folder) ────
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Lean SEO",
  tagline: "Affordable, AI-augmented SEO for NZ businesses — human-led, GEO-ready.",
  description:
    "A productized SEO content service ($489/mo) for NZ businesses, built on the CoreShift stack. " +
    "The app is the CRM/ops backbone — onboarding, billing, access verification, plan delivery, client portal. " +
    "Current focus: modernising the method (real crawl + GSC/GA4 + GEO/AEO, human-gated) and fixing our own site so it's visible to the AI engines we want to sell against.",
  phase: "Phase 0 · Fix our own house",
  nextMilestone: {
    name: "Our own site visible to Google + AI engines",
    date: "Q3 2026",
  },

  // ── Goals (3 cards in a row) ──────────────────────────────────
  goals: [
    {
      icon: "🎯",
      title: "Affordable, productized SEO for NZ",
      desc: "Keep the human-led, no-contract service — onboarding, billing, and delivery already work. Own the wrapper.",
    },
    {
      icon: "⚡",
      title: "A modern, GEO-ready method",
      desc: "Move from a single-page regex + one haiku call to real crawl + GSC/GA4 data + GEO/AEO, gated by CORE-EEAT / CITE before anything ships.",
    },
    {
      icon: "🌐",
      title: "Practise what we sell",
      desc: "Our own site is invisible to AI engines (SPA + AI bots blocked). Fix it first — it's the credibility proof.",
    },
  ],

  // ── Quick links ───────────────────────────────────────────────
  // Links with `internal: true` are filtered from the published build.
  links: [
    {
      icon: "🚀",
      title: "Live site",
      desc: "leanseo.co.nz — production",
      url: "https://leanseo.co.nz",
    },
    {
      icon: "📦",
      title: "Repo",
      desc: "CoreshiftHQNZ/leanseo (private) — dev → staging → main",
      url: "https://github.com/CoreshiftHQNZ/leanseo",
      internal: true,
    },
    {
      icon: "🧠",
      title: "SEO/GEO skills (reference)",
      desc: "aaron-he-zhu/seo-geo-claude-skills — the method toolkit being adopted",
      url: "https://github.com/aaron-he-zhu/seo-geo-claude-skills",
    },
    {
      icon: "🏗",
      title: "Coreshift Live Edit",
      desc: "The in-dev self-serve site platform LeanSEO will integrate with (Phase 4)",
      url: "https://github.com/CoreshiftHQNZ/coreshift-live-edit",
      internal: true,
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "A", name: "Owner",       person: "Abe",                                       verbs: "Decide · prioritise · review" },
    { initial: "M", name: "Builder",     person: "Matty",                                     verbs: "Design · code · ship" },
    { initial: "T", name: "The Tools",   person: "Claude Code · SEO/GEO skills · GSC/GA4",     verbs: "Crawl · audit · gate" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  // status: "done" | "in-progress" | "planned" | "future"
  phases: [
    {
      key: "phase-0",
      status: "in-progress",
      title: "Phase 0",
      subtitle: "Fix our own house",
      window: "In progress · audit + QA done, fixes queued",
      desc: "Can't sell GEO while our own site is invisible to AI engines and barely crawlable by Google. Credibility first — and the SEO/GEO skills double as the validation tool. The SSR + schema + llms.txt bundle we land here becomes the prototype for the Phase 4 Live Edit ruleset.",
      deliverables: [
        "Decide AI-crawler policy + unblock the engines we want citing us (likely Cloudflare 'Block AI Scrapers')",
        "Add SSR/prerender for marketing + programmatic + blog routes (the keystone fix)",
        "Ship og-image.png; add blog posts to sitemap; add llms.txt; add sitewide Organization schema",
        "Exit check: re-run onpage.py / schema_lint.py → real per-page titles, content, JSON-LD",
      ],
    },
    {
      key: "phase-1",
      status: "planned",
      title: "Phase 1",
      subtitle: "Adopt skills as internal tool",
      window: "Starts after Phase 0 · ~1–2 weeks · no prod code change",
      desc: "Use the skills as a team production tool in Claude Code — zero prod risk. Validate output beats today's plan before touching the codebase.",
      deliverables: [
        "Install the seo-geo plugin for the team; wire free GSC + GA4 for client sites",
        "Produce the opportunity/execution plan deliverables that are hand-built today",
        "Adopt CORE-EEAT (80) / CITE (40) as the human sign-off gate",
        "Go/no-go: side-by-side vs today's single-haiku plan",
      ],
    },
    {
      key: "phase-2",
      status: "planned",
      title: "Phase 2",
      subtitle: "Build the method into the product",
      window: "Gated on Phase 1 · ~2–4 weeks",
      desc: "Port the validated methods into seoplan.ts. Responsibly re-enable the automation that's currently disabled — drafted by AI, approved by a human.",
      deliverables: [
        "Replace homepage-regex fetch with real crawl + onpage + schema_lint + robots/sitemap",
        "Feed GSC/GA4 data into plan generation",
        "Upgrade engine: multi-step + stronger model, human gate retained",
        "Add the GEO/AEO axis to the generated plan (net-new sellable value)",
      ],
    },
    {
      key: "phase-3",
      status: "future",
      title: "Phase 3",
      subtitle: "Recurring value & monitoring",
      window: "Ongoing · retention lever",
      desc: "For a $489/mo subscription, demonstrated monthly value is the #1 retention lever — and there's none today.",
      deliverables: [
        "Rank tracker + monthly performance report via GSC",
        "Surface progress in the client portal",
        "ledger.py before/after deltas in client reporting",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Website-builder integration",
      window: "Future · gated on Coreshift Live Edit",
      desc: "Wire LeanSEO into Coreshift Live Edit (the in-dev self-serve $100/mo site platform) so every site is built SEO/GEO-ready by default, then offer LeanSEO as a switch-on add-on to Live Edit clients. Builds directly on Phase 0 — the same SSR/schema/llms.txt bundle, generalised from our own site into a reusable ruleset.",
      deliverables: [
        "Emit LeanSEO best practices in three forms: a spec/checklist, a machine-readable ruleset Live Edit ingests, and an SEO/GEO-ready starter theme",
        "Bake the ruleset into Live Edit's themes + edge renderer (SSR, schema, llms.txt, clean sitemap by default)",
        "Prep built sites to 'receive' LeanSEO — structural hooks for a later add-on integration",
        "Offer LeanSEO as a paid add-on/integration to Live Edit clients",
      ],
    },
  ],
};
