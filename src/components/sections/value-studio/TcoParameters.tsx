/* ──────────────────────────────────────────────────────────────
   TcoParameters – Side-by-side incumbent vs GTT configuration.
   Mirrored columns: every field on the left has a counterpart
   on the right for direct comparison.
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
  const gttCpePerSite = ENVISION_TIERS[envisionTier].price;
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

  /* ── Shared column header ─────────────────────────────── */
  const colHeader = (label: string, color: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: t.fontD, color: t.text }}>
        {label}
      </span>
    </div>
  );

  /* ── Tier row renderer ────────────────────────────────── */
  const tierRow = (row: { label: string; arr: number[] }, accentColor: string) => (
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
        <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>{fmtMid(row.arr)}</span>
      </span>
    </div>
  );

  return (
    <>
      {/* ── Shared Parameters (full width) ──────────────── */}
      <GlassCard>
        <SectionHeader tag="SHARED" sub="Applied to both sides">
          Global Parameters
        </SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <div>
            <div style={labelStyle}>Total Sites</div>
            <input
              type="number"
              value={tcoSiteCount}
              onChange={(e) => setTcoSiteCount(Math.max(0, parseInt(e.target.value) || 0))}
              style={numericInputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>Contract Term (months)</div>
            <input
              type="number"
              value={tcoTermMonths}
              onChange={(e) => setTcoTermMonths(Math.max(0, parseInt(e.target.value) || 0))}
              style={numericInputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>Redundancy %</div>
            <input
              type="number"
              value={tcoRedundancy}
              onChange={(e) => setTcoRedundancy(Math.max(0, parseInt(e.target.value) || 0))}
              style={numericInputStyle}
            />
          </div>
        </div>
      </GlassCard>

      {/* ── Side-by-Side Configuration ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* ── LEFT: Incumbent ────────────────────────────── */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.rose }} />
          {colHeader(`${incName} (Incumbent)`, t.rose)}

          {/* Provider */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Provider</div>
            <select
              value={incumbentProvider}
              onChange={(e) => setIncumbentProvider(e.target.value)}
              style={{ ...selectBase, border: `1px solid ${t.rose}30` }}
            >
              {optgroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.items.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Benchmark */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Pricing Benchmark</div>
            <div
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                background: t.bgGlass,
                border: `1px solid ${t.rose}20`,
                fontSize: 12,
                fontFamily: t.fontM,
                color: t.rose,
                fontWeight: 600,
              }}
            >
              High (top quartile) &mdash; fixed
            </div>
          </div>

          {/* CPE Complexity */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>CPE / Edge Complexity</div>
            <select
              value={cpeComplexity}
              onChange={(e) => setCpeComplexity(e.target.value)}
              style={{ ...selectBase, border: `1px solid ${t.rose}20` }}
            >
              {Object.entries(CPE_COMPLEXITY).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 6 }}>
              {CPE_COMPLEXITY[cpeComplexity].desc} &mdash;{" "}
              <span style={{ color: t.rose, fontWeight: 600 }}>${incCpePerSite}/site/mo</span>
            </div>
          </div>

          {/* Numeric params */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={labelStyle}>Managed Svc $/site</div>
              <input
                type="number"
                value={tcoManagedPerSite}
                onChange={(e) => setTcoManagedPerSite(Math.max(0, parseInt(e.target.value) || 0))}
                style={numericInputStyle}
              />
            </div>
            <div>
              <div style={labelStyle}>One-Time Costs</div>
              <input
                type="number"
                value={tcoOneTimeInc}
                onChange={(e) => setTcoOneTimeInc(Math.max(0, parseInt(e.target.value) || 0))}
                style={numericInputStyle}
              />
            </div>
          </div>
        </GlassCard>

        {/* ── RIGHT: GTT ─────────────────────────────────── */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.emerald }} />
          {colHeader("GTT (Proposed)", t.emerald)}

          {/* Provider (fixed) */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Provider</div>
            <div
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                background: t.bgGlass,
                border: `1px solid ${t.emerald}30`,
                fontSize: 13,
                fontFamily: t.fontD,
                color: t.emerald,
                fontWeight: 600,
              }}
            >
              GTT Communications
            </div>
          </div>

          {/* Benchmark */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Pricing Benchmark</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["low", "avg", "high"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setTcoBenchmark(b)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: t.fontM,
                    background: tcoBenchmark === b ? `${t.emerald}15` : t.bgGlass,
                    color: tcoBenchmark === b ? t.emerald : t.textMuted,
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* EnvisionEDGE Tier */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>CPE / Edge (EnvisionEDGE)</div>
            <select
              value={envisionTier}
              onChange={(e) => setEnvisionTier(e.target.value)}
              style={{ ...selectBase, border: `1px solid ${t.emerald}20` }}
            >
              {Object.entries(ENVISION_TIERS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 6 }}>
              {ENVISION_TIERS[envisionTier].desc} &mdash;{" "}
              <span style={{ color: t.emerald, fontWeight: 600 }}>${gttCpePerSite}/site/mo</span>
            </div>
          </div>

          {/* Numeric params (mirrored) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={labelStyle}>Managed Svc $/site</div>
              <div
                style={{
                  ...numericInputStyle,
                  background: t.bgGlass,
                  color: t.textMuted,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ${tcoManagedPerSite}
                <span style={{ fontSize: 9, color: t.textDim, marginLeft: 4 }}>(shared)</span>
              </div>
            </div>
            <div>
              <div style={labelStyle}>One-Time Costs</div>
              <input
                type="number"
                value={tcoOneTimeGtt}
                onChange={(e) => setTcoOneTimeGtt(Math.max(0, parseInt(e.target.value) || 0))}
                style={numericInputStyle}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Side-by-Side Pricing Tiers ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Incumbent tiers */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.rose }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: t.rose }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: t.fontD, color: t.text }}>
              {incName} Pricing Tiers
            </span>
            <span
              style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 4, fontFamily: t.fontM,
                background: `${t.rose}15`, color: t.rose,
              }}
            >
              per site/mo
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {incTiers.map((row) => tierRow(row, t.rose))}
          </div>
        </GlassCard>

        {/* GTT tiers */}
        <GlassCard style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.emerald }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: t.emerald }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: t.fontD, color: t.text }}>
              GTT Pricing Tiers
            </span>
            <span
              style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 4, fontFamily: t.fontM,
                background: `${t.emerald}15`, color: t.emerald,
              }}
            >
              per site/mo
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {gttTiers.map((row) => tierRow(row, t.emerald))}
          </div>
        </GlassCard>
      </div>
    </>
  );
};
