import { T } from "../../tokens";

function StatusTag({ v }) { const cm = { Active: T.green, Current: T.green, Production: T.green, Pilot: T.cyan, Aging: T.amber, EOL: T.red, "End of Support": T.red, Critical: T.red, High: T.amber, Medium: T.blue, Low: T.td, "Dev/Test": T.cyan }; const c = cm[v] || T.td; return <span style={{ fontFamily: T.m, fontSize: 9, color: c, background: c + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", whiteSpace: "nowrap" }}>{v}</span>; }

export default StatusTag;
