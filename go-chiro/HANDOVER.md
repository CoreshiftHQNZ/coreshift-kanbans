# Go-Chiro — Handover
_2026-08-01 · M3 parked (blocked on Luke) · opens M7_

## ▶️ Paste this into a new session

    Go-Chiro M7 — Retail: the clinic shop

    Read coreshift-kanbans/go-chiro/HANDOVER.md and docs/SHOP.md in the repo,
    then give me the 5-line orientation and your first move, and proceed.

    Start with phase 1: migration 0027 + the Products admin page.

## Where we are — for Ricky

- **Just closed:** nothing shipped. 2026-08-01 was an adoption session — Go-Chiro was brought into the working model (slug, milestones, board, this handover), then the milestone was switched.
- **In plain terms:** M3 (prove a full patient day end to end) is **blocked on Luke** — he wasn't working, and the ACC Submit button is still inert because the Vendor ID and Contract ID were never supplied. Rather than sit on it, M7 was pulled forward: a lean shop on the marketing site for the clothing Luke sells. Retail shares no tables and no flows with the cutover, so the two are genuinely independent.
- **Verified by:** board live at https://coreshifthqnz.github.io/coreshift-kanbans/go-chiro/ (HTTP 200, 51 cards); spec pushed to `feat/m7-shop-spec`.
- **Next:** M7 — Retail. Ends when a real customer buys a real garment through the public storefront, pays by card, and Luke marks it collected or shipped.

## 👉 On you

1. **Decide on the leaked identifiers.** Luke's provider and practice numbers were briefly committed to the *public* kanbans repo (commit `0017a9c`). They are removed from the files and the live page, but remain in git history. Leave it, or rewrite history and force-push `main`? Recommendation: leave it — they appear on every ACC invoice Luke issues.
2. **Get Luke's ACC Vendor ID + Contract ID** (plus GST number and provider type) off Splose → Settings → ACC. This unblocks M3.5, not M7 — no rush for this milestone.
3. **Nothing else.** M7 phase 1 and 2 need no input from you.

## 🔴 Risks you're carrying

- **Backorder means a buyer can pay for a garment that does not exist.** This is a deliberate instruction, not an oversight — stock is counted but never gates a sale. Mitigated by disclosure on the product page, the cart line and the confirmation email, plus an awaiting-stock queue in phase 3. **Do not let anyone quietly add a stock gate later without asking Ricky.**
- **Shop emails are gagged by `NOTIFICATIONS_PAUSED`,** which is `true` on both envs until M3.5. If retail launches before go-live, buyers get Stripe's receipt and nothing from Go-Chiro. Does not block phases 1 or 2; becomes a real decision in phase 3.
- **Assumption to check: the deployed state.** Nothing was verified against live Supabase or Railway on 2026-08-01. Env vars and the migration head are read from the repo, not the running system. Confirm before the first migration.
- **M3 is parked, not abandoned.** Its five rehearsal cards sit in `## 🚫 Blocked`. Do not let M7 quietly absorb them.

## For the next Claude

- Repo `CoreshiftHQNZ/go-chiro` (private), working copy `Projects/Go-Chiro/Repo/go-chiro`. Flow is dev → staging → main, auto-deployed to Railway. Never push to `main` directly.
- **Read first:** `docs/SHOP.md` — the full M7 spec, scope locked by Ricky on 2026-08-01. Then `AGENTS.md` for repo conventions and `docs/standards/architecture.md`.
- **Branch state:** the spec sits unmerged on `feat/m7-shop-spec`. Open a docs PR into `dev`, then branch `feat/m7-shop-phase1` off `dev` for the build. `dev` == `staging` == `main` == `e0863bc`; no other open PRs.
- **Migration head is `0026_intake_forms.sql`** — the shop migration is `0027_shop.sql`. Four tables: `products`, `product_variants`, `orders`, `order_items`. All practice-scoped, like every other table in this schema.
- **Phase 1 is the whole first session:** migration 0027 plus `pages/practitioner/ProductsPage.tsx` — CRUD, image upload via the existing Supabase Storage helpers in `server/lib/storage.ts`, GST-inclusive price, sizes, stock counts, pre-order flag, publish toggle. Owner and admin roles only. **Nothing customer-facing ships in phase 1** — the goal is that Luke can load the real catalogue before the storefront exists.
- **Don't touch `server/routes/invoices.ts` or the Payment Intents / saved-card flow.** It is money-critical and was verified in production on 2026-06-27. Retail uses hosted Stripe Checkout on the same account, as its own path.
- **Don't put shop orders in the `invoices` table.** Different tax treatment, no ACC dimension. ACC must never touch a hoodie.
- **Don't flip `SPLOSE_CUTOVER` or `NOTIFICATIONS_PAUSED`.** Both are Ricky's call and both belong to M3.5.
- Anything the build breaks in retail is M7 work. Anything adjacent goes to `## 🔵 This Week`; anything valuable but not soon goes to the Parking Lot.
