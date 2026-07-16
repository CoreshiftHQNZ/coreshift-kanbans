# AI Practices

Our living knowledge base for working well with AI — agent skills, coding workflows, prompting, SEO, and the patterns we adopt across Coreshift builds. The **AI Radar** refreshes this page weekly: new learnings are merged into the relevant topic below, never added as a duplicate page. Every change is recorded in the [Radar Changelog](../ai-changelog/).

> How to read this: each topic is a living section. When a new video, article, or release teaches us something on a topic that already exists here, we **edit that topic in place** and log the change — so this page is always the current best version, not an append-only pile.

---

## 📬 Share a find

*Spotted a tool, post, video, or trick worth adding? Drop the link below. The radar reviews submissions in its **Monday run** and posts the outcome — added or not, and where — in the **Recently reviewed** list further down.*

<a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans/issues/new?template=radar-submission.yml" target="_blank" rel="noopener" style="display:inline-block;margin:0.4rem 0 0.2rem;padding:10px 18px;background:#028090;color:#ffffff;border-radius:9px;font-weight:600;text-decoration:none;">➕ Submit a link for review</a>

*(Submitting opens a 30-second GitHub form. You'll need a GitHub account; ping Abe if you'd rather send it another way.)*

**Recently reviewed**

- _Nothing reviewed yet — be the first to submit._

---

## Agent Skills

*Last updated: 12 Jul 2026 · Standout — full deck available · Sources: [Building Great Agent Skills: The Missing Manual](https://www.youtube.com/watch?v=UNzCG3lw6O0) (Matt Pocock / AI Engineer) · [mattpocock/skills v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements) · [How To Kill The Bloat In Claude Code's System Prompt](https://www.aihero.dev/how-to-kill-the-bloat-in-claude-codes-system-prompt) · [Claude Code — Week 28 (`/doctor` checkup)](https://code.claude.com/docs/en/changelog)*

🎬 *Watch — Matt Pocock / AI Engineer (45 min):*

<div style="position:relative;width:100%;max-width:760px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://www.youtube-nocookie.com/embed/UNzCG3lw6O0" title="Building Great Agent Skills: The Missing Manual" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

A skill is its **description** + a **SKILL.md** file + any **reference material** that branches off it. Evaluate and improve every skill against four things — trigger, structure, steering, pruning.

**1 · Trigger — how it's invoked.** Decide deliberately between *user-invoked* (no description in context → zero context load, but higher cognitive load on the user; set `disable-model-invocation: true`) and *model-invoked* (description always in context → flexible but adds token + decision load, and may not fire even when it's a perfect fit, forcing you to write evals). Neither is free; choose per skill.

**2 · Structure — the internal layout.** Think in two units: **steps** (the procedure) and **reference** (supporting info). Keep `SKILL.md` as small as possible — easier to maintain and audit, and every word is a token on every use. Look at the skill's **branches**: reference used in only one branch moves out behind a *context pointer* ("if you need X, go to this file"). Single-branch skills keep reference inline; multi-branch skills push each branch's material out.

**3 · Steering — make it do the thing.** Use **leading words**: short, meaning-dense phrases (e.g. "vertical slice") that trigger the model's prior and show up in its reasoning traces — use them consistently and verify they echo back. And manage **leg work**: when the agent under-invests in a step (classic: plan mode rushing clarifying questions), split that step into its own skill so the agent sees one step at a time and can't rush to the finish.

