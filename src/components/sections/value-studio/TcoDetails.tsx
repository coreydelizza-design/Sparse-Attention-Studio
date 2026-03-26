/* ──────────────────────────────────────────────────────────────
   TcoDetails – Side-by-side line-item breakdown, assumptions,
   AI insight section, recommendations / risks / tips
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { useTheme } from "../../../theme/useTheme";
import { CPE_COMPLEXITY, ENVISION_TIERS } from "../../../data/tco";
import { GlassCard, SectionHeader } from "../../shared/Primitives";

interface StackLine {
  label: string;
  monthly: number;
}

interface TcoData {
  executiveSummary?: string;
  recommendations?: string[];
  riskFactors?: string[];
  negotiationTips?: string[];
}

interface TcoDetailsProps {
  incumbentProvider: string;
  tcoBenchmark: string;
  tcoTermMonths: number;
  tcoSiteCount: number;
  tcoRedundancy: number;
  tcoManagedPerSite: number;
  cpeComplexity: string;
  envisionTier: string;
  incCpePerSite: number;
  gttCpePerSite: number;
  incLines: StackLine[];
  gttLines: StackLine[];
  incMrr: number;
  gttMrr: number;
  mrrSavings: number;
  mrrSavingsPct: string;
  tcoSavingsVal: number;
  cpeSavingsPerSite: number;
  cpeSavingsAnnual: number;
  bwUplift: number;
  paybackMo: number | null;
  tcoConfidence: string;
  tcoData: TcoData | null;
  tcoLoading: boolean;
  fmtK: (n: number | null) => string;
}

export const TcoDetails: React.FC<TcoDetailsProps> = ({
  incumbentProvider,
  tcoBenchmark,
  tcoTermMonths,
  tcoSiteCount,
  tcoRedundancy,
  tcoManagedPerSite,
  cpeComplexity,
  envisionTier,
  incCpePerSite,
  gttCpePerSite,
  incLines,
  gttLines,
  incMrr,
  gttMrr,
  mrrSavings,
  mrrSavingsPct,
  tcoSavingsVal,
  cpeSavingsPerSite,
  cpeSavingsAnnual,
  bwUplift,
  paybackMo,
  tcoConfidence,
  tcoData,
  tcoLoading,
  fmtK,
}) => {
  const { t } = useTheme();

  const incName = incumbentProvider.split(" ")[0].split("/")[0].split("(")[0].trim();

  /* ── Shared line-item row renderer ────────────────────── */
  const lineRow = (l: StackLine, i: number, total: number) => (
    <div
      key={i}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: i < total - 1 ? `1px solid ${t.borderSubtle}` : "none",
      }}
    >
      <span style={{ fontSize: 12, color: t.textMuted }}>{l.label}</span>
      <span style={{ fontSize: 12, color: t.text, fontFamily: t.fontM }}>
        ${l.monthly.toLocaleString()}/mo
      </span>
    </div>
  );

  const assumptions = [
    { cat: "Provider", param: "Incumbent", val: incumbentProvider, src: "input" },
    { cat: "Contract", param: "Term Length", val: `${tcoTermMonths} months`, src: "input" },
    { cat: "Pricing", param: "GTT Benchmark", val: tcoBenchmark, src: "input" },
    {
      cat: "Pricing",
      param: `${incName} Benchmark`,
      val: "high (top quartile)",
      src: "default",
    },
    {
      cat: "CPE",
      param: "Incumbent Complexity",
      val: `${CPE_COMPLEXITY[cpeComplexity].label} \u2014 $${incCpePerSite}/site`,
      src: "input",
    },
    {
      cat: "CPE",
      param: "GTT EnvisionEDGE",
      val: `${ENVISION_TIERS[envisionTier].label.split(" \u2014 ")[0]} \u2014 $${gttCpePerSite}/site`,
      src: "input",
    },
    { cat: "Sites", param: "Total Sites", val: String(tcoSiteCount), src: "input" },
    { cat: "Sites", param: "Redundancy Coverage", val: `${tcoRedundancy}%`, src: "input" },
    { cat: "Services", param: "Managed Svc / Site", val: `$${tcoManagedPerSite}/mo`, src: "input" },
  ];

  // Fallback AI summary
  const buildFallbackSummary = (): string => {
    if (mrrSavings > 0) {
      let s = `Migrating from ${incumbentProvider} to GTT saves ${fmtK(mrrSavings)}/mo (${mrrSavingsPct}%) with ${fmtK(tcoSavingsVal)} total savings over ${tcoTermMonths} months.`;
      if (cpeSavingsPerSite > 0)
        s += ` CPE consolidation via EnvisionEDGE saves an additional ${fmtK(Math.abs(cpeSavingsAnnual))}/year.`;
      if (bwUplift > 0) s += ` Bandwidth increases by ${bwUplift}%.`;
      if (paybackMo !== null && paybackMo > 0) s += ` Investment payback in ${paybackMo} months.`;
      s += ` Confidence: ${tcoConfidence}.`;
      return s;
    }
    return `The proposed GTT stack currently costs more than ${incumbentProvider}. Adjust access types, speed tiers, or site counts to find savings opportunities.`;
  };

  const aiSections: { title: string; items: string[] | undefined; color: string }[] = [
    { title: "Recommendations", items: tcoData?.recommendations, color: t.emerald },
    { title: "Risk Factors", items: tcoData?.riskFactors, color: t.amber },
    { title: "Negotiation Strategies", items: tcoData?.negotiationTips, color: t.cyan },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Side-by-side Line Items ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* LEFT — Incumbent line items */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.rose }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: t.rose }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: t.rose, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {incName} Line Items
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.rose, fontFamily: t.fontM }}>
              ${incMrr.toLocaleString()}/mo
            </span>
          </div>
          {incLines.map((l, i) => lineRow(l, i, incLines.length))}
        </GlassCard>

        {/* RIGHT — GTT line items */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.emerald }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: t.emerald }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: t.emerald, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                GTT Line Items
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.emerald, fontFamily: t.fontM }}>
              ${gttMrr.toLocaleString()}/mo
            </span>
          </div>
          {gttLines.map((l, i) => lineRow(l, i, gttLines.length))}
        </GlassCard>
      </div>

      {/* ── Assumptions + AI Insight ────────────────────── */}
      <GlassCard>
        <SectionHeader tag="INPUTS">Assumptions Used</SectionHeader>

        {assumptions.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 0",
              borderBottom: i < assumptions.length - 1 ? `1px solid ${t.borderSubtle}` : "none",
            }}
          >
            <span
              style={{
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 3,
                fontWeight: 600,
                fontFamily: t.fontM,
                minWidth: 56,
                textAlign: "center",
                background: `${t.cyan}15`,
                color: t.cyan,
              }}
            >
              {a.cat}
            </span>
            <span style={{ fontSize: 12, color: t.textMuted, flex: 1 }}>{a.param}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: t.fontM }}>
              {a.val}
            </span>
            <span
              style={{
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 3,
                fontFamily: t.fontM,
                background: a.src === "input" ? `${t.emerald}12` : t.bgGlass,
                color: a.src === "input" ? `${t.emerald}80` : t.textDim,
              }}
            >
              {a.src}
            </span>
          </div>
        ))}

        {/* AI Insight */}
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${t.emerald}08, ${t.violet}08)`,
            border: `1px solid ${t.emerald}18`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span>{"\uD83D\uDCA1"}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: t.text }}>AI Insight</span>
            <span
              style={{
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 3,
                fontFamily: t.fontM,
                background: `${t.violet}15`,
                color: t.violet,
              }}
            >
              Claude
            </span>
          </div>

          {tcoData?.executiveSummary ? (
            <div style={{ fontSize: 12, lineHeight: 1.7, color: t.textMuted }}>
              {tcoData.executiveSummary}
            </div>
          ) : tcoLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[85, 70, 55].map((w) => (
                <div
                  key={w}
                  style={{
                    height: 10,
                    width: `${w}%`,
                    background: t.bgGlass,
                    borderRadius: 4,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, lineHeight: 1.7, color: t.textMuted }}>
              {buildFallbackSummary()}
            </div>
          )}
        </div>

        {/* Recommendations / Risks / Tips */}
        {aiSections.map(
          (sec) =>
            sec.items &&
            sec.items.length > 0 && (
              <div key={sec.title} style={{ marginTop: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: sec.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  {sec.title}
                </div>
                {sec.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 6,
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: t.textMuted,
                    }}
                  >
                    <span style={{ color: sec.color }}>{"\u25B8"}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ),
        )}
      </GlassCard>
    </div>
  );
};
