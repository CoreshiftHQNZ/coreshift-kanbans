// Tests for the commissioned-build intake spec (item 3). Run: `node --test` from worker/.
// Validates the spec's shape and — importantly — that the fields the intake tool can
// emit are all persisted by the Worker (COMMISSIONED_PROSE_FIELDS) and rendered by the
// client (config.js commissioned.sections), so the three never silently drift.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  SECTIONS, PHASES, GREETING, SYSTEM_PROMPT, TOOLS, COMMISSIONED_PROSE_FIELDS,
} from "../src/spec-commissioned.js";

test("PHASES: brief → scope → plan (no ideation/validation)", () => {
  assert.deepEqual(PHASES.map((p) => p.key), ["brief", "scope", "plan"]);
});

test("SECTIONS: required brief + plan fields are marked required", () => {
  const required = SECTIONS.filter((s) => s.required).map((s) => s.key);
  for (const k of ["client", "commission", "deliverables", "timeline", "scope", "governance", "build_plan"]) {
    assert.ok(required.includes(k), `${k} should be required`);
  }
  // Commercial + design references are encouraged but not blocking.
  assert.equal(SECTIONS.find((s) => s.key === "commercial").required, false);
  assert.equal(SECTIONS.find((s) => s.key === "design_refs").required, false);
});

test("SYSTEM_PROMPT: skips ideation/validation/go-no-go and produces a build plan", () => {
  assert.match(SYSTEM_PROMPT, /NOT the internal idea funnel|already decided/i);
  assert.match(SYSTEM_PROMPT, /DO NOT run ideation/i);
  assert.match(SYSTEM_PROMPT, /go.?\/?.?no.?go|go\/no-go/i);
  assert.match(SYSTEM_PROMPT, /BUILD PLAN/i);
  assert.match(GREETING, /commissioned/i);
});

test("TOOLS: update_assessment phase enum matches PHASES; submit requires title", () => {
  const ua = TOOLS.find((t) => t.name === "update_assessment");
  const sub = TOOLS.find((t) => t.name === "submit_for_review");
  assert.deepEqual(ua.input_schema.properties.phase.enum, ["brief", "scope", "plan"]);
  assert.deepEqual(sub.input_schema.required, ["title"]);
});

test("every tool prose field is persisted by the Worker (no dropped-on-save fields)", () => {
  const ua = TOOLS.find((t) => t.name === "update_assessment");
  const proseProps = Object.keys(ua.input_schema.properties).filter((k) => !["phase", "title", "one_liner"].includes(k));
  for (const k of proseProps) {
    assert.ok(COMMISSIONED_PROSE_FIELDS.includes(k), `tool emits "${k}" but the Worker won't persist it`);
  }
  // And every declared section key is emittable + persisted.
  for (const s of SECTIONS) {
    assert.ok(proseProps.includes(s.key), `section "${s.key}" has no update_assessment field`);
    assert.ok(COMMISSIONED_PROSE_FIELDS.includes(s.key), `section "${s.key}" not in COMMISSIONED_PROSE_FIELDS`);
  }
});

test("client config (config.js) commissioned.sections stays in sync with the spec", () => {
  const cfgPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../config.js");
  const win = {};
  // config.js is a browser file (window.FP = {...}); run it with a window shim.
  new Function("window", readFileSync(cfgPath, "utf8"))(win);
  const cm = win.FP && win.FP.commissioned;
  assert.ok(cm, "config.js must define FP.commissioned");
  assert.deepEqual(cm.phases.map((p) => p.key), PHASES.map((p) => p.key));
  assert.deepEqual(
    cm.sections.map((s) => s.field),
    SECTIONS.map((s) => s.key),
    "config commissioned.sections fields must match the spec SECTIONS keys, in order",
  );
  // Reverse direction: every field the Worker persists must be rendered somewhere,
  // so captured data can never become invisible (the primary_contact/asset_value gap).
  const rendered = new Set(cm.sections.map((s) => s.field));
  for (const k of COMMISSIONED_PROSE_FIELDS) {
    assert.ok(rendered.has(k), `COMMISSIONED_PROSE_FIELDS has "${k}" but config.commissioned.sections never renders it`);
  }
});
