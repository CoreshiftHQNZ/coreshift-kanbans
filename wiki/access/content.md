# Account & Tooling Access

How the Coreshift machine fits together — the accounts every project shares, what's authenticated where, and the rules that move code from a laptop to production.

---

## The backbone

Every Coreshift build sits on the same four pillars. A project climbs a [tier](../tech-stack/) by *adding* tools, never by switching ecosystems.

| Layer | Provider | Notes |
|-------|----------|-------|
| **Source** | GitHub | Org `core-ricky` / `CoreshiftHQNZ` |
| **Deploy** | Railway | Automatic via GitHub Actions |
| **Database** | Supabase | Org `CoreShift` — the DB for every app unless stated otherwise |
| **DNS / edge** | Cloudflare | Usual default — **confirm per project**, not universal |

---

## What's authenticated, and how

These are wired in at the account level — no per-session login required.

| Tool | Access method | Auth identity |
|------|---------------|---------------|
| **GitHub** | `gh` CLI | `core-ricky` — scopes: `gist`, `read:org`, `repo`, `workflow`. Orgs: `CoreshiftHQNZ`, `Altitude-Counselling` |
| **Supabase** | MCP connector | Org `CoreShift` — project/branch mgmt, SQL, migrations, edge functions, types, advisors, logs |
| **Cloudflare** | MCP connector | Accounts: `CoreshiftHq`, `Ricky@coreshifthq.com`, `Ricky@vyne.co.nz` — Workers, D1, KV, R2, Hyperdrive, DNS |
| **Railway** | `railway` CLI | `ricky@coreshifthq.com`, workspace **Coreshift HQ** — logs, status, variables, list |

**Rule of thumb:** prefer the MCPs where they exist (structured, pre-authed). Use the CLIs for the rest. For DB schema or data work, use the Supabase MCP — never raw SQL on prod.

---

## Deploy flow

Coreshift does **not** deploy to Railway manually. Code is pushed to the right branch and CI handles the rest.

```
local  →  push to dev  →  CI build check
       →  merge to staging   →  Railway deploys STAGING   (automatic)
       →  merge to main      →  Railway deploys PRODUCTION (automatic)
```

- Push to `staging` → Railway **staging** environment.
- Push to `main` → Railway **production** environment.
- Use the `railway` CLI for log inspection or env-var changes only — never for manual deploys.

---

## Branch hygiene

- **Never push directly to `main`.** Always go through `staging`.
- A change reaches prod by: feature branch → PR into `dev` (or directly to `staging` for small changes — confirm per project) → merge to `staging` (auto-deploys) → PR `staging` → `main` (auto-deploys).

---

## Serve, don't delegate

The quality bar for any work done in a Coreshift session: **if the access is already there, use it.** Resolve placeholders before handing them over, return finished clickable artifacts (full URLs, exact commands, exact file paths), and anticipate the next step rather than punting it back. Each "go look this up yourself" is a tax on attention — and almost always, the access to just do it is already in hand.

---

## Project kanbans

Every project's build board lives in **[coreshift-kanbans](https://github.com/CoreshiftHQNZ/coreshift-kanbans)** — this same repo. The boards are the canonical "where are we at" answer and are kept in sync *as part of the work*, not as a separate pass.

- Browse them at **[Project boards](../../boards/)**.
- Edit a board: `<slug>/KANBAN.md` → commit → push to `main` → Pages republishes in ~10s.
- The kanbans repo is intentionally decoupled from project release pipelines, so docs move at the speed of conversation.
