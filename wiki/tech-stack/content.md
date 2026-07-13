# Project Tiers

Every Coreshift build falls into one of three tiers. Pick the **lowest tier that meets the
brief** — each tier is a strict superset of the one below and shares the same GitHub +
Cloudflare backbone, so a project can climb a tier by *adding* tools, never by switching
ecosystems.

Everything here uses tools we already run — no new providers.

---

## At a glance

| | **Tier 1 — Basic Static Site** | **Tier 2 — Full Website** | **Tier 3 — Web App** |
|---|---|---|---|
| Use case | Brochure / landing, a few pages | Content-rich site, blog, multiple forms | App: accounts, data, portal / e-commerce |
| Build | Astro (plain HTML for tiny) | Astro + content collections | React + Vite (app) ± Astro marketing pages |
| Hosting | Cloudflare Pages | Cloudflare Pages + Pages Functions | Railway (app server) + Cloudflare |
| Dynamic backend | None (optional contact form) | Pages Functions (edge) | Express API |
| Data | None | Cloudflare D1 / KV | Supabase Postgres (Drizzle) |
| Auth | None | None | Supabase Auth |
| File storage | None | — | Supabase Storage |
| Email | Postmark (contact form) | Postmark | Postmark |
| Source | GitHub | GitHub | GitHub |
| DNS | Cloudflare | Cloudflare | Cloudflare (confirm per project) |

---

## What we pay for — subscriptions

A plain-English guide to the paid services behind these tiers, for anyone tracking spend.
Everything *else* in the stack — Astro, React, Vite, Express, Drizzle ORM, 11ty and Cloudflare
Turnstile — is free, open-source software with **no subscription**.

> Prices are **indicative USD list prices as of July 2026** and are billed monthly unless noted.
> Our actual plans and invoices may differ — treat these as a guide to *what each line item is
> for*, not an exact bill.

| Service | What it is (plain English) | What we use it for | Free tier? | Paid plan (indicative) |
|---|---|---|---|---|
| **GitHub** | Online home for our code, with full version history | Master copy of every project's source code; also triggers the auto-deploy when we push changes | Yes — free for public repositories | **Team ≈ US$4 / user / month** (billed annually) once we need private repos & team controls |
| **Cloudflare** | Website hosting, global delivery network (CDN), domain/DNS management & security | Hosts Tier 1 & 2 sites (Pages), runs small bits of server code like the contact form (Pages Functions), stores form data (D1 / KV), manages our domains & DNS, and blocks spam (Turnstile) | Yes — generous free plan | **Workers Paid ≈ US$5 / month per account** — one flat fee covering *all* projects' functions & data. Domain registrations billed separately, at cost |
| **Railway** | Rented cloud server that keeps a web app running around the clock | Runs the always-on application server (the Express API) behind Tier 3 web apps | US$5 free trial credit | **Hobby ≈ US$5 / month** (incl. $5 of usage) or **Pro ≈ US$20 / month per seat** (incl. $20 of usage); busier apps cost more as usage grows |
| **Supabase** | All-in-one back-end for apps — database, user logins & file storage in one service | Powers Tier 3 apps: user accounts & sign-in (Auth), the app's database (Postgres) and uploaded files (Storage) | Yes — free tier | **Pro ≈ US$25 / month per project** (each Tier 3 app is its own project). Real-world ≈ US$35–75 / month per app once usage is added |
| **Postmark** | Service that reliably delivers automated emails | Sends the emails our sites & apps generate: contact-form notifications, newsletter/signup, password resets, receipts | Free for 100 emails / month | **Basic ≈ US$15 / month for 10,000 emails** (higher tiers US$16.50–18 / month) |

**Cost drivers worth knowing**

- **Supabase scales per project** — every Tier 3 app is a separate ≈ US$25/month+ subscription. Tier 1 & 2 sites don't use it at all.
- **Cloudflare is one flat account fee**, not one-per-site — the ≈ US$5/month Workers Paid plan covers every project's functions and data. Only domain names are billed individually (per domain, per year, at cost).
- **Railway is usage-based** — the base plan bundles some usage; heavier or higher-traffic apps run above it and cost more.
- **Postmark and GitHub** are single, account-level subscriptions shared across all projects, not per-site.

**Rough monthly cost by tier**

- **Tier 1 — Basic Static Site:** often **US$0** — a public GitHub repo plus Cloudflare's free plan. Postmark only enters if a live contact form sends real volume.
- **Tier 2 — Full Website:** typically **low single digits** — as Tier 1, plus Cloudflare Workers Paid (≈ $5) once it exceeds free limits, plus Postmark (≈ $15) once real email flows.
- **Tier 3 — Web App:** the priced tier — **≈ US$45–100+ per app per month**: Supabase (≈ $25+) + Railway (≈ $5–20+) + Postmark (≈ $15), on top of the shared GitHub & Cloudflare fees.

