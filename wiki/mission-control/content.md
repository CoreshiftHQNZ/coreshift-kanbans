# Mission Control

Coreshift's CRM / WIP / sales-pipeline platform. The core idea: **an autonomous awareness layer over our client work.**

The agent ingests signals — GitHub merges, Google Drive activity, Gmail, Calendar, Xero — nightly, and projects them into a per-company timeline of structured events. Each morning a digest lands in Google Chat surfacing only what crossed an attention rule. Plus an `@client/#topic`-scoped AMA chat over the whole index.

---

## Resources

| Resource | Identifier |
|----------|-----------|
| GitHub repo | [CoreshiftHQNZ/mission-control](https://github.com/CoreshiftHQNZ/mission-control) |
| Default branch | `dev` (flow: `dev` → `staging` → `main`) |
| Supabase project | `mission-control` (`hwugqukvovfjsviqxqpj`), CoreShift org, `ap-southeast-2` |
| Cloudflare zone | `coreshifthq.com` |
| Custom domain | `mc.coreshifthq.com` |
| Predecessor | [mission-control-legacy](https://github.com/CoreshiftHQNZ/mission-control-legacy) — archived; crib working esignatures.com / Postmark / Xero OAuth / Anthropic scope-chat code |

This is a [Tier 3 web app](../tech-stack/) — React + Vite client, Express API on Railway, Supabase Postgres.

---

## Auth

Sign-in is **Google OAuth restricted to `@coreshifthq.com`**, enforced two ways (defence in depth):

1. **Supabase Auth setting** — "restrict signups by email domain" set to `coreshifthq.com`.
2. **Server middleware** — `isCoreshiftEmail()` rejects any JWT whose email isn't `@coreshifthq.com`, in case the Supabase setting drifts.

First login auto-provisions a `users` row with `role=member`. Promote to `admin` manually in the DB. See the general [Auth standards](../auth/) for the underlying pattern.

---

## Data model

13 tables across three layers (canonical definitions in `shared/schema.ts`):

1. **Entities** — `companies` (domain-keyed) → `contacts`, `projects` → `repos`, `milestones`
2. **Timeline + AMA index** — `events_observed` (deterministic API pulls, dedupe via `(source, source_id)`) → `events_extracted` (LLM-derived, cites observed events) → `documents` → `document_chunks` (pgvector + tag arrays)
3. **Outputs + overrides** — `field_projections` (cached current-state, re-run nightly) → `digest_runs` (audit) → `notes` (human entries, the override surface)

Plus `users` (Supabase Auth link + workspace email for ingestion identity) and `audit_logs`.

---

## Key conventions & gotchas

- **3am NZ cron** — nightly ingestion + extraction + projection runs ~03:00 Pacific/Auckland; posts the morning digest ~07:00. (Cron not yet wired.)
- **pgvector** — `document_chunks.embedding` is 1536d (OpenAI `text-embedding-3-small`). The HNSW index is added via a one-shot SQL migration after `npm run db:push` (drizzle-kit doesn't reliably create vector indexes).
- **Workspace ingestion** — domain-wide delegation via a service account reads any `@coreshifthq.com` user's Gmail/Drive/Calendar. Configured once in Workspace admin. Per-user OAuth is explicitly **not** how this works.
- **Engagement state machine** — `lead → discovery → proposal → won → active → archived` (or `lost`). "Client" = a project at `won` or beyond; there's no separate client entity.
- **Domain auto-creation** — an unknown domain emailing Coreshift auto-creates a `companies` row + default `projects` row in `lead` state.
- **#tag vocabulary** — a small controlled vocabulary applied by the LLM during indexing. Defined in code; resist ad-hoc tags or autocomplete dies.
- **@mention syntax** — `@<company-shortname>`, `@<company>/<project>` for project scope, `#<tag>` for topic filter, used in the AMA chat.
- **Crib from legacy** — anything to do with esignatures.com, Postmark templates, Xero OAuth refresh, or Anthropic conversational flows: copy from the archived legacy repo rather than redesigning.

---

## Local development

```bash
git clone https://github.com/CoreshiftHQNZ/mission-control.git
cd mission-control
cp .env.example .env.local       # fill in real values
npm install
npm run db:push                  # push current schema to your dev Supabase
npm run dev                      # http://localhost:5000
```

For schema changes: edit `shared/schema.ts`, then `npm run db:push` — drizzle-kit prompts before any destructive change.

Environment values live in **Railway env vars** (per environment) or **`.env.local`** (gitignored) — never committed. See the repo's `CLAUDE.md` and `.env.example` for the full variable list (`DATABASE_URL`, `SUPABASE_*`, `VITE_SUPABASE_*`, `STORAGE_BUCKET`, plus the future ingestion creds for OpenAI, Anthropic, Google Workspace, GitHub, and Xero).

---

## Deploy flow

```
local → push to dev → CI build check → auto-push to staging → Railway deploys staging
manual GitHub Actions "Deploy to Production" → push staging to main → Railway deploys production
```

Never push directly to `main`. Always go through `staging`. (Same convention as every Coreshift app — see [Account & Tooling Access](../access/).)
