import { useState } from "react";
import { T, SM, SECS, iS, selS, smI, lbl } from "../tokens";
import { CUST_ROLES, GTT_ROLES } from "../data/constants";
import { SecHead, Nts, Disc, Sev } from "../components/primitives";
import AttendeeRow from "../components/shared/AttendeeRow";

function StakeholderView({ custAttendees, setCustAttendees, gttAttendees, setGttAttendees }) {
  const _notes = useState("Workshop scheduled for 2-day on-site engagement at Meridian Financial Group HQ, Dallas TX.\n\nDay 1: Executive alignment, current-state discovery, network & security deep-dives.\nDay 2: Cloud transformation, maturity assessment, roadmap & deliverables.\n\nKey stakeholder: Sarah Chen (CTO) — executive sponsor, available Day 1 AM only.\nJames Kim (Cloud Architect) joining remote for Day 2 cloud session."); const wkNotes = _notes[0]; const setWkNotes = _notes[1];

  /* Add attendee forms */
  const _cf = useState({ name: "", role: "Network Engineer", email: "", focus: "" }); const custForm = _cf[0]; const setCustForm = _cf[1];
  const _gf = useState({ name: "", role: "Solutions Architect", email: "", focus: "" }); const gttForm = _gf[0]; const setGttForm = _gf[1];
  const _sc = useState(false); const showCust = _sc[0]; const setShowCust = _sc[1];
  const _sg = useState(false); const showGtt = _sg[0]; const setShowGtt = _sg[1];

  const _gaps = useState([
    { id: 1, stakeholder: "CISO", title: "Chief Information Security Officer", severity: "critical", notes: "Security transformation requires executive security sponsor" },
    { id: 2, stakeholder: "CFO / Finance", title: "Chief Financial Officer", severity: "high", notes: "Business case approval needs finance stakeholder" },
    { id: 3, stakeholder: "Legal / Compliance", title: "General Counsel", severity: "high", notes: "Contract renegotiation requires legal review" },
    { id: 4, stakeholder: "Cloud Owner", title: "VP of Cloud & Platform", severity: "medium", notes: "James Kim remote-only, 3-week engagement gap" },
    { id: 5, stakeholder: "NOC / Operations", title: "NOC Manager", severity: "medium", notes: "Day-2 operations handoff undefined" },
  ]); const coverageGaps = _gaps[0]; const setCoverageGaps = _gaps[1];
  const _showAddGap = useState(false); const showAddGap = _showAddGap[0]; const setShowAddGap = _showAddGap[1];
  const gapStakeholders = ["CISO", "CFO / Finance", "CIO", "CTO", "COO", "Legal / Compliance", "Cloud Owner", "Network Owner", "Security Lead", "NOC / Operations", "Procurement", "IT Finance / FinOps", "Executive Sponsor", "Program Manager", "Other"];
  const gapTitles = ["Chief Information Security Officer", "Chief Financial Officer", "Chief Information Officer", "Chief Technology Officer", "VP of Infrastructure", "VP of Network Engineering", "VP of IT Operations", "VP of Cloud & Platform", "VP of Security", "Director of Network Services", "Director of IT Security", "Director of Cloud Operations", "General Counsel", "NOC Manager", "IT Procurement Lead", "Program Manager", "Other"];
  const gapSeverities = ["critical", "high", "medium", "low"];
  function updateGap(id, field, value) { setCoverageGaps(coverageGaps.map(function(g) { return g.id === id ? Object.assign({}, g, (function(){ var o = {}; o[field] = value; return o; })()) : g; })); }
  function removeGap(id) { setCoverageGaps(coverageGaps.filter(function(g) { return g.id !== id; })); }
  function addGap() { setCoverageGaps(coverageGaps.concat([{ id: Date.now(), stakeholder: "Other", title: "Other", severity: "medium", notes: "" }])); setShowAddGap(false); }

  function addCust() {
    if (!custForm.name) return;
    setCustAttendees(custAttendees.concat([Object.assign({}, custForm, { id: Date.now(), present: true })]));
    setCustForm({ name: "", role: "Network Engineer", email: "", focus: "" });
    setShowCust(false);
  }
  function addGtt() {
    if (!gttForm.name) return;
    setGttAttendees(gttAttendees.concat([Object.assign({}, gttForm, { id: Date.now(), present: true })]));
    setGttForm({ name: "", role: "Solutions Architect", email: "", focus: "" });
    setShowGtt(false);
  }

  const custPresent = custAttendees.filter(function (a) { return a.present; }).length;
  const gttPresent = gttAttendees.filter(function (a) { return a.present; }).length;
  const totalStakeholders = custAttendees.length;
  const executiveCount = custAttendees.filter(function(a){ return a.role.indexOf("CTO")>=0||a.role.indexOf("CIO")>=0||a.role.indexOf("CISO")>=0||a.role.indexOf("VP")>=0; }).length;
  const technicalCount = custAttendees.filter(function(a){ return a.role.indexOf("Architect")>=0||a.role.indexOf("Engineer")>=0||a.role.indexOf("Manager")>=0; }).length;

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function(x){return x.id==="stakeholder";})} />

    {/* Summary Cards Row */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Total Stakeholders", value: totalStakeholders, sub: custPresent + " present", color: T.cyan },
        { label: "Executive", value: executiveCount, sub: "CxO / VP level", color: T.green },
        { label: "Technical", value: technicalCount, sub: "Architects & Engineers", color: T.blue },
        { label: "Gaps", value: coverageGaps.length, sub: coverageGaps.filter(function(g){return g.severity==="critical";}).length + " critical", color: T.red },
      ].map(function(c) {
        return (<div key={c.label} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "14px 16px" }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: c.color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontFamily: T.f, fontSize: 24, fontWeight: 700, color: T.tp }}>{c.value}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{c.sub}</div>
        </div>);
      })}
    </div>

    {/* Session Notes */}
    <Nts tag="SESSION NOTES" tc={T.cyan} title="Workshop Logistics & Notes" sub="Agenda, schedule, logistics, key stakeholder availability" value={wkNotes} onChange={setWkNotes} rows={5} />

    {/* Two-column layout — attendee lists */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      {/* CUSTOMER ATTENDEES */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.blue, background: T.blue + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>CUSTOMER</span>
            <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>Meridian Financial Group</div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{custPresent} in-person · {custAttendees.filter(function(a){return a.virtual;}).length} virtual</div>
          </div>
          <button onClick={function () { setShowCust(!showCust); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.blue, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>{showCust ? "Cancel" : "+ Add"}</button>
        </div>
        <div style={{ padding: "10px 18px" }}>
          {showCust && (<div style={{ padding: "12px 14px", background: T.blue + "04", borderRadius: 8, marginBottom: 12, border: "1px solid " + T.blue + "12" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Name</label><input value={custForm.name} onChange={function (e) { setCustForm(Object.assign({}, custForm, { name: e.target.value })); }} placeholder="Full name" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Role / Title</label><select value={custForm.role} onChange={function (e) { setCustForm(Object.assign({}, custForm, { role: e.target.value })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{CUST_ROLES.map(function (r) { return <option key={r} value={r}>{r}</option>; })}</select></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Email</label><input value={custForm.email} onChange={function (e) { setCustForm(Object.assign({}, custForm, { email: e.target.value })); }} placeholder="email@company.com" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Focus Area</label><input value={custForm.focus} onChange={function (e) { setCustForm(Object.assign({}, custForm, { focus: e.target.value })); }} placeholder="e.g. WAN strategy lead" style={iS} /></div>
            </div>
            <button onClick={addCust} disabled={!custForm.name} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: custForm.name ? T.blue : T.td, border: "none", borderRadius: 5, padding: "6px 16px", cursor: custForm.name ? "pointer" : "not-allowed" }}>Add Attendee</button>
          </div>)}
          {custAttendees.map(function (a) {
            return <AttendeeRow key={a.id} a={a} roles={CUST_ROLES} onUpdate={function (field, value) { setCustAttendees(custAttendees.map(function (x) { return x.id === a.id ? Object.assign({}, x, (function () { var o = {}; o[field] = value; return o; })()) : x; })); }} onRemove={function () { setCustAttendees(custAttendees.filter(function (x) { return x.id !== a.id; })); }} />;
          })}
        </div>
      </div>

      {/* GTT ATTENDEES */}
      <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontFamily: T.m, fontSize: 9, color: T.cyan, background: T.cyan + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>GTT</span>
            <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>GTT Workshop Team</div>
            <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{gttPresent} in-person · {gttAttendees.filter(function(a){return a.virtual;}).length} virtual</div>
          </div>
          <button onClick={function () { setShowGtt(!showGtt); }} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.cyan, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>{showGtt ? "Cancel" : "+ Add"}</button>
        </div>
        <div style={{ padding: "10px 18px" }}>
          {showGtt && (<div style={{ padding: "12px 14px", background: T.cyan + "04", borderRadius: 8, marginBottom: 12, border: "1px solid " + T.cyan + "12" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Name</label><input value={gttForm.name} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { name: e.target.value })); }} placeholder="Full name" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Role / Title</label><select value={gttForm.role} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { role: e.target.value })); }} style={Object.assign({}, iS, { cursor: "pointer" })}>{GTT_ROLES.map(function (r) { return <option key={r} value={r}>{r}</option>; })}</select></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Email</label><input value={gttForm.email} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { email: e.target.value })); }} placeholder="email@gtt.net" style={iS} /></div>
              <div style={{ flex: 1, minWidth: 120 }}><label style={lbl}>Focus Area</label><input value={gttForm.focus} onChange={function (e) { setGttForm(Object.assign({}, gttForm, { focus: e.target.value })); }} placeholder="e.g. SD-WAN design" style={iS} /></div>
            </div>
            <button onClick={addGtt} disabled={!gttForm.name} style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: "#fff", background: gttForm.name ? T.cyan : T.td, border: "none", borderRadius: 5, padding: "6px 16px", cursor: gttForm.name ? "pointer" : "not-allowed" }}>Add Attendee</button>
          </div>)}
          {gttAttendees.map(function (a) {
            return <AttendeeRow key={a.id} a={a} roles={GTT_ROLES} onUpdate={function (field, value) { setGttAttendees(gttAttendees.map(function (x) { return x.id === a.id ? Object.assign({}, x, (function () { var o = {}; o[field] = value; return o; })()) : x; })); }} onRemove={function () { setGttAttendees(gttAttendees.filter(function (x) { return x.id !== a.id; })); }} />;
          })}
        </div>
      </div>
    </div>

    {/* Coverage Gaps */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: T.m, fontSize: 9, color: T.red, background: T.red + "11", padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>COVERAGE GAPS</span>
          <div style={{ fontFamily: T.f, fontSize: 14, fontWeight: 600, color: T.tp, marginTop: 5 }}>Missing stakeholders & access</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{coverageGaps.length} gaps · {coverageGaps.filter(function(g){return g.severity==="critical";}).length} critical</div>
        </div>
        <button onClick={addGap} style={{ fontFamily: T.f, fontSize: 10, color: "#fff", background: T.red, border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer" }}>+ Add Gap</button>
      </div>
      <div style={{ padding: "10px 18px" }}>
        {coverageGaps.map(function(g, i) {
          return (<div key={g.id} style={{ padding: "12px 0", borderBottom: i < coverageGaps.length - 1 ? "1px solid " + T.border : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <select value={g.stakeholder} onChange={function(e) { updateGap(g.id, "stakeholder", e.target.value); }} style={Object.assign({}, selS, { fontSize: 11, fontWeight: 600 })}>
                {gapStakeholders.map(function(s) { return <option key={s} value={s}>{s}</option>; })}
              </select>
              <select value={g.title} onChange={function(e) { updateGap(g.id, "title", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10, color: T.ts })}>
                {gapTitles.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
              </select>
              <select value={g.severity} onChange={function(e) { updateGap(g.id, "severity", e.target.value); }} style={Object.assign({}, selS, { fontSize: 10 })}>
                {gapSeverities.map(function(s) { return <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>; })}
              </select>
              <Sev s={g.severity} />
              <button onClick={function() { removeGap(g.id); }} style={{ background: "none", border: "none", color: T.td, cursor: "pointer", fontSize: 11, marginLeft: "auto" }}>✕</button>
            </div>
            <input value={g.notes} onChange={function(e) { updateGap(g.id, "notes", e.target.value); }} placeholder="Notes..." style={Object.assign({}, iS, { fontSize: 11, color: T.ts })} />
          </div>);
        })}
        {!coverageGaps.length && <div style={{ padding: 16, textAlign: "center", fontFamily: T.f, fontSize: 12, color: T.td, fontStyle: "italic" }}>No coverage gaps identified</div>}
      </div>
    </div>
  </div>);
}

export default StakeholderView;
