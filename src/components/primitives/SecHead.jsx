import { T, SM } from "../../tokens";
import Bar from "./Bar";

function SecHead({ s }) {
  const m = SM[s.status];
  return (<div style={{ marginBottom: 8 }}>
    {s.phase && <div style={{ fontFamily: T.m, fontSize: 10, color: T.td, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Phase {s.phase} of 8</div>}
    <div style={{ fontFamily: T.f, fontSize: 22, fontWeight: 700, color: T.tp }}>{s.label}</div>
    <div style={{ fontFamily: T.f, fontSize: 13, color: T.ts, marginTop: 4 }}>{s.desc}</div>
    {s.pct != null && <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}><Bar pct={s.pct} color={m.color} /><span style={{ fontFamily: T.m, fontSize: 11, color: m.color }}>{s.pct}%</span></div>}
  </div>);
}

export default SecHead;
