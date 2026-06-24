# Coreshift HQ — Internal Wiki + Project Kanbans

The Coreshift internal handbook and live project boards, served as a single GitHub Pages site.

**Public URL:** https://coreshifthqnz.github.io/coreshift-kanbans/

## Layout

```
/                          Wiki home — the front door (tech stack, ops, projects, company)
/boards/                   Project boards — a live kanban per project
/assets/wiki.css           Shared wiki design system
/assets/wiki.js            Wiki engine (renders each page's content.md)
/wiki/<section>/           A wiki article: index.html (shell) + content.md (the content)
/<project-slug>/           Per-project kanban board (sentinel, keycontent, velocity, …)
```

### Wiki sections

`tech-stack` · `architecture` · `auth` · `storage` · `access` · `setup` · `playbooks` · `mission-control` · `positioning` · `policies`

## Editing

- **A wiki page:** edit `wiki/<section>/content.md` (plain Markdown — rendered client-side). Add a new section by copying an existing `index.html` shell, setting its `data-*` attributes, and adding the page to the `NAV` array in `assets/wiki.js`.
- **A project board:** edit `<slug>/KANBAN.md`, then `node tools/build.js`.

## Deploy

Pushing to `main` triggers `.github/workflows/pages.yml`, which publishes the entire repo root to GitHub Pages. No build step for the wiki — content is Markdown rendered in the browser via `marked`.

> The wiki engine fetches each page's `content.md` at runtime, so local preview needs a static server (`npx serve`) — opening `index.html` from disk won't load the content. The live Pages site loads it fine.
