**Week of 30 Jun 2026** — the week's notable new toys, tools, and changes. Full write-ups live in [AI Practices](wiki/ai-practices/) · [Claude Updates](wiki/claude-updates/).

**🧰 New tools & toys**

- **Claude Tag** — tag `@Claude` in a Slack channel and hand off a task; multiplayer, builds channel memory, runs on Opus 4.8 (beta, Team/Enterprise). [Details](https://www.anthropic.com/news/introducing-claude-tag)
- **LangChain Deep Agents — RubricMiddleware** — agents grade their own output against a rubric and iterate until it passes; ships with an on-call triage copilot and computer-use in Fleet. [Newsletter](https://www.langchain.com/blog/june-2026-langchain-newsletter)
- **Claude Code 2.1.x** — `--safe-mode`, `/cd`, sub-agents that spawn sub-agents (5 deep), `sandbox.credentials`, and org-enforced model restrictions.

**✴️ Claude / Anthropic**

- **Models:** Fable 5 stays suspended for general use; Mythos 5 partially restored (26 Jun) for vetted US critical-infrastructure only. We stay on **Opus 4.8 / Sonnet 4.6 / Haiku 4.5**.
- **API:** rate limits raised (Sonnet/Haiku now match Opus); tiers consolidated to **Start / Build / Scale**. **Opus 4.7 fast mode** is deprecated — removed **24 Jul**.

**🧠 Practices worth a look**

- **Evals & self-verifying agents** — Karpathy's "automate what you can verify" + sort tasks V1/V2/V3. [Read + slides](wiki/ai-practices/)
- **Context engineering** — a tight `CLAUDE.md` and worked examples beat a bigger model.
- **Progressive disclosure for skills** — Matt Pocock's `mattpocock/skills` v1.0 cut token cost ~63%.

*Got something for next week? [Share a find →](wiki/ai-practices/) (scroll to "Share a find").*
