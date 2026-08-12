# Engine Optimization — Handover
_2026-08-13 · opens M1 · project registered_

## ▶️ Paste this into a new session

    Engine Optimization M1 — Data spine

    Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at,
    then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** nothing — this is the first session. Research and architecture only.
- **In plain terms:** we surveyed seven SEO tools built on Claude, took the best of their method for free, and found that none of them does the one thing you actually asked for — checking whether last month's assumptions came true. That gap is the product. The data model is drafted and reviewed; nothing is built yet.
- **Verified by:** seven full codebase reads; `growthpartners.co.nz` confirmed on Google Workspace via MX lookup; licence confirmed Apache-2.0 on the material we're lifting.
- **Next:** M1 — Data spine. Ends when one real client's Search Console and GA4 data for a calendar month is visible in the app.

## 👉 On you before M1 can close

1. **Create the Google service account and authorise domain-wide delegation.** Needs Google Cloud console plus Workspace super-admin on `growthpartners.co.nz`. Exact steps in `docs/google-access-setup.md` §3–5. **This is the hard blocker** — no traffic, ranking or delta figure exists without it, and it's been open in `~/.claude/ENABLEMENT.md` since the GHS Law build in July.
2. **DataForSEO account + API credentials.** Approved 2026-08-13. Not needed to close M1, but needed before M2's CITE scoring can emit a number at all.
3. **Confirm or reshape the seven milestones.** They're the scope arbiter for the next several months. Cheap to change now.

## 🔴 Risks you're carrying

- **A user-OAuth token will break again.** LeanSEO's died twice (`invalid_grant`, verified 2026-07-07), and its re-mint helper script was described in a handover and never committed — so the recovery procedure was itself lost. The service-account path avoids this. Don't let a shortcut reintroduce it.
- **Domain-wide delegation is specified but not yet tested against this domain.** Written from the standard flow, not a live run. Test on one client property before relying on it. The per-property fallback works unchanged if delegation is refused.
- **Scores that drift destroy the report.** Two surveyed tools produce audit scores that move ±10 points on an unchanged site, and one rounds to integers so real improvement shows as zero delta. If a client-facing number isn't deterministic, the month-over-month claim is fiction. Hold the line: no client-facing number until its underlying check is reproducible.
- **CITE cannot score without a link index.** Nine of its forty items need backlink data and the framework requires 100% coverage — so without DataForSEO it returns `UNDECIDED` forever, not a low score. Budget for it or fork the framework and mark those items conditionally inapplicable.
- **Peer cohorts are a human onboarding step.** CITE is peer-relative by design; each client needs a locked 3–5 domain cohort with inclusion rules declared by an analyst. That's per-client manual work at onboarding and it doesn't automate away.

## For the next Claude

- **Project dir** `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Read `docs/schema.md` first — it's the reviewed data model and the reasoning behind each design rule. Then `docs/google-access-setup.md`.
- **No code exists yet.** No repo, no Supabase project, no app. M1 starts from zero: create `CoreshiftHQNZ/engine-optimization`, a Supabase project in the CoreShift org, and a Railway staging environment on the standard dev → staging → main flow.
- **Architecture is settled, don't relitigate it.** Web app on Railway + Supabase because the users are SEO specialists who won't touch a terminal. Agent work runs server-side via the Claude Agent SDK. The method lives in versioned portable skill files the server loads at runtime, which we can also run in Claude Code while building — that's how we avoid choosing between the two form factors.
- **Schema before screens.** The prediction→verification loop is a set of tables; every surface is a view over them. A flaw there is inherited everywhere.
- **The seven design rules in `docs/schema.md` each come from a specific observed failure**, not from taste. Read the reasoning before changing one.
- **Research artifacts are in the scratchpad**, not the repo: seven cloned reference repos under this session's scratchpad `repos/`. If they're gone, the reusable conclusions are all captured in `docs/schema.md` and the board's Done cards. The two frameworks worth re-cloning are `aaron-he-zhu/aaron-marketing-skills` (Apache-2.0) and `AgriciDaniel/claude-seo` (MIT).
- **Don't** build the audit engine before the data spine works. Crawl scores without Search Console data produce an audit nobody can act on, and it's the trap LeanSEO fell into — a shipped Phase 2 audit engine feeding plans that silently degraded to crawl-only for months.
- **Ignore LeanSEO as a codebase.** Ricky's call, 2026-08-13: start from scratch. It's a $489/mo self-serve consumer product whose auth, onboarding and data model would fight an internal agency tool. Its method logic was surveyed and the useful conclusions are already in `docs/schema.md`.
