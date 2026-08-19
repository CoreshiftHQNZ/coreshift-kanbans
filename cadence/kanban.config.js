// Cadence — project kanban config. Read by tools/build.js.
//
// Scheduled by MILESTONE, not by date. Pace flexes with credit allocation, so no
// artifact in this project carries a calendar date for future work.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  title: "Cadence",
  tagline:
    "Every GST return provably right before anyone signs it — the errors found by the ledger's own history, not by a human reading 1,400 lines at 9pm.",
  description:
    "Cadence reads a client's Xero data each period, generates the exceptions from that client's own " +
    "learned coding history, and produces a workpaper where every figure traces to the transaction " +
    "that made it and every judgement carries a named human's signature. Xero already computes and " +
    "files the NZ GST return — the work Cadence replaces is proving it right beforehand, which Colab " +
    "Accountants currently does in a Google Sheet across ~50 client organisations. Coreshift builds, " +
    "hosts and operates it on the practice's behalf for a retainer.",

  phase: "M2 · Ground truth — evidence before code",
  nextMilestone: {
    name: "Ground truth captured",
    date: "No date — milestone-based",
  },

  // ── Milestones ────────────────────────────────────────────────
  // doneWhen is ONE observable event. It is the only thing stopping a
  // milestone from quietly expanding.
  milestones: [
    { id: "M1", name: "Idea locked", status: "done",
      doneWhen: "docs/validation-report.md carries a Strong verdict and docs/product-idea.md records the decided constraints (closed 2026-08-19)" },
    { id: "M2", name: "Ground truth", status: "current",
      doneWhen: "docs/gst-ground-truth.md § Conclusions states whether the core assumption held — that GST time goes into mechanically-checkable exceptions rather than chasing clients" },
    { id: "M3", name: "Concierge cycle proven", status: "next",
      doneWhen: "Colab's reviewer signs off from a workpaper we made by hand, without reopening the Google Sheet, on at least 7 of 10 returns" },
    { id: "M4", name: "Foundation — repo, DB, auth, Xero OAuth", status: "next",
      doneWhen: "A member logs in and one Xero organisation connects, on our own Supabase project and our own Xero token refresh" },
    { id: "M5", name: "Coding-profile engine", status: "next",
      doneWhen: "A per-client coding profile is built from that client's Xero history and each payee is rated consistent / conflicted / rare" },
    { id: "M6", name: "GST period pull + return computation", status: "next",
      doneWhen: "One real client period's GST101A boxes tie to the cent against the return Colab actually prepared" },
    { id: "M7", name: "Exception engine", status: "next",
      doneWhen: "A preparer works a real period's ranked exception list end to end without opening the Xero ledger" },
    { id: "M8", name: "Workpaper & sign-off ✨", status: "next",
      doneWhen: "Colab's reviewer signs a live return inside the app without reopening the Google Sheet — the magic moment, and it needs no filing capability at all" },
    { id: "M9", name: "Filing via the Xero route", status: "next",
      doneWhen: "A signed return files through Xero's existing IRD connection from inside the app with the acknowledgement captured" },
    { id: "M10", name: "Unattended cycle + sheet retired", status: "next",
      doneWhen: "Colab stops maintaining the Google Sheet" },
    { id: "M11", name: "Xero app certification ▸‖", status: "next",
      doneWhen: "The Xero app holds more than 25 connected organisations (parallel track, started in M2 — gates M10, because Colab has 50+ orgs)" },
    { id: "M12", name: "IRD gateway filing ▸‖", status: "next",
      doneWhen: "A live GST return files direct to IRD from the app under Coreshift's DSP registration (parallel track, started in M2)" },
  ],

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "🔍",
      title: "Generate the findings",
      desc: "Not a checklist to fill in — the exceptions come out of the client's own reconciled coding history, ranked by confidence, with the evidence attached. This is the one thing neither Xero nor a workpaper tool does.",
    },
    {
      icon: "🧾",
      title: "Every number carries its source",
      desc: "Any figure on the return drills to the transactions behind it. A figure that can't be traced renders as \"unverified\", never as a number — and a return with an untraceable box can't be signed.",
    },
    {
      icon: "✍️",
      title: "A named human signs, always",
      desc: "Resolve or accept each exception with a written reason; signing locks and hashes the workpaper. Auto-filing without a signature is a permanent boundary, not a deferred feature.",
    },
  ],

  // ── Links ─────────────────────────────────────────────────────
  links: [
    {
      icon: "🗄️",
      title: "cadence-spike (archived)",
      desc: "The feasibility prototype this replaces — read-only, kept for provenance",
      url: "https://github.com/core-ricky/cadence-spike",
    },
    {
      icon: "📋",
      title: "Planning set",
      desc: "Internal — product-idea, validation-report, VISION, product-vision, prd, product-roadmap",
      url: "#",
      internal: true,
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    { initial: "R", name: "Owner",    person: "Ricky",              verbs: "Decide · price · face the client" },
    { initial: "C", name: "Builder",  person: "Claude Code",        verbs: "Spec · build · verify" },
    { initial: "K", name: "Client",   person: "Colab Accountants",  verbs: "Prepare · review · sign" },
    { initial: "T", name: "The Tools", person: "Xero · Supabase · Railway · IRD", verbs: "Extract · store · run · receive" },
  ],

  // ── Phases ────────────────────────────────────────────────────
  phases: [
    {
      key: "phase-0",
      status: "in-progress",
      title: "Phase 0",
      subtitle: "Evidence",
      window: "In progress · M2–M3 · no code",
      desc: "Two milestones with no software in them, deliberately. The largest risk in this project is building the exception ruleset from assumptions instead of from Colab's actual process — so the catalogue comes off their live Google Sheet and their timed returns, and the reviewer signs a hand-made workpaper before a line of product code exists.",
      deliverables: [
        "Colab's live GST sheet analysed into a written exception catalogue",
        "Client list segmented vanilla vs complex, with counts",
        "Five real returns timed by activity — computing vs chasing",
        "GST101A box set and arithmetic verified against IRD's current form",
        "Reviewer signs our hand-made workpaper on ≥7 of 10 returns",
      ],
    },
    {
      key: "phase-1",
      status: "planned",
      title: "Phase 1",
      subtitle: "Build to the magic moment",
      window: "Starts after M3 · M4–M8",
      desc: "Foundation on our own database and our own Xero connection, then the coding-profile engine that everything downstream depends on, then the GST computation, the exception sweep, and the traceable workpaper a reviewer will sign. Filing is deliberately absent — the magic moment lands at M8 without it, which is what keeps accreditation off the critical path.",
      deliverables: [
        "Own Supabase project, own auth, own Xero OAuth + token refresh",
        "Per-client coding profiles rated consistent / conflicted / rare",
        "GST101A boxes computed from journals, tying to the cent",
        "Ranked, evidenced exception list worked without opening Xero",
        "Immutable, fully traceable workpaper signed by a named reviewer",
      ],
    },
    {
      key: "phase-2",
      status: "planned",
      title: "Phase 2",
      subtitle: "Operate it",
      window: "Starts after M8 · M9–M10",
      desc: "Filing through Xero's existing IRD connection, then the whole book running unattended on a schedule with Coreshift's touch limited to genuine exceptions. This is where the retainer either works or doesn't — the metric that matters is Coreshift minutes per return, not features.",
      deliverables: [
        "Signed returns file via Xero with the acknowledgement captured",
        "A full cycle runs unattended, ≥95% per-client success",
        "Operator console: what ran, what failed, what needs a person",
        "Backup/restore drill passed before the sheet is retired",
        "Colab stops maintaining the Google Sheet",
      ],
    },
    {
      key: "phase-3",
      status: "future",
      title: "Phase 3",
      subtitle: "Accreditations",
      window: "Parallel from M2 · M11–M12",
      desc: "Two external gates, both started early and neither on the critical path. Xero app certification is the more urgent of the two because it gates M10 — Colab has 50+ client organisations and an uncertified Xero app is understood to cap at 25 connections. IRD gateway accreditation is the longer pole and lands last.",
      deliverables: [
        "Xero connected-organisation cap verified against Xero's own terms",
        "Xero app partner certification granted (>25 orgs)",
        "IRD DSP eligibility confirmed for an operated-on-behalf service",
        "IRD registration, due diligence and OSF security review passed",
        "A live return files direct to IRD under mutual TLS",
      ],
    },
  ],
};
