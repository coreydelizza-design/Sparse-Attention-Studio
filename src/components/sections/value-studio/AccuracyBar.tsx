/* ──────────────────────────────────────────────────────────────
   AccuracyBar – AI accuracy feedback widget (1-5 rating)
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { useTheme } from "../../../theme/useTheme";

interface AccuracyBarProps {
  tab: string;
  accuracyRatings: Record<string, number> | null;
  rateAccuracy: ((tab: string, value: number) => void) | null;
}

export const AccuracyBar: React.FC<AccuracyBarProps> = ({
  tab,
  accuracyRatings,
  rateAccuracy,
}) => {
  const { t } = useTheme();
  const rating = accuracyRatings?.[tab];

  const labels = [
    { value: 1, label: "Not Accurate", color: t.rose },
    { value: 2, label: "Needs Work", color: t.amber },
    { value: 3, label: "Acceptable", color: t.amber },
    { value: 4, label: "Accurate", color: t.emerald },
    { value: 5, label: "Highly Accurate", color: t.emerald },
  ];

  const matched = labels.find((l) => l.value === rating);

  return (
    <div
      style={{
        marginTop: 20,
        padding: "14px 18px",
        borderRadius: 10,
        background: t.bgGlass,
        border: `1px solid ${t.borderSubtle}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: t.textDim,
            }}
          >
            AI Accuracy Spot Check
          </span>
          <span
            style={{
              fontSize: 9,
              padding: "1px 6px",
              borderRadius: 3,
              fontFamily: t.fontM,
              background: `${t.cyan}15`,
              color: t.cyan,
            }}
          >
            feedback
          </span>
        </div>

        {rating != null && matched && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              fontFamily: t.fontM,
              color: matched.color,
            }}
          >
            {matched.label} ({rating}/5)
          </span>
        )}
      </div>

      {/* Rating buttons */}
      <div style={{ display: "flex", gap: 6 }}>
        {labels.map((l) => (
          <button
            key={l.value}
            onClick={() => rateAccuracy?.(tab, l.value)}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: t.fontM,
              ...(rating === l.value
                ? {
                    background: `${l.color}22`,
                    color: l.color,
                    outline: `1px solid ${l.color}44`,
                  }
                : {
                    background: t.bgGlass,
                    color: t.textDim,
                  }),
            }}
          >
            {l.value}
          </button>
        ))}
      </div>
    </div>
  );
};
