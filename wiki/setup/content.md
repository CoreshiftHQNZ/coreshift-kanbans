# Setup & Onboarding

Getting a new teammate — or a fresh machine — working the way every Coreshift session is configured: GitHub, Supabase, Cloudflare, and Railway reachable from every Claude session, with our build conventions loaded automatically.

**Total time:** ~10–25 minutes, done once.

---

## Two ways to work

| Path | What it is | Setup |
|------|-----------|-------|
| **Claude Desktop** | Point-and-click connectors for the tools we use daily | Tier 1 connectors (~15 min) + Tier 2 pairing with Ricky |
| **Claude Code CLI** | Terminal-based, full account access via CLIs | One prompt installs and authenticates everything (~10 min) |

Both end in the same place: the four pillars ([GitHub, Supabase, Cloudflare, Railway](../access/)) reachable from any session.

---

## Supported environments

- **macOS** + Claude Desktop **or** Claude Code CLI
- **Windows 11 with WSL2 (Ubuntu)** + Claude Desktop or CLI — installs into your WSL Ubuntu home, not Windows directly
- **Linux** + Claude Code CLI

> Windows-native (PowerShell/cmd, no WSL) is **not** supported. Install [WSL2 with Ubuntu](https://learn.microsoft.com/windows/wsl/install) first and run inside the WSL Ubuntu shell.

### Prerequisites

You need **Node.js**, **npm**, and **Python 3**.

- **macOS** — `python3 --version` (installs Xcode Command Line Tools if prompted); `node --version` (else grab the LTS `.pkg` from [nodejs.org](https://nodejs.org/)).
- **Linux / WSL Ubuntu** — `sudo apt update && sudo apt install -y nodejs npm python3 curl unzip`, then verify with `node --version && npm --version && python3 --version`.

---

## Claude Desktop — connector tiers

Setup is split into two tiers. Do Tier 1 yourself; Tier 2 needs a quick 15-minute pairing session with Ricky.

### Tier 1 — do it yourself (~15 min)

Paste one URL per tool and log in with Google. These all have official remote connectors:

- **Google Workspace** — Gmail, Drive, Calendar (built into Claude)
- **GitHub** *(note: we use the `gh` CLI in Claude Code, not a Desktop connector)*
- **Supabase** — grant the **CoreShift** workspace
- **Cloudflare** — grant the Coreshift account
- **Railway**
- **Figma**, **Miro**, **Canva**

### Tier 2 — pair with Ricky (~15 min)

These need a small local install, so book time:

- **Xero**
- **Google Analytics**
- **Google Search Console**
- **Google Cloud Console**

---

## Claude Code CLI — one prompt

If you're on the CLI, the teammate setup prompt does the technical work for you: it checks prerequisites, installs the `gh` and `railway` CLIs, wires up the Supabase and Cloudflare MCPs, authenticates each (you'll run a few short browser-login commands), and drops the Coreshift build conventions into your user-level config so every future session inherits them.

You'll be asked to run a handful of short Terminal commands during the process — all browser-based logins. After that, the conventions in [Account & Tooling Access](../access/) are loaded automatically into every session.

---

## After setup

- Every session can reach GitHub, Supabase, Cloudflare, and Railway.
- The [deploy flow and branch hygiene](../access/) rules are loaded automatically.
- For app projects, clone the repo and follow its `README` / `CLAUDE.md` — e.g. [Mission Control](../mission-control/) has its own local-dev steps.

> The canonical onboarding documents (`teammate-setup.md`, `coreshift-claude-desktop-setup.md`) live in the Coreshift HQ working directory. This page is the wiki-facing summary — keep it in step with those if the flow changes.