**4 · Pruning — minimise.** Massive skills are a symptom. Run a final pass for: **duplication** (one source of truth per reference), **sediment** (cruft that accumulates in shared docs — move to the right branch or kill stale material), and **no-ops** (text that looks instructive but doesn't change behaviour — use the *deletion test*: remove it; if nothing changes, leave it removed).

**Progressive disclosure is the load-bearing pattern (update, late Jun 2026).** Matt Pocock's open-source `mattpocock/skills` collection shipped a v1.0 built around progressive disclosure — keep the always-loaded `SKILL.md` tiny and push detail behind context pointers that the agent only opens when a branch needs it. He reports this cut token cost on his skills by roughly 63% with no loss of capability. The takeaway reinforces points 2 and 4 above: the cheapest, most maintainable skill is the one that surfaces the least text per use.

**The collection is maturing into a phase-based system (update, 8 Jul 2026).** `mattpocock/skills` **v1.1** adds workflow skills that map onto his phases of AI development — `/wayfinder` (up-front planning that stops the agent rushing into a build), `/to-spec` (conversation + codebase → a PRD) and `/to-tickets` (a plan → tracer-bullet implementation issues), plus improvements to the `/grilling` interview skills. The pattern worth stealing isn't the specific skills, it's the shape: each phase of the work is its own small, single-purpose skill the agent sees one at a time — the "leg work" fix from point 3, applied across a whole workflow.

**Pruning now has native tooling (new, early Jul 2026).** The manual "deletion test" from point 4 got a power tool. Claude Code's revamped **`/doctor` (a full setup checkup, alias `/checkup`, from 2.1.205)** finds skills, MCP servers, and plugins that aren't earning their **context cost**, de-duplicates local `CLAUDE.md` files against checked-in ones, proposes trimming `CLAUDE.md` content the model could just derive from the codebase, and flags slow hooks — reporting first and asking before it changes anything. It pairs with Matt Pocock's *"How To Kill The Bloat In Claude Code's System Prompt"* (7 Jul), which makes the same case by hand: every always-loaded skill description, MCP tool, and rule is a standing token tax on every turn, so audit the always-on surface and cut what doesn't change behaviour. Practical move: run `/doctor` periodically and treat "unused / derivable / duplicated" as the deletion test made automatic.

**How we apply it at Coreshift:** build in vertical slices not horizontal layers; one source of truth (generated Supabase types, shared validation, RLS for authz); a deletion-test prompt in the PR template; human-in-the-loop gates before migrations and prod deploys.

📊 *Slides — click through inline (or use fullscreen):*

<div style="position:relative;width:100%;max-width:820px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2FCoreshiftHQNZ%2Fcoreshift-kanbans%2Fmain%2Fai-radar%2Fdecks%2FBuilding-Great-Agent-Skills.pptx" title="Building Great Agent Skills — slides" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allowfullscreen></iframe>
</div>

[Download the deck (.pptx) →](../../ai-radar/decks/Building-Great-Agent-Skills.pptx)

---

## Evals & self-verifying agents

*Last updated: 12 Jul 2026 · Standout — full deck available · Sources: [LangChain — Improving Agents is a Data Mining Problem (7 Jul 2026)](https://www.langchain.com/blog/improving-agents-is-a-data-mining-problem) · [LangChain June 2026 newsletter — Deep Agents RubricMiddleware](https://www.langchain.com/blog/june-2026-langchain-newsletter) · [Karpathy's Software 3.0 / verifiability framework](https://www.startuphub.ai/ai-news/ai-figures/2026/figure-andrej-karpathy-software-thesis-evolution-2026-06-17)*

The biggest practice signal this week is a convergence: **agents get reliable when you give them a way to check their own work.** Andrej Karpathy's framing — "traditional software automates what you can *specify*; LLMs automate what you can *verify*" — is now showing up directly in tooling.

**Sort every task by verifiability.** A useful three-bucket model:

- **V1 — fully automatable now:** the success signal is clear, fast, and needs no human (unit tests pass/fail, schema and format validation, factual lookups, "does it compile / run"). Wire the check straight into the agent loop and let it iterate.
- **V2 — automatable with a human checkpoint:** output can be judged but judging needs context or taste (draft emails, meeting summaries, research briefs, migrations). Keep a person on the gate.
- **V3 — verifiable only in principle:** taste, long-horizon strategy, aesthetics — no verification environment exists yet. Don't pretend the agent can self-grade these.

**Tooling is catching up.** LangChain's June release added **RubricMiddleware** for Deep Agents: you hand the agent an explicit rubric and it grades its own output against it and keeps iterating until the work meets the criteria — V1 verification operationalised inside the agent. The same newsletter's on-call triage copilot leans on the same idea: a clear pass/fail signal (alert resolved or not) makes the loop trustworthy.

**Make it a lifecycle, not a one-off.** The same June newsletter also frames an **agent development lifecycle (ADLC) — Build → Test → Deploy → Monitor** — where production behaviour is fed back into stronger evals over time, so failures get caught earlier and the agent improves without guesswork. The practical read for us: don't treat the verifier as a launch gate you write once; keep harvesting real failures into the eval set so the success signal sharpens with use.

**"Evals are training data" — mine your traces (new, 7 Jul 2026).** LangChain's Vivek Trivedy sharpened the ADLC point into a memorable recipe (from his AI Engineer World's Fair talk): agent behaviour is more opaque than normal code, so **traces are the currency of improvement** — the record of what the agent actually did that you mine for signal. The loop is: ship a decent agent to start the data flywheel → mine traces to see what to fix → **turn every production failure into an eval** → hill-climb until those evals pass. His framing that *"evals are training data for agents"* is the key line: the behaviours you measure are the behaviours you get, so a failure you can't yet express as an eval is a failure you can't fix on purpose. Two practical notes even without LangChain's tooling: reading traces at scale is a real cost + context problem, so a cheap **small/open model can act as the trace judge** (he reports fine-tuned small models beating frontier models on that narrow task at a fraction of the cost — dovetails with the model-routing topic below); and for most teams **"harness engineering" — better prompts, tools, skills, and context — beats fine-tuning** as the first lever, with fine-tuning reserved for when prompt tweaks stop paying off (his recommended order is harness → fine-tune → harness).

**The discipline: write the verifier first.** Before automating a step, ask "what's the automatic success signal?" If there isn't one, either build one (a test, a checker, a rubric) or accept it's V2 and keep the human checkpoint. Karpathy calls good evals one of the highest-leverage things an AI team can build, and that matches what we see.

**How we apply it at Coreshift:** every agent-run task ships with an explicit success check — typecheck + tests for code, schema/format validation for data, a written rubric for anything fuzzier; V2 tasks (DB migrations, prod deploys, outbound comms) keep their human gate; we treat "we can't verify this yet" as a reason to *not* hand it to an agent.

📊 *Slides — click through inline (or use fullscreen):*

<div style="position:relative;width:100%;max-width:820px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2FCoreshiftHQNZ%2Fcoreshift-kanbans%2Fmain%2Fai-radar%2Fdecks%2FEvals-and-Self-Verifying-Agents.pptx" title="Evals & Self-Verifying Agents — slides" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allowfullscreen></iframe>
</div>

[Download the deck (.pptx) →](../../ai-radar/decks/Evals-and-Self-Verifying-Agents.pptx)

---

## Context engineering for coding agents

*Last updated: 12 Jul 2026 · Sources: [Cole Medin — "The Best AI Coding Setup Isn't the Most Autonomous One" (3 Jul 2026)](https://www.youtube.com/watch?v=muwRbfuKbR4) · [LangChain — How to Use RLMs in Deep Agents](https://www.langchain.com/blog/how-to-use-rlms-in-deep-agents) · [Simon Willison — on Geoffrey Litt's AIE talk & cognitive debt](https://simonwillison.net/2026/Jul/2/understand-to-participate/) · [Claude Code — `/doctor` CLAUDE.md checkup](https://code.claude.com/docs/en/changelog)*

🎬 *Watch — Cole Medin (22 min, published 3 Jul 2026):*

<div style="position:relative;width:100%;max-width:760px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://www.youtube-nocookie.com/embed/muwRbfuKbR4" title="The Best AI Coding Setup Isn't the Most Autonomous One (Here's Why) — Cole Medin" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

**Aim for "in the loop," not "hands off" (new, 3 Jul 2026).** Cole Medin walks Dan Shapiro's *five levels of AI coding* (mapped onto the self-driving levels): from spicy autocomplete (L0–2), to **L3 — you plan the work and review every change**, to L4 multi-agent teams, to **L5 the fully autonomous "Dark Factory."** His key argument, having actually built a Level 5 system: chasing full autonomy isn't the goal — **L3 is the sweet spot for most work because staying in the loop is what keeps software reliable.** That's the same lesson as the cognitive-debt point below and the verifiability discipline above: the win is a tight, well-fed context plus a human reviewing every diff, not maximal hands-off automation.

A recurring theme: coding agents fail less because of the model and more because of the **context** they're handed. Cole Medin's "context engineering" frames the fix as giving the agent everything it needs *upfront* — architecture decisions, project rules, conventions, worked code examples, and the validation steps that define "done" — rather than discovering them mid-task.

In practice this lands as a **curated context pack**: a tight `CLAUDE.md` (or equivalent) holding the rules and pointers, plus example files the agent can pattern-match against, plus the commands that verify the result. It pairs naturally with the evals topic above — the validation steps in your context pack *are* the verifier the agent runs against.

**Context rot is the failure mode to design against (new, early Jul 2026).** As tasks run long, the useful signal in the window gets diluted by stale tool output and dead ends — "context rot" — and quality degrades. LangChain's 1 Jul write-up on **Recursive Language Models (RLMs)** (a technique from MIT CSAIL) is one answer: rather than stuff everything into one window, the model runs code in a REPL that dispatches sub-agents and *recurses over pieces of the input context*, so each sub-call sees only the slice it needs. The practical read even without RLM tooling: keep the working window tight, push detail behind pointers, and split long jobs into sub-agent calls with scoped context rather than one ever-growing thread.

**Watch for cognitive debt (new, 2 Jul 2026).** Simon Willison, riffing on Geoffrey Litt's AI Engineer talk, flags the human-side risk: as you hand more to coding agents, your understanding can drift from how the code actually works — a "cognitive debt" that comes due when something breaks and no one on the team can reason about it. The mitigation is a context-and-review discipline: keep humans reading diffs and holding the mental model, not just approving green checks.

**Keeping the context pack lean is now tooled (new, early Jul 2026).** A fat `CLAUDE.md` is itself context rot — a standing token tax that dilutes signal on every turn. Claude Code's revamped **`/doctor` checkup** now de-duplicates local `CLAUDE.md` files against checked-in ones and proposes cutting content the model could just derive from the codebase, so the context pack stays tight without hand-auditing (see the Agent Skills topic for the full pruning workflow).

**How we apply it at Coreshift:** keep a maintained `CLAUDE.md` per repo (stack, conventions, gotchas, the commands that prove a change works) and run `/doctor` on it periodically to strip bloat; point to canonical example files instead of describing patterns in prose; scope long agent jobs into sub-agents with just the context each needs (don't let one thread rot); and keep a human reading the diffs so we don't accrue cognitive debt.

---

## Model routing & cost-efficient agents

*Last updated: 6 Jul 2026 · Standout — full deck available · Sources: [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5) · [Simon Willison — using lower-power models for coding](https://simonwillison.net/) · [Claude Code changelog 2.1.196–2.1.198](https://code.claude.com/docs/en/changelog)*

The most actionable shift this week is about **which model runs which step**. With **Claude Sonnet 5** landing (30 Jun) — near-Opus agentic quality at roughly a third of the price, and now the *default model in Claude Code* — the cheap move is no longer to run everything on the biggest model. The frontier is a **cost-performance curve**: pick the effort level and model per task, not per project.

**The routing pattern (Simon Willison, 2 Jul).** Keep judgment, review, and synthesis on the strong model in the main loop; spawn sub-agents with **model overrides** for the grunt work — Sonnet for substantive implementation, Haiku for trivial edits and mechanical changes. You get most of the quality where it matters and a large cost cut on the long tail of small steps.

**Tooling now supports this natively.** Claude Code shipped the pieces to operationalise it: **org/role default models** so routine work doesn't silently default to the most expensive option (2.1.196); the built-in **Explore agent now inherits the session model (capped at Opus)** instead of always running Haiku, so search quality scales with the task (2.1.198); sub-agents inherit the session's extended-thinking config; and Claude Enterprise added **model-level entitlements and defaults** plus spend alerts so admins can set the cheap-by-default policy centrally.

**The discipline: match model to verifiability.** This dovetails with the evals topic — the tasks safest to push down to a cheaper model are the **V1** ones with a clear automatic success signal (tests, typecheck, schema validation). If the step self-verifies, a smaller model iterating against that check is usually enough; reserve the expensive model for the fuzzy, taste-heavy, or high-blast-radius work.

**How we apply it at Coreshift:** default new work to **Sonnet 5** in Claude Code; keep Opus for architecture, tricky debugging, and final review; delegate mechanical edits to Haiku sub-agents; set an org default model so cost control isn't left to per-dev discipline; and only push a step to a cheaper model when it has a real verifier attached.

📊 *Slides — click through inline (or use fullscreen):*

<div style="position:relative;width:100%;max-width:820px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2FCoreshiftHQNZ%2Fcoreshift-kanbans%2Fmain%2Fai-radar%2Fdecks%2FModel-Routing-and-Cost-Efficient-Agents.pptx" title="Model Routing & Cost-Efficient Agents — slides" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allowfullscreen></iframe>
</div>

[Download the deck (.pptx) →](../../ai-radar/decks/Model-Routing-and-Cost-Efficient-Agents.pptx)

---

## AI security: assessing jailbreak severity

*Last updated: 6 Jul 2026 · Sources: [Redeploying Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5) · [More on Fable 5's safeguards & the jailbreak framework](https://www.anthropic.com/news/fable-safeguards-jailbreak-framework)*

Prompted by the Fable 5 export-control episode (see [Claude Updates](../claude-updates/)), Anthropic — with Amazon, Microsoft, Google, and other Glasswing partners — proposed the industry's first **consensus framework for scoring how severe an AI "jailbreak" is**. It's useful to us as a way to reason about model-safety risk generally, not just Anthropic's models. A jailbreak is scored on four criteria:

1. **Capability gain** — how far beyond existing tools does it take the attacker? If weaker models or public tools already do the same thing, the score is low.
2. **Breadth** — how many distinct offensive tasks does the *same* technique unlock? Narrow single-target breaks score low; broadly r