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
import {
  SYSTEM_PROMPT as COMMISSIONED_PROMPT,
  TOOLS as COMMISSIONED_TOOLS,
  GREETING as COMMISSIONED_GREETING,
  COMMISSIONED_PROSE_FIELDS,
} from "./spec-commissioned.js";
import { applyUpdates } from "./publish.js";
import { ingest } from "./ingest.js";
import { getLatestStandup } from "./fireflies.js";
import { validateAttachments, toContentBlock, toMeta, base64ToBytes } from "./attachments.js";
import { ENUM_COLUMNS, ENUM_VALUES, STAGES, STATUSES, DEV_STATUSES, WIP_STAGES, PREBUILD_STAGES } from "./consts.js";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
// Assessment jsonb keys the Worker persists from update_assessment. The commissioned
// mode adds its own brief fields; a Set dedupes the overlap (scope/governance/etc.).
const PROSE_FIELDS = [...new Set([
  "phase", "opportunity", "intent", "scope", "asset_value",
  "commercial", "governance", "decision_rationale", "spend_cap",
  ...COMMISSIONED_PROSE_FIELDS,
])];
// Opening line for a fresh intake — returned WITHOUT creating a DB row (see handleChat),
// so page-loads that never turn into a real idea don't litter the board.
const GREETING = "Hi — I'm the Idea Intake. Tell me the idea: what's the opportunity, what's clunky or missing today, and who feels it?";

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
      if (url.pathname === "/api/draft" && request.method === "GET") return await handleDraft(request, env, cors, url);
      if (url.pathname === "/api/publish" && request.method === "POST") return await handlePublish(request, env, cors);
      if (url.pathname === "/api/ingest" && request.method === "POST") return await handleIngest(request, env, cors);
      if (url.pathname === "/try" && request.method === "GET")
        return new Response(TRY_PAGE, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
      if (url.pathname === "/" || url.pathname === "/health") return json({ ok: true, service: "idea-intake" }, 200, cors);
      return json({ error: "Not found" }, 404, cors);
    } catch (err) {
      // Log the detail server-side, but return a generic message — upstream error
      // bodies (PostgREST/Anthropic/Fireflies) can carry internal detail like column
      // or constraint names, and some routes (/api/ideas, /api/chat) are unauthenticated.
      console.error("[worker] unhandled error:", String((err && err.stack) || (err && err.message) || err));
      return json({ error: "Internal error" }, 500, cors);
    }
  },

  // Cloudflare Cron Trigger (see wrangler.toml [triggers]). Fires daily: pull the
  // latest stand-up and apply routed updates, then prune stale empty drafts. Both
  // are best-effort and idempotent — a fire with nothing new is a safe no-op. Needs
  // FIREFLIES_API_KEY to actually ingest; without it, ingest logs and moves on.
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const res = await ingest(buildIngestDeps(env));
        console.log("[cron] ingest:", res.status, res.id || "");
      } catch (e) {
        console.error("[cron] ingest failed:", String((e && e.message) || e));
      }
      try {
        const n = await pruneEmptyDrafts(env);
        if (n) console.log(`[cron] pruned ${n} empty draft(s)`);
      } catch (e) {
        console.error("[cron] prune failed:", String((e && e.message) || e));
      }
    })());
  },
};

