// Frontend Process — publish / apply-updates core.
//
// Applies a batch of status updates to pipeline ideas. The updates come from two
// places and this is the single shared write path for both:
//   • Keitha's Project Radar (via POST /api/publish)
//   • the Fireflies stand-up ingestion (via /api/ingest + the scheduled cron)
//
// Radar tags → pipeline actions:
//   move        → change the card's stage (e.g. → build / harden / live)
//   waiting-on  → dev_status "blocked" + a reason (who/what it's waiting on)
//   park        → move to Pending Validation (a visible holding lane) + a reason
//
// Pure logic over injected data-access deps ({ listIdeas, updateIdea }) so it's
// unit-testable with no network. NOTE: publish moves are trusted status updates
// (Keitha/the stand-up recording reality) and are deliberately NOT run through the
// ideation→build requirement gate — that gate is for human decisions at Review.

import { STAGES } from "./consts.js";

// Normalise a title for fuzzy matching ("Growth Partners — 2026 Rebuild" → "growth partners 2026 rebuild").
export function normTitle(s) {
  return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Resolve which idea an update refers to. Prefers an exact id; else exact-normalised
// title; else a single unambiguous containment match. Returns the idea or null
// (null → "unmatched", surfaced for review rather than guessed).
export function matchIdea(ideas, match) {
  if (!match) return null;
  const byId = ideas.find((i) => i.id === match);
  if (byId) return byId;
  const q = normTitle(match);
  if (!q) return null;
  const exact = ideas.find((i) => normTitle(i.title) === q);
  if (exact) return exact;
  const contained = ideas.filter((i) => {
    const t = normTitle(i.title);
    if (!t) return false;
    // Word-boundary aware: the shorter title must appear as a whole-word run in the
    // longer one. Avoids "tap" matching "tapestry" while keeping
    // "growth partners" matching "growth partners 2026 rebuild".
    const [short, long] = t.length <= q.length ? [t, q] : [q, t];
    return (" " + long + " ").includes(" " + short + " ");
  });
  return contained.length === 1 ? contained[0] : null; // 0 or >1 → unmatched
}

// Map one update item → a DB patch. Returns { patch } or { error }.
export function itemToPatch(item) {
  const action = String((item && item.action) || "").toLowerCase().replace(/[-\s]+/g, "_");
  const note = item && item.note ? String(item.note).slice(0, 500) : null;
  if (action === "move") {
    const target = item && item.target_stage;
    if (!target || !STAGES.includes(target)) return { error: `invalid or missing target_stage "${target}"` };
    return { patch: { stage: target } };
  }
  if (action === "waiting_on") {
    return { patch: { dev_status: "blocked", dev_status_reason: note || "Waiting on a dependency" } };
  }
  if (action === "park" || action === "park_for_later") {
    return { patch: { stage: "pending_validation", dev_status_reason: note } };
  }
  return { error: `unknown action "${item && item.action}"` };
}

// True if the patch wouldn't change the idea (idempotency — a re-run is a no-op).
function isNoop(idea, patch) {
  return Object.keys(patch).every((k) => (patch[k] || null) === ((idea && idea[k]) || null));
}

// Apply a batch of items. deps = { listIdeas(): Promise<idea[]>, updateIdea(id, patch): Promise }.
// An item may name its target via `id`, `match`, `project`, or `title`.
// Returns { results: [{status, id?, title?, error?}], summary: {status: count} }.
export async function applyUpdates(deps, items) {
  const list = Array.isArray(items) ? items : [];
  const ideas = await deps.listIdeas();
  const results = [];
  for (const item of list) {
    const key = item && (item.id || item.match || item.project || item.title);
    const idea = matchIdea(ideas, key);
    if (!idea) { results.push({ item, status: "unmatched" }); continue; }
    const { patch, error } = itemToPatch(item);
    if (error) { results.push({ item, id: idea.id, title: idea.title, status: "error", error }); continue; }
    // A move INTO Live (from a non-live stage) means shipped → dev_status "done".
    if (patch.stage === "live" && idea.stage !== "live") { patch.dev_status = "done"; patch.dev_status_reason = null; }
    if (isNoop(idea, patch)) { results.push({ item, id: idea.id, title: idea.title, status: "skipped" }); continue; }
    try {
      await deps.updateIdea(idea.id, patch);
      results.push({ item, id: idea.id, title: idea.title, status: "applied", patch });
    } catch (e) {
      results.push({ item, id: idea.id, title: idea.title, status: "error", error: String((e && e.message) || e) });
    }
  }
  const summary = results.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
  return { results, summary };
}
