# Go-Chiro — Handover
_2026-08-01 · M7 in flight · phase 1 of 3 built_

## ▶️ Paste this into a new session

    Go-Chiro M7 — Retail: the clinic shop

    Read coreshift-kanbans/go-chiro/HANDOVER.md and docs/SHOP.md in the repo,
    then give me the 5-line orientation and your first move, and proceed.

    Phase 1 is built and on PR #99. Start with phase 2: the public storefront,
    the cart, and Stripe Checkout.

## Where we are — for Ricky

- **Just closed:** M7 phase 1 — the shop schema and the product admin page. Migration 0027 is applied to the live Supabase database; the code is on PR #99 into `dev`.
- **In plain terms:** Luke can now load his real catalogue — products, sizes, stock counts, photos, prices, pre-order flags, publish toggles. Nothing is customer-facing yet; the storefront is phase 2. M3 (prove a full patient day) is still parked, blocked on Luke.
- **Verified by:** `tsc` clean and `npm run build` passing; all six product endpoints returning 401 unauthenticated (an unmounted path falls through to the SPA with a 200, so the JSON 401s prove the router is really mounted); slug helpers unit-tested, 7 cases; migration asserted against the live database — 4 tables, 15 indexes, the practices column, the bucket. The two load-bearing spec claims were exercised in a rolled-back transaction: stock reached **−3** after selling 5 against 2 in stock, and an order line **survived product deletion** with its name, price, qty and `backorder` state intact.
- **Not verified:** the Products page has not been driven in a browser against real data. There is no local `.env` and the only database is shared with production, so no test products were written into it. First real exercise is Luke loading the catalogue on staging.
- **Next:** phase 2 — public `/shop` pages, localStorage cart, guest checkout via hosted Stripe Checkout, the `checkout.session.completed` webhook branch, and stock decrement on payment.

## 👉 On you

1. **Review and merge PR #99** into `dev` — then it needs promoting through `staging` before Luke can touch it. Nothing deploys off `dev`.
2. **Decide on the leaked identifiers.** Luke's provider and practice numbers were briefly committed to the *public* kanbans repo (commit `0017a9c`). Removed from the files and the live page, still in git history. Leave it, or rewrite history and force-push `main`? Recommendation: leave it — they appear on every ACC invoice Luke issues.
3. **Get Luke's ACC Vendor ID + Contract ID** (plus GST number and provider type) off Splose → Settings → ACC. Unblocks M3.5, not M7 — no rush for this milestone.
4. **Nothing else.** Phase 2 needs no input from you.

## 🔴 Risks you're carrying

- **Backorder means a buyer can pay for a garment that does not exist.** Deliberate instruction, not an oversight — stock is counted but never gates a sale, and the schema now enforces that (`stock_qty` is signed, verified negative). Mitigated by disclosure on the product page, the cart line and the confirmation email, plus the awaiting-stock queue in phase 3. **Do not let anyone quietly add a stock gate without asking Ricky.**
- **Shop emails are gagged by `NOTIFICATIONS_PAUSED`,** `true` on both envs until M3.5. If retail launches before go-live, buyers get Stripe's receipt and nothing from Go-Chiro. Doesn't block phase 2; becomes a real decision in phase 3. Stated preference is to ship retail *after* M3.5 rather than carve shop mail out of the pause switch.
- **The role gate deviates from the spec, on purpose.** `docs/SHOP.md:132` says the shop is "owner and admin only". Luke's role is `practitioner` and he is the only non-patient user, so that gate would lock him out of his own catalogue. The shop uses the same trio as every other practitioner surface. Promoting Luke to `practice_admin` was rejected because `routes/exercises.ts` requires exactly `practitioner` to create exercises. A real owner role is a M6 card.
- **Railway state is still unconfirmed.** Supabase was checked against the board on 2026-08-01 and matched. Nobody has confirmed what the staging and production services are actually running, or that env vars match what's recorded.
- **M3 is parked, not abandoned.** Its rehearsal cards sit in `## 🚫 Blocked`. Do not let M7 quietly absorb them.

## For the next Claude

- Repo `CoreshiftHQNZ/go-chiro` (private), working copy `Projects/Go-Chiro/Repo/go-chiro`. Note the `.coreshift-project` marker is at `Repo/go-chiro`, *not* at `Projects/Go-Chiro` — open the session in the repo directory or the SessionStart hook won't find the board.
- Flow is dev → staging → main, auto-deployed to Railway. Never push to `main` directly.
- **Read first:** `docs/SHOP.md` — the full M7 spec, scope locked by Ricky 2026-08-01. Then `AGENTS.md` and `docs/standards/architecture.md`.
- **Branch state:** `feat/m7-shop-phase1` → PR #99 into `dev`. The spec landed separately on PR #98. Branch `feat/m7-shop-phase2` off `dev` once #99 merges (or off `feat/m7-shop-phase1` if you need to keep moving before review).
- **Migration head is now `0027_shop.sql`**, applied. Next is `0028`. Migrations are applied by hand via Supabase MCP `apply_migration` — they do not run on deploy. Keep them idempotent.
- **Phase 2 is the whole next session:** `pages/marketing/` gets `/shop`, `/shop/:slug`, `/shop/cart`, `/shop/order/:number`; cart in localStorage with no server-side cart table; `routes/shop.ts` for public read + create checkout session; `stripe-webhook.ts` gains a `checkout.session.completed` branch beside the existing handlers (it's a flat if-chain on `event.type`, so it's purely additive); stock decrements on payment and is allowed to go negative.
- **GST has one implementation.** `gstComponentCents` in `services/invoicing.ts` is it — shop orders reuse it. `services/shop.ts` deliberately does not reimplement the formula. GST component of a tax-inclusive total is `total × 3/23`, and it returns 0 when the practice isn't GST-registered.
- **Order numbering:** reuse the `nextInvoiceNumber` pattern in `services/invoicing.ts` — `COALESCE(MAX(...), 0) + 1` scoped to the practice, with a retry on `23505` unique violation. The partial unique index `uq_orders_practice_number` is already in place.
- **`practices.shop_shipping_flat_cents`** holds the flat NZ rate, GST-inclusive, settable from the Shop page. Collect at the clinic is free.
- **Don't touch `server/routes/invoices.ts` or the Payment Intents / saved-card flow.** Money-critical, verified in production 2026-06-27. Retail uses hosted Stripe Checkout on the same account as its own path.
- **Don't put shop orders in the `invoices` table.** Different tax treatment, no ACC dimension. ACC must never touch a hoodie.
- **Don't flip `SPLOSE_CUTOVER` or `NOTIFICATIONS_PAUSED`.** Both are Ricky's call and both belong to M3.5.
- Anything the build breaks in retail is M7 work. Anything adjacent goes to `## 🔵 This Week`; anything valuable but not soon goes to the Parking Lot.
