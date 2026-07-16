// Frontend Process — Fireflies stand-up → pipeline ingestion.
//
// Routes a daily stand-up's action items into pipeline status updates via Claude,
// then applies them through the shared publish core (publish.js). Used by both the
// scheduled cron and POST /api/ingest.
//
// Everything here is pure logic over injected deps (no direct network), so the
// routing prompt, digest, idempotency, and orchestration are all unit-testable with
// mocks — the only thing that needs the live FIREFLIES_API_KEY is the getLatestStandup
// dep (fireflies.js), which is the final go-live flip. The MANUAL path (Keitha's
// Cowork prompt in INGESTION.md) bypasses this module entirely.

import { applyUpdates } from "./publish.js";
import { MOVE_STAGES } from "./consts.js";

// System prompt: the current pipeline projects are the ONLY things Claude may update.
export function routingSystemPrompt(ideas) {
  const projects = (ideas || [])
    .map((i) => `- "${i.title}" (stage: ${i.stage}${i.dev_status ? ", dev: " + i.dev_status : ""})`)
    .join("\n") || "- (no projects)";
  return `You turn Coreshift daily stand-up notes into pipeline status updates.

CURRENT PIPELINE PROJECTS — only ever update one of these, matched by its exact title. Never invent a project:
${projects}

VALID STAGES for a "move": ${MOVE_STAGES.join(", ")}.

From the stand-up's action items + summary, emit an update ONLY for a project whose status CLEARLY changed:
- "move": the project advanced or moved lanes (e.g. approved→build, shipped→live, sent back→review). Include target_stage.
- "waiting-on": the project is blocked / waiting on a person or dependency (e.g. "pending legal", "awaiting client email"). Include a short note naming who/what.
- "park": the project is paused or deprioritised for later. Include a short note with the reason.

Rules:
- Match each update to a project by its exact title in the list above. If something mentioned isn't clearly one of these projects, SKIP it — do not guess or create it.
- Be conservative: only emit an update the stand-up clearly supports. A project merely being discussed is NOT a status change.
- Call emit_updates exactly once. If nothing clearly changed, call it with an empty items array.`;
}

// Forced tool the router must call. items[] feed straight into applyUpdates.
export const INGEST_TOOL = [{
  name: "emit_updates",
  description: "Emit the pipeline status updates derived from the stand-up (empty array if nothing clearly changed).",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            match: { type: "string", description: "Exact project title from the provided list." },
            action: { type: "string", enum: ["move", "waiting-on", "park"] },
            target_stage: { type: "string", description: "Target stage — required for action 'move'." },
            note: { type: "string", description: "Short reason — required for 'waiting-on' and 'park'." },
          },
          required: ["match", "action"],
        },
      },
    },
    required: ["items"],
  },
}];

// Flatten a Fireflies summary into the text the router reads. Action items can come
// back as a string or an array (per-person lines) — normalise both. Pure/testable.
export function standupToContent(standup) {
  const s = (standup && standup.summary) || {};
  const ai = Array.isArray(s.action_items) ? s.action_items.join("\n") : (s.action_items || "");
  const when = (standup && (standup.dateString || standup.date)) || "";
  return [
    `Stand-up: ${(standup && standup.title) || "Daily stand-up"}${when ? " (" + when + ")" : ""}`,
    `Overview: ${s.overview || s.short_summary || "(none)"}`,
    `Action items:`,
    ai || "(none)",
  ].join("\n");
}

// Ask Claude to route a stand-up into applyUpdates items.
// deps.callAnthropic(system, messages, tools) → raw Anthropic response.
export async function routeStandup(deps, ideas, standup) {
  const resp = await deps.callAnthropic(
    routingSystemPrompt(ideas),
    [{ role: "user", content: standupToContent(standup) }],
    INGEST_TOOL,
  );
  const tu = ((resp && resp.content) || []).find((b) => b.type === "tool_use" && b.name === "emit_updates");
  const items = tu && tu.input && Array.isArray(tu.input.items) ? tu.input.items : [];
  // Keep only well-formed items, and hard-restrict the action to the status verbs a
  // stand-up may emit — so even an off-schema "add"/"set" from the model can never
  // reach the shared apply core and mutate/rename a project via the ingestion path.
  const norm = (a) => String(a).toLowerCase().replace(/[-\s]+/g, "_");
  const ALLOWED = new Set(["move", "waiting_on", "park", "park_for_later"]);
  return items.filter((it) => it && it.match && it.action && ALLOWED.has(norm(it.action)));
}

