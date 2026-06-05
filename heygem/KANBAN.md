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

## 🟡 In Progress

_None — awaiting kick-off of Phase 0 foundations._

## 🚫 Blocked

- **Live Stripe + real payments** `phase-4` `blocked` — Gated on company registration + bank + GST (client targeting ~week of 8 Jun 2026). Build and test billing in Stripe test mode meanwhile; flip to live keys after.

## 🔵 This Week

- **Create GitHub repo** `phase-0` `setup` — `heygem` under CoreshiftHQNZ, dev → staging → main branch flow.
- **Create Supabase project** `phase-0` `setup` — One project under CoreShift org; plan role-based RLS for the two apps.
- **Verify Cloudflare DNS** `phase-0` `setup` — Confirm NS moved off 1st Domains and propagated for heygem.co.nz.
- **Extract design system** `phase-0` `build` — Pull the emerald theme, fonts, and Icon/Logo/GemPhoto components from the prototype into a shared Vite component library.

## ⚪ Backlog

- **Port marketing site** `phase-1` — marketing.jsx → production build on heygem.co.nz with lead-capture form wired to Supabase.
- **Auth + accounts** `phase-2` — Magic-link (customers) / password (staff); businesses → many users; RLS.
- **Staff/ops workspace** `phase-3` — Lead queue, pooled assignment, per-task time + activity logging, weekly note.
- **Customer dashboard on real data** `phase-4` — Port portal.jsx; hours ring, weekly bill, timeline, Gem note from real logged data.
- **Stripe metered billing** `phase-4` — Subscriptions + usage-based overage, weekly billing run, self-serve cancel/plan change.
- **Real Gem photos** `phase-4` `content` — Swap brand-avatar fallback for real staff photos when supplied.
- **Real testimonials & stats** `phase-1` `content` — Replace prototype placeholders once first clients land.
- **Final logo & brand** `low-priority` `content` — Replace placeholder facet mark/wordmark when design is delivered.
