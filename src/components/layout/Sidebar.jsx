import { T, SM, SECS } from "../../tokens";
import Ring from "../primitives/Ring";

function Sidebar({ active, onNav, stats }) {
  return (<div style={{ width: 218, minWidth: 218, height: "100vh", background: T.sidebar, display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
    <div style={{ padding: "18px 16px 4px" }}><div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" }}>GTT Network</div><div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, letterSpacing: 1.6, textTransform: "uppercase", marginTop: 1 }}>Transformation Studio</div></div>
    <div style={{ margin: "8px 12px", padding: "7px 9px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}><div style={{ fontFamily: T.f, fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Session</div><div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>Meridian Financial Group</div></div>

    {/* Completeness gauge + stats */}
    <div style={{ padding: "10px 12px 6px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Ring size={64} pct={stats.pct} color={T.cyan} stroke={4.5} label="complete" textColor="#fff" />
      <div style={{ width: "100%", marginTop: 8 }}>
        {[["Sites", stats.totalSites], ["Attendees", stats.custAttendees + " + " + stats.gttAttendees], ["Network Elements", stats.totalNetEls], ["Security Tools", stats.totalSecTools], ["Cloud Resources", stats.totalCloudRes], ["Findings", stats.totalFindings]].map(function (row) {
          return (<div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "2px 2px" }}><span style={{ fontFamily: T.f, fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{row[0]}</span><span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: "#fff" }}>{row[1]}</span></div>);
        })}
      </div>
      <div style={{ width: "100%", marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[["Network", stats.nr, T.blue], ["Security", stats.sr, T.red], ["Cloud", stats.cr, T.violet]].map(function (row) {
          return (<div key={row[0]} style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 2px" }}><span style={{ fontFamily: T.f, fontSize: 9, color: "rgba(255,255,255,0.4)", width: 48, flexShrink: 0 }}>{row[0]}</span><div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}><div style={{ width: row[1] + "%", height: "100%", background: row[2], borderRadius: 2 }} /></div><span style={{ fontFamily: T.m, fontSize: 9, color: "#fff", width: 24, textAlign: "right" }}>{row[1]}%</span></div>);
        })}
      </div>
    </div>

    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 2 }}>
      {SECS.map(function (s) { const isA = active === s.id; const m = SM[s.status]; return (<div key={s.id} onClick={function () { onNav(s.id); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", cursor: "pointer", background: isA ? T.sidebarActive : "transparent", borderLeft: isA ? "3px solid " + T.cyan : "3px solid transparent" }}><span style={{ fontSize: 13, color: isA ? T.cyan : "rgba(255,255,255,0.3)", width: 18, textAlign: "center" }}>{s.icon}</span><span style={{ fontFamily: T.f, fontSize: 11, fontWeight: isA ? 600 : 400, color: isA ? "#fff" : "rgba(255,255,255,0.6)", flex: 1 }}>{s.label}</span><span style={{ fontSize: 9, color: m.color }}>{m.dot}</span></div>); })}
    </div>
    <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}><span style={{ fontFamily: T.m, fontSize: 8, color: "rgba(255,255,255,0.15)" }}>v1.0.0 · Sparse Attention Mode</span></div>
  </div>);
}

export default Sidebar;
