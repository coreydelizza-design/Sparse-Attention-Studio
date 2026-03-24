import { T } from "../../tokens";

function ScoreRow({ label, score, onChange, color }) {
  const sl = ["", "Not Ready", "Early", "Developing", "Established", "Optimized"];
  return (<div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}><span style={{ fontFamily: T.f, fontSize: 13, color: T.tp, flex: 1 }}>{label}</span><div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(function (n) { return <button key={n} onClick={function () { onChange(n); }} style={{ width: 26, height: 26, borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: T.f, cursor: "pointer", border: "1.5px solid " + (n <= score ? color : T.border), background: n <= score ? color + (n === score ? "20" : "10") : "transparent", color: n <= score ? color : T.td }}>{n}</button>; })}</div><span style={{ fontFamily: T.m, fontSize: 9, color: T.td, width: 65, textAlign: "right" }}>{sl[score]}</span></div>);
}

export default ScoreRow;
