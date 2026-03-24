import { T } from "../../tokens";

function Ring({ size, pct, color, stroke, label, textColor }) {
  const sz = size || 80, st = stroke || 6, r = (sz - st) / 2, c = 2 * Math.PI * r, off = c - ((pct || 0) / 100) * c;
  const tc = textColor || T.tp;
  return (<div style={{ position: "relative", width: sz, height: sz, flexShrink: 0 }}><svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={T.border} strokeWidth={st} /><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={color || T.cyan} strokeWidth={st} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" /></svg><div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: T.f, fontWeight: 700, fontSize: sz > 60 ? 22 : 11, color: tc }}>{pct}%</span>{label && <span style={{ fontFamily: T.m, fontSize: 7, color: textColor ? "rgba(255,255,255,0.5)" : T.td, letterSpacing: 1, marginTop: 2, textTransform: "uppercase" }}>{label}</span>}</div></div>);
}

export default Ring;
