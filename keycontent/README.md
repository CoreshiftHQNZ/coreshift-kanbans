# Adding a project kanban

Each project under `coreshift-kanbans/` is a folder with three files:

```
<project-slug>/
  kanban.config.js     # project-specific (title, hero, goals, phases, links, roles)
  KANBAN.md            # the actual board cards in 5 columns
  index.html           # build output — written by the engine, served by GitHub Pages
```

The engine (`tools/build.js`) is project-agnostic. Everything that changes between projects lives in `kanban.config.js`.

## Six steps to add a project

1. **Copy this template folder** to your slug:

   ```bash
   cp -r tools/template <project-slug>
   ```

2. **Edit `<project-slug>/kanban.config.js`** — set the title, tagline, description, goals, links, roles, and phases. Inline comments in the file explain every field.

3. **Edit `<project-slug>/KANBAN.md`** — replace the example cards with your real ones. The card format is `- **Title** \`tag\` \`tag\` — Description.` and the five column headings (✅ Done, 🟡 In Progress, 🚫 Blocked, 🔵 This Week, ⚪ Backlog) must stay exactly as they are — the renderer keys off the leading emoji to color the column.

4. **Build it:**

   ```bash
   node tools/build.js <project-slug>
   ```

   That writes `<project-slug>/index.html`. Open it locally to check; refine the config until it looks right.

5. **Link it from the root** — edit `coreshift-kanbans/index.html` to add a card pointing at your new project's `index.html`.

6. **Commit + push.** GitHub Pages republishes in ~10 seconds.

## Tag color reference

`tools/build.js` → `tagClass(tag)` maps tag strings to colors. Current mappings include `shipped`, `phase-0` through `phase-4`, `deliverable`, `playbook`, `milestone`, `infra`, `ops`, `recurring`, and prefixes `blocked-by:*` and `est:*`. Anything else falls through to a neutral grey. Add new mappings there if you want a new tag to get its own color across every board.

## Updating an existing board

Edit `<project-slug>/KANBAN.md` (or `kanban.config.js` for hero/phase changes), then:

```bash
node tools/build.js <project-slug>
# or to rebuild every project at once:
node tools/build.js
```

Commit, push, done.

## Building locally with internal links

The published build filters out any links flagged `{ internal: true }` in config (so the public site doesn't expose internal-only artifacts like pitch decks). To include them when building locally:

```bash
INTERNAL=1 node tools/build.js <project-slug>
```

The output still goes to `<project-slug>/index.html` — be careful not to commit that variant, or use a different `output:` path in the config when building locally.
