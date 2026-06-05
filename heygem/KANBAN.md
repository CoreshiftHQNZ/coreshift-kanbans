# HeyGem — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js heygem` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`

---

## ✅ Done

- **Brief + prototype reviewed** `phase-0` `discovery` — Read the website brief and the clickable prototype (marketing, fake checkout, customer dashboard) + screenshots. Identified the real gap: the staff app that produces the dashboard data doesn't exist yet.
- **Scope locked — full system** `phase-0` `decision` — Marketing + checkout + customer dashboard + Gem/ops staff workspace + billing. Not marketing-only.
- **Architecture locked** `phase-0` `decision` — Coreshift stack (Vite/React + Supabase + Railway); separate customer & staff apps; Gems log work manually (per-task minutes) as the source of truth for dashboard + billing.
- **Billing model locked** `phase-0` `decision` — Real Stripe, metered: weekly plan + $1/min overage; PAYG $1/min capped $60/hr. GST exclusive (+15% at checkout).
- **Brand model locked** `phase-0` `decision` — Every assistant is just "Gem" (no names); pooled team all present as Gem; real staff photos with a brand-avatar fallback.
- **Logistics confirmed** `phase-0` `decision` — New Stripe acct (business registers ~wk of 8 Jun); DNS moving to Cloudflare; keep prototype logo for now; multi-user per business; self-serve cancel/plan-change; named tools are trust signals only (no v1 integrations).
- **Monorepo + design system** `phase-0` `shipped` — pnpm workspace with three Vite/React-TS apps (marketing, customer, staff) + `@heygem/ui` shared design system (emerald tokens + Facet/Icon/Logo/GemPhoto/Button ported from the prototype). All three apps build green; GemPhoto supports real photos with a branded fallback.
- **GitHub repo created** `phase-0` `shipped` — `CoreshiftHQNZ/heygem` (private). `main` / `dev` / `staging` branches pushed; dev → staging → main flow.
- **Supabase project created** `phase-0` `shipped` — `heygem` (ref `ysdikfmlqgyuvmwtkrun`, ap-southeast-2). URL + publishable key wired into `.env.example` on `dev`.
- **Real brand assets wired** `phase-0` `shipped` `brand` — Client-supplied pop-art diamond logo + favicon added to `@heygem/ui` (new Logo + Mark components, logo downscaled 1.4MB→106KB). Accent repointed emerald→amethyst purple to match; amber + deep-teal kept for a jewel palette. Verified rendering on the live marketing build.
- **Marketing site ported** `phase-1` `shipped` — Full homepage on the new scaffold + design system: hero, the 9pm problem, how-it-works, what-your-Gem-does, pricing on-ramp + 3 plan cards, trust/testimonials, callback CTA, footer. GST-exclusive note added; copy de-named to the single-"Gem" brand.
- **Lead capture wired** `phase-1` `shipped` — Callback form writes to a Supabase `leads` table via anon-insert RLS. Verified end-to-end in a real build (form submit → row in DB, then cleaned up).

## 🟡 In Progress

- **Cloudflare DNS verify** `phase-0` `infra` — heygem.co.nz still resolves to 1st Domains nameservers; the move to Cloudflare hasn't propagated/taken yet. Must land before Railway can attach the domain.

## 🚫 Blocked

- **Live Stripe + real payments** `phase-4` `blocked` — Gated on company registration + bank + GST (client targeting ~week of 8 Jun 2026). Build and test billing in Stripe test mode meanwhile; flip to live keys after.

## 🔵 This Week

- **Deploy marketing to Railway** `phase-1` `infra` — Marketing app is built + verified; stand up the Railway service (staging→main), set Supabase env vars, and attach heygem.co.nz once DNS lands. This is what makes Phase 1 actually "live".
- **Lead notifications + ops view** `phase-1` — Leads land in the DB but nobody's alerted yet. Email/Slack notify on new lead, and a simple ops list to read them (interim until the Phase 3 ops workspace).
- **SEO + analytics** `phase-1` — Meta/OG tags, sitemap, and analytics on the marketing site before it goes public.

## ⚪ Backlog

- **Auth + accounts** `phase-2` — Magic-link (customers) / password (staff); businesses → many users; RLS.
- **Staff/ops workspace** `phase-3` — Lead queue, pooled assignment, per-task time + activity logging, weekly note.
- **Customer dashboard on real data** `phase-4` — Port portal.jsx; hours ring, weekly bill, timeline, Gem note from real logged data.
- **Stripe metered billing** `phase-4` — Subscriptions + usage-based overage, weekly billing run, self-serve cancel/plan change.
- **Real Gem photos** `phase-4` `content` — Swap brand-avatar fallback for real staff photos when supplied.
- **Real testimonials & stats** `phase-1` `content` — Replace prototype placeholders once first clients land.
- **Brand polish pass** `low-priority` `content` — Logo + favicon now live (amethyst). Later: optional on-dark logo variant, full brand guide, type/spacing refinements once a designer is involved.
