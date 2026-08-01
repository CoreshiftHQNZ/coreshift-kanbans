# Go-Chiro — Kanban

> Visual build state for the standalone practice management system. Edit this file and run `node tools/build.js go-chiro` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colours.
>
> **🎯 Current focus: M7 — retail.** Direction change 2026-07-21: Go-Chiro stops being a layer on top of Splose and becomes a complete, standalone practice management system. M1 (diary), M2 (native invoicing) and M4 (recalls, waitlist, intake, roles) are all in production. M3 — proving a full patient day end to end — is **blocked on Luke** (his ACC Vendor ID, and his time to run the rehearsal), so on 2026-08-01 Ricky pulled M7 forward: a lean clinic storefront for the clothing Luke sells. Retail shares no tables and no flows with the cutover, so the two run in parallel. Full plan: `docs/ROADMAP.md`, shop spec in `docs/SHOP.md`.
>
> Retrofitted into the working model on 2026-08-01 from the hand-rolled board of 2026-07-21. Cards below are preserved as written.

---

## 👉 On Ricky

- **Run the full-day rehearsal as a real patient** `M3` `decision` — This is the M3 gate and it is on you, because you are an actual customer of Luke's and the only person who can play the patient without touching a real one. Book, attend, have the note published with summary and reports, check homework lands in the patient app, and let the invoice auto-raise and auto-charge your saved card. Nothing else in M3 can be proved without it. Deferred 2026-08-01 — Luke was not working, so M7 was pulled forward instead.
- **Still missing: Luke's ACC Vendor ID + Contract ID** `M3.5` `blocked` — Ricky supplied the provider number and the practice number on 2026-08-01 — two of the five fields needed. But the Submit to ACC button is gated specifically on the Vendor ID and Contract ID, which are different fields on the same screen. Also still missing: the GST number (tax invoices legally need it) and Luke's ACC provider type. None are exposed by the Splose API (checked) — they have to be read off Splose → Settings → ACC by hand. The identifiers themselves are deliberately not recorded on this board: it is a public site. They belong in the app's Practice settings.
- **Pick Luke's switch morning** `M3.5` `decision` — Audit done 2026-07-21. On the agreed morning Luke stops booking in Splose, we flip SPLOSE_CUTOVER=true and NOTIFICATIONS_PAUSED=false, and he logs in on his phone and adds Go-Chiro to his home screen. 79 future appointments, 332 clients and the booking config are already in the app. Not to be picked until the rehearsal passes.
- **Say when notifications go live** `M3.5` `decision` — Reminders, confirmations and recalls stay silent on staging and prod until NOTIFICATIONS_PAUSED=false on both envs. That flip is the moment patients start receiving mail from Go-Chiro rather than Splose, so it is your call and nobody else's.
- **Grab a full Splose export before cancelling the subscription** `M3.5` `ops` — Splose is month-to-month. Once the cord is cut it becomes a read-only archive for a period, but the export has to be taken while the account is still live.

## ✅ Done

