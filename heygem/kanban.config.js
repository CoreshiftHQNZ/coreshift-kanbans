// Project kanban config — read by tools/build.js.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "HeyGem",
  tagline: "Concierge & errands for Kiwi small businesses — “put a Gem on it.”",
  description:
    "Chat-first concierge service: a business texts their Gem (“can you organise team morning tea for Friday?”), " +
    "the Gem quotes in the chat, the customer approves, the Gem sorts it, and the saved card is charged on completion — " +
    "followed by a push notification for a star rating, feedback and a photo. One React codebase ships the customer " +
    "experience as a web app AND native iOS/Android apps via Capacitor; Gems work from a web workspace.",

  phase: "Core loop complete · seeking first customers",
  nextMilestone: {
    name: "First paying customers on the live loop",
    date: "Native mobile deferred",
  },

  // ── Milestones ────────────────────────────────────────────────
  // Reconstructed from the board 2026-07-31 (/adopt). M0–M5 map 1:1 onto the
  // existing Phase 0 / R1–R5 keys — the numbering was kept, not reinvented.
  milestones: [
    { id: "M0", name: "Foundations (pre-pivot)", status: "done",
      doneWhen: "heygem.co.nz serves from Railway and a form submission lands in Supabase `leads` (verified e2e)" },
    { id: "M1", name: "Coming-soon splash", status: "done",
      doneWhen: "Production + staging serve the concierge splash and an early-access submission reaches the leads pipeline" },
    { id: "M2", name: "Accounts + job/chat core", status: "done",
      doneWhen: "A customer drives request → live Gem quote → approve through the real UI, with cross-business isolation proven under RLS" },
    { id: "M3", name: "Gem workspace", status: "done",
      doneWhen: "A Gem runs a job the whole way through the workspace UI — claim, quote, start, mark complete" },
    { id: "M4", name: "Payments — LIVE", status: "done",
      doneWhen: "Completion charges a saved card on live Stripe keys and a GST receipt is emailed (real $506 test charge, then live cutover)" },
    { id: "M5", name: "Ratings + closed loop", status: "done",
      doneWhen: "A completed job is rated via `submit_rating` and the Stripe webhook reconciles a signed event (native mobile deliberately deferred 2026-07-29)" },
    { id: "M6", name: "First paying customers on the live loop", status: "current",
      doneWhen: "A real customer who isn't us runs a job end to end — request → quote approved → live card charged → rated" },
    { id: "M7", name: "Launch-readiness polish", status: "next",
      doneWhen: "heygem.co.nz serves an OG image, analytics records a real session, and one Railway service serves both environments" },
    { id: "M8", name: "Native mobile + push", status: "next",
      doneWhen: "The customer app is installable from the App Store and Play, and a new-quote push arrives on a real device" },
  ],

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "💬",
      title: "Text your Gem, it's sorted",
      desc: "Every request is a chat thread per job with auto status and archiving — quote, approve, done, rated.",
    },
    {
      icon: "💳",
      title: "Charged only when it's done",
      desc: "All-in quote approved in chat; saved card charged off-session on completion, GST receipt sent.",
    },
    {
      icon: "📱",
      title: "One codebase, every platform",
      desc: "React + Capacitor ships web, iOS and Android from the same app — native push for quotes, completion and ratings.",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "🚀",
      title: "Live site (production)",
      desc: "heygem.co.nz — being repositioned from the old admin-plans model",
      url: "https://heygem.co.nz",
    },
    {
      icon: "🧪",
      title: "Staging",
      desc: "staging.heygem.co.nz — staging branch auto-deploy",
      url: "https://staging.heygem.co.nz",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "O", name: "Owner / client", person: "Ricky + client", verbs: "Decide · brand · register company · store accounts" },
    { initial: "B", name: "Builder", person: "Claude Code", verbs: "Design · code · ship" },
    { initial: "G", name: "Gems (ops)", person: "Pooled staff", verbs: "Claim jobs · chat · quote · complete" },
    { initial: "S", name: "The stack", person: "React+Capacitor · Supabase · Railway · Stripe · FCM", verbs: "Chat · store · charge · notify" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Foundations (pre-pivot)",
      window: "Shipped Jun 2026",
      desc: "Monorepo + design system, GitHub/Supabase/Railway infra, real brand assets, marketing site LIVE on heygem.co.nz with lead capture + notifications. All of this survives the pivot.",
      deliverables: [
        "pnpm monorepo + @heygem/ui (amethyst brand)",
        "Supabase project + leads pipeline (verified e2e)",
        "Railway deploys: heygem.co.nz + staging.heygem.co.nz",
        "Old-model marketing site live (to be repositioned)",
      ],
    },
    {
      key: "phase-r1",
      status: "done",
      title: "Phase R1",
      subtitle: "Coming-soon splash",
      window: "Shipped 2026-06-12",
      desc: "heygem.co.nz repositioned as a coming-soon splash: “Business Concierge & Errands”, example requests as chat bubbles, early-access form (name + email + example ask) into the leads pipeline.",
      deliverables: [
        "Splash live on production + staging",
        "Chat-bubble example requests (the product demo)",
        "Early-access capture w/ email column + notify pipeline",
      ],
    },
    {
      key: "phase-r2",
      status: "done",
      title: "Phase R2",
      subtitle: "Accounts + job/chat core",
      window: "The new heart of the product",
      desc: "Schema v2 (businesses→users, gems, jobs with status machine, per-job message threads via Realtime, quotes, ratings, devices) with RLS. Customer web app: magic-link sign-in, request composer, job list, live chat with quote-approve.",
      deliverables: [
        "Schema v2 migrations + RLS",
        "Job status machine (requested→quoted→approved→in_progress→completed→charged→closed)",
        "Customer app: chat thread per job, auto-archive",
      ],
    },
    {
      key: "phase-r3",
      status: "done",
      title: "Phase R3",
      subtitle: "Gem workspace",
      window: "Web only",
      desc: "Pooled queue of requests, claim a job (everyone presents as “Gem”), chat, quote composer, status transitions, mark complete. Lead inbox from the marketing site lands here too.",
      deliverables: [
        "Request queue + claim",
        "Quote composer (all-in price)",
        "Complete → triggers charge",
      ],
    },
    {
      key: "phase-r4",
      status: "done",
      title: "Phase R4",
      subtitle: "Payments — LIVE",
      window: "Live Stripe (NZD) since 2026-07-02",
      desc: "Card on file at first quote-approval (SetupIntent), off-session PaymentIntent on completion, GST receipts, decline/retry handling. On live keys — real cards, real charges (acct NZ/NZD, charges + payouts enabled). Hardened 2026-07-29 with a signature-verified Stripe webhook, an idempotency ledger, and an Idempotency-Key on the charge itself.",
      deliverables: [
        "Save card at first approval",
        "Charge-on-complete edge function",
        "GST receipt email",
        "Live keys in Vault + client (test data cleared)",
        "Webhook reconciliation: refunds, disputes, late declines",
        "Double-charge guard + Gem-facing retry",
      ],
    },
    {
      key: "phase-r5",
      status: "done",
      title: "Phase R5",
      subtitle: "Capacitor + push + ratings",
      window: "Ratings shipped 2026-07-29 · native mobile deferred",
      desc: "The rating flow is live — a completed job prompts for stars, feedback and an optional photo, visible to Gems in-thread and aggregated per customer in the CRM. Still to come: wrapping the customer app for iOS/Android with Capacitor and FCM/APNs push (new quote, job done, rate it). Blocked on a build machine with Xcode + the Android SDK, a Firebase project for FCM, an APNs key, and the Google Play org account.",
      deliverables: [
        "Rating + photo upload",
        "Capacitor iOS/Android builds",
        "Push: new quote / job done / rate it",
        "App Store + Play submissions",
      ],
    },
  ],

  footerHtml:
    'Edit <code>heygem/KANBAN.md</code> and run <code>node tools/build.js heygem</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
