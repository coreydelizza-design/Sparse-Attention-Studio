import { useState, useCallback, useRef, useEffect } from "react";

/* ── Tokens ── */
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
  { id: "footprint", label: "GTT Footprint Studio", icon: "⊕", phase: null, status: "in-progress", pct: 68, desc: "GTT installed base & expansion signals", color: T.teal },
  { id: "current", label: "Infrastructure Studio", icon: "▦", phase: 2, status: "complete", pct: 92, desc: "Footprint, WAN, providers, contracts", color: T.blue },
  { id: "network", label: "Network Studio", icon: "◉", phase: 3, status: "in-progress", pct: 72, desc: "SD-WAN, branch, performance", color: T.blue },
  { id: "security", label: "Security Studio", icon: "◆", phase: 4, status: "in-progress", pct: 58, desc: "SASE, zero trust, compliance", color: T.red },
  { id: "cloud", label: "Cloud Studio", icon: "◇", phase: 5, status: "in-progress", pct: 45, desc: "Multi-cloud, migration, edge", color: T.violet },
  { id: "future", label: "Architecture Studio", icon: "◬", phase: 6, status: "not-started", pct: 20, desc: "Target architecture", color: T.teal },
  { id: "value", label: "Value Studio", icon: "◪", phase: null, status: "not-started", pct: 10, desc: "TCO/ROI analysis", color: T.slate },
  { id: "roadmap", label: "Roadmap Studio", icon: "▷", phase: 7, status: "not-started", pct: 15, desc: "Phases & dependencies", color: T.slate },
  { id: "deliver", label: "Deliverables Studio", icon: "◱", phase: 8, status: "not-started", pct: 20, desc: "Outputs & artifacts", color: T.violet },
];

/* ══ SHARED DATA ══ */
const INIT_SITES = [
  { id: 1, region: "Northeast", type: "Branch", count: 34, states: "CT, MA, NY, NJ, PA", circuit: "MPLS", bandwidth: "100 Mbps", provider: "AT&T", notes: "SD-WAN pilot — 8 live" },
  { id: 2, region: "Southeast", type: "Branch", count: 28, states: "FL, GA, NC, SC, VA", circuit: "MPLS", bandwidth: "100 Mbps", provider: "AT&T", notes: "3 sites packet loss" },
  { id: 3, region: "Midwest", type: "Branch", count: 22, states: "IL, OH, MI, IN, WI", circuit: "MPLS", bandwidth: "50 Mbps", provider: "AT&T", notes: "6 rural frame relay" },
  { id: 4, region: "West", type: "Branch", count: 19, states: "CA, WA, OR, CO, AZ", circuit: "MPLS+DIA", bandwidth: "100 Mbps", provider: "AT&T/Comcast", notes: "" },
  { id: 5, region: "Canada", type: "Branch", count: 22, states: "ON, BC, AB", circuit: "MPLS", bandwidth: "50 Mbps", provider: "AT&T/Bell", notes: "Cross-border latency" },
  { id: 6, region: "Pinnacle Insurance", type: "Acquired", count: 38, states: "Multi-state", circuit: "MPLS", bandwidth: "50 Mbps", provider: "CenturyLink", notes: "Separate Cisco ASA" },
  { id: 7, region: "NorthStar Wealth", type: "Acquired", count: 12, states: "NE US", circuit: "Broadband", bandwidth: "200 Mbps", provider: "Comcast", notes: "Greenfield, not on WAN" },
  { id: 8, region: "Dallas DC", type: "Data Center", count: 1, states: "TX", circuit: "DIA", bandwidth: "10 Gbps", provider: "Zayo", notes: "Primary DC" },
  { id: 9, region: "Ashburn DC", type: "Data Center", count: 1, states: "VA", circuit: "DIA", bandwidth: "10 Gbps", provider: "Zayo", notes: "Cloud on-ramp" },
  { id: 10, region: "Phoenix DR", type: "DR Site", count: 1, states: "AZ", circuit: "DIA", bandwidth: "1 Gbps", provider: "CenturyLink", notes: "DR only" },
];
const INIT_PROVS = [
  { id: 1, name: "AT&T", type: "MPLS", sites: 87, cost: "$2.1M/yr", expiry: "Dec 2026", action: "Non-Renew" },
  { id: 2, name: "Comcast", type: "DIA/Broadband", sites: 42, cost: "$680K/yr", expiry: "M2M", action: "Retain & Expand" },
  { id: 3, name: "CenturyLink", type: "MPLS (Pinnacle)", sites: 38, cost: "$280K/yr", expiry: "Active", action: "Early Terminate" },
  { id: 4, name: "Zayo", type: "Backbone", sites: 2, cost: "$340K/yr", expiry: "2027", action: "Retain" },
  { id: 5, name: "Verizon", type: "LTE Backup", sites: 35, cost: "$95K/yr", expiry: "Annual", action: "Expand" },
  { id: 6, name: "T-Mobile", type: "LTE Backup", sites: 22, cost: "$68K/yr", expiry: "Annual", action: "Evaluate" },
];
const INIT_NET_ELS = [
  { id: 1, device: "Router", model: "Cisco ISR 4331", qty: 87, location: "US Branches", circuit: "MPLS", provider: "AT&T", status: "Active" },
  { id: 2, device: "SD-WAN", model: "FortiGate 60F", qty: 8, location: "NE Pilot", circuit: "BB+LTE", provider: "Comcast", status: "Pilot" },
  { id: 3, device: "Firewall", model: "Cisco ASA 5506", qty: 38, location: "Pinnacle", circuit: "MPLS", provider: "CenturyLink", status: "EOL" },
  { id: 4, device: "Switch", model: "Cisco 2960X", qty: 125, location: "All Sites", circuit: "-", provider: "-", status: "Active" },
  { id: 5, device: "Wireless AP", model: "Cisco Aironet", qty: 340, location: "All Sites", circuit: "-", provider: "-", status: "Aging" },
];
const INIT_SEC_TOOLS = [
  { id: 1, category: "Firewall", vendor: "Fortinet", product: "FortiGate 100F", coverage: "48%", lifecycle: "Current", priority: "High" },
  { id: 2, category: "Firewall", vendor: "Cisco", product: "ASA 5506-X", coverage: "30%", lifecycle: "End of Support", priority: "Critical" },
  { id: 3, category: "SWG", vendor: "Zscaler", product: "ZIA", coverage: "12%", lifecycle: "Current", priority: "High" },
  { id: 4, category: "EDR", vendor: "CrowdStrike", product: "Falcon", coverage: "85%", lifecycle: "Current", priority: "Medium" },
  { id: 5, category: "SIEM", vendor: "Splunk", product: "Enterprise", coverage: "60%", lifecycle: "Current", priority: "Medium" },
];
const INIT_CLOUD_RES = [
  { id: 1, provider: "AWS", service: "EC2/EKS", region: "us-east-1", connect: "Direct Connect", workloads: 72, cost: "$86K/mo", tier: "Production" },
  { id: 2, provider: "AWS", service: "S3/EBS", region: "us-west-2", connect: "Direct Connect", workloads: 48, cost: "$34K/mo", tier: "Production" },
  { id: 3, provider: "Azure", service: "VMs", region: "East US", connect: "ExpressRoute", workloads: 28, cost: "$42K/mo", tier: "Production" },
  { id: 4, provider: "Azure", service: "M365", region: "Global", connect: "Internet", workloads: 17, cost: "$28K/mo", tier: "Production" },
  { id: 5, provider: "GCP", service: "Vertex AI", region: "us-central1", connect: "VPN", workloads: 4, cost: "$18K/mo", tier: "Dev/Test" },
];

/* ══ ATTENDEE DATA ══ */
const CUST_ROLES = ["CTO", "CIO", "CISO", "VP of Infrastructure", "VP of Network Engineering", "VP of IT Operations", "VP of Cloud & Platform", "Director of Network Services", "Director of IT Security", "Director of Cloud Operations", "Director of Enterprise Architecture", "Sr. Network Architect", "Sr. Security Architect", "Sr. Cloud Architect", "Network Engineering Manager", "Security Operations Manager", "Cloud Engineering Manager", "IT Operations Manager", "Principal Network Engineer", "Sr. Network Engineer", "Network Engineer", "Security Engineer", "Cloud Engineer", "Systems Engineer", "Infrastructure Engineer", "NOC Manager", "NOC Engineer", "Compliance / Risk Manager", "IT Procurement", "IT Finance / FinOps", "Project Manager", "Program Manager", "Other"];
const GTT_ROLES = ["CEO", "President", "COO", "CTO", "CRO", "SVP of Sales", "SVP of Engineering", "SVP of Product", "VP of Sales", "VP of Solutions Engineering", "VP of Product Management", "VP of Service Delivery", "Regional VP", "Account Director", "Account Manager", "Sr. Account Manager", "Solutions Architect", "Sr. Solutions Architect", "Principal Solutions Architect", "Network Solutions Engineer", "Security Solutions Engineer", "Cloud Solutions Engineer", "Pre-Sales Engineer", "Sr. Pre-Sales Engineer", "Technical Consultant", "Engagement Manager", "Program Manager", "Product Specialist — SD-WAN", "Product Specialist — SASE", "Product Specialist — Cloud", "Service Delivery Manager", "Customer Success Manager", "Other"];

const INIT_CUST_ATTENDEES = [
  { id: 1, name: "Sarah Chen", role: "CTO", email: "s.chen@meridianfg.com", focus: "Executive sponsor, cloud-first mandate", present: true },
  { id: 2, name: "Marcus Williams", role: "VP of Network Engineering", email: "m.williams@meridianfg.com", focus: "WAN strategy, SD-WAN pilot lead", present: true },
  { id: 3, name: "Jennifer Park", role: "Director of IT Security", email: "j.park@meridianfg.com", focus: "Zero Trust program, SASE evaluation", present: true },
  { id: 4, name: "David Rodriguez", role: "Sr. Network Architect", email: "d.rodriguez@meridianfg.com", focus: "Branch design, CPE standards", present: true },
  { id: 5, name: "Lisa Thompson", role: "Network Engineering Manager", email: "l.thompson@meridianfg.com", focus: "Pinnacle integration, site migrations", present: true },
  { id: 6, name: "James Kim", role: "Sr. Cloud Architect", email: "j.kim@meridianfg.com", focus: "AWS/Azure connectivity, app migration", present: false },
  { id: 7, name: "Amanda Foster", role: "Network Engineer", email: "a.foster@meridianfg.com", focus: "SD-WAN pilot operations, monitoring", present: true },
  { id: 8, name: "Robert Chen", role: "IT Procurement", email: "r.chen@meridianfg.com", focus: "Contract negotiations, vendor management", present: false },
];

const INIT_GTT_ATTENDEES = [
  { id: 1, name: "Michael Barrett", role: "Account Director", email: "m.barrett@gtt.net", focus: "Engagement lead, executive relationship", present: true },
  { id: 2, name: "Karen Nguyen", role: "Sr. Solutions Architect", email: "k.nguyen@gtt.net", focus: "Network design, SD-WAN architecture", present: true },
  { id: 3, name: "Tom Bradley", role: "Security Solutions Engineer", email: "t.bradley@gtt.net", focus: "SASE/SSE design, ZT advisory", present: true },
  { id: 4, name: "Rachel Patel", role: "Cloud Solutions Engineer", email: "r.patel@gtt.net", focus: "Cloud connectivity, multi-cloud design", present: true },
  { id: 5, name: "Steve Morrison", role: "Engagement Manager", email: "s.morrison@gtt.net", focus: "Workshop facilitation, deliverables", present: true },
];

