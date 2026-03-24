import { useState, useCallback } from "react";
import { T, SECS } from "./tokens";
import { INIT_SITES, INIT_PROVS, INIT_NET_ELS, INIT_SEC_TOOLS, INIT_CLOUD_RES, INIT_CUST_ATTENDEES, INIT_GTT_ATTENDEES } from "./data/initialData";
import { FP, VP, RoP, DeP } from "./data/constants";
import { Sidebar, Header } from "./components/layout";
import CmdCenter from "./studios/CommandStudio";
import ExecView from "./studios/ExecutiveStudio";
import StakeholderView from "./studios/StakeholderStudio";
import FootprintView from "./studios/FootprintStudio";
import CurrentView from "./studios/InfrastructureStudio";
import NetView from "./studios/NetworkStudio";
import SecView from "./studios/SecurityStudio";
import CldView from "./studios/CloudStudio";
import SimpleView from "./studios/SimpleStudio";

export default function App() {
  const _a = useState("command"); const active = _a[0]; const setActive = _a[1];
  const _s = useState(INIT_SITES); const sites = _s[0]; const setSites = _s[1];
  const _p = useState(INIT_PROVS); const providers = _p[0]; const setProviders = _p[1];
  const _ne = useState(INIT_NET_ELS); const netEls = _ne[0]; const setNetEls = _ne[1];
  const _st = useState(INIT_SEC_TOOLS); const secTools = _st[0]; const setSecTools = _st[1];
  const _cr = useState(INIT_CLOUD_RES); const cloudRes = _cr[0]; const setCloudRes = _cr[1];
  const _nf = useState(["SE cluster: 12% packet loss", "23% CPE past EOS", "No cloud breakout +38ms", "Monitoring fragmented", "6 sites frame relay"]); const netFindings = _nf[0]; const setNetFindings = _nf[1];
  const _sf = useState(["38 Pinnacle firewalls past EOS", "No microsegmentation", "Shadow IT: 340+ apps", "VPN split-tunnel unfiltered"]); const secFindings = _sf[0]; const setSecFindings = _sf[1];
  const _cf = useState(["$42K/mo egress", "No GCP link", "Branch hairpin +38ms", "No Transit Gateway Azure"]); const cloudFindings = _cf[0]; const setCloudFindings = _cf[1];
  const _ca = useState(INIT_CUST_ATTENDEES); const custAttendees = _ca[0]; const setCustAttendees = _ca[1];
  const _ga = useState(INIT_GTT_ATTENDEES); const gttAttendees = _ga[0]; const setGttAttendees = _ga[1];
  const nav = useCallback(function (id) { setActive(id); }, []);
  const totalSites = sites.reduce(function (a, s) { return a + s.count; }, 0);
  const stats = { pct: 64, nr: 72, sr: 58, cr: 45, totalSites: totalSites, totalProviders: providers.length, totalNetEls: netEls.length, totalSecTools: secTools.length, totalCloudRes: cloudRes.length, totalFindings: netFindings.length + secFindings.length + cloudFindings.length, custAttendees: custAttendees.filter(function (a) { return a.present; }).length, gttAttendees: gttAttendees.filter(function (a) { return a.present; }).length };

  function renderContent() {
    switch (active) {
      case "command": return <CmdCenter onNav={nav} stats={stats} />;
      case "stakeholder": return <StakeholderView custAttendees={custAttendees} setCustAttendees={setCustAttendees} gttAttendees={gttAttendees} setGttAttendees={setGttAttendees} />;
      case "executive": return <ExecView onNav={nav} />;
      case "footprint": return <FootprintView />;
      case "current": return <CurrentView sites={sites} setSites={setSites} providers={providers} setProviders={setProviders} />;
      case "network": return <NetView sites={sites} providers={providers} netEls={netEls} setNetEls={setNetEls} netFindings={netFindings} setNetFindings={setNetFindings} />;
      case "security": return <SecView secTools={secTools} setSecTools={setSecTools} secFindings={secFindings} setSecFindings={setSecFindings} />;
      case "cloud": return <CldView cloudRes={cloudRes} setCloudRes={setCloudRes} cloudFindings={cloudFindings} setCloudFindings={setCloudFindings} />;
      case "future": return <SimpleView sid="future" items={FP} />;
      case "value": return <SimpleView sid="value" items={VP} />;
      case "roadmap": return <SimpleView sid="roadmap" items={RoP} />;
      case "deliver": return <SimpleView sid="deliver" items={DeP} />;
      default: return <CmdCenter onNav={nav} stats={stats} />;
    }
  }

  return (<div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.f }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');textarea:focus,input:focus,select:focus{outline:none;border-color:#06b6d4!important;}select{cursor:pointer;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px;}`}</style>
    <Sidebar active={active} onNav={nav} stats={stats} />
    <div style={{ marginLeft: 218, flex: 1, minHeight: "100vh" }}>
      <Header section={active} />
      <div style={{ paddingTop: 64, paddingBottom: 40, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>{renderContent()}</div>
      </div>
    </div>
  </div>);
}
