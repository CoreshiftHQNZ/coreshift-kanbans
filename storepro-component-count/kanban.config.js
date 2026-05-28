// Storepro Component Count — kanban config for tools/build.js.
//
// Module 3 of the wider Storepro App program: automated component
// counting + design review from DWG/DXF/PDF warehouse layouts. Card-level
// state lives in KANBAN.md next to this file.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  // ── Hero ──────────────────────────────────────────────────────
  title: "Storepro Component Count",
  tagline: "Drop a DWG, get back a Storepro-format BOM. Pre-prod ready.",
  description:
    "Reads DWG / DXF / PDF warehouse layouts. Cross-validates a deterministic DWG-block parse with a Claude-vision per-bay-type recipe. Applies the Storepro counting rules (frames = bays + runs, splice kits at 11,400 mm, back ties × 2, frame-end protectors per run, copy-paste anomaly detection). Outputs an Excel + PDF matrix matching Storepro's Phase 1 Stage 2 working sheet — no Excel hand-editing, no second-person re-check.",

  phase: "Phase 1 · Pre-prod ship complete",
  nextMilestone: {
    name: "First job through with Storepro's standardised drawings",
    date: "Once Storepro delivers the new files",
  },

  // ── Goals ─────────────────────────────────────────────────────
  goals: [
    {
      icon: "📐",
      title: "Eliminate the manual count",
      desc:
        "Today a Storepro designer prints the PDF and tallies every frame, beam, brace, mesh deck and protector by hand. We replace that with a job that runs in ~3 min and produces a matrix in the exact shape they already use.",
    },
    {
      icon: "⚖️",
      title: "Catch ambiguity before the quote",
      desc:
        "DWG-block count + vision-derived recipe must agree. When they don't (e.g. designer copy-pasted a bay), the system surfaces a clarification rather than picking one silently.",
    },
    {
      icon: "📊",
      title: "Matrix → quote, in one flow",
      desc:
        "End state: the Excel matches Storepro's Phase 1 Stage 2 sheet 1:1 — bay-type rows, component columns, totals row — ready to drop straight into Gareth + Gino's quoting workflow.",
    },
  ],

  // ── Quick links ───────────────────────────────────────────────
  links: [
    {
      icon: "🚀",
      title: "Live on staging",
      desc: "Microsoft SSO active. Login storepro / Sigma2026-O2FtB7 as fallback.",
      url: "https://storepro-component-count-staging.up.railway.app",
    },
    {
      icon: "🔧",
      title: "API on staging",
      desc: "FastAPI service — health, jobs, export.xlsx, export.pdf, /auth/microsoft/*",
      url: "https://storepro-component-count-api-staging.up.railway.app/api/health",
    },
    {
      icon: "📦",
      title: "Repo",
      desc: "Code, deploy pipeline, ops docs, parser rules",
      url: "https://github.com/CoreshiftHQNZ/storepro-component-count",
    },
  ],

  // ── Roles ─────────────────────────────────────────────────────
  roles: [
    {
      initial: "R",
      name: "Owner",
      person: "Ricky · Coreshift",
      verbs: "Scope · prioritise · client relationship",
    },
    {
      initial: "S",
      name: "Storepro principals",
      person: "Gareth + Gino",
      verbs: "Confirm rules · supply drawings · validate matrix",
    },
    {
      initial: "C",
      name: "Implementer",
      person: "Claude Code",
      verbs: "Parse · count · ship",
    },
    {
      initial: "T",
      name: "The Tools",
      person: "libredwg · Claude vision · FastAPI · Next.js · Railway · Azure AD",
      verbs: "Read · render · deploy · authenticate",
    },
  ],

  // ── Phases ────────────────────────────────────────────────────
  // status: "done" | "in-progress" | "planned" | "future"
  phases: [
    {
      key: "phase-0",
      status: "done",
      title: "Phase 0",
      subtitle: "Prove the parse",
      window: "Complete · 2026-05-14",
      desc:
        "Validate that DWGs are structured enough to count from. Wrote prototype/storepro_count.py against the Sigma Healthcare drawing, confirmed named blocks + StorePro_ layer convention give a clean component count. Direction confirmed: build the full app.",
      deliverables: [
        "DWG → libredwg → JSON → block-name + layer parse",
        "component_library.yaml + rules.yaml as Storepro-editable config",
        "Validated component counts against Sigma drawing (counts match expected magnitudes)",
        "Discovered model-space contains both plan + elevation views (different coordinate regions)",
      ],
    },
    {
      key: "phase-1",
      status: "done",
      title: "Phase 1",
      subtitle: "Build the app",
      window: "Complete · 2026-05-28",
      desc:
        "The full v1: high-fidelity UI, real upload + processing + matrix pipeline, Storepro rules from the Gino/Gareth meeting, Microsoft SSO, Excel + PDF export, persistent notes. All on staging. Ready for first real job once Storepro delivers standardised drawings.",
      deliverables: [
        "FastAPI backend with libredwg parse + Claude vision per-bay-type recipe",
        "Cross-source reconciler applying Storepro rules + emitting clarifications",
        "Next.js 6-screen UI ported from the high-fidelity prototype (Storepro.zip)",
        "Microsoft Azure AD SSO + HTTP Basic fallback",
        "Real .xlsx (3-sheet matrix) + .pdf (A4 landscape) export endpoints",
        "Job metadata persisted (client / site / reference); notes with author + timestamp",
      ],
    },
    {
      key: "phase-2",
      status: "in-progress",
      title: "Phase 2",
      subtitle: "Pilot with new drawings",
      window: "Blocked on Storepro delivering standardised files",
      desc:
        "Run the live app against Storepro's NEW standardised drawings (with a fixed component library + consistent naming). Verify accuracy against their manual counts on 3+ real jobs. Tune rules where needed. Close the loop with Gareth + Gino on any remaining ambiguities.",
      deliverables: [
        "First standardised drawing accepted from Storepro",
        "Matrix accuracy benchmarked against manual count on ≥ 3 real jobs",
        "Rules + alias library tuned where the standardised drawings need different handling",
        "Clarifications workflow validated — Gareth/Gino can resolve in-app, not via email",
      ],
    },
    {
      key: "phase-3",
      status: "planned",
      title: "Phase 3",
      subtitle: "Production rollout",
      window: "After Phase 2 pilot is signed off",
      desc:
        "Move from staging-only to production. Retire the shared admin password, enforce Microsoft SSO, set up Railway production env, hand the app to Storepro's daily operators.",
      deliverables: [
        "Production Railway environment provisioned (api + web services)",
        "Microsoft SSO enforced — admin-password toggle removed from UI",
        "Storepro's operator team onboarded (training note + cheat-sheet)",
        "Anthropic key rotated (still using the chat-exposed key on staging)",
        "Operator dashboard for spot-checking job health + downloads",
      ],
    },
    {
      key: "phase-4",
      status: "future",
      title: "Phase 4",
      subtitle: "Module 4 — BOM rollup",
      window: "Next module in the Storepro App program",
      desc:
        "Roll the per-bay matrix up into Storepro's final salesy quote (the 'Sigma ALL IN.xls' shape — verbose product descriptions, profile specs, finish, RAL codes, multi-section grouping). This is the next module in the wider Storepro App program; specced in the build proposal.",
      deliverables: [
        "Per-job catalogue inference engine (S-type → product family)",
        "Verbose description template engine (matches Sigma ALL IN style)",
        "Multi-section grouping (Pallet Rack / LSS / Carton Live / RUT / Mesh)",
        "SKU rollup with finish + profile + alternates",
      ],
    },
  ],
};