- **Automated recalls** `M4` `shipped` — Live in prod. Nudges patients whose last visit was ≥ the practice's recall interval ago with nothing booked; throttled one-per-interval. Off by default (per-practice toggle + interval in Practice settings); rides the notification stack so it's silent until launch. "Clients due for a recall" card on the Today dashboard. PR #80, promoted to production 2026-07-21.
- **Waitlist** `M4` `shipped` — Live in prod. Add clients wanting an earlier/any slot (with optional preferred practitioner + note) from the Today dashboard; reception sees who to call when a gap opens. Auto-offer-by-notification is a later add-on (rides the notification stack once un-paused). PR #89, promoted to production 2026-07-21.
- **Online intake forms** `M4` `shipped` — Live in prod. Standard NZ-chiro new-patient form patients fill in their portal (details, GP, presenting complaint, medical-history checklist, injury/ACC, consent-to-treat); prompt on the patient home until submitted. Practitioner reads it per-client from the Clients list with flagged conditions surfaced. PR #92, promoted to production 2026-07-21.
- **Staff accounts & roles** `M4` `shipped` — Live in prod. Add team members in-app from the new Team page: invite as practitioner (gets a diary column) or admin (reception/billing login, no column), with role change + activate/deactivate. Portal invite emailed via Supabase. Migration 0024 (native practitioners). Fine-grained per-role permission enforcement is a follow-up. PR #86, promoted to production 2026-07-21.
- **ACC invoicing via email channel — cutover gate** `M3` `shipped` `inert` — Built and in production. One-click "Submit to ACC" emails a compliant invoice PDF (ACC billing block: provider no., vendor ID, claim no., NHI + service codes + GST) to providerinvoices@acc.co.nz, subject vendorId INV-n, one per email. Status tracking (submitted/paid/declined from ProviderHub). Billing & ACC settings screen for the IDs. Inert until Luke's Vendor ID is entered — see On Ricky. Electronic channel (8-day, auto-reconciliation) is the M5 upgrade. PR #78.
- **Splose cutover — built; sync resumed pending switch day** `M3` `shipped` — The reversible SPLOSE_CUTOVER flag is built and proven, but the audit showed Luke hasn't switched off Splose yet — so the sync is back ON to prevent silent divergence (anything he books in Splose keeps flowing in). On the agreed switch morning: Luke stops using Splose → flip the flag → app is sole source of truth. One env var, 30 seconds. PR #83.
- **Native invoice engine (ACC-aware)** `M2` `shipped` — Live in prod. Invoices born in-app (auto-drafted on note publish + manual), GST-inclusive maths, per-practice sequential numbering, GST-compliant PDF (practitioner + patient), ACC-portion vs patient co-pay split. Patient pays only their co-pay via Stripe. sploseInvoiceId now nullable (migration 0021). PR #75.
- **Day + week calendar views** `M1` `shipped` — The screen the practice lives in all day. Per-practitioner columns, venue/route-day awareness, mobile-first like the rest of the app. Splose's core job, replaced. PR #73.
- **Practitioner appointment CRUD** `M1` `shipped` — Create/edit/delete appointments for any patient, service, venue from the practitioner side. Before M1 the API only had confirm/cancel/reschedule — appointments were born in Splose or the patient wizard.
- **Drag-to-reschedule + conflicts** `M1` `shipped` — Drag appointments between slots/days with the existing overlap detection guarding double-bookings.
- **Quick-create patient from diary** `M1` `shipped` — Phone rings, new patient, book them in one flow — name + contact, full record filled in later (or by the M4 intake form).
- **Native booking source default** `M1` `shipped` — Flip appointments.bookingSource default 'splose' → 'native'. From M1 on, appointments are born here.
- **Security authz hardening** `M3` `shipped` — Authorization hardening across sessions, appointments and prompts, promoted straight through dev → staging → production on 2026-07-21. PRs #95/#96/#97, the last thing merged before the project went quiet.
- **Clinical loop — session → AI SOAP → publish** `v0` `shipped` — Freeform notes with auto-save, AI formatting into SOAP, editable note + patient-facing summary, publish completes the appointment and notifies the patient. The core differentiated flow.
- **Booking wizard + config + venues + routes** `v0` `shipped` — Patient self-booking (mobile vs clinic first, route days with capacity, NZ address autocomplete), appointment types, venues, weekly/fortnightly schedules, Route Today run sheet with optimization.
- **Stripe payments + auto-pay (live)** `v0` `shipped` — Pay Now, saved-card auto-charge, revenue dashboard. Live keys, webhook + signing secret verified in prod 2026-06-27.
- **ACC claims — capture, lodge, history** `v0` `shipped` — Point-of-care ACC45 capture, lodge tracking + claim numbers, ACC45/ACC18 PDFs, patient-facing claim history + download.
- **Homework + exercise library + messaging** `v0` `shipped` — Library CRUD, per-session assignment, patient do-the-work UI with real streaks, two-way messaging with practitioner replies.
- **Notifications — email + PWA push (paused)** `v0` `shipped` `paused` — Postmark email + VAPID web push across all templates, per-user prefs, reminders on 48h/2h cycle. Globally paused until launch. SMS is a graceful no-op by choice.
- **Patient portal + UX tiers 1–3** `v0` `shipped` — Auth (invite, magic link, reset), patient settings, cancel/reschedule, add-to-calendar, dark theme, design-system reskin, mobile-first with bottom nav.
- **Splose two-way sync (to be retired at M3.5)** `v0` `shipped` — Polling sync + durable write outbox with retries. Served its purpose in the Splose era — scheduled for deletion after cutover. Currently back ON deliberately, because Luke has not switched yet.

## 🟡 In Progress

- **Shop spec** `M7` `spec` — docs/SHOP.md in the repo: the data model, the backorder and pre-order rules, order state machine, GST treatment, and what is deliberately out of scope. Written before any code so the three build phases have something to be checked against.
- **Phase 1 — schema + product admin** `M7` `build` — Migration 0027 (0026_intake_forms is the current head): products, product_variants, orders, order_items. Then a Products page on the practitioner side for owner and admin roles: create, image upload via the existing Supabase Storage helpers, price GST-inclusive, sizes, stock counts, pre-order flag, publish toggle, drag-order. Nothing customer-facing ships in this phase — the goal is that Luke can load the real catalogue before the storefront exists.

## 🚫 Blocked

