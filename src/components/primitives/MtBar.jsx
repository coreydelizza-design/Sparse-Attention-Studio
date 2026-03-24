import { T } from "../../tokens";

function MtBar({ label, score, color }) { return (<div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}><span style={{ fontFamily: T.f, fontSize: 13, fontWeight: 500, color: T.tp, width: 120, flexShrink: 0 }}>{label}</span><div style={{ flex: 1, height: 10, background: T.border, borderRadius: 5, overflow: "hidden" }}><div style={{ width: score + "%", height: "100%", background: color, borderRadius: 5 }} /></div><span style={{ fontFamily: T.m, fontSize: 12, fontWeight: 500, color: score >= 60 ? T.green : score >= 40 ? T.amber : T.red, width: 32, textAlign: "right" }}>{score}</span></div>); }

export default MtBar;
