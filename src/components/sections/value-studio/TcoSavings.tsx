/* ──────────────────────────────────────────────────────────────
   TcoSavings – Side-by-side CPE comparison + savings delta cards
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { useTheme } from "../../../theme/useTheme";
import { CPE_COMPLEXITY, ENVISION_TIERS } from "../../../data/tco";
import { GlassCard } from "../../shared/Primitives";

interface TcoSavingsProps {
  incumbentProvider: string;
  tcoSiteCount: number;
  tcoTermMonths: number;
  cpeComplexity: string;
  envisionTier: string;
  incCpePerSite: number;
  gttCpePerSite: number;
  cpeSavingsPerSite: number;
  cpeSavingsMonthly: number;
  cpeSavingsAnnual: number;
  mrrSavings: number;
  mrrSavingsPct: number;
  tcoSavingsVal: number;
  tcoSavingsPct: number;
  incTco: number;
  gttTco: number;
  incMrr: number;
  gttMrr: number;
  bwUplift: number;
  incMaxSpeed: number;
  gttMaxSpeed: number;
  paybackMo: number | null;
  tcoOneTimeGtt: number;
  fmtK: (n: number | null) => string;
}

export const TcoSavings: React.FC<TcoSavingsProps> = ({
  incumbentProvider,
  tcoSiteCount,
  tcoTermMonths,
  cpeComplexity,
  envisionTier,
  incCpePerSite,
  gttCpePerSite,
  cpeSavingsPerSite,
  cpeSavingsMonthly,
  cpeSavingsAnnual,
  mrrSavings,
  mrrSavingsPct,
  tcoSavingsVal,
  tcoSavingsPct,
  incTco,
  gttTco,
  incMrr,
  gttMrr,
  bwUplift,
  incMaxSpeed,
  gttMaxSpeed,
  paybackMo,
  tcoOneTimeGtt,
  fmtK,
}) => {
  const { t } = useTheme();

  const incName = incumbentProvider.split(" ")[0].split("/")[0].split("(")[0].trim();
  const savingsColor = cpeSavingsPerSite > 0 ? t.emerald : t.rose;
  const cpePct =
    incCpePerSite > 0
      ? Math.round((Math.abs(cpeSavingsPerSite) / incCpePerSite) * 100)
      : 0;

  const cardLabel: React.CSSProperties = {
    fontSize: 9,
    color: t.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 8,
  };
  const cardValueStyle: (c: string) => React.CSSProperties = (c) => ({
    fontSize: 22,
    fontWeight: 700,
    fontFamily: t.fontM,
    lineHeight: 1,
    color: c,
  });
  const cardSub: React.CSSProperties = { fontSize: 10, color: t.textDim, marginTop: 4, fontFamily: t.fontM };
  const cardDetail: React.CSSProperties = { fontSize: 9, color: t.textDim, marginTop: 6 };
  const cardInner: React.CSSProperties = { textAlign: "center", padding: 14, borderRadius: 10 };

  return (
    <>
      {/* ── CPE Consolidation — Side-by-side ────────────── */}
      <GlassCard style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${t.rose}, ${t.textDim}, ${t.emerald})`,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
            CPE Consolidation Comparison
          </span>
          <span
            style={{
              fontSize: 9,
              padding: "2px 8px",
              borderRadius: 4,
              fontFamily: t.fontM,
              textTransform: "uppercase",
              background: `${t.emerald}15`,
              color: t.emerald,
            }}
          >
            EnvisionEDGE
          </span>
        </div>

        {/* Description */}
        <div style={{ fontSize: 11, color: t.textDim, lineHeight: 1.6, marginBottom: 14 }}>
          Single EnvisionEDGE device replaces routers, firewalls, SD-WAN appliances, WAN optimizers
          &mdash; 16 software-defined configurations in one box.
          {cpeComplexity === "complex" && (
            <span style={{ color: t.amber }}>
              {" "}Complex sites with 5+ devices see the highest savings.
            </span>
          )}
        </div>

        {/* Side-by-side CPE cards: Incumbent | Savings | GTT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
          {/* Incumbent CPE */}
          <div style={{ background: `${t.rose}08`, border: `1px solid ${t.rose}18`, ...cardInner }}>
            <div style={cardLabel}>{incName} CPE</div>
            <div style={cardValueStyle(t.rose)}>${incCpePerSite}</div>
            <div style={cardSub}>per site/mo</div>
            <div style={cardDetail}>{CPE_COMPLEXITY[cpeComplexity].label}</div>
          </div>

          {/* GTT EnvisionEDGE */}
          <div style={{ background: `${t.emerald}08`, border: `1px solid ${t.emerald}18`, ...cardInner }}>
            <div style={cardLabel}>GTT EnvisionEDGE</div>
            <div style={cardValueStyle(t.emerald)}>${gttCpePerSite}</div>
            <div style={cardSub}>per site/mo</div>
            <div style={cardDetail}>
              {ENVISION_TIERS[envisionTier].label.split(" \u2014 ")[0]}
            </div>
          </div>

          {/* Savings / Site / Mo */}
          <div style={{ background: `${savingsColor}08`, border: `1px solid ${savingsColor}18`, ...cardInner }}>
            <div style={cardLabel}>Delta / Site / Mo</div>
            <div style={cardValueStyle(savingsColor)}>${Math.abs(cpeSavingsPerSite)}</div>
            <div style={cardSub}>
              {cpeSavingsPerSite > 0 ? "saved" : "additional"}/site/mo
            </div>
            <div style={cardDetail}>
              x{tcoSiteCount} sites = ${Math.abs(cpeSavingsMonthly).toLocaleString()}/mo
            </div>
          </div>

          {/* Annual CPE Savings */}
          <div style={{ background: `${savingsColor}08`, border: `1px solid ${savingsColor}18`, ...cardInner }}>
            <div style={cardLabel}>Annual CPE Savings</div>
            <div style={cardValueStyle(savingsColor)}>{fmtK(Math.abs(cpeSavingsAnnual))}</div>
            <div style={cardSub}>per year</div>
            <div style={cardDetail}>
              {cpeSavingsAnnual > 0 ? `${cpePct}% reduction` : "over budget"}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Delta / Results — Side-by-side ──────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: 12 }}>
        {/* Incumbent totals */}
        <GlassCard style={{ textAlign: "center", padding: 16 }}>
          <div style={{ ...cardLabel, fontWeight: 500 }}>{incName} MRR</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.rose, fontFamily: t.fontM, lineHeight: 1 }}>
            {fmtK(incMrr)}/mo
          </div>
        </GlassCard>
        <GlassCard style={{ textAlign: "center", padding: 16 }}>
          <div style={{ ...cardLabel, fontWeight: 500 }}>GTT MRR</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.emerald, fontFamily: t.fontM, lineHeight: 1 }}>
            {fmtK(gttMrr)}/mo
          </div>
        </GlassCard>
        <GlassCard style={{ textAlign: "center", padding: 16 }}>
          <div style={{ ...cardLabel, fontWeight: 500 }}>MRR Savings</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: mrrSavings > 0 ? t.emerald : t.rose, fontFamily: t.fontM, lineHeight: 1 }}>
            {fmtK(mrrSavings)}/mo
          </div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, fontFamily: t.fontM }}>
            {mrrSavingsPct}%
          </div>
        </GlassCard>
        <GlassCard style={{ textAlign: "center", padding: 16 }}>
          <div style={{ ...cardLabel, fontWeight: 500 }}>TCO ({tcoTermMonths}mo)</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: tcoSavingsVal > 0 ? t.emerald : t.rose, fontFamily: t.fontM, lineHeight: 1 }}>
            {fmtK(tcoSavingsVal)}
          </div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, fontFamily: t.fontM }}>
            {tcoSavingsPct}%
          </div>
        </GlassCard>
        <GlassCard style={{ textAlign: "center", padding: 16 }}>
          <div style={{ ...cardLabel, fontWeight: 500 }}>BW Uplift</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: bwUplift > 0 ? t.violet : t.amber, fontFamily: t.fontM, lineHeight: 1 }}>
            {bwUplift > 0 ? "+" : ""}{bwUplift}%
          </div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, fontFamily: t.fontM }}>
            {incMaxSpeed}{"\u2192"}{gttMaxSpeed} Mbps
          </div>
        </GlassCard>
        <GlassCard style={{ textAlign: "center", padding: 16 }}>
          <div style={{ ...cardLabel, fontWeight: 500 }}>Payback</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.amber, fontFamily: t.fontM, lineHeight: 1 }}>
            {paybackMo !== null ? `${paybackMo} mo` : "N/A"}
          </div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, fontFamily: t.fontM }}>
            {tcoOneTimeGtt > 0 ? `on ${fmtK(tcoOneTimeGtt)}` : "no one-time"}
          </div>
        </GlassCard>
      </div>
    </>
  );
};
