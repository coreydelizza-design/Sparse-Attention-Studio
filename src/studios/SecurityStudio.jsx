import { useState } from "react";
import { T, SECS, iS, selS, smI } from "../tokens";
import { SEC_COLS } from "../data/constants";
import { SecHead, Nts, Strip, PrimaryCard, Disc, ScoreRow, Decision, Chk } from "../components/primitives";
import { Findings, AIBtn, InvTable } from "../components/shared";

function SecView({ secTools, setSecTools, secFindings, setSecFindings }) {
  const _n = useState("11 vendors→5. ASA 38 sites EOS. ZT low, board FY27.\n2400+ FW rules ~40% unused. No CASB — 340+ shadow apps."); const notes = _n[0]; const setNotes = _n[1];
  const _sa = useState([{ label: "SWG", score: 1 }, { label: "CASB", score: 1 }, { label: "ZTNA", score: 1 }, { label: "DLP", score: 2 }, { label: "FWaaS", score: 2 }, { label: "Remote", score: 2 }, { label: "Branch", score: 1 }, { label: "Policy", score: 1 }]); const sase = _sa[0]; const setSase = _sa[1];
  const _ve = useState([{ name: "Cisco ASA", decision: "Replace", reason: "EOS" }, { name: "Zscaler", decision: "Evaluate", reason: "vs FortiSASE" }, { name: "CrowdStrike", decision: "Retain", reason: "Strong EDR" }, { name: "Splunk", decision: "Replace", reason: "→FortiSIEM" }, { name: "Proofpoint", decision: "Retain", reason: "OK" }, { name: "Tenable", decision: "Replace", reason: "→FortiAnalyzer" }]); const vendors = _ve[0]; const setVendors = _ve[1];
  const _zt = useState([{ label: "Single IdP", done: false, sub: "AD+Okta" }, { label: "MFA all users", done: true, sub: "Okta" }, { label: "Device posture", done: false, sub: "None" }, { label: "Microsegmentation", done: false, sub: "Flat" }, { label: "ZTNA replaces VPN", done: false, sub: "2100 split-tunnel" }, { label: "Least-privilege", done: false, sub: "Phase 1" }]); const zt = _zt[0]; const setZt = _zt[1];
  const _sd1 = useState(""); const sd1 = _sd1[0]; const setSd1 = _sd1[1];
  const _sd2 = useState(""); const sd2 = _sd2[0]; const setSd2 = _sd2[1];
  const _trig = useState(""); const trigger = _trig[0]; const setTrigger = _trig[1];
  const _trigNote = useState(""); const trigNote = _trigNote[0]; const setTrigNote = _trigNote[1];
  const _sv = useState(""); const successVision = _sv[0]; const setSuccessVision = _sv[1];
  const _km1 = useState(""); const keyMetric1 = _km1[0]; const setKeyMetric1 = _km1[1];
  const _km2 = useState(""); const keyMetric2 = _km2[0]; const setKeyMetric2 = _km2[1];
  const _km3 = useState(""); const keyMetric3 = _km3[0]; const setKeyMetric3 = _km3[1];
  const saseAvg = (sase.reduce(function (a, x) { return a + x.score; }, 0) / sase.length).toFixed(1);

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={SECS.find(function(x){return x.id==="security";})} />
    <Strip label="Security Tower" pct={58} color={T.red} detail={secTools.length + " tools · " + vendors.filter(function (v) { return v.decision === "Replace"; }).length + " to replace"} />
    <Disc tag="TRIGGER" tagColor={T.red} title="Compelling event" summary="Why are we here?" defaultOpen={true}>
      <Decision question="What's driving this conversation?" options={["PANW Renewal Cost", "Key Personnel Loss", "Board Mandate", "Compliance Gap", "M&A Integration", "Cost Reduction"]} selected={trigger} onSelect={setTrigger} color={T.red} />
      <textarea value={trigNote} onChange={function (e) { setTrigNote(e.target.value); }} style={Object.assign({}, smI, { width: "100%", minHeight: 60, resize: "vertical", marginTop: 10, lineHeight: 1.5, boxSizing: "border-box" })} placeholder="Why now? What's prompting this evaluation? (e.g., subscription renewal is expensive, lost key security personnel, new direction to reduce costs)" />
    </Disc>
    <Disc tag="SUCCESS VISION" tagColor={T.green} title="Success vision" summary={successVision ? "Defined" : "Not set"}>
      <Nts tag="1-YEAR VISION" tc={T.green} title="Post-Implementation Vision" sub="What does success look like?" value={successVision} onChange={setSuccessVision} rows={3} placeholder="Fast-forward 1 year post-implementation — what's different?" />
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <div style={{ flex: 1 }}><div style={{ fontFamily: T.f, fontSize: 10, fontWeight: 500, color: T.td, marginBottom: 4 }}>Key metric 1</div><input value={keyMetric1} onChange={function (e) { setKeyMetric1(e.target.value); }} placeholder="e.g. Mean time to detect < 15 min" style={Object.assign({}, smI, { width: "100%", boxSizing: "border-box" })} /></div>
        <div style={{ flex: 1 }}><div style={{ fontFamily: T.f, fontSize: 10, fontWeight: 500, color: T.td, marginBottom: 4 }}>Key metric 2</div><input value={keyMetric2} onChange={function (e) { setKeyMetric2(e.target.value); }} placeholder="e.g. Vendor count 11 → 5" style={Object.assign({}, smI, { width: "100%", boxSizing: "border-box" })} /></div>
        <div style={{ flex: 1 }}><div style={{ fontFamily: T.f, fontSize: 10, fontWeight: 500, color: T.td, marginBottom: 4 }}>Key metric 3</div><input value={keyMetric3} onChange={function (e) { setKeyMetric3(e.target.value); }} placeholder="e.g. ZT coverage 100% by Q4" style={Object.assign({}, smI, { width: "100%", boxSizing: "border-box" })} /></div>
      </div>
    </Disc>
    <Nts tag="SECURITY NOTES" tc={T.red} title="Session Notes" sub="Posture, ZT, vendor decisions" value={notes} onChange={setNotes} rows={5} />
    <AIBtn label="Security posture analysis" color={T.red} data={{ notes: notes, sase: sase, vendors: vendors, zt: zt, findings: secFindings, trigger: trigger, trigNote: trigNote, successVision: successVision, keyMetrics: [keyMetric1, keyMetric2, keyMetric3] }} />

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

export default SecView;
