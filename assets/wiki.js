/* ============================================================
   Coreshift Wiki — engine
   One script powers the wiki home and every /wiki/<section>/ article.

   Article page shell:
     <body data-root="../../" data-doc="content.md"
           data-title="Project Tiers" data-active="tech-stack"
           data-crumb="Engineering">
       <script src="../../assets/wiki.js"></script>
     </body>

   Home page shell:
     <body data-root="" data-home="true" data-active="home" data-title="Home">
       <script src="assets/wiki.js"></script>
     </body>

   Articles render: top bar, left nav, breadcrumbs, markdown content (via
   marked.js), a right-hand table of contents, scrollspy, mobile drawer.
   The home renders the same top bar + left nav, plus a daily rotating quote.
   ============================================================ */

(function () {
  "use strict";

  // ── Navigation model — edit here to add/rename wiki pages ──
  // href is relative to site root; the page's data-root is prefixed at render.
  const NAV = [
    {
      label: "Overview",
      items: [
        { key: "home", icon: "🏠", text: "Wiki home", href: "index.html" },
      ],
    },
    {
      label: "Engineering",
      items: [
        { key: "tech-stack",   icon: "🧱", text: "Project tiers",  href: "wiki/tech-stack/" },
        { key: "architecture", icon: "🏗️", text: "Architecture",   href: "wiki/architecture/" },
        { key: "auth",         icon: "🔐", text: "Auth",           href: "wiki/auth/" },
        { key: "storage",      icon: "🗄️", text: "Storage",        href: "wiki/storage/" },
      ],
    },
    {
      label: "Operations",
      items: [
        { key: "access",     icon: "🔑", text: "Account & access", href: "wiki/access/" },
        { key: "setup",      icon: "🧭", text: "Setup & onboarding", href: "wiki/setup/" },
         { key: "slack",      icon: "💬", text: "Slack",            href: "wiki/slack/" },
        { key: "playbooks",  icon: "📕", text: "Playbooks",        href: "wiki/playbooks/" },
        { key: "wiki-submissions", icon: "📥", text: "Wiki submissions", href: "wiki/wiki-submissions/" },
      ],
    },
    {
      label: "AI Radar",
      items: [
        { key: "ai-practices",   icon: "🧠", text: "AI Practices",    href: "wiki/ai-practices/" },
        { key: "claude-updates", icon: "✴️", text: "Claude Updates",  href: "wiki/claude-updates/" },
        { key: "ai-changelog",   icon: "🗂️", text: "Radar Changelog", href: "wiki/ai-changelog/" },
      ],
    },
    {
      label: "Projects",
      items: [
        { key: "boards",          icon: "📋", text: "Project boards", href: "boards/" },
        { key: "mission-control", icon: "🛰️", text: "Mission Control", href: "wiki/mission-control/" },
      ],
    },
    {
      label: "Company",
      items: [
        { key: "positioning", icon: "🧭", text: "Positioning", href: "wiki/positioning/" },
        { key: "policies",    icon: "📜", text: "Policies",    href: "wiki/policies/" },
      ],
    },
  ];

  const body = document.body;
  const root = body.dataset.root || "";
  const docPath = body.dataset.doc || "";
  const isHome = body.dataset.home === "true";
  const pageTitle = body.dataset.title || "Coreshift Wiki";
  const activeKey = body.dataset.active || "";
  const crumb = body.dataset.crumb || "";

  document.title = isHome ? "Coreshift HQ — Internal Wiki" : pageTitle + " — Coreshift Wiki";

  // ── Build chrome ──────────────────────────────────────────
  function navHtml() {
    return NAV.map((group) => {
      const links = group.items.map((it) => {
        const cls = ["", it.external ? "external" : "", it.key === activeKey ? "active" : ""]
          .filter(Boolean).join(" ").trim();
        const target = it.external ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${root}${it.href}" class="${cls}"${target}><span class="nav-ico">${it.icon}</span>${it.text}</a>`;
      }).join("");
      return `<div class="nav-group"><div class="nav-group-label">${group.label}</div>${links}</div>`;
    }).join("");
  }

  const mainInner = isHome
    ? `<div class="wiki-content home-stage"><div class="wiki-loading">…</div></div>`
    : `<div class="crumbs">
          <a href="${root}index.html">Wiki</a>
          ${crumb ? `<span class="sep">/</span><span>${crumb}</span>` : ""}
          <span class="sep">/</span><span>${pageTitle}</span>
        </div>
        <article class="wiki-content"><div class="wiki-loading">Loading…</div></article>
        <div class="wiki-foot">
          <span>Edit this page: <code>${docPath}</code> in <code>coreshift-kanbans</code></span>
          <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans" target="_blank" rel="noopener">Source on GitHub</a>
        </div>`;

  body.insertAdjacentHTML("afterbegin", `
    <header class="wiki-head">
      <div class="wiki-head-inner">
        <a class="brand-link" href="${root}index.html">
          <span class="brand-mark">C</span>
          <span>
            <span class="brand-title">Coreshift HQ</span>
            <span class="brand-sub">Internal Wiki</span>
          </span>
        </a>
        <div class="head-meta">
          <a href="${root}boards/">Project boards</a>
          <span class="dot"></span>
          <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans" target="_blank" rel="noopener">Source</a>
          <span class="dot"></span>
          <span>Internal · noindex</span>
        </div>
        <button class="menu-toggle" aria-label="Menu">☰ Menu</button>
      </div>
    </header>
    <div class="nav-scrim"></div>
    <div class="wiki-layout${isHome ? " is-home" : ""}">
      <aside class="wiki-side"><nav>${navHtml()}</nav></aside>
      <main class="wiki-main">${mainInner}</main>
      ${isHome ? "" : `<aside class="wiki-toc"><div class="toc-label">On this page</div><div id="toc"></div></aside>`}
    </div>
  `);

  // Mobile drawer
  const toggle = body.querySelector(".menu-toggle");
  const scrim = body.querySelector(".nav-scrim");
  toggle && toggle.addEventListener("click", () => body.classList.toggle("nav-open"));
  scrim && scrim.addEventListener("click", () => body.classList.remove("nav-open"));

  const contentEl = body.querySelector(".wiki-content");
  const tocEl = body.querySelector("#toc");

  // ── Slugify for heading anchors ───────────────────────────
  function slug(s) {
    return s.toLowerCase().trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // ── Render markdown article ───────────────────────────────
  function render(md) {
    const html = window.marked ? window.marked.parse(md) : md;
    contentEl.innerHTML = html;

    // First paragraph → lead styling
    const firstP = contentEl.querySelector("h1 + p");
    if (firstP) firstP.classList.add("lead");

    // Anchor ids + TOC
    const heads = contentEl.querySelectorAll("h2, h3");
    const used = {};
    const tocItems = [];
    heads.forEach((h) => {
      let id = slug(h.textContent);
      if (used[id]) id = id + "-" + (++used[id]); else used[id] = 1;
      h.id = id;
      tocItems.push({ id, text: h.textContent, level: h.tagName === "H3" ? 3 : 2 });
    });

    if (tocItems.length > 2 && tocEl) {
      tocEl.innerHTML = tocItems.map((t) =>
        `<a href="#${t.id}" class="lvl-${t.level}" data-id="${t.id}">${t.text}</a>`
      ).join("");
      scrollspy(tocItems);
    } else {
      const toc = body.querySelector(".wiki-toc");
      if (toc) toc.style.visibility = "hidden";
    }

    // Close mobile drawer when a content link is followed
    contentEl.addEventListener("click", (e) => {
      if (e.target.closest("a")) body.classList.remove("nav-open");
    });
  }

  // ── Scrollspy: highlight TOC entry for the section in view ─
  function scrollspy(items) {
    const links = {};
    tocEl.querySelectorAll("a").forEach((a) => (links[a.dataset.id] = a));
    const targets = items.map((t) => document.getElementById(t.id)).filter(Boolean);
    let current = null;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) current = en.target.id;
      });
      Object.values(links).forEach((a) => a.classList.remove("active"));
      if (current && links[current]) links[current].classList.add("active");
    }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });
    targets.forEach((t) => obs.observe(t));
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ── Render the home digest + daily quote ──────────────────
  function ensureMarked(cb) {
    if (window.marked) return cb();
    const sc = document.createElement("script");
    sc.src = "https://cdn.jsdelivr.net/npm/marked@12/marked.min.js";
    sc.onload = cb;
    sc.onerror = cb;
    document.head.appendChild(sc);
  }

  function renderHome() {
    const now = new Date();
    const epochDay = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    const dateStr = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

    contentEl.innerHTML = `
      <div id="home-digest" class="home-digest"></div>
      <div id="home-quote"></div>
    `;

    // New Toys — weekly digest, published by the AI Radar
    fetch(root + "ai-radar/digest.md", { cache: "no-cache" })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then((md) => ensureMarked(() => {
        const html = window.marked ? window.marked.parse(md) : md;
        const el = document.getElementById("home-digest");
        if (el) el.innerHTML =
          `<div class="home-eyebrow">\uD83E\uDDF8 New Toys \u00B7 weekly digest</div>` +
          `<div class="home-digest-body wiki-content">${html}</div>`;
      }))
      .catch(() => { const el = document.getElementById("home-digest"); if (el) el.remove(); });

    // Daily quote — same quote all day, rotates daily through the whole list
    fetch(root + "assets/quotes.json", { cache: "no-cache" })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((list) => {
        const idx = ((epochDay % list.length) + list.length) % list.length;
        const item = list[idx] || list[0];
        const el = document.getElementById("home-quote");
        if (el) el.innerHTML = `
          <div class="home-eyebrow">Daily note \u00B7 ${dateStr}</div>
          <figure class="home-quote-fig">
            <blockquote class="home-quote">${escapeHtml(item.q)}</blockquote>
            ${item.a ? `<figcaption class="home-author">${escapeHtml(item.a)}</figcaption>` : ""}
          </figure>
          <p class="home-welcome">Welcome to the Coreshift handbook. Everything lives in the menu on the left \u2014 pick a section to dive in.</p>
        `;
      })
      .catch((err) => {
        const el = document.getElementById("home-quote");
        if (el) el.innerHTML = `
          <div class="home-eyebrow">Welcome</div>
          <p class="home-welcome">Welcome to the Coreshift handbook. Everything lives in the menu on the left \u2014 pick a section to dive in. <span style="opacity:.6">(Daily quote unavailable: ${escapeHtml(err.message)}.)</span></p>
        `;
      });
  }

  // ── Boot ──────────────────────────────────────────────────
  if (isHome) {
    renderHome();
    return;
  }

  function loadDoc() {
    fetch(docPath, { cache: "no-cache" })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(render)
      .catch((err) => {
        contentEl.innerHTML =
          `<h1>${pageTitle}</h1><div class="wiki-banner"><span class="ico">⚠️</span>` +
          `<span>Couldn't load <code>${docPath}</code> (${err.message}). ` +
          `If you're viewing this from your local disk, run a static server ` +
          `(<code>npx serve</code>) — the live site on GitHub Pages loads it fine.</span></div>`;
      });
  }

  if (window.marked) {
    loadDoc();
  } else {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/marked@12/marked.min.js";
    s.onload = loadDoc;
    s.onerror = () => {
      contentEl.innerHTML = `<h1>${pageTitle}</h1><div class="wiki-banner"><span class="ico">⚠️</span><span>Markdown renderer failed to load (offline?).</span></div>`;
    };
    document.head.appendChild(s);
  }
})();