/* ── Styles ── */
const iS = { fontFamily: T.f, fontSize: 13, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fff", boxSizing: "border-box", width: "100%" };
const selS = { fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "4px 8px", background: "#fff", cursor: "pointer" };
const smI = { fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "4px 8px", background: "#fff", boxSizing: "border-box" };
const lbl = { fontFamily: T.f, fontSize: 11, fontWeight: 500, color: T.td, marginBottom: 4, display: "block" };

/* ═══════ PRIMITIVES — Sparse attention design system ═══════ */

function Ring({ size, pct, color, stroke, label, textColor }) {
  const sz = size || 80, st = stroke || 6, r = (sz - st) / 2, c = 2 * Math.PI * r, off = c - ((pct || 0) / 100) * c;
  const tc = textColor || T.tp;
  return (<div style={{ position: "relative", width: sz, height: sz, flexShrink: 0 }}><svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={T.border} strokeWidth={st} /><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={color || T.cyan} strokeWidth={st} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" /></svg><div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: T.f, fontWeight: 700, fontSize: sz > 60 ? 22 : 11, color: tc }}>{pct}%</span>{label && <span style={{ fontFamily: T.m, fontSize: 7, color: textColor ? "rgba(255,255,255,0.5)" : T.td, letterSpacing: 1, marginTop: 2, textTransform: "uppercase" }}>{label}</span>}</div></div>);
}
function Chip({ status }) { const m = SM[status] || SM["not-started"]; return <span style={{ fontFamily: T.m, fontSize: 10, color: m.color, background: m.bg, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{m.label}</span>; }
function Bar({ pct, color, h }) { const ht = h || 6; return <div style={{ width: "100%", height: ht, background: T.border, borderRadius: ht / 2, overflow: "hidden" }}><div style={{ width: (pct || 0) + "%", height: "100%", background: color || T.cyan, borderRadius: ht / 2 }} /></div>; }
function Sev({ s }) { const c = { critical: T.red, high: T.amber, medium: T.blue, low: T.td }[s] || T.td; return <span style={{ fontFamily: T.m, fontSize: 9, color: c, background: c + "15", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase" }}>{s}</span>; }
function StatusTag({ v }) { const cm = { Active: T.green, Current: T.green, Production: T.green, Pilot: T.cyan, Aging: T.amber, EOL: T.red, "End of Support": T.red, Critical: T.red, High: T.amber, Medium: T.blue, Low: T.td, "Dev/Test": T.cyan }; const c = cm[v] || T.td; return <span style={{ fontFamily: T.m, fontSize: 9, color: c, background: c + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", whiteSpace: "nowrap" }}>{v}</span>; }
function MtBar({ label, score, color }) { return (<div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}><span style={{ fontFamily: T.f, fontSize: 13, fontWeight: 500, color: T.tp, width: 120, flexShrink: 0 }}>{label}</span><div style={{ flex: 1, height: 10, background: T.border, borderRadius: 5, overflow: "hidden" }}><div style={{ width: score + "%", height: "100%", background: color, borderRadius: 5 }} /></div><span style={{ fontFamily: T.m, fontSize: 12, fontWeight: 500, color: score >= 60 ? T.green : score >= 40 ? T.amber : T.red, width: 32, textAlign: "right" }}>{score}</span></div>); }

/* Section Header — PRIMARY focal element per screen */
function SecHead({ s }) {
  const m = SM[s.status];
  return (<div style={{ marginBottom: 8 }}>
    {s.phase && <div style={{ fontFamily: T.m, fontSize: 10, color: T.td, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Phase {s.phase} of 8</div>}
    <div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.tp }}>{s.label}</div>
    <div style={{ fontFamily: T.f, fontSize: 13, color: T.ts, marginTop: 4 }}>{s.desc}</div>
    {s.pct != null && <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}><Bar pct={s.pct} color={m.color} /><span style={{ fontFamily: T.m, fontSize: 11, color: m.color }}>{s.pct}%</span></div>}
  </div>);
}

/* Tower Strip — compact readiness indicator */
function Strip({ label, pct, color, detail }) {
  return (<div style={{ background: color + "06", borderRadius: 10, border: "1px solid " + color + "18", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
    <Ring size={40} pct={pct} color={color} stroke={3.5} />
    <div style={{ flex: 1 }}><div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: color }}>{label}: {pct}%</div><div style={{ fontFamily: T.f, fontSize: 11, color: T.td }}>{detail}</div></div>
  </div>);
}

/* ── DISCLOSURE CARD — Core sparse attention component ── */
function Disc({ tag, tagColor, title, summary, defaultOpen, right, children }) {
  const _o = useState(defaultOpen === true); const open = _o[0]; const setOpen = _o[1];
  return (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
    <div onClick={function () { setOpen(!open); }} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", borderBottom: open ? "1px solid " + T.border : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
        <span style={{ fontSize: 10, color: T.td, marginTop: 4, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", flexShrink: 0 }}>▶</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: tagColor, background: tagColor + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>{tag}</span>
            <span style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp }}>{title}</span>
          </div>
          {summary && !open && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, marginTop: 4, lineHeight: 1.5 }}>{summary}</div>}
        </div>
      </div>
      {right}
    </div>
    {open && <div style={{ padding: "16px 18px" }}>{children}</div>}
  </div>);
}

/* Always-open card for primary content */
function PrimaryCard({ tag, tagColor, title, right, children }) {
  return (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
    <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid " + T.border }}>
      <div><span style={{ fontFamily: T.m, fontSize: 9, color: tagColor, background: tagColor + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>{tag}</span><div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{title}</div></div>
      {right}
    </div>
    <div style={{ padding: "16px 18px" }}>{children}</div>
  </div>);
}

/* Notes field — primary capture surface */
function Nts({ tag, tc, title, sub, value, onChange, rows }) {
  const minH = 150;
  const _h = useState((rows || 6) * 26 + 100); const cardHeight = _h[0]; const setCardHeight = _h[1];
  const _drag = useState(false); const dragging = _drag[0]; const setDragging = _drag[1];
  const dragRef = useRef({ startY: 0, startH: 0 });

  useEffect(function () {
    if (!dragging) return;
    function onMove(e) {
      var newH = dragRef.current.startH + (e.clientY - dragRef.current.startY);
      setCardHeight(Math.max(minH, newH));
    }
    function onUp() { setDragging(false); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return function () { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  function onMouseDown(e) {
    e.preventDefault();
    dragRef.current.startY = e.clientY;
    dragRef.current.startH = cardHeight;
    setDragging(true);
  }

  return (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + (dragging ? T.cyan : T.border), height: cardHeight, display: "flex", flexDirection: "column", overflow: "hidden", transition: dragging ? "none" : "border-color 0.2s", userSelect: dragging ? "none" : "auto" }}>
    <div style={{ padding: "14px 18px 0", flexShrink: 0 }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: tc, background: tc + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>{tag}</span>
      <div style={{ fontFamily: T.f, fontSize: 15, fontWeight: 600, color: T.tp, marginTop: 6 }}>{title}</div>
      {sub && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, marginTop: 2 }}>{sub}</div>}
    </div>
    <div style={{ flex: 1, padding: "8px 18px 0", minHeight: 0 }}>
      <textarea value={value} onChange={function (e) { onChange(e.target.value); }} style={{ fontFamily: T.f, fontSize: 13, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "10px 12px", background: "#fafbfc", boxSizing: "border-box", width: "100%", height: "100%", resize: "none", lineHeight: 1.65, outline: "none" }} onFocus={function (e) { e.target.style.background = "#fff"; e.target.style.borderColor = T.cyan; }} onBlur={function (e) { e.target.style.background = "#fafbfc"; e.target.style.borderColor = T.border; }} />
    </div>
    <div onMouseDown={onMouseDown} style={{ height: 16, cursor: "ns-resize", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, background: dragging ? T.cyan + "06" : "transparent", borderTop: "1px solid " + (dragging ? T.cyan + "33" : T.border), borderRadius: "0 0 10px 10px", transition: "background 0.15s" }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: dragging ? T.cyan : "#d1d5db", transition: "background 0.15s" }} />
    </div>
  </div>);
}

/* ── Interactive helpers ── */
function ScoreRow({ label, score, onChange, color }) {
  const sl = ["", "Not Ready", "Early", "Developing", "Established", "Optimized"];
  return (<div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}><span style={{ fontFamily: T.f, fontSize: 13, color: T.tp, flex: 1 }}>{label}</span><div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(function (n) { return <button key={n} onClick={function () { onChange(n); }} style={{ width: 26, height: 26, borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: T.f, cursor: "pointer", border: "1.5px solid " + (n <= score ? color : T.border), background: n <= score ? color + (n === score ? "20" : "10") : "transparent", color: n <= score ? color : T.td }}>{n}</button>; })}</div><span style={{ fontFamily: T.m, fontSize: 9, color: T.td, width: 65, textAlign: "right" }}>{sl[score]}</span></div>);
}
function Decision({ question, options, selected, onSelect, color }) {
  return (<div style={{ padding: "10px 0" }}><div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp, marginBottom: 6 }}>{question}</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{options.map(function (o) { const on = selected === o; return <button key={o} onClick={function () { onSelect(o); }} style={{ fontFamily: T.f, fontSize: 11, padding: "5px 12px", borderRadius: 5, cursor: "pointer", border: "1.5px solid " + (on ? color : T.border), background: on ? color + "12" : "transparent", color: on ? color : T.ts, fontWeight: on ? 600 : 400 }}>{on ? "● " : ""}{o}</button>; })}</div></div>);
}
function Findings({ items, setItems, placeholder, color }) {
  const _v = useState(""); const val = _v[0]; const setVal = _v[1];
  function doAdd() { if (val.trim()) { setItems(items.concat([val.trim()])); setVal(""); } }
  return (<div><div style={{ display: "flex", gap: 8, marginBottom: 10 }}><input value={val} onChange={function (e) { setVal(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") doAdd(); }} placeholder={placeholder} style={Object.assign({}, iS, { flex: 1 })} /><button onClick={doAdd} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: color, border: "none", borderRadius: 6, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button></div>{items.map(function (f, i) { return <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < items.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ color: color, flexShrink: 0, fontSize: 11 }}>!</span><span style={{ fontFamily: T.f, fontSize: 12, color: T.ts, flex: 1 }}>{f}</span><button onClick={function () { setItems(items.filter(function (_, j) { return j !== i; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11 }}>✕</button></div>; })}</div>);
}
function Chk({ label, done, sub, onToggle }) {
  return (<div onClick={onToggle} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", cursor: "pointer" }}><div style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (done ? T.green : T.border), background: done ? T.green + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{done && <span style={{ color: T.green, fontSize: 12, fontWeight: 700 }}>✓</span>}</div><div><span style={{ fontFamily: T.f, fontSize: 12, color: done ? T.td : T.tp, textDecoration: done ? "line-through" : "none" }}>{label}</span>{sub && <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 1 }}>{sub}</div>}</div></div>);
}

/* ── AI Analysis ── */
function AIBtn({ label, data, color }) {
  const _s = useState("idle"); const st = _s[0]; const setSt = _s[1];
  const _r = useState(""); const result = _r[0]; const setResult = _r[1];
  function run() {
    setSt("loading"); setResult("");
    fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: "You are a network transformation consultant. Analyze this data. Give 3-5 specific insights, risks, and next steps. Under 200 words.\n\n" + JSON.stringify(data, null, 2) }] }) }).then(function (r) { return r.json(); }).then(function (d) { setResult(d.content && d.content[0] ? d.content[0].text : "Analysis complete."); setSt("done"); }).catch(function () { setResult("Unable to reach AI. Try again."); setSt("done"); });
  }
  return (<div style={{ background: color + "04", borderRadius: 10, border: "1px solid " + color + "22", padding: "14px 16px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>✦</span><span style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp }}>AI Analysis</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.td }}>— {label}</span></div>
      <button onClick={run} disabled={st === "loading"} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: st === "loading" ? T.td : color, border: "none", borderRadius: 5, padding: "6px 14px", cursor: st === "loading" ? "wait" : "pointer" }}>{st === "loading" ? "..." : st === "done" ? "Re-run" : "Analyze"}</button>
    </div>
    {result && <div style={{ fontFamily: T.f, fontSize: 12, color: T.ts, lineHeight: 1.65, whiteSpace: "pre-wrap", marginTop: 10, padding: "12px 14px", background: "#fff", borderRadius: 6, borderLeft: "3px solid " + color }}>{result}</div>}
  </div>);
}

/* ── Inventory Table (tertiary detail) ── */
function InvTable({ cols, rows, onRm, color }) {
  return (<div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.f, fontSize: 11 }}>
    <thead><tr style={{ background: "#f8f9fb" }}>{cols.map(function (c) { return <th key={c.key} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: T.ts, fontSize: 10, borderBottom: "2px solid " + color + "22", whiteSpace: "nowrap" }}>{c.label}</th>; })}<th style={{ width: 30, borderBottom: "2px solid " + color + "22" }} /></tr></thead>
    <tbody>{rows.map(function (r, i) { return (<tr key={r.id} style={{ background: i % 2 ? "#fafbfc" : "transparent" }}>{cols.map(function (c) { const v = r[c.key]; const isTag = c.key === "status" || c.key === "lifecycle" || c.key === "priority" || c.key === "tier"; return <td key={c.key} style={{ padding: "7px 10px", color: T.tp, borderBottom: "1px solid " + T.border, whiteSpace: "nowrap" }}>{isTag ? <StatusTag v={v} /> : v}</td>; })}<td style={{ padding: "5px 6px", borderBottom: "1px solid " + T.border, textAlign: "center" }}><button onClick={function () { onRm(r.id); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11 }}>✕</button></td></tr>); })}{!rows.length && <tr><td colSpan={cols.length + 1} style={{ padding: 20, textAlign: "center", color: T.td, fontStyle: "italic", fontSize: 12 }}>No items</td></tr>}</tbody>
  </table></div>);
}

