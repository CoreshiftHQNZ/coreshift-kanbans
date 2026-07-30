// Project kanban config — read by tools/build.js.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Upwind",
  brandMark: "✎",
  brandSub: "Product Dashboard",
  tagline: "Websites small businesses can edit themselves — and a partner program that sells them. US$49/mo, built on Coreshift Limited as merchant of record.",
  description:
    "The core Coreshift product: clients get a beautiful site they can edit in place, with unlimited redesigns across a library of theme styles. " +
    "Edge-native — publishing is a database pointer flip, so go-live is instant; one Cloudflare Worker server-renders every tenant. " +
    "Cloudflare + Supabase + Stripe + Postmark. Live in production with real customer sites; current focus is proving the money path and hardening security.",

  phase: "M0–M3 closed · selling (M4)",
  nextMilestone: {
    name: "M4 — Start selling: a partner who isn't us sends an offer a real customer pays for",
    date: "M4",
  },

  // ── Milestones ────────────────────────────────────────────────
  // Adopted into the working model 2026-07-30, reconstructed from this board.
  // Numbering follows the existing phases[] (phase-0..phase-4) rather than being
  // restarted, so every past reference to "Phase 3" still means something.
  //
  // The list is short on purpose. Ricky's own read on 2026-07-30 — "I feel like
  // the app is finished" — checked out against production: 9 sign-ins in 24h
  // across magic link AND Google, two prospects through to `paid`, custom domains
  // proved. What remains is proof, ops and paperwork, plus one capability that has
  // never run anywhere (payouts) and one deliberately unbuilt (domain registration).
  milestones: [
    { id: "M0", name: "Edge-native foundation", status: "done",
      doneWhen: "The renderer serves a published tenant site from the edge" },
    { id: "M1", name: "The in-page editor", status: "done",
      doneWhen: "A customer edits their live page and publishes it" },
    { id: "M2", name: "A live product", status: "done",
      doneWhen: "A real customer signs up, generates a site and connects a custom domain (theboys.co.nz active)" },
    { id: "M3", name: "Money path + security hardening", status: "done",
      doneWhen: "The production ledger reconciles to zero and no anon write grant remains (both closed 2026-07-30)" },
    { id: "M4", name: "Start selling", status: "current",
      doneWhen: "A partner who isn't us sends an offer that a real customer pays for" },
    { id: "M5", name: "Payouts proved", status: "next",
      doneWhen: "One partner receives money and a `payout` entry appears in partner_ledger" },
    { id: "M6", name: "Money path can't regress", status: "next",
      doneWhen: "CI runs the recorded-Stripe-event replay suite green, with no STRIPE_MODE in the codebase" },
    { id: "M7", name: "Sell a domain", status: "next",
      doneWhen: "A domain is registered in the customer's name and charged at US$5/mo" },
  ],

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "✎",
      title: "Edit the live page",
      desc: "Click any text or image on your real site and change it. Rich text, links, nav/footer, pages, SEO, plus theme switching across the section + theme library.",
    },
    {
      icon: "⚡",
      title: "Publish instantly",
      desc: "Publishing flips a pointer in the DB and purges the edge cache, so a change is live in seconds. One Worker SSRs every tenant from the same components the editor uses.",
    },
    {
      icon: "💳",
      title: "$100/mo, self-serve",
      desc: "Sign up, generate a site from your URL, edit it, go live on a subdomain or custom domain. Trial from first publish, then a Stripe subscription.",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "📦",
      title: "Repo",
      desc: "CoreshiftHQNZ/upwind — the whole monorepo",
      url: "https://github.com/CoreshiftHQNZ/upwind",
    },
    {
      icon: "🚀",
      title: "Dashboard / editor",
      desc: "app.coreshift.page — sign in, edit, publish",
      url: "https://app.coreshift.page",
    },
    {
      icon: "🌐",
      title: "Marketing site",
      desc: "coreshift.page — the funnel + signup",
      url: "https://coreshift.page",
    },
    {
      icon: "🧭",
      title: "Lead Engine board",
      desc: "The sales machine built on top of this product",
      url: "../lead-engine/",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "O", name: "Owner", person: "Ricky", verbs: "Decide · prioritise · review" },
    { initial: "B", name: "Builder", person: "Claude Code", verbs: "Design · code · ship" },
    { initial: "T", name: "The stack", person: "Cloudflare · Supabase · Stripe · Postmark", verbs: "Render · store · charge · email" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Edge-native foundation",
      window: "Done",
      desc: "Multi-tenant Postgres schema + RLS, the edge renderer Worker (host → tenant → published content → SSR → cache), the shared section library and theme styles, and the JSON content contract that lets the same React components render in the editor and on published sites.",
      deliverables: [
        "Multi-tenant schema + RLS on Supabase",
        "Cloudflare Worker edge renderer",
        "Section library + theme styles (one content contract)",
        "Instant publish = published-version pointer flip",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "The in-page editor",
      window: "Done",
      desc: "The click-to-edit overlay: edit text and images in place, rich text with links, nav/footer editors, add pages, SEO + settings panels, theme switching, an in-memory draft, and a sign-off gate that publishes a new version.",
      deliverables: [
        "Click-to-edit text + image upload to storage",
        "Nav / footer / pages / SEO / settings editors",
        "Theme + brand-colour switching",
        "Draft → review → publish flow",
      ],
    },
    {
      key: "phase-2",
      status: "done",
      title: "Phase 2",
      subtitle: "A live product",
      window: "Done · in production",
      desc: "Real customers, real sites. Google sign-in, generate-a-site onboarding, custom-domain connect, the marketing site + signup funnel, CI auto-deploy, support ticketing, and passive telemetry (page views, errors, change requests).",
      deliverables: [
        "15 published sites live on *.coreshift.page",
        "Marketing site + signup funnel",
        "CI auto-deploy (workers, functions, migrations)",
        "Support ticketing + telemetry",
      ],
    },
    {
      key: "phase-3",
      status: "in-progress",
      title: "Phase 3",
      subtitle: "Monetise + harden",
      window: "Now",
      desc: "Turn a live product into a sellable one: prove the Stripe path end-to-end, make email delivery reliable, finish custom-domain activation, and close the security gaps surfaced by the review (the content-write RPC lockdown already shipped).",
      deliverables: [
        "Billing proven with a real payment + webhook robustness",
        "Email deliverability confirmed + fail-loud",
        "Security: write-path lockdown ✓, XSS + SSRF next",
        "Custom-domain activation",
      ],
    },
    {
      key: "phase-4",
      status: "planned",
      title: "Phase 4",
      subtitle: "Polish + self-serve",
      window: "Next",
      desc: "Smooth the edges: faster generation on the real theme set, a self-serve billing portal, account lifecycle (rename / leave / transfer / delete), proper test coverage, and reconciling the live DB schema back into source migrations.",
      deliverables: [
        "Faster generation on the full theme set",
        "Self-serve billing portal + dunning",
        "Account lifecycle + co-owner + audit trail",
        "Test coverage + schema-in-source",
      ],
    },
  ],

  footerHtml:
    'Edit <code>upwind/KANBAN.md</code> and run <code>node tools/build.js upwind</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
