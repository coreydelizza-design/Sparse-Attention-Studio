import { useState } from "react";
import { T, SECS, iS, selS, smI } from "../tokens";
import { CLD_COLS } from "../data/constants";
import { SecHead, Nts, Strip, PrimaryCard, Disc, ScoreRow, Decision } from "../components/primitives";
import { Findings, AIBtn, InvTable } from "../components/shared";

function CldView({ cloudRes, setCloudRes, cloudFindings, setCloudFindings }) {
  const _n = useState("AWS primary. Azure +30% YoY. GCP AI/ML only.\nHairpin +38ms. Egress $42K/mo.\n85 apps ID, 23 done. AI 3x growth."); const notes = _n[0]; const setNotes = _n[1];
  const _cr = useState([{ label: "On-ramp redundancy", score: 2 }, { label: "Multi-cloud overlay", score: 1 }, { label: "Egress optimization", score: 1 }, { label: "Cloud-native security", score: 2 }, { label: "App migration", score: 3 }, { label: "FinOps", score: 2 }, { label: "Edge compute", score: 1 }, { label: "AI/ML infra", score: 2 }]); const cr = _cr[0]; const setCr = _cr[1];
  const _co = useState([{ provider: "AWS", path: "Direct Connect (Dallas)", status: "At Risk" }, { provider: "Azure", path: "ExpressRoute (Ashburn)", status: "OK" }, { provider: "GCP", path: "Public Internet", status: "Gap" }, { provider: "Branch→Cloud", path: "DC hairpin", status: "Critical" }]); const conn = _co[0]; const setConn = _co[1];
  const _ap = useState([{ name: "Salesforce", target: "Local Breakout", priority: "High", status: "Planned" }, { name: "Core Banking", target: "AWS", priority: "Critical", status: "Not Started" }, { name: "Claims", target: "AWS opt", priority: "Medium", status: "Complete" }, { name: "Analytics", target: "Azure opt", priority: "Medium", status: "In Progress" }, { name: "Trading", target: "AWS", priority: "Critical", status: "Planning" }]); const apps = _ap[0]; const setApps = _ap[1];
  const _cd1 = useState(""); const cd1 = _cd1[0]; const setCd1 = _cd1[1];
  const _cd2 = useState(""); const cd2 = _cd2[0]; const setCd2 = _cd2[1];
  const crAvg = (cr.reduce(function (a, x) { return a + x.score; }, 0) / cr.length).toFixed(1);
  const totalWk = cloudRes.reduce(function (a, r) { return a + (r.workloads || 0); }, 0);

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><SecHead s={SECS.find(function(x){return x.id==="cloud";})} />
    <Strip label="Cloud Tower" pct={45} color={T.violet} detail={totalWk + " workloads · " + apps.filter(function (a) { return a.status === "Complete"; }).length + "/" + apps.length + " migrated"} />
    <Nts tag="CLOUD NOTES" tc={T.violet} title="Session Notes" sub="Connectivity, migration, cost, architecture" value={notes} onChange={setNotes} rows={5} />
    <AIBtn label="Cloud readiness analysis" color={T.violet} data={{ notes: notes, readiness: cr, connectivity: conn, apps: apps, findings: cloudFindings }} />

    <PrimaryCard tag="DECISIONS" tagColor={T.amber} title="Cloud strategy">
      <Decision question="On-ramp topology?" options={["2 Hubs", "4 Hubs", "Per-Site", "Hybrid"]} selected={cd1} onSelect={setCd1} color={T.violet} />
      <div style={{ borderTop: "1px solid " + T.border }} />
      <Decision question="GCP connectivity?" options={["Deploy Now", "Defer 6mo", "Not Needed", "Evaluate"]} selected={cd2} onSelect={setCd2} color={T.violet} />
    </PrimaryCard>

    <Disc tag="READINESS" tagColor={T.violet} title="Cloud maturity" summary={"Avg: " + crAvg + " / 5"} right={<span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: crAvg >= 3 ? T.amber : T.red }}>{crAvg}</span>}>
      {cr.map(function (x, i) { return <div key={i} style={{ borderBottom: i < cr.length - 1 ? "1px solid " + T.border : "none" }}><ScoreRow label={x.label} score={x.score} onChange={function (v) { setCr(cr.map(function (s, j) { return j === i ? Object.assign({}, s, { score: v }) : s; })); }} color={T.violet} /></div>; })}
    </Disc>
    <Disc tag="CONNECTIVITY" tagColor={T.cyan} title="Cloud paths" summary={conn.filter(function (c) { return c.status === "Critical" || c.status === "Gap"; }).length + " paths at risk"}>
      {conn.map(function (c, i) { return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < conn.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 100 }}>{c.provider}</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.ts, flex: 1 }}>{c.path}</span><select value={c.status} onChange={function (e) { setConn(conn.map(function (x, j) { return j === i ? Object.assign({}, x, { status: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["OK", "At Risk", "Gap", "Critical", "Planned"].map(function (o) { return <option key={o}>{o}</option>; })}</select></div>); })}
    </Disc>
    <Disc tag="MIGRATION" tagColor={T.teal} title="App tracker" summary={apps.filter(function (a) { return a.status === "Complete"; }).length + "/" + apps.length + " complete"}>
      {apps.map(function (a, i) { return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < apps.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, width: 90 }}>{a.name}</span><span style={{ fontFamily: T.f, fontSize: 11, color: T.ts, flex: 1 }}>{a.target}</span><select value={a.priority} onChange={function (e) { setApps(apps.map(function (x, j) { return j === i ? Object.assign({}, x, { priority: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["Critical", "High", "Medium", "Low"].map(function (o) { return <option key={o}>{o}</option>; })}</select><select value={a.status} onChange={function (e) { setApps(apps.map(function (x, j) { return j === i ? Object.assign({}, x, { status: e.target.value }) : x; })); }} style={Object.assign({}, selS, { fontSize: 10, width: 100 })}>{["Not Started", "Planning", "Planned", "In Progress", "Complete", "Blocked"].map(function (o) { return <option key={o}>{o}</option>; })}</select></div>); })}
    </Disc>
    <Disc tag="FINDINGS" tagColor={T.red} title="Cloud findings" summary={cloudFindings.length + " items"}><Findings items={cloudFindings} setItems={setCloudFindings} placeholder="Add finding..." color={T.violet} /></Disc>
    <Disc tag="INVENTORY" tagColor={T.violet} title="Cloud resources" summary={cloudRes.length + " resources"}><InvTable cols={CLD_COLS} rows={cloudRes} onRm={function (id) { setCloudRes(cloudRes.filter(function (e) { return e.id !== id; })); }} color={T.violet} /></Disc>
  </div>);
}

export default CldView;
