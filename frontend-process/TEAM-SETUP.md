# Connecting your side to the Idea Pipeline — setup for Keitha & Ricky

The **Idea Pipeline** is the single "where is every project at" board:
`https://coreshifthqnz.github.io/coreshift-kanbans/frontend-process/`

This doc has two parts:
- **Part 1 — the setup call** (for Abe to run the session).
- **Part 2 — getting started** (for Keitha & Ricky to keep and use).

**Most of the board now updates itself** — two feeds publish automatically:
- **Keitha's Project Radar → board**, via a scheduled Cowork task that reads her Radar
  artifact (the recommended setup).
- **The daily stand-up → board**, via the Worker's nightly cron (Fireflies).

On top of that, the Cowork prompts below push **ad-hoc** updates from notes / a call, or add
new projects — without touching code. Ricky mainly uses these for client-call updates.

---

## Part 1 — Running the setup call (Abe)

Screen-share the board and walk through this in order (~15 min):

1. **Show the board.** Two-view toggle: *Idea Pipeline* (Inbox → Assessment → Review →
   Pending Validation / Rejected) and *Work in Progress* (Build → Live), plus *Archived*.
   Click a card → the review drawer (decide / edit / archive / re-open assessment).
2. **Hand over the reviewer token.** Read it out (or send securely) — they paste it when a
   prompt asks; it never goes in a file, artifact, or chat log. *(It's the Worker's
   `REVIEW_TOKEN`; it gates every board write.)*
3. **Keitha only — GitHub access** for publishing her Radar as a wiki page: a fine-grained
   PAT on `CoreshiftHQNZ/coreshift-kanbans`, Contents: Read & write (she creates it; see
   Part 2). Skip if she won't publish the Radar page today.
4. **Do one real update together.** Open Cowork and run either the **Radar-artifact publish**
   (Keitha) or **Prompt A** (Part 2) against a recent set of notes / a call — let it propose
   updates, say go, watch the card move on the board. This is the "aha".
5. **Keitha — the automated feeds are already on:** her Radar artifact publishes on a Cowork
   schedule, and the daily stand-up pulls via the Worker cron. Also show her: add/update
   projects (Prompt B), publish the Radar as a wiki page (`PUBLISH.md` Prompt B), and review
   ideas from the drawer.
6. **Optional:** set `SLACK_WEBHOOK_URL` so the stand-up cron posts a "what changed" digest to
   Slack (without it the board still updates, just silently). `FIREFLIES_API_KEY` is set.

**Talking points / FAQ**
- *"Do I need the token every time?"* Only for **writes** (publishing updates, deciding,
  editing). Reading the board needs nothing.
- *"What if a project name doesn't match?"* For **stand-up / notes** updates it comes back
  **unmatched** — fix the name and re-run (nothing is guessed). For the **Radar sync / add
  projects** flow, a genuinely new name is **created**, and a name close to an existing card is
  flagged as a **name check** so you align it rather than duplicate. Nothing is silently doubled.
- *"Is it safe to re-run?"* Yes — unchanged cards are skipped, never double-applied.

---

## Part 2 — Getting started (Keitha & Ricky)

### One-time setup
1. **Reviewer token** — ask Abe. Paste it when a prompt asks; **don't save it** anywhere.
2. **Cowork** — open Claude Cowork. To pull a *recorded* meeting, use the Fireflies tools;
   to publish the Radar page (Keitha), connect a working folder when asked.
3. **GitHub PAT (Keitha, only for publishing the Radar page)** — GitHub → *Settings →
   Developer settings → Personal access tokens → Fine-grained* → scope to repo
   `CoreshiftHQNZ/coreshift-kanbans`, permission **Contents: Read and write**. Paste when
   Cowork asks; it's never committed.

The board: `https://coreshifthqnz.github.io/coreshift-kanbans/frontend-process/`
The API it talks to: `https://idea-intake.coreshifthq.workers.dev`

---

### The board keeps itself current (automated)

Two feeds already run on a schedule — nobody has to touch them daily:
- **Project Radar → board (recommended, Keitha).** A scheduled Cowork task reads Keitha's
  Radar artifact and syncs the board to it — updating existing cards AND adding projects that
  aren't on the board yet (as tracked projects, no assessment). This is `PUBLISH.md`'s Radar
  prompt saved as a recurring Cowork task. Keep the Radar current and the board follows.
- **Daily stand-up → board.** The Worker's cron pulls the latest "Daily stand-up" from
  Fireflies each evening and applies the routed updates.

Both go through the same `/api/publish` write path, so they stay consistent and never
double-apply. The prompts below are for **ad-hoc** updates on top of these feeds.

---

### Prompt A — ad-hoc: update the board from notes or a call  *(one-offs / Ricky)*

For a status you want to push right now that isn't in the Radar yet (e.g. straight out of a
client call). Paste into Cowork; swap the first line for your source (typed notes, a pasted
transcript, or "the latest <meeting> in Fireflies"):

