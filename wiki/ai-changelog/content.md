# Radar Changelog

A dated log of every weekly AI Radar run — what topics were added or edited on [AI Practices](../ai-practices/) and [Claude Updates](../claude-updates/), so older versions are always traceable. Newest first.

> Why this exists: topic pages are edited *in place* to avoid duplicates, which means the live page only shows the current version. This log is the memory — it records what changed each week, so we can revisit or roll back any past update via the page's Git history.

---

## 2026-07-06 — Weekly refresh

*Scanned the watchlist for items published 29 Jun – 6 Jul. Merged onto the live page, which had already been updated via the #wiki-submissions pipeline (Fable 5 redeployment) and now carries the "Share a find" submissions box — both preserved.*

**Claude Updates**

- **Added: Week of 6 Jul 2026 (new block at top)** — Claude Sonnet 5 launched (30 Jun, 1M context, $2/$10 intro, now the Claude Code default); Fable 5 confirmed live globally from 1 Jul (last week's block already flagged the redeployment); Claude Enterprise admin analytics + model entitlements + spend alerts (2 Jul); Claude Science beta (30 Jun); the industry jailbreak-severity framework; and Claude Code 2.1.196–2.1.201 (Manual permission default, AskUserQuestion no longer auto-continues, Claude in Chrome GA, background sub-agents + auto draft PR, `/dataviz`, Explore inherits model, org default models). Older weeks left intact.

**AI Practices**

- **Edited topic: Evals & self-verifying agents** — added the **agent development lifecycle (ADLC: Build → Test → Deploy → Monitor)** framing from the June LangChain newsletter.
- **Edited topic: Context engineering for coding agents** — merged in **context rot / Recursive Language Models** (LangChain, 1 Jul) and **cognitive debt** (Simon Willison on Geoffrey Litt's AIE talk, 2 Jul). **Featured a fresh video** — Cole Medin's *"The Best AI Coding Setup Isn't the Most Autonomous One"* (3 Jul 2026): the five levels of AI coding, and why **Level 3 (in the loop, reviewing every change)** beats chasing full autonomy. *(The AI Engineer World's Fair talk recordings — incl. Geoffrey Litt's — are still trickling onto YouTube over ~3 weeks, so they couldn't be embedded this run.)*
- **Added topic: Model routing & cost-efficient agents** — Sonnet 5's cost-performance curve + Simon Willison's lower-power-model routing + Claude Code's org default models / Explore model inheritance. Flagged as a standout; deck attached.
- **Added topic: AI security — assessing jailbreak severity** — Anthropic + Amazon/Microsoft/Google 4-criteria jailbreak-severity framework and the defense-in-depth "safety margin" idea, from the Redeploying Fable 5 post. Markdown only.

**Assets**

- Added deck: `ai-radar/decks/Model-Routing-and-Cost-Efficient-Agents.pptx`.

---

## 2026-06-30 — Weekly refresh (run #1)

**AI Practices**

- **Edited topic: Agent Skills** — merged in *progressive disclosure* as the load-bearing pattern (Matt Pocock's `mattpocock/skills` v1.0, ~63% lower token cost); added second source.
- **Added topic: Evals & self-verifying agents** — Karpathy's verifiability framework (V1/V2/V3, "automate what you can verify") + LangChain's new Deep Agents *RubricMiddleware*. Flagged as a standout; deck attached.
- **Added topic: Context engineering for coding agents** — Cole Medin's context-engineering method + the late-June `CLAUDE.md` momentum; ties into the evals topic.

**Claude Updates**

- **Refreshed: Week of 30 Jun 2026 (in place)** — corrected the Fable 5 / Mythos 5 access status (12 Jun US suspension; 26 Jun partial Mythos 5 restoration for vetted US critical-infra only; Fable 5 still suspended for general users). Added Claude Tag (Slack, 23 Jun), Trusted Devices (25 Jun), API rate-limit increase + tier consolidation (26 Jun), Opus 4.7 fast-mode deprecation (25 Jun), and Claude Code 2.1.169–2.1.195. Same calendar week as launch, so refreshed rather than duplicated.

**Assets**

- Added deck: `ai-radar/decks/Evals-and-Self-Verifying-Agents.pptx`.

---

## 2026-06-30 — Radar launch

**AI Practices**

- **Added topic: Agent Skills** — the trigger / structure / steering / pruning checklist, from Matt Pocock's "The Missing Manual." Flagged as a standout; full deck attached.

**Claude Updates**

- **Added: Week of 30 Jun 2026** — Fable 5 GA + Mythos 5 LA, Sonnet 4 / Opus 4 retired, Claude Code `/rewind` and MCP/OAuth improvements, MCP tunnels + self-hosted sandboxes, Azure Foundry GA.

**Assets**

- Added deck: `ai-radar/decks/Building-Great-Agent-Skills.pptx`.

---

*Each future run appends a dated entry here.*
