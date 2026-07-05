// Project kanban config — read by tools/build.js.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Lead Engine",
  tagline: "Find bad websites → auto-build the replacement → Russ closes on the call.",
  description:
    "A closed-loop sales engine built into coreshift-live-edit: discover NZ businesses with poor websites (scored on a 7-check rubric), " +
    "auto-generate a Coreshift replacement from their URL, a team member reviews it, then a warm no-obligation invitation goes out to book a " +
    "15-min walkthrough with Russ. Russ closes on the call — one-off build fee, card saved once, subscription starts later at go-live. " +
    "Multi-tenant from day one: Coreshift is agency #1; other companies can resell the same system later.",

  phase: "M1–M5 built · wiring + go-live",
  nextMilestone: {
    name: "Add Places key, connect Russ's calendar, test-mode sale dry-run",
    date: "Go-live checklist",
  },

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "🔎",
      title: "Find the bad websites",
      desc: "A multi-stage research pass scores each site on 7 weighted checks (max 98); a lead must clear 50 to make the list.",
    },
    {
      icon: "🤖",
      title: "Build it before they pay",
      desc: "crawl-site + generate-site turn their URL into a Coreshift site automatically; a human reviews before anything is sent.",
    },
    {
      icon: "📞",
      title: "Close on the call",
      desc: "Warm invite → book Russ → he enters the price and sends a pay link mid-call. Dead simple, low-tech-friendly.",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "📦",
      title: "Repo",
      desc: "CoreshiftHQNZ/coreshift-live-edit — the engine lives here",
      url: "https://github.com/CoreshiftHQNZ/coreshift-live-edit",
    },
    {
      icon: "🚀",
      title: "Dashboard / editor",
      desc: "app.coreshift.page — where the CRM + admin surface lives",
      url: "https://app.coreshift.page",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "O", name: "Owner", person: "Ricky", verbs: "Decide · prioritise · review" },
    { initial: "B", name: "Builder", person: "Claude Code", verbs: "Design · code · ship" },
    { initial: "S", name: "Sales", person: "Russ", verbs: "Walkthrough · close on the call" },
    { initial: "T", name: "The stack", person: "Cloudflare · Supabase · Stripe · Postmark · Google Places/Calendar", verbs: "Score · generate · charge · email · book" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Discovery + reuse audit",
      window: "Done 2026-07-05",
      desc: "Mapped the existing platform and found ~60% of the engine already built: crawl-site, generate-site, Stripe checkout/webhook, Postmark, Supabase Auth, the agency/reseller model (account_links), and the admin dashboard. Locked the v1 scope and the sale model.",
      deliverables: [
        "Architecture map + reuse inventory",
        "Decisions: v1 booking-only (no buy page)",
        "Decisions: one-off sale + card-once, Google Places sourcing",
        "Decision: build on the existing agency (account_links) model",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "Workspace auth + roles",
      window: "In progress",
      desc: "Establish a Coreshift agency account and let anyone with a verified @coreshifthq.com email join it as their own user (no shared login). Roles: admin / sales / reviewer. Russ gets a stripped-down view.",
      deliverables: [
        "Coreshift agency account + team membership",
        "@coreshifthq.com domain auto-join",
        "Roles: admin / sales / reviewer (replaces hardcoded app_admins)",
        "Russ's simplified role-scoped view",
      ],
    },
    {
      key: "phase-2",
      status: "done",
      title: "Phase 2",
      subtitle: "Prospect pipeline + CRM board",
      window: "Next",
      desc: "The pipeline record + stage machine sitting above the existing accounts table. A prospect walks the stages; on sale it converts into an account + site. Minimal CRM board in the admin portal.",
      deliverables: [
        "prospects table (agency-scoped) + stage machine",
        "Pipeline board UI + Russ's view",
        "Prospect → account + site conversion on sale",
      ],
    },
    {
      key: "phase-3",
      status: "done",
      title: "Phase 3",
      subtitle: "Scoring engine",
      window: "Proves the thesis on real data",
      desc: "Extend crawl-site into a score-site pass computing the 7-check rubric (mobile-friendly, HTTPS, outdated build, poor images, stale content, no analytics, broken links). 5 checks are deterministic; 2 need tech-fingerprint + a vision call. Lead qualifies at ≥50.",
      deliverables: [
        "score-site function + per-check breakdown",
        "Rubric bars on each prospect card",
        "≥50 gate to enter the pipeline",
      ],
    },
    {
      key: "phase-4",
      status: "done",
      title: "Phase 4",
      subtitle: "On-call sale (Stripe)",
      window: "Highest-leverage; Russ touches this most",
      desc: "One field, one button: Russ enters the amount → Stripe charges the one-off build fee AND saves the card (setup_future_usage). On go-live the $100/mo subscription starts off-session — no second card entry. (heygem's R4 is a working reference.)",
      deliverables: [
        "Enter-amount → pay link, sent mid-call",
        "Save card for later subscription",
        "Off-session subscription start at go-live",
      ],
    },
    {
      key: "phase-5",
      status: "done",
      title: "Phase 5",
      subtitle: "Discover · outreach · preview · book",
      window: "Ties the loop together",
      desc: "Google Places discovery feeds URLs to the scorer; the warm invitation email (UEMA-compliant unsubscribe) links to a password-token preview that auto-unlocks from the email; booking creates a 15-min Google Meet with Russ + the preview URL in the notes.",
      deliverables: [
        "Google Places discovery → scorer",
        "Invitation email + suppression list (Postmark)",
        "Password-token preview (auto-unlock + trust video + 0800)",
        "Google Calendar 15-min Meet booking",
      ],
    },
  ],

  footerHtml:
    'Edit <code>lead-engine/KANBAN.md</code> and run <code>node tools/build.js lead-engine</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
