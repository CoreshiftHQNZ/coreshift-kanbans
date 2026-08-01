// Project kanban config — read by tools/build.js.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Go-Chiro",
  brandMark: "🦴",
  brandSub: "Practice Management System",
  tagline:
    "Full NZ practice management system, built for 1–5 person practices. Lighter than Splose, with the efficiency layer that makes the 1 → 3 staff jump painless.",
  description:
    "Direction change 2026-07-21: Go-Chiro stopped being a layer on top of Splose and became a complete, standalone practice management system — our own diary, records, invoicing and reporting. " +
    "The product thesis is the 1 → 3 staff jump: automate everything a solo operator does by hand (reminders, recalls, intake, payments, forms) so hires #2 and #3 are clinicians, not admin. " +
    "Built for Go Chiro first, kept SaaS-ready (every table is already practice-scoped). Node/Express + React + Drizzle on Supabase, deployed to Railway. Full plan: docs/ROADMAP.md in the repo.",

  phase: "M3 blocked on Luke · building M7 retail",
  nextMilestone: {
    name: "M7 — Retail: the clinic shop, sellable with backorder and pre-order",
    date: "M7",
  },

  // ── Milestones ────────────────────────────────────────────────
  // Adopted into the working model 2026-08-01, reconstructed from the
  // hand-rolled board (last updated 2026-07-21), docs/ROADMAP.md and 97 merged
  // PRs. Numbering follows the board's own M1–M6 rather than being restarted,
  // so every past reference still means something. M3.5 is inserted rather than
  // renumbering M4–M6.
  //
  // The one thing the board got wrong: M4 shipped before M3 closed, because
  // M3's tail is not code — it is a switch morning and a set of IDs only Luke
  // has. And on 2026-08-01 Ricky named the real gap: the full day has never
  // actually been run end-to-end by anyone. So M3 closes on a rehearsal, and
  // go-live became its own milestone.
  milestones: [
    { id: "v0", name: "Splose-era platform", status: "done",
      doneWhen: "Patients book, pay and receive AI SOAP notes in production, on top of Splose as source of truth" },
    { id: "M1", name: "The Diary", status: "done",
      doneWhen: "The practice can run a day from the in-app diary and appointments are born native (appointments.bookingSource default flipped 'splose' → 'native', PR #73, in prod)" },
    { id: "M2", name: "Native invoicing", status: "done",
      doneWhen: "A GST-compliant invoice originates in the app and is paid via Stripe with no Splose invoice ID (migration 0021 made sploseInvoiceId nullable, PR #75, in prod)" },
    // doneWhen rewritten by Ricky 2026-08-01, and it is deliberately the clinical
    // + money loop rather than the ACC one: ACC submission cannot be rehearsed at
    // all until Luke's Vendor ID exists, so the first real ACC submission moved to
    // M3.5. The milestone kept its number; only its name and doneWhen changed.
    { id: "M3", name: "Prove the day", status: "blocked",
      doneWhen: "A full customer booking runs end to end: session completed with notes recorded, summary and reports written and visible in both the client record and the patient's own view, homework created and live in the patient's app, invoice sent automatically, and paid automatically off the patient's saved card under the auto-charge authority given at the end of the session" },
    { id: "M3.5", name: "Go-live cutover + first ACC submission", status: "next",
      doneWhen: "SPLOSE_CUTOVER=true, NOTIFICATIONS_PAUSED=false, Luke works a full day with Splose read-only, and one real ACC invoice is submitted from the app and marked paid" },
    { id: "M4", name: "Front desk without a front desk", status: "done",
      doneWhen: "Recalls, waitlist, online intake forms and staff accounts/roles are all live in production (PRs #80, #86, #89, #92 — all shipped 2026-07-21)" },
    { id: "M5", name: "Money & insight", status: "next",
      doneWhen: "Luke reads a month's revenue report in-app and exports it to Xero" },
    { id: "M6", name: "SaaS-ready", status: "next",
      doneWhen: "A second practice signs up, onboards and pays without anyone touching the database" },
    // Added 2026-08-01. Pulled ahead of M3 because M3 is blocked on Luke (ACC
    // Vendor ID + the rehearsal) and he was not working that day. Retail shares
    // no tables and no flows with the cutover, so it can run in parallel safely.
    // Scope answered by Ricky: public storefront with guest checkout · collect
    // at clinic or flat-rate NZ shipping, buyer chooses · sizes with tracked
    // stock BUT overselling allowed (backorder) and pre-order supported ·
    // Luke manages the catalogue himself in-app.
    { id: "M7", name: "Retail: the clinic shop", status: "current",
      doneWhen: "A real customer buys a real garment through the public storefront, pays by card, and Luke marks it collected or shipped" },
  ],

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "📅",
      title: "The diary the practice lives in",
      desc: "Day + week calendar, per-practitioner columns, venue and route-day aware, drag-to-reschedule with conflict detection. Splose's core job, replaced — and mobile-first, because the practice is.",
    },
    {
      icon: "🏥",
      title: "Bill ACC without leaving the app",
      desc: "One-click Submit to ACC: a compliant invoice PDF emailed to providerinvoices@acc.co.nz with the ACC billing block, plus status tracking. This is what gates cutting the Splose cord.",
    },
    {
      icon: "🤖",
      title: "The 1 → 3 staff jump",
      desc: "Recalls, waitlist, online intake, reminders and auto-pay do the admin a solo operator does by hand — so hires #2 and #3 are clinicians, not reception.",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "📦",
      title: "Repo",
      desc: "CoreshiftHQNZ/go-chiro — dev → staging → main, auto-deployed to Railway",
      url: "https://github.com/CoreshiftHQNZ/go-chiro",
    },
    {
      icon: "🗺️",
      title: "Roadmap",
      desc: "docs/ROADMAP.md — the full standalone-PMS plan, decisions and open questions",
      url: "https://github.com/CoreshiftHQNZ/go-chiro/blob/dev/docs/ROADMAP.md",
    },
    {
      icon: "🏗️",
      title: "Architecture standards",
      desc: "docs/standards/ — architecture, auth and storage conventions",
      url: "https://github.com/CoreshiftHQNZ/go-chiro/tree/dev/docs/standards",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "O", name: "Owner", person: "Ricky", verbs: "Decide · prioritise · test as a real patient" },
    { initial: "P", name: "The practice", person: "Luke (Go Chiro)", verbs: "Treat · bill · pick the switch morning" },
    { initial: "B", name: "Builder", person: "Claude Code", verbs: "Design · code · ship" },
    { initial: "T", name: "The stack", person: "Supabase · Railway · Stripe · Postmark · ACC", verbs: "Store · run · charge · email · pay" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "v0",
      status: "done",
      title: "v0",
      subtitle: "Splose era — the differentiated layer",
      window: "Done · in production",
      desc: "Everything Splose does not do, built first: patient self-booking (mobile vs clinic, route days), Stripe payments with auto-pay, the clinical loop (session → AI SOAP → publish), ACC45 claims and PDFs, exercise homework with streaks, messaging, notifications, and the patient portal — all riding a two-way Splose sync.",
      deliverables: [
        "Clinical loop: session → AI SOAP → publish",
        "Booking wizard + venues + route days + optimization",
        "Stripe payments + auto-pay (live keys verified in prod)",
        "Patient portal, homework, messaging, notifications",
      ],
    },
    {
      key: "m1-m2",
      status: "done",
      title: "M1–M2",
      subtitle: "Diary + native invoicing",
      window: "Done · in production",
      desc: "The commodity PMS core that Splose still owned. Appointments and invoices now originate in Go-Chiro rather than being imported: the diary the practice lives in all day, and a GST-correct, ACC-aware invoice engine feeding the existing Stripe rails.",
      deliverables: [
        "Day + week diary, per-practitioner columns, drag-to-reschedule",
        "Practitioner appointment CRUD + quick-create patient",
        "Native invoice origination, GST maths, sequential numbering, PDF",
        "ACC portion vs patient co-pay split from day one",
      ],
    },
    {
      key: "m3",
      status: "planned",
      title: "M3",
      subtitle: "Prove the day — blocked on Luke",
      window: "Blocked",
      desc: "The clinical and money loop, rehearsed end to end with Ricky as the patient: book, attend, note published with summary and reports on both sides, homework live in the patient's app, invoice raised automatically and auto-charged to the saved card. The code is all in production and none of it has ever been run as one continuous flow. Blocked because it needs Luke, and because ACC submission cannot be exercised until his Vendor ID exists — so ACC moved to M3.5.",
      deliverables: [
        "A scripted full-day rehearsal, evidenced step by step",
        "Notes → summary → reports visible in both views",
        "Homework auto-created and live in the patient app",
        "Invoice auto-raised and auto-charged to a saved card",
      ],
    },
    {
      key: "m3-5",
      status: "planned",
      title: "M3.5",
      subtitle: "Go-live cutover",
      window: "Next",
      desc: "The switch morning. Luke stops booking in Splose, the flag flips, notifications un-pause, and Go-Chiro becomes sole source of truth — with the system-of-record hardening (backups/PITR, audit trail, Privacy Act + HIPC review) done before the data has nowhere else to live.",
      deliverables: [
        "System-of-record hardening: PITR, audit trail, HIPC review",
        "Full history migration + final Splose import",
        "SPLOSE_CUTOVER=true · NOTIFICATIONS_PAUSED=false",
        "Splose export taken, then subscription cancelled",
      ],
    },
    {
      key: "m4",
      status: "done",
      title: "M4",
      subtitle: "Front desk without a front desk",
      window: "Done · in production",
      desc: "The efficiency thesis, shipped ahead of go-live: automated recalls, a waitlist for cancellations, online new-patient intake forms, and staff accounts with practitioner/admin roles. All live in production, all silent until notifications un-pause.",
      deliverables: [
        "Automated recalls — the revenue-recovery lever",
        "Waitlist — fill cancellations instead of losing them",
        "Online intake forms — reception-less onboarding",
        "Staff accounts + roles — the 1→3 hire enabler",
      ],
    },
    {
      key: "m7",
      status: "in-progress",
      title: "M7",
      subtitle: "Retail — the clinic shop",
      window: "Now",
      desc: "Luke sells a few pieces of clothing. A lean public storefront on the existing marketing site: browse, pick a size, pay by card via Stripe Checkout, then either collect at the clinic or have it shipped flat-rate anywhere in NZ. Stock is counted but never blocks a sale — running out puts the line on backorder rather than turning the customer away, and products can be listed for pre-order before stock lands. Luke runs the catalogue himself.",
      deliverables: [
        "Products + variants + orders schema, Luke-managed catalogue",
        "Public storefront, cart, guest checkout via Stripe Checkout",
        "Backorder + pre-order: stock counts, never blocks a sale",
        "Fulfilment queue: collect at clinic or flat-rate NZ shipping",
      ],
    },
    {
      key: "m5-m6",
      status: "future",
      title: "M5–M6",
      subtitle: "Money, insight, and maybe SaaS",
      window: "Later",
      desc: "Reporting and Xero export so the money is legible, the ACC electronic-channel upgrade (straight-through processing, ~8-day payment, auto-reconciliation), and — only if the system proves itself in Go Chiro's daily use — tenant onboarding and plan billing for other practices.",
      deliverables: [
        "Reporting pack: revenue, appointments, no-shows, per-practitioner",
        "Xero export (CSV first)",
        "ACC eBusiness gateway / Invoicing API upgrade",
        "Tenant signup + plan billing (parked)",
      ],
    },
  ],

  footerHtml:
    'Edit <code>go-chiro/KANBAN.md</code> and run <code>node tools/build.js go-chiro</code> to refresh this view. ' +
    "&nbsp;·&nbsp; " +
    'Source: <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans">CoreshiftHQNZ/coreshift-kanbans</a>.',
};