/* ═══════ SIDEBAR — persistent context panel ═══════ */
function Sidebar({ active, onNav, stats }) {
  return (<div style={{ width: 218, minWidth: 218, height: "100vh", background: T.sidebar, display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
    <div style={{ padding: "18px 16px 4px" }}><div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" }}>GTT Network</div><div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, letterSpacing: 1.6, textTransform: "uppercase", marginTop: 1 }}>Transformation Studio</div></div>
    <div style={{ margin: "8px 12px", padding: "7px 9px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}><div style={{ fontFamily: T.f, fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Session</div><div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>Meridian Financial Group</div></div>

    {/* Completeness gauge + stats */}
    <div style={{ padding: "10px 12px 6px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Ring size={64} pct={stats.pct} color={T.cyan} stroke={4.5} label="complete" textColor="#fff" />
      <div style={{ width: "100%", marginTop: 8 }}>
        {[["Sites", stats.totalSites], ["Attendees", stats.custAttendees + " + " + stats.gttAttendees], ["Network Elements", stats.totalNetEls], ["Security Tools", stats.totalSecTools], ["Cloud Resources", stats.totalCloudRes], ["Findings", stats.totalFindings]].map(function (row) {
          return (<div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "2px 2px" }}><span style={{ fontFamily: T.f, fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{row[0]}</span><span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: "#fff" }}>{row[1]}</span></div>);
        })}
      </div>
      <div style={{ width: "100%", marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[["Network", stats.nr, T.blue], ["Security", stats.sr, T.red], ["Cloud", stats.cr, T.violet]].map(function (row) {
          return (<div key={row[0]} style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 2px" }}><span style={{ fontFamily: T.f, fontSize: 9, color: "rgba(255,255,255,0.4)", width: 48, flexShrink: 0 }}>{row[0]}</span><div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}><div style={{ width: row[1] + "%", height: "100%", background: row[2], borderRadius: 2 }} /></div><span style={{ fontFamily: T.m, fontSize: 9, color: "#fff", width: 24, textAlign: "right" }}>{row[1]}%</span></div>);
        })}
      </div>
    </div>

    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 2 }}>
      {SECS.map(function (s) { const isA = active === s.id; const m = SM[s.status]; return (<div key={s.id} onClick={function () { onNav(s.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", cursor: "pointer", background: isA ? T.sidebarActive : "transparent", borderLeft: isA ? "3px solid " + T.cyan : "3px solid transparent" }}><span style={{ fontSize: 13, color: isA ? T.cyan : "rgba(255,255,255,0.3)", width: 18, textAlign: "center" }}>{s.icon}</span><span style={{ fontFamily: T.f, fontSize: 11, fontWeight: isA ? 600 : 400, color: isA ? "#fff" : "rgba(255,255,255,0.6)", flex: 1 }}>{s.label}</span><span style={{ fontSize: 9, color: m.color }}>{m.dot}</span></div>); })}
    </div>
    <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}><span style={{ fontFamily: T.m, fontSize: 8, color: "rgba(255,255,255,0.15)" }}>v1.0.0 · Sparse Attention Mode</span></div>
  </div>);
}

/* ═══════ HEADER — minimal, only active context ═══════ */
function Header({ section }) {
  const s = SECS.find(function (x) { return x.id === section; }) || SECS[0];
  return (<div style={{ height: 46, background: "#fff", borderBottom: "1px solid " + T.border, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "fixed", top: 0, left: 218, right: 0, zIndex: 90 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp }}>{s.label}</span>{s.phase && <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: "#ecfeff", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>Phase {s.phase}</span>}<Chip status={s.status} /></div>
    <div style={{ display: "flex", gap: 6 }}><button style={{ fontFamily: T.f, fontSize: 10, color: T.ts, background: "none", border: "1px solid " + T.border, borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>Reports</button><button style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.cyan, border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>Export</button></div>
  </div>);
}

/* ═══════ COMMAND STUDIO — summary-first ═══════ */
const DOMAIN_DEFS = [
  { id: "executive", label: "Executive Studio", color: T.green, goal: "Align on business drivers, transformation triggers, risk posture, and ambition level",
    scope: "Capture the strategic why behind the transformation — CTO mandate, M&A integration needs, compliance pressure, cost targets. Establish shared understanding of urgency and scope before technical deep-dives.",
    outputs: "Active business drivers, risk register, ambition score, transformation narrative" },
  { id: "current", label: "Infrastructure Studio", color: T.blue, goal: "Document the complete current-state network, site inventory, provider contracts, and constraints",
    scope: "Build an accurate picture of what exists today — every site cluster, circuit type, provider relationship, and cost line. Identify architectural constraints and technical debt that shape the transformation path.",
    outputs: "Site inventory, provider matrix, constraint register, spend baseline" },
  { id: "network", label: "Network Studio", color: T.blue, goal: "Assess SD-WAN readiness, define branch standards, make key transport and operations decisions",
    scope: "Evaluate current WAN maturity across 8 capability areas. Track site-by-site migration readiness. Capture decisions on MPLS strategy, backup connectivity, and managed vs. self-operated models. Document findings and blockers.",
    outputs: "SD-WAN readiness scores, migration tracker, key decisions, branch checklist, network element inventory" },
  { id: "security", label: "Security Studio", color: T.red, goal: "Evaluate SASE/SSE readiness, map vendor consolidation, advance Zero Trust program",
    scope: "Score 8 SASE components. Build vendor consolidation matrix with retain/replace decisions. Track Zero Trust checklist against board mandate. Identify compliance gaps and audit findings.",
    outputs: "SASE maturity scores, vendor consolidation plan, ZT readiness checklist, security findings" },
  { id: "cloud", label: "Cloud Studio", color: T.violet, goal: "Assess cloud connectivity, track app migration, define on-ramp architecture decisions",
    scope: "Evaluate cloud readiness across 8 dimensions. Map connectivity status for each cloud provider. Track application migration priorities and status. Make decisions on hub topology and edge compute strategy.",
    outputs: "Cloud readiness scores, connectivity assessment, app migration tracker, architecture decisions" },
  { id: "future", label: "Architecture Studio", color: T.teal, goal: "Define target architecture, branch model, operating state, and convergence vision",
    scope: "Translate workshop findings into a coherent target-state vision — converged fabric, standardized branch, unified operations. Bridge between current-state reality and transformation ambition.",
    outputs: "Architecture vision, branch blueprint, operating model, convergence strategy" },
  { id: "value", label: "Value Studio", color: T.slate, goal: "Frame the business case with TCO analysis, value drivers, and key tradeoff decisions",
    scope: "Quantify hard and soft savings. Map implementation tradeoffs (single vendor vs. best-of-breed, phased vs. big-bang). Build executive-ready financial justification.",
    outputs: "TCO/ROI model, tradeoff matrix, business case narrative" },
  { id: "roadmap", label: "Roadmap Studio", color: T.slate, goal: "Sequence the transformation into phased waves with dependencies and risk gates",
    scope: "Organize the work into executable phases. Map critical dependencies (contract dates, staffing, board milestones). Identify sequencing risks and gate criteria.",
    outputs: "Phased rollout plan, dependency map, risk register, milestone timeline" },
  { id: "deliver", label: "Deliverables Studio", color: T.violet, goal: "Track and generate all workshop output artifacts for customer delivery",
    scope: "Monitor deliverable status across the engagement — what's generated, what's in progress, what's pending. Ensure nothing falls through the cracks between workshop and proposal.",
    outputs: "Executive summary, architecture diagrams, BOM, TCO model, proposal deck" },
];

function CmdCenter({ onNav, stats }) {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {/* Welcome */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "18px 22px" }}>
      <div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>Command Studio</div>
      <div style={{ fontFamily: T.f, fontSize: 13, color: T.ts, marginTop: 4, lineHeight: 1.6 }}>Meridian Financial Group — {stats.totalSites} sites. This studio guides a structured network transformation workshop. Each module below has a defined scope, goal, and expected outputs. Work through them sequentially or jump to the most relevant domain. Statistics are tracked in the sidebar.</div>
    </div>

    {/* Transformation Towers — PRIMARY */}
    <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 4 }}>Transformation Towers</div>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {DOMAIN_DEFS.filter(function (d) { return d.id === "network" || d.id === "security" || d.id === "cloud"; }).map(function (d) {
        const r = d.id === "network" ? stats.nr : d.id === "security" ? stats.sr : stats.cr;
        return (<div key={d.id} onClick={function () { onNav(d.id); }} style={{ flex: 1, minWidth: 240, background: T.card, borderRadius: 10, border: "1px solid " + T.border, borderTop: "3px solid " + d.color, cursor: "pointer", padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp }}>{d.label}</span>
            <Ring size={38} pct={r} color={d.color} stroke={3} />
          </div>
          <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: d.color, marginBottom: 6 }}>{d.goal}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.5, marginBottom: 8 }}>{d.scope}</div>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.td, lineHeight: 1.5 }}>Outputs: {d.outputs}</div>
          <div style={{ fontFamily: T.m, fontSize: 10, color: d.color, marginTop: 10, textTransform: "uppercase" }}>Enter Module →</div>
        </div>);
      })}
    </div>

    {/* All Domains — definitions with progressive disclosure */}
    <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 4 }}>Workshop Modules</div>
    {DOMAIN_DEFS.filter(function (d) { return d.id !== "network" && d.id !== "security" && d.id !== "cloud"; }).map(function (d) {
      const sec = SECS.find(function (s) { return s.id === d.id; });
      const m = sec ? SM[sec.status] : SM["not-started"];
      return (<div key={d.id} onClick={function () { onNav(d.id); }} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, borderLeft: "3px solid " + d.color, padding: "14px 18px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp }}>{d.label}</span>
            {sec && <Chip status={sec.status} />}
          </div>
          {sec && sec.pct != null && <span style={{ fontFamily: T.m, fontSize: 10, color: m.color }}>{sec.pct}%</span>}
        </div>
        <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, color: d.color, marginBottom: 4 }}>{d.goal}</div>
        <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.5 }}>{d.scope}</div>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.td, marginTop: 4 }}>Outputs: {d.outputs}</div>
      </div>);
    })}
  </div>);
}

/* ═══════ EXECUTIVE STUDIO ═══════ */

/* Scope / follow-up shared controls */
var SCOPE_OPTS = ["Focus Now", "Park", "Out of Scope"];
var FOLLOWUP_OPTS = ["No Follow-Up", "Owner Not Present", "Needs GTT Follow-Up", "Customer Validation Needed", "Schedule Session", "Executive Alignment Needed", "Future Phase"];
function scopeColor(s) { return s === "Focus Now" ? T.green : s === "Park" ? T.amber : T.td; }
function followColor(f) { return f === "No Follow-Up" ? T.td : f === "Owner Not Present" ? T.amber : f === "Schedule Session" ? T.violet : f === "Executive Alignment Needed" ? T.red : T.cyan; }

