import { useState } from "react";
import { T, SM, SECS, iS, selS, smI, lbl } from "../tokens";
import { SecHead, PrimaryCard, Disc, Bar, Ring } from "../components/primitives";

/* ═══════ CONSTANTS ═══════ */
var STATUS_OPTS = ["Active", "Pilot", "Pending", "Contracted"];
var CIRCUIT_TYPES = ["DIA", "Broadband", "MPLS", "Ethernet", "LTE / 5G", "Internet + LTE", "Dual Broadband", "Private Line", "Cloud Interconnect", "SIP Transport", "Other"];
var BW_BANDS = ["<50 Mbps", "50–100 Mbps", "100–250 Mbps", "250–500 Mbps", "500 Mbps–1 Gbps", "1 Gbps+"];
var SVC_CATEGORIES = ["DIA", "Broadband", "MPLS", "SD-WAN", "SIP / Voice", "Security / SASE", "Cloud Connect", "LTE / Wireless", "Managed Services", "EnvisionDX", "EnvisionEdge", "VDC"];

function statusColor(s) { return s === "Active" ? T.green : s === "Pilot" ? T.cyan : s === "Pending" ? T.amber : s === "Contracted" ? T.blue : T.td; }
function confColor(c) { return c === "Verified" ? T.green : c === "Estimated" ? T.amber : T.red; }
function penColor(p) { return p >= 70 ? T.green : p >= 40 ? T.amber : T.red; }

