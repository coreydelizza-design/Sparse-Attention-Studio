import { useState } from "react";
import { T, SECS, iS, selS, smI, lbl } from "../tokens";
import { SecHead, Decision, ScoreRow } from "../components/primitives";

/* ═══════ CONSTANTS ═══════ */
var TABS = [
  { id: "baseline", label: "Baseline", icon: "▣" },
  { id: "discussion", label: "Discussion", icon: "◎" },
  { id: "gttfit", label: "GTT Fit", icon: "⊕" },
];

var NOTE_TYPES = ["Observation", "Pain Point", "Constraint", "Decision", "Unknown", "Risk", "Opportunity", "Follow-Up", "Customer Quote", "GTT Relevance"];
var NOTE_COLORS = { Observation: T.blue, "Pain Point": T.red, Constraint: T.amber, Decision: T.green, Unknown: T.slate, Risk: T.red, Opportunity: T.green, "Follow-Up": T.violet, "Customer Quote": T.cyan, "GTT Relevance": T.teal };

var AI_ACTIONS = [
  { id: "analyze", label: "Analyze Notes", prompt: "Analyze these WAN transformation session notes. Identify the 3-5 most important WAN-specific findings, risks, and actionable insights. Focus on WAN underlay, SD-WAN, resiliency, providers, lifecycle, and managed services. Be concise (under 150 words). Bullet points." },
  { id: "findings", label: "Extract Findings", prompt: "From these WAN session notes, extract specific WAN technical findings — facts about MPLS, DIA, broadband, LTE, SD-WAN, providers, bandwidth, CPE, resiliency. One-line bullets. Under 120 words." },
  { id: "gaps", label: "Find Gaps", prompt: "What WAN-related information is missing or unclear from these notes? What questions about sites, providers, bandwidth, resiliency, or WAN management should be asked next? Under 100 words, bullet format." },
  { id: "gtt", label: "Suggest GTT Plays", prompt: "Based on these WAN session notes, suggest specific GTT WAN solutions: Managed SD-WAN, DIA, LTE/5G backup, EnvisionDX, Managed Network Services, lifecycle support, cloud connect. Map each WAN issue to a GTT solution. Under 150 words." },
  { id: "next", label: "Draft Next Steps", prompt: "From these WAN session notes, draft 3-5 specific WAN-related next steps and follow-up actions. Under 100 words." },
];

var GTT_WAN_SOLUTIONS = ["Managed SD-WAN", "DIA", "Broadband", "LTE / 5G Backup", "SD-WAN + Cloud Connect", "EnvisionDX", "Managed Network Services", "Lifecycle Support", "MACD / Change Support", "WAN Monitoring Overlay", "Branch Modernization", "Provider Consolidation", "Other"];

