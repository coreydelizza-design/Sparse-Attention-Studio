import { T } from "../../tokens";

function PrimaryCard({ tag, tagColor, title, right, children }) {
  return (<div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
    <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid " + T.border }}>
      <div><span style={{ fontFamily: T.m, fontSize: 9, color: tagColor, background: tagColor + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>{tag}</span><div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>{title}</div></div>
      {right}
    </div>
    <div style={{ padding: "16px 18px" }}>{children}</div>
  </div>);
}

export default PrimaryCard;
