# How Claude Works — the parts, and which ones are yours

Everyone at Coreshift runs Claude. Almost nobody can say what a *skill* is versus a *plugin*
versus a *command*, or why a *connector* and an *MCP* seem like the same thing. This page fixes
that, lists what we've already set up, and marks clearly which bits are **central** (you get them
free) versus **yours** (you should customise them).

If you only read one section, read the two questions below. They clear up most of the confusion.

---

## Question 1 — is it telling Claude *how to behave*, or *what it can do*?

This is the main axis, and it's the one people miss.

| | |
|---|---|
| **Instructions** — how to behave | CLAUDE.md · skills · commands · hooks · plugins |
| **Tools** — actions it can take | MCP servers · connectors |

A skill can tell Claude *"always run the auditor before calling a build done."* It cannot give
Claude the ability to query our database. An MCP server gives Claude `execute_sql`. It has no
opinion about when to use it.

**You usually need both.** Our site-build workflow is instructions (the phase skills) driving
tools (the Supabase and Cloudflare connectors).

## Question 2 — when does it load?

| | Loads | Costs context | Use it for |
|---|---|---|---|
| **CLAUDE.md** | Always, every session | Every turn | A handful of rules that must never be missed |
| **Skill** | When Claude judges it relevant, or you name it | Only when used | Deep procedures you don't want in every conversation |
| **Command** | When you type `/name` | Only when used | Things *you* decide to run |
| **Hook** | Automatically, at a lifecycle event | Nothing | **Guarantees.** It fires whether Claude thinks of it or not |

That last row is the important one. Everything else is Claude *choosing* to follow an instruction.
A hook is the harness *executing* something. If it absolutely must happen, it's a hook.

---

## The glossary

### CLAUDE.md
Plain markdown, loaded into every session. Two levels:

- `~/.claude/CLAUDE.md` — **yours.** Follows you across every project.
- `./CLAUDE.md` in a repo — the project's rules. Overrides yours where they conflict.

Keep it short. Everything in here is paid for on every single turn, so a 500-line CLAUDE.md makes
every conversation more expensive and buries the rules that matter.

### Skill
A folder with a `SKILL.md` — instructions, plus any reference files or scripts it needs. Each has a
one-line description. Claude reads only the descriptions, then pulls in the full skill when it looks
relevant. You can also invoke one by name.

Because they're lazy-loaded, you can have fifty skills and pay for none until one is used. That's
the whole point.

*Ours:* the `coreshift-site-builder` phase skills — `client-intake`, `information-architecture`,
`build-site`, `qa-acceptance` and the rest.

### Slash command
A prompt template in `commands/<name>.md`, run by typing `/name`.

**Skill or command?** They overlap — both show up when you type `/`. The real difference:
a **skill** can be triggered by Claude noticing it's relevant; a **command** only runs when you ask.

> *"Claude should know to do this"* → skill.
> *"I want this now"* → command.

### Hook
A shell command the harness runs at a fixed event — session start, after a file is written, when
Claude stops. Deterministic and unskippable.

*Ours:* a `Stop` hook on Live Edit builds that reminds us to run `/site-audit` before calling a
build done. Not a suggestion Claude might forget — a thing that happens.

### Plugin
The shipping container. Bundles skills + commands + hooks + agents + assets into one installable
unit, version-controlled in a repo. Push an update and everyone who has it installed gets it.

A plugin is not a capability. It's how capabilities travel between people.

### Marketplace
A git repo listing plugins. Ours is
[CoreshiftHQNZ/coreshift-plugins](https://github.com/CoreshiftHQNZ/coreshift-plugins).

### MCP server
MCP (Model Context Protocol) is the standard for handing Claude **tools**. An MCP server exposes
things like `execute_sql`, `list_projects`, `send_message`. Configured per machine.

### Connector
**A connector is an MCP server** — the difference is how it's installed and authenticated, not what
it does. A connector is packaged for one-click OAuth sign-in through claude.ai, and once connected
it follows your account across every surface. A hand-configured MCP lives on one machine.

So when someone asks "connector or MCP?": same thing, easier install. Prefer the connector.

### Subagent
A separate Claude with its own fresh context, given a task, returning a summary. It does **not** see
your conversation — everything it needs has to be in the brief. Great for searching thirty files and
reporting back. Bad for anything needing taste or judgement.

### Memory
Facts Claude records per project and recalls automatically next time — decisions, constraints,
preferences. Not a substitute for the wiki: memory is one person's context, the wiki is ours.

---

## What Coreshift already has

**Marketplace** — `CoreshiftHQNZ/coreshift-plugins`

**Plugins** — `coreshift-site-builder`: the full client-website build workflow, intake through
launch, with Live Edit baked in.

**Connectors** (one-click, pre-authorised — see [Account & access](../access/))
Supabase · Cloudflare · Stripe · Slack · Gmail · Google Drive · Dynadot

**CLIs Claude drives through the shell** — `gh` (GitHub) · `railway` · `wrangler` · `supabase`

**Where the rules live** — [Build standards](../build-standards/) ·
[Architecture](../architecture/) · [AI Practices](../ai-practices/)

---

## Central vs yours

| | Who owns it | What to do |
|---|---|---|
| Plugins, skills, commands, hooks | **Coreshift** — via the marketplace | Install and leave alone. Improvements go in as a PR so everyone gets them |
| Connectors | **Coreshift picks, you authorise** | Connect the ones your work needs. Your auth is yours |
| `~/.claude/CLAUDE.md` | **You** | Customise freely — this is where you tell Claude how you want to be worked with |
| A project's `./CLAUDE.md` | **The project** | Change via PR like any other file |
| Memory | **You** | Personal. Nothing to maintain |

**The one you should actually spend time on is your own `CLAUDE.md`.** It's the highest-leverage
file you own — how blunt you want Claude to be, how much detail you want, whether it should act or
ask first, what it should never do without checking. Ten minutes there is worth more than any
plugin.

### 🔑 If something's missing, say so

If a task is blocked because there's no connector, no CLI, or a token is missing scope — that's a
gap to close, not a limitation to work around. Ask Claude to name the exact remedy and raise it.
We'd rather fix access once than have five people quietly working around it.

---

## How our work survives across the org

This is the part that makes Claude a team tool instead of five private assistants.

**A session is private and temporary. The board is shared and permanent.**

Nothing in your conversation exists for anyone else until it's written to a project board in
`coreshift-kanbans`. So the rule is simple:

1. **Work happens in a session** — one milestone at a time.
2. **When the milestone lands, the board is updated in the same breath.** Not later, not as a
   separate tidy-up pass. A board that overstates progress is worse than no board.
3. **Anyone can then read where a project stands**, in plain language, without opening a session or
   knowing anything technical — see [Project boards](../../boards/).

A **milestone** is a promise you can verify — *"the churn email fires on a real cancel."*
A **card** is a unit of work. You report milestones to the team; cards are between you and Claude.
If you can't write a one-sentence test for it, it's a card, not a milestone.

> ⏳ **Coming:** a `coreshift-os` plugin will make this automatic — a session opens knowing exactly
> where its project stands, and closes by updating the board and handing you the prompt for the next
> step. Until it ships, keeping boards current is a manual discipline.

---

## Where to go next

- **Setting up for the first time** → [Setup & onboarding](../setup/)
- **What's authenticated and how** → [Account & access](../access/)
- **Starting something new** → [Start a new project](../new-project/)
- **Getting more out of Claude** → [AI Practices](../ai-practices/)
