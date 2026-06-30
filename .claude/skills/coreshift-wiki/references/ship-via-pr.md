# Shipping a contribution as a pull request

Contributions are **reviewed before they go live.** Never commit to `main` —
open a pull request and share the link so a maintainer can review and merge.
Merging to `main` is what deploys the site (GitHub Pages, ~1 minute).

Pick the path that matches how the repo is available to you.

---

## Path A — GitHub in the browser (no local clone)

Best when you don't have the repo cloned. You'll make the change through
GitHub's web editor on a new branch.

### Editing an existing page

1. Open the file editor:
   `https://github.com/CoreshiftHQNZ/coreshift-kanbans/edit/main/wiki/<section>/content.md`
2. Make your edits. Tip: to insert a block reliably without the editor's
   auto-indent/auto-close mangling it, set the clipboard
   (`navigator.clipboard.writeText(...)` once the editor is focused) and paste
   with Ctrl/Cmd+V, rather than typing brackets/quotes character by character.
3. Click **Commit changes…**. In the dialog, choose **"Create a new branch for
   this commit and start a pull request"**, name the branch something like
   `wiki/<section>-<short-desc>`, and write a clear commit message.
4. Commit, then **Create pull request** on the screen that follows.

### Adding images to a page

Use the upload page, which accepts a target path even if the folder is new:

1. Go to `https://github.com/CoreshiftHQNZ/coreshift-kanbans/upload/main/assets/<section>`
   (the breadcrumb will show `assets / <section>`).
2. Choose the files (use the file input directly — don't click anything that
   opens a native OS file picker).
3. In the commit dialog choose **"Create a new branch… and start a pull
   request"**, then commit and open the PR. Keep all of one contribution on the
   **same branch** so every file lands in one PR — reopen the branch in the
   branch selector for each subsequent file/folder.

### Creating a new page

A new page is several files; put them all on one branch / one PR:

1. **content.md** — create at
   `https://github.com/CoreshiftHQNZ/coreshift-kanbans/new/main` and type the
   path `wiki/<section>/content.md` (typing the path creates the folder), then
   paste the Markdown. Commit to a **new branch** (this starts the PR).
2. **index.html** — repeat for `wiki/<section>/index.html` using the template in
   `page-conventions.md`; commit to the **same branch**.
3. **Nav line** — edit `assets/wiki.js`, add the one-line entry to the right
   group's `items` (see `page-conventions.md`); commit to the **same branch**.
4. **Images** (if any) — upload into `assets/<section>/` on the **same branch**.
5. Open the PR from the branch.

> The web editor moves the **Commit changes…** button as the page scrolls —
> screenshot before clicking. After each commit, verify the diff/preview shows
> exactly the intended change.

---

## Path B — Connected clone (git)

Best when a clone of `coreshift-kanbans` is connected as a folder.

```bash
git checkout main && git pull
git checkout -b wiki/<section>-<short-desc>

# edit wiki/<section>/content.md (+ index.html, assets/<section>/, wiki.js nav for a new page)

git add wiki/<section> assets/<section> assets/wiki.js
git commit -m "wiki(<section>): <what changed>"
git push -u origin wiki/<section>-<short-desc>
```

Then open the PR (e.g. `gh pr create --fill --base main`, or the "Compare &
pull request" prompt GitHub shows after the push). Don't merge your own PR
unless that's the agreed norm — leave it for review.

---

## After the PR is merged

The merge deploys automatically. Verify on the live site:

- Open `https://coreshifthqnz.github.io/coreshift-kanbans/wiki/<section>/`
  (hard-refresh if it looks stale — Pages can take ~1 minute).
- Check the page renders, headings/sections look right, and any images load.
- For a **new page**, confirm the sidebar shows the new nav item and that it
  highlights when you're on the page (this proves `data-active` matches the nav
  `key`).

If something's off (broken image path, missing nav highlight, wrong crumb),
it's almost always a path or a key mismatch — fix and push to the same branch.
