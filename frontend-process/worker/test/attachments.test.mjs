// Tests for the pure attachment helpers. Run: `node --test` from worker/.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classify, base64ToBytes, bytesToText, approxBytes, stripDataPrefix, isValidBase64,
  validateAttachments, toContentBlock, toMeta, MAX_FILES,
} from "../src/attachments.js";

// base64 of "hello transcript" (ascii)
const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
const TXT = b64("hello transcript");
const PNG_1PX = "iVBORw0KGgo="; // not a real png, just bytes for shape tests

test("classify: images / pdf / text / unsupported", () => {
  assert.equal(classify("image/png"), "image");
  assert.equal(classify("image/JPEG"), "image");
  assert.equal(classify("application/pdf"), "pdf");
  assert.equal(classify("text/plain"), "text");
  assert.equal(classify("text/markdown; charset=utf-8"), "text");
  assert.equal(classify("text/html"), null);   // no text/* wildcard — can't store HTML
  assert.equal(classify("image/svg+xml"), null);
  assert.equal(classify("application/vnd.openxmlformats-officedocument.wordprocessingml.document"), null);
  assert.equal(classify(""), null);
});

test("isValidBase64: accepts clean base64 (with/without prefix), rejects hostile input", () => {
  assert.equal(isValidBase64(TXT), true);
  assert.equal(isValidBase64("data:text/plain;base64," + TXT), true);
  assert.equal(isValidBase64("!!!not-base64!!!"), false);
  assert.equal(isValidBase64("abc"), false); // length % 4 !== 0
});

test("stripDataPrefix + base64ToBytes + bytesToText round-trip", () => {
  assert.equal(stripDataPrefix("data:text/plain;base64," + TXT), TXT);
  assert.equal(bytesToText(base64ToBytes(TXT)), "hello transcript");
  assert.equal(bytesToText(base64ToBytes("data:text/plain;base64," + TXT)), "hello transcript");
});

test("approxBytes ~ decoded length", () => {
  assert.equal(approxBytes(TXT), Buffer.from("hello transcript", "utf8").length);
});

test("validateAttachments: ok / too many / bad type / no data / oversize", () => {
  assert.equal(validateAttachments(null).ok, true);            // no attachments is fine
  assert.equal(validateAttachments([]).ok, true);
  assert.equal(validateAttachments([{ name: "a.txt", type: "text/plain", data: TXT }]).ok, true);

  const many = Array.from({ length: MAX_FILES + 1 }, () => ({ name: "x.txt", type: "text/plain", data: TXT }));
  assert.match(validateAttachments(many).error, /too many/);

  assert.match(validateAttachments([{ name: "x.exe", type: "application/x-msdownload", data: TXT }]).error, /unsupported/);
  assert.match(validateAttachments([{ name: "x.txt", type: "text/plain" }]).error, /no data/);

  const big = "A".repeat(15 * 1024 * 1024); // ~11MB decoded > 10MB cap
  assert.match(validateAttachments([{ name: "big.png", type: "image/png", data: big }]).error, /too large/);
  assert.equal(validateAttachments("nope").ok, false);
  // Hostile / malformed base64 is rejected cleanly (would otherwise throw in atob).
  assert.match(validateAttachments([{ name: "x.png", type: "image/png", data: "!!!not-base64!!!" }]).error, /valid base64/);
  // A bad image preview is rejected too.
  assert.match(validateAttachments([{ name: "x.png", type: "image/png", data: TXT, preview: "!!bad" }]).error, /preview/);
});

test("validateAttachments: rejects an oversized total even when each file is under the per-file cap", () => {
  const chunk = "A".repeat(8 * 1024 * 1024); // ~6MB decoded each (< 10MB per-file cap)
  const files = Array.from({ length: 6 }, (_, i) => ({ name: `f${i}.png`, type: "image/png", data: chunk }));
  assert.match(validateAttachments(files).error, /in total/); // 6 × ~6MB = ~36MB > 30MB
});

test("toContentBlock: image → image block", () => {
  const b = toContentBlock({ name: "shot.png", type: "image/png", data: "data:image/png;base64," + PNG_1PX });
  assert.equal(b.type, "image");
  assert.equal(b.source.type, "base64");
  assert.equal(b.source.media_type, "image/png");
  assert.equal(b.source.data, PNG_1PX); // prefix stripped
});

test("toContentBlock: image with a preview → model gets the preview, not the original", () => {
  const b = toContentBlock({ name: "shot.webp", type: "image/webp", data: "T3JpZ2luYWw=", preview: "data:image/png;base64," + PNG_1PX, previewType: "image/png" });
  assert.equal(b.type, "image");
  assert.equal(b.source.media_type, "image/png"); // preview's format, not the webp original
  assert.equal(b.source.data, PNG_1PX);           // preview bytes (original archived separately)
});

test("toContentBlock: pdf → document block", () => {
  const b = toContentBlock({ name: "brief.pdf", type: "application/pdf", data: PNG_1PX });
  assert.equal(b.type, "document");
  assert.equal(b.source.media_type, "application/pdf");
});

test("toContentBlock: text → labelled text block (decoded + capped)", () => {
  const b = toContentBlock({ name: "call.txt", type: "text/plain", data: TXT });
  assert.equal(b.type, "text");
  assert.match(b.text, /\[Attached file: call\.txt\]/);
  assert.match(b.text, /hello transcript/);
});

test("toMeta: never carries raw bytes; records path/kind/size", () => {
  const m = toMeta({ name: "shot.png", type: "image/png", data: PNG_1PX }, "idea1/123-shot.png");
  assert.deepEqual(Object.keys(m).sort(), ["kind", "name", "path", "size", "type"].sort());
  assert.equal(m.kind, "image");
  assert.equal(m.path, "idea1/123-shot.png");
  assert.ok(!("data" in m));
});
