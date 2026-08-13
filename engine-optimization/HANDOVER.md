# Engine Optimization — Handover
_2026-08-13 · closes M3 · opens M4_

## ▶️ Paste this into a new session

```
Engine Optimization — decide what's next after M3

Read coreshift-kanbans/engine-optimization/HANDOVER.md and the repo docs it points at.
M4 is currently "Work plan", but its doneWhen has a hard dependency that isn't met and
M3 surfaced a finding with a real claim on priority. Give me the 5-line orientation,
then your recommendation and the two alternatives, and update milestones[] once I pick.
```

## Where we are — for Ricky

- **Just closed:** M3 — AI visibility panel.
- **In plain terms:** the tool now asks a real AI engine a real buying question and records whether Storepro was cited, keeping the engine's whole answer. Nothing we surveyed does this — they all measure whether a site is *ready* to be quoted and call that AI visibility.
- **The headline, and it isn't what we predicted:** back in M1 we guessed that AI Overviews were swallowing Storepro's clicks. Half right. Of the **seven page-one queries carrying 3,005 impressions and exactly zero clicks**, six have an AI Overview — **and Storepro is cited in four of them, usually as the first or second source.** So Storepro isn't being left out of the AI answer. It's *inside* it and still getting nothing, because the overview answers the question and the searcher never clicks through. "Get us cited in AI Overviews" is not the fix. They already are.
- **The thing that should worry you more:** we ran the same fifteen questions twice, minutes apart, and got different answers on five of them — the AI Overview appeared or vanished entirely on three, one citation flipped, one moved from second to fourth. **One sweep is not a measurement.** This is the same problem the audit scoring was built to defeat, except that time the wobble was ours and we could remove it. This one is Google's. Until we sample properly, no month-over-month citation number goes anywhere near a client.
- **Also landed:** the tool is finally on the internet, behind a login — https://engine-optimization-staging.up.railway.app. That had slipped through M1 and M2.
- **Verified by:** 90 probe records read straight out of the database — 19 with the engine's full answer stored (1,991–3,794 characters), 11 recorded as "engine failed", 60 as "no credential", and **zero** rows in an illegal state; six citations each pointing at a real Storepro product page; 12 detector tests passing; typecheck clean; the deployed site returning 200 and its API returning 401 to anyone not signed in; commit `f170cfc`.
- **Next:** a decision. See the paste-block above.

## 👉 On you before M4 can close

1. **Email delivery for sign-in.** The staging login works for you and for nobody else — the Supabase project has no mail provider, so it uses the built-in sender, which is capped at **2 emails an hour and only delivers to Supabase org members**. Any provider fixes it (Postmark, Resend, SES) under Authentication → Emails. ⚠️ **Superseded 2026-08-13, later the same day:** this was filed as M4's blocker on the strength of a doneWhen reading "approved *by a specialist* in the app" — a clause that duplicated M7's doneWhen and made M4 hostage to a mail setting with no bearing on the aggregator. M4's doneWhen was rewritten and **this item is now tagged `M7`**, which is the milestone it genuinely blocks ("a specialist other than Ricky runs a full cycle unaided" is impossible until a specialist can sign in). Longest-tail item on the list — nothing in M6 or M7 is demonstrable to anyone but you until it exists. **Default if you don't answer:** M4 builds and lands normally; M7 cannot start.
2. **10–15 real buying-intent questions for Storepro.** The fifteen loaded now came from Storepro's own Search Console and are stored **unreviewed** — they're visibly generic ("What should I know about X…"). **Default if you don't answer:** they run as-is and every report says the set is unreviewed.
3. **Storepro's competitor cohort — 3–5 names.** Competitor displacement can't be measured without it and the tool refuses to guess. Seen citing alongside Storepro in the live overviews: `dexion.co.nz`, `palletrackingsolutions.co.nz`, `shelvingshopgroup.co.nz`, `stackit.co.nz`. **Default if you don't answer:** competitor presence stays recorded as *not measured*, which is honest but empty.
4. **The other four engine keys** — `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`. All four adapters are written and switch on the moment a key appears. One engine is a data point; ChatGPT is the one a client will ask about by name. Roughly $5–10/month at this volume. **Default if you don't answer:** the panel stays a one-engine panel and says so.
5. **The client list.** Still only Storepro. 47 hosts have working Search Console access and no way to tell a retainer client from an old access grant. Names are enough. **Default if you don't answer:** Storepro-only.

## 🔴 Risks you're carrying

