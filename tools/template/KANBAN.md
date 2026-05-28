# My Project — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js <project-slug>` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## ✅ Done

- **Example shipped card** `phase-0` `shipped` — One-line description of what was done. The description renders as the small grey text under the card title.

## 🟡 In Progress

- **Example in-flight card** `phase-0` `in-progress` — Active work. Description goes here. Tag colors are mapped by the engine — see `tools/build.js` `tagClass()` for the full list.

## 🚫 Blocked

_None._

## 🔵 This Week

- **Example weekly task** `ops` — Something the operator or implementer should pick up this week.

## ⚪ Backlog

- **Example backlog item** `low-priority` — Captured idea, not yet scheduled.
- **Another backlog item** `recurring` — Things that happen on a cadence (quarterly reviews, etc.).
