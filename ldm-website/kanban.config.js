// LDM Finance Website kanban config — read by tools/build.js.
module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  title: "LDM Finance Website",
  tagline: "Vehicle finance built for how New Zealand businesses actually operate.",
  description:
    "Standalone finance-first site for LDM Motor Group, live at ldmfinance.co.nz — " +
    "one application assessed across a multi-lender panel (UDC Finance, Marac, Avanti). " +
    "Astro static build on Cloudflare Pages with live Motorcentral stock; the calculator and " +
    "three-step application are the conversion surfaces.",

  phase: "Phase 3 · Content & sign-off",
  nextMilestone: {
    name: "Client sign-off: UDC wording + legal review",
    date: "Q3 2026",
  },

  goals: [
    {
      icon: "📋",
      title: "Qualified applications",
      desc: "Finance applications from tradies, SMEs and fleet managers nationwide — the #1 KPI surface is /apply.",
    },
    {
      icon: "🔍",
      title: "Search + AI visibility",
      desc: "SEO/GEO/AEO ≥ 8/10 at the post-launch audit, Lighthouse mobile ≥ 85, LLM citation rate 15%+ by month 6.",
    },
    {
      icon: "🚚",
      title: "Live stock, two CTAs",
      desc: "Every Motorcentral vehicle page shows an indicative weekly figure and exactly two next steps: calculate or apply.",
    },
  ],

  links: [
    {
      icon: "📦",
      title: "Repo",
      desc: "CoreshiftHQNZ/ldm-website — Astro site, docs, design handoff",
      url: "https://github.com/CoreshiftHQNZ/ldm-website",
    },
    {
      icon: "✅",
      title: "SEO readiness spec",
      desc: "Acceptance criteria and launch gates the build is held to",
      url: "https://github.com/CoreshiftHQNZ/ldm-website/blob/main/docs/seo-readiness.md",
    },
    {
      icon: "📡",
      title: "Stock feed architecture",
      desc: "SFTPGo on Fly.io → R2 → Pages deploy hook",
      url: "https://github.com/CoreshiftHQNZ/ldm-website/blob/main/docs/stock-feed.md",
    },
  ],

  roles: [
    { initial: "A", name: "Owner", person: "Abe", verbs: "Decide · prioritise · review" },
    { initial: "C", name: "Builder", person: "Claude Code", verbs: "Design · code · ship" },
    { initial: "L", name: "Client", person: "LDM Motor Group (Jack)", verbs: "Approve · supply content · sign off legals" },
  ],

  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Discovery & design",
      window: "Done · July 2026",
      desc: "DigitalArchitect audit distilled into build specs, real Motorcentral inventory sampled, and the full site designed and exported as a handoff bundle.",
      deliverables: [
        "ia.md + seo-readiness.md acceptance specs",
        "Motorcentral sample (49 vehicles, 950 images)",
        "Design prototype — 16 templates (design/handoff)",
      ],
    },
    {
      key: "phase-1",
      status: "in-progress",
      title: "Phase 1",
      subtitle: "Code",
      window: "Core shipped · July 2026",
      desc: "The design implemented as an Astro static site on Cloudflare Pages, reviewed and verified against the SEO spec. Lead relay built and merged; remaining is dashboard config (Turnstile keys, email domain).",
      deliverables: [
        "16 templates + 49 vehicle pages (shipped)",
        "Schema, sitemaps, llms.txt, products API (shipped)",
        "Pages project — previews per branch, prod on main (shipped)",
        "Lead relay: Cloudflare Email Service + Turnstile (built, pending config)",
      ],
    },
    {
      key: "phase-2",
      status: "in-progress",
      title: "Phase 2",
      subtitle: "Wiring",
      window: "Underway · July 2026",
      desc: "Connect the live systems around the static site: stock feed ingest, analytics and measurement.",
      deliverables: [
        "SFTPGo sidecar → R2 → deploy hook (live, awaiting first push)",
        "GA4 + GSC + Bing + IndexNow + Peec AI",
        "SUB-PROCESSORS.md + /sub-processors page (shipped)",
      ],
    },
    {
      key: "phase-3",
      status: "planned",
      title: "Phase 3",
      subtitle: "Content & sign-off",
      window: "Gated on client",
      desc: "Replace the flagged placeholders with approved content and extend the IA beyond the designed templates.",
      deliverables: [
        "UDC disclaimer wording, FSPR number, team, testimonials",
        "Level B/C product + guide pages from ia.md",
        "/finance-eligibility + lender comparison content",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Go-live",
      window: "After sign-off",
      desc: "Final sign-off and post-launch monitoring. The domain is already live on ldmfinance.co.nz under Coreshift management, so there is no DNS cutover to run.",
      deliverables: [
        "Domain live at ldmfinance.co.nz (done — Coreshift-managed)",
        "Better Stack uptime + Sentinel onboarding",
        "Post-launch SEO/GEO/AEO audit vs targets",
      ],
    },
  ],
};
