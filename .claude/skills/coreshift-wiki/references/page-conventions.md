# Page conventions

How the `coreshift-kanbans` wiki is laid out and the house style for pages.
Read this before writing or editing content so a contribution matches the rest
of the site.

## Repository layout

```
coreshift-kanbans/
├── wiki/
│   └── <section>/
│       ├── content.md     ← the page body (plain Markdown)
│       └── index.html      ← tiny loader shell (boilerplate, see below)
├── assets/
│   ├── wiki.js             ← nav model + the renderer (edit only the NAV array)
│   ├── wiki.css            ← shared styling (rarely edit)
│   └── <section>/          ← images/GIFs for a page live here
└── index.html              ← the wiki home
```

Live URL for a page: `https://coreshifthqnz.github.io/coreshift-kanbans/wiki/<section>/`.
There is no build step — a merge to `main` triggers the GitHub Pages deploy.

## content.md style

`content.md` is plain Markdown, rendered in the browser by `marked.js`. Keep it
clean and readable as raw text:

- Open with a single `# Page Title` (often with a trailing emoji, e.g.
  `# We're moving to Slack 👋`).
- Use `## Section` headings for each section; `###` for sub-points if needed.
- Put `---` on its own line between major sections.
- Because it's `marked.js`, leave a blank line before any bullet or numbered
  list, or it won't render as a list.
- Write in the site's friendly, plain-spoken voice. Short paragraphs.

### Images and GIFs

Store the file in `assets/<section>/` and reference it with a **relative path**
and an *italic caption* on the next line:

```markdown
![Hovering a message and clicking Reply in thread](../../assets/slack/threads.gif)
*Hover a message → click the speech-bubble icon → reply in the thread panel.*
```

- The `../../` is required: pages live two levels deep (`wiki/<section>/`).
- Don't add inline `style=`/HTML — `assets/wiki.css` already styles
  `.wiki-content img` (block, max-width 100%, rounded border, drop shadow) and
  the italic caption beneath it. If a page needs imagery and that rule somehow
  isn't present yet, the block to add to `wiki.css` is:

  ```css
  .wiki-content img { display:block; max-width:100%; height:auto; margin:14px 0 6px;
    border:1px solid var(--border); border-radius:10px; box-shadow:0 1px 3px rgba(15,23,42,0.08); }
  .wiki-content img + em { display:block; font-size:13px; color:var(--text-soft); margin:0 0 18px; }
  ```

- Keep GIFs reasonably small; group a page's assets in its own
  `assets/<section>/` folder.

## index.html loader (new pages only)

Every page has an `index.html` next to its `content.md`. It's boilerplate that
loads the shared renderer; the only things you change per page are `data-title`,
`data-active`, `data-crumb`, and the favicon emoji. Editing an existing page
does **not** touch this file.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E💬%3C/text%3E%3C/svg%3E" />
    <link rel="stylesheet" href="../../assets/wiki.css" />
  </head>
  <body data-root="../../" data-doc="content.md" data-title="PAGE TITLE" data-active="SECTION-KEY" data-crumb="NAV GROUP">
    <script src="../../assets/wiki.js"></script>
  </body>
</html>
```

- `data-title` — page title shown in the browser tab / header.
- `data-active` — the nav **key** for this page (see nav below). Must match
  exactly so the correct sidebar item highlights.
- `data-crumb` — the nav group label this page sits under (e.g. `Operations`),
  shown in the breadcrumb.
- Swap the `💬` in the favicon for an emoji that suits the page.

## Navigation (new pages only)

The left sidebar is defined by the `NAV` array in `assets/wiki.js`. It's a list
of groups, each with `items`. To surface a new page, add one line to the right
group's `items`:

```js
{
  label: "Operations",
  items: [
    { key: "access",     icon: "🔑", text: "Account & access", href: "wiki/access/" },
    { key: "setup",      icon: "🧭", text: "Setup & onboarding", href: "wiki/setup/" },
    { key: "slack",      icon: "💬", text: "Slack",            href: "wiki/slack/" },
    { key: "playbooks",  icon: "📕", text: "Playbooks",        href: "wiki/playbooks/" },
  ],
},
```

- `key` must equal the page's `data-active`.
- `href` is `wiki/<section>/` (site-root-relative — the renderer prefixes it).
- `icon` is an emoji; `text` is the sidebar label.
- Existing groups include **Overview, Engineering, Operations, AI Radar,
  Projects, Company**. Add to the group that fits; only create a new group if no
  existing one is a sensible home.
- Editing an existing page's content does **not** require any nav change.

## What you usually touch

| Change                         | content.md | new index.html | wiki.js nav | assets/ |
|--------------------------------|:----------:|:--------------:|:-----------:|:-------:|
| Edit/expand an existing page   |     ✅     |       —        |      —      |  maybe  |
| Add images to an existing page |     ✅     |       —        |      —      |   ✅    |
| Create a brand-new page        |     ✅     |       ✅       |     ✅      |  maybe  |
