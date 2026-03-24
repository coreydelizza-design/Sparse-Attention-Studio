import { T } from "../../tokens";
import StatusTag from "../primitives/StatusTag";

function InvTable({ cols, rows, onRm, color }) {
  return (<div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.f, fontSize: 11 }}>
    <thead><tr style={{ background: "#f8f9fb" }}>{cols.map(function (c) { return <th key={c.key} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: T.ts, fontSize: 10, borderBottom: "2px solid " + color + "22", whiteSpace: "nowrap" }}>{c.label}</th>; })}<th style={{ width: 30, borderBottom: "2px solid " + color + "22" }} /></tr></thead>
    <tbody>{rows.map(function (r, i) { return (<tr key={r.id} style={{ background: i % 2 ? "#fafbfc" : "transparent" }}>{cols.map(function (c) { const v = r[c.key]; const isTag = c.key === "status" || c.key === "lifecycle" || c.key === "priority" || c.key === "tier"; return <td key={c.key} style={{ padding: "7px 10px", color: T.tp, borderBottom: "1px solid " + T.border, whiteSpace: "nowrap" }}>{isTag ? <StatusTag v={v} /> : v}</td>; })}<td style={{ padding: "5px 6px", borderBottom: "1px solid " + T.border, textAlign: "center" }}><button onClick={function () { onRm(r.id); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11 }}>✕</button></td></tr>); })}{!rows.length && <tr><td colSpan={cols.length + 1} style={{ padding: 20, textAlign: "center", color: T.td, fontStyle: "italic", fontSize: 12 }}>No items</td></tr>}</tbody>
  </table></div>);
}

export default InvTable;
