// Privacy & Security — config for tools/build.js.
//
// Cross-cutting program board: tracks the privacy + security + pen-testing
// work that spans every Coreshift app. Strategy doc lives at
// SECURITY-PRIVACY-PLAN.md (kept local with HOW-WE-DO-SECURITY.md since
// they list live findings); this board is the operational view safe to
// share at link-clickability level.

module.exports = {
  source: "KANBAN.md",
  output: "index.html",

  brandMark: "🔐",
  brandSub: "Privacy & Security Program",

  title: "Coreshift Privacy & Security",
  tagline:
    "NZ Privacy Act 2020-aligned program: foundation first, automation next, compliance trigger-gated.",
  description:
    "The cross-cutting privacy + security + pen-testing track that spans every Coreshift app — KeyContent, Sentinel, Noozey, and downstream products. Bench-test the things you'd say to a customer asking 'are you secure', the regulator asking 'do you comply', or a future ourselves asking 'why did we choose that.'",
  phase: "Phase B · Foundation",
  nextMilestone: {
    name: "Kling decision + meeting",
    date: "Next week",
  },

  goals: [
    {
      icon: "🛡",
      title: "Defensible posture today",
      desc: "Zero open advisor findings, RLS + service-role grants on every table, conservative Sentry config, Cloudflare WAF + Bot Fight. The mechanical stuff is done.",
    },
    {
      icon: "📖",
      title: "Documented posture",
      desc: "Data inventory + sub-processor list + retention policy + deletion path + breach response plan + threat models. Privacy Act 2020 alignment at both contract (Type 3 agreement) and end-user (notice) layers.",
    },
    {
      icon: "🤖",
      title: "Automated detection",
      desc: "OWASP ZAP weekly baseline, Sentry heartbeat, advisor auto-monitoring (Brief 14 next). 'Make the platform come find you' — Sentinel becomes the security surface, not a separate spreadsheet.",
    },
  ],

  links: [
    {
      icon: "📋",
      title: "Meeting brief",
      desc: "Single doc for team review — TL;DR, risk register, decisions needed",
      url: "https://github.com/CoreshiftHQNZ/coreshift-kanbans",
      internal: true,
    },
    {
      icon: "📐",
      title: "Strategy doc",
      desc: "SECURITY-PRIVACY-PLAN.md — phases A→D + operator forks",
      url: "https://github.com/CoreshiftHQNZ/coreshift-kanbans",
      internal: true,
    },
    {
      icon: "🛡",
      title: "Sentinel kanban",
      desc: "Where the platform-level work lives (Briefs 14-19 surface this program in-app)",
      url: "https://coreshifthqnz.github.io/coreshift-kanbans/sentinel/",
    },
    {
      icon: "🧭",
      title: "Root board",
      desc: "All Coreshift project kanbans",
      url: "https://coreshifthqnz.github.io/coreshift-kanbans/",
    },
  ],

  roles: [
    { initial: "O", name: "Operator",    person: "Abe",          verbs: "Decide · sign DPAs · run prod scripts" },
    { initial: "C", name: "Claude Code", person: "AI pair",      verbs: "Draft · implement · audit · stamp migrations" },
    { initial: "S", name: "Sentinel",    person: "The platform", verbs: "Monitor · alert · digest · surface" },
  ],

  phases: [
    {
      key: "phase-A",
      status: "done",
      title: "Phase A",
      subtitle: "Stop the bleeding",
      window: "Shipped 2026-05-29",
      desc: "DB advisor findings closed; data flow + privacy audit documented; T&Cs reviewed; zero-findings baseline established on KC + Sentinel prod.",
      deliverables: [
        "bug_reports_set_updated_at search_path hardened (KC)",
        "maintenance_set_updated_at search_path hardened (Sentinel)",
        "rls_auto_enable() PUBLIC EXECUTE revoked (Sentinel)",
        "Zero open advisor findings on both prod",
        "bug_reports end-to-end data flow doc",
        "KC privacy notice + cookies audit",
      ],
    },
    {
      key: "phase-B",
      status: "in-progress",
      title: "Phase B",
      subtitle: "Build the spine",
      window: "Mostly shipped · code track live",
      desc: "Docs + foundation code: inventory, sub-processors, retention policy, deletion path, breach response, threat models, draft privacy notice. Code: retention sweeps + Sentry heartbeat + ZAP DAST CI all live on prod.",
      deliverables: [
        "DATA-INVENTORY.md (30 KC tables + 3 Sentinel + 2 buckets)",
        "SUB-PROCESSORS.md (18 third parties + applicability matrix)",
        "HOW-WE-DO-RETENTION.md + retention sweep scripts (shipped to prod)",
        "HOW-WE-DO-DATA-DELETION.md (deletion scripts deferred pending review)",
        "HOW-WE-DO-BREACH-RESPONSE.md (Part 6 aligned)",
        "Threat models (KC + Sentinel)",
        "PRIVACY-NOTICE-KC-DRAFT.md",
        "OWASP ZAP DAST CI (Phase B9) — shipped to prod",
      ],
    },
    {
      key: "phase-C",
      status: "planned",
      title: "Phase C",
      subtitle: "Sentinel automation",
      window: "Next sprints",
      desc: "Turn every doc + every signal into a Sentinel surface. Make the platform come find you instead of us remembering to check.",
      deliverables: [
        "Brief 14 — Security advisor surface (/security page in Sentinel)",
        "Brief 15 — Data inventory surface (/data-inventory page)",
        "Brief 16 — Pen-test cadence tracking",
        "Brief 17 — Breach response runbook surfacing",
        "Brief 18 — Sentry heartbeat (shipped — needs operator env-var to activate)",
        "Brief 19 — R2 backup for KC job-assets bucket",
      ],
    },
    {
      key: "phase-D",
      status: "future",
      title: "Phase D",
      subtitle: "Trigger-gated compliance",
      window: "Only when triggered",
      desc: "NZ Privacy Act formal review · GDPR posture · SOC 2 · annual third-party pen test · automated DAST in CI · cyber-insurance · bug-bounty. Each item has its own trigger condition; we don't pursue any of them by calendar.",
      deliverables: [
        "First enterprise security questionnaire → SOC 2 prep",
        "First EU customer → GDPR DPA + SCCs",
        "Notifiable breach or scale-up → formal Privacy Act review",
        "Enterprise contract or SOC 2 path → annual third-party pen test",
        "Pre-SOC2 / pre-pentest → automated DAST in CI",
      ],
    },
  ],

  footerHtml:
    'Cross-cutting program board. Strategy: <code>Sentinel/playbook/SECURITY-PRIVACY-PLAN.md</code> (local) · Meeting brief: <code>Sentinel/playbook/PRIVACY-SECURITY-MEETING-BRIEF.md</code> (local) · Platform briefs land on the <a href="../sentinel/">Sentinel kanban</a>.',
};
