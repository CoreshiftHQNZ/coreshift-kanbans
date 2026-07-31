# Upwind — Handover
_Updated 2026-07-31 · M4 still open · M6 landed_

## ▶️ Paste this into a new session

    Upwind M4 — Start selling

    Read coreshift-kanbans/upwind/HANDOVER.md and the repo docs it points at,
    then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Still on M4 — Start selling.** Its `doneWhen` is unchanged and **not met**: *a partner
  who isn't us sends an offer that a real customer pays for*. That is a sales action, not a
  build one. Nothing technical is blocking it.
- **M6 landed on the way past.** `STRIPE_MODE` is gone from the codebase and from both
  projects' secrets; `assertStripeEnv()` is called from all five Stripe handlers. Verified
  by a real test-card purchase on staging and a guard probe on prod.
- **Every M4 gate that was on Ricky is now closed:** legal sign-off done, lawyer told about
  the consent gap, inbox placement passes on **both iCloud and Gmail**, the Stripe product
  description fixed, the `*_TEST` secrets deleted.

## 🔴 The correction that matters most

**There was never a second Stripe account.** The 28 Jul investigation concluded prod's
`*_TEST` set belonged to a different account (`HXnhNJQhs8` against Upwind's `HtrmVIubMC`)
and that staging had been transacting against it for a month. Both wrong. `HXnhNJQhs8` is
Upwind's own **test-mode** fragment — an account's test and live objects do not share a
fragment, so comparing one against the other proves nothing. Confirmed in the Stripe
dashboard.

**Standing rule:** never infer a Stripe account from an object id. Look it up in the
dashboard for that mode. Both readings look identical from the database, which is why this
survived three days and got repeated into a code comment, a commit, a PR and this board.

## 🔴 Risks you're carrying

- **The Wise rail has still never moved money in any environment.** `partner_payout_details`,
  `payout_batches` and `payout` ledger entries remain **0 rows in both prod and staging**.
  The by-hand fallback now works (the admin screen shows held and below-minimum partners as
  of `20260731100000`), but automated payouts are unproven.
- **M5 has a clock that starts on the first sale, not on the day you look.**
  `accrue_commission()` sets `matures_at = now() + 14 days` and the batch runs monthly on
  the 1st. ~14 days from the first real sale before anyone is actually owed.
- **A build fee over US$60 is still needed** — the only way to get a matured commission
  worth paying, and therefore the only way to prove payouts before a real partner is owed.
- **`run-payout-batch/index.ts:309`** resolves the Wise recipient as
  `details.account ?? details.email`. Wrong order under the email-only model. Unreachable
  today (table empty), same shape as a fallback to a field that should no longer exist.
- **Purge-on-cancel has never fired in production.** Unit-tested, but it only runs on a real
  cancellation; a missing `CLOUDFLARE_ZONE_ID`/`_API_TOKEN` would show only as an
  `error_logs` row.
- **No Partner Agreement acceptance records exist for anyone.** Recording is fixed going
  forward (`20260731120000`) and deliberately **not** backfilled — inventing an acceptance
  row for a document under legal review is the exact failure being fixed. Re-consent is a
  product decision, parked.

## 👉 On Ricky

Nothing is blocking a build. What remains is on the board under `## 👉 On Ricky` and belongs
to M5–M7 — chiefly funding Openprovider (M7) and a >US$60 build fee (M5).

## What shipped 31 Jul

Nine things, all live in production, each with its own Done card: payout visibility,
staff-cannot-claim, consent-as-evidence, the check-your-inbox screen, the crawler 403 retry,
Clients-list filtering, shared partner accounts, site-colour editing + CTA/footer contrast,
and M6. Read the Done column for the reasoning — several turned out to be a different bug
than the card described.

## For the next Claude

- **The board is the state of the world**, and `## ✅ Done` is the reasoning behind it. Read
  it *and the Parking Lot* before proposing anything — a risk was raised on 31 Jul that the
  Parking Lot had already answered.
- **Two standing traps**, both in this project's memory files: migrations are applied **by
  hand** via the Supabase MCP and the MCP stamps its own version, which breaks the Supabase
  CI check until both ledgers are corrected; and `anon` holds a **column allowlist** on
  `public.sites`, so a new column breaks every anonymous read whole-row until granted.
- **A third, added 31 Jul:** `revoke ... from anon` on a new function does nothing on its
  own — `CREATE FUNCTION` grants EXECUTE to `PUBLIC` and anon inherits it. Revoke from
  `PUBLIC`, and verify with `information_schema.role_routine_grants`, not by calling it.
- **Verify against the database or Stripe, never against a screen that says success.** Every
  money bug on this project has been silent.
- **Move child rows before deleting a parent** — `prospects.agency_account_id` and
  `account_links.agency_account_id` are `ON DELETE CASCADE`.
- **Chain is `dev → staging → main`**, no exceptions. The edge-function deploy runs **only
  on `main`**, so a function change is not live until it reaches production.
- Repo docs worth reading: `LAUNCH-CHECKLIST.md`, `SCOPE-one-key-set-per-environment.md`
  (now marked done, with its false finding struck through).
