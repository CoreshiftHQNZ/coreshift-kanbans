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

  phase: "M1–M2 + M4 shipped · M3 proving the day",
  nextMilestone: {
    name: "M3 — ACC billing + Splose cutover: rehearse a full patient day end-to-end on staging",
    date: "M3",
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
    { id: "M3", name: "ACC billing + Splose cutover", status: "current",
      doneWhen: "A full patient day is rehearsed end-to-end on staging with Ricky as the patient — book → attend → note published → invoice → ACC submit → pay — with every step evidenced" },
    { id: "M3.5", name: "Go-live cutover", status: "next",
      doneWhen: "SPLOSE_CUTOVER=true, NOTIFICATIONS_PAUSED=false, and Luke works a full day with Splose read-only" },
    { id: "M4", name: "Front desk without a front desk", status: "done",
      doneWhen: "Recalls, waitlist, online intake forms and staff accounts/roles are all live in production (PRs #80, #86, #89, #92 — all shipped 2026-07-21)" },
    { id: "M5", name: "Money & insight", status: "next",
      doneWhen: "Luke reads a month's revenue report in-app and exports it to Xero" },
    { id: "M6", name: "SaaS-ready", status: "next",
      doneWhen: "A second practice signs up, onboards and pays without anyone touching the database" },
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
      status: "in-progress",
      title: "M3",
      subtitle: "ACC billing + cutting the Splose cord",
      window: "Now",
      desc: "ACC invoicing is the cutover gate — today ACC is billed entirely through Splose, so Splose cannot go read-only until the app can bill ACC. The code is built and in production but has never been exercised: Vendor ID is unset, the sync is deliberately back ON, and no one has run a whole day through it. M3 now closes on a rehearsal, not a go-live.",
      deliverables: [
        "One-click Submit to ACC via the email channel (built, inert)",
        "Reversible SPLOSE_CUTOVER flag (built, sync intentionally back ON)",
        "A scripted full-day rehearsal on staging, evidenced step by step",
        "Whatever the rehearsal breaks, fixed",
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
