# Publishing Project Radar updates into the Idea Pipeline (for Keitha)

You keep your **Project Radar** as a Claude Artifact. This doc lets you push those updates
into the live **Idea Pipeline** board yourself, from Claude Cowork — no engineering help.

There are two things you can do:

- **A — Sync your Radar to the board.** Every project in your Radar becomes a card: ones
  already on the board are **updated** (stage, status, owner), and ones that aren't there yet
  are **added** as tracked projects (no assessment needed). A name too close to an existing
  card is flagged for you to reconcile, never silently duplicated.
- **B — Publish your Radar itself as a wiki page**, so the whole team can browse it in the wiki.

You can run these any time (manually), or set A up as a scheduled Cowork task to run automatically.

---

## One-time setup

1. **GitHub access** (only needed for B — publishing your Radar as a wiki page).
   Create a fine-grained Personal Access Token: GitHub → *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate*. Scope it to repository **`CoreshiftHQNZ/coreshift-kanbans`**, permission **Contents: Read and write**. Copy the token somewhere safe. You'll paste it when Cowork asks — **it never gets committed**.
2. **Pipeline token** (needed for A — updating the board). Ask Abe for the **reviewer token** (the pipeline's `REVIEW_TOKEN`). Paste it when the prompt asks; don't save it into the Radar or any file.
3. In Cowork, **connect a working folder** when prompted (for B's clone). A is just a web request — no folder needed.

The board lives at `https://coreshifthqnz.github.io/coreshift-kanbans/frontend-process/`. The API it talks to is `https://idea-intake.coreshifthq.workers.dev`.

---

## Prompt A — sync my Radar to the board (updates existing + adds new)

Paste this into Cowork. It reads your Radar Artifact and makes the board match it — updating
projects already on the board and **adding ones that aren't there yet** (as tracked projects,
no assessment needed):

```
You have access to my "Project Radar" Claude Artifact. Run list_artifacts and read the one
named "Project Radar" — if there's no exact match, show me the list and let me pick.

First fetch what's already on the board:
  GET https://idea-intake.coreshifthq.workers.dev/api/ideas   (no auth)
Use each card's "title" and "stage".

For EVERY project in my Radar, build one upsert item — matched to a board card where it
already exists, created where it's genuinely new:
  { "action": "upsert",
    "match": "<the board title if this project is already a card; else the project name>",
    "title": "<the project name>",
    "stage": "<its current stage — one of: inbox, assessment, review, pending_validation,
               rejected, build, harden, business, launch, live>",
    "dev_status": "<in_progress | on_hold | blocked | at_risk | done>   (optional)",
    "dev_status_reason": "<why, if on hold / blocked / at risk>          (optional)",
    "product_owner": "<name>                                            (optional)",
    "one_liner": "<one sentence>                                        (optional)" }

Map my Radar's language to a stage: building/in dev → build; hardening/QA/security → harden;
pricing/commercial → business; launching → launch; shipped/done → live; paused/deprioritised
→ pending_validation. If a project is waiting on someone, set dev_status "blocked" + the
reason. Only include fields I actually give you — don't invent stages or statuses.

Show me the list first. When I say go, POST in ONE request to
  https://idea-intake.coreshifthq.workers.dev/api/publish
with header  Authorization: Bearer <REVIEW TOKEN>  and body  { "items": [ ...objects... ] }.
Ask me for the review token if you don't have it; do not print or save it.

Then show me the summary in plain English:
  • created    – new cards added from the Radar
  • applied    – existing cards updated
  • skipped    – already up to date (no change)
  • name check – NOT created because the name is close to an existing card (e.g. "Sales
                 Velocity" vs "Velocity"). For each, tell me the existing card it matched, so
                 I can either rename it in my Radar to match the board EXACTLY (to update that
                 card), or — if it's genuinely a different, new project — re-run just that one
                 item with  "force_create": true  added.
  • error      – rejected (bad stage/status) — card left unchanged.

Only change the pipeline through that one endpoint — nothing else.
```

**Automatic (recommended):** save the above as a **scheduled Cowork task** (e.g. every weekday
morning) so your Radar syncs without you running it. It's safe to re-run — unchanged cards are
skipped, a name too close to an existing one is flagged rather than duplicated, and newly
created cards ping Slack (if the digest is wired up) so nothing lands unseen.

---

## Prompt B — publish my Radar as a wiki page

Paste this into Cowork (it commits your Radar Artifact into the wiki and links it in the menu):

```
I want to publish my "Project Radar" Claude Artifact as an interactive HTML page in our team
wiki. The wiki is the GitHub repo https://github.com/CoreshiftHQNZ/coreshift-kanbans, served
via GitHub Pages; I have write access (I'll paste a Personal Access Token when you ask — don't
commit it anywhere). The wiki's left-hand menu is the NAV array in assets/wiki.js; any push to
main auto-deploys.

Please:
1. Ask me to connect a working folder if you don't have one, then clone the repo into it using
   my token for auth.
2. Run list_artifacts, find my artifact named "Project Radar" (if no exact match, show me the
   list and let me pick), read its HTML, and commit it as a self-contained, fully interactive
   file at  boards/project-radar.html  — do NOT convert it to Markdown.
3. Add this entry to the NAV array in assets/wiki.js, inside the "Projects" group:
   { key: "project-radar", icon: "🛰️", text: "Project Radar", href: "boards/project-radar.html" }
4. Commit with a clear message, push to main, and give me the live GitHub Pages URL to verify
   once Pages redeploys (about a minute).
```

Re-running B later republishes the latest version of your Radar to the same page.

---

## Good to know
- **Keep Radar names matching the board.** Prompt A now *adds* new projects, so a name that's
  close-but-different (e.g. "Sales Velocity" vs "Velocity") comes back as a **name check** — it
  won't update the existing card, and it won't duplicate it, until you align the name in your
  Radar (or confirm it's genuinely new with `force_create`). Exact-matching names keep it clean.
- **A updates the live board immediately** (it writes to the pipeline database via the API).
  **B just publishes a browsable copy** of your Radar to the wiki — the two are independent, use
  whichever you need.
- The same `/api/publish` endpoint is what the automated stand-up ingestion uses (see
  `INGESTION.md`), so manual and automatic updates go through one consistent path.
