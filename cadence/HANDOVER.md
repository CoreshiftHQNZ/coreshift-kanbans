# Cadence — Handover
_2026-08-19 · closes M2 (Ground truth) · opens M3 (Concierge cycle proven) · no calendar dates: this project is scheduled by milestone_

## ▶️ Paste this into a new session

    Cadence M3 — Concierge cycle proven

    Read coreshift-kanbans/cadence/HANDOVER.md and the docs it points at, then
    give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** M2 — Ground truth. Eleven sections of evidence, and **two of the project's founding
  premises turned out to be wrong.**
- **In plain terms:** we went looking for the list of checks Dave performs on each GST return. There isn't
  one. His sheet tracks *status* — amount, due date, reviewed date — and the reviewed date is a bare date
  with no reviewer name and nothing behind it. So the thing we suspected was true is worse than we thought,
  which is good news for the product: the sign-off genuinely proves nothing today.
- **The two premises that broke.** First, we said Colab *pays for the review twice*, because a reviewer
  re-derives what a preparer already did. **Dave does all of it himself** — prepares, checks, reviews and
  signs 171 clients. There is no second pass, so that argument has to go. What replaces it is better:
  **one person is the bottleneck on 171 GST returns, six times a year for the 134 two-monthly ones.**
  Second, we assumed the time goes into checking miscoded transactions. **It mostly doesn't** — three
  quarters of what Dave writes down is *"I can't do this yet, the records aren't here."* That doesn't change
  whether we build it; it changes what we build first.
- **Verified by:** IRD's own published GST101A, GST103B and IR375 (March 2026) PDFs, text-extracted rather
  than remembered — the box map is now certain and `prd.md` Q4 is closed. 277,595 real ledger lines measured
  across 139 client profiles: **62% of transaction lines are checkable, only 8% have no baseline.** Xero's
  own developer terms and pricing pages, read directly in a browser. Colab's live sheet, exported today,
  171 clients parsed in full. Nine answers from Dave in person.
- **Next:** M3 — Concierge cycle proven. Ends when Dave signs off from workpapers we made by hand, on at
  least 7 of 10 returns. **No code in M3, by design.** Dave has already agreed to sign them.

## 👉 On you before M3 can close

1. **Send the Xero email** (`docs/m2-ready-to-send.md` §4). Six questions; three decide what M4 builds.
   Doesn't block M3, but M4 shouldn't start without it. **Default if you don't: I'll assume the worst case
   — no `Journals` access — and design M4's spike around rebuilding the ledger from cheaper endpoints.**
2. **Get me Xero access to Colab's client organisations, as a person.** M3 means preparing ten real returns
   by hand, which needs someone at Coreshift able to read the ledgers. A human logging into Xero normally is
   fine — it's *automation* their terms prohibit, not use. **Default if you don't: M3 stalls. This is the
   one hard blocker.**
3. **Decide: are the 34 six-monthly clients in scope?** Two-monthly is 78.4% and the test was ~80%.
   **Default: I'll include them** — they look easier, not harder (all four *no bank feeds* notes sit on
   six-monthly clients and all four still filed).
4. **Rewrite the "pays twice" economics** in `product-vision.md` and `prd.md` before either is shown to
   anyone. **Default: I'll rewrite it to the single-bottleneck version above and you review it.**
5. **Optional:** one filed client's Drive folder, to see what a finished workpaper contains today.

## 🔴 Risks you're carrying

- **`Journals` is an Advanced-tier Xero endpoint — $1,445 AUD/month, plus an annual security assessment and
  a discretionary approval.** It is the endpoint the whole traceability guarantee was designed around. Not
  fatal; the ledger can probably be rebuilt from cheaper endpoints, but that is M4 work nobody had planned.
- **Xero's terms prohibit browser automation.** That was the fallback way of getting data, and it is how
  the archived spike got all 147 client ledgers. It also removes the data source for the
  unreconciled-bank-line check. A person using Xero normally is unaffected.
- **Xero's AI/ML clause may cover the coding-profile engine.** It forbids using their data to train
  "predictive analytics tools", and on a literal reading a per-client coding profile is one. Asked in the
  Xero email; the defensible answer is that it's a frequency count, not a trained model.
- **171 clients against an uncertified ceiling of 50.** Certification is now the only external
  accreditation left, and a second cap bites too: a client org can host only two uncertified apps at once,
  which you can't detect before trying to connect.
- **Xero's own GST worksheet still ships this year.** Colab have seen nothing of it, so it isn't live —
  but it isn't gone either. Watch item, not a resolved one.

## For the next Claude

- **Docs:** `Colab Accountant/docs/gst-ground-truth.md` is the milestone's output and the thing to read
  first — **§5 before any M4 thinking, §6 for the observed exception vocabulary, §12 for the verdict.**
  Then `product-roadmap.md` M3. `prd.md` §14 Q4 and Q8 are now resolved in place.
- **State:** no application code exists and no repo yet — `core-ricky/cadence` is free (the spike is
  `cadence-spike`, archived). Creating it is M4. Colab's live sheet is cached at
  `docs/ground-truth/gst-client-list-LIVE-2026-08-19.xlsx`, **gitignored — client financial data.**
- **Rules banked, all traceable to something observed:** `AR_CASH_CODED` and
  `SALES_NETTED_AGAINST_LOAN` (both Box 5, both from Dave's own notes, neither in FR-011),
  `IMPORT_IN_BOX_11` and `ADJUSTMENT_UNSUPPORTED` (from IRD's form), `ENTERTAINMENT_THRESHOLD` (Colab's
  hand-written $57.50 rule — **verify against IRD before implementing**).
- **Do first in M3:** decide the concierge cycle's shape against Colab's **live August cycle, closing
  28 August** with 122 of 171 clients still in progress. Real returns under a real deadline beats a
  retrospective exercise, and shadowing it is already agreed with Dave.
- **🔴 Don't** build FR-001 as written — it pulls from `Journals`. See §5.2.
- **🔴 Don't** implement the 11-rule catalogue in `prd.md` FR-011 — §6.2 replaces it with observed rules.
- **🔴 Don't** treat `CONTROL_ACCOUNT_UNRECONCILED` as something Colab asked for. It came from the
  `GST Rec` tab, which Dave says is *"a template as a workaround, ignore this tab"*. Still worth building —
  nobody doing it is an argument for the product — but don't present it as a discovered requirement.
- **🔴 Don't** re-add the shared-Supabase coupling. `prd.md` still describes it in places; the clean-build
  decision killed it.
- **🔴 Don't** implement the GST101A box map from memory even now it's verified — copy §1's table. Box 15
  is a magnitude **plus a direction** (`refund`/`to_pay`/`nil`), never a signed number, and Boxes 9 and 13
  are not derivable from a ledger at all.
