# Cadence — Handover
_2026-08-19 · closes M1 (Idea locked) · opens M2 (Ground truth) · no calendar dates: this project is scheduled by milestone_

## ▶️ Paste this into a new session

    Cadence M2 — Ground truth

    Read coreshift-kanbans/cadence/HANDOVER.md and the docs it points at, then
    give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** M1 — Idea locked. Verdict **Strong, 25/30**, but reframed on the way.
- **In plain terms:** Xero already computes *and files* the NZ GST return, so we are not building
  filing. We are building the thing that proves the return is right first — the exception sweep, the
  traceable workpaper, and the named sign-off that Colab currently fakes with a tick in a Google
  Sheet. Because that tick proves nothing, their reviewer re-derives every return from scratch, and
  **Colab pays for the review twice.** That duplicated pass is the money.
- **Verified by:** six planning docs in `Colab Accountant/docs/`; `VISION.md` validated field-by-field
  against the skill's template by script; 87 roadmap tasks, ids sequential, each with files + notes;
  Cadence's real state read from the repo via `gh` rather than assumed; IRD's DSP onboarding stages
  and Xero's exclusion of published NZ GST returns from `ListAllPublishedReports` both confirmed from
  source.
- **Also closed:** the old `core-ricky/cadence` was a **feasibility spike, not a foundation** — 43
  commits in one week then dormant. Renamed `cadence-spike`, archived read-only with a superseded
  banner, lessons harvested. The clean rebuild deletes the shared-schema coupling, the CI scope
  guard, and the two-service Xero token race in one move.
- **Next:** M2 — Ground truth. Ends when `docs/gst-ground-truth.md` § Conclusions states whether the
  core assumption held: that GST time goes into mechanically-checkable exceptions rather than chasing
  clients. **M2 and M3 contain no software on purpose.**

## 👉 On you before M2 can close

1. **Get Colab's live GST Google Sheet, the client list, and 3 cycles of WIP data.** Blocks four
   other M2 tasks. Nothing about the ruleset is real until this lands.
2. **Email IRD's DSP team** — is an operated-on-behalf service eligible, who holds the registration,
   how long. Longest pole in the project; costs a day to start.
3. **Name the preparer and the reviewer, and get the reviewer's yes** to reviewing ten hand-made
   workpapers. Without that, M3 has no gate.
4. **Ask Colab what they have seen of Xero Workpapers' GST worksheet.**
5. **Open Xero app partner certification** once Claude confirms the org cap (see risks).

## 🔴 Risks you're carrying

- **The core assumption is unverified and it decides the project.** If GST hours go into chasing
  clients rather than checking coding, the engine automates the cheap half and no headcount moves.
  M2 task 4 settles it; if it fails, the correct move is to re-scope to the chase-and-comms layer,
  not to build anyway.
- **Xero is shipping a GST worksheet into Workpapers this year, bundled.** Rebuilt with BGL, beta
  since January 2026, rolling out to all NZ partners. Its **existence is confirmed; its feature depth
  is not** — xero.com returned 403/503 when read. If it generates exceptions from ledger history
  rather than just organising the review, the differentiation narrows sharply.
- **⚠️ Assumption to check, not a verified fact: the Xero 25-connected-org cap.** Taken from the
  archived spike's own README, not from Xero's terms. Colab has 50+ orgs. **If it holds, M10 is
  unreachable until the Xero app is certified** — a second external accreditation, gating an earlier
  milestone than IRD does. Verifying it is the first thing Claude should do in M2.
- **IRD may not accredit a single-customer operated service at all.** Undocumented either way on
  ird.govt.nz. Mitigated by design — M8's magic moment needs no filing, and M9 files through Xero's
  existing IRD connection — but it is a real unknown with no published timeline.
- **The profile engine is newly in scope (M5).** It was assumed free from the spike's live
  `coding_profiles`; on a clean build it does not exist. Smaller than the spike's full reconcile loop,
  but not nothing.

## For the next Claude

- **Docs:** `Colab Accountant/docs/` — read `product-roadmap.md` **M2** first, then
  `gst-ground-truth.md` if it exists yet. `prd.md § 14` holds the eight open questions.
- **State:** no application code exists. No repo yet — `core-ricky/cadence` is free again (the spike
  is `cadence-spike`, archived); creating it is M4, not now.
- **Do first, without waiting on Ricky:** verify the GST101A box map against IRD's current published
  form, verify the Xero org cap against Xero's own developer terms, and check coding-profile
  feasibility plus GST-return usage across Colab's clients.
- **🔴 Don't** implement the GST101A box map from memory — `prd.md § 3` marks it *indicative and
  unverified* deliberately. A wrong box is a wrong tax return.
- **🔴 Don't** implement the 11-rule exception catalogue in `prd.md` FR-011 as written — it is a
  **hypothesis**, and TASK-010 replaces it from Colab's actual sheet. A plausible rule nobody
  observed is noise with a confidence score attached.
- **🔴 Don't** skip M2/M3 to start building. They are the two phases most likely to be rationalised
  away and they exist because building the ruleset from assumptions is this project's largest
  identified risk.
- **Known debt:** `prd.md` still describes the abandoned shared-Supabase architecture — the
  additive-only constraint, `verify-scope.ts`, and the shared token-refresh RPC. Reconciling it is on
  This Week. Don't build the coupling we just decided against.
