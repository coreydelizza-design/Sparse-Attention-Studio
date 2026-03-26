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
  const _tr = useState(""); const trigger = _tr[0]; const setTrigger = _tr[1];
  const _trn = useState(""); const triggerNotes = _trn[0]; const setTriggerNotes = _trn[1];
  const saseAvg = (sase.reduce(function (a, x) { return a + x.score; }, 0) / sase.length).toFixed(1);

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={SECS.find(function(x){return x.id==="security";})} />
    <Strip label="Security Tower" pct={58} color={T.red} detail={secTools.length + " tools · " + vendors.filter(function (v) { return v.decision === "Replace"; }).length + " to replace"} />
    <Disc tag="TRIGGER" tagColor={T.red} title="Compelling event" summary={trigger || "Not set"}>
      <Decision question="Compelling event?" options={["PANW Renewal Cost", "Key Personnel Loss", "Board Mandate", "Compliance Gap", "M&A Integration", "Cost Reduction"]} selected={trigger} onSelect={setTrigger} color={T.red} />
      <div style={{ marginTop: 10 }}><div style={{ fontFamily: T.f, fontSize: 10, fontWeight: 500, color: T.td, marginBottom: 4 }}>Why now? What&apos;s prompting this?</div><textarea value={triggerNotes} onChange={function (e) { setTriggerNotes(e.target.value); }} placeholder="Describe the urgency, timeline, or event driving this security transformation..." rows={3} style={{ fontFamily: T.f, fontSize: 12, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fff", boxSizing: "border-box", width: "100%", resize: "vertical" }} /></div>
    </Disc>
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

export default SecView;
