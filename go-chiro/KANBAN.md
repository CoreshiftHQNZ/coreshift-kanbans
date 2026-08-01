# Go-Chiro — Kanban

> Visual build state for the standalone practice management system. Edit this file and run `node tools/build.js go-chiro` from the coreshift-kanbans repo root to refresh the published board.
>
> **Card format:** `- **Title** \`tag\` \`tag\` — Description.`
>
> The column headings below are what the renderer looks for. Keep the leading emoji — it's how the engine assigns colours.
>
> **🎯 Current focus: M3 — prove the day.** Direction change 2026-07-21: Go-Chiro stops being a layer on top of Splose and becomes a complete, standalone practice management system. M1 (diary), M2 (native invoicing) and M4 (recalls, waitlist, intake, roles) are all in production. M3's code is in production too — but it has never been exercised. The ACC Vendor ID is unset, the Splose sync is deliberately back ON, notifications are paused, and no one has run a whole patient day through the system end to end. M3 now closes on a rehearsal, and the switch morning became M3.5. Full plan: `docs/ROADMAP.md` in the repo.
>
> Retrofitted into the working model on 2026-08-01 from the hand-rolled board of 2026-07-21. Cards below are preserved as written.

---

## 👉 On Ricky

- **Run the full-day rehearsal as a real patient** `M3` `decision` — This is the M3 gate and it is on you, because you are an actual customer of Luke's and the only person who can play the patient without touching a real one. Book a mobile and a clinic appointment on staging, attend them, have the note published, take the invoice, pay the co-pay, and let the ACC portion submit. Nothing else in M3 can be proved without it.
- **Enter Luke's ACC Vendor ID + Contract ID** `M3` `blocked` — Everything M1–M3 plus recalls is live in production, but the Submit to ACC button is inert until these are set in Payments → ⚙ Practice settings. Heads-up: they are NOT exposed by the Splose API (checked) — they have to be read off Splose → Settings → ACC by hand, along with the GST number (tax invoices legally need it), Luke's ACC provider number and provider type. Screenshot that screen and we are set.
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

- **Re-orient on the project after the July pause** `M3` `ops` — Nothing has moved since 2026-07-21. Before the rehearsal can be scripted, the next session has to re-read docs/ROADMAP.md, confirm what staging and prod are actually running, and check the Supabase and Railway state matches what the board claims. Cheap, and it stops the rehearsal script being written against a remembered system rather than the real one.
- **Script the full-day rehearsal** `M3` `test` — Write the step-by-step run sheet the rehearsal follows, with an evidence slot per step: book mobile + clinic as a patient, practitioner sees them in the diary, session note written and published with AI SOAP, invoice auto-drafts with the correct ACC/co-pay split, co-pay charged via Stripe, ACC portion submitted, statuses land. Named evidence per step, not "looked fine".

## 🚫 Blocked

- **First real ACC submission** `M3` `blocked-by-ricky` — Cannot be tested at all until the ACC Vendor ID and Contract ID are in Practice settings. Until then the Submit to ACC button is inert by design, so the last step of the rehearsal is unrunnable.
- **Un-pause notifications (launch)** `M3.5` `blocked-by-ricky` — Flip NOTIFICATIONS_PAUSED off on both envs — reminders, confirmations, recalls go live. Gated on Ricky's say-so.

## 🔵 This Week

- **Fix whatever the rehearsal breaks** `M3` — The point of a rehearsal is that it fails somewhere. Whatever it surfaces is M3 work, not a new milestone — it is needed for M3's doneWhen to be true.
- **System-of-record hardening (remaining)** `M3.5` `infra` — Now the source of truth for health data: confirm Supabase backups/PITR, add a basic audit trail, review against NZ Privacy Act + Health Information Privacy Code 2020. Must be done before the cord is cut, not after.
- **Full history migration audit** `M3.5` — Audit what Splose holds that the sync doesn't pull today (historic treatment notes, patient files/attachments, ACC claim + invoice history) and migrate it, then run the final full import via the existing sync — its last job.

## ⚪ Backlog

- **Reporting pack** `M5` — Revenue, appointments, no-shows, per-practitioner — simple and glanceable, not enterprise BI.
- **Xero export** `M5` — NZ small business runs on Xero. CSV export first — buys enormous goodwill for little work; API integration later if it earns it.
- **ACC electronic channel upgrade** `M5` — Move from emailed PDFs (M3) to ACC's eBusiness gateway / Invoicing API: straight-through processing, ~8-day payment, electronic remittance + auto-reconciliation. Prereqs: Luke's HealthSecure .pfx + passphrase (likely already held — Splose required uploading the practice's own HealthLink certificate, so this is a config exercise, not a registration slog) and vendor onboarding with ACC digital operations. Plus declined-invoice rework flow.
- **Tenant onboarding + billing (parked)** `M6` — Signup/onboarding for other practices, plan billing, product marketing site. Name locked: Go-Chiro. Parked until the system is proven in Go Chiro's daily use.
- **ACC18 work-capacity capture form** `backlog` — Carried over: ACC18 generator exists but work-capacity + work-modification sections are placeholders. Needs capture form + schema + PDF wiring. Own workstream.
- **Exercise videos via YouTube link** `backlog` — Decided: URL field + embedded player. Carried from the v0 backlog, never scheduled.
- **Fine-grained per-role permission enforcement** `M4` `follow-up` — Staff accounts ship with practitioner/admin roles and a diary column distinction, but per-role permission enforcement was explicitly left as a follow-up when roles shipped in PR #86.

## 🅿️ Parking Lot

- **Delete the Splose sync code** `M3.5` `deferred` — Roughly 1k lines of polling sync, outbox and write-backs become dead the day the flag flips. Deliberately kept for a safe archive period after cutover rather than deleted at the switch, so a rollback is still possible. The unverified Splose cancel/reschedule write-back payload follow-up dies here too.
- **Make all splose_* columns nullable** `M3.5` `deferred` — Schema cleanup that belongs with the sync deletion, not before it.
- **SMS notifications** `deferred` — SMS is a deliberate graceful no-op; the notification stack is email + PWA push only. Revisit only if patients demonstrably miss reminders after go-live.
- **Rebranding the codebase** `M6` `deferred` — The repo evolves rather than being restarted (21k lines of prod-proven code with the right architecture). A rebrand happens if and when it becomes a product, not before.
