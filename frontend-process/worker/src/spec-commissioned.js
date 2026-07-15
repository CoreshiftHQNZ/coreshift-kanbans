// Frontend Process — the COMMISSIONED-build assessment spec.
//
// A separate intake mode for Growth Partners (and other) commissioned builds. These
// are PAID and already decided — so this skips the internal intake's ideation
// (idea-generator) and validation (idea-validator) phases and the go/no-go decision.
// Instead it captures the brief and produces a build plan / roadmap for the build
// team, then drops the card straight into Build (already approved).
//
// The internal intake (spec.js) is untouched; the Worker picks this spec when the
// intake runs in mode "commissioned". Keep field keys in sync with the client config
// (config.js `commissioned`) and assessment.html's commissioned section list.

// Assessment sections for a commissioned brief. `key` is the assessment jsonb field.
export const SECTIONS = [
  { key: "client",          label: "1 · Client",                   required: true,
    hint: "Who commissioned this and who the end users are." },
  { key: "primary_contact", label: "2 · Primary contact",          required: false,
    hint: "The client's main point of contact." },
  { key: "commission",      label: "3 · Commission",               required: true,
    hint: "What's been commissioned, and the outcome they're paying for." },
  { key: "deliverables",    label: "4 · Deliverables & acceptance", required: true,
    hint: "What 'done' looks like — the concrete deliverables and acceptance criteria." },
  { key: "timeline",        label: "5 · Timeline",                 required: true,
    hint: "Deadline and key milestones." },
  { key: "commercial",      label: "6 · Commercial",               required: false,
    hint: "Budget / price and payment terms." },
  { key: "scope",           label: "7 · Scope",                    required: true,
    hint: "The MVP/V1 boundary — what ships first, what can wait." },
  { key: "governance",      label: "8 · Governance",               required: true,
    hint: "Privacy, security, IP ownership, data — matters more on a client build." },
  { key: "asset_value",     label: "9 · Asset value",              required: false,
    hint: "Any reusable asset this build creates for Coreshift." },
  { key: "design_refs",     label: "10 · Design references",       required: false,
    hint: "Brand, assets, and reference links." },
  { key: "build_plan",      label: "11 · Build plan",              required: true,
    hint: "The synthesised roadmap for the build team — phases and milestones." },
];

// Phases (the stepper). Commissioned = brief → scope → plan (no ideation/validation).
export const PHASES = [
  { key: "brief", label: "Brief",      sub: "the commission" },
  { key: "scope", label: "Scope",      sub: "the build boundary" },
  { key: "plan",  label: "Build plan", sub: "the roadmap" },
];

// Opening line for a fresh commissioned intake (returned WITHOUT creating a row).
export const GREETING = "Hi — this is the Coreshift commissioned-build intake. Let's scope the build. Who's the client, and what have they commissioned?";

// Prose assessment keys the Worker persists for this mode (merged into PROSE_FIELDS).
export const COMMISSIONED_PROSE_FIELDS = [
  "client", "primary_contact", "commission", "deliverables", "timeline",
  "commercial", "scope", "governance", "asset_value", "design_refs", "build_plan",
];

export const SYSTEM_PROMPT = `You are the Coreshift "Commissioned Build Intake" — the front door for PAID, already-commissioned builds (e.g. Growth Partners client work), running on a web page for a Coreshift teammate.

This is NOT the internal idea funnel. The build is already decided and paid for, so DO NOT run ideation, DO NOT pressure-test whether it's worth building, and DO NOT ask for a go/no-go decision. Your job is to capture the brief crisply and produce a clear BUILD PLAN / ROADMAP the build team can pick up. Never mention models, sessions, repos, or setup steps.

You move through THREE visible phases, in order. Tell the teammate briefly when you move to a new phase, and call update_assessment with the matching \`phase\` value so the page can light up the stepper.

PHASE 1 — "brief": Capture the commission. Who is the client and who are the end users (§1 Client). What exactly has been commissioned and the outcome they're paying for (§2 Commission). What "done" looks like — concrete deliverables and acceptance criteria (§3 Deliverables). The deadline and key milestones (§4 Timeline). Budget/price and payment terms if known (§5 Commercial). Any brand, design assets or reference links (§8 Design references), and the primary contact. Keep it moving — a couple of exchanges per point at most.

PHASE 2 — "scope": Define the build boundary. The smallest shippable version and what waits for later (§6 Scope). Governance for a client build — privacy, security, IP/ownership of the deliverable, and data handling (§7 Governance). Note any reusable asset this creates for Coreshift (§6/asset value), lightly.

PHASE 3 — "plan": Synthesise everything into a BUILD PLAN (§9) — a short roadmap: the phases/milestones to ship the MVP then V1, the key risks/dependencies, and what the build team should start on first. Read it back, let the teammate adjust, then call submit_for_review and tell them it's been logged as a commissioned build and has landed in Build on the board (it's already approved — no reviewer gate).

VOICE: warm, direct, brief, organised. ONE question per message. Engage with what they ACTUALLY said — reflect it back before asking the next thing. When you offer example answers, WRITE THEM OUT in your message (there is no separate menu). Never invent client facts; name unknowns to confirm. Never stall — always move forward.

TOOLS: after most user turns call update_assessment with the fields you can fill now (partial is fine — merged) and the current \`phase\`. Keep title and one_liner current (title = a short build name, one_liner = what it is and for whom). When the required sections are captured (client, commission, deliverables, timeline, scope, governance, build_plan) and the teammate confirms the plan, call submit_for_review, then stop.

Begin in phase "brief": greet in one line and ask who the client is and what they've commissioned.`;

export const TOOLS = [
  {
    name: "update_assessment",
    description:
      "Persist what you've learned into the commissioned-build brief. Call after most user turns with only the fields you can fill now — partial updates are expected and merged.",
    input_schema: {
      type: "object",
      properties: {
        phase: { type: "string", enum: ["brief", "scope", "plan"], description: "The phase you are currently in." },
        title: { type: "string", description: "Short build name." },
        one_liner: { type: "string", description: "One sentence: what it is and who it's for." },
        client: { type: "string", description: "§1 — the client who commissioned it + end users." },
        primary_contact: { type: "string", description: "The client's primary contact." },
        commission: { type: "string", description: "§2 — what's been commissioned and the outcome paid for." },
        deliverables: { type: "string", description: "§3 — deliverables + acceptance criteria ('done')." },
        timeline: { type: "string", description: "§4 — deadline and key milestones." },
        commercial: { type: "string", description: "§5 — budget/price and payment terms." },
        scope: { type: "string", description: "§6 — MVP/V1 boundary, what ships first, what waits." },
        governance: { type: "string", description: "§7 — privacy, security, IP/ownership, data." },
        asset_value: { type: "string", description: "Reusable asset this creates for Coreshift (light)." },
        design_refs: { type: "string", description: "§8 — brand, assets, reference links." },
        build_plan: { type: "string", description: "§9 — the synthesised build plan / roadmap for the build team." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "submit_for_review",
    description:
      "Finalise the commissioned build and log it. Only call once the required sections are captured and the teammate confirms the build plan. The card lands directly in Build (already approved).",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        one_liner: { type: "string" },
        submitter_name: { type: "string", description: "The teammate's name, if given." },
        submitter_email: { type: "string", description: "The teammate's email, if given." },
      },
      required: ["title"],
      additionalProperties: false,
    },
  },
];
