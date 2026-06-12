# HeyGem — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js heygem` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **R2: schema v2 (jobs/chat) verified** `phase-r2` `shipped` — businesses → profiles, pooled gems, jobs (status machine), per-job message threads, quotes, ratings, push devices. RLS throughout (cross-business isolation proven in a rolled-back impersonation test); customer transitions via SECURITY DEFINER RPCs (setup_account, create_job, approve/decline_quote, cancel_job); Realtime on jobs/messages/quotes.
- **R2: customer chat app verified** `phase-r2` `shipped` — apps/customer: magic-link sign-in, onboarding, job list (active/archived), live per-job thread with the quote card (GST breakdown) + approve/decline. Drove the whole loop through the real UI with a seeded session — request → live Gem quote via Realtime → approve → "On it". Not deployed yet (app.heygem.co.nz comes with the Railway consolidation).
- **R1: coming-soon splash LIVE** `phase-r1` `shipped` — heygem.co.nz + staging now serve a "Business Concierge & Errands" coming-soon page. Example requests rendered as chat bubbles (morning tea, Terry's $500 gift, branded water bottles, Christmas party, team building, Sydney conference travel). Early-access form (name + email + "what would you ask your Gem?") → leads table with new `email` column, source `coming_soon`; notify pipeline updated + verified e2e. Old plans-model marketing removed.
- **Apple Developer account: DONE** `phase-r5` `unblocked` — Registered under CORESHIFT LIMITED (D-U-N-S on file). Apple-side store submission is no longer gated; Google Play org account still to set up.
- **PIVOT: concierge model locked** `pivot` `decision` — HeyGem is now a chat-first concierge/errands service for NZ small businesses ("organise team morning tea for Friday"). Thread-per-job chat with auto status/archiving; all-in quote in chat → approve → card charged on completion → push for star rating + feedback + photo. Purely pay-per-job (weekly plans + $1/min dead). Customers get web + native iOS/Android from one React codebase via Capacitor; Gems stay on a web workspace.
- **Foundations (pre-pivot, all survive)** `phase-0` `shipped` — Monorepo + @heygem/ui design system (amethyst brand, real logo/favicon/hero art), GitHub `CoreshiftHQNZ/heygem` (dev→staging→main), Supabase project (ap-southeast-2), Railway deploys.
- **Marketing site LIVE** `phase-0` `shipped` — heygem.co.nz (production/main) + staging.heygem.co.nz (staging), HTTP 200, env inlined. Sells the OLD model — repositioning is Phase R1.
- **Lead capture + notifications** `phase-0` `shipped` — Callback form → Supabase `leads` (anon-insert RLS), `notify-lead` edge function + pg_net trigger, verified e2e. Emails activate when `RESEND_API_KEY` + `LEAD_NOTIFY_TO` secrets are set.
- **Blank-page deploy fixed** `phase-0` `fix` `shipped` — Vite env vars were missing on Railway services; vars set on both services/envs and the Supabase client made lazy/resilient (missing env degrades the lead form, never blanks the page).

## 🟡 In Progress

- **Phase R3: Gem web workspace** `phase-r3` — The other side of the chat: pooled queue of incoming requests, claim a job (all present as "Gem"), reply, send a quote (the composer that creates what R2 verified by hand), move status, mark complete. Lead inbox from the splash lands here too.

## 🚫 Blocked

- **Live Stripe + real payments** `phase-r4` `blocked` — Gated on company registration + bank + GST (~week of 8 Jun 2026). Build in test mode meanwhile.
- **Google Play org account** `phase-r5` `needs-ricky` — Apple is DONE (CORESHIFT LIMITED + D-U-N-S). Remaining: Google Play Console org account (US$25 + identity verification, wants the same D-U-N-S). Only gates Android store submission, not the build.

## 🔵 This Week

- **Gem workspace: queue + quote composer** `phase-r3` — Web app for staff: request queue, claim, chat, quote composer, status transitions, complete.
- **Deploy customer app + consolidate Railway** `phase-r2` `infra` — Stand up app.heygem.co.nz for the customer app and collapse the duplicate marketing services into one service / two envs at the same time.
- **Google Play account** `phase-r5` `needs-ricky` — US$25 + verification under CORESHIFT LIMITED.

## ⚪ Backlog

- **Gem web workspace** `phase-r3` — Pooled request queue, claim, chat, quote composer, mark complete (fires the charge). Lead inbox moves here from Supabase Studio.
- **Stripe pay-per-job** `phase-r4` — Card on file at first approval (SetupIntent), off-session charge on completion, GST receipts, decline handling. Test mode until registered.
- **Capacitor wrap + push + ratings** `phase-r5` — iOS/Android builds from the same React app, FCM/APNs push (quote/done/rate), rating flow with photo upload, store assets + submission.
- **Activate lead emails** `phase-r1` `needs-ricky` — Add `RESEND_API_KEY` + `LEAD_NOTIFY_TO` edge-function secrets once a sender domain exists.
- **Consolidate Railway to one service** `infra` `tech-debt` — Two services exist (`marketing` → heygem.co.nz prod; `heygem` → staging.heygem.co.nz staging). Collapse to one service with two environments.
- **SEO + analytics** `phase-r1` — Meta/OG, sitemap, analytics on the repositioned site.
- **Real testimonials & stats** `content` — Replace placeholders with concierge-flavoured proof once first customers land.
- **Brand polish pass** `low-priority` `content` — On-dark logo variant, brand guide, type refinements when a designer is involved.
