import { useState } from "react";
import { T, SM, SECS, iS, selS, smI, lbl } from "../tokens";
import { SecHead, Nts, Disc, PrimaryCard, ScoreRow, Decision, Bar, Sev } from "../components/primitives";
import { Findings, InvTable } from "../components/shared";
import { NET_COLS } from "../data/constants";

/* ═══════ TOPIC DEFINITIONS ═══════ */
var TOPICS = [
  { id: "estate", label: "Estate Basics", icon: "▣" },
  { id: "connectivity", label: "Connectivity", icon: "◉" },
  { id: "operations", label: "Operations", icon: "◈" },
  { id: "lifecycle", label: "Lifecycle", icon: "▦" },
  { id: "strategy", label: "Strategy", icon: "◬" },
  { id: "gtt", label: "GTT Plays", icon: "⊕" },
];

/* ═══════ NOTE HELPERS ═══════ */
var NOTE_TYPES = ["Observation", "Finding", "Decision", "Blocker", "Risk", "Opportunity", "Follow-Up"];
var NOTE_COLORS = { Observation: T.blue, Finding: T.red, Decision: T.amber, Blocker: T.red, Risk: T.amber, Opportunity: T.green, "Follow-Up": T.violet };

/* ═══════ COMPONENT ═══════ */
export default function NetworkEstateView({ sites, setSites, providers, setProviders, netEls, setNetEls, netFindings, setNetFindings, onNav }) {
  var sec = SECS.find(function (x) { return x.id === "estate"; });
  var totalSites = sites.reduce(function (a, s) { return a + s.count; }, 0);

  /* ── Active topic ── */
  var _topic = useState("estate"); var topic = _topic[0]; var setTopic = _topic[1];

  /* ═══════ SHARED STATE (persists across topics) ═══════ */

  /* Notes per topic */
  var _notes = useState({
    estate: [
      { id: 1, type: "Observation", text: "178 total sites — 125 branches + 50 acquired + 3 DC/DR. 14 US states, 3 CA provinces.", pinned: true },
      { id: 2, type: "Finding", text: "NorthStar Wealth (12 sites) not on any GTT or enterprise WAN — greenfield opportunity.", pinned: false },
    ],
    connectivity: [
      { id: 3, type: "Finding", text: "Hub-spoke MPLS forcing DC hairpin — +38ms for SaaS/cloud traffic from branches.", pinned: true },
      { id: 4, type: "Observation", text: "AT&T MPLS covers 87 sites ($2.1M/yr), expires Dec 2026. Non-renew confirmed.", pinned: true },
      { id: 5, type: "Risk", text: "45% of sites have no backup connectivity — single point of failure.", pinned: false },
      { id: 6, type: "Finding", text: "SE cluster showing 12% packet loss during peak hours — likely oversubscribed last-mile.", pinned: false },
    ],
    operations: [
      { id: 7, type: "Observation", text: "Monitoring fragmented: SolarWinds (core), PRTG (branches), spreadsheets (Pinnacle). No single pane.", pinned: true },
      { id: 8, type: "Finding", text: "No after-hours NOC coverage — customer IT handles weekend incidents manually.", pinned: false },
      { id: 9, type: "Blocker", text: "Pinnacle still on separate AD domain — network segmentation dependency for integration.", pinned: false },
    ],
    lifecycle: [
      { id: 10, type: "Finding", text: "23% of branch CPE past end-of-support — concentrated in Pinnacle (Cisco ASA 5505/5510).", pinned: true },
      { id: 11, type: "Risk", text: "Cisco Aironet APs aging across all sites — Wi-Fi 6E refresh needed.", pinned: false },
    ],
    strategy: [
      { id: 12, type: "Decision", text: "Customer confirmed: MPLS full eliminate is the target, retain only top-10 revenue sites during transition.", pinned: true },
      { id: 13, type: "Follow-Up", text: "Need to confirm managed vs co-managed preference with VP Ops — not present today.", pinned: false },
    ],
    gtt: [
      { id: 14, type: "Opportunity", text: "Customer expressed interest in managed SD-WAN + co-managed visibility — Managed SD-WAN + EnvisionDX fit.", pinned: true },
      { id: 15, type: "Opportunity", text: "Pinnacle CPE refresh creates natural wedge for managed lifecycle + branch modernization bundle.", pinned: false },
    ],
  }); var notes = _notes[0]; var setNotes = _notes[1];
  var _newNoteText = useState(""); var newNoteText = _newNoteText[0]; var setNewNoteText = _newNoteText[1];
  var _newNoteType = useState("Observation"); var newNoteType = _newNoteType[0]; var setNewNoteType = _newNoteType[1];

  function addNote() {
    if (!newNoteText.trim()) return;
    var topicNotes = (notes[topic] || []).concat([{ id: Date.now(), type: newNoteType, text: newNoteText.trim(), pinned: false }]);
    var updated = Object.assign({}, notes);
    updated[topic] = topicNotes;
    setNotes(updated);
    setNewNoteText("");
  }
  function togglePin(noteId) {
    var updated = Object.assign({}, notes);
    updated[topic] = (notes[topic] || []).map(function (n) { return n.id === noteId ? Object.assign({}, n, { pinned: !n.pinned }) : n; });
    setNotes(updated);
  }
  function removeNote(noteId) {
    var updated = Object.assign({}, notes);
    updated[topic] = (notes[topic] || []).filter(function (n) { return n.id !== noteId; });
    setNotes(updated);
  }

  /* Open items across all topics */
  var allNotes = Object.keys(notes).reduce(function (a, k) { return a.concat((notes[k] || []).map(function (n) { return Object.assign({}, n, { topic: k }); })); }, []);
  var openItems = allNotes.filter(function (n) { return n.type === "Blocker" || n.type === "Follow-Up" || n.type === "Risk"; });
  var pinnedItems = allNotes.filter(function (n) { return n.pinned; });

  /* ── Topic-specific facts state ── */
  var _wanTypes = useState({ MPLS: true, DIA: true, Broadband: true, "LTE/5G": true, "Cloud Connect": true, "SIP/Voice": true, "SD-WAN": true }); var wanTypes = _wanTypes[0]; var setWanTypes = _wanTypes[1];
  var _mgmt = useState("Mixed"); var mgmt = _mgmt[0]; var setMgmt = _mgmt[1];
  var _topo = useState("Hub-Spoke"); var topo = _topo[0]; var setTopo = _topo[1];

  /* Strategy decisions */
  var _d1 = useState(""); var d1 = _d1[0]; var setD1 = _d1[1];
  var _d2 = useState(""); var d2 = _d2[0]; var setD2 = _d2[1];
  var _d3 = useState(""); var d3 = _d3[0]; var setD3 = _d3[1];
  var _d4 = useState(""); var d4 = _d4[0]; var setD4 = _d4[1];

  /* GTT solution mapping */
  var _solutions = useState([
    { id: 1, issue: "Legacy MPLS with single-provider lock-in", solution: "Managed SD-WAN", confidence: "High", note: "Replace AT&T MPLS, phased by region" },
    { id: 2, issue: "45% of sites no backup connectivity", solution: "LTE / 5G Backup", confidence: "High", note: "Resiliency uplift across all branch tiers" },
    { id: 3, issue: "Aging branch CPE (23% past EOS)", solution: "Lifecycle Support + Branch Modernization", confidence: "High", note: "Pinnacle ASA refresh + FortiGate standardization" },
    { id: 4, issue: "Fragmented monitoring (3 tools + spreadsheets)", solution: "EnvisionDX", confidence: "Medium", note: "Single-pane visibility across all sites" },
    { id: 5, issue: "No after-hours NOC / weak change support", solution: "Managed Network Services", confidence: "Medium", note: "24x7 support overlay + MACD" },
    { id: 6, issue: "No cloud breakout from branches (+38ms)", solution: "SD-WAN + Cloud Connect", confidence: "High", note: "Local breakout + direct AWS/Azure paths" },
    { id: 7, issue: "No security edge / SASE presence", solution: "Security Edge / SASE", confidence: "Medium", note: "Adjacency — explore in Security Studio" },
    { id: 8, issue: "NorthStar 12 sites not on WAN", solution: "DIA + SD-WAN Greenfield", confidence: "Medium", note: "Greenfield build — fast deployment opportunity" },
  ]); var solutions = _solutions[0]; var setSolutions = _solutions[1];

  /* ═══════ RENDER HELPERS ═══════ */

  /* Notes panel (reused in every topic) */
  function renderNotes() {
    var topicNotes = notes[topic] || [];
    var pinned = topicNotes.filter(function (n) { return n.pinned; });
    var unpinned = topicNotes.filter(function (n) { return !n.pinned; });
    return (<div>
      {/* Add note */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <select value={newNoteType} onChange={function (e) { setNewNoteType(e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, width: 90 })}>
          {NOTE_TYPES.map(function (t) { return <option key={t} value={t}>{t}</option>; })}
        </select>
        <input value={newNoteText} onChange={function (e) { setNewNoteText(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") addNote(); }} placeholder="Capture a note..." style={Object.assign({}, iS, { flex: 1, fontSize: 12 })} />
        <button onClick={addNote} style={{ fontFamily: T.f, fontSize: 10, fontWeight: 600, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
      </div>
      {/* Pinned */}
      {pinned.map(function (n) { return renderNoteCard(n); })}
      {/* Unpinned */}
      {unpinned.map(function (n) { return renderNoteCard(n); })}
      {!topicNotes.length && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, fontStyle: "italic", padding: "12px 0" }}>No notes yet for this topic.</div>}
    </div>);
  }

  function renderNoteCard(n) {
    var nc = NOTE_COLORS[n.type] || T.td;
    return (<div key={n.id} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: "1px solid " + T.border, alignItems: "flex-start" }}>
      <span style={{ fontFamily: T.m, fontSize: 8, color: nc, background: nc + "12", padding: "2px 5px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0, marginTop: 2 }}>{n.type}</span>
      <div style={{ flex: 1, fontFamily: T.f, fontSize: 12, color: T.tp, lineHeight: 1.5 }}>{n.text}</div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button onClick={function () { togglePin(n.id); }} style={{ background: "none", border: "none", color: n.pinned ? T.amber : T.td, cursor: "pointer", fontSize: 11 }}>{n.pinned ? "★" : "☆"}</button>
        <button onClick={function () { removeNote(n.id); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
      </div>
    </div>);
  }

  /* ═══════ TOPIC CANVASES ═══════ */

  function renderEstateBasics() {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Facts */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>FACTS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { l: "Total Sites", v: totalSites },
            { l: "Regions", v: sites.length },
            { l: "Providers", v: providers.length },
            { l: "Data Centers", v: sites.filter(function (s) { return s.type === "Data Center"; }).length },
            { l: "Acquired Entities", v: sites.filter(function (s) { return s.type === "Acquired"; }).length },
            { l: "Annual Spend", v: "$4.2M" },
          ].map(function (f) {
            return <div key={f.l}><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{f.l}</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{f.v}</div></div>;
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>Site Classes</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sites.map(function (s) {
              return <span key={s.id} style={{ fontFamily: T.f, fontSize: 10, color: T.tp, background: T.border, padding: "3px 8px", borderRadius: 4 }}>{s.region} ({s.count} · {s.type})</span>;
            })}
          </div>
        </div>
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Open Items */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DECISIONS & OPEN ITEMS</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>Structural complexity:</span>
          {["Acquired entities", "Legacy estates", "Regional exceptions", "Regulated sites", "Uptime-sensitive", "International"].map(function (c) {
            return <span key={c} style={{ fontFamily: T.f, fontSize: 10, color: T.tp, background: T.blue + "10", padding: "3px 8px", borderRadius: 4, border: "1px solid " + T.blue + "22" }}>{c}</span>;
          })}
        </div>
      </div>
    </div>);
  }

  function renderConnectivity() {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Facts */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>FACTS</div>
        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 6 }}>Topology</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {["Hub-Spoke", "Direct Internet", "Hybrid", "Mesh"].map(function (t) {
            var on = topo === t;
            return <button key={t} onClick={function () { setTopo(t); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 4, border: "1.5px solid " + (on ? T.blue : T.border), background: on ? T.blue + "12" : "transparent", color: on ? T.blue : T.td, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{t}</button>;
          })}
        </div>
        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 6 }}>WAN Types Present</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {Object.keys(wanTypes).map(function (w) {
            var on = wanTypes[w];
            return <button key={w} onClick={function () { var u = Object.assign({}, wanTypes); u[w] = !on; setWanTypes(u); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 12, border: "1.5px solid " + (on ? T.green : T.border), background: on ? T.green + "10" : "transparent", color: on ? T.green : T.td, cursor: "pointer" }}>{on ? "● " : "○ "}{w}</button>;
          })}
        </div>
        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>Provider Landscape</div>
        {providers.map(function (p, i) {
          return (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < providers.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.tp, width: 80 }}>{p.name}</span>
            <span style={{ fontFamily: T.f, fontSize: 10, color: T.ts, flex: 1 }}>{p.type} · {p.sites} sites</span>
            <span style={{ fontFamily: T.m, fontSize: 10, color: T.tp }}>{p.cost}</span>
            <span style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{p.expiry}</span>
          </div>);
        })}
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Decisions */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DECISIONS & OPEN ITEMS</div>
        <Decision question="MPLS strategy?" options={["Full Eliminate", "Retain 10%", "Retain 20%", "Defer"]} selected={d1} onSelect={setD1} color={T.blue} />
        <div style={{ borderTop: "1px solid " + T.border, marginTop: 4 }} />
        <Decision question="Backup connectivity?" options={["LTE", "5G FWA", "Mixed by Tier", "Evaluate"]} selected={d2} onSelect={setD2} color={T.blue} />
      </div>
      {/* Opportunity Signals */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {[
          "MPLS rationalization — $2.1M contract non-renew creates displacement window",
          "SD-WAN attach — 8-site pilot proven, 125+ site expansion path",
          "Resiliency uplift — 45% of sites single-connected",
          "Provider consolidation — 6 providers to 1-2 strategic partners",
        ].map(function (s, i) {
          return <div key={i} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, padding: "6px 0", borderBottom: i < 3 ? "1px solid " + T.border : "none" }}>● {s}</div>;
        })}
      </div>
    </div>);
  }

  function renderOperations() {
    var _ops = useState([
      { label: "Monitoring coverage", score: 2 },
      { label: "Support model maturity", score: 2 },
      { label: "Change / config governance", score: 1 },
      { label: "Vendor coordination", score: 1 },
      { label: "After-hours support", score: 1 },
      { label: "Operational automation", score: 2 },
    ]); var ops = _ops[0]; var setOps = _ops[1];
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Facts */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>FACTS — OPERATIONAL MATURITY</div>
        {ops.map(function (o, i) {
          return <div key={i} style={{ borderBottom: i < ops.length - 1 ? "1px solid " + T.border : "none" }}><ScoreRow label={o.label} score={o.score} onChange={function (v) { setOps(ops.map(function (x, j) { return j === i ? Object.assign({}, x, { score: v }) : x; })); }} color={T.blue} /></div>;
        })}
        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginTop: 8 }}>Management posture</div>
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          {["Customer Managed", "Provider Managed", "Mixed", "GTT Managed"].map(function (m) {
            var on = mgmt === m;
            return <button key={m} onClick={function () { setMgmt(m); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 4, border: "1.5px solid " + (on ? T.blue : T.border), background: on ? T.blue + "12" : "transparent", color: on ? T.blue : T.td, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{m}</button>;
          })}
        </div>
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Decisions */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DECISIONS & OPEN ITEMS</div>
        <Decision question="Operations model?" options={["Self-Managed", "Managed", "Co-Managed", "Evaluate"]} selected={d3} onSelect={setD3} color={T.blue} />
      </div>
      {/* Opportunity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {[
          "Managed network services — no after-hours NOC, weak change governance",
          "EnvisionDX — fragmented monitoring, no single pane of glass",
          "Technical support overlay — multi-vendor coordination burden on customer IT",
          "MACD / change support — customer handling config manually",
        ].map(function (s, i) {
          return <div key={i} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, padding: "6px 0", borderBottom: i < 3 ? "1px solid " + T.border : "none" }}>● {s}</div>;
        })}
      </div>
    </div>);
  }

  function renderLifecycle() {
    var cpe = [
      { device: "Cisco ISR 4331", qty: 87, age: "3-5 yr", status: "Aging", region: "US Branches", urgency: "medium" },
      { device: "Cisco ASA 5506", qty: 38, age: "6+ yr", status: "EOL", region: "Pinnacle", urgency: "critical" },
      { device: "FortiGate 60F", qty: 8, age: "<1 yr", status: "Current", region: "NE Pilot", urgency: "low" },
      { device: "Cisco 2960X", qty: 125, age: "4-6 yr", status: "Aging", region: "All Sites", urgency: "medium" },
      { device: "Cisco Aironet", qty: 340, age: "5-7 yr", status: "EOS", region: "All Sites", urgency: "high" },
    ];
    var eolPct = Math.round(cpe.filter(function (c) { return c.status === "EOL" || c.status === "EOS"; }).reduce(function (a, c) { return a + c.qty; }, 0) / cpe.reduce(function (a, c) { return a + c.qty; }, 0) * 100);
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Facts */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>FACTS — LIFECYCLE & REFRESH RISK</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Past EOS/EOL</div><div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.red }}>{eolPct}%</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Total Devices</div><div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.tp }}>{cpe.reduce(function (a, c) { return a + c.qty; }, 0)}</div></div>
        </div>
        {cpe.map(function (c, i) {
          var uc = c.urgency === "critical" ? T.red : c.urgency === "high" ? T.amber : c.urgency === "medium" ? T.blue : T.td;
          var sc = c.status === "Current" ? T.green : c.status === "Aging" ? T.amber : T.red;
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < cpe.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.tp, width: 120, flexShrink: 0 }}>{c.device}</span>
            <span style={{ fontFamily: T.m, fontSize: 10, color: T.tp, width: 30, textAlign: "center" }}>{c.qty}</span>
            <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", width: 42, textAlign: "center" }}>{c.status}</span>
            <span style={{ fontFamily: T.f, fontSize: 10, color: T.td, flex: 1 }}>{c.region} · {c.age}</span>
            <span style={{ fontFamily: T.m, fontSize: 8, color: uc, background: uc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>{c.urgency}</span>
          </div>);
        })}
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Decisions */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DECISIONS & OPEN ITEMS</div>
        <Decision question="Branch CPE approach?" options={["Refresh All", "Refresh EOL Only", "Phased by Region", "Evaluate"]} selected={d4} onSelect={setD4} color={T.blue} />
      </div>
      {/* Opportunity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {[
          "Pinnacle CPE refresh — 38 EOL Cisco ASAs, natural modernization wedge",
          "Lifecycle support — standardize under managed lifecycle governance",
          "Wi-Fi refresh — 340 aging APs across all sites, Wi-Fi 6E opportunity",
          "Branch modernization bundle — CPE + SD-WAN + monitoring in one motion",
        ].map(function (s, i) {
          return <div key={i} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, padding: "6px 0", borderBottom: i < 3 ? "1px solid " + T.border : "none" }}>● {s}</div>;
        })}
      </div>
    </div>);
  }

  function renderStrategy() {
    var _stratNotes = useState("Likely direction: phased MPLS elimination with managed SD-WAN overlay, LTE backup at all branch tiers, unified monitoring via EnvisionDX, and managed services wrapper for support simplification. Pinnacle CPE refresh creates the first-phase wedge. NorthStar greenfield is a fast second motion.\n\nKey open question: managed vs co-managed model — VP Ops preference not yet confirmed."); var stratNotes = _stratNotes[0]; var setStratNotes = _stratNotes[1];
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Facts / Summary */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>STRATEGY SUMMARY</div>
        <textarea value={stratNotes} onChange={function (e) { setStratNotes(e.target.value); }} rows={5} style={{ fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "10px 12px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.6 }} />
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Decisions */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DECISIONS & OPEN ITEMS</div>
        <Decision question="Provider consolidation?" options={["Single Provider", "Dual Provider", "Regional Mix", "Evaluate"]} selected={d1} onSelect={setD1} color={T.blue} />
        <div style={{ borderTop: "1px solid " + T.border, marginTop: 4 }} />
        <Decision question="Migration approach?" options={["Phased by Region", "Big Bang", "Pilot-Then-Expand", "Evaluate"]} selected={d2} onSelect={setD2} color={T.blue} />
        <div style={{ borderTop: "1px solid " + T.border, marginTop: 4 }} />
        <Decision question="Branch standardization?" options={["Full Standard", "Tiered by Class", "Exception-Based", "Evaluate"]} selected={d3} onSelect={setD3} color={T.blue} />
      </div>
      {/* Opportunity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {[
          "Phased SD-WAN — pilot proven, expand NE → SE → all regions",
          "Managed services wrapper — support simplification across full estate",
          "Provider consolidation — reduce from 6 to 1-2, simplify commercial",
          "Acquired entity fast-track — Pinnacle + NorthStar integration as early wins",
        ].map(function (s, i) {
          return <div key={i} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, padding: "6px 0", borderBottom: i < 3 ? "1px solid " + T.border : "none" }}>● {s}</div>;
        })}
      </div>
    </div>);
  }

  function renderGttPlays() {
    var _expSol = useState(null); var expSol = _expSol[0]; var setExpSol = _expSol[1];
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Solution Mapping */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>GTT SOLUTION MAPPING</div>
        {solutions.map(function (s, i) {
          var cc = s.confidence === "High" ? T.green : s.confidence === "Medium" ? T.amber : T.red;
          var isExp = expSol === s.id;
          return (<div key={s.id} style={{ borderBottom: i < solutions.length - 1 ? "1px solid " + T.border : "none" }}>
            <div onClick={function () { setExpSol(isExp ? null : s.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", cursor: "pointer" }}>
              <span style={{ fontSize: 9, color: T.td, transform: isExp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.issue}</div>
              </div>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "12", padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>{s.solution}</span>
              <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{s.confidence}</span>
            </div>
            {isExp && (<div style={{ padding: "0 0 10px 17px" }}>
              <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.5, marginBottom: 6 }}>{s.note}</div>
              <select value={s.confidence} onChange={function (e) { setSolutions(solutions.map(function (x) { return x.id === s.id ? Object.assign({}, x, { confidence: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 9 })}>
                {["High", "Medium", "Low"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}
              </select>
            </div>)}
          </div>);
        })}
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Opportunity Development */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY THEMES</div>
        {[
          { theme: "MPLS rationalization + Managed SD-WAN", phase: "Phase 1", confidence: "High" },
          { theme: "Branch resiliency uplift + LTE backup", phase: "Phase 1", confidence: "High" },
          { theme: "Pinnacle CPE refresh + lifecycle support", phase: "Phase 1", confidence: "High" },
          { theme: "Monitoring consolidation + EnvisionDX", phase: "Phase 2", confidence: "Medium" },
          { theme: "Managed network services + 24x7 support", phase: "Phase 2", confidence: "Medium" },
          { theme: "NorthStar greenfield + SD-WAN deploy", phase: "Phase 2", confidence: "Medium" },
        ].map(function (o, i) {
          var cc = o.confidence === "High" ? T.green : T.amber;
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < 5 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp, flex: 1 }}>{o.theme}</span>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "10", padding: "1px 6px", borderRadius: 3 }}>{o.phase}</span>
            <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>{o.confidence}</span>
          </div>);
        })}
      </div>
      {/* Next Actions */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>NEXT ACTIONS</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "security", label: "Open Security Studio" },
            { id: "cloud", label: "Open Cloud Studio" },
            { id: "value", label: "Quantify in Value Studio" },
            { id: "roadmap", label: "Build Roadmap" },
          ].map(function (a) {
            return <button key={a.id} onClick={function () { onNav(a.id); }} style={{ fontFamily: T.f, fontSize: 10, color: T.cyan, background: T.cyan + "08", border: "1px solid " + T.cyan + "22", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}>{a.label} →</button>;
          })}
        </div>
      </div>
    </div>);
  }

  /* ═══════ MAIN RENDER ═══════ */
  var topicObj = TOPICS.find(function (t) { return t.id === topic; });
  var topicNotes = notes[topic] || [];

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={sec} />

    {/* ═══ 3-Panel Layout ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 200px", gap: 14, minHeight: 600 }}>

      {/* LEFT: Topic Rail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {TOPICS.map(function (t) {
          var active = topic === t.id;
          var noteCount = (notes[t.id] || []).length;
          return (<button key={t.id} onClick={function () { setTopic(t.id); }} style={{ fontFamily: T.f, fontSize: 11, fontWeight: active ? 600 : 400, color: active ? T.blue : T.ts, background: active ? T.blue + "08" : "transparent", border: active ? "1px solid " + T.blue + "22" : "1px solid transparent", borderRadius: 8, padding: "10px 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div>{t.label}</div>
              {noteCount > 0 && <div style={{ fontFamily: T.m, fontSize: 8, color: T.td, marginTop: 1 }}>{noteCount} notes</div>}
            </div>
          </button>);
        })}
      </div>

      {/* CENTER: Active Canvas */}
      <div>
        {topic === "estate" && renderEstateBasics()}
        {topic === "connectivity" && renderConnectivity()}
        {topic === "operations" && renderOperations()}
        {topic === "lifecycle" && renderLifecycle()}
        {topic === "strategy" && renderStrategy()}
        {topic === "gtt" && renderGttPlays()}
      </div>

      {/* RIGHT: Contextual Insights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Open Items */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.m, fontSize: 8, color: T.red, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>OPEN ITEMS ({openItems.length})</div>
          {openItems.length === 0 && <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, fontStyle: "italic" }}>None</div>}
          {openItems.slice(0, 6).map(function (n) {
            var nc = NOTE_COLORS[n.type] || T.td;
            var topicLabel = (TOPICS.find(function (t) { return t.id === n.topic; }) || {}).label || "";
            return (<div key={n.id} style={{ padding: "4px 0", borderBottom: "1px solid " + T.border }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ fontFamily: T.m, fontSize: 7, color: nc, background: nc + "12", padding: "1px 4px", borderRadius: 2, textTransform: "uppercase" }}>{n.type}</span>
                <span style={{ fontFamily: T.m, fontSize: 7, color: T.td }}>{topicLabel}</span>
              </div>
              <div style={{ fontFamily: T.f, fontSize: 9, color: T.tp, marginTop: 2, lineHeight: 1.4 }}>{n.text.length > 80 ? n.text.substring(0, 80) + "..." : n.text}</div>
            </div>);
          })}
          {openItems.length > 6 && <div style={{ fontFamily: T.m, fontSize: 8, color: T.td, marginTop: 4 }}>+{openItems.length - 6} more</div>}
        </div>

        {/* Pinned */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.m, fontSize: 8, color: T.amber, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>PINNED ({pinnedItems.length})</div>
          {pinnedItems.length === 0 && <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, fontStyle: "italic" }}>None</div>}
          {pinnedItems.slice(0, 5).map(function (n) {
            var topicLabel = (TOPICS.find(function (t) { return t.id === n.topic; }) || {}).label || "";
            return (<div key={n.id} style={{ padding: "4px 0", borderBottom: "1px solid " + T.border }}>
              <div style={{ fontFamily: T.m, fontSize: 7, color: T.td }}>{topicLabel}</div>
              <div style={{ fontFamily: T.f, fontSize: 9, color: T.tp, marginTop: 1, lineHeight: 1.4 }}>{n.text.length > 80 ? n.text.substring(0, 80) + "..." : n.text}</div>
            </div>);
          })}
        </div>

        {/* Quick Stats */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.m, fontSize: 8, color: T.teal, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>ESTATE CONTEXT</div>
          {[
            { l: "Sites", v: totalSites },
            { l: "Providers", v: providers.length },
            { l: "Topology", v: topo },
            { l: "Mgmt Model", v: mgmt },
          ].map(function (r) {
            return (<div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
              <span style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{r.l}</span>
              <span style={{ fontFamily: T.m, fontSize: 9, fontWeight: 600, color: T.tp }}>{r.v}</span>
            </div>);
          })}
        </div>
      </div>
    </div>
  </div>);
}
