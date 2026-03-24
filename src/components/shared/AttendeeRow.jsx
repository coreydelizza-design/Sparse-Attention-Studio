import { T, smI, selS } from "../../tokens";

function AttendeeRow({ a, roles, onUpdate, onRemove }) {
  var attending = a.present || a.virtual;
  return (<div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid " + T.border }}>
    <div onClick={function () { onUpdate("present", !a.present); }} style={{ width: 18, height: 18, borderRadius: 3, border: "2px solid " + (a.present ? T.green : T.border), background: a.present ? T.green + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, cursor: "pointer" }}>
      {a.present && <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>✓</span>}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
        <input value={a.name} onChange={function (e) { onUpdate("name", e.target.value); }} style={Object.assign({}, smI, { fontWeight: 600, width: 150, fontSize: 13, color: T.tp })} placeholder="Name" />
        <select value={a.role} onChange={function (e) { onUpdate("role", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, maxWidth: 200 })}>
          {roles.map(function (r) { return <option key={r} value={r}>{r}</option>; })}
        </select>
        <div onClick={function () { onUpdate("virtual", !a.virtual); }} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: "1.5px solid " + (a.virtual ? T.cyan : T.border), background: a.virtual ? T.cyan + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {a.virtual && <span style={{ color: T.cyan, fontSize: 9, fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: a.virtual ? T.cyan : T.td, textTransform: "uppercase" }}>Virtual</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={a.email || ""} onChange={function (e) { onUpdate("email", e.target.value); }} style={Object.assign({}, smI, { width: 180, fontSize: 10, color: T.td })} placeholder="email@company.com" />
        <input value={a.focus || ""} onChange={function (e) { onUpdate("focus", e.target.value); }} style={Object.assign({}, smI, { flex: 1, fontSize: 10, color: T.ts })} placeholder="Focus area / responsibility..." />
      </div>
    </div>
    <button onClick={onRemove} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, marginTop: 2, flexShrink: 0 }}>✕</button>
  </div>);
}

export default AttendeeRow;
