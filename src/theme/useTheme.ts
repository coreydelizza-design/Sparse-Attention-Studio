/* ──────────────────────────────────────────────────────────────
   useTheme – Bridges the Value Studio theme tokens to the
   existing NTS token system (T in tokens.js).
   ────────────────────────────────────────────────────────────── */

import { T } from "../tokens";

const theme = {
  // Backgrounds
  bg: T.bg,
  bgGlass: "rgba(255,255,255,0.65)",
  card: T.card,
  sidebar: T.sidebar,
  sidebarActive: T.sidebarActive,

  // Text
  text: T.tp,
  textMuted: T.ts,
  textDim: T.td,

  // Borders
  border: T.border,
  borderSubtle: "rgba(0,0,0,0.06)",

  // Colors
  cyan: T.cyan,
  emerald: T.green,
  blue: T.blue,
  amber: T.amber,
  rose: T.red,
  violet: T.violet,
  teal: T.teal,
  slate: T.slate,

  // Fonts
  fontD: T.f,
  fontM: T.m,
} as const;

export type Theme = typeof theme;

export function useTheme() {
  return { t: theme };
}
