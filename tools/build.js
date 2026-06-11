// Coreshift HQ project kanban — shared rendering engine.
//
// Reads <project>/kanban.config.js + <project>/KANBAN.md and writes
// <project>/index.html. The engine is project-agnostic; everything
// project-specific lives in that project's kanban.config.js.
//
// Usage:
//   node tools/build.js sentinel       # build one project
//   node tools/build.js                # build every project with a kanban.config.js
//
// Adding a new project: copy tools/template/ to <new-slug>/, fill in
// kanban.config.js + KANBAN.md, then run the build. See tools/template/README.md.
//
// Public vs internal: links flagged `{ internal: true }` in config are filtered
// out by default (this repo is publicly served via GitHub Pages). Set INTERNAL=1
// in the environment to retain them when building locally.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_MODE = process.env.INTERNAL !== "1";

function loadConfig(slug) {
  const configPath = path.join(ROOT, slug, "kanban.config.js");
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No kanban.config.js found at ${path.relative(ROOT, configPath)}. ` +
      `Copy tools/template/ to ${slug}/ and fill in the config to add this project.`,
    );
  }
  // Bust the require cache so consecutive builds in the same process pick up edits.
  delete require.cache[require.resolve(configPath)];
  return require(configPath);
}

function listProjects() {
  // Top-level project directories (e.g. "sentinel", "planner") AND one
  // level of nesting (e.g. "sentinel/privacy-security"). One level is
  // enough today; if a deeper nesting is needed later, generalise this
  // to a recursive walk with a depth cap.
  //
  // Filters out tools/, node_modules/, dotfile dirs, and any directory
  // that doesn't itself contain a kanban.config.js.
  const slugs = [];
  const ignoredTop = new Set(["tools", "node_modules"]);

  const topDirs = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        !d.name.startsWith(".") &&
        !ignoredTop.has(d.name),
    );

  for (const topDir of topDirs) {
    // Direct child with kanban.config.js → top-level project.
    if (fs.existsSync(path.join(ROOT, topDir.name, "kanban.config.js"))) {
      slugs.push(topDir.name);
    }
    // Look one level deeper for nested project boards (e.g. sentinel/privacy-security).
    const subDirs = fs
      .readdirSync(path.join(ROOT, topDir.name), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("."));
    for (const subDir of subDirs) {
      const nestedSlug = `${topDir.name}/${subDir.name}`;
      if (
        fs.existsSync(path.join(ROOT, nestedSlug, "kanban.config.js"))
      ) {
        slugs.push(nestedSlug);
      }
    }
  }
  return slugs.sort();
}

function buildOne(slug) {
  const rawConfig = loadConfig(slug);
  // Shallow-clone so we don't mutate the require-cached value when
  // listProjects() walks many projects in one process.
  const META = { ...rawConfig };
  if (Array.isArray(META.links)) {
    META.links = PUBLIC_MODE
      ? META.links.filter((l) => !l.internal)
      : META.links.slice();
  }
  const PROJECT_DIR = path.join(ROOT, slug);
  const SRC = path.join(PROJECT_DIR, META.source || "KANBAN.md");
  const OUT = path.join(PROJECT_DIR, META.output || "index.html");

// ---------- Parse KANBAN.md ----------
const md = fs.readFileSync(SRC, "utf8");
const lines = md.split("\n");

const columns = [];
let currentCol = null;

for (let raw of lines) {
  const line = raw.replace(/\s+$/, "");
  // Column header (## title)
  const colMatch = line.match(/^##\s+(.+)$/);
  if (colMatch) {
    currentCol = { title: colMatch[1].trim(), cards: [] };
    columns.push(currentCol);
    continue;
  }
  // Card line (- **Title** ...)
  const cardMatch = line.match(/^-\s+\*\*(.+?)\*\*\s*(.*)$/);
  if (cardMatch && currentCol) {
    const title = cardMatch[1].trim();
    const rest = cardMatch[2];
    // Extract tags `like-this`
    const tags = [...rest.matchAll(/`([^`]+)`/g)].map(m => m[1]);
    // Extract description after — (em-dash)
    const descMatch = rest.match(/—\s*(.+)$/);
    const desc = descMatch ? descMatch[1].trim().replace(/\.$/, "") : "";
    currentCol.cards.push({ title, tags, desc });
  }
}