/* ═══════ FOOTPRINT VIEW ═══════ */
function FootprintView({ onNav }) {
  /* ── Mode toggle ── */
  var _mode = useState("studio"); var mode = _mode[0]; var setMode = _mode[1];
  var isPrep = mode === "prep";

  /* ── Baseline Integrity ── */
  var _integrity = useState({
    preparedBy: "Karen Nguyen, Sr. Solutions Architect",
    lastUpdated: "2026-03-22",
    confidence: "High",
    completeness: 82,
    pendingItems: 3,
    sources: "CRM, Billing, Service Inventory, Account Team"
  }); var integrity = _integrity[0]; var setIntegrity = _integrity[1];

  /* ── Services ── */
  var _svcs = useState([
    { id: 1, name: "DIA", category: "DIA", status: "Active", qty: 44, siteCt: 42, regionCt: 5, mrr: 56, contractId: "CTR-2024-DIA", circuits: ["DIA"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 18 }, { band: "100–250 Mbps", qty: 16 }, { band: "250–500 Mbps", qty: 6 }, { band: "500 Mbps–1 Gbps", qty: 2 }, { band: "1 Gbps+", qty: 2 }], confidence: "Verified", owner: "Karen Nguyen", notes: "" },
    { id: 2, name: "MPLS", category: "MPLS", status: "Active", qty: 87, siteCt: 87, regionCt: 6, mrr: 175, contractId: "CTR-2022-MPLS", circuits: ["MPLS"], bwDist: [{ band: "<50 Mbps", qty: 22 }, { band: "50–100 Mbps", qty: 48 }, { band: "100–250 Mbps", qty: 12 }, { band: "250–500 Mbps", qty: 5 }, { band: "500 Mbps–1 Gbps", qty: 0 }, { band: "1 Gbps+", qty: 0 }], confidence: "Verified", owner: "Karen Nguyen", notes: "AT&T contract — non-renew Dec 2026" },
    { id: 3, name: "Broadband", category: "Broadband", status: "Active", qty: 12, siteCt: 12, regionCt: 1, mrr: 8, contractId: "CTR-2024-BB", circuits: ["Broadband"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 0 }, { band: "100–250 Mbps", qty: 8 }, { band: "250–500 Mbps", qty: 4 }, { band: "500 Mbps–1 Gbps", qty: 0 }, { band: "1 Gbps+", qty: 0 }], confidence: "Verified", owner: "Karen Nguyen", notes: "NorthStar Wealth greenfield sites" },
    { id: 4, name: "SD-WAN (Managed)", category: "SD-WAN", status: "Pilot", qty: 8, siteCt: 8, regionCt: 1, mrr: 12, contractId: "CTR-2025-SDWAN", circuits: ["Internet + LTE"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 0 }, { band: "100–250 Mbps", qty: 6 }, { band: "250–500 Mbps", qty: 2 }, { band: "500 Mbps–1 Gbps", qty: 0 }, { band: "1 Gbps+", qty: 0 }], confidence: "Verified", owner: "Karen Nguyen", notes: "NE pilot — FortiGate 60F" },
    { id: 5, name: "SIP / Voice", category: "SIP / Voice", status: "Active", qty: 35, siteCt: 35, regionCt: 4, mrr: 22, contractId: "CTR-2023-SIP", circuits: ["SIP Transport"], bwDist: [], confidence: "Verified", owner: "Karen Nguyen", notes: "" },
    { id: 6, name: "Cloud Connect (AWS)", category: "Cloud Connect", status: "Active", qty: 2, siteCt: 2, regionCt: 1, mrr: 18, contractId: "CTR-2024-CC", circuits: ["Cloud Interconnect"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 0 }, { band: "100–250 Mbps", qty: 0 }, { band: "250–500 Mbps", qty: 0 }, { band: "500 Mbps–1 Gbps", qty: 1 }, { band: "1 Gbps+", qty: 1 }], confidence: "Verified", owner: "Rachel Patel", notes: "Dallas DC + Ashburn DC" },
    { id: 7, name: "LTE Backup", category: "LTE / Wireless", status: "Active", qty: 35, siteCt: 35, regionCt: 3, mrr: 8, contractId: "CTR-2024-LTE", circuits: ["LTE / 5G"], bwDist: [], confidence: "Estimated", owner: "Karen Nguyen", notes: "Verizon + T-Mobile mix" },
    { id: 8, name: "EnvisionDX", category: "EnvisionDX", status: "Pilot", qty: 8, siteCt: 8, regionCt: 1, mrr: 4, contractId: "PILOT-EDX", circuits: ["DIA"], bwDist: [], confidence: "Verified", owner: "Steve Morrison", notes: "Monitoring overlay — NE pilot sites" },
    { id: 9, name: "Security / SASE", category: "Security / SASE", status: "Pending", qty: 0, siteCt: 0, regionCt: 0, mrr: 0, contractId: "", circuits: [], bwDist: [], confidence: "Unvalidated", owner: "", notes: "No GTT security services — identified gap" },
    { id: 10, name: "Cloud Connect (Azure)", category: "Cloud Connect", status: "Pending", qty: 0, siteCt: 0, regionCt: 0, mrr: 0, contractId: "", circuits: ["Cloud Interconnect"], bwDist: [], confidence: "Unvalidated", owner: "", notes: "ExpressRoute not yet sold — adjacency signal" },
  ]); var svcs = _svcs[0]; var setSvcs = _svcs[1];

  /* ── Regions ── */
  var _regions = useState([
    { id: 1, name: "Northeast US", sites: 34, gttSites: 34, services: ["MPLS", "DIA", "SIP", "LTE", "SD-WAN", "EnvisionDX"], entity: "Core", penetration: 72 },
    { id: 2, name: "Southeast US", sites: 28, gttSites: 22, services: ["MPLS", "DIA", "SIP"], entity: "Core", penetration: 58 },
    { id: 3, name: "Midwest US", sites: 22, gttSites: 14, services: ["MPLS", "DIA"], entity: "Core", penetration: 42 },
    { id: 4, name: "West US", sites: 19, gttSites: 14, services: ["MPLS", "DIA", "LTE"], entity: "Core", penetration: 55 },
    { id: 5, name: "Canada", sites: 22, gttSites: 12, services: ["MPLS", "DIA"], entity: "Core", penetration: 38 },
    { id: 6, name: "Pinnacle Insurance", sites: 38, gttSites: 38, services: ["MPLS"], entity: "Acquired", penetration: 15 },
    { id: 7, name: "NorthStar Wealth", sites: 12, gttSites: 0, services: [], entity: "Acquired", penetration: 0 },
    { id: 8, name: "Data Centers / DR", sites: 3, gttSites: 3, services: ["DIA", "Cloud Connect", "MPLS", "SIP", "EnvisionDX"], entity: "Core", penetration: 92 },
  ]); var regions = _regions[0]; var setRegions = _regions[1];

  /* ── Contracts ── */
  var _contracts = useState([
    { id: 1, name: "MPLS Master", service: "MPLS", value: "$2.1M/yr", term: "36 mo", renewal: "Dec 2026", status: "At Risk", sites: 87, notes: "Non-renew — transition to SD-WAN" },
    { id: 2, name: "DIA Bundle", service: "DIA", value: "$680K/yr", term: "M2M", renewal: "M2M", status: "Healthy", sites: 42, notes: "Expand as SD-WAN underlay" },
    { id: 3, name: "SIP / Voice", service: "SIP / Voice", value: "$264K/yr", term: "24 mo", renewal: "Jun 2027", status: "Healthy", sites: 35, notes: "" },
    { id: 4, name: "Cloud Connect", service: "Cloud Connect", value: "$216K/yr", term: "24 mo", renewal: "2027", status: "Healthy", sites: 2, notes: "AWS Direct Connect — expand to Azure" },
    { id: 5, name: "SD-WAN Pilot", service: "SD-WAN", value: "$144K/yr", term: "12 mo", renewal: "Q3 2026", status: "Pilot", sites: 8, notes: "Convert to production contract" },
    { id: 6, name: "EnvisionDX Pilot", service: "EnvisionDX", value: "$48K/yr", term: "6 mo", renewal: "Q1 2026", status: "Pilot", sites: 8, notes: "Expand to full deployment" },
    { id: 7, name: "LTE Backup", service: "LTE / Wireless", value: "$96K/yr", term: "Annual", renewal: "Annual", status: "Healthy", sites: 35, notes: "" },
  ]); var contracts = _contracts[0]; var setContracts = _contracts[1];

  /* ── Gaps ── */
  var gaps = [
    { label: "Security / SASE — zero GTT presence", type: "Service Gap", severity: "critical" },
    { label: "NorthStar Wealth — 12 sites, no GTT services", type: "Coverage Gap", severity: "critical" },
    { label: "Pinnacle Insurance — single-product (MPLS only)", type: "Low Penetration", severity: "high" },
    { label: "Azure ExpressRoute — not sold", type: "Adjacency", severity: "high" },
    { label: "SD-WAN pilot — 8 sites, not converted to production", type: "Unconverted Pilot", severity: "high" },
    { label: "EnvisionDX pilot — not expanded beyond NE", type: "Unconverted Pilot", severity: "medium" },
    { label: "Canada — no LTE backup deployed (22 sites)", type: "Service Gap", severity: "medium" },
    { label: "Midwest / West — limited service diversity", type: "Low Penetration", severity: "medium" },
  ];

  /* ── Add service form ── */
  var _showAdd = useState(false); var showAdd = _showAdd[0]; var setShowAdd = _showAdd[1];
  var _newSvc = useState({ name: "", category: "DIA", status: "Active", qty: 1, siteCt: 1, regionCt: 1, mrr: 0, contractId: "", circuits: ["DIA"], confidence: "Estimated", owner: "", notes: "" }); var newSvc = _newSvc[0]; var setNewSvc = _newSvc[1];
  function addService() {
    if (!newSvc.name) return;
    setSvcs(svcs.concat([Object.assign({}, newSvc, { id: Date.now(), bwDist: BW_BANDS.map(function (b) { return { band: b, qty: 0 }; }) })]));
    setNewSvc({ name: "", category: "DIA", status: "Active", qty: 1, siteCt: 1, regionCt: 1, mrr: 0, contractId: "", circuits: ["DIA"], confidence: "Estimated", owner: "", notes: "" });
    setShowAdd(false);
  }

  /* ── Expand service detail ── */
  var _expSvc = useState(null); var expSvc = _expSvc[0]; var setExpSvc = _expSvc[1];

  /* ── Computed ── */
  var activeSvcs = svcs.filter(function (s) { return s.status === "Active"; });
  var totalMRR = svcs.reduce(function (a, s) { return a + s.mrr; }, 0);
  var totalSites = regions.reduce(function (a, r) { return a + r.sites; }, 0);
  var gttSites = regions.reduce(function (a, r) { return a + r.gttSites; }, 0);
  var totalQty = svcs.reduce(function (a, s) { return a + s.qty; }, 0);

  /* BW aggregation */
  var bwAgg = BW_BANDS.map(function (band) {
    var total = svcs.reduce(function (a, s) {
      var match = (s.bwDist || []).find(function (b) { return b.band === band; });
      return a + (match ? match.qty : 0);
    }, 0);
    return { band: band, qty: total };
  });
  var bwTotal = bwAgg.reduce(function (a, b) { return a + b.qty; }, 0);

  /* Circuit aggregation */
  var circuitAgg = {};
  svcs.forEach(function (s) {
    (s.circuits || []).forEach(function (c) {
      circuitAgg[c] = (circuitAgg[c] || 0) + s.qty;
    });
  });
  var circuitList = Object.keys(circuitAgg).sort(function (a, b) { return circuitAgg[b] - circuitAgg[a]; });

  /* Helper to update service field */
  function updSvc(id, field, value) {
    setSvcs(svcs.map(function (s) { return s.id === id ? Object.assign({}, s, (function () { var o = {}; o[field] = value; return o; })()) : s; }));
  }

  /* Helper to update bandwidth qty in a service */
  function updBw(svcId, band, qty) {
    setSvcs(svcs.map(function (s) {
      if (s.id !== svcId) return s;
      var newDist = (s.bwDist || []).map(function (b) { return b.band === band ? { band: b.band, qty: Math.max(0, qty) } : b; });
      return Object.assign({}, s, { bwDist: newDist });
    }));
  }

  var sevColor = function (s) { return s === "critical" ? T.red : s === "high" ? T.amber : T.blue; };
  var ctrStatusColor = function (s) { return s === "Healthy" ? T.green : s === "At Risk" ? T.red : s === "Pilot" ? T.cyan : T.td; };

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <SecHead s={SECS.find(function (x) { return x.id === "footprint"; })} />
      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: 4, background: T.border, borderRadius: 6, padding: 3, flexShrink: 0 }}>
        {["studio", "prep"].map(function (m) {
          var active = mode === m;
          return <button key={m} onClick={function () { setMode(m); }} style={{ fontFamily: T.f, fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "#fff" : T.ts, background: active ? (m === "prep" ? T.teal : T.blue) : "transparent", border: "none", borderRadius: 4, padding: "5px 14px", cursor: "pointer", textTransform: "uppercase" }}>{m === "studio" ? "Studio Mode" : "Prep Mode"}</button>;
        })}
      </div>
    </div>

    {/* ═══ ROW 1: Baseline Summary + Integrity ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14 }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { label: "Active Services", value: activeSvcs.length, sub: svcs.length + " total (incl. pilot/pending)", color: T.teal },
          { label: "GTT-Enabled Sites", value: gttSites + " / " + totalSites, sub: Math.round(gttSites / totalSites * 100) + "% site coverage", color: T.blue },
          { label: "Current MRR", value: "$" + totalMRR + "K", sub: "$" + (totalMRR * 12) + "K ARR", color: T.green },
          { label: "Active Contracts", value: contracts.length, sub: contracts.filter(function (c) { return c.status === "Pilot"; }).length + " pilots · " + contracts.filter(function (c) { return c.status === "At Risk"; }).length + " at risk", color: T.amber },
        ].map(function (c) {
          return (<div key={c.label} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "14px 16px" }}>
            <div style={{ fontFamily: T.m, fontSize: 9, color: c.color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.tp }}>{c.value}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 2 }}>{c.sub}</div>
          </div>);
        })}
      </div>

      {/* Baseline Integrity */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "14px 16px", width: isPrep ? 280 : 210 }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.teal, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>BASELINE INTEGRITY</div>
        {isPrep ? (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div><label style={lbl}>Prepared By</label><input value={integrity.preparedBy} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { preparedBy: e.target.value })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
          <div><label style={lbl}>Last Updated</label><input type="date" value={integrity.lastUpdated} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { lastUpdated: e.target.value })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
          <div><label style={lbl}>Data Confidence</label><select value={integrity.confidence} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { confidence: e.target.value })); }} style={Object.assign({}, selS, { width: "100%", fontSize: 10 })}>{["High", "Medium", "Low"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select></div>
          <div><label style={lbl}>Completeness %</label><input type="number" min={0} max={100} value={integrity.completeness} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { completeness: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10, textAlign: "center" })} /></div>
          <div><label style={lbl}>Pending Validation Items</label><input type="number" min={0} value={integrity.pendingItems} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { pendingItems: Math.max(0, Number(e.target.value) || 0) })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10, textAlign: "center" })} /></div>
          <div><label style={lbl}>Source Systems</label><input value={integrity.sources} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { sources: e.target.value })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
        </div>) : (<>
          {[
            { k: "Prepared By", v: integrity.preparedBy },
            { k: "Last Updated", v: integrity.lastUpdated },
            { k: "Data Confidence", v: integrity.confidence },
            { k: "Completeness", v: integrity.completeness + "%" },
            { k: "Pending Items", v: integrity.pendingItems },
          ].map(function (r) {
            var isConf = r.k === "Data Confidence";
            return (<div key={r.k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
              <span style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{r.k}</span>
              <span style={{ fontFamily: T.m, fontSize: 9, fontWeight: 600, color: isConf ? confColor(r.v) : T.tp }}>{r.v}</span>
            </div>);
          })}
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid " + T.border }}>
            <div style={{ fontFamily: T.f, fontSize: 8, color: T.td }}>Sources: {integrity.sources}</div>
          </div>
        </>)}
      </div>
    </div>

    {/* ═══ ROW 2: Installed Service Baseline ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>INSTALLED SERVICE BASELINE</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{svcs.length} services · {totalQty} circuits/instances</div>
        </div>
        {isPrep && <button onClick={function () { setShowAdd(!showAdd); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.teal, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>{showAdd ? "Cancel" : "+ Add Service"}</button>}
      </div>

      {/* Add Service Form (prep only) */}
      {showAdd && isPrep && (<div style={{ padding: "14px 18px", background: T.teal + "04", borderBottom: "1px solid " + T.border }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 120 }}><label style={lbl}>Service Name</label><input value={newSvc.name} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { name: e.target.value })); }} placeholder="e.g. DIA, SD-WAN..." style={iS} /></div>
          <div style={{ flex: 1, minWidth: 100 }}><label style={lbl}>Category</label><select value={newSvc.category} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { category: e.target.value })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{SVC_CATEGORIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}</select></div>
          <div style={{ flex: 1, minWidth: 80 }}><label style={lbl}>Status</label><select value={newSvc.status} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { status: e.target.value })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{STATUS_OPTS.map(function (s) { return <option key={s} value={s}>{s}</option>; })}</select></div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <div style={{ width: 70 }}><label style={lbl}>Qty</label><input type="number" value={newSvc.qty} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { qty: Number(e.target.value) || 0 })); }} style={Object.assign({}, iS, { textAlign: "center" })} /></div>
          <div style={{ width: 70 }}><label style={lbl}>Sites</label><input type="number" value={newSvc.siteCt} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { siteCt: Number(e.target.value) || 0 })); }} style={Object.assign({}, iS, { textAlign: "center" })} /></div>
          <div style={{ width: 80 }}><label style={lbl}>MRR ($K)</label><input type="number" value={newSvc.mrr} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { mrr: Number(e.target.value) || 0 })); }} style={Object.assign({}, iS, { textAlign: "center" })} /></div>
          <div style={{ flex: 1, minWidth: 100 }}><label style={lbl}>Circuit Type</label><select value={newSvc.circuits[0] || ""} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { circuits: [e.target.value] })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{CIRCUIT_TYPES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}</select></div>
          <div style={{ flex: 1, minWidth: 100 }}><label style={lbl}>Contract ID</label><input value={newSvc.contractId} onChange={function (e) { setNewSvc(Object.assign({}, newSvc, { contractId: e.target.value })); }} placeholder="CTR-..." style={iS} /></div>
        </div>
        <button onClick={addService} disabled={!newSvc.name} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: newSvc.name ? T.teal : T.td, border: "none", borderRadius: 5, padding: "6px 16px", cursor: newSvc.name ? "pointer" : "not-allowed" }}>Add to Baseline</button>
      </div>)}

      {/* Service rows */}
      <div style={{ padding: "6px 18px" }}>
        {svcs.map(function (s, i) {
          var sc = statusColor(s.status);
          var cc = confColor(s.confidence);
          var isExp = expSvc === s.id;
          return (<div key={s.id} style={{ borderBottom: i < svcs.length - 1 ? "1px solid " + T.border : "none" }}>
            <div onClick={function () { setExpSvc(isExp ? null : s.id); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer" }}>
              <span style={{ fontSize: 9, color: T.td, transform: isExp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
              <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 58, textAlign: "center", flexShrink: 0 }}>{s.status}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.name}</div>
                <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{s.category} · {s.siteCt} sites · {s.qty} qty · {(s.circuits || []).join(", ")}</div>
              </div>
              <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{s.confidence}</span>
              <span style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: s.mrr > 0 ? T.tp : T.td, width: 55, textAlign: "right", flexShrink: 0 }}>{s.mrr > 0 ? "$" + s.mrr + "K" : "—"}</span>
            </div>

            {/* Expanded detail / edit */}
            {isExp && (<div style={{ padding: "0 0 12px 27px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                {isPrep ? (<>
                  <div style={{ width: 60 }}><label style={lbl}>Qty</label><input type="number" value={s.qty} onChange={function (e) { updSvc(s.id, "qty", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { textAlign: "center", width: "100%" })} /></div>
                  <div style={{ width: 60 }}><label style={lbl}>Sites</label><input type="number" value={s.siteCt} onChange={function (e) { updSvc(s.id, "siteCt", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { textAlign: "center", width: "100%" })} /></div>
                  <div style={{ width: 70 }}><label style={lbl}>MRR ($K)</label><input type="number" value={s.mrr} onChange={function (e) { updSvc(s.id, "mrr", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { textAlign: "center", width: "100%" })} /></div>
                  <div style={{ width: 80 }}><label style={lbl}>Status</label><select value={s.status} onChange={function (e) { updSvc(s.id, "status", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, width: "100%" })}>{STATUS_OPTS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select></div>
                  <div style={{ width: 90 }}><label style={lbl}>Confidence</label><select value={s.confidence} onChange={function (e) { updSvc(s.id, "confidence", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, width: "100%" })}>{["Verified", "Estimated", "Unvalidated"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select></div>
                  <div style={{ flex: 1, minWidth: 100 }}><label style={lbl}>Contract</label><input value={s.contractId} onChange={function (e) { updSvc(s.id, "contractId", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                </>) : (<>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {[["Qty", s.qty], ["Sites", s.siteCt], ["Regions", s.regionCt], ["MRR", "$" + s.mrr + "K"], ["Contract", s.contractId || "—"], ["Owner", s.owner || "—"]].map(function (r) {
                      return <div key={r[0]}><span style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{r[0]}</span><div style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp }}>{r[1]}</div></div>;
                    })}
                  </div>
                </>)}
              </div>

              {/* Bandwidth distribution (prep mode: editable sliders) */}
              {s.bwDist && s.bwDist.length > 0 && (<div style={{ marginTop: 6 }}>
                <div style={{ fontFamily: T.m, fontSize: 8, color: T.td, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Bandwidth Distribution</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.bwDist.map(function (b) {
                    return (<div key={b.band} style={{ textAlign: "center", minWidth: 65 }}>
                      <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 3 }}>{b.band}</div>
                      {isPrep ? (
                        <input type="number" min={0} value={b.qty} onChange={function (e) { updBw(s.id, b.band, Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: 45, textAlign: "center", fontSize: 11, fontWeight: 600 })} />
                      ) : (
                        <div style={{ fontFamily: T.m, fontSize: 13, fontWeight: 700, color: b.qty > 0 ? T.tp : T.td }}>{b.qty}</div>
                      )}
                    </div>);
                  })}
                </div>
              </div>)}

              {/* Notes */}
              {isPrep ? (
                <div style={{ marginTop: 8 }}><label style={lbl}>Notes</label><input value={s.notes} onChange={function (e) { updSvc(s.id, "notes", e.target.value); }} placeholder="Service notes..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} /></div>
              ) : s.notes ? (
                <div style={{ fontFamily: T.f, fontSize: 10, color: T.ts, marginTop: 6 }}>{s.notes}</div>
              ) : null}
            </div>)}
          </div>);
        })}
      </div>
    </div>

    {/* ═══ ROW 3: Penetration + Circuit/BW ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      {/* Product Penetration */}
      <PrimaryCard tag="PRODUCT PENETRATION" tagColor={T.blue} title="Service mix by site base">
        {SVC_CATEGORIES.map(function (cat, i) {
          var svc = svcs.find(function (s) { return s.category === cat; });
          var pct = svc && totalSites > 0 ? Math.round(svc.siteCt / totalSites * 100) : 0;
          var active = svc && (svc.status === "Active" || svc.status === "Pilot");
          return (<div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < SVC_CATEGORIES.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 10, color: active ? T.tp : T.td, width: 110, flexShrink: 0 }}>{cat}</span>
            <div style={{ flex: 1, height: 6, background: T.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: Math.max(pct, pct > 0 ? 2 : 0) + "%", height: "100%", background: pct >= 30 ? T.green : pct >= 10 ? T.amber : pct > 0 ? T.red : T.td + "33", borderRadius: 3 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 9, fontWeight: 600, color: pct >= 30 ? T.green : pct >= 10 ? T.amber : pct > 0 ? T.red : T.td, width: 28, textAlign: "right" }}>{pct}%</span>
          </div>);
        })}
      </PrimaryCard>

      {/* Circuit & Bandwidth Profile */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <span style={{ fontFamily: T.m, fontSize: 9, color: T.violet, background: T.violet + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>CIRCUIT & BANDWIDTH</span>
        <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 10 }}>Profile summary</div>

        {/* Circuit type breakdown */}
        <div style={{ fontFamily: T.m, fontSize: 8, color: T.td, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Circuit Types</div>
        {circuitList.map(function (c, i) {
          var pct = totalQty > 0 ? Math.round(circuitAgg[c] / totalQty * 100) : 0;
          return (<div key={c} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <span style={{ fontFamily: T.f, fontSize: 10, color: T.tp, width: 100, flexShrink: 0 }}>{c}</span>
            <div style={{ flex: 1, height: 5, background: T.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", background: T.violet, borderRadius: 3 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.tp, width: 24, textAlign: "right" }}>{circuitAgg[c]}</span>
          </div>);
        })}

        {/* Bandwidth distribution */}
        <div style={{ fontFamily: T.m, fontSize: 8, color: T.td, letterSpacing: 1, textTransform: "uppercase", marginTop: 12, marginBottom: 4 }}>Bandwidth Distribution ({bwTotal} circuits)</div>
        <div style={{ display: "flex", gap: 4, height: 40, alignItems: "flex-end" }}>
          {bwAgg.map(function (b) {
            var pct = bwTotal > 0 ? b.qty / bwTotal * 100 : 0;
            return (<div key={b.band} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", background: b.qty > 0 ? T.blue : T.border, borderRadius: 2, height: Math.max(pct * 0.4, b.qty > 0 ? 4 : 1) + "px" }} />
              <span style={{ fontFamily: T.m, fontSize: 8, color: T.td, marginTop: 3 }}>{b.qty}</span>
            </div>);
          })}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
          {BW_BANDS.map(function (b) {
            return <div key={b} style={{ flex: 1, fontFamily: T.m, fontSize: 7, color: T.td, textAlign: "center" }}>{b.replace(" Mbps", "M").replace(" Gbps", "G").replace("–", "-")}</div>;
          })}
        </div>
      </div>
    </div>

    {/* ═══ ROW 4: Presence & Coverage ═══ */}
    <Disc tag="PRESENCE & COVERAGE" tagColor={T.blue} title="GTT presence by region" summary={regions.length + " regions · " + gttSites + " GTT-enabled sites"} defaultOpen={true}>
      {regions.map(function (r, i) {
        return (<div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < regions.length - 1 ? "1px solid " + T.border : "none" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{r.name}</span>
              {r.entity === "Acquired" && <span style={{ fontFamily: T.m, fontSize: 8, color: T.amber, background: T.amber + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>Acquired</span>}
            </div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{r.gttSites}/{r.sites} sites · {r.services.length > 0 ? r.services.join(", ") : "No GTT services"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 80, height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
              <div style={{ width: r.penetration + "%", height: "100%", background: penColor(r.penetration), borderRadius: 3 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: penColor(r.penetration), width: 32, textAlign: "right" }}>{r.penetration}%</span>
          </div>
        </div>);
      })}
    </Disc>

    {/* ═══ ROW 5: Contracts ═══ */}
    <Disc tag="CONTRACT & RENEWAL EXPOSURE" tagColor={T.amber} title="Commercial baseline" summary={contracts.length + " contracts · " + contracts.filter(function (c) { return c.status === "At Risk"; }).length + " at risk · " + contracts.filter(function (c) { return c.status === "Pilot"; }).length + " pilots"}>
      {contracts.map(function (c, i) {
        var sc = ctrStatusColor(c.status);
        return (<div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < contracts.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 50, textAlign: "center", flexShrink: 0 }}>{c.status}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{c.name}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{c.service} · {c.term} · Renewal: {c.renewal}{c.notes ? " · " + c.notes : ""}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp }}>{c.value}</div>
            <div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{c.sites} sites</div>
          </div>
        </div>);
      })}
    </Disc>

    {/* ═══ ROW 6: Baseline Gaps ═══ */}
    <Disc tag="BASELINE GAPS & ADJACENCY SIGNALS" tagColor={T.red} title="Identified gaps in current baseline" summary={gaps.length + " gaps — " + gaps.filter(function (g) { return g.severity === "critical"; }).length + " critical"}>
      {gaps.map(function (g, i) {
        var sc = sevColor(g.severity);
        return (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < gaps.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{g.severity}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, color: T.tp }}>{g.label}</div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.td, marginTop: 2 }}>{g.type}</span>
          </div>
        </div>);
      })}
    </Disc>

    {/* ═══ ROW 7: Recommended Next Studios ═══ */}
    {onNav && (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: T.cyan + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>RECOMMENDED NEXT STUDIOS</span>
      <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Based on baseline signals</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { id: "security", label: "Security Studio", reason: "Zero security / SASE presence — critical gap", active: true },
          { id: "network", label: "Network Studio", reason: "MPLS non-renew + SD-WAN pilot expansion", active: true },
          { id: "cloud", label: "Cloud Studio", reason: "Azure ExpressRoute gap, cloud adjacency", active: true },
          { id: "value", label: "Value Studio", reason: "$2.1M MPLS renewal — quantify transition ROI", active: true },
        ].filter(function (f) { return f.active; }).map(function (f) {
          return (<div key={f.id} onClick={function () { onNav(f.id); }} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid " + T.cyan + "22", background: T.cyan + "04", cursor: "pointer" }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{f.label}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 3, lineHeight: 1.4 }}>{f.reason}</div>
            <div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, marginTop: 6, textTransform: "uppercase" }}>Open →</div>
          </div>);
        })}
      </div>
    </div>)}
  </div>);
}

export default FootprintView;