/* ═══════ COMPONENT ═══════ */
export default function NetworkEstateView({ sites, setSites, providers, setProviders, netEls, setNetEls, netFindings, setNetFindings, onNav }) {
  var sec = SECS.find(function (x) { return x.id === "estate"; });
  var totalSites = sites.reduce(function (a, s) { return a + s.count; }, 0);

  /* ── Active tab ── */
  var _tab = useState("baseline"); var tab = _tab[0]; var setTab = _tab[1];

  /* ═══════ BASELINE STATE ═══════ */
  var _wanTypes = useState({ MPLS: true, DIA: true, Broadband: true, "LTE/5G": true }); var wanTypes = _wanTypes[0]; var setWanTypes = _wanTypes[1];
  var _sdwan = useState("Pilot"); var sdwan = _sdwan[0]; var setSdwan = _sdwan[1];
  var _topo = useState("Hub-Spoke"); var topo = _topo[0]; var setTopo = _topo[1];
  var _mgmt = useState("Customer Managed"); var mgmt = _mgmt[0]; var setMgmt = _mgmt[1];
  var _sectionNotes = useState({}); var sectionNotes = _sectionNotes[0]; var setSectionNotes = _sectionNotes[1];
  function getSectionNote(key) { return sectionNotes[key] || ""; }
  function setSectionNote(key, val) { var u = Object.assign({}, sectionNotes); u[key] = val; setSectionNotes(u); }
  var _resiliency = useState([
    { label: "Dual-WAN / backup", score: 2 },
    { label: "Failover automation", score: 1 },
    { label: "Path diversity", score: 2 },
    { label: "Site-level SLA", score: 2 },
  ]); var resiliency = _resiliency[0]; var setResiliency = _resiliency[1];

  /* ═══════ DISCUSSION STATE ═══════ */
  var _notes = useState([
    { id: 1, type: "Observation", text: "AT&T MPLS covers 87 sites ($2.1M/yr), contract expires Dec 2026. Customer confirmed non-renew.", pinned: true },
    { id: 2, type: "Pain Point", text: "Hub-spoke forces all traffic through Dallas DC — +38ms latency for SaaS/cloud from branches.", pinned: true },
    { id: 3, type: "Risk", text: "45% of branch sites have no backup connectivity. Single point of failure on MPLS last-mile.", pinned: false },
    { id: 4, type: "Observation", text: "SD-WAN pilot running on 8 NE sites (FortiGate 60F) — 34% cost reduction proven.", pinned: false },
    { id: 5, type: "Pain Point", text: "SE cluster: 12% packet loss during peak hours, likely oversubscribed MPLS last-mile.", pinned: false },
    { id: 6, type: "Constraint", text: "Pinnacle acquired entity on separate Cisco ASA stack — 38 sites need CPE refresh before WAN migration.", pinned: true },
    { id: 7, type: "Customer Quote", text: "\"We need to get off MPLS but we can't afford downtime during the transition\" — VP Network Engineering.", pinned: false },
    { id: 8, type: "GTT Relevance", text: "Customer interested in managed SD-WAN with co-managed visibility model. EnvisionDX resonated.", pinned: false },
    { id: 9, type: "Decision", text: "MPLS full eliminate is the target. Retain only top-10 revenue sites during transition window.", pinned: true },
    { id: 10, type: "Follow-Up", text: "Need CPE serial number audit from Pinnacle NOC — owner not present today.", pinned: false },
  ]); var notes = _notes[0]; var setNotes = _notes[1];
  var _newText = useState(""); var newText = _newText[0]; var setNewText = _newText[1];
  var _newType = useState("Observation"); var newType = _newType[0]; var setNewType = _newType[1];

  function addNote() {
    if (!newText.trim()) return;
    setNotes(notes.concat([{ id: Date.now(), type: newType, text: newText.trim(), pinned: false }]));
    setNewText("");
  }
  function togglePin(id) { setNotes(notes.map(function (n) { return n.id === id ? Object.assign({}, n, { pinned: !n.pinned }) : n; })); }
  function removeNote(id) { setNotes(notes.filter(function (n) { return n.id !== id; })); }

  /* Strategy decisions */
  var _d1 = useState(""); var d1 = _d1[0]; var setD1 = _d1[1];
  var _d2 = useState(""); var d2 = _d2[0]; var setD2 = _d2[1];
  var _d3 = useState(""); var d3 = _d3[0]; var setD3 = _d3[1];

  /* ── AI State ── */
  var _aiResults = useState({}); var aiResults = _aiResults[0]; var setAiResults = _aiResults[1];
  var _aiLoading = useState(null); var aiLoading = _aiLoading[0]; var setAiLoading = _aiLoading[1];

  function runAI(actionId) {
    var action = AI_ACTIONS.find(function (a) { return a.id === actionId; });
    if (!action) return;
    var noteText = notes.map(function (n) { return "[" + n.type + "] " + n.text; }).join("\n");
    if (!noteText) { var u = Object.assign({}, aiResults); u[actionId] = "No notes captured yet. Add notes first."; setAiResults(u); return; }
    setAiLoading(actionId);
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600, messages: [{ role: "user", content: "You are a senior WAN transformation consultant analyzing live session notes.\n\n" + action.prompt + "\n\nSession notes:\n" + noteText }] })
    }).then(function (r) { return r.json(); }).then(function (d) {
      var text = d.content && d.content[0] ? d.content[0].text : "Analysis complete.";
      var u = Object.assign({}, aiResults); u[actionId] = text; setAiResults(u); setAiLoading(null);
    }).catch(function () {
      var u = Object.assign({}, aiResults); u[actionId] = "Unable to reach AI. Ensure API access is configured."; setAiResults(u); setAiLoading(null);
    });
  }
  function clearAI(id) { var u = Object.assign({}, aiResults); delete u[id]; setAiResults(u); }
  function pinAI(id) {
    var text = aiResults[id];
    if (!text) return;
    setNotes(notes.concat([{ id: Date.now(), type: "Opportunity", text: "[AI] " + text.substring(0, 300), pinned: true }]));
  }

  /* ═══════ GTT FIT STATE ═══════ */
  var _solutions = useState([
    { id: 1, issue: "Legacy MPLS — single provider, non-renew Dec 2026", solution: "Managed SD-WAN", confidence: "High", note: "Phased MPLS replacement by region" },
    { id: 2, issue: "45% of sites single-connected, no failover", solution: "LTE / 5G Backup", confidence: "High", note: "Resiliency uplift all branch tiers" },
    { id: 3, issue: "Pinnacle 38 sites — EOL Cisco ASA CPE", solution: "Branch Modernization", confidence: "High", note: "CPE refresh + SD-WAN in one motion" },
    { id: 4, issue: "Fragmented monitoring — 3 tools + spreadsheets", solution: "EnvisionDX", confidence: "Medium", note: "Single-pane WAN visibility" },
    { id: 5, issue: "No after-hours WAN support / weak change mgmt", solution: "Managed Network Services", confidence: "Medium", note: "24x7 NOC + MACD support overlay" },
    { id: 6, issue: "DC hairpin adding +38ms for cloud/SaaS", solution: "SD-WAN + Cloud Connect", confidence: "High", note: "Local breakout from branches" },
  ]); var solutions = _solutions[0]; var setSolutions = _solutions[1];
  var _expSol = useState(null); var expSol = _expSol[0]; var setExpSol = _expSol[1];
  function updSol(id, f, v) { setSolutions(solutions.map(function (s) { return s.id === id ? Object.assign({}, s, (function () { var o = {}; o[f] = v; return o; })()) : s; })); }

  /* ═══════ RENDER: BASELINE TAB ═══════ */
  function renderBaseline() {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* WAN Facts */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>WAN BASELINE</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { l: "Total Sites", v: totalSites },
            { l: "Regions", v: sites.length },
            { l: "WAN Providers", v: providers.length },
            { l: "SD-WAN Sites", v: "8 pilot" },
          ].map(function (f) {
            return <div key={f.l}><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{f.l}</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{f.v}</div></div>;
          })}
        </div>

        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>Topology</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {["Hub-Spoke", "Direct Internet", "Hybrid", "Mesh"].map(function (t) {
            var on = topo === t;
            return <button key={t} onClick={function () { setTopo(t); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 4, border: "1.5px solid " + (on ? T.blue : T.border), background: on ? T.blue + "12" : "transparent", color: on ? T.blue : T.td, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{t}</button>;
          })}
        </div>

        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>WAN Underlay Mix</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {Object.keys(wanTypes).map(function (w) {
            var on = wanTypes[w];
            return <button key={w} onClick={function () { var u = Object.assign({}, wanTypes); u[w] = !on; setWanTypes(u); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 12, border: "1.5px solid " + (on ? T.green : T.border), background: on ? T.green + "10" : "transparent", color: on ? T.green : T.td, cursor: "pointer" }}>{on ? "● " : "○ "}{w}</button>;
          })}
        </div>

        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>SD-WAN Overlay</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {["No", "Pilot", "Partial", "Full"].map(function (o) {
            var on = sdwan === o;
            return <button key={o} onClick={function () { setSdwan(o); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 4, border: "1.5px solid " + (on ? T.cyan : T.border), background: on ? T.cyan + "12" : "transparent", color: on ? T.cyan : T.td, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{o}</button>;
          })}
        </div>

        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>WAN Management</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {["Customer Managed", "Provider Managed", "Co-Managed", "GTT Managed"].map(function (m) {
            var on = mgmt === m;
            return <button key={m} onClick={function () { setMgmt(m); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 4, border: "1.5px solid " + (on ? T.blue : T.border), background: on ? T.blue + "12" : "transparent", color: on ? T.blue : T.td, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{m}</button>;
          })}
        </div>

        {/* Baseline Notes */}
        <div style={{ marginTop: 4 }}>
          <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>Baseline Notes</div>
          <textarea value={getSectionNote("wan-baseline")} onChange={function (e) { setSectionNote("wan-baseline", e.target.value); }} rows={2} placeholder="Capture WAN baseline context, observations, key facts..." style={{ fontFamily: T.f, fontSize: 11, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.5 }} />
        </div>
      </div>

      {/* Site Types */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase" }}>SITE TYPES</div>
          <button onClick={function () { setSites(sites.concat([{ id: Date.now(), region: "", type: "Branch", count: 0, states: "", circuit: "MPLS", bandwidth: "100 Mbps", provider: "", notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 9, color: T.blue, background: "none", border: "1px dashed " + T.blue + "44", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>+ Add</button>
        </div>
        {sites.map(function (s, i) {
          return (<div key={s.id} style={{ padding: "8px 0", borderBottom: i < sites.length - 1 ? "1px solid " + T.border : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select value={s.type} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { type: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10, fontWeight: 600 })}>{["Branch", "Acquired", "HQ / Campus", "Data Center", "DR Site", "Remote", "Retail", "Warehouse", "Contact Center"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
              <input type="number" value={s.count} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { count: Number(e.target.value) || 0 }) : x; })); }} style={Object.assign({}, smI, { width: 56, textAlign: "center", fontSize: 12, fontWeight: 600, padding: "5px 6px" })} />
              <select value={s.circuit} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { circuit: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["MPLS", "DIA", "Broadband", "LTE/5G", "MPLS+DIA", "BB+LTE", "Metro Eth", "Fiber P2P", "None"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
              <select value={s.bandwidth} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { bandwidth: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["10 Mbps", "25 Mbps", "50 Mbps", "100 Mbps", "200 Mbps", "500 Mbps", "1 Gbps", "10 Gbps"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
              <button onClick={function () { setSites(sites.filter(function (x) { return x.id !== s.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11 }}>✕</button>
            </div>
            <input value={s.notes || ""} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { notes: e.target.value }) : x; })); }} placeholder="Notes..." style={Object.assign({}, smI, { width: "100%", fontSize: 10, color: T.ts, marginTop: 4 })} />
          </div>);
        })}
      </div>

      {/* WAN Providers */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase" }}>WAN PROVIDERS</div>
          <button onClick={function () { setProviders(providers.concat([{ id: Date.now(), name: "Select Provider", type: "MPLS", sites: 0, cost: "", expiry: "", action: "Evaluate" }])); }} style={{ fontFamily: T.f, fontSize: 9, color: T.amber, background: "none", border: "1px dashed " + T.amber + "44", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>+ Add Provider</button>
        </div>
        {providers.map(function (p, i) {
          return (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", borderBottom: i < providers.length - 1 ? "1px solid " + T.border : "none" }}>
            <select value={p.name} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { name: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10, fontWeight: 600, width: 120 })}>
              {["Select Provider", "AT&T", "Verizon", "Lumen / CenturyLink", "Comcast", "Spectrum / Charter", "Cox", "Windstream", "Frontier", "Zayo", "Crown Castle", "Cogent", "GTT", "BT", "Vodafone", "Orange", "Deutsche Telekom / T-Systems", "Telia", "Colt", "NTT", "Singtel", "Telstra", "PCCW", "Tata Communications", "Reliance Jio", "América Móvil / Telmex", "Telefónica", "Liberty Latin America", "Millicom / Tigo", "T-Mobile", "Rogers", "Bell Canada", "Telus", "Shaw / Freedom", "Hughes", "Masergy / Comcast Business", "Aryaka", "Arelion", "euNetworks", "Console Connect / PCCW", "Megaport", "PacketFabric", "Equinix Fabric", "AWS Direct Connect", "Azure ExpressRoute", "Google Cloud Interconnect", "Other"].map(function (n) { return <option key={n} value={n}>{n}</option>; })}
            </select>
            <select value={p.type} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { type: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["MPLS", "DIA", "Broadband", "LTE/5G", "Backbone", "Cloud Interconnect", "Voice / SIP", "Mixed", "Other"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
            <input type="number" value={p.sites} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { sites: Number(e.target.value) || 0 }) : x; })); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 10 })} />
            <input value={p.cost} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { cost: e.target.value }) : x; })); }} placeholder="Cost..." style={Object.assign({}, smI, { width: 70, fontSize: 10 })} />
            <input value={p.expiry} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { expiry: e.target.value }) : x; })); }} placeholder="Expiry..." style={Object.assign({}, smI, { width: 65, fontSize: 10 })} />
            <select value={p.action} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { action: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["Retain", "Retain & Expand", "Non-Renew", "Early Terminate", "Renegotiate", "Evaluate"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
            <button onClick={function () { setProviders(providers.filter(function (x) { return x.id !== p.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11 }}>✕</button>
          </div>);
        })}
      </div>

      {/* WAN Resiliency */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.red, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>WAN RESILIENCY POSTURE</div>
        {resiliency.map(function (r, i) {
          return <div key={i} style={{ borderBottom: i < resiliency.length - 1 ? "1px solid " + T.border : "none" }}><ScoreRow label={r.label} score={r.score} onChange={function (v) { setResiliency(resiliency.map(function (x, j) { return j === i ? Object.assign({}, x, { score: v }) : x; })); }} color={T.blue} /></div>;
        })}
      </div>
    </div>);
  }

  /* ═══════ RENDER: DISCUSSION TAB ═══════ */
  function renderDiscussion() {
    var pinned = notes.filter(function (n) { return n.pinned; });
    var unpinned = notes.filter(function (n) { return !n.pinned; });
    var hasAI = AI_ACTIONS.some(function (a) { return aiResults[a.id]; });

    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Note Input */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>CAPTURE</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <select value={newType} onChange={function (e) { setNewType(e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, width: 110 })}>
            {NOTE_TYPES.map(function (t) { return <option key={t} value={t}>{t}</option>; })}
          </select>
          <input value={newText} onChange={function (e) { setNewText(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") addNote(); }} placeholder="Capture WAN discussion point..." style={Object.assign({}, iS, { flex: 1, fontSize: 12 })} />
          <button onClick={addNote} style={{ fontFamily: T.f, fontSize: 10, fontWeight: 600, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer" }}>+ Add</button>
        </div>

        {/* AI Actions */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.f, fontSize: 9, color: T.td, display: "flex", alignItems: "center", marginRight: 4 }}>✦ AI:</span>
          {AI_ACTIONS.map(function (a) {
            var active = aiResults[a.id];
            var loading = aiLoading === a.id;
            return <button key={a.id} onClick={function () { runAI(a.id); }} disabled={loading} style={{ fontFamily: T.f, fontSize: 9, color: active ? T.cyan : T.ts, background: active ? T.cyan + "08" : "transparent", border: "1px solid " + (active ? T.cyan + "33" : T.border), borderRadius: 4, padding: "3px 8px", cursor: loading ? "wait" : "pointer" }}>{loading ? "..." : a.label}</button>;
          })}
        </div>
      </div>

      {/* AI Results */}
      {hasAI && (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.cyan + "22", padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>✦ AI ANALYSIS</div>
        {AI_ACTIONS.map(function (a) {
          var result = aiResults[a.id];
          if (!result) return null;
          return (<div key={a.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: T.f, fontSize: 10, fontWeight: 600, color: T.tp }}>{a.label}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={function () { pinAI(a.id); }} style={{ fontFamily: T.f, fontSize: 9, color: T.green, background: "none", border: "1px solid " + T.green + "33", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}>Pin</button>
                <button onClick={function () { runAI(a.id); }} style={{ fontFamily: T.f, fontSize: 9, color: T.cyan, background: "none", border: "1px solid " + T.cyan + "33", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}>Re-run</button>
                <button onClick={function () { clearAI(a.id); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
              </div>
            </div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{result}</div>
          </div>);
        })}
      </div>)}

      {/* WAN Decisions */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>WAN DECISIONS</div>
        <Decision question="MPLS strategy?" options={["Full Eliminate", "Retain 10%", "Retain 20%", "Defer"]} selected={d1} onSelect={setD1} color={T.blue} />
        <div style={{ borderTop: "1px solid " + T.border, marginTop: 4 }} />
        <Decision question="Backup connectivity?" options={["LTE", "5G FWA", "Mixed by Tier", "Evaluate"]} selected={d2} onSelect={setD2} color={T.blue} />
        <div style={{ borderTop: "1px solid " + T.border, marginTop: 4 }} />
        <Decision question="WAN operations model?" options={["Self-Managed", "Managed", "Co-Managed", "Evaluate"]} selected={d3} onSelect={setD3} color={T.blue} />
      </div>

      {/* Notes */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>WAN TRANSFORMATION DISCUSSION NOTES ({notes.length})</div>
        {pinned.map(function (n) { return renderNoteCard(n); })}
        {unpinned.map(function (n) { return renderNoteCard(n); })}
        {!notes.length && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, fontStyle: "italic" }}>No notes yet. Capture WAN discussion points above.</div>}
      </div>
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

  /* ═══════ RENDER: GTT FIT TAB ═══════ */
  function renderGttFit() {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Solution Mapping */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.teal, letterSpacing: 1.2, textTransform: "uppercase" }}>GTT WAN SOLUTION FIT</div>
          <button onClick={function () { setSolutions(solutions.concat([{ id: Date.now(), issue: "", solution: "Managed SD-WAN", confidence: "Medium", note: "" }])); }} style={{ fontFamily: T.f, fontSize: 9, color: T.teal, background: "none", border: "1px dashed " + T.teal + "44", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>+ Add</button>
        </div>
        {solutions.map(function (s, i) {
          var cc = s.confidence === "High" ? T.green : s.confidence === "Medium" ? T.amber : T.red;
          var isExp = expSol === s.id;
          return (<div key={s.id} style={{ borderBottom: i < solutions.length - 1 ? "1px solid " + T.border : "none" }}>
            <div onClick={function () { setExpSol(isExp ? null : s.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", cursor: "pointer" }}>
              <span style={{ fontSize: 9, color: T.td, transform: isExp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
              <div style={{ flex: 1 }}><div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.issue || "(click to edit)"}</div></div>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "12", padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>{s.solution}</span>
              <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{s.confidence}</span>
            </div>
            {isExp && (<div style={{ padding: "0 0 10px 17px", display: "flex", flexDirection: "column", gap: 6 }}>
              <input value={s.issue} onChange={function (e) { updSol(s.id, "issue", e.target.value); }} placeholder="WAN issue or requirement..." style={Object.assign({}, iS, { fontSize: 11 })} />
              <div style={{ display: "flex", gap: 6 }}>
                <select value={s.solution} onChange={function (e) { updSol(s.id, "solution", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, flex: 1 })}>{GTT_WAN_SOLUTIONS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
                <select value={s.confidence} onChange={function (e) { updSol(s.id, "confidence", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["High", "Medium", "Low"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
              </div>
              <input value={s.note} onChange={function (e) { updSol(s.id, "note", e.target.value); }} placeholder="Value note..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
              <button onClick={function () { setSolutions(solutions.filter(function (x) { return x.id !== s.id; })); setExpSol(null); }} style={{ fontFamily: T.f, fontSize: 9, color: T.red, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>Remove</button>
            </div>)}
          </div>);
        })}
      </div>

      {/* WAN Modernization Path */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>WAN MODERNIZATION PATH</div>
        {[
          { theme: "MPLS elimination → Managed SD-WAN", phase: "Phase 1", conf: "High" },
          { theme: "Branch resiliency → LTE/5G backup", phase: "Phase 1", conf: "High" },
          { theme: "Pinnacle CPE refresh → branch modernization", phase: "Phase 1", conf: "High" },
          { theme: "WAN monitoring → EnvisionDX", phase: "Phase 2", conf: "Medium" },
          { theme: "WAN support → Managed Network Services", phase: "Phase 2", conf: "Medium" },
          { theme: "NorthStar greenfield → SD-WAN deploy", phase: "Phase 2", conf: "Medium" },
        ].map(function (o, i) {
          var cc = o.conf === "High" ? T.green : T.amber;
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < 5 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp, flex: 1 }}>{o.theme}</span>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "10", padding: "1px 6px", borderRadius: 3 }}>{o.phase}</span>
            <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>{o.conf}</span>
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
  var openItems = notes.filter(function (n) { return n.type === "Follow-Up" || n.type === "Risk" || n.type === "Unknown"; });
  var pinnedItems = notes.filter(function (n) { return n.pinned; });

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={sec} />

    {/* Tab Rail */}
    <div style={{ display: "flex", gap: 2, background: T.border, borderRadius: 8, padding: 3 }}>
      {TABS.map(function (t) {
        var active = tab === t.id;
        return <button key={t.id} onClick={function () { setTab(t.id); }} style={{ flex: 1, fontFamily: T.f, fontSize: 11, fontWeight: active ? 600 : 400, color: active ? "#fff" : T.ts, background: active ? T.blue : "transparent", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 12 }}>{t.icon}</span>{t.label}
        </button>;
      })}
    </div>

    {/* 2-Panel: Content + Context */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 14 }}>

      {/* Main Content */}
      <div>
        {tab === "baseline" && renderBaseline()}
        {tab === "discussion" && renderDiscussion()}
        {tab === "gttfit" && renderGttFit()}
      </div>

      {/* Right Context */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.m, fontSize: 8, color: T.red, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>OPEN ({openItems.length})</div>
          {openItems.length === 0 && <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, fontStyle: "italic" }}>None</div>}
          {openItems.slice(0, 5).map(function (n) {
            var nc = NOTE_COLORS[n.type] || T.td;
            return (<div key={n.id} style={{ padding: "4px 0", borderBottom: "1px solid " + T.border }}>
              <span style={{ fontFamily: T.m, fontSize: 7, color: nc, background: nc + "12", padding: "1px 4px", borderRadius: 2, textTransform: "uppercase" }}>{n.type}</span>
              <div style={{ fontFamily: T.f, fontSize: 9, color: T.tp, marginTop: 2, lineHeight: 1.4 }}>{n.text.length > 80 ? n.text.substring(0, 80) + "..." : n.text}</div>
            </div>);
          })}
        </div>

        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.m, fontSize: 8, color: T.amber, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>PINNED ({pinnedItems.length})</div>
          {pinnedItems.length === 0 && <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, fontStyle: "italic" }}>None</div>}
          {pinnedItems.slice(0, 5).map(function (n) {
            return (<div key={n.id} style={{ padding: "4px 0", borderBottom: "1px solid " + T.border }}>
              <div style={{ fontFamily: T.f, fontSize: 9, color: T.tp, lineHeight: 1.4 }}>{n.text.length > 80 ? n.text.substring(0, 80) + "..." : n.text}</div>
            </div>);
          })}
        </div>

        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "12px 14px" }}>
          <div style={{ fontFamily: T.m, fontSize: 8, color: T.teal, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>WAN CONTEXT</div>
          {[
            { l: "Sites", v: totalSites },
            { l: "Topology", v: topo },
            { l: "WAN Mgmt", v: mgmt },
            { l: "Providers", v: providers.length },
            { l: "Notes", v: notes.length },
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
