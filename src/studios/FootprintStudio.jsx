import { T, SECS } from "../tokens";
import { SecHead, PrimaryCard, Disc, Bar } from "../components/primitives";

function FootprintView() {
  /* Mock GTT footprint data */
  const services = [
    { name: "SD-WAN (Managed)", status: "Active", sites: 8, mrr: "$12K", category: "Network" },
    { name: "DIA", status: "Active", sites: 42, mrr: "$56K", category: "Network" },
    { name: "MPLS", status: "Active", sites: 87, mrr: "$175K", category: "Network" },
    { name: "Broadband", status: "Active", sites: 12, mrr: "$8K", category: "Network" },
    { name: "SIP / Voice", status: "Active", sites: 35, mrr: "$22K", category: "Voice" },
    { name: "Cloud Connect (AWS)", status: "Active", sites: 2, mrr: "$18K", category: "Cloud" },
    { name: "EnvisionDX", status: "Pilot", sites: 8, mrr: "$4K", category: "Managed" },
    { name: "LTE Backup", status: "Active", sites: 35, mrr: "$8K", category: "Network" },
  ];

  const regions = [
    { region: "Northeast US", sites: 34, services: 4, products: "MPLS, DIA, SIP, LTE", penetration: 72 },
    { region: "Southeast US", sites: 28, services: 3, products: "MPLS, DIA, SIP", penetration: 58 },
    { region: "Midwest US", sites: 22, services: 2, products: "MPLS, DIA", penetration: 42 },
    { region: "West US", sites: 19, services: 3, products: "MPLS, DIA, LTE", penetration: 55 },
    { region: "Canada", sites: 22, services: 2, products: "MPLS, DIA", penetration: 38 },
    { region: "Pinnacle (Acquired)", sites: 38, services: 1, products: "MPLS only", penetration: 15 },
    { region: "NorthStar (Acquired)", sites: 12, services: 0, products: "None — not on GTT", penetration: 0 },
    { region: "Data Centers", sites: 3, services: 5, products: "DIA, Cloud Connect, MPLS, SIP, EnvisionDX", penetration: 90 },
  ];

  const expansionSignals = [
    { signal: "NorthStar Wealth — 12 sites, zero GTT presence", type: "White Space", potential: "$24K MRR", priority: "Critical" },
    { signal: "Pinnacle Insurance — single-product (MPLS only)", type: "Cross-Sell", potential: "$42K MRR", priority: "High" },
    { signal: "SD-WAN expansion: 8 → 125 sites", type: "Upsell", potential: "$180K MRR", priority: "High" },
    { signal: "SASE / Security — no GTT security services", type: "White Space", potential: "$95K MRR", priority: "High" },
    { signal: "Cloud Connect — Azure ExpressRoute not sold", type: "Cross-Sell", potential: "$14K MRR", priority: "Medium" },
    { signal: "Managed Services — EnvisionDX pilot → full deploy", type: "Upsell", potential: "$35K MRR", priority: "Medium" },
    { signal: "Canada — LTE backup not deployed (22 sites)", type: "Cross-Sell", potential: "$5K MRR", priority: "Low" },
  ];

  const contracts = [
    { name: "MPLS Master", value: "$2.1M/yr", renewal: "Dec 2026", status: "At Risk", action: "Transition to SD-WAN" },
    { name: "DIA Bundle", value: "$680K/yr", renewal: "M2M", status: "Healthy", action: "Expand" },
    { name: "SIP / Voice", value: "$264K/yr", renewal: "Jun 2027", status: "Healthy", action: "Retain" },
    { name: "Cloud Connect", value: "$216K/yr", renewal: "2027", status: "Healthy", action: "Expand" },
    { name: "EnvisionDX Pilot", value: "$48K/yr", renewal: "Q1 2026", status: "Pilot", action: "Convert to production" },
  ];

  const totalMRR = "$303K";
  const totalARR = "$3.64M";
  const totalSites = 178;
  const gttEnabledSites = 141;
  const activeServices = services.filter(function(s){ return s.status === "Active"; }).length;
  const expansionMRR = expansionSignals.reduce(function(a, s) {
    var num = parseInt(s.potential.replace(/[^0-9]/g, ""));
    return a + num;
  }, 0);

  const penetrationColor = function(p) { return p >= 70 ? T.green : p >= 40 ? T.amber : T.red; };

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <SecHead s={SECS.find(function(x){return x.id==="footprint";})} />

    {/* Footprint Summary Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Active Services", value: activeServices, sub: services.length + " total products", color: T.teal },
        { label: "GTT-Enabled Sites", value: gttEnabledSites + "/" + totalSites, sub: Math.round(gttEnabledSites/totalSites*100) + "% coverage", color: T.blue },
        { label: "Current MRR", value: totalMRR, sub: totalARR + " ARR", color: T.green },
        { label: "Expansion Potential", value: "$" + Math.round(expansionMRR) + "K MRR", sub: expansionSignals.length + " signals identified", color: T.violet },
      ].map(function(c) {
        return (<div key={c.label} style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "14px 16px" }}>
          <div style={{ fontFamily: T.m, fontSize: 9, color: c.color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontFamily: T.f, fontSize: 24, fontWeight: 700, color: T.tp }}>{c.value}</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.td, marginTop: 2 }}>{c.sub}</div>
        </div>);
      })}
    </div>

    {/* Service Mix + Attach Depth */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Services in Place */}
      <PrimaryCard tag="SERVICE MIX" tagColor={T.teal} title="Active GTT services">
        {services.map(function(s, i) {
          var statusColor = s.status === "Active" ? T.green : s.status === "Pilot" ? T.cyan : T.td;
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < services.length - 1 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.m, fontSize: 9, color: statusColor, background: statusColor + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 42, textAlign: "center", flexShrink: 0 }}>{s.status}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{s.name}</div>
              <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{s.sites} sites · {s.category}</div>
            </div>
            <span style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp, flexShrink: 0 }}>{s.mrr}</span>
          </div>);
        })}
      </PrimaryCard>

      {/* Product Penetration */}
      <PrimaryCard tag="PRODUCT PENETRATION" tagColor={T.blue} title="Attach depth by category">
        {[
          { label: "Connectivity (MPLS/DIA/BB)", pct: 82, color: T.blue },
          { label: "SD-WAN", pct: 6, color: T.cyan },
          { label: "Voice / SIP", pct: 28, color: T.green },
          { label: "Cloud Connect", pct: 4, color: T.violet },
          { label: "Security / SASE", pct: 0, color: T.red },
          { label: "Managed Services", pct: 6, color: T.teal },
          { label: "LTE / Wireless Backup", pct: 28, color: T.amber },
        ].map(function(p, i) {
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 6 ? "1px solid " + T.border : "none" }}>
            <span style={{ fontFamily: T.f, fontSize: 11, color: T.tp, width: 160, flexShrink: 0 }}>{p.label}</span>
            <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: Math.max(p.pct, 1) + "%", height: "100%", background: p.color, borderRadius: 4, minWidth: p.pct > 0 ? 3 : 0 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: p.pct >= 30 ? T.green : p.pct >= 10 ? T.amber : T.red, width: 32, textAlign: "right" }}>{p.pct}%</span>
          </div>);
        })}
        <div style={{ marginTop: 10, padding: "10px 12px", background: T.red + "06", borderRadius: 6, border: "1px solid " + T.red + "12" }}>
          <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: T.red }}>White Space Alert</div>
          <div style={{ fontFamily: T.f, fontSize: 11, color: T.ts, marginTop: 2 }}>Security / SASE has 0% penetration. SD-WAN at 6%. Significant expansion opportunity across both categories.</div>
        </div>
      </PrimaryCard>
    </div>

    {/* Regional Presence */}
    <Disc tag="REGIONAL PRESENCE" tagColor={T.blue} title="Sites by region" summary={regions.length + " regions · " + gttEnabledSites + " GTT-enabled sites"} defaultOpen={true}>
      {regions.map(function(r, i) {
        return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < regions.length - 1 ? "1px solid " + T.border : "none" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{r.region}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>{r.sites} sites · {r.services} products · {r.products}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 80, height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
              <div style={{ width: r.penetration + "%", height: "100%", background: penetrationColor(r.penetration), borderRadius: 3 }} />
            </div>
            <span style={{ fontFamily: T.m, fontSize: 10, fontWeight: 600, color: penetrationColor(r.penetration), width: 32, textAlign: "right" }}>{r.penetration}%</span>
          </div>
        </div>);
      })}
    </Disc>

    {/* Expansion Signals */}
    <Disc tag="EXPANSION SIGNALS" tagColor={T.violet} title="Growth opportunities" summary={"$" + Math.round(expansionMRR) + "K MRR potential · " + expansionSignals.length + " signals"}>
      {expansionSignals.map(function(s, i) {
        var pc = s.priority === "Critical" ? T.red : s.priority === "High" ? T.amber : s.priority === "Medium" ? T.blue : T.td;
        var tc = s.type === "White Space" ? T.red : s.type === "Cross-Sell" ? T.violet : T.teal;
        return (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < expansionSignals.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: pc, background: pc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0, marginTop: 2 }}>{s.priority}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 500, color: T.tp }}>{s.signal}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: T.m, fontSize: 9, color: tc, background: tc + "10", padding: "1px 6px", borderRadius: 3 }}>{s.type}</span>
              <span style={{ fontFamily: T.m, fontSize: 9, color: T.green, background: T.green + "10", padding: "1px 6px", borderRadius: 3 }}>{s.potential}</span>
            </div>
          </div>
        </div>);
      })}
    </Disc>

    {/* Contract / Footprint Health */}
    <Disc tag="CONTRACT HEALTH" tagColor={T.amber} title="Renewal exposure & risk" summary={contracts.length + " contracts · " + contracts.filter(function(c){return c.status==="At Risk";}).length + " at risk"}>
      {contracts.map(function(c, i) {
        var sc = c.status === "Healthy" ? T.green : c.status === "At Risk" ? T.red : c.status === "Pilot" ? T.cyan : T.td;
        return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < contracts.length - 1 ? "1px solid " + T.border : "none" }}>
          <span style={{ fontFamily: T.m, fontSize: 9, color: sc, background: sc + "12", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", width: 50, textAlign: "center", flexShrink: 0 }}>{c.status}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.f, fontSize: 12, fontWeight: 600, color: T.tp }}>{c.name}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td }}>Renewal: {c.renewal} · {c.action}</div>
          </div>
          <span style={{ fontFamily: T.m, fontSize: 11, fontWeight: 600, color: T.tp, flexShrink: 0 }}>{c.value}</span>
        </div>);
      })}
    </Disc>

    {/* Footprint Quality Summary */}
    <div style={{ background: T.card, borderRadius: 10, border: "1px solid " + T.border, padding: "16px 18px" }}>
      <div style={{ fontFamily: T.m, fontSize: 9, color: T.teal, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>FOOTPRINT QUALITY</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Service Diversity", value: "Low", detail: "82% revenue from connectivity", color: T.red },
          { label: "Multi-Product Sites", value: "23%", detail: "Most sites single-product", color: T.amber },
          { label: "Renewal Concentration", value: "High Risk", detail: "58% ARR renews Dec 2026", color: T.red },
        ].map(function(q) {
          return (<div key={q.label} style={{ padding: "10px 12px", background: q.color + "06", borderRadius: 6, border: "1px solid " + q.color + "12" }}>
            <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 600, color: q.color }}>{q.value}</div>
            <div style={{ fontFamily: T.f, fontSize: 11, fontWeight: 500, color: T.tp, marginTop: 2 }}>{q.label}</div>
            <div style={{ fontFamily: T.f, fontSize: 10, color: T.td, marginTop: 2 }}>{q.detail}</div>
          </div>);
        })}
      </div>
    </div>
  </div>);
}

export default FootprintView;
