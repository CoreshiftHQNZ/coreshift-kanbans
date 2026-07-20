# Radar Changelog

A dated log of every weekly AI Radar run — what topics were added or edited on [AI Practices](../ai-practices/) and [Claude Updates](../claude-updates/), so older versions are always traceable. Newest first.

> Why this exists: topic pages are edited *in place* to avoid duplicates, which means the live page only shows the current version. This log is the memory — it records what changed each week, so we can revisit or roll back any past update via the page's Git history.

---

## 2026-07-20 — Weekly refresh

*Scanned the watchlist for items published 13–20 Jul. The week's defining signal — the AI Engineer World's Fair 2026 recap converging on **"harness engineering" / "loop engineering"** — was significant enough to warrant a new deck (attached to Context engineering). A cluster of agent-security disclosures also merged into the security topic, which was simultaneously repaired (its truncated sentence from earlier runs is now completed).*

**AI Practices**

- **Edited topic: Context engineering for coding agents** — merged in **harness engineering** (Lilian Weng) and **loop engineering** (human owns the outer loop: direction/evals/high-risk review; agent runs the inner execution loop) from Latent Space's [AIEWF 2026 trends recap](https://www.latent.space/p/aiewf26trends) (14 Jul). Flagged as a **standout; new deck attached.**
- **Edited topic: AI security** — **repaired the pre-existing truncation** (completed the 4-criteria jailbreak-severity list — capability gain, breadth, ease of weaponization, discoverability — plus the defense-in-depth / safety-margin framing) and **renamed** to *"jailbreaks, exfiltration & safe agent execution."* Merged in this week's disclosures: the **`web_fetch` lethal-trifecta exfiltration** hole & fix (Ayush Paul / Simon Willison, 15 Jul), **always sandbox + review coding agents** (GPT-5.6 Codex file-deletion bug, 16 Jul), and **audit what agent CLIs transmit by default** (grok-build data-upload, 15 Jul).
- **Edited topic: Agent Skills** — merged in the maturing **"skill engineering" discipline**: Matt Pocock's end-to-end `mattpocock/skills` workflow video (17 Jul), the AIEWF "skills everywhere / fewer-smaller-tested / re-implement per model release" consensus, and Philipp Schmid's **"don't ship skills without evals."** Existing deck retained.
- **Edited topic: Evals & self-verifying agents** — merged in **eval-driven development** going mainstream at AIEWF 2026 (Rippling, Abridge) and **reward hacking** as a failure mode. Existing deck retained.
- **Edited topic: Model routing & cost-efficient agents** — merged in *"the best AI agents cost less than you think"* (Factory) and *"more compute in → better model out"* (Cursor) — fix harness waste before blaming the model bill — plus **Fable 5 becoming a permanent subscriber model** (from 20 Jul) reshaping the default. Existing deck retained.

**Claude Updates**

- **Added: Week of 20 Jul 2026 (new block at top)** — Fable 5 made permanent in Max & Team Premium plans (from 20 Jul, 50% of limits; Pro/Team Standard keep credit access + $100 credit); HIPAA configuration self-serve (14 Jul); memory now categorized entries not a daily summary (10 Jul catch-up); `web_fetch` exfiltration hole found & fixed (15 Jul); and Claude Code 2.1.208–2.1.215 — a **permission / auto-mode security-hardening wave** (fail-closed Bash checks, `Edit(dir/**)` no longer auto-approving nested writes, plan mode not silently running file-mutating commands, worktree-isolated subagents, Agent-tool prompt-injection hardening), **scheduled-task-prompt fix**, **runaway-loop guardrails** (WebSearch/subagent caps, MCP auto-background), `/fork`→background + `/subtask`, EndConversation tool, and `/verify` + `/code-review` no longer auto-running. Older weeks left intact.

**Assets**

- Added deck: `ai-radar/decks/Harness-and-Loop-Engineering.pptx` (9 slides; linked from *Context engineering for coding agents*).

**Resolved from last run:** the *AI security* topic's mid-sentence truncation ("…broadly r") flagged for Abe on 12 Jul is now fixed.

---

## 2026-07-12 — Weekly refresh

*Scanned the watchlist for items published 5–12 Jul. Nothing warranted a brand-new topic or a new deck this run — the week's substantive practice items merged into existing (already-decked) topics, so decks were left as-is to avoid duplication.*

**Claude Updates**

- **Added: Week of 12 Jul 2026 (new block at top)** — Cowork on web & mobile with remote + background execution and scheduled tasks that run with no device online (7 Jul, beta from Max, doubled usage limits through 5 Aug); Microsoft 365 connector write tools (7 Jul); Reflect / monthly recap + Time & focus (9 Jul); Claude Code + Cowork for Government FedRAMP High beta (7 Jul); API key expiration in Console (8 Jul); and Claude Code 2.1.202–2.1.207 (built-in Desktop browser, `/doctor` full setup checkup, auto-mode safety hardening incl. fabricated-approval prevention, auto mode default on Bedrock/Vertex/Foundry → Opus 4.8, `/review` vs `/code-review` split). Older weeks left intact.

**AI Practices**

- **Edited topic: Agent Skills** — merged in **`mattpocock/skills` v1.1** (8 Jul: `/wayfinder`, `/to-spec`, `/to-tickets`, `/grilling` improvements — the collection maturing into a phase-based system) and **native pruning tooling** (Claude Code's revamped `/doctor` checkup + Matt Pocock's *"Kill The Bloat In Claude Code's System Prompt"*, 7 Jul) as the deletion test made automatic. Existing deck retained.
- **Edited topic: Evals & self-verifying agents** — merged in LangChain's **"Improving Agents is a Data Mining Problem"** (Vivek Trivedy, 7 Jul, from his AIE World's Fair talk): traces as the currency of improvement, **"evals are training data,"** turn every production failure into an eval, small/open models as cheap trace judges, and the harness → fine-tune → harness order. Extends last week's ADLC point. Existing deck retained.
- **Edited topic: Context engineering for coding agents** — added a note that `/doctor` now de-duplicates and trims `CLAUDE.md`, keeping the context pack lean without hand-auditing; cross-linked to the Agent Skills pruning workflow.

**Assets**

- No new decks this run (see note above).

**Flagged for Abe (not changed):** the *AI security: assessing jailbreak severity* topic on AI Practices ends mid-sentence ("…broadly r") — a pre-existing truncation from an earlier run, left untouched here as the source text wasn't re-fetched this week. Worth completing in a future run.

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
