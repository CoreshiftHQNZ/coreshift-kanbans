# HeyGem — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js heygem` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **PIVOT: concierge model locked** `pivot` `decision` — HeyGem is now a chat-first concierge/errands service for NZ small businesses ("organise team morning tea for Friday"). Thread-per-job chat with auto status/archiving; all-in quote in chat → approve → card charged on completion → push for star rating + feedback + photo. Purely pay-per-job (weekly plans + $1/min dead). Customers get web + native iOS/Android from one React codebase via Capacitor; Gems stay on a web workspace.
- **Foundations (pre-pivot, all survive)** `phase-0` `shipped` — Monorepo + @heygem/ui design system (amethyst brand, real logo/favicon/hero art), GitHub `CoreshiftHQNZ/heygem` (dev→staging→main), Supabase project (ap-southeast-2), Railway deploys.
- **Marketing site LIVE** `phase-0` `shipped` — heygem.co.nz (production/main) + staging.heygem.co.nz (staging), HTTP 200, env inlined. Sells the OLD model — repositioning is Phase R1.
- **Lead capture + notifications** `phase-0` `shipped` — Callback form → Supabase `leads` (anon-insert RLS), `notify-lead` edge function + pg_net trigger, verified e2e. Emails activate when `RESEND_API_KEY` + `LEAD_NOTIFY_TO` secrets are set.
- **Blank-page deploy fixed** `phase-0` `fix` `shipped` — Vite env vars were missing on Railway services; vars set on both services/envs and the Supabase client made lazy/resilient (missing env degrades the lead form, never blanks the page).

## 🟡 In Progress

- **Rebuild planning → Phase R1 kickoff** `pivot` — Plan agreed; next concrete step is repositioning the live marketing site (it currently sells weekly admin plans).

## 🚫 Blocked

- **Live Stripe + real payments** `phase-r4` `blocked` — Gated on company registration + bank + GST (~week of 8 Jun 2026). Build in test mode meanwhile.
- **Store submissions** `phase-r5` `blocked` `needs-ricky` — Apple Developer org account needs the registered company + D-U-N-S number (the long pole — start the D-U-N-S request the day the company exists; US$99/yr). Google Play org account US$25 + verification. Build isn't gated — only submission.

## 🔵 This Week

- **Phase R1: reposition marketing** `phase-r1` — Rewrite the live site to the concierge model (SMB audience, chat-quote-approve-done story, pay-per-job). Keep lead form + design system.
- **Kick off store accounts** `phase-r5` `needs-ricky` — As soon as the company registers: request D-U-N-S, enrol Apple Developer (org) + Google Play Console (org).
- **Schema v2 design** `phase-r2` — businesses→users, gems, jobs (status machine), messages (Realtime), quotes, ratings, devices; RLS. Replaces the old time-logging model.

## ⚪ Backlog

- **Customer app: job/chat core** `phase-r2` — Magic-link sign-in, request composer, job list (active/archived), live per-job chat with quote-approve.
- **Gem web workspace** `phase-r3` — Pooled request queue, claim, chat, quote composer, mark complete (fires the charge). Lead inbox moves here from Supabase Studio.
- **Stripe pay-per-job** `phase-r4` — Card on file at first approval (SetupIntent), off-session charge on completion, GST receipts, decline handling. Test mode until registered.
- **Capacitor wrap + push + ratings** `phase-r5` — iOS/Android builds from the same React app, FCM/APNs push (quote/done/rate), rating flow with photo upload, store assets + submission.
- **Activate lead emails** `phase-r1` `needs-ricky` — Add `RESEND_API_KEY` + `LEAD_NOTIFY_TO` edge-function secrets once a sender domain exists.
- **Consolidate Railway to one service** `infra` `tech-debt` — Two services exist (`marketing` → heygem.co.nz prod; `heygem` → staging.heygem.co.nz staging). Collapse to one service with two environments.
- **SEO + analytics** `phase-r1` — Meta/OG, sitemap, analytics on the repositioned site.
- **Real testimonials & stats** `content` — Replace placeholders with concierge-flavoured proof once first customers land.
- **Brand polish pass** `low-priority` `content` — On-dark logo variant, brand guide, type refinements when a designer is involved.
