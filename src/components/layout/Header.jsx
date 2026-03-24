import { T, SECS } from "../../tokens";
import Chip from "../primitives/Chip";

function Header({ section }) {
  const s = SECS.find(function (x) { return x.id === section; }) || SECS[0];
  return (<div style={{ height: 46, background: "#fff", borderBottom: "1px solid " + T.border, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "fixed", top: 0, left: 218, right: 0, zIndex: 90 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp }}>{s.label}</span>{s.phase && <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: "#ecfeff", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>Phase {s.phase}</span>}<Chip status={s.status} /></div>
    <div style={{ display: "flex", gap: 6 }}><button style={{ fontFamily: T.f, fontSize: 10, color: T.ts, background: "none", border: "1px solid " + T.border, borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>Reports</button><button style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.cyan, border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>Export</button></div>
  </div>);
}

export default Header;