// Human-readable digest of what the apply did (Slack + the API response body). Pure.
export function digest(standup, results) {
  const title = (standup && standup.title) || "stand-up";
  const by = (st) => results.filter((r) => r.status === st);
  const label = (r) => {
    const name = r.title || (r.item && r.item.match) || "?";
    const a = (r.item && r.item.action) || "";
    const tgt = r.item && r.item.target_stage ? "→" + r.item.target_stage : "";
    return `${name} (${a}${tgt})`;
  };
  const lines = [`📥 Stand-up ingested: ${title}`];
  const applied = by("applied");
  const skipped = by("skipped");
  const unmatched = by("unmatched");
  const errored = by("error");
  lines.push(applied.length ? `✅ Updated (${applied.length}): ${applied.map(label).join(", ")}` : "✅ Updated: none");
  if (skipped.length) lines.push(`↔️ No change (${skipped.length}): ${skipped.map(label).join(", ")}`);
  if (unmatched.length) lines.push(`❓ Unmatched (${unmatched.length}): ${unmatched.map((r) => (r.item && r.item.match) || "?").join(", ")}`);
  if (errored.length) lines.push(`⚠️ Errors (${errored.length}): ${errored.map((r) => `${label(r)} — ${r.error}`).join(", ")}`);
  return lines.join("\n");
}

// Full ingestion. deps = {
//   getLatestStandup(): Promise<standup|null>,   // fireflies.js (needs the key)
//   listIdeas(): Promise<idea[]>,
//   updateIdea(id, patch): Promise,
//   callAnthropic(system, msgs, tools): Promise<resp>,
//   wasProcessed(id): Promise<bool>,
//   markProcessed(id, meta): Promise,
//   notify?(text): Promise,                        // optional Slack digest
// }
// opts.force re-processes even if the transcript id was already ingested.
//
// Idempotency note: wasProcessed→markProcessed is a check-then-act, not an atomic
// claim. The two daily crons are 2h apart (never overlap), so the only way to
// double-process is a manual /api/ingest firing at the same instant as a cron — a
// rare human-timing coincidence whose only symptom is a duplicate Slack digest
// (applyUpdates is idempotent, so no data is double-written). Left as-is deliberately;
// an atomic claim-before-processing would conflict with the retry semantics below.
export async function ingest(deps, opts = {}) {
  const standup = await deps.getLatestStandup();
  if (!standup || !standup.id) return { ok: true, status: "no_standup" };
  if (!opts.force && (await deps.wasProcessed(standup.id))) {
    return { ok: true, status: "already_processed", id: standup.id, title: standup.title };
  }
  const ideas = await deps.listIdeas();
  const items = await routeStandup(deps, ideas, standup);
  const { results, summary } = await applyUpdates(
    // Reuse the ideas we already fetched — no second round-trip.
    { listIdeas: async () => ideas, updateIdea: deps.updateIdea },
    items,
  );
  const text = digest(standup, results);

  // Only record the transcript as done when there's nothing left to retry, so an
  // unmarked transcript is re-attempted by the next fire:
  //   • no usable content yet (transcript exists but Fireflies hasn't finished the
  //     AI summary) → skip, let the later fire process the ripe summary.
  //   • a transient write failure (network/DB blip) → skip, retry next fire; already
  //     applied items are no-ops on the retry (applyUpdates is idempotent).
  // A permanent validation error still marks processed (it would loop forever otherwise).
  const s = standup.summary || {};
  const aiCount = Array.isArray(s.action_items) ? s.action_items.length : (s.action_items ? 1 : 0);
  const hadContent = !!(s.overview || s.short_summary || aiCount || items.length);
  const hadTransient = results.some((r) => r.status === "error" && r.transient);
  const status = !hadContent ? "skipped_empty" : hadTransient ? "retry_pending" : "ingested";

  if (status === "ingested") {
    await deps.markProcessed(standup.id, { title: standup.title, summary, count: results.length });
  }
  // Notify only when there's something worth reporting (a change, an unmatched item,
  // or an error) — a quiet stand-up that maps to no status change stays silent.
  const worthNotifying = results.some((r) => ["applied", "unmatched", "error"].includes(r.status));
  if (hadContent && worthNotifying && deps.notify) {
    try { await deps.notify(text); } catch (_) { /* digest is best-effort */ }
  }
  return { ok: true, status, id: standup.id, title: standup.title, items, summary, results, digest: text };
}
