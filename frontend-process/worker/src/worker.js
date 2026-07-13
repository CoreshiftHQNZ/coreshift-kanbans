// Frontend Process — idea-intake Worker.
//
// One Cloudflare Worker that powers the front-of-house idea intake:
//   POST /api/chat      run the assessment conversation (Claude API + tool use)
//   POST /api/submit    finalise an idea and notify Keitha
//   GET  /api/ideas     board data (safe fields only) for the pipeline page
//   GET  /api/idea      full assessment for one idea (review-token gated)
//   POST /api/decision  record Keitha's decision + move the card (review-token gated)
//
// Secrets (set with `wrangler secret put`): ANTHROPIC_API_KEY,
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SLACK_WEBHOOK_URL, REVIEW_TOKEN.
// Vars (wrangler.toml): MODEL, ALLOWED_ORIGINS, SITE_URL.

import { SYSTEM_PROMPT, TOOLS } from "./spec.js";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ENUM_COLUMNS = { intent_type: "intent", confidence: "confidence", decision: "decision" };
const PROSE_FIELDS = [
  "opportunity", "intent", "scope", "asset_value",
  "commercial", "governance", "decision_rationale", "spend_cap",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === "/api/chat" && request.method === "POST") return await handleChat(request, env, cors);
      if (url.pathname === "/api/submit" && request.method === "POST") return await handleSubmit(request, env, cors);
      if (url.pathname === "/api/ideas" && request.method === "GET") return await handleIdeas(env, cors);
      if (url.pathname === "/api/idea" && request.method === "GET") return await handleIdea(request, env, cors, url);
      if (url.pathname === "/api/decision" && request.method === "POST") return await handleDecision(request, env, cors);
      if (url.pathname === "/" || url.pathname === "/health") return json({ ok: true, service: "idea-intake" }, 200, cors);
      return json({ error: "Not found" }, 404, cors);
    } catch (err) {
      return json({ error: String(err && err.message || err) }, 500, cors);
    }
  },
};

// ── /api/chat ──────────────────────────────────────────────────────────────
async function handleChat(request, env, cors) {
  const body = await request.json();
  const clientMsgs = Array.isArray(body.messages) ? body.messages.slice(-24) : [];
  let idea = body.ideaId ? await getIdea(env, body.ideaId) : null;
  if (!idea) idea = await createIdea(env);

  const assessment = { ...(idea.assessment || {}) };
  const patch = { assessment };
  let submitted = false;
  let submitMeta = null;

  const system =
    SYSTEM_PROMPT +
    `\n\nAssessment captured so far (JSON). Do not re-ask what is already filled — build on it:\n` +
    JSON.stringify(assessment);

  const messages = clientMsgs
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.text)
    .map((m) => ({ role: m.role, content: String(m.text) }));
  if (!messages.length) messages.push({ role: "user", content: "Hi — I have an idea." });

  let reply = "";
  for (let i = 0; i < 4; i++) {
    const resp = await callAnthropic(env, system, messages, TOOLS);
    const toolUses = (resp.content || []).filter((b) => b.type === "tool_use");
    const text = (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();

    if (resp.stop_reason === "tool_use" && toolUses.length) {
      messages.push({ role: "assistant", content: resp.content });
      const results = [];
      for (const tu of toolUses) {
        if (tu.name === "update_assessment") {
          applyUpdate(patch, assessment, tu.input);
          results.push({ type: "tool_result", tool_use_id: tu.id, content: "Saved." });
        } else if (tu.name === "submit_for_review") {
          submitted = true;
          submitMeta = tu.input || {};
          if (submitMeta.title) patch.title = submitMeta.title;
          if (submitMeta.one_liner) patch.one_liner = submitMeta.one_liner;
          if (submitMeta.submitter_name) patch.submitter_name = submitMeta.submitter_name;
          if (submitMeta.submitter_email) patch.submitter_email = submitMeta.submitter_email;
          results.push({ type: "tool_result", tool_use_id: tu.id, content: "Submitted for review." });
        }
      }
      messages.push({ role: "user", content: results });
      continue;
    }
    reply = text;
    break;
  }

  if (submitted) {
    patch.status = "in_review";
    patch.stage = "ideation";
  }
  const saved = await updateIdea(env, idea.id, patch);
  if (submitted) await notifySlack(env, saved).catch(() => {});

  return json(
    { ideaId: idea.id, reply, assessment: saved.assessment || assessment, submitted, idea: publicView(saved) },
    200, cors,
  );
}

// ── /api/submit (explicit finalise, e.g. from a "send for review" button) ──
async function handleSubmit(request, env, cors) {
  const body = await request.json();
  if (!body.ideaId) return json({ error: "ideaId required" }, 400, cors);
  const saved = await updateIdea(env, body.ideaId, { status: "in_review", stage: "ideation" });
  await notifySlack(env, saved).catch(() => {});
  return json({ ok: true, idea: publicView(saved) }, 200, cors);
}