// ── /api/chat ──────────────────────────────────────────────────────────────
async function handleChat(request, env, cors) {
  const body = await request.json();
  const clientMsgs = Array.isArray(body.messages) ? body.messages.slice(-24) : [];
  const hasUserTurn = clientMsgs.some((m) => m && m.role === "user" && m.text);
  const hasAttachments = Array.isArray(body.attachments) && body.attachments.length > 0;
  let idea = body.ideaId ? await getIdea(env, body.ideaId) : null;
  // Resume any PRE-BUILD card (the assessment step): a fresh draft OR a card a reviewer
  // re-opened to re-assess (Inbox/Assessment/Review/Pending Validation/Rejected). A card
  // past assessment (WIP/Live/Archived) is never resumed/mutated by a bare ideaId here —
  // its prose stays review-token gated via /api/idea.
  if (idea && !PREBUILD_STAGES.includes(idea.stage || "inbox")) idea = null;
  // Intake mode. For an EXISTING draft the mode comes from stored state ONLY (never
  // the request), so a crafted body.mode can't flip a standard draft to commissioned
  // and push it past the reviewer gate into Build. body.mode is honoured only when
  // creating a brand-new idea. "commissioned" = the paid Growth Partners build flow
  // (spec-commissioned.js) — no ideation/validation, lands straight in Build.
  const mode = idea
    ? ((idea.assessment && idea.assessment.mode === "commissioned") ? "commissioned" : "standard")
    : (body.mode === "commissioned" ? "commissioned" : "standard");
  const isCommissioned = mode === "commissioned";
  const greeting = isCommissioned ? COMMISSIONED_GREETING : GREETING;
  // Opening greeting (page just loaded, no real input yet): reply WITHOUT creating a
  // row — this is what left empty "Untitled idea" cards on the board. Persist only
  // once the ideator has actually said something.
  if (!idea && !hasUserTurn && !hasAttachments) {
    return json({ ideaId: null, reply: greeting, assessment: {}, submitted: false, idea: null }, 200, cors);
  }
  if (!idea) idea = await createIdea(env, isCommissioned);

  const assessment = { ...(idea.assessment || {}) };
  const patch = { assessment };
  let submitted = false;
  let submitMeta = null;

  // Attachments on THIS turn (transcripts / briefs / screenshots / inspirations).
  // Validate, store the originals in Storage so they travel with the card, and turn
  // each into a content block the model can read. Only metadata is persisted on the
  // idea + transcript — never the raw bytes.
  const incoming = Array.isArray(body.attachments) ? body.attachments : [];
  const attachBlocks = [];
  const attachMeta = [];
  if (incoming.length) {
    const v = validateAttachments(incoming);
    if (!v.ok) return json({ error: v.error }, 400, cors);
    const existing = Array.isArray(idea.attachments) ? idea.attachments : [];
    if (existing.length + incoming.length > MAX_TOTAL_FILES) {
      return json({ error: `This idea already has the maximum number of attachments (${MAX_TOTAL_FILES}).` }, 400, cors);
    }
    try {
      for (let ai = 0; ai < incoming.length; ai++) {
        attachMeta.push(await uploadAttachment(env, idea.id, incoming[ai]));
        attachBlocks.push(toContentBlock(incoming[ai]));
      }
    } catch (e) {
      // Don't leave half-uploaded orphans if a store/decode fails partway.
      await cleanupAttachments(env, attachMeta);
      return json({ error: "Couldn't process the attachments — please retry." }, 400, cors);
    }
    patch.attachments = existing.concat(attachMeta);
  }

  // Resume opening: an existing card was re-opened (assessment already has content) with
  // no user turn yet. Open by acknowledging what's captured and asking about the first
  // MISSING required section — never greet as a brand-new idea or re-ask filled sections.
  const assessmentHasContent = Object.keys(assessment).some((k) => k !== "phase" && k !== "mode" && assessment[k]);
  const isResumeOpening = !hasUserTurn && assessmentHasContent;
  let resumeNote = "";
  if (isResumeOpening) {
    resumeNote = "\n\nRESUME MODE: This idea already has the assessment above. Do NOT greet it as a new idea and do NOT re-ask anything already filled. In one short line, acknowledge what's captured, then ask about the first still-missing part.";
    if (!isCommissioned) {
      const req = [
        ["Opportunity", assessment.opportunity],
        ["Intent", idea.intent || assessment.intent_type],
        ["Confidence", idea.confidence || assessment.confidence],
        ["Scope", assessment.scope],
        ["Decision", idea.decision || assessment.decision],
      ];
      const missing = req.filter(([, v]) => !(v != null && String(v).trim() !== "")).map(([n]) => n);
      resumeNote += missing.length
        ? ` Still missing: ${missing.join(", ")}. Start with ${missing[0]}.`
        : " Everything required looks captured — confirm the summary and offer to submit for review.";
    }
  }

  const system =
    (isCommissioned ? COMMISSIONED_PROMPT : SYSTEM_PROMPT) +
    `\n\nAssessment captured so far (JSON). Do not re-ask what is already filled — build on it:\n` +
    JSON.stringify(assessment) + resumeNote;

  const messages = clientMsgs
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.text)
    .map((m) => ({ role: m.role, content: String(m.text) }));
  // The Anthropic API requires the first message to be a user turn. The client
  // stores the assistant's greeting as message #1, so drop any leading
  // assistant turns before sending.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length) messages.push({ role: "user", content: isResumeOpening ? "(Resuming this idea — continue from what's still missing.)" : "Hi — I have an idea." });
  // Attach this turn's files to the CURRENT (trailing) turn so they never graft onto
  // an older message (images/PDF first, then the note — Anthropic's recommended order).
  // If the trailing turn isn't a user turn (e.g. its text was empty and got filtered),
  // add a fresh user turn carrying the files rather than back-dating them.
  if (attachBlocks.length) {
    const fallbackText = "I've attached some files — please use them for the assessment / build plan.";
    const last = messages[messages.length - 1];
    if (last && last.role === "user") {
      const t = typeof last.content === "string" ? last.content : "";
      last.content = attachBlocks.concat([{ type: "text", text: t || fallbackText }]);
    } else {
      messages.push({ role: "user", content: attachBlocks.concat([{ type: "text", text: fallbackText }]) });
    }
  }

  let reply = "";
  let lastText = "";
  try {
  for (let i = 0; i < 6; i++) {
    const resp = await callAnthropic(env, system, messages, isCommissioned ? COMMISSIONED_TOOLS : TOOLS);
    const toolUses = (resp.content || []).filter((b) => b.type === "tool_use");
    const text = (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    if (text) lastText = text;

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
  } catch (e) {
    // A failed model call must not leave the just-uploaded originals orphaned.
    if (attachMeta.length) await cleanupAttachments(env, attachMeta);
    throw e;
  }

  // Never leave the ideator on a silent "typing…": fall back to any text the model
  // emitted alongside its tool calls, then to a safe prompt that keeps things moving.
  if (!reply) reply = lastText;
  if (!reply) reply = "Got that — I've captured it on the assessment. What would you like to add or change next?";

  if (submitted && isCommissioned) {
    // Commissioned builds are paid and already approved — no reviewer gate. Land the
    // card directly in Build with the brief attached; seed dev status if it has none.
    patch.status = "validated";
    patch.stage = "build";
    patch.intent = "client";
    if (!idea.dev_status) patch.dev_status = "in_progress";
  } else if (submitted) {
    patch.status = "in_review";
    patch.stage = "review";
    // Re-submitting a re-opened card (incl. a revived Rejected/Pending Validation one)
    // goes back for a FRESH review — clear the prior reviewer verdict so it doesn't land
    // in Review wearing an old "Do not proceed"/"Validate first" chip + stale reviewer.
    // Keep a decision the ideator set THIS conversation; otherwise clear a stale one.
    patch.reviewed_by = null;
    patch.reviewed_at = null;
    patch.decision_note = null;
    if (patch.decision === undefined) { patch.decision = null; delete assessment.decision; }
  } else if (["inbox", "assessment"].includes(idea.stage || "inbox")) {
    // While drafting: an untitled idea stays in Inbox; once it has a real title
    // it surfaces in Assessment. Never auto-touch a card already past assessment.
    const t = String(patch.title || idea.title || "").trim();
    patch.stage = (t && t !== "Untitled idea") ? "assessment" : "inbox";
  }
  // Persist the transcript so a draft is recoverable server-side too.
  patch.transcript = clientMsgs.concat(reply ? [{ role: "assistant", text: reply }] : []);
  // Note this turn's attachments on the latest user turn so the transcript renders
  // them inline (chips). Only name/kind — the originals live in Storage.
  if (attachMeta.length) {
    for (let i = patch.transcript.length - 1; i >= 0; i--) {
      if (patch.transcript[i] && patch.transcript[i].role === "user") {
        patch.transcript[i] = { ...patch.transcript[i], attachments: attachMeta.map((m) => ({ name: m.name, kind: m.kind })) };
        break;
      }
    }
  }
  const saved = await updateIdea(env, idea.id, patch);
  // The internal funnel pings Keitha for review. A commissioned build skips the review
  // gate (already approved), but it still posts a distinct notice so a card landing
  // straight in Build is never silent.
  if (submitted && !isCommissioned) await notifySlack(env, saved).catch(() => {});
  else if (submitted && isCommissioned) {
    const site = env.SITE_URL || "https://coreshifthqnz.github.io/coreshift-kanbans";
    await slackText(env, `🛠 Commissioned build logged: *${saved.title}* — landed in Build. ${site}/frontend-process/`).catch(() => {});
  }

  return json(
    { ideaId: idea.id, reply, assessment: saved.assessment || assessment, submitted, idea: publicView(saved) },
    200, cors,
  );
}

// ── /api/submit (explicit finalise, e.g. from a "send for review" button) ──
async function handleSubmit(request, env, cors) {
  const body = await request.json();
  if (!body.ideaId) return json({ error: "ideaId required" }, 400, cors);
  const saved = await updateIdea(env, body.ideaId, { status: "in_review", stage: "review" });
  await notifySlack(env, saved).catch(() => {});
  return json({ ok: true, idea: publicView(saved) }, 200, cors);
}

// ── /api/ideas (board data — safe fields only) ─────────────────────────────
async function handleIdeas(env, cors) {
  const rows = await supa(
    env, "GET",
    "ideas?select=id,title,one_liner,stage,status,intent,confidence,decision,assessment,product_owner,dev_status,dev_status_reason,repo_url,kanban_url,staging_url,production_url,updated_at,attachments&deleted_at=is.null&order=updated_at.desc",
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
  // Mint short-lived signed URLs for the originals so the reviewer can open them
  // (the bucket is private; URLs expire in an hour).
  if (Array.isArray(idea.attachments) && idea.attachments.length) {
    idea.attachments = await Promise.all(
      idea.attachments.map(async (a) => ({ ...a, url: await signAttachmentUrl(env, a.path, 3600) })),
    );
  }
  return json({ idea }, 200, cors);
}

// ── /api/draft?id=… (resume the intake for an Inbox/Assessment card — no token) ──
async function handleDraft(request, env, cors, url) {
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "id required" }, 400, cors);
  const idea = await getIdea(env, id);
  // Resumable = any PRE-BUILD card (Inbox/Assessment/Review/Pending Validation/Rejected)
  // — these lanes ARE the assessment step, so the intake conversation is the right thing
  // to (re-)open. Anything past assessment (WIP/Live/Archived) stays off-limits — its
  // prose is review-token gated via /api/idea.
  if (!idea || !PREBUILD_STAGES.includes(idea.stage || "inbox")) {
    return json({ error: "Not open for assessment" }, 404, cors);
  }
  return json({ idea: {
    id: idea.id, title: idea.title, one_liner: idea.one_liner,
    assessment: idea.assessment || {},
    transcript: Array.isArray(idea.transcript) ? idea.transcript : [],
    stage: idea.stage, status: idea.status,
  } }, 200, cors);
}

