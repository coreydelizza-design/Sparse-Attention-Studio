import { T, SM } from "../../tokens";

function Chip({ status }) { const m = SM[status] || SM["not-started"]; return <span style={{ fontFamily: T.m, fontSize: 10, color: m.color, background: m.bg, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{m.label}</span>; }

export default Chip;
