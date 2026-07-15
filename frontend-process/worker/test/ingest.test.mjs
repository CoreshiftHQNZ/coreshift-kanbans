// Tests for the Fireflies stand-up ingestion. Run: `node --test` from worker/.
// No dependencies — Node's built-in test runner + assert. Everything here is
// offline: the Fireflies fetch and Claude router are injected as mocks, so the
// parsing, routing plumbing, digest, and idempotent orchestration are all covered
// without the live FIREFLIES_API_KEY (that key only powers the real getLatestStandup).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchRecentTranscripts, pickLatestStandup, getLatestStandup } from "../src/fireflies.js";
import { routingSystemPrompt, INGEST_TOOL, standupToContent, routeStandup, digest, ingest } from "../src/ingest.js";

// ── A captured-style stand-up fixture (shape mirrors the Fireflies GraphQL response).
const STANDUP = {
  id: "T-2026-07-14",
  title: "Daily stand-up",
  dateString: "2026-07-14",
  organizer_email: "keitha@coreshifthq.com",
  summary: {
    overview: "Team sync. Tap paused pending legal/privacy. Store Pro waiting on client email. Lead Engine ready to build.",
    action_items: [
      "Ibrahim: Tap paused pending legal/privacy review",
      "Keitha: Store Pro waiting on client email before proceeding",
      "Abe: Lead Engine approved — move to build",
    ],
  },
};

const IDEAS = () => [
  { id: "1", title: "Tap", stage: "harden", dev_status: "in_progress" },
  { id: "2", title: "Store Pro", stage: "build", dev_status: "in_progress" },
  { id: "3", title: "Lead Engine", stage: "review", dev_status: null },
];

// ── fireflies.js ────────────────────────────────────────────────────────────
test("pickLatestStandup: newest stand-up by date (not by position), else null", () => {
  assert.equal(pickLatestStandup([{ title: "Client call", date: 9 }, { title: "Daily stand-up", id: "a", date: 5 }]).id, "a");
  // Out-of-order input: picks the newest by `date`, not the first in the list.
  assert.equal(pickLatestStandup([
    { title: "Daily stand-up", id: "old", date: 100 },
    { title: "Daily Stand Up", id: "new", date: 200 },
  ]).id, "new");
  assert.equal(pickLatestStandup([{ title: "Retro" }, { title: "1:1" }]), null);
  assert.equal(pickLatestStandup([]), null);
  assert.equal(pickLatestStandup(null), null);
});

test("fetchRecentTranscripts: throws without a key", async () => {
  await assert.rejects(() => fetchRecentTranscripts({}, 10, async () => ({})), /FIREFLIES_API_KEY not set/);
});

test("fetchRecentTranscripts: parses data, sends bearer auth", async () => {
  let seen = null;
  const fakeFetch = async (url, opts) => {
    seen = { url, opts };
    return { ok: true, json: async () => ({ data: { transcripts: [{ id: "x", title: "Daily stand-up" }] } }) };
  };
  const rows = await fetchRecentTranscripts({ FIREFLIES_API_KEY: "k" }, 5, fakeFetch);
  assert.equal(rows[0].id, "x");
  assert.match(seen.opts.headers.authorization, /^Bearer k$/);
  assert.match(seen.url, /fireflies\.ai\/graphql/);
});

test("fetchRecentTranscripts: surfaces HTTP + GraphQL errors", async () => {
  await assert.rejects(
    () => fetchRecentTranscripts({ FIREFLIES_API_KEY: "k" }, 5, async () => ({ ok: false, status: 401, text: async () => "nope" })),
    /Fireflies 401/,
  );
  await assert.rejects(
    () => fetchRecentTranscripts({ FIREFLIES_API_KEY: "k" }, 5, async () => ({ ok: true, json: async () => ({ errors: [{ message: "bad" }] }) })),
    /GraphQL/,
  );
});

test("getLatestStandup: fetch → pick", async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ data: { transcripts: [{ id: "c1", title: "Client call" }, { id: "s1", title: "Daily stand-up" }] } }) });
  const s = await getLatestStandup({ FIREFLIES_API_KEY: "k" }, fakeFetch);
  assert.equal(s.id, "s1");
});

