# Go-Chiro — Handover
_Reconstructed from the board on 2026-08-01 · opens M3_

## ▶️ Paste this into a new session

    Go-Chiro M3 — ACC billing + Splose cutover: prove the day

    Read coreshift-kanbans/go-chiro/HANDOVER.md and the repo docs it points at,
    then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** nothing. This is an adoption, not a milestone close. The project went quiet on 2026-07-21 after the security hardening merged, and has not moved since.
- **In plain terms:** the whole system is built and deployed to production — diary, native invoicing, ACC billing, recalls, waitlist, intake forms, staff roles. But it is running with the handbrake on. Splose is still the source of truth, the sync is deliberately still ON, notifications are silent, and the ACC Submit button is inert because Luke's Vendor ID was never entered. **Nobody has ever run a whole patient day through it.**
- **Verified by:** 97 merged PRs; every M1–M4 feature promoted to production via PRs #77, #82, #85, #88, #91, #94, #97. `dev`, `staging` and `main` all sit at `e0863bc` with no open PRs.
- **Next:** M3 — ACC billing + Splose cutover. Ends when a full patient day is rehearsed end-to-end on staging with you as the patient, every step evidenced.

## 👉 On you before M3 can close

1. **Run the full-day rehearsal as a real patient.** You are an actual customer of Luke's, so you can play the patient on staging without touching a real one. This is the milestone gate and it cannot be delegated.
2. **Enter Luke's ACC Vendor ID + Contract ID** in Payments → ⚙ Practice settings, plus the GST number and Luke's ACC provider number/type. They are not exposed by the Splose API — they have to be read off Splose → Settings → ACC by hand. Without the Vendor ID the last step of the rehearsal is unrunnable.

Deferred to M3.5 (do **not** do these until the rehearsal passes): pick Luke's switch morning, un-pause notifications, take the Splose export.

## 🔴 Risks you're carrying

- **This handover is reconstructed, not verified.** It was built from the hand-rolled board of 2026-07-21, `docs/ROADMAP.md` and the git history. Nobody sat in a closing session and wrote it. The claims below the git evidence line are inferences until checked.
- **Assumption to check: the deployed state still matches the board.** Nothing has been confirmed against live Supabase or Railway. Env vars in particular — `SPLOSE_CUTOVER`, `NOTIFICATIONS_PAUSED` and the sync being ON are all as of 2026-07-21, not as of today. Verify before doing anything that depends on them.
- **Assumption to check: 79 future appointments and 332 clients are in the app.** That figure came from the 2026-07-21 audit. Ten days of Splose sync have run since, if the sync is still running at all.
- **Never-exercised code path.** ACC submission has been in production since 21 July and has never been run once. Expect the rehearsal to fail somewhere in it — that failure *is* the M3 work.
- **The M3/M4 inversion is real, not a board error.** M4 shipped in full before M3 closed, because M3's tail is a switch morning and a set of IDs only Luke has. Do not read "M4 done, M3 current" as a bookkeeping mistake.
- **Health data, no hardening yet.** Supabase backups/PITR, an audit trail and the NZ Privacy Act + Health Information Privacy Code 2020 review are all still outstanding. They gate M3.5, not M3 — but the app already holds real patient records today.

## For the next Claude

- Repo `CoreshiftHQNZ/go-chiro`, working copy at `Projects/Go-Chiro/Repo/go-chiro`, branch `dev`. `dev` == `staging` == `main` == `e0863bc`; no open PRs. Flow is dev → staging → main, auto-deployed to Railway. Never push to `main` directly.
- **Read first:** `docs/ROADMAP.md` (the whole standalone-PMS plan and every locked decision), then `docs/standards/architecture.md`, `auth.md`, `storage.md`. `AGENTS.md` carries the repo conventions.
- **State:** M1 diary, M2 native invoicing and all four M4 features (recalls, waitlist, intake forms, staff roles) are live in production. M3's ACC email-channel submission and the reversible `SPLOSE_CUTOVER` flag are built and deployed but both inert.
- **First move:** re-orient before scripting anything. Confirm what staging and prod are actually running and what the env vars actually say — the board is ten days stale and the whole rehearsal is worthless if it is written against a remembered system.
- **Then:** write the rehearsal run sheet with an evidence slot per step (book mobile + clinic → diary → note published with AI SOAP → invoice auto-drafts with correct ACC/co-pay split → Stripe co-pay → ACC submit → statuses land). Named evidence per step. "Looked fine" is not evidence.
- **Don't:** flip `SPLOSE_CUTOVER` or `NOTIFICATIONS_PAUSED`. Both are Ricky's call and both belong to M3.5. The sync being ON is deliberate — it prevents silent divergence while Luke is still booking in Splose.
- **Don't:** delete the Splose sync code. It is parked for a safe archive period after cutover so a rollback stays possible.
- Anything the rehearsal breaks is M3 work — it is needed for the doneWhen to be true. Anything adjacent and valuable goes to `## 🔵 This Week`; anything valuable but not soon goes to the Parking Lot.
