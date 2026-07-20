**Week of 20 Jul 2026** — the week's notable new toys, tools, and changes. Full write-ups live in [AI Practices](wiki/ai-practices/) · [Claude Updates](wiki/claude-updates/).

**🧰 New tools & toys**

- **Claude Code 2.1.208–2.1.215** — a permission / auto-mode **security-hardening wave**: Bash checks fail closed in more cases (>10k-char commands prompt), `Edit(dir/**)` no longer auto-approves nested writes, plan mode won't silently run file-modifying commands, worktree-isolated subagents can't touch the main checkout, and the Agent tool is hardened against prompt injection. Plus **runaway-loop caps** (WebSearch/subagent limits; MCP calls >2 min auto-background), `/fork`→background + `/subtask`, and `/verify` + `/code-review` that **no longer auto-run**.
- **HIPAA configuration is now self-serve (14 Jul)** — eligible admins review the BAA and enable it in one flow, for Claude Enterprise and the API.
- **Harness & Loop Engineering deck** — the AI Engineer World's Fair 2026 consensus, now on AI Practices: build the *harness* and the *loop* (human owns the outer loop, agent runs the inner), not a fully autonomous agent.

**✴️ Claude / Anthropic**

- **Models: Fable 5 is a permanent subscriber model again (from 20 Jul)** — included in **Max & Team Premium** at 50% of usage limits; Pro / Team Standard keep usage-credit access plus a one-time **$100 credit**. Worth re-testing on the hardest work now the top model isn't API-credits-only.
- **Security: a `web_fetch` data-exfiltration hole was found and fixed (15 Jul)** — it could follow attacker-planted links inside pages it had already fetched to leak memory contents; Anthropic removed that ability. Textbook *lethal trifecta* case.

**🧠 Practices worth a look**

- **Eval-driven development** — mainstream at AIEWF 2026 (Rippling, Abridge): write the eval first, and watch for **reward hacking**. "Don't ship skills without evals."
- **Safe agent execution** — always run coding agents **sandboxed with review** (the GPT-5.6 Codex file-deletion bug), and **audit what a coding-agent CLI transmits by default** (the grok-build data-upload backlash).
- **Cost-efficient agents** — "the best AI agents cost less than you think": fix **harness waste** (caching, scoped context, capped budgets) before blaming the model bill.

*Got something for next week? [Share a find →](wiki/ai-practices/) (scroll to "Share a find").*
