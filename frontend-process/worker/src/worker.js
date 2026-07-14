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
// Allowed values for the CHECK-constrained columns (mirrors schema.sql). Used to
// validate writes so one bad value can't fail the whole atomic PATCH with a 500.
const ENUM_VALUES = {
  intent: ["personal", "internal", "client", "speculative", "standalone", "product"],
  confidence: ["punt", "validate", "business_case"],
  decision: ["proceed", "validate_first", "experiment", "client_only", "product", "do_not_proceed"],
};
const STAGES = ["inbox", "assessment", "review", "pending_validation", "rejected", "build", "harden", "business", "launch", "live", "parked", "declined"];
const STATUSES = ["draft", "in_review", "validated", "declined"];
const DEV_STATUSES = ["in_progress", "on_hold", "blocked", "at_risk", "done"];
const WIP_STAGES = ["build", "harden", "business", "launch", "live"];
const PROSE_FIELDS = [
  "phase", "opportunity", "intent", "scope", "asset_value",
  "commercial", "governance", "decision_rationale", "spend_cap",
];

// Minimal same-origin test chat served at GET /try. Talks to /api/chat on this
// same Worker, so there is no CORS and nothing needs publishing. Client JS uses
// plain string concatenation (no backticks / no ${}) so it embeds safely here.
const TRY_PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Idea Intake — live test</title>
<style>
 body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b}
 h1{font-size:15px;margin:16px 20px 0}.sub{font-size:12px;color:#64748b;margin:2px 20px 12px}
 .wrap{max-width:1120px;margin:0 auto;padding:0 20px 24px;display:grid;grid-template-columns:1.5fr 1fr;gap:16px}
 .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px}
 .chat{display:flex;flex-direction:column;height:72vh}
 .log{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
 .msg{max-width:85%;padding:9px 13px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap}
 .assistant{background:#f1f5f9;align-self:flex-start}.user{background:#0f1e3d;color:#fff;align-self:flex-end}
 .foot{border-top:1px solid #e2e8f0;padding:10px;display:flex;gap:8px}
 textarea{flex:1;border:1px solid #cbd5e1;border-radius:8px;padding:9px;font:inherit;resize:none}
 button{background:#14b8a6;color:#fff;border:0;border-radius:8px;padding:0 18px;font-weight:600;cursor:pointer}
 .panel{padding:8px 18px 16px}.ptitle{font-size:13px;font-weight:700;margin:8px 0}
 .ph{font-size:12px;color:#0d9488;font-weight:600}
 .sec{border-bottom:1px solid #eef2f7;padding:9px 0}.sec b{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#475569}
 .sec div{font-size:13px;margin-top:3px}.empty{color:#94a3b8;font-style:italic}
</style></head><body>
<h1>Idea Intake — live test <span id="ph" class="ph"></span></h1>
<div class="sub">Real Claude conversation via this Worker's /api/chat. Type anything — it responds to you, not a script.</div>
<div class="wrap">
 <div class="card chat"><div class="log" id="log"></div>
  <div class="foot"><textarea id="in" rows="1" placeholder="Type your idea and press Enter..."></textarea><button id="send">Send</button></div></div>
 <div class="card panel"><div class="ptitle">App Assessment</div><div id="panel"></div></div>
</div>
<script>
 var SECTIONS=[['opportunity','1 Opportunity'],['intent_type','2 Intent'],['confidence','3 Confidence'],['commercial','4 Commercial'],['scope','5 Scope'],['asset_value','6 Asset value'],['governance','7 Governance'],['decision','8 Decision']];
 var ideaId=null,messages=[],assessment={},busy=false;
 var log=document.getElementById('log'),input=document.getElementById('in');
 function add(role,text){var d=document.createElement('div');d.className='msg '+role;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
 function panel(){var p=document.getElementById('panel');p.innerHTML='';SECTIONS.forEach(function(s){var v=assessment[s[0]];var el=document.createElement('div');el.className='sec';var b=document.createElement('b');b.textContent=s[1];var dv=document.createElement('div');if(v){dv.textContent=v;}else{dv.className='empty';dv.textContent='not captured yet';}el.appendChild(b);el.appendChild(dv);p.appendChild(el);});document.getElementById('ph').textContent=assessment.phase?('phase: '+assessment.phase):'';}
 function apply(j){if(j.error){add('assistant','[error] '+j.error);return;}ideaId=j.ideaId||ideaId;if(j.assessment)assessment=j.assessment;if(j.reply){add('assistant',j.reply);messages.push({role:'assistant',text:j.reply});}panel();if(j.submitted)add('assistant','[✓ submitted for review]');}
 function call(body){return fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json();});}
 function send(){if(busy)return;var t=input.value.trim();if(!t)return;input.value='';add('user',t);messages.push({role:'user',text:t});busy=true;call({ideaId:ideaId,messages:messages}).then(function(j){busy=false;apply(j);}).catch(function(e){busy=false;add('assistant','[network error] '+e);});}
 document.getElementById('send').onclick=send;
 input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
 panel();call({messages:[]}).then(apply).catch(function(e){add('assistant','[network error] '+e);});
</script></body></html>`;

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
      if (url.pathname === "/api/delete" && request.method === "POST") return await handleDelete(request, env, cors);
      if (url.pathname === "/api/update" && request.method === "POST") return await handleUpdate(request, env, cors);
      if (url.pathname === "/try" && request.method === "GET")
        return new Response(TRY_PAGE, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
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
  // Only resume drafts. /api/chat is unauthenticated, so a bare ideaId must never
  // read or mutate a submitted/live idea (its prose is otherwise review-token gated
  // via /api/idea). A non-draft id falls through to a fresh draft.
  if (idea && !["inbox", "assessment"].includes(idea.stage || "inbox")) idea = null;
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
  // The Anthropic API requires the first message to be a user turn. The client
  // stores the assistant's greeting as message #1, so drop any leading
  // assistant turns before sending.
  while (messages.length && messages[0].role !== "user") messages.shift();
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
    patch.stage = "review";
  } else if (["inbox", "assessment"].includes(idea.stage || "inbox")) {
    // While drafting: an untitled idea stays in Inbox; once it has a real title
    // it surfaces in Assessment. Never auto-touch a card already past assessment.
    const t = String(patch.title || idea.title || "").trim();
    patch.stage = (t && t !== "Untitled idea") ? "assessment" : "inbox";
  }
  // Persist the transcript so a draft is recoverable server-side too.
  patch.transcript = clientMsgs.concat(reply ? [{ role: "assistant", text: reply }] : []);
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
    "ideas?select=id,title,one_liner,stage,status,intent,confidence,decision,assessment,product_owner,dev_status,dev_status_reason,repo_url,kanban_url,staging_url,production_url,updated_at&deleted_at=is.null&order=updated_at.desc",
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
  if (!ENUM_VALUES.decision.includes(body.decision)) return json({ error: "invalid decision" }, 400, cors);
  const STAGE_FOR = { do_not_proceed: "rejected", validate_first: "pending_validation" };
  const STATUS_FOR = { do_not_proceed: "declined", validate_first: "in_review" };
  const patch = {
    decision: body.decision,
    status: STATUS_FOR[body.decision] || "validated",
    stage: STAGE_FOR[body.decision] || (STAGES.includes(body.stage) ? body.stage : "build"),
    decision_note: body.note || null,
    reviewed_by: body.reviewer || "Keitha",
    reviewed_at: new Date().toISOString(),
  };
  // A go-decision lands the card in Build — start its developer status.
  if (WIP_STAGES.includes(patch.stage)) patch.dev_status = "in_progress";
  const saved = await updateIdea(env, body.ideaId, patch);
  return json({ ok: true, idea: publicView(saved) }, 200, cors);
}

// ── /api/delete (soft delete — review-token gated) ─────────────────────────
async function handleDelete(request, env, cors) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  const body = await request.json();
  if (!body.ideaId) return json({ error: "ideaId required" }, 400, cors);
  await updateIdea(env, body.ideaId, { deleted_at: new Date().toISOString() });
  return json({ ok: true }, 200, cors);
}

// ── /api/update (reviewer edits assessment / corrects stage — token-gated) ──
async function handleUpdate(request, env, cors) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  const body = await request.json();
  if (!body.ideaId) return json({ error: "ideaId required" }, 400, cors);
  const idea = await getIdea(env, body.ideaId);
  if (!idea) return json({ error: "Not found" }, 404, cors);

  const patch = {};
  const assessment = { ...(idea.assessment || {}) };
  const edits = (body.assessment && typeof body.assessment === "object") ? body.assessment : {};
  // Only these assessment keys are writable from the board editor. An enum key
  // also syncs its denormalised column (intent/confidence/decision) so the
  // card chips + placement stay in step. "" clears the field.
  const ALLOWED = ["opportunity", "intent_type", "confidence", "commercial", "scope", "asset_value", "governance", "decision", "decision_rationale", "spend_cap"];
  for (const key of ALLOWED) {
    if (!(key in edits)) continue;
    const raw = edits[key];
    const v = typeof raw === "string" ? raw.trim() : raw;
    if (v == null || v === "") { delete assessment[key]; if (ENUM_COLUMNS[key]) patch[ENUM_COLUMNS[key]] = null; }
    else {
      assessment[key] = v;
      // Only sync the denormalised column when the value is a valid enum member —
      // an out-of-enum value would otherwise fail the CHECK constraint and 500 the
      // whole update, losing the prose edits in the same request.
      if (ENUM_COLUMNS[key] && ENUM_VALUES[ENUM_COLUMNS[key]].includes(v)) patch[ENUM_COLUMNS[key]] = v;
    }
  }
  patch.assessment = assessment;

  if (body.stage && STAGES.includes(body.stage)) patch.stage = body.stage;
  if (body.status && STATUSES.includes(body.status)) patch.status = body.status;

  // Operational fields (Product Owner + developer status) — set on Build+ cards.
  if ("product_owner" in body) patch.product_owner = body.product_owner ? String(body.product_owner).slice(0, 120) : null;
  if ("dev_status" in body) patch.dev_status = DEV_STATUSES.includes(body.dev_status) ? body.dev_status : null;
  if ("dev_status_reason" in body) patch.dev_status_reason = body.dev_status_reason ? String(body.dev_status_reason) : null;

  const saved = await updateIdea(env, body.ideaId, patch);
  return json({ ok: true, idea: publicView(saved), assessment: saved.assessment }, 200, cors);
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
  // Exclude soft-deleted rows so a deleted idea reads as gone everywhere
  // (chat resume, /api/idea, review) — never silently written to or resurfaced.
  const rows = await supa(env, "GET", `ideas?id=eq.${encodeURIComponent(id)}&deleted_at=is.null&select=*`);
  return rows && rows[0];
}
async function createIdea(env) {
  // New drafts land in Inbox — they only surface in Assessment once they have a
  // real title (see handleChat). Keeps "Untitled idea" cards out of Assessment.
  const rows = await supa(env, "POST", "ideas", { title: "Untitled idea", stage: "inbox", status: "draft" });
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
  // `filled` reports which assessment sections are non-empty — booleans only, so
  // the board can enforce move-gating without the (sensitive) prose crossing the
  // wire. Enum fields count as filled from either the column or the assessment.
  const a = idea.assessment || {};
  const has = (v) => v != null && String(v).trim() !== "";
  const filled = {
    opportunity: has(a.opportunity),
    intent_type: has(idea.intent) || has(a.intent_type),
    confidence: has(idea.confidence) || has(a.confidence),
    commercial: has(a.commercial),
    scope: has(a.scope),
    asset_value: has(a.asset_value),
    governance: has(a.governance),
    decision: has(idea.decision) || has(a.decision),
  };
  return {
    id: idea.id, title: idea.title, one_liner: idea.one_liner,
    stage: idea.stage, status: idea.status,
    intent: idea.intent, confidence: idea.confidence, decision: idea.decision,
    filled,
    product_owner: idea.product_owner || null,
    dev_status: idea.dev_status || null,
    dev_status_reason: idea.dev_status_reason || null,
    repo_url: idea.repo_url, kanban_url: idea.kanban_url,
    staging_url: idea.staging_url, production_url: idea.production_url,
    updated_at: idea.updated_at,
  };
}
function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "https://coreshifthqnz.github.io,http://localhost:8790,http://127.0.0.1:8790")
    .split(",").map((s) => s.trim());
  // Also allow Cloudflare Pages preview origins (*.pages.dev). CORS isn't a real
  // security boundary here (the endpoint is reachable by non-browser clients
  // regardless); tighten by gating the whole thing before real use.
  const ok = allowed.includes(origin) || allowed.includes("*") || /^https:\/\/[a-z0-9.-]+\.pages\.dev$/i.test(origin);
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
