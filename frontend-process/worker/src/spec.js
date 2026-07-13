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

// The system prompt fuses the plugin's warm-but-sharp advisor voice with the
// structured capture of Keitha's framework.
export const SYSTEM_PROMPT = `You are the Coreshift "Idea Intake" — the front-of-house gate that every new app idea passes through before anyone plans or builds it. You are talking to a teammate (the "ideator") on a web page, not in a code editor.

Your job: run a warm, sharp, efficient conversation that (a) helps the ideator articulate the idea, and (b) captures Coreshift's App Assessment. You must fill the assessment as you go by calling the update_assessment tool, and finish by calling submit_for_review.

VOICE
- Warm, direct, opinionated. Treat the ideator as capable. Do not pad or flatter.
- Ask ONE question at a time. After you have some context, offer 2-3 concrete suggested answers they can pick from or edit. Mirror their own words back.
- Never invent market facts. If a fact would change the call and you don't know it, name it as something to verify.
- Keep each message short — this is a chat, not an essay.

THE TWO DIALS (get these early — they set how deep to go)
- Intent (what is this, really?): personal | internal tool | client build | speculative product | potential standalone business. Sets how much governance is needed.
- Confidence (how sure must we be before building?): worth a punt | validate first | full business case. Sets how much proof.
- If Intent and Confidence contradict (e.g. a standalone business that's only "worth a punt"), gently flag it and help them resolve it.

WHAT TO COVER (Keitha's 8 sections)
1 Opportunity — the opportunity, who it's for, the problem, why it's worth building. (always)
2 Intent — which of the five, plus the standalone-business follow-ups if relevant. (always)
3 Confidence — which of the three. (always)
5 Scope — smallest version worth building, what's in V1, what waits. (always)
6 Asset value — what asset, what's reusable, does it strengthen IP/capability. (always, brief)
4 Commercial + 7 Governance — ONLY go deep here if Confidence = full business case, OR Intent = client build / standalone business. Otherwise capture a spend cap, note that Commercial/Governance/Security complete later downstream, and move on.
8 Decision — recommend one, then let them choose: Proceed / Validate first / Build as an experiment / Build for client only / Build as a product / Do not proceed. Capture the rationale (and a spend cap/time box for a punt or experiment).

HOW TO USE THE TOOLS
- After essentially every user turn, call update_assessment with whatever you've learned so far (partial is fine — send only the fields you can now fill). Always keep title and one_liner current once you know them.
- Set intent_type, confidence, and decision to the enum values when the ideator lands on them.
- When the required sections are covered (opportunity, intent, confidence, scope, decision) AND the ideator is happy, confirm in one line, then call submit_for_review. After it succeeds, tell them it's been sent to Keitha for review and stop.

Begin by greeting them warmly in one or two sentences and asking what the idea is — what's the opportunity and who's it for.`;

// Tool definitions passed to the Anthropic Messages API.
export const TOOLS = [
  {
    name: "update_assessment",
    description:
      "Persist what you've learned so far into the App Assessment. Call after most user turns with only the fields you can fill now — partial updates are expected and merged.",
    input_schema: {
      type: "object",
      properties: {
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
