# Lead Engine — Kanban

> Visual rollout state. Edit this file and run `node tools/build.js lead-engine` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The five column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colors.

---

## ✅ Done

- **Discovery + reuse audit** `phase-0` `shipped` — Mapped coreshift-live-edit end to end. Found ~60% of the engine already built: `crawl-site` (scrape), `generate-site` (auto LLM site-gen), Stripe checkout + webhook, Postmark, Supabase Auth, the agency/reseller model (`account_links` + `can_manage_account`), and the admin dashboard.
- **Sale model locked** `phase-0` `decision` — One-off build fee at close (Russ enters the amount on the call). Card saved once via Stripe `setup_future_usage`; the $100/mo subscription starts later at DNS changeover, off-session, with no second card entry. heygem's R4 (SetupIntent + charge-later) is a working reference.
- **v1 scope locked** `phase-0` `decision` — Booking-only. The "claim your website / buy page" (5a) is deferred; the preview page CTA is "book a walkthrough" + a trust video + an 0800 number. NZ-first.
- **Tenancy model locked** `phase-0` `decision` — Build on the existing agency model, not a new workspaces layer. Coreshift = agency #1; a prospect converts into an `account` + `site` on sale; other companies can resell later via `account_links`.

## 🟡 In Progress

- **M1: Workspace auth + roles** `phase-1` `in-progress` — Establish a Coreshift agency account; anyone with a verified `@coreshifthq.com` email joins it as their own user (no shared ricky@ login). Roles admin / sales / reviewer replace the hardcoded `app_admins`. Feature branch + additive migration in flight.

## 🚫 Blocked

- **Google Places API key** `phase-5` `needs-ricky` — Discovery (finding candidate URLs to score) needs a Places API key with billing enabled. Not blocking M1–M4.
- **Russ's Google Calendar** `phase-5` `needs-ricky` — Booking needs Russ's calendar connected (OAuth) to create the 15-min Meet.
- **Trust video + 0800 number** `phase-5` `needs-ricky` — Content for the preview page: a short "how/why we built this for you" video and the NZ 0800 number.

## 🔵 This Week

- **M1 · pipeline schema migration** `phase-1` — Additive migration: `agency_team` (role admin/sales/reviewer, domain auto-join) + the agency-scoped foundation. Applied via Supabase MCP; committed to the repo as a migration file.
- **M1 · domain auto-join** `phase-1` — Verified `@coreshifthq.com` sign-in auto-joins the Coreshift agency account with the right role.
- **M1 · role gate + Russ view** `phase-1` — Replace `is_app_admin` hardcode with role-based access; ship Russ's stripped-down view.

## ⚪ Backlog

- **M2: prospects table + stage machine** `phase-2` — `sourced → scored → generated → in_review → approved → invited → booked → demo → won → paid → finalising → domain_transfer → live`, agency-scoped.
- **M2: CRM pipeline board** `phase-2` — Minimal board in the admin portal; drag across stages; Russ's simplified view.
- **M2: prospect → account+site conversion** `phase-2` — On sale, promote the generated preview site into a real billed account.
- **M3: score-site function** `phase-3` — 7-check rubric (mobile 22 · HTTPS 20 · outdated build 18 · poor images 12 · stale content 10 · no analytics 8 · broken links 8; qualify ≥50). Extends crawl-site; 2 fuzzy checks use tech-fingerprint + a vision call.
- **M3: rubric bars on cards** `phase-3` — Per-check score breakdown shown on each prospect card.
- **M4: on-call invoice button** `phase-4` — Enter amount → Stripe one-off charge + save card → pay link SMS/email mid-call.
- **M4: off-session subscription at go-live** `phase-4` — Start the $100/mo plan against the saved card at DNS changeover.
- **M5: Google Places discovery** `phase-5` — Pull NZ businesses by industry + region → feed URLs to the scorer.
- **M5: invitation email + suppression** `phase-5` — Warm no-obligation invite via Postmark; UEMA-compliant unsubscribe/suppression list.
- **M5: password-token preview** `phase-5` — Signed token in the email URL auto-unlocks the preview + sets a short cookie; bare URL hits a password gate.
- **M5: Google Calendar booking** `phase-5` — 15-min Meet with client + Russ; preview URL in the notes so Russ previews before the demo.
- **Site-gen theme/template tagging** `enhancement` — Tag themes/templates/sections (industry, style) so generate-site auto-selects the right one instead of pure LLM inference.
