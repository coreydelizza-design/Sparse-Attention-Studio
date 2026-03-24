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
var NOTE_TYPES = ["Observation", "Pain Point", "Constraint", "Decision", "Unknown", "Risk", "Opportunity", "Follow-Up", "Customer Quote", "GTT Relevance"];
var NOTE_COLORS = { Observation: T.blue, "Pain Point": T.red, Constraint: T.amber, Decision: T.green, Unknown: T.slate, Risk: T.red, Opportunity: T.green, "Follow-Up": T.violet, "Customer Quote": T.cyan, "GTT Relevance": T.teal };
var AI_ACTIONS = [
  { id: "analyze", label: "Analyze Notes", prompt: "Analyze these session notes from a network transformation workshop. Identify the 3-5 most important findings, risks, and actionable insights. Be concise (under 150 words). Format as bullet points." },
  { id: "findings", label: "Extract Findings", prompt: "From these session notes, extract specific technical findings. List each as a one-line bullet. Focus on facts, measurements, constraints, and confirmed issues. Under 120 words." },
  { id: "gaps", label: "Find Gaps", prompt: "Analyze these notes and identify what information is missing or unclear. What questions should be asked next? What assumptions need validation? Under 100 words, bullet format." },
  { id: "gtt", label: "Suggest GTT Plays", prompt: "Based on these notes from a network transformation session, suggest specific GTT solutions that address the issues discussed. Map each issue to a GTT product/service. Be specific and concise. Under 150 words." },
  { id: "next", label: "Draft Next Steps", prompt: "From these session notes, draft 3-5 specific next steps and follow-up actions. Include who should own each action if possible. Under 100 words." },
];

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
  var _annualSpend = useState("$4.2M"); var annualSpend = _annualSpend[0]; var setAnnualSpend = _annualSpend[1];
  var _complexity = useState({ "Acquired entities": true, "Legacy estates": true, "Regional exceptions": true, "Regulated sites": false, "Uptime-sensitive": true, "International": true }); var complexity = _complexity[0]; var setComplexity = _complexity[1];

  /* Strategy decisions */
  var _d1 = useState(""); var d1 = _d1[0]; var setD1 = _d1[1];
  var _d2 = useState(""); var d2 = _d2[0]; var setD2 = _d2[1];
  var _d3 = useState(""); var d3 = _d3[0]; var setD3 = _d3[1];
  var _d4 = useState(""); var d4 = _d4[0]; var setD4 = _d4[1];

  /* Lifecycle CPE (editable) */
  var _cpe = useState([
    { id: 1, device: "Cisco ISR 4331", qty: 87, age: "3-5 yr", status: "Aging", region: "US Branches", urgency: "medium" },
    { id: 2, device: "Cisco ASA 5506", qty: 38, age: "6+ yr", status: "EOL", region: "Pinnacle", urgency: "critical" },
    { id: 3, device: "FortiGate 60F", qty: 8, age: "<1 yr", status: "Current", region: "NE Pilot", urgency: "low" },
    { id: 4, device: "Cisco 2960X", qty: 125, age: "4-6 yr", status: "Aging", region: "All Sites", urgency: "medium" },
    { id: 5, device: "Cisco Aironet", qty: 340, age: "5-7 yr", status: "EOS", region: "All Sites", urgency: "high" },
  ]); var cpe = _cpe[0]; var setCpe = _cpe[1];
  function updCpe(id, f, v) { setCpe(cpe.map(function (c) { return c.id === id ? Object.assign({}, c, (function () { var o = {}; o[f] = v; return o; })()) : c; })); }

  /* Editable signals per topic */
  var _signals = useState({
    connectivity: ["MPLS rationalization — $2.1M contract non-renew creates displacement window", "SD-WAN attach — 8-site pilot proven, 125+ site expansion path", "Resiliency uplift — 45% of sites single-connected", "Provider consolidation — 6 providers to 1-2 strategic partners"],
    operations: ["Managed network services — no after-hours NOC, weak change governance", "EnvisionDX — fragmented monitoring, no single pane of glass", "Technical support overlay — multi-vendor coordination burden on customer IT", "MACD / change support — customer handling config manually"],
    lifecycle: ["Pinnacle CPE refresh — 38 EOL Cisco ASAs, natural modernization wedge", "Lifecycle support — standardize under managed lifecycle governance", "Wi-Fi refresh — 340 aging APs across all sites, Wi-Fi 6E opportunity", "Branch modernization bundle — CPE + SD-WAN + monitoring in one motion"],
    strategy: ["Phased SD-WAN — pilot proven, expand NE → SE → all regions", "Managed services wrapper — support simplification across full estate", "Provider consolidation — reduce from 6 to 1-2, simplify commercial", "Acquired entity fast-track — Pinnacle + NorthStar integration as early wins"],
  }); var signals = _signals[0]; var setSignals = _signals[1];
  var _newSig = useState(""); var newSig = _newSig[0]; var setNewSig = _newSig[1];
  function addSignal(topicKey) { if (!newSig.trim()) return; var u = Object.assign({}, signals); u[topicKey] = (u[topicKey] || []).concat([newSig.trim()]); setSignals(u); setNewSig(""); }
  function rmSignal(topicKey, idx) { var u = Object.assign({}, signals); u[topicKey] = (u[topicKey] || []).filter(function (_, i) { return i !== idx; }); setSignals(u); }

  /* Section-level notes */
  var _sectionNotes = useState({}); var sectionNotes = _sectionNotes[0]; var setSectionNotes = _sectionNotes[1];
  function getSectionNote(key) { return sectionNotes[key] || ""; }
  function setSectionNote(key, val) { var u = Object.assign({}, sectionNotes); u[key] = val; setSectionNotes(u); }

  /* GTT solution mapping */
  var GTT_SOLUTIONS = ["Managed SD-WAN", "DIA", "Broadband", "MPLS", "LTE / 5G Backup", "Security Edge / SASE", "SIP / Voice", "Cloud Connect", "EnvisionDX", "EnvisionEdge", "VDC", "Managed Network Services", "Lifecycle Support + Branch Modernization", "SD-WAN + Cloud Connect", "DIA + SD-WAN Greenfield", "Technical Support Add-On", "MACD / Change Support", "Monitoring / Management Support", "Other"];
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
  function updSol(id, f, v) { setSolutions(solutions.map(function (s) { return s.id === id ? Object.assign({}, s, (function () { var o = {}; o[f] = v; return o; })()) : s; })); }

  /* GTT Opportunity themes (editable) */
  var _themes = useState([
    { id: 1, theme: "MPLS rationalization + Managed SD-WAN", phase: "Phase 1", confidence: "High" },
    { id: 2, theme: "Branch resiliency uplift + LTE backup", phase: "Phase 1", confidence: "High" },
    { id: 3, theme: "Pinnacle CPE refresh + lifecycle support", phase: "Phase 1", confidence: "High" },
    { id: 4, theme: "Monitoring consolidation + EnvisionDX", phase: "Phase 2", confidence: "Medium" },
    { id: 5, theme: "Managed network services + 24x7 support", phase: "Phase 2", confidence: "Medium" },
    { id: 6, theme: "NorthStar greenfield + SD-WAN deploy", phase: "Phase 2", confidence: "Medium" },
  ]); var themes = _themes[0]; var setThemes = _themes[1];
  function updTheme(id, f, v) { setThemes(themes.map(function (t) { return t.id === id ? Object.assign({}, t, (function () { var o = {}; o[f] = v; return o; })()) : t; })); }

  /* ── AI Analysis State (per topic) ── */
  var _aiResults = useState({}); var aiResults = _aiResults[0]; var setAiResults = _aiResults[1];
  var _aiLoading = useState(null); var aiLoading = _aiLoading[0]; var setAiLoading = _aiLoading[1];

  function runAI(actionId) {
    var action = AI_ACTIONS.find(function (a) { return a.id === actionId; });
    if (!action) return;
    var topicNotes = (notes[topic] || []).map(function (n) { return "[" + n.type + "] " + n.text; }).join("\n");
    if (!topicNotes) { var u = Object.assign({}, aiResults); u[topic + "-" + actionId] = "No notes captured yet. Add notes first, then run analysis."; setAiResults(u); return; }
    var topicLabel = (TOPICS.find(function (t) { return t.id === topic; }) || {}).label || topic;
    setAiLoading(actionId);
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: "You are a senior network transformation consultant analyzing live session notes for the \"" + topicLabel + "\" topic.\n\n" + action.prompt + "\n\nSession notes:\n" + topicNotes }]
      })
    }).then(function (r) { return r.json(); }).then(function (d) {
      var text = d.content && d.content[0] ? d.content[0].text : "Analysis complete.";
      var u = Object.assign({}, aiResults); u[topic + "-" + actionId] = text; setAiResults(u);
      setAiLoading(null);
    }).catch(function () {
      var u = Object.assign({}, aiResults); u[topic + "-" + actionId] = "Unable to reach AI. Ensure API access is configured."; setAiResults(u);
      setAiLoading(null);
    });
  }

  function clearAI(actionId) {
    var u = Object.assign({}, aiResults); delete u[topic + "-" + actionId]; setAiResults(u);
  }

  function pinAIasNote(actionId) {
    var text = aiResults[topic + "-" + actionId];
    if (!text) return;
    var topicNotes = (notes[topic] || []).concat([{ id: Date.now(), type: "Opportunity", text: "[AI] " + text.substring(0, 200), pinned: true }]);
    var updated = Object.assign({}, notes);
    updated[topic] = topicNotes;
    setNotes(updated);
  }

  /* ═══════ RENDER HELPERS ═══════ */

  /* Section note input (compact, for any card) */
  function renderSectionNote(key, placeholder) {
    return (<div style={{ marginTop: 8 }}>
      <input value={getSectionNote(key)} onChange={function (e) { setSectionNote(key, e.target.value); }} placeholder={placeholder || "Add a note..."} style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
    </div>);
  }

  /* Editable signals list */
  function renderSignals(topicKey) {
    var list = signals[topicKey] || [];
    return (<div>
      {list.map(function (s, i) {
        return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: i < list.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp, flex: 1 }}>● {s}</span>
          <button onClick={function () { rmSignal(topicKey, i); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
        </div>);
      })}
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <input value={newSig} onChange={function (e) { setNewSig(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") addSignal(topicKey); }} placeholder="Add signal..." style={Object.assign({}, iS, { flex: 1, fontSize: 11 })} />
        <button onClick={function () { addSignal(topicKey); }} style={{ fontFamily: T.f, fontSize: 10, fontWeight: 600, color: "#fff", background: T.violet, border: "none", borderRadius: 5, padding: "6px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
      </div>
    </div>);
  }

  /* Notes panel (reused in every topic) */
  function renderNotes() {
    var topicNotes = notes[topic] || [];
    var pinned = topicNotes.filter(function (n) { return n.pinned; });
    var unpinned = topicNotes.filter(function (n) { return !n.pinned; });
    var hasActiveAI = AI_ACTIONS.some(function (a) { return aiResults[topic + "-" + a.id]; });
    return (<div>
      {/* Add note */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <select value={newNoteType} onChange={function (e) { setNewNoteType(e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, width: 100 })}>
          {NOTE_TYPES.map(function (t) { return <option key={t} value={t}>{t}</option>; })}
        </select>
        <input value={newNoteText} onChange={function (e) { setNewNoteText(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") addNote(); }} placeholder="Capture a note..." style={Object.assign({}, iS, { flex: 1, fontSize: 12 })} />
        <button onClick={addNote} style={{ fontFamily: T.f, fontSize: 10, fontWeight: 600, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
      </div>
      {/* AI Actions */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: T.f, fontSize: 9, color: T.td, display: "flex", alignItems: "center", marginRight: 4 }}>✦ AI:</span>
        {AI_ACTIONS.map(function (a) {
          var isActive = aiResults[topic + "-" + a.id];
          var isLoading = aiLoading === a.id;
          return <button key={a.id} onClick={function () { runAI(a.id); }} disabled={isLoading} style={{ fontFamily: T.f, fontSize: 9, color: isActive ? T.cyan : T.ts, background: isActive ? T.cyan + "08" : "transparent", border: "1px solid " + (isActive ? T.cyan + "33" : T.border), borderRadius: 4, padding: "3px 8px", cursor: isLoading ? "wait" : "pointer" }}>{isLoading ? "..." : a.label}</button>;
        })}
      </div>
      {/* AI Results */}
      {hasActiveAI && (<div style={{ marginBottom: 12 }}>
        {AI_ACTIONS.map(function (a) {
          var result = aiResults[topic + "-" + a.id];
          if (!result) return null;
          return (<div key={a.id} style={{ background: T.cyan + "04", borderRadius: 8, border: "1px solid " + T.cyan + "18", padding: "10px 12px", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11 }}>✦</span>
                <span style={{ fontFamily: T.f, fontSize: 10, fontWeight: 600, color: T.tp }}>{a.label}</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={function () { pinAIasNote(a.id); }} title="Pin as note" style={{ fontFamily: T.f, fontSize: 9, color: T.green, background: "none", border: "1px solid " + T.green + "33", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}>Pin</button>
                <button onClick={function () { runAI(a.id); }} title="Re-run" style={{ fontFamily: T.f, fontSize: 9, color: T.cyan, background: "none", border: "1px solid " + T.cyan + "33", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}>Re-run</button>
                <button onClick={function () { clearAI(a.id); }} title="Dismiss" style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
              </div>
            </div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{result}</div>
          </div>);
        })}
      </div>)}
      {/* Pinned notes */}
      {pinned.map(function (n) { return renderNoteCard(n); })}
      {/* Unpinned notes */}
      {unpinned.map(function (n) { return renderNoteCard(n); })}
      {!topicNotes.length && !hasActiveAI && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, fontStyle: "italic", padding: "12px 0" }}>No notes yet. Capture discussion points above.</div>}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Total Sites</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{totalSites}</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Regions</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{sites.length}</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Providers</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{providers.length}</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Data Centers</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{sites.filter(function (s) { return s.type === "Data Center"; }).length}</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Acquired Entities</div><div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>{sites.filter(function (s) { return s.type === "Acquired"; }).length}</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Annual Spend</div><input value={annualSpend} onChange={function (e) { setAnnualSpend(e.target.value); }} style={Object.assign({}, smI, { fontSize: 14, fontWeight: 700, width: 80, padding: "2px 6px" })} /></div>
        </div>
        <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 4 }}>Site Inventory</div>
        {sites.map(function (s, i) {
          return (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: i < sites.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.tp, width: 110, flexShrink: 0 }}>{s.region}</span>
            <select value={s.type} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { type: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["Branch", "Retail", "Acquired", "HQ / Campus", "Data Center", "DR Site", "Remote"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
            <input type="number" value={s.count} onChange={function (e) { setSites(sites.map(function (x) { return x.id === s.id ? Object.assign({}, x, { count: Number(e.target.value) || 0 }) : x; })); }} style={Object.assign({}, smI, { width: 40, textAlign: "center", fontSize: 10 })} />
            <span style={{ fontFamily: T.f, fontSize: 9, color: T.td, flex: 1 }}>{s.circuit} · {s.bandwidth}</span>
            <button onClick={function () { setSites(sites.filter(function (x) { return x.id !== s.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
          </div>);
        })}
        <button onClick={function () { setSites(sites.concat([{ id: Date.now(), region: "New Region", type: "Branch", count: 0, states: "", circuit: "MPLS", bandwidth: "100 Mbps", provider: "", notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 10, color: T.blue, background: "none", border: "1px dashed " + T.blue + "44", borderRadius: 5, padding: "5px 10px", cursor: "pointer", marginTop: 6, width: "100%" }}>+ Add Site Group</button>
        {renderSectionNote("estate-facts", "Note on estate baseline...")}
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Decisions & Open Items */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DECISIONS & OPEN ITEMS</div>
        <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginBottom: 6 }}>Structural complexity flags:</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(complexity).map(function (c) {
            var on = complexity[c];
            return <button key={c} onClick={function () { var u = Object.assign({}, complexity); u[c] = !on; setComplexity(u); }} style={{ fontFamily: T.f, fontSize: 10, padding: "4px 10px", borderRadius: 12, border: "1.5px solid " + (on ? T.blue : T.border), background: on ? T.blue + "10" : "transparent", color: on ? T.blue : T.td, cursor: "pointer" }}>{on ? "● " : "○ "}{c}</button>;
          })}
        </div>
        {renderSectionNote("estate-decisions", "Note on decisions...")}
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
          return (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: i < providers.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.tp, width: 70, flexShrink: 0 }}>{p.name}</span>
            <span style={{ fontFamily: T.f, fontSize: 10, color: T.ts, flex: 1 }}>{p.type} · {p.sites} sites</span>
            <span style={{ fontFamily: T.m, fontSize: 10, color: T.tp }}>{p.cost}</span>
            <span style={{ fontFamily: T.f, fontSize: 9, color: T.td, width: 55, flexShrink: 0 }}>{p.expiry}</span>
            <select value={p.action} onChange={function (e) { setProviders(providers.map(function (x) { return x.id === p.id ? Object.assign({}, x, { action: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["Retain", "Retain & Expand", "Non-Renew", "Early Terminate", "Renegotiate", "Evaluate"].map(function (o) { return <option key={o}>{o}</option>; })}</select>
          </div>);
        })}
        {renderSectionNote("conn-facts", "Note on connectivity baseline...")}
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
        {renderSignals("connectivity")}
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
        {renderSectionNote("ops-facts", "Note on operational posture...")}
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
        {renderSectionNote("ops-decisions", "Note on ops decisions...")}
      </div>
      {/* Opportunity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {renderSignals("operations")}
      </div>
    </div>);
  }

  function renderLifecycle() {
    var totalDevices = cpe.reduce(function (a, c) { return a + c.qty; }, 0);
    var eolPct = totalDevices > 0 ? Math.round(cpe.filter(function (c) { return c.status === "EOL" || c.status === "EOS"; }).reduce(function (a, c) { return a + c.qty; }, 0) / totalDevices * 100) : 0;
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Facts */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase" }}>FACTS — LIFECYCLE & REFRESH RISK</div>
          <button onClick={function () { setCpe(cpe.concat([{ id: Date.now(), device: "", qty: 0, age: "", status: "Current", region: "", urgency: "low" }])); }} style={{ fontFamily: T.f, fontSize: 9, color: T.blue, background: "none", border: "1px dashed " + T.blue + "44", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>+ Add Device</button>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Past EOS/EOL</div><div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.red }}>{eolPct}%</div></div>
          <div><div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Total Devices</div><div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.tp }}>{totalDevices}</div></div>
        </div>
        {cpe.map(function (c, i) {
          var uc = c.urgency === "critical" ? T.red : c.urgency === "high" ? T.amber : c.urgency === "medium" ? T.blue : T.td;
          var sc = c.status === "Current" ? T.green : c.status === "Aging" ? T.amber : T.red;
          return (<div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 0", borderBottom: i < cpe.length - 1 ? "1px solid " + T.border : "none" }}>
            <input value={c.device} onChange={function (e) { updCpe(c.id, "device", e.target.value); }} style={Object.assign({}, smI, { width: 110, fontSize: 10, fontWeight: 600 })} placeholder="Device..." />
            <input type="number" value={c.qty} onChange={function (e) { updCpe(c.id, "qty", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: 38, textAlign: "center", fontSize: 10 })} />
            <select value={c.status} onChange={function (e) { updCpe(c.id, "status", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9, color: sc })}>{["Current", "Aging", "EOS", "EOL"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
            <input value={c.region} onChange={function (e) { updCpe(c.id, "region", e.target.value); }} style={Object.assign({}, smI, { flex: 1, fontSize: 9 })} placeholder="Region..." />
            <select value={c.urgency} onChange={function (e) { updCpe(c.id, "urgency", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9, color: uc })}>{["low", "medium", "high", "critical"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
            <button onClick={function () { setCpe(cpe.filter(function (x) { return x.id !== c.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
          </div>);
        })}
        {renderSectionNote("lifecycle-facts", "Note on lifecycle risk...")}
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
        {renderSectionNote("lifecycle-decisions", "Note on refresh approach...")}
      </div>
      {/* Opportunity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {renderSignals("lifecycle")}
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
        {renderSectionNote("strategy-decisions", "Note on strategy decisions...")}
      </div>
      {/* Opportunity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>OPPORTUNITY SIGNALS</div>
        {renderSignals("strategy")}
      </div>
    </div>);
  }

  function renderGttPlays() {
    var _expSol = useState(null); var expSol = _expSol[0]; var setExpSol = _expSol[1];
    return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Solution Mapping */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.blue, letterSpacing: 1.2, textTransform: "uppercase" }}>GTT SOLUTION MAPPING</div>
          <button onClick={function () { setSolutions(solutions.concat([{ id: Date.now(), issue: "", solution: "Managed SD-WAN", confidence: "Medium", note: "" }])); }} style={{ fontFamily: T.f, fontSize: 9, color: T.blue, background: "none", border: "1px dashed " + T.blue + "44", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>+ Add Mapping</button>
        </div>
        {solutions.map(function (s, i) {
          var cc = s.confidence === "High" ? T.green : s.confidence === "Medium" ? T.amber : T.red;
          var isExp = expSol === s.id;
          return (<div key={s.id} style={{ borderBottom: i < solutions.length - 1 ? "1px solid " + T.border : "none" }}>
            <div onClick={function () { setExpSol(isExp ? null : s.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", cursor: "pointer" }}>
              <span style={{ fontSize: 9, color: T.td, transform: isExp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.issue || "(click to edit)"}</div>
              </div>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "12", padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>{s.solution}</span>
              <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{s.confidence}</span>
            </div>
            {isExp && (<div style={{ padding: "0 0 10px 17px", display: "flex", flexDirection: "column", gap: 6 }}>
              <input value={s.issue} onChange={function (e) { updSol(s.id, "issue", e.target.value); }} placeholder="Issue / requirement..." style={Object.assign({}, iS, { fontSize: 11 })} />
              <div style={{ display: "flex", gap: 6 }}>
                <select value={s.solution} onChange={function (e) { updSol(s.id, "solution", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, flex: 1 })}>{GTT_SOLUTIONS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
                <select value={s.confidence} onChange={function (e) { updSol(s.id, "confidence", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["High", "Medium", "Low"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
              </div>
              <input value={s.note} onChange={function (e) { updSol(s.id, "note", e.target.value); }} placeholder="Value note..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
              <button onClick={function () { setSolutions(solutions.filter(function (x) { return x.id !== s.id; })); setExpSol(null); }} style={{ fontFamily: T.f, fontSize: 9, color: T.red, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>Remove mapping</button>
            </div>)}
          </div>);
        })}
      </div>
      {/* Discussion */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.green, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>DISCUSSION</div>
        {renderNotes()}
      </div>
      {/* Opportunity Themes (editable) */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.violet, letterSpacing: 1.2, textTransform: "uppercase" }}>OPPORTUNITY THEMES</div>
          <button onClick={function () { setThemes(themes.concat([{ id: Date.now(), theme: "", phase: "Phase 1", confidence: "Medium" }])); }} style={{ fontFamily: T.f, fontSize: 9, color: T.violet, background: "none", border: "1px dashed " + T.violet + "44", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>+ Add Theme</button>
        </div>
        {themes.map(function (o, i) {
          var cc = o.confidence === "High" ? T.green : T.amber;
          return (<div key={o.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", borderBottom: i < themes.length - 1 ? "1px solid " + T.border : "none" }}>
            <input value={o.theme} onChange={function (e) { updTheme(o.id, "theme", e.target.value); }} placeholder="Opportunity theme..." style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} />
            <select value={o.phase} onChange={function (e) { updTheme(o.id, "phase", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["Phase 1", "Phase 2", "Phase 3", "Future"].map(function (p) { return <option key={p} value={p}>{p}</option>; })}</select>
            <select value={o.confidence} onChange={function (e) { updTheme(o.id, "confidence", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["High", "Medium", "Low"].map(function (p) { return <option key={p} value={p}>{p}</option>; })}</select>
            <button onClick={function () { setThemes(themes.filter(function (x) { return x.id !== o.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>
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
