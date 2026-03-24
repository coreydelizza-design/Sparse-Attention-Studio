import { useState } from "react";
import { T, iS, selS, smI } from "../../tokens";
import { SCOPE_OPTS, FOLLOWUP_OPTS, scopeColor } from "../../data/constants";

function TopicRow({ t, onUpdate, onRemove }) {
  var _exp = useState(false); var expanded = _exp[0]; var setExpanded = _exp[1];
  var sc = scopeColor(t.scope);
  return (<div style={{ padding: "10px 0", borderBottom: "1px solid " + T.border }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span onClick={function () { setExpanded(!expanded); }} style={{ fontSize: 9, color: T.td, cursor: "pointer", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{t.label}</span>
          <span style={{ fontFamily: T.m, fontSize: 8, color: t.confirmed ? T.green : T.td, background: (t.confirmed ? T.green : T.td) + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", cursor: "pointer" }} onClick={function () { onUpdate("confirmed", !t.confirmed); }}>{t.confirmed ? "Confirmed" : "Suggested"}</span>
        </div>
        {t.description && !expanded && <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 1 }}>{t.description}</div>}
      </div>
      <select value={t.scope} onChange={function (e) { onUpdate("scope", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9, color: sc, borderColor: sc + "44" })}>
        {SCOPE_OPTS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}
      </select>
      <select value={t.followUp} onChange={function (e) { onUpdate("followUp", e.target.value); }} style={Object.assign({}, selS, { fontSize: 9 })}>
        {FOLLOWUP_OPTS.map(function (o) { return <option key={o} value={o}>{o}</option>; })}
      </select>
      {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 10 }}>✕</button>}
    </div>
    {expanded && (<div style={{ marginTop: 8, marginLeft: 17, display: "flex", flexDirection: "column", gap: 6 }}>
      <input value={t.description || ""} onChange={function (e) { onUpdate("description", e.target.value); }} placeholder="Description..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
      <div style={{ display: "flex", gap: 8 }}>
        <input value={t.owner || ""} onChange={function (e) { onUpdate("owner", e.target.value); }} placeholder="Owner name..." style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} />
        <input value={t.ownerRole || ""} onChange={function (e) { onUpdate("ownerRole", e.target.value); }} placeholder="Role..." style={Object.assign({}, smI, { flex: 1, fontSize: 10 })} />
      </div>
      <input value={t.notes || ""} onChange={function (e) { onUpdate("notes", e.target.value); }} placeholder="Notes..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
    </div>)}
  </div>);
}

export default TopicRow;
