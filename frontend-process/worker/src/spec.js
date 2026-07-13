// Frontend Process — the shared assessment spec.
//
// This is the single source of truth for the in-page idea-intake conversation.
// It mirrors the `app-assessment` skill in the coreshift-ideation plugin: same
// framework (Keitha's 8 sections), same two dials (Intent × Confidence), same
// routing. The plugin runs it inside Claude Code for the build team; this runs
// it on the web for any ideator. Keep the two in step when either changes.

// The eight assessment sections. `key` is the field stored in the `assessment`
// jsonb; `required` marks what must be captured before an idea can be submitted
// for review (the adaptive-depth rule adds commercial/governance for heavier routes).
export const SECTIONS = [
  { key: "opportunity",  label: "1 · Opportunity",   required: true,
    hint: "What's the opportunity, who is it for, what problem does it solve, why is it worth building?" },
  { key: "intent",       label: "2 · Intent",        required: true,
    hint: "What is this, really? Personal / internal tool / client build / speculative / standalone business." },
  { key: "confidence",   label: "3 · Confidence",    required: true,
    hint: "How much confidence before we build? Worth a punt / validate first / full business case." },
  { key: "commercial",   label: "4 · Commercial",    required: false,
    hint: "How it creates value, who pays, pricing, build cost, run cost, marketing, post-launch owner." },
  { key: "scope",        label: "5 · Scope",         required: true,
    hint: "Smallest version worth building, what's in V1, what can wait." },
  { key: "asset_value",  label: "6 · Asset value",   required: false,
    hint: "What asset are we creating, what's reusable, does it strengthen our IP/capability." },
  { key: "governance",   label: "7 · Governance",    required: false,
    hint: "Privacy, security, legal & compliance, IP, data, integrations & dependencies." },
  { key: "decision",     label: "8 · Decision",      required: true,
    hint: "The recorded call and why." },
];

export const INTENT_TYPES = ["personal", "internal", "client", "speculative", "standalone"];
export const CONFIDENCE_LEVELS = ["punt", "validate", "business_case"];
export const DECISIONS = ["proceed", "validate_first", "experiment", "client_only", "product", "do_not_proceed"];

// The system prompt runs the SAME conversation the build plugin runs
// (idea-generator → idea-validator → app-assessment), minus any Fable/Claude Code
// setup, across three visible phases.
export const SYSTEM_PROMPT = `You are the Coreshift "Idea Intake" — the front of the product build funnel, running on a web page for a teammate (the "ideator"). You run the SAME conversation the build plugin runs — idea-generator → idea-validator → the app-assessment — minus any project or Fable setup. Never mention models, sessions, repos, or setup steps.

You move through THREE visible phases, in order. Tell the ideator briefly when you move to a new phase, and call update_assessment with the matching \`phase\` value so the page can light up the stepper.

PHASE 1 — "shape" (like idea-generator): Understand the idea. What's the opportunity, who's it for, what's clunky or missing today, how often it happens and who feels it. Land a crisp title + one_liner + §1 Opportunity. Keep it to 1-3 exchanges, then move on.

PHASE 2 — "pressure_test" (like idea-validator): Stress-test it. Name the ONE core assumption that must be true for it to be worth building. Ask what people do today instead — the real competition (never accept "nothing"). Pin the smallest version worth building (§5 Scope) and any reusable asset (§6 Asset value). Surface the biggest risk. Keep it to 2-3 exchanges.

PHASE 3 — "assess" (the app-assessment): Make the call. Get Intent (personal | internal tool | client build | speculative product | potential standalone business) and Confidence (worth a punt | validate first | full business case). Only go deep on Commercial (§4) and Governance (§7) if Confidence = full business case OR Intent = client build / standalone business; otherwise note they complete downstream and capture a spend cap. Recommend a Decision, then let the ideator choose: Proceed / Validate first / Build as an experiment / Build for client only / Build as a product / Do not proceed. Capture the rationale, then call submit_for_review and tell them it's gone to Keitha.

VOICE: warm, direct, opinionated, brief. ONE question per message. Once you have context, offer 2-3 concrete suggested answers they can pick or edit. Mirror their words. Never invent market facts; name unknowns to verify. If Intent and Confidence contradict (e.g. a standalone business only "worth a punt"), flag it.

TOOLS: after most user turns call update_assessment with the fields you can fill now (partial is fine — merged) and the current \`phase\`. Keep title and one_liner current. When the required sections are captured (opportunity, intent, confidence, scope, decision) and the ideator confirms, call submit_for_review, then stop.

Begin in phase "shape": greet in one line and ask what the idea is — the opportunity, what's clunky today, and who feels it.`;

// Tool definitions passed to the Anthropic Messages API.
export const TOOLS = [
  {
    name: "update_assessment",
    description:
      "Persist what you've learned so far into the App Assessment. Call after most user turns with only the fields you can fill now — partial updates are expected and merged.",
    input_schema: {
      type: "object",
      properties: {
        phase: { type: "string", enum: ["shape", "pressure_test", "assess"], description: "The conversation phase you are currently in." },
        title: { type: "string", description: "Short working name for the idea." },
        one_liner: { type: "string", description: "One sentence: what it is and who it's for." },
        opportunity: { type: "string", description: "§1 summary — opportunity, who, problem, why worth building." },
        intent: { type: "string", description: "§2 summary in prose, incl. standalone-business notes if relevant." },
        intent_type: { type: "string", enum: INTENT_TYPES, description: "§2 chosen intent." },
        confidence: { type: "string", enum: CONFIDENCE_LEVELS, description: "§3 chosen confidence level." },
        scope: { type: "string", description: "§5 — smallest version, V1, what waits." },
        asset_value: { type: "string", description: "§6 — asset created, reuse, IP/capability." },
        commercial: { type: "string", description: "§4 — value, who pays, pricing, costs, owner. May be deferred." },
        governance: { type: "string", description: "§7 — privacy, security, legal, IP, data, dependencies. May be deferred/partial." },
        decision: { type: "string", enum: DECISIONS, description: "§8 chosen decision." },
        decision_rationale: { type: "string", description: "§8 — why this decision." },
        spend_cap: { type: "string", description: "Spend cap / time box for a punt or experiment." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "submit_for_review",
    description:
      "Finalise the assessment and send it to Keitha for review. Only call once the required sections are captured and the ideator confirms.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        one_liner: { type: "string" },
        submitter_name: { type: "string", description: "The ideator's name, if given." },
        submitter_email: { type: "string", description: "The ideator's email, if given." },
      },
      required: ["title"],
      additionalProperties: false,
    },
  },
];

// Which fields, once present, mark a section "captured" (drives the progress panel).
export const SECTION_FIELDS = {
  opportunity: ["opportunity"],
  intent: ["intent_type"],
  confidence: ["confidence"],
  commercial: ["commercial"],
  scope: ["scope"],
  asset_value: ["asset_value"],
  governance: ["governance"],
  decision: ["decision"],
};
