# Storepro Component Count — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js storepro-component-count` from the coreshift-kanbans repo root to refresh.
>
> Card format: `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **DWG parse prototype against Sigma** `phase-0` `shipped` — Validated that Storepro DWGs are structured enough to count from. Named blocks + StorePro_ layer convention produce clean counts. Direction confirmed → build the app.
- **component_library.yaml + rules.yaml** `phase-0` `shipped` — Storepro-editable config: block-name aliases, layer-substring filters, deterministic counting rules. Iterated through 3 sample drawings (Sigma, Arlec, Suntory) — added S-type frame markers, BBSL beam variants, Chinese-named blocks (offshore designer), architect-XREF ignore patterns.
- **Cross-job comparison study** `phase-0` `analysis` `shipped` — Parsed all 3 sample drawings end-to-end, generated matrix outputs, diffed against the golden Sigma Phase 1 Stage 2 spreadsheet. Found the bay-count → frame-count rule (frames = bays + runs, NOT 2 × bays) and the per-level beam profile variation. Locked these with Gino + Gareth on 2026-05-28.
- **Storepro rules confirmed (Gino + Gareth meeting)** `phase-1` `shipped` — Locked: frames = bays + runs; splice kit threshold = 11,400 mm; back ties = 2 per frame default; frame-end protectors = 1 LH + 1 RH per run; beam profile varies per level (no fixed pattern); copy-paste anomaly when DWG > 1.5× rule expectation flags clarification; post-protector spec asked per job.
- **FastAPI backend with libredwg + vision pipeline** `phase-1` `shipped` — Streaming 500 MB uploads, DWG → JSON via libredwg, vision pass via Claude (component_count_vision reads per-level beam profile + run_count), recipe extractor, AI reviewer, job storage. Dockerfile builds libredwg from source; runs on Railway.
- **Reconciler + matrix builder** `phase-1` `shipped` — Combines DWG-block parse + vision recipe into a unified bay-type × component matrix. Applies the meeting rules. Emits clarifications (post-protector spec, copy-paste anomaly). Confidence flag per cell.
- **High-fidelity UI ported** `phase-1` `shipped` — Designer's 6-screen prototype (Storepro.zip) ported to Next.js: Dashboard → Upload → Processing → Review → Clarify → Export. IBM Plex Sans/Mono + industrial-yellow + paper-white palette. CAD-scanner Processing animation. Live job-list filter strip + tabs.
- **Real upload → matrix → export flow on staging** `phase-1` `shipped` — Suntory smoke test: 32 MB DWG + 2 MB PDF uploaded, pipeline completed in 144 s, 350 bays detected (matches capacity table exactly), 367 frames vs golden 384 (95.6% accuracy — was previously 2× over with the old rule).
- **Microsoft Azure AD SSO** `phase-1` `auth` `shipped` — Sign-in with Microsoft button, OAuth code flow via `/api/auth/microsoft/exchange`, opaque session token in localStorage, server-side revoke on logout. HTTP Basic kept behind toggle for CLI. Tenant + client + secret all verified against Microsoft directly.
- **Excel + PDF export** `phase-1` `shipped` — `.xlsx` is a 3-sheet workbook (Matrix, Assumptions & Questions, Rules & Clarifications) via openpyxl. `.pdf` is A4 landscape print-ready via reportlab (pure Python, no native deps). Both download from real endpoints on the Review screen.
- **Job metadata + notes persistence** `phase-1` `shipped` — Client / Site / Reference / Racking-system captured on upload, stored with the job, shown on Dashboard rows + Review header. Notes posted via `POST /api/jobs/{id}/notes` with auth-derived author + timestamp; surfaced in Review right-rail activity feed.
- **Dashboard search filter** `phase-1` `shipped` — Top-bar search filters jobs by ID / client / site in real time.
- **Sample drawings comparison artifacts** `phase-0` `analysis` `shipped` — Parsed JSON + matrix outputs + golden spreadsheets retained under `samples/` (gitignored — multi-GB) for future regression checks once Storepro standardised drawings land.

## 🟡 In Progress

_None — v1 is complete on staging. Next batch is Phase 2 testing against Storepro's new standardised drawings, which is gated on Storepro producing those files._

## 🚫 Blocked

- **First job through with Storepro's standardised drawings** `phase-2` `blocked-on-storepro` — Storepro confirmed (2026-05-28 meeting) they will standardise their component library + drawing naming convention before the next test round. Until those files arrive we can't benchmark accuracy on the "non-test" baseline or confirm whether any rules still need tuning.

## 🔵 This Week

- **Rotate Anthropic API key** `security` `ops` — Key was pasted in chat history weeks ago. Still live in Railway staging env (powers the vision pipeline). Generate a new one in Anthropic Console, set via `railway variables --set "ANTHROPIC_API_KEY=…"`, revoke the old.
- **Investigate Railway GitHub auto-deploy** `infra` — Auto-deploys have been silent for the last three pushes; current workaround is manual `railway up --path-as-root` per service. Worth fixing before the team scales. Could be a webhook re-auth on the Railway GitHub app, or a config drift between root `railway.json` and `web/railway.json`.
- **Ping Zoltan with confirmed SSO setup** `ops` — Loop back to Marksmen IT now that all three Azure AD env vars are wired and verified against Microsoft. Confirms his side of the work is complete and unlocks production redirect URI registration when Phase 3 starts.

## ⚪ Backlog

- **Production Railway environment** `phase-3` — Provision the production service for both api + web. Will need a separate Microsoft redirect URI registered with Zoltan (`https://storepro-component-count.up.railway.app/auth/callback`).
- **Retire HTTP Basic** `phase-3` `security` — Once SSO has been used in earnest for a few sessions and Storepro confirms it's stable, hide the "Use admin password instead" toggle on /login.
- **Pre-existing `test_recipe_extractor.py` CI failure** `infra` `tech-debt` — Has been red in GitHub Actions since 2026-05-20. Unrelated to the recent SSO/export work, but means CI hasn't been green for any push this month. Worth fixing so a real CI failure stands out.
- **PDF letterhead + Storepro branding** `phase-3` `polish` — Right now the .pdf header uses a generic three-bar racking icon. Once Storepro shares an official logo (SVG or transparent PNG), swap it in to both the PDF header and the web TopBar.
- **Per-row confidence from the real reconciler** `phase-2` `low-priority` — Web adapter currently uses a heuristic (`confidenceFor()`) for the per-row confidence bar. The reconciler already produces real per-cell confidence — expose it via JobResult so the bar reflects actual cross-source agreement.
- **Hide demo job rows once usage builds** `polish` `low-priority` — Dashboard falls back to sample rows when the API has few real jobs. Trivial to remove the fallback once Storepro has ~10 real jobs running through.
- **Email + share-link delivery on Export** `phase-3` `low-priority` — Buttons currently inert (download covers the workflow). Email path needs SMTP + recipient field; share-link needs a signed-URL endpoint with expiry. Adds when the operator team asks for it.
- **Pricing column** `phase-3` `blocked-on-storepro` — Hidden by default (showPricing=false). Needs Storepro's per-SKU price list before the column has anything real to show.
- **Auto-render DWG → PDF in the pipeline** `phase-2` `low-priority` — Today users supply a plan-view PDF (or export from Autodesk's free online viewer). The DWG already gives us the geometry — could render our own plan view via libredwg → SVG → PNG and feed vision directly. dwg2svg works but rsvg-convert / cairosvg currently fight back; needs revisiting on Linux (the Railway environment).
- **Storage backend for jobs** `phase-3` `infra` — JOBS dict is in-memory per API container. Survives until a deploy. Move to Supabase or Postgres once we want jobs to outlive redeploys.
- **Module 4 — BOM rollup (salesy quote)** `phase-4` `program` — Next module in the wider Storepro App program. Roll the per-bay matrix up into Storepro's verbose quote (Sigma ALL IN.xls shape). Specced in the build proposal — pick up when Phase 3 has bedded in.
- **Two more sample drawings** `phase-2` `low-priority` — Once standardised. Lets us test rule generalisation beyond the first standardised file.
- **Quarterly review rhythm** `recurring` — Once the app is in real use, schedule a quarterly check-in with Gareth + Gino to revisit rules + sample new edge cases.
