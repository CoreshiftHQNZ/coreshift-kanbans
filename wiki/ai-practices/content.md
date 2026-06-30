# AI Practices

Our living knowledge base for working well with AI — agent skills, coding workflows, prompting, SEO, and the patterns we adopt across Coreshift builds. The **AI Radar** refreshes this page weekly: new learnings are merged into the relevant topic below, never added as a duplicate page. Every change is recorded in the [Radar Changelog](../ai-changelog/).

> How to read this: each topic is a living section. When a new video, article, or release teaches us something on a topic that already exists here, we **edit that topic in place** and log the change — so this page is always the current best version, not an append-only pile.

---

## 📬 Share a find

*Spotted a tool, post, video, or trick worth adding? Drop the link below. The radar reviews submissions in its **Monday run** and replies on your submission to say whether it made it in — and where.*

<a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans/issues/new?template=radar-submission.yml" target="_blank" rel="noopener" style="display:inline-block;margin:0.4rem 0 0.2rem;padding:10px 18px;background:#028090;color:#ffffff;border-radius:9px;font-weight:600;text-decoration:none;">➕ Submit a link for review</a>

*(Submitting opens a 30-second GitHub form. You'll need a GitHub account; ping Abe if you'd rather send it another way.)*

**Recently reviewed**

- _Nothing reviewed yet — be the first to submit._

---

## Agent Skills

*Last updated: 30 Jun 2026 · Standout — full deck available · Sources: [Building Great Agent Skills: The Missing Manual](https://www.youtube.com/watch?v=UNzCG3lw6O0) (Matt Pocock / AI Engineer) · [mattpocock/skills v1.0 — progressive disclosure](https://www.aihero.dev/posts)*

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

**How we apply it at Coreshift:** build in vertical slices not horizontal layers; one source of truth (generated Supabase types, shared validation, RLS for authz); a deletion-test prompt in the PR template; human-in-the-loop gates before migrations and prod deploys.

📊 *Slides — click through inline (or use fullscreen):*

<div style="position:relative;width:100%;max-width:820px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2FCoreshiftHQNZ%2Fcoreshift-kanbans%2Fmain%2Fai-radar%2Fdecks%2FBuilding-Great-Agent-Skills.pptx" title="Building Great Agent Skills — slides" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allowfullscreen></iframe>
</div>

[Download the deck (.pptx) →](../../ai-radar/decks/Building-Great-Agent-Skills.pptx)

---

## Evals & self-verifying agents

*Last updated: 30 Jun 2026 · Standout — full deck available · Sources: [LangChain June 2026 newsletter — Deep Agents RubricMiddleware](https://www.langchain.com/blog/june-2026-langchain-newsletter) · [Karpathy's Software 3.0 / verifiability framework](https://www.startuphub.ai/ai-news/ai-figures/2026/figure-andrej-karpathy-software-thesis-evolution-2026-06-17)*

The biggest practice signal this week is a convergence: **agents get reliable when you give them a way to check their own work.** Andrej Karpathy's framing — "traditional software automates what you can *specify*; LLMs automate what you can *verify*" — is now showing up directly in tooling.

**Sort every task by verifiability.** A useful three-bucket model:

- **V1 — fully automatable now:** the success signal is clear, fast, and needs no human (unit tests pass/fail, schema and format validation, factual lookups, "does it compile / run"). Wire the check straight into the agent loop and let it iterate.
- **V2 — automatable with a human checkpoint:** output can be judged but judging needs context or taste (draft emails, meeting summaries, research briefs, migrations). Keep a person on the gate.
- **V3 — verifiable only in principle:** taste, long-horizon strategy, aesthetics — no verification environment exists yet. Don't pretend the agent can self-grade these.

**Tooling is catching up.** LangChain's June release added **RubricMiddleware** for Deep Agents: you hand the agent an explicit rubric and it grades its own output against it and keeps iterating until the work meets the criteria — V1 verification operationalised inside the agent. The same newsletter's on-call triage copilot leans on the same idea: a clear pass/fail signal (alert resolved or not) makes the loop trustworthy.

**The discipline: write the verifier first.** Before automating a step, ask "what's the automatic success signal?" If there isn't one, either build one (a test, a checker, a rubric) or accept it's V2 and keep the human checkpoint. Karpathy calls good evals one of the highest-leverage things an AI team can build, and that matches what we see.

**How we apply it at Coreshift:** every agent-run task ships with an explicit success check — typecheck + tests for code, schema/format validation for data, a written rubric for anything fuzzier; V2 tasks (DB migrations, prod deploys, outbound comms) keep their human gate; we treat "we can't verify this yet" as a reason to *not* hand it to an agent.

📊 *Slides — click through inline (or use fullscreen):*

<div style="position:relative;width:100%;max-width:820px;aspect-ratio:16/9;margin:1.1rem 0;">
<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2FCoreshiftHQNZ%2Fcoreshift-kanbans%2Fmain%2Fai-radar%2Fdecks%2FEvals-and-Self-Verifying-Agents.pptx" title="Evals & Self-Verifying Agents — slides" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px;" allowfullscreen></iframe>
</div>

[Download the deck (.pptx) →](../../ai-radar/decks/Evals-and-Self-Verifying-Agents.pptx)

---

## Context engineering for coding agents

*Last updated: 30 Jun 2026 · Sources: [Cole Medin — context engineering method](https://self.md/people/cole-medin-context-engineering/) · [Karpathy on Claude as an org-wide teammate](https://www.benzinga.com/markets/tech/26/06/60091727/andrej-karpathy-says-ai-is-no-longer-a-chatbot-its-becoming-your-teammate)*

A recurring theme this week: coding agents fail less because of the model and more because of the **context** they're handed. Cole Medin's "context engineering" frames the fix as giving the agent everything it needs *upfront* — architecture decisions, project rules, conventions, worked code examples, and the validation steps that define "done" — rather than discovering them mid-task.

In practice this lands as a **curated context pack**: a tight `CLAUDE.md` (or equivalent) holding the rules and pointers, plus example files the agent can pattern-match against, plus the commands that verify the result. Interest in a well-tuned `CLAUDE.md` spiked late June as practitioners shared setups that "stop the agent fighting them." It pairs naturally with the evals topic above — the validation steps in your context pack *are* the verifier the agent runs against.

This connects to the broader shift Karpathy described around Claude Tag: agents are becoming **persistent, org-wide teammates** embedded in tools like Slack rather than one-off chatbots, which raises the payoff of writing context once and reusing it everywhere.

**How we apply it at Coreshift:** keep a maintained `CLAUDE.md` per repo (stack, conventions, gotchas, the commands that prove a change works); point to canonical example files instead of describing patterns in prose; update the context pack when an agent gets something wrong, so the lesson sticks for the next run.

---

*More topics (prompting, SEO/GEO) will appear here as the Radar runs each week.*