/* Reusable topic row with scope + follow-up + notes */
function TopicRow({ t, onUpdate, onRemove }) {
  var _exp = useState(false); var expanded = _exp[0]; var setExpanded = _exp[1];
  var sc = scopeColor(t.scope);
  return (<div style={{ padding: "10px 0", borderBottom: "1px solid " + T.border }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span onClick={function () { setExpanded(!expanded); }} style={{ fontSize: 9, color: T.td, cursor: "pointer", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{t.label}</span>
          <span style={{ fontFamily: T.m, fontSize: 8, color: t.confirmed ? T.green : T.td, background: (t.confirmed ? T.green : T.td) + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", cursor: "pointer" }} onClick={function () { onUpdate("confirmed", !t.confirmed); }}>{t.confirmed ? "Confirmed" : "Suggested"}</span>
        </div>
        {t.description && !expanded && <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 1 }}>{t.description}</div>}
      </div>
      <select value={t.scope} onChange={function (e) { onUpdate("scope", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9, color: sc, borderColor: sc + "44" })}>
        {SCOPE_OPTS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}
      </select>
      <select value={t.followUp} onChange={function (e) { onUpdate("followUp", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9 })}>
        {FOLLOWUP_OPTS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}
      </select>
      {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>}
    </div>
    {expanded && (<div style={{ marginTop: 8, marginLeft: 17, display: "flex", flexDirection: "column", gap: 6 }}>
      <input value={t.description || ""} onChange={function (e) { onUpdate("description", e.target.value); }} placeholder="Description..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
      <div style={{ display: "flex", gap: 8 }}>
        <input value={t.owner || ""} onChange={function (e) { onUpdate("owner", e.target.value); }} placeholder="Owner name..." style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} />
        <input value={t.ownerRole || ""} onChange={function (e) { onUpdate("ownerRole", e.target.value); }} placeholder="Role..." style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} />
      </div>
      <input value={t.notes || ""} onChange={function (e) { onUpdate("notes", e.target.value); }} placeholder="Notes..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
    </div>)}
  </div>);
}

/* Helper: update item in array by id */
function updArr(arr, id, field, value) {
  return arr.map(function (x) { return x.id === id ? Object.assign({}, x, (function () { var o = {}; o[field] = value; return o; })()) : x; });
}

function ExecView({ onNav }) {
  /* ── Business Context ── */
  var _ctx = useState({
    industry: "Financial Services — Insurance & Wealth Management",
    footprint: "178 sites across 14 US states, 3 Canadian provinces, 2 data centers, 1 DR site",
    summary: "Meridian Financial Group is a mid-market financial services holding company operating insurance, wealth management, and advisory subsidiaries. Two recent acquisitions (Pinnacle Insurance, NorthStar Wealth) remain on separate network and security stacks.",
    whyNow: "CTO mandate: cloud-first architecture and zero trust security by FY27. AT&T MPLS contract expires Dec 2026. Pinnacle and NorthStar need full network integration. Board requires measurable security improvement within 12 months.",
    posture: "Active transformation — executive-sponsored, funded, seeking implementation partner",
    notes: ""
  }); var ctx = _ctx[0]; var setCtx = _ctx[1];
  function updCtx(f, v) { setCtx(Object.assign({}, ctx, (function () { var o = {}; o[f] = v; return o; })())); }

  /* ── Strategic Priorities ── */
  var _pri = useState([
    { id: 1, label: "Cost Efficiency", score: 5, confirmed: true },
    { id: 2, label: "Security & Resilience", score: 5, confirmed: true },
    { id: 3, label: "Cloud Enablement", score: 4, confirmed: true },
    { id: 4, label: "Standardization", score: 4, confirmed: false },
    { id: 5, label: "M&A Integration", score: 4, confirmed: true },
    { id: 6, label: "Growth Scalability", score: 3, confirmed: false },
    { id: 7, label: "AI / Automation", score: 2, confirmed: false },
    { id: 8, label: "Customer Experience", score: 2, confirmed: false },
  ]); var priorities = _pri[0]; var setPriorities = _pri[1];
  var priLabels = ["", "Not a Priority", "Low Priority", "Moderate", "High Priority", "Critical"];

  /* ── Success Definition ── */
  var _suc = useState([
    { id: 1, label: "Reduce network complexity and vendor sprawl", confirmed: true, notes: "" },
    { id: 2, label: "Improve security posture to meet board mandate", confirmed: true, notes: "FY27 zero trust requirement" },
    { id: 3, label: "Standardize branch infrastructure across all sites", confirmed: false, notes: "" },
    { id: 4, label: "Accelerate cloud migration with direct connectivity", confirmed: true, notes: "" },
    { id: 5, label: "Integrate acquisitions onto unified platform", confirmed: true, notes: "Pinnacle + NorthStar" },
    { id: 6, label: "Reduce site deployment time from 90 days to under 10", confirmed: false, notes: "" },
  ]); var success = _suc[0]; var setSuccess = _suc[1];

  /* ── Business Drivers ── */
  var _drv = useState([
    { id: 1, label: "Provider consolidation", category: "Efficiency", description: "Reduce from 6 WAN providers to 1-2 strategic partners", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "MPLS contract expiration", category: "Efficiency", description: "AT&T MPLS ($2.1M/yr) expires Dec 2026 — transition required", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Cloud migration acceleration", category: "Growth", description: "AWS/Azure workload growth requires direct cloud connectivity", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "M&A network integration", category: "Scale", description: "Pinnacle (38 sites) and NorthStar (12 sites) need integration", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 5, label: "Security modernization", category: "Risk", description: "38 EOL firewalls, no microsegmentation, fragmented tooling", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 6, label: "Branch simplification", category: "Efficiency", description: "Standardize CPE, enable local breakout, reduce truck rolls", scope: "Focus Now", followUp: "No Follow-Up", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 7, label: "Operational visibility", category: "Risk", description: "Fragmented monitoring — SolarWinds + PRTG + spreadsheets", scope: "Park", followUp: "Needs GTT Follow-Up", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 8, label: "AI / automation readiness", category: "Growth", description: "GCP Vertex AI workloads growing 3x — need reliable connectivity", scope: "Park", followUp: "Future Phase", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 9, label: "Geographic expansion", category: "Scale", description: "Potential new markets requiring rapid site deployment", scope: "Out of Scope", followUp: "Future Phase", confirmed: false, owner: "", ownerRole: "", notes: "" },
  ]); var drivers = _drv[0]; var setDrivers = _drv[1];

  /* ── Functional Priorities ── */
  var _func = useState([
    { id: 1, group: "Business", label: "Reduce operating cost and improve margin", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 2, group: "Business", label: "Support acquisitions with rapid integration", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 3, group: "Finance", label: "Predictable, consolidated network spend", confirmed: false, scope: "Focus Now", followUp: "Customer Validation Needed", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 4, group: "Finance", label: "Avoid stranded contract costs during transition", confirmed: false, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 5, group: "Technology", label: "Cloud-first architecture with direct breakout", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 6, group: "Technology", label: "SD-WAN with unified orchestration", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 7, group: "Operations", label: "Single-pane visibility across all sites", confirmed: false, scope: "Park", followUp: "Needs GTT Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 8, group: "Operations", label: "Reduce MTTR and truck rolls", confirmed: false, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 9, group: "Security", label: "Zero trust posture by FY27", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 10, group: "Security", label: "Consolidate security tooling from 11 to 5 vendors", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 11, group: "Cloud", label: "Multi-cloud connectivity without DC hairpin", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 12, group: "Cloud", label: "Enable AI/ML workload growth on GCP", confirmed: false, scope: "Park", followUp: "Future Phase", description: "", owner: "", ownerRole: "", notes: "" },
  ]); var funcPri = _func[0]; var setFuncPri = _func[1];

  /* ── Transformation Triggers ── */
  var _trig = useState([
    { id: 1, label: "MPLS contract renewal deadline", description: "AT&T contract expires Dec 2026 — requires transition plan", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "M&A integration mandate", description: "Pinnacle and NorthStar must be on unified platform", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Board security directive", description: "Zero trust and measurable improvement within 12 months", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "Cloud workload growth", description: "Azure +30% YoY, AWS primary, GCP AI/ML expanding", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 5, label: "End-of-life equipment", description: "38 Cisco ASA firewalls past EOS, 23% CPE aging", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 6, label: "Application modernization", description: "Core banking and claims migration driving connectivity needs", scope: "Park", followUp: "Customer Validation Needed", confirmed: false, owner: "", ownerRole: "", notes: "" },
  ]); var triggers = _trig[0]; var setTriggers = _trig[1];

  /* ── Constraints ── */
  var _con = useState([
    { id: 1, label: "MPLS transition timeline", description: "Must complete before Dec 2026 contract end", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "Pinnacle separate security stack", description: "Cisco ASA environment requires dedicated migration plan", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Internal staffing limits", description: "Small network team — may need managed services model", scope: "Focus Now", followUp: "Customer Validation Needed", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "Budget cycle alignment", description: "Capital vs. operating expense preferences to confirm", scope: "Park", followUp: "Owner Not Present", confirmed: false, owner: "", ownerRole: "CFO", notes: "" },
    { id: 5, label: "Compliance requirements", description: "Financial services regulatory and audit considerations", scope: "Focus Now", followUp: "No Follow-Up", confirmed: false, owner: "", ownerRole: "", notes: "" },
  ]); var constraints = _con[0]; var setConstraints = _con[1];

  /* ── Decision Criteria ── */
  var _dec = useState([
    { id: 1, label: "Simplicity", description: "Prefer converged, fewer-vendor solutions", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "Speed of deployment", description: "Aggressive timeline driven by MPLS expiration", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Cost predictability", description: "Preference for opex model with clear per-site economics", confirmed: false, scope: "Focus Now", followUp: "Customer Validation Needed", owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "Security posture", description: "Board-level mandate — non-negotiable", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 5, label: "Resilience & uptime", description: "Financial services SLA expectations", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 6, label: "Vendor consolidation", description: "Reduce from 6 providers + 11 security vendors", confirmed: false, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
  ]); var criteria = _dec[0]; var setCriteria = _dec[1];

  /* ── Session notes ── */
  var _notes = useState(""); var sessionNotes = _notes[0]; var setSessionNotes = _notes[1];

  /* ── Derived rollups ── */
  var allTopics = [].concat(drivers, funcPri, triggers, constraints, criteria);
  var focusNow = allTopics.filter(function (t) { return t.scope === "Focus Now"; });
  var parked = allTopics.filter(function (t) { return t.scope === "Park"; });
  var outOfScope = allTopics.filter(function (t) { return t.scope === "Out of Scope"; });
  var needsFollowUp = allTopics.filter(function (t) { return t.followUp !== "No Follow-Up"; });
  var ownerMissing = allTopics.filter(function (t) { return t.followUp === "Owner Not Present"; });
  var gttFollowUp = allTopics.filter(function (t) { return t.followUp === "Needs GTT Follow-Up"; });
  var scheduleSession = allTopics.filter(function (t) { return t.followUp === "Schedule Session"; });
  var execAlign = allTopics.filter(function (t) { return t.followUp === "Executive Alignment Needed"; });

  /* ── Focus area recommendations ── */
  var focusAreas = [
    { id: "footprint", label: "GTT Footprint Studio", reason: "Review current GTT presence and expansion opportunities", active: drivers.some(function (d) { return d.label.indexOf("consolidation") >= 0 && d.scope === "Focus Now"; }) },
    { id: "current", label: "Infrastructure Studio", reason: "Map current estate, providers, and constraints", active: true },
    { id: "network", label: "Network Studio", reason: "SD-WAN readiness, MPLS transition, branch standards", active: drivers.some(function (d) { return (d.label.indexOf("MPLS") >= 0 || d.label.indexOf("Branch") >= 0) && d.scope === "Focus Now"; }) },
    { id: "security", label: "Security Studio", reason: "SASE evaluation, zero trust roadmap, vendor consolidation", active: funcPri.some(function (f) { return f.group === "Security" && f.scope === "Focus Now"; }) },
    { id: "cloud", label: "Cloud Studio", reason: "Multi-cloud connectivity, migration tracking", active: drivers.some(function (d) { return d.label.indexOf("Cloud") >= 0 && d.scope === "Focus Now"; }) },
    { id: "value", label: "Value Studio", reason: "TCO/ROI analysis and business case", active: focusNow.length >= 4 },
    { id: "future", label: "Architecture Studio", reason: "Target-state design and convergence vision", active: false },
    { id: "roadmap", label: "Roadmap Studio", reason: "Phased transformation plan", active: false },
  ];

  /* ── group helpers ── */
  var driverCategories = ["Growth", "Efficiency", "Risk", "Scale"];
  var catColor = function (c) { return c === "Growth" ? T.green : c === "Efficiency" ? T.amber : c === "Risk" ? T.red : T.violet; };
  var funcGroups = ["Business", "Finance", "Technology", "Operations", "Security", "Cloud"];
  var funcColor = function (g) { return g === "Business" ? T.green : g === "Finance" ? T.amber : g === "Technology" ? T.blue : g === "Operations" ? T.cyan : g === "Security" ? T.red : T.violet; };

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function (x) { return x.id === "executive"; })} />

    {/* ═══ ROW 1: Business Context + Strategic Priorities + Success ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      {/* Business Context */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>BUSINESS CONTEXT</span>
        <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Operating environment & transformation thesis</div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Industry</label>
          <select value={ctx.industry} onChange={function (e) { updCtx("industry", e.target.value); }} style={Object.assign({}, iS, { fontSize: 11, cursor: "pointer" })}>
            {["Financial Services — Insurance & Wealth Management", "Financial Services — Banking", "Financial Services — Capital Markets", "Healthcare — Provider", "Healthcare — Payer", "Healthcare — Life Sciences", "Manufacturing — Discrete", "Manufacturing — Process", "Manufacturing — Industrial", "Retail — Brick & Mortar", "Retail — E-Commerce", "Retail — Omnichannel", "Technology — Software", "Technology — Hardware", "Technology — Services", "Telecommunications", "Energy — Oil & Gas", "Energy — Utilities", "Energy — Renewables", "Transportation & Logistics", "Hospitality & Travel", "Media & Entertainment", "Education — Higher Ed", "Education — K-12", "Legal & Professional Services", "Real Estate & Construction", "Pharmaceuticals & Biotech", "Automotive", "Aerospace & Defense", "Federal Government", "State Government", "Local Government", "Non-Profit & NGO", "Other"].map(function (ind) { return <option key={ind} value={ind}>{ind}</option>; })}
          </select>
        </div>
        {[
          { key: "footprint", label: "Operating Footprint" },
          { key: "posture", label: "Strategic Posture" },
        ].map(function (f) {
          return (<div key={f.key} style={{ marginBottom: 8 }}>
            <label style={lbl}>{f.label}</label>
            <input value={ctx[f.key]} onChange={function (e) { updCtx(f.key, e.target.value); }} style={Object.assign({}, iS, { fontSize: 11 })} />
          </div>);
        })}
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Business Summary</label>
          <textarea value={ctx.summary} onChange={function (e) { updCtx("summary", e.target.value); }} rows={3} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.5 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Why Now</label>
          <textarea value={ctx.whyNow} onChange={function (e) { updCtx("whyNow", e.target.value); }} rows={2} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.5 }} />
        </div>
      </div>

      {/* Strategic Priorities + Success Definition stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Strategic Priorities */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>STRATEGIC PRIORITIES</span>
              <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6 }}>Business priority assessment</div>
            </div>
            <span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: (priorities.reduce(function (a, p) { return a + p.score; }, 0) / priorities.length) >= 3.5 ? T.green : (priorities.reduce(function (a, p) { return a + p.score; }, 0) / priorities.length) >= 2.5 ? T.amber : T.red }}>{(priorities.reduce(function (a, p) { return a + p.score; }, 0) / priorities.length).toFixed(1)}</span>
          </div>
          {priorities.map(function (p, i) {
            return (<div key={p.id} style={{ borderBottom: i < priorities.length - 1 ? "1px solid " + T.border : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: T.f, fontSize: 13, color: T.tp }}>{p.label}</span>
                  <span style={{ fontFamily: T.m, fontSize: 8, color: p.confirmed ? T.green : T.td, background: (p.confirmed ? T.green : T.td) + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", cursor: "pointer" }} onClick={function () { setPriorities(updArr(priorities, p.id, "confirmed", !p.confirmed)); }}>{p.confirmed ? "Confirmed" : "Suggested"}</span>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map(function (n) {
                    return <button key={n} onClick={function () { setPriorities(updArr(priorities, p.id, "score", n)); }} style={{ width: 26, height: 26, borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: T.f, cursor: "pointer", border: "1.5px solid " + (n <= p.score ? T.blue : T.border), background: n <= p.score ? T.blue + (n === p.score ? "20" : "10") : "transparent", color: n <= p.score ? T.blue : T.td }}>{n}</button>;
                  })}
                </div>
                <span style={{ fontFamily: T.m, fontSize: 9, color: T.td, width: 75, textAlign: "right" }}>{priLabels[p.score]}</span>
              </div>
            </div>);
          })}
        </div>

        {/* Success Definition */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>SUCCESS DEFINITION</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 10 }}>What does "good" look like?</div>
          {success.map(function (s, i) {
            return (<div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: i < success.length - 1 ? "1px solid " + T.border : "none" }}>
              <div onClick={function () { setSuccess(updArr(success, s.id, "confirmed", !s.confirmed)); }} style={{ width: 16, height: 16, borderRadius: 3, border: "2px solid " + (s.confirmed ? T.green : T.border), background: s.confirmed ? T.green + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}>
                {s.confirmed && <span style={{ color: T.green, fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp }}>{s.label}</span>
                {s.notes && <span style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginLeft: 6 }}>— {s.notes}</span>}
              </div>
            </div>);
          })}
        </div>
      </div>
    </div>

    {/* ═══ ROW 2: Business Drivers ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
        <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>BUSINESS DRIVERS & OBJECTIVES</span>
        <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>Confirm priorities, set scope, assign follow-up</div>
      </div>
      <div style={{ padding: "8px 18px" }}>
        {driverCategories.map(function (cat) {
          var items = drivers.filter(function (d) { return d.category === cat; });
          if (!items.length) return null;
          var cc = catColor(cat);
          return (<div key={cat} style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: T.m, fontSize: 9, color: cc, letterSpacing: 1, textTransform: "uppercase", padding: "8px 0 2px", borderBottom: "1px solid " + cc + "22" }}>{cat} Drivers</div>
            {items.map(function (d) {
              return <TopicRow key={d.id} t={d} onUpdate={function (f, v) { setDrivers(updArr(drivers, d.id, f, v)); }} />;
            })}
          </div>);
        })}
      </div>
    </div>

    {/* ═══ ROW 3: Functional Priorities ═══ */}
    <Disc tag="FUNCTIONAL PRIORITIES" tagColor={T.blue} title="Priorities by business function" summary={funcPri.filter(function (f) { return f.scope === "Focus Now"; }).length + " in focus · " + funcPri.filter(function (f) { return f.confirmed; }).length + " confirmed"} defaultOpen={true}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {funcGroups.map(function (grp) {
          var items = funcPri.filter(function (f) { return f.group === grp; });
          if (!items.length) return null;
          var gc = funcColor(grp);
          return (<div key={grp}>
            <div style={{ fontFamily: T.m, fontSize: 9, color: gc, letterSpacing: 1, textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid " + gc + "22", marginBottom: 4 }}>{grp}</div>
            {items.map(function (f) {
              return <TopicRow key={f.id} t={f} onUpdate={function (field, v) { setFuncPri(updArr(funcPri, f.id, field, v)); }} />;
            })}
          </div>);
        })}
      </div>
    </Disc>

    {/* ═══ ROW 4: Triggers + Constraints side by side ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Transformation Triggers */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.amber, background: T.amber + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>TRANSFORMATION TRIGGERS</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>What is creating urgency?</div>
        </div>
        <div style={{ padding: "4px 18px" }}>
          {triggers.map(function (t) {
            return <TopicRow key={t.id} t={t} onUpdate={function (f, v) { setTriggers(updArr(triggers, t.id, f, v)); }} />;
          })}
        </div>
      </div>

      {/* Constraints & Decision Criteria stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.red, background: T.red + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>CONSTRAINTS</span>
            <div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp, marginTop: 5 }}>Boundaries & considerations</div>
          </div>
          <div style={{ padding: "4px 18px" }}>
            {constraints.map(function (c) {
              return <TopicRow key={c.id} t={c} onUpdate={function (f, v) { setConstraints(updArr(constraints, c.id, f, v)); }} />;
            })}
          </div>
        </div>
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.violet, background: T.violet + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>DECISION CRITERIA</span>
            <div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp, marginTop: 5 }}>How decisions will be made</div>
          </div>
          <div style={{ padding: "4px 18px" }}>
            {criteria.map(function (c) {
              return <TopicRow key={c.id} t={c} onUpdate={function (f, v) { setCriteria(updArr(criteria, c.id, f, v)); }} />;
            })}
          </div>
        </div>
      </div>
    </div>

    {/* ═══ ROW 5: Recommended Focus Areas ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: T.cyan + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>RECOMMENDED FOCUS AREAS</span>
      <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Based on confirmed priorities — click to navigate</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {focusAreas.filter(function (f) { return f.active; }).map(function (f) {
          return (<div key={f.id} onClick={function () { onNav(f.id); }} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid " + T.cyan + "22", background: T.cyan + "04", cursor: "pointer" }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{f.label}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 3, lineHeight: 1.4 }}>{f.reason}</div>
            <div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, marginTop: 6, textTransform: "uppercase" }}>Open →</div>
          </div>);
        })}
      </div>
      {focusAreas.some(function (f) { return !f.active; }) && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>Later:</span>
          {focusAreas.filter(function (f) { return !f.active; }).map(function (f) {
            return <span key={f.id} onClick={function () { onNav(f.id); }} style={{ fontFamily: T.f, fontSize: 10, color: T.td, cursor: "pointer", padding: "2px 8px", borderRadius: 4, border: "1px solid " + T.border }}>{f.label}</span>;
          })}
        </div>
      )}
    </div>

    {/* ═══ ROW 6: Session Scope & Follow-Up Summary ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>SESSION SCOPE & FOLLOW-UP SUMMARY</span>
      <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Live session rollup</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
        {[
          { label: "Focus Now", value: focusNow.length, color: T.green },
          { label: "Parked", value: parked.length, color: T.amber },
          { label: "Out of Scope", value: outOfScope.length, color: T.td },
          { label: "Needs Follow-Up", value: needsFollowUp.length, color: T.cyan },
        ].map(function (s) {
          return (<div key={s.label} style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid " + s.color + "22", background: s.color + "06" }}>
            <div style={{ fontFamily: T.f, fontSize: 20, fontWeight: 700, color: T.tp }}>{s.value}</div>
            <div style={{ fontFamily: T.m, fontSize: 9, color: s.color, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>);
        })}
      </div>

      {/* Follow-up detail rows */}
      {[
        { label: "Owner Not Present", items: ownerMissing, color: T.amber },
        { label: "GTT Follow-Up Required", items: gttFollowUp, color: T.cyan },
        { label: "Schedule Dedicated Session", items: scheduleSession, color: T.violet },
        { label: "Executive Alignment Needed", items: execAlign, color: T.red },
      ].filter(function (g) { return g.items.length > 0; }).map(function (g) {
        return (<div key={g.label} style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: g.color, letterSpacing: 1, textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid " + g.color + "18", marginBottom: 4 }}>{g.label} ({g.items.length})</div>
          {g.items.map(function (item, i) {
            return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp }}>{item.label}</span>
              {item.ownerRole && <span style={{ fontFamily: T.m, fontSize: 9, color: T.td }}>({item.ownerRole})</span>}
            </div>);
          })}
        </div>);
      })}

      {parked.length > 0 && (<div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1, textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid " + T.amber + "18", marginBottom: 4 }}>Parked Topics ({parked.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {parked.map(function (p, i) {
            return <span key={i} style={{ fontFamily: T.f, fontSize: 10, color: T.amber, background: T.amber + "10", padding: "3px 8px", borderRadius: 4 }}>{p.label}</span>;
          })}
        </div>
      </div>)}
    </div>

    {/* ═══ Session Notes ═══ */}
    <Disc tag="SESSION NOTES" tagColor={T.slate} title="Working notes & assumptions" summary={sessionNotes ? "Notes captured" : "No notes yet"}>
      <textarea value={sessionNotes} onChange={function (e) { setSessionNotes(e.target.value); }} rows={5} placeholder="Capture working assumptions, priorities to validate, additional context..." style={{ fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "10px 12px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.6 }} />
    </Disc>
  </div>);
}

