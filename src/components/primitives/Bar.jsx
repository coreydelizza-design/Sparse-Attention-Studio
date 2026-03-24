import { T } from "../../tokens";

function Bar({ pct, color, h }) { const ht = h || 6; return <div style={{ width: "100%", height: ht, background: T.border, borderRadius: ht / 2, overflow: "hidden" }}><div style={{ width: (pct || 0) + "%", height: "100%", background: color || T.cyan, borderRadius: ht / 2 }} /></div>; }

export default Bar;
