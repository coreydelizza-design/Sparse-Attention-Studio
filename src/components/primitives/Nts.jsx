import { useState, useRef, useEffect } from "react";
import { T } from "../../tokens";

function Nts({ tag, tc, title, sub, value, onChange, rows }) {
  const minH = 150;
  const _h = useState((rows || 6) * 26 + 100); const cardHeight = _h[0]; const setCardHeight = _h[1];
  const _drag = useState(false); const dragging = _drag[0]; const setDragging = _drag[1];
  const dragRef = useRef({ startY: 0, startH: 0 });

  useEffect(function () {
    if (!dragging) return;
    function onMove(e) {
      var newH = dragRef.current.startH + (e.clientY - dragRef.current.startY);
      setCardHeight(Math.max(minH, newH));
    }
    function onUp() { setDragging(false); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return function () { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  function onMouseDown(e) {
    e.preventDefault();
    dragRef.current.startY = e.clientY;
    dragRef.current.startH = cardHeight;
    setDragging(true);
  }

  return (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + (dragging ? T.cyan : T.border), height: cardHeight, display: "flex", flexDirection: "column", overflow: "hidden", transition: dragging ? "none" : "border-color 0.2s", userSelect: dragging ? "none" : "auto" }}>
    <div style={{ padding: "14px 18px 0", flexShrink: 0 }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: tc, background: tc + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>{tag}</span>
      <div style={{ fontFamily: T.f, fontSize: 15, fontWeight: 600, color: T.tp, marginTop: 6 }}>{title}</div>
      {sub && <div style={{ fontFamily: T.f, fontSize: 12, color: T.td, marginTop: 2 }}>{sub}</div>}
    </div>
    <div style={{ flex: 1, padding: "8px 18px 0", minHeight: 0 }}>
      <textarea value={value} onChange={function (e) { onChange(e.target.value); }} style={{ fontFamily: T.f, fontSize: 13, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "10px 12px", background: "#fafbfc", boxSizing: "border-box", width: "100%", height: "100%", resize: "none", lineHeight: 1.65, outline: "none" }} onFocus={function (e) { e.target.style.background = "#fff"; e.target.style.borderColor = T.cyan; }} onBlur={function (e) { e.target.style.background = "#fafbfc"; e.target.style.borderColor = T.border; }} />
    </div>
    <div onMouseDown={onMouseDown} style={{ height: 16, cursor: "ns-resize", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, background: dragging ? T.cyan + "06" : "transparent", borderTop: "1px solid " + (dragging ? T.cyan + "33" : T.border), borderRadius: "0 0 10px 10px", transition: "background 0.15s" }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: dragging ? T.cyan : "#d1d5db", transition: "background 0.15s" }} />
    </div>
  </div>);
}

export default Nts;