/* ═══════ STAKEHOLDER STUDIO ═══════ */
function StakeholderView({ custAttendees, setCustAttendees, gttAttendees, setGttAttendees }) {
  const _notes = useState("Workshop scheduled for 2-day on-site engagement at Meridian Financial Group HQ, Dallas TX.\n\nDay 1: Executive alignment, current-state discovery, network & security deep-dives.\nDay 2: Cloud transformation, maturity assessment, roadmap & deliverables.\n\nKey stakeholder: Sarah Chen (CTO) — executive sponsor, available Day 1 AM only.\nJames Kim (Cloud Architect) joining remote for Day 2 cloud session."); const wkNotes = _notes[0]; const setWkNotes = _notes[1];

  /* Add attendee forms */
  const _cf = useState({ name: "", role: "Network Engineer", email: "", focus: "" }); const custForm = _cf[0]; const setCustForm = _cf[1];
  const _gf = useState({ name: "", role: "Solutions Architect", email: "", focus: "" }); const gttForm = _gf[0]; const setGttForm = _gf[1];
  const _sc = useState(false); const showCust = _sc[0]; const setShowCust = _sc[1];
  const _sg = useState(false); const showGtt = _sg[0]; const setShowGtt = _sg[1];

  const _gaps = useState([
    { id: 1, stakeholder: "CISO", title: "Chief Information Security Officer", severity: "critical", notes: "Security transformation requires executive security sponsor" },
    { id: 2, stakeholder: "CFO / Finance", title: "Chief Financial Officer", severity: "high", notes: "Business case approval needs finance stakeholder" },
    { id: 3, stakeholder: "Legal / Compliance", title: "General Counsel", severity: "high", notes: "Contract renegotiation requires legal review" },
    { id: 4, stakeholder: "Cloud Owner", title: "VP of Cloud & Platform", severity: "medium", notes: "James Kim remote-only, 3-week engagement gap" },
    { id: 5, stakeholder: "NOC / Operations", title: "NOC Manager", severity: "medium", notes: "Day-2 operations handoff undefined" },
  ]); const coverageGaps = _gaps[0]; const setCoverageGaps = _gaps[1];
  const _showAddGap = useState(false); const showAddGap = _showAddGap[0]; const setShowAddGap = _showAddGap[1];
  const gapStakeholders = ["CISO", "CFO / Finance", "CIO", "CTO", "COO", "Legal / Compliance", "Cloud Owner", "Network Owner", "Security Lead", "NOC / Operations", "Procurement", "IT Finance / FinOps", "Executive Sponsor", "Program Manager", "Other"];
  const gapTitles = ["Chief Information Security Officer", "Chief Financial Officer", "Chief Information Officer", "Chief Technology Officer", "VP of Infrastructure", "VP of Network Engineering", "VP of IT Operations", "VP of Cloud & Platform", "VP of Security", "Director of Network Services", "Director of IT Security", "Director of Cloud Operations", "General Counsel", "NOC Manager", "IT Procurement Lead", "Program Manager", "Other"];
  const gapSeverities = ["critical", "high", "medium", "low"];
  function updateGap(id, field, value) { setCoverageGaps(coverageGaps.map(function(g) { return g.id === id ? Object.assign({}, g, (function(){ var o = {}; o[field] = value; return o; })()) : g; })); }
  function removeGap(id) { setCoverageGaps(coverageGaps.filter(function(g) { return g.id !== id; })); }
  function addGap() { setCoverageGaps(coverageGaps.concat([{ id: Date.now(), stakeholder: "Other", title: "Other", severity: "medium", notes: "" }])); setShowAddGap(false); }

  function addCust() {
    if (!custForm.name) return;
    setCustAttendees(custAttendees.concat([Object.assign({}, custForm, { id: Date.now(), present: true })]));
    setCustForm({ name: "", role: "Network Engineer", email: "", focus: "" });
    setShowCust(false);
  }
  function addGtt() {
    if (!gttForm.name) return;
    setGttAttendees(gttAttendees.concat([Object.assign({}, gttForm, { id: Date.now(), present: true })]));
    setGttForm({ name: "", role: "Solutions Architect", email: "", focus: "" });
    setShowGtt(false);
  }

  function AttendeeRow({ a, roles, onUpdate, onRemove }) {
    var attending = a.present || a.virtual;
    return (<div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid " + T.border }}>
      <div onClick={function () { onUpdate("present", !a.present); }} style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (a.present ? T.green : T.border), background: a.present ? T.green + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, cursor: "pointer" }}>
        {a.present && <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <input value={a.name} onChange={function (e) { onUpdate("name", e.target.value); }} style={Object.assign({}, smI, { fontWeight: 600, width: 150, fontSize: 13, color: T.tp })} placeholder="Name" />
          <select value={a.role} onChange={function (e) { onUpdate("role", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, maxWidth: 200 })}>
            {roles.map(function (r) { return <option key={r} value={r}>{r}</option>; })}
          </select>
          <div onClick={function () { onUpdate("virtual", !a.virtual); }} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, border: "1.5px solid " + (a.virtual ? T.cyan : T.border), background: a.virtual ? T.cyan + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {a.virtual && <span style={{ color: T.cyan, fontSize: 9, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: a.virtual ? T.cyan : T.td, textTransform: "uppercase" }}>Virtual</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={a.email || ""} onChange={function (e) { onUpdate("email", e.target.value); }} style={Object.assign({}, smI, { width: 180, fontSize: 10, color: T.td })} placeholder="email@company.com" />
          <input value={a.focus || ""} onChange={function (e) { onUpdate("focus", e.target.value); }} style={Object.assign({}, smI, { flex: 1, fontSize: 10, color: T.ts })} placeholder="Focus area / responsibility..." />
        </div>
      </div>
      <button onClick={onRemove} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, marginTop: 2, flexShrink: 0 }}>✕</button>
    </div>);
  }

  const custPresent = custAttendees.filter(function (a) { return a.present; }).length;
  const gttPresent = gttAttendees.filter(function (a) { return a.present; }).length;
  const totalStakeholders = custAttendees.length;
  const executiveCount = custAttendees.filter(function(a){ return a.role.indexOf("CTO")>=0||a.role.indexOf("CIO")>=0||a.role.indexOf("CISO")>=0||a.role.indexOf("VP")>=0; }).length;
  const technicalCount = custAttendees.filter(function(a){ return a.role.indexOf("Architect")>=0||a.role.indexOf("Engineer")>=0||a.role.indexOf("Manager")>=0; }).length;

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function(x){return x.id==="stakeholder";})} />

    {/* Summary Cards Row */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Total Stakeholders", value: totalStakeholders, sub: custPresent + " present", color: T.cyan },
        { label: "Executive", value: executiveCount, sub: "CxO / VP level", color: T.green },
        { label: "Technical", value: technicalCount, sub: "Architects & Engineers", color: T.blue },
        { label: "Gaps", value: coverageGaps.length, sub: coverageGaps.filter(function(g){return g.severity==="critical";}).length + " critical", color: T.red },
      ].map(function(c) {
        return (<div key={c.label} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "14px 16px" }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: c.color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontFamily: T.f, fontSize: 24, fontWeight: 700, color: T.tp }}>{c.value}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{c.sub}</div>
        </div>);
      })}
    </div>

    {/* Session Notes */}
    <Nts tag="SESSION NOTES" tc={T.cyan} title="Workshop Logistics & Notes" sub="Agenda, schedule, logistics, key stakeholder availability" value={wkNotes} onChange={setWkNotes} rows={5} />

    {/* Two-column layout — attendee lists */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      {/* CUSTOMER ATTENDEES */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>CUSTOMER</span>
            <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>Meridian Financial Group</div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{custPresent} in-person · {custAttendees.filter(function(a){return a.virtual;}).length} virtual</div>
          </div>
          <button onClick={function () { setShowCust(!showCust); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>{showCust ? "Cancel" : "+ Add"}</button>
        </div>
        <div style={{ padding: "10px 18px" }}>
          {showCust && (<div style={{ padding: "12px 14px", background: T.blue + "04", borderRadius: 8, marginBottom: 12, border: "1px solid " + T.blue + "12" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Name</label><input value={custForm.name} onChange={function (e) { setCustForm(Object.assign({}, custForm, { name: e.target.value })); }} placeholder="Full name" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Role / Title</label><select value={custForm.role} onChange={function (e) { setCustForm(Object.assign({}, custForm, { role: e.target.value })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{CUST_ROLES.map(function (r) { return <option key={r} value={r}>{r}</option>; })}</select></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Email</label><input value={custForm.email} onChange={function (e) { setCustForm(Object.assign({}, custForm, { email: e.target.value })); }} placeholder="email@company.com" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Focus Area</label><input value={custForm.focus} onChange={function (e) { setCustForm(Object.assign({}, custForm, { focus: e.target.value })); }} placeholder="e.g. WAN strategy lead" style={iS} /></div>
            </div>
            <button onClick={addCust} disabled={!custForm.name} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: custForm.name ? T.blue : T.td, border: "none", borderRadius: 5, padding: "6px 16px", cursor: custForm.name ? "pointer" : "not-allowed" }}>Add Attendee</button>
          </div>)}
          {custAttendees.map(function (a) {
            return <AttendeeRow key={a.id} a={a} roles={CUST_ROLES} onUpdate={function (field, value) { setCustAttendees(custAttendees.map(function (x) { return x.id === a.id ? Object.assign({}, x, (function () { var o = {}; o[field] = value; return o; })()) : x; })); }} onRemove={function () { setCustAttendees(custAttendees.filter(function (x) { return x.id !== a.id; })); }} />;
          })}
        </div>
      </div>

      {/* GTT ATTENDEES */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: T.cyan + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>GTT</span>
            <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>GTT Workshop Team</div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{gttPresent} in-person · {gttAttendees.filter(function(a){return a.virtual;}).length} virtual</div>
          </div>
          <button onClick={function () { setShowGtt(!showGtt); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.cyan, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>{showGtt ? "Cancel" : "+ Add"}</button>
        </div>
        <div style={{ padding: "10px 18px" }}>
          {showGtt && (<div style={{ padding: "12px 14px", background: T.cyan + "04", borderRadius: 8, marginBottom: 12, border: "1px solid " + T.cyan + "12" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Name</label><input value={gttForm.name} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { name: e.target.value })); }} placeholder="Full name" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Role / Title</label><select value={gttForm.role} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { role: e.target.value })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{GTT_ROLES.map(function (r) { return <option key={r} value={r}>{r}</option>; })}</select></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Email</label><input value={gttForm.email} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { email: e.target.value })); }} placeholder="email@gtt.net" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Focus Area</label><input value={gttForm.focus} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { focus: e.target.value })); }} placeholder="e.g. SD-WAN design" style={iS} /></div>
            </div>
            <button onClick={addGtt} disabled={!gttForm.name} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: gttForm.name ? T.cyan : T.td, border: "none", borderRadius: 5, padding: "6px 16px", cursor: gttForm.name ? "pointer" : "not-allowed" }}>Add Attendee</button>
          </div>)}
          {gttAttendees.map(function (a) {
            return <AttendeeRow key={a.id} a={a} roles={GTT_ROLES} onUpdate={function (field, value) { setGttAttendees(gttAttendees.map(function (x) { return x.id === a.id ? Object.assign({}, x, (function () { var o = {}; o[field] = value; return o; })()) : x; })); }} onRemove={function () { setGttAttendees(gttAttendees.filter(function (x) { return x.id !== a.id; })); }} />;
          })}
        </div>
      </div>
    </div>

    {/* Coverage Gaps */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.red, background: T.red + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>COVERAGE GAPS</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>Missing stakeholders & access</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{coverageGaps.length} gaps · {coverageGaps.filter(function(g){return g.severity==="critical";}).length} critical</div>
        </div>
        <button onClick={addGap} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.red, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add Gap</button>
      </div>
      <div style={{ padding: "10px 18px" }}>
        {coverageGaps.map(function(g, i) {
          return (<div key={g.id} style={{ padding: "12px 0", borderBottom: i < coverageGaps.length - 1 ? "1px solid " + T.border : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <select value={g.stakeholder} onChange={function(e) { updateGap(g.id, "stakeholder", e.target.value); }} style={Object.assign({}, selS, { fontSize: 11, fontWeight: 600 })}>
                {gapStakeholders.map(function(s) { return <option key={s} value={s}>{s}</option>; })}
              </select>
              <select value={g.title} onChange={function(e) { updateGap(g.id, "title", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, color: T.ts })}>
                {gapTitles.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
              </select>
              <select value={g.severity} onChange={function(e) { updateGap(g.id, "severity", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>
                {gapSeverities.map(function(s) { return <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>; })}
              </select>
              <Sev s={g.severity} />
              <button onClick={function() { removeGap(g.id); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, marginLeft: "auto" }}>✕</button>
            </div>
            <input value={g.notes} onChange={function(e) { updateGap(g.id, "notes", e.target.value); }} placeholder="Notes..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
          </div>);
        })}
        {!coverageGaps.length && <div style={{ padding: 16, textAlign: "center", fontFamily: T.f, fontSize: 12, color: T.td, fontStyle: "italic" }}>No coverage gaps identified</div>}
      </div>
    </div>
  </div>);
}

/* ═══════ GTT FOOTPRINT STUDIO ═══════ */
function FootprintView() {
  /* Mock GTT footprint data */
  const services = [
    { name: "SD-WAN (Managed)", status: "Active", sites: 8, mrr: "$12K", category: "Network" },
    { name: "DIA", status: "Active", sites: 42, mrr: "$56K", category: "Network" },
    { name: "MPLS", status: "Active", sites: 87, mrr: "$175K", category: "Network" },
    { name: "Broadband", status: "Active", sites: 12, mrr: "$8K", category: "Network" },
    { name: "SIP / Voice", status: "Active", sites: 35, mrr: "$22K", category: "Voice" },
    { name: "Cloud Connect (AWS)", status: "Active", sites: 2, mrr: "$18K", category: "Cloud" },
    { name: "EnvisionDX", status: "Pilot", sites: 8, mrr: "$4K", category: "Managed" },
    { name: "LTE Backup", status: "Active", sites: 35, mrr: "$8K", category: "Network" },
  ];

  const regions = [
    { region: "Northeast US", sites: 34, services: 4, products: "MPLS, DIA, SIP, LTE", penetration: 72 },
    { region: "Southeast US", sites: 28, services: 3, products: "MPLS, DIA, SIP", penetration: 58 },
    { region: "Midwest US", sites: 22, services: 2, products: "MPLS, DIA", penetration: 42 },
    { region: "West US", sites: 19, services: 3, products: "MPLS, DIA, LTE", penetration: 55 },
    { region: "Canada", sites: 22, services: 2, products: "MPLS, DIA", penetration: 38 },
    { region: "Pinnacle (Acquired)", sites: 38, services: 1, products: "MPLS only", penetration: 15 },
    { region: "NorthStar (Acquired)", sites: 12, services: 0, products: "None — not on GTT", penetration: 0 },
    { region: "Data Centers", sites: 3, services: 5, products: "DIA, Cloud Connect, MPLS, SIP, EnvisionDX", penetration: 90 },
  ];

  const expansionSignals = [
    { signal: "NorthStar Wealth — 12 sites, zero GTT presence", type: "White Space", potential: "$24K MRR", priority: "Critical" },
    { signal: "Pinnacle Insurance — single-product (MPLS only)", type: "Cross-Sell", potential: "$42K MRR", priority: "High" },
    { signal: "SD-WAN expansion: 8 → 125 sites", type: "Upsell", potential: "$180K MRR", priority: "High" },
    { signal: "SASE / Security — no GTT security services", type: "White Space", potential: "$95K MRR", priority: "High" },
    { signal: "Cloud Connect — Azure ExpressRoute not sold", type: "Cross-Sell", potential: "$14K MRR", priority: "Medium" },
    { signal: "Managed Services — EnvisionDX pilot → full deploy", type: "Upsell", potential: "$35K MRR", priority: "Medium" },
    { signal: "Canada — LTE backup not deployed (22 sites)", type: "Cross-Sell", potential: "$5K MRR", priority: "Low" },
  ];

  const contracts = [
    { name: "MPLS Master", value: "$2.1M/yr", renewal: "Dec 2026", status: "At Risk", action: "Transition to SD-WAN" },
    { name: "DIA Bundle", value: "$680K/yr", renewal: "M2M", status: "Healthy", action: "Expand" },
    { name: "SIP / Voice", value: "$264K/yr", renewal: "Jun 2027", status: "Healthy", action: "Retain" },
    { name: "Cloud Connect", value: "$216K/yr", renewal: "2027", status: "Healthy", action: "Expand" },
    { name: "EnvisionDX Pilot", value: "$48K/yr", renewal: "Q1 2026", status: "Pilot", action: "Convert to production" },
  ];

  const totalMRR = "$303K";
  const totalARR = "$3.64M";
  const totalSites = 178;
  const gttEnabledSites = 141;
  const activeServices = services.filter(function(s){ return s.status === "Active"; }).length;
  const expansionMRR = expansionSignals.reduce(function(a, s) {
    var num = parseInt(s.potential.replace(/[^0-9]/g, ""));
    return a + num;
  }, 0);

  const penetrationColor = function(p) { return p >= 70 ? T.green : p >= 40 ? T.amber : T.red; };

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function(x){return x.id==="footprint";})} />

    {/* Footprint Summary Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Active Services", value: activeServices, sub: services.length + " total products", color: T.teal },
        { label: "GTT-Enabled Sites", value: gttEnabledSites + "/" + totalSites, sub: Math.round(gttEnabledSites/totalSites*100) + "% coverage", color: T.blue },
        { label: "Current MRR", value: totalMRR, sub: totalARR + " ARR", color: T.green },
        { label: "Expansion Potential", value: "$" + Math.round(expansionMRR) + "K MRR", sub: expansionSignals.length + " signals identified", color: T.violet },
      ].map(function(c) {
        return (<div key={c.label} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "14px 16px" }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: c.color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontFamily: T.f, fontSize: 24, fontWeight: 700, color: T.tp }}>{c.value}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{c.sub}</div>
        </div>);
      })}
    </div>

    {/* Service Mix + Attach Depth */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Services in Place */}
      <PrimaryCard tag="SERVICE MIX" tagColor={T.teal} title="Active GTT services">
        {services.map(function(s, i) {
          var statusColor = s.status === "Active" ? T.green : s.status === "Pilot" ? T.cyan : T.td;
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < services.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: statusColor, background: statusColor + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 42, textAlign: "center", flexShrink: 0 }}>{s.status}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.name}</div>
              <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{s.sites} sites · {s.category}</div>
            </div>
            <span style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp, flexShrink: 0 }}>{s.mrr}</span>
          </div>);
        })}
      </PrimaryCard>

      {/* Product Penetration */}
      <PrimaryCard tag="PRODUCT PENETRATION" tagColor={T.blue} title="Attach depth by category">
        {[
          { label: "Connectivity (MPLS/DIA/BB)", pct: 82, color: T.blue },
          { label: "SD-WAN", pct: 6, color: T.cyan },
          { label: "Voice / SIP", pct: 28, color: T.green },
          { label: "Cloud Connect", pct: 4, color: T.violet },
          { label: "Security / SASE", pct: 0, color: T.red },
          { label: "Managed Services", pct: 6, color: T.teal },
          { label: "LTE / Wireless Backup", pct: 28, color: T.amber },
        ].map(function(p, i) {
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 6 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp, width: 160, flexShrink: 0 }}>{p.label}</span>
            <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: Math.max(p.pct, 1) + "%", height: "100%", background: p.color, borderRadius: 4, minWidth: p.pct > 0 ? 3 : 0 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: p.pct >= 30 ? T.green : p.pct >= 10 ? T.amber : T.red, width: 32, textAlign: "right" }}>{p.pct}%</span>
          </div>);
        })}
        <div style={{ marginTop: 10, padding: "10px 12px", background: T.red + "06", borderRadius: 6, border: "1px solid " + T.red + "12" }}>
          <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.red }}>White Space Alert</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, marginTop: 2 }}>Security / SASE has 0% penetration. SD-WAN at 6%. Significant expansion opportunity across both categories.</div>
        </div>
      </PrimaryCard>
    </div>

    {/* Regional Presence */}
    <Disc tag="REGIONAL PRESENCE" tagColor={T.blue} title="Sites by region" summary={regions.length + " regions · " + gttEnabledSites + " GTT-enabled sites"} defaultOpen={true}>
      {regions.map(function(r, i) {
        return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < regions.length - 1 ? "1px solid " + T.border : "none" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{r.region}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{r.sites} sites · {r.services} products · {r.products}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 80, height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
              <div style={{ width: r.penetration + "%", height: "100%", background: penetrationColor(r.penetration), borderRadius: 3 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: penetrationColor(r.penetration), width: 32, textAlign: "right" }}>{r.penetration}%</span>
          </div>
        </div>);
      })}
    </Disc>

    {/* Expansion Signals */}
    <Disc tag="EXPANSION SIGNALS" tagColor={T.violet} title="Growth opportunities" summary={"$" + Math.round(expansionMRR) + "K MRR potential · " + expansionSignals.length + " signals"}>
      {expansionSignals.map(function(s, i) {
        var pc = s.priority === "Critical" ? T.red : s.priority === "High" ? T.amber : s.priority === "Medium" ? T.blue : T.td;
        var tc = s.type === "White Space" ? T.red : s.type === "Cross-Sell" ? T.violet : T.teal;
        return (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < expansionSignals.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: pc, background: pc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0, marginTop: 2 }}>{s.priority}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, color: T.tp }}>{s.signal}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: T.m, fontSize: 9, color: tc, background: tc + "10", padding: "1px 6px", borderRadius: 3 }}>{s.type}</span>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "10", padding: "1px 6px", borderRadius: 3 }}>{s.potential}</span>
            </div>
          </div>
        </div>);
      })}
    </Disc>

    {/* Contract / Footprint Health */}
    <Disc tag="CONTRACT HEALTH" tagColor={T.amber} title="Renewal exposure & risk" summary={contracts.length + " contracts · " + contracts.filter(function(c){return c.status==="At Risk";}).length + " at risk"}>
      {contracts.map(function(c, i) {
        var sc = c.status === "Healthy" ? T.green : c.status === "At Risk" ? T.red : c.status === "Pilot" ? T.cyan : T.td;
        return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < contracts.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 50, textAlign: "center", flexShrink: 0 }}>{c.status}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{c.name}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>Renewal: {c.renewal} · {c.action}</div>
          </div>
          <span style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp, flexShrink: 0 }}>{c.value}</span>
        </div>);
      })}
    </Disc>

    {/* Footprint Quality Summary */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <div style={{ fontFamily: T.m, fontSize: 9, color: T.teal, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>FOOTPRINT QUALITY</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Service Diversity", value: "Low", detail: "82% revenue from connectivity", color: T.red },
          { label: "Multi-Product Sites", value: "23%", detail: "Most sites single-product", color: T.amber },
          { label: "Renewal Concentration", value: "High Risk", detail: "58% ARR renews Dec 2026", color: T.red },
        ].map(function(q) {
          return (<div key={q.label} style={{ padding: "10px 12px", background: q.color + "06", borderRadius: 6, border: "1px solid " + q.color + "12" }}>
            <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: q.color }}>{q.value}</div>
            <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, color: T.tp, marginTop: 2 }}>{q.label}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 2 }}>{q.detail}</div>
          </div>);
        })}
      </div>
    </div>
  </div>);
}

