# Claude Updates in a Nutshell

What changed in Claude this week — models, API, and Claude Code — in plain language, newest first. Refreshed by the **AI Radar** every week so we never miss a model swap, a retirement, or a Code feature that changes how we work. Always verify anything load-bearing against the official [release notes](https://support.claude.com/en/articles/12138966-release-notes) and [Claude Code changelog](https://code.claude.com/docs/en/changelog).

---

## Week of 30 Jun 2026

**Models — Fable 5 / Mythos 5 update**

- **Update (30 Jun): the export controls have been lifted and Fable 5 is being redeployed.** A US government directive on 12 Jun had suspended **Fable 5** and **Mythos 5**; on **26 Jun** Mythos 5 was partially restored for vetted US organisations, and as of **30 Jun** the controls on both were lifted. **Fable 5 returns globally on 1 Jul** across the Claude Platform, Claude.ai, Claude Code, and Cowork — included for up to **50% of weekly usage limits through 7 Jul** on Pro/Max/Team/select Enterprise plans, then via usage credits (AWS, Google Cloud, and Microsoft Foundry re-enabled as soon as possible). Mythos 5 stays limited to approved US organisations, expanding through Project Glasswing. Fable 5 relaunches with a **new safety classifier** that blocks the reported jailbreak in >99% of cases — blocked requests reroute to **Opus 4.8** — at the cost of more false positives on routine coding. ([Redeploying Fable 5](https://www.anthropic.com/news/redeploying-fable-5))
- **What we have access to now:** Claude **Opus 4.8**, **Sonnet 4.6**, and **Haiku 4.5** for coding, agentic work, and complex reasoning — and, from **1 Jul**, **Fable 5** again (subject to the usage window above). Earlier models (Sonnet 4, Opus 4 / 4.1) are retired; update any pinned model strings.

**Slack & product**

- **Claude Tag (23 Jun):** you can now tag **@Claude** in a Slack channel and delegate a task while you do other work. It's *multiplayer* — one shared Claude per channel that everyone can see and hand off to — and it builds memory from the channels it's in. Runs on Opus 4.8; in **beta for Team and Enterprise** plans.
- **Trusted Devices for Remote Control (25 Jun):** Team/Enterprise admins can require members to verify their device before viewing or steering a local Claude Code session remotely.

**Developer platform & API**

- **Rate limits raised (26 Jun):** Sonnet and Haiku limits now **match Opus at every usage tier**, and tiers are consolidated into three — **Start, Build, Scale**. Most orgs move up a tier; no one gets lower limits; no action required.
- **Opus 4.7 fast mode deprecated (25 Jun):** removed **24 Jul 2026**. After that, `claude-opus-4-7` requests with `speed: "fast"` will error — migrate to **Opus 4.8** fast mode.

**Claude Code (2.1.169 → 2.1.195 this week)**

- **`--safe-mode`** starts Code with all customisations (CLAUDE.md, plugins, skills, hooks, MCP servers) disabled — handy for troubleshooting.
- **`/cd`** moves a session to a new working directory without breaking the prompt cache.
- **Sub-agents can now spawn their own sub-agents** (up to 5 levels deep).
- **`sandbox.credentials`** blocks sandboxed commands from reading credential files / secret env vars; **org-configured model restrictions** now show in the model picker.
- Plus: `autoMode.classifyAllShell`, OpenTelemetry `assistant_response` logging, fullscreen mouse-click controls, a plugin-marketplace search bar, and many MCP-reliability / OAuth-retry / background-agent fixes. (`/rewind` and the ~37% lower streaming CPU landed in 2.1.191.)

**What this means for us:** **Fable 5 is back from 1 Jul** — free to trial through 7 Jul (up to 50% of weekly usage), then it draws on usage credits, so it's worth a look for hard problems but not something to wire into anything load-bearing until we've felt out the cost and the stricter safety classifier (expect more false-positive blocks on routine coding — blocked prompts fall back to Opus 4.8). Our day-to-day stack stays **Opus 4.8 / Sonnet 4.6 / Haiku 4.5**. **Audit for `claude-opus-4-7` + fast mode before 24 Jul.** Claude Tag is worth piloting in our Slack for routine delegation. The new Claude Code flags — `--safe-mode`, `sandbox.credentials`, and org model restrictions — are useful guardrails for our dev workflow.

*Sources: [Anthropic release notes](https://support.claude.com/en/articles/12138966-release-notes) · [Claude Code changelog](https://code.claude.com/docs/en/changelog) · [Releasebot — Anthropic](https://releasebot.io/updates/anthropic) · [Introducing Claude Tag](https://www.anthropic.com/news/introducing-claude-tag) · [Statement on Fable 5 / Mythos 5 access](https://www.anthropic.com/news/fable-mythos-access) · [Redeploying Fable 5](https://www.anthropic.com/news/redeploying-fable-5)*

> *Editor's note (30 Jun 2026): refreshed in place (same calendar week as the Radar launch). Latest change merges a #wiki-submissions contribution — the **Fable 5 redeployment** (export controls lifted 30 Jun; Fable 5 returns 1 Jul with a new safety classifier; Mythos 5 limited to approved US orgs). Earlier this week's items — Claude Tag, Trusted Devices, the API rate-limit/tier changes, the Opus 4.7 fast-mode deprecation, and Claude Code 2.1.169–2.1.195 — remain as recorded.*

---

*Earlier weeks will stack below this line as the Radar runs.*