// ── ingest.js pure helpers ────────────────────────────────────────────────────
test("routingSystemPrompt: lists every project title + the move stages, not the legacy ones", () => {
  const p = routingSystemPrompt(IDEAS());
  assert.match(p, /"Tap"/);
  assert.match(p, /"Store Pro"/);
  assert.match(p, /"Lead Engine"/);
  assert.match(p, /build/); // stages line
  // parked/declined are reviewer-decision outcomes, not stand-up move targets.
  assert.doesNotMatch(p, /\bparked\b/);
  assert.doesNotMatch(p, /\bdeclined\b/);
});

test("standupToContent: handles array + string action_items and missing summary", () => {
  assert.match(standupToContent(STANDUP), /Tap paused pending legal/);
  assert.match(standupToContent(STANDUP), /2026-07-14/);
  assert.match(standupToContent({ title: "x", summary: { action_items: "one big string" } }), /one big string/);
  assert.match(standupToContent({ title: "x" }), /\(none\)/); // no summary → graceful
});

test("INGEST_TOOL: schema shape is well-formed for the API", () => {
  const t = INGEST_TOOL[0];
  assert.equal(t.name, "emit_updates");
  assert.deepEqual(t.input_schema.required, ["items"]);
  assert.deepEqual(t.input_schema.properties.items.items.properties.action.enum, ["move", "waiting-on", "park"]);
});

// ── routeStandup (Claude injected) ────────────────────────────────────────────
test("routeStandup: returns the emit_updates items, dropping malformed ones", async () => {
  const deps = {
    callAnthropic: async () => ({
      content: [
        { type: "text", text: "here are the updates" },
        { type: "tool_use", name: "emit_updates", input: { items: [
          { match: "Tap", action: "waiting-on", note: "legal/privacy review" },
          { match: "Lead Engine", action: "move", target_stage: "build" },
          { action: "move" },        // malformed: no match → dropped
          { match: "Ghost" },        // malformed: no action → dropped
        ] } },
      ],
    }),
  };
  const items = await routeStandup(deps, IDEAS(), STANDUP);
  assert.equal(items.length, 2);
  assert.equal(items[0].match, "Tap");
  assert.equal(items[1].target_stage, "build");
});

test("routeStandup: no tool_use → empty list (nothing changed)", async () => {
  const deps = { callAnthropic: async () => ({ content: [{ type: "text", text: "nothing to update" }] }) };
  assert.deepEqual(await routeStandup(deps, IDEAS(), STANDUP), []);
});

// ── digest ────────────────────────────────────────────────────────────────────
test("digest: summarises applied / unmatched / error", () => {
  const d = digest(STANDUP, [
    { status: "applied", title: "Tap", item: { match: "Tap", action: "waiting-on" } },
    { status: "applied", title: "Lead Engine", item: { match: "Lead Engine", action: "move", target_stage: "build" } },
    { status: "unmatched", item: { match: "Mystery Project", action: "move" } },
    { status: "error", title: "X", item: { match: "X", action: "move" }, error: "bad target" },
  ]);
  assert.match(d, /Stand-up ingested: Daily stand-up/);
  assert.match(d, /Updated \(2\)/);
  assert.match(d, /Lead Engine \(move→build\)/);
  assert.match(d, /Unmatched \(1\): Mystery Project/);
  assert.match(d, /Errors \(1\)/);
});

test("digest: no changes reads cleanly", () => {
  assert.match(digest(STANDUP, []), /Updated: none/);
});

// ── ingest orchestration ───────────────────────────────────────────────────────
// A stubbed router returns the items a good model WOULD produce for the fixture,
// so the full route→apply→mark→notify path is exercised deterministically.
function makeDeps(overrides = {}) {
  const state = { patched: [], processed: new Set(), notified: [], routed: 0 };
  const deps = {
    getLatestStandup: async () => STANDUP,
    listIdeas: async () => IDEAS(),
    updateIdea: async (id, patch) => { state.patched.push({ id, patch }); },
    callAnthropic: async () => { state.routed++; return { content: [{ type: "tool_use", name: "emit_updates", input: { items: [
      { match: "Tap", action: "waiting-on", note: "legal/privacy review" },
      { match: "Store Pro", action: "waiting-on", note: "client email" },
      { match: "Lead Engine", action: "move", target_stage: "build" },
    ] } }] }; },
    wasProcessed: async (id) => state.processed.has(id),
    markProcessed: async (id) => { state.processed.add(id); },
    notify: async (text) => { state.notified.push(text); },
    ...overrides,
  };
  return { deps, state };
}

