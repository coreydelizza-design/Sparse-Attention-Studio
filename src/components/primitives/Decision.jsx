import { T } from "../../tokens";

function Decision({ question, options, selected, onSelect, color }) {
  return (<div style={{ padding: "10px 0" }}><div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp, marginBottom: 6 }}>{question}</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{options.map(function (o) { const on = selected === o; return <button key={o} onClick={function () { onSelect(o); }} style={{ fontFamily: T.f, fontSize: 11, padding: "5px 12px", borderRadius: 5, cursor: "pointer", border: "1.5px solid " + (on ? color : T.border), background: on ? color + "12" : "transparent", color: on ? color : T.ts, fontWeight: on ? 600 : 400 }}>{on ? "● " : ""}{o}</button>; })}</div></div>);
}

export default Decision;
