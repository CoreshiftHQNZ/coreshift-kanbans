# Coreshift Kanban Engine — Kanban

> Visual rollout state for the kanban tool itself. Edit this file and run `node tools/build.js kanban-engine` from the coreshift-kanbans repo root to refresh.
>
> Card format: `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **Sentinel kanban (hand-rolled origin)** `phase-0` `shipped` — Built first as a 1088-line `build_kanban.js` + `KANBAN.md` in the Sentinel folder. The board format, card convention, 5 columns, hero / goals / phases / links / roles / recently-shipped sections all proven here before being templated.
- **Engine extracted from `build_kanban.js`** `phase-1` `shipped` — Renderer + parser pulled into `tools/build.js` as a project-agnostic function. Takes a project slug, reads `<slug>/kanban.config.js` + `<slug>/KANBAN.md`, writes `<slug>/index.html`.
- **Per-project config split out** `phase-1` `shipped` — Sentinel's 105-line `META` object lifted into `sentinel/kanban.config.js` with documented fields. The engine reads it; the config has no engine logic.
- **`KANBAN.md` moved to source-of-truth** `phase-1` `shipped` — Was previously in the local Sentinel folder (not in any git repo). Now in `coreshift-kanbans/sentinel/KANBAN.md` — version-controlled, available across machines, single source.
- **Template starter kit** `phase-1` `shipped` — `tools/template/` contains `kanban.config.js` (documented placeholder), `KANBAN.md` (5-column skeleton + example cards), and `README.md` (6-step "add a project" guide).
- **brandMark / brandSub / footerHtml config overrides** `phase-1` `shipped` — Three previously-hardcoded Sentinel-specific strings now overrideable per project; defaults preserve Sentinel's exact current output. The kanban-engine board uses them to show its own 📋 mark and "Build System" subtitle.
- **Byte-identical Sentinel output verified** `phase-1` `shipped` — Fresh build of Sentinel via the new engine produces a 107,246-byte HTML matching the previously-shipped `sentinel/index.html` exactly, modulo the `Updated <timestamp>` line. Zero visual regression — the keystone proof.
- **Public push** `phase-1` `shipped` — Commit `3df58a5` on `coreshift-kanbans/main`. GitHub Pages republished automatically; existing Sentinel board URL serves identical content from the new pipeline.
- **Kanban-engine board itself (this page)** `phase-1` `shipped` `meta` — Dogfood: the kanban engine has its own kanban, built on the engine, using the template. Second consumer of the template kit and the proof that it generalizes.
- **Styled how-to-add-a-project page** `phase-1` `shipped` `docs` — In-repo page at `/kanban-engine/how-to-add-a-project.html` leads with a paste-ready Claude Code prompt (the expected real path for adding boards), keeps the six-step manual setup below it. Replaces the GitHub-README link on this board — no GitHub side-quest required.

## 🟡 In Progress

_None._

## 🚫 Blocked

_None._

## 🔵 This Week

- **Operator presentation** `phase-2` `ops` — Abe presents the kanban + template as the gold-standard pattern for Coreshift project visibility. Gate to start retrofitting existing boards.

## ⚪ Backlog

- **Retrofit existing project boards** `phase-3` `gated-on-demo` — `digital-architect`, `planner`, `velocity`, `sow`, `sponsored-listicle-writer`, `storepro-component-count` each get a `kanban.config.js` + `KANBAN.md` and use the shared engine. ~15 min per board. Waits until the operator demo lands.
- **Extract `build_playbook.js` engine** `phase-4` — Same treatment as `build_kanban.js`: project-agnostic engine in `tools/build-playbook.js` + per-project config. Source currently lives in `D:\Coreshift HQ\Sentinel\scripts\`.
- **Extract `build_roadmap.js` engine** `phase-4` — Same treatment again. After this lands, the Sentinel folder's `scripts/` directory can be retired entirely.
- **`HOW-WE-DO-KANBANS.md` playbook entry** `phase-4` `docs` — Codify the convention so the next Claude Code session that needs to add a project board finds the playbook entry without having to re-discover.
- **GitHub Action auto-build on push** `phase-4` `low-priority` — Workflow that runs `node tools/build.js` on push, commits any HTML changes. Optional — manual run is fast and visible; only worth doing if frequent config edits start drifting from committed `index.html` files.
- **Tag color mapping in config** `low-priority` — `tagClass()` currently has Sentinel-specific phase mappings hardcoded in the engine. Could move to per-project config so each project defines its own tag→color palette.
- **Delete obsolete Sentinel-folder files** `cleanup` — `D:\Coreshift HQ\Sentinel\scripts\build_kanban.js` and `D:\Coreshift HQ\Sentinel\KANBAN.md` are now obsolete (the canonical versions are in this repo). Delete locally to remove the divergence risk.
