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
