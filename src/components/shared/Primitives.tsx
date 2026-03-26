/* ──────────────────────────────────────────────────────────────
   Primitives – Shared presentational components for studios.
   Thin wrappers using the NTS theme system.
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { useTheme } from "../../theme/useTheme";

/* ── GlassCard ────────────────────────────────────────────── */

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  const { t } = useTheme();
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ── SectionHeader ────────────────────────────────────────── */

interface SectionHeaderProps {
  children: React.ReactNode;
  tag?: string;
  sub?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children, tag, sub }) => {
  const { t } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {tag && (
          <span
            style={{
              fontSize: 9,
              padding: "2px 8px",
              borderRadius: 4,
              fontFamily: t.fontM,
              background: `${t.cyan}15`,
              color: t.cyan,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {tag}
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: t.fontD }}>
          {children}
        </span>
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: t.textDim, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
};

/* ── PageHeader ───────────────────────────────────────────── */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  phase?: string;
  accent?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, phase, accent }) => {
  const { t } = useTheme();
  const accentColor = accent || t.cyan;
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: t.text, fontFamily: t.fontD }}>
          {title}
        </span>
        {phase && (
          <span
            style={{
              fontSize: 9,
              padding: "2px 8px",
              borderRadius: 4,
              fontFamily: t.fontM,
              background: `${accentColor}15`,
              color: accentColor,
              fontWeight: 600,
            }}
          >
            PHASE {phase}
          </span>
        )}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: t.textDim, marginTop: 4, lineHeight: 1.5 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

/* ── Chip ─────────────────────────────────────────────────── */

interface ChipProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export const Chip: React.FC<ChipProps> = ({ children, color, style }) => {
  const { t } = useTheme();
  const c = color || t.cyan;
  return (
    <span
      style={{
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 4,
        fontFamily: t.fontM,
        background: `${c}15`,
        color: c,
        fontWeight: 600,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/* ── Mono ─────────────────────────────────────────────────── */

interface MonoProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export const Mono: React.FC<MonoProps> = ({ children, color, style }) => {
  const { t } = useTheme();
  return (
    <span
      style={{
        fontFamily: t.fontM,
        color: color || t.text,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
