import { T, smI } from "../../tokens";
import { Disc } from "../../components/primitives";

function GttPortfolioMap({ gttSvc, setGttSvc }) {
  return (
    <Disc tag="GTT PORTFOLIO" tagColor={T.cyan} title="GTT service mapping" summary={gttSvc.filter(function (x) { return x.status === "Proposed"; }).length + " proposed \u00b7 " + gttSvc.filter(function (x) { return x.status === "Evaluate"; }).length + " evaluating"}>
      {gttSvc.map(function (x, i) { return (<div key={x.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < gttSvc.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, color: T.tp, width: 130 }}>{x.name}</span><div style={{ display: "flex", gap: 4 }}>{["Proposed", "Evaluate", "N/A"].map(function (opt) { var sel = x.status === opt; return <button key={opt} onClick={function () { setGttSvc(gttSvc.map(function (s, j) { return j === i ? Object.assign({}, s, { status: opt }) : s; })); }} style={{ fontFamily: T.f, fontSize: 10, padding: "3px 10px", borderRadius: 4, cursor: "pointer", border: "1.5px solid " + (sel ? T.cyan : T.border), background: sel ? T.cyan + "12" : "transparent", color: sel ? T.cyan : T.td, fontWeight: sel ? 600 : 400 }}>{opt}</button>; })}</div><input value={x.notes} onChange={function (e) { setGttSvc(gttSvc.map(function (s, j) { return j === i ? Object.assign({}, s, { notes: e.target.value }) : s; })); }} placeholder="Rationale / scope" style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} /></div>); })}
    </Disc>
  );
}

export default GttPortfolioMap;
