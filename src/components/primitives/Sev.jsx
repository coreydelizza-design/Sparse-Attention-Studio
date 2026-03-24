import { T } from "../../tokens";

function Sev({ s }) { const c = { critical: T.red, high: T.amber, medium: T.blue, low: T.td }[s] || T.td; return <span style={{ fontFamily: T.m, fontSize: 9, color: c, background: c + "15", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase" }}>{s}</span>; }

export default Sev;
