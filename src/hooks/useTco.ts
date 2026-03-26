/* ──────────────────────────────────────────────────────────────
   useTco – TCO / Value-Studio calculator hook
   Unified like-for-like comparison: same categories both sides.
   ────────────────────────────────────────────────────────────── */

import { useState, useMemo } from "react";
import {
  getProviderRates,
  GTT_RATES,
  CPE_COMPLEXITY,
  ENVISION_TIERS,
  UNIFIED_ACCESS_TYPES,
  speedMultiplier,
} from "../data/tco";

// ── Types ────────────────────────────────────────────────────

export interface MixItem {
  id: string;
  accessType: string;
  speed: number;
  qty: number;
}

export interface StackLine {
  label: string;
  monthly: number;
}

export interface Stack {
  lines: StackLine[];
  mrr: number;
}

// ── Internal helpers ─────────────────────────────────────────

let _mixId = 0;
const nextId = (): string => `mix_${++_mixId}`;

// ── Label map for line-item display ──────────────────────────

const LABEL_MAP: Record<string, string> = {};
for (const at of UNIFIED_ACCESS_TYPES) {
  LABEL_MAP[at.value] = at.label;
}

// ── Default mix (identical both sides) ───────────────────────

const DEFAULT_MIX: MixItem[] = [
  { id: nextId(), accessType: "mpls", speed: 100, qty: 10 },
  { id: nextId(), accessType: "sdwan", speed: 200, qty: 10 },
  { id: nextId(), accessType: "dia", speed: 100, qty: 5 },
  { id: nextId(), accessType: "security", speed: 0, qty: 25 },
  { id: nextId(), accessType: "cpe", speed: 0, qty: 25 },
];

const cloneMix = (): MixItem[] => DEFAULT_MIX.map((m) => ({ ...m, id: nextId() }));

// ── Hook ─────────────────────────────────────────────────────

