# QuestBoard — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js questboard` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **3D facelift — full WebGL game layer** `phase-3` `design` `shipped` — Replaced the flat UI with a real Three.js (react-three-fiber) overworld + battle screens per design direction: extruded-island terrain (beach/grass/mountains/forests/river/clouds), 3D castles whose roofs go red on critical, drag-to-pan / scroll-to-zoom, click-castle → camera-fly → battle-swirl transition. Each boss is a 3D arena with a tier monster (slime / horned knight / dragon), lighting + shadows, parked/critical states. Core logic untouched; 56 tests still green. On `dev` (5933525), rides PR #12.
- **Design Spec v1 interrogated** `phase-0` `decision` — Twelve locked decisions, six invariants, data model, week-one ship plan. Every decision made against a real example board (Sentinel).
- **PRD published** `phase-0` `shipped` `milestone` — Full-vision scope. Filed as issue #1 with `ready-for-agent`; sliced into ten tracer-bullet issues (#2–#11).
- **Repo + scaffold** `phase-0` `shipped` — `CoreshiftHQNZ/questboard` (private), `main` + `dev`, Vite + React 18 + TS + Vitest (matches sentinel-app toolchain).
- **Walking skeleton (#2)** `phase-1` `shipped` — Canonical types → State Projection → dungeon screen. Hero metric is boss ladder + shipping cadence; segmented HP bars with frozen denominator; no percent bar anywhere.
- **HP Ledger (#3)** `phase-1` `shipped` — The only module allowed to mutate boss HP/state. Pure reducer; max_hp frozen at spawn, minions never heal, dead stays dead, undefined fights rejected. 19 table-driven tests.
- **Scope Router (#4)** `phase-1` `shipped` — One mechanical rule: own exit criteria → new parked Boss; chips the objective → Minion. Neither path can move an existing max_hp.
- **Flee/Resume machine (#5)** `phase-1` `shipped` — active ⇄ fled, dead terminal, one active boss per KINGDOM (pinned across campaigns). Plus replay-equivalence test: the whole sample board rebuilt through ledger+machine ops renders identically.
- **Damage Router (#6)** `phase-2` `shipped` — Routes by campaign tag, never repo (the keycontent-privacy-PR case is a named test); two-campaign PRs split into one DamageEvent each; untagged/mis-tagged work rejected, never guessed.
- **Persistence adapter (#8)** `phase-1` `shipped` `decision` — v1 = state/<kingdom>.json in the questboard repo behind one StateStore interface. Supabase impl is the documented migration path when kingdoms multiply.
- **Critical Evaluator + ack/snooze (#9)** `phase-2` `shipped` — Computed from signals (incident, P0/P1, fled > 7d, deadline < 14d — injected config); humans can only acknowledge, never raise. Verified live: Sentinel's Phase B auto-fired 'blocked 12d'.
- **Scribe convention + real Sentinel board (#7 built)** `phase-2` `shipped` — docs/SCRIBE.md (quest tags, split damage, scope rule, engagement) + state/sentinel.json from real kanban history: 7 bosses across Build + Privacy campaigns, real PR sources. Verdict pending (see This Week).
- **World map (#10)** `phase-3` `shipped` — Continents → Kingdoms from the same projection as the dungeon (test pins the two skins cannot disagree); tiles show active boss HP, critical count, parked fights; drill-down both ways.
- **Tier-scaled fanfare (#11)** `phase-3` `shipped` — Kill XP mini 50 / boss 150 / raid 500; trophies weighted by tier; 7-day kill banners. No leaderboards, by design. **Closes the PRD's AFK scope — 56 tests green.**

## 🟡 In Progress

- **Promotion PR #12 (dev → main)** `ops` — Full build awaiting review/merge: https://github.com/CoreshiftHQNZ/questboard/pull/12

## 🚫 Blocked

_None._

## 🔵 This Week

- **Legibility verdict on the real Sentinel board** `needs-abe` `milestone` — The PRD's falsifiable test, answered on issue #7: does Sentinel read as a tidy build with a handful of real bosses? Provisional read: yes — 141 cards became 7 bosses / 2 campaigns, and the board surfaced the real bottleneck (Phase B parked 12d on the Kling decision) automatically.
- **Deploy decision** `needs-abe` — QuestBoard runs locally (`npm run dev`). Decide whether/where to host (Railway per Coreshift standard, or GitHub Pages since v1 is fully static).

## ⚪ Backlog

- **Critical Evaluator tests** `low-priority` — Deliberately deferred by the PRD while thresholds tune; module is pure, tests are cheap once 7d/14d defaults settle.
- **Supabase StateStore** `low-priority` — Second persistence implementation behind the same interface, mirroring Sentinel's cross-app aggregator. Trigger: kingdoms multiply.
- **Onboard more kingdoms** — KeyContent, Noozey, Velocity boards as state/<kingdom>.json, each authored via the scribe convention.
- **Scribe CLI** `low-priority` — Wrap the core ops in a small CLI so scribe sessions apply ops instead of hand-editing JSON.
- **Live signals for Critical** `low-priority` — Wire openIncident / openP0P1 from Sentinel's real data instead of injected NO_SIGNALS.
- **"My battles" IC view** `low-priority` — Deferred by PRD: must stay possible as a filtered slice of the same data; no separate view ships.