// ── /api/decision (Keitha's review — review-token gated) ───────────────────
async function handleDecision(request, env, cors) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  const body = await request.json();
  if (!body.ideaId || !body.decision) return json({ error: "ideaId and decision required" }, 400, cors);
  if (!ENUM_VALUES.decision.includes(body.decision)) return json({ error: "invalid decision" }, 400, cors);
  const existing = await getIdea(env, body.ideaId);
  if (!existing) return json({ error: "Not found" }, 404, cors);
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
  // Seed developer status only when the card is ENTERING WIP from a non-WIP stage
  // (or has none yet). Re-deciding an already-WIP card must not clobber a real
  // status like "blocked" or strand its reason.
  if (WIP_STAGES.includes(patch.stage) && (!WIP_STAGES.includes(existing.stage) || !existing.dev_status)) {
    patch.dev_status = "in_progress";
    patch.dev_status_reason = null;
  }
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

  // Archive / restore. "Archived" is the `parked` stage surfaced as its own board view.
  // The origin lane is remembered in the assessment jsonb so Restore returns it there.
  if (body.restore && idea.stage === "parked") {
    const from = idea.assessment && idea.assessment.archived_from;
    patch.stage = (from && STAGES.includes(from)) ? from : "review"; // guard a stale/renamed value
  }
  if (patch.stage === "parked" && idea.stage !== "parked") {
    assessment.archived_from = idea.stage;                 // archiving — remember where from
  } else if (idea.stage === "parked" && patch.stage && patch.stage !== "parked") {
    delete assessment.archived_from;                        // leaving the archive
  }
  patch.assessment = assessment;

  // A card sent BACK to Inbox/Assessment from a later stage is being re-assessed —
  // it's a draft again (correct pill + coherent state for the re-opened intake).
  if (["inbox", "assessment"].includes(patch.stage) && !["inbox", "assessment"].includes(idea.stage || "inbox")) {
    patch.status = "draft";
  }

  // Operational fields (Product Owner + developer status) — set on Build+ cards.
  if ("product_owner" in body) patch.product_owner = body.product_owner ? String(body.product_owner).slice(0, 120) : null;
  if ("dev_status" in body) patch.dev_status = DEV_STATUSES.includes(body.dev_status) ? body.dev_status : null;
  if ("dev_status_reason" in body) patch.dev_status_reason = body.dev_status_reason ? String(body.dev_status_reason) : null;

  // A genuine transition INTO Live = shipped → dev_status "done". Gated on a real
  // stage change so editing an already-live card can't clobber its set dev status —
  // and NOT on restore (restoring a card archived out of Live returns its prior
  // status, e.g. at_risk, rather than asserting it shipped).
  if (!body.restore && patch.stage === "live" && idea.stage !== "live" && patch.dev_status === undefined) patch.dev_status = "done";

  const saved = await updateIdea(env, body.ideaId, patch);
  return json({ ok: true, idea: publicView(saved), assessment: saved.assessment }, 200, cors);
}

