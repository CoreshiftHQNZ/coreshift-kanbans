# Coreshift — Project Kanbans

Live kanban boards for active Coreshift projects, served as a single GitHub Pages site.

**Public URL:** https://coreshifthqnz.github.io/coreshift-kanbans/

## Layout

```
/                          Landing page — list of projects
/digital-architect/        DA build kanban
```

Each project gets its own subdirectory with an `index.html`. Add a new project by creating the directory + linking it from the root `index.html`.

## Deploy

Pushing to `main` triggers `.github/workflows/pages.yml`, which publishes the entire repo root to GitHub Pages. No build step — these are static HTML files.