```
I want to update the Coreshift Idea Pipeline board from THESE NOTES:
<paste your notes / call transcript here — or ask me to pull a specific meeting from Fireflies>

1. Fetch the current projects:  GET https://idea-intake.coreshifthq.workers.dev/api/ideas
   (no auth) — use each project's "title" and "stage".
2. From my notes, build an update ONLY for a project whose status clearly changed, matching
   each to a project title from /api/ideas:
     { "match": "<exact project title from /api/ideas>",
       "action": "move | waiting-on | park",
       "target_stage": "<for move — one of: inbox, assessment, review, pending_validation,
                         rejected, build, harden, business, launch, live>",
       "note": "<for waiting-on / park — a short reason, e.g. 'awaiting client sign-off'>" }
   Be conservative: a project merely mentioned is NOT a status change. If something isn't
   clearly one of the projects, list it separately for me — don't guess or invent one.
3. Show me the proposed updates first. When I say go, POST them in ONE request to
   https://idea-intake.coreshifthq.workers.dev/api/publish
   with header  Authorization: Bearer <REVIEW TOKEN>  and body  { "items": [ ...objects... ] }.
   If the source was a Fireflies meeting, also include its transcript id as
   "source_meeting_id" in the body — so if someone else pulls the SAME call it's applied only
   once (whoever lands first wins; the other gets "already_ingested"). For typed notes, omit it.
   Ask me for the review token if you don't have it; do not print or save it.
4. Show me the summary: applied · skipped (already up to date) · unmatched (name didn't
   match — I'll fix it) · error (rejected — card left unchanged). If it comes back
   "already_ingested", that meeting was already applied by another feed — nothing to do.
```

What the actions do on a card: **move** → changes its stage/lane · **waiting-on** → flags it
**Blocked** with your reason · **park** → moves it to **Pending Validation** with a note.
(Keitha's *scheduled* feed is the Radar-artifact task above; Ricky can save this one as a
recurring Cowork task too if his call notes live in a consistent place.)

---

### Prompt B — add or update projects  *(mainly Keitha)*

Use this to put projects on the board that aren't there yet — established work that skipped
the assessment funnel — or to set fields on existing ones. A project that already exists is
**updated**; a new one is **created** (tracked as an established project, no assessment
needed). Paste into Cowork:

```
I want to add / update projects on the Coreshift Idea Pipeline board. Here are my projects
(name, where it is, status, owner, links, one-liner):
<paste your list — e.g. "Ops Portal — Live, done, owner Ricky, repo github.com/... , 'internal ops dashboard'">

1. Fetch what's already there:  GET https://idea-intake.coreshifthq.workers.dev/api/ideas
   (no auth) — match each of mine by title so we don't duplicate.
2. Turn each into an item:
     { "action": "add",
       "match": "<title — finds an existing card; if none matches, it's created>",
       "title": "<project name>",
       "one_liner": "<one sentence>  (optional)",
       "stage": "<inbox | assessment | review | pending_validation | rejected | build | harden | business | launch | live>",
       "dev_status": "<in_progress | on_hold | blocked | at_risk | done>  (optional)",
       "dev_status_reason": "<why, if on hold/blocked/at risk>  (optional)",
       "product_owner": "<name>  (optional)",
       "repo_url" / "kanban_url" / "staging_url" / "production_url": "<links>  (optional)" }
   Only include fields I gave you; don't invent stages or statuses.
3. Show me the list first. When I say go, POST in ONE request to
   https://idea-intake.coreshifthq.workers.dev/api/publish
   with header  Authorization: Bearer <REVIEW TOKEN>  and body  { "items": [ ...objects... ] }.
   Ask me for the review token if you don't have it; don't print or save it.
4. Show me the summary:  created · applied (updated) · skipped (already matched) · name check
   (a name too close to an existing card — NOT created; I'll either rename it to match the
   board, or add  "force_create": true  to that one item if it's genuinely a separate, new
   project) · error.
```

A created project lands at the **stage** you give (defaults to Build), marked as an
established/tracked project — it won't nag for an assessment and moves freely on the board. A
name that closely resembles an existing card comes back as a **name check** rather than a
second card, so near-duplicates never sneak in.

---

### Keitha's extra flows

- **Publish from your Project Radar (your main flow)** — `PUBLISH.md`'s Radar prompt reads
  your Radar artifact and pushes the changes to the board. It runs automatically on a Cowork
  schedule; you can also run it on demand any time you update the Radar.
- **Daily stand-up → board** — runs automatically via the Worker cron; `INGESTION.md` has the
  details + a manual re-run if you ever need it.
- **Publish your Project Radar as a wiki page** — `PUBLISH.md` **Prompt B** commits your Radar
  artifact as a browsable page in the wiki (needs the GitHub PAT).
- **Review & decide ideas** — open the board, click a card in **Review** → the drawer;
  **Proceed → Build / Validate first / Do not proceed**. (Needs the token.)

### Re-assessing a card *(either of you)*

Clicking a card in **Inbox** or **Assessment** opens its intake conversation directly. For a
card further along (**Review / Pending Validation / Rejected**), open it and use **↻ Re-open
the assessment conversation** in the drawer — it picks up where the assessment left off
(acknowledging what's captured, asking about what's missing) so you can fill gaps and
re-submit. You can attach a transcript, brief, or screenshots in that conversation (📎).

### New commissioned build (Growth Partners paid work)
Use `https://coreshifthqnz.github.io/coreshift-kanbans/frontend-process/submit.html?mode=commissioned`
— it skips ideation/validation, captures the brief (you can upload the client's brief or a
call transcript), produces a build plan, and lands the card straight in **Build**.

---

**In short:** the board keeps itself current from two automatic feeds — Keitha's **Project
Radar** (scheduled Cowork task) and the **daily stand-up** (Worker cron). On top of that,
**Prompt A** pushes ad-hoc updates from notes / a call (Ricky's main use) and **Prompt B**
adds or updates whole projects. Everything routes through one tested endpoint, so the
automatic and manual updates stay consistent and never double-apply.
