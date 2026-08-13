# Engine Optimization — Handover
_2026-08-13 · closes M2 · opens M3_

## ▶️ Paste this into a new session

```
Engine Optimization M3 — AI visibility panel

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at,
then give me the 5-line orientation and your first move, and proceed.
```

## Where we are — for Ricky

- **Just closed:** M2 — Audit engine.
- **In plain terms:** the tool now crawls a client's whole site and scores it, and you can click into any page or any problem it found. Storepro came out at **SEO 91.5, GEO 93.4, AEO 45.5** across 147 pages. The first two are genuinely good. The third is the story: Storepro's site is easy for AI engines to *read* and hard for them to *quote* — no FAQ markup anywhere, only half the pages ask a question in a heading, only a third have a list or table an answer engine could lift. That lines up uncomfortably well with the M1 finding about queries holding impressions and losing all their clicks.
- **The bit worth caring about:** the scores don't move on their own. That was the live risk going in — two of the tools we surveyed produce audit scores that drift ±10 points on a site nobody touched, which would make every month-over-month claim we build on top worthless. Running the audit twice on the same site now produces identical numbers to the second decimal place, and there's a one-line command that proves it rather than us asserting it.
- **Verified by:** two audit runs read straight out of the database, both scoring 91.50 / 93.44 / 45.45 to the hundredth, each with 150 page records and 12 findings; the audit screens returning real data; screenshots of all three; typecheck clean; database security checks clean; commits `68a5737` and `d0491f0` pushed.
- **Next:** M3 — AI visibility panel. Ends when a set of prompts runs across every AI engine for one client and a citation is recorded with the engine's raw answer saved.

## 👉 On you before M3 can close

1. **The DataForSEO credentials are being rejected.** The account exists and the pair is saved in the local env file, but every call comes back `40100 — not authorized`. Three usual causes: the API password is a separate credential from the website sign-in password; the login may be an account email other than `mal@growthpartners.co.nz`; or IP whitelisting is switched on and this machine isn't listed. Everything you need is on one page — https://app.dataforseo.com/api-access — and running `npm run verify:dataforseo` tells you which of the three it is. **Default if you don't answer:** M3 ships the citation panel only and the domain-authority score stays unbuilt.
2. **The client list.** Still only Storepro. 47 domains have working Search Console access across the estate and there's no way to tell a paying retainer client from an access grant someone was given years ago. Names are enough. **Default if you don't answer:** everything stays Storepro-only — fine for building, useless for a real monthly cycle.
3. **Which questions count as buying intent for Storepro.** The citation panel is only as good as the questions it asks. 10–15 things a buyer would actually type into ChatGPT before choosing a racking supplier. **Default if you don't answer:** we generate the prompt set from Storepro's own Search Console queries and mark it unreviewed in the first report.

## 🔴 Risks you're carrying

- **Two milestones of work are invisible to everyone but us.** The tool runs on a laptop. No deployed environment, no login screen. The specialists it's being built for still cannot open it. This was flagged at M1 and is now a milestone older — it should land in M3 rather than drifting again.
- **The Storepro AI Overview question is still open, and the audit made it sharper rather than settling it.** Informational queries sit at position 7–9 with 500+ impressions and zero clicks; AI-referred visits went 0 → 31 → 43 over three months; and the audit now independently says the content is readable but not quotable. Three signals agreeing is not proof — position is an average and another SERP feature could produce the same pattern. M3's probe panel is what settles it, and it should be the first thing pointed at Storepro.
- **The domain-authority framework is peer-relative by design.** Each client needs a locked 3–5 competitor cohort declared by an analyst at onboarding. Genuine manual work per client; it does not automate away.
- **We have no independent check that the audit's judgements are right.** Reproducibility was proved this milestone — the same site scores the same twice. Whether a score of 45.5 correctly describes Storepro's answer-engine readiness is a separate question and nothing has tested it. The falsifiability contract on each finding exists precisely so this becomes checkable once predictions start being verified in M5.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, branch `dev`, working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase project `xslwvntwrlvqccdupmni`.
- **Read first:** `docs/schema.md` — the data model and the reasoning behind every rule. Then `docs/scoring.md` — the audit method and the determinism contract; read it before touching a weight, a threshold or the crawl budget. Then `README.md` for commands.
- **State:** 20 tables, RLS on, security advisors clean. Google delegation working. Storepro onboarded with 4 months ingested and 2 audit runs stored. Express API on :3000 serving the built React client, `tsc` clean, tree clean, `d0491f0` on `origin/dev`.
- **M3 fills tables that already exist** — `ai_probes` and `ai_probe_runs`. `raw_answer` is `not null` on purpose: storing the engine's actual text is what makes share-of-voice, competitor displacement and "we were cited in September and lost it in October" answerable later, rather than being frozen into a boolean computed under whatever rules we had that month.
- **Citability is not surfacing.** M2 measures whether content is extractable and quotable — testable in minutes. M3 measures whether an engine actually cites us unprompted — week-scale and heavily confounded. Report them as separate numbers and never promise fast surfacing.
- **Don't** let any scored rule read the current time. A check that does makes an untouched site score lower next month and the report calls it a regression. Freshness is captured as a signal and reported as a finding, never scored.
- **Don't** change a weight, a threshold or the crawl budget without bumping `method_version`. The app deliberately refuses to draw a delta across two different method versions.
- **Don't** trust a 200. Storepro returns HTTP 200 with an empty body on three URLs, and DataForSEO returns a success-shaped response to an unauthenticated request because it validates the payload before the credentials. Both were caught as near-misses this milestone; assume the pattern exists in any vendor API until disproven.
- **Don't** treat "couldn't measure" as "measured zero" anywhere. It is the rule the schema is built around and the one most easily broken by accident — it was broken twice in M2's first run.
- **Don't** assume a Search Console property works because it appears in the list — 11 of 65 are `siteUnverifiedUser` and 403 on every data call.
- **Don't** sum Search Console query rows to get a total; Google anonymises low-volume queries. Totals come from the dimensionless call.
- **Don't** infer a GA4 property ID from a name. 22 Test/Filtered pairs exist and a matcher tried in M1 got two clients wrong.
- **Useful:** `npm run audit -- --client storepro` runs an audit; `--verify` crawls twice and proves the scores match without writing anything; `npm run verify:access` proves Google delegation; `npm run verify:dataforseo` proves the DataForSEO pair and its Backlinks entitlement separately; `npm run ingest -- --client <slug> --month YYYY-MM` backfills a month.
