# QuestBoard — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js questboard` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **Design Spec v1 interrogated** `phase-0` `decision` — Twelve locked decisions, six invariants, data model, week-one ship plan. Every decision made against a real example board (Sentinel), not in the abstract.
- **PRD published** `phase-0` `shipped` `milestone` — Full-vision scope (world map, continents, multi-kingdom, Critical, tiers). Problem, solution, 40 user stories, implementation + testing decisions. Filed as issue #1 with `ready-for-agent`.
- **Repo created + scaffold pushed** `phase-0` `shipped` — `CoreshiftHQNZ/questboard` (private), `main` + `dev`, README + PRD + design spec in `docs/`.
- **Build sliced into ten tracer-bullet issues** `phase-0` `shipped` — Issues #2–#11 filed in dependency order with real cross-references. Eight AFK (`ready-for-agent`), two HITL (#7 scribe/legibility verdict, #8 storage decision).
- **Open questions resolved in PRD** `phase-0` `decision` — A PR spanning two campaigns splits the damage (one DamageEvent per campaign); Critical thresholds are injected config, not constants.

## 🟡 In Progress

_None._

## 🚫 Blocked

_None._

## 🔵 This Week

- **Walking skeleton (issue #2)** `phase-1` — The only unblocked issue and the tracer bullet: canonical types, hand-authored Sentinel sample state, State Projection, minimal dungeon screen with the hero metric ("Phase X of Y · N shipped this week"). Unblocks the three pure-core modules to run in parallel.
- **Storage decision (issue #8)** `phase-1` `needs-abe` — state.json per repo vs shared Supabase table set. Deliberately open in the PRD; pick based on kingdoms expected in the first month. Can be decided any time after #2.

## ⚪ Backlog

- **HP Ledger (issue #3)** `phase-1` `blocked-by-2` — The only module allowed to mutate boss HP/state. Pure reducer, TDD'd: frozen max_hp, damage, minions-never-heal, dead-stays-dead.
- **Scope Router (issue #4)** `phase-1` `blocked-by-3` — One mechanical rule: own exit criteria → new Boss; chips the objective → Minion.
- **Flee/Resume state machine (issue #5)** `phase-1` `blocked-by-3` — active ⇄ fled on block/unblock, dead terminal, one active boss per kingdom.
- **Damage Router (issue #6)** `phase-2` `blocked-by-3` — Routes by campaign tag, never repo; splits two-campaign PRs; rejects untagged.
- **Scribe convention + real Sentinel board (issue #7)** `phase-2` `blocked-by-6` `needs-abe` — HITL. Author Sentinel's real board with Privacy split into its own campaign, then the falsifiable legibility test.
- **Critical Evaluator + ack/snooze (issue #9)** `phase-2` `blocked-by-2` — Computed from signals, thresholds injected; humans can only acknowledge, never raise. Tests deliberately deferred while thresholds tune.
- **World map overworld (issue #10)** `phase-3` `blocked-by-7` — Continents → Kingdoms from the same canonical state; drill-down into dungeons.
- **Tier-scaled fanfare (issue #11)** `phase-3` `blocked-by-10` — Raid kills visibly outweigh goblin farming. No leaderboards, ever.
- **Critical Evaluator tests** `phase-3` `low-priority` — Cheapest, most decision-dense module to test; add once thresholds settle.
- **"My battles" IC view** `low-priority` — Deferred by PRD: must stay possible as a filtered slice of the same data, but no separate view ships.
