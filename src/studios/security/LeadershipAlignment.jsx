import { T, smI, selS } from "../../tokens";
import { Disc } from "../../components/primitives";

function LeadershipAlignment({ stak, setStak }) {
  return (
    <Disc tag="STAKEHOLDERS" tagColor={T.teal} title="Leadership alignment" summary={stak.length + " tracked \u00b7 " + stak.filter(function (x) { return x.stance === "Champion"; }).length + " champions"}>
      {stak.map(function (x, i) { return (<div key={x.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < stak.length - 1 ? "1px solid " + T.border : "none" }}><input value={x.name} onChange={function (e) { setStak(stak.map(function (s, j) { return j === i ? Object.assign({}, s, { name: e.target.value }) : s; })); }} style={Object.assign({}, smI, { width: 120, fontSize: 11 })} /><select value={x.role} onChange={function (e) { setStak(stak.map(function (s, j) { return j === i ? Object.assign({}, s, { role: e.target.value }) : s; })); }} style={Object.assign({}, selS, { fontSize: 10 })}>{["CISO", "CTO", "CIO", "VP of IT Security", "Director of IT Security", "Sr. Security Architect", "Security Engineer", "Compliance Manager", "Other"].map(function (o) { return <option key={o}>{o}</option>; })}</select><select value={x.stance} onChange={function (e) { setStak(stak.map(function (s, j) { return j === i ? Object.assign({}, s, { stance: e.target.value }) : s; })); }} style={Object.assign({}, selS, { fontSize: 10, color: x.stance === "Champion" ? T.green : x.stance === "Blocker" ? T.red : x.stance === "Supporter" ? T.cyan : T.td })}>{["Champion", "Supporter", "Neutral", "Blocker"].map(function (o) { return <option key={o}>{o}</option>; })}</select><input value={x.notes} onChange={function (e) { setStak(stak.map(function (s, j) { return j === i ? Object.assign({}, s, { notes: e.target.value }) : s; })); }} placeholder="Notes" style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} /></div>); })}
      <button onClick={function () { setStak(stak.concat([{ id: Date.now(), name: "", role: "Other", stance: "Neutral", notes: "" }])); }} style={{ fontFamily: T.f, fontSize: 11, color: T.teal, background: T.teal + "08", border: "1px dashed " + T.teal + "33", borderRadius: 5, padding: "6px 14px", cursor: "pointer", marginTop: 8, width: "100%" }}>+ Add stakeholder</button>
    </Disc>
  );
}

export default LeadershipAlignment;