/* ═══════ INFRASTRUCTURE STUDIO ═══════ */
function CurrentView({ sites, setSites, providers, setProviders }) {
  const total = sites.reduce(function (a, s) { return a + s.count; }, 0);
  const _notes = useState("Meridian Financial Group — 125 branches, 14 US states + 3 CA provinces. 2 DCs + DR. Hub-and-spoke MPLS. M&A: Pinnacle (38 sites, Cisco ASA) and NorthStar (12, not on WAN). $4.2M annual spend. 23% CPE past EOS."); const notes = _notes[0]; const setNotes = _notes[1];
  function updateSite(id, field, value) { setSites(sites.map(function (s) { return s.id === id ? Object.assign({}, s, (function () { var o = {}; o[field] = value; return o; })()) : s; })); }

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={SECS.find(function(x){return x.id==="current";})} />
    <Nts tag="ESTATE OVERVIEW" tc={T.blue} title="Infrastructure Notes" sub="Capture overall estate context and observations" value={notes} onChange={setNotes} rows={6} />
    <PrimaryCard tag="SITE INVENTORY" tagColor={T.blue} title={total + " sites · " + sites.length + " locations"} right={<button onClick={function () { setSites(sites.concat([{ id: Date.now(), region: "New Region", type: "Branch", count: 0, states: "", circuit: "MPLS", bandwidth: "100 Mbps", provider: "", notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add</button>}>
      {sites.map(function (s, i) { return (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < sites.length - 1 ? "1px solid " + T.border : "none", flexWrap: "wrap" }}>
        <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp, width: 120, flexShrink: 0 }}>{s.region}</span>
        <select value={s.type} onChange={function (e) { updateSite(s.id, "type", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Branch", "Retail", "Acquired", "HQ / Campus", "Data Center", "DR Site", "Remote"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
        <input type="number" value={s.count} onChange={function (e) { updateSite(s.id, "count", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 11 })} />
        <select value={s.circuit} onChange={function (e) { updateSite(s.id, "circuit", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["MPLS", "DIA", "Broadband", "LTE/5G", "MPLS+DIA", "BB+LTE", "Metro Eth", "Fiber P2P", "None"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
        <select value={s.bandwidth} onChange={function (e) { updateSite(s.id, "bandwidth", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["10 Mbps", "25 Mbps", "50 Mbps", "100 Mbps", "200 Mbps", "500 Mbps", "1 Gbps", "5 Gbps", "10 Gbps"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
        <input value={s.provider} onChange={function (e) { updateSite(s.id, "provider", e.target.value); }} style={Object.assign({}, smI, { width: 80, fontSize: 10 })} placeholder="Provider" />
        <button onClick={function () { setSites(sites.filter(function (x) { return x.id !== s.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, marginLeft: "auto" }}>✕</button>
      </div>); })}
    </PrimaryCard>
    <Disc tag="PROVIDERS" tagColor={T.amber} title="WAN contracts" summary={providers.length + " providers — $4.2M/yr"}>
      {providers.map(function (p, i) { return (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < providers.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 80 }}>{p.name}</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.ts, width: 100 }}>{p.type}</span><span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, width: 65 }}>{p.cost}</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.td, width: 65 }}>{p.expiry}</span><select value={p.action} onChange={function (e) { setProviders(providers.map(function (x, j) { return j === i ? Object.assign({}, x, { action: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Retain", "Retain & Expand", "Non-Renew", "Early Terminate", "Renegotiate", "Evaluate"].map(function (o) { return <option key={o}>{o}</option>; })}</select></div>); })}
    </Disc>
    <Disc tag="CONSTRAINTS" tagColor={T.red} title="Architecture issues" summary="5 constraints identified">
      {["Hub-spoke forces DC hairpin — +38ms latency", "No direct cloud breakout from branches", "Pinnacle on separate Cisco ASA stack", "23% of CPE past end-of-support", "Monitoring fragmented: SolarWinds + PRTG + spreadsheets"].map(function (it, i) { return <div key={i} style={{ padding: "6px 0", fontFamily: T.f, fontSize: 12, color: T.ts, borderBottom: i < 4 ? "1px solid " + T.border : "none" }}>{it}</div>; })}
    </Disc>
  </div>);
}

/* ═══════ NETWORK STUDIO ═══════ */
const NET_COLS = [{ key: "device", label: "Device" }, { key: "model", label: "Model" }, { key: "qty", label: "Qty" }, { key: "location", label: "Loc" }, { key: "circuit", label: "Circuit" }, { key: "status", label: "Status" }];

function NetView({ sites, providers, netEls, setNetEls, netFindings, setNetFindings }) {
  const _n = useState("SD-WAN pilot: 8 NE sites, 34% cost cut.\nAT&T MPLS Dec 2026. Pinnacle Cisco→Fortinet.\nLTE failover 45%. SE packet loss.\n\nDecisions: MPLS? LTE vs 5G? Managed vs self-op?"); const notes = _n[0]; const setNotes = _n[1];
  const _sd = useState([{ label: "Transport diversity", score: 2 }, { label: "App-aware routing", score: 3 }, { label: "CPE standardization", score: 2 }, { label: "Cloud breakout", score: 1 }, { label: "Failover", score: 2 }, { label: "Orchestration", score: 3 }, { label: "QoS", score: 2 }, { label: "Monitoring", score: 1 }]); const sdwan = _sd[0]; const setSdwan = _sd[1];
  const _cl = useState(sites.map(function (s) { return { id: s.id, ready: s.region === "Pinnacle Insurance" || s.region === "Southeast" ? "Blocked" : s.region === "NorthStar Wealth" || s.region === "Northeast" ? "Ready" : s.type === "Data Center" || s.type === "DR Site" ? "N/A" : "Planning", migrated: s.region === "Northeast" ? 8 : 0 }; })); const clSt = _cl[0]; const setClSt = _cl[1];
  const _d1 = useState(""); const d1 = _d1[0]; const setD1 = _d1[1];
  const _d2 = useState(""); const d2 = _d2[0]; const setD2 = _d2[1];
  const _d3 = useState(""); const d3 = _d3[0]; const setD3 = _d3[1];
  const _br = useState([{ label: "CPE standard defined", done: true, sub: "FortiGate 60F/100F" }, { label: "Dual-WAN validated", done: true, sub: "BB + LTE" }, { label: "QoS voice/video", done: false, sub: "Need UC team" }, { label: "Zero-touch provisioning", done: false, sub: "FortiManager draft" }, { label: "Wi-Fi 6E", done: false, sub: "Survey needed" }, { label: "LTE failover tested", done: true, sub: "8 sites OK" }, { label: "Pinnacle CPE refresh", done: false, sub: "ASA→FortiGate" }]); const brCheck = _br[0]; const setBrCheck = _br[1];
  const sdAvg = (sdwan.reduce(function (a, x) { return a + x.score; }, 0) / sdwan.length).toFixed(1);
  const totalMig = clSt.reduce(function (a, c) { return a + c.migrated; }, 0);
  const totalS = sites.reduce(function (a, s) { return a + s.count; }, 0);

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function(x){return x.id==="network";})} />
    <Strip label="Network Tower" pct={72} color={T.blue} detail={totalMig + "/" + totalS + " migrated · " + netEls.length + " elements"} />
    <Nts tag="NETWORK NOTES" tc={T.blue} title="Session Notes" sub="Primary capture surface — findings, decisions, blockers" value={notes} onChange={setNotes} rows={7} />
    <AIBtn label="Network readiness analysis" color={T.blue} data={{ notes: notes, sdwan: sdwan, findings: netFindings, decisions: { mpls: d1, backup: d2, ops: d3 }, elements: netEls.length }} />

    <PrimaryCard tag="DECISIONS" tagColor={T.amber} title="Network strategy — capture consensus">
      <Decision question="MPLS strategy?" options={["Full Eliminate", "Retain 10%", "Retain 20%", "Defer"]} selected={d1} onSelect={setD1} color={T.blue} />
      <div style={{ borderTop: "1px solid " + T.border }} />
      <Decision question="Backup connectivity?" options={["LTE", "5G FWA", "Mixed by Tier", "Evaluate"]} selected={d2} onSelect={setD2} color={T.blue} />
      <div style={{ borderTop: "1px solid " + T.border }} />
      <Decision question="Operations model?" options={["Self-Managed", "Managed", "Co-Managed", "Evaluate"]} selected={d3} onSelect={setD3} color={T.blue} />
    </PrimaryCard>

    <Disc tag="SD-WAN READINESS" tagColor={T.blue} title="Maturity assessment" summary={"Avg: " + sdAvg + " / 5"} right={<span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: sdAvg >= 3.5 ? T.green : sdAvg >= 2.5 ? T.amber : T.red }}>{sdAvg}</span>}>
      {sdwan.map(function (x, i) { return <div key={i} style={{ borderBottom: i < sdwan.length - 1 ? "1px solid " + T.border : "none" }}><ScoreRow label={x.label} score={x.score} onChange={function (v) { setSdwan(sdwan.map(function (s, j) { return j === i ? Object.assign({}, s, { score: v }) : s; })); }} color={T.blue} /></div>; })}
    </Disc>

    <Disc tag="SITE CLUSTERS" tagColor={T.green} title="Migration status" summary={totalMig + "/" + totalS + " sites migrated (" + (totalS > 0 ? Math.round(totalMig / totalS * 100) : 0) + "%)"}>
      {sites.map(function (s, i) { const st = clSt.find(function (x) { return x.id === s.id; }) || { ready: "Planning", migrated: 0 }; return (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < sites.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 130, flexShrink: 0 }}>{s.region} ({s.count})</span><select value={st.ready} onChange={function (e) { setClSt(clSt.map(function (x) { return x.id === s.id ? Object.assign({}, x, { ready: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Not Assessed", "Planning", "Ready", "In Progress", "Blocked", "Complete", "N/A"].map(function (o) { return <option key={o}>{o}</option>; })}</select><input type="number" value={st.migrated} onChange={function (e) { setClSt(clSt.map(function (x) { return x.id === s.id ? Object.assign({}, x, { migrated: Number(e.target.value) || 0 }) : x; })); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 11 })} /><span style={{ fontFamily: T.m, fontSize: 10, color: T.td }}>/{s.count}</span><div style={{ flex: 1, minWidth: 50 }}><Bar pct={s.count > 0 ? Math.round(st.migrated / s.count * 100) : 0} color={st.ready === "Complete" ? T.green : st.ready === "Blocked" ? T.red : T.amber} h={4} /></div></div>); })}
    </Disc>

    <Disc tag="FINDINGS" tagColor={T.red} title="Issues captured" summary={netFindings.length + " findings"}>
      <Findings items={netFindings} setItems={setNetFindings} placeholder="Add finding..." color={T.red} />
    </Disc>

    <Disc tag="BRANCH CHECKLIST" tagColor={T.green} title="Branch readiness" summary={brCheck.filter(function (x) { return x.done; }).length + "/" + brCheck.length + " complete"}>
      {brCheck.map(function (x, i) { return <div key={i} style={{ borderBottom: i < brCheck.length - 1 ? "1px solid " + T.border : "none" }}><Chk label={x.label} done={x.done} sub={x.sub} onToggle={function () { setBrCheck(brCheck.map(function (c, j) { return j === i ? Object.assign({}, c, { done: !c.done }) : c; })); }} /></div>; })}
    </Disc>

    <Disc tag="INVENTORY" tagColor={T.blue} title="Network elements" summary={netEls.length + " devices tracked"}>
      <InvTable cols={NET_COLS} rows={netEls} onRm={function (id) { setNetEls(netEls.filter(function (e) { return e.id !== id; })); }} color={T.blue} />
    </Disc>
  </div>);
}

/* ═══════ SECURITY STUDIO ═══════ */
const SEC_COLS = [{ key: "category", label: "Category" }, { key: "vendor", label: "Vendor" }, { key: "product", label: "Product" }, { key: "coverage", label: "Coverage" }, { key: "lifecycle", label: "Lifecycle" }, { key: "priority", label: "Priority" }];

function SecView({ secTools, setSecTools, secFindings, setSecFindings }) {
  const _n = useState("11 vendors→5. ASA 38 sites EOS. ZT low, board FY27.\n2400+ FW rules ~40% unused. No CASB — 340+ shadow apps."); const notes = _n[0]; const setNotes = _n[1];
  const _sa = useState([{ label: "SWG", score: 1 }, { label: "CASB", score: 1 }, { label: "ZTNA", score: 1 }, { label: "DLP", score: 2 }, { label: "FWaaS", score: 2 }, { label: "Remote", score: 2 }, { label: "Branch", score: 1 }, { label: "Policy", score: 1 }]); const sase = _sa[0]; const setSase = _sa[1];
  const _ve = useState([{ name: "Cisco ASA", decision: "Replace", reason: "EOS" }, { name: "Zscaler", decision: "Evaluate", reason: "vs FortiSASE" }, { name: "CrowdStrike", decision: "Retain", reason: "Strong EDR" }, { name: "Splunk", decision: "Replace", reason: "→FortiSIEM" }, { name: "Proofpoint", decision: "Retain", reason: "OK" }, { name: "Tenable", decision: "Replace", reason: "→FortiAnalyzer" }]); const vendors = _ve[0]; const setVendors = _ve[1];
  const _zt = useState([{ label: "Single IdP", done: false, sub: "AD+Okta" }, { label: "MFA all users", done: true, sub: "Okta" }, { label: "Device posture", done: false, sub: "None" }, { label: "Microsegmentation", done: false, sub: "Flat" }, { label: "ZTNA replaces VPN", done: false, sub: "2100 split-tunnel" }, { label: "Least-privilege", done: false, sub: "Phase 1" }]); const zt = _zt[0]; const setZt = _zt[1];
  const _sd1 = useState(""); const sd1 = _sd1[0]; const setSd1 = _sd1[1];
  const _sd2 = useState(""); const sd2 = _sd2[0]; const setSd2 = _sd2[1];
  const saseAvg = (sase.reduce(function (a, x) { return a + x.score; }, 0) / sase.length).toFixed(1);

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={SECS.find(function(x){return x.id==="security";})} />
    <Strip label="Security Tower" pct={58} color={T.red} detail={secTools.length + " tools · " + vendors.filter(function (v) { return v.decision === "Replace"; }).length + " to replace"} />
    <Nts tag="SECURITY NOTES" tc={T.red} title="Session Notes" sub="Posture, ZT, vendor decisions" value={notes} onChange={setNotes} rows={5} />
    <AIBtn label="Security posture analysis" color={T.red} data={{ notes: notes, sase: sase, vendors: vendors, zt: zt, findings: secFindings }} />

    <PrimaryCard tag="DECISIONS" tagColor={T.amber} title="Security strategy">
      <Decision question="SASE Platform?" options={["FortiSASE", "Zscaler", "Hybrid", "Evaluate"]} selected={sd1} onSelect={setSd1} color={T.red} />
      <div style={{ borderTop: "1px solid " + T.border }} />
      <Decision question="ZT approach?" options={["Identity-First", "Network-First", "Converged", "Phased"]} selected={sd2} onSelect={setSd2} color={T.red} />
    </PrimaryCard>

    <Disc tag="SASE/SSE" tagColor={T.violet} title="SASE readiness" summary={"Avg: " + saseAvg + " / 5"} right={<span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: saseAvg >= 3 ? T.amber : T.red }}>{saseAvg}</span>}>
      {sase.map(function (x, i) { return <div key={i} style={{ borderBottom: i < sase.length - 1 ? "1px solid " + T.border : "none" }}><ScoreRow label={x.label} score={x.score} onChange={function (v) { setSase(sase.map(function (s, j) { return j === i ? Object.assign({}, s, { score: v }) : s; })); }} color={T.violet} /></div>; })}
    </Disc>
    <Disc tag="VENDORS" tagColor={T.amber} title="Consolidation matrix" summary={vendors.filter(function (v) { return v.decision === "Replace"; }).length + " to replace, " + vendors.filter(function (v) { return v.decision === "Retain"; }).length + " retain"}>
      {vendors.map(function (v, i) { return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < vendors.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 100 }}>{v.name}</span><select value={v.decision} onChange={function (e) { setVendors(vendors.map(function (x, j) { return j === i ? Object.assign({}, x, { decision: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Retain", "Replace", "Evaluate", "Consolidate", "Defer"].map(function (o) { return <option key={o}>{o}</option>; })}</select><input value={v.reason} onChange={function (e) { setVendors(vendors.map(function (x, j) { return j === i ? Object.assign({}, x, { reason: e.target.value }) : x; })); }} style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} placeholder="Rationale" /></div>); })}
    </Disc>
    <Disc tag="ZERO TRUST" tagColor={T.teal} title="ZT checklist" summary={zt.filter(function (x) { return x.done; }).length + "/" + zt.length + " ready"}>
      {zt.map(function (x, i) { return <div key={i} style={{ borderBottom: i < zt.length - 1 ? "1px solid " + T.border : "none" }}><Chk label={x.label} done={x.done} sub={x.sub} onToggle={function () { setZt(zt.map(function (c, j) { return j === i ? Object.assign({}, c, { done: !c.done }) : c; })); }} /></div>; })}
    </Disc>
    <Disc tag="FINDINGS" tagColor={T.red} title="Security findings" summary={secFindings.length + " items"}><Findings items={secFindings} setItems={setSecFindings} placeholder="Add finding..." color={T.red} /></Disc>
    <Disc tag="INVENTORY" tagColor={T.red} title="Security tools" summary={secTools.length + " tools tracked"}><InvTable cols={SEC_COLS} rows={secTools} onRm={function (id) { setSecTools(secTools.filter(function (e) { return e.id !== id; })); }} color={T.red} /></Disc>
  </div>);
}

/* ═══════ CLOUD STUDIO ═══════ */
const CLD_COLS = [{ key: "provider", label: "CSP" }, { key: "service", label: "Service" }, { key: "region", label: "Region" }, { key: "connect", label: "Connect" }, { key: "workloads", label: "Wkld" }, { key: "cost", label: "Cost" }, { key: "tier", label: "Tier" }];

function CldView({ cloudRes, setCloudRes, cloudFindings, setCloudFindings }) {
  const _n = useState("AWS primary. Azure +30% YoY. GCP AI/ML only.\nHairpin +38ms. Egress $42K/mo.\n85 apps ID, 23 done. AI 3x growth."); const notes = _n[0]; const setNotes = _n[1];
  const _cr = useState([{ label: "On-ramp redundancy", score: 2 }, { label: "Multi-cloud overlay", score: 1 }, { label: "Egress optimization", score: 1 }, { label: "Cloud-native security", score: 2 }, { label: "App migration", score: 3 }, { label: "FinOps", score: 2 }, { label: "Edge compute", score: 1 }, { label: "AI/ML infra", score: 2 }]); const cr = _cr[0]; const setCr = _cr[1];
  const _co = useState([{ provider: "AWS", path: "Direct Connect (Dallas)", status: "At Risk" }, { provider: "Azure", path: "ExpressRoute (Ashburn)", status: "OK" }, { provider: "GCP", path: "Public Internet", status: "Gap" }, { provider: "Branch→Cloud", path: "DC hairpin", status: "Critical" }]); const conn = _co[0]; const setConn = _co[1];
  const _ap = useState([{ name: "Salesforce", target: "Local Breakout", priority: "High", status: "Planned" }, { name: "Core Banking", target: "AWS", priority: "Critical", status: "Not Started" }, { name: "Claims", target: "AWS opt", priority: "Medium", status: "Complete" }, { name: "Analytics", target: "Azure opt", priority: "Medium", status: "In Progress" }, { name: "Trading", target: "AWS", priority: "Critical", status: "Planning" }]); const apps = _ap[0]; const setApps = _ap[1];
  const _cd1 = useState(""); const cd1 = _cd1[0]; const setCd1 = _cd1[1];
  const _cd2 = useState(""); const cd2 = _cd2[0]; const setCd2 = _cd2[1];
  const crAvg = (cr.reduce(function (a, x) { return a + x.score; }, 0) / cr.length).toFixed(1);
  const totalWk = cloudRes.reduce(function (a, r) { return a + (r.workloads || 0); }, 0);

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={SECS.find(function(x){return x.id==="cloud";})} />
    <Strip label="Cloud Tower" pct={45} color={T.violet} detail={totalWk + " workloads · " + apps.filter(function (a) { return a.status === "Complete"; }).length + "/" + apps.length + " migrated"} />
    <Nts tag="CLOUD NOTES" tc={T.violet} title="Session Notes" sub="Connectivity, migration, cost, architecture" value={notes} onChange={setNotes} rows={5} />
    <AIBtn label="Cloud readiness analysis" color={T.violet} data={{ notes: notes, readiness: cr, connectivity: conn, apps: apps, findings: cloudFindings }} />

    <PrimaryCard tag="DECISIONS" tagColor={T.amber} title="Cloud strategy">
      <Decision question="On-ramp topology?" options={["2 Hubs", "4 Hubs", "Per-Site", "Hybrid"]} selected={cd1} onSelect={setCd1} color={T.violet} />
      <div style={{ borderTop: "1px solid " + T.border }} />
      <Decision question="GCP connectivity?" options={["Deploy Now", "Defer 6mo", "Not Needed", "Evaluate"]} selected={cd2} onSelect={setCd2} color={T.violet} />
    </PrimaryCard>

    <Disc tag="READINESS" tagColor={T.violet} title="Cloud maturity" summary={"Avg: " + crAvg + " / 5"} right={<span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: crAvg >= 3 ? T.amber : T.red }}>{crAvg}</span>}>
      {cr.map(function (x, i) { return <div key={i} style={{ borderBottom: i < cr.length - 1 ? "1px solid " + T.border : "none" }}><ScoreRow label={x.label} score={x.score} onChange={function (v) { setCr(cr.map(function (s, j) { return j === i ? Object.assign({}, s, { score: v }) : s; })); }} color={T.violet} /></div>; })}
    </Disc>
    <Disc tag="CONNECTIVITY" tagColor={T.cyan} title="Cloud paths" summary={conn.filter(function (c) { return c.status === "Critical" || c.status === "Gap"; }).length + " paths at risk"}>
      {conn.map(function (c, i) { return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < conn.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 100 }}>{c.provider}</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.ts, flex: 1 }}>{c.path}</span><select value={c.status} onChange={function (e) { setConn(conn.map(function (x, j) { return j === i ? Object.assign({}, x, { status: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["OK", "At Risk", "Gap", "Critical", "Planned"].map(function (o) { return <option key={o}>{o}</option>; })}</select></div>); })}
    </Disc>
    <Disc tag="MIGRATION" tagColor={T.teal} title="App tracker" summary={apps.filter(function (a) { return a.status === "Complete"; }).length + "/" + apps.length + " complete"}>
      {apps.map(function (a, i) { return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < apps.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 90 }}>{a.name}</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.ts, flex: 1 }}>{a.target}</span><select value={a.priority} onChange={function (e) { setApps(apps.map(function (x, j) { return j === i ? Object.assign({}, x, { priority: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Critical", "High", "Medium", "Low"].map(function (o) { return <option key={o}>{o}</option>; })}</select><select value={a.status} onChange={function (e) { setApps(apps.map(function (x, j) { return j === i ? Object.assign({}, x, { status: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10, width: 100 })}>{["Not Started", "Planning", "Planned", "In Progress", "Complete", "Blocked"].map(function (o) { return <option key={o}>{o}</option>; })}</select></div>); })}
    </Disc>
    <Disc tag="FINDINGS" tagColor={T.red} title="Cloud findings" summary={cloudFindings.length + " items"}><Findings items={cloudFindings} setItems={setCloudFindings} placeholder="Add finding..." color={T.violet} /></Disc>
    <Disc tag="INVENTORY" tagColor={T.violet} title="Cloud resources" summary={cloudRes.length + " resources"}><InvTable cols={CLD_COLS} rows={cloudRes} onRm={function (id) { setCloudRes(cloudRes.filter(function (e) { return e.id !== id; })); }} color={T.violet} /></Disc>
  </div>);
}

/* ═══════ SIMPLE PANEL VIEWS ═══════ */
function SimpleView({ sid, items }) { const s = SECS.find(function (x) { return x.id === sid; }); if (!s) return null; return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={s} />{items.map(function (p, i) { return <Disc key={i} tag={p.tag} tagColor={p.color} title={p.title} summary={p.items.length + " items"}>{p.items.map(function (it, j) { return <div key={j} style={{ padding: "5px 0", fontFamily: T.f, fontSize: 12, color: T.ts, borderBottom: j < p.items.length - 1 ? "1px solid " + T.border : "none" }}>{it}</div>; })}</Disc>; })}</div>); }

const FP = [{ tag: "ARCHITECTURE", title: "Vision", color: T.teal, items: ["Converged fabric", "SD-WAN+SASE overlay", "Zero Trust everywhere", "AIOps-driven operations"] }, { tag: "BRANCH", title: "Target Branch", color: T.blue, items: ["FortiGate+SD-WAN+ZTNA", "Local SaaS breakout", "Wi-Fi 6E + IoT segmentation"] }];
const VP = [{ tag: "TCO", title: "Cost Analysis", color: T.green, items: ["Current $6M/yr", "Year 2: $4.1M", "3yr savings: $4.2M"] }, { tag: "VALUE", title: "Business Drivers", color: T.blue, items: ["$1.4M MPLS savings", "$2.5M breach avoidance", "Site deploy: 90d→5d"] }];
const RoP = [{ tag: "PHASE 1", title: "Q1-Q2 2026 — Foundation", color: T.green, items: ["SD-WAN 8→30 sites", "FortiSASE 2100 users", "FW rule consolidation"] }, { tag: "PHASE 2", title: "Q3-Q4 2026 — Transform", color: T.blue, items: ["SD-WAN 30→85", "MPLS decom 40 sites", "ZT Phase 1"] }, { tag: "PHASE 3", title: "2027 — Complete", color: T.violet, items: ["Full 125 SD-WAN", "MPLS eliminate", "ZT Phase 2 + AIOps"] }];
const DeP = [{ tag: "COMPLETE", title: "Generated", color: T.green, items: ["Executive Summary v1.2", "Current-State Topology", "Vendor & Contract Inventory"] }, { tag: "IN PROGRESS", title: "Building", color: T.amber, items: ["Target Architecture Diagram", "Bill of Materials", "TCO/ROI Model"] }, { tag: "PENDING", title: "Not Started", color: T.td, items: ["ZT Architecture Blueprint", "Cloud Connectivity Design", "Transformation Proposal Deck"] }];

/* ═══════ APP — shared state at top, modular views below ═══════ */
export default function App() {
  const _a = useState("command"); const active = _a[0]; const setActive = _a[1];
  const _s = useState(INIT_SITES); const sites = _s[0]; const setSites = _s[1];
  const _p = useState(INIT_PROVS); const providers = _p[0]; const setProviders = _p[1];
  const _ne = useState(INIT_NET_ELS); const netEls = _ne[0]; const setNetEls = _ne[1];
  const _st = useState(INIT_SEC_TOOLS); const secTools = _st[0]; const setSecTools = _st[1];
  const _cr = useState(INIT_CLOUD_RES); const cloudRes = _cr[0]; const setCloudRes = _cr[1];
  const _nf = useState(["SE cluster: 12% packet loss", "23% CPE past EOS", "No cloud breakout +38ms", "Monitoring fragmented", "6 sites frame relay"]); const netFindings = _nf[0]; const setNetFindings = _nf[1];
  const _sf = useState(["38 Pinnacle firewalls past EOS", "No microsegmentation", "Shadow IT: 340+ apps", "VPN split-tunnel unfiltered"]); const secFindings = _sf[0]; const setSecFindings = _sf[1];
  const _cf = useState(["$42K/mo egress", "No GCP link", "Branch hairpin +38ms", "No Transit Gateway Azure"]); const cloudFindings = _cf[0]; const setCloudFindings = _cf[1];
  const _ca = useState(INIT_CUST_ATTENDEES); const custAttendees = _ca[0]; const setCustAttendees = _ca[1];
  const _ga = useState(INIT_GTT_ATTENDEES); const gttAttendees = _ga[0]; const setGttAttendees = _ga[1];
  const nav = useCallback(function (id) { setActive(id); }, []);
  const totalSites = sites.reduce(function (a, s) { return a + s.count; }, 0);
  const stats = { pct: 64, nr: 72, sr: 58, cr: 45, totalSites: totalSites, totalProviders: providers.length, totalNetEls: netEls.length, totalSecTools: secTools.length, totalCloudRes: cloudRes.length, totalFindings: netFindings.length + secFindings.length + cloudFindings.length, custAttendees: custAttendees.filter(function (a) { return a.present; }).length, gttAttendees: gttAttendees.filter(function (a) { return a.present; }).length };

  function renderContent() {
    switch (active) {
      case "command": return <CmdCenter onNav={nav} stats={stats} />;
      case "stakeholder": return <StakeholderView custAttendees={custAttendees} setCustAttendees={setCustAttendees} gttAttendees={gttAttendees} setGttAttendees={setGttAttendees} />;
      case "executive": return <ExecView onNav={nav} />;
      case "footprint": return <FootprintView />;
      case "current": return <CurrentView sites={sites} setSites={setSites} providers={providers} setProviders={setProviders} />;
      case "network": return <NetView sites={sites} providers={providers} netEls={netEls} setNetEls={setNetEls} netFindings={netFindings} setNetFindings={setNetFindings} />;
      case "security": return <SecView secTools={secTools} setSecTools={setSecTools} secFindings={secFindings} setSecFindings={setSecFindings} />;
      case "cloud": return <CldView cloudRes={cloudRes} setCloudRes={setCloudRes} cloudFindings={cloudFindings} setCloudFindings={setCloudFindings} />;
      case "future": return <SimpleView sid="future" items={FP} />;
      case "value": return <SimpleView sid="value" items={VP} />;
      case "roadmap": return <SimpleView sid="roadmap" items={RoP} />;
      case "deliver": return <SimpleView sid="deliver" items={DeP} />;
      default: return <CmdCenter onNav={nav} stats={stats} />;
    }
  }

  return (<div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.f }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');textarea:focus,input:focus,select:focus{outline:none;border-color:#06b6d4!important;}select{cursor:pointer;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px;}`}</style>
    <Sidebar active={active} onNav={nav} stats={stats} />
    <div style={{ marginLeft: 218, flex: 1, minHeight: "100vh" }}>
      <Header section={active} />
      <div style={{ paddingTop: 64, paddingBottom: 40, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>{renderContent()}</div>
      </div>
    </div>
  </div>);
}
