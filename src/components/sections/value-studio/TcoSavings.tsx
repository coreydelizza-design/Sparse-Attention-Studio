/* ──────────────────────────────────────────────────────────────
   TcoSavings – CPE consolidation savings + 6 delta/result cards
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

  const savingsColor = cpeSavingsPerSite > 0 ? t.emerald : t.rose;
  const cpePct =
    incCpePerSite > 0
      ? Math.round((Math.abs(cpeSavingsPerSite) / incCpePerSite) * 100)
      : 0;

  const cardInner: React.CSSProperties = { textAlign: "center", padding: 14, borderRadius: 10 };
  const cardLabel: React.CSSProperties = {
    fontSize: 9,
    color: t.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 8,
  };
  const cardValue: (c: string) => React.CSSProperties = (c) => ({
    fontSize: 22,
    fontWeight: 700,
    fontFamily: t.fontM,
    lineHeight: 1,
    color: c,
  });
  const cardSub: React.CSSProperties = { fontSize: 10, color: t.textDim, marginTop: 4, fontFamily: t.fontM };
  const cardDetail: React.CSSProperties = { fontSize: 9, color: t.textDim, marginTop: 6 };

  const deltaCards = [
    {
      label: "MRR Savings",
      value: `${fmtK(mrrSavings)}/mo`,
      sub: `${mrrSavingsPct}%`,
      color: mrrSavings > 0 ? t.emerald : t.rose,
    },
    {
      label: `TCO (${tcoTermMonths}mo)`,
      value: fmtK(tcoSavingsVal),
      sub: `${tcoSavingsPct}%`,
      color: tcoSavingsVal > 0 ? t.emerald : t.rose,
    },
    {
      label: `${incumbentProvider.split("/")[0].trim()} TCO`,
      value: fmtK(incTco),
      sub: `${fmtK(incMrr)}/mo`,
      color: t.rose,
    },
    {
      label: "GTT TCO",
      value: fmtK(gttTco),
      sub: `${fmtK(gttMrr)}/mo`,
      color: t.cyan,
    },
    {
      label: "BW Uplift",
      value: `${bwUplift > 0 ? "+" : ""}${bwUplift}%`,
      sub: `${incMaxSpeed}\u2192${gttMaxSpeed} Mbps`,
      color: bwUplift > 0 ? t.violet : t.amber,
    },
    {
      label: "Payback",
      value: paybackMo !== null ? `${paybackMo} mo` : "N/A",
      sub: tcoOneTimeGtt > 0 ? `on ${fmtK(tcoOneTimeGtt)}` : "no one-time",
      color: t.amber,
    },
  ];

  return (
    <>
      {/* ── CPE Consolidation Savings ───────────────────── */}
      <GlassCard style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${t.emerald}, ${t.cyan})`,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
            {"\uD83D\uDD37"} CPE Consolidation Savings
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
              {" "}
              Complex sites with 5+ devices see the highest savings.
            </span>
          )}
        </div>

        {/* 4-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {/* Incumbent CPE */}
          <div style={{ background: `${t.rose}08`, border: `1px solid ${t.rose}18`, ...cardInner }}>
            <div style={cardLabel}>Incumbent CPE</div>
            <div style={cardValue(t.rose)}>${incCpePerSite}</div>
            <div style={cardSub}>per site/mo</div>
            <div style={cardDetail}>{CPE_COMPLEXITY[cpeComplexity].label}</div>
          </div>

          {/* EnvisionEDGE */}
          <div style={{ background: `${t.emerald}08`, border: `1px solid ${t.emerald}18`, ...cardInner }}>
            <div style={cardLabel}>EnvisionEDGE</div>
            <div style={cardValue(t.emerald)}>${gttCpePerSite}</div>
            <div style={cardSub}>per site/mo</div>
            <div style={cardDetail}>
              {ENVISION_TIERS[envisionTier].label.split(" \u2014 ")[0]}
            </div>
          </div>

          {/* Savings / Site / Mo */}
          <div style={{ background: `${savingsColor}08`, border: `1px solid ${savingsColor}18`, ...cardInner }}>
            <div style={cardLabel}>Savings / Site / Mo</div>
            <div style={cardValue(savingsColor)}>${Math.abs(cpeSavingsPerSite)}</div>
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
            <div style={cardValue(savingsColor)}>{fmtK(Math.abs(cpeSavingsAnnual))}</div>
            <div style={cardSub}>per year</div>
            <div style={cardDetail}>
              {cpeSavingsAnnual > 0 ? `${cpePct}% reduction` : "over budget"}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Delta / Results Dashboard ───────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {deltaCards.map((card) => (
          <GlassCard key={card.label} style={{ textAlign: "center", padding: 16 }}>
            <div
              style={{
                fontSize: 9,
                color: t.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: card.color,
                fontFamily: t.fontM,
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, fontFamily: t.fontM }}>
              {card.sub}
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
};
