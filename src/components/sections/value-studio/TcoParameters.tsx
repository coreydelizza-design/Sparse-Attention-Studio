/* ──────────────────────────────────────────────────────────────
   TcoParameters – Provider selector, numeric params, CPE /
   EnvisionEDGE pickers, benchmark toggle, pricing-tier cards
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { useTheme } from "../../../theme/useTheme";
import {
  INCUMBENT_PROVIDERS,
  getProviderRates,
  GTT_RATES,
  CPE_COMPLEXITY,
  ENVISION_TIERS,
} from "../../../data/tco";
import { GlassCard, SectionHeader } from "../../shared/Primitives";

interface TcoParametersProps {
  incumbentProvider: string;
  setIncumbentProvider: (v: string) => void;
  tcoSiteCount: number;
  setTcoSiteCount: (v: number) => void;
  tcoTermMonths: number;
  setTcoTermMonths: (v: number) => void;
  tcoManagedPerSite: number;
  setTcoManagedPerSite: (v: number) => void;
  tcoOneTimeInc: number;
  setTcoOneTimeInc: (v: number) => void;
  tcoOneTimeGtt: number;
  setTcoOneTimeGtt: (v: number) => void;
  tcoRedundancy: number;
  setTcoRedundancy: (v: number) => void;
  cpeComplexity: string;
  setCpeComplexity: (v: string) => void;
  envisionTier: string;
  setEnvisionTier: (v: string) => void;
  tcoBenchmark: string;
  setTcoBenchmark: (v: string) => void;
  incCpePerSite: number;
}

export const TcoParameters: React.FC<TcoParametersProps> = ({
  incumbentProvider,
  setIncumbentProvider,
  tcoSiteCount,
  setTcoSiteCount,
  tcoTermMonths,
  setTcoTermMonths,
  tcoManagedPerSite,
  setTcoManagedPerSite,
  tcoOneTimeInc,
  setTcoOneTimeInc,
  tcoOneTimeGtt,
  setTcoOneTimeGtt,
  tcoRedundancy,
  setTcoRedundancy,
  cpeComplexity,
  setCpeComplexity,
  envisionTier,
  setEnvisionTier,
  tcoBenchmark,
  setTcoBenchmark,
  incCpePerSite,
}) => {
  const { t } = useTheme();

  const pr = getProviderRates(incumbentProvider);
  const incName = incumbentProvider.split(" ")[0].split("/")[0].split("(")[0].trim();
  const fmtRange = (arr: number[]) => `$${arr[0].toLocaleString()} \u2013 $${arr[2].toLocaleString()}`;
  const fmtMid = (arr: number[]) => `$${arr[1].toLocaleString()}`;

  const selectBase: React.CSSProperties = {
    background: t.bg,
    color: t.text,
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    fontFamily: t.fontD,
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    color: t.textDim,
    marginBottom: 6,
    fontWeight: 500,
  };

  const numericInputStyle: React.CSSProperties = {
    width: "100%",
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 12,
    fontFamily: t.fontM,
  };

  const numericParams = [
    { label: "Sites", value: tcoSiteCount, set: setTcoSiteCount },
    { label: "Term (mo)", value: tcoTermMonths, set: setTcoTermMonths },
    { label: "Managed $/site", value: tcoManagedPerSite, set: setTcoManagedPerSite },
    { label: `One-Time ${incumbentProvider.split(" ")[0]}`, value: tcoOneTimeInc, set: setTcoOneTimeInc },
    { label: "One-Time GTT", value: tcoOneTimeGtt, set: setTcoOneTimeGtt },
    { label: "Redundancy %", value: tcoRedundancy, set: setTcoRedundancy },
  ];

  const optgroups = [
    { label: "North America", items: INCUMBENT_PROVIDERS.slice(0, 11) },
    { label: "Europe", items: INCUMBENT_PROVIDERS.slice(11, 24) },
    { label: "Asia-Pacific", items: INCUMBENT_PROVIDERS.slice(24, 34) },
    { label: "Global MSPs / Integrators", items: INCUMBENT_PROVIDERS.slice(34, 44) },
    { label: "Other", items: INCUMBENT_PROVIDERS.slice(44) },
  ];

  const incTiers = [
    { label: "MPLS", arr: pr.mpls },
    { label: "SD-WAN", arr: pr.sdwan },
    { label: "Security", arr: pr.security },
    { label: "Circuit", arr: pr.circuit },
    { label: "Managed CPE", arr: pr.cpe },
  ];

  const gttTiers = [
    { label: "Managed SD-WAN", arr: GTT_RATES.sdwan },
    { label: "Managed Security", arr: GTT_RATES.security },
    { label: "Network / Circuit", arr: GTT_RATES.network },
    { label: "EnvisionEDGE Device", arr: GTT_RATES.envisionEdge },
  ];

  return (
    <>
      {/* ── Card 1 — Parameters ─────────────────────────── */}
      <GlassCard>
        <SectionHeader tag="CONFIG" sub="Global settings">
          Parameters
        </SectionHeader>

        {/* Provider selector */}
        <div>
          <div style={labelStyle}>Incumbent Provider</div>
          <select
            value={incumbentProvider}
            onChange={(e) => setIncumbentProvider(e.target.value)}
            style={{ ...selectBase, border: `1px solid ${t.rose}30` }}
          >
            {optgroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* 6 numeric params */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginTop: 14 }}>
          {numericParams.map((p) => (
            <div key={p.label}>
              <div style={labelStyle}>{p.label}</div>
              <input
                type="number"
                value={p.value}
                onChange={(e) => p.set(Math.max(0, parseInt(e.target.value) || 0))}
                style={numericInputStyle}
              />
            </div>
          ))}
        </div>

        {/* CPE + EnvisionEDGE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <div>
            <div style={labelStyle}>Incumbent CPE Complexity</div>
            <select
              value={cpeComplexity}
              onChange={(e) => setCpeComplexity(e.target.value)}
              style={{ ...selectBase, border: `1px solid ${t.rose}20` }}
            >
              {Object.entries(CPE_COMPLEXITY).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 6 }}>
              {CPE_COMPLEXITY[cpeComplexity].desc} &mdash;{" "}
              <span style={{ color: t.rose }}>${incCpePerSite}/site/mo</span>
            </div>
          </div>
          <div>
            <div style={labelStyle}>GTT EnvisionEDGE Tier</div>
            <select
              value={envisionTier}
              onChange={(e) => setEnvisionTier(e.target.value)}
              style={{ ...selectBase, border: `1px solid ${t.emerald}20` }}
            >
              {Object.entries(ENVISION_TIERS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 6 }}>
              {ENVISION_TIERS[envisionTier].desc}
            </div>
          </div>
        </div>

        {/* GTT Benchmark toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <span style={{ fontSize: 11, color: t.textDim }}>GTT Benchmark:</span>
          {(["low", "avg", "high"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setTcoBenchmark(b)}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: t.fontM,
                background: tcoBenchmark === b ? `${t.emerald}15` : t.bgGlass,
                color: tcoBenchmark === b ? t.emerald : t.textMuted,
              }}
            >
              {b}
            </button>
          ))}
          <span style={{ fontSize: 10, color: t.textDim }}>
            ({incumbentProvider.split(" ")[0]} always priced at &lsquo;high&rsquo;)
          </span>
        </div>
      </GlassCard>

      {/* ── Card 2 — Pricing Tiers Reference ────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Incumbent tiers */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: t.rose,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: t.rose }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: t.fontD, color: t.text }}>
              {incName} Pricing Tiers
            </span>
            <span
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: 4,
                fontFamily: t.fontM,
                background: `${t.rose}15`,
                color: t.rose,
              }}
            >
              per site/mo
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {incTiers.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: t.bgGlass,
                }}
              >
                <span style={{ fontSize: 12, color: t.textMuted }}>{row.label}</span>
                <span style={{ fontFamily: t.fontM }}>
                  <span style={{ fontSize: 11, color: t.textDim }}>{fmtRange(row.arr)} </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.rose }}>
                    {fmtMid(row.arr)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* GTT tiers */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: t.emerald,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: t.emerald }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: t.fontD, color: t.text }}>
              GTT Pricing Tiers
            </span>
            <span
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: 4,
                fontFamily: t.fontM,
                background: `${t.emerald}15`,
                color: t.emerald,
              }}
            >
              per site/mo
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {gttTiers.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: t.bgGlass,
                }}
              >
                <span style={{ fontSize: 12, color: t.textMuted }}>{row.label}</span>
                <span style={{ fontFamily: t.fontM }}>
                  <span style={{ fontSize: 11, color: t.textDim }}>{fmtRange(row.arr)} </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.emerald }}>
                    {fmtMid(row.arr)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
};
