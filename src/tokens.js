const T = {
  bg: "#f5f6f9", sidebar: "#0d1320", sidebarActive: "#1e293b",
  card: "#fff", border: "#eaecf0", tp: "#1a2035", ts: "#64748b", td: "#94a3b8",
  cyan: "#06b6d4", green: "#16a34a", blue: "#2563eb", amber: "#d97706",
  red: "#dc2626", violet: "#7c3aed", teal: "#0d9488", slate: "#64748b",
  f: "'DM Sans', sans-serif", m: "'DM Mono', monospace",
};
const SM = {
  complete: { color: T.green, bg: "#f0fdf4", dot: "●", label: "Complete" },
  "in-progress": { color: T.amber, bg: "#fffbeb", dot: "◐", label: "In Progress" },
  "not-started": { color: T.td, bg: "#f8fafc", dot: "○", label: "Not Started" },
  blocked: { color: T.red, bg: "#fef2f2", dot: "✕", label: "Blocked" },
  active: { color: T.blue, bg: "#eff6ff", dot: "◫", label: "Active" },
};

/* ══ SECTIONS — Studio naming, new order ══ */
const SECS = [
  { id: "command", label: "Command Studio", icon: "⊞", phase: null, status: "active", pct: null, desc: "Workshop overview & navigation", color: T.cyan },
  { id: "stakeholder", label: "Stakeholder Studio", icon: "◎", phase: null, status: "in-progress", pct: null, desc: "People, influence & relationship mapping", color: T.cyan },
  { id: "executive", label: "Executive Studio", icon: "◈", phase: 1, status: "complete", pct: 100, desc: "Business objectives & strategy", color: T.green },
  { id: "footprint", label: "GTT Baseline Studio", icon: "⊕", phase: null, status: "in-progress", pct: 68, desc: "Prepared GTT installed base & service baseline", color: T.teal },
  { id: "current", label: "Infrastructure Studio", icon: "▦", phase: 2, status: "complete", pct: 92, desc: "Footprint, WAN, providers, contracts", color: T.blue },
  { id: "network", label: "Network Studio", icon: "◉", phase: 3, status: "in-progress", pct: 72, desc: "SD-WAN, branch, performance", color: T.blue },
  { id: "security", label: "Security Studio", icon: "◆", phase: 4, status: "in-progress", pct: 58, desc: "SASE, zero trust, compliance", color: T.red },
  { id: "cloud", label: "Cloud Studio", icon: "◇", phase: 5, status: "in-progress", pct: 45, desc: "Multi-cloud, migration, edge", color: T.violet },
  { id: "future", label: "Architecture Studio", icon: "◬", phase: 6, status: "not-started", pct: 20, desc: "Target architecture", color: T.teal },
  { id: "value", label: "Value Studio", icon: "◪", phase: null, status: "not-started", pct: 10, desc: "TCO/ROI analysis", color: T.slate },
  { id: "roadmap", label: "Roadmap Studio", icon: "▷", phase: 7, status: "not-started", pct: 15, desc: "Phases & dependencies", color: T.slate },
  { id: "deliver", label: "Deliverables Studio", icon: "◱", phase: 8, status: "not-started", pct: 20, desc: "Outputs & artifacts", color: T.violet },
];

/* ── Styles ── */
const iS = { fontFamily: T.f, fontSize: 13, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fff", boxSizing: "border-box", width: "100%" };
const selS = { fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "4px 8px", background: "#fff", cursor: "pointer" };
const smI = { fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "4px 8px", background: "#fff", boxSizing: "border-box" };
const lbl = { fontFamily: T.f, fontSize: 11, fontWeight: 500, color: T.td, marginBottom: 4, display: "block" };

export { T, SM, SECS, iS, selS, smI, lbl };