// ── /api/publish (batch status updates from Keitha's Radar — token-gated) ───
// Reuses the shared applyUpdates core (also used by the Fireflies ingestion).
async function handlePublish(request, env, cors) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json({ error: "items[] required" }, 400, cors);
  // Cross-feed meeting dedup: when a batch is derived from ONE meeting, tag it with that
  // meeting's Fireflies id. A meeting is then applied at most once no matter which feed
  // pulls it — the stand-up cron and any Cowork pull share the same ingestion_log, so if
  // you and Keitha were both in the same call, whoever lands first wins and the other is a
  // no-op. A Radar-ARTIFACT publish carries no meeting id and is never deduped (correct —
  // the Radar isn't a meeting and should always sync). `force` re-applies regardless.
  const meetingId = body.source_meeting_id ? String(body.source_meeting_id).slice(0, 200) : null;
  if (meetingId && !body.force && (await wasProcessed(env, meetingId))) {
    return json({ ok: true, status: "already_ingested", source_meeting_id: meetingId, summary: {}, results: [] }, 200, cors);
  }
  const { results, summary } = await applyUpdates(
    {
      listIdeas: () => listIdeas(env),
      updateIdea: (id, patch) => updateIdea(env, id, patch),
      // Only /api/publish can create (add/upsert). The stand-up ingestion deliberately
      // omits this, so an unknown project from a stand-up is reported, never invented.
      createIdea: (patch) => createTrackedProject(env, patch),
    },
    items,
  );
  // Record the meeting as done so a second feed pulling it is a no-op — but ONLY once it
  // actually CHANGED the board (applied / created), and only when nothing transient failed.
  // A publish that matched nothing (all unmatched/ambiguous) — or only skipped cards that
  // happened to already be current — must not "claim" the meeting and block the stand-up
  // cron (the authoritative fallback) from processing it, in case the cron would surface a
  // project this batch didn't touch. A blip stays retryable (applyUpdates is idempotent, so
  // already-applied items re-apply as no-ops on the retry).
  const hadTransient = results.some((r) => r.status === "error" && r.transient);
  const didWork = results.some((r) => ["applied", "created"].includes(r.status));
  const recorded = !!(meetingId && didWork && !hadTransient);
  if (recorded) {
    await markProcessed(env, meetingId, { title: body.source_meeting_title || null, via: "publish", count: results.length }).catch(() => {});
  }
  // Surface review-worthy outcomes — new cards created, or names too close to an existing
  // card to auto-create — to Slack. Routine moves stay silent (the board shows those).
  await notifyPublish(env, results).catch(() => {});
  return json({ ok: true, status: hadTransient ? "retry_pending" : (recorded ? "ingested" : "ok"), source_meeting_id: meetingId || undefined, summary, results }, 200, cors);
}

