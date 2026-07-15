// Frontend Process — intake file attachments.
//
// Users can attach transcripts, client briefs, screenshots and inspiration images to
// the intake (both the standard assessment and the commissioned-build flow). The
// assistant reads them to fill the assessment / build plan, and the originals are
// stored (Supabase Storage) so they travel with the card.
//
// This module is the PURE part — validation + Anthropic content-block mapping + base64
// helpers — kept network-free so it's unit-testable. The Storage upload/signing (which
// need fetch) live in worker.js.

export const MAX_FILES = 6;                    // per turn
export const MAX_BYTES = 10 * 1024 * 1024;     // 10 MB per file (decoded) — matches the bucket cap
export const MAX_TOTAL_BYTES = 30 * 1024 * 1024; // 30 MB total per request (memory/DoS guard)
export const MAX_TEXT_CHARS = 20000;           // cap inlined transcript text (token guard)

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const TEXT_TYPES = ["text/plain", "text/markdown"];
export const PDF_TYPE = "application/pdf";

// Map a mime type to a coarse kind, or null if unsupported. Only the explicit
// text types are allowed (no text/* wildcard) so e.g. text/html can't be stored and
// later served inline from a signed URL.
export function classify(type) {
  const t = String(type || "").toLowerCase().split(";")[0].trim();
  if (IMAGE_TYPES.includes(t)) return "image";
  if (t === PDF_TYPE) return "pdf";
  if (TEXT_TYPES.includes(t)) return "text";
  return null;
}

// A base64 payload with an optional data: prefix, and nothing hostile that would
// throw in atob(). Padding-aware, whitespace-free.
export function isValidBase64(d) {
  const s = stripDataPrefix(d);
  return s.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(s);
}

// Strip a leading data: URL prefix if the client sent one.
export function stripDataPrefix(d) {
  return String(d == null ? "" : d).replace(/^data:[^,]*,/, "");
}

// base64 (with or without data: prefix) → Uint8Array. atob is available in Workers.
export function base64ToBytes(b64) {
  const bin = atob(stripDataPrefix(b64));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// UTF-8 bytes → string (for text attachments inlined into a text block).
export function bytesToText(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}

// Approx decoded byte size of a base64 string without decoding it.
export function approxBytes(b64) {
  const s = stripDataPrefix(b64);
  const pad = s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((s.length * 3) / 4) - pad);
}

// Validate a list of incoming attachments. Returns { ok:true } or { ok:false, error }.
export function validateAttachments(list) {
  if (list == null) return { ok: true };
  if (!Array.isArray(list)) return { ok: false, error: "attachments must be an array" };
  if (list.length > MAX_FILES) return { ok: false, error: `too many files (max ${MAX_FILES})` };
  let total = 0;
  for (const a of list) {
    if (!a || typeof a !== "object") return { ok: false, error: "malformed attachment" };
    if (!a.data) return { ok: false, error: `attachment "${a.name || "?"}" has no data` };
    if (!classify(a.type)) return { ok: false, error: `unsupported file type: ${a.type || "unknown"}` };
    if (!isValidBase64(a.data)) return { ok: false, error: `"${a.name || "file"}" is not valid base64` };
    if (approxBytes(a.data) > MAX_BYTES) {
      return { ok: false, error: `"${a.name || "file"}" is too large (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB)` };
    }
    // Optional downscaled preview (images) — sent to the model in place of the original.
    // A falsy/empty preview is treated as absent (falls back to the original); a
    // present, non-empty preview must be valid base64 with real bytes.
    if (a.preview && (!isValidBase64(a.preview) || approxBytes(a.preview) === 0 || approxBytes(a.preview) > MAX_BYTES)) {
      return { ok: false, error: `"${a.name || "file"}" has an invalid preview` };
    }
    total += approxBytes(a.data);
  }
  if (total > MAX_TOTAL_BYTES) {
    return { ok: false, error: `attachments too large in total (max ${Math.round(MAX_TOTAL_BYTES / 1024 / 1024)}MB per message)` };
  }
  return { ok: true };
}

// Build the Anthropic content block for one attachment. Images → image block
// (using the downscaled preview when present, so the model gets a small copy while
// Storage keeps the original), PDFs → document block, text → labelled text block.
export function toContentBlock(att) {
  const kind = classify(att.type);
  if (kind === "image") {
    // Use the preview only when it actually carries bytes — never let an empty
    // preview shadow the original with "".
    const usePreview = !!att.preview && approxBytes(att.preview) > 0;
    const media = usePreview ? (att.previewType || "image/png") : att.type.toLowerCase().split(";")[0].trim();
    return { type: "image", source: { type: "base64", media_type: media, data: stripDataPrefix(usePreview ? att.preview : att.data) } };
  }
  if (kind === "pdf") {
    return { type: "document", source: { type: "base64", media_type: PDF_TYPE, data: stripDataPrefix(att.data) } };
  }
  const text = bytesToText(base64ToBytes(att.data)).slice(0, MAX_TEXT_CHARS);
  return { type: "text", text: `[Attached file: ${att.name || "file.txt"}]\n${text}` };
}

// Lightweight metadata to persist in the transcript (never the raw bytes).
export function toMeta(att, path) {
  return {
    name: String(att.name || "file"),
    type: String(att.type || ""),
    kind: classify(att.type),
    path,                              // storage path (set after upload)
    size: approxBytes(att.data),
  };
}
