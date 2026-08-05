# Start a New Project

Spin up a new build the Coreshift way — the **Fable 5 workflow**, milestone-gated, with the BuilderOS skills already loaded. This is the Claude Code path: install the plugin once, then every new project is a few minutes of setup and you're building.

**Total time:** ~5 minutes of setup, then straight into planning.

---

## Prerequisites (once per person)

- **Claude Code** installed and signed in on a plan with model access — see [Setup & Onboarding](../setup/).
- The **Coreshift Ideation** plugin installed from the org marketplace. If you don't have it yet:

```
/plugin marketplace add CoreshiftHQNZ/coreshift-plugins
/plugin install coreshift-ideation@coreshift-plugins
```

That's the same marketplace `coreshift-site-builder` and `merlin` come from — add it once and you have all three available.

Once installed, its skills load automatically — you never pick them from a menu. The nested skill list is only a manual override.

---

## 1. Create and open the project folder

```
mkdir my-product && cd my-product
```

Open that folder in Claude Code.

## 2. Set up the workflow (one line)

In a new session, say:

> Set up this project for the Coreshift Fable 5 workflow.

That runs the `fable5-project-setup` skill: it drops `CLAUDE.md` (the milestone, model, and session rules) into the project root and creates a `docs/` folder. From then on, **every session in this folder auto-orients** — a session-start hook detects where the project stands and tells you the next step.

## 3. Plan the product — Opus 4.8 / Max

Start a **new session**, set the model to **Opus 4.8** at **Max** reasoning, then:

> Use the product-planner skill to plan my product. My idea is: [describe it in a few sentences — who it's for and what it does].

This produces the three specs in `docs/`: `product-vision.md`, `prd.md`, and `product-roadmap.md`. No idea locked yet? Run `idea-generator` then `idea-validator` first.

## 4. Review the specs

Read the three docs before any code is written — check scope (it should be an MVP), the tech stack, and that each roadmap phase has a clear goal. Cheap to fix here; expensive to fix mid-build.

## 5. Build the MVP — Fable 5

Start a **new session**, switch the model to **Fable 5**, then:

> Build the full application using the build-mvp skill. Work through the roadmap task by task, testing and verifying each before marking it complete. At each phase boundary, run an end-to-end test.

For review-gated increments, use `build-loop-reviewed` instead.

## 6. Verify & ship

Walk every user path with a browser UX pass, run a security check over the API endpoints, then use `launch-checklist` for the path to live.

---

## The rules that keep it on track

- **One session per milestone.** When a milestone is done, Claude confirms what's saved, tells you which model + reasoning to set next, and stops — start a fresh session for the next step. Smaller context, lower cost, clean handoff.
- **Nothing is lost between sessions.** Progress lives in files — `docs/*.md` and the roadmap checkboxes — not the chat. A new or crashed session picks up from the first unchecked task.
- **Model guide:** setup — any model; planning — Opus 4.8 / Max; building — Fable 5; code review — high (not ultra).

> **Why the window matters:** Fable 5 is only cheap for a limited period, then bills at API rates. Plan projects up front so you spend that window building, not deciding what to build.

The full narrative — the Fable 5 Playbook and the project + usage tracker — ships inside the plugin (under the `fable5-workflow` skill's references). See also [Build Standards](../build-standards/) (the privacy, security & sub-processor defaults every build starts from), [Playbooks](../playbooks/), and [Project boards](../boards/).
