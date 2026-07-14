/* Frontend Process — shared client config.
 *
 * DEMO vs LIVE:
 *   - Leave workerUrl "" and the board + intake run entirely on the sample data
 *     below (no backend) — good for demos and for viewing before the Worker is up.
 *   - Set workerUrl to the deployed idea-intake Worker (e.g.
 *     "https://idea-intake.<your-subdomain>.workers.dev") and both pages go live.
 */
window.FP = {
  workerUrl: "", // live Worker (preview only; keep "" in commits)

  // The lifecycle stages (board columns), in order. `role` is the owning role.
  // `view` splits them: "pipeline" (new-idea intake: capture→assess→decide) and
  // "wip" (approved work: build→live). The governance gate is the boundary
  // between the two — nothing enters Build until PIA/governance clears at Review.
  stages: [
    { key: "inbox",      label: "Inbox",                 role: "—",             gate: "Captured — not yet assessed",                  view: "pipeline" },
    { key: "assessment", label: "Assessment",            role: "Product owner", gate: "Assessment in progress",                       view: "pipeline" },
    { key: "review",             label: "Review",             role: "Reviewer",      gate: "Decide → Build, Pending Validation, or Rejected", view: "pipeline" },
    { key: "pending_validation", label: "Pending Validation", role: "—",             gate: "Validate first — awaiting a test / discussion",   view: "pipeline", divider: true },
    { key: "rejected",           label: "Rejected",           role: "—",             gate: "Not proceeding — kept as a record",               view: "pipeline" },
    { key: "build",      label: "Build",                 role: "Build lead",    gate: "MVP built — the plugin runs here",             view: "wip" },
    { key: "harden",     label: "Harden & Secure",       role: "Security",      gate: "Security signed off, no high-sev",             view: "wip", softdivider: true },
    { key: "business",   label: "Business & Governance", role: "Commercial",    gate: "Business case + governance signed",            view: "wip" },
    { key: "launch",     label: "Launch Readiness",      role: "Launch",        gate: "Launch / handover ready",                      view: "wip" },
    { key: "live",       label: "Live",                  role: "—",             gate: "Shipped / in production",                      view: "wip" },
  ],
  // Approval outcomes now have their own Pipeline columns (Pending Validation /
  // Rejected), so there's no separate off-board section.
  offBoard: [],
  // The two board views (tab toggle). Split per the 2026-07-13 stand-up.
  views: [
    { key: "pipeline", label: "Idea Pipeline",     sub: "capture · assess · decide" },
    { key: "wip",      label: "Work in Progress",  sub: "build → live" },
  ],

  // The intake conversation's three visible phases (the plugin, on the web).
  phases: [
    { key: "shape",         label: "Shape",          sub: "the idea",         note: "idea-generator" },
    { key: "pressure_test", label: "Pressure-test",  sub: "the assumptions",  note: "idea-validator" },
    { key: "assess",        label: "Assess & decide", sub: "the call",        note: "app-assessment" },
  ],

  // The eight assessment sections, with placeholder hints for the empty state.
  sections: [
    { field: "opportunity", label: "Opportunity",  phase: "shape",         hint: "The problem, and who feels it." },
    { field: "intent_type", label: "Intent",       phase: "assess",        hint: "Internal tool or client-facing product." },
    { field: "confidence",  label: "Confidence",   phase: "assess",        hint: "How sure we need to be before building." },
    { field: "commercial",  label: "Commercial",   phase: "assess",        hint: "Only if it's client-facing / a product." },
    { field: "scope",       label: "Scope",        phase: "pressure_test", hint: "The smallest version worth building." },
    { field: "asset_value", label: "Asset value",  phase: "pressure_test", hint: "The reusable asset this could become." },
    { field: "governance",  label: "Governance",   phase: "assess",        hint: "Privacy, security, IP, data." },
    { field: "decision",    label: "Decision",     phase: "assess",        hint: "The recommended next step." },
  ],

  labels: {
    intent:     { personal: "Personal", internal: "Internal tool", client: "Client build", speculative: "Speculative", standalone: "Standalone business", product: "Product" },
    confidence: { punt: "Worth a punt", validate: "Validate first", business_case: "Full business case" },
    decision:   { proceed: "Proceed", validate_first: "Validate first", experiment: "Experiment", client_only: "Client only", product: "Build as product", do_not_proceed: "Do not proceed" },
    status:     { draft: "Draft", in_review: "In review", validated: "Validated ✓", declined: "Declined" },
    dev_status: { in_progress: "In Progress", on_hold: "On Hold", blocked: "Blocked", at_risk: "At Risk", done: "Done" },
  },

  // Product Owners assignable once a card is approved into Build+ (drawer dropdown).
  productOwners: ["Ricky", "Abe"],
  // Developer-status → RAG colour (auto-derived; not set by hand).
  devRag: { in_progress: "green", done: "green", at_risk: "amber", on_hold: "amber", blocked: "red" },

  // Sample cards for demo mode (illustrative; clearly not live data).
  demoIdeas: [
    { id: "d1", title: "Client Portal Revamp", one_liner: "One place for clients to see status, invoices, files.", stage: "assessment", status: "draft",     intent: "internal",   confidence: null,          decision: null,        updated_at: "just now" },
    { id: "d2", title: "Tap",                  one_liner: "ICP-driven lead generation — cold leads on tap.",     stage: "review",     status: "in_review", intent: "internal",   confidence: "punt",        decision: null,        updated_at: "2h ago" },
    { id: "d3", title: "HeyGem",               one_liner: "Remote admin support for Kiwi tradies.",              stage: "build",      status: "validated", intent: "client",     confidence: "validate",      decision: "client_only", updated_at: "3d ago", repo_url: "https://github.com/CoreshiftHQNZ/heygem", staging_url: "https://staging.heygem.co.nz", production_url: "https://heygem.co.nz", kanban_url: "../heygem/", dev_status: "in_progress", product_owner: "Ricky" },
    { id: "d4", title: "Lead Engine",          one_liner: "Find bad sites → auto-build the replacement.",        stage: "harden",     status: "validated", intent: "internal",   confidence: "validate",      decision: "product",   updated_at: "5d ago", repo_url: "https://github.com/CoreshiftHQNZ/coreshift-live-edit", kanban_url: "../lead-engine/", dev_status: "at_risk", dev_status_reason: "Waiting on vendor API access before the replacement build can proceed.", product_owner: "Abe" },
    { id: "d5", title: "Merlin",               one_liner: "AI implementation wizard — outcome-led pathways.",     stage: "business",   status: "validated", intent: "standalone", confidence: "business_case", decision: "product",   updated_at: "1w ago", repo_url: "https://github.com/CoreshiftHQNZ/merlin", kanban_url: "../merlin/", dev_status: "blocked", dev_status_reason: "Blocked on design-system sign-off.", product_owner: "Ricky" },
    { id: "d6", title: "Live Edit",            one_liner: "Self-serve $100/mo sites clients edit in place.",     stage: "live",       status: "validated", intent: "product",    confidence: "validate",      decision: "product",   updated_at: "yesterday", repo_url: "https://github.com/CoreshiftHQNZ/coreshift-live-edit", staging_url: "https://staging.coreshift.page", production_url: "https://app.coreshift.page", kanban_url: "../live-edit/", dev_status: "done", product_owner: "Abe" },
    { id: "d7", title: "Crypto tipping jar",   one_liner: "In-page crypto tips for creators.",                   stage: "rejected",   status: "declined",  intent: "speculative", confidence: "validate",     decision: "do_not_proceed", updated_at: "2w ago" },
    { id: "d8", title: "Listicle Writer v2",   one_liner: "Next-gen sponsored listicle generator.",              stage: "pending_validation", status: "in_review", intent: "internal",   confidence: "validate",      decision: "validate_first", updated_at: "3w ago" },
  ],

  // Scripted intake for demo mode — the three phases, "onboarding email drafter".
  demoGreeting: "Hi — I'm the Idea Intake. Give me the short version: what's the opportunity? What's clunky or missing today, and who feels it?",
  demoScript: [
    // ── Phase 1: Shape ────────────────────────────────────────────────
    {
      chips: ["Client onboarding emails — PMs hand-write welcome, doc-request and kickoff messages for every new client. Slow and inconsistent.", "Something else"],
      user: "Client onboarding emails — PMs hand-write welcome, doc-request and kickoff messages for every new client. Slow and inconsistent.",
      assistant: "Got it — so the pain is PMs re-writing near-identical onboarding emails for every new client, and the tone drifting. Roughly how often does that happen, and who feels it most?",
      fills: { phase: "shape", title: "Onboarding Email Drafter", one_liner: "Auto-drafts client onboarding emails for the delivery team.", opportunity: "PMs hand-write welcome / doc-request / kickoff emails for every new client — slow, repetitive, inconsistent tone." },
    },
    {
      chips: ["Every new client — 5-10 a week, all on the PMs", "A few a month"],
      user: "Every new client — 5 to 10 a week, and it all lands on the PMs.",
      assistant: "So it's frequent and it's a PM time-sink. That's a real, weekly pain. Let me pressure-test it before we commit anything.",
      fills: { phase: "shape", opportunity: "PMs hand-write welcome / doc-request / kickoff emails for 5-10 new clients a week — a weekly time-sink, inconsistent tone." },
    },
    // ── Phase 2: Pressure-test ────────────────────────────────────────
    {
      chips: ["That a good-enough draft saves real time vs. writing fresh", "That PMs will actually use it"],
      user: "That a good-enough first draft actually saves time versus writing from scratch.",
      assistant: "Right — the core assumption is that a generated draft is close enough that editing it beats writing fresh. What do PMs do today instead — templates, copy-paste from the last client, nothing?",
      fills: { phase: "pressure_test", scope: "Smallest test: pick a client + template → a good-enough editable draft that beats writing from scratch." },
    },
    {
      chips: ["Copy-paste the last client's email and find-replace", "A shared doc of rough templates"],
      user: "Mostly copy-paste the last client's email and find-replace the details.",
      assistant: "So the real competition is copy-paste-and-tweak — which is fast but error-prone (wrong client name slips through). A draft that's client-aware would beat that. Anything reusable here for other tools?",
      fills: { phase: "pressure_test", asset_value: "A reusable, client-aware email-drafting component usable across internal tools." },
    },
    // ── Phase 3: Assess & decide ──────────────────────────────────────
    {
      chips: ["Internal tool for our team", "A client-facing product", "Could be both later"],
      user: "Internal tool for our team.",
      assistant: "Internal tool — so governance stays light. How much confidence do we need before building: worth a quick punt, validate first, or a full business case?",
      fills: { phase: "assess", intent_type: "internal", intent: "Internal delivery-team tool.", governance: "Light — internal, no new sensitive data beyond existing CRM. Security/privacy completed downstream in Harden & Secure." },
    },
    {
      chips: ["Worth a punt — cheap and we feel it weekly", "Validate first"],
      user: "Worth a punt — it's cheap and we feel the pain weekly.",
      assistant: "Agreed. My recommended call: **Build as an experiment**, capped at one build, not a commitment to ship. Commercial's not needed for an internal punt. Happy to record that and send it to Keitha?",
      fills: { phase: "assess", confidence: "punt", commercial: "Deferred — internal tool. Capped at one build." },
    },
    {
      chips: ["Yes — record it and send to Keitha", "Let me change something"],
      user: "Yes — record it and send to Keitha.",
      assistant: "Done. Recorded as **Build as an experiment**, capped at one build, and sent to Keitha for review. You'll see it land in Review on the board. Nice one. 👋",
      fills: { phase: "assess", decision: "experiment", decision_rationale: "Acute weekly pain, cheap to test, reusable component. Beats copy-paste-and-tweak. Not a commitment to ship.", spend_cap: "One build" },
      submit: true,
    },
  ],
};
