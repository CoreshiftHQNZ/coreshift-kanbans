# Publishing Project Radar updates into the Idea Pipeline (for Keitha)

You keep your **Project Radar** as a Claude Artifact. This doc lets you push those updates
into the live **Idea Pipeline** board yourself, from Claude Cowork — no engineering help.

There are two things you can do:

- **A — Publish updates to the board.** Your Radar tags become card changes:
  - `move` → moves the card to a stage (e.g. Build, Harden & Secure, Live)
  - `waiting-on` → flags the card **Blocked** with the reason (who/what it's waiting on)
  - `park-for-later` → moves the card to **Pending Validation** (a visible "parked" lane) with a note
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

## Prompt A — publish my Radar updates to the board

Paste this into Cowork (it reads your Radar Artifact and publishes the changes):

```
You have access to my "Project Radar" Claude Artifact. Run list_artifacts and read the one
named "Project Radar" — if there's no exact match, show me the list and let me pick.

Read its current items. Each item is tagged one of: move, waiting-on, or park-for-later, and
names a project. Turn each into an update object:
  { "match": "<project name as it appears on the board>",
    "action": "<move | waiting-on | park>",
    "target_stage": "<ONLY for move — one of: inbox, assessment, review, pending_validation,
                      rejected, build, harden, business, launch, live>",
    "note": "<for waiting-on / park — a short reason, e.g. 'legal review' or 'Q3 budget'>" }

Then POST them in ONE request to  https://idea-intake.coreshifthq.workers.dev/api/publish
with header  Authorization: Bearer <REVIEW TOKEN>  and JSON body  { "items": [ ...objects... ] }.
Ask me for the review token if you don't already have it; do not print or save it.

Finally, show me the response summary in plain English:
  • applied  – projects that were updated
  • skipped  – already up to date (no change needed)
  • unmatched – the project name didn't match any card; list these so I can fix the name
                or decide to add it as a new idea.

Only change the pipeline through that one endpoint — nothing else.
```

**Automatic (optional):** in Cowork, save the above as a **scheduled task** (e.g. every weekday
morning) so your Radar syncs without you running it. It's safe to re-run — unchanged cards are
skipped, never double-applied.

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
- **Project names must match** what's on the board. If something comes back `unmatched`, tweak the
  name in your Radar (or ask to add it as a new idea) and re-run Prompt A.
- **A updates the live board immediately** (it writes to the pipeline database via the API).
  **B just publishes a browsable copy** of your Radar to the wiki — the two are independent, use
  whichever you need.
- The same `/api/publish` endpoint is what the automated stand-up ingestion uses (see
  `INGESTION.md`), so manual and automatic updates go through one consistent path.
