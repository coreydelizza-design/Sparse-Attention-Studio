import { T, smI } from "../../tokens";
import { Disc, Decision } from "../../components/primitives";

function ComplianceRisk({ comp, setComp, compUrg, setCompUrg }) {
  return (
    <Disc tag="COMPLIANCE" tagColor={T.amber} title="Compliance & regulatory" summary={comp.filter(function (x) { return x.applicable; }).length + " frameworks applicable"}>
      {comp.map(function (x, i) { return (<div key={x.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < comp.length - 1 ? "1px solid " + T.border : "none" }}><div onClick={function () { setComp(comp.map(function (c, j) { return j === i ? Object.assign({}, c, { applicable: !c.applicable }) : c; })); }} style={{ width: 18, height: 18, borderRadius: 3, border: "1.5px solid " + (x.applicable ? T.amber : T.border), background: x.applicable ? T.amber + "15" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{x.applicable ? <span style={{ fontSize: 11, color: T.amber, fontWeight: 700 }}>{"\u2713"}</span> : null}</div><div style={{ flex: 1 }}><span style={{ fontFamily: T.f, fontSize: 12, color: x.applicable ? T.tp : T.td }}>{x.label}</span><input value={x.notes} onChange={function (e) { setComp(comp.map(function (c, j) { return j === i ? Object.assign({}, c, { notes: e.target.value }) : c; })); }} placeholder="Scope / notes" style={Object.assign({}, smI, { width: "100%", fontSize: 10, marginTop: 4 })} /></div></div>); })}
      <div style={{ borderTop: "1px solid " + T.border, marginTop: 10, paddingTop: 10 }}><Decision question="Compliance urgency?" options={["Audit Imminent", "Annual Review", "Board Requirement", "Future Concern"]} selected={compUrg} onSelect={setCompUrg} color={T.amber} /></div>
    </Disc>
  );
}

export default ComplianceRisk;