export default function useTco() {
  // ── State ────────────────────────────────────────────────

  const [tcoSiteCount, setTcoSiteCount] = useState<number>(25);
  const [tcoTermMonths, setTcoTermMonths] = useState<number>(36);
  const [tcoBenchmark, setTcoBenchmark] = useState<string>("avg");
  const [tcoManagedPerSite, setTcoManagedPerSite] = useState<number>(100);
  const [tcoOneTimeInc, setTcoOneTimeInc] = useState<number>(50000);
  const [tcoOneTimeGtt, setTcoOneTimeGtt] = useState<number>(25000);
  const [tcoRedundancy, setTcoRedundancy] = useState<number>(10);
  const [cpeComplexity, setCpeComplexity] = useState<string>("standard");
  const [envisionTier, setEnvisionTier] = useState<string>("professional");
  const [incumbentMix, setIncumbentMix] = useState<MixItem[]>(cloneMix);
  const [incumbentProvider, setIncumbentProvider] = useState<string>("AT&T");
  const [proposedMix, setProposedMix] = useState<MixItem[]>(cloneMix);

  // ── Format helper ────────────────────────────────────────

  const fmtK = (n: number | null): string => {
    if (n === null) return "$0";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
    return `${sign}$${abs.toLocaleString()}`;
  };

  // ── Mix-item helpers ─────────────────────────────────────

  const addMixItem = (
    mix: MixItem[],
    setMix: React.Dispatch<React.SetStateAction<MixItem[]>>,
    accessType: string,
    speed: number,
    qty: number,
  ): void => {
    setMix([...mix, { id: nextId(), accessType, speed, qty }]);
  };

  const removeMixItem = (
    mix: MixItem[],
    setMix: React.Dispatch<React.SetStateAction<MixItem[]>>,
    index: number,
  ): void => {
    setMix(mix.filter((_, i) => i !== index));
  };

  const updateMixItem = (
    mix: MixItem[],
    setMix: React.Dispatch<React.SetStateAction<MixItem[]>>,
    index: number,
    field: string,
    value: unknown,
  ): void => {
    setMix(mix.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  // ── Unit-price calculators ───────────────────────────────

  const getIncumbentUnitPrice = (
    accessType: string,
    speed: number,
    _benchmark: string,
  ): number => {
    const rates = getProviderRates(incumbentProvider);
    let base: number;
    let multiplier = 1;

    switch (accessType) {
      case "mpls":        base = rates.mpls[2]; break;
      case "sdwan":       base = rates.sdwan[2]; break;
      case "dia":         base = rates.circuit[2]; break;
      case "broadband":   base = rates.circuit[2]; multiplier = 0.6; break;
      case "p2p":         base = rates.circuit[2]; multiplier = 1.3; break;
      case "wavelength":  base = rates.circuit[2]; multiplier = 4.0; break;
      case "security":    base = rates.security[2]; break;
      case "managed_svc": base = tcoManagedPerSite; break;
      case "cpe":         base = rates.cpe[2]; break;
      default:            base = rates.circuit[2]; break;
    }

    if (speed <= 0) return Math.round(base * multiplier);
    return Math.round(base * multiplier * speedMultiplier(speed));
  };

  const getGttUnitPrice = (
    accessType: string,
    speed: number,
    benchmark: string,
  ): number => {
    const bIdx = benchmark === "low" ? 0 : benchmark === "high" ? 2 : 1;
    const rateArr = GTT_RATES[accessType] || GTT_RATES.dia;
    const base = rateArr[bIdx];

    if (speed <= 0) return base;
    return Math.round(base * speedMultiplier(speed));
  };

  // ── CPE pricing (for consolidation savings section) ──────

  const incCpePerSite = useMemo<number>(() => {
    const rates = getProviderRates(incumbentProvider);
    const cpe = rates.cpe;
    if (cpeComplexity === "basic") return cpe[0];
    if (cpeComplexity === "complex") return Math.round(cpe[2] * 1.25);
    return cpe[1]; // standard
  }, [incumbentProvider, cpeComplexity]);

  const gttCpePerSite = ENVISION_TIERS[envisionTier].price;

  const cpeSavingsPerSite = incCpePerSite - gttCpePerSite;
  const cpeSavingsMonthly = cpeSavingsPerSite * tcoSiteCount;
  const cpeSavingsAnnual = cpeSavingsMonthly * 12;

  // ── Line-item label helper ───────────────────────────────

  const buildLabel = (item: MixItem, unitPrice: number): string => {
    const name = LABEL_MAP[item.accessType] || item.accessType.toUpperCase();
    if (item.speed <= 0) {
      return `${name} × ${item.qty} @ $${unitPrice}/site`;
    }
    const speedStr = item.speed >= 1000 ? `${item.speed / 1000}G` : `${item.speed}M`;
    return `${name} ${speedStr} × ${item.qty} @ $${unitPrice}/mo`;
  };

  // ── Incumbent stack ──────────────────────────────────────

  const incStack = useMemo<Stack>(() => {
    const lines: StackLine[] = [];

    for (const item of incumbentMix) {
      const unit = getIncumbentUnitPrice(item.accessType, item.speed, "high");
      const monthly = unit * item.qty;
      lines.push({ label: buildLabel(item, unit), monthly });
    }

    const baseMrr = lines.reduce((s, l) => s + l.monthly, 0);

    if (tcoRedundancy > 0) {
      const redundancyCost = Math.round(baseMrr * (tcoRedundancy / 100));
      lines.push({
        label: `Redundancy / HA (+${tcoRedundancy}%)`,
        monthly: redundancyCost,
      });
    }

    const mrr = lines.reduce((s, l) => s + l.monthly, 0);
    return { lines, mrr };
  }, [incumbentMix, tcoSiteCount, tcoRedundancy, incumbentProvider, cpeComplexity, tcoManagedPerSite]);

  // ── GTT stack ────────────────────────────────────────────

  const gttStack = useMemo<Stack>(() => {
    const lines: StackLine[] = [];

    for (const item of proposedMix) {
      const unit = getGttUnitPrice(item.accessType, item.speed, tcoBenchmark);
      const monthly = unit * item.qty;
      lines.push({ label: buildLabel(item, unit), monthly });
    }

    const baseMrr = lines.reduce((s, l) => s + l.monthly, 0);

    if (tcoRedundancy > 0) {
      const redundancyCost = Math.round(baseMrr * (tcoRedundancy / 100));
      lines.push({
        label: `Redundancy / HA (+${tcoRedundancy}%)`,
        monthly: redundancyCost,
      });
    }

    const mrr = lines.reduce((s, l) => s + l.monthly, 0);
    return { lines, mrr };
  }, [proposedMix, tcoSiteCount, tcoRedundancy, tcoBenchmark, envisionTier, tcoManagedPerSite]);

  // ── TCO totals ───────────────────────────────────────────

  const incTco = incStack.mrr * tcoTermMonths + tcoOneTimeInc;
  const gttTco = gttStack.mrr * tcoTermMonths + tcoOneTimeGtt;
  const mrrSavings = incStack.mrr - gttStack.mrr;
  const tcoSavingsVal = incTco - gttTco;
  const mrrSavingsPct = incStack.mrr > 0 ? Math.round((mrrSavings / incStack.mrr) * 100) : 0;
  const tcoSavingsPct = incTco > 0 ? Math.round((tcoSavingsVal / incTco) * 100) : 0;

  // ── Bandwidth ────────────────────────────────────────────

  const incMaxSpeed = incumbentMix.reduce((m, i) => Math.max(m, i.speed), 0);
  const gttMaxSpeed = proposedMix.reduce((m, i) => Math.max(m, i.speed), 0);
  const bwUplift = incMaxSpeed > 0 ? Math.round(((gttMaxSpeed - incMaxSpeed) / incMaxSpeed) * 100) : 0;

  // ── Payback ──────────────────────────────────────────────

  const paybackMonths = useMemo<number | null>(() => {
    if (tcoOneTimeGtt <= 0 || mrrSavings <= 0) return null;
    const netOneTime = tcoOneTimeGtt - tcoOneTimeInc;
    if (netOneTime <= 0) return 0;
    return Math.ceil(netOneTime / mrrSavings);
  }, [tcoOneTimeGtt, tcoOneTimeInc, mrrSavings]);

  // ── Confidence ───────────────────────────────────────────

  const confidence = useMemo<string>(() => {
    const hasItems = incumbentMix.length >= 2 && proposedMix.length >= 2;
    const hasSites = tcoSiteCount >= 5;
    const hasReasonableTerm = tcoTermMonths >= 12;
    return hasItems && hasSites && hasReasonableTerm ? "high" : "medium";
  }, [incumbentMix, proposedMix, tcoSiteCount, tcoTermMonths]);

  // ── Return ───────────────────────────────────────────────

  return {
    // State
    tcoSiteCount,
    setTcoSiteCount,
    tcoTermMonths,
    setTcoTermMonths,
    tcoBenchmark,
    setTcoBenchmark,
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
    incumbentMix,
    setIncumbentMix,
    incumbentProvider,
    setIncumbentProvider,
    proposedMix,
    setProposedMix,

    // Helpers
    fmtK,
    addMixItem,
    removeMixItem,
    updateMixItem,
    getIncumbentUnitPrice,
    getGttUnitPrice,

    // CPE
    incCpePerSite,
    gttCpePerSite,
    cpeSavingsPerSite,
    cpeSavingsMonthly,
    cpeSavingsAnnual,

    // Stacks
    incStack,
    gttStack,

    // TCO totals
    incTco,
    gttTco,
    mrrSavings,
    tcoSavingsVal,
    mrrSavingsPct,
    tcoSavingsPct,

    // Bandwidth
    incMaxSpeed,
    gttMaxSpeed,
    bwUplift,

    // Payback & confidence
    paybackMonths,
    confidence,
  };
}
