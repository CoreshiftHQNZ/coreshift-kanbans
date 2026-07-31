# Storepro Component Count — Handover

_Reconstructed from the board on 2026-07-31 · opens M7_

## ▶️ Paste this into a new session

    Storepro Component Count M7 — Cottonsoft reconciled against Storepro's count

    Read coreshift-kanbans/storepro-component-count/HANDOVER.md and the repo docs
    it points at, then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** M6 — clean-slate DXF engine live on staging.
- **In plain terms:** the app reads Storepro's standardised drawings directly and produces a BOM. Two real jobs have gone through it. The first (OPPAK-12515) matches Storepro's own count line-for-line. The second (Cottonsoft) is partly right — and Shiv has now told us exactly which lines are wrong.
- **Verified by:** staging job `31ee6719` — OPPAK Cottonsoft.dxf in 02:42, complete 02:43 on 2026-07-30, BOM returned live and re-checked against the staging API on 2026-07-31. CI green on all three staging pushes.
- **Next:** M7 — every line of the Cottonsoft BOM either matches Shivneel's confirmed count, or is a written question sent to Storepro explaining why the drawing can't settle it.

### The M7 scoreboard

| Line | Ours | Shiv's | |
|---|---|---|---|
| Bays | 63 | 63 | ✅ |
| Beam 2700 MW | 352 | 352 | ✅ |
| Beam 1350 MW | 20 | 20 | ✅ |
| Frames | 63 | 80 (52 × 4877x900, 12 × 7013x900, 16 × 4267x900) | 🔴 |
| Mesh decks | 36 | 398 | 🔴 |
| Mesh backs | — | 36 | 🔴 |
| 2700 TW / 2700x80MW | 36 | 36 | ⚠️ qty agrees, spec doesn't |

## 👉 On you before M7 can close

1. **Send the reconciliation reply to Shivneel** — client-facing, so it's yours. Claude will draft it with the answers and only the genuinely unanswerable questions.
2. **Rotate the Anthropic API key** — needs an Anthropic Console login. Hand Claude the new key and it sets it on Railway and confirms the old one is dead.
3. **Reconnect the Railway GitHub source** — dashboard-only; the CLI can't attach a source. Both services show `repo: null`, so every staging deploy since 2026-07-03 has been a manual `railway up`.

## 🔴 Risks you're carrying

- **The board was hand-edited into `index.html` for a month.** `KANBAN.md` had drifted 10 Done cards behind the published HTML — a routine `node tools/build.js` would have silently deleted them. Rebuilt from the HTML on 2026-07-31; the markdown is authoritative again. **Assumption to check:** the reconstruction preserved every card's wording, but bold runs inside a few Done card descriptions are now plain text (the renderer escapes HTML).
- **Assumption — the 17 "standalone baseplates" are the 17 missing frames.** 63 + 17 = 80, which is Shiv's exact total, and the engine already flags them. Arithmetic, not evidence: nobody has looked at those blocks in the DXF yet. This is M7's first move and it may not hold.
- **Assumption — mesh decks and mesh backs are being conflated.** That's Shiv's read, and our single "Mesh 36" line equals his mesh-*backs* figure exactly, so the 398 decks look uncounted rather than miscounted. Unverified against the drawing.
- **Only two real drawings have ever been validated.** The engine was generalised off OPPAK-specific hardcodes, but Cottonsoft still broke it in four places. Treat every rule as one-drawing-deep until the third set arrives.
- **The local clone is 28 commits behind `origin/dev`** and all the July work lives only on the remote. `git pull` before touching anything.
- **The NetSuite part-code catalogue still hasn't arrived.** Until it does the BOM emits descriptive names ("Beam 2700 MW"), not Storepro part codes — which is what the export is ultimately meant to carry.
- **The Anthropic key exposed in May chat history is still live on staging.**

## For the next Claude

- Repo `CoreshiftHQNZ/storepro-component-count`, branch `dev` (= `feature/dxf-count`, `e5d475c`). `staging` is 4 ahead of `dev` at `7cbca4d` — the 2026-07-30 export + web work was pushed straight to `staging`, so **reconcile `dev` and `staging` before branching**.
- The engine is `parser/dxf_count.py` (clean slate, ezdxf). `parser/topology_spike.py` is the older dynamic-block engine that holds the OPPAK oracle. Read `docs/drawing-conventions.md` and `docs/designer-practices.md` first.
- Working files (drawings, Storepro correspondence, the golden spreadsheets) live in `~/Documents/Claude/Projects/CS - Storepro`, **not** in the repo. `OPPAK Cottonsoft.dxf` and `Storepro_Cottonsoft_Component_Count.xlsx` (our 2026-07-30 output) are both there.
- Ground truth for M7 is in the On-Ricky card and the table above; Shiv's message is quoted in the session that opened this milestone.
- **Do:** lock the three matching lines behind a Cottonsoft oracle test *before* changing anything, the way OPPAK is locked. Every fix must keep OPPAK line-for-line.
- **Don't:** invent a rule to close a gap. The whole reason this engine works is that it counts what's drawn — if the DXF can't settle a line, it becomes a clarification and a question to Shiv, not a coefficient.
- Deploys: push to `staging`, then `railway up` per service until the GitHub source is reconnected.
