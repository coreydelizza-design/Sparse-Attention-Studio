import { useState } from "react";
import { T, SECS, iS, selS, smI } from "../tokens";
import { NET_COLS } from "../data/constants";
import { SecHead, Nts, Strip, PrimaryCard, Disc, ScoreRow, Decision, Bar, Chk } from "../components/primitives";
import { Findings, AIBtn, InvTable } from "../components/shared";

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

export default NetView;
