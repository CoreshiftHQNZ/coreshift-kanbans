// Frontend Process — shared enums/constants.
// Single source of the CHECK-constrained column values (mirrors schema.sql) so the
// Worker, the publish core, and the Fireflies ingestion all agree on valid values.

export const ENUM_COLUMNS = { intent_type: "intent", confidence: "confidence", decision: "decision" };
export const ENUM_VALUES = {
  intent: ["personal", "internal", "client", "speculative", "standalone", "product"],
  confidence: ["punt", "validate", "business_case"],
  decision: ["proceed", "validate_first", "experiment", "client_only", "product", "do_not_proceed"],
};
export const STAGES = ["inbox", "assessment", "review", "pending_validation", "rejected", "build", "harden", "business", "launch", "live", "parked", "declined"];
// Stages a stand-up/Radar "move" may target. Excludes the two legacy stages
// (parked/declined) that are reached only via a reviewer decision, not a move — so
// the automated routing prompt and the manual Cowork prompt offer the same vocabulary.
export const MOVE_STAGES = STAGES.filter((s) => s !== "parked" && s !== "declined");
export const STATUSES = ["draft", "in_review", "validated", "declined"];
export const DEV_STATUSES = ["in_progress", "on_hold", "blocked", "at_risk", "done"];
export const WIP_STAGES = ["build", "harden", "business", "launch", "live"];
