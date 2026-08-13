# Engine Optimization — Handover
_2026-08-13 · closes M1 · opens M2_

## ▶️ Paste this into a new session

    Engine Optimization M2 — Audit engine

    Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at,
    then give me the 5-line orientation and your first move, and proceed.

## Where we are — for Ricky

- **Just closed:** M1 — Data spine.
- **In plain terms:** the tool can now see a client's real numbers. Storepro's Search Console and Google Analytics data for the last four months is loading automatically and showing month-on-month movement. The Google access you set up works for the whole client estate at once — 65 Search Console properties and 98 Analytics properties — so adding the next client needs nothing from Google at all. That was the piece that had been stuck since July.
- **Verified by:** four months of Storepro data read straight out of the database (8 rows, two sources × four months); the client screen returning real figures — July: 815 clicks, 77,496 impressions, 1,264 organic visits; a screenshot of it; typecheck clean; commit `bd7cbe5` pushed.
- **Next:** M2 — Audit engine. Ends when a crawl of a real client site produces a scored audit with per-page detail and findings, visible in the app.

## 👉 On you before M2 can close

1. **DataForSEO account + API credentials.** You approved this on 13 Aug; it hasn't been created yet. It doesn't block the crawling and scoring work, but the domain-authority framework needs backlink data and refuses to produce a score without full coverage — so without it that half stays blank rather than showing a low number. **Default if you don't answer:** M2 ships with the crawl-based scores only and the authority score waits for M3.
2. **The client list.** Only Storepro is set up. There are 47 domains with working Search Console access across the estate and no way for me to tell a paying retainer client from an old access grant someone was given years ago. Names are enough — the rest is automated. **Default if you don't answer:** everything stays Storepro-only, which is fine for building and useless for a real monthly cycle.

## 🔴 Risks you're carrying

- **Storepro may be losing traffic to Google's AI Overviews, and we can't yet prove it.** Several informational searches rank at position 7–9 with 500+ impressions and **zero clicks** — position 7 should return 10–15. Impressions holding while clicks vanish is the known fingerprint for it, and Analytics confirms AI engines are reading the site (AI-referred visits went 0 → 31 → 43 over three months). This is a hypothesis, not a finding: average position is an average, and a different search feature could cause the same pattern. M3's probe panel is what settles it. Flagged because if it's true, an audit that only scores on-page factors would recommend work that doesn't address the actual problem.
- **Scores that drift would destroy the monthly report.** Two of the tools surveyed produce audit scores that move ±10 points on an unchanged site, and one rounds so hard that real improvement shows as zero change. M2 is where this risk lands. If a client-facing number isn't reproducible, every month-over-month claim built on it is fiction.
- **Nobody but us can see the tool.** It runs on a laptop. There's no deployed environment and no login screen, so the SEO specialists it's being built for can't use it yet. Not a problem this week; it becomes one before M7.
- **The domain-authority framework is peer-relative by design.** Each client needs a locked 3–5 competitor cohort declared by an analyst at onboarding. That's genuine manual work per client and it does not automate away.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, branch `dev`, working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase project `xslwvntwrlvqccdupmni`.
- **Read first:** `docs/schema.md` — the data model and the reasoning behind each rule. Every rule traces to a specific observed failure in a surveyed tool, so read the reasoning before changing one. Then `README.md` for commands.
- **State:** 20 tables live with RLS and clean security advisors. Google delegation working (`npm run verify:access` proves it in one command). Storepro onboarded with four months ingested. Express API on :3000, React client, `tsc` clean, working tree clean.
- **M2 fills tables that already exist** — `audit_runs`, `page_snapshots`, `findings`. Don't redesign them; the columns including the falsifiability contract (`first_principle`, `depends_on`, `failure_check`, `leading_indicator`) are deliberate.
- **Crawl without executing JavaScript.** That is exactly what an AI crawler sees, and the gap between rendered and raw HTML *is* the GEO problem being measured. Keep every per-page signal — discarding them is what made LeanSEO unable to diff pages month to month.
- **Don't** round scores to integers. Store full precision, round only at render.
- **Don't** assume a property works because it appears in the Search Console list — 11 of 65 are `siteUnverifiedUser` and 403 on every data call. `gsc.permissionGrantsData()` already encodes this.
- **Don't** sum Search Console query rows to get a total. Google anonymises low-volume queries; for Storepro's July that's 536 of 815 clicks missing. Totals come from the dimensionless call.
- **Don't** infer a GA4 property ID from a name. 22 Test/Filtered pairs exist and a matcher tried during M1 got two clients wrong.
- **Don't** build the audit engine's client-facing scores before deciding what makes them reproducible. That's the live risk above.
- **Useful:** `npm run probe -- <domain> [ga4Id]` checks a client's data before onboarding; `npm run ingest -- --client <slug> --month YYYY-MM` backfills a month.