// ---------- Tag color mapping ----------
// Map each tag prefix/keyword to a color class.
function tagClass(tag) {
  if (tag === "shipped") return "shipped";
  if (tag === "phase-0" || tag === "phase-0-prod") return "phase-0";
  if (tag.startsWith("phase-1")) return "phase-1";
  if (tag === "phase-2") return "phase-2";
  if (tag === "phase-4") return "phase-4";
  if (tag === "phase-3") return "phase-3";
  if (tag === "deliverable") return "deliverable";
  if (tag === "playbook") return "playbook";
  if (tag === "milestone") return "milestone";
  if (tag === "infra") return "infra";
  if (tag === "ops") return "ops";
  if (tag === "recurring") return "recurring";
  if (tag.startsWith("blocked-by")) return "blocked";
  if (tag.startsWith("est:")) return "est";
  return "neutral";
}

// Column status class derived from heading prefix
function columnClass(title) {
  if (title.startsWith("✅")) return "done";
  if (title.startsWith("🟡")) return "in-progress";
  if (title.startsWith("🚫")) return "blocked";
  if (title.startsWith("🔵")) return "this-week";
  if (title.startsWith("⚪")) return "backlog";
  return "neutral";
}

// Escape HTML
function esc(s) {
  return String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

// ---------- Compute status snapshot ----------
const totalCards = columns.reduce((a, c) => a + c.cards.length, 0);
function countByColumnClass(cls) {
  const col = columns.find(c => columnClass(c.title) === cls);
  return col ? col.cards.length : 0;
}
const stats = {
  done:       countByColumnClass("done"),
  inProgress: countByColumnClass("in-progress"),
  blocked:    countByColumnClass("blocked"),
  thisWeek:   countByColumnClass("this-week"),
  backlog:    countByColumnClass("backlog"),
};
const completedRatio = totalCards ? Math.round((stats.done / totalCards) * 100) : 0;

// Pull most recent N done items for "Recently shipped" rail
const doneCol = columns.find(c => columnClass(c.title) === "done");
const recentDone = doneCol ? doneCol.cards.slice(0, 6) : [];

const renderedColumns = columns.map(col => {
  const clsCol = columnClass(col.title);
  const cards = col.cards.map(card => {
    const tagsHtml = card.tags.map(t => `<span class="tag tag-${tagClass(t)}">${esc(t)}</span>`).join("");
    return `
      <div class="card">
        <div class="card-title">${esc(card.title)}</div>
        ${card.tags.length ? `<div class="card-tags">${tagsHtml}</div>` : ""}
        ${card.desc ? `<div class="card-desc">${esc(card.desc)}</div>` : ""}
      </div>`;
  }).join("");

  return `
    <section class="column col-${clsCol}">
      <header class="col-head">
        <h2>${esc(col.title)}</h2>
        <span class="col-count">${col.cards.length}</span>
      </header>
      <div class="cards">${cards || '<div class="empty">No items</div>'}</div>
    </section>`;
}).join("");

const builtAt = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(META.title)} — Kanban</title>
  <style>
    :root {
      --navy: #0F1E3D;
      --navy-deep: #081530;
      --navy-soft: #1A2A4F;
      --teal: #14B8A6;
      --teal-dark: #0D9488;
      --teal-light: #CCFBF1;
      --amber: #F59E0B;
      --amber-light: #FEF3C7;
      --red: #DC2626;
      --red-light: #FEE2E2;
      --green: #10B981;
      --green-light: #D1FAE5;
      --purple: #8B5CF6;
      --purple-light: #EDE9FE;
      --blue: #3B82F6;
      --blue-light: #DBEAFE;
      --indigo: #6366F1;
      --indigo-light: #E0E7FF;
      --pink: #EC4899;
      --pink-light: #FCE7F3;
      --gray: #64748B;
      --gray-light: #E2E8F0;
      --gray-lighter: #F1F5F9;
      --bg: #F8FAFC;
      --card: #FFFFFF;
      --text: #1E293B;
      --text-muted: #475569;
      --text-soft: #94A3B8;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
      font-size: 14px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }

    /* Header */
    header.page-head {
      background: var(--navy);
      color: #FFFFFF;
      padding: 24px 32px;
      border-bottom: 1px solid var(--navy-deep);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .page-head-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }
    .page-brand { display: flex; align-items: center; gap: 14px; }
    .brand-mark {
      width: 36px; height: 36px;
      background: var(--teal);
      color: var(--navy);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px;
    }
    .brand-title {
      font-size: 18px; font-weight: 700; letter-spacing: -0.01em;
    }
    .brand-sub {
      font-size: 11px; color: var(--teal);
      font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
      margin-top: 2px;
    }
    .page-meta {
      font-size: 12px; color: #8EA5C8;
      display: flex; gap: 24px; flex-wrap: wrap;
    }
    .page-meta strong { color: #FFFFFF; font-weight: 600; }

    /* Main layout */
    .page-main {
      max-width: 1600px;
      margin: 0 auto;
      padding: 32px 32px 48px;
    }

    /* Section headings */
    .section-head {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin: 0 0 16px;
    }
    .section-sub {
      font-size: 13px;
      color: var(--text-muted);
      margin: -8px 0 16px;
    }
    .section-sub code {
      background: var(--gray-lighter);
      border: 1px solid var(--gray-light);
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 12px;
      color: var(--navy);
    }

    /* Hero */
    .hero {
      margin-bottom: 48px;
      padding-bottom: 40px;
      border-bottom: 1px solid var(--gray-light);
    }
    .hero-eyebrow {
      color: var(--teal-dark);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      margin-bottom: 14px;
    }
    .hero-title {
      color: var(--navy);
      font-size: 52px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.05;
      margin: 0 0 12px;
    }
    .hero-tagline {
      color: var(--teal-dark);
      font-size: 22px;
      font-style: italic;
      font-weight: 500;
      margin: 0 0 16px;
      line-height: 1.35;
    }
    .hero-desc {
      color: var(--text-muted);
      font-size: 17px;
      line-height: 1.5;
      max-width: 880px;
      margin: 0;
    }
    .hero-phase-row {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .phase-pill {
      display: inline-flex;
      align-items: baseline;
      gap: 10px;
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 999px;
      padding: 8px 18px;
      font-size: 13px;
    }
    .phase-pill-label {
      color: var(--text-soft);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .phase-pill-value {
      color: var(--navy);
      font-weight: 700;
    }
    .phase-pill-date {
      color: var(--text-muted);
      font-weight: 500;
      margin-left: 4px;
    }
    .phase-pill-milestone {
      background: var(--navy);
      border-color: var(--navy);
    }
    .phase-pill-milestone .phase-pill-label { color: var(--teal); }
    .phase-pill-milestone .phase-pill-value { color: #FFFFFF; }
    .phase-pill-milestone .phase-pill-date { color: #CADCFC; }

    /* Goals */
    .goals { margin-bottom: 40px; }
    .goals-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .goal-card {
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 12px;
      padding: 24px;
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .goal-card:hover {
      box-shadow: 0 6px 20px rgba(15, 30, 61, 0.08);
      transform: translateY(-2px);
    }
    .goal-icon {
      font-size: 28px;
      margin-bottom: 12px;
    }
    .goal-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 6px;
    }
    .goal-desc {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Phases */
    .phases { margin-bottom: 40px; }
    .phases-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
    }
    .phase-card {
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 12px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .phase-card:hover {
      box-shadow: 0 6px 20px rgba(15, 30, 61, 0.08);
      transform: translateY(-2px);
    }
    .phase-card.phase-done       { border-top: 4px solid var(--green); }
    .phase-card.phase-in-progress{ border-top: 4px solid var(--amber); }
    .phase-card.phase-planned    { border-top: 4px solid var(--blue); }
    .phase-card.phase-future     { border-top: 4px solid var(--gray); opacity: 0.88; }
    .phase-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .phase-marker {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--navy);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
    }
    .phase-card.phase-done .phase-marker        { background: var(--green); }
    .phase-card.phase-in-progress .phase-marker { background: var(--amber); }
    .phase-status-pill {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .phase-status-done        { background: var(--green-light); color: #065F46; }
    .phase-status-in-progress { background: var(--amber-light); color: #B45309; }
    .phase-status-planned     { background: var(--blue-light); color: #1D4ED8; }
    .phase-status-future      { background: var(--gray-light); color: var(--gray); }
    .phase-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--navy);
      margin-bottom: 2px;
      letter-spacing: -0.01em;
    }
    .phase-subtitle {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      margin-left: 2px;
    }
    .phase-window {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-soft);
      margin-bottom: 10px;
    }
    .phase-desc {
      font-size: 12.5px;
      color: var(--text);
      line-height: 1.5;
      margin: 0 0 12px;
    }
    .phase-deliverables {
      list-style: none;
      padding: 0;
      margin: 0;
      border-top: 1px solid var(--gray-light);
      padding-top: 10px;
    }
    .phase-deliverables li {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
      padding: 3px 0 3px 14px;
      position: relative;
    }
    .phase-deliverables li::before {
      content: "•";
      position: absolute;
      left: 4px;
      color: var(--teal);
      font-weight: 700;
    }

    /* Status strip */
    .status-strip {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-bottom: 40px;
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 12px;
      padding: 20px 8px;
    }
    .status-stat {
      text-align: center;
      padding: 8px 12px;
      border-right: 1px solid var(--gray-light);
    }
    .status-stat:last-child { border-right: none; }
    .status-num {
      font-size: 36px;
      font-weight: 800;
      line-height: 1;
      color: var(--navy);
      letter-spacing: -0.02em;
    }
    .status-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-soft);
      margin-top: 8px;
    }
    .status-done .status-num        { color: var(--green); }
    .status-in-progress .status-num { color: var(--amber); }
    .status-blocked .status-num     { color: var(--red); }
    .status-this-week .status-num   { color: var(--blue); }
    .status-backlog .status-num     { color: var(--gray); }

    /* Links */
    .links { margin-bottom: 40px; }
    .links-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .link-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 10px;
      padding: 16px 20px;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
    }
    .link-card:hover {
      box-shadow: 0 4px 14px rgba(15, 30, 61, 0.08);
      transform: translateY(-1px);
      border-color: var(--teal);
    }
    .link-icon {
      font-size: 24px;
      flex-shrink: 0;
    }
    .link-text { flex: 1; }
    .link-title {
      font-weight: 700;
      color: var(--navy);
      font-size: 15px;
      margin-bottom: 2px;
    }
    .link-desc {
      font-size: 13px;
      color: var(--text-muted);
    }
    .link-arrow {
      color: var(--teal);
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }

    /* Roles */
    .roles { margin-bottom: 40px; }
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .role-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 10px;
      padding: 16px 20px;
    }
    .role-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--navy);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
    }
    .role-text { flex: 1; }
    .role-name {
      font-weight: 700;
      color: var(--navy);
      font-size: 14px;
      margin-bottom: 2px;
    }
    .role-person {
      color: var(--text-muted);
      font-weight: 500;
      margin-left: 6px;
      font-size: 13px;
    }
    .role-verbs {
      font-size: 12px;
      color: var(--text-soft);
      font-weight: 500;
    }

    /* Recently shipped */
    .recent { margin-bottom: 40px; }
    .recent-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
      background: var(--card);
      border: 1px solid var(--gray-light);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .recent-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 6px 0;
    }
    .recent-check {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: var(--green);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .recent-text { flex: 1; min-width: 0; }
    .recent-title {
      font-weight: 600;
      color: var(--navy);
      font-size: 13.5px;
      line-height: 1.4;
    }
    .recent-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
      margin-top: 2px;
    }

    /* Board section */
    .board-section { margin-top: 8px; }

    /* Kanban board */
    .board {
      display: grid;
      grid-template-columns: repeat(5, minmax(280px, 1fr));
      gap: 16px;
      align-items: start;
    }

    .column {
      background: var(--gray-lighter);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid var(--gray-light);
    }
    .col-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 4px 4px 12px;
      border-bottom: 2px solid transparent;
    }
    .col-head h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: var(--navy);
      letter-spacing: 0.02em;
    }
    .col-count {
      font-size: 12px;
      font-weight: 600;
      background: var(--card);
      color: var(--text-muted);
      padding: 2px 8px;
      border-radius: 10px;
      border: 1px solid var(--gray-light);
    }

    /* Column accents */
    .col-done .col-head        { border-bottom-color: var(--green); }
    .col-in-progress .col-head { border-bottom-color: var(--amber); }
    .col-blocked .col-head     { border-bottom-color: var(--red); }
    .col-this-week .col-head   { border-bottom-color: var(--blue); }
    .col-backlog .col-head     { border-bottom-color: var(--gray); }

    .col-done .col-count        { color: var(--green); border-color: var(--green-light); }
    .col-in-progress .col-count { color: #B45309; border-color: var(--amber-light); }
    .col-blocked .col-count     { color: var(--red); border-color: var(--red-light); }
    .col-this-week .col-count   { color: #1D4ED8; border-color: var(--blue-light); }
    .col-backlog .col-count     { color: var(--gray); border-color: var(--gray-light); }

    .cards {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card {
      background: var(--card);
      border-radius: 8px;
      padding: 12px 14px;
      border: 1px solid var(--gray-light);
      box-shadow: 0 1px 2px rgba(15, 30, 61, 0.04);
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(15, 30, 61, 0.08);
      transform: translateY(-1px);
    }
    .card-title {
      font-weight: 600;
      color: var(--navy);
      font-size: 13.5px;
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 4px 0;
    }
    .card-desc {
      color: var(--text-muted);
      font-size: 12.5px;
      line-height: 1.5;
      margin-top: 6px;
    }
    .empty {
      color: var(--text-soft);
      font-size: 12px;
      text-align: center;
      padding: 16px 0;
      font-style: italic;
    }

    /* Tags */
    .tag {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .tag-shipped     { background: var(--green-light); color: #065F46; }
    .tag-phase-0     { background: var(--teal-light); color: var(--teal-dark); }
    .tag-phase-1     { background: var(--blue-light); color: #1D4ED8; }
    .tag-phase-2     { background: var(--purple-light); color: #6D28D9; }
    .tag-phase-4     { background: var(--pink-light); color: #BE185D; }
    .tag-phase-3     { background: var(--indigo-light); color: #4338CA; }
    .tag-deliverable { background: var(--green-light); color: #047857; }
    .tag-playbook    { background: var(--teal-light); color: var(--teal-dark); }
    .tag-milestone   { background: #FEE2E2; color: #991B1B; }
    .tag-infra       { background: var(--amber-light); color: #B45309; }
    .tag-ops         { background: var(--gray-light); color: var(--text-muted); }
    .tag-recurring   { background: var(--gray-light); color: var(--gray); }
    .tag-blocked     { background: var(--red-light); color: var(--red); }
    .tag-est         { background: var(--gray-light); color: var(--text-muted); }
    .tag-neutral     { background: var(--gray-light); color: var(--text-muted); }

    /* Footer */
    footer.page-foot {
      padding: 16px 32px 32px;
      text-align: center;
      color: var(--text-soft);
      font-size: 12px;
    }
    footer.page-foot a {
      color: var(--teal-dark);
      text-decoration: none;
      border-bottom: 1px solid rgba(13, 148, 136, 0.3);
    }

    /* Responsive */
    @media (max-width: 1400px) {
      .board { grid-template-columns: repeat(3, minmax(280px, 1fr)); }
      .links-grid { grid-template-columns: 1fr; }
      .recent-list { grid-template-columns: 1fr; }
    }
    @media (max-width: 1300px) {
      .phases-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 1100px) {
      .goals-grid { grid-template-columns: 1fr; }
      .roles-grid { grid-template-columns: 1fr; }
      .phases-grid { grid-template-columns: repeat(2, 1fr); }
      .status-strip { grid-template-columns: repeat(2, 1fr); }
      .status-stat { border-right: none; border-bottom: 1px solid var(--gray-light); }
      .status-stat:nth-last-child(-n+2) { border-bottom: none; }
    }
    @media (max-width: 700px) {
      .phases-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 900px) {
      .page-main { padding: 24px 16px 32px; }
      .board { grid-template-columns: 1fr; }
      header.page-head { padding: 16px; }
      .hero-title { font-size: 32px; }
      .hero-tagline { font-size: 17px; }
      .hero-desc { font-size: 15px; }
    }

    /* Print */
    @media print {
      header.page-head { background: var(--card); color: var(--navy); border-bottom: 2px solid var(--gray-light); position: static; }
      .brand-mark { background: var(--navy); color: #FFFFFF; }
      .brand-title, .page-meta strong { color: var(--navy); }
      .page-meta, .brand-sub { color: var(--text-muted); }
      .board { grid-template-columns: repeat(2, 1fr); padding: 16px; }
      .column { break-inside: avoid; background: var(--card); border: 1px solid var(--gray-light); }
      .card:hover { transform: none; box-shadow: 0 1px 2px rgba(15, 30, 61, 0.04); }
    }
  </style>
</head>
<body>
  <header class="page-head">
    <div class="page-head-inner">
      <div class="page-brand">
        <div class="brand-mark">${esc(META.brandMark || "🛡")}</div>
        <div>
          <div class="brand-title">${esc(META.title)}</div>
          <div class="brand-sub">${esc(META.brandSub || "Operations Dashboard")}</div>
        </div>
      </div>
      <div class="page-meta">
        <div><strong>${completedRatio}%</strong> complete</div>
        <div><strong>${stats.done}</strong>/${totalCards} cards done</div>
        <div>Updated <strong>${builtAt}</strong></div>
      </div>
    </div>
  </header>

  <main class="page-main">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-eyebrow">INTERNAL · LIVE OPS DASHBOARD</div>
      <h1 class="hero-title">${esc(META.title)}</h1>
      <p class="hero-tagline">${esc(META.tagline)}</p>
      <p class="hero-desc">${esc(META.description)}</p>
      <div class="hero-phase-row">
        <div class="phase-pill">
          <span class="phase-pill-label">Current phase</span>
          <span class="phase-pill-value">${esc(META.phase)}</span>
        </div>
        <div class="phase-pill phase-pill-milestone">
          <span class="phase-pill-label">Next milestone</span>
          <span class="phase-pill-value">${esc(META.nextMilestone.name)} <span class="phase-pill-date">${esc(META.nextMilestone.date)}</span></span>
        </div>
      </div>
    </section>

    <!-- GOALS -->
    <section class="goals">
      <h2 class="section-head">The Three Goals</h2>
      <div class="goals-grid">
        ${META.goals.map(g => `
        <div class="goal-card">
          <div class="goal-icon">${g.icon}</div>
          <div class="goal-title">${esc(g.title)}</div>
          <div class="goal-desc">${esc(g.desc)}</div>
        </div>`).join("")}
      </div>
    </section>

    <!-- PHASES -->
    <section class="phases">
      <h2 class="section-head">Development & Production Phases</h2>
      <p class="section-sub">Where the project has been, where it is now, and where it's going. Each phase delivers value on its own — no big-bang.</p>
      <div class="phases-grid">
        ${META.phases.map((p, idx) => `
        <div class="phase-card phase-${p.status}">
          <div class="phase-card-head">
            <div class="phase-marker">${esc(p.title.replace(/^Phase\s+/i, ""))}</div>
            <div class="phase-status-pill phase-status-${p.status}">${p.status === "in-progress" ? "In progress" : p.status === "done" ? "Done" : p.status === "planned" ? "Planned" : "Future"}</div>
          </div>
          <div class="phase-title">${esc(p.title)} <span class="phase-subtitle">${esc(p.subtitle)}</span></div>
          <div class="phase-window">${esc(p.window)}</div>
          <p class="phase-desc">${esc(p.desc)}</p>
          <ul class="phase-deliverables">
            ${p.deliverables.map(d => `<li>${esc(d)}</li>`).join("")}
          </ul>
        </div>`).join("")}
      </div>
    </section>

    <!-- STATUS STRIP -->
    <section class="status-strip">
      <div class="status-stat status-done">
        <div class="status-num">${stats.done}</div>
        <div class="status-label">Done</div>
      </div>
      <div class="status-stat status-in-progress">
        <div class="status-num">${stats.inProgress}</div>
        <div class="status-label">In Progress</div>
      </div>
      <div class="status-stat status-blocked">
        <div class="status-num">${stats.blocked}</div>
        <div class="status-label">Blocked</div>
      </div>
      <div class="status-stat status-this-week">
        <div class="status-num">${stats.thisWeek}</div>
        <div class="status-label">This Week</div>
      </div>
      <div class="status-stat status-backlog">
        <div class="status-num">${stats.backlog}</div>
        <div class="status-label">Backlog</div>
      </div>
    </section>

    <!-- KEY ARTIFACTS / QUICK LINKS -->
    <section class="links">
      <h2 class="section-head">Key Artifacts</h2>
      <div class="links-grid">
        ${META.links.map(l => `
        <a class="link-card" href="${esc(l.url)}" target="_blank" rel="noopener">
          <div class="link-icon">${l.icon}</div>
          <div class="link-text">
            <div class="link-title">${esc(l.title)}</div>
            <div class="link-desc">${esc(l.desc)}</div>
          </div>
          <div class="link-arrow">→</div>
        </a>`).join("")}
      </div>
    </section>

    <!-- ROLES -->
    <section class="roles">
      <h2 class="section-head">Who's Involved</h2>
      <div class="roles-grid">
        ${META.roles.map(r => `
        <div class="role-card">
          <div class="role-avatar">${esc(r.initial)}</div>
          <div class="role-text">
            <div class="role-name">${esc(r.name)} <span class="role-person">${esc(r.person)}</span></div>
            <div class="role-verbs">${esc(r.verbs)}</div>
          </div>
        </div>`).join("")}
      </div>
    </section>

    <!-- RECENTLY SHIPPED -->
    ${recentDone.length ? `
    <section class="recent">
      <h2 class="section-head">Recently Shipped</h2>
      <div class="recent-list">
        ${recentDone.map(c => `
        <div class="recent-item">
          <div class="recent-check">✓</div>
          <div class="recent-text">
            <div class="recent-title">${esc(c.title)}</div>
            ${c.desc ? `<div class="recent-desc">${esc(c.desc)}</div>` : ""}
          </div>
        </div>`).join("")}
      </div>
    </section>` : ""}

    <!-- KANBAN BOARD -->
    <section class="board-section">
      <h2 class="section-head">Live Rollout Board</h2>
      <p class="section-sub">Every task across every phase. Updated by editing <code>KANBAN.md</code> and running <code>update-kanban.cmd</code>.</p>
      <div class="board">
        ${renderedColumns}
      </div>
    </section>

  </main>

  <footer class="page-foot">
    ${META.footerHtml || `Edit <code>KANBAN.md</code> and run <code>update-kanban.cmd</code> to refresh this view.
    &nbsp;·&nbsp;
    Companion to <a href="ops-playbook.html">ops-playbook.html</a> &amp; <a href="ROADMAP.md">ROADMAP.md</a>.`}
  </footer>
</body>
</html>`;

fs.writeFileSync(OUT, html);
  console.log(`[build] ${slug}: ${path.relative(ROOT, OUT)} — ${(html.length / 1024).toFixed(1)} KB, ${totalCards} cards across ${columns.length} columns`);
}

// ---------- CLI dispatch ----------
const arg = process.argv[2];
if (arg) {
  buildOne(arg);
} else {
  const projects = listProjects();
  if (projects.length === 0) {
    console.log("No projects with kanban.config.js found under " + ROOT);
    process.exit(0);
  }
  for (const slug of projects) {
    try {
      buildOne(slug);
    } catch (err) {
      console.error(`[build] ${slug}: failed — ${err.message}`);
      process.exitCode = 1;
    }
  }
}