test("ingest: full flow routes, applies, marks processed, notifies", async () => {
  const { deps, state } = makeDeps();
  const res = await ingest(deps);
  assert.equal(res.status, "ingested");
  assert.equal(res.summary.applied, 3);            // Tap+Store Pro blocked, Lead Engine → build
  assert.equal(state.patched.length, 3);
  assert.equal(state.patched.find((p) => p.id === "1").patch.dev_status, "blocked");
  assert.equal(state.patched.find((p) => p.id === "3").patch.stage, "build");
  assert.ok(state.processed.has("T-2026-07-14"));
  assert.equal(state.notified.length, 1);
  assert.match(res.digest, /Updated \(3\)/);
});

test("ingest: already-processed transcript is a no-op (no routing, no writes)", async () => {
  const { deps, state } = makeDeps();
  state.processed.add("T-2026-07-14");
  const res = await ingest(deps);
  assert.equal(res.status, "already_processed");
  assert.equal(state.routed, 0);     // never called the model
  assert.equal(state.patched.length, 0);
});

test("ingest: force bypasses the idempotency guard", async () => {
  const { deps, state } = makeDeps();
  state.processed.add("T-2026-07-14");
  const res = await ingest(deps, { force: true });
  assert.equal(res.status, "ingested");
  assert.ok(state.routed > 0);
});

test("ingest: no stand-up available → clean no_standup", async () => {
  const { deps, state } = makeDeps({ getLatestStandup: async () => null });
  const res = await ingest(deps);
  assert.equal(res.status, "no_standup");
  assert.equal(state.patched.length, 0);
});

test("ingest: a Slack failure does not fail the ingest (digest is best-effort)", async () => {
  const { deps, state } = makeDeps({ notify: async () => { throw new Error("slack down"); } });
  const res = await ingest(deps);
  assert.equal(res.status, "ingested");
  assert.ok(state.processed.has("T-2026-07-14")); // still recorded
});

test("ingest: a transient write failure is NOT marked processed, and retries next fire", async () => {
  let attempts = 0;
  const { deps, state } = makeDeps({
    updateIdea: async (id, patch) => {
      attempts++;
      if (attempts === 1) throw new Error("503 transient"); // first write of the run blips
      state.patched.push({ id, patch });
    },
  });
  const r1 = await ingest(deps);
  assert.equal(r1.status, "retry_pending");
  assert.equal(state.processed.has("T-2026-07-14"), false); // unmarked → will be retried
  // Next fire: wasProcessed is still false, so it re-runs; now every write succeeds.
  const r2 = await ingest(deps);
  assert.equal(r2.status, "ingested");
  assert.ok(state.processed.has("T-2026-07-14"));
});

test("ingest: an unripe stand-up (summary not generated yet) is not marked processed", async () => {
  const { deps, state } = makeDeps({
    getLatestStandup: async () => ({ id: "T-unripe", title: "Daily stand-up", summary: {} }),
    callAnthropic: async () => ({ content: [{ type: "tool_use", name: "emit_updates", input: { items: [] } }] }),
  });
  const r = await ingest(deps);
  assert.equal(r.status, "skipped_empty");
  assert.equal(state.processed.has("T-unripe"), false); // a later, ripe fire will process it
  assert.equal(state.notified.length, 0);               // nothing to report
});

test("ingest: a ripe stand-up with no status changes is marked processed but stays silent", async () => {
  const { deps, state } = makeDeps({
    callAnthropic: async () => ({ content: [{ type: "tool_use", name: "emit_updates", input: { items: [] } }] }),
  });
  const r = await ingest(deps);
  assert.equal(r.status, "ingested");
  assert.ok(state.processed.has("T-2026-07-14")); // seen — don't reprocess
  assert.equal(state.notified.length, 0);          // no change worth a digest
});

test("ingest: an unmatched project is reported, never invented", async () => {
  const { deps } = makeDeps({
    callAnthropic: async () => ({ content: [{ type: "tool_use", name: "emit_updates", input: { items: [
      { match: "Totally New Thing", action: "move", target_stage: "build" },
    ] } }] }),
  });
  const res = await ingest(deps);
  assert.equal(res.summary.unmatched, 1);
  assert.equal(res.summary.applied, undefined);
  assert.match(res.digest, /Unmatched \(1\): Totally New Thing/);
});