- **A single probe is a coin flip, and everything downstream inherits that.** Five of fifteen changed between two sweeps minutes apart. Any citation-based claim — share of voice, "we lost a citation this month", competitor displacement — is currently unsafe to put in front of a client. The fix is a sampling design (n sweeps across a window, reported as a rate with its sample size), not a bug fix, which is why it belongs with predictions and controls rather than being patched now.
- **The AI Overview finding is a correlation across two moments, not a controlled test.** The traffic data is July; the overview snapshot is August. And it doesn't explain everything — `heavy duty shelving` sits at position 9.0 with 473 impressions, zero clicks, and **no AI Overview at all**. Something else is also taking clicks.
- **One engine is not a panel.** Only Google AI Overviews can answer today. Every conclusion above is about one surface, and it's the surface that behaves least like the assistants.
- **We still have no independent check that the audit's judgements are right.** Unchanged from M2. Reproducibility was proved; correctness has not been tested, and the falsifiability contract on each finding is what makes it checkable once predictions get verified in M5.
- **The domain-authority framework is peer-relative by design.** Unblocked now that DataForSEO works, but each client still needs an analyst-declared cohort at onboarding. It does not automate away.
- **Nobody but Ricky can open the tool.** Deployed, gated, and effectively single-user until SMTP exists.

## For the next Claude

- **Repo** `CoreshiftHQNZ/engine-optimization`, branches `dev` and `staging` both at `f170cfc`, working dir `/Users/Ricky/Documents/Claude/Projects/Engine Optimization`. Supabase project `xslwvntwrlvqccdupmni`. Railway project `engine-optimization`, staging environment auto-deploys on push to `staging`.
- **Read first:** `docs/ai-visibility.md` — what "cited" means and what it doesn't; read "One sweep is not a measurement" before quoting any citation number. Then `docs/scoring.md` for the audit determinism contract, then `docs/schema.md` for the data model. `README.md` has the commands.
- **State:** 22 tables, RLS on, advisors clean. Storepro onboarded, 4 months ingested, 2 audit runs, 15 probes (all unreviewed), 90 probe runs. DataForSEO live and Backlinks entitled (91 referring domains, 280 backlinks, rank 172). Auth is Supabase magic link, domain-restricted, verified server-side on every request.
- **M4 fills `work_items`**, which already exists with a mandatory `rationale` — that field becomes the report's "why", so it is required at creation time on purpose.
- **Don't** treat "couldn't measure" as "measured zero". This project has now broken that rule three times — twice in M2's first crawl, once in the M1 probe schema. `ai_probe_runs` enforces it with a check constraint; keep it that way.
- **Don't** trust a 200. DataForSEO validates payload shape *before* credentials, so an unauthenticated call returns success-shaped; and its SERP responses carry a per-task `status_code` that can fail inside a 20000 envelope.
- **Don't** re-judge a probe run from `raw_answer` alone. An engine's structured source list is separate data — `engine_sources` holds it untouched, `sources` is our derived output. Confusing them deletes real citations; this was caught by a dry run and would have been applied otherwise.
- **Don't** send a SERP surface a conversational prompt. `ai_probes.search_query` exists because Google AI Overviews returns the overview for whatever string it gets, and the assistant-shaped prompt measures a SERP nobody searches.
- **Don't** change the detector without bumping `DETECTOR_VERSION`. The panel refuses a delta across two versions, exactly as the audit refuses one across two method versions.
- **Don't** let any scored rule read the current time. Freshness is a finding, never a score component.
- **Don't** assume a Search Console property works because it appears in the list — 11 of 65 are `siteUnverifiedUser` and 403 on every data call.
- **Don't** sum Search Console query rows to get a total; Google anonymises low-volume queries. Totals come from the dimensionless call.
- **Don't** infer a GA4 property ID from a name. 22 Test/Filtered pairs exist and a matcher tried in M1 got two clients wrong.
- **Don't** enable IP whitelisting on DataForSEO. Railway's outbound address isn't fixed, so a whitelist that fixes a laptop breaks production intermittently and looks like a vendor outage.
- **Useful:** `npm run verify:engines` proves which engines can be measured right now; `npm run ai-probe -- --client storepro` runs the sweep (`--dry-run` writes nothing); `npm run rejudge -- --client storepro` re-reads stored answers under the current detector and writes nothing without `--write`; `npm run probes -- --client storepro --from-gsc` proposes a prompt set; `npm run test:detector` proves the citation rules offline; `npm run audit -- --client storepro --verify` proves audit reproducibility; `npm run verify:access` proves Google delegation; `npm run fix:dataforseo` tests and saves a DataForSEO pair.