// ── /api/ideas (board data — safe fields only) ─────────────────────────────
async function handleIdeas(env, cors) {
  const rows = await supa(
    env, "GET",
    "ideas?select=id,title,one_liner,stage,status,intent,confidence,decision,updated_at&order=updated_at.desc",
  );
  return json({ ideas: rows.map(publicView) }, 200, cors);
}

// ── /api/idea?id=… (full assessment — review-token gated) ──────────────────
async function handleIdea(request, env, cors, url) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "id required" }, 400, cors);
  const idea = await getIdea(env, id);
  if (!idea) return json({ error: "Not found" }, 404, cors);
  return json({ idea }, 200, cors);
}

// ── /api/decision (Keitha's review — review-token gated) ───────────────────
async function handleDecision(request, env, cors) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  const body = await request.json();
  if (!body.ideaId || !body.decision) return json({ error: "ideaId and decision required" }, 400, cors);
  const STAGE_FOR = { do_not_proceed: "archived" };
  const patch = {
    decision: body.decision,
    status: body.decision === "do_not_proceed" ? "declined" : "validated",
    stage: STAGE_FOR[body.decision] || (body.stage || "product"),
    decision_note: body.note || null,
    reviewed_by: body.reviewer || "Keitha",
    reviewed_at: new Date().toISOString(),
  };
  const saved = await updateIdea(env, body.ideaId, patch);
  return json({ ok: true, idea: publicView(saved) }, 200, cors);
}

// ── Assessment merge ───────────────────────────────────────────────────────
function applyUpdate(patch, assessment, input) {
  if (!input) return;
  for (const [k, v] of Object.entries(input)) {
    if (v == null || v === "") continue;
    if (k === "title") patch.title = v;
    else if (k === "one_liner") patch.one_liner = v;
    else if (ENUM_COLUMNS[k]) { patch[ENUM_COLUMNS[k]] = v; assessment[k] = v; }
    else if (PROSE_FIELDS.includes(k)) assessment[k] = v;
  }
  patch.assessment = assessment;
}

// ── Anthropic ──────────────────────────────────────────────────────────────
async function callAnthropic(env, system, messages, tools) {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.MODEL || "claude-sonnet-5",
      max_tokens: 1024,
      system,
      tools,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Supabase REST ──────────────────────────────────────────────────────────
async function supa(env, method, path, body) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function getIdea(env, id) {
  const rows = await supa(env, "GET", `ideas?id=eq.${encodeURIComponent(id)}&select=*`);
  return rows && rows[0];
}
async function createIdea(env) {
  const rows = await supa(env, "POST", "ideas", { title: "Untitled idea", stage: "ideation", status: "draft" });
  return rows[0];
}
async function updateIdea(env, id, patch) {
  patch.updated_at = new Date().toISOString();
  const rows = await supa(env, "PATCH", `ideas?id=eq.${encodeURIComponent(id)}`, patch);
  return rows[0];
}

// ── Slack ──────────────────────────────────────────────────────────────────
async function notifySlack(env, idea) {
  if (!env.SLACK_WEBHOOK_URL) return;
  const site = env.SITE_URL || "https://coreshifthqnz.github.io/coreshift-kanbans";
  const link = `${site}/frontend-process/#idea=${idea.id}`;
  const dials = [idea.intent, idea.confidence, idea.decision].filter(Boolean).join(" · ") || "—";
  await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `💡 New idea for review: *${idea.title}* — ${idea.one_liner || ""}`,
      blocks: [
        { type: "section", text: { type: "mrkdwn",
          text: `*💡 New idea submitted for review*\n*${idea.title}*\n${idea.one_liner || ""}` } },
        { type: "context", elements: [{ type: "mrkdwn", text: `Route: ${dials}   ·   from ${idea.submitter_name || "someone on the team"}` }] },
        { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Review assessment" }, url: link }] },
      ],
    }),
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function authed(request, env) {
  const h = request.headers.get("Authorization") || "";
  return env.REVIEW_TOKEN && h === `Bearer ${env.REVIEW_TOKEN}`;
}
function publicView(idea) {
  if (!idea) return null;
  return {
    id: idea.id, title: idea.title, one_liner: idea.one_liner,
    stage: idea.stage, status: idea.status,
    intent: idea.intent, confidence: idea.confidence, decision: idea.decision,
    updated_at: idea.updated_at,
  };
}
function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "https://coreshifthqnz.github.io,http://localhost:8790,http://127.0.0.1:8790")
    .split(",").map((s) => s.trim());
  const ok = allowed.includes(origin) || allowed.includes("*");
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}