// ── /api/ingest (manual "pull today's stand-up" — token-gated) ─────────────
// Same routine the cron runs, on demand. Needs FIREFLIES_API_KEY; without it we
// return a clear pointer to the Cowork fallback rather than a raw 500.
async function handleIngest(request, env, cors) {
  if (!authed(request, env)) return json({ error: "Unauthorized" }, 401, cors);
  if (!env.FIREFLIES_API_KEY) {
    return json({
      error: "FIREFLIES_API_KEY not set on the Worker — automated pull is not live yet.",
      hint: "Use the Cowork prompt in frontend-process/INGESTION.md (it runs via the Fireflies MCP, no Worker key needed), or set the key: `wrangler secret put FIREFLIES_API_KEY`.",
    }, 503, cors);
  }
  let opts = {};
  try { opts = (await request.json()) || {}; } catch (_) { /* body optional */ }
  const res = await ingest(buildIngestDeps(env), { force: !!opts.force });
  return json(res, 200, cors);
}

// Assemble the injected deps the ingestion routine needs from `env`.
function buildIngestDeps(env) {
  return {
    getLatestStandup: () => getLatestStandup(env),
    listIdeas: () => listIdeas(env),
    updateIdea: (id, patch) => updateIdea(env, id, patch),
    callAnthropic: (system, msgs, tools) => callAnthropic(env, system, msgs, tools),
    wasProcessed: (id) => wasProcessed(env, id),
    markProcessed: (id, meta) => markProcessed(env, id, meta),
    // No `notify` on purpose: the stand-up ingestion digest ("📥 Stand-up
    // ingested / ✅ Updated (N)…") is intentionally SILENT. The board already
    // reflects the moves, and only new-idea notifications are wanted in Slack
    // (notifySlack — a card sent for review; notifyPublish — new cards). The
    // stand-up router only ever *updates* existing projects (never creates), so
    // silencing this digest drops no new-idea signal. ingest() skips its Slack
    // post when deps.notify is absent.
  };
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
// extraHeaders (lowercase keys) may override content-type/prefer (e.g. `prefer` for
// upserts) but NOT the service-role auth headers — apikey/authorization are spread
// last so a future caller can never accidentally override the credentials.
async function supa(env, method, path, body, extraHeaders) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      prefer: "return=representation",
      ...(extraHeaders || {}),
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Minimal projection of live ideas for matching updates (title + current state).
async function listIdeas(env) {
  return await supa(env, "GET", "ideas?select=id,title,stage,dev_status,dev_status_reason&deleted_at=is.null");
}
async function getIdea(env, id) {
  // Exclude soft-deleted rows so a deleted idea reads as gone everywhere
  // (chat resume, /api/idea, review) — never silently written to or resurfaced.
  const rows = await supa(env, "GET", `ideas?id=eq.${encodeURIComponent(id)}&deleted_at=is.null&select=*`);
  return rows && rows[0];
}
async function createIdea(env, commissioned) {
  // New drafts land in Inbox — they only surface in Assessment once they have a
  // real title (see handleChat). Keeps "Untitled idea" cards out of Assessment.
  // A commissioned draft carries its mode + fixed client intent from the start.
  const seed = { title: "Untitled idea", stage: "inbox", status: "draft" };
  if (commissioned) { seed.intent = "client"; seed.assessment = { mode: "commissioned" }; }
  const rows = await supa(env, "POST", "ideas", seed);
  return rows[0];
}
async function updateIdea(env, id, patch) {
  patch.updated_at = new Date().toISOString();
  const rows = await supa(env, "PATCH", `ideas?id=eq.${encodeURIComponent(id)}`, patch);
  return rows[0];
}
// Create a "tracked" project directly, skipping the assessment funnel — used by
// /api/publish's add/upsert so established, off-pipeline projects can be put on the
// board. Marked mode:"tracked" so the board doesn't gate its moves on ideation sections.
async function createTrackedProject(env, patch) {
  const stage = patch.stage || "build";
  const rows = await supa(env, "POST", "ideas", {
    title: patch.title,
    one_liner: patch.one_liner || null,
    stage,
    status: "validated",
    intent: patch.intent || null,
    dev_status: patch.dev_status || (WIP_STAGES.includes(stage) ? "in_progress" : null),
    dev_status_reason: patch.dev_status_reason || null,
    product_owner: patch.product_owner || null,
    repo_url: patch.repo_url || null,
    kanban_url: patch.kanban_url || null,
    staging_url: patch.staging_url || null,
    production_url: patch.production_url || null,
    assessment: { mode: "tracked" },
  });
  return rows[0];
}

// ── Attachment storage (private idea-attachments bucket, service-role only) ──
const ATTACH_BUCKET = "idea-attachments";
const MAX_TOTAL_FILES = 20; // cumulative cap per idea (per-file/size caps live in attachments.js)
// Store one attachment's ORIGINAL bytes and return its metadata (name/type/kind/path/size).
// A random path component makes the key collision-proof across turns/retries.
async function uploadAttachment(env, ideaId, att) {
  const safe = String(att.name || "file").replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80) || "file";
  const path = `${ideaId}/${Date.now()}-${crypto.randomUUID()}-${safe}`;
  const bytes = base64ToBytes(att.data);
  const res = await fetch(`${env.SUPABASE_URL}/storage/v1/object/${ATTACH_BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": att.type,
    },
    body: bytes,
  });
  if (!res.ok) throw new Error(`Storage ${res.status}: ${await res.text()}`);
  return toMeta(att, path);
}
// Best-effort delete (used to reclaim just-uploaded objects when the turn then fails).
async function cleanupAttachments(env, metas) {
  for (const m of metas || []) {
    if (!m || !m.path) continue;
    try {
      await fetch(`${env.SUPABASE_URL}/storage/v1/object/${ATTACH_BUCKET}/${m.path}`, {
        method: "DELETE",
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
      });
    } catch (_) { /* best-effort */ }
  }
}
// Short-lived signed URL for viewing an original (reviewers only, via /api/idea).
async function signAttachmentUrl(env, path, expiresIn) {
  if (!path) return null;
  try {
    const res = await fetch(`${env.SUPABASE_URL}/storage/v1/object/sign/${ATTACH_BUCKET}/${path}`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ expiresIn }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    return j && j.signedURL ? `${env.SUPABASE_URL}/storage/v1${j.signedURL}` : null;
  } catch (_) { return null; }
}

// ── Ingestion idempotency (ingestion_log) ──────────────────────────────────
// A transcript is processed at most once (the cron can fire repeatedly with the
// same latest stand-up). `force` on /api/ingest bypasses this via ingest().
async function wasProcessed(env, transcriptId) {
  const rows = await supa(
    env, "GET",
    `ingestion_log?select=transcript_id&transcript_id=eq.${encodeURIComponent(transcriptId)}`,
  );
  return Array.isArray(rows) && rows.length > 0;
}
async function markProcessed(env, transcriptId, meta) {
  // Upsert so a forced re-run doesn't collide on the primary key.
  await supa(env, "POST", "ingestion_log?on_conflict=transcript_id", {
    transcript_id: transcriptId, processed_at: new Date().toISOString(), result: meta || null,
  }, { prefer: "resolution=merge-duplicates,return=minimal" });
}

// Soft-delete abandoned empty drafts older than 24h. Belt-and-suspenders now that
// the opening greeting no longer creates a row — catches any stragglers. Returns count.
// `transcript=is.null` restricts this to create-without-follow-up rows (createIdea ran
// but the first turn's updateIdea never persisted a transcript, e.g. Claude threw), so
// a draft that accumulated any real conversation is never pruned.
async function pruneEmptyDrafts(env) {
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const rows = await supa(
    env, "PATCH",
    `ideas?status=eq.draft&title=eq.Untitled%20idea&one_liner=is.null&transcript=is.null&deleted_at=is.null&created_at=lt.${encodeURIComponent(cutoff)}`,
    { deleted_at: new Date().toISOString() },
  );
  return Array.isArray(rows) ? rows.length : 0;
}

// ── Slack ──────────────────────────────────────────────────────────────────
async function notifySlack(env, idea) {
  if (!env.SLACK_WEBHOOK_URL) return;
  const site = env.SITE_URL || "https://coreshifthqnz.github.io/coreshift-kanbans";
  const link = `${site}/frontend-process/#idea=${idea.id}`;
  const dials = [idea.intent, idea.confidence, idea.decision].filter(Boolean).join(" · ") || "—";
  // Tag the reviewer so they're actually pinged (a mention in the section text notifies).
  // Defaults to Keitha's Slack id; override per-deploy with SLACK_REVIEWER_MENTION (a
  // different reviewer, or a group handle like <!subteam^ID>).
  const reviewer = env.SLACK_REVIEWER_MENTION || "<@U08TBQKNDMF>"; // Keitha
  await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `${reviewer} 💡 New idea for review: *${idea.title}* — ${idea.one_liner || ""}`,
      blocks: [
        { type: "section", text: { type: "mrkdwn",
          text: `*💡 New idea submitted for review*\n*${idea.title}*\n${idea.one_liner || ""}\n\n${reviewer} — ready for your review 👀` } },
        { type: "context", elements: [{ type: "mrkdwn", text: `Route: ${dials}   ·   from ${idea.submitter_name || "someone on the team"}` }] },
        { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Review assessment" }, url: link }] },
      ],
    }),
  });
}

