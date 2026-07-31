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
  tagline: "Drop a drawing, get back a Storepro-format BOM. Two real jobs in, reconciling the second.",
  description:
    "Reads Storepro's standardised DXF/DWG layouts directly: scopes to the labelled count box so the embedded component library is never counted, takes the PALLET CAPACITY table as the authoritative bay spine, resolves frames and baseplates from placed blocks in the plan, and derives beams from a per-bay-type elevation recipe. Every assumption it can't settle from the drawing surfaces as a structured clarification rather than a silent guess. On OPPAK-12515 (Glowbal NZ) it reproduced Storepro's confirmed count line-for-line. On Cottonsoft — the second real job, live on staging — bays and the 2700 MW / 1350 MW beam lines match Storepro's count; frames, mesh decks, mesh backs and one beam spec are being reconciled.",

  phase: "Phase 2 · M7 — reconciling the second real job",
  nextMilestone: {
    name: "Cottonsoft BOM reconciled against Shivneel's confirmed count",
    date: "Ground truth in hand — 2026-07-31",
  },

  // ── Milestones ────────────────────────────────────────────────
  // Reconstructed from the board + repo history on 2026-07-31 (/adopt).
  // status: "done" | "current" | "next"
  milestones: [
    { id: "M1", name: "Prove the parse", status: "done",
      doneWhen: "A real Storepro DWG parses to clean component counts (Sigma, prototype/storepro_count.py)" },
    { id: "M2", name: "v1 app live on staging", status: "done",
      doneWhen: "A real drawing uploaded on staging returns a matrix plus xlsx + PDF downloads (Suntory, 144 s, 350 bays)" },
    { id: "M3", name: "Real engine wired + SP_ library mapped", status: "done",
      doneWhen: "The clarifications screen shows output from the live engine, not the prototype stub (PRs #1 + #2)" },
    { id: "M4", name: "Oracle parity on OPPAK-12515", status: "done",
      doneWhen: "The engine reproduces Storepro's confirmed count line-for-line and the job is locked as a CI regression oracle" },
    { id: "M5", name: "Storepro's answers encoded + engine generalised", status: "done",
      doneWhen: "Shivneel's 7 rule answers are in the clarifications and OPPAK still passes with every hardcode derived (PR #5)" },
    { id: "M6", name: "Clean-slate DXF engine on staging", status: "done",
      doneWhen: "A real drawing runs end-to-end through the staging UI on the new engine (Cottonsoft job 31ee6719, 2026-07-30)" },
    { id: "M7", name: "Cottonsoft reconciled against Storepro's count", status: "current",
      doneWhen: "Every line of the Cottonsoft BOM either matches Shivneel's confirmed count or is a written question sent to Storepro with the reason the drawing can't settle it" },
    { id: "M8", name: "Production rollout", status: "next",
      doneWhen: "A Storepro operator completes a job on the production environment with SSO enforced" },
    { id: "M9", name: "Module 4 — BOM rollup", status: "next",
      doneWhen: "A per-bay matrix rolls up into a Storepro-shaped quote (Sigma ALL IN.xls form)" },
  ],

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
      subtitle: "Pilot with the standardised drawings",
      window: "In progress · M7 — two real jobs in",
      desc:
        "Run the live app against Storepro's standardised drawings and benchmark every line against their confirmed counts. OPPAK-12515 reproduces line-for-line and is locked as a CI oracle. Cottonsoft is the second job: bays and two of three beam lines match, and frames / mesh decks / mesh backs / one beam spec are being reconciled against Shivneel's count. A third drawing set is promised.",
      deliverables: [
        "Standardised drawings parsed via the count box, with the embedded library excluded",
        "OPPAK-12515 reproduced line-for-line and locked as a regression oracle",
        "Cottonsoft reconciled against Storepro's confirmed count (M7 — in flight)",
        "Clean-slate dxf_count engine live on staging with client-facing xlsx + PDF",
        "Clarifications workflow validated — Gareth/Gino resolve in-app, not via email",
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
