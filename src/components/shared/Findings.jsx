import { useState } from "react";
import { T, iS } from "../../tokens";

function Findings({ items, setItems, placeholder, color }) {
  const _v = useState(""); const val = _v[0]; const setVal = _v[1];
  function doAdd() { if (val.trim()) { setItems(items.concat([val.trim()])); setVal(""); } }
  return (<div><div style={{ display: "flex", gap: 8, marginBottom: 10 }}><input value={val} onChange={function (e) { setVal(e.target.value); }} onKeyDown={function (e) { if (e.key === "Enter") doAdd(); }} placeholder={placeholder} style={Object.assign({}, iS, { flex: 1 })} /><button onClick={doAdd} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: color, border: "none", borderRadius: 6, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button></div>{items.map(function (f, i) { return <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < items.length - 1 ? "1px solid " + T.border : "none" }}><span style={{ color: color, flexShrink: 0, fontSize: 11 }}>!</span><span style={{ fontFamily: T.f, fontSize: 12, color: T.ts, flex: 1 }}>{f}</span><button onClick={function () { setItems(items.filter(function (_, j) { return j !== i; })); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11 }}>✕</button></div>; })}</div>);
}

export default Findings;
