import { useState } from "react";
import { T } from "../../tokens";

function Disc({ tag, tagColor, title, summary, defaultOpen, right, children }) {
  const _o = useState(defaultOpen === true); const open = _o[0]; const setOpen = _o[1];
  return (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
    <div onClick={function () { setOpen(!open); }} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", borderBottom: open ? "1px solid " + T.border : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
        <span style={{ fontSize: 10, color: T.td, marginTop: 4, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", flexShrink: 0 }}>▶</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: tagColor, background: tagColor + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>{tag}</span>
            <span style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp }}>{title}</span>
          </div>
          {summary && !open && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, marginTop: 4, lineHeight: 1.5 }}>{summary}</div>}
        </div>
      </div>
      {right}
    </div>
    {open && <div style={{ padding: "16px 18px" }}>{children}</div>}
  </div>);
}

export default Disc;
