// Tests for the publish/apply-updates core. Run: `node --test` from worker/.
// No dependencies — Node's built-in test runner + assert.
import { test } from "node:test";
import assert from "node:assert/strict";
import { normTitle, matchIdea, matchIdeaExact, itemToPatch, applyUpdates } from "../src/publish.js";

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

test("matchIdea: a short title is NOT matched by an unrelated longer reference", () => {
  const list = [{ id: "1", title: "Tap", stage: "harden" }];
  assert.equal(matchIdea(list, "Tapestry"), null); // "tapestry" must not resolve to "Tap"
  assert.equal(matchIdea(list, "Tap").id, "1");     // exact still matches
});

test("applyUpdates: a move INTO Live sets dev_status 'done' (transition only)", async () => {
  const patched = [];
  const deps = {
    listIdeas: async () => [{ id: "1", title: "KeyContent", stage: "launch", dev_status: "in_progress" }],
    updateIdea: async (id, patch) => patched.push({ id, patch }),
  };
  await applyUpdates(deps, [{ match: "KeyContent", action: "move", target_stage: "live" }]);
  assert.equal(patched.length, 1);
  assert.equal(patched[0].patch.stage, "live");
  assert.equal(patched[0].patch.dev_status, "done");
});

// ── add / upsert (Keitha adding off-pipeline projects) ────────────────────────
test("itemToPatch: add builds a field patch + create flag; validates enums", () => {
  const ok = itemToPatch({ action: "add", title: "Ops Portal", stage: "build", dev_status: "in_progress", product_owner: "Ricky", one_liner: "x", repo_url: "https://gh/x" });
  assert.equal(ok.create, true);
  assert.equal(ok.patch.title, "Ops Portal");
  assert.equal(ok.patch.stage, "build");
  assert.equal(ok.patch.dev_status, "in_progress");
  assert.equal(ok.patch.product_owner, "Ricky");
  assert.equal(ok.patch.repo_url, "https://gh/x");
  assert.ok(itemToPatch({ action: "add", title: "X", stage: "not-a-stage" }).error);
  assert.ok(itemToPatch({ action: "add", title: "X", dev_status: "nope" }).error);
  assert.ok(itemToPatch({ action: "add", title: "X", intent: "nope" }).error);
  assert.ok(itemToPatch({ action: "add" }).error); // no fields
  assert.equal(itemToPatch({ action: "upsert", stage: "harden" }).create, true); // alias
});

test("applyUpdates: add with no match CREATES (when a creator is provided)", async () => {
  const created = [];
  const deps = {
    listIdeas: async () => ideas(),
    updateIdea: async () => {},
    createIdea: async (patch) => { created.push(patch); return { id: "new-1" }; },
  };
  const { summary, results } = await applyUpdates(deps, [
    { action: "add", title: "Brand-New Ops Portal", stage: "build", product_owner: "Ricky" },
  ]);
  assert.equal(summary.created, 1);
  assert.equal(created.length, 1);
  assert.equal(created[0].title, "Brand-New Ops Portal");
  assert.equal(results[0].id, "new-1");
});

test("applyUpdates: add that MATCHES an existing card updates it (upsert), no create", async () => {
  const patched = [], created = [];
  const deps = {
    listIdeas: async () => ideas(),
    updateIdea: async (id, patch) => patched.push({ id, patch }),
    createIdea: async (patch) => { created.push(patch); return { id: "x" }; },
  };
  const { summary } = await applyUpdates(deps, [
    { action: "upsert", match: "Lead Engine", product_owner: "Abe", dev_status: "at_risk" },
  ]);
  assert.equal(summary.applied, 1);
  assert.equal(created.length, 0);            // matched → updated, not created
  assert.equal(patched[0].patch.product_owner, "Abe");
  assert.equal(patched[0].patch.dev_status, "at_risk");
});

test("applyUpdates: add with no match and NO creator → unmatched (ingestion never invents)", async () => {
  const deps = { listIdeas: async () => ideas(), updateIdea: async () => {} }; // no createIdea
  const { summary } = await applyUpdates(deps, [{ action: "add", title: "Should Not Exist", stage: "build" }]);
  assert.equal(summary.unmatched, 1);
  assert.equal(summary.created, undefined);
});

test("matchIdeaExact: id / exact title only, never fuzzy containment", () => {
  const list = ideas();
  assert.equal(matchIdeaExact(list, "3").title, "Growth Partners — 2026 Rebuild");
  assert.equal(matchIdeaExact(list, "growth partners 2026 rebuild").id, "3");
  assert.equal(matchIdeaExact(list, "Growth Partners"), null); // containment does NOT match
});

test("add: a new title that only CONTAINS an existing one creates a distinct card (never renames)", async () => {
  const patched = [], created = [];
  const deps = {
    listIdeas: async () => ideas(),
    updateIdea: async (id, patch) => patched.push({ id, patch }),
    createIdea: async (patch) => { created.push(patch); return { id: "new" }; },
  };
  const { summary } = await applyUpdates(deps, [{ action: "add", title: "Growth Partners", stage: "build" }]);
  assert.equal(summary.created, 1);         // a distinct "Growth Partners" was created
  assert.equal(created[0].title, "Growth Partners");
  assert.equal(patched.length, 0);          // the live "Growth Partners — 2026 Rebuild" was untouched
});

test("upsert on an exact match updates fields but never rewrites the title", async () => {
  const patched = [];
  const deps = { listIdeas: async () => ideas(), updateIdea: async (id, patch) => patched.push({ id, patch }) };
  await applyUpdates(deps, [{ action: "upsert", match: "Growth Partners — 2026 Rebuild", title: "GP", dev_status: "at_risk" }]);
  assert.equal(patched.length, 1);
  assert.equal(patched[0].patch.dev_status, "at_risk");
  assert.equal(patched[0].patch.title, undefined); // title dropped on update — no rename
});

test("applyUpdates: add/upsert into Live keeps an explicit dev_status (no forced 'done')", async () => {
  const patched = [];
  const deps = {
    listIdeas: async () => [{ id: "1", title: "KeyContent", stage: "launch", dev_status: "in_progress" }],
    updateIdea: async (id, patch) => patched.push({ id, patch }),
  };
  await applyUpdates(deps, [{ action: "set", match: "KeyContent", stage: "live", dev_status: "at_risk" }]);
  assert.equal(patched[0].patch.stage, "live");
  assert.equal(patched[0].patch.dev_status, "at_risk"); // explicit value preserved, not "done"
});