// Review ping for a Radar/publish batch: which projects were newly CREATED, and which
// came back AMBIGUOUS (name too close to an existing card to auto-create — needs a human
// to reconcile). Routine moves/updates are intentionally omitted so this stays low-noise.
// No-ops when there's nothing review-worthy, or when Slack isn't wired up.
async function notifyPublish(env, results) {
  if (!env.SLACK_WEBHOOK_URL || !Array.isArray(results)) return;
  const created = results.filter((r) => r.status === "created");
  const ambiguous = results.filter((r) => r.status === "ambiguous");
  if (!created.length && !ambiguous.length) return;
  const site = env.SITE_URL || "https://coreshifthqnz.github.io/coreshift-kanbans";
  const attempted = (r) => (r.item && (r.item.title || r.item.match)) || "?";
  const lines = ["🛰 Radar publish"];
  if (created.length) lines.push(`🆕 Created (${created.length}): ${created.map((r) => r.title).join(", ")}`);
  if (ambiguous.length) lines.push(`⚠️ Name check (${ambiguous.length}) — not created, looks like an existing card: ${ambiguous.map((r) => `"${attempted(r)}" ↔ "${r.title}"`).join(", ")}`);
  lines.push(`${site}/frontend-process/`);
  await slackText(env, lines.join("\n"));
}

// Post a plain-text message to Slack (the stand-up ingestion digest). No-ops if
// SLACK_WEBHOOK_URL is unset, so ingestion still works before Slack is wired up.
async function slackText(env, text) {
  if (!env.SLACK_WEBHOOK_URL || !text) return;
  await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
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
    // Intake mode so the board can special-case commissioned cards (different section
    // set, and no ideation-funnel move-gating — they're already approved).
    mode: (idea.assessment && idea.assessment.mode) || "standard",
    // Count only (not paths/URLs) — the board is public; originals are token-gated.
    attachment_count: Array.isArray(idea.attachments) ? idea.attachments.length : 0,
    // Origin lane for an archived (parked) card, so the drawer can offer "Restore to …".
    archived_from: (idea.assessment && idea.assessment.archived_from) || null,
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
