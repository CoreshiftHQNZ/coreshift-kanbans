// Tests for the publish/apply-updates core. Run: `node --test` from worker/.
// No dependencies — Node's built-in test runner + assert.
import { test } from "node:test";
import assert from "node:assert/strict";
import { normTitle, matchIdea, itemToPatch, applyUpdates } from "../src/publish.js";

const ideas = () => [
  { id: "1", title: "Tap", stage: "harden", dev_status: "in_progress", dev_status_reason: null },
  { id: "2", title: "Lead Engine", stage: "build", dev_status: "in_progress", dev_status_reason: null },
  { id: "3", title: "Growth Partners — 2026 Rebuild", stage: "live", dev_status: "done", dev_status_reason: null },
  { id: "4", title: "Storepro Component Count", stage: "build", dev_status: "in_progress", dev_status_reason: null },
];

test("normTitle strips punctuation/case", () => {
  assert.equal(normTitle("Growth Partners — 2026 Rebuild"), "growth partners 2026 rebuild");
  assert.equal(normTitle("  Tap!! "), "tap");
});

test("matchIdea: id, exact title, fuzzy containment, ambiguous → null", () => {
  const list = ideas();
  assert.equal(matchIdea(list, "2").title, "Lead Engine");
  assert.equal(matchIdea(list, "tap").title, "Tap");
  assert.equal(matchIdea(list, "growth partners 2026").title, "Growth Partners — 2026 Rebuild");
  assert.equal(matchIdea(list, "Storepro").title, "Storepro Component Count");
  assert.equal(matchIdea(list, "nonexistent project"), null);
  assert.equal(matchIdea(list, ""), null);
});

test("itemToPatch: move (valid + invalid target)", () => {
  assert.deepEqual(itemToPatch({ action: "move", target_stage: "live" }).patch, { stage: "live" });
  assert.ok(itemToPatch({ action: "move", target_stage: "bogus" }).error);
  assert.ok(itemToPatch({ action: "move" }).error);
});

test("itemToPatch: waiting-on (dash + underscore) → blocked + reason", () => {
  for (const a of ["waiting-on", "waiting_on", "Waiting On"]) {
    const p = itemToPatch({ action: a, note: "legal review" }).patch;
    assert.equal(p.dev_status, "blocked");
    assert.equal(p.dev_status_reason, "legal review");
  }
  assert.equal(itemToPatch({ action: "waiting-on" }).patch.dev_status_reason, "Waiting on a dependency");
});

test("itemToPatch: park → pending_validation", () => {
  const p = itemToPatch({ action: "park-for-later", note: "Q3 budget" }).patch;
  assert.equal(p.stage, "pending_validation");
  assert.equal(p.dev_status_reason, "Q3 budget");
});

test("itemToPatch: unknown action → error", () => {
  assert.ok(itemToPatch({ action: "frobnicate" }).error);
});

test("applyUpdates: applied / skipped(noop) / unmatched / error", async () => {
  const patched = [];
  const deps = {
    listIdeas: async () => ideas(),
    updateIdea: async (id, patch) => { patched.push({ id, patch }); },
  };
  const { summary, results } = await applyUpdates(deps, [
    { match: "Tap", action: "waiting-on", note: "legal/privacy review" },   // applied → blocked
    { match: "Lead Engine", action: "move", target_stage: "build" },         // skipped (already build)
    { match: "Ghost Project", action: "move", target_stage: "live" },        // unmatched
    { match: "Storepro", action: "move", target_stage: "not-a-stage" },      // error (bad target)
  ]);
  assert.equal(summary.applied, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.unmatched, 1);
  assert.equal(summary.error, 1);
  assert.equal(patched.length, 1);
  assert.equal(patched[0].id, "1");
  assert.equal(patched[0].patch.dev_status, "blocked");
  assert.equal(results.find((r) => r.status === "unmatched").item.match, "Ghost Project");
});

test("applyUpdates: idempotent re-run of an applied move is a no-op", async () => {
  let calls = 0;
  const deps = {
    listIdeas: async () => [{ id: "1", title: "Tap", stage: "live", dev_status: "done" }],
    updateIdea: async () => { calls++; },
  };
  const r1 = await applyUpdates(deps, [{ match: "Tap", action: "move", target_stage: "live" }]);
  assert.equal(r1.summary.skipped, 1);
  assert.equal(calls, 0);
});
