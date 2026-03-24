import { T } from "../../tokens";

function Chk({ label, done, sub, onToggle }) {
  return (<div onClick={onToggle} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", cursor: "pointer" }}><div style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (done ? T.green : T.border), background: done ? T.green + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{done && <span style={{ color: T.green, fontSize: 12, fontWeight: 700 }}>✓</span>}</div><div><span style={{ fontFamily: T.f, fontSize: 12, color: done ? T.td : T.tp, textDecoration: done ? "line-through" : "none" }}>{label}</span>{sub && <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 1 }}>{sub}</div>}</div></div>);
}

export default Chk;
