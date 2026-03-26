/* ──────────────────────────────────────────────────────────────
   MixBuilder – Unified service line-item builder.
   Both sides use the same UNIFIED_ACCESS_TYPES dropdown.
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { useTheme } from "../../../theme/useTheme";
import { UNIFIED_ACCESS_TYPES } from "../../../data/tco";

interface MixItem {
  id: string;
  accessType: string;
  speed: number;
  qty: number;
}

interface MixBuilderProps {
  title: string;
  subtitle: string;
  color: string;
  mix: MixItem[];
  setMix: React.Dispatch<React.SetStateAction<MixItem[]>>;
  benchmark: string;
  tcoFns: {
    getUnitPrice: (accessType: string, speed: number, benchmark: string) => number;
    addMixItem: (mix: MixItem[], setMix: any, accessType: string, speed: number, qty: number) => void;
    removeMixItem: (mix: MixItem[], setMix: any, index: number) => void;
    updateMixItem: (mix: MixItem[], setMix: any, index: number, field: string, value: any) => void;
  };
  mrr: number;
  onMirror?: () => void;
}

const fmtK = (n: number): string => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${abs}`;
};

export const MixBuilder: React.FC<MixBuilderProps> = ({
  title,
  subtitle,
  color,
  mix,
  setMix,
  benchmark,
  tcoFns,
  mrr,
  onMirror,
}) => {
  const { t } = useTheme();
  const { getUnitPrice, addMixItem, removeMixItem, updateMixItem } = tcoFns;
  const accessTypes = UNIFIED_ACCESS_TYPES;

  const selectStyle: React.CSSProperties = {
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 6,
    padding: "6px 8px",
    fontSize: 11,
    fontFamily: t.fontD,
    width: "100%",
  };

  const colHeaders = ["Service", "Speed", "Sites/Qty", "$/mo", ""];

  return (
    <div
      style={{
        background: t.bgGlass,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: 18,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: color,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: t.fontD, color: t.text }}>
            {title}
          </span>
          <span
            style={{
              fontSize: 9,
              padding: "2px 8px",
              borderRadius: 4,
              fontFamily: t.fontM,
              background: `${color}15`,
              color,
            }}
          >
            {subtitle}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onMirror && (
            <button
              onClick={onMirror}
              title="Copy this config to the other side"
              style={{
                background: "none",
                border: `1px dashed ${t.cyan}44`,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 10,
                fontFamily: t.fontM,
                color: t.cyan,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {"\uD83D\uDCCB"} Copy config
            </button>
          )}
          <span style={{ fontSize: 16, fontWeight: 700, color, fontFamily: t.fontM }}>
            {fmtK(mrr)}/mo
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 90px 60px 80px 28px",
          gap: 8,
          padding: "0 10px",
          marginBottom: 6,
        }}
      >
        {colHeaders.map((h, i) => (
          <span
            key={h || i}
            style={{
              fontSize: 9,
              color: t.textDim,
              fontFamily: t.fontM,
              ...(i === colHeaders.length - 1 ? { textAlign: "right" as const } : {}),
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Mix items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {mix.map((item, idx) => {
          const at = accessTypes.find((a) => a.value === item.accessType);
          const speeds = at?.speeds || [100];
          const isFlatRate = speeds.length === 1 && speeds[0] === 0;
          const unitPrice = getUnitPrice(item.accessType, item.speed, benchmark);
          const lineTotal = unitPrice * item.qty;

          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 60px 80px 28px",
                gap: 8,
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: 8,
                background: t.bgGlass,
                border: `1px solid ${t.borderSubtle}`,
              }}
            >
              {/* Service Type */}
              <select
                value={item.accessType}
                onChange={(e) => {
                  const newAt = accessTypes.find((a) => a.value === e.target.value);
                  const newSpeeds = newAt?.speeds || [100];
                  const newIsFlatRate = newSpeeds.length === 1 && newSpeeds[0] === 0;
                  updateMixItem(mix, setMix, idx, "accessType", e.target.value);
                  if (newIsFlatRate) {
                    updateMixItem(mix, setMix, idx, "speed", 0);
                  } else if (item.speed === 0) {
                    updateMixItem(mix, setMix, idx, "speed", newSpeeds[Math.min(3, newSpeeds.length - 1)]);
                  }
                }}
                style={selectStyle}
              >
                {accessTypes.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>

              {/* Speed or Flat Rate indicator */}
              {isFlatRate ? (
                <span
                  style={{
                    fontSize: 10,
                    color: t.textDim,
                    fontFamily: t.fontM,
                    textAlign: "center",
                  }}
                >
                  per site
                </span>
              ) : (
                <select
                  value={item.speed}
                  onChange={(e) => updateMixItem(mix, setMix, idx, "speed", parseInt(e.target.value))}
                  style={{ ...selectStyle, fontFamily: t.fontM }}
                >
                  {speeds.map((s) => (
                    <option key={s} value={s}>
                      {s >= 1000 ? `${s / 1000}G` : `${s}M`}
                    </option>
                  ))}
                </select>
              )}

              {/* Qty */}
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) =>
                  updateMixItem(mix, setMix, idx, "qty", Math.max(1, parseInt(e.target.value) || 1))
                }
                style={{
                  background: t.bg,
                  color: t.text,
                  border: `1px solid ${t.border}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontSize: 11,
                  textAlign: "center",
                  fontFamily: t.fontM,
                  width: "100%",
                }}
              />

              {/* Line total */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color,
                  fontFamily: t.fontM,
                  textAlign: "right",
                }}
              >
                ${lineTotal.toLocaleString()}
              </span>

              {/* Remove */}
              <button
                onClick={() => removeMixItem(mix, setMix, idx)}
                style={{
                  background: "none",
                  border: "none",
                  color: t.textDim,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <button
        onClick={() => {
          const firstSpeedBased = accessTypes.find((a) => !(a.speeds.length === 1 && a.speeds[0] === 0));
          const at = firstSpeedBased || accessTypes[0];
          addMixItem(mix, setMix, at.value, at.speeds[Math.min(3, at.speeds.length - 1)] || 100, 1);
        }}
        style={{
          width: "100%",
          padding: "8px 0",
          borderRadius: 8,
          border: `1px dashed ${color}33`,
          background: "transparent",
          color: `${color}88`,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: t.fontM,
          cursor: "pointer",
        }}
      >
        + Add Line Item
      </button>
    </div>
  );
};
