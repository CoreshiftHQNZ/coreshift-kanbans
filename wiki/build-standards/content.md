# Build Standards — Privacy, Security & Sub-processors

The standard privacy/security posture every Coreshift build starts from — so a new app or website inherits the defaults instead of re-deriving them each time. **Pick your archetype, copy the column, and only confirm the project-specifics.**

Pairs with [Start a new project](../new-project/) (the build workflow) and the security/privacy playbooks.

---

## 1. Two archetypes

Almost every build is one of two shapes. Get this right first — everything else follows from it.

| | **App build** — multi-tenant SaaS | **Website build** — marketing / lead-gen |
|---|---|---|
| Examples | KeyContent, Digital Architect | Growth Partners, LDM |
| Hosting | **Railway**, Coreshift-managed, CI/CD `dev → staging → main` | **Cloudflare Pages** + Pages Functions, on the **client's** Cloudflare account |
| Database | **Supabase** — own project per app (Sydney) | **None** — static; forms email out |
| DNS / CDN / SSL / WAF | Cloudflare | Cloudflare (built into Pages) |
| Transactional email | **Postmark** | **Postmark** (via a Pages Function) |
| Forms / anti-bot | app auth + rate limits | **Turnstile** + honeypot |
| AI (if any) | Gemini / OpenAI (no-train confirmed) | usually none |
| Analytics | none (error-only) | Cloudflare Web Analytics (+ GA only if wired) |
| Backups | Supabase DB 8-day + storage mirrored to R2, 30-day prune | Git repo **is** the backup; Pages retains every deploy (instant rollback) |
| Monitoring | Sentinel (Supabase advisors, Sentry, Better Stack uptime) | Better Stack uptime |
| Security gate | App Audit at onboarding + quarterly | App Audit (lighter — no CMS/DB) |
| Weekly endpoint audit | Sentinel, once onboarded with a `primary_url` | Sentinel (same) |

> **Don't mix them up.** The off-the-shelf web-build + hosting contract template is WordPress-shaped (CMS, plugins, database export). Our website builds are **custom static sites** — reword Annexure 2 accordingly: no CMS, no database; "backups" = the Git repo + Pages rollback.

---

## 2. Standard sub-processors

Baseline list — trim to what the build actually uses. Keep the register (`SUB-PROCESSORS.md`) and the public `/sub-processors` page in sync: **a new vendor is added in the same PR that wires it.**

| Sub-processor | Used for | Region | When |
|---|---|---|---|
| Supabase | DB / auth / storage | Sydney | Apps |
| Railway | app hosting | US | Apps |
| Cloudflare | DNS / CDN / SSL / WAF / Pages | Global | Both |
| Postmark | transactional / lead email | US | Both |
| Sentry | error tracking | US | Apps (+ site functions if wired) |
| Better Stack | uptime | US | Both |
| GitHub | source + deploy | US | Both |
| Stripe | billing | US / EU | If it charges |
| Google (Gemini/Veo) | AI text / image / video | US | If AI |
| OpenAI | AI text | US | If AI |
| ElevenLabs | AI voice / music | US | If it makes video/audio |
| Zernio | social publishing | EU | If it posts to social |
| Turnstile (Cloudflare) | bot protection | Global | Websites with forms |

**Rule:** every listed vendor needs a DPA (or equivalent terms) on file, and its jurisdiction noted for IPP 12.

---

## 3. Privacy defaults (the PIA answers, pre-filled)

A per-app **PIA** is the privacy gate — the Privacy Officer signs off (see [Playbooks](../playbooks/)). Standard positions:

- **Indirect collection (IPP 3A):** the privacy notice carries an indirect-collection section; third-party personal info inside client-uploaded content is **allocated to the client** (they're the controller) via the subscription agreement.
- **Overseas transfer (IPP 12):** sub-processors sit in AU / EU / US under DPAs; the offshore transfer is disclosed in the notice.
- **Retention (IPP 9):** per-class windows (`HOW-WE-DO-RETENTION.md`); sweeps **scheduled** (not run by hand); an account-closure cascade deletes content **and file storage** 30 days after closure.
- **AI:** no-training confirmed on OpenAI + Google; **no AI decisioning about individuals** (content generation only).
- **Rights routing:** requests about account data → us (direct); requests about client-uploaded content → via the client (the controller).
- **Error tool:** Sentry `sendDefaultPii: false`; session replay masks all text and blocks all media.
- **Bug reports:** shared store, with the screenshot + reporter's PII deleted 7 days after resolution.

---

## 4. Security defaults

- **App Audit** (`HOW-WE-DO-APP-AUDITS.md`) is the security gate — run at onboarding, then quarterly. *Defaults are dangerous; the audit catches what was never toggled on.*
- **RLS on every table** + per-tenant scoping (apps). **HIBP** leaked-password check on.
- **Scanning wired into CI:** secret scan (gitleaks), dependency audit (npm-audit), DAST (OWASP ZAP baseline).
- **Sentinel** monitors every onboarded app/site and runs the **weekly endpoint audit** (TLS, security headers, exposed-file + form-endpoint checks) — set the build's `primary_url` to switch it on.
- **Env-var parity** staging ↔ prod (a full key diff, not per-var); no secret values shared across environments.

---

## 5. Contracts (Annexure 2)

The Hosting Service Description (Annexure 2) is filled from this doc + the sub-processor register. App and website builds differ — for websites use the Cloudflare-Pages / no-CMS / no-DB wording, not the WordPress template.

---

## 6. One rule above all — don't claim what isn't live

Only put a capability in a **contract**, **privacy notice**, or **sub-processor list** once it's actually built and confirmed. If it's planned, say "planned" or leave it out. *(Learned the hard way: a "weekly endpoint audit" clause with no feature behind it yet, and a live voice sub-processor missing from the register.)*
