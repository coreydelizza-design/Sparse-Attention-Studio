import { useState } from "react";
import { T, SM, SECS, iS, selS, smI, lbl } from "../tokens";
import { SCOPE_OPTS, FOLLOWUP_OPTS, scopeColor, followColor, updArr } from "../data/constants";
import { SecHead, Nts, Disc, PrimaryCard, ScoreRow, TopicRow } from "../components/primitives";

function ExecView({ onNav }) {
  /* ── Business Context ── */
  var _ctx = useState({
    industry: "Financial Services — Insurance & Wealth Management",
    footprint: "178 sites across 14 US states, 3 Canadian provinces, 2 data centers, 1 DR site",
    summary: "Meridian Financial Group is a mid-market financial services holding company operating insurance, wealth management, and advisory subsidiaries. Two recent acquisitions (Pinnacle Insurance, NorthStar Wealth) remain on separate network and security stacks.",
    whyNow: "CTO mandate: cloud-first architecture and zero trust security by FY27. AT&T MPLS contract expires Dec 2026. Pinnacle and NorthStar need full network integration. Board requires measurable security improvement within 12 months.",
    posture: "Active transformation — executive-sponsored, funded, seeking implementation partner",
    notes: ""
  }); var ctx = _ctx[0]; var setCtx = _ctx[1];
  function updCtx(f, v) { setCtx(Object.assign({}, ctx, (function () { var o = {}; o[f] = v; return o; })())); }

  /* ── Strategic Priorities ── */
  var _pri = useState([
    { id: 1, label: "Cost Efficiency", score: 5, confirmed: true },
    { id: 2, label: "Security & Resilience", score: 5, confirmed: true },
    { id: 3, label: "Cloud Enablement", score: 4, confirmed: true },
    { id: 4, label: "Standardization", score: 4, confirmed: false },
    { id: 5, label: "M&A Integration", score: 4, confirmed: true },
    { id: 6, label: "Growth Scalability", score: 3, confirmed: false },
    { id: 7, label: "AI / Automation", score: 2, confirmed: false },
    { id: 8, label: "Customer Experience", score: 2, confirmed: false },
  ]); var priorities = _pri[0]; var setPriorities = _pri[1];
  var priLabels = ["", "Not a Priority", "Low Priority", "Moderate", "High Priority", "Critical"];

  /* ── Success Definition ── */
  var _suc = useState([
    { id: 1, label: "Reduce network complexity and vendor sprawl", confirmed: true, notes: "" },
    { id: 2, label: "Improve security posture to meet board mandate", confirmed: true, notes: "FY27 zero trust requirement" },
    { id: 3, label: "Standardize branch infrastructure across all sites", confirmed: false, notes: "" },
    { id: 4, label: "Accelerate cloud migration with direct connectivity", confirmed: true, notes: "" },
    { id: 5, label: "Integrate acquisitions onto unified platform", confirmed: true, notes: "Pinnacle + NorthStar" },
    { id: 6, label: "Reduce site deployment time from 90 days to under 10", confirmed: false, notes: "" },
  ]); var success = _suc[0]; var setSuccess = _suc[1];

  /* ── Business Drivers ── */
  var _drv = useState([
    { id: 1, label: "Provider consolidation", category: "Efficiency", description: "Reduce from 6 WAN providers to 1-2 strategic partners", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "MPLS contract expiration", category: "Efficiency", description: "AT&T MPLS ($2.1M/yr) expires Dec 2026 — transition required", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Cloud migration acceleration", category: "Growth", description: "AWS/Azure workload growth requires direct cloud connectivity", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "M&A network integration", category: "Scale", description: "Pinnacle (38 sites) and NorthStar (12 sites) need integration", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 5, label: "Security modernization", category: "Risk", description: "38 EOL firewalls, no microsegmentation, fragmented tooling", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 6, label: "Branch simplification", category: "Efficiency", description: "Standardize CPE, enable local breakout, reduce truck rolls", scope: "Focus Now", followUp: "No Follow-Up", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 7, label: "Operational visibility", category: "Risk", description: "Fragmented monitoring — SolarWinds + PRTG + spreadsheets", scope: "Park", followUp: "Needs GTT Follow-Up", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 8, label: "AI / automation readiness", category: "Growth", description: "GCP Vertex AI workloads growing 3x — need reliable connectivity", scope: "Park", followUp: "Future Phase", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 9, label: "Geographic expansion", category: "Scale", description: "Potential new markets requiring rapid site deployment", scope: "Out of Scope", followUp: "Future Phase", confirmed: false, owner: "", ownerRole: "", notes: "" },
  ]); var drivers = _drv[0]; var setDrivers = _drv[1];

  /* ── Functional Priorities ── */
  var _func = useState([
    { id: 1, group: "Business", label: "Reduce operating cost and improve margin", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 2, group: "Business", label: "Support acquisitions with rapid integration", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 3, group: "Finance", label: "Predictable, consolidated network spend", confirmed: false, scope: "Focus Now", followUp: "Customer Validation Needed", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 4, group: "Finance", label: "Avoid stranded contract costs during transition", confirmed: false, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 5, group: "Technology", label: "Cloud-first architecture with direct breakout", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 6, group: "Technology", label: "SD-WAN with unified orchestration", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 7, group: "Operations", label: "Single-pane visibility across all sites", confirmed: false, scope: "Park", followUp: "Needs GTT Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 8, group: "Operations", label: "Reduce MTTR and truck rolls", confirmed: false, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 9, group: "Security", label: "Zero trust posture by FY27", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 10, group: "Security", label: "Consolidate security tooling from 11 to 5 vendors", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 11, group: "Cloud", label: "Multi-cloud connectivity without DC hairpin", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", description: "", owner: "", ownerRole: "", notes: "" },
    { id: 12, group: "Cloud", label: "Enable AI/ML workload growth on GCP", confirmed: false, scope: "Park", followUp: "Future Phase", description: "", owner: "", ownerRole: "", notes: "" },
  ]); var funcPri = _func[0]; var setFuncPri = _func[1];

  /* ── Transformation Triggers ── */
  var _trig = useState([
    { id: 1, label: "MPLS contract renewal deadline", description: "AT&T contract expires Dec 2026 — requires transition plan", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "M&A integration mandate", description: "Pinnacle and NorthStar must be on unified platform", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Board security directive", description: "Zero trust and measurable improvement within 12 months", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "Cloud workload growth", description: "Azure +30% YoY, AWS primary, GCP AI/ML expanding", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 5, label: "End-of-life equipment", description: "38 Cisco ASA firewalls past EOS, 23% CPE aging", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 6, label: "Application modernization", description: "Core banking and claims migration driving connectivity needs", scope: "Park", followUp: "Customer Validation Needed", confirmed: false, owner: "", ownerRole: "", notes: "" },
  ]); var triggers = _trig[0]; var setTriggers = _trig[1];

  /* ── Constraints ── */
  var _con = useState([
    { id: 1, label: "MPLS transition timeline", description: "Must complete before Dec 2026 contract end", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "Pinnacle separate security stack", description: "Cisco ASA environment requires dedicated migration plan", scope: "Focus Now", followUp: "No Follow-Up", confirmed: true, owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Internal staffing limits", description: "Small network team — may need managed services model", scope: "Focus Now", followUp: "Customer Validation Needed", confirmed: false, owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "Budget cycle alignment", description: "Capital vs. operating expense preferences to confirm", scope: "Park", followUp: "Owner Not Present", confirmed: false, owner: "", ownerRole: "CFO", notes: "" },
    { id: 5, label: "Compliance requirements", description: "Financial services regulatory and audit considerations", scope: "Focus Now", followUp: "No Follow-Up", confirmed: false, owner: "", ownerRole: "", notes: "" },
  ]); var constraints = _con[0]; var setConstraints = _con[1];

  /* ── Decision Criteria ── */
  var _dec = useState([
    { id: 1, label: "Simplicity", description: "Prefer converged, fewer-vendor solutions", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 2, label: "Speed of deployment", description: "Aggressive timeline driven by MPLS expiration", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 3, label: "Cost predictability", description: "Preference for opex model with clear per-site economics", confirmed: false, scope: "Focus Now", followUp: "Customer Validation Needed", owner: "", ownerRole: "", notes: "" },
    { id: 4, label: "Security posture", description: "Board-level mandate — non-negotiable", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 5, label: "Resilience & uptime", description: "Financial services SLA expectations", confirmed: true, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
    { id: 6, label: "Vendor consolidation", description: "Reduce from 6 providers + 11 security vendors", confirmed: false, scope: "Focus Now", followUp: "No Follow-Up", owner: "", ownerRole: "", notes: "" },
  ]); var criteria = _dec[0]; var setCriteria = _dec[1];

  /* ── Session notes ── */
  var _notes = useState(""); var sessionNotes = _notes[0]; var setSessionNotes = _notes[1];

  /* ── Derived rollups ── */
  var allTopics = [].concat(drivers, funcPri, triggers, constraints, criteria);
  var focusNow = allTopics.filter(function (t) { return t.scope === "Focus Now"; });
  var parked = allTopics.filter(function (t) { return t.scope === "Park"; });
  var outOfScope = allTopics.filter(function (t) { return t.scope === "Out of Scope"; });
  var needsFollowUp = allTopics.filter(function (t) { return t.followUp !== "No Follow-Up"; });
  var ownerMissing = allTopics.filter(function (t) { return t.followUp === "Owner Not Present"; });
  var gttFollowUp = allTopics.filter(function (t) { return t.followUp === "Needs GTT Follow-Up"; });
  var scheduleSession = allTopics.filter(function (t) { return t.followUp === "Schedule Session"; });
  var execAlign = allTopics.filter(function (t) { return t.followUp === "Executive Alignment Needed"; });

  /* ── Focus area recommendations ── */
  var focusAreas = [
    { id: "footprint", label: "GTT Footprint Studio", reason: "Review current GTT presence and expansion opportunities", active: drivers.some(function (d) { return d.label.indexOf("consolidation") >= 0 && d.scope === "Focus Now"; }) },
    { id: "current", label: "Infrastructure Studio", reason: "Map current estate, providers, and constraints", active: true },
    { id: "network", label: "Network Studio", reason: "SD-WAN readiness, MPLS transition, branch standards", active: drivers.some(function (d) { return (d.label.indexOf("MPLS") >= 0 || d.label.indexOf("Branch") >= 0) && d.scope === "Focus Now"; }) },
    { id: "security", label: "Security Studio", reason: "SASE evaluation, zero trust roadmap, vendor consolidation", active: funcPri.some(function (f) { return f.group === "Security" && f.scope === "Focus Now"; }) },
    { id: "cloud", label: "Cloud Studio", reason: "Multi-cloud connectivity, migration tracking", active: drivers.some(function (d) { return d.label.indexOf("Cloud") >= 0 && d.scope === "Focus Now"; }) },
    { id: "value", label: "Value Studio", reason: "TCO/ROI analysis and business case", active: focusNow.length >= 4 },
    { id: "future", label: "Architecture Studio", reason: "Target-state design and convergence vision", active: false },
    { id: "roadmap", label: "Roadmap Studio", reason: "Phased transformation plan", active: false },
  ];

  /* ── group helpers ── */
  var driverCategories = ["Growth", "Efficiency", "Risk", "Scale"];
  var catColor = function (c) { return c === "Growth" ? T.green : c === "Efficiency" ? T.amber : c === "Risk" ? T.red : T.violet; };
  var funcGroups = ["Business", "Finance", "Technology", "Operations", "Security", "Cloud"];
  var funcColor = function (g) { return g === "Business" ? T.green : g === "Finance" ? T.amber : g === "Technology" ? T.blue : g === "Operations" ? T.cyan : g === "Security" ? T.red : T.violet; };

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function (x) { return x.id === "executive"; })} />

    {/* ═══ ROW 1: Business Context + Strategic Priorities + Success ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      {/* Business Context */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
        <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>BUSINESS CONTEXT</span>
        <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Operating environment & transformation thesis</div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Industry</label>
          <select value={ctx.industry} onChange={function (e) { updCtx("industry", e.target.value); }} style={Object.assign({}, iS, { fontSize: 11, cursor: "pointer" })}>
            {["Financial Services — Insurance & Wealth Management", "Financial Services — Banking", "Financial Services — Capital Markets", "Healthcare — Provider", "Healthcare — Payer", "Healthcare — Life Sciences", "Manufacturing — Discrete", "Manufacturing — Process", "Manufacturing — Industrial", "Retail — Brick & Mortar", "Retail — E-Commerce", "Retail — Omnichannel", "Technology — Software", "Technology — Hardware", "Technology — Services", "Telecommunications", "Energy — Oil & Gas", "Energy — Utilities", "Energy — Renewables", "Transportation & Logistics", "Hospitality & Travel", "Media & Entertainment", "Education — Higher Ed", "Education — K-12", "Legal & Professional Services", "Real Estate & Construction", "Pharmaceuticals & Biotech", "Automotive", "Aerospace & Defense", "Federal Government", "State Government", "Local Government", "Non-Profit & NGO", "Other"].map(function (ind) { return <option key={ind} value={ind}>{ind}</option>; })}
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Operating Footprint</label>
          <input value={ctx.footprint} onChange={function (e) { updCtx("footprint", e.target.value); }} style={Object.assign({}, iS, { fontSize: 11 })} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Strategic Posture</label>
          <select value={ctx.posture} onChange={function (e) { updCtx("posture", e.target.value); }} style={Object.assign({}, iS, { fontSize: 11, cursor: "pointer" })}>
            {["Active transformation — executive-sponsored, funded, seeking implementation partner", "Exploring transformation — evaluating options, building business case", "Early discovery — identifying needs, no formal initiative yet", "Reactive — responding to specific event or contract deadline", "Optimization — current architecture works, seeking incremental improvement", "Consolidation — reducing vendors, simplifying existing environment", "M&A driven — integration mandate from acquisition activity", "Compliance driven — regulatory or audit requirement forcing change", "Renewal cycle — contract expiration driving reassessment", "Greenfield — new environment or subsidiary buildout", "Modernization — replacing legacy infrastructure end-of-life", "Cost reduction — budget pressure driving transformation", "Growth mode — scaling infrastructure to support expansion", "Stabilization — addressing reliability or performance issues first", "Other"].map(function (p) { return <option key={p} value={p}>{p}</option>; })}
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Business Summary</label>
          <textarea value={ctx.summary} onChange={function (e) { updCtx("summary", e.target.value); }} rows={3} style={{ fontFamily: T.f, fontSize: 11, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.5 }} />
        </div>
        <div>
          <label style={lbl}>Session Notes</label>
          <textarea value={sessionNotes} onChange={function (e) { setSessionNotes(e.target.value); }} rows={3} placeholder="Working assumptions, priorities to validate, additional context..." style={{ fontFamily: T.f, fontSize: 11, color: T.tp, border: "1px solid " + T.border, borderRadius: 6, padding: "8px 10px", background: "#fafbfc", boxSizing: "border-box", width: "100%", resize: "vertical", lineHeight: 1.5 }} />
        </div>
      </div>

      {/* Strategic Priorities + Success Definition stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Strategic Priorities */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>STRATEGIC PRIORITIES</span>
              <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6 }}>Business priority assessment</div>
            </div>
            <span style={{ fontFamily: T.f, fontSize: 16, fontWeight: 700, color: (priorities.reduce(function (a, p) { return a + p.score; }, 0) / priorities.length) >= 3.5 ? T.green : (priorities.reduce(function (a, p) { return a + p.score; }, 0) / priorities.length) >= 2.5 ? T.amber : T.red }}>{(priorities.reduce(function (a, p) { return a + p.score; }, 0) / priorities.length).toFixed(1)}</span>
          </div>
          {priorities.map(function (p, i) {
            return (<div key={p.id} style={{ borderBottom: i < priorities.length - 1 ? "1px solid " + T.border : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: T.f, fontSize: 13, color: T.tp }}>{p.label}</span>
                  <span style={{ fontFamily: T.m, fontSize: 8, color: p.confirmed ? T.green : T.td, background: (p.confirmed ? T.green : T.td) + "12", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", cursor: "pointer" }} onClick={function () { setPriorities(updArr(priorities, p.id, "confirmed", !p.confirmed)); }}>{p.confirmed ? "Confirmed" : "Suggested"}</span>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map(function (n) {
                    return <button key={n} onClick={function () { setPriorities(updArr(priorities, p.id, "score", n)); }} style={{ width: 26, height: 26, borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: T.f, cursor: "pointer", border: "1.5px solid " + (n <= p.score ? T.blue : T.border), background: n <= p.score ? T.blue + (n === p.score ? "20" : "10") : "transparent", color: n <= p.score ? T.blue : T.td }}>{n}</button>;
                  })}
                </div>
                <span style={{ fontFamily: T.m, fontSize: 9, color: T.td, width: 75, textAlign: "right" }}>{priLabels[p.score]}</span>
              </div>
            </div>);
          })}
        </div>

        {/* Success Definition */}
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.teal, background: T.teal + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>SUCCESS DEFINITION</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 10 }}>What does "good" look like?</div>
          {success.map(function (s, i) {
            return (<div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: i < success.length - 1 ? "1px solid " + T.border : "none" }}>
              <div onClick={function () { setSuccess(updArr(success, s.id, "confirmed", !s.confirmed)); }} style={{ width: 16, height: 16, borderRadius: 3, border: "2px solid " + (s.confirmed ? T.green : T.border), background: s.confirmed ? T.green + "15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}>
                {s.confirmed && <span style={{ color: T.green, fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp }}>{s.label}</span>
                {s.notes && <span style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginLeft: 6 }}>— {s.notes}</span>}
              </div>
            </div>);
          })}
        </div>
      </div>
    </div>

    {/* Why Now — adjustable notes field */}
    <Nts tag="WHY NOW" tc={T.amber} title="Transformation Context" sub="What is driving urgency — capture the business case for change" value={ctx.whyNow} onChange={function (v) { updCtx("whyNow", v); }} rows={3} />

    {/* ═══ ROW 2: Business Drivers ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
        <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>BUSINESS DRIVERS & OBJECTIVES</span>
        <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>Confirm priorities, set scope, assign follow-up</div>
      </div>
      <div style={{ padding: "8px 18px" }}>
        {driverCategories.map(function (cat) {
          var items = drivers.filter(function (d) { return d.category === cat; });
          if (!items.length) return null;
          var cc = catColor(cat);
          return (<div key={cat} style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: T.m, fontSize: 9, color: cc, letterSpacing: 1, textTransform: "uppercase", padding: "8px 0 2px", borderBottom: "1px solid " + cc + "22" }}>{cat} Drivers</div>
            {items.map(function (d) {
              return <TopicRow key={d.id} t={d} onUpdate={function (f, v) { setDrivers(updArr(drivers, d.id, f, v)); }} />;
            })}
          </div>);
        })}
      </div>
    </div>

    {/* ═══ ROW 3: Functional Priorities ═══ */}
    <Disc tag="FUNCTIONAL PRIORITIES" tagColor={T.blue} title="Priorities by business function" summary={funcPri.filter(function (f) { return f.scope === "Focus Now"; }).length + " in focus · " + funcPri.filter(function (f) { return f.confirmed; }).length + " confirmed"} defaultOpen={true}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {funcGroups.map(function (grp) {
          var items = funcPri.filter(function (f) { return f.group === grp; });
          if (!items.length) return null;
          var gc = funcColor(grp);
          return (<div key={grp}>
            <div style={{ fontFamily: T.m, fontSize: 9, color: gc, letterSpacing: 1, textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid " + gc + "22", marginBottom: 4 }}>{grp}</div>
            {items.map(function (f) {
              return <TopicRow key={f.id} t={f} onUpdate={function (field, v) { setFuncPri(updArr(funcPri, f.id, field, v)); }} />;
            })}
          </div>);
        })}
      </div>
    </Disc>

    {/* ═══ ROW 4: Triggers + Constraints side by side ═══ */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Transformation Triggers */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.amber, background: T.amber + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>TRANSFORMATION TRIGGERS</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>What is creating urgency?</div>
        </div>
        <div style={{ padding: "4px 18px" }}>
          {triggers.map(function (t) {
            return <TopicRow key={t.id} t={t} onUpdate={function (f, v) { setTriggers(updArr(triggers, t.id, f, v)); }} />;
          })}
        </div>
      </div>

      {/* Constraints & Decision Criteria stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.red, background: T.red + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>CONSTRAINTS</span>
            <div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp, marginTop: 5 }}>Boundaries & considerations</div>
          </div>
          <div style={{ padding: "4px 18px" }}>
            {constraints.map(function (c) {
              return <TopicRow key={c.id} t={c} onUpdate={function (f, v) { setConstraints(updArr(constraints, c.id, f, v)); }} />;
            })}
          </div>
        </div>
        <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.violet, background: T.violet + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>DECISION CRITERIA</span>
            <div style={{ fontFamily: T.f, fontSize: 13, fontWeight: 600, color: T.tp, marginTop: 5 }}>How decisions will be made</div>
          </div>
          <div style={{ padding: "4px 18px" }}>
            {criteria.map(function (c) {
              return <TopicRow key={c.id} t={c} onUpdate={function (f, v) { setCriteria(updArr(criteria, c.id, f, v)); }} />;
            })}
          </div>
        </div>
      </div>
    </div>

    {/* ═══ ROW 5: Recommended Focus Areas ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: T.cyan + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>RECOMMENDED FOCUS AREAS</span>
      <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Based on confirmed priorities — click to navigate</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {focusAreas.filter(function (f) { return f.active; }).map(function (f) {
          return (<div key={f.id} onClick={function () { onNav(f.id); }} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid " + T.cyan + "22", background: T.cyan + "04", cursor: "pointer" }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{f.label}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 3, lineHeight: 1.4 }}>{f.reason}</div>
            <div style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, marginTop: 6, textTransform: "uppercase" }}>Open →</div>
          </div>);
        })}
      </div>
      {focusAreas.some(function (f) { return !f.active; }) && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>Later:</span>
          {focusAreas.filter(function (f) { return !f.active; }).map(function (f) {
            return <span key={f.id} onClick={function () { onNav(f.id); }} style={{ fontFamily: T.f, fontSize: 10, color: T.td, cursor: "pointer", padding: "2px 8px", borderRadius: 4, border: "1px solid " + T.border }}>{f.label}</span>;
          })}
        </div>
      )}
    </div>

    {/* ═══ ROW 6: Session Scope & Follow-Up Summary ═══ */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>SESSION SCOPE & FOLLOW-UP SUMMARY</span>
      <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 6, marginBottom: 12 }}>Live session rollup</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
        {[
          { label: "Focus Now", value: focusNow.length, color: T.green },
          { label: "Parked", value: parked.length, color: T.amber },
          { label: "Out of Scope", value: outOfScope.length, color: T.td },
          { label: "Needs Follow-Up", value: needsFollowUp.length, color: T.cyan },
        ].map(function (s) {
          return (<div key={s.label} style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid " + s.color + "22", background: s.color + "06" }}>
            <div style={{ fontFamily: T.f, fontSize: 20, fontWeight: 700, color: T.tp }}>{s.value}</div>
            <div style={{ fontFamily: T.m, fontSize: 9, color: s.color, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>);
        })}
      </div>

      {/* Follow-up detail rows */}
      {[
        { label: "Owner Not Present", items: ownerMissing, color: T.amber },
        { label: "GTT Follow-Up Required", items: gttFollowUp, color: T.cyan },
        { label: "Schedule Dedicated Session", items: scheduleSession, color: T.violet },
        { label: "Executive Alignment Needed", items: execAlign, color: T.red },
      ].filter(function (g) { return g.items.length > 0; }).map(function (g) {
        return (<div key={g.label} style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: g.color, letterSpacing: 1, textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid " + g.color + "18", marginBottom: 4 }}>{g.label} ({g.items.length})</div>
          {g.items.map(function (item, i) {
            return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp }}>{item.label}</span>
              {item.ownerRole && <span style={{ fontFamily: T.m, fontSize: 9, color: T.td }}>({item.ownerRole})</span>}
            </div>);
          })}
        </div>);
      })}

      {parked.length > 0 && (<div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: T.m, fontSize: 9, color: T.amber, letterSpacing: 1, textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid " + T.amber + "18", marginBottom: 4 }}>Parked Topics ({parked.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {parked.map(function (p, i) {
            return <span key={i} style={{ fontFamily: T.f, fontSize: 10, color: T.amber, background: T.amber + "10", padding: "3px 8px", borderRadius: 4 }}>{p.label}</span>;
          })}
        </div>
      </div>)}
    </div>

  </div>);
}

export default ExecView;
