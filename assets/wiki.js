/* ============================================================
   Coreshift Wiki — engine
   One script powers every /wiki/<section>/ article page.

   A page only needs a tiny shell:
     <body data-root="../../" data-doc="content.md"
           data-title="Project Tiers" data-active="tech-stack"
           data-crumb="Engineering">
       <script src="../../assets/wiki.js"></script>
     </body>

   This script renders: top bar, left nav, breadcrumbs, the markdown
   content (via marked.js), a right-hand table of contents, scrollspy,
   and a mobile nav drawer.
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
        { key: "playbooks",  icon: "📕", text: "Playbooks",        href: "wiki/playbooks/" },
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
  const pageTitle = body.dataset.title || "Coreshift Wiki";
  const activeKey = body.dataset.active || "";
  const crumb = body.dataset.crumb || "";

  document.title = pageTitle + " — Coreshift Wiki";

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
    <div class="wiki-layout">
      <aside class="wiki-side"><nav>${navHtml()}</nav></aside>
      <main class="wiki-main">
        <div class="crumbs">
          <a href="${root}index.html">Wiki</a>
          ${crumb ? `<span class="sep">/</span><span>${crumb}</span>` : ""}
          <span class="sep">/</span><span>${pageTitle}</span>
        </div>
        <article class="wiki-content"><div class="wiki-loading">Loading…</div></article>
        <div class="wiki-foot">
          <span>Edit this page: <code>${docPath}</code> in <code>coreshift-kanbans</code></span>
          <a href="https://github.com/CoreshiftHQNZ/coreshift-kanbans" target="_blank" rel="noopener">Source on GitHub</a>
        </div>
      </main>
      <aside class="wiki-toc"><div class="toc-label">On this page</div><div id="toc"></div></aside>
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

  // ── Render markdown ───────────────────────────────────────
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

    if (tocItems.length > 2) {
      tocEl.innerHTML = tocItems.map((t) =>
        `<a href="#${t.id}" class="lvl-${t.level}" data-id="${t.id}">${t.text}</a>`
      ).join("");
      scrollspy(tocItems);
    } else {
      const toc = body.querySelector(".wiki-toc");
      if (toc) toc.style.visibility = "hidden";
    }

    // Close mobile drawer when a content/nav link is followed
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

  // ── Load marked, then the doc ─────────────────────────────
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
