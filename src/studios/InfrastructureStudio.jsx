import { useState } from "react";
import { T, SECS, iS, selS, smI } from "../tokens";
import { SecHead, Nts, PrimaryCard, Disc } from "../components/primitives";

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

export default CurrentView;
