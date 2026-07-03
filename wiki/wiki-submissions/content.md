# Adding to the Wiki 📥

Anyone at Coreshift can suggest a change to this wiki — a whole new page, an edit to an existing one, a quick fix, or an interesting find worth capturing. You don't touch any code or GitHub. You just fill in a short form in Slack, and an approved submission is turned into a live wiki update for you automatically.

This page explains how the **#wiki-submissions** workflow works, so you know exactly what to do and what happens next.

---

## Where it happens

Everything runs in the **#wiki-submissions** channel in Slack. Head there whenever you want to add or change something on the wiki.

If you're not in the channel yet, search for **#wiki-submissions** in Slack and join it.

---

## How to make a submission

1. Open the **#wiki-submissions** channel.
2. Start the **Add to Wiki** workflow (the shortcut in the channel — look in the message box's shortcuts/**+** menu, or the channel's bookmarks).
3. Fill in the short form and submit it. Your submission is posted into the channel for everyone to see.

That's it — you don't need to write Markdown or open GitHub. Describe the change in plain English and the pipeline builds it.

---

## What the form asks for

Each submission captures a few fields. The more detail you give, the faster it can be built without anyone having to come back and ask.

- **Type** — what kind of change this is (see the list below).
- **Which page / section** — the wiki page you want created or changed (e.g. *Playbooks*, or a name for a brand-new page).
- **What should change** — describe the change in plain English. For an edit, say what to add, remove, or reword.
- **Why / context** — a sentence on why it's useful. Helps approvers make the call.
- **Link** — a source link if the change is based on something (an article, a doc, an announcement). Optional, but strongly encouraged for *Interesting finds*.

---

## Submission types

- **New page** — a brand-new wiki page or section that doesn't exist yet.
- **Edit existing page** — change the content of a page that's already live.
- **Fix** — a small correction: a typo, a broken link, an out-of-date detail.
- **Interesting find** — something worth capturing on the AI Radar or the Wiki home digest (usually paired with a link).

---

## What happens after you submit

1. **Logged.** Your submission is picked up and logged in a thread, with a short summary of what it understood.
2. **Approval.** An approver reacts on your submission to decide what happens next:
   - ✅ *approve* — build the change.
   - ❌ *decline* — leave it as-is.
3. **Built automatically.** Once approved, a daily pipeline turns the submission into a wiki change and opens a pull request on GitHub.
4. **Merge or hold.**
   - **Edits, fixes, and interesting finds** are merged automatically and go **live** within minutes of merging. The pipeline replies in your thread with a link to the updated page.
   - **New pages** get a pull request opened but **held for a maintainer** to review and merge, since they add new navigation and structure. The pipeline replies in your thread with the PR link.
5. **Confirmation.** You'll get a reply in your submission's thread telling you it's live (with a link) or waiting on a maintainer (with the PR link).

---

## Reaction legend

The emoji on a submission tell you where it's up to:

- ✅ **Approved** — greenlit; the pipeline will build it.
- 🚀 **Handled** — a PR was opened (and merged, if it was a small edit).
- 🤔 **Needs clarification** — something's unclear; reply in the thread with the missing detail.
- 📝 **Drafted & staged** — written up, PR pending on the next run.
- ❌ **Declined** — not proceeding.

---

## Tips for a smooth submission

- **Be specific about the page.** Name the exact section, or a clear title for a new one.
- **Say precisely what changes.** "Add a paragraph under *Notifications* explaining working hours" beats "update the Slack page."
- **Include a link** when your change is based on a source — it lets facts be checked before anything goes live.
- **One change per submission.** Smaller, focused submissions get approved and built faster.

---

> Got something the team should know? Drop it in **#wiki-submissions** — a good wiki is everyone's job.
