/* Frontend Process — shared client config.
 *
 * DEMO vs LIVE:
 *   - Leave workerUrl "" and the board + intake run entirely on the sample data
 *     below (no backend) — good for demos and for viewing before the Worker is up.
 *   - Set workerUrl to the deployed idea-intake Worker (e.g.
 *     "https://idea-intake.<your-subdomain>.workers.dev") and both pages go live:
 *     the board reads real ideas and the intake becomes a real Claude conversation.
 */
window.FP = {
  workerUrl: "", // ← set after deploying the Worker to go live

  // The five lifecycle stages (columns). `role` is the owning role, not a person.
  stages: [
    { key: "ideation", label: "Ideation",                    role: "Product owner", gate: "Decision recorded + route set" },
    { key: "product",  label: "Product",                     role: "Build lead",    gate: "MVP built — the plugin runs here" },
    { key: "abify",    label: "Abify — hardening & security", role: "Security",      gate: "Security signed off, no high-sev", divider: true },
    { key: "business", label: "Business / Governance",        role: "Commercial",    gate: "Business case + governance signed" },
    { key: "final",    label: "Final Readiness",              role: "Launch",        gate: "Launch / handover readiness" },
  ],

  // The eight assessment sections shown in the live-filling panel.
  sections: [
    { key: "opportunity", field: "opportunity", label: "1 · Opportunity" },
    { key: "intent",      field: "intent_type", label: "2 · Intent" },
    { key: "confidence",  field: "confidence",  label: "3 · Confidence" },
    { key: "commercial",  field: "commercial",  label: "4 · Commercial" },
    { key: "scope",       field: "scope",       label: "5 · Scope" },
    { key: "asset_value", field: "asset_value", label: "6 · Asset value" },
    { key: "governance",  field: "governance",  label: "7 · Governance" },
    { key: "decision",    field: "decision",    label: "8 · Decision" },
  ],

  // Human-readable labels for the enum values.
  labels: {
    intent:     { personal: "Personal", internal: "Internal tool", client: "Client build", speculative: "Speculative", standalone: "Standalone business" },
    confidence: { punt: "Worth a punt", validate: "Validate first", business_case: "Full business case" },
    decision:   { proceed: "Proceed", validate_first: "Validate first", experiment: "Experiment", client_only: "Client only", product: "Build as product", do_not_proceed: "Do not proceed" },
    status:     { draft: "Draft", in_review: "In review", validated: "Validated ✓", declined: "Declined" },
  },

  // Sample cards for demo mode (illustrative; clearly not live data).
  demoIdeas: [
    { id: "d1", title: "Live Edit",   one_liner: "Self-serve $100/mo sites clients edit in place.", stage: "product",  status: "validated", intent: "product",  confidence: "validate",      decision: "product",        updated_at: "yesterday" },
    { id: "d2", title: "Tap",         one_liner: "ICP-driven lead generation — cold leads on tap.",  stage: "ideation", status: "in_review", intent: "internal", confidence: "punt",          decision: null,             updated_at: "2h ago" },
    { id: "d3", title: "Lead Engine", one_liner: "Find bad sites → auto-build the replacement.",     stage: "abify",    status: "validated", intent: "internal", confidence: "validate",      decision: "product",        updated_at: "3d ago" },
    { id: "d4", title: "Merlin",      one_liner: "AI implementation wizard — outcome-led pathways.",  stage: "business", status: "validated", intent: "standalone", confidence: "business_case", decision: "product",      updated_at: "1w ago" },
  ],

  // Scripted intake conversation for demo mode: "onboarding email drafter".
  // Each step = one user turn + the assistant's reply + the fields it captures.
  demoGreeting: "Hi — I'm the Idea Intake. I'll help you shape your idea and, as we talk, I'll fill in Coreshift's assessment on the right. To start: what's the idea, and who's it for?",
  demoScript: [
    {
      chips: ["A tool that auto-drafts our client onboarding emails", "Something else"],
      user: "A tool that auto-drafts our client onboarding emails.",
      assistant: "Nice — onboarding email drafting. So the opportunity is cutting the manual time the team spends writing near-identical onboarding emails for every new client. Is this for the internal team, or something clients would use themselves?",
      fills: { title: "Onboarding Email Drafter", one_liner: "Auto-drafts client onboarding emails for the Coreshift team.", opportunity: "Cut the manual time spent writing near-identical onboarding emails for every new client; keep tone consistent." },
    },
    {
      chips: ["Internal tool for our team", "A client-facing product", "Could be both"],
      user: "Internal tool for our team.",
      assistant: "Got it — an internal tool. That keeps governance light. Next dial: how much confidence do we need before building it? Is this worth a quick punt, worth validating first, or does it need a full business case?",
      fills: { intent_type: "internal", intent: "Internal business tool — used by the Coreshift delivery team." },
    },
    {
      chips: ["Worth a punt — it's cheap", "Validate first", "Full business case"],
      user: "Worth a punt — it's cheap and we feel the pain weekly.",
      assistant: "Agreed — worth a punt. Let's pin the smallest version worth building. What's the one flow that would prove it? E.g. pick a client + a template → get a ready-to-send draft.",
      fills: { confidence: "punt" },
    },
    {
      chips: ["Pick client + template → editable draft", "Full multi-step sequence", "Just a prompt library"],
      user: "Pick a client and a template, get an editable draft I can tweak and send.",
      assistant: "That's a tight V1. I'll note richer sequences and CRM sync as later. Quick asset-value check: is there anything reusable here for other Coreshift tools?",
      fills: { scope: "V1: pick a client + template → generate an editable onboarding draft to tweak and send. Later: multi-step sequences, CRM sync, tone presets." },
    },
    {
      chips: ["A reusable email-drafting component", "Not really, one-off", "Our onboarding templates as data"],
      user: "The email-drafting component could be reused across our tools.",
      assistant: "Good — reusable drafting component is real asset value. Governance and cost are light for an internal punt, so we complete those downstream. My recommended call: Build as an experiment, capped at one Fable 5 build. Happy to record that?",
      fills: { asset_value: "A reusable email-drafting component usable across Coreshift internal tools.", governance: "Light — internal tool, no sensitive customer data beyond existing CRM. Security/privacy completed downstream in Abify.", commercial: "Deferred — internal tool. Spend capped at one build." },
    },
    {
      chips: ["Yes — record it and send to Keitha", "Let me change something"],
      user: "Yes — record it and send to Keitha.",
      assistant: "Done. Recorded as **Build as an experiment**, capped at one build, and sent to Keitha for review. You'll see it appear on the pipeline board in Ideation. Nice one. 👋",
      fills: { decision: "experiment", decision_rationale: "Acute weekly pain, cheap to test, reusable component. Not a commitment to ship.", spend_cap: "One Fable 5 build" },
      submit: true,
    },
  ],
};
