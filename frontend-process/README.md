# Frontend Process — idea intake + pipeline

The front-of-house for Coreshift product work: submit an idea through an in-page
conversation that runs Keitha's assessment framework, and see every idea move
across the lifecycle pipeline. It wraps the build engine (the `coreshift-ideation`
plugin) — the plugin builds; this decides what's worth building and records the call.

## Pages (static, on this Pages site)

| Page | What it does |
|---|---|
| `frontend-process/index.html` | The **pipeline board** — every idea as a card across Ideation → Product → Abify → Business/Gov → Final. Click a card to review and set a decision. |
| `frontend-process/submit.html` | **Submit an idea** — an in-page conversation that fills the App Assessment live and sends it to Keitha for review. |

Both pages run in **demo mode** out of the box (self-contained sample data + a
scripted conversation) so they work with no backend. Set `workerUrl` in
`config.js` to the deployed Worker and they go **live**.

## How it works

The plugin's skills can't run in a browser, so the in-page conversation runs the
*same brain* a different way: the `app-assessment` framework becomes the system
prompt of a Claude API conversation, served by a Cloudflare Worker. Same
questions, same voice; no install, no session, no model-switching for the ideator.

```
ideator → submit.html (chat) ─▶ idea-intake Worker ─▶ Claude API (assessment convo)
                                        │
                                        ├▶ Supabase `ideas` (persist)
                                        └▶ Slack #frontend-process (notify Keitha)
Keitha  ← board (index.html) ── review overlay ─▶ Worker /api/decision ─▶ card moves
```

- **Worker:** `worker/` — one dependency-free Cloudflare Worker. Endpoints:
  `POST /api/chat`, `POST /api/submit`, `GET /api/ideas`, `GET /api/idea` (gated),
  `POST /api/decision` (gated).
- **Data:** Supabase project **`frontend-process`** (`yusggtnusduelymxrcmt`,
  CoreShift org, ap-southeast-2). Table `public.ideas`, RLS on with no policies —
  all access is via the Worker's service-role key (see `schema.sql`). Assessment
  content never touches the public page; the board only gets safe fields.
- **Spec:** `worker/src/spec.js` is the single source of truth for the conversation
  and mirrors the plugin's `app-assessment` skill. Keep them in step.

## Deploy (to go live)

**1. Deploy the Worker** (from `frontend-process/worker/`, needs Cloudflare login):

```bash
cd frontend-process/worker
npm install
npx wrangler deploy
```

**2. Set the secrets** (each prompts for the value — nothing is committed):

```bash
npx wrangler secret put ANTHROPIC_API_KEY          # an Anthropic API key
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY  # Supabase → frontend-process → Settings → API → service_role
npx wrangler secret put SLACK_WEBHOOK_URL          # a Slack incoming webhook posting to #frontend-process
npx wrangler secret put REVIEW_TOKEN               # any strong string; Keitha enters it once to review
```

`SUPABASE_URL`, `MODEL`, `SITE_URL`, and `ALLOWED_ORIGINS` are already set in
`wrangler.toml` (not secret).

**3. Point the pages at the Worker:** set `workerUrl` in `config.js` to the
deployed URL (e.g. `https://idea-intake.<your-subdomain>.workers.dev`), commit,
and Pages republishes. The demo badge disappears and everything is live.

## Before real use — gating

This Pages site is public (noindex). Before opening the intake to real traffic,
put the `frontend-process/` pages behind **Cloudflare Access** (Google, restricted
to `@coreshifthq.com`, same pattern as Mission Control), and/or add Turnstile +
rate limiting on the Worker's `/api/chat`. Until then, treat it as demo/internal
only — an open `/api/chat` spends Anthropic tokens per request.

## Cost

Supabase project ~$10/mo. Claude API is per-conversation (Sonnet 5 by default —
change `MODEL` in `wrangler.toml`). Cloudflare Worker is within the free tier at
this volume.
