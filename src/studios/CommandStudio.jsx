import { T, SM, SECS } from "../tokens";
import { DOMAIN_DEFS } from "../data/constants";
import { Ring, Chip, Bar } from "../components/primitives";

function CmdCenter({ onNav, stats }) {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {/* Welcome */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "18px 22px" }}>
      <div style={{ fontFamily: T.f, fontSize: 18, fontWeight: 700, color: T.tp }}>Command Studio</div>
      <div style={{ fontFamily: T.f, fontSize: 13, color: T.ts, marginTop: 4, lineHeight: 1.6 }}>Meridian Financial Group — {stats.totalSites} sites. This studio guides a structured network transformation workshop. Each module below has a defined scope, goal, and expected outputs. Work through them sequentially or jump to the most relevant domain. Statistics are tracked in the sidebar.</div>
    </div>

    {/* Transformation Towers — PRIMARY */}
    <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 4 }}>Transformation Towers</div>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {DOMAIN_DEFS.filter(function (d) { return d.id === "network" || d.id === "security" || d.id === "cloud"; }).map(function (d) {
        const r = d.id === "network" ? stats.nr : d.id === "security" ? stats.sr : stats.cr;
        return (<div key={d.id} onClick={function () { onNav(d.id); }} style={{ flex: 1, minWidth: 240, background: T.card, borderRadius: 10, border: "1px solid " + T.border, borderTop: "3px solid " + d.color, cursor: "pointer", padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp }}>{d.label}</span>
            <Ring size={38} pct={r} color={d.color} stroke={3} />
          </div>
          <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: d.color, marginBottom: 6 }}>{d.goal}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.5, marginBottom: 8 }}>{d.scope}</div>
          <div style={{ fontFamily: T.m, fontSize: 9, color: T.td, lineHeight: 1.5 }}>Outputs: {d.outputs}</div>
          <div style={{ fontFamily: T.m, fontSize: 10, color: d.color, marginTop: 10, textTransform: "uppercase" }}>Enter Module →</div>
        </div>);
      })}
    </div>

    {/* All Domains — definitions with progressive disclosure */}
    <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 4 }}>Workshop Modules</div>
    {DOMAIN_DEFS.filter(function (d) { return d.id !== "network" && d.id !== "security" && d.id !== "cloud"; }).map(function (d) {
      const sec = SECS.find(function (s) { return s.id === d.id; });
      const m = sec ? SM[sec.status] : SM["not-started"];
      return (<div key={d.id} onClick={function () { onNav(d.id); }} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, borderLeft: "3px solid " + d.color, padding: "14px 18px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp }}>{d.label}</span>
            {sec && <Chip status={sec.status} />}
          </div>
          {sec && sec.pct != null && <span style={{ fontFamily: T.m, fontSize: 10, color: m.color }}>{sec.pct}%</span>}
        </div>
        <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, color: d.color, marginBottom: 4 }}>{d.goal}</div>
        <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, lineHeight: 1.5 }}>{d.scope}</div>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.td, marginTop: 4 }}>Outputs: {d.outputs}</div>
      </div>);
    })}
  </div>);
}

export default CmdCenter;
