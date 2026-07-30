# Upwind — Handover
_Reconstructed from the board on 2026-07-30 · opens M4 — Start selling_

## ▶️ Paste this into a new session

    Upwind M4 — Start selling

    Read coreshift-kanbans/upwind/HANDOVER.md and the repo docs it points at,
    then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** M3 — Money path + security hardening.
- **In plain terms:** the app is finished. Your read on 30 Jul was right, and it checked out
  against production: 9 sign-ins in 24 hours across magic link *and* Google, two prospects
  through to `paid`, custom domains proved live. What is left is proof, ops and paperwork —
  plus one capability that has never run anywhere (payouts) and one deliberately unbuilt
  (domain registration).
- **Verified by:** prod ledger nets **US$0.00** (4 commissions + 4 clawbacks, `matures_at` set);
  **0** anon write grants and **0** tables without RLS; `domain-search` 401s without a JWT on
  both projects; 590 tests, `tsc` and `deno check` clean; `upwind.build`, `tryupwind.com`,
  `staging.upwind.build`, `testing.upwind.build` all 200.
- **Next:** M4 — Start selling. Closes when a partner who isn't us sends an offer that a real
  customer pays for.
- **Your call that shaped this:** payouts must be *verified* but must not *block sales* —
  worst case partners are paid by hand, which doesn't stop them getting started. So payouts
  became M5 with a deadline, not a gate.

## 👉 On you before M4 can close

1. **Legal sign-off on the Partner Agreement** — the document a recruited partner accepts. The
   commission model changed after the draft (100% of build fee less real payment costs and 5%).
2. **Inbox placement on iCloud + Gmail** — unchecked since the Postmark token swap. The throttle
   is gone (custom SMTP + raised limits, both environments, 30 Jul), so this is the last unknown
   on the front door.

Everything else on your plate sits under `## 👉 On Ricky` on the board and belongs to M5–M7.

## 🔴 Risks you're carrying

- **The manual-payout fallback does not currently work.** It depends on the admin screen showing
  who is owed what, and that screen filters to payable-only: `AdminDashboard.tsx:348` calls
  `previewPayouts()` with no argument, so the US$50 minimum applies and the 14-day maturity hold
  hides anything recent. A partner owed US$27 is invisible there. ~1 hour to fix and it is the
  first card in This Week — do it before the first real sale, not after.
- **There is a clock on M5.** `accrue_commission()` sets `matures_at = now() + 14 days` and the
  batch runs monthly on the 1st, so from the first real sale there are ~14 days before anyone is
  actually owed money. That is the deadline for payouts, and it is generous — but it starts the
  day someone sells, not the day you decide to look at it.
- **The Wise rail has never moved money in any environment.** `partner_payout_details`,
  `payout_batches` and `payout` ledger entries are all **0 rows in both prod and staging**.
- **`run-payout-batch/index.ts:309`** resolves the Wise recipient as `details.account ?? details.email`.
  Wrong order under the email-only model. Unreachable today (table empty), same shape as a
  fallback to a field that should no longer exist.
- **Prod's `*_TEST` Stripe secrets belong to a different Stripe account** (`HXnhNJQhs8`, not
  Upwind's `HtrmVIubMC`). Dormant under `STRIPE_MODE=live`; it has misrouted a production
  payment once already.
- **Purge-on-cancel has never fired in production.** Shipped 30 Jul and unit-tested, but it only
  runs on a real cancellation. If `CLOUDFLARE_ZONE_ID` / `CLOUDFLARE_API_TOKEN` were missing on
  the prod project the only symptom would be an `error_logs` row.
- **Assumption to check, not verified:** that M0–M2's `doneWhen` lines match what actually closed
  them. They were written on 30 Jul from the Done cards' own evidence, not from a closing session
  — nobody was running this model when they happened.

## For the next Claude

- **The board is the state of the world**, and the `## ✅ Done` column is the reasoning behind it.
  Read it before proposing anything; it is 60 cards deep and records why decisions went the way
  they did. Never regenerate it.
- **Two traps that have each cost a deploy.** Both are in this session's memory files:
  migrations are applied **by hand** via the Supabase MCP (no workflow runs `db push`) and the
  MCP stamps its own version, which breaks the Supabase CI check until both ledgers are corrected;
  and `anon` holds a **column allowlist** on `public.sites`, not a table grant, so a new column
  breaks every anonymous read whole-row until it is granted.
- **Verify against the database or Stripe, never against a screen that says success.** Every money
  bug found on this project was silent. Two examples from 30 Jul: the ledger looked fine and was
  US$27.34 wrong, and a resent Stripe event returned 200 while the idempotency guard silently
  refused to process it.
- **Move child rows before deleting a parent.** `prospects.agency_account_id` and
  `account_links.agency_account_id` are `ON DELETE CASCADE`; a cascade has eaten a seed site once.
- **Chain is `dev → staging → main`**, no exceptions. CI auto-deploys staging and production.
- Repo docs worth reading in order: `LAUNCH-CHECKLIST.md` (the gates),
  `PROD-STATE-2026-07-28.md`, `TOMORROW.md`, `SCOPE-one-key-set-per-environment.md`.
