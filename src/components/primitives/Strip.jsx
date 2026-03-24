import { T } from "../../tokens";
import Ring from "./Ring";

function Strip({ label, pct, color, detail }) {
  return (<div style={{ background: color + "06", borderRadius: 10, border: "1px solid " + color + "18", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
    <Ring size={40} pct={pct} color={color} stroke={3.5} />
    <div style={{ flex: 1 }}><div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: color }}>{label}: {pct}%</div><div style={{ fontFamily: T.f, fontSize: 11, color: T.td }}>{detail}</div></div>
  </div>);
}

export default Strip;
