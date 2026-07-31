# HeyGem — Handover
_Reconstructed from the board on 2026-07-31 · opens M6_

## ▶️ Paste this into a new session

    HeyGem M6 — First paying customers on the live loop

    Read coreshift-kanbans/heygem/HANDOVER.md and the repo docs it points at,
    then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky
- **Just closed:** M5 — Ratings + closed loop (native mobile deliberately deferred 2026-07-29)
- **In plain terms:** the product works end to end on real money. A business can text a Gem, get a quote in the chat, approve it, have the job done, have their card charged for real, get a GST receipt and leave a star rating. There is nothing technical left before a first customer.
- **Verified by:** live Stripe keys (NZ/NZD, charges + payouts enabled) with a real charge through the flow · signed/unsigned/replayed/stale webhook probes · `submit_rating` RPC replacing the old direct-INSERT policy · all three apps building clean
- **Next:** M6 — First paying customers on the live loop. Ends when a real customer who isn't us runs a job end to end: request → quote approved → live card charged → rated.

## 👉 On you before M6 can close
1. **Get the first paying customer in.** Nothing in the build is blocking it — who to approach and how it's pitched is yours.
2. **Say who covers the Gem queue.** Any `@heygem.co.nz` address has full workspace access, but there's no record of who's on shift or what response time we promise. A first customer messaging into an unwatched queue is how we lose them.

## 🔴 Risks you're carrying
- **Live Stripe, real cards.** M4 is on live keys since 2026-07-02. Any bug in the charge path costs a real customer real money — the double-charge guard, `Idempotency-Key` and webhook ledger were added in response to exactly that, so treat that code as money-critical.
- **`is_gem()` is any `@heygem.co.nz` email.** Convenient for onboarding a Gem, but it means every team address can see every customer's data. One unintended surface for that (the customer-app job list) was already found and fixed on 2026-07-29. Assume there may be others; offboarding an email is the only revocation.
- **Two Railway services, not one.** `marketing` → production, `heygem` → staging. Easy to deploy to the wrong one. Collapsing them is M7.
- _Assumption to check (reconstructed, not confirmed):_ **nobody is mid-way through anything.** This handover was rebuilt from the board and git log, not from a closing session. If you had work in flight on 2026-07-30/31 that never reached a commit, it isn't recorded here.
- _Assumption to check:_ **M7 and M8 scope.** Grouped from the existing backlog cards (SEO/OG/analytics + Railway consolidation → M7; Capacitor + push + store submissions → M8). The board never named them as milestones.

## For the next Claude
- Repo `CoreshiftHQNZ/heygem`, branch `dev` (dev → staging → main, Railway auto-deploys). Working dir `/Users/Ricky/Documents/Claude/Projects/HeyGem` — **the folder was renamed from `traction`; the slug is `heygem`.**
- Monorepo: `apps/marketing` (heygem.co.nz), `apps/customer` (app.heygem.co.nz), `apps/staff` (team.heygem.co.nz), `packages/ui`. Supabase project in ap-southeast-2, migrations in `supabase/`.
- State: full loop live — job lifecycle with persistent numbers (Enquiry #1024 → Quote #1024 → Order #1024), per-job chat over Realtime, quote line items with an auto 15% Gem fee, off-session charge on completion, Postmark receipts, ratings, CRM. Marketing hero is the live job reel; `#reel-<scene-id>` renders the demo band alone for screen recordings.
- **Don't** touch `stripe-charge-job` or `stripe-webhook` casually — live money, and both carry deliberate idempotency guarantees (Stripe `Idempotency-Key`, a `stripe_events` ledger, atomic compare-and-set before receipt emails).
- **Don't** widen `is_gem()`, and don't rely on RLS alone to scope a customer-side query — scope on `business_id` explicitly (see `apps/customer/src/screens/Home.tsx`).
- Board: https://coreshifthqnz.github.io/coreshift-kanbans/heygem/
