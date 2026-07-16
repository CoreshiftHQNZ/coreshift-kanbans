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

import { STAGES, DEV_STATUSES, ENUM_VALUES } from "./consts.js";

// Normalise a title for fuzzy matching ("Growth Partners — 2026 Rebuild" → "growth partners 2026 rebuild").
export function normTitle(s) {
  return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Every card whose normalised title word-overlaps `match` by whole-word containment
// (either direction). The shared building block for fuzzy matching AND the create-time
// duplicate guard. Empty array when `match` is blank.
export function containmentMatches(ideas, match) {
  const q = normTitle(match);
  if (!q) return [];
  return (ideas || []).filter((i) => {
    const t = normTitle(i.title);
    if (!t) return false;
    // Word-boundary aware: the shorter title must appear as a whole-word run in the
    // longer one. Avoids "tap" matching "tapestry" while keeping
    // "growth partners" matching "growth partners 2026 rebuild".
    const [short, long] = t.length <= q.length ? [t, q] : [q, t];
    return (" " + long + " ").includes(" " + short + " ");
  });
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
  const contained = containmentMatches(ideas, match);
  return contained.length === 1 ? contained[0] : null; // 0 or >1 → unmatched
}

// Strict match: id or exact-normalised title ONLY (no fuzzy containment). Used for
// add/upsert so a NEW project name that merely contains an existing title (e.g. "Growth
// Partners" vs "Growth Partners — 2026 Rebuild") doesn't hijack + rename that card —
// it creates a distinct one instead. Status tags (move/waiting-on/park) still match fuzzily.
export function matchIdeaExact(ideas, match) {
  if (!match) return null;
  const byId = ideas.find((i) => i.id === match);
  if (byId) return byId;
  const q = normTitle(match);
  if (!q) return null;
  return ideas.find((i) => normTitle(i.title) === q) || null;
}

// Map one update item → a DB patch. Returns { patch }, { patch, create } (add/upsert),
// or { error }. `create: true` lets applyUpdates make a new card when nothing matches.
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
  // add / upsert: set explicit fields on a matched card, or CREATE it when unmatched
  // (a tracked project that skipped the assessment funnel). All fields optional except
  // that a create needs a title (enforced in applyUpdates).
  if (action === "add" || action === "upsert" || action === "set" || action === "new") {
    const cap = (v, n) => (v == null ? undefined : String(v).slice(0, n));
    const patch = {};
    if (item.title != null) patch.title = cap(item.title, 200);
    if (item.one_liner != null) patch.one_liner = cap(item.one_liner, 500);
    if (item.stage != null) { if (!STAGES.includes(item.stage)) return { error: `invalid stage "${item.stage}"` }; patch.stage = item.stage; }
    if (item.dev_status != null) { if (!DEV_STATUSES.includes(item.dev_status)) return { error: `invalid dev_status "${item.dev_status}"` }; patch.dev_status = item.dev_status; }
    if (item.dev_status_reason != null) patch.dev_status_reason = cap(item.dev_status_reason, 500);
    if (item.product_owner != null) patch.product_owner = cap(item.product_owner, 120);
    if (item.intent != null) { if (!ENUM_VALUES.intent.includes(item.intent)) return { error: `invalid intent "${item.intent}"` }; patch.intent = item.intent; }
    for (const u of ["repo_url", "kanban_url", "staging_url", "production_url"]) {
      if (item[u] != null) patch[u] = cap(item[u], 500);
    }
    if (!Object.keys(patch).length) return { error: "add/upsert item has no fields to set" };
    return { patch, create: true };
  }
  return { error: `unknown action "${item && item.action}"` };
}

// True if the patch wouldn't change the idea (idempotency — a re-run is a no-op).
function isNoop(idea, patch) {
  return Object.keys(patch).every((k) => (patch[k] || null) === ((idea && idea[k]) || null));
}

