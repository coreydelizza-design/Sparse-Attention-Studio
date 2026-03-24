/* ═══════════════════════════════════════
   GTT Network Transformation Studio
   Design Tokens & Constants
   ═══════════════════════════════════════ */

export const T = {
  bg: '#f5f6f9',
  sidebar: '#0d1320',
  sidebarActive: '#1e293b',
  card: '#ffffff',
  border: '#eaecf0',
  tp: '#1a2035',      // text primary
  ts: '#64748b',      // text secondary
  td: '#94a3b8',      // text dim
  cyan: '#06b6d4',
  green: '#16a34a',
  blue: '#2563eb',
  amber: '#d97706',
  red: '#dc2626',
  violet: '#7c3aed',
  teal: '#0d9488',
  slate: '#64748b',
  f: "'DM Sans', sans-serif",
  m: "'DM Mono', monospace",
};

export const STATUS_META = {
  complete: { color: T.green, bg: '#f0fdf4', dot: '●', label: 'Complete' },
  'in-progress': { color: T.amber, bg: '#fffbeb', dot: '◐', label: 'In Progress' },
  'not-started': { color: T.td, bg: '#f8fafc', dot: '○', label: 'Not Started' },
  blocked: { color: T.red, bg: '#fef2f2', dot: '✕', label: 'Blocked' },
  active: { color: T.blue, bg: '#eff6ff', dot: '◫', label: 'Active' },
};

export const SECTIONS = [
  { id: 'command', label: 'Command Center', icon: '⊞', phase: null, status: 'active', pct: null, desc: 'Workshop overview', color: T.cyan },
  { id: 'roles', label: 'Roles & Attendees', icon: '◎', phase: null, status: 'in-progress', pct: null, desc: 'Workshop participants & responsibilities', color: T.cyan },
  { id: 'executive', label: 'Executive Context', icon: '◈', phase: 1, status: 'complete', pct: 100, desc: 'Business objectives & strategy', color: T.green },
  { id: 'current', label: 'Current - Estate / Infrastructure', icon: '▦', phase: 2, status: 'complete', pct: 92, desc: 'Footprint, WAN, providers, contracts', color: T.blue },
  { id: 'network', label: 'Network Transformation', icon: '◉', phase: 3, status: 'in-progress', pct: 72, desc: 'SD-WAN, branch, performance', color: T.blue },
  { id: 'security', label: 'Security Transformation', icon: '◆', phase: 4, status: 'in-progress', pct: 58, desc: 'SASE, zero trust, compliance', color: T.red },
  { id: 'cloud', label: 'Cloud Transformation', icon: '◇', phase: 5, status: 'in-progress', pct: 45, desc: 'Multi-cloud, migration, edge', color: T.violet },
  { id: 'future', label: 'Future-State Blueprint', icon: '◬', phase: 6, status: 'not-started', pct: 20, desc: 'Target architecture', color: T.teal },
  { id: 'value', label: 'Value & Tradeoffs', icon: '◪', phase: null, status: 'not-started', pct: 10, desc: 'TCO/ROI analysis', color: T.slate },
  { id: 'roadmap', label: 'Transformation Roadmap', icon: '▷', phase: 7, status: 'not-started', pct: 15, desc: 'Phases & dependencies', color: T.slate },
  { id: 'deliver', label: 'Workshop Deliverables', icon: '◱', phase: 8, status: 'not-started', pct: 20, desc: 'Outputs & artifacts', color: T.violet },
];

/* Shared inline style bases */
export const inputStyle = {
  fontFamily: T.f, fontSize: 13, color: T.tp,
  border: `1px solid ${T.border}`, borderRadius: 6,
  padding: '8px 10px', background: '#fff',
  boxSizing: 'border-box', width: '100%',
};

export const selectStyle = {
  fontFamily: T.f, fontSize: 12, color: T.tp,
  border: `1px solid ${T.border}`, borderRadius: 6,
  padding: '4px 8px', background: '#fff', cursor: 'pointer',
};

export const smallInputStyle = {
  fontFamily: T.f, fontSize: 12, color: T.tp,
  border: `1px solid ${T.border}`, borderRadius: 6,
  padding: '4px 8px', background: '#fff', boxSizing: 'border-box',
};

export const labelStyle = {
  fontFamily: T.f, fontSize: 11, fontWeight: 500,
  color: T.td, marginBottom: 4, display: 'block',
};
