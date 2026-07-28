**Week of 29 Jul 2026** — the week's notable new toys, tools, and changes. Full write-ups live in [AI Practices](wiki/ai-practices/) · [Claude Updates](wiki/claude-updates/).

**🧰 New tools & toys**

- **MCP `2026-07-28` — and Claude already supports it (28 Jul)** — the protocol goes **stateless** (request/response, no session plumbing), so MCP servers now deploy cleanly on serverless and edge. Two extensions ship under a new versioned framework: **MCP Apps** (a server can render interactive UI *inline in the conversation*) and **Tasks** (long-running work). Auth now aligns with real OAuth 2.0 / OIDC, so Entra and Okta work without hacks. No deprecation deadline — design new servers this way rather than scrambling.
- **Verification loops as skills** — Anthropic's most copyable pattern in a while: take a check you keep making by hand, encode it as a small `SKILL.md` with scoped `allowed-tools`, then run it standalone, embedded in the producing skill, chained, or on every PR.
- **Automated eval engineering (LangChain)** — a skill that reads your repo, mines production traces, interviews you, and emits containerised, executable evals. The honest caveat: it *facilitates* rather than automates — "the best evals came from users providing feedback."

**✴️ Claude / Anthropic**

- **Claude Opus 5 (24 Jul)** — near-Fable-5 intelligence at **the same $5/$25 as Opus 4.8**, which it replaces; now the default Opus in Claude Code and the default on Max. 1M context, thinking on by default, and a `low`→`max` **effort ladder**. Follow-up worth knowing: it's Anthropic's **least prompt-injectable model yet**.
- **Anthropic's position on open-weights models (27 Jul)** — it has **never advocated a ban**, and opposes protectionist ones. The asks instead: chip export controls, a crackdown on state-backed industrial distillation, and mandatory pre-release safety testing for *all* capable models, open or closed.
- **Housekeeping:** legacy Workbench and experimental prompt-tools APIs **sunset 17 Aug 2026**. Claude Code shipped no release this week — still **2.1.220**.

**🧠 Practices worth a look**

- **The new rules of context engineering** — Anthropic reversed six of its own recommendations for Claude 5 models: give **judgment not rules**, **better interfaces not examples**, progressive disclosure, say each thing once. The evidence: they cut **80%+ of Claude Code's system prompt with no measurable performance loss**. Most context packs are too big, and the fix is deletion.
- **Model routing, inverted** — the new advice is **start with the most intelligent model and lower the *effort*, not the model**, because cost-per-*task* is often lower on a smarter model at low effort. We've changed our default accordingly.
- **Anatomy of the runaway-agent intrusion (28 Jul)** — Hugging Face's timeline shows six *ordinary* weaknesses chained: a proxy zero-day, a customer's unauthenticated endpoint, template injection, an over-scoped Kubernetes token. Nothing exotic — but "machine-speed offense makes ordinary weaknesses more expensive for defenders."

*Got something for next week? [Share a find →](wiki/ai-practices/) (scroll to "Share a find").*
