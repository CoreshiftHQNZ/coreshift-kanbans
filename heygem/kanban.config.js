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

  phase: "Rebuild · pivot to concierge",
  nextMilestone: {
    name: "Marketing repositioned (live site sells the old model)",
    date: "Phase R1",
  },

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
      status: "planned",
      title: "Phase R1",
      subtitle: "Reposition marketing",
      window: "First — site sells a dead model",
      desc: "Rewrite the live site around the concierge model for NZ small businesses: chat-quote-approve-done story, no plans/$1-min. Keep design system + lead form.",
      deliverables: [
        "New hero/problem/how-it-works copy",
        "Pricing section → how quoting works",
        "Audience broadened: offices, clinics, agencies, tradies",
      ],
    },
    {
      key: "phase-r2",
      status: "planned",
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
      status: "planned",
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
      status: "planned",
      title: "Phase R4",
      subtitle: "Payments (Stripe test)",
      window: "Live keys gated on company registration",
      desc: "Card on file at first quote-approval (SetupIntent), off-session PaymentIntent on completion, GST receipts, decline/retry handling. Test mode until the business + bank exist.",
      deliverables: [
        "Save card at first approval",
        "Charge-on-complete edge function",
        "GST receipt email",
      ],
    },
    {
      key: "phase-r5",
      status: "future",
      title: "Phase R5",
      subtitle: "Capacitor + push + ratings",
      window: "Store accounts gate submission, not the build",
      desc: "Wrap the customer app for iOS/Android, FCM/APNs push (quote, completion, rating request), rating flow with stars + feedback + photo, store submission.",
      deliverables: [
        "Capacitor iOS/Android builds",
        "Push: new quote / job done / rate it",
        "Rating + photo upload",
        "App Store + Play submissions",
      ],
    },
  ],

  footerHtml:
    'Edit <code>heygem/KANBAN.md</code> and run <code>node tools/build.js heygem</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
