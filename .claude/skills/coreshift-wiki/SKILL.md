---
name: coreshift-wiki
description: >-
  Contribute to the Coreshift internal wiki — the site served from the
  CoreshiftHQNZ/coreshift-kanbans repo via GitHub Pages. Use this whenever
  someone wants to add to, edit, or contribute to a wiki page: creating a new
  wiki page/section, updating or expanding an existing page (e.g. the Slack,
  onboarding, playbooks, or AI Practices pages), adding images or GIFs to a
  page, or fixing wiki content. Trigger on phrases like "add a wiki page",
  "edit the wiki", "contribute to the wiki", "update the Slack page", "write an
  onboarding doc for the wiki", or "add a section to a page" — even if the repo
  isn't named. Encodes the repo's page conventions and the pull-request review
  workflow so contributions match the existing site and never push straight to
  main.
---

# Contributing to the Coreshift wiki

The Coreshift internal wiki is a static site in the **`CoreshiftHQNZ/coreshift-kanbans`**
repo, published with GitHub Pages at
`https://coreshifthqnz.github.io/coreshift-kanbans/`. Every page is plain
Markdown (`wiki/<section>/content.md`) rendered client-side by `marked.js`, plus
a tiny `index.html` loader shell. There is **no build step** — a merge to `main`
auto-deploys.

Your job with this skill is to help a teammate add or change a page while
keeping it consistent with the rest of the site, and to ship the change as a
**pull request for review** rather than committing straight to `main`.

## Before you start

Confirm you can reach the repo. Either:

- a local clone of `coreshift-kanbans` is connected as a folder (preferred — you
  can read and edit files directly, then push a branch), **or**
- you have access to github.com in the browser as a member of the org (you'll
  make the change through GitHub's web editor).

If neither is true, say so and ask the person to connect the repo or sign in —
don't guess at file contents.

## Step 1 — Figure out the change

Ask (or infer from the request) two things:

1. **New page, or edit an existing one?**
2. **Which section?** Existing sections live under `wiki/` (e.g. `slack`,
   `setup`, `playbooks`, `access`, `architecture`, `ai-practices`). A section's
   live URL is `…/wiki/<section>/`.

If it's an edit, **always read the current `content.md` first** and change it in
place — never recreate a page from scratch or you'll drop existing content.

## Step 2 — Make the change

Read `references/page-conventions.md` for the full house style. The essentials:

- **Content** goes in `wiki/<section>/content.md` — plain Markdown. Start with a
  single `# Title`, use `## ` for sections, and `---` between major sections.
- **Images / GIFs** go in `assets/<section>/` and are referenced from the page
  as `![alt text](../../assets/<section>/file.gif)` with a one-line *italic
  caption* directly underneath. Styling (border, rounding, caption) is already
  handled globally in `assets/wiki.css` — don't add inline styles.
- **A brand-new page also needs** an `index.html` loader (copy the template in
  `references/page-conventions.md`, set `data-title`, `data-active`, and
  `data-crumb`) and a one-line nav entry in `assets/wiki.js`. The nav `key` must
  match the page's `data-active`. Editing an existing page touches neither.

Keep edits faithful to the existing tone and don't reformat unrelated content.

## Step 3 — Ship it as a pull request

Contributions go through review — **do not commit to `main`.** Open a PR and
share the link so a maintainer can merge (the merge is what deploys).

Follow `references/ship-via-pr.md` — it covers both the GitHub web path (use the
commit dialog's *"Create a new branch for this commit and start a pull request"*
option) and the connected-clone/git path, plus how to verify the page after
merge.

## Golden rules

- **PR, never push to `main`.** A teammate reviews; the merge deploys.
- **Edit in place.** For existing pages, preserve what's there; change only what
  the contribution calls for.
- **Match the conventions.** New sections need the `index.html` shell + a nav
  entry; images live in `assets/<section>/` with an italic caption; no inline
  CSS.
- **It's an internal site.** Pages carry `noindex`; don't add anything secret or
  externally sensitive.
- **Verify after merge** at `…/wiki/<section>/` — check the page renders, images
  load, and (for new pages) the nav entry appears and highlights.
