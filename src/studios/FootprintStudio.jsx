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
    { id: 1, name: "DIA", category: "DIA", status: "Active", enabled: true, qty: 44, siteCt: 42, regionCt: 5, mrr: 56, contractId: "CTR-2024-DIA", circuits: ["DIA"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 18 }, { band: "100–250 Mbps", qty: 16 }, { band: "250–500 Mbps", qty: 6 }, { band: "500 Mbps–1 Gbps", qty: 2 }, { band: "1 Gbps+", qty: 2 }], confidence: "Verified", owner: "Karen Nguyen", notes: "" },
    { id: 2, name: "MPLS", category: "MPLS", status: "Active", enabled: true, qty: 87, siteCt: 87, regionCt: 6, mrr: 175, contractId: "CTR-2022-MPLS", circuits: ["MPLS"], bwDist: [{ band: "<50 Mbps", qty: 22 }, { band: "50–100 Mbps", qty: 48 }, { band: "100–250 Mbps", qty: 12 }, { band: "250–500 Mbps", qty: 5 }, { band: "500 Mbps–1 Gbps", qty: 0 }, { band: "1 Gbps+", qty: 0 }], confidence: "Verified", owner: "Karen Nguyen", notes: "AT&T contract — non-renew Dec 2026" },
    { id: 3, name: "Broadband", category: "Broadband", status: "Active", enabled: true, qty: 12, siteCt: 12, regionCt: 1, mrr: 8, contractId: "CTR-2024-BB", circuits: ["Broadband"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 0 }, { band: "100–250 Mbps", qty: 8 }, { band: "250–500 Mbps", qty: 4 }, { band: "500 Mbps–1 Gbps", qty: 0 }, { band: "1 Gbps+", qty: 0 }], confidence: "Verified", owner: "Karen Nguyen", notes: "NorthStar Wealth greenfield sites" },
    { id: 4, name: "SD-WAN (Managed)", category: "SD-WAN", status: "Pilot", enabled: true, qty: 8, siteCt: 8, regionCt: 1, mrr: 12, contractId: "CTR-2025-SDWAN", circuits: ["Internet + LTE"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 0 }, { band: "100–250 Mbps", qty: 6 }, { band: "250–500 Mbps", qty: 2 }, { band: "500 Mbps–1 Gbps", qty: 0 }, { band: "1 Gbps+", qty: 0 }], confidence: "Verified", owner: "Karen Nguyen", notes: "NE pilot — FortiGate 60F" },
    { id: 5, name: "SIP / Voice", category: "SIP / Voice", status: "Active", enabled: true, qty: 35, siteCt: 35, regionCt: 4, mrr: 22, contractId: "CTR-2023-SIP", circuits: ["SIP Transport"], bwDist: [], confidence: "Verified", owner: "Karen Nguyen", notes: "" },
    { id: 6, name: "Cloud Connect (AWS)", category: "Cloud Connect", status: "Active", enabled: true, qty: 2, siteCt: 2, regionCt: 1, mrr: 18, contractId: "CTR-2024-CC", circuits: ["Cloud Interconnect"], bwDist: [{ band: "<50 Mbps", qty: 0 }, { band: "50–100 Mbps", qty: 0 }, { band: "100–250 Mbps", qty: 0 }, { band: "250–500 Mbps", qty: 0 }, { band: "500 Mbps–1 Gbps", qty: 1 }, { band: "1 Gbps+", qty: 1 }], confidence: "Verified", owner: "Rachel Patel", notes: "Dallas DC + Ashburn DC" },
    { id: 7, name: "LTE Backup", category: "LTE / Wireless", status: "Active", enabled: true, qty: 35, siteCt: 35, regionCt: 3, mrr: 8, contractId: "CTR-2024-LTE", circuits: ["LTE / 5G"], bwDist: [], confidence: "Estimated", owner: "Karen Nguyen", notes: "Verizon + T-Mobile mix" },
    { id: 8, name: "EnvisionDX", category: "EnvisionDX", status: "Pilot", enabled: true, qty: 8, siteCt: 8, regionCt: 1, mrr: 4, contractId: "PILOT-EDX", circuits: ["DIA"], bwDist: [], confidence: "Verified", owner: "Steve Morrison", notes: "Monitoring overlay — NE pilot sites" },
    { id: 9, name: "Security / SASE", category: "Security / SASE", status: "Pending", enabled: true, qty: 0, siteCt: 0, regionCt: 0, mrr: 0, contractId: "", circuits: [], bwDist: [], confidence: "Unvalidated", owner: "", notes: "No GTT security services — identified gap" },
    { id: 10, name: "Cloud Connect (Azure)", category: "Cloud Connect", status: "Pending", enabled: true, qty: 0, siteCt: 0, regionCt: 0, mrr: 0, contractId: "", circuits: ["Cloud Interconnect"], bwDist: [], confidence: "Unvalidated", owner: "", notes: "ExpressRoute not yet sold — adjacency signal" },
  ]); var svcs = _svcs[0]; var setSvcs = _svcs[1];

  /* ── Regions ── */
  var GLOBAL_REGIONS = ["North America", "LATAM", "EMEA", "APAC", "Global"];
  var _regions = useState([
    { id: 1, name: "Northeast US", globalRegion: "North America", sites: 34, gttSites: 34, services: ["MPLS", "DIA", "SIP", "LTE", "SD-WAN", "EnvisionDX"], entity: "Core", penetration: 72 },
    { id: 2, name: "Southeast US", globalRegion: "North America", sites: 28, gttSites: 22, services: ["MPLS", "DIA", "SIP"], entity: "Core", penetration: 58 },
    { id: 3, name: "Midwest US", globalRegion: "North America", sites: 22, gttSites: 14, services: ["MPLS", "DIA"], entity: "Core", penetration: 42 },
    { id: 4, name: "West US", globalRegion: "North America", sites: 19, gttSites: 14, services: ["MPLS", "DIA", "LTE"], entity: "Core", penetration: 55 },
    { id: 5, name: "Canada", globalRegion: "North America", sites: 22, gttSites: 12, services: ["MPLS", "DIA"], entity: "Core", penetration: 38 },
    { id: 6, name: "Pinnacle Insurance", globalRegion: "North America", sites: 38, gttSites: 38, services: ["MPLS"], entity: "Acquired", penetration: 15 },
    { id: 7, name: "NorthStar Wealth", globalRegion: "North America", sites: 12, gttSites: 0, services: [], entity: "Acquired", penetration: 0 },
    { id: 8, name: "Data Centers / DR", globalRegion: "North America", sites: 3, gttSites: 3, services: ["DIA", "Cloud Connect", "MPLS", "SIP", "EnvisionDX"], entity: "Core", penetration: 92 },
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
  var _gaps = useState([
    { id: 1, label: "Security / SASE — zero GTT presence", type: "Service Gap", severity: "critical", notes: "" },
    { id: 2, label: "NorthStar Wealth — 12 sites, no GTT services", type: "Coverage Gap", severity: "critical", notes: "" },
    { id: 3, label: "Pinnacle Insurance — single-product (MPLS only)", type: "Low Penetration", severity: "high", notes: "" },
    { id: 4, label: "Azure ExpressRoute — not sold", type: "Adjacency", severity: "high", notes: "" },
    { id: 5, label: "SD-WAN pilot — 8 sites, not converted to production", type: "Unconverted Pilot", severity: "high", notes: "" },
    { id: 6, label: "EnvisionDX pilot — not expanded beyond NE", type: "Unconverted Pilot", severity: "medium", notes: "" },
    { id: 7, label: "Canada — no LTE backup deployed (22 sites)", type: "Service Gap", severity: "medium", notes: "" },
    { id: 8, label: "Midwest / West — limited service diversity", type: "Low Penetration", severity: "medium", notes: "" },
  ]); var gaps = _gaps[0]; var setGaps = _gaps[1];
  var GAP_TYPES = ["Service Gap", "Coverage Gap", "Low Penetration", "Adjacency", "Unconverted Pilot", "Missing Overlay", "Other"];
  var GAP_SEV = ["critical", "high", "medium", "low"];
  function updGap(id, f, v) { setGaps(gaps.map(function (g) { return g.id === id ? Object.assign({}, g, (function () { var o = {}; o[f] = v; return o; })()) : g; })); }

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

  /* ── Computed (only enabled services feed into summaries) ── */
  var liveSvcs = svcs.filter(function (s) { return s.enabled !== false; });
  var activeSvcs = liveSvcs.filter(function (s) { return s.status === "Active"; });
  var totalMRR = liveSvcs.reduce(function (a, s) { return a + s.mrr; }, 0);
  var totalSites = regions.reduce(function (a, r) { return a + r.sites; }, 0);
  var gttSites = regions.reduce(function (a, r) { return a + r.gttSites; }, 0);
  var totalQty = liveSvcs.reduce(function (a, s) { return a + s.qty; }, 0);

  /* BW aggregation */
  var bwAgg = BW_BANDS.map(function (band) {
    var total = liveSvcs.reduce(function (a, s) {
      var match = (s.bwDist || []).find(function (b) { return b.band === band; });
      return a + (match ? match.qty : 0);
    }, 0);
    return { band: band, qty: total };
  });
  var bwTotal = bwAgg.reduce(function (a, b) { return a + b.qty; }, 0);

  /* Circuit aggregation */
  var circuitAgg = {};
  liveSvcs.forEach(function (s) {
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
  var CTR_STATUSES = ["Healthy", "At Risk", "Pilot", "Pending"];
  function updCtr(id, f, v) { setContracts(contracts.map(function (c) { return c.id === id ? Object.assign({}, c, (function () { var o = {}; o[f] = v; return o; })()) : c; })); }
  function updReg(id, f, v) { setRegions(regions.map(function (r) { return r.id === id ? Object.assign({}, r, (function () { var o = {}; o[f] = v; return o; })()) : r; })); }

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

    {/* ═══ ROW 1: Baseline Summary ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Active Services", value: activeSvcs.length, sub: svcs.length + " total (incl. pilot/pending)", color: T.teal },
        { label: "GTT-Enabled Sites", value: gttSites + " / " + totalSites, sub: Math.round(gttSites / totalSites * 100) + "% site coverage", color: T.blue },
        { label: "Current MRR", value: "$" + totalMRR + "K", sub: "$" + (totalMRR * 12) + "K ARR", color: T.green },
        { label: "Active Contracts", value: contracts.length, sub: contracts.filter(function (c) { return c.status === "Pilot"; }).length + " pilots · " + contracts.filter(function (c) { return c.status === "At Risk"; }).length + " at risk", color: T.amber },
      ].map(function (c) {
        return (<div key={c.label} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: c.color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>{c.label}</div>
          <div style={{ fontFamily: T.f, fontSize: 24, fontWeight: 700, color: T.tp }}>{c.value}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 4 }}>{c.sub}</div>
        </div>);
      })}
    </div>

    {/* ═══ Baseline Integrity ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.teal, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>BASELINE INTEGRITY</div>
        {isPrep ? (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div><label style={lbl}>Prepared By</label><input value={integrity.preparedBy} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { preparedBy: e.target.value })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
          <div><label style={lbl}>Last Updated</label><input type="date" value={integrity.lastUpdated} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { lastUpdated: e.target.value })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
          <div><label style={lbl}>Data Confidence</label><select value={integrity.confidence} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { confidence: e.target.value })); }} style={Object.assign({}, selS, { width: "100%", fontSize: 10 })}>{["High", "Medium", "Low"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select></div>
          <div><label style={lbl}>Completeness %</label><input type="number" min={0} max={100} value={integrity.completeness} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { completeness: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10, textAlign: "center" })} /></div>
          <div><label style={lbl}>Pending Validation Items</label><input type="number" min={0} value={integrity.pendingItems} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { pendingItems: Math.max(0, Number(e.target.value) || 0) })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10, textAlign: "center" })} /></div>
          <div><label style={lbl}>Source Systems</label><input value={integrity.sources} onChange={function (e) { setIntegrity(Object.assign({}, integrity, { sources: e.target.value })); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
        </div>) : (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
            {[
              { k: "Prepared By", v: integrity.preparedBy },
              { k: "Last Updated", v: integrity.lastUpdated },
              { k: "Data Confidence", v: integrity.confidence, isConf: true },
              { k: "Completeness", v: integrity.completeness + "%" },
              { k: "Pending Items", v: String(integrity.pendingItems) },
              { k: "Sources", v: integrity.sources },
            ].map(function (r) {
              return (<div key={r.k}>
                <div style={{ fontFamily: T.f, fontSize: 9, color: T.td, marginBottom: 2 }}>{r.k}</div>
                <div style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: r.isConf ? confColor(r.v) : T.tp }}>{r.v}</div>
              </div>);
            })}
          </div>
        )}
      </div>

    {/* ═══ ROW 2: Installed Service Baseline ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>INSTALLED SERVICE BASELINE</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{liveSvcs.length} active of {svcs.length} services · {totalQty} circuits/instances</div>
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
          var on = s.enabled !== false;
          var sc = statusColor(s.status);
          var cc = confColor(s.confidence);
          var isExp = expSvc === s.id;
          var dim = !on ? { opacity: 0.35, pointerEvents: "none" } : {};
          return (<div key={s.id} style={{ borderBottom: i < svcs.length - 1 ? "1px solid " + T.border : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
              {/* Toggle */}
              <div onClick={function (e) { e.stopPropagation(); updSvc(s.id, "enabled", !on); }} style={{ width: 32, height: 18, borderRadius: 9, background: on ? T.green : T.border, cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: on ? 16 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
              </div>
              <div onClick={function () { if (on) setExpSvc(isExp ? null : s.id); }} style={Object.assign({ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: on ? "pointer" : "default" }, dim)}>
                <span style={{ fontSize: 9, color: T.td, transform: isExp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
                <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 58, textAlign: "center", flexShrink: 0 }}>{s.status}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.name}</div>
                  <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{s.category} · {s.siteCt} sites · {s.qty} qty · {(s.circuits || []).join(", ")}</div>
                </div>
                <span style={{ fontFamily: T.m, fontSize: 8, color: cc, background: cc + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{s.confidence}</span>
                <span style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: s.mrr > 0 ? T.tp : T.td, width: 55, textAlign: "right", flexShrink: 0 }}>{s.mrr > 0 ? "$" + s.mrr + "K" : "—"}</span>
              </div>
            </div>

            {/* Expanded detail / edit */}
            {isExp && on && (<div style={{ padding: "0 0 12px 42px" }}>
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
          var svc = liveSvcs.find(function (s) { return s.category === cat; });
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
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>PRESENCE & COVERAGE</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{regions.length} regions · {gttSites} GTT-enabled sites</div>
        </div>
        {isPrep && <button onClick={function () { setRegions(regions.concat([{ id: Date.now(), name: "New Region", globalRegion: "North America", sites: 0, gttSites: 0, services: [], entity: "Core", penetration: 0 }])); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add Region</button>}
      </div>
      <div style={{ padding: "6px 18px" }}>
        {regions.map(function (r, i) {
          return (<div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < regions.length - 1 ? "1px solid " + T.border : "none", flexWrap: isPrep ? "wrap" : "nowrap" }}>
            {isPrep ? (<>
              <input value={r.name} onChange={function (e) { updReg(r.id, "name", e.target.value); }} style={Object.assign({}, smI, { width: 140, fontSize: 11, fontWeight: 600 })} />
              <select value={r.globalRegion || "North America"} onChange={function (e) { updReg(r.id, "globalRegion", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9 })}>{GLOBAL_REGIONS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <label style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Sites</label>
                <input type="number" value={r.sites} onChange={function (e) { updReg(r.id, "sites", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 10 })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <label style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>GTT</label>
                <input type="number" value={r.gttSites} onChange={function (e) { updReg(r.id, "gttSites", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 10 })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <label style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>Pen%</label>
                <input type="number" min={0} max={100} value={r.penetration} onChange={function (e) { updReg(r.id, "penetration", Math.min(100, Math.max(0, Number(e.target.value) || 0))); }} style={Object.assign({}, smI, { width: 44, textAlign: "center", fontSize: 10 })} />
              </div>
              <select value={r.entity} onChange={function (e) { updReg(r.id, "entity", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9 })}>{["Core", "Acquired", "Partner", "Greenfield"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select>
              <button onClick={function () { setRegions(regions.filter(function (x) { return x.id !== r.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10, marginLeft: "auto" }}>✕</button>
            </>) : (<>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{r.name}</span>
                  <span style={{ fontFamily: T.m, fontSize: 8, color: T.blue, background: T.blue + "10", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>{r.globalRegion || "North America"}</span>
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
            </>)}
          </div>);
        })}
      </div>
    </div>

    {/* ═══ ROW 5: Contracts ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.amber, background: T.amber + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>CONTRACT & RENEWAL EXPOSURE</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{contracts.length} contracts · {contracts.filter(function (c) { return c.status === "At Risk"; }).length} at risk · {contracts.filter(function (c) { return c.status === "Pilot"; }).length} pilots</div>
        </div>
        {isPrep && <button onClick={function () { setContracts(contracts.concat([{ id: Date.now(), name: "", service: "", value: "", term: "", renewal: "", status: "Healthy", sites: 0, notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.amber, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add Contract</button>}
      </div>
      <div style={{ padding: "6px 18px" }}>
        {contracts.map(function (c, i) {
          var sc = ctrStatusColor(c.status);
          return (<div key={c.id} style={{ padding: "10px 0", borderBottom: i < contracts.length - 1 ? "1px solid " + T.border : "none" }}>
            {isPrep ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 2, minWidth: 120 }}><label style={lbl}>Contract Name</label><input value={c.name} onChange={function (e) { updCtr(c.id, "name", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 11, fontWeight: 600 })} /></div>
                <div style={{ flex: 1, minWidth: 80 }}><label style={lbl}>Service</label><input value={c.service} onChange={function (e) { updCtr(c.id, "service", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                <div style={{ width: 80 }}><label style={lbl}>Value</label><input value={c.value} onChange={function (e) { updCtr(c.id, "value", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                <div style={{ width: 65 }}><label style={lbl}>Term</label><input value={c.term} onChange={function (e) { updCtr(c.id, "term", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                <div style={{ width: 80 }}><label style={lbl}>Renewal</label><input value={c.renewal} onChange={function (e) { updCtr(c.id, "renewal", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                <div style={{ width: 75 }}><label style={lbl}>Status</label><select value={c.status} onChange={function (e) { updCtr(c.id, "status", e.target.value); }} style={Object.assign({}, selS, { width: "100%", fontSize: 9 })}>{CTR_STATUSES.map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select></div>
                <div style={{ width: 50 }}><label style={lbl}>Sites</label><input type="number" value={c.sites} onChange={function (e) { updCtr(c.id, "sites", Number(e.target.value) || 0); }} style={Object.assign({}, smI, { width: "100%", fontSize: 10, textAlign: "center" })} /></div>
                <div style={{ flex: 2, minWidth: 120 }}><label style={lbl}>Notes</label><input value={c.notes} onChange={function (e) { updCtr(c.id, "notes", e.target.value); }} placeholder="Notes..." style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                <button onClick={function () { setContracts(contracts.filter(function (x) { return x.id !== c.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10, marginBottom: 4 }}>✕</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 50, textAlign: "center", flexShrink: 0 }}>{c.status}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{c.name}</div>
                  <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{c.service} · {c.term} · Renewal: {c.renewal}{c.notes ? " · " + c.notes : ""}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp }}>{c.value}</div>
                  <div style={{ fontFamily: T.f, fontSize: 9, color: T.td }}>{c.sites} sites</div>
                </div>
              </div>
            )}
          </div>);
        })}
      </div>
    </div>

    {/* ═══ ROW 6: Baseline Gaps ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.red, background: T.red + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>BASELINE GAPS & ADJACENCY SIGNALS</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{gaps.length} gaps — {gaps.filter(function (g) { return g.severity === "critical"; }).length} critical</div>
        </div>
        {isPrep && <button onClick={function () { setGaps(gaps.concat([{ id: Date.now(), label: "", type: "Service Gap", severity: "medium", notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.red, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add Gap</button>}
      </div>
      <div style={{ padding: "6px 18px" }}>
        {gaps.map(function (g, i) {
          var sc = sevColor(g.severity);
          return (<div key={g.id} style={{ padding: "10px 0", borderBottom: i < gaps.length - 1 ? "1px solid " + T.border : "none" }}>
            {isPrep ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 3, minWidth: 180 }}><label style={lbl}>Gap Description</label><input value={g.label} onChange={function (e) { updGap(g.id, "label", e.target.value); }} style={Object.assign({}, smI, { width: "100%", fontSize: 11 })} /></div>
                <div style={{ width: 110 }}><label style={lbl}>Type</label><select value={g.type} onChange={function (e) { updGap(g.id, "type", e.target.value); }} style={Object.assign({}, selS, { width: "100%", fontSize: 9 })}>{GAP_TYPES.map(function (o) { return <option key={o} value={o}>{o}</option>; })}</select></div>
                <div style={{ width: 80 }}><label style={lbl}>Severity</label><select value={g.severity} onChange={function (e) { updGap(g.id, "severity", e.target.value); }} style={Object.assign({}, selS, { width: "100%", fontSize: 9 })}>{GAP_SEV.map(function (o) { return <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>; })}</select></div>
                <div style={{ flex: 2, minWidth: 120 }}><label style={lbl}>Notes</label><input value={g.notes} onChange={function (e) { updGap(g.id, "notes", e.target.value); }} placeholder="Notes..." style={Object.assign({}, smI, { width: "100%", fontSize: 10 })} /></div>
                <button onClick={function () { setGaps(gaps.filter(function (x) { return x.id !== g.id; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10, marginBottom: 4 }}>✕</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0 }}>{g.severity}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.f, fontSize: 12, color: T.tp }}>{g.label}</div>
                  <span style={{ fontFamily: T.m, fontSize: 9, color: T.td, marginTop: 2 }}>{g.type}</span>
                </div>
              </div>
            )}
          </div>);
        })}
        {!gaps.length && <div style={{ padding: 16, textAlign: "center", fontFamily: T.f, fontSize: 12, color: T.td, fontStyle: "italic" }}>No gaps identified</div>}
      </div>
    </div>

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