---

## Tier 1 — Basic Static Site

A brochure or landing site: a handful of pages, no data to keep.

**Included**

- Static pages on **Cloudflare Pages** — global CDN, auto-deploy on every push
- **Astro** as the default build (plain HTML / 11ty is fine for a 3–4 page site)
- Optional single **contact form** → Cloudflare **Pages Function** → **Postmark** (notify
  only, nothing retained)
- **Cloudflare Turnstile** for spam protection on any public form

**Not included:** databases, auth, app server, retained submissions.

**Reach for it when:** the site's job is to inform and convert — marketing presence, event
page, simple landing page.

---

## Tier 2 — Full Website

Everything in Tier 1, plus genuine content management and light dynamic behaviour — all still
on Cloudflare's edge, no app server.

**Adds**

- **Astro content collections** — blog, news, case studies, docs from Markdown/MDX
- Multiple dynamic endpoints via **Pages Functions**
- Form submissions **retained and queryable** in **Cloudflare D1** (SQLite), or **KV** for a
  simple durable log
- Newsletter signup, multiple / multi-step forms — all routed through **Postmark**

**Still not included:** user accounts, sessions, or a long-running server. If a project needs
those, it's Tier 3.

**Reach for it when:** the site is content-heavy, needs to keep or query submissions, or serves
light dynamic data — but nobody logs in.

---

## Tier 3 — Web App

The full [app architecture](../architecture/). Often pairs a Tier 1/2-style marketing front
(kept in Astro) with real application functionality.

**Adds**

- **User accounts & auth** — Supabase Auth (Google OAuth, email+password, magic link)
- **Relational data** — Supabase Postgres via Drizzle ORM
- **File storage** — Supabase Storage (server-mediated)
- **Express API** on **Railway** — staging + production environments, auto-deploy via GitHub
  Actions (`staging` → staging, `main` → production)
- Application surfaces: customer portal, dashboards, e-commerce, payments, account management
- **Postmark** for transactional email

**Reach for it when:** anything requires login, persistent per-user data, a customer portal, or
e-commerce.

---

## Moving between tiers

Because all three sit on **GitHub + Cloudflare**, climbing a tier means adding capability, not
re-platforming:

- **1 → 2:** add Astro content collections and Cloudflare D1/KV; the contact form grows into
  multiple Pages Functions.
- **2 → 3:** add Supabase (Postgres, auth, storage) and Railway for the Express API. Marketing
  pages can stay in Astro and live alongside the app.

---

## Contact form reference (Tier 1 & 2)

`functions/api/contact.ts` — runs on every `POST /api/contact`:

```typescript
interface Env {
  POSTMARK_TOKEN: string;
  CONTACT_FROM: string;   // a verified Postmark sender, e.g. "site@coreshifthq.com"
  CONTACT_TO: string;     // where notifications land
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const form = await context.request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return new Response("Missing fields", { status: 400 });
  }

  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Postmark-Server-Token": context.env.POSTMARK_TOKEN,
    },
    body: JSON.stringify({
      From: context.env.CONTACT_FROM,
      To: context.env.CONTACT_TO,
      ReplyTo: email,
      Subject: `New contact form submission from ${name}`,
      TextBody: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      MessageStream: "outbound",
    }),
  });

  if (!res.ok) return new Response("Failed to send", { status: 502 });

  return Response.redirect(new URL("/thanks", context.request.url), 303);
};
```

Set `POSTMARK_TOKEN`, `CONTACT_FROM`, `CONTACT_TO` as environment variables in the Cloudflare
Pages project (Settings → Environment variables). Never commit the token.

**Tier 2 — also retain the submission in D1** (bind `DB: D1Database` to the Pages project):

```typescript
await context.env.DB
  .prepare("INSERT INTO submissions (name, email, message, created_at) VALUES (?, ?, ?, ?)")
  .bind(name, email, message, new Date().toISOString())
  .run();
```

---

## Deploy flow

- **Tier 1 & 2:** push to GitHub → Cloudflare Pages builds and deploys automatically. Preview
  deploys for non-production branches; production tracks `main`. The Pages Functions ship with
  the site — no separate backend pipeline.
- **Tier 3:** the static/marketing front follows the Pages flow above; the Express API follows
  the app stack's branch flow (`local → dev → staging → main`) with Railway auto-deploying
  `staging` and `main`. See [architecture.md](../architecture/).
