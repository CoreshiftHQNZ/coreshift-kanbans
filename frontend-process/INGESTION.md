# Stand-up → Idea Pipeline ingestion

The daily stand-up already captures where every project is at. This turns those notes
into board updates automatically, so the Idea Pipeline stays current without anyone
re-typing status by hand.

There are **two ways** it runs — you don't need both:

- **Manual (works right now).** You run a Cowork prompt that reads today's stand-up
  from Fireflies, shows you the proposed updates, and — once you say go — publishes them
  to the board. Uses your own Fireflies connection in Cowork; **no engineering setup needed.**
- **Automated (a one-time key flip).** The pipeline pulls the latest stand-up on a daily
  schedule and applies the updates itself, posting a summary to Slack. This needs one
  secret set on the server (`FIREFLIES_API_KEY`) — see [Going automatic](#going-automatic).

Both paths do the same thing and go through the same safe, idempotent update endpoint,
so it's fine to use the manual path today and switch the automation on later.

How stand-up notes map to the board:

| In the stand-up | On the board |
|---|---|
| A project **moved forward / changed lane** ("approved, moving to build", "shipped → live") | card moves to that **stage** |
| A project is **waiting on** someone/something ("pending legal", "awaiting client email") | card flagged **Blocked** + the reason |
| A project is **paused / parked** for later | card moves to **Pending Validation** + the reason |

Anything mentioned that **isn't** a current pipeline project is reported back as *unmatched* —
never guessed at, never auto-created.

The board: `https://coreshifthqnz.github.io/coreshift-kanbans/frontend-process/`
The API: `https://idea-intake.coreshifthq.workers.dev`

---

## Manual — pull today's stand-up in Cowork (available now)

You need the pipeline **reviewer token** once (ask Abe — it's the pipeline's `REVIEW_TOKEN`).
Paste it when the prompt asks; don't save it into any file or artifact.

Paste this into Cowork:

```
Get the most recent Coreshift "Daily stand-up" from Fireflies (use the Fireflies tools —
list recent transcripts, pick the newest whose title is the daily stand-up, and read its
summary + action items). Note its Fireflies transcript id — you'll pass it below.

Then fetch the current pipeline projects:
  GET https://idea-intake.coreshifthq.workers.dev/api/ideas   (no auth needed)
Use each project's "title" and "stage".

From the stand-up's action items + summary, build an update ONLY for a project whose status
clearly changed, matching each to a project title from /api/ideas:
  { "match": "<exact project title from /api/ideas>",
    "action": "<move | waiting-on | park>",
    "target_stage": "<ONLY for move — one of: inbox, assessment, review, pending_validation,
                      rejected, build, harden, business, launch, live>",
    "note": "<for waiting-on / park — a short reason, e.g. 'legal review' or 'awaiting client email'>" }
Be conservative: a project merely being discussed is NOT a status change. If something
mentioned isn't clearly one of the pipeline projects, DON'T guess — list it separately for me.

Show me the proposed updates first, in plain English. When I say go, POST them in ONE request to
  https://idea-intake.coreshifthq.workers.dev/api/publish
with header  Authorization: Bearer <REVIEW TOKEN>  and body
  { "source_meeting_id": "<the stand-up's Fireflies transcript id>", "items": [ ...objects... ] }.
The source_meeting_id lets the board skip this stand-up if the automatic nightly feed already
applied it (and vice-versa), so the same meeting is never double-counted. Ask me for the review
token if you don't have it; do not print or save it.

Then show me the response:
  • status "already_ingested" – this stand-up was already applied (by the nightly feed or an
                                earlier run); nothing to do.
  • applied   – cards updated
  • skipped   – already up to date
  • unmatched – project name didn't match a card (so I can fix the name or add the idea)
  • error     – update rejected (bad/unknown target_stage, or the write failed) — card left unchanged
```

It's safe to re-run — unchanged cards are skipped, never double-applied. You can also save it
as a **scheduled Cowork task** to run every weekday morning.

> This manual path uses **your** Fireflies access in Cowork, so it works without any server-side
> key. It's also the fallback if the automation below is ever down.

---

## Going automatic

Once set up, the pipeline pulls the latest stand-up **daily** (two evening-UTC checks so an
irregular meeting time is still caught the same day) and applies the updates on its own,
posting a summary to Slack. Everything below is already built and deployed — it just needs
the key.

**1. Set the Fireflies key (the one remaining step).** From `frontend-process/worker/`:

```
npx wrangler secret put FIREFLIES_API_KEY
```

Paste a Fireflies API key when prompted. Get it from **Fireflies → Settings → Developer settings
→ API key**. Use the key of an account that attends the stand-ups (Keitha's, since she organises
them) or a dedicated Fireflies service account. The key is server-side only and is never committed.
Requires a Fireflies plan tier that includes API access (Pro/Business).

**2. (Optional) Slack digest.** To get the "what changed" summary posted to Slack, set:

```
npx wrangler secret put SLACK_WEBHOOK_URL
```

Without it, ingestion still runs — it just doesn't post a digest.

That's it. The schedule (`crons` in `worker/wrangler.toml`) and the whole routine are already live.

### Trigger it on demand

Anytime, without waiting for the schedule (needs the reviewer token):

```
curl -s -X POST https://idea-intake.coreshifthq.workers.dev/api/ingest \
  -H "Authorization: Bearer <REVIEW TOKEN>" \
  -H "content-type: application/json" -d '{}'
```

Add `-d '{"force": true}'` to re-process the latest stand-up even if it was already ingested.
If the key isn't set yet, this returns a clear JSON message (HTTP 503) pointing you back to the
manual Cowork prompt above — a graceful pointer, not a crash (`curl -s` prints it fine).

### How it stays safe

- **Idempotent.** Each stand-up transcript is processed at most once (tracked in an
  `ingestion_log` table), so repeated daily fires with nothing new are cheap no-ops.
- **Never invents projects.** Only existing pipeline cards are updated; unknown mentions are
  reported as *unmatched* in the digest, not created.
- **Same endpoint as manual.** The cron routes updates through the exact `/api/publish` core
  that the Cowork prompt uses — one consistent, tested write path.

---

## Good to know
- **Project names must match** the board. Unmatched items show up in the digest / Cowork summary —
  fix the name in the stand-up notes (or add the idea) and it'll match next time.
- Manual and automatic can coexist — passing `source_meeting_id` means a stand-up is applied
  once no matter which feed runs first (the other sees it's done and returns `already_ingested`).
- Related: `PUBLISH.md` (Keitha publishing her Project Radar to the board and the wiki).