// Apply a batch of items. deps = { listIdeas(), updateIdea(id, patch), createIdea?(patch) }.
// An item may name its target via `id`, `match`, `project`, or `title`. An add/upsert
// item with no EXACT match CREATES a card (only when deps.createIdea is provided — e.g.
// /api/publish, NOT the stand-up ingestion, which must never invent projects) — UNLESS
// its name fuzzily matches an existing card, in which case it's reported "ambiguous"
// (a likely duplicate for a human to reconcile) rather than created. `item.force_create`
// skips that guard to create a genuinely-new same-ish-named card.
// Result statuses: applied · skipped · created · ambiguous · unmatched · error.
// Returns { results: [{status, id?, title?, error?}], summary: {status: count} }.
export async function applyUpdates(deps, items) {
  const list = Array.isArray(items) ? items : [];
  const ideas = await deps.listIdeas();
  const results = [];
  for (const item of list) {
    const key = item && (item.id || item.match || item.project || item.title);
    const { patch, error, create } = itemToPatch(item);
    if (error) { results.push({ item, status: "error", error }); continue; }
    // add/upsert matches STRICTLY (exact/id); status tags match fuzzily.
    const idea = create ? matchIdeaExact(ideas, key) : matchIdea(ideas, key);
    if (!idea) {
      // No existing card. Create only for an add/upsert that names a title AND when a
      // creator is available; everything else is reported as unmatched (never guessed).
      if (create && deps.createIdea && patch.title) {
        // Name-drift guard: check the TITLE being created (not just the match key, which
        // can differ) against every existing card. ANY containment overlap — exact, one
        // match, or several ("Sales Velocity" vs "Velocity"; a bare "Growth" vs two Growth*
        // cards) — is treated as a likely duplicate and reported "ambiguous" for a human to
        // reconcile the name, rather than silently spawning a second card. `force_create`
        // overrides the guard (reviewer confirmed a genuinely NEW same-ish-named project) —
        // that still CREATES a distinct card, never renames the one it resembles.
        const near = item.force_create ? [] : containmentMatches(ideas, patch.title);
        if (near.length) {
          results.push({ item, status: "ambiguous", id: near[0].id, title: near[0].title });
          continue;
        }
        try {
          const made = await deps.createIdea(patch);
          results.push({ item, id: made && made.id, title: patch.title, status: "created", patch });
          // Reflect the new card in the working set so a later item in THIS batch naming the
          // same project updates it (or no-ops) rather than creating a second one — `ideas`
          // was fetched once up front and wouldn't otherwise see intra-batch creates. Mirror
          // the RETURNED row (createIdea fills defaults like stage "build"), not just `patch`,
          // so a later isNoop check against this entry is accurate.
          if (made && made.id) {
            ideas.push({
              id: made.id,
              title: made.title || patch.title,
              stage: made.stage || patch.stage || null,
              dev_status: made.dev_status || patch.dev_status || null,
              dev_status_reason: made.dev_status_reason || patch.dev_status_reason || null,
            });
          }
        } catch (e) {
          results.push({ item, title: patch.title, status: "error", transient: true, error: String((e && e.message) || e) });
        }
      } else {
        results.push({ item, status: "unmatched" });
      }
      continue;
    }
    // Matched → update. Title is a CREATE-only field: never rewrite an existing card's
    // title from an add/upsert (would echo the match key / lowercased query over the
    // canonical name). Renaming isn't an add/upsert operation.
    delete patch.title;
    // A move INTO Live (from non-live) means shipped → dev_status "done", unless the
    // item set dev_status explicitly (add/upsert).
    if (patch.stage === "live" && idea.stage !== "live" && patch.dev_status === undefined) {
      patch.dev_status = "done";
      if (patch.dev_status_reason === undefined) patch.dev_status_reason = null;
    }
    if (isNoop(idea, patch)) { results.push({ item, id: idea.id, title: idea.title, status: "skipped" }); continue; }
    try {
      await deps.updateIdea(idea.id, patch);
      results.push({ item, id: idea.id, title: idea.title, status: "applied", patch });
    } catch (e) {
      // `transient: true` distinguishes a write failure (network/DB blip — worth a
      // retry) from a permanent validation error (bad target_stage etc. from
      // itemToPatch, above), so the ingestion can defer markProcessed for the
      // former without looping forever on the latter.
      results.push({ item, id: idea.id, title: idea.title, status: "error", transient: true, error: String((e && e.message) || e) });
    }
  }
  const summary = results.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
  return { results, summary };
}