- **Run the full-day rehearsal** `M3` `blocked-by-luke` — The M3 gate. Needs Luke working and needs Ricky playing the patient. Deferred 2026-08-01 because Luke was not in. Nothing else in M3 can be proved without it.
- **Re-orient on the project after the July pause** `M3` `ops` — Nothing moved between 2026-07-21 and 2026-08-01. Before the rehearsal can be scripted, confirm what staging and prod are actually running and that the Supabase and Railway state matches what this board claims. Cheap, and it stops the rehearsal script being written against a remembered system rather than the real one.
- **Script the full-day rehearsal** `M3` `test` — The step-by-step run sheet with an evidence slot per step: book, practitioner sees it in the diary, session note published with AI SOAP, summary and reports visible in both the client record and the patient view, homework created and live in the patient app, invoice auto-raised, saved card auto-charged. Named evidence per step, not "looked fine".
- **Fix whatever the rehearsal breaks** `M3` — The point of a rehearsal is that it fails somewhere. Whatever it surfaces is M3 work, not a new milestone — it is needed for M3's doneWhen to be true.
- **First real ACC submission** `M3.5` `blocked-by-luke` — Cannot be tested at all until the ACC Vendor ID and Contract ID are in Practice settings. Until then the Submit to ACC button is inert by design. Moved out of M3 on 2026-08-01 precisely because it is unrunnable.
- **Un-pause notifications (launch)** `M3.5` `blocked-by-ricky` — Flip NOTIFICATIONS_PAUSED off on both envs — reminders, confirmations, recalls go live. Gated on Ricky's say-so. Note this also gags every shop email, so retail launching before this flip means buyers get Stripe's receipt and nothing from Go-Chiro.

## 🔵 This Week

- **Phase 2 — storefront + checkout** `M7` `build` — Public Shop and product pages on the existing marketing site (wouter, root paths, alongside /about and /services), a localStorage cart with no server-side cart table, and guest checkout through Stripe Checkout. Webhook gains a checkout.session.completed branch beside the existing payment_intent handlers. Stock decrements on payment and is allowed to go negative — a sale is never refused.
- **Phase 3 — fulfilment + notifications** `M7` `build` — Orders page for staff: the awaiting-stock queue for backordered and pre-order lines, then collect-at-clinic (ready → collected) or ship-within-NZ (packed → shipped, with a tracking number). Four emails on the existing Postmark stack: order confirmation, awaiting stock, ready to collect, shipped.
- **System-of-record hardening (remaining)** `M3.5` `infra` — Now the source of truth for health data: confirm Supabase backups/PITR, add a basic audit trail, review against NZ Privacy Act + Health Information Privacy Code 2020. Must be done before the cord is cut, not after.
- **Full history migration audit** `M3.5` — Audit what Splose holds that the sync doesn't pull today (historic treatment notes, patient files/attachments, ACC claim + invoice history) and migrate it, then run the final full import via the existing sync — its last job.

## ⚪ Backlog

- **Reporting pack** `M5` — Revenue, appointments, no-shows, per-practitioner — simple and glanceable, not enterprise BI.
- **Xero export** `M5` — NZ small business runs on Xero. CSV export first — buys enormous goodwill for little work; API integration later if it earns it.
- **ACC electronic channel upgrade** `M5` — Move from emailed PDFs (M3) to ACC's eBusiness gateway / Invoicing API: straight-through processing, ~8-day payment, electronic remittance + auto-reconciliation. Prereqs: Luke's HealthSecure .pfx + passphrase (likely already held — Splose required uploading the practice's own HealthLink certificate, so this is a config exercise, not a registration slog) and vendor onboarding with ACC digital operations. Plus declined-invoice rework flow.
- **Tenant onboarding + billing (parked)** `M6` — Signup/onboarding for other practices, plan billing, product marketing site. Name locked: Go-Chiro. Parked until the system is proven in Go Chiro's daily use.
- **ACC18 work-capacity capture form** `backlog` — Carried over: ACC18 generator exists but work-capacity + work-modification sections are placeholders. Needs capture form + schema + PDF wiring. Own workstream.
- **Exercise videos via YouTube link** `backlog` — Decided: URL field + embedded player. Carried from the v0 backlog, never scheduled.
- **Retail revenue in the reporting pack** `M5` `M7` — Shop orders are a separate table from clinical invoices on purpose: different tax treatment, and ACC must never touch a hoodie. Both need to land in the M5 reporting pack as separate revenue lines.
- **Shop discount codes** `M7` `follow-up` — Deliberately out of v1. Stripe Checkout supports promotion codes natively, so this is a config flag plus a UI toggle later, not a build.
- **Fine-grained per-role permission enforcement** `M4` `follow-up` — Staff accounts ship with practitioner/admin roles and a diary column distinction, but per-role permission enforcement was explicitly left as a follow-up when roles shipped in PR #86.

## 🅿️ Parking Lot

- **Delete the Splose sync code** `M3.5` `deferred` — Roughly 1k lines of polling sync, outbox and write-backs become dead the day the flag flips. Deliberately kept for a safe archive period after cutover rather than deleted at the switch, so a rollback is still possible. The unverified Splose cancel/reschedule write-back payload follow-up dies here too.
- **Make all splose_* columns nullable** `M3.5` `deferred` — Schema cleanup that belongs with the sync deletion, not before it.
- **SMS notifications** `deferred` — SMS is a deliberate graceful no-op; the notification stack is email + PWA push only. Revisit only if patients demonstrably miss reminders after go-live.
- **Rebranding the codebase** `M6` `deferred` — The repo evolves rather than being restarted (21k lines of prod-proven code with the right architecture). A rebrand happens if and when it becomes a product, not before.
