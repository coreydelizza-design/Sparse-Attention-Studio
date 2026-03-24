import { useState } from "react";
import { T, SM, SECS, iS, selS, smI, lbl } from "../tokens";
import { SecHead, Nts, Disc, PrimaryCard, Strip, ScoreRow, Decision, Bar, Chk, Sev } from "../components/primitives";
import { Findings, AIBtn, InvTable } from "../components/shared";
import { NET_COLS } from "../data/constants";

export default function NetworkEstateView({ sites, setSites, providers, setProviders, netEls, setNetEls, netFindings, setNetFindings, onNav }) {
  var sec = SECS.find(function (x) { return x.id === "estate"; });
  var totalSites = sites.reduce(function (a, s) { return a + s.count; }, 0);

  /* ── 1. Network Thesis ── */
  var _th = useState("Meridian operates a legacy MPLS-centric branch estate with fragmented provider relationships, partially unmanaged branch CPE, aging hardware concentration in acquired entities, and limited resiliency across lower-tier sites. The strongest opportunity is a phased WAN modernization combining underlay rationalization, SD-WAN standardization, backup resiliency uplift, improved observability, and lifecycle/support simplification under a managed services model.\n\nKey constraints include 23% CPE past end-of-support, hub-spoke architecture forcing DC hairpin (+38ms), Pinnacle acquisition on separate Cisco ASA stack, and monitoring fragmented across SolarWinds, PRTG, and spreadsheets. Contract renewals are concentrated in Q4 2026, creating both urgency and leverage for renegotiation."); var thesis = _th[0]; var setThesis = _th[1];

  /* ── 4. Session Notes ── */
  var NOTE_TYPES = ["Observation", "Finding", "Decision", "Blocker", "Risk", "Opportunity", "Follow-Up"];
  var NOTE_COLORS = { Observation: T.blue, Finding: T.red, Decision: T.amber, Blocker: T.red, Risk: T.amber, Opportunity: T.green, "Follow-Up": T.violet };
  var _sn = useState([
    { id: 1, type: "Observation", text: "SE cluster showing 12% packet loss during peak hours — likely oversubscribed MPLS last-mile", pinned: true },
    { id: 2, type: "Finding", text: "23% of branch CPE past end-of-support — concentrated in Pinnacle acquired sites (Cisco ASA 5505/5510)", pinned: true },
    { id: 3, type: "Decision", text: "Customer confirmed: MPLS full eliminate is the target, retain only for top-10 revenue sites during transition", pinned: false },
    { id: 4, type: "Blocker", text: "Pinnacle integration blocked on separate Active Directory domain — network segmentation dependency", pinned: true },
    { id: 5, type: "Risk", text: "AT&T MPLS contract expires Dec 2026 — if not renegotiated by Q3, auto-renews for 24 months", pinned: false },
    { id: 6, type: "Opportunity", text: "45% of sites have no backup connectivity — LTE/5G resiliency play with managed failover", pinned: false },
    { id: 7, type: "Finding", text: "No cloud breakout from branches — all traffic hairpins through DC adding +38ms for SaaS apps", pinned: false },
    { id: 8, type: "Observation", text: "Monitoring is fragmented: SolarWinds (core), PRTG (branches), spreadsheets (Pinnacle) — no single pane", pinned: false },
    { id: 9, type: "Follow-Up", text: "Need CPE serial number audit from Pinnacle NOC team — owner not present today", pinned: false },
    { id: 10, type: "Opportunity", text: "Customer expressed interest in managed SD-WAN with co-managed visibility — GTT Managed SD-WAN + Envision fit", pinned: false }
  ]); var sessNotes = _sn[0]; var setSessNotes = _sn[1];
  var _nf = useState("All"); var noteFilter = _nf[0]; var setNoteFilter = _nf[1];
  var _nt = useState("Observation"); var newNoteType = _nt[0]; var setNewNoteType = _nt[1];
  var _ntxt = useState(""); var newNoteTxt = _ntxt[0]; var setNewNoteTxt = _ntxt[1];
  var filteredNotes = noteFilter === "All" ? sessNotes : sessNotes.filter(function (n) { return n.type === noteFilter; });

  /* ── Free-form session notes ── */
  var _notes = useState("SD-WAN pilot: 8 NE sites, 34% cost cut.\nAT&T MPLS Dec 2026. Pinnacle Cisco to Fortinet.\nLTE failover 45%. SE packet loss.\n\nDecisions: MPLS? LTE vs 5G? Managed vs self-op?\n\nMeridian Financial Group — 125 branches, 14 US states + 3 CA provinces. 2 DCs + DR.\nHub-and-spoke MPLS. M&A: Pinnacle (38 sites, Cisco ASA) and NorthStar (12, not on WAN).\n$4.2M annual spend. 23% CPE past EOS."); var notes = _notes[0]; var setNotes = _notes[1];

  /* ── 3. Opportunity Signals ── */
  var _opp = useState([
    { id: 1, label: "MPLS rationalization", signal: "Strong", type: "Cost" },
    { id: 2, label: "SD-WAN managed service attach", signal: "Strong", type: "Growth" },
    { id: 3, label: "Branch resiliency uplift (LTE/5G backup)", signal: "Strong", type: "Risk" },
    { id: 4, label: "Managed services attach — NOC + monitoring", signal: "Medium", type: "Growth" },
    { id: 5, label: "CPE refresh wedge — EOS/EOL replacement", signal: "Strong", type: "Lifecycle" },
    { id: 6, label: "Monitoring gap — unified observability", signal: "Medium", type: "Ops" },
    { id: 7, label: "Provider consolidation — reduce from 5 to 2", signal: "Medium", type: "Cost" },
    { id: 8, label: "Acquired entity integration — Pinnacle + NorthStar", signal: "Strong", type: "M&A" },
    { id: 9, label: "Cloud breakout — direct SaaS egress at branch", signal: "Medium", type: "Performance" },
    { id: 10, label: "Security convergence — SD-WAN + SASE bundle", signal: "Low", type: "Security" }
  ]); var oppSignals = _opp[0];

  /* ── 6. Strategy Options ── */
  var _strat = useState([
    { id: 1, question: "MPLS strategy?", options: ["Full Eliminate", "Retain 10%", "Retain 20%", "Defer"], selected: "", rationale: "", followUp: "" },
    { id: 2, question: "Backup connectivity?", options: ["LTE", "5G FWA", "Mixed by Tier", "Evaluate"], selected: "", rationale: "", followUp: "" },
    { id: 3, question: "Operations model?", options: ["Self-Managed", "Managed", "Co-Managed", "Evaluate"], selected: "", rationale: "", followUp: "" },
    { id: 4, question: "Branch standardization?", options: ["Single CPE", "Dual CPE by Tier", "Regional Standard", "Evaluate"], selected: "", rationale: "", followUp: "" },
    { id: 5, question: "Provider consolidation?", options: ["Single Provider", "Dual Provider", "Regional Best", "Evaluate"], selected: "", rationale: "", followUp: "" },
    { id: 6, question: "Acquired entity approach?", options: ["Immediate Merge", "Phased Integration", "Parallel Run", "Evaluate"], selected: "", rationale: "", followUp: "" }
  ]); var stratOpts = _strat[0]; var setStratOpts = _strat[1];

  /* ── 7. GTT Solution Mapping ── */
  var _sol = useState([
    { id: 1, issue: "MPLS cost $2.8M/yr with declining value", requirement: "WAN cost reduction without service degradation", solution: "GTT SD-WAN Managed", value: "35-45% WAN cost reduction over 36 months", confidence: "High", expanded: false },
    { id: 2, issue: "45% of sites have no backup connectivity", requirement: "Sub-60s failover for all Tier 1-2 branches", solution: "GTT LTE/5G Backup", value: "99.99% uptime SLA vs current 99.5%", confidence: "High", expanded: false },
    { id: 3, issue: "23% CPE past end-of-support", requirement: "Lifecycle-managed branch hardware with proactive refresh", solution: "GTT Managed CPE", value: "Eliminate unplanned CPE capex, reduce MTTR", confidence: "High", expanded: false },
    { id: 4, issue: "Monitoring fragmented across 3 tools", requirement: "Single-pane observability with proactive alerting", solution: "GTT Envision", value: "Reduce MTTR 40%, eliminate monitoring tool sprawl", confidence: "Medium", expanded: false },
    { id: 5, issue: "Hub-spoke forces +38ms SaaS latency", requirement: "Local internet breakout for M365/Salesforce", solution: "GTT Cloud Connect", value: "30-40ms latency improvement for cloud apps", confidence: "Medium", expanded: false },
    { id: 6, issue: "Pinnacle sites on separate Cisco ASA stack", requirement: "Unified security policy across all acquired entities", solution: "GTT Managed SASE", value: "Single policy engine, consolidated vendor", confidence: "Low", expanded: false },
    { id: 7, issue: "No proactive NOC — reactive break/fix only", requirement: "24x7 managed operations with SLA-backed response", solution: "GTT Managed NOC", value: "Shift from reactive to proactive ops model", confidence: "Medium", expanded: false },
    { id: 8, issue: "Contract renewals concentrated Q4 2026", requirement: "Negotiation leverage and migration timeline alignment", solution: "GTT Transformation Program", value: "Aligned contract terms, phased migration plan", confidence: "High", expanded: false }
  ]); var solMap = _sol[0]; var setSolMap = _sol[1];

  /* ── 8. Lifecycle & Refresh Risk ── */
  var _lc = useState([
    { id: 1, device: "Router", model: "Cisco ISR 4331", qty: 42, age: "5yr", status: "Aging", region: "Core branches", urgency: "medium" },
    { id: 2, device: "Firewall", model: "Cisco ASA 5505", qty: 28, age: "8yr", status: "EOL", region: "Pinnacle sites", urgency: "critical" },
    { id: 3, device: "Firewall", model: "Cisco ASA 5510", qty: 10, age: "7yr", status: "EOS", region: "Pinnacle sites", urgency: "high" },
    { id: 4, device: "Switch", model: "Cisco 2960-X", qty: 85, age: "4yr", status: "Current", region: "All branches", urgency: "low" },
    { id: 5, device: "Router", model: "Cisco ISR 4221", qty: 12, age: "3yr", status: "Current", region: "NorthStar sites", urgency: "low" },
    { id: 6, device: "SD-WAN", model: "FortiGate 60F", qty: 8, age: "1yr", status: "Current", region: "NE pilot", urgency: "low" },
    { id: 7, device: "Wireless AP", model: "Cisco Aironet 2802", qty: 120, age: "5yr", status: "Aging", region: "All branches", urgency: "medium" },
    { id: 8, device: "Router", model: "Cisco ISR 1111", qty: 15, age: "6yr", status: "EOS", region: "Remote/small", urgency: "high" }
  ]); var lcRows = _lc[0];
  var eolCount = lcRows.reduce(function (a, r) { return a + (r.status === "EOL" || r.status === "EOS" ? r.qty : 0); }, 0);
  var totalDevices = lcRows.reduce(function (a, r) { return a + r.qty; }, 0);
  var eolPct = totalDevices > 0 ? Math.round(eolCount / totalDevices * 100) : 0;

  /* ── 9. Managed Coverage ── */
  var _cov = useState([
    { id: 1, area: "Core WAN (MPLS)", model: "Co-Managed", coverage: "85%", gap: "No proactive alerting", opportunity: "Managed SD-WAN" },
    { id: 2, area: "Branch CPE", model: "Customer Managed", coverage: "60%", gap: "No lifecycle management", opportunity: "Managed CPE" },
    { id: 3, area: "LTE Backup", model: "Unmanaged", coverage: "10%", gap: "No failover automation", opportunity: "Managed LTE/5G" },
    { id: 4, area: "Monitoring", model: "Customer Managed", coverage: "45%", gap: "Fragmented tools, no correlation", opportunity: "GTT Envision" },
    { id: 5, area: "Security (Branch FW)", model: "Customer Managed", coverage: "70%", gap: "No unified policy", opportunity: "Managed SASE" },
    { id: 6, area: "Cloud Connectivity", model: "Unmanaged", coverage: "20%", gap: "No direct breakout", opportunity: "Cloud Connect" },
    { id: 7, area: "Pinnacle Sites", model: "Break/Fix", coverage: "30%", gap: "Separate NOC, no SLA", opportunity: "Full Managed" },
    { id: 8, area: "NorthStar Sites", model: "Unmanaged", coverage: "0%", gap: "Not on WAN", opportunity: "New WAN + Managed" }
  ]); var covRows = _cov[0];

  /* ── 10. Renewal Windows ── */
  var _ren = useState([
    { id: 1, provider: "AT&T", service: "MPLS", sites: 65, annual: "$1.8M", window: "0-6mo", expiry: "Dec 2026", risk: "Auto-renew 24mo" },
    { id: 2, provider: "Lumen", service: "DIA", sites: 22, annual: "$420K", window: "6-12mo", expiry: "Jun 2027", risk: "ETF $180K" },
    { id: 3, provider: "Comcast", service: "Broadband", sites: 38, annual: "$280K", window: "12-24mo", expiry: "Mar 2028", risk: "Low — month-to-month" },
    { id: 4, provider: "Verizon", service: "LTE Backup", sites: 8, annual: "$96K", window: "6-12mo", expiry: "Sep 2027", risk: "None" },
    { id: 5, provider: "Zayo", service: "Fiber P2P", sites: 4, annual: "$340K", window: "24+mo", expiry: "Jan 2029", risk: "Long-term locked" },
    { id: 6, provider: "GTT", service: "SD-WAN Pilot", sites: 8, annual: "$180K", window: "12-24mo", expiry: "Dec 2027", risk: "Expansion opportunity" }
  ]); var renRows = _ren[0];
  var windows = ["0-6mo", "6-12mo", "12-24mo", "24+mo"];

  /* ── 11. Monitoring Posture ── */
  var _mon = useState([
    { label: "Alerting maturity", score: 2 },
    { label: "Site visibility", score: 3 },
    { label: "Provider visibility", score: 1 },
    { label: "Incident coordination", score: 2 },
    { label: "Proactive operations", score: 1 },
    { label: "Reporting maturity", score: 2 }
  ]); var monScores = _mon[0]; var setMonScores = _mon[1];
  var monAvg = (monScores.reduce(function (a, x) { return a + x.score; }, 0) / monScores.length).toFixed(1);
  var blindSpots = ["No east-west traffic visibility between branches", "Pinnacle sites not in any monitoring platform", "LTE backup circuits not monitored for failover events", "No application-level performance baselining", "Provider SLA compliance tracked manually in spreadsheets"];

  /* ── 12. Migration & Transformation ── */
  var _sd = useState([
    { label: "Transport diversity", score: 2 }, { label: "App-aware routing", score: 3 },
    { label: "CPE standardization", score: 2 }, { label: "Cloud breakout", score: 1 },
    { label: "Failover", score: 2 }, { label: "Orchestration", score: 3 },
    { label: "QoS", score: 2 }, { label: "Monitoring", score: 1 }
  ]); var sdwan = _sd[0]; var setSdwan = _sd[1];
  var sdAvg = (sdwan.reduce(function (a, x) { return a + x.score; }, 0) / sdwan.length).toFixed(1);
  var _cl = useState(sites.map(function (s) { return { id: s.id, ready: s.region === "Pinnacle Insurance" || s.region === "Southeast" ? "Blocked" : s.region === "NorthStar Wealth" || s.region === "Northeast" ? "Ready" : s.type === "Data Center" || s.type === "DR Site" ? "N/A" : "Planning", migrated: s.region === "Northeast" ? 8 : 0 }; })); var clSt = _cl[0]; var setClSt = _cl[1];
  var totalMig = clSt.reduce(function (a, c) { return a + c.migrated; }, 0);
  var _br = useState([
    { label: "CPE standard defined", done: true, sub: "FortiGate 60F/100F" },
    { label: "Dual-WAN validated", done: true, sub: "BB + LTE" },
    { label: "QoS voice/video", done: false, sub: "Need UC team" },
    { label: "Zero-touch provisioning", done: false, sub: "FortiManager draft" },
    { label: "Wi-Fi 6E", done: false, sub: "Survey needed" },
    { label: "LTE failover tested", done: true, sub: "8 sites OK" },
    { label: "Pinnacle CPE refresh", done: false, sub: "ASA to FortiGate" }
  ]); var brCheck = _br[0]; var setBrCheck = _br[1];

  /* ── 13. Opportunity Development ── */
  var _oppDev = useState([
    { id: 1, theme: "MPLS rationalization + managed SD-WAN", play: "WAN Transformation", phase: "Phase 1", confidence: "High" },
    { id: 2, theme: "Branch resiliency uplift + LTE/5G backup", play: "Resiliency", phase: "Phase 1", confidence: "High" },
    { id: 3, theme: "CPE refresh + lifecycle support", play: "Managed CPE", phase: "Phase 1", confidence: "High" },
    { id: 4, theme: "Unified monitoring + GTT Envision", play: "Observability", phase: "Phase 2", confidence: "Medium" },
    { id: 5, theme: "Pinnacle integration + security convergence", play: "M&A Integration", phase: "Phase 2", confidence: "Medium" },
    { id: 6, theme: "Cloud breakout + direct SaaS connectivity", play: "Cloud Connect", phase: "Phase 3", confidence: "Low" }
  ]); var oppDev = _oppDev[0];

  /* ── 14. Next Actions ── */
  var nextActions = [
    { text: "Validate CPE serial numbers and lifecycle status with Pinnacle NOC", studio: null },
    { text: "Confirm managed vs. unmanaged site split with VP of Infrastructure", studio: null },
    { text: "Review security posture and SASE readiness", studio: "security" },
    { text: "Assess cloud connectivity requirements", studio: "cloud" },
    { text: "Build phased transformation roadmap", studio: "roadmap" },
    { text: "Develop TCO/ROI business case", studio: "value" }
  ];

  /* ── Helpers ── */
  function updateSite(id, field, value) { setSites(sites.map(function (s) { return s.id === id ? Object.assign({}, s, (function () { var o = {}; o[field] = value; return o; })()) : s; })); }
  function urgColor(u) { return u === "critical" ? T.red : u === "high" ? T.amber : u === "medium" ? T.blue : T.td; }
  function statusColor(s) { return s === "EOL" ? T.red : s === "EOS" ? T.amber : s === "Aging" ? T.blue : T.green; }
  function confColor(c) { return c === "High" ? T.green : c === "Medium" ? T.amber : T.red; }
  function sigColor(s) { return s === "Strong" ? T.green : s === "Medium" ? T.amber : T.td; }
  function modelColor(m) { return m === "Fully Managed" ? T.green : m === "Co-Managed" ? T.blue : m === "Customer Managed" ? T.amber : m === "Break/Fix" ? T.red : T.td; }
  function chip(text, color) { return { fontFamily: T.m, fontSize: 9, color: color, background: color + "15", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase", display: "inline-block" }; }

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={sec} />
    <Strip label="Network Estate" pct={72} color={T.blue} detail={totalSites + " sites · " + providers.length + " providers · " + netEls.length + " elements · " + netFindings.length + " findings"} />

    {/* ══ 1. Network Thesis ══ */}
    <PrimaryCard tag="NETWORK THESIS" tagColor={T.blue} title="Estate assessment summary">
      <textarea value={thesis} onChange={function (e) { setThesis(e.target.value); }} style={{ fontFamily: T.f, fontSize: 13, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "10px 12px", background: "#fafbfc", boxSizing: "border-box", width: "100%", minHeight: 100, resize: "vertical", lineHeight: 1.65 }} />
    </PrimaryCard>

    {/* ══ 2. Estate Snapshot ══ */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {[
        { label: "Total Sites", value: totalSites, sub: sites.length + " clusters" },
        { label: "Regions", value: "14 US + 3 CA", sub: "17 total" },
        { label: "Providers", value: providers.length, sub: "$4.2M/yr spend" },
        { label: "WAN Mix", value: "MPLS + DIA", sub: "68% MPLS, 22% DIA, 10% BB" },
        { label: "Managed Split", value: "38% / 62%", sub: "38% managed, 62% unmanaged" },
        { label: "Renewal Conc.", value: "Q4 2026", sub: "$2.2M in next 12mo" }
      ].map(function (c, i) {
        return <div key={i} style={{ background: T.card, borderRadius: 8, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, textTransform: "uppercase", letterSpacing: 0.8 }}>{c.label}</div>
          <div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp, marginTop: 4 }}>{c.value}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, marginTop: 2 }}>{c.sub}</div>
        </div>;
      })}
    </div>

    {/* ══ 3. Opportunity Signals ══ */}
    <PrimaryCard tag="OPPORTUNITY SIGNALS" tagColor={T.green} title={"Estate opportunity analysis — " + oppSignals.length + " signals identified"}>
      {oppSignals.map(function (s, i) {
        return <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < oppSignals.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 12, color: T.tp, flex: 1 }}>{s.label}</span>
          <span style={chip(s.type, T.blue)}>{s.type}</span>
          <span style={chip(s.signal, sigColor(s.signal))}>{s.signal}</span>
        </div>;
      })}
    </PrimaryCard>

    <AIBtn label="Estate opportunity analysis" color={T.blue} data={{ thesis: thesis, sites: totalSites, providers: providers.length, signals: oppSignals, findings: netFindings }} />

    {/* ══ 4. Session Notes & Findings ══ */}
    <PrimaryCard tag="SESSION NOTES" tagColor={T.cyan} title={"Structured notes — " + sessNotes.length + " captured"} right={<span style={{ fontFamily: T.m, fontSize: 10, color: T.td }}>{sessNotes.filter(function (n) { return n.pinned; }).length} pinned</span>}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        {["All"].concat(NOTE_TYPES).map(function (t) {
          var active = noteFilter === t;
          var c = t === "All" ? T.cyan : NOTE_COLORS[t];
          return <button key={t} onClick={function () { setNoteFilter(t); }} style={{ fontFamily: T.f, fontSize: 10, padding: "3px 10px", borderRadius: 4, cursor: "pointer", border: "1px solid " + (active ? c : T.border), background: active ? c + "12" : "transparent", color: active ? c : T.td, fontWeight: active ? 600 : 400 }}>{t}{t !== "All" ? " (" + sessNotes.filter(function (n) { return n.type === t; }).length + ")" : ""}</button>;
        })}
      </div>
      {/* Add note form */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={newNoteType} onChange={function (e) { setNewNoteType(e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, width: 110 })}>
          {NOTE_TYPES.map(function (t) { return <option key={t}>{t}</option>; })}
        </select>
        <input value={newNoteTxt} onChange={function (e) { setNewNoteTxt(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter" && newNoteTxt.trim()) { setSessNotes(sessNotes.concat([{ id: Date.now(), type: newNoteType, text: newNoteTxt.trim(), pinned: false }])); setNewNoteTxt(""); } }} placeholder="Add a note..." style={Object.assign({}, iS, { flex: 1 })} />
        <button onClick={function () { if (newNoteTxt.trim()) { setSessNotes(sessNotes.concat([{ id: Date.now(), type: newNoteType, text: newNoteTxt.trim(), pinned: false }])); setNewNoteTxt(""); } }} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: T.cyan, border: "none", borderRadius: 6, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
      </div>
      {/* Note cards */}
      {filteredNotes.map(function (n, i) {
        var c = NOTE_COLORS[n.type] || T.td;
        return <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < filteredNotes.length - 1 ? "1px solid " + T.border : "none" }}>
          {n.pinned && <span style={{ color: T.amber, fontSize: 10, flexShrink: 0, marginTop: 2 }}>*</span>}
          <span style={chip(n.type, c)}>{n.type}</span>
          <span style={{ fontFamily: T.f, fontSize: 12, color: T.ts, flex: 1, lineHeight: 1.5 }}>{n.text}</span>
          <button onClick={function () { setSessNotes(sessNotes.map(function (x) { return x.id === n.id ? Object.assign({}, x, { pinned: !x.pinned }) : x; })); }} style={{ background: "none", border: "none", color: n.pinned ? T.amber : T.td, cursor: "pointer", fontSize: 11, flexShrink: 0 }} title="Pin">{n.pinned ? "★" : "☆"}</button>
          <button onClick={function () { setSessNotes(sessNotes.filter(function (x) { return x.id !== n.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, flexShrink: 0 }}>✕</button>
        </div>;
      })}
    </PrimaryCard>

    <Nts tag="FREE-FORM NOTES" tc={T.blue} title="Session Notes" sub="Primary capture surface — findings, decisions, blockers" value={notes} onChange={setNotes} rows={7} />

    <Disc tag="FINDINGS" tagColor={T.red} title="Issues captured" summary={netFindings.length + " findings"} defaultOpen={true}>
      <Findings items={netFindings} setItems={setNetFindings} placeholder="Add finding..." color={T.red} />
    </Disc>

    {/* ══ 5. Current Estate & Constraints ══ */}
    <PrimaryCard tag="SITE INVENTORY" tagColor={T.blue} title={totalSites + " sites · " + sites.length + " clusters"} right={<button onClick={function () { setSites(sites.concat([{ id: Date.now(), region: "New Region", type: "Branch", count: 0, states: "", circuit: "MPLS", bandwidth: "100 Mbps", provider: "", notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add</button>}>
      {sites.map(function (s, i) {
        return <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < sites.length - 1 ? "1px solid " + T.border : "none", flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp, width: 120, flexShrink: 0 }}>{s.region}</span>
          <select value={s.type} onChange={function (e) { updateSite(s.id, "type", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Branch", "Retail", "Acquired", "HQ / Campus", "Data Center", "DR Site", "Remote"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
          <input type="number" value={s.count} onChange={function (e) { updateSite(s.id, "count", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 11 })} />
          <select value={s.circuit} onChange={function (e) { updateSite(s.id, "circuit", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["MPLS", "DIA", "Broadband", "LTE/5G", "MPLS+DIA", "BB+LTE", "Metro Eth", "Fiber P2P", "None"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
          <select value={s.bandwidth} onChange={function (e) { updateSite(s.id, "bandwidth", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["10 Mbps", "25 Mbps", "50 Mbps", "100 Mbps", "200 Mbps", "500 Mbps", "1 Gbps", "5 Gbps", "10 Gbps"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
          <input value={s.provider} onChange={function (e) { updateSite(s.id, "provider", e.target.value); }} style={Object.assign({}, smI, { width: 80, fontSize: 10 })} placeholder="Provider" />
          <button onClick={function () { setSites(sites.filter(function (x) { return x.id !== s.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, marginLeft: "auto" }}>✕</button>
        </div>;
      })}
    </PrimaryCard>

    <Disc tag="PROVIDERS" tagColor={T.amber} title="WAN contracts" summary={providers.length + " providers — $4.2M/yr"}>
      {providers.map(function (p, i) {
        return <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < providers.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 80 }}>{p.name}</span>
          <span style={{ fontFamily: T.f, fontSize: 11, color: T.ts, width: 100 }}>{p.type}</span>
          <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, width: 65 }}>{p.cost}</span>
          <span style={{ fontFamily: T.f, fontSize: 11, color: T.td, width: 65 }}>{p.expiry}</span>
          <select value={p.action} onChange={function (e) { setProviders(providers.map(function (x, j) { return j === i ? Object.assign({}, x, { action: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Retain", "Retain & Expand", "Non-Renew", "Early Terminate", "Renegotiate", "Evaluate"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
        </div>;
      })}
    </Disc>

    <Disc tag="CONSTRAINTS" tagColor={T.red} title="Architecture issues" summary="5 constraints identified">
      {["Hub-spoke forces DC hairpin — +38ms latency", "No direct cloud breakout from branches", "Pinnacle on separate Cisco ASA stack", "23% of CPE past end-of-support", "Monitoring fragmented: SolarWinds + PRTG + spreadsheets"].map(function (it, i) {
        return <div key={i} style={{ padding: "6px 0", fontFamily: T.f, fontSize: 12, color: T.ts, borderBottom: i < 4 ? "1px solid " + T.border : "none" }}>{it}</div>;
      })}
    </Disc>

    {/* ══ 6. Strategy Options ══ */}
    <PrimaryCard tag="STRATEGY OPTIONS" tagColor={T.amber} title="Network strategy — capture consensus">
      {stratOpts.map(function (opt, i) {
        return <div key={opt.id}>
          {i > 0 && <div style={{ borderTop: "1px solid " + T.border }} />}
          <Decision question={opt.question} options={opt.options} selected={opt.selected} onSelect={function (v) { setStratOpts(stratOpts.map(function (x) { return x.id === opt.id ? Object.assign({}, x, { selected: v }) : x; })); }} color={T.blue} />
          <div style={{ paddingLeft: 0, paddingBottom: 8 }}>
            <input value={opt.rationale} onChange={function (e) { setStratOpts(stratOpts.map(function (x) { return x.id === opt.id ? Object.assign({}, x, { rationale: e.target.value }) : x; })); }} placeholder="Rationale / notes..." style={Object.assign({}, iS, { fontSize: 11, padding: "5px 8px", marginTop: 4 })} />
          </div>
        </div>;
      })}
    </PrimaryCard>

    {/* ══ 7. GTT Solution Mapping ══ */}
    <PrimaryCard tag="SOLUTION MAPPING" tagColor={T.teal} title={"GTT solution alignment — " + solMap.length + " mappings"}>
      {solMap.map(function (r, i) {
        return <div key={r.id} style={{ borderBottom: i < solMap.length - 1 ? "1px solid " + T.border : "none" }}>
          <div onClick={function () { setSolMap(solMap.map(function (x) { return x.id === r.id ? Object.assign({}, x, { expanded: !x.expanded }) : x; })); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", cursor: "pointer" }}>
            <span style={{ fontSize: 9, color: T.td, transform: r.expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", flexShrink: 0 }}>&#9654;</span>
            <span style={{ fontFamily: T.f, fontSize: 12, color: T.tp, flex: 1 }}>{r.issue}</span>
            <span style={chip(r.solution, T.teal)}>{r.solution}</span>
            <select value={r.confidence} onChange={function (e) { e.stopPropagation(); setSolMap(solMap.map(function (x) { return x.id === r.id ? Object.assign({}, x, { confidence: e.target.value }) : x; })); }} onClick={function (e) { e.stopPropagation(); }} style={Object.assign({}, selS, { fontSize: 9, color: confColor(r.confidence), borderColor: confColor(r.confidence) + "44" })}>
              {["High", "Medium", "Low"].map(function (o) { return <option key={o}>{o}</option>; })}
            </select>
          </div>
          {r.expanded && <div style={{ padding: "0 0 10px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts }}><strong style={{ color: T.td }}>Requirement:</strong> {r.requirement}</div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts }}><strong style={{ color: T.td }}>Value:</strong> {r.value}</div>
          </div>}
        </div>;
      })}
    </PrimaryCard>

    {/* ══ 8. Lifecycle & Refresh Risk ══ */}
    <Disc tag="LIFECYCLE RISK" tagColor={T.red} title="CPE aging & refresh" summary={eolPct + "% beyond lifecycle (" + eolCount + "/" + totalDevices + " devices)"}>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ fontFamily: T.f, fontSize: 12, color: T.ts }}><strong style={{ color: T.red }}>{eolPct}%</strong> beyond lifecycle</div>
        <div style={{ fontFamily: T.f, fontSize: 12, color: T.ts }}><strong style={{ color: T.amber }}>{Math.round(lcRows.filter(function (r) { return r.status === "EOS"; }).reduce(function (a, r) { return a + r.qty; }, 0) / totalDevices * 100)}%</strong> within 12mo of EOS</div>
      </div>
      {lcRows.map(function (r, i) {
        return <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < lcRows.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, width: 60, flexShrink: 0 }}>{r.device}</span>
          <span style={{ fontFamily: T.m, fontSize: 10, color: T.ts, width: 110, flexShrink: 0 }}>{r.model}</span>
          <span style={{ fontFamily: T.m, fontSize: 10, color: T.td, width: 30, textAlign: "center" }}>{r.qty}</span>
          <span style={{ fontFamily: T.f, fontSize: 10, color: T.td, width: 30 }}>{r.age}</span>
          <span style={chip(r.status, statusColor(r.status))}>{r.status}</span>
          <span style={{ fontFamily: T.f, fontSize: 10, color: T.td, flex: 1 }}>{r.region}</span>
          <span style={chip(r.urgency, urgColor(r.urgency))}>{r.urgency}</span>
        </div>;
      })}
    </Disc>

    {/* ══ 9. Managed Coverage & Support Gaps ══ */}
    <Disc tag="MANAGED COVERAGE" tagColor={T.blue} title="Support model gaps" summary={covRows.filter(function (r) { return r.model === "Unmanaged" || r.model === "Break/Fix"; }).length + " areas with coverage gaps"}>
      {covRows.map(function (r, i) {
        return <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < covRows.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, width: 110, flexShrink: 0 }}>{r.area}</span>
          <span style={chip(r.model, modelColor(r.model))}>{r.model}</span>
          <span style={{ fontFamily: T.m, fontSize: 10, color: T.td, width: 35 }}>{r.coverage}</span>
          <span style={{ fontFamily: T.f, fontSize: 10, color: T.red, flex: 1 }}>{r.gap}</span>
          <span style={chip(r.opportunity, T.green)}>{r.opportunity}</span>
        </div>;
      })}
    </Disc>

    {/* ══ 10. Renewal Windows & Contract Exposure ══ */}
    <Disc tag="RENEWAL WINDOWS" tagColor={T.amber} title="Contract exposure" summary={"$" + (renRows.reduce(function (a, r) { return a + parseFloat(r.annual.replace(/[$K,M]/g, "")) * (r.annual.includes("M") ? 1000 : 1); }, 0) / 1000).toFixed(1) + "M annual across " + renRows.length + " contracts"}>
      {windows.map(function (w) {
        var wRows = renRows.filter(function (r) { return r.window === w; });
        if (!wRows.length) return null;
        return <div key={w} style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.tp, marginBottom: 6, padding: "4px 0", borderBottom: "1px solid " + T.border }}>{w} window</div>
          {wRows.map(function (r, i) {
            return <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < wRows.length - 1 ? "1px solid " + T.border : "none" }}>
              <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, width: 70, flexShrink: 0 }}>{r.provider}</span>
              <span style={{ fontFamily: T.f, fontSize: 10, color: T.ts, width: 70 }}>{r.service}</span>
              <span style={{ fontFamily: T.m, fontSize: 10, color: T.td, width: 40 }}>{r.sites} sites</span>
              <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, width: 55 }}>{r.annual}</span>
              <span style={{ fontFamily: T.f, fontSize: 10, color: T.td, width: 60 }}>{r.expiry}</span>
              <span style={{ fontFamily: T.f, fontSize: 10, color: T.amber, flex: 1 }}>{r.risk}</span>
            </div>;
          })}
        </div>;
      })}
    </Disc>

    {/* ══ 11. Monitoring & Operational Visibility ══ */}
    <Disc tag="MONITORING POSTURE" tagColor={T.violet} title="Operational visibility" summary={"Avg: " + monAvg + " / 5"} right={<span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: monAvg >= 3.5 ? T.green : monAvg >= 2.5 ? T.amber : T.red }}>{monAvg}</span>}>
      {monScores.map(function (x, i) {
        return <div key={i} style={{ borderBottom: i < monScores.length - 1 ? "1px solid " + T.border : "none" }}>
          <ScoreRow label={x.label} score={x.score} onChange={function (v) { setMonScores(monScores.map(function (s, j) { return j === i ? Object.assign({}, s, { score: v }) : s; })); }} color={T.violet} />
        </div>;
      })}
      <div style={{ borderTop: "1px solid " + T.border, paddingTop: 10, marginTop: 6 }}>
        <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.tp, marginBottom: 6 }}>Blind Spots</div>
        {blindSpots.map(function (b, i) {
          return <div key={i} style={{ padding: "4px 0", fontFamily: T.f, fontSize: 11, color: T.ts, display: "flex", gap: 6 }}>
            <span style={{ color: T.red, flexShrink: 0 }}>!</span>{b}
          </div>;
        })}
      </div>
    </Disc>

    {/* ══ 12. Migration & Transformation Posture ══ */}
    <Disc tag="SD-WAN READINESS" tagColor={T.blue} title="Maturity assessment" summary={"Avg: " + sdAvg + " / 5"} right={<span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: sdAvg >= 3.5 ? T.green : sdAvg >= 2.5 ? T.amber : T.red }}>{sdAvg}</span>}>
      {sdwan.map(function (x, i) {
        return <div key={i} style={{ borderBottom: i < sdwan.length - 1 ? "1px solid " + T.border : "none" }}>
          <ScoreRow label={x.label} score={x.score} onChange={function (v) { setSdwan(sdwan.map(function (s, j) { return j === i ? Object.assign({}, s, { score: v }) : s; })); }} color={T.blue} />
        </div>;
      })}
    </Disc>

    <Disc tag="SITE CLUSTERS" tagColor={T.green} title="Migration status" summary={totalMig + "/" + totalSites + " sites migrated (" + (totalSites > 0 ? Math.round(totalMig / totalSites * 100) : 0) + "%)"}>
      {sites.map(function (s, i) {
        var st = clSt.find(function (x) { return x.id === s.id; }) || { ready: "Planning", migrated: 0 };
        return <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < sites.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 130, flexShrink: 0 }}>{s.region} ({s.count})</span>
          <select value={st.ready} onChange={function (e) { setClSt(clSt.map(function (x) { return x.id === s.id ? Object.assign({}, x, { ready: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Not Assessed", "Planning", "Ready", "In Progress", "Blocked", "Complete", "N/A"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
          <input type="number" value={st.migrated} onChange={function (e) { setClSt(clSt.map(function (x) { return x.id === s.id ? Object.assign({}, x, { migrated: Number(e.target.value) || 0 }) : x; })); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 11 })} />
          <span style={{ fontFamily: T.m, fontSize: 10, color: T.td }}>/{s.count}</span>
          <div style={{ flex: 1, minWidth: 50 }}><Bar pct={s.count > 0 ? Math.round(st.migrated / s.count * 100) : 0} color={st.ready === "Complete" ? T.green : st.ready === "Blocked" ? T.red : T.amber} h={4} /></div>
        </div>;
      })}
    </Disc>

    <Disc tag="BRANCH CHECKLIST" tagColor={T.green} title="Branch readiness" summary={brCheck.filter(function (x) { return x.done; }).length + "/" + brCheck.length + " complete"}>
      {brCheck.map(function (x, i) {
        return <div key={i} style={{ borderBottom: i < brCheck.length - 1 ? "1px solid " + T.border : "none" }}>
          <Chk label={x.label} done={x.done} sub={x.sub} onToggle={function () { setBrCheck(brCheck.map(function (c, j) { return j === i ? Object.assign({}, c, { done: !c.done }) : c; })); }} />
        </div>;
      })}
    </Disc>

    {/* ══ 13. Opportunity Development Panel ══ */}
    <PrimaryCard tag="OPPORTUNITY DEVELOPMENT" tagColor={T.green} title={"Themes for pursuit — " + oppDev.length + " identified"}>
      {oppDev.map(function (o, i) {
        return <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < oppDev.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 12, color: T.tp, flex: 1 }}>{o.theme}</span>
          <span style={chip(o.play, T.blue)}>{o.play}</span>
          <span style={chip(o.phase, T.violet)}>{o.phase}</span>
          <span style={chip(o.confidence, confColor(o.confidence))}>{o.confidence}</span>
        </div>;
      })}
    </PrimaryCard>

    {/* ══ 14. Recommended Next Actions & Linked Studios ══ */}
    <PrimaryCard tag="NEXT ACTIONS" tagColor={T.cyan} title="Recommended actions & linked studios">
      {nextActions.map(function (a, i) {
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < nextActions.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ color: T.cyan, fontSize: 11, flexShrink: 0 }}>&#9654;</span>
          <span style={{ fontFamily: T.f, fontSize: 12, color: T.ts, flex: 1 }}>{a.text}</span>
          {a.studio && <button onClick={function () { onNav(a.studio); }} style={{ fontFamily: T.f, fontSize: 10, color: T.blue, background: T.blue + "10", border: "1px solid " + T.blue + "22", borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>Open {(SECS.find(function (x) { return x.id === a.studio; }) || { label: a.studio }).label} &#8594;</button>}
        </div>;
      })}
    </PrimaryCard>

    {/* ══ 15. Network Element Inventory ══ */}
    <Disc tag="INVENTORY" tagColor={T.blue} title="Network elements" summary={netEls.length + " devices tracked"}>
      <InvTable cols={NET_COLS} rows={netEls} onRm={function (id) { setNetEls(netEls.filter(function (e) { return e.id !== id; })); }} color={T.blue} />
    </Disc>
  </div>);
}
